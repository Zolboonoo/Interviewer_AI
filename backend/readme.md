# Setup and Running Instructions

## First-Time Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
2. **Create and activate a virtual environment:**
    ```bash
    python -m venv interviewer_backend
    source interviewer_backend/Scripts/activate
3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
4. **Run application**
    ```bash
    uvicorn main:app --start
## Subsequint Usage

1. **Navigate to the backend directory:**
   ```bash
   cd backend
2. **CActivate a virtual environment:**
    ```bash
    source interviewer_backend/Scripts/activate
3. **Run the application:**
    ```bash
    uvicorn main:app --reload