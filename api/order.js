// Vercel Serverless Function — buyurtma formasi uchun
export default async function handler(req, res) {
  // CORS sozlamalari
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  const { name, phone, project } = req.body ?? {}

  if (!name || !phone || !project) {
    return res
      .status(400)
      .json({ ok: false, error: 'name, phone va project maydonlari talab qilinadi' })
  }

  if (!process.env.BOT_TOKEN || !process.env.CHAT_ID) {
    return res
      .status(500)
      .json({ ok: false, error: 'Telegram bot sozlanmagan (Vercel env ni tekshiring)' })
  }

  const buildMessage = ({ name, phone, project }) =>
    [
      '💡❤️ YANGI BUYURTMA',
      `👤 Ism: ${name}`,
      `📱 Telefon: ${phone}`,
      `📋 Loyiha: ${project}`,
    ].join('\n')

  try {
    const url = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`
    const tg = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: process.env.CHAT_ID,
        text: buildMessage({ name, phone, project }),
      }),
    })

    if (!tg.ok) {
      const err = await tg.text()
      console.error('Telegram API xatosi:', err)
      return res.status(502).json({ ok: false, error: 'Telegramga yuborilmadi' })
    }

    return res.status(200).json({ ok: true })
  } catch (e) {
    console.error('Buyurtma xatosi:', e)
    return res.status(500).json({ ok: false, error: 'Server xatosi' })
  }
}
