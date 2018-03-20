const clientID = '3f17baee26c24bdf8e4d0bd0fc97afc5';
const redirectURI = 'rm-jamming.surge.sh';
let userAccessToken = '';

const Spotify = {
	getAccessToken() {
		if(userAccessToken) {
			return userAccessToken;
		} 
		let userAccessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
		let tokenExpiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

		if (userAccessTokenMatch && tokenExpiresInMatch) {
			userAccessToken = userAccessTokenMatch[1];
			let expiresIn = Number(tokenExpiresInMatch[1]);
			window.setTimeout(() => userAccessToken = '', expiresIn * 1000);
			window.history.pushState('Access Token', null, '/');
			return userAccessToken;
		} else {
			const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
			window.location = accessUrl;
		}
	},

	search(term) {
		const userAccessToken = Spotify.getAccessToken();
		console.log("spotifyJS-term", term);
		return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
			headers: {
				Authorization: `Bearer ${userAccessToken}`
			}
		}).then( response => {
			return response.json();
		}).then( jsonResponse => {
			if(!jsonResponse.tracks) {
				return [];
			}
			console.log(jsonResponse.tracks.items[0].name)
			return jsonResponse.tracks.items.map( track => ({
				id: track.id,
				name: track.name,
				artist: track.artists[0].name,
				album: track.album.name,
				uri: track.uri,
			}));
		});
	},

	savePlaylist(name, trackUris) {
	    if (!name || !trackUris.length) {
	      return;
	    }

	    const userAccessToken = Spotify.getAccessToken();
	    const headers = { Authorization: `Bearer ${userAccessToken}` };
	    let userId;

	    return fetch('https://api.spotify.com/v1/me', {headers: headers}
	    ).then(response => response.json()
	    ).then(jsonResponse => {
	      userId = jsonResponse.id;
	      return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
	        headers: headers,
	        method: 'POST',
	        body: JSON.stringify({name: name})
	      }).then(response => response.json()
	      ).then(jsonResponse => {
	        const playlistId = jsonResponse.id;
	        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
	          headers: headers,
	          method: 'POST',
	          body: JSON.stringify({uris: trackUris})
	        });
	      });
	    });
	  }
	};

export default Spotify;