'use client'

import { useState } from 'react'
import SectionHeader from './ui/section-header'
import CornerPlus from './ui/corner-plus'

const labelStyle = {
  fontFamily: 'var(--font-mono)',
  fontSize: '10px',
  color: 'rgba(var(--ink), 0.4)',
  textTransform: 'uppercase',
  letterSpacing: '0.16em',
  display: 'block',
  marginBottom: '8px',
}

const valueStyle = {
  color: 'var(--text-primary)',
  fontSize: '16px',
  fontWeight: 500,
  textDecoration: 'none',
}

const fieldLabel = {
  fontFamily: 'var(--font-mono)',
  fontSize: '10px',
  color: 'rgba(var(--ink), 0.45)',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  marginBottom: '6px',
  display: 'block',
}

const inputStyle = {
  width: '100%',
  background: 'rgba(var(--ink), 0.03)',
  border: '1px solid rgba(var(--ink), 0.1)',
  padding: '12px 14px',
  color: 'var(--text-primary)',
  fontSize: '14px',
  fontFamily: 'var(--font-main)',
  outline: 'none',
  borderRadius: '12px',
}

const socials = [
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/akhand320/' },
  { name: 'GitHub', url: 'https://github.com/Akhandbhadouria' },
  { name: 'LeetCode', url: 'https://leetcode.com/u/akhand_07/' },
]

export default function Contact() {
  const [sending, setSending] = useState(false)
  const [sent, setSent]       = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    
    const formElement = e.currentTarget
    const data = new FormData(formElement)
    const name = (data.get('name') || '').toString().trim()
    const email = (data.get('email') || '').toString().trim()
    const message = (data.get('message') || '').toString().trim()

    try {
      const res = await fetch('https://formsubmit.co/ajax/thakurakhand.singh21111@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          message,
          _subject: `Portfolio Message from ${name}`
        })
      })

      if (res.ok) {
        setSent(true)
        formElement.reset()
        setTimeout(() => setSent(false), 5000)
      } else {
        // Fallback to mailto protocol
        const subject = name ? `Portfolio inquiry from ${name}` : 'Portfolio inquiry'
        const body = `${message}\n\n— ${name}${email ? ` <${email}>` : ''}`
        window.location.href = `mailto:thakurakhand.singh21111@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
        setSent(true)
        setTimeout(() => setSent(false), 5000)
      }
    } catch (err) {
      // Fallback to mailto protocol
      const subject = name ? `Portfolio inquiry from ${name}` : 'Portfolio inquiry'
      const body = `${message}\n\n— ${name}${email ? ` <${email}>` : ''}`
      window.location.href = `mailto:thakurakhand.singh21111@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      setSent(true)
      setTimeout(() => setSent(false), 5000)
    } finally {
      setSending(false)
    }
  }

  return (
    <section id="contact" className="section container grid-box">
      <CornerPlus />
      <SectionHeader
        eyebrow="Contact"
        title="Let's build something."
        marginBottom={24}
      />

      <div className="edi-sheet">
        <div className="edi-row edi-row-split contact-layout">

          {/* LEFT — Info stack */}
          <div className="edi-cell contact-details">
            <div className="contact-availability">
              <span className="contact-live-dot" />
              <span>Open for Opportunities</span>
            </div>
            <p className="contact-intro">
              Currently seeking internship and full-time roles in backend engineering, data science, and full-stack development.
            </p>

            <div className="contact-facts">
              <div className="contact-fact contact-fact--email">
                <span style={labelStyle}>Email</span>
                <a href="mailto:thakurakhand.singh21111@gmail.com" style={valueStyle}>thakurakhand.singh21111@gmail.com</a>
              </div>
              <div className="contact-fact">
                <span style={labelStyle}>Location</span>
                <p style={valueStyle}>Jalandhar, Punjab, India</p>
              </div>
            </div>

            <div className="contact-socials">
              <span style={{ ...labelStyle, marginBottom: '10px' }}>Elsewhere</span>
              <div>
                {socials.map((s) => (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="contact-social-link"
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-primary)' }}
                  >
                    {s.name}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — Direct message form */}
          <div className="edi-cell contact-form-cell">
            <div className="contact-form-heading">
              <span style={labelStyle}>Direct Message</span>
              <p>Share a little context and I&apos;ll take it from there.</p>
            </div>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="contact-form-pair">
                <div>
                  <label style={fieldLabel}>Name</label>
                  <input name="name" type="text" placeholder="John Doe" required style={inputStyle} />
                </div>
                <div>
                  <label style={fieldLabel}>Email</label>
                  <input name="email" type="email" placeholder="john@company.com" required style={inputStyle} />
                </div>
              </div>
              <div className="contact-message-field">
                <label style={fieldLabel}>Message</label>
                <textarea
                  name="message"
                  rows="4"
                  placeholder="Tell me about your project…"
                  required
                  style={{ ...inputStyle, resize: 'vertical', flex: 1, minHeight: '110px' }}
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="contact-submit"
                style={{ opacity: sending ? 0.7 : 1, cursor: sending ? 'wait' : 'pointer' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--accent)' }}
              >
                {sending ? 'Sending message...' : sent ? 'Message sent successfully! ✓' : 'Send message'}
                {!sending && !sent && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>}
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        #contact input:focus, #contact textarea:focus { border-color: var(--accent) !important; }
        #contact input::placeholder, #contact textarea::placeholder { color: rgba(var(--ink), 0.3); }
      `}</style>
    </section>
  )
}
