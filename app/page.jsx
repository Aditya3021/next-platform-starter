'use client';

import {useMemo,useState} from 'react';

const lessons = [
  {id:'arrays',title:'Arrays',text:'An array stores ordered values in contiguous indexed positions. Access by index is constant time, while inserting in the middle may require shifting elements.',tags:['array','index','contiguous','access','insert']},
  {id:'hash',title:'Hash Tables',text:'A hash table maps keys to buckets using a hash function. With a good hash function, lookup, insert, and delete are expected constant time.',tags:['hash','table','key','bucket','lookup','hashing']},
  {id:'graphs',title:'Graphs',text:'A graph contains vertices and edges. Breadth first search explores level by level and is useful for shortest paths in unweighted graphs.',tags:['graph','vertex','edge','bfs','shortest','path']},
  {id:'recursion',title:'Recursion',text:'Recursion solves a problem by calling the same procedure on a smaller input and must include a base case that stops the calls.',tags:['recursion','base','case','function','smaller']},
];

const quizBank = [
  {q:'Which operation is typically O(1) for an array?',options:['Access by index','Insert at the beginning','Delete from the middle','Search an unsorted array'],answer:0,lesson:'arrays'},
  {q:'What does a hash function help determine?',options:['A graph edge','A bucket for a key','A recursion base case','An array length'],answer:1,lesson:'hash'},
  {q:'BFS explores a graph primarily...',options:['Randomly','From deepest node first','Level by level','By sorting vertices'],answer:2,lesson:'graphs'},
  {q:'What prevents recursive calls from continuing forever?',options:['A bucket','A base case','An index','A vertex'],answer:1,lesson:'recursion'},
];

function tokenize(s){return s.toLowerCase().replace(/[^a-z0-9 ]/g,' ').split(/\\s+/).filter(Boolean);}
function score(query,lesson){
  const q=new Set(tokenize(query)); const words=[...tokenize(lesson.text+' '+lesson.tags.join(' '))];
  const unique=[...new Set(words)]; return unique.filter(w=>q.has(w)).length/(Math.sqrt(unique.length)||1);
}

