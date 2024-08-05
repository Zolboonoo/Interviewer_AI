document.addEventListener('DOMContentLoaded', () => {
  const messageInput = document.getElementById('message-input');
  const sendButton = document.getElementById('send-button');
  const messagesContainer = document.getElementById('messages');

  function addMessage(content) {
      const messageDiv = document.createElement('div');
      messageDiv.textContent = content;
      messageDiv.style.padding = '10px';
      messageDiv.style.borderBottom = '1px solid #ddd';
      messagesContainer.appendChild(messageDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll to the bottom
  }

  sendButton.addEventListener('click', () => {
      const message = messageInput.value.trim();
      if (message) {
          addMessage(message);
          messageInput.value = '';
      }
  });

  messageInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
          event.preventDefault(); // Prevent new line
          sendButton.click();
      }
  });
});
