# Claude-GPT-API
Free API for Claude and GPT 3.5 chat completion.

### Host private instance : 
```bash
git clone https://github.com/adityabh2007/Claude-GPT-API
cd Claude-GPT-API
npm install express axios body-parser uuid
node app.js
```

### Test Claude-GPT-API (private instances): 

```bash
curl http://127.0.0.1:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-3.5-turbo-0125",
    "messages": [
      {
        "role": "user",
        "content": "Hello!"
      }
    ],
    "stream": true
    }'
```

### Endpoints

| Endpoint                  | Method | Description                                                | Example Request Body                                                                                               |
|---------------------------|--------|------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------|
| `/`                       | GET    | Returns a welcome message.                                 | N/A                                                                                                                 |
| `/v1/chat/completions`    | POST   | Sends messages to DuckDuckGo chat and returns responses.   | ```json { "model": "gpt-3.5-turbo-0125", "messages": [{ "role": "user", "content": "Hello!" }], "stream": true }``` |
| `/v1/models`              | GET    | Returns a list of available models.                        | N/A                                                                                                                 |
