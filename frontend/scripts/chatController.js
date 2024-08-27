document.addEventListener('DOMContentLoaded', () => {
  const messageInput = document.getElementById('message-input');
  const sendButton = document.getElementById('send-button');
  const messagesContainer = document.getElementById('messages');

  // Check textarea have text, then if have enable or not disable button
  handleInputChange();

  function addSentMessage(content) {
    const messageDivCont = document.createElement('div');
    const messageDiv = document.createElement('div');
    messageDivCont.classList.add('user-message');
    messageDiv.classList.add('message-style');
    messageDiv.textContent = content;
    messageDiv.id = 'user';
    messagesContainer.appendChild(messageDivCont);
    messageDivCont.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll to the bottom
  }

  //Click button add message and send to backend server
  sendButton.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message) {
      // show my chat on screen
      addSentMessage(message);
      messageInput.value = '';
    }
    sendButton.disabled = true;
    sendButton.style.backgroundColor = '#676767';

    // funciton send to backend text generate request
    generateReqSender(message)
  });

  messageInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent new line
      sendButton.click();
    }
  });


  // Check textarea have text, then if have enable or not disable button
  function handleInputChange() {
    if (messageInput.value.trim() === '') {
      sendButton.disabled = true;
      sendButton.style.backgroundColor = '#676767';
    } else {
      sendButton.disabled = false;
    }
  }

  // if button hovered change button color
  messageInput.addEventListener('input', handleInputChange);
  sendButton.addEventListener('mouseover', () => {
    if (!sendButton.disabled) {
      sendButton.style.backgroundColor = 'white';
    }
  });

  // when mouse is not hovering btn anymore, then change color back
  sendButton.addEventListener('mouseout', () => {
    if (!sendButton.disabled) {
      sendButton.style.backgroundColor = '#676767';
    }
  });

  async function generateReqSender(writtentext) {
    // var writtentext = document.getElementById("message-input").value;

    // automatically create elements
    const messageDivCont = document.createElement('div');
    const messageDiv = document.createElement('div');
    const message = document.createElement('div');
    const messageIconCont = document.createElement('div');
    const messageIcon = document.createElement('div');

    // audio player
    const audioPlayer = document.createElement('div');
    const playBtn = document.createElement('div');
    const generatedAudio = document.createElement('audio');
    audioPlayer.id = 'audioPlayer';
    playBtn.id = 'playBtn';
    generatedAudio.id = 'generatedAudio';

    // get all text in data showing on screen
    function getChatHistory() {
      const history = [];
      const messageDivs = document.querySelectorAll('#user , #model');

      messageDivs.forEach(div => {
        const role = div.id;
        const textContent = div.textContent.trim();

        entry = { role: role, parts: textContent };
        history.push(entry);

      });
      return history;
    }

    // all history in the screen to text file
    const history = getChatHistory();

    // Show loading animation
    sendButton.textContent = 'stop';
    sendButton.disabled = true;

    try {
      // until get response from server show loading animation
      addReplyMessage();
      const responce = await fetch(`http://127.0.0.1:8000/GenerateReqText`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: writtentext, history: history }),
      });
      if (!responce.ok) {
        throw new Error(`HTTP error! Status: ${responce.status}`);
      }
      const data = await responce.json();
      console.log("Responce", data);

      // when response come from server hide loading animation and show response
      addResponce(data.message);
      // send request to server make audio sst
      handleAudioRequest(data.message);
      console.log("TtT:",data.message);

    } catch (e) {
      console.error("Error sending request:", e);
    } finally {
      // when generated text responsed then send request audio
    }
    sendButton.textContent = 'arrow_upward';


    // show model chat shape on screen
    function addReplyMessage() {

      messageDivCont.classList.add('model-message');
      message.classList.add('loader-upndown');
      messageDiv.classList.add('message-style');
      messageDiv.id = 'model';

      //icon and audio controls
      messageIconCont.classList.add('icon-style');
      messageIcon.classList.add('material-symbols-outlined');
      messageIcon.textContent = 'support_agent';
      audioPlayer.classList.add('audio-player');
      messageIconCont.cursor = 'pointer';
      audioPlayer.classList.add('material-symbols-outlined');
      playBtn.classList.add('material-symbols-outlined');
      generatedAudio.classList.add('generated-audio');

      messageIconCont.appendChild(messageIcon);
      messageDivCont.appendChild(messageIconCont);
      messagesContainer.appendChild(messageDivCont);
      messageDivCont.appendChild(messageDiv);
      messageDiv.appendChild(message);
      messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll to the bottom

      // Add audio controls makeing child of icon container
      messageIconCont.appendChild(audioPlayer);
      audioPlayer.appendChild(playBtn);
      audioPlayer.appendChild(generatedAudio);
    }

    // show responded message on screen
    function addResponce(content) {
      message.textContent = content;
      message.classList.remove('loader-upndown');
    }

    // check that audio file request completed and when it completed then change showable
    async function handleAudioRequest(dataTTS) {
      const audioUrl = await generateReqAudio(dataTTS);

      if (audioUrl) {
        // add audioURL to audio player
        generatedAudio.controls = true;
        generatedAudio.src = audioUrl;
        messageIconCont.appendChild(audioPlayer);
        checkAudioAvailability(audioUrl);
        return audioUrl;
      }
    }

    // mouse over the icon change icon to audio player
    messageIconCont.addEventListener('mouseover', () => {
      audioPlayer.style.display = 'flex';
      messageIcon.style.display = 'none';
      
      // check audio is loaded if it is show playButton or not waiting icon
      if (generatedAudio.src) {
        playBtn.textContent = 'volume_up';
        playBtn.disabled = false;
        messageIconCont.cursor = 'pointer';
        playBtn.style.color = 'white';
        
        playBtn.addEventListener('click', function () {
          generatedAudio.play().catch(err => console.error('Playback failed:', err));
        });
      } else {
        playBtn.textContent = 'hourglass_empty';
        playBtn.disabled = true;
        playBtn.style.color = '#676767';
      }
    });

    messageIconCont.addEventListener('mouseout', () => {
      audioPlayer.style.display = 'none';
      messageIcon.style.display = 'flex';
    });

  };


  // Send audio file generate request to server
  async function generateReqAudio(text) {
    console.log("send TtS:",text);
    try {
      const response = await fetch(`http://127.0.0.1:8000/GenerateReqAudio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: text }),
      })
      // Check if the response is OK
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      // Get the response as an ArrayBuffer
      const arrayBuffer = await response.arrayBuffer();

      // Create a Blob from the ArrayBuffer and generate a URL
      const blob = new Blob([arrayBuffer], { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(blob);

      return audioUrl;

    } catch (e) {
      console.error('Error ---------:', e);
      return null;
    }
  }


});

