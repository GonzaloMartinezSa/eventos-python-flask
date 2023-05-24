FROM python:3.10

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

WORKDIR /code
COPY . /code
RUN pip install --no-cache-dir -r requirements.txt
