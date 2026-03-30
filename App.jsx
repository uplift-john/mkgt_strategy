import { useState, useEffect } from "react";
import {
  CheckCircle, Circle, ChevronRight, ChevronLeft,
  BookOpen, PenLine, FileDown, Users, Crosshair,
  MessageSquare, BookMarked, TrendingUp, ClipboardCheck,
  ArrowRight, Play, Menu, X, Star, Leaf, RefreshCw
} from "lucide-react";

// ── BRAND PALETTE (FCR warm-editorial aesthetic) ──────────────────────────────
const C = {
  cream:  "#FAF6EE",
  orange: "#C96B35",
  brown:  "#3D1F0D",
  card:   "#5C2D1A",
  light:  "#8B5C3E",
  muted:  "#9A7A68",
  border: "#E8D8C0",
  text:   "#2C2018",
  fill:   "#FFF8F0",
  green:  "#1D3D2B",
};

// ── VIDEO CONFIG — replace null with YouTube URLs when ready ──────────────────
const VIDEOS = {
  icp: null, positioning: null, voice: null,
  stories: null, flywheel: null, audit: null,
};

// ── SECTION METADATA ──────────────────────────────────────────────────────────
const SECTIONS = [
  { id:"icp",         n:1, title:"Your Ideal Guest",           Icon:Users,          time:"20–25 min" },
  { id:"positioning", n:2, title:"Your Positioning Statement", Icon:Crosshair,      time:"15–20 min" },
  { id:"voice",       n:3, title:"Brand Voice & Language",     Icon:MessageSquare,  time:"15 min"    },
  { id:"stories",     n:4, title:"Your Key Stories",           Icon:BookMarked,     time:"25–30 min" },
  { id:"flywheel",    n:5, title:"Your Marketing Channels",    Icon:TrendingUp,     time:"15–20 min" },
  { id:"audit",       n:6, title:"Messaging Audit",            Icon:ClipboardCheck, time:"20–25 min" },
];

// ── INITIAL FORM STATE ────────────────────────────────────────────────────────
const EA = { icp:"", pos:"", lang:"", notes:"", priority:"" };
const EP = { words:"", seeking:"", worthIt:"", never:"" };

const initState = () => ({
  icp: {
    natureLover: {...EP}, adventurer: {...EP},
    offGrid:     {...EP}, eco:        {...EP},
    repeat:  { bringsBack:"", changed:"", stop:"", contact:"" },
    buyout:  { occasions:"",  buyer:"",   reflects:"", objection:"" },
  },
  positioning: { q1:"", q2:"", q3:"", q4:"", q5:"", final:"" },
  voice: { description:"", addUse:["","","","",""], addAvoid:["","","","",""] },
  stories: { transfer:"", origin:"", arrival:"", fish:"", offgrid:"", owners:"" },
  flywheel: {
    pr:      { status:"", working:"", attention:"", next:"" },
    paid:    { status:"", working:"", attention:"", next:"" },
    organic: { status:"", working:"", attention:"", next:"" },
    email:   { status:"", working:"", attention:"", next:"" },
    social:  { status:"", working:"", attention:"", next:"" },
  },
  audit: {
    homepage:       {...EA}, about:         {...EA}, activities:  {...EA},
    cabins:         {...EA}, sustainability: {...EA}, instaBio:   {...EA},
    instaFeed:      {...EA}, google:        {...EA}, inquiry:     {...EA},
    confirmation:   {...EA}, press:         {...EA}, guestGuide: {...EA},
  }
});

