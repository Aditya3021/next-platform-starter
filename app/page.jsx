'use client';
import {useMemo,useState} from 'react';

const demoHoldings=[
 {name:'Reliance Industries',type:'Equity',broker:'Broker A',value:185000,units:50},
 {name:'HDFC Bank',type:'Equity',broker:'Broker B',value:92000,units:40},
 {name:'Nifty 50 ETF',type:'Equity',broker:'Broker A',value:76000,units:80},
 {name:'Embassy REIT',type:'REIT',broker:'Depository',value:54000,units:45},
 {name:'PowerGrid InvIT',type:'InvIT',broker:'Depository',value:38000,units:70},
 {name:'7.18% Govt Bond',type:'Bond',broker:'Depository',value:62000,units:10},
];
const explainers={
 REIT:{title:'REIT',text:'A Real Estate Investment Trust pools money into income-producing property such as offices, malls or warehouses. You buy units and participate in the trust’s income and asset value.',risk:'Income and market value can fluctuate; property, interest-rate and market risks apply.'},
 InvIT:{title:'InvIT',text:'An Infrastructure Investment Trust owns or finances infrastructure assets such as roads, power transmission or pipelines. Investors buy units in the trust.',risk:'Cash flows depend on underlying assets, contracts, financing and market conditions.'},
 Bond:{title:'Bond',text:'A bond is a loan from an investor to a government or company. The issuer generally pays interest and returns principal according to its terms.',risk:'Credit, interest-rate, liquidity and inflation risks can affect outcomes.'},
 Equity:{title:'Equity',text:'Equity represents ownership in a company. Its value can rise or fall based on business performance, market conditions and expectations.',risk:'Prices can be volatile and losses, including substantial losses, are possible.'}
};
export default function Page(){
 const [holdings,setHoldings]=useState(demoHoldings);
 const [selected,setSelected]=useState('REIT');
 const [filter,setFilter]=useState('All');
 const total=useMemo(()=>holdings.reduce((a,x)=>a+x.value,0),[holdings]);
 const visible=filter==='All'?holdings:holdings.filter(x=>x.type===filter);
 const types=['All','Equity','REIT','InvIT','Bond'];
 function addDemo(){setHoldings(h=>[...h,{name:'Sample Corporate Bond',type:'Bond',broker:'Broker B',value:45000,units:20}])}
 return <main>
 <style jsx>{`
 *{box-sizing:border-box}main{min-height:100vh;background:#07111f;color:#edf5ff;font-family:Inter,system-ui,sans-serif;padding:28px 5% 60px}.nav{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #20334b;padding-bottom:18px}.brand{font-weight:900;font-size:20px}.tag{font-size:12px;color:#7fdcb7}.hero{padding:52px 0 28px;max-width:900px}.eyebrow{font-size:11px;letter-spacing:2px;color:#62d5a8;font-weight:800}.hero h1{font-size:clamp(38px,6vw,70px);line-height:.98;letter-spacing:-3px;margin:8px 0 18px}.hero p{color:#9fb3cc;font-size:17px;line-height:1.6}.kpis{display:grid;grid-template-columns:1.2fr 1fr 1fr;gap:14px}.card{background:#0b192b;border:1px solid #213750;border-radius:18px;padding:20px}.label{font-size:11px;color:#7891ae;text-transform:uppercase;letter-spacing:1px}.big{font-size:30px;font-weight:900;margin-top:7px}.layout{display:grid;grid-template-columns:1.6fr 1fr;gap:16px;margin-top:16px}.toolbar{display:flex;gap:8px;flex-wrap:wrap;margin:16px 0}.pill{border:1px solid #29415c;background:#0d2137;color:#9db4ce;border-radius:999px;padding:8px 12px;cursor:pointer}.pill.active{background:#62d5a8;color:#061319;border-color:#62d5a8;font-weight:800}.row{display:grid;grid-template-columns:1.4fr .7fr .8fr .8fr;gap:12px;align-items:center;padding:14px 0;border-top:1px solid #1c3047;font-size:13px}.muted{color:#8ea6c1}.type{display:inline-block;padding:5px 8px;border-radius:7px;background:#132a43;color:#b9cce1;font-size:11px}.info h2{margin-top:0}.info p{color:#a8bbd1;line-height:1.55}.risk{background:#13283a;border-left:3px solid #62d5a8;padding:12px;margin-top:16px;color:#cde1f1;font-size:13px;line-height:1.5}.cta{margin-top:16px;width:100%;border:0;border-radius:10px;padding:12px;background:#62d5a8;color:#061319;font-weight:900;cursor:pointer}.notice{margin-top:16px;color:#6f87a3;font-size:11px;line-height:1.5}@media(max-width:850px){.kpis,.layout{grid-template-columns:1fr}.row{grid-template-columns:1.3fr .7fr .8fr}.row>:nth-child(3){display:none}.hero h1{letter-spacing:-2px}}`}</style>
 <div className="nav"><div className="brand">◈ InvestView</div><div className="tag">HACK ON TRACK 2026 · FINTECH</div></div>
 <section className="hero"><div className="eyebrow">ALL YOUR INVESTMENTS, IN ONE PLACE</div><h1>One portfolio. Every broker. Clearer choices.</h1><p>InvestView consolidates a retail investor’s fragmented holdings and explains alternatives to equities in plain language — without turning education into financial advice.</p></section>
 <section className="kpis"><div className="card"><div className="label">Total portfolio value</div><div className="big">₹{total.toLocaleString('en-IN')}</div></div><div className="card"><div className="label">Holdings</div><div className="big">{holdings.length}</div></div><div className="card"><div className="label">Accounts / sources</div><div className="big">3</div></div></section>
 <section className="layout"><div className="card"><div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><h2>Consolidated holdings</h2><button className="pill" onClick={addDemo}>+ Add demo holding</button></div><div className="toolbar">{types.map(t=><button key={t} className={'pill '+(filter===t?'active':'')} onClick={()=>setFilter(t)}>{t}</button>)}</div><div className="row muted"><span>Asset</span><span>Type</span><span>Source</span><span>Value</span></div>{visible.map((h,i)=><div className="row" key={i}><span><b>{h.name}</b><br/><span className="muted">{h.units} units</span></span><span><span className="type">{h.type}</span></span><span className="muted">{h.broker}</span><span>₹{h.value.toLocaleString('en-IN')}</span></div>)}</div>
 <aside className="card info"><div className="label">Plain-language explainer</div><h2>{explainers[selected].title}</h2><p>{explainers[selected].text}</p><div className="toolbar">{['REIT','InvIT','Bond','Equity'].map(t=><button key={t} className={'pill '+(selected===t?'active':'')} onClick={()=>setSelected(t)}>{t}</button>)}</div><div className="risk"><b>What to understand:</b><br/>{explainers[selected].risk}</div><button className="cta" onClick={()=>alert('Educational comparison only — no buy/sell recommendation is made.')}>Compare concepts</button><div className="notice">Demo data only. This prototype does not connect to broker/depository accounts and does not provide investment recommendations.</div></aside></section>
 </main>
}