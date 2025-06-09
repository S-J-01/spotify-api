import spotifyApi from '../config/spotify';
import {
  SpotifyTrack,
  SpotifyArtist,
  CurrentlyPlaying,
} from '../types/spotify';

export const getTopTracks = async () => {
  try {
    const response = await spotifyApi.getMyTopTracks({
      limit: 10,
      time_range: 'short_term',
    });
    return response.body.items;
  } catch (error) {
    console.log('Error getting top tracks:', error);
    throw error;
  }
};

export const getFollowedArtists = async () => {
  try {
    const response = await spotifyApi.getFollowedArtists();
    return response.body.artists.items;
  } catch (error) {
    console.log('Error getting followed artists:', error);
    throw error;
  }
};

export const getCurrentlyPlaying = async () => {
  try {
    const response = await spotifyApi.getMyCurrentPlaybackState();
    return {
      is_playing: response.body.is_playing,
      item: response.body.item as SpotifyTrack,
      progress_ms: response.body.progress_ms,
    };
  } catch (error) {
    console.log('Error getting currently playing:', error);
    throw error;
  }
};

export const pausePlayback = async () => {
  try {
    await spotifyApi.pause();
  } catch (error) {
    console.log('Error pausing playback:', error);
    throw error;
  }
};

export const playTrack = async (trackUri: string) => {
  try {
    await spotifyApi.play({ uris: [trackUri] });
  } catch (error) {
    console.log('Error playing track:', error);
    throw error;
  }
};

export const setAccessToken = (token: string) => {
  spotifyApi.setAccessToken(token);
};
