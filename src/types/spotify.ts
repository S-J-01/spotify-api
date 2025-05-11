export type SpotifyTrack = {
    id: string
    name: string
    artists: Array<{
      id: string
      name: string
    }>
    album: {
      name: string
      images: Array<{
        url: string
      }>
    }
    uri: string
  }
  
  export type SpotifyArtist = {
    id: string
    name: string
    images: Array<{
      url: string
    }>
    uri: string
  }
  
  export type CurrentlyPlaying = {
    is_playing: boolean
    item: SpotifyTrack | null
    progress_ms: number | null
  }
  
  export type SpotifyError = {
    status: number
    message: string
  }