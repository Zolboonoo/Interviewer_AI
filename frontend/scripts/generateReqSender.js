async function generateReqSender() {
  var writtentext = document.getElementById("message-input").value;
  const messagesContainer = document.getElementById('messages');
  const sendButton = document.getElementById('send-button');

  // automatically create elements
  const messageContDiv = document.createElement('div');
  const messageDiv = document.createElement('div');
  const loadingDiv = document.createElement('div');
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
    addMessage();
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
  function addMessage() {
    
    messageContDiv.classList.add('model-message');
    messageDiv.classList.add('loader');
    // loadingDiv.classList.add('loader');
    // loadingDiv.classList.add('loading-div');
    messageIconCont.classList.add('icon-style');
    messageIcon.classList.add('material-symbols-outlined');
    messageDiv.id = 'model';

    messageIcon.textContent = 'support_agent';

    messageIconCont.appendChild(messageIcon);
    messageContDiv.appendChild(messageIconCont);
    messagesContainer.appendChild(messageContDiv);
    messageContDiv.appendChild(messageDiv);
    messageDiv.appendChild(loadingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll to the bottom
  }

  // when response come from server hide loading animation and show response
  function addResponce(content) {
    messageDiv.textContent = content;
    messageDiv.classList.remove('loader');
    messageDiv.classList.add('message-style');
  }

};