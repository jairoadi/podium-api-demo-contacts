import express, { response } from 'express';
import fs from 'fs';
import { createServer } from 'https';
import fetch from 'node-fetch';
import axios from 'axios';

const key = fs.readFileSync('./key.pem');
const cert = fs.readFileSync('./cert.pem');
const app = express();
const server = createServer({key: key, cert: cert}, app);

const url = 'https://api.podium.com/v4/contacts';
const refresToken = ''
const clientID = ''
const clientSecret = ''
let token

app.get('/', async (req, res) => {

    try {

      token = await getTokenID();
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      const response = await axios.get(url)

      return res.send(response.data);

    } catch (error) {
      console.error(error);
      return res.sendStatus(error.response.status);
    }

    
})

async function  getTokenID() {
  const data = {
    'client_id': clientID,
    'client_secret':clientSecret,
    'grant_type':'refresh_token',
    'refresh_token': refresToken
  }
  try{
    const tokenResponse =  await axios.post('https://accounts.podium.com/oauth/token', data)

    if(tokenResponse.status = 200) {
      return tokenResponse.data.access_token;
    }
  } catch (error) {
    console.error(`Error retrieveing a new token, ${error}`)
  }
  
}

server.listen(3000, () => {console.log('Server is listening on port 3000')})