export default function Page(){
 const [query,setQuery]=useState('');
 const [answer,setAnswer]=useState(null);
 const [selected,setSelected]=useState(0);
 const [quiz,setQuiz]=useState(null);
 const [choice,setChoice]=useState(null);
 const [scoreCount,setScoreCount]=useState(0);
 const ranked=useMemo(()=>lessons.map(l=>({...l,s:score(query,l)})).sort((a,b)=>b.s-a.s),[query]);

 function teach(){
   const best=ranked[0];
   if(!query.trim()){setAnswer({title:'Ask me anything from the lesson set',body:'Try “Why is hash lookup fast?” or “How does BFS find a shortest path?”'});return;}
   setAnswer({title:best.title,body:best.s>0.18?best.text:'I could not confidently match that question to the current lesson set. Try adding a concept such as array, hash table, graph, BFS, or recursion.'});
 }
 function makeQuiz(){
   const pool=selected===0?quizBank:quizBank.filter(x=>x.lesson===lessons[selected-1]?.id);
   setQuiz(pool[Math.floor(Math.random()*pool.length)]);setChoice(null);
 }
 function submit(){
   if(choice===null||!quiz)return;
   if(choice===quiz.answer)setScoreCount(s=>s+1);
 }
 return <main>
 <style jsx>{`
 *{box-sizing:border-box}main{min-height:100vh;background:#071018;color:#eef7ff;font-family:Inter,system-ui,sans-serif;padding:28px 5% 70px}.nav{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #213244;padding-bottom:18px}.brand{font-size:20px;font-weight:900}.tag{font-size:11px;color:#6ee7b7;letter-spacing:1.4px}.hero{max-width:950px;padding:58px 0 30px}.eyebrow{color:#6ee7b7;font-size:11px;font-weight:900;letter-spacing:2px}.hero h1{font-size:clamp(42px,7vw,76px);line-height:.96;letter-spacing:-4px;margin:9px 0 18px}.hero p{max-width:760px;color:#9fb2c5;font-size:17px;line-height:1.6}.grid{display:grid;grid-template-columns:1.35fr .8fr;gap:16px}.card{background:#0c1825;border:1px solid #213548;border-radius:18px;padding:20px}.label{font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:#6f8ba5;font-weight:800}.input{width:100%;margin-top:12px;background:#08131e;border:1px solid #294057;color:#fff;border-radius:12px;padding:15px;font-size:15px;outline:none}.btn{margin-top:10px;border:0;border-radius:10px;padding:11px 15px;background:#6ee7b7;color:#06120e;font-weight:900;cursor:pointer}.chips{display:flex;gap:8px;flex-wrap:wrap;margin-top:15px}.chip{border:1px solid #294057;background:#101f2f;color:#9fb6cc;border-radius:999px;padding:7px 10px;cursor:pointer}.chip.active{background:#6ee7b7;color:#06120e}.answer{margin-top:18px;border-left:3px solid #6ee7b7;padding:14px;background:#0a1622}.answer h2{margin:0 0 8px}.answer p{color:#b8c8d8;line-height:1.6}.lesson{padding:14px 0;border-top:1px solid #203143}.lesson b{font-size:14px}.lesson p{color:#879eb4;font-size:12px;line-height:1.5}.quiz{margin-top:16px}.option{display:block;width:100%;text-align:left;margin:8px 0;padding:11px;border-radius:10px;border:1px solid #294057;background:#0a1622;color:#d9e8f5;cursor:pointer}.option.sel{border-color:#6ee7b7}.small{font-size:11px;color:#7890a6;margin-top:10px;line-height:1.5}@media(max-width:850px){.grid{grid-template-columns:1fr}.hero h1{letter-spacing:-2px}}`}</style>
 <div className="nav"><div className="brand">✦ LearnForge</div><div className="tag">FORGEHACKS 2026 · AI + EDUCATION</div></div>
 <section className="hero"><div className="eyebrow">LEARN BEYOND MEMORIZATION</div><h1>Ask. Connect. Apply.</h1><p>An adaptive learning companion that maps a learner’s question to the most relevant concept, explains it in plain language, then checks understanding with a targeted micro-quiz.</p></section>
 <section className="grid">
  <div className="card"><div className="label">Semantic tutor</div><input className="input" value={query} onChange={e=>setQuery(e.target.value)} placeholder="e.g. Why is hash lookup usually fast?" /><button className="btn" onClick={teach}>Explain with LearnForge</button>
   <div className="chips">{lessons.map((l,i)=><button key={l.id} className={'chip '+((selected===i+1)?'active':'')} onClick={()=>setSelected(i+1)}>{l.title}</button>)}</div>
   {answer&&<div className="answer"><h2>{answer.title}</h2><p>{answer.body}</p></div>}
   <div className="quiz"><div className="label">Adaptive micro-quiz</div><button className="btn" onClick={makeQuiz}>Generate question</button>{quiz&&<div className="answer"><b>{quiz.q}</b>{quiz.options.map((o,i)=><button key={o} className={'option '+(choice===i?'sel':'')} onClick={()=>setChoice(i)}>{o}</button>)}<button className="btn" onClick={submit}>Check answer</button><div className="small">Correct answers: {scoreCount}</div></div>}</div>
  </div>
  <aside className="card"><div className="label">How the AI layer works</div><h2>Transparent retrieval + adaptation</h2><p className="small">LearnForge tokenizes the learner query, ranks lesson concepts using a lightweight TF-style similarity score, selects the strongest match, and adapts the next check to that concept.</p>{lessons.map(l=><div className="lesson" key={l.id}><b>{l.title}</b><p>{l.text}</p></div>)}<div className="small">No student credentials are collected. Demo curriculum is local and replaceable with a larger indexed knowledge base or hosted model.</div></aside>
 </section>
 </main>
}
