# Spotify API Express Server

This project is a backend server built with Express.js and TypeScript that interacts with the Spotify Web API. It handles the complete OAuth 2.0 Authorization Code Flow for user authentication and provides a set of proxy endpoints to access various Spotify features like user's top tracks, followed artists, and player controls.

## Features

- **Full OAuth 2.0 Authentication:** Securely authenticates users with Spotify, obtaining access and refresh tokens.
- **CSRF Protection:** Implements the `state` parameter to prevent cross-site request forgery.
- **Token Management:** Handles access token refreshing automatically.
- **Stateless API Design:** Uses a middleware to handle access tokens on a per-request basis, making the API scalable.
- **Player Controls:** Endpoints to play and pause tracks on a user's active Spotify device.
- **User Data Endpoints:** Fetch user-specific data like top tracks, followed artists, and currently playing song.

## Project Structure

```
/
├── src/
│   ├── config/
│   │   ├── spotify.ts       # Initializes and configures the spotify-web-api-node instance.
│   │   └── stateStore.ts    # In-memory store for the OAuth 'state' parameter.
│   ├── routes/
│   │   ├── auth.ts          # Handles the authentication flow (/login, /callback, /refresh).
│   │   └── spotify.ts       # All other API proxy endpoints.
│   ├── services/
│   │   └── spotify.ts       # Contains the business logic for interacting with the Spotify API wrapper.
│   ├── types/
│   │   └── spotify.ts       # TypeScript type definitions for Spotify objects.
│   └── index.ts             # The main Express server entry point.
├── .env.example             # Example environment file.
├── package.json
└── tsconfig.json
```

---

## Setup and Installation

1.  **Clone the repository:**

    ```bash
    git clone <your-repository-url>
    cd <repository-name>
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up your Spotify Developer App:**

    - Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/).
    - Create a new application.
    - Note down your `Client ID` and `Client Secret`.
    - In your app's settings, add a Redirect URI. For local development, this will be:
      ```
      http://localhost:3000/auth/callback
      ```

4.  **Create a `.env` file:**

    - Rename the `.env.example` file to `.env`.
    - Populate it with your Spotify app credentials:
      ```env
      CLIENT_ID=your_spotify_client_id
      CLIENT_SECRET=your_spotify_client_secret
      REDIRECT_URI=http://localhost:3000/auth/callback
      ```

5.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The server will start on `http://localhost:3000`.

---

## Authentication Flow

This server uses the OAuth 2.0 Authorization Code grant type.

1.  **Initiate Login:**

    - Open your web browser and navigate to:
      ```
      http://localhost:3000/auth/login
      ```
    - This will redirect you to the official Spotify login and authorization page.

2.  **Grant Permissions:**

    - Log in with your Spotify account (a Premium account is required for player controls).
    - Grant the requested permissions (scopes) to your application.

3.  **Receive Tokens:**

    - After authorization, Spotify will redirect you back to your `REDIRECT_URI` (`/auth/callback`).
    - The server will handle the callback, exchange the authorization code for an `access_token` and `refresh_token`.
    - You will be redirected to a `/user` page with the tokens visible in the URL. **This is for development convenience only.**

4.  **Using the API:**
    - Copy the `access_token` from the URL.
    - You will use this token to make requests to the protected endpoints.

---

## API Endpoints

All requests to the `/spotify/*` endpoints must include an `Authorization` header.

**Header Format:** `Authorization: Bearer <your_access_token>`

### Authentication

`POST /auth/refresh`

- Refreshes an expired access token. The server uses the in-memory refresh token obtained during login. This endpoint doesn't require a bearer token.
- **Returns:** `{ "access_token": "...", "expires_in": 3600 }`

### User Data

`GET /spotify/top-tracks`

- Retrieves the user's top 10 tracks from their long-term listening history.
- **Returns:** An array of Spotify Track objects.

`GET /spotify/followed-artists`

- Retrieves the artists the user is following.
- **Returns:** An array of Spotify Artist objects.

`GET /spotify/currently-playing`

- Retrieves the user's currently playing track.
- **Returns:** A `CurrentlyPlaying` object, including the track, play state, and progress.

### Player Controls

`POST /spotify/pause`

- Pauses the user's playback on their active device.

`POST /spotify/play/:trackUri`

- Plays a specific track.
- **`:trackUri`** (string): The Spotify URI of the track to play (e.g., `spotify:track:1Iq82Pj2b2i2Mo3rNXgL8s`).
