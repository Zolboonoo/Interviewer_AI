document.addEventListener('DOMContentLoaded', () => {
  const audioElements = document.querySelectorAll('generatedAudio');
  const audioPlayer = document.querySelectorAll('audioPlayer');
  const playBtn = document.querySelectorAll('playBtn');

  // Function to update the display of the audio player
  function updateAudioPlayerVisibility() {
    const hasSrc = Array.from(audioElements).some(audio => audio.src);

    if (hasSrc) {
      audioPlayer.style.display = 'flex';
    } else {
      audioPlayer.style.display = 'none';
    }
  }



  // Set up the play button event listeners
  audioElements.forEach(audio => {
    playBtn.addEventListener('click', function () {
      if (audio.src) {
        audio.play().catch(err => console.error('Playback failed:', err));
        // Initial check
        updateAudioPlayerVisibility();
      }
      else {
        console.error('No audio source found');
        audioPlayer.style.display = 'none';
      }
    });
  });

  // Set up MutationObserver to watch for changes to audio elements
  const observer = new MutationObserver(() => {
    updateAudioPlayerVisibility();
  });

  audioElements.forEach(audio => {
    observer.observe(audio, { attributes: true, attributeFilter: ['src'] });
  });

});
