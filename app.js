const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json({
    message: "Hello! Thank you for using Claude-GPT-API. Made by adityabh2007. Repo: https://github.com/adityabh2007/Claude-GPT-API",
  });
});

app.post('/v1/chat/completions', async (req, res) => {
  const { model, messages, stream } = req.body;

  // Only support user role
  for (let message of messages) {
    if (message.role === 'system') {
      message.role = 'user';
    }
  }

  try {
    await chatWithDuckDuckGo(req, res, messages, stream, model);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/v1/models', (req, res) => {
  res.json({
    object: "list",
    data: [
      {
        id: "gpt-3.5-turbo-0125",
        object: "model",
        created: 1692901427,
        owned_by: "system",
      },
      {
        id: "claude-3-haiku-20240307",
        object: "model",
        created: 1692901427,
        owned_by: "user",
      },
    ],
  });
});

async function chatWithDuckDuckGo(req, res, messages, stream, model) {
  const userAgent = "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:123.0) Gecko/20100101 Firefox/123.0";
  const headers = {
    "User-Agent": userAgent,
    "Accept": "text/event-stream",
    "Accept-Language": "de,en-US;q=0.7,en;q=0.3",
    "Accept-Encoding": "gzip, deflate, br",
    "Referer": "https://duckduckgo.com/",
    "Content-Type": "application/json",
    "Origin": "https://duckduckgo.com",
    "Connection": "keep-alive",
    "Cookie": "dcm=1",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "Pragma": "no-cache",
    "TE": "trailers",
  };

  const statusURL = "https://duckduckgo.com/duckchat/v1/status";
  const chatURL = "https://duckduckgo.com/duckchat/v1/chat";

  try {
    // Get vqd_4
    const statusResponse = await axios.get(statusURL, {
      headers: { ...headers, "x-vqd-accept": "1" },
    });
    const vqd4 = statusResponse.headers['x-vqd-4'];

    const payload = {
      model: model,
      messages: messages,
    };

    const chatResponse = await axios.post(chatURL, payload, {
      headers: { ...headers, "x-vqd-4": vqd4 },
      responseType: 'stream',
    });

    res.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Transfer-Encoding': 'chunked',
    });

    let responseContent = "";

    chatResponse.data.on('data', (chunk) => {
      const lines = chunk.toString().split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const dataChunk = line.substring(6);
          if (dataChunk === "[DONE]") {
            if (!stream) {
              res.json({
                id: uuidv4(),
                object: "chat.completion",
                created: Date.now(),
                model: model,
                choices: [{
                  index: 0,
                  message: {
                    role: "assistant",
                    content: responseContent,
                  },
                  finish_reason: "stop",
                }],
              });
              res.end();
            } else {
              res.write(`data: ${JSON.stringify({
                id: uuidv4(),
                object: "chat.completion",
                created: Date.now(),
                model: model,
                choices: [{ index: 0, finish_reason: "stop" }],
              })}\n\n`);
              res.write("data: [DONE]\n\n");
              res.end();
            }
            return;
          }

          const data = JSON.parse(dataChunk);
          responseContent += data.message;

          if (stream) {
            res.write(`data: ${JSON.stringify({
              id: data.id,
              object: "chat.completion",
              created: data.created,
              model: data.model,
              choices: [{ index: 0, delta: { content: data.message } }],
            })}\n\n`);
          }
        }
      }
    });

    chatResponse.data.on('end', () => {
      if (stream) {
        res.end();
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const PORT = process.env.PORT || 3456;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
