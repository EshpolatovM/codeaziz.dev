import { useEffect, useRef, useState } from 'react'

const SUGGESTIONS = ['Kimsan?', 'Nimalar bilan ishlaysan?', 'Qanday buyurtma beraman?']

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  )
}

export default function AiChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const bodyRef = useRef(null)

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, busy, open])

  async function send(text) {
    const clean = typeof text === 'string' ? text.trim() : ''
    if (!clean || busy) return

    const history = messages
    setMessages((m) => [...m, { role: 'user', content: clean }])
    setInput('')
    setBusy(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: clean, messages: history }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data?.error)
      setMessages((m) => [...m, { role: 'assistant', content: data.reply }])
    } catch (err) {
      const msg = err?.message || 'Xatolik yuz berdi. Keyinroq qayta urinib ko\'ring.'
      setMessages((m) => [...m, { role: 'assistant', content: msg }])
    } finally {
      setBusy(false)
    }
  }

  function onSubmit(e) {
    e.preventDefault()
    send(input)
  }

  return (
    <>
      <button
        type="button"
        className={`chat-fab ${open ? 'is-open' : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'AI yordamchini yopish' : 'AI yordamchini ochish'}
      >
        {open ? <span aria-hidden="true">✕</span> : <ChatIcon />}
      </button>

      {open && (
        <div className="chat-panel" role="dialog" aria-label="AI yordamchi">
          <header className="chat-head">
            <div className="chat-head-info">
              <strong>AI yordamchi</strong>
              <span>codemir.dev</span>
            </div>
          </header>

          <div className="chat-body" ref={bodyRef}>
            {messages.length === 0 && (
              <div className="chat-welcome">
                <p>Salom! Men Miraziz va uning portfolio'si haqida ma'lumot bera olaman.</p>
                <div className="chat-chips">
                  {SUGGESTIONS.map((s) => (
                    <button key={s} type="button" onClick={() => send(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.role}`}>
                {m.content}
              </div>
            ))}

            {busy && (
              <div className="chat-msg assistant chat-typing" aria-label="Yozmoqda...">
                <span />
                <span />
                <span />
              </div>
            )}
          </div>

          <form className="chat-form" onSubmit={onSubmit}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Savol yozing..."
              disabled={busy}
              aria-label="Savol"
            />
            <button type="submit" disabled={busy} aria-label="Yuborish">
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  )
}
