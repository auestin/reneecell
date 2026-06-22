'use client';

import { useChat } from '@ai-sdk/react';
import { useEffect, useRef, useState } from 'react';

export default function ContactForm({ dict }: { dict: any }) {
  const { messages, append, isLoading } = useChat();
  const [text, setText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', height: '600px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '1.5rem', backgroundColor: '#111', color: 'var(--gold-accent)', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <h3 style={{ 
          margin: 0, 
          fontFamily: 'var(--font-heading)', 
          fontSize: '1.8rem',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #F9D423 0%, #FF4E50 100%)', /* Fallback in case var isn't working perfectly, but let's use a nice gold */
          backgroundImage: 'linear-gradient(to right, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0px 2px 10px rgba(252, 246, 186, 0.2)'
        }}>{dict.chatbot?.title || '美妝保養顧問'}</h3>
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#ccc' }}>{dict.chatbot?.subtitle || '您的專屬臉部保養專家，隨時為您解答'}</p>
      </div>

      {/* Chat Messages */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;500;700&display=swap');
        .chat-message-bubble {
          font-family: 'Zen Maru Gothic', 'Nunito', 'TsukuARdGothic-Regular', 'PingFang TC', 'Microsoft JhengHei', sans-serif;
        }
      `}} />
      <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: '#fafafa' }}>
        {(messages || []).length === 0 && (
          <div className="chat-message-bubble" style={{ textAlign: 'center', color: '#888', marginTop: '2rem' }}>
            <p>{dict.chatbot?.greeting1 || '👋 您好！我是美妝保養顧問。'}</p>
            <p>{dict.chatbot?.greeting2 || '有任何關於保養、膚質或產品的疑問，歡迎隨時問我喔！'}</p>
          </div>
        )}
        
        {(messages || []).map(m => (
          <div key={m.id} className="chat-message-bubble" style={{ 
            alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '80%',
            padding: '1rem',
            borderRadius: '12px',
            backgroundColor: m.role === 'user' ? 'var(--gold-accent)' : '#fff',
            color: m.role === 'user' ? '#fff' : '#333',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            lineHeight: '1.5'
          }}>
            {m.content && <div>{m.content}</div>}
            {m.toolInvocations && (
              <div style={{ fontStyle: 'italic', color: '#666', marginTop: m.content ? '0.5rem' : '0' }}>
                {m.toolInvocations.map(tool => {
                  if (tool.toolName === 'saveContactInfo' && 'result' in tool) {
                    return <span key={tool.toolCallId}>{dict.chatbot?.bookingSuccess || '✨ 已收到您的預約資訊！我們會盡快與您聯繫。'}</span>;
                  }
                  return null;
                })}
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div style={{ alignSelf: 'flex-start', padding: '1rem', borderRadius: '12px', backgroundColor: '#fff', color: '#888', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <span className="typing-indicator">{dict.chatbot?.typing || '顧問正在輸入中...'}</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={(e) => {
        e.preventDefault();
        if (!text.trim() || isLoading) return;
        if (append) {
          append({ role: 'user', content: text });
        }
        setText('');
      }} style={{ padding: '1rem', backgroundColor: '#fff', borderTop: '1px solid #eee', display: 'flex', gap: '0.5rem' }}>
        <input
          className="chat-message-bubble"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={dict.chatbot?.placeholder || "輸入您的問題或需求..."}
          style={{ 
            flex: 1, 
            padding: '1rem', 
            borderRadius: '8px', 
            border: '1px solid #ddd',
            fontSize: '1rem',
            outline: 'none',
          }}
          disabled={isLoading}
        />
        <button 
          className="chat-message-bubble"
          type="submit" 
          disabled={isLoading || !text.trim()}
          style={{ 
            padding: '0 1.5rem', 
            backgroundColor: 'var(--gold-accent)', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '8px',
            cursor: (isLoading || !text.trim()) ? 'not-allowed' : 'pointer',
            opacity: (isLoading || !text.trim()) ? 0.5 : 1,
            fontWeight: 'bold'
          }}
        >
          {dict.chatbot?.send || '發送'}
        </button>
      </form>
    </div>
  );
}
