# Base image
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Copy requirements.txt
COPY requirements.txt ./

# Install dependencies
RUN pip install -r requirements.txt

# Copy the rest of the application code
COPY . .

# Expose the desired port (e.g., 8000)
EXPOSE 8000

# Define the command to start the application
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
