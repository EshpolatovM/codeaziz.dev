// Local development uchun yengil server
// Production'da Vercel serverless functions ishlatiladi
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import orderHandler from './api/order.js'
import chatHandler from './api/chat.js'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.post('/api/order', async (req, res) => {
  // Vercel handler formatiga moslashtirish
  await orderHandler(req, res)
})

app.post('/api/chat', async (req, res) => {
  await chatHandler(req, res)
})

app.listen(PORT, () => {
  console.log(`Dev server http://localhost:${PORT} da ishlamoqda`)
})
