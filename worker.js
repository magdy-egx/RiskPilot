export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // AI API endpoint
    if (path === '/api/ai' && request.method === 'POST') {
      try {
        const body = await request.json();
        const userMessage = body.message || '';

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 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'
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: 'أنت خبير مالي متخصص في البورصة المصرية وإدارة مخاطر المحافظ الاستثمارية. تحلل الأسهم بشكل احترافي وتقدم نصائح دقيقة. تحدث بالعربية الفصحى. عند تحليل أي سهم، ذكر: السعر الحالي، مستويات الدعم والمقاومة، التقييم الفني، نسبة المخاطرة المقترحة، والتوصية (شراء/بيع/انتظار).'
              },
              { role: 'user', content: userMessage }
            ],
            temperature: 0.7,
            max_tokens: 1500
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          return new Response(JSON.stringify({
            error: errorData.error?.message || 'AI service error'
          }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        const data = await response.json();
        const reply = data.choices[0]?.message?.content || 'عذراً، لم أتمكن من إنشاء رد.';

        return new Response(JSON.stringify({ reply }), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });

      } catch (err) {
        return new Response(JSON.stringify({
          error: 'حدث خطأ: ' + err.message
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });
    }

    // Serve AI page
    if (path === '/ai' || path === '/ai.html') {
      return new Response(`<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>🤖 تحليل الذكاء الاصطناعي - حاسبة إدارة المخاطر</title>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>
:root {
  --primary: #0ea5e9; --primary-dark: #0284c7; --primary-light: #7dd3fc;
  --success: #22c55e; --success-dark: #16a34a; --success-light: #86efac;
  --danger: #f43f5e; --danger-dark: #e11d48; --danger-light: #fda4af;
  --warning: #f59e0b; --warning-dark: #d97706; --warning-light: #fcd34d;
  --info: #6366f1; --info-dark: #4f46e5; --info-light: #a5b4fc;
  --bg-dark: #0b0f19; --bg-darker: #070a12; --bg-card: #111827; --bg-card-hover: #1a2234;
  --bg-input: #1e293b; --bg-input-focus: #273449;
  --text: #ffffff; --text-bright: #f8fafc; --text-light: #e2e8f0; --text-muted: #94a3b8; --text-dim: #64748b;
  --border: #334155; --border-light: #475569;
  --shadow-sm: 0 2px 8px rgba(0,0,0,0.4); --shadow-md: 0 8px 30px rgba(0,0,0,0.5);
  --shadow-glow: 0 0 25px rgba(14,165,233,0.15);
  --radius-sm: 8px; --radius-md: 12px; --radius-lg: 16px; --radius-xl: 20px;
  --transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
}
* { margin:0; padding:0; box-sizing:border-box; -webkit-tap-highlight-color:transparent; }
html { font-size:16px; }
body { font-family:'Cairo',sans-serif; background: var(--bg-dark); color:var(--text); min-height:100vh; padding:12px; line-height:1.7; overflow-x:hidden; }
.container { max-width:900px; margin:0 auto; width:100%; }

.header { text-align:center; margin-bottom:24px; padding:28px 20px; background: linear-gradient(135deg, #0c4a6e 0%, #075985 30%, var(--primary-dark) 60%, #0369a1 100%); border-radius:var(--radius-xl); box-shadow: var(--shadow-glow), var(--shadow-md); position:relative; overflow:hidden; border: 1px solid rgba(14,165,233,0.2); }
.header h1 { font-size: clamp(1.4rem, 4.5vw, 2.1rem); font-weight:800; margin-bottom:8px; color: #ffffff; text-shadow: 0 2px 12px rgba(0,0,0,0.4); }
.header p { color: var(--primary-light); font-size: clamp(0.85rem, 2.5vw, 1rem); font-weight:600; }
.back-link { display:inline-block; margin-top:15px; color: var(--primary-light); text-decoration:none; font-weight:700; font-size:0.95rem; }
.back-link:hover { color: #ffffff; }

.card { background:var(--bg-card); border-radius:var(--radius-lg); padding: clamp(18px, 3vw, 28px); margin-bottom:18px; border:1px solid var(--border); box-shadow: var(--shadow-sm); }
.card-title { font-size: clamp(1.1rem, 3vw, 1.3rem); font-weight:800; margin-bottom:20px; display:flex; align-items:center; gap:10px; color:var(--text-bright); }

.form-group { display:flex; flex-direction:column; gap:8px; margin-bottom:16px; }
.form-group label { font-weight:700; color:var(--text-light); font-size: 0.95rem; }
.form-group textarea, .form-group input { background:var(--bg-input); border:2px solid var(--border); color:var(--text); padding:14px 16px; border-radius:var(--radius-md); font-size: 1rem; font-family:'Cairo',sans-serif; transition:var(--transition); width:100%; resize:vertical; }
.form-group textarea:focus, .form-group input:focus { outline:none; border-color:var(--primary); box-shadow:0 0 0 4px rgba(14,165,233,0.15); background: var(--bg-input-focus); }
.form-group textarea { min-height:120px; }

.btn { padding:14px 28px; border:none; border-radius:var(--radius-md); font-family:'Cairo',sans-serif; font-size: 1rem; font-weight:800; cursor:pointer; transition:var(--transition); display:inline-flex; align-items:center; justify-content:center; gap:10px; width:100%; text-decoration:none; }
@media(min-width:640px){ .btn { width:auto; } }
.btn-primary { background:linear-gradient(135deg, var(--primary), var(--primary-dark)); color:#ffffff; box-shadow:0 4px 20px rgba(14,165,233,0.35); }
.btn-primary:hover { transform:translateY(-2px); box-shadow:0 8px 30px rgba(14,165,233,0.45); }
.btn-primary:disabled { opacity:0.6; cursor:not-allowed; transform:none; }
.btn-secondary { background:linear-gradient(135deg, #475569, #334155); color:#ffffff; }

.chat-container { background:var(--bg-input); border-radius:var(--radius-md); padding:20px; min-height:300px; max-height:500px; overflow-y:auto; border:2px solid var(--border); margin-bottom:20px; }
.message { margin-bottom:16px; padding:14px 18px; border-radius:var(--radius-md); max-width:85%; word-wrap:break-word; line-height:1.8; }
.message.user { background:linear-gradient(135deg, var(--primary-dark), var(--primary)); color:#ffffff; margin-left:auto; text-align:right; }
.message.ai { background:var(--bg-card); color:var(--text-light); border:1px solid var(--border-light); margin-right:auto; text-align:right; }
.message.ai strong { color:var(--primary-light); }
.message.ai .loading { display:flex; align-items:center; gap:8px; color:var(--text-muted); }
.dot { width:8px; height:8px; background:var(--primary); border-radius:50%; animation:bounce 1.4s infinite ease-in-out both; }
.dot:nth-child(1) { animation-delay:-0.32s; }
.dot:nth-child(2) { animation-delay:-0.16s; }
@keyframes bounce { 0%,80%,100%{transform:scale(0);} 40%{transform:scale(1);} }

.status-bar { display:flex; align-items:center; gap:10px; padding:10px 16px; background:rgba(34,197,94,0.1); border:1px solid rgba(34,197,94,0.3); border-radius:var(--radius-md); margin-bottom:20px; }
.status-bar.online { color:var(--success-light); }
.status-bar.offline { color:var(--danger-light); background:rgba(244,63,94,0.1); border-color:rgba(244,63,94,0.3); }
.status-dot { width:10px; height:10px; border-radius:50%; background:var(--success); animation:pulse 2s infinite; }
@keyframes pulse { 0%{opacity:1;} 50%{opacity:0.5;} 100%{opacity:1;} }

.footer { text-align:center; padding:20px; color:var(--text-muted); font-size: 0.9rem; margin-top:20px; border-top:1px solid var(--border); }

.suggestion-chips { display:flex; flex-wrap:wrap; gap:10px; margin-bottom:20px; }
.chip { background:var(--bg-input); border:1px solid var(--border); color:var(--text-light); padding:8px 16px; border-radius:20px; font-size:0.85rem; cursor:pointer; transition:var(--transition); }
.chip:hover { background:var(--primary-dark); border-color:var(--primary); color:#ffffff; }
</style>
</head>
<body>

<div class="container">

<div class="header">
  <h1>🤖 تحليل الذكاء الاصطناعي</h1>
  <p>اسأل AI عن تحليل الأسهم، إدارة المخاطر، واستراتيجيات التداول</p>
  <a href="/" class="back-link">⬅️ العودة لحاسبة إدارة المخاطر</a>
</div>

<div class="card">
  <div class="status-bar online" id="statusBar">
    <span class="status-dot"></span>
    <span>AI متصل وجاهز للتحليل</span>
  </div>

  <div class="chat-container" id="chatContainer">
    <div class="message ai">
      <strong>👋 مرحباً!</strong><br>
      أنا مساعدك الذكي لتحليل الأسهم وإدارة المخاطر. يمكنك سؤالي عن:<br>
      • تحليل أي سهم في البورصة المصرية<br>
      • تقييم مخاطر صفقة محددة<br>
      • نصائح لإدارة المحفظة<br>
      • استراتيجيات دخول وخروج
    </div>
  </div>

  <div class="suggestion-chips">
    <span class="chip" onclick="setQuestion('حلل لي سهم COMI')">📊 تحليل COMI</span>
    <span class="chip" onclick="setQuestion('ما هي نسبة المخاطرة المثالية؟')">⚖️ نسبة المخاطرة</span>
    <span class="chip" onclick="setQuestion('نصائح لإدارة المحفظة')">💼 إدارة المحفظة</span>
    <span class="chip" onclick="setQuestion('استراتيجية وقف الخسارة')">🛑 وقف الخسارة</span>
  </div>

  <div class="form-group">
    <label>📝 سؤالك:</label>
    <textarea id="userInput" placeholder="اكتب سؤالك هنا... مثال: حلل لي سهم COMI وهل هو مناسب للشراء الآن؟"></textarea>
  </div>

  <div style="display:flex; gap:12px; flex-wrap:wrap;">
    <button class="btn btn-primary" id="sendBtn" onclick="sendMessage()">📤 إرسال</button>
    <button class="btn btn-secondary" onclick="clearChat()">🗑️ مسح المحادثة</button>
  </div>
</div>

<div class="footer">حاسبة إدارة المخاطر - تحليل فني شامل | 1.msr7oodar.workers.dev</div>

</div>

<script>
const chatContainer = document.getElementById('chatContainer');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const statusBar = document.getElementById('statusBar');

function setQuestion(text) {
  userInput.value = text;
  userInput.focus();
}

function addMessage(text, isUser) {
  const msg = document.createElement('div');
  msg.className = 'message ' + (isUser ? 'user' : 'ai');
  msg.innerHTML = text;
  chatContainer.appendChild(msg);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function showLoading() {
  const msg = document.createElement('div');
  msg.className = 'message ai';
  msg.id = 'loadingMsg';
  msg.innerHTML = '<div class="loading"><span class="dot"></span><span class="dot"></span><span class="dot"></span><span>جاري التحليل...</span></div>';
  chatContainer.appendChild(msg);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function hideLoading() {
  const loading = document.getElementById('loadingMsg');
  if (loading) loading.remove();
}

async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  addMessage(text, true);
  userInput.value = '';
  sendBtn.disabled = true;
  showLoading();

  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text })
    });

    hideLoading();

    if (!response.ok) {
      throw new Error('Network error');
    }

    const data = await response.json();

    if (data.error) {
      addMessage('❌ <strong>خطأ:</strong> ' + data.error, false);
    } else {
      addMessage(data.reply, false);
    }
  } catch (err) {
    hideLoading();
    addMessage('❌ <strong>عذراً:</strong> حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.<br><small style="color:var(--text-muted)">' + err.message + '</small>', false);
    statusBar.className = 'status-bar offline';
    statusBar.innerHTML = '<span style="width:10px;height:10px;border-radius:50%;background:var(--danger);"></span><span>AI غير متصل - تحقق من الاتصال</span>';
  }

  sendBtn.disabled = false;
}

function clearChat() {
  if (confirm('هل تريد مسح المحادثة؟')) {
    chatContainer.innerHTML = '<div class="message ai"><strong>👋 مرحباً!</strong><br>أنا مساعدك الذكي لتحليل الأسهم وإدارة المخاطر.</div>';
  }
}

userInput.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});
</script>

</body>
</html>`, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=3600'
        }
      });
    }

    // Serve main page (default)
    return new Response(`<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>حاسبة إدارة المخاطر - تحليل فني شامل</title>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>
:root {
  --primary: #0ea5e9; --primary-dark: #0284c7; --primary-light: #7dd3fc;
  --success: #22c55e; --success-dark: #16a34a; --success-light: #86efac; --success-bg: rgba(34,197,94,0.15);
  --danger: #f43f5e; --danger-dark: #e11d48; --danger-light: #fda4af; --danger-bg: rgba(244,63,94,0.15);
  --warning: #f59e0b; --warning-dark: #d97706; --warning-light: #fcd34d; --warning-bg: rgba(245,158,11,0.15);
  --info: #6366f1; --info-dark: #4f46e5; --info-light: #a5b4fc; --info-bg: rgba(99,102,241,0.15);
  --bg-dark: #0b0f19; --bg-darker: #070a12; --bg-card: #111827; --bg-card-hover: #1a2234;
  --bg-input: #1e293b; --bg-input-focus: #273449;
  --text: #ffffff; --text-bright: #f8fafc; --text-light: #e2e8f0; --text-muted: #94a3b8; --text-dim: #64748b;
  --border: #334155; --border-light: #475569;
  --shadow-sm: 0 2px 8px rgba(0,0,0,0.4); --shadow-md: 0 8px 30px rgba(0,0,0,0.5);
  --shadow-glow: 0 0 25px rgba(14,165,233,0.15); --shadow-success: 0 0 20px rgba(34,197,94,0.15);
  --shadow-danger: 0 0 20px rgba(244,63,94,0.15); --shadow-warning: 0 0 20px rgba(245,158,11,0.15);
  --radius-sm: 8px; --radius-md: 12px; --radius-lg: 16px; --radius-xl: 20px;
  --transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
}
* { margin:0; padding:0; box-sizing:border-box; -webkit-tap-highlight-color:transparent; }
html { font-size:16px; scroll-behavior:smooth; }
body { font-family:'Cairo',sans-serif; background: var(--bg-dark); color:var(--text); min-height:100vh; padding:12px; line-height:1.7; overflow-x:hidden; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
.container { max-width:1200px; margin:0 auto; width:100%; }

.header { text-align:center; margin-bottom:24px; padding:28px 20px; background: linear-gradient(135deg, #0c4a6e 0%, #075985 30%, var(--primary-dark) 60%, #0369a1 100%); border-radius:var(--radius-xl); box-shadow: var(--shadow-glow), var(--shadow-md); position:relative; overflow:hidden; border: 1px solid rgba(14,165,233,0.2); }
.header::before { content:''; position:absolute; top:-50%; left:-50%; width:200%; height:200%; background: radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px); background-size:24px 24px; opacity:0.4; animation: gridMove 20s linear infinite; }
@keyframes gridMove { 0%{transform:translate(0,0);} 100%{transform:translate(24px,24px);} }
.header h1 { font-size: clamp(1.4rem, 4.5vw, 2.1rem); font-weight:800; margin-bottom:8px; position:relative; color: #ffffff; text-shadow: 0 2px 12px rgba(0,0,0,0.4), 0 0 30px rgba(14,165,233,0.2); letter-spacing: -0.5px; }
.header p { color: var(--primary-light); font-size: clamp(0.85rem, 2.5vw, 1rem); position:relative; font-weight:600; text-shadow: 0 1px 4px rgba(0,0,0,0.3); }
.header .badge { display:inline-block; background:rgba(255,255,255,0.12); padding:6px 18px; border-radius:30px; font-size:0.8rem; margin-top:12px; backdrop-filter:blur(12px); border:1px solid rgba(255,255,255,0.15); color: #ffffff; font-weight: 700; text-shadow: 0 1px 2px rgba(0,0,0,0.2); }

.card { background:var(--bg-card); border-radius:var(--radius-lg); padding: clamp(18px, 3vw, 28px); margin-bottom:18px; border:1px solid var(--border); box-shadow: var(--shadow-sm); width:100%; transition:var(--transition); position:relative; overflow:hidden; }
.card:hover { border-color:var(--border-light); box-shadow: var(--shadow-md), 0 0 0 1px rgba(14,165,233,0.1); background: var(--bg-card-hover); }
.card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg, var(--primary), var(--success), var(--warning)); opacity:0; transition:var(--transition); }
.card:hover::before { opacity:1; }
.card-title { font-size: clamp(1.1rem, 3vw, 1.3rem); font-weight:800; margin-bottom:20px; display:flex; align-items:center; gap:10px; flex-wrap:wrap; color:var(--text-bright); text-shadow: 0 1px 2px rgba(0,0,0,0.2); }
.card-title .icon { font-size: clamp(1.3rem, 3vw, 1.5rem); filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)); }

.form-grid { display:grid; grid-template-columns:1fr; gap:14px; }
@media(min-width:640px){ .form-grid { grid-template-columns:repeat(2,1fr); gap:16px; } }
@media(min-width:900px){ .form-grid { grid-template-columns:repeat(3,1fr); } }
@media(min-width:1200px){ .form-grid { grid-template-columns:repeat(4,1fr); } }

.form-group { display:flex; flex-direction:column; gap:6px; }
.form-group label { font-weight:700; color:var(--text-light); font-size: clamp(0.85rem, 2.5vw, 0.95rem); text-shadow: 0 1px 2px rgba(0,0,0,0.2); }
.form-group input { background:var(--bg-input); border:2px solid var(--border); color:var(--text); padding:14px 16px; border-radius:var(--radius-md); font-size: clamp(0.95rem, 3vw, 1.05rem); font-family:'Cairo',sans-serif; transition:var(--transition); width:100%; -webkit-appearance:none; appearance:none; font-weight: 600; }
.form-group input::placeholder { color: var(--text-dim); opacity: 0.8; }
.form-group input:focus { outline:none; border-color:var(--primary); box-shadow:0 0 0 4px rgba(14,165,233,0.15), 0 0 20px rgba(14,165,233,0.1); background: var(--bg-input-focus); }
.hint { font-size: clamp(0.75rem, 2vw, 0.85rem); color:var(--text-muted); margin-top:4px; font-weight: 500; }

.btn { padding:14px 28px; border:none; border-radius:var(--radius-md); font-family:'Cairo',sans-serif; font-size: clamp(0.95rem, 3vw, 1.05rem); font-weight:800; cursor:pointer; transition:var(--transition); display:inline-flex; align-items:center; justify-content:center; gap:10px; width:100%; touch-action:manipulation; text-shadow: 0 1px 2px rgba(0,0,0,0.2); letter-spacing: 0.3px; text-decoration: none; -webkit-user-select: none; user-select: none; position: relative; z-index: 1; }
@media(min-width:640px){ .btn { width:auto; padding:14px 32px; } }
.btn-primary { background:linear-gradient(135deg, var(--primary), var(--primary-dark)); color:#ffffff; box-shadow:0 4px 20px rgba(14,165,233,0.35), 0 0 0 1px rgba(14,165,233,0.2); border: 1px solid rgba(14,165,233,0.3); }
.btn-primary:hover { transform:translateY(-2px); box-shadow:0 8px 30px rgba(14,165,233,0.45), 0 0 0 1px rgba(14,165,233,0.3); }
.btn-primary:active { transform:translateY(0); }
.btn-secondary { background:linear-gradient(135deg, #475569, #334155); color:#ffffff; border: 1px solid var(--border-light); box-shadow: 0 4px 15px rgba(0,0,0,0.2); }
.btn-secondary:hover { background:linear-gradient(135deg, #525f72, #3d4d5f); transform:translateY(-2px); box-shadow: 0 8px 25px rgba(0,0,0,0.3); }
.btn-secondary:active { transform:translateY(0); }

.btn-telegram { 
  background:linear-gradient(135deg, #229ED9, #1A8BC5); 
  color:#ffffff !important; 
  box-shadow:0 4px 20px rgba(34,158,217,0.35); 
  border: 1px solid rgba(34,158,217,0.3);
  position: relative;
  z-index: 10;
}
.btn-telegram:hover { 
  transform:translateY(-2px); 
  box-shadow:0 8px 30px rgba(34,158,217,0.45); 
  color:#ffffff !important;
}
.btn-telegram:active { transform:translateY(0); }
.btn-telegram-premium { 
  background:linear-gradient(135deg, #f59e0b, #d97706); 
  color:#ffffff !important; 
  box-shadow:0 4px 20px rgba(245,158,11,0.35); 
  border: 1px solid rgba(245,158,11,0.3);
  position: relative;
  z-index: 10;
}
.btn-telegram-premium:hover { 
  transform:translateY(-2px); 
  box-shadow:0 8px 30px rgba(245,158,11,0.45); 
  color:#ffffff !important;
}
.btn-telegram-premium:active { transform:translateY(0); }

.btn-group { display:flex; gap:12px; flex-wrap:wrap; margin-top:22px; justify-content:center; }
@media(min-width:640px){ .btn-group { flex-wrap:nowrap; } }
.telegram-group { display:flex; gap:12px; flex-wrap:wrap; margin-top:18px; justify-content:center; position: relative; z-index: 5; }

.results-grid { display:grid; grid-template-columns:1fr; gap:12px; }
@media(min-width:480px){ .results-grid { grid-template-columns:repeat(2,1fr); } }
@media(min-width:768px){ .results-grid { grid-template-columns:repeat(3,1fr); gap:16px; } }
@media(min-width:900px){ .results-grid { grid-template-columns:repeat(4,1fr); } }

.result-item { background:var(--bg-input); padding: clamp(16px, 3vw, 20px); border-radius:var(--radius-md); text-align:center; border:2px solid transparent; transition:var(--transition); position: relative; overflow: hidden; }
.result-item::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 3px; opacity: 0; transition: var(--transition); }
.result-item:hover { border-color:var(--border-light); transform:translateY(-3px); box-shadow: var(--shadow-sm); }
.result-item:hover::after { opacity: 1; }
.result-item .label { font-size: clamp(0.8rem, 2.5vw, 0.9rem); color:var(--text-muted); margin-bottom:8px; word-wrap:break-word; font-weight: 600; }
.result-item .value { font-size: clamp(1.3rem, 4vw, 1.7rem); font-weight:800; word-wrap:break-word; text-shadow: 0 2px 4px rgba(0,0,0,0.3); }
.result-item.positive { border-bottom-color: var(--success); }
.result-item.positive .value { color:var(--success-light); text-shadow: 0 0 10px rgba(34,197,94,0.3); }
.result-item.negative { border-bottom-color: var(--danger); }
.result-item.negative .value { color:var(--danger-light); text-shadow: 0 0 10px rgba(244,63,94,0.3); }
.result-item.neutral { border-bottom-color: var(--warning); }
.result-item.neutral .value { color:var(--warning-light); text-shadow: 0 0 10px rgba(245,158,11,0.3); }
.result-item.info { border-bottom-color: var(--info); }
.result-item.info .value { color:var(--info-light); text-shadow: 0 0 10px rgba(99,102,241,0.3); }

.alert { padding:14px 18px; border-radius:var(--radius-md); margin-top:14px; font-weight:700; display:none; align-items:center; gap:12px; font-size: clamp(0.85rem, 2.5vw, 0.95rem); word-wrap:break-word; text-shadow: 0 1px 2px rgba(0,0,0,0.2); }
.alert-danger { background:var(--danger-bg); border:2px solid var(--danger); color:#ffffff; box-shadow: var(--shadow-danger); }
.alert-warning { background:var(--warning-bg); border:2px solid var(--warning); color:#ffffff; box-shadow: var(--shadow-warning); }
.alert-success { background:var(--success-bg); border:2px solid var(--success); color:#ffffff; box-shadow: var(--shadow-success); display:none; }

.success-box { 
  background: linear-gradient(135deg, #064e3b 0%, #065f46 50%, #111827 100%); 
  border:2px solid var(--success); 
  border-radius:var(--radius-lg); 
  padding:32px 24px; 
  margin-top:20px; 
  text-align:center; 
  display:none; 
  box-shadow: var(--shadow-success), 0 8px 30px rgba(0,0,0,0.4); 
  position: relative; 
  overflow: hidden;
}
.success-box::before { 
  content: ''; 
  position: absolute; 
  top: -50%; 
  left: -50%; 
  width: 200%; 
  height: 200%; 
  background: radial-gradient(circle, rgba(34,197,94,0.08) 1px, transparent 1px); 
  background-size: 20px 20px; 
  opacity: 0.6; 
  pointer-events: none;
  z-index: 0;
}
.success-box h3 { 
  color:#ffffff; 
  font-size:1.6rem; 
  margin-bottom:16px; 
  font-weight: 800; 
  text-shadow: 0 2px 8px rgba(0,0,0,0.5); 
  position: relative;
  letter-spacing: 0.5px;
  z-index: 1;
}
.success-box p { 
  color:var(--text-light); 
  font-size:1.05rem; 
  line-height:2; 
  margin-bottom:22px; 
  font-weight: 600; 
  position: relative;
  text-shadow: 0 1px 3px rgba(0,0,0,0.3);
  z-index: 1;
}

.score-badge { display:inline-block; padding:12px 28px; border-radius:40px; font-size:1.3rem; font-weight:800; margin-bottom:18px; text-align:center; width:100%; text-shadow: 0 2px 4px rgba(0,0,0,0.3); letter-spacing: 0.5px; position: relative; overflow: hidden; }
.score-badge.strong { background:linear-gradient(135deg, rgba(34,197,94,0.2), rgba(34,197,94,0.05)); color:var(--success-light); border:2px solid var(--success); box-shadow: var(--shadow-success), inset 0 1px 0 rgba(255,255,255,0.1); }
.score-badge.medium { background:linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.05)); color:var(--warning-light); border:2px solid var(--warning); box-shadow: var(--shadow-warning), inset 0 1px 0 rgba(255,255,255,0.1); }
.score-badge.weak { background:linear-gradient(135deg, rgba(244,63,94,0.2), rgba(244,63,94,0.05)); color:var(--danger-light); border:2px solid var(--danger); box-shadow: var(--shadow-danger), inset 0 1px 0 rgba(255,255,255,0.1); }

.analysis-grid { display:grid; grid-template-columns:1fr; gap:12px; margin-top:18px; }
@media(min-width:480px){ .analysis-grid { grid-template-columns:repeat(2,1fr); } }
@media(min-width:768px){ .analysis-grid { grid-template-columns:repeat(3,1fr); } }

.analysis-item { background:var(--bg-input); padding:18px; border-radius:var(--radius-md); text-align:center; border:2px solid var(--border); transition:var(--transition); position: relative; overflow: hidden; }
.analysis-item::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; opacity: 0; transition: var(--transition); }
.analysis-item:hover { transform:translateY(-3px); border-color:var(--border-light); box-shadow: var(--shadow-sm); background: var(--bg-input-focus); }
.analysis-item:hover::before { opacity: 1; }
.analysis-item .label { font-size:0.85rem; color:var(--text-muted); margin-bottom:8px; font-weight: 700; }
.analysis-item .value { font-size:1.5rem; font-weight:800; text-shadow: 0 2px 4px rgba(0,0,0,0.3); }
.analysis-item .value.success { color:var(--success-light); text-shadow: 0 0 12px rgba(34,197,94,0.4); }
.analysis-item .value.danger { color:var(--danger-light); text-shadow: 0 0 12px rgba(244,63,94,0.4); }
.analysis-item .value.warning { color:var(--warning-light); text-shadow: 0 0 12px rgba(245,158,11,0.4); }
.analysis-item .value.info { color:var(--info-light); text-shadow: 0 0 12px rgba(99,102,241,0.4); }

.mini-verdict { display:inline-block; padding:4px 14px; border-radius:20px; font-size:0.8rem; font-weight:800; margin-top:8px; text-shadow: 0 1px 2px rgba(0,0,0,0.2); letter-spacing: 0.3px; }
.mini-verdict.safe { background:rgba(34,197,94,0.2); color:var(--success-light); border:1px solid rgba(34,197,94,0.4); box-shadow: 0 0 10px rgba(34,197,94,0.1); }
.mini-verdict.warning { background:rgba(245,158,11,0.2); color:var(--warning-light); border:1px solid rgba(245,158,11,0.4); box-shadow: 0 0 10px rgba(245,158,11,0.1); }
.mini-verdict.danger { background:rgba(244,63,94,0.2); color:var(--danger-light); border:1px solid rgba(244,63,94,0.4); box-shadow: 0 0 10px rgba(244,63,94,0.1); }

.recommendation-box { margin-top:20px; padding:18px 24px; background:linear-gradient(135deg, var(--bg-input), var(--bg-card)); border-radius:var(--radius-md); text-align:center; border: 2px solid var(--border); position: relative; overflow: hidden; }
.recommendation-box::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, var(--primary), var(--success), var(--warning), var(--danger)); opacity: 0.7; }
.recommendation-box strong { color: var(--primary-light); font-size: 1.1rem; text-shadow: 0 1px 2px rgba(0,0,0,0.2); }
.recommendation-box span { color: var(--text-light); font-weight: 600; font-size: 1rem; line-height: 1.8; }

.loading-overlay { position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(11,15,25,0.9); z-index:9999; display:none; align-items:center; justify-content:center; flex-direction:column; backdrop-filter: blur(8px); }
.loading-overlay.active { display:flex; }
.loading-spinner { width:56px; height:56px; border:4px solid var(--border); border-top-color:var(--primary); border-right-color:var(--primary-light); border-radius:50%; animation:spin 1s linear infinite; box-shadow: 0 0 20px rgba(14,165,233,0.2); }
@keyframes spin { to { transform:rotate(360deg); } }
.loading-text { color:var(--text); margin-top:20px; font-weight:800; font-size:1.2rem; text-shadow: 0 2px 4px rgba(0,0,0,0.3); }

.status-indicator { display:inline-flex; align-items:center; gap:8px; padding:5px 14px; border-radius:24px; font-size:0.8rem; font-weight:800; text-shadow: 0 1px 2px rgba(0,0,0,0.2); }
.status-fetched { background:rgba(34,197,94,0.15); color:var(--success-light); border: 1px solid rgba(34,197,94,0.3); }
.status-manual { background:rgba(245,158,11,0.15); color:var(--warning-light); border: 1px solid rgba(245,158,11,0.3); }
.status-error { background:rgba(244,63,94,0.15); color:var(--danger-light); border: 1px solid rgba(244,63,94,0.3); }

.formulas { background:linear-gradient(135deg, rgba(14,165,233,0.08), rgba(14,165,233,0.03)); border-radius:var(--radius-md); padding: clamp(14px, 3vw, 18px); margin-top:18px; font-size: clamp(0.8rem, 2.5vw, 0.9rem); line-height:1.9; word-wrap:break-word; border: 1px solid rgba(14,165,233,0.15); color: var(--text-light); font-weight: 600; }
.formulas strong { color:var(--primary-light); text-shadow: 0 0 8px rgba(14,165,233,0.2); }

.footer { text-align:center; padding:20px; color:var(--text-muted); font-size: clamp(0.8rem, 2.5vw, 0.9rem); margin-top:20px; border-top:1px solid var(--border); font-weight: 600; }
.privacy-text { text-align:center; font-size: clamp(0.75rem, 2vw, 0.85rem); color:var(--text-muted); margin-top:10px; font-weight: 600; }

::-webkit-scrollbar { width:8px; height:8px; }
::-webkit-scrollbar-track { background:var(--bg-darker); }
::-webkit-scrollbar-thumb { background:var(--border); border-radius:4px; }
::-webkit-scrollbar-thumb:hover { background:var(--primary); }

@keyframes fadeIn { from{opacity:0;transform:translateY(15px);} to{opacity:1;transform:translateY(0);} }
.fade-in { animation:fadeIn 0.6s ease-out; }

@media screen and (max-width:768px) { input, select, textarea { font-size:16px !important; } }
.divider { border-bottom:1px solid var(--border); margin-bottom:18px; padding-bottom:18px; }

a.btn, a.btn-telegram, a.btn-telegram-premium { 
  display: inline-flex; 
  text-align: center; 
  text-decoration: none;
  cursor: pointer;
  -webkit-tap-highlight-color: rgba(0,0,0,0);
}
a.btn-telegram, a.btn-telegram-premium { 
  color: #ffffff !important; 
}

.btn-fetch {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: #ffffff !important;
  box-shadow: 0 4px 20px rgba(139,92,246,0.35);
  border: 1px solid rgba(139,92,246,0.3);
  position: relative;
  z-index: 10;
}
.btn-fetch:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(139,92,246,0.45);
}
.btn-fetch:active {
  transform: translateY(0);
}
.btn-fetch:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.fetch-hint {
  animation: fadeIn 0.3s ease-out;
}
</style>
<base target="_blank">
</head>
<body>

<div class="loading-overlay" id="loadingOverlay">
  <div class="loading-spinner"></div>
  <div class="loading-text" id="loadingText">جاري التحميل...</div>
</div>

<div class="container">

<div class="header">
  <h1>📊 حاسبة إدارة المخاطر - تحليل فني شامل</h1>
  <p>حاسبة احترافية لحساب حجم الصفقة + تحليل الدعم والمقاومة + الرأي الفني</p>
  <span class="badge">✨ جلب تلقائي من مباشر</span>
<div style="margin-top:15px;">
    <a href="/ai" style="display:inline-block; background:linear-gradient(135deg, #8b5cf6, #7c3aed); color:#ffffff; padding:12px 28px; border-radius:30px; text-decoration:none; font-weight:800; font-size:1rem; box-shadow:0 4px 20px rgba(139,92,246,0.35); border:1px solid rgba(139,92,246,0.3); transition:all 0.3s;">
        🤖 تحليل ذكي بالذكاء الاصطناعي
    </a>
</div>
</div>

<div class="card">
  <div class="card-title"><span class="icon">📝</span>بيانات الصفقة</div>

  <div class="form-grid divider">
    <div class="form-group"><label>👤 الاسم الثنائي *</label><input id="fullName" placeholder="مثال: أحمد محمد" type="text" /></div>
    <div class="form-group"><label>📱 رقم الواتساب *</label><input id="whatsappNumber" inputmode="tel" placeholder="مثال: 01234567890" type="tel" /><span class="hint">أدخل رقمك مع كود الدولة</span></div>
    <div class="form-group"><label>📧 البريد الإلكتروني *</label><input id="leadEmail" placeholder="example@email.com" type="email" /></div>
  </div>
  <p class="privacy-text">🔒 بياناتك آمنة ولن نشاركها مع أي طرف ثالث</p>

  <div class="form-grid" style="margin-top:15px;">
    <div class="form-group"><label>🏷️ اسم السهم *</label><input id="stockName" placeholder="مثال: COMI" type="text" autocomplete="off" autocorrect="off" autocapitalize="characters" /><span class="hint">رمز السهم (مثال: COMI, HRHO, SWDY)</span><button type="button" class="btn btn-fetch" style="margin-top:8px; padding:10px 16px; font-size:0.9rem;" id="fetchBtn" onclick="handleStockFetch()">🔄 جلب البيانات</button></div>
    <div class="form-group"><label>💰 قيمة المحفظة</label><input id="portfolio" inputmode="decimal" placeholder="مثال: 10000" step="0.01" type="number" /></div>
    <div class="form-group"><label>📉 نسبة تحمل الخسارة (%)</label><input id="riskPercent" inputmode="decimal" placeholder="مثال: 2" step="0.01" type="number" /><span class="hint">العادة: 1-3% | مجازف: 5%</span></div>
    <div class="form-group"><label>🛒 سعر الشراء</label><input id="entryPrice" inputmode="decimal" placeholder="مثال: 150.50" step="0.01" type="number" /></div>
    <div class="form-group"><label>🛑 وقف الخسارة</label><input id="stopLoss" inputmode="decimal" placeholder="مثال: 145.00" step="0.01" type="number" /></div>
    <div class="form-group"><label>🎯 السعر المستهدف</label><input id="targetPrice" inputmode="decimal" placeholder="مثال: 165.00" step="0.01" type="number" /></div>
    <div class="form-group"><label>📊 عدد الأسهم</label><input id="sharesInput" inputmode="decimal" placeholder="مثال: 100" step="1" type="number" /><span class="hint">اتركه فارغاً لحسابه تلقائياً</span></div>
  </div>

  <div class="form-grid" style="margin-top:15px; border-top:1px solid var(--border); padding-top:15px;">
    <div class="form-group"><label>💵 السعر الحالي <span id="livePriceStatus" class="status-indicator status-manual">✏️ يدوي</span></label><input id="livePrice" inputmode="decimal" placeholder="جاري الجلب تلقائياً..." step="0.01" type="number" /></div>
    <div class="form-group"><label>🛡️ الدعم الأول (S1)</label><input id="s1" inputmode="decimal" placeholder="جاري الجلب تلقائياً..." step="0.01" type="number" /></div>
    <div class="form-group"><label>🛡️🛡️ الدعم الثاني (S2)</label><input id="s2" inputmode="decimal" placeholder="جاري الجلب تلقائياً..." step="0.01" type="number" /></div>
    <div class="form-group"><label>🚀 المقاومة الأولى (R1)</label><input id="r1" inputmode="decimal" placeholder="جاري الجلب تلقائياً..." step="0.01" type="number" /></div>
    <div class="form-group"><label>🚀🚀 المقاومة الثانية (R2)</label><input id="r2" inputmode="decimal" placeholder="جاري الجلب تلقائياً..." step="0.01" type="number" /></div>
  </div>

  <div class="btn-group">
    <button class="btn btn-primary" onclick="calculateAndAnalyze()">📈 حساب وتحليل</button>
    <button class="btn btn-secondary" onclick="clearAll()">🗑️ مسح الكل</button>
  </div>
</div>

<div class="card" id="resultsCard" style="display:none;">
  <div class="card-title"><span class="icon">📈</span>نتائج الحساب</div>
  <div class="results-grid">
    <div class="result-item neutral"><div class="label">📦 عدد الأسهم</div><div class="value" id="sharesResult">-</div></div>
    <div class="result-item neutral"><div class="label">💵 قيمة الصفقة</div><div class="value" id="tradeValue">-</div></div>
    <div class="result-item negative"><div class="label">📉 الخسارة المتوقعة</div><div class="value" id="expectedLoss">-</div></div>
    <div class="result-item positive"><div class="label">📈 الربح المتوقع</div><div class="value" id="expectedProfit">-</div></div>
    <div class="result-item neutral"><div class="label">⚖️ نسبة R:R</div><div class="value" id="riskReward">-</div></div>
    <div class="result-item neutral"><div class="label">📊 رأس المال المستخدم</div><div class="value" id="capitalUsed">-</div></div>
    <div class="result-item negative"><div class="label">📉 الخسارة من المحفظة</div><div class="value" id="lossFromPortfolio">-</div></div>
    <div class="result-item info"><div class="label">💵 السعر الحالي</div><div class="value" id="dispLivePrice">-</div></div>
  </div>

  <div class="alert alert-danger" id="warningAlert">⚠️ <strong>تم تقييد عدد الأسهم!</strong><br />قيمة الصفقة الأصلية كانت تتجاوز <strong>30%</strong> من المحفظة.<br />تم تقليل عدد الأسهم تلقائياً.</div>
  <div class="alert alert-warning" id="noteAlert">ℹ️ عدد الأسهم المحسوب يتجاوز الحد الأقصى (30%).<br />تم استخدام الحد الأقصى.</div>

  <div class="formulas"><strong>📐 المعادلات:</strong><br />عدد الأسهم (حسب الخسارة) = (المحفظة × نسبة الخسارة%) ÷ (الشراء − الوقف)<br />عدد الأسهم (الحد الأقصى) = (المحفظة × 30%) ÷ سعر الشراء<br /><strong>النهائي = الأقل من الاتنين</strong></div>
</div>

<div id="analysisResults"></div>

<div class="success-box" id="successBox">
  <h3>🙏 شكراً لك!</h3>
  <p>انضم الآن إلى جروب التوصيات للحصول على توصيات مباشرة،<br />نقاط دخول وخروج دقيقة، ومتابعة مستمرة للسوق أول بأول.</p>
  <div class="telegram-group">
    <a href="https://t.me/ellypham_yeksab" target="_blank" rel="noopener noreferrer" class="btn btn-telegram">💬 جروب مجاني</a>
    <a href="https://t.me/Magdy_27b" target="_blank" rel="noopener noreferrer" class="btn btn-telegram-premium">⭐ جروب VIP</a>
  </div>
</div>

<div class="footer">حاسبة إدارة المخاطر - تحليل فني شامل | 1.msr7oodar.workers.dev</div>

</div>

<script>
// ================================================================
//  CONFIG - Same as your working page (kk.html)
// ================================================================
const API_URL = "https://script.google.com/macros/s/AKfycbyTfOaUtzS6k0u9-miVmOn5_VapDMs3rZ9wbourErPkvvVO_8AqGgYabNo9E12QhdYENQ/exec";
const FORMSPREE_URL = 'https://formspree.io/f/xlgyrerd';

let currentResult = null;
let fetchedData = { livePrice: null, s1: null, s2: null, r1: null, r2: null, status: 'manual' };

function showLoading(text) {
  document.getElementById('loadingText').textContent = text || 'جاري التحميل...';
  document.getElementById('loadingOverlay').classList.add('active');
}
function hideLoading() {
  document.getElementById('loadingOverlay').classList.remove('active');
}

// ================================================================
//  FETCH PRICE - EXACTLY like kk.html (your working page)
// ================================================================
function fetchLivePrice(ticker) {
  var url = API_URL + "?ticker=" + encodeURIComponent(ticker) + "&_=" + Date.now();

  return fetch(url)
    .then(function(response) { return response.json(); })
    .then(function(data) {
      if (data.error) {
        throw new Error(data.error);
      }
      if (data.price && data.price !== "غير متوفر") {
        return {
          price: data.price,
          source: data.source || 'mubasher.info',
          time: data.time
        };
      }
      throw new Error('Price not available');
    });
}

// ================================================================
//  FETCH SUPPORT/RESISTANCE from Yahoo Finance (CORS-enabled)
// ================================================================
function fetchSupportResistance(ticker) {
  // Try .CA first, then .EG
  var suffixes = ['.CA', '.EG'];

  function trySuffix(index) {
    if (index >= suffixes.length) {
      return Promise.reject(new Error('Yahoo Finance failed for all suffixes'));
    }

    var yahooTicker = ticker + suffixes[index];
    var url = 'https://query1.finance.yahoo.com/v8/finance/chart/' + encodeURIComponent(yahooTicker) + '?interval=1d&range=1mo';

    return fetch(url, { headers: { 'Accept': 'application/json' }})
      .then(function(response) {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return response.json();
      })
      .then(function(data) {
        if (!data.chart || !data.chart.result || !data.chart.result[0]) {
          throw new Error('Invalid data');
        }

        var result = data.chart.result[0];
        var meta = result.meta;
        var price = meta.regularMarketPrice || meta.previousClose;

        var quote = result.indicators.quote[0];
        var highs = quote.high || [];
        var lows = quote.low || [];
        var closes = quote.close || [];

        var validHighs = [], validLows = [], validCloses = [];
        for (var i = 0; i < closes.length; i++) {
          if (closes[i] != null && !isNaN(closes[i])) {
            validCloses.push(closes[i]);
            if (highs[i] != null && !isNaN(highs[i])) validHighs.push(highs[i]);
            if (lows[i] != null && !isNaN(lows[i])) validLows.push(lows[i]);
          }
        }

        if (validCloses.length === 0) throw new Error('No valid data');

        var maxHigh = validHighs.length > 0 ? Math.max.apply(null, validHighs) : price * 1.05;
        var minLow = validLows.length > 0 ? Math.min.apply(null, validLows) : price * 0.95;
        var lastClose = validCloses[validCloses.length - 1];

        var pivot = (maxHigh + minLow + lastClose) / 3;
        var r1 = (2 * pivot) - minLow;
        var r2 = pivot + (maxHigh - minLow);
        var s1 = (2 * pivot) - maxHigh;
        var s2 = pivot - (maxHigh - minLow);

        return {
          support1: parseFloat(s1).toFixed(2),
          support2: parseFloat(s2).toFixed(2),
          resistance1: parseFloat(r1).toFixed(2),
          resistance2: parseFloat(r2).toFixed(2),
          pivot: parseFloat(pivot).toFixed(2),
          source: 'yahoo-finance'
        };
      })
      .catch(function(err) {
        return trySuffix(index + 1);
      });
  }

  return trySuffix(0);
}

// ================================================================
//  COMBINED FETCH: Price + Support/Resistance
// ================================================================
function fetchStockData(ticker) {
  ticker = ticker.trim().toUpperCase();

  // Step 1: Get price from your working API (same as kk.html)
  return fetchLivePrice(ticker)
    .then(function(priceData) {
      // Step 2: Try to get support/resistance from Yahoo
      return fetchSupportResistance(ticker)
        .then(function(srData) {
          return {
            lastPrice: priceData.price,
            support1: srData.support1,
            support2: srData.support2,
            resistance1: srData.resistance1,
            resistance2: srData.resistance2,
            source: 'mubasher+yahoo',
            note: 'السعر من Mubasher | الدعم/مقاومة من Yahoo'
          };
        })
        .catch(function(err) {
          // Yahoo failed, use approximate S/R based on price
          var price = parseFloat(priceData.price);
          return {
            lastPrice: priceData.price,
            support1: (price * 0.97).toFixed(2),
            support2: (price * 0.94).toFixed(2),
            resistance1: (price * 1.03).toFixed(2),
            resistance2: (price * 1.06).toFixed(2),
            source: 'mubasher-only',
            note: 'السعر من Mubasher | الدعم/مقاومة تقديرية'
          };
        });
    });
}

// ================================================================
//  AUTO FETCH (on blur)
// ================================================================
document.getElementById('stockName').addEventListener('blur', function() {
  var ticker = this.value.trim().toUpperCase();
  if (ticker.length >= 2) {
    handleAutoFetch(ticker);
  }
});

function handleAutoFetch(ticker) {
  showLoading('جاري جلب بيانات ' + ticker + '...');

  fetchStockData(ticker)
    .then(function(data) {
      fillFetchedData(data);
      document.getElementById('livePriceStatus').className = 'status-indicator status-fetched';
      document.getElementById('livePriceStatus').textContent = '✅ تم الجلب';
      showFetchMessage('✅ تم جلب البيانات بنجاح!', 'success');
      hideLoading();
    })
    .catch(function(err) {
      console.error('Auto fetch failed:', err);
      fetchedData.status = 'error';
      document.getElementById('livePriceStatus').className = 'status-indicator status-error';
      document.getElementById('livePriceStatus').textContent = '❌ أدخل يدوياً';
      hideLoading();
    });
}

// ================================================================
//  MANUAL BUTTON FETCH
// ================================================================
function handleStockFetch() {
  var ticker = document.getElementById('stockName').value.trim().toUpperCase();
  if (!ticker || ticker.length < 2) {
    alert('❌ من فضلك أدخل اسم السهم أولاً');
    return;
  }

  document.getElementById('stockName').blur();
  showLoading('جاري جلب بيانات ' + ticker + '...');

  fetchStockData(ticker)
    .then(function(data) {
      fillFetchedData(data);
      document.getElementById('livePriceStatus').className = 'status-indicator status-fetched';
      document.getElementById('livePriceStatus').textContent = '✅ تم الجلب';
      showFetchMessage('✅ تم جلب البيانات بنجاح! السعر: ' + data.lastPrice, 'success');
      hideLoading();
    })
    .catch(function(err) {
      console.error('Manual fetch failed:', err);
      fetchedData.status = 'error';
      document.getElementById('livePriceStatus').className = 'status-indicator status-error';
      document.getElementById('livePriceStatus').textContent = '❌ فشل الجلب - أدخل يدوياً';
      showFetchMessage('❌ تعذر جلب البيانات. يرجى إدخال السعر والدعم والمقاومة يدوياً.', 'error');
      hideLoading();
    });
}

function fillFetchedData(data) {
  document.getElementById('livePrice').value = data.lastPrice || '';
  document.getElementById('s1').value = data.support1 || '';
  document.getElementById('s2').value = data.support2 || '';
  document.getElementById('r1').value = data.resistance1 || '';
  document.getElementById('r2').value = data.resistance2 || '';

  fetchedData = { 
    livePrice: data.lastPrice || null, 
    s1: data.support1 || null, 
    s2: data.support2 || null, 
    r1: data.resistance1 || null, 
    r2: data.resistance2 || null, 
    status: 'fetched' 
  };
}

function showFetchMessage(msg, type) {
  var existing = document.querySelector('.fetch-hint');
  if (existing) existing.remove();

  var hint = document.createElement('div');
  hint.className = 'alert alert-' + (type === 'success' ? 'success' : 'warning') + ' fetch-hint';
  hint.style.display = 'flex';
  hint.style.marginTop = '10px';
  hint.innerHTML = msg;

  var card = document.getElementById('stockName').closest('.card');
  card.appendChild(hint);
  setTimeout(function() { hint.remove(); }, type === 'success' ? 4000 : 8000);
}

// ================================================================
//  CALCULATION & ANALYSIS (same as before)
// ================================================================
function validateEmail(email) {
  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+\$/.test(email);
}

function calculateAndAnalyze() {
  var fullName = document.getElementById('fullName').value.trim();
  var whatsappNumber = document.getElementById('whatsappNumber').value.trim();
  var leadEmail = document.getElementById('leadEmail').value.trim();
  if (!fullName) { alert('❌ من فضلك أدخل الاسم الثنائي'); document.getElementById('fullName').focus(); return; }
  var nameParts = fullName.split(/\\s+/).filter(function(n) { return n.length > 0; });
  if (nameParts.length < 2) { alert('❌ من فضلك أدخل الاسم الثنائي كامل'); document.getElementById('fullName').focus(); return; }
  if (!whatsappNumber) { alert('❌ من فضلك أدخل رقم الواتساب'); document.getElementById('whatsappNumber').focus(); return; }
  var cleanNumber = whatsappNumber.replace(/\\D/g, '');
  if (cleanNumber.length < 10) { alert('❌ رقم الواتساب غير صحيح'); document.getElementById('whatsappNumber').focus(); return; }
  if (!leadEmail || !validateEmail(leadEmail)) { alert('❌ من فضلك أدخل إيميل صحيح'); document.getElementById('leadEmail').focus(); return; }

  var stockName = document.getElementById('stockName').value.trim().toUpperCase();
  if (!stockName) { alert('❌ من فضلك أدخل اسم السهم'); document.getElementById('stockName').focus(); return; }

  var portfolio = parseFloat(document.getElementById('portfolio').value);
  var riskPercent = parseFloat(document.getElementById('riskPercent').value);
  var entryPrice = parseFloat(document.getElementById('entryPrice').value);
  var stopLoss = parseFloat(document.getElementById('stopLoss').value);
  var targetPrice = parseFloat(document.getElementById('targetPrice').value);
  var sharesInput = parseFloat(document.getElementById('sharesInput').value);
  var livePrice = parseFloat(document.getElementById('livePrice').value);
  var s1 = parseFloat(document.getElementById('s1').value);
  var s2 = parseFloat(document.getElementById('s2').value);
  var r1 = parseFloat(document.getElementById('r1').value);
  var r2 = parseFloat(document.getElementById('r2').value);

  if (!portfolio || !riskPercent || !entryPrice || !stopLoss || !targetPrice) {
    alert('❌ من فضلك أدخل جميع بيانات الصفقة'); return;
  }
  if (stopLoss >= entryPrice) { alert('❌ وقف الخسارة يجب أن يكون أقل من سعر الشراء'); return; }
  if (targetPrice <= entryPrice) { alert('❌ السعر المستهدف يجب أن يكون أعلى من سعر الشراء'); return; }

  var riskAmount = portfolio * (riskPercent / 100);
  var riskPerShare = entryPrice - stopLoss;
  var sharesByRisk = Math.floor(riskAmount / riskPerShare);
  var maxCapital = portfolio * 0.30;
  var sharesByMax = Math.floor(maxCapital / entryPrice);
  var finalShares = sharesInput && sharesInput > 0 ? sharesInput : Math.min(sharesByRisk, sharesByMax);
  var restricted = !sharesInput && sharesByRisk > sharesByMax;

  var tradeValue = finalShares * entryPrice;
  var expectedLoss = finalShares * riskPerShare;
  var profitPerShare = targetPrice - entryPrice;
  var expectedProfit = finalShares * profitPerShare;
  var riskReward = (profitPerShare / riskPerShare).toFixed(2);
  var capitalUsedPercent = ((tradeValue / portfolio) * 100).toFixed(2);
  var lossFromPortfolio = ((expectedLoss / portfolio) * 100).toFixed(2);

  currentResult = {
    portfolio: portfolio, riskPercent: riskPercent, entryPrice: entryPrice, stopLoss: stopLoss, targetPrice: targetPrice,
    shares: finalShares, tradeValue: tradeValue, expectedLoss: expectedLoss, expectedProfit: expectedProfit,
    riskReward: riskReward, capitalUsedPercent: capitalUsedPercent, lossFromPortfolio: lossFromPortfolio,
    stockName: stockName, livePrice: livePrice, s1: s1, s2: s2, r1: r1, r2: r2,
    date: new Date().toLocaleString('ar-EG'),
    restricted: restricted,
    fullName: fullName, whatsappNumber: cleanNumber, leadEmail: leadEmail
  };

  document.getElementById('sharesResult').textContent = finalShares.toLocaleString();
  document.getElementById('tradeValue').textContent = tradeValue.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}) + ' \$';
  document.getElementById('expectedLoss').textContent = expectedLoss.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}) + ' \$';
  document.getElementById('expectedProfit').textContent = expectedProfit.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}) + ' \$';
  document.getElementById('riskReward').textContent = '1:' + riskReward;
  document.getElementById('capitalUsed').textContent = capitalUsedPercent + '%';
  document.getElementById('lossFromPortfolio').textContent = lossFromPortfolio + '%';
  document.getElementById('dispLivePrice').textContent = (livePrice ? livePrice.toFixed(2) : '-') + ' \$';

  var warningAlert = document.getElementById('warningAlert');
  var noteAlert = document.getElementById('noteAlert');
  if (restricted) { warningAlert.style.display = 'flex'; noteAlert.style.display = 'flex'; }
  else { warningAlert.style.display = 'none'; noteAlert.style.display = 'none'; }

  document.getElementById('resultsCard').style.display = 'block';

  generateConciseAnalysis(stockName, entryPrice, stopLoss, targetPrice, finalShares, livePrice, s1, s2, r1, r2, portfolio, riskPercent);
  sendLeadData(fullName, cleanNumber, leadEmail, stockName, currentResult);
}

// ===== PROFESSIONAL RISK MANAGEMENT RECOMMENDATION ENGINE =====
function generateProfessionalRecommendation(name, entry, stop, target, qty, livePrice, s1, s2, r1, r2, totalCapital, riskPct, rrRatio, capitalUsed, tradeVsPortfolio, riskInTrade, score) {
  var rec = '<div class="recommendation-box" style="text-align:right; padding:24px;">';
  rec += '<div style="text-align:center; margin-bottom:20px;">';
  rec += '<strong style="font-size:1.3rem; color:var(--primary-light);">📋 تقرير إدارة المخاطر الاحترافي</strong>';
  rec += '<div style="margin-top:8px; font-size:0.9rem; color:var(--text-muted);">سهم: <span style="color:var(--text-bright); font-weight:800;">' + name + '</span> | تاريخ: ' + new Date().toLocaleDateString('ar-EG') + '</div>';
  rec += '</div>';

  rec += '<div style="background:rgba(14,165,233,0.08); border:1px solid rgba(14,165,233,0.2); border-radius:12px; padding:16px; margin-bottom:16px;">';
  rec += '<div style="color:var(--primary-light); font-weight:800; font-size:1.05rem; margin-bottom:12px; border-bottom:1px solid rgba(14,165,233,0.2); padding-bottom:8px;">⚖️ تحليل حجم المركز</div>';

  if (capitalUsed <= 20) {
    rec += '<div style="color:var(--success-light); margin-bottom:8px;">✅ <strong>حجم المركز ممتاز:</strong> تستخدم ' + capitalUsed.toFixed(2) + '% فقط من رأس المال.</div>';
  } else if (capitalUsed <= 30) {
    rec += '<div style="color:var(--warning-light); margin-bottom:8px;">⚠️ <strong>حجم المركز مقبول:</strong> تستخدم ' + capitalUsed.toFixed(2) + '% من رأس المال.</div>';
  } else {
    rec += '<div style="color:var(--danger-light); margin-bottom:8px;">❌ <strong>حجم المركز مرتفع:</strong> تستخدم ' + capitalUsed.toFixed(2) + '% من رأس المال.</div>';
  }

  if (riskPct <= 1) {
    rec += '<div style="color:var(--success-light);">✅ <strong>نسبة المخاطرة ممتازة:</strong> ' + riskPct.toFixed(2) + '% من المحفظة.</div>';
  } else if (riskPct <= 2) {
    rec += '<div style="color:var(--warning-light);">⚠️ <strong>نسبة المخاطرة مقبولة:</strong> ' + riskPct.toFixed(2) + '% من المحفظة.</div>';
  } else {
    rec += '<div style="color:var(--danger-light);">❌ <strong>نسبة المخاطرة مرتفعة:</strong> ' + riskPct.toFixed(2) + '% من المحفظة.</div>';
  }
  rec += '</div>';

  rec += '<div style="background:rgba(34,197,94,0.08); border:1px solid rgba(34,197,94,0.2); border-radius:12px; padding:16px; margin-bottom:16px;">';
  rec += '<div style="color:var(--success-light); font-weight:800; font-size:1.05rem; margin-bottom:12px; border-bottom:1px solid rgba(34,197,94,0.2); padding-bottom:8px;">📈 تحليل نسبة الربح/المخاطرة (R:R)</div>';

  var profitPct = ((target - entry) / entry) * 100;
  var lossPct = ((entry - stop) / entry) * 100;

  if (rrRatio >= 3) {
    rec += '<div style="color:var(--success-light); margin-bottom:8px;">✅ <strong>R:R ممتازة 1:' + rrRatio.toFixed(2) + '</strong></div>';
  } else if (rrRatio >= 2) {
    rec += '<div style="color:var(--success-light); margin-bottom:8px;">✅ <strong>R:R جيدة 1:' + rrRatio.toFixed(2) + '</strong></div>';
  } else if (rrRatio >= 1.5) {
    rec += '<div style="color:var(--warning-light); margin-bottom:8px;">⚠️ <strong>R:R ضعيفة 1:' + rrRatio.toFixed(2) + '</strong></div>';
  } else {
    rec += '<div style="color:var(--danger-light); margin-bottom:8px;">❌ <strong>R:R غير مقبولة 1:' + rrRatio.toFixed(2) + '</strong></div>';
  }
  rec += '</div>';

  rec += '<div style="background:rgba(99,102,241,0.08); border:1px solid rgba(99,102,241,0.2); border-radius:12px; padding:16px; margin-bottom:16px;">';
  rec += '<div style="color:var(--info-light); font-weight:800; font-size:1.05rem; margin-bottom:12px; border-bottom:1px solid rgba(99,102,241,0.2); padding-bottom:8px;">📊 تحليل المستويات الفنية</div>';

  if (livePrice > 0) {
    var entryDiff = ((livePrice - entry) / entry) * 100;
    if (livePrice <= entry * 1.02 && livePrice >= entry * 0.98) {
      rec += '<div style="color:var(--success-light); margin-bottom:8px;">✅ <strong>السعر الحالي مثالي للدخول:</strong> ' + livePrice.toFixed(2) + ' جنيه</div>';
    } else if (livePrice < entry * 0.98) {
      rec += '<div style="color:var(--warning-light); margin-bottom:8px;">⚠️ <strong>السعر الحالي أقل من سعر الشراء:</strong> ' + livePrice.toFixed(2) + ' جنيه</div>';
    } else {
      rec += '<div style="color:var(--danger-light); margin-bottom:8px;">❌ <strong>السعر الحالي أعلى من سعر الشراء:</strong> ' + livePrice.toFixed(2) + ' جنيه</div>';
    }
  }
  rec += '</div>';

  rec += '<div style="background:rgba(244,63,94,0.08); border:1px solid rgba(244,63,94,0.2); border-radius:12px; padding:16px; margin-bottom:16px;">';
  rec += '<div style="color:var(--danger-light); font-weight:800; font-size:1.05rem; margin-bottom:12px; border-bottom:1px solid rgba(244,63,94,0.2); padding-bottom:8px;">🛑 تحليل وقف الخسارة</div>';

  var stopDistance = ((entry - stop) / entry) * 100;
  if (stopDistance <= 3) {
    rec += '<div style="color:var(--success-light); margin-bottom:8px;">✅ <strong>وقف الخسارة محكم:</strong> ' + stopDistance.toFixed(2) + '% من سعر الشراء.</div>';
  } else if (stopDistance <= 5) {
    rec += '<div style="color:var(--warning-light); margin-bottom:8px;">⚠️ <strong>وقف الخسارة واسع:</strong> ' + stopDistance.toFixed(2) + '% من سعر الشراء.</div>';
  } else {
    rec += '<div style="color:var(--danger-light); margin-bottom:8px;">❌ <strong>وقف الخسارة واسع جداً:</strong> ' + stopDistance.toFixed(2) + '% من سعر الشراء.</div>';
  }
  rec += '</div>';

  rec += '<div style="background:linear-gradient(135deg, rgba(14,165,233,0.1), rgba(99,102,241,0.1)); border:2px solid var(--primary); border-radius:12px; padding:20px; text-align:center;">';
  rec += '<div style="font-size:1.2rem; font-weight:800; margin-bottom:12px;">';
  if (score >= 75) {
    rec += '<span style="color:var(--success-light);">✅ صفقة قوية ومُحسَّنة — يمكن الدخول بثقة</span>';
  } else if (score >= 50) {
    rec += '<span style="color:var(--warning-light);">⚠️ صفقة مقبولة — تطبيق التوصيات المذكورة أعلاه يُحسّن النتائج</span>';
  } else {
    rec += '<span style="color:var(--danger-light);">❌ صفقة عالية المخاطرة — يُنصح بالانتظار أو إعادة التقييم</span>';
  }
  rec += '</div>';
  rec += '<div style="color:var(--text-light); font-size:0.95rem; line-height:1.8;">';
  rec += 'التقييم العام: <strong style="color:var(--primary-light);">' + score + '/100</strong> | ';
  rec += 'R:R: <strong>1:' + rrRatio.toFixed(2) + '</strong> | ';
  rec += 'المخاطرة: <strong>' + riskPct.toFixed(2) + '%</strong>';
  rec += '</div>';
  rec += '</div>';
  rec += '</div>';
  return rec;
}

function generateConciseAnalysis(name, entry, stop, target, qty, livePrice, s1, s2, r1, r2, totalCapital, maxStockRiskPct) {
  var container = document.getElementById('analysisResults');
  container.innerHTML = '';

  var positionValue = entry * qty;
  var riskPerShare = entry - stop;
  var totalRisk = riskPerShare * qty;
  var riskPct = totalCapital > 0 ? (totalRisk / totalCapital) * 100 : 0;
  var rewardPerShare = target - entry;
  var rrRatio = riskPerShare > 0 ? (rewardPerShare / riskPerShare) : 0;

  var riskFromEntry = ((entry - stop) / entry) * 100;
  var riskFromLive = livePrice > 0 ? ((livePrice - stop) / livePrice) * 100 : 0;
  var distToS1 = s1 > 0 && livePrice > 0 ? ((livePrice - s1) / livePrice) * 100 : 0;
  var distToS2 = s2 > 0 && livePrice > 0 ? ((livePrice - s2) / livePrice) * 100 : 0;
  var distToR1 = r1 > 0 && livePrice > 0 ? ((r1 - livePrice) / livePrice) * 100 : 0;
  var distToR2 = r2 > 0 && livePrice > 0 ? ((r2 - livePrice) / livePrice) * 100 : 0;
  var distToTarget = ((target - entry) / entry) * 100;
  var distToTargetFromLive = livePrice > 0 ? ((target - livePrice) / livePrice) * 100 : 0;

  var score = 50;
  if (rrRatio >= 2) score += 20;
  else if (rrRatio >= 1.5) score += 10;
  else score -= 10;
  if (riskPct <= maxStockRiskPct * 0.5) score += 15;
  else if (riskPct <= maxStockRiskPct) score += 5;
  else score -= 20;
  if (livePrice > 0 && s1 > 0 && livePrice > s1) score += 5;
  if (livePrice > 0 && r1 > 0 && livePrice < r1) score += 5;
  if (livePrice > 0 && entry > 0 && livePrice <= entry * 1.02) score += 5;
  score = Math.max(0, Math.min(100, score));

  var scoreClass = score >= 70 ? 'strong' : score >= 40 ? 'medium' : 'weak';
  var scoreText = score >= 70 ? '✅ صفقة قوية' : score >= 40 ? '⚠️ صفقة متوسطة' : '❌ صفقة ضعيفة';

  var html = '<div class="card fade-in">';
  html += '<div class="card-title"><span class="icon">📊</span>التحليل الفني المُختصر - ' + name + '</div>';
  html += '<div class="score-badge ' + scoreClass + '">' + scoreText + ' (' + score + '%)</div>';
  html += '<div class="analysis-grid">';

  html += '<div class="analysis-item">';
  html += '<div class="label">📉 المخاطرة من الدخول</div>';
  html += '<div class="value ' + (riskFromEntry <= 3 ? 'success' : riskFromEntry <= 5 ? 'warning' : 'danger') + '">' + riskFromEntry.toFixed(2) + '%</div>';
  html += '<span class="mini-verdict ' + (riskFromEntry <= 3 ? 'safe' : riskFromEntry <= 5 ? 'warning' : 'danger') + '">' + (riskFromEntry <= 3 ? 'ممتاز' : riskFromEntry <= 5 ? 'مقبول' : 'مرتفع') + '</span>';
  html += '</div>';

  if (livePrice > 0) {
    html += '<div class="analysis-item">';
    html += '<div class="label">📉 المخاطرة من السعر الحالي</div>';
    html += '<div class="value ' + (riskFromLive <= 3 ? 'success' : riskFromLive <= 5 ? 'warning' : 'danger') + '">' + riskFromLive.toFixed(2) + '%</div>';
    html += '<span class="mini-verdict ' + (riskFromLive <= 3 ? 'safe' : riskFromLive <= 5 ? 'warning' : 'danger') + '">' + (riskFromLive <= 3 ? 'ممتاز' : riskFromLive <= 5 ? 'مقبول' : 'مرتفع') + '</span>';
    html += '</div>';
  }

  if (s1 > 0 && livePrice > 0) {
    html += '<div class="analysis-item">';
    html += '<div class="label">🛡️ المسافة للدعم الأول</div>';
    html += '<div class="value ' + (distToS1 <= 3 ? 'warning' : distToS1 <= 7 ? 'success' : 'info') + '">' + distToS1.toFixed(2) + '%</div>';
    html += '<span class="mini-verdict ' + (distToS1 <= 2 ? 'warning' : 'safe') + '">' + (distToS1 <= 2 ? 'قريب جداً' : 'آمن') + '</span>';
    html += '</div>';
  }

  if (s2 > 0 && livePrice > 0) {
    html += '<div class="analysis-item">';
    html += '<div class="label">🛡️🛡️ المسافة للدعم الثاني</div>';
    html += '<div class="value ' + (distToS2 <= 5 ? 'warning' : distToS2 <= 12 ? 'success' : 'info') + '">' + distToS2.toFixed(2) + '%</div>';
    html += '<span class="mini-verdict ' + (distToS2 <= 5 ? 'warning' : 'safe') + '">' + (distToS2 <= 5 ? 'قريب' : 'آمن') + '</span>';
    html += '</div>';
  }

  if (r1 > 0 && livePrice > 0) {
    html += '<div class="analysis-item">';
    html += '<div class="label">🚀 المسافة للمقاومة الأولى</div>';
    html += '<div class="value ' + (distToR1 <= 3 ? 'warning' : distToR1 <= 8 ? 'success' : 'info') + '">' + distToR1.toFixed(2) + '%</div>';
    html += '<span class="mini-verdict ' + (distToR1 <= 3 ? 'warning' : 'safe') + '">' + (distToR1 <= 3 ? 'قريب جداً' : 'مجال صعود') + '</span>';
    html += '</div>';
  }

  if (r2 > 0 && livePrice > 0) {
    html += '<div class="analysis-item">';
    html += '<div class="label">🚀🚀 المسافة للمقاومة الثانية</div>';
    html += '<div class="value ' + (distToR2 <= 5 ? 'warning' : distToR2 <= 15 ? 'success' : 'info') + '">' + distToR2.toFixed(2) + '%</div>';
    html += '<span class="mini-verdict ' + (distToR2 <= 5 ? 'warning' : 'safe') + '">' + (distToR2 <= 5 ? 'قريب' : 'مجال واسع') + '</span>';
    html += '</div>';
  }

  html += '<div class="analysis-item">';
  html += '<div class="label">🎯 المسافة للهدف من الدخول</div>';
  html += '<div class="value success">' + distToTarget.toFixed(2) + '%</div>';
  html += '<span class="mini-verdict safe">ربح متوقع</span>';
  html += '</div>';

  if (livePrice > 0) {
    html += '<div class="analysis-item">';
    html += '<div class="label">🎯 المسافة للهدف من السعر الحالي</div>';
    html += '<div class="value ' + (distToTargetFromLive > 0 ? 'success' : 'danger') + '">' + distToTargetFromLive.toFixed(2) + '%</div>';
    html += '<span class="mini-verdict ' + (distToTargetFromLive > 0 ? 'safe' : 'danger') + '">' + (distToTargetFromLive > 0 ? 'ربح متاح' : 'خسارة محتملة') + '</span>';
    html += '</div>';
  }

  html += '<div class="analysis-item">';
  html += '<div class="label">⚖️ نسبة الربح/المخاطرة</div>';
  html += '<div class="value ' + (rrRatio >= 2 ? 'success' : rrRatio >= 1.5 ? 'warning' : 'danger') + '">1:' + rrRatio.toFixed(2) + '</div>';
  html += '<span class="mini-verdict ' + (rrRatio >= 2 ? 'safe' : rrRatio >= 1.5 ? 'warning' : 'danger') + '">' + (rrRatio >= 2 ? 'ممتاز' : rrRatio >= 1.5 ? 'مقبول' : 'ضعيف') + '</span>';
  html += '</div>';

  html += '<div class="analysis-item">';
  html += '<div class="label">📊 المخاطرة من المحفظة</div>';
  html += '<div class="value ' + (riskPct <= maxStockRiskPct * 0.5 ? 'success' : riskPct <= maxStockRiskPct ? 'warning' : 'danger') + '">' + riskPct.toFixed(2) + '%</div>';
  html += '<span class="mini-verdict ' + (riskPct <= maxStockRiskPct ? 'safe' : 'danger') + '">' + (riskPct <= maxStockRiskPct ? 'ضمن الحد' : 'تتجاوز الحد') + '</span>';
  html += '</div>';

  var capitalUsed = ((positionValue / totalCapital) * 100);
  html += '<div class="analysis-item">';
  html += '<div class="label">💰 رأس المال المستخدم</div>';
  html += '<div class="value ' + (capitalUsed <= 20 ? 'success' : capitalUsed <= 30 ? 'warning' : 'danger') + '">' + capitalUsed.toFixed(2) + '%</div>';
  html += '<span class="mini-verdict ' + (capitalUsed <= 30 ? 'safe' : 'danger') + '">' + (capitalUsed <= 30 ? 'مقبول' : 'مرتفع') + '</span>';
  html += '</div>';

  var tradeVsPortfolio = ((tradeValue / totalCapital) * 100);
  html += '<div class="analysis-item">';
  html += '<div class="label">📊 قيمة الصفقة من المحفظة</div>';
  html += '<div class="value ' + (tradeVsPortfolio <= 25 ? 'success' : tradeVsPortfolio <= 30 ? 'warning' : 'danger') + '">' + tradeVsPortfolio.toFixed(2) + '%</div>';
  html += '<span class="mini-verdict ' + (tradeVsPortfolio <= 30 ? 'safe' : 'danger') + '">' + (tradeVsPortfolio <= 30 ? 'مقبول' : 'مرتفع') + '</span>';
  html += '</div>';

  var riskInTrade = tradeValue > 0 ? ((expectedLoss / tradeValue) * 100) : 0;
  html += '<div class="analysis-item">';
  html += '<div class="label">⚠️ نسبة المخاطرة في الصفقة</div>';
  html += '<div class="value ' + (riskInTrade <= 2 ? 'success' : riskInTrade <= 5 ? 'warning' : 'danger') + '">' + riskInTrade.toFixed(2) + '%</div>';
  html += '<span class="mini-verdict ' + (riskInTrade <= 5 ? 'safe' : 'danger') + '">' + (riskInTrade <= 2 ? 'ممتاز' : riskInTrade <= 5 ? 'مقبول' : 'مرتفع') + '</span>';
  html += '</div>';

  html += '</div>';

  var recommendation = generateProfessionalRecommendation(name, entry, stop, target, qty, livePrice, s1, s2, r1, r2, totalCapital, riskPct, rrRatio, capitalUsed, tradeVsPortfolio, riskInTrade, score);
  html += recommendation;

  html += '</div>';
  container.innerHTML = html;
}

function sendLeadData(name, whatsapp, email, stockName, resultData) {
  var data = {
    name: name, whatsapp: whatsapp, email: email, stock: stockName,
    portfolio: resultData.portfolio, riskPercent: resultData.riskPercent,
    entryPrice: resultData.entryPrice, stopLoss: resultData.stopLoss,
    targetPrice: resultData.targetPrice, shares: resultData.shares,
    tradeValue: resultData.tradeValue, expectedLoss: resultData.expectedLoss,
    expectedProfit: resultData.expectedProfit, riskReward: resultData.riskReward,
    livePrice: resultData.livePrice, s1: resultData.s1, s2: resultData.s2,
    r1: resultData.r1, r2: resultData.r2,
    source: 'Risk Calculator + Technical Analysis',
    date: new Date().toLocaleString('ar-EG'),
    _subject: 'Lead جديد - حاسبة إدارة المخاطر + تحليل فني'
  };
  fetch(FORMSPREE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(data)
  }).then(function(response) {
    if (response.ok) { 
      document.getElementById('successBox').style.display = 'block'; 
    }
    else { 
      document.getElementById('successBox').style.display = 'block';
    }
  }).catch(function(error) { 
    document.getElementById('successBox').style.display = 'block';
  });
}

function clearAll() {
  if (confirm('هل أنت متأكد من مسح جميع البيانات؟')) {
    currentResult = null;
    fetchedData = { livePrice: null, s1: null, s2: null, r1: null, r2: null, status: 'manual' };
    document.getElementById('fullName').value = '';
    document.getElementById('whatsappNumber').value = '';
    document.getElementById('leadEmail').value = '';
    document.getElementById('stockName').value = '';
    document.getElementById('portfolio').value = '';
    document.getElementById('riskPercent').value = '';
    document.getElementById('entryPrice').value = '';
    document.getElementById('stopLoss').value = '';
    document.getElementById('targetPrice').value = '';
    document.getElementById('sharesInput').value = '';
    document.getElementById('livePrice').value = '';
    document.getElementById('s1').value = '';
    document.getElementById('s2').value = '';
    document.getElementById('r1').value = '';
    document.getElementById('r2').value = '';
    document.getElementById('resultsCard').style.display = 'none';
    document.getElementById('successBox').style.display = 'none';
    document.getElementById('analysisResults').innerHTML = '';
    document.getElementById('livePriceStatus').className = 'status-indicator status-manual';
    document.getElementById('livePriceStatus').textContent = '✏️ يدوي';
  }
}
</script>
</body>
</html>`, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  }
};
