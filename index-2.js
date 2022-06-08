import express from 'express'
import fs from 'fs'
import { createServer } from 'https'
import fetch from 'node-fetch'


const key = fs.readFileSync('./certs/key.pem');
const cert = fs.readFileSync('./certs/cert.pem');
const app = express()
const server = createServer({key: key, cert: cert}, app)

const baseUrl = 'https://api.podium.com/v4/'
const refresToken = ''
const clientID = ''
const clientSecret = ''
let token

app.use(express.urlencoded());
app.use(express.json());

app.get('/', async (req, res) => {
    try {
      token = await getTokenID();
      const response = await fetch(`${baseUrl}/contacts`, {
          Method: 'GET',
          Headers: {
              Accept: 'application.json',
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          }
      })

      return res.send(response.data)

    } catch (error) {
      console.error('Error', error)
      return res.sendStatus(error.response.status)
    }
    
})

app.post('/', async (req, res) => {
  try {
    token = await getTokenID();
    let request;

    if (token) {
        request = await fetch(`${baseUrl}/contacts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(req.body)
        })
    }

    const reqResponse = await request.json();
    cconsole.log('request response', reqResponse);

    return res.send(reqResponse)
  } catch(error) {
    console.error(error)
    return res.send(error)
  }
})

async function  getTokenID() {
  const bodyData = {
    'client_id': clientID,
    'client_secret':clientSecret,
    'grant_type':'refresh_token',
    'refresh_token': refresToken,
  }

  try {
    const tokenRequest = await fetch('https://accounts.podium.com/oauth/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData)
    })

    const tokenResponse = await tokenRequest.json();

    if(tokenResponse) {
      return tokenResponse.access_token;
    }
  } catch (error) {
    console.error(`Error retrieveing a new token, ${error}`)
  }
  
}

server.listen(3000, () => {console.log('Server is listening on port 3000')})