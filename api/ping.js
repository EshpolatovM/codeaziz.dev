// Vercel Cron Job — har kuni botga "ping" yuboradi (bot tirik ekanini tekshiradi)
// Vercel konfiguratsiyasida: crons: [{ path: '/api/ping', schedule: '0 9 * * *' }]
export default async function handler(req, res) {
  // Faqat Vercel Cron chaqiradi — tashqi odamlar kira olmasligi uchun tekshiruv
  const authHeader = req.headers.authorization
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ ok: false, error: 'Unauthorized' })
  }

  if (!process.env.BOT_TOKEN || !process.env.CHAT_ID) {
    return res.status(500).json({ ok: false, error: 'Bot sozlanmagan' })
  }

  try {
    const url = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`
    const tg = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: process.env.CHAT_ID,
        text: '✅ Bot ishlamoqda — ' + new Date().toLocaleString('uz-UZ'),
      }),
    })

    if (!tg.ok) {
      const err = await tg.text()
      console.error('Telegram ping xatosi:', err)
      return res.status(502).json({ ok: false, error: 'Telegramga yuborilmadi' })
    }

    return res.status(200).json({ ok: true, message: 'Ping yuborildi' })
  } catch (e) {
    console.error('Ping xatosi:', e)
    return res.status(500).json({ ok: false, error: 'Server xatosi' })
  }
}
