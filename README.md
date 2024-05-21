# Claude-GPT-API
Free API for Claude and GPT 3.5 chat completion.

### Use Hosted API
```bash
Base URL : https://claude-gpt-api.onrender.com
```
#### Hosted on Render.com

### Host private instance : 
1. Local Machine : 
```bash
git clone https://github.com/adityabh2007/Claude-GPT-API
cd Claude-GPT-API
npm install express axios body-parser uuid
node app.js
```
2: [Render](https://dashboard.render.com/) : 
  Step-by-Step Guide  
  1. Prerequisites  
    Ensure you have the following:  
    a. A GitHub account
    b. A Render.com account
  2. Fork the Repository
  Go to the [Github Repo](https://github.com/adityabh2007/Claude-GPT-API).  
  Click on the "Fork" button in the upper right corner of the page.

  3. Connect GitHub to Render.com  
    Log in to your Render.com account.  
    Go to the Render.com dashboard.  
    Click on the "New +" button and select "Web Service".  
    Connect your GitHub account to Render.com if you haven't done so already.  
    Select the forked repository from your GitHub account.  

  4. Configure the Web Service  
  Fill in the following details:  
    a. Name: Give your service a name (e.g., openapi-service).  
    b. Region: Choose a region closest to your users.  
    c. Branch: Select the branch you want to deploy (usually main or master).  
    d. Build Command: npm install  
    e. Start Command: node app.js  
  
  Under "Environment", make sure to set any environment variables you might need. (Reffer to Env config given below)  
  
  5. Deploy the Service  
    Click on the "Create Web Service" button.  
    Render.com will start building and deploying your service. This process may take a few minutes.  
    Once the deployment is complete, you will see a URL where your service is hosted. 


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

### Env Config
PORT = (Random 4 digit no :) ) 8080 by default
