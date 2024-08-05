document.getElementById('send-button').addEventListener('click', async function () {
  var writtentext = document.getElementById("message-input").value;
  // Show loading animation
  document.getElementById('send-button').value = 'stop_circle';
  try {
    const responce = await fetch(`http://127.0.0.1:8000/GenerateReq`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: writtentext }),
    });
    if (!responce.ok) {
      throw new Error(`HTTP error! Status: ${responce.status}`);
    }
    const data = await responce.json();
    console.log("Responce", data);

    document.getElementById('subTextArea').value = data.message; // Display response
  } catch (e) {
    console.error("Error sending request:", e);
  } finally {
    // Hide loading animation
    document.getElementById('send-button').style.display = 'upper_arrow';
    // document.getElementById('setToMainText').style.display = 'block';
  }
});