import { Router, Request, Response } from 'express';
import spotifyApi, { scopes } from '../config/spotify';
import { storeState, verifyAndRemoveState } from '../config/stateStore';

const router = Router();

router.get('/login', (req: Request, res: Response) => {
  const state = Math.random().toString(36).substring(7);
  storeState(state);
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);
  res.redirect(authorizeURL);
});

router.get('/callback', async (req: Request, res: Response) => {
  const { code, state } = req.query;
  const error = req.query.error;

  if (error) {
    res.redirect('/error?message=invalid_token');
    return;
  }

  if (!state || typeof state !== 'string' || !verifyAndRemoveState(state)) {
    res.redirect('/error?message=invalid_state');
    return;
  }

  try {
    const data = await spotifyApi.authorizationCodeGrant(code as string);
    const { access_token, refresh_token } = data.body;

    spotifyApi.setRefreshToken(refresh_token);

    res.redirect(`/user?access_token=${access_token}`);
  } catch (error) {
    res.redirect('/error?message=invalid_token');
  }
});

router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const data = await spotifyApi.refreshAccessToken();
    const { access_token, expires_in } = data.body;

    spotifyApi.setAccessToken(access_token);
    res.json({ access_token, expires_in });
  } catch (error) {
    res.status(500).json({ error: 'Failed to refresh token' });
  }
});

export default router;
