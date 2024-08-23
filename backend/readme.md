# Setup and Running Instructions

## First-Time Setup

python version range 3.9 <= , < 3.11

1. **Navigate to the backend directory:**
   ```bash
   cd backend
2. **Create and activate a virtual environment:**
    ```bash
    python3.9 -m venv interviewer_backend
    interviewer_backend/Scripts/activate
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
    .\interviewer_backend\Scripts\Activate
3. **Run the application:**
    ```bash
    uvicorn main:app --reload