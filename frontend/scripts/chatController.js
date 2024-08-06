document.addEventListener('DOMContentLoaded', () => {
  const messageInput = document.getElementById('message-input');
  const sendButton = document.getElementById('send-button');
  const messagesContainer = document.getElementById('messages');

  function addMessage(content) {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = content;
    messageDiv.id = 'user';
    messageDiv.style.padding = '10px';
    messageDiv.style.borderBottom = '1px solid #ddd';
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll to the bottom
  }


  //Click button add message and send to backend server
  sendButton.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message) {
      addMessage(message);
      messageInput.value = '';
    }
    sendButton.disabled = true;
    // console.log('disabled');
    sendButton.style.backgroundColor = '#676767';
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
