
import fetch from 'node-fetch';


class Base {

    token = ''
    headers = { "Content-Type": "application/json", Accept: "application/json" };

    checkStatus = (response) => {
        if (response.ok) {
          return response;
        } else {
          throw new HTTPResponseError(response);
        }
      };

    async sendReviewInvite() {
        console.log('>>>before requests structured')
        const url = 'https://api.podium.com/v4/reviews/invites';
        const method = 'POST',
        headers = {
          Authorization: `Bearer ${token}`,
          ...this.headers,
        };
        const body = { 
            locationUid: '00000000-0000-0000-0000-000000000000',
            phoneNumber: '' 
        };

        console.log('>>>>request completed')

        const response = await fetch(url, { method, body: JSON.stringify(body), headers });
    
        try {
          this.checkStatus(response);
        } catch (error) {
          const { code, message, moreInfo } = await error.response.json();
          console.error(`Code: ${code}`);
          console.error(`Message: ${message}`);
          console.error(`More Info: ${moreInfo}`);
          throw error;
        }
    
        console.log(response.json());
        return await response.json();
      }
    
}

export default Base;