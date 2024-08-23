document.addEventListener('DOMContentLoaded', () => {
  const messageInput = document.getElementById('message-input');
  const sendButton = document.getElementById('send-button');
  const messagesContainer = document.getElementById('messages');

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
      addSentMessage(message);
      messageInput.value = '';
    }
    sendButton.disabled = true;
    sendButton.style.backgroundColor = '#676767';

    // funciton send to backend text generate request
    generateReqSender()
  });

  messageInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent new line
      sendButton.click();
    }
  });


  // Check textarea have text and disable or enable button
  function handleInputChange() {
    if (messageInput.value.trim() === '') {
      sendButton.disabled = true;
      // console.log('disabled');
      sendButton.style.backgroundColor = '#676767';
    } else {
      sendButton.disabled = false;
      // console.log('enabled');
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

  handleInputChange();
});


async function generateReqSender() {
  var writtentext = document.getElementById("message-input").value;
  const messagesContainer = document.getElementById('messages');
  const sendButton = document.getElementById('send-button');

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

  // get all data showing on screen
  function getChatHistory() {
    const history = [];
    const messageDivs = document.querySelectorAll('#user , #model');

    messageDivs.forEach(div => {
      const role = div.id;
      const textContent = div.textContent.trim();

      entry = { role: role, parts: textContent };
      history.push(entry);
      // entry.parts.push(textContent);

    });
    return history;
  }
  const history = getChatHistory();

  // Show loading animation
  sendButton.textContent = 'stop';
  sendButton.disabled = true;
  try {
    addReplyMessage();
    const responce = await fetch(`http://127.0.0.1:8000/GenerateReqTextTest`, {
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
    addResponce(data.message);
    dataTTS = data.message;
  } catch (e) {
    console.error("Error sending request:", e);
  } finally {
    // when generated text responsed then send request audio
    generatedAudio.src = generateReqAudio(dataTTS);
    checkAudioAvailability(generatedAudio.src);
  }
  sendButton.textContent = 'arrow_upward';
  // until get response from server show loading animation
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
    audioPlayer.style.display = 'none';
    audioPlayer.classList.add('material-symbols-outlined');
    playBtn.classList.add('play-btn');
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

  // when response come from server hide loading animation and show response
  function addResponce(content) {
    message.textContent = content;
    message.classList.remove('loader-upndown');
  }

  // URL to check the availability of the audio file
  // const audioUrl = 'http://127.0.0.1:8000/GenerateReqAudioTest'; // Define your audio URL here
  // const myAudio = generatedAudio;

  // Show play button when the audio file is available and cursor hovering over
  function checkAudioAvailability(file){
    if (file.src) {
      audioPlayer.style.display = 'flex';
      playBtn.addEventListener('click', function () {
        myAudio.play();
      });
    } else {
      // If not available, ensure audioPlayer is hidden
      audioPlayer.style.display = 'none';
    }
  };
};


// Send audio file generate request to server
async function generateReqAudio(text) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/GenerateReqAudioTest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      // body: JSON.stringify({ text })
      body: "text"
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data.audioUrl; // Assuming the response contains the URL of the generated audio
  } catch (e) {
    console.error('Error:', e);
  }
}