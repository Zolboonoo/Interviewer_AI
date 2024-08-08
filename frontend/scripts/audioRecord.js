document.addEventListener('DOMContentLoaded', () => {
  const recordBtn = document.getElementById('recordBtn');
  const sttBtn = document.getElementById('sttBtn'); // Ensure this button is available
  const sendButton = document.getElementById('send-button');
  const audioPlayback = document.getElementById('audioPlayback');
  const timerElement = document.getElementById('timer');
  const textInput = document.getElementById('message-input');
  const recordProgress = document.getElementById('recordProgress');
  const speechToText = document.getElementById('controller-area');
  const sttLoader = document.getElementById('stt-loader');

  let mediaRecorder;
  let audioChunks = [];
  let startTime;
  let timerInterval;
  let audioBlob;
  let fileName;
  let dataText;

  // Check for browser support
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert('MediaDevices API is not supported in this browser.');
    return;
  }

  // Start or stop recording
  recordBtn.addEventListener('click', () => {
    if (recordBtn.classList.contains('recording')) {
      mediaRecorder.stop();
      console.log('Recording stopped');
      recordBtn.classList.remove('recording');
      recordBtn.textContent = 'mic';
      recordProgress.style.display = 'none';
      clearInterval(timerInterval);
      textInput.style.display = 'block';
      speechToText.style.display = 'flex';

    } else {
      startRecording();
      console.log('Recording started');
      recordBtn.classList.add('recording');
      recordBtn.textContent = 'play_arrow';
      startTime = Date.now();
      timerElement.textContent = 0;
      recordProgress.style.display = 'flex';
      textInput.style.display = 'none';
      speechToText.style.display = 'none';

      timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        timerElement.textContent = elapsed;
      }, 1000);
    }
  });

  function startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = event => {
          audioChunks.push(event.data);
        };
        mediaRecorder.onstop = () => {
          audioBlob = new Blob(audioChunks, { type: 'audio/wav' }); // Ensure the MIME type is correct
          console.log('Blob size:', audioBlob.size);
          const audioUrl = URL.createObjectURL(audioBlob);
          audioPlayback.src = audioUrl;

          // Generate a filename with the current date
          const now = new Date();
          const dateString = now.toISOString().replace(/[:.]/g, '-');
          fileName = `audiofile_${dateString}.wav`;

          audioChunks = [];
        };
        mediaRecorder.start();
      })
      .catch(err => {
        console.error('Error accessing media devices.', err);
      });
  }

  sttBtn.addEventListener('click', async () => {
    if (!audioBlob) {
      alert('No audio recorded to send.');
      return;
    }

    const formData = new FormData();
    formData.append('file', audioBlob, fileName);
    sendButton.disabled = true;
    sttLoader.style.display = 'flex';

    try {
      const response = await fetch('http://127.0.0.1:8000/SpeechToText', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Error! Status: ${response.status}`);
      }

      dataText = await response.json();
      console.log('Response:', dataText);
      textInput.textContent = dataText.message;

    } catch (error) {
      console.error('Error sending request:', error);
    } finally {
      speechToText.style.display = 'none';
      sendButton.disabled = false;
      sttLoader.style.display = 'none';
    }
  });
});
