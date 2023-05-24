FROM python:3.10-slim-buster

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

RUN apt-get update -y \
    && apt-get install -y curl htop nano procps libpq-dev \
    build-essential \
    libglib2.0-dev \
    libpango1.0-dev \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir /code
WORKDIR /code

COPY requirements.txt /code
RUN pip install --no-cache-dir -r requirements.txt
COPY . /code