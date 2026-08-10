// Local development uchun yengil server
// Production'da Vercel serverless functions ishlatiladi
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import handler from './api/order.js'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.post('/api/order', async (req, res) => {
  // Vercel handler formatiga moslashtirish
  await handler(req, res)
})

app.listen(PORT, () => {
  console.log(`Dev server http://localhost:${PORT} da ishlamoqda`)
})
