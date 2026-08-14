# codemir.dev — Portfolio

Eshpolatov Miraziz — Frontend & Backend Developer portfolio sayti.
React 19 + Vite 8 + Express (Telegram bot orqali buyurtma qabul qilish + AI yordamchi).

## Ishga tushirish (local)

```bash
npm install
cp .env.example .env   # BOT_TOKEN, CHAT_ID va GROQ_API_KEY ni kiriting
```

Ikki terminalda:

```bash
npm run server    # backend — http://localhost:3000
npm run dev       # frontend — http://localhost:5173
```

Sayt: http://localhost:5173

Vite `/api` so'rovlarini localhost:3000 ga proxylaydi — backend
(`npm run server`) ishlamasa AI chat va buyurtma formasi 502 qaytaradi.

## AI yordamchi (chat)

Saytning pastki o'ng burchagidagi tugma orqali ochiladi. AI FAQAT
portfeli (Miraziz va u haqidagi ma'lumotlar) haqidagi savollarga javob beradi.

1. [console.groq.com](https://console.groq.com) da API kalit yarating.
2. `.env` ga `GROQ_API_KEY=...` ni yozing.
3. Vercel'ga deploy qilsangiz, `GROQ_API_KEY` ni Vercel muhit o'zgaruvchilariga ham qo'shing.

Kalit faqat server tomonda turadi (`api/chat.js`) — frontendga tushmaydi.

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
```

Vercel'ga deploy qilganda `api/*.js` avtomatik serverless funksiya bo'lib ishlaydi.

**Vercel muhit o'zgaruvchilari:** `BOT_TOKEN`, `CHAT_ID`, `GROQ_API_KEY`