// ── REUSABLE UI ───────────────────────────────────────────────────────────────
const VideoSlot = ({ url, label }) => {
  if (url) {
    const m = url.match(/(?:youtu\.be\/|v=)([^&?#]+)/);
    if (m) return (
      <div className="mb-6 rounded-xl overflow-hidden" style={{aspectRatio:"16/9"}}>
        <iframe width="100%" height="100%"
          src={`https://www.youtube.com/embed/${m[1]}`}
          allow="autoplay; encrypted-media" allowFullScreen title={label} />
      </div>
    );
  }
  return (
    <div className="flex items-center gap-3 rounded-xl p-4 mb-6"
         style={{background:"#F0E8DC", border:`2px dashed ${C.border}`}}>
      <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
           style={{background:C.orange}}>
        <Play size={14} color="white" fill="white" />
      </div>
      <div>
        <p className="text-sm font-semibold" style={{color:C.brown}}>Video lesson</p>
        <p className="text-xs" style={{color:C.muted}}>{label || "Add a YouTube URL in the VIDEOS config to embed a lesson here."}</p>
      </div>
    </div>
  );
};

const Insight = ({children}) => (
  <div className="rounded-xl p-5 my-5" style={{background:C.card}}>
    <p className="text-sm leading-relaxed" style={{color:"#F5E8D8"}}>{children}</p>
  </div>
);

const OrangeBox = ({label, children}) => (
  <div className="rounded-r-lg px-4 py-3 my-4" style={{background:"#FFF4EC", borderLeft:`4px solid ${C.orange}`}}>
    {label && <p className="text-xs font-bold mb-1" style={{color:C.orange}}>{label}</p>}
    <p className="text-sm leading-relaxed" style={{color:C.card}}>{children}</p>
  </div>
);

const ProfileCard = ({num, name, seeking, desc}) => (
  <div className="rounded-xl overflow-hidden mb-5" style={{border:`1px solid ${C.border}`}}>
    <div className="flex items-center gap-2 px-4 py-3" style={{background:C.card}}>
      <span className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{background:"rgba(255,255,255,0.15)", color:"#F5E8D8"}}>ICP #{num}</span>
      <h3 className="font-bold text-sm" style={{color:"white"}}>{name}</h3>
    </div>
    <div className="p-4 flex gap-4" style={{background:C.fill}}>
      <p className="text-sm leading-relaxed flex-1" style={{color:C.text}}>{desc}</p>
      <div className="flex-shrink-0 w-40 rounded-lg p-3" style={{background:C.card}}>
        <p className="text-xs font-semibold mb-1" style={{color:"#F5C89A"}}>Seeking</p>
        <p className="text-xs leading-relaxed" style={{color:"#FAF0E0"}}>{seeking}</p>
      </div>
    </div>
  </div>
);

const Field = ({label, hint, example, value, onChange, rows=4, placeholder="Write your answer here..."}) => (
  <div className="mb-5">
    <label className="block text-sm font-semibold mb-1" style={{color:C.brown}}>{label}</label>
    {hint && <p className="text-xs mb-2 leading-relaxed italic" style={{color:C.muted}}>{hint}</p>}
    {example && (
      <div className="px-3 py-2 mb-2 rounded-r text-xs"
           style={{background:"#FFF8F0", borderLeft:`3px solid ${C.border}`, color:C.light}}>
        <span className="font-semibold not-italic" style={{color:C.orange}}>Example: </span>{example}
      </div>
    )}
    <textarea value={value} onChange={e=>onChange(e.target.value)} rows={rows}
      placeholder={placeholder}
      style={{border:`1.5px solid ${C.border}`, color:C.text, background:"white",
              fontFamily:"inherit", fontSize:"0.875rem", width:"100%",
              borderRadius:"0.5rem", padding:"0.75rem", resize:"vertical",
              outline:"none", lineHeight:"1.5"}}
      onFocus={e=>e.target.style.borderColor=C.orange}
      onBlur={e=>e.target.style.borderColor=C.border} />
  </div>
);

const SectionPill = ({n}) => (
  <span className="text-xs font-bold tracking-wider px-2 py-1 rounded-full"
        style={{background:"#FFF4EC", color:C.orange}}>SECTION {n} OF 6</span>
);

const BeginBtn = ({onClick, label="Begin this section"}) => (
  <button onClick={onClick}
    className="w-full py-4 rounded-xl font-semibold mt-8 flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
    style={{background:C.orange, color:"white", fontSize:"1rem"}}>
    {label} <ArrowRight size={18} />
  </button>
);

const CompleteBtn = ({onClick}) => (
  <button onClick={onClick}
    className="w-full py-3 rounded-xl font-semibold text-sm mt-8 transition-opacity hover:opacity-90"
    style={{background:C.orange, color:"white"}}>
    Save &amp; continue to next section →
  </button>
);

// ── LESSON SCREENS ────────────────────────────────────────────────────────────
const LessonICP = ({onBegin}) => (
  <div>
    <div className="mb-6">
      <SectionPill n={1} />
      <h1 className="text-3xl font-bold mt-2 mb-1" style={{color:C.brown, fontFamily:"Georgia,serif"}}>Your Ideal Guest</h1>
      <p style={{color:C.light}}>Define exactly who you're talking to — and who you're not.</p>
    </div>
    <VideoSlot url={VIDEOS.icp} label="Why your ICP is a filter, not a fence" />
    <p className="text-base leading-relaxed mb-4" style={{color:C.text}}>
      An Ideal Customer Profile isn't about excluding people. It's about attracting the right ones. When you try to speak to everyone, you end up resonating with no one.
    </p>
    <Insight>Done right, your ICP becomes a filter. It protects the experience you've built, honors the guests who love it, and makes every marketing dollar work harder.</Insight>

    <h2 className="text-xl font-bold mt-8 mb-3" style={{color:C.brown, fontFamily:"Georgia,serif"}}>
      Before we talk about who — let's talk about what.
    </h2>
    <p className="text-sm leading-relaxed mb-3" style={{color:C.text}}>
      "Luxury" is the wrong word for Flat Creek Ranch. It attracts guests who expect to be waited on, not transformed. What you actually offer is more specific and more compelling.
    </p>
    <OrangeBox label="The frame that works:">
      "Imagine being treated to a weekend at your wealthy friend's mountain retreat." High-end, yes. Effortful, never. The guest shows up ready to participate — not to be indulged.
    </OrangeBox>

    <h2 className="text-xl font-bold mt-8 mb-1" style={{color:C.brown, fontFamily:"Georgia,serif"}}>Four motivational profiles.</h2>
    <p className="text-sm mb-5" style={{color:C.muted}}>These aren't demographics. They're ways of understanding <em>why</em> someone chooses this place.</p>
    {[
      {num:1,name:"Joy-Filled Nature Lovers",seeking:"Wonder. Presence. A place that earns its scenery.",desc:"Sensory-rich immersion in an under-the-radar retreat. These guests want to feel the place: the light on the lake, the sound of Flat Creek, a hike that ends with a view that earns it. They'll talk about it for years."},
      {num:2,name:"Aspirational Adventurers",seeking:"Personal growth. Earned pride. A story they're the protagonist of.",desc:"Premium experiences in wild landscapes — while maintaining high comfort. Elite, not extreme. The Blue-Ribbon fly fishing, the wilderness hike at altitude, the drift boat. These aren't amenities — they're the point."},
      {num:3,name:"Off-Grid Enthusiasts",seeking:"Permission to slow down. Space to be present. Real conversation.",desc:"Silence and solace, far removed from digital noise. They arrive already knowing they're coming to disconnect — and they've been looking forward to it. The absence of WiFi is not a caveat. It's the selling point."},
      {num:4,name:"Eco-Conscious Stewards of the Land",seeking:"Alignment between values and experience. Travel that gives back more than it takes.",desc:"They research before they book. They want to know how the beef is sourced, what the conservation easement means, why BEST certification matters. They're not skeptics — they're believers who need to see it reflected in how you operate."},
    ].map(p=><ProfileCard key={p.num} {...p} />)}

    <h2 className="text-xl font-bold mt-8 mb-4" style={{color:C.brown, fontFamily:"Georgia,serif"}}>Three things Flat Creek Ranch is not.</h2>
    {[
      {tag:"MYTH #1",h:`Not "family friendly." Multigenerational — with intention.`,b:`"Family friendly" signals children's menus and toddler-proofed spaces. FCR is right for: grandparents and adult children, adults with older kids who can hold a fly rod, families gathering to mark something that matters. Lead with the experience, not the demographic.`},
      {tag:"MYTH #2",h:`Not "a secret." Selectively known.`,b:`Instead of "Wyoming's best kept secret," say: "Private waters in the wilderness, accessible only to guests" — or — "Fifteen miles across the National Elk Refuge and then the world falls quiet." Exclusivity doesn't need to announce itself. It just needs to be true.`},
      {tag:"MYTH #3",h:`Not "luxury." Bespoke.`,b:`Traditional luxury attracts guests who expect to be waited on. FCR guests value depth over material opulence. You're handing them a fishing rod, a glass of wine, and a view that cost 15 miles of rough road to earn.`},
    ].map(m=>(
      <div key={m.tag} className="mb-4 rounded-xl overflow-hidden" style={{border:`1px solid ${C.border}`}}>
        <div className="px-4 py-1.5 text-xs font-bold tracking-wider" style={{background:C.cream, color:C.orange}}>{m.tag}</div>
        <div className="px-4 py-3">
          <p className="font-semibold text-sm mb-1" style={{color:C.brown, fontFamily:"Georgia,serif"}}>{m.h}</p>
          <p className="text-sm leading-relaxed" style={{color:C.text}}>{m.b}</p>
        </div>
      </div>
    ))}
    <BeginBtn onClick={onBegin} label="Begin Section 1: Fill in your profiles" />
  </div>
);

const LessonPositioning = ({onBegin}) => (
  <div>
    <div className="mb-6">
      <SectionPill n={2} />
      <h1 className="text-3xl font-bold mt-2 mb-1" style={{color:C.brown, fontFamily:"Georgia,serif"}}>Your Positioning Statement</h1>
      <p style={{color:C.light}}>One sentence that makes every marketing decision easier.</p>
    </div>
    <VideoSlot url={VIDEOS.positioning} label="Positioning vs. tagline — why the difference matters" />
    <p className="text-base leading-relaxed mb-4" style={{color:C.text}}>
      A positioning statement is not a tagline. A tagline is what you say to the public. A positioning statement is what you say to yourself — the internal compass that guides every choice.
    </p>
    <Insight>The test of a good positioning statement: when you're unsure whether to run an ad, pitch a story, or approve a photo — your statement should make the right answer obvious.</Insight>
    <p className="text-sm leading-relaxed mt-4" style={{color:C.text}}>
      We'll build yours across five questions. Don't try to write the sentence first. Answer each question honestly and the statement assembles itself. The worked example below is based on everything we know about Flat Creek Ranch — use it as a reference, not a template.
    </p>
    <OrangeBox label="The formula:">
      "Flat Creek Ranch is [what we are] for [who our guest is] who want [the outcome they seek] — unlike [the alternative], we [our true differentiator]."
    </OrangeBox>
    <h2 className="text-xl font-bold mt-8 mb-3" style={{color:C.brown, fontFamily:"Georgia,serif"}}>Worked example</h2>
    <div className="rounded-xl p-5 text-sm leading-relaxed italic" style={{background:C.fill, border:`1px solid ${C.border}`, color:C.card}}>
      "Flat Creek Ranch is a 100-year-old wilderness homestead on 140 private acres in Jackson Hole for travelers who've crossed the obvious destinations off the list and are ready for the one they'll still be talking about in ten years. Unlike a high-end mountain resort or an eco-lodge that promises disconnection and delivers it imperfectly, we're genuinely unreachable — no WiFi, no road a rental car can navigate, no other guests within earshot — with a private Blue-Ribbon trout stream, five restored 1923 log cabins, and a story that can't be manufactured: a ranch gifted by its previous owners, not sold, because some things shouldn't be acquired."
    </div>
    <BeginBtn onClick={onBegin} label="Begin Section 2: Build your statement" />
  </div>
);

const LessonVoice = ({onBegin}) => (
  <div>
    <div className="mb-6">
      <SectionPill n={3} />
      <h1 className="text-3xl font-bold mt-2 mb-1" style={{color:C.brown, fontFamily:"Georgia,serif"}}>Brand Voice & Language</h1>
      <p style={{color:C.light}}>The words that make you sound like you — and not like everyone else.</p>
    </div>
    <VideoSlot url={VIDEOS.voice} label="Why specific earns more trust than superlative" />
    <p className="text-base leading-relaxed mb-4" style={{color:C.text}}>
      Every word you choose is a signal. "Luxury" tells one story. "A clawfoot soaking tub with a view of Flat Creek" tells another. The second sentence does more work — because it's specific. Specificity earns trust. Superlatives signal that you're trying.
    </p>
    <Insight>The question isn't "does this sound good?" It's "does this sound like us?" Those aren't always the same thing.</Insight>
    <OrangeBox label="Your ICP isn't just a target list. It's a writing brief.">
      Once you know who you're speaking to, every word sharpens. Lead with experience and emotion, not amenities and specs. The voice of Flat Creek Ranch lives in the sensory and the particular: the Finnish sauna over the creek, the Snake River Fine-Spotted Cutthroat, the cowboy and the countess.
    </OrangeBox>
    <h2 className="text-xl font-bold mt-8 mb-3" style={{color:C.brown, fontFamily:"Georgia,serif"}}>The reference table — pre-populated for FCR</h2>
    <div className="rounded-xl overflow-hidden mb-2" style={{border:`1px solid ${C.border}`}}>
      <div className="grid grid-cols-2">
        <div className="p-3 text-xs font-bold" style={{background:C.green, color:"white"}}>✓  SAY THIS</div>
        <div className="p-3 text-xs font-bold" style={{background:"#5C1A1A", color:"white"}}>✗  AVOID THIS</div>
      </div>
      {[
        ["Snake River Fine-Spotted Cutthroat","Luxury (standalone)"],
        ["Blue-Ribbon stream","Bespoke (generic)"],
        ["140 private acres / 15 guests","Unrivaled / World-class"],
        ["1923 — the actual year","Amenities"],
        ["BEST-certified","Digital detox"],
        ["Conservation easement","Best-kept secret"],
        ["15 miles across the National Elk Refuge","Reconnect with nature"],
        ["Trey and Shelby (first names)","Family friendly"],
        ["Bespoke, high-end wilderness experience","Curated experience"],
        ["Hard to get to","Bucket list"],
      ].map(([u,a],i)=>(
        <div key={i} className="grid grid-cols-2" style={{background: i%2===0?"white":"#FAF8F4"}}>
          <div className="p-2.5 text-xs font-semibold border-r" style={{color:C.green, borderColor:C.border}}>{u}</div>
          <div className="p-2.5 text-xs font-semibold" style={{color:"#8B2020"}}>{a}</div>
        </div>
      ))}
    </div>
    <BeginBtn onClick={onBegin} label="Begin Section 3: Add your own entries" />
  </div>
);

const LessonStories = ({onBegin}) => (
  <div>
    <div className="mb-6">
      <SectionPill n={4} />
      <h1 className="text-3xl font-bold mt-2 mb-1" style={{color:C.brown, fontFamily:"Georgia,serif"}}>Your Key Stories</h1>
      <p style={{color:C.light}}>The six narratives that will do the most work for you.</p>
    </div>
    <VideoSlot url={VIDEOS.stories} label="Features vs. stories — and why it matters to a journalist" />
    <p className="text-base leading-relaxed mb-4" style={{color:C.text}}>
      Features describe what a place has. Stories describe what it means.
    </p>
    <Insight>"Private Blue-Ribbon stream" is a feature. "A mile and a half of water you'll never share with a stranger, in a state where that's almost impossible" is a story. One makes a list. The other makes you call.</Insight>
    <p className="text-sm leading-relaxed mt-4 mb-6" style={{color:C.text}}>
      These six stories are your most durable marketing assets. A journalist needs them to write about you. A potential guest needs them to justify the booking. A repeat guest needs them to explain why they came back. Don't write these for an editor — write them the way you'd tell them to someone at dinner who asked how you ended up here.
    </p>
    {[
      {n:1,title:"The Transfer Story",why:"In a moment when independent hospitality is being consumed by private equity, a ranch gifted rather than sold is genuinely rare. Journalists writing about travel, values, and business culture will respond to this."},
      {n:2,title:"The Origin Story",why:'"A cowboy and a countess" is a lede that practically writes itself. For travel media, 100 years of verifiable history tied to a specific landscape is premium editorial material.'},
      {n:3,title:"The Arrival Ritual",why:"The 15-mile 4×4 drive across the National Elk Refuge is the first experience. It tells guests they've left the ordinary world behind. For media: highly visual, distinctive, easy to describe."},
      {n:4,title:"Fly Fishing Exclusivity",why:'"Private Blue-Ribbon water" stops a serious angler cold. Fly fishing has a passionate, high-spending, word-of-mouth-driven audience with its own media ecosystem.'},
      {n:5,title:"Off-Grid Luxury",why:'The "off-grid" claim is common. Actually doing it without compromise at a high-end level — with BEST certification as proof — is not. This combination is editorial gold for sustainability-focused travel media.'},
      {n:6,title:"The New Owners",why:"Trey and Shelby's story — chosen by name to steward a place rather than sell it — is the human face of everything the ranch stands for. It's the antidote to the branded resort narrative."},
    ].map(s=>(
      <div key={s.n} className="mb-4 rounded-xl p-4" style={{background:C.fill, border:`1px solid ${C.border}`}}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{background:C.orange, color:"white"}}>Story {s.n}</span>
          <span className="font-semibold text-sm" style={{color:C.brown}}>{s.title}</span>
        </div>
        <p className="text-xs leading-relaxed" style={{color:C.muted}}>{s.why}</p>
      </div>
    ))}
    <BeginBtn onClick={onBegin} label="Begin Section 4: Tell your stories" />
  </div>
);

const LessonFlywheel = ({onBegin}) => (
  <div>
    <div className="mb-6">
      <SectionPill n={5} />
      <h1 className="text-3xl font-bold mt-2 mb-1" style={{color:C.brown, fontFamily:"Georgia,serif"}}>Your Marketing Channels</h1>
      <p style={{color:C.light}}>How each channel makes the others stronger.</p>
    </div>
    <VideoSlot url={VIDEOS.flywheel} label="The marketing flywheel — why one channel isn't enough" />
    <p className="text-base leading-relaxed mb-4" style={{color:C.text}}>
      Marketing isn't a set of tactics — it's a system. Each channel you use either works alone or works as part of a flywheel that compounds over time.
    </p>
    <Insight>The flywheel: PR creates credibility → credibility drives organic search → search builds your email list → email converts → bookings create the story that generates more PR. Paid ads amplify what already works — they don't replace the flywheel.</Insight>
    <OrangeBox label="Where FCR is right now:">
      Flat Creek Ranch is currently running on one channel — paid search — without the flywheel underneath it. That means bookings are powered entirely by spend, with no compounding. The two highest-ROI moves right now: (1) a PR pitch on the Transfer Story, and (2) a personal email to past guests about the upcoming season.
    </OrangeBox>
    {[
      {name:"Earned Media & PR",desc:"Stories in publications you didn't pay for. A single well-placed feature can drive more qualified inquiry than months of ad spend — and unlike ads, it lasts."},
      {name:"Paid Advertising",desc:"Google Ads and social ads. The most controllable channel — but it stops the moment you stop paying, and only reaches people already searching."},
      {name:"Organic Search (SEO)",desc:"When your website appears naturally in search results without paying for the click. Takes time to build but compounds over years."},
      {name:"Email List",desc:"Direct communication with past guests and warm inquiries. The only audience you truly own. Social algorithms change; Google shifts. Email reaches people who already raised their hand."},
      {name:"Social Media",desc:"Instagram and Facebook. Stays top-of-mind with people who aren't actively looking right now — but might be in six months."},
    ].map(c=>(
      <div key={c.name} className="mb-3 rounded-xl p-4" style={{background:C.fill, border:`1px solid ${C.border}`}}>
        <p className="font-semibold text-sm mb-1" style={{color:C.brown}}>{c.name}</p>
        <p className="text-xs leading-relaxed" style={{color:C.muted}}>{c.desc}</p>
      </div>
    ))}
    <BeginBtn onClick={onBegin} label="Begin Section 5: Assess each channel" />
  </div>
);

const LessonAudit = ({onBegin}) => (
  <div>
    <div className="mb-6">
      <SectionPill n={6} />
      <h1 className="text-3xl font-bold mt-2 mb-1" style={{color:C.brown, fontFamily:"Georgia,serif"}}>Messaging Audit</h1>
      <p style={{color:C.light}}>Find the gap between who you are and what your marketing says.</p>
    </div>
    <VideoSlot url={VIDEOS.audit} label="How to read your own brand with fresh eyes" />
    <p className="text-base leading-relaxed mb-4" style={{color:C.text}}>
      Your brand speaks in more places than you might think — your website, your Instagram bio, your booking confirmation email, your in-room guest guide. Most were probably written at different times, by different people, without a shared sense of how the ranch should sound.
    </p>
    <Insight>The gap between how you see your brand and how your marketing actually speaks is usually visible within 10 minutes of reading your own homepage out loud.</Insight>
    <p className="text-sm leading-relaxed mt-4" style={{color:C.text}}>
      The audit is a fresh-eyes exercise. You're not fixing everything at once — you're finding where to focus. Three honest questions for each touchpoint:
    </p>
    {[
      "Does this speak to our ideal guest?",
      "Does this reflect our positioning?",
      "Does it avoid the language we've decided not to use?",
    ].map((q,i)=>(
      <div key={i} className="flex items-start gap-3 mt-3">
        <span className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5"
              style={{background:C.orange, color:"white"}}>{i+1}</span>
        <p className="text-sm" style={{color:C.text}}>{q}</p>
      </div>
    ))}
    <OrangeBox label="High priority = ">
      A touchpoint where you answer No to two or more questions AND where most potential guests land first — usually your homepage, activities page, and Instagram bio.
    </OrangeBox>
    <BeginBtn onClick={onBegin} label="Begin Section 6: Audit your touchpoints" />
  </div>
);

// ── FORM SCREENS ──────────────────────────────────────────────────────────────
const FormICP = ({data, onChange}) => {
  const upd = (profile, field, val) => onChange({...data, [profile]:{...data[profile],[field]:val}});
  return (
    <div>
      <div className="mb-6">
        <SectionPill n={1} />
        <h1 className="text-2xl font-bold mt-2 mb-1" style={{color:C.brown, fontFamily:"Georgia,serif"}}>Your Ideal Guest — In Your Words</h1>
        <p className="text-sm" style={{color:C.light}}>Fill in each profile with your own specific knowledge of guests like these.</p>
      </div>
      {[
        {key:"natureLover",n:1,name:"Joy-Filled Nature Lovers",
          seeking:"Wonder. Presence. A place that earns its scenery.",
          f:[
            {k:"words",l:"Describe a real guest like this in 2–3 sentences.",h:"Age, life stage, where they're from, what pushed them to book. Be specific.",ex:"A couple from Denver, mid-40s. One grew up fly fishing; the other has never held a rod. They've been promising each other this trip for six years."},
            {k:"worthIt",l:"What specific moments make this stay worth every dollar?",h:"Name actual things — not vague wins.",ex:"The morning hike where the fog was still sitting on the lake. Dinner where no one checked their phone for 90 minutes."},
            {k:"never",l:"What should we never say to attract this guest?",h:"Words or promises that would turn them off immediately.",ex:"'resort-style amenities,' 'spa services,' anything that signals passive luxury."},
          ]},
        {key:"adventurer",n:2,name:"Aspirational Adventurers",
          seeking:"Personal growth. Earned pride. A story they're the protagonist of.",
          f:[
            {k:"words",l:"Describe a real guest like this in 2–3 sentences.",h:"Their professional life, travel history, what they're trying to feel.",ex:"A 52-year-old surgeon who's been to Patagonia and Iceland. More interested in a story nobody else has than a place everyone's heard of."},
            {k:"worthIt",l:"What would they still be talking about six months later?",h:"The specific trophy moment.",ex:"Landing a 20-inch cutthroat on private water with a guide who knew the run by name."},
            {k:"never",l:"What should we never say to attract this guest?",ex:"'bucket list,' 'world-class,' anything that sounds like it was written by a marketing department."},
          ]},
        {key:"offGrid",n:3,name:"Off-Grid Enthusiasts",
          seeking:"Permission to slow down. Space to be present. Real conversation.",
          f:[
            {k:"words",l:"Describe a real guest like this in 2–3 sentences.",h:"What industry are they usually from? What are they tired of?",ex:"A product manager from San Francisco who takes her laptop everywhere — except here. She booked because 'no WiFi' was in the listing description."},
            {k:"worthIt",l:"What makes this stay worth it for them specifically?",ex:"By day two, she stopped reaching for her phone out of habit. The silence felt like something."},
            {k:"never",l:"What should we never say?",ex:"'digital detox,' 'unplug and recharge,' 'reconnect with nature.' These clichés signal a gimmick, not a real place."},
          ]},
        {key:"eco",n:4,name:"Eco-Conscious Stewards of the Land",
          seeking:"Alignment between values and experience. Travel that gives back more than it takes.",
          f:[
            {k:"words",l:"Describe a real guest like this in 2–3 sentences.",h:"How do they research? What proof do they need?",ex:"She read the BEST certification criteria before she called. She asked who supplied the beef on the inquiry form."},
            {k:"worthIt",l:"What makes this stay worth it for them?",ex:"Meeting the rancher who supplies the grass-fed beef. Understanding what the conservation easement actually protects."},
            {k:"never",l:"What should we never say?",ex:"'eco-friendly,' 'green.' Use the actual names: BEST-certified, conservation easement, local suppliers."},
          ]},
      ].map(profile=>(
        <div key={profile.key} className="mb-8">
          <ProfileCard num={profile.n} name={profile.name} seeking={profile.seeking}
            desc={profile.n===1?"Sensory-rich immersion. They want to feel the place — the light on the lake, the sound of Flat Creek. They'll talk about it for years.":
                  profile.n===2?"Premium experiences in wild landscapes while maintaining comfort. Elite, not extreme. These aren't amenities — they're the point.":
                  profile.n===3?"Far removed from digital noise. They arrive looking forward to disconnecting. The absence of WiFi is the selling point.":
                  "They research before booking. Believers who need to see your values reflected in how you operate."} />
          {profile.f.map(f=>(
            <Field key={f.k} label={f.l} hint={f.h} example={f.ex}
              value={data[profile.key][f.k]}
              onChange={v=>upd(profile.key, f.k, v)} />
          ))}
          <div style={{height:"1px", background:C.border, margin:"2rem 0"}} />
        </div>
      ))}

      <h2 className="text-xl font-bold mb-4" style={{color:C.brown, fontFamily:"Georgia,serif"}}>The Repeat Guest</h2>
      <div className="rounded-xl p-4 mb-5" style={{background:C.fill, border:`1px solid ${C.border}`}}>
        <p className="text-sm leading-relaxed" style={{color:C.text}}>The guest worth designing for: someone who comes back. Repeat guests are the foundation of a ranch that doesn't need to advertise. Intentional intimacy, staff continuity, predictable excellence — they feel like insiders, not returning customers.</p>
      </div>
      {[
        {k:"bringsBack",l:"What brings them back — versus what drew them the first time?",ex:"First trip: the fly fishing. Second: because Shelby remembered their daughter's name."},
        {k:"changed",l:"How has their relationship to the ranch changed over time?",ex:"First trip was a couple's getaway. Third trip brought four generations."},
        {k:"stop",l:"What would make them stop coming? Be honest.",ex:"If it felt like it had been acquired, even subtly. If the staff changed and the ranch stopped knowing them."},
        {k:"contact",l:"How do we stay meaningfully in touch between seasons?",ex:"A handwritten note after their trip. One email in February about the upcoming season. Not a newsletter — a letter."},
      ].map(f=>(
        <Field key={f.k} label={f.l} example={f.ex}
          value={data.repeat[f.k]}
          onChange={v=>onChange({...data, repeat:{...data.repeat,[f.k]:v}})} />
      ))}

      <div style={{height:"1px", background:C.border, margin:"2rem 0"}} />
      <h2 className="text-xl font-bold mb-2" style={{color:C.brown, fontFamily:"Georgia,serif"}}>Full Property Buyout</h2>
      <p className="text-sm mb-4" style={{color:C.muted}}>When someone books all five cabins, the ranch becomes something different: a private world, a backdrop for something that matters.</p>
      <div className="grid grid-cols-2 gap-3 mb-5">
        {[["Family Legacy Gatherings","Milestone birthdays, reunions, anniversaries. A private home base in a dramatic setting."],["Affluent Friends & Peers","Former classmates, professionals, hobby-based groups. Their own private, customized camp."],["Executive & Corporate Retreats","Small groups seeking remote, inspiring settings for strategy and team-building."],["Special Interest & Wellness Communities","Wildlife photography, fly fishing groups, plein air painting, athletic training. Full access, focused programming."]].map(([t,d])=>(
          <div key={t} className="rounded-lg p-3" style={{background:C.fill, border:`1px solid ${C.border}`}}>
            <p className="text-xs font-bold mb-1" style={{color:C.brown}}>{t}</p>
            <p className="text-xs" style={{color:C.muted}}>{d}</p>
          </div>
        ))}
      </div>
      {[
        {k:"occasions",l:"What are the 2–3 most common or promising buyout occasions for FCR?",ex:"Multi-generational family milestone, executive leadership off-site, tight-knit angling group."},
        {k:"buyer",l:"Who is the decision-maker, and who attends?",ex:"Decision-maker is often a family organizer or executive assistant. Attendees range from skeptical teenagers to company leadership."},
        {k:"reflects",l:"What does the booker need to feel the venue choice reflected well on them?",ex:"They need to know every guest — regardless of outdoor experience — feels genuinely taken care of."},
        {k:"objection",l:"What's the biggest objection to a buyout versus per-cabin booking?",ex:"The upfront cost feels high. The answer: per-person rate at capacity is competitive — and the exclusivity is real."},
      ].map(f=>(
        <Field key={f.k} label={f.l} example={f.ex}
          value={data.buyout[f.k]}
          onChange={v=>onChange({...data, buyout:{...data.buyout,[f.k]:v}})} />
      ))}
    </div>
  );
};

const FormPositioning = ({data, onChange}) => {
  const upd = (k,v) => onChange({...data,[k]:v});
  const Qs = [
    {k:"q1",n:"01",l:"What are we, really?",h:"Don't start with 'luxury ranch.' Think about what experience you actually deliver in plain terms.",ex:"A 100-year-old wilderness homestead where people come to slow way down in genuinely wild country."},
    {k:"q2",n:"02",l:"Who, specifically, is our guest?",h:"A person in a moment — not a demographic.",ex:"Someone who has the resources to go anywhere and is specifically looking for the un-resort."},
    {k:"q3",n:"03",l:"What outcome are they seeking?",h:"The internal outcome — not the activity list.",ex:"To remember that the world is bigger than their inbox, and that their family is more interesting than their phones."},
    {k:"q4",n:"04",l:"What's the alternative?",h:"What would they book if they didn't choose FCR?",ex:"Another high-end mountain resort, or an international trip that feels vaguely similar to the last three."},
    {k:"q5",n:"05",l:"What's our true differentiator?",h:"Something verifiable — not 'authenticity.'",ex:"No neighbors for 10 miles. No WiFi. A private Blue-Ribbon stream. 15 guests. A ranch gifted rather than sold."},
  ];
  return (
    <div>
      <div className="mb-6">
        <SectionPill n={2} />
        <h1 className="text-2xl font-bold mt-2 mb-1" style={{color:C.brown, fontFamily:"Georgia,serif"}}>Build Your Positioning Statement</h1>
        <p className="text-sm" style={{color:C.light}}>Answer five questions, then write the sentence.</p>
      </div>
      {Qs.map(q=>(
        <div key={q.k} className="mb-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg font-bold" style={{color:C.orange}}>{q.n}</span>
            <span className="font-semibold text-sm" style={{color:C.brown}}>{q.l}</span>
          </div>
          <Field label="" hint={q.h} example={q.ex} rows={3}
            value={data[q.k]} onChange={v=>upd(q.k,v)} />
        </div>
      ))}
      <div style={{height:"1px", background:C.border, margin:"2rem 0"}} />
      <h2 className="text-xl font-bold mb-2" style={{color:C.brown, fontFamily:"Georgia,serif"}}>Now write the full statement.</h2>
      <p className="text-sm mb-4" style={{color:C.muted}}>Flat Creek Ranch is [what we are] for [who] who want [outcome] — unlike [alternative], we [differentiator].</p>
      <Field label="Your positioning statement:" hint="It's okay if it's rough the first time. Clarity matters more than copywriting." rows={5}
        value={data.final} onChange={v=>upd("final",v)}
        placeholder="Flat Creek Ranch is..." />
    </div>
  );
};

const FormVoice = ({data, onChange}) => (
  <div>
    <div className="mb-6">
      <SectionPill n={3} />
      <h1 className="text-2xl font-bold mt-2 mb-1" style={{color:C.brown, fontFamily:"Georgia,serif"}}>Brand Voice & Language</h1>
      <p className="text-sm" style={{color:C.light}}>Extend the reference table with your own additions and describe your voice.</p>
    </div>
    <h2 className="text-lg font-bold mb-3" style={{color:C.brown}}>Add your own language entries</h2>
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div>
        <div className="py-2 px-3 rounded-t-lg text-xs font-bold" style={{background:C.green, color:"white"}}>✓  Add to "Say This"</div>
        {data.addUse.map((v,i)=>(
          <input key={i} value={v} placeholder="A word or phrase..."
            onChange={e=>{const a=[...data.addUse];a[i]=e.target.value;onChange({...data,addUse:a});}}
            style={{display:"block",width:"100%",padding:"0.5rem 0.75rem",border:`1px solid ${C.border}`,borderTop:"none",
                    fontFamily:"inherit",fontSize:"0.8rem",color:C.text,background:"white",
                    borderRadius: i===data.addUse.length-1?"0 0 0.5rem 0.5rem":"0",outline:"none"}} />
        ))}
      </div>
      <div>
        <div className="py-2 px-3 rounded-t-lg text-xs font-bold" style={{background:"#5C1A1A", color:"white"}}>✗  Add to "Avoid This"</div>
        {data.addAvoid.map((v,i)=>(
          <input key={i} value={v} placeholder="A word or phrase..."
            onChange={e=>{const a=[...data.addAvoid];a[i]=e.target.value;onChange({...data,addAvoid:a});}}
            style={{display:"block",width:"100%",padding:"0.5rem 0.75rem",border:`1px solid ${C.border}`,borderTop:"none",
                    fontFamily:"inherit",fontSize:"0.8rem",color:C.text,background:"white",
                    borderRadius: i===data.addAvoid.length-1?"0 0 0.5rem 0.5rem":"0",outline:"none"}} />
        ))}
      </div>
    </div>
    <div style={{height:"1px", background:C.border, margin:"1.5rem 0"}} />
    <Field label="How would you describe the FCR voice to a writer who'd never visited?"
      hint="Not a list of adjectives — a description. How does it sound? Who does it sound like? What does it never do?"
      example="We write the way Trey talks about the ranch: without trying to impress anyone, because the place doesn't need help with that. Specific, a little unhurried, never salesy."
      rows={5} value={data.description} onChange={v=>onChange({...data,description:v})} />
  </div>
);

const FormStories = ({data, onChange}) => {
  const upd = (k,v) => onChange({...data,[k]:v});
  const stories = [
    {k:"transfer",n:1,title:"The Transfer Story",
     summary:"The previous owners chose to give — not sell — Flat Creek Ranch to Trey and Shelby, bypassing a corporate acquisition.",
     hint:"Tell it like you'd tell it to a stranger at dinner who asked how you ended up here. 3–5 sentences."},
    {k:"origin",n:2,title:"The Origin Story",
     summary:"Homesteaded in 1922 by a former horse rustler and an American heiress — listed on the National Register of Historic Places.",
     hint:"What do you know about the countess? The rustler? The years between then and now?"},
    {k:"arrival",n:3,title:"The Arrival Ritual",
     summary:"15 miles across the National Elk Refuge on a rugged 4×4 route. Climbing to 7,400 feet. No other way in.",
     hint:"What does that drive feel like? What's the moment when guests realize they've arrived somewhere genuinely different?"},
    {k:"fish",n:4,title:"Fly Fishing Exclusivity",
     summary:"A mile and a half of private Blue-Ribbon stream with native Snake River Fine-Spotted Cutthroat trout — exclusive to FCR guests.",
     hint:"What does it feel like to fish this water? What does a guide say when a first-timer lands their first cutthroat?"},
    {k:"offgrid",n:5,title:"Off-Grid Luxury",
     summary:"Entirely off-grid on a state-of-the-art solar system. No WiFi. No generator backup. BEST-certified.",
     hint:"How does the solar system work? What do guests notice — or stop noticing — when they realize the grid is genuinely gone?"},
    {k:"owners",n:6,title:"The New Owners",
     summary:"Trey and Shelby Scharp — chosen by name by the previous owners to steward the ranch into its next century.",
     hint:"How did you end up here? What does it mean to you to be the people this place was trusted to?"},
  ];
  return (
    <div>
      <div className="mb-6">
        <SectionPill n={4} />
        <h1 className="text-2xl font-bold mt-2 mb-1" style={{color:C.brown, fontFamily:"Georgia,serif"}}>Your Key Stories — In Your Words</h1>
        <p className="text-sm" style={{color:C.light}}>Write each one the way you'd tell it at a dinner table. Editors can polish; you provide the truth.</p>
      </div>
      {stories.map(s=>(
        <div key={s.k} className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{background:C.orange, color:"white"}}>Story {s.n}</span>
            <span className="font-semibold text-sm" style={{color:C.brown}}>{s.title}</span>
          </div>
          <p className="text-xs mb-3 italic" style={{color:C.muted}}>{s.summary}</p>
          <Field label="Tell this story in your own words (3–5 sentences):" hint={s.hint} rows={5}
            value={data[s.k]} onChange={v=>upd(s.k,v)} />
          {s.n<6 && <div style={{height:"1px", background:C.border}} />}
        </div>
      ))}
    </div>
  );
};

