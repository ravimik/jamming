const clientID = '3f17baee26c24bdf8e4d0bd0fc97afc5';
const clientSecret = '4efc1dc31d6f4e729c30fcd1b3058b33';
const redirectURI = 'https://localhost:3000/';
const scopes = 'user-read-private%20user-read-email';
const userAccessToken = '';

const Spotify = {
	getAccessToken() {
		if(userAccessToken) {
			return userAccessToken;
		} 
		let userAccessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
		let tokenExpiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

		if (userAccessTokenMatch && tokenExpiresInMatch) {
			userAccessToken = userAccessTokenMatch[1];
			const expiresIn = Number(tokenExpiresInMatch[1]);
			window.setTimeout(() => userAccessToken = '', expiresIn * 1000);
			window.history.pushState('Access Token', null, '/');
			let accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
			window.location = accessUrl;
		}
	},

	search(term) {
		return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, 
			{
				headers: {
					Authorization: `Bearer ${userAccessToken}`
				}
			}
		).then( response => {
			return response.json();
		}).then( jsonResponse => {
			if(jsonResponse.tracks) {
				return jsonResponse.tracks.map( track => ({
					id: track.id,
					name: track.name,
					artist: track.artist,
					album: track.album,
					uri: track.uri,
				}));
			}
		});
	}
};

export default Spotify;