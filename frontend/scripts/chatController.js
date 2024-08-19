document.addEventListener('DOMContentLoaded', () => {
  const messageInput = document.getElementById('message-input');
  const sendButton = document.getElementById('send-button');
  const messagesContainer = document.getElementById('messages');

  function addSentMessage(content) {
    const messageContDiv = document.createElement('div');
    const messageDiv = document.createElement('div');
    messageContDiv.classList.add('user-message');
    messageDiv.classList.add('message-style');
    messageDiv.textContent = content;
    messageDiv.id = 'user';
    messagesContainer.appendChild(messageContDiv);
    messageContDiv.appendChild(messageDiv);
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
    // console.log('disabled');
    sendButton.style.backgroundColor = '#676767';

    // funciton send to backend request
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
  const messageContDiv = document.createElement('div');
  const messageDiv = document.createElement('div');
  const message = document.createElement('div');
  const messageIconCont = document.createElement('div');
  const messageIcon = document.createElement('div');

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
  console.log(sendButton.textContent);
  try {
    addReplyMessage();
    const responce = await fetch(`http://127.0.0.1:8000/GenerateReqTest`, {
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
  } catch (e) {
    console.error("Error sending request:", e);
  } finally {
    // Hide loading animation
  }
    sendButton.textContent = 'arrow_upward';    

  // until get response from server show loading animation
  function addReplyMessage() {
    
    messageContDiv.classList.add('model-message');
    message.classList.add('loader-upndown');
    messageIconCont.classList.add('icon-style');
    messageIcon.classList.add('material-symbols-outlined');
    messageDiv.classList.add('message-style');
    messageDiv.id = 'model';

    messageIcon.textContent = 'support_agent';

    messageIconCont.appendChild(messageIcon);
    messageContDiv.appendChild(messageIconCont);
    messagesContainer.appendChild(messageContDiv);
    messageContDiv.appendChild(messageDiv);
    messageDiv.appendChild(message);
    messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll to the bottom
  }

  // when response come from server hide loading animation and show response
  function addResponce(content) {
    message.textContent = content;
    message.classList.remove('loader-upndown');
  }

};