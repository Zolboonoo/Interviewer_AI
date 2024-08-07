// script.js
document.addEventListener('DOMContentLoaded', () => {
  const recordBtn = document.getElementById('recordBtn');
  const audioPlayback = document.getElementById('audioPlayback');
  const timerElement = document.getElementById('timer');
  const textInput = document.getElementById('message-input');
  const recordProgress = document.getElementById('recordProgress');
  const speechToText = document.getElementById('controller-area');

  let mediaRecorder;
  let audioChunks = [];
  let startTime;
  let timerInterval;

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
          const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
          console.log('Blob size:', audioBlob.size);
          const audioUrl = URL.createObjectURL(audioBlob);
          console.log('Audio URL:', audioUrl);
          audioPlayback.src = audioUrl;
          audioChunks = [];
          console.log(audioPlayback.src);
        };
        mediaRecorder.start();
      })
      .catch(err => {
        console.error('Error accessing media devices.', err);
      });
  }
});
