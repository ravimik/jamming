const clientID = '3f17baee26c24bdf8e4d0bd0fc97afc5';
const clientSecret = '4efc1dc31d6f4e729c30fcd1b3058b33';
const redirectURI = 'https://localhost:3000/callback';
const authorizationURL = 'https://accounts.spotify.com/authorize';
const scopes = 'user-read-private user-read-email';

const userAccessToken = '';

const Spotify = {
	getAccessToken() {
		if(userAccessToken) {
			return userAccessToken;
		} return fetch(${authorizationURL}'?client_id='${clientID}'&redirect_uri='${redirectURI}'&scope='${scopes}'&response_type=token&state=123')
	}
};

export default Spotify;