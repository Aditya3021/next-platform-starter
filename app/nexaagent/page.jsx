'use client';

import { useState } from 'react';

const features = [
  ['01', 'Instant response', 'Answer common enquiries 24/7 so hot leads never wait for business hours.'],
  ['02', 'Lead qualification', 'Collect intent, budget, location and timeline before handing the conversation to your team.'],
  ['03', 'Follow-up engine', 'Keep prospects moving with structured follow-ups instead of manual reminders.'],
  ['04', 'Human handoff', 'Escalate high-intent or sensitive conversations to a real person at the right moment.'],
];

const niches = ['Clinics', 'Education', 'Real estate', 'Local services'];

export default function NexaAgentPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', business: '', phone: '', niche: 'Clinic', enquiries: '10–50/day' });

  function submit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className="pb-20">
      <nav className="flex items-center justify-between py-6">
        <div className="text-xl font-black tracking-tight">Nexa<span className="text-teal-300">Agent</span></div>
        <a href="#pilot" className="rounded-full bg-teal-300 px-4 py-2 text-sm font-bold text-slate-950">Book pilot</a>
      </nav>

      <section className="grid gap-12 py-14 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
        <div>
          <div className="mb-6 inline-flex rounded-full border border-teal-300/20 bg-teal-300/10 px-3 py-1 text-xs font-semibold text-teal-200">AI revenue automation for Indian SMBs</div>
          <h1 className="max-w-3xl text-5xl font-black leading-[1.02] tracking-tight sm:text-7xl">
            Turn every enquiry into a <span className="text-teal-300">follow-up.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            NexaAgent gives growing businesses an AI front desk that answers questions, qualifies leads and follows up automatically—while your team stays in control.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#pilot" className="rounded-xl bg-teal-300 px-6 py-3.5 font-bold text-slate-950">Start a 14-day pilot →</a>
            <a href="#demo" className="rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 font-semibold text-slate-200">See how it works</a>
          </div>
          <div className="mt-8 flex flex-wrap gap-5 text-sm text-slate-400">
            <span>✓ 24/7 first response</span><span>✓ Human handoff</span><span>✓ No long contracts</span>
          </div>
        </div>

        <div id="demo" className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div><p className="text-xs text-slate-500">LIVE AGENT DEMO</p><p className="font-bold">Sunrise Clinic</p></div>
            <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs text-emerald-300">● Online</span>
          </div>
          <div className="space-y-4 py-5 text-sm">
            <div className="ml-auto max-w-[80%] rounded-2xl rounded-br-sm bg-teal-300 px-4 py-3 text-slate-950">Hi, I need an appointment for knee pain.</div>
            <div className="max-w-[84%] rounded-2xl rounded-bl-sm bg-slate-800 px-4 py-3 text-slate-200">I can help. What day works best, and is this a new consultation?</div>
            <div className="ml-auto max-w-[80%] rounded-2xl rounded-br-sm bg-teal-300 px-4 py-3 text-slate-950">Tomorrow evening. New consultation.</div>
            <div className="max-w-[84%] rounded-2xl rounded-bl-sm bg-slate-800 px-4 py-3 text-slate-200">Great. I’ve captured your request. A team member can confirm the available slot.</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
            <div className="flex justify-between text-xs"><span className="text-slate-500">Lead intent</span><span className="text-teal-300">High</span></div>
            <div className="mt-2 h-2 rounded-full bg-white/10"><div className="h-2 w-[88%] rounded-full bg-teal-300"/></div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(([n, title, copy]) => <div key={n} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"><span className="text-xs font-bold text-teal-300">{n}</span><h2 className="mt-3 text-lg font-bold">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-400">{copy}</p></div>)}
      </section>

      <section className="py-20">
        <div className="mb-7"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">Built for enquiry-heavy businesses</p><h2 className="mt-2 text-3xl font-black">Start where response speed affects revenue.</h2></div>
        <div className="flex flex-wrap gap-3">{niches.map(n => <span key={n} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-slate-300">{n}</span>)}</div>
      </section>

      <section id="pilot" className="grid gap-8 rounded-3xl border border-teal-300/20 bg-teal-300/[0.06] p-6 sm:p-8 lg:grid-cols-[.8fr_1.2fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">14-day pilot</p>
          <h2 className="mt-3 text-4xl font-black">One workflow. One measurable outcome.</h2>
          <p className="mt-4 leading-7 text-slate-300">We configure one customer journey around your real FAQs and lead flow, then measure response and follow-up performance.</p>
          <div className="mt-6 text-2xl font-black">₹4,999 <span className="text-sm font-normal text-slate-500">setup + pilot</span></div>
          <p className="mt-2 text-sm text-slate-500">Growth plan from ₹9,999/month after the pilot.</p>
        </div>

        <form onSubmit={submit} className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
          {submitted ? <div className="flex min-h-[330px] flex-col items-center justify-center text-center"><div className="text-4xl">✓</div><h3 className="mt-4 text-2xl font-bold">Pilot request captured</h3><p className="mt-2 max-w-md text-sm leading-6 text-slate-400">This MVP is ready for the next integration step. Connect your preferred email/CRM endpoint to route live requests.</p></div> :
          <>
            <h3 className="text-xl font-bold">Request a pilot</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                ['name','Your name','text'],['business','Business name','text'],['phone','WhatsApp / phone','tel']
              ].map(([key,placeholder,type]) => <input key={key} required type={type} placeholder={placeholder} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})} className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-teal-300/50 sm:col-span-1"/>)}
              <select value={form.niche} onChange={e=>setForm({...form,niche:e.target.value})} className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none"><option>Clinic</option><option>Education</option><option>Real estate</option><option>Local service</option></select>
              <select value={form.enquiries} onChange={e=>setForm({...form,enquiries:e.target.value})} className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none"><option>10–50/day</option><option>50–100/day</option><option>100+/day</option><option>Not sure</option></select>
            </div>
            <button className="mt-4 w-full rounded-xl bg-teal-300 px-5 py-3.5 font-bold text-slate-950">Request 14-day pilot →</button>
            <p className="mt-3 text-center text-xs text-slate-600">No payment is taken by this demo form.</p>
          </>}
        </form>
      </section>
    </main>
  );
}
