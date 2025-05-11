import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import spotifyRoutes from './routes/spotify'
import authRoutes from './routes/auth'

dotenv.config()

const app = express()


app.use(cors())
app.use(express.json())


app.use('/spotify', spotifyRoutes)
app.use('/auth', authRoutes)

app.listen(3000, () => {
  console.log('Server running on port 3000')
}) 