const FormFlywheel = ({data, onChange}) => {
  const upd = (ch,k,v) => onChange({...data,[ch]:{...data[ch],[k]:v}});
  const channels = [
    {k:"pr",    name:"Earned Media & PR",     desc:"Stories in publications you didn't pay for."},
    {k:"paid",  name:"Paid Advertising",       desc:"Google Ads and social ads — controllable but stops when spend stops."},
    {k:"organic",name:"Organic Search (SEO)", desc:"Natural search results — slow to build, compounds for years."},
    {k:"email", name:"Email List",             desc:"Your past guests and warm inquiries — the only audience you own."},
    {k:"social",name:"Social Media",           desc:"Staying top-of-mind between seasons."},
  ];
  const fields = [
    {k:"status",  l:"Current status:",         p:"Describe where this channel stands right now, honestly."},
    {k:"working", l:"What's working:",         p:"Even if it's not much. What's getting traction?"},
    {k:"attention",l:"What needs attention:",  p:"What's missing, broken, or underdeveloped?"},
    {k:"next",    l:"One concrete next action:",p:"Something specific you can do in the next two weeks."},
  ];
  return (
    <div>
      <div className="mb-6">
        <SectionPill n={5} />
        <h1 className="text-2xl font-bold mt-2 mb-1" style={{color:C.brown, fontFamily:"Georgia,serif"}}>Your Marketing Channels</h1>
        <p className="text-sm" style={{color:C.light}}>Assess each channel honestly — then commit to one next action per channel.</p>
      </div>
      {channels.map(ch=>(
        <div key={ch.k} className="mb-8 rounded-xl overflow-hidden" style={{border:`1px solid ${C.border}`}}>
          <div className="px-4 py-3" style={{background:C.card}}>
            <p className="font-bold text-sm" style={{color:"white"}}>{ch.name}</p>
            <p className="text-xs" style={{color:"#F5C89A"}}>{ch.desc}</p>
          </div>
          <div className="p-4">
            {fields.map(f=>(
              <Field key={f.k} label={f.l} rows={2} placeholder={f.p}
                value={data[ch.k][f.k]}
                onChange={v=>upd(ch.k,f.k,v)} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const AUDIT_ROWS = [
  {k:"homepage",    name:"Website Homepage",         sub:"Above the fold — first impression"},
  {k:"about",       name:"Website: About Page",       sub:"Ranch history, Trey & Shelby's story"},
  {k:"activities",  name:"Website: Activities",       sub:"Horseback riding, fishing, hiking descriptions"},
  {k:"cabins",      name:"Website: Accommodations",   sub:"The five cabins and what makes each distinct"},
  {k:"sustainability",name:"Website: Sustainability", sub:"BEST certification, conservation easement"},
  {k:"instaBio",    name:"Instagram Bio",             sub:"Your 150-character introduction"},
  {k:"instaFeed",   name:"Instagram Feed",            sub:"A sample of your 10 most recent posts"},
  {k:"google",      name:"Google Business Profile",   sub:"Description, categories, photos"},
  {k:"inquiry",     name:"Inquiry Response Email",    sub:"Your first reply when someone asks about booking"},
  {k:"confirmation",name:"Booking Confirmation Email",sub:"What guests receive immediately after they book"},
  {k:"press",       name:"Press / Media Kit",         sub:"What you send journalists who inquire"},
  {k:"guestGuide",  name:"In-Room Guest Materials",   sub:"Activity guides, menus, welcome notes"},
];

const FormAudit = ({data, onChange}) => {
  const upd = (row,k,v) => onChange({...data,[row]:{...data[row],[k]:v}});
  const YN = ({val, onY, onN}) => (
    <div className="flex gap-1">
      <button onClick={onY} className="px-2 py-1 rounded text-xs font-semibold transition-all"
        style={{background: val==="Y"?C.green:"transparent", color: val==="Y"?"white":C.muted,
                border:`1px solid ${val==="Y"?C.green:C.border}`}}>Y</button>
      <button onClick={onN} className="px-2 py-1 rounded text-xs font-semibold transition-all"
        style={{background: val==="N"?"#8B2020":"transparent", color: val==="N"?"white":C.muted,
                border:`1px solid ${val==="N"?"#8B2020":C.border}`}}>N</button>
    </div>
  );
  const PRI = ({val, onChange: onChg}) => (
    <select value={val} onChange={e=>onChg(e.target.value)}
      style={{fontSize:"0.7rem", border:`1px solid ${C.border}`, borderRadius:"0.375rem",
              padding:"0.25rem", color:C.text, background:"white", fontFamily:"inherit"}}>
      <option value="">—</option>
      <option value="High">High</option>
      <option value="Med">Med</option>
      <option value="Low">Low</option>
    </select>
  );
  return (
    <div>
      <div className="mb-6">
        <SectionPill n={6} />
        <h1 className="text-2xl font-bold mt-2 mb-1" style={{color:C.brown, fontFamily:"Georgia,serif"}}>Messaging Audit</h1>
        <p className="text-sm" style={{color:C.light}}>Go touchpoint by touchpoint. Be honest. Flag priorities.</p>
      </div>
      <div className="rounded-xl overflow-hidden mb-6" style={{border:`1px solid ${C.border}`}}>
        <div className="grid text-xs font-bold py-2" style={{
          gridTemplateColumns:"2fr 0.6fr 0.6fr 0.6fr 1.5fr 0.7fr",
          background:C.card, color:"white", padding:"0.5rem 0.75rem", gap:"0.5rem"}}>
          <span>Touchpoint</span><span>ICP?</span><span>Position?</span><span>Language?</span><span>Notes</span><span>Priority</span>
        </div>
        {AUDIT_ROWS.map((row,i)=>(
          <div key={row.k} className="grid items-center px-3 py-2.5" style={{
            gridTemplateColumns:"2fr 0.6fr 0.6fr 0.6fr 1.5fr 0.7fr",
            gap:"0.5rem", background:i%2===0?"white":"#FAF8F4",
            borderTop:`1px solid ${C.border}`}}>
            <div>
              <p className="text-xs font-semibold" style={{color:C.brown}}>{row.name}</p>
              <p className="text-xs" style={{color:C.muted}}>{row.sub}</p>
            </div>
            <YN val={data[row.k].icp}
              onY={()=>upd(row.k,"icp",data[row.k].icp==="Y"?"":"Y")}
              onN={()=>upd(row.k,"icp",data[row.k].icp==="N"?"":"N")} />
            <YN val={data[row.k].pos}
              onY={()=>upd(row.k,"pos",data[row.k].pos==="Y"?"":"Y")}
              onN={()=>upd(row.k,"pos",data[row.k].pos==="N"?"":"N")} />
            <YN val={data[row.k].lang}
              onY={()=>upd(row.k,"lang",data[row.k].lang==="Y"?"":"Y")}
              onN={()=>upd(row.k,"lang",data[row.k].lang==="N"?"":"N")} />
            <input value={data[row.k].notes}
              onChange={e=>upd(row.k,"notes",e.target.value)}
              placeholder="Notes..."
              style={{fontSize:"0.75rem",border:`1px solid ${C.border}`,borderRadius:"0.375rem",
                      padding:"0.25rem 0.5rem",fontFamily:"inherit",color:C.text,background:"white",outline:"none",width:"100%"}} />
            <PRI val={data[row.k].priority} onChange={v=>upd(row.k,"priority",v)} />
          </div>
        ))}
      </div>
    </div>
  );
};

// ── WELCOME SCREEN ────────────────────────────────────────────────────────────
const WelcomeScreen = ({onStart}) => (
  <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center"
       style={{background:C.cream}}>
    <p className="text-xs font-bold tracking-widest mb-3" style={{color:C.orange}}>FLAT CREEK RANCH — JACKSON HOLE, WYOMING</p>
    <h1 className="text-4xl font-bold mb-3 leading-tight" style={{color:C.brown, fontFamily:"Georgia,serif", maxWidth:"640px"}}>
      Brand & Marketing Playbook
    </h1>
    <p className="text-base mb-8 leading-relaxed" style={{color:C.light, maxWidth:"520px"}}>
      A guided course for building the marketing foundation that makes every future decision easier — from the words on your website to the stories you pitch to journalists.
    </p>
    <div className="grid grid-cols-3 gap-4 mb-10" style={{maxWidth:"600px", width:"100%"}}>
      {[
        {icon:"📖", label:"6 sections", sub:"Each with a short lesson + your work"},
        {icon:"🎬", label:"Video slots", sub:"Add YouTube URLs when ready"},
        {icon:"📄", label:"Export anytime", sub:"Generate your brand document"},
      ].map(c=>(
        <div key={c.label} className="rounded-xl p-4" style={{background:"white", border:`1px solid ${C.border}`}}>
          <p className="text-2xl mb-1">{c.icon}</p>
          <p className="text-sm font-semibold" style={{color:C.brown}}>{c.label}</p>
          <p className="text-xs" style={{color:C.muted}}>{c.sub}</p>
        </div>
      ))}
    </div>
    <OrangeBox label="Suggested sessions:">
      Session 1: Sections 1 & 2 (ICP + Positioning) — the hardest, most important work.{"\n"}
      Session 2: Sections 3 & 4 (Voice + Stories).{"  "}Session 3: Sections 5 & 6 (Channels + Audit).
    </OrangeBox>
    <button onClick={onStart}
      className="mt-8 px-8 py-4 rounded-xl font-semibold flex items-center gap-2 transition-opacity hover:opacity-90"
      style={{background:C.orange, color:"white", fontSize:"1rem"}}>
      Begin the course <ArrowRight size={18} />
    </button>
    <p className="text-xs mt-4" style={{color:C.muted}}>Your answers save automatically as you work.</p>
  </div>
);

// ── EXPORT SCREEN ─────────────────────────────────────────────────────────────
const ExportScreen = ({answers, onBack}) => {
  const s = answers;
  const Section = ({title, children}) => (
    <div className="mb-8">
      <h2 className="text-xl font-bold pb-2 mb-4" style={{color:C.brown, fontFamily:"Georgia,serif",
          borderBottom:`2px solid ${C.orange}`}}>{title}</h2>
      {children}
    </div>
  );
  const Entry = ({label, value}) => value ? (
    <div className="mb-3">
      <p className="text-xs font-bold mb-1" style={{color:C.orange}}>{label}</p>
      <p className="text-sm leading-relaxed" style={{color:C.text}}>{value}</p>
    </div>
  ) : null;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold" style={{color:C.brown, fontFamily:"Georgia,serif"}}>Your Brand Document</h1>
          <p className="text-sm" style={{color:C.muted}}>Generated from your playbook answers — Flat Creek Ranch</p>
        </div>
        <button onClick={()=>window.print()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm"
          style={{background:C.orange, color:"white"}}>
          <FileDown size={16} /> Print / Save PDF
        </button>
      </div>

      <Section title="01 — Ideal Guest Profiles">
        {[
          {key:"natureLover", name:"Joy-Filled Nature Lovers"},
          {key:"adventurer",  name:"Aspirational Adventurers"},
          {key:"offGrid",     name:"Off-Grid Enthusiasts"},
          {key:"eco",         name:"Eco-Conscious Stewards"},
        ].map(p=>(
          <div key={p.key} className="mb-5 rounded-xl p-4" style={{background:C.fill, border:`1px solid ${C.border}`}}>
            <p className="font-bold text-sm mb-3" style={{color:C.brown}}>{p.name}</p>
            <Entry label="Who they are" value={s.icp[p.key]?.words} />
            <Entry label="Worth every dollar when..." value={s.icp[p.key]?.worthIt} />
            <Entry label="Never say" value={s.icp[p.key]?.never} />
          </div>
        ))}
        <div className="mb-5 rounded-xl p-4" style={{background:C.fill, border:`1px solid ${C.border}`}}>
          <p className="font-bold text-sm mb-3" style={{color:C.brown}}>The Repeat Guest</p>
          <Entry label="What brings them back" value={s.icp.repeat?.bringsBack} />
          <Entry label="What would make them stop" value={s.icp.repeat?.stop} />
        </div>
        <div className="rounded-xl p-4" style={{background:C.fill, border:`1px solid ${C.border}`}}>
          <p className="font-bold text-sm mb-3" style={{color:C.brown}}>Full Property Buyout</p>
          <Entry label="Common occasions" value={s.icp.buyout?.occasions} />
          <Entry label="Biggest objection" value={s.icp.buyout?.objection} />
        </div>
      </Section>

      {s.positioning.final && (
        <Section title="02 — Positioning Statement">
          <div className="rounded-xl p-5" style={{background:C.fill, border:`2px solid ${C.orange}`}}>
            <p className="text-base leading-relaxed italic" style={{color:C.card}}>{s.positioning.final}</p>
          </div>
        </Section>
      )}

      <Section title="03 — Brand Voice">
        {s.voice.description && <Entry label="How we describe our voice" value={s.voice.description} />}
        {(s.voice.addUse.some(v=>v)||s.voice.addAvoid.some(v=>v)) && (
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-xs font-bold mb-2" style={{color:C.green}}>ADDITIONAL "SAY THIS"</p>
              {s.voice.addUse.filter(v=>v).map((v,i)=><p key={i} className="text-sm mb-1" style={{color:C.text}}>• {v}</p>)}</div>
            <div><p className="text-xs font-bold mb-2" style={{color:"#8B2020"}}>ADDITIONAL "AVOID"</p>
              {s.voice.addAvoid.filter(v=>v).map((v,i)=><p key={i} className="text-sm mb-1" style={{color:C.text}}>• {v}</p>)}</div>
          </div>
        )}
      </Section>

      <Section title="04 — Key Stories">
        {[
          {k:"transfer",t:"The Transfer Story"},{k:"origin",t:"The Origin Story"},
          {k:"arrival",t:"The Arrival Ritual"},{k:"fish",t:"Fly Fishing Exclusivity"},
          {k:"offgrid",t:"Off-Grid Luxury"},{k:"owners",t:"The New Owners"},
        ].map(({k,t})=>s.stories[k]&&(
          <div key={k} className="mb-4">
            <Entry label={t} value={s.stories[k]} />
          </div>
        ))}
      </Section>

      <Section title="05 — Marketing Channels: Current State">
        {[
          {k:"pr",n:"Earned Media & PR"},{k:"paid",n:"Paid Advertising"},
          {k:"organic",n:"Organic Search"},{k:"email",n:"Email List"},
          {k:"social",n:"Social Media"},
        ].map(({k,n})=>(
          <div key={k} className="mb-4 rounded-lg p-3" style={{background:C.fill, border:`1px solid ${C.border}`}}>
            <p className="font-bold text-xs mb-2" style={{color:C.brown}}>{n}</p>
            <Entry label="Status" value={s.flywheel[k]?.status} />
            <Entry label="Next action" value={s.flywheel[k]?.next} />
          </div>
        ))}
      </Section>

      <Section title="06 — Messaging Audit: High Priorities">
        {AUDIT_ROWS.filter(r=>answers.audit[r.k]?.priority==="High").length > 0
          ? AUDIT_ROWS.filter(r=>answers.audit[r.k]?.priority==="High").map(r=>(
            <div key={r.k} className="flex items-start gap-3 mb-3">
              <span className="px-2 py-0.5 rounded text-xs font-bold flex-shrink-0"
                    style={{background:"#8B2020", color:"white"}}>HIGH</span>
              <div>
                <p className="text-sm font-semibold" style={{color:C.brown}}>{r.name}</p>
                {answers.audit[r.k].notes && <p className="text-xs" style={{color:C.muted}}>{answers.audit[r.k].notes}</p>}
              </div>
            </div>
          ))
          : <p className="text-sm italic" style={{color:C.muted}}>No high-priority items flagged yet.</p>
        }
      </Section>

      <div className="rounded-xl p-6 text-center mt-8" style={{background:C.card}}>
        <p className="text-base italic" style={{color:"#F5E8D8", fontFamily:"Georgia,serif"}}>
          "The story of Flat Creek Ranch is already extraordinary. Our job is just to make sure the right people hear it — and recognize themselves in it."
        </p>
      </div>
    </div>
  );
};

// ── SIDEBAR ───────────────────────────────────────────────────────────────────
const Sidebar = ({current, onNav, done, view}) => (
  <div className="flex flex-col h-full" style={{background:C.brown}}>
    <div className="p-5 pb-4">
      <p className="text-xs font-bold tracking-widest mb-1" style={{color:"#C9A87C"}}>FLAT CREEK RANCH</p>
      <p className="text-xs" style={{color:"rgba(255,255,255,0.5)"}}>Brand & Marketing Playbook</p>
    </div>
    <div className="px-3 pb-3">
      <div className="rounded-lg p-2" style={{background:"rgba(255,255,255,0.08)"}}>
        <div className="flex justify-between text-xs mb-1.5" style={{color:"rgba(255,255,255,0.6)"}}>
          <span>Progress</span>
          <span>{done.length}/6 complete</span>
        </div>
        <div className="rounded-full h-1.5" style={{background:"rgba(255,255,255,0.15)"}}>
          <div className="rounded-full h-1.5 transition-all"
               style={{background:C.orange, width:`${(done.length/6)*100}%`}} />
        </div>
      </div>
    </div>
    <nav className="flex-1 px-3 space-y-1">
      {SECTIONS.map(s=>{
        const isActive = current===s.id;
        const isDone = done.includes(s.id);
        return (
          <button key={s.id} onClick={()=>onNav(s.id)}
            className="w-full text-left rounded-lg px-3 py-2.5 flex items-center gap-3 transition-all"
            style={{background: isActive?"rgba(255,255,255,0.12)":"transparent"}}>
            <div className="flex-shrink-0">
              {isDone
                ? <CheckCircle size={15} style={{color:"#7BC87A"}} />
                : <Circle size={15} style={{color:isActive?"rgba(255,255,255,0.7)":"rgba(255,255,255,0.3)"}} />
              }
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold leading-tight truncate"
                 style={{color: isActive?"white": isDone?"rgba(255,255,255,0.7)":"rgba(255,255,255,0.45)"}}>
                {s.n}. {s.title}
              </p>
            </div>
          </button>
        );
      })}
    </nav>
    <div className="p-3 pt-2">
      <button onClick={()=>onNav("export")}
        className="w-full rounded-lg py-2 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all hover:opacity-90"
        style={{background:current==="export"?C.orange:"rgba(201,107,53,0.25)", color:current==="export"?"white":"#F5C89A"}}>
        <FileDown size={13} /> Generate Brand Document
      </button>
    </div>
  </div>
);

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("welcome"); // welcome | main | export
  const [section, setSection] = useState("icp");
  const [view, setView] = useState("lesson"); // lesson | form
  const [done, setDone] = useState([]);
  const [answers, setAnswers] = useState(() => {
    try { const s=localStorage.getItem("fcr_playbook"); return s?JSON.parse(s):initState(); }
    catch { return initState(); }
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(()=>{
    try { localStorage.setItem("fcr_playbook", JSON.stringify(answers)); } catch {}
  }, [answers]);

  const updSection = (id, data) => setAnswers(prev=>({...prev,[id]:data}));

  const completeSection = () => {
    if (!done.includes(section)) setDone(d=>[...d,section]);
    const idx = SECTIONS.findIndex(s=>s.id===section);
    if (idx < SECTIONS.length-1) {
      setSection(SECTIONS[idx+1].id);
      setView("lesson");
    } else {
      setScreen("export");
    }
  };

  const navTo = (id) => {
    if (id==="export") { setScreen("export"); }
    else { setSection(id); setView("lesson"); setScreen("main"); }
    setSidebarOpen(false);
  };

  const LESSONS = { icp:LessonICP, positioning:LessonPositioning, voice:LessonVoice,
                    stories:LessonStories, flywheel:LessonFlywheel, audit:LessonAudit };
  const FORMS   = { icp:FormICP, positioning:FormPositioning, voice:FormVoice,
                    stories:FormStories, flywheel:FormFlywheel, audit:FormAudit };

  if (screen==="welcome") return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&display=swap');`}</style>
      <WelcomeScreen onStart={()=>setScreen("main")} />
    </>
  );

  const LessonComp = LESSONS[section];
  const FormComp   = FORMS[section];
  const meta = SECTIONS.find(s=>s.id===section);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        textarea:focus, input:focus { box-shadow: 0 0 0 3px rgba(201,107,53,0.2); }
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
        }
      `}</style>
      <div className="flex h-screen overflow-hidden" style={{background:C.cream}}>
        {/* Sidebar — desktop */}
        <div className="hidden md:flex flex-col w-56 flex-shrink-0 no-print" style={{height:"100vh"}}>
          <Sidebar current={screen==="export"?"export":section} onNav={navTo}
                   done={done} view={view} />
        </div>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden no-print">
            <div className="w-56 flex flex-col h-full">
              <Sidebar current={screen==="export"?"export":section} onNav={navTo} done={done} view={view} />
            </div>
            <div className="flex-1" style={{background:"rgba(0,0,0,0.5)"}}
                 onClick={()=>setSidebarOpen(false)} />
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b no-print flex-shrink-0"
               style={{background:"white", borderColor:C.border}}>
            <button className="md:hidden p-1" onClick={()=>setSidebarOpen(true)}>
              <Menu size={20} style={{color:C.brown}} />
            </button>
            {screen!=="export" && (
              <div className="flex items-center gap-2">
                <button
                  onClick={()=>setView("lesson")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={{background:view==="lesson"?C.orange:"transparent",
                          color:view==="lesson"?"white":C.muted,
                          border:`1px solid ${view==="lesson"?C.orange:C.border}`}}>
                  <BookOpen size={12} /> Lesson
                </button>
                <button
                  onClick={()=>setView("form")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={{background:view==="form"?C.orange:"transparent",
                          color:view==="form"?"white":C.muted,
                          border:`1px solid ${view==="form"?C.orange:C.border}`}}>
                  <PenLine size={12} /> Your Work
                </button>
              </div>
            )}
            <div className="flex items-center gap-2">
              {screen!=="export" && meta && (
                <span className="text-xs hidden sm:block" style={{color:C.muted}}>~{meta.time}</span>
              )}
              {done.includes(section) && screen!=="export" && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{background:"#E8F5E9", color:"#2E7D32"}}>✓ Complete</span>
              )}
            </div>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 max-w-3xl w-full mx-auto">
            {screen==="export"
              ? <ExportScreen answers={answers} onBack={()=>{setScreen("main");setView("form");}} />
              : view==="lesson"
                ? <LessonComp onBegin={()=>setView("form")} />
                : (
                  <div>
                    <FormComp
                      data={answers[section]}
                      onChange={d=>updSection(section,d)} />
                    <CompleteBtn onClick={completeSection} />
                  </div>
                )
            }
          </div>
        </div>
      </div>
    </>
  );
}
