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
    const responce = await fetch(`http://127.0.0.1:8000/GenerateReq`, {
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
    const messageDiv = document.createElement('div');
    messageDiv.textContent = content;
    messageDiv.id = 'model';
    messageDiv.style.padding = '10px';
    messageDiv.style.borderBottom = '1px solid #ddd';
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll to the bottom
  }
});