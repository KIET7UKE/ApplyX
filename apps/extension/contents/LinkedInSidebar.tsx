import * as React from 'react';
import { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import { Mail, Loader2, Send, Copy, Check, X, Settings, LogIn, Upload, Eye, EyeOff } from 'lucide-react';
import { Storage } from '@plasmohq/storage';

export const config: any = { matches: ['https://www.linkedin.com/*'] };
export const getShadowHostId = () => 'applyx-host';

const storage = new Storage();
type Step = 'url' | 'auth' | 'resume' | 'gmail' | 'done';

const CSS = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
@keyframes slideIn { from { transform: translateX(100%) } to { transform: translateX(0) } }
@keyframes spin { to { transform: rotate(360deg) } }

.toggle {
  position: fixed; right: 0; top: 50%; transform: translateY(-50%);
  z-index: 999999; background: #2563eb; color: #fff; border: none;
  padding: 16px 12px; border-radius: 14px 0 0 14px; cursor: pointer;
  box-shadow: -4px 0 24px rgba(37,99,235,0.4);
  display: flex; align-items: center; justify-content: center;
  transition: background .2s, padding .2s;
}
.toggle:hover { background: #1d4ed8; padding-right: 18px; }

.overlay {
  position: fixed; inset: 0; z-index: 999999;
  background: rgba(0,0,0,0.5); backdrop-filter: blur(4px);
  display: flex; justify-content: flex-end;
  animation: fadeIn .2s ease;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 14px; color: #0f172a;
}

.panel {
  width: 460px; max-width: 96vw; height: 100vh;
  background: #f8fafc; display: flex; flex-direction: column;
  box-shadow: -8px 0 40px rgba(0,0,0,0.15);
  animation: slideIn .35s cubic-bezier(.16,1,.3,1);
}

.hdr {
  background: linear-gradient(135deg,#1e40af,#2563eb);
  padding: 22px 20px; display: flex; justify-content: space-between;
  align-items: center; flex-shrink: 0;
}
.hdr-title { color: #fff; font-size: 1.3rem; font-weight: 900; letter-spacing: -.02em; }
.hdr-sub { color: rgba(255,255,255,.8); font-size: .7rem; font-weight: 600; text-transform: uppercase; letter-spacing: .1em; margin-top: 2px; }
.close {
  background: rgba(255,255,255,.15); border: none; color: #fff;
  width: 36px; height: 36px; border-radius: 10px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background .2s, transform .2s; flex-shrink: 0;
}
.close:hover { background: rgba(255,255,255,.3); transform: rotate(90deg); }

.body {
  flex: 1; overflow-y: auto; padding: 18px;
  display: flex; flex-direction: column; gap: 14px;
}

.card {
  background: #fff; padding: 20px; border-radius: 16px;
  border: 1px solid #e2e8f0; box-shadow: 0 1px 4px rgba(0,0,0,.04);
}

.lbl {
  display: block; font-size: .7rem; font-weight: 800; color: #64748b;
  text-transform: uppercase; letter-spacing: .1em; margin-bottom: 7px;
}

.inp {
  width: 100%; padding: 11px 14px; border-radius: 10px;
  border: 2px solid #e2e8f0; background: #fff; font-size: .9rem;
  color: #0f172a; outline: none; font-family: inherit;
  transition: border-color .2s; display: block;
}
.inp:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,.12); }
.inp.ta { resize: none; min-height: 180px; }

.btn {
  width: 100%; padding: 13px; border: none; border-radius: 12px;
  font-weight: 800; font-size: .9rem; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  gap: 8px; font-family: inherit; transition: all .2s;
  letter-spacing: .02em;
}
.btn:disabled { opacity: .6; cursor: not-allowed; transform: none !important; }
.btn-blue { background: #2563eb; color: #fff; box-shadow: 0 4px 14px -4px rgba(37,99,235,.4); }
.btn-blue:hover:not(:disabled) { background: #1d4ed8; transform: translateY(-1px); }
.btn-gray { background: #f1f5f9; color: #475569; }
.btn-gray:hover:not(:disabled) { background: #e2e8f0; }

.ftr {
  padding: 12px 18px; border-top: 1px solid #e2e8f0;
  background: #fff; display: flex; align-items: center;
  gap: 10px; flex-shrink: 0;
}
.ftr-txt { flex: 1; font-size: .7rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .08em; }
.cfg { font-size: .7rem; font-weight: 700; color: #2563eb; background: none; border: none; cursor: pointer; padding: 4px 8px; border-radius: 6px; display: flex; align-items: center; gap: 4px; font-family: inherit; }
.cfg:hover { background: #eff6ff; }

.hint { font-size: .72rem; color: #64748b; line-height: 1.5; margin-top: 6px; }
.info { padding: 10px 12px; background: #eff6ff; border-radius: 8px; font-size: .72rem; color: #1e40af; line-height: 1.6; margin-top: 10px; }
.err { color: #b91c1c; font-size: .78rem; margin-top: 8px; }
.row { display: flex; gap: 10px; }
.gap8 { height: 8px; }
.gap14 { height: 14px; }
.spin { animation: spin 1s linear infinite; }
.icon-ring { width: 48px; height: 48px; background: #eff6ff; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 14px; }
.center { text-align: center; }
.rel { position: relative; }
.eye { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #94a3b8; display: flex; }
`;

// ── Tiny components ────────────────────────────────────────────────────────
const Lbl = ({c}: {c: string}) => <label className="lbl">{c}</label>;
const Inp = ({ta, ...p}: any) => ta ? <textarea className="inp ta" {...p}/> : <input className="inp" {...p}/>;
const BtnBlue = ({children, ...p}: any) => <button className="btn btn-blue" {...p}>{children}</button>;
const BtnGray = ({children, ...p}: any) => <button className="btn btn-gray" {...p}>{children}</button>;
const Card = ({children, style}: any) => <div className="card" style={style}>{children}</div>;

const LinkedInSidebar = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>('done');
  const [url, setUrl] = useState('');
  const [urlIn, setUrlIn] = useState('');
  const [tok, setTok] = useState('');
  const [name, setName] = useState('');
  const [gmailOk, setGmailOk] = useState(false);
  const [polling, setPolling] = useState(false);
  const [pollMsg, setPollMsg] = useState('');
  const pollRef = useRef(false);
  const [gEmail, setGEmail] = useState('');
  const [gPass, setGPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [gSaving, setGSaving] = useState(false);
  const [gErr, setGErr] = useState('');
  const [resume, setResume] = useState<File|null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailBody, setEmailBody] = useState('');
  const [emailSubj, setEmailSubj] = useState('');
  const [genErr, setGenErr] = useState('');
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  const [review, setReview] = useState(false);
  const [toEmail, setToEmail] = useState('');
  const [author, setAuthor] = useState('');
  const [postTxt, setPostTxt] = useState('');

  const checkProfile = useCallback(async (u: string, t: string): Promise<Step|null> => {
    try {
      const [p, r] = await Promise.all([
        axios.get(`${u}/api/user/profile`, {headers:{Authorization:`Bearer ${t}`}, timeout:8000}),
        axios.get(`${u}/api/resume/status`, {headers:{Authorization:`Bearer ${t}`}, timeout:8000}),
      ]);
      setName(p.data.name || '');
      setGmailOk(!!p.data.gmailEmail);
      if (p.data.gmailEmail) setGEmail(p.data.gmailEmail);
      if (!r.data.exists) return 'resume';
      if (!p.data.gmailEmail) return 'gmail';
      return 'done';
    } catch { return null; }
  }, []);

  useEffect(() => {
    (async () => {
      const u = (await storage.get('backendUrl') as string) || '';
      const t = (await storage.get('supabaseToken') as string) || '';
      setUrl(u); setUrlIn(u); setTok(t);
      if (!u) { setStep('url'); return; }
      if (!t) { setStep('auth'); return; }
      const s = await checkProfile(u, t);
      if (!s) { await storage.remove('supabaseToken'); setTok(''); setStep('auth'); }
      else setStep(s);
    })();

    storage.watch({ triggerSidebar: (c) => {
      if (c.newValue) {
        setAuthor(c.newValue.author || '');
        setPostTxt(c.newValue.postText || '');
        setToEmail(c.newValue.email || '');
        setOpen(true); setReview(true); setGenErr('');
        storage.set('triggerSidebar', null);
      }
    }});
  }, [checkProfile]);

  useEffect(() => {
    const h = async (e: MessageEvent) => {
      if (e.data?.type === 'APPLYX_TOKEN' && e.data?.token) {
        const t = e.data.token;
        await storage.set('supabaseToken', t);
        setTok(t); pollRef.current = false; setPolling(false);
        const u = (await storage.get('backendUrl') as string) || url;
        if (u) { const s = await checkProfile(u, t); if (s) setStep(s); }
      }
    };
    window.addEventListener('message', h);
    return () => window.removeEventListener('message', h);
  }, [checkProfile, url]);

  const startPoll = useCallback((u: string) => {
    pollRef.current = true; setPolling(true); setPollMsg('Waiting for login...');
    let n = 0;
    const iv = setInterval(async () => {
      if (!pollRef.current) { clearInterval(iv); return; }
      if (++n > 60) { clearInterval(iv); pollRef.current = false; setPolling(false); return; }
      const t = await storage.get('supabaseToken') as string;
      if (t) {
        clearInterval(iv); pollRef.current = false; setPolling(false);
        setTok(t);
        const s = await checkProfile(u, t);
        if (s) setStep(s);
      } else setPollMsg(`Waiting for login... (${n})`);
    }, 2000);
  }, [checkProfile]);

  const openLogin = async () => {
    if (!url) { alert('Save your backend URL first'); return; }
    try { chrome.tabs.create({ url: `${url}/auth-callback` }); }
    catch { window.open(`${url}/auth-callback`, '_blank'); }
    startPoll(url);
  };

  const saveUrl = async () => {
    const c = urlIn.replace(/\/$/, '').trim();
    if (!c.startsWith('http')) { alert('Enter a valid https:// URL'); return; }
    await storage.set('backendUrl', c); setUrl(c); setStep('auth');
  };

  const uploadResume = async () => {
    if (!resume) return;
    setUploading(true);
    try {
      const fd = new FormData(); fd.append('file', resume);
      await axios.post(`${url}/api/resume/upload`, fd, {headers:{Authorization:`Bearer ${tok}`}, timeout:30000});
      setResume(null); setStep(gmailOk ? 'done' : 'gmail');
    } catch (e: any) { alert(e.response?.data?.error || 'Upload failed'); }
    finally { setUploading(false); }
  };

  const saveGmail = async () => {
    if (!gEmail || !gPass) { setGErr('Both fields required.'); return; }
    setGSaving(true); setGErr('');
    try {
      await axios.post(`${url}/api/user/gmail`, {gmailEmail:gEmail, gmailAppPassword:gPass}, {headers:{Authorization:`Bearer ${tok}`}, timeout:15000});
      setGmailOk(true); setStep('done');
    } catch (e: any) { setGErr(e.response?.data?.error || 'Failed'); }
    finally { setGSaving(false); }
  };

  const generate = async () => {
    if (!postTxt || !author) { setGenErr('Fill all fields.'); return; }
    setLoading(true); setGenErr(''); setReview(false);
    try {
      const {data} = await axios.post(`${url}/api/generate-email`, {postText:postTxt, authorName:author}, {headers:{Authorization:`Bearer ${tok}`}, timeout:30000});
      setEmailSubj(data.subject || ''); setEmailBody(data.body || '');
    } catch (e: any) { setGenErr(e.response?.data?.error || 'Generation failed'); }
    finally { setLoading(false); }
  };

  const copy = () => {
    navigator.clipboard.writeText(`${emailSubj}\n\n${emailBody}`);
    setCopied(true); setTimeout(()=>setCopied(false), 2000);
  };

  const sendEmail = async () => {
    if (!toEmail) { alert('Enter recipient email'); return; }
    setSending(true);
    try {
      await axios.post(`${url}/api/send-email`, {to:toEmail, subject:emailSubj, body:emailBody}, {headers:{Authorization:`Bearer ${tok}`}, timeout:30000});
      alert('Email sent!'); setOpen(false);
    } catch (e: any) { alert('Failed: ' + (e.response?.data?.error || e.message)); }
    finally { setSending(false); }
  };

  const renderSetup = () => {
    if (step === 'url') return (
      <Card>
        <Lbl c="Vercel URL" />
        <Inp placeholder="https://your-app.vercel.app" value={urlIn} onChange={(e:any)=>setUrlIn(e.target.value)} />
        <p className="hint">Your deployed ApplyX web app URL.</p>
        <div className="gap14"/><BtnBlue onClick={saveUrl}>Save & Continue</BtnBlue>
      </Card>
    );

    if (step === 'auth') return (
      <Card>
        <div className="center" style={{padding:'10px 0 8px'}}>
          <div className="icon-ring"><LogIn size={22} color="#2563eb"/></div>
          <p style={{fontWeight:800, fontSize:'1rem', marginBottom:8}}>Login Required</p>
          <p className="hint" style={{marginBottom:18}}>
            Click below — sign in with Google on the opened tab, then come back here.
          </p>
          {polling ? (
            <>
              <Loader2 size={28} color="#2563eb" className="spin" style={{display:'block',margin:'0 auto 10px'}}/>
              <p style={{fontSize:'.8rem',color:'#2563eb',fontWeight:700}}>{pollMsg}</p>
              <p className="hint">Complete sign in on the dashboard tab</p>
              <button onClick={()=>{pollRef.current=false;setPolling(false);}} style={{marginTop:12,fontSize:'.72rem',color:'#94a3b8',background:'none',border:'none',cursor:'pointer',textDecoration:'underline'}}>Cancel</button>
            </>
          ) : (
            <>
              <BtnBlue onClick={openLogin}><LogIn size={15}/>Open Dashboard & Login</BtnBlue>
              <p className="hint" style={{marginTop:10}}>Panel updates automatically after login</p>
            </>
          )}
        </div>
      </Card>
    );

    if (step === 'resume') return (
      <Card>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
          <div style={{width:34,height:34,background:'#eff6ff',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center'}}><Upload size={16} color="#2563eb"/></div>
          <p style={{fontWeight:800}}>Upload Resume</p>
        </div>
        <p className="hint" style={{marginBottom:14}}>Your PDF resume powers the AI generation.</p>
        <input type="file" accept="application/pdf" onChange={(e:any)=>setResume(e.target.files?.[0]||null)} style={{width:'100%',fontSize:'.85rem',marginBottom:12}}/>
        {resume && <BtnBlue onClick={uploadResume} disabled={uploading}>{uploading?<><Loader2 size={14} className="spin"/>Uploading...</>:`Upload "${resume.name}"`}</BtnBlue>}
      </Card>
    );

    if (step === 'gmail') return (
      <Card>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16}}>
          <div style={{width:34,height:34,background:'#eff6ff',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center'}}><Mail size={16} color="#2563eb"/></div>
          <p style={{fontWeight:800}}>Connect Gmail</p>
        </div>
        <Lbl c="Gmail Address"/>
        <Inp type="email" placeholder="you@gmail.com" value={gEmail} onChange={(e:any)=>setGEmail(e.target.value)}/>
        <div className="gap8"/>
        <Lbl c="App Password"/>
        <div className="rel">
          <Inp type={showPass?'text':'password'} placeholder="xxxx xxxx xxxx xxxx" value={gPass} onChange={(e:any)=>setGPass(e.target.value)} style={{paddingRight:40}}/>
          <button className="eye" onClick={()=>setShowPass(!showPass)}>{showPass?<EyeOff size={15}/>:<Eye size={15}/>}</button>
        </div>
        <div className="info"><strong>Get App Password:</strong><br/>myaccount.google.com/apppasswords</div>
        {gErr && <p className="err">{gErr}</p>}
        <div className="gap14"/>
        <BtnBlue onClick={saveGmail} disabled={gSaving}>{gSaving?<><Loader2 size={14} className="spin"/>Verifying...</>:'Connect Gmail'}</BtnBlue>
      </Card>
    );
    return null;
  };

  const done = step === 'done';

  return (
    <>
      <style>{CSS}</style>

      {!open && (
        <button className="toggle" onClick={()=>setOpen(true)} title="ApplyX">
          <Mail size={24} color="white"/>
        </button>
      )}

      {open && (
        <div className="overlay" onClick={()=>setOpen(false)}>
          <div className="panel" onClick={e=>e.stopPropagation()}>

            <div className="hdr">
              <div>
                <div className="hdr-title">ApplyX</div>
                <div className="hdr-sub">1-Click AI Job Outreach</div>
              </div>
              <button className="close" onClick={()=>setOpen(false)}><X size={18} color="white"/></button>
            </div>

            <div className="body">
              {!done ? renderSetup() :
              review ? (
                <Card>
                  <Lbl c="Recipient Email"/>
                  <Inp placeholder="recipient@email.com" value={toEmail} onChange={(e:any)=>setToEmail(e.target.value)}/>
                  <div className="gap8"/>
                  <Lbl c="Author Name"/>
                  <Inp value={author} onChange={(e:any)=>setAuthor(e.target.value)}/>
                  <div className="gap8"/>
                  <Lbl c="Post Context"/>
                  <Inp ta value={postTxt} onChange={(e:any)=>setPostTxt(e.target.value)}/>
                  <div className="gap14"/>
                  <BtnBlue onClick={generate}><Send size={14}/>Generate Email</BtnBlue>
                </Card>
              ) :
              loading ? (
                <div className="center" style={{padding:'60px 0'}}>
                  <Loader2 size={44} color="#2563eb" className="spin" style={{display:'block',margin:'0 auto 18px'}}/>
                  <p style={{fontWeight:700,fontSize:'1rem'}}>Writing your email...</p>
                  <p className="hint" style={{marginTop:6}}>Crafting a personalized message</p>
                </div>
              ) :
              genErr ? (
                <Card>
                  <p style={{color:'#b91c1c',textAlign:'center',fontWeight:600,marginBottom:14}}>{genErr}</p>
                  <BtnGray onClick={()=>{setGenErr('');setReview(true);}}>Try Again</BtnGray>
                </Card>
              ) :
              emailBody ? (
                <>
                  <Card><Lbl c="To"/><Inp value={toEmail} onChange={(e:any)=>setToEmail(e.target.value)} placeholder="recipient@email.com"/></Card>
                  <Card><Lbl c="Subject"/><Inp value={emailSubj} onChange={(e:any)=>setEmailSubj(e.target.value)} style={{fontWeight:700}}/></Card>
                  <Card><Lbl c="Message"/><Inp ta value={emailBody} onChange={(e:any)=>setEmailBody(e.target.value)}/></Card>
                  <div className="row">
                    <BtnGray onClick={copy} style={{flex:1}}>
                      {copied?<><Check size={14} color="#10b981"/>Copied!</>:<><Copy size={14}/>Copy</>}
                    </BtnGray>
                    <BtnBlue onClick={sendEmail} disabled={sending} style={{flex:2}}>
                      {sending?<><Loader2 size={14} className="spin"/>Sending...</>:<><Send size={14}/>Send Email</>}
                    </BtnBlue>
                  </div>
                </>
              ) : (
                <Card style={{textAlign:'center',padding:'36px 20px'}}>
                  <div className="icon-ring"><Mail size={22} color="#2563eb"/></div>
                  <p style={{fontWeight:800,fontSize:'1rem',marginBottom:8}}>Ready to go!</p>
                  <p className="hint">Click <strong>ApplyX Outreach</strong> on any LinkedIn post to start.</p>
                </Card>
              )}
            </div>

            <div className="ftr">
              <span className="ftr-txt">ApplyX v2.0{done&&name?` • ${name}`:''}</span>
              <button className="cfg" onClick={()=>{setStep('url');pollRef.current=false;setPolling(false);}}>
                <Settings size={11}/>Config
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default LinkedInSidebar;
