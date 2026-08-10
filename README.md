# codemir.dev — Portfolio

Eshpolatov Miraziz — Frontend & Backend Developer portfolio sayti.
React 19 + Vite 8 + Express (Telegram bot orqali buyurtma qabul qilish).

## Ishga tushirish (local)

```bash
npm install
cp .env.example .env   # BOT_TOKEN va CHAT_ID ni kiriting
```

Ikki terminalda:

```bash
npm run server    # backend — http://localhost:3001
npm run dev       # frontend — http://localhost:5173
```

Sayt: http://localhost:5173

## Telegram botni sozlash

1. [@BotFather](https://t.me/BotFather) dan bot yarating va `BOT_TOKEN` ni oling.
2. [@userinfobot](https://t.me/userinfobot) ga xabar yuborib `CHAT_ID` ni bilib oling (yoki o'z ID'ingiz).
3. Ikkalasini `.env` ga yozing:

```
BOT_TOKEN=123456789:ABC...
CHAT_ID=987654321
```

Buyurtma formasi yuborilganda xabar bot orqali shu chatga boradi.

## Production build

```bash
npm run build
npm run start      # server.js — dist ni ham, /api/order ni ham servis qiladi
```

`server.js` ham frontend (dist), ham backend API ni bitta serverda ishlatadi.
`PORT` muhit o'zgaruvchisi orqali o'zgartiriladi.

## Hosting va domain

Sayt static emas — Telegram API'ga ulanish uchun Node.js backend kerak.
Shuning uchun Node server ishlaydigan platforma tanlang (Railway, Render, Fly.io
yoki VPS + PM2).

**Render/Railway**:

- Repo'ni ulang, build command: `npm install && npm run build`
- Start command: `npm run start`
- Muhit o'zgaruvchilari: `BOT_TOKEN`, `CHAT_ID`, `PORT`

**VPS**:

```bash
npm run build
nohup node server.js &
```

**Domain**:

- Domain xarid qiling (masalan codemir.dev) va hostingga yo'naltiring:
  - Railway/Render: CNAME rekord yoki ularning ko'rsatmalariga amal qiling.
  - VPS: A rekord — `45.00.00.00` kabi IP manziliga.
- SSL: hosting platformasi (yoki VPS'da certbot) avtomatik beradi.
- Sayt tayyor bo'lgach, `index.html` dagi `https://codemir.dev/` canonical,
  `og:url`, `sitemap.xml` va `robots.txt` manzillarini haqiqiy domain bilan
  moslashtiring.

## Ma'lumotlarni o'zgartirish

- `src/data.js` — ism, email, telegram/github linklar, stack, skill'lar
- `src/i18n.js` — barcha matnlar (UZ/EN)
- `src/components/*` — bo'limlar
