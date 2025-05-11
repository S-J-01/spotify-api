import dotenv from 'dotenv'
import SpotifyWebApi from 'spotify-web-api-node'

dotenv.config()

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI
})

export const scopes = [
  'user-read-private',
  'user-read-email',
  'user-top-read',
  'user-follow-read',
  'user-read-currently-playing',
  'user-read-playback-state',
  'user-modify-playback-state'
]

export default spotifyApi
