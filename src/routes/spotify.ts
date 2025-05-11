import { Router, Request, Response, NextFunction } from 'express'
import {
  getTopTracks,
  getFollowedArtists,
  getCurrentlyPlaying,
  pausePlayback,
  playTrack,
  setAccessToken
} from '../services/spotify'

const router = Router()

const setToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    res.status(401).json({ error: 'No token provided' })
    return
  }
  setAccessToken(token)
  next()
}

router.get('/top-tracks', setToken, async (req: Request, res: Response) => {
  try {
    const tracks = await getTopTracks()
    res.json(tracks)
  } catch (error) {
    res.status(500).json({ error: 'Failed to get top tracks' })
  }
})

router.get('/followed-artists', setToken, async (req: Request, res: Response) => {
  try {
    const artists = await getFollowedArtists()
    res.json(artists)
  } catch (error) {
    res.status(500).json({ error: 'Failed to get followed artists' })
  }
})

router.get('/currently-playing', setToken, async (req: Request, res: Response) => {
  try {
    const current = await getCurrentlyPlaying()
    res.json(current)
  } catch (error) {
    res.status(500).json({ error: 'Failed to get currently playing' })
  }
})

router.post('/pause', setToken, async (req: Request, res: Response) => {
  try {
    await pausePlayback()
    res.json({ message: 'Playback paused' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to pause playback' })
  }
})

router.post('/play/:trackUri', setToken, async (req: Request, res: Response) => {
  try {
    const { trackUri } = req.params
    await playTrack(trackUri)
    res.json({ message: 'Track started playing' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to play track' })
  }
})

// Redirect /spotify/callback to /auth/callback
router.get('/callback', (req: Request, res: Response) => {
  res.redirect(`/auth/callback?${req.url.split('?')[1]}`)
})

export default router