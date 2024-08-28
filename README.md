# Setup and Running Instructions

## First-Time Setup

1. **Project Overview**
  This project is developed using JavaScript (frontend) and Python (backend). Refer to the respective README files in the frontend and backend directories for detailed setup instructions.

2. **API Key Configuration**
  This project uses the GenAI API. Before running the project, set up the API key by executing the following command in your terminal:

   ```bash
   $env:GOOGLE_API_KEY = "your_api_key" # if your using os system use this instead --> export GENAI_API_KEY="AIzaSyB3r5lNVV0qnt3Jk1sBOpe9a3RBUe3vVHo"

3. **Model Usage**
  The project utilizes STT, TTS, and text-to-text LLM models. If you have an NVIDIA GPU, the models will run on your GPU, which will be faster. Otherwise, the models will run on your CPU.

4. **Running the Backend**
Start the backend server by running backend/main.py.

### Notes
Data Storage
The project saves voice recordings in the file backend/recordData. If you prefer not to save these files, you can delete them.
