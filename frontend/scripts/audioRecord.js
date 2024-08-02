// script.js
document.addEventListener('DOMContentLoaded', () => {
  const recordBtn = document.getElementById('recordBtn');
  const audioPlayback = document.getElementById('audioPlayback');
  const timerElement = document.getElementById('timer');
  const textInput = document.getElementById('textInput');
  const recordProgress = document.getElementById('recordProgress');

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
      recordBtn.classList.remove('recording');
      recordBtn.textContent = 'mic';
      clearInterval(timerInterval);
      recordProgress.style.display = 'none';
      textInput.style.display = 'block';
      
    } else {
      startRecording();
      recordBtn.classList.add('recording');
      recordBtn.textContent = 'play_arrow';

      startTime = Date.now();
      recordProgress.style.display = 'block';
      textInput.style.display = 'none';
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
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          audioChunks = [];
          const audioUrl = URL.createObjectURL(audioBlob);
          audioPlayback.src = audioUrl;
        };
        mediaRecorder.start();
      })
      .catch(err => {
        console.error('Error accessing media devices.', err);
      });
  }
});
