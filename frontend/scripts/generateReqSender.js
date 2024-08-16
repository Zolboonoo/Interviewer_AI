document.getElementById('send-button').addEventListener('click', async function () {
  var writtentext = document.getElementById("message-input").value;
  const messagesContainer = document.getElementById('messages');
  const sendButton = document.getElementById('send-button');


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
  sendButton.textContent = 'stop_circle';
  sendButton.disabled = true;
  console.log(sendButton.textContent);
  try {
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
    addMessage(data.message);

  } catch (e) {
    console.error("Error sending request:", e);
  } finally {
    // Hide loading animation
    sendButton.textContent = 'arrow_upward';
  }

  //reply to display in screen
  function addMessage(content) {
    const messageContDiv = document.createElement('div');
    const messageDiv = document.createElement('div');
    const messageIconCont = document.createElement('div');
    const messageIcon = document.createElement('div');
    messageContDiv.classList.add('model-message');
    messageDiv.classList.add('message-style');
    messageIconCont.classList.add('icon-style');
    messageIcon.classList.add('material-symbols-outlined');
    messageDiv.textContent = content;
    messageDiv.id = 'model';

    messageIcon.textContent = 'support_agent';

    messageIconCont.appendChild(messageIcon);
    messageContDiv.appendChild(messageIconCont);
    messagesContainer.appendChild(messageContDiv);
    messageContDiv.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll to the bottom
  }

});