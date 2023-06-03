# Use a lightweight Python base image
FROM python:3.10-slim

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

WORKDIR /code

# Copy only the necessary files for installing dependencies
COPY requirements.txt .

# Install project dependencies
RUN pip install --no-cache-dir --user -r requirements.txt

# Copy the entire project code into the container
COPY . .

# Add the user's local bin directory to the PATH
ENV PATH=/root/.local/bin:$PATH