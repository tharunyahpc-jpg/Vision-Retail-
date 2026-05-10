import React, { useState, useEffect, useRef } from 'react';
import {
  Search, Heart, ShoppingBag, User, Bell, ChevronRight, ChevronLeft,
  Star, Sun, Moon, Eye, EyeOff, Plus, Minus, MapPin, CreditCard,
  Truck, Shield, ArrowRight, ArrowLeft, Check, Package, X,
  Settings, LogOut, ChevronDown, Lock, Mail, Share2, Sparkles,
  HelpCircle, Menu, Apple, Smartphone, Globe, Tag, Award, Gift,
  Calendar, TrendingUp, Crown, Zap, MessageCircle, Store, Filter,
  SlidersHorizontal, Clock,
} from 'lucide-react';

/* ──────── DESIGN TOKENS ──────── */
const r = { sm: 4, md: 6, lg: 10, xl: 14, pill: 999 };

const T = {
  display1: { fontSize: 60, fontWeight: 200, letterSpacing: -2.6, lineHeight: 0.92 },
  display2: { fontSize: 42, fontWeight: 200, letterSpacing: -1.6, lineHeight: 0.95 },
  display3: { fontSize: 32, fontWeight: 200, letterSpacing: -1.2, lineHeight: 1.05 },
  display4: { fontSize: 24, fontWeight: 200, letterSpacing: -0.7, lineHeight: 1.15 },
  body:     { fontSize: 13, fontWeight: 400, lineHeight: 1.55, letterSpacing: 0 },
  bodySm:   { fontSize: 12, fontWeight: 400, lineHeight: 1.5,  letterSpacing: 0 },
  caption:  { fontSize: 11, fontWeight: 400, lineHeight: 1.45 },
  micro:    { fontSize: 10, fontWeight: 500, lineHeight: 1.4 },
  price:    { fontSize: 13, fontWeight: 600, letterSpacing: -0.1 },
  priceL:   { fontSize: 22, fontWeight: 500, letterSpacing: -0.3 },
  eyebrow:  { fontSize: 9,  fontWeight: 700, letterSpacing: 2.4, textTransform: 'uppercase' },
  eyebrowS: { fontSize: 8,  fontWeight: 700, letterSpacing: 2.6, textTransform: 'uppercase' },
  button:   { fontSize: 11, fontWeight: 700, letterSpacing: 2,   textTransform: 'uppercase' },
  buttonSm: { fontSize: 10, fontWeight: 700, letterSpacing: 1.6, textTransform: 'uppercase' },
  meta:     { fontSize: 11, fontWeight: 500, letterSpacing: 0.1 },
  wordmark: { fontSize: 14, fontWeight: 800, letterSpacing: 3.5 },
};

/* ──────── TIERS ──────── */
const TIERS = [
  { id:'ember',   name:'Ember',   threshold:0,    next:2500, color:'#B91C1C', gradient:['#7F1D1D','#B91C1C','#DC2626'], foil:'#FCA5A5',
    benefits:['Free standard delivery on orders over $50','Members-only seasonal previews','Birthday gift on your special day','14-day extended returns'] },
  { id:'silver',  name:'Silver',  threshold:2500, next:5000, color:'#7E8597', gradient:['#9DA5B4','#C9CDD4','#7E8597'], foil:'#E5E7EB',
    benefits:['5% rewards on every order','Complimentary express delivery','Early access to new collections','30-day extended returns','Priority email support'] },
  { id:'gold',    name:'Gold',    threshold:5000, next:7500, color:'#8B6F35', gradient:['#5C4A24','#B8965A','#D4B57E'], foil:'#F5E6C7',
    benefits:['10% rewards on every order','Complimentary alterations','Birthday gift + double rewards month','Priority concierge','Free returns — no time limit','Invitation to seasonal previews'] },
  { id:'platinum',name:'Platinum',threshold:7500, next:null, color:'#525965', gradient:['#2A2F38','#525965','#9CA3AF'], foil:'#E5E4E2',
    benefits:['15% rewards on every order','Dedicated personal stylist','Atelier visits & private fittings','Invitation-only events','Lifetime warranty on Vision Studio','Complimentary monogramming','24/7 white-glove concierge'] },
];
const getTier = (s) => { for (let i=TIERS.length-1;i>=0;i--) if (s>=TIERS[i].threshold) return TIERS[i]; return TIERS[0]; };

/* ──────── PRODUCTS ──────── */
const PRODUCTS = [
  { id:1, name:'Oversized cotton-blend coat', brand:'Vision Studio', price:189, mrp:249, rating:4.7, reviews:2840, sale:false,
    bg:['#E8E1D6','#D4C9B7','#A89880'],
    images:[['#E8E1D6','#D4C9B7','#A89880'],['#D4C9B7','#A89880','#7B6D5A'],['#F0EAE0','#D8CDB9','#A89880'],['#A89880','#7B6D5A','#3E342A']],
    description:'A relaxed cotton-blend coat tailored in our Porto atelier. Drop shoulders, hidden plackets, and corozo buttons. Cut for the long view.',
    materials:'62% cotton · 38% wool · Cupro lining' },
  { id:2, name:'Soft leather crossbody bag', brand:'Maison Verte', price:145, rating:4.5, reviews:1203, sale:false,
    bg:['#A87E58','#7B5733','#4A341E'],
    images:[['#A87E58','#7B5733','#4A341E'],['#C49870','#8B6240','#5A3E22'],['#7B5733','#4A341E','#2A1D10'],['#A87E58','#8B6240','#7B5733']],
    description:'A pared-back crossbody in vegetable-tanned leather. Adjustable strap, magnetic closure, and a single interior pocket.',
    materials:'Full-grain Italian leather · Brass hardware' },
  { id:3, name:'Sculpted gold chain bracelet', brand:'Vision Edit', price:79, mrp:119, rating:4.8, reviews:5621, sale:true,
    bg:['#F0EDE7','#DDD2BB','#C4A876'],
    images:[['#F0EDE7','#DDD2BB','#C4A876'],['#DDD2BB','#C4A876','#9B8048'],['#F5F2EC','#E8DFC4','#C4A876'],['#C4A876','#9B8048','#6B5732']],
    description:'A sculptural chain in 18k gold-plated brass. Hand-finished links, lobster clasp. Designed to layer.',
    materials:'18k gold-plated brass · Hypoallergenic' },
  { id:4, name:'Wide-leg pleated trousers', brand:'Atelier Nord', price:78, rating:4.4, reviews:432, sale:false,
    bg:['#1F1F1F','#2A2A2A','#0A0A0A'],
    images:[['#1F1F1F','#2A2A2A','#0A0A0A'],['#3A3A3A','#1F1F1F','#0A0A0A'],['#2A2A2A','#0A0A0A','#000000'],['#1F1F1F','#1A1A1A','#0E0E0E']],
    description:'Front-pleated trousers in stretch wool. Hidden side adjusters and a clean drape from waist to hem.',
    materials:'82% wool · 16% polyamide · 2% elastane' },
  { id:5, name:'Linen-blend column dress', brand:'Casa Lumen', price:99, mrp:139, rating:4.6, reviews:988, sale:true,
    bg:['#E8D5D0','#C9A8A0','#9C7670'],
    images:[['#E8D5D0','#C9A8A0','#9C7670'],['#C9A8A0','#9C7670','#6B504A'],['#F0DDD8','#D6B5AC','#9C7670'],['#9C7670','#6B504A','#3E2E2A']],
    description:'A long-line column dress in midweight linen blend. Square neckline, subtle ruching at the bust, side slits.',
    materials:'68% linen · 32% viscose' },
  { id:6, name:'Ribbed merino crew knit', brand:'Rua Studio', price:65, rating:4.9, reviews:3210, sale:false,
    bg:['#C5C9BD','#9DA396','#6F7768'],
    images:[['#C5C9BD','#9DA396','#6F7768'],['#9DA396','#6F7768','#4A5345'],['#D4D8CC','#A8AE9F','#6F7768'],['#6F7768','#4A5345','#2A2F28']],
    description:'A fine-gauge merino crew with ribbed cuffs and hem. Lightweight enough for spring, warm enough for the office.',
    materials:'100% extra-fine merino · Mulesing-free' },
  { id:7, name:'Polarised acetate sunglasses', brand:'Vision Originals', price:95, mrp:140, rating:4.6, reviews:1872, sale:true,
    bg:['#3A3A38','#1F1F1E','#0A0A0A'],
    images:[['#3A3A38','#1F1F1E','#0A0A0A'],['#5A5A56','#2A2A28','#0E0E0C'],['#1F1F1E','#0A0A0A','#000000'],['#3A3A38','#2A2A28','#1F1F1E']],
    description:'Hand-cut Italian acetate frames with category-3 polarised lenses. UV400 protection, riveted hinges.',
    materials:'Italian Mazzucchelli acetate · CR-39 polarised lenses' },
  { id:8, name:'Tailored single-breasted blazer', brand:'Hojo Atelier', price:165, rating:4.7, reviews:612, sale:false,
    bg:['#D6D3CE','#A8A29E','#766F66'],
    images:[['#D6D3CE','#A8A29E','#766F66'],['#A8A29E','#766F66','#4D473F'],['#E0DDD8','#B6B0AB','#766F66'],['#766F66','#4D473F','#2E2A24']],
    description:'A clean single-breasted blazer in stretch wool. Half-canvassed, two-button closure, soft-padded shoulder.',
    materials:'Half-canvas construction · 95% wool · 5% elastane' },
];

/* ──────── COLLECTIONS ──────── */
const COLLECTIONS = {
  'new-season':   { title:'New season',  italic:'reset.',     eyebrow:'SS\u201926 — VOLUME ONE',
    subtitle:'Refined essentials for warmer days. Considered cuts, considered cloth.',
    hero:['#E8E1D6','#C9B89A'], productIds:[1,3,5,6,8,2] },
  'vision-studio':{ title:'Vision',      italic:'Studio.',    eyebrow:'MADE TO LAST',
    subtitle:'Heritage pieces from our atelier in Porto. Built for decades, not seasons.',
    hero:['#1F1F1F','#0A0A0A'], dark:true, productIds:[1,4,8,2] },
  'edit-04':      { title:'Tones of',    italic:'spring.',    eyebrow:'EDIT N°04',
    subtitle:'Soft palettes and clean silhouettes for the season ahead.',
    hero:['#E8D5D0','#B89690'], productIds:[5,1,3,6] },
  'women':        { title:'Women.',      eyebrow:'DEPARTMENT',
    subtitle:'Refined essentials and conversation pieces. For the wardrobe that lasts beyond the season.',
    hero:['#E8D5D0','#C9A8A0'], productIds:[1,3,5,6,8] },
  'men':          { title:'Men.',        eyebrow:'DEPARTMENT',
    subtitle:'Quietly considered, made to wear well. Tailoring, knits and outerwear from our atelier.',
    hero:['#1F1F1F','#0A0A0A'], dark:true, productIds:[4,8,7,1,2] },
  'studio':       { title:'Studio.',     eyebrow:'IN-HOUSE',
    subtitle:'The Vision atelier. In-house cut, in-house sewn, made in Porto.',
    hero:['#3A3530','#5C4A30'], dark:true, productIds:[1,4,8] },
  'beauty':       { title:'Beauty.',     eyebrow:'A SMALL EDIT',
    subtitle:'Skin, scent and ritual. Considered for the everyday.',
    hero:['#F0EDE7','#DDD6C7'], productIds:[3,7] },
  'sale':         { title:'The sale.',   eyebrow:'MEMBERS\u2019 DAYS',
    subtitle:'Up to 50% off the season. Three days only.',
    hero:['#7F1D1D','#B91C1C'], dark:true, productIds:[3,5,7,1] },
};

const HEROES = [
  { eyebrow:'NEW SEASON',    title:'Quietly',    italic:'bold.',    cta:'Shop the edit',  slug:'new-season',    bg:['#E8E1D6','#C9B89A'] },
  { eyebrow:'VISION STUDIO', title:'Made',       italic:'to last.', cta:'Discover',        slug:'vision-studio', bg:['#1F1F1F','#0A0A0A'], dark:true },
  { eyebrow:'EDIT N°04',     title:'Tones of',   italic:'spring.',  cta:'Read the story',  slug:'__story',       bg:['#E8D5D0','#B89690'] },
];

const CATEGORIES_GRID = [
  { name:'Women',  slug:'women',  bg:['#E8D5D0','#C9A8A0'], dark:false },
  { name:'Men',    slug:'men',    bg:['#1F1F1F','#0A0A0A'], dark:true  },
  { name:'Studio', slug:'studio', bg:['#3A3530','#5C4A30'], dark:true  },
  { name:'Beauty', slug:'beauty', bg:['#F0EDE7','#DDD6C7'], dark:false },
];

/* ──────── THEMES ──────── */
const themes = {
  light:{ bg:'#F7F4EE',bg2:'#FFFFFF',surface:'#FFFFFF',
    text:'#1A1815',textDim:'#7A736A',textMute:'#B5AEA3',
    border:'rgba(26,24,21,0.08)',borderSolid:'#E5DFD3',borderStrong:'#1A1815',
    primary:'#B91C1C',primarySoft:'#FBE5E5',
    nav:'#FFFFFF',navBorder:'rgba(26,24,21,0.08)',success:'#0A6E3F' },
  dark:{ bg:'#0E0D0B',bg2:'#16140F',surface:'#16140F',
    text:'#F1ECDF',textDim:'#9B9485',textMute:'#5C564B',
    border:'rgba(241,236,223,0.08)',borderSolid:'#2A271F',borderStrong:'#F1ECDF',
    primary:'#EF4444',primarySoft:'#2A0F0F',
    nav:'#0E0D0B',navBorder:'rgba(241,236,223,0.08)',success:'#52C497' },
};

/* ──────── PRIMITIVES ──────── */
const Eyebrow = ({ children, t, color, size }) => (
  <span style={{ ...(size===8?T.eyebrowS:T.eyebrow), color:color||t.textDim, fontFamily:'Inter,sans-serif', display:'inline-block' }}>{children}</span>
);

const ProductImage = ({ p, t, fill, showSale=true, gradient }) => {
  const g = gradient || p.bg;
  return (
    <div style={{
      width:'100%', height:fill?'100%':undefined, aspectRatio:fill?undefined:'3/4',
      background:`linear-gradient(165deg, ${g[0]} 0%, ${g[1]} 50%, ${g[2]||g[1]} 100%)`,
      position:'relative', overflow:'hidden', borderRadius:fill?0:r.md,
    }}>
      <div style={{ position:'absolute', inset:0,
        background:'radial-gradient(ellipse 60% 45% at 50% 25%, rgba(255,255,255,0.18) 0%, transparent 55%)' }}/>
      <div style={{ position:'absolute', inset:0, opacity:0.04, mixBlendMode:'overlay',
        backgroundImage:'radial-gradient(rgba(255,255,255,0.5) 0.5px, transparent 0.5px)', backgroundSize:'3px 3px' }}/>
      {p.sale && showSale && (
        <div style={{ position:'absolute', top:10, right:10, ...T.eyebrowS, color:'#fff', background:t.primary, padding:'4px 8px', borderRadius:r.sm }}>SALE</div>
      )}
    </div>
  );
};

/* ──────── IMAGE CAROUSEL ──────── */
const ImageCarousel = ({ p, t }) => {
  const [active, setActive] = useState(0);
  const ref = useRef(null);
  const onScroll = () => {
    if (!ref.current) return;
    const i = Math.round(ref.current.scrollLeft / ref.current.offsetWidth);
    if (i !== active) setActive(i);
  };
  return (
    <div style={{ position:'relative', width:'100%', aspectRatio:'3/4' }}>
      <div ref={ref} onScroll={onScroll} className="no-scrollbar" style={{
        width:'100%', height:'100%', overflowX:'auto', display:'flex',
        scrollSnapType:'x mandatory', scrollBehavior:'smooth',
      }}>
        {p.images.map((g, i) => (
          <div key={i} style={{ minWidth:'100%', height:'100%', scrollSnapAlign:'center' }}>
            <ProductImage p={p} t={t} fill showSale={i===0} gradient={g}/>
          </div>
        ))}
      </div>
      <div style={{
        position:'absolute', top:14, right:14,
        background:'rgba(26,24,21,0.55)', backdropFilter:'blur(8px)', color:'#fff',
        padding:'4px 9px', borderRadius:r.pill, ...T.eyebrowS, letterSpacing:1.4,
      }}>{active+1} / {p.images.length}</div>
      <div style={{ position:'absolute', bottom:16, left:'50%', transform:'translateX(-50%)',
        display:'flex', gap:5, padding:'5px 10px', borderRadius:r.pill,
        background:'rgba(255,255,255,0.7)', backdropFilter:'blur(8px)' }}>
        {p.images.map((_, i) => (
          <span key={i} style={{
            width: i===active?16:5, height:5, borderRadius:r.pill,
            background:'#1A1815', opacity:i===active?1:0.35, transition:'all .25s',
          }}/>
        ))}
      </div>
    </div>
  );
};

/* ──────── QTY STEPPER ──────── */
const QtyStepper = ({ qty, onMinus, onPlus, t }) => (
  <div style={{
    display:'inline-flex', alignItems:'center',
    border:`1px solid ${t.borderSolid}`, borderRadius:r.pill,
    background:t.bg, height:34,
  }}>
    <button onClick={onMinus} style={{
      width:34, height:34, borderRadius:r.pill, border:'none', background:'transparent',
      cursor:'pointer', color:t.text, display:'flex', alignItems:'center', justifyContent:'center',
    }}><Minus size={12} strokeWidth={1.75}/></button>
    <span style={{ minWidth:24, textAlign:'center', ...T.price, fontWeight:600 }}>{qty}</span>
    <button onClick={onPlus} style={{
      width:34, height:34, borderRadius:r.pill, border:'none', background:'transparent',
      cursor:'pointer', color:t.text, display:'flex', alignItems:'center', justifyContent:'center',
    }}><Plus size={12} strokeWidth={1.75}/></button>
  </div>
);

/* ──────── TIER CARD ──────── */
const TierCard = ({ tier, member, spend, compact=false, t }) => {
  const remaining = tier.next ? tier.next - spend : 0;
  const progress = tier.next ? Math.min(1, (spend - tier.threshold) / (tier.next - tier.threshold)) : 1;
  return (
    <div style={{
      aspectRatio: compact?'2.5/1':'1.6/1', borderRadius:r.xl,
      background:`linear-gradient(135deg, ${tier.gradient[0]} 0%, ${tier.gradient[1]} 50%, ${tier.gradient[2]} 100%)`,
      color:tier.foil, position:'relative', overflow:'hidden',
      padding: compact?'14px 16px':'20px',
      display:'flex', flexDirection:'column', justifyContent:'space-between',
    }}>
      <div style={{ position:'absolute', inset:0, pointerEvents:'none',
        background:`radial-gradient(ellipse 60% 40% at 30% 20%, ${tier.foil}40 0%, transparent 50%)` }}/>
      <div style={{ position:'absolute', inset:0, opacity:0.05, mixBlendMode:'overlay', pointerEvents:'none',
        backgroundImage:'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)' }}/>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', position:'relative' }}>
        <div>
          <div style={{ ...T.eyebrowS, opacity:0.75 }}>VISION MEMBER</div>
          <div style={{ fontSize: compact?22:28, fontWeight:200, letterSpacing:-0.8, marginTop:6, lineHeight:1 }}>{tier.name}</div>
        </div>
        {!compact && <div style={{ ...T.wordmark, fontSize:10, letterSpacing:3, opacity:0.85 }}>VISION<span style={{ opacity:0.6 }}>.</span></div>}
      </div>
      <div style={{ position:'relative' }}>
        {!compact ? (
          <>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:9, marginBottom:6, opacity:0.85 }}>
              <span style={{ fontWeight:700, letterSpacing:1.4 }}>{(member||'A. MEHTA').toUpperCase()}</span>
              <span style={{ fontWeight:600 }}>${spend?.toLocaleString()} YTD</span>
            </div>
            <div style={{ height:2, background:`${tier.foil}30`, position:'relative', overflow:'hidden', borderRadius:r.pill }}>
              <div style={{ position:'absolute', inset:0, width:`${progress*100}%`, background:tier.foil, transition:'width .6s ease' }}/>
            </div>
            <div style={{ ...T.eyebrowS, letterSpacing:1.5, opacity:0.7, marginTop:6 }}>
              {tier.next ? `$${remaining.toLocaleString()} TO ${TIERS[TIERS.findIndex(x=>x.id===tier.id)+1]?.name.toUpperCase()}` : 'TOP TIER · LIFETIME'}
            </div>
          </>
        ) : (
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', fontSize:9, opacity:0.85 }}>
            <span style={{ fontWeight:700, letterSpacing:1.4 }}>${spend?.toLocaleString()} YTD</span>
            <span style={{ fontWeight:600 }}>{tier.next ? `$${remaining} to ${TIERS[TIERS.findIndex(x=>x.id===tier.id)+1]?.name}` : 'Top tier'}</span>
          </div>
        )}
      </div>
    </div>
  );
};

/* ──────── PHONE FRAME ──────── */
const PhoneFrame = ({ children, t, label }) => (
  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:14 }}>
    <div style={{
      width:320, height:678, borderRadius:38, padding:7, background:'#0A0A0A',
      boxShadow:'0 30px 60px -20px rgba(0,0,0,0.35), 0 0 0 1.5px rgba(255,255,255,0.04) inset',
      position:'relative',
    }}>
      <div style={{
        width:'100%', height:'100%', borderRadius:32, background:t.bg,
        overflow:'hidden', position:'relative', fontFamily:'Inter,-apple-system,sans-serif', color:t.text,
      }}>
        <div style={{
          height:28, padding:'6px 18px 0', display:'flex', justifyContent:'space-between', alignItems:'center',
          fontSize:11, fontWeight:600, color:t.text, position:'relative',
        }}>
          <span>9:41</span>
          <div style={{ position:'absolute', left:'50%', top:8, transform:'translateX(-50%)',
            width:9, height:9, borderRadius:999, background:'#000' }}/>
          <span style={{ display:'flex', alignItems:'center', gap:5 }}>
            <span style={{ display:'inline-flex', gap:1.5, alignItems:'flex-end' }}>
              {[4,6,8,10].map(h => <span key={h} style={{ width:2.5, height:h, background:t.text, borderRadius:0.5 }}/>)}
            </span>
            <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
              <path d="M5.5 0C3.3 0 1.3 0.8 0 2.1L1.5 3.6C2.6 2.5 4 1.9 5.5 1.9C7 1.9 8.4 2.5 9.5 3.6L11 2.1C9.7 0.8 7.7 0 5.5 0Z" fill={t.text}/>
              <path d="M5.5 3.5C4.4 3.5 3.4 4 2.7 4.7L4.2 6.2C4.5 5.9 5 5.6 5.5 5.6C6 5.6 6.5 5.9 6.8 6.2L8.3 4.7C7.6 4 6.6 3.5 5.5 3.5Z" fill={t.text}/>
              <circle cx="5.5" cy="7.5" r="1" fill={t.text}/>
            </svg>
            <span style={{ width:18, height:9, border:`1px solid ${t.text}`, borderRadius:1.5, position:'relative', display:'inline-block' }}>
              <span style={{ position:'absolute', top:2, right:-2, width:1.5, height:5, background:t.text, borderRadius:0.5 }}/>
              <span style={{ position:'absolute', inset:1, background:t.text, borderRadius:0.5 }}/>
            </span>
          </span>
        </div>
        <div style={{ height:'calc(100% - 28px - 18px)', display:'flex', flexDirection:'column', position:'relative' }}>
          {children}
        </div>
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:18,
          display:'flex', alignItems:'center', justifyContent:'center', background:t.bg }}>
          <div style={{ width:100, height:3, background:t.text, opacity:0.85, borderRadius:999 }}/>
        </div>
      </div>
    </div>
    {label && <div style={{ ...T.eyebrowS, color: t===themes.light?'#1A1815':'#9B9485' }}>{label}</div>}
  </div>
);

/* ──────── HEADER ──────── */
const Header = ({ t, go, title, back='home', right }) => (
  <div style={{ padding:'14px 20px', display:'flex', alignItems:'center', gap:14,
    borderBottom:`1px solid ${t.border}`, background:t.bg, position:'relative', zIndex:5 }}>
    <button onClick={() => go(back)} style={{ background:'none', border:'none', padding:8, margin:-8, cursor:'pointer', color:t.text, display:'flex' }}>
      <ArrowLeft size={18} strokeWidth={1.5}/>
    </button>
    <div style={{ flex:1, ...T.button, fontSize:12, letterSpacing:1.6 }}>{title}</div>
    {right}
  </div>
);

/* ──────── DRAWER ──────── */
const Drawer = ({ t, open, close, go, tier, spend }) => (
  <>
    <div onClick={close} style={{ position:'absolute', inset:0, background:'rgba(10,10,10,0.5)',
      opacity:open?1:0, pointerEvents:open?'auto':'none', transition:'opacity .25s', zIndex:100 }}/>
    <div style={{
      position:'absolute', top:0, bottom:0, left:0, width:'78%', background:t.bg, zIndex:101,
      transform:open?'translateX(0)':'translateX(-100%)', transition:'transform .3s cubic-bezier(.2,.8,.2,1)',
      display:'flex', flexDirection:'column', boxShadow:open?'8px 0 30px rgba(0,0,0,0.15)':'none',
      borderTopRightRadius:r.lg, borderBottomRightRadius:r.lg, overflow:'hidden',
    }}>
      <div style={{ padding:'20px 20px 16px', borderBottom:`1px solid ${t.border}`,
        display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ ...T.wordmark }}>VISION<span style={{ color:t.primary }}>.</span></div>
        <button onClick={close} style={{ background:'none', border:'none', cursor:'pointer', color:t.text, padding:0, display:'flex' }}>
          <X size={18} strokeWidth={1.5}/>
        </button>
      </div>
      <div style={{ flex:1, overflowY:'auto' }}>
        <div style={{ padding:16 }}>
          <div onClick={() => { close(); go('tier'); }} style={{ cursor:'pointer' }}>
            <TierCard tier={tier} member="A. Mehta" spend={spend} compact t={t}/>
          </div>
        </div>
        <div style={{ padding:'4px 0' }}>
          <div style={{ padding:'8px 20px' }}><Eyebrow t={t}>Shop</Eyebrow></div>
          {[
            { l:'New in',  s:'new-season' }, { l:'Women', s:'women' }, { l:'Men', s:'men' },
            { l:'Studio',  s:'studio' },     { l:'Beauty',s:'beauty' },
            { l:'Sale',    s:'sale', tag:'UP TO 50%' },
          ].map(c => (
            <button key={c.l} onClick={() => { close(); go('category', null, c.s); }} style={{
              width:'100%', padding:'14px 20px', background:'transparent', border:'none', textAlign:'left',
              display:'flex', justifyContent:'space-between', alignItems:'center',
              ...T.body, fontWeight:400, color:t.text, fontFamily:'inherit', cursor:'pointer',
            }}>
              <span>{c.l}</span>
              {c.tag && <span style={{ ...T.eyebrowS, fontSize:9, letterSpacing:1.2, color:'#fff', background:t.primary, padding:'2px 7px', borderRadius:r.sm }}>{c.tag}</span>}
              <ChevronRight size={14} color={t.textDim}/>
            </button>
          ))}
        </div>
        <div style={{ height:1, background:t.border, margin:'8px 0' }}/>
        <div style={{ padding:'4px 0' }}>
          <div style={{ padding:'8px 20px' }}><Eyebrow t={t}>Account</Eyebrow></div>
          {[
            { l:'My orders', i:Package, go:'orders' },
            { l:'Saved items', i:Heart, go:'wishlist' },
            { l:'My bag', i:ShoppingBag, go:'cart' },
            { l:'Membership & rewards', i:Award, go:'tier' },
            { l:'Profile', i:User, go:'profile' },
          ].map(row => (
            <button key={row.l} onClick={() => { close(); go(row.go); }} style={{
              width:'100%', padding:'12px 20px', background:'transparent', border:'none', textAlign:'left',
              display:'flex', alignItems:'center', gap:14, ...T.bodySm, fontWeight:500, color:t.text, fontFamily:'inherit', cursor:'pointer',
            }}>
              <row.i size={15} strokeWidth={1.5}/>
              <span style={{ flex:1 }}>{row.l}</span>
              <ChevronRight size={13} color={t.textDim}/>
            </button>
          ))}
        </div>
        <div style={{ height:1, background:t.border, margin:'8px 0' }}/>
        <div style={{ padding:'4px 0' }}>
          {[
            { l:'Find a store', i:Store, go:'home' },
            { l:'Help & contact', i:MessageCircle, go:'tier' },
            { l:'Settings', i:Settings, go:'profile' },
          ].map(row => (
            <button key={row.l} onClick={() => { close(); go(row.go); }} style={{
              width:'100%', padding:'12px 20px', background:'transparent', border:'none', textAlign:'left',
              display:'flex', alignItems:'center', gap:14, ...T.bodySm, fontWeight:500, color:t.text, fontFamily:'inherit', cursor:'pointer',
            }}>
              <row.i size={15} strokeWidth={1.5}/><span style={{ flex:1 }}>{row.l}</span>
            </button>
          ))}
        </div>
      </div>
      <div style={{ padding:16, borderTop:`1px solid ${t.border}` }}>
        <button onClick={() => { close(); go('splash'); }} style={{
          width:'100%', padding:'12px', background:'transparent', border:`1px solid ${t.borderStrong}`, color:t.text,
          ...T.buttonSm, fontFamily:'inherit', cursor:'pointer', borderRadius:r.md,
          display:'flex', alignItems:'center', justifyContent:'center', gap:8,
        }}>
          <LogOut size={13} strokeWidth={1.5}/> Sign out
        </button>
      </div>
    </div>
  </>
);

/* ──────── SPLASH ──────── */
const SplashScreen = ({ t, go }) => (
  <div style={{ flex:1, display:'flex', flexDirection:'column', background:t.bg }}>
    <div style={{ flex:1, position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', inset:0,
        background: t===themes.light ? 'linear-gradient(170deg, #E8E1D6 0%, #C9B89A 100%)' : 'linear-gradient(170deg, #1F1B14 0%, #0A0907 100%)' }}>
        <div style={{ position:'absolute', inset:0,
          background:'radial-gradient(ellipse 70% 50% at 50% 30%, rgba(255,255,255,0.16) 0%, transparent 60%)' }}/>
        <div style={{ position:'absolute', inset:0, opacity:0.04, mixBlendMode:'overlay',
          backgroundImage:'radial-gradient(rgba(255,255,255,0.5) 0.5px, transparent 0.5px)', backgroundSize:'3px 3px' }}/>
      </div>
      <div style={{ position:'absolute', top:30, left:22, right:22, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ ...T.wordmark, color:t.text }}>VISION<span style={{ color:t.primary }}>.</span></div>
        <Globe size={15} color={t.text} strokeWidth={1.5}/>
      </div>
      <div style={{ position:'absolute', bottom:38, left:22, right:22, color:t.text }}>
        <div style={{ ...T.eyebrowS, marginBottom:16 }}>SS&rsquo;26 — VOLUME ONE</div>
        <div style={{ ...T.display1, fontSize:64, letterSpacing:-3 }}>
          Quietly<br/><em style={{ fontStyle:'italic', fontWeight:300 }}>bold.</em>
        </div>
        <div style={{ marginTop:18, maxWidth:230, ...T.bodySm, color:t.textDim }}>
          A considered wardrobe. Crafted in our atelier. Delivered to your door.
        </div>
      </div>
    </div>
    <div style={{ padding:'20px', background:t.bg, borderTop:`1px solid ${t.border}` }}>
      <button onClick={() => go('login')} style={{
        width:'100%', padding:'15px', background:t.text, color:t.bg, border:'none', cursor:'pointer',
        ...T.button, fontFamily:'inherit', borderRadius:r.md,
        display:'flex', alignItems:'center', justifyContent:'center', gap:8,
      }}>Get started <ArrowRight size={14} strokeWidth={1.5}/></button>
      <div style={{ textAlign:'center', marginTop:16, ...T.caption, color:t.textDim }}>
        Already a member?{' '}
        <span onClick={() => go('login')} style={{ color:t.text, fontWeight:600, borderBottom:`1px solid ${t.text}`, cursor:'pointer', paddingBottom:1 }}>Sign in</span>
      </div>
    </div>
  </div>
);

/* ──────── LOGIN ──────── */
const UnderlineField = ({ t, label, value, type, trailing }) => (
  <div style={{ marginBottom:22 }}>
    <div style={{ ...T.eyebrow, color:t.textDim, marginBottom:10 }}>{label}</div>
    <div style={{ display:'flex', alignItems:'center', gap:10, paddingBottom:11, borderBottom:`1px solid ${t.borderStrong}` }}>
      <input readOnly type={type||'text'} value={value} style={{
        flex:1, border:'none', outline:'none', background:'transparent',
        color:t.text, fontSize:14, fontFamily:'inherit', padding:0, fontWeight:500,
      }}/>
      {trailing}
    </div>
  </div>
);

const LoginScreen = ({ t, go }) => {
  const [show, setShow] = useState(false);
  return (
    <div style={{ flex:1, padding:'24px 22px', display:'flex', flexDirection:'column', background:t.bg, overflowY:'auto', minHeight:0 }}>
      <button onClick={() => go('splash')} style={{ background:'none', border:'none', padding:8, margin:-8, cursor:'pointer', color:t.text, alignSelf:'flex-start', display:'flex' }}>
        <X size={20} strokeWidth={1.5}/>
      </button>
      <div style={{ marginTop:40 }}>
        <Eyebrow t={t}>Member</Eyebrow>
        <div style={{ ...T.display3, fontSize:38, letterSpacing:-1.5, marginTop:12 }}>Sign in.</div>
        <div style={{ ...T.body, color:t.textDim, marginTop:10 }}>Continue to your wardrobe, orders, and rewards.</div>
      </div>
      <div style={{ marginTop:36 }}>
        <UnderlineField t={t} label="EMAIL OR MOBILE" value="alex@vision.com"/>
        <UnderlineField t={t} label="PASSWORD" value="••••••••••" type={show?'text':'password'}
          trailing={<button onClick={() => setShow(!show)} style={{ background:'none', border:'none', cursor:'pointer', color:t.textDim, padding:0, display:'flex' }}>
            {show ? <EyeOff size={15} strokeWidth={1.5}/> : <Eye size={15} strokeWidth={1.5}/>}
          </button>}/>
        <div style={{ textAlign:'right', marginTop:16 }}>
          <span style={{ ...T.buttonSm, color:t.textDim, borderBottom:`1px solid ${t.textDim}`, paddingBottom:1, cursor:'pointer' }}>Forgot password</span>
        </div>
      </div>
      <button onClick={() => go('home')} style={{
        marginTop:28, padding:'15px', background:t.text, color:t.bg, border:'none', cursor:'pointer',
        ...T.button, fontFamily:'inherit', borderRadius:r.md,
        display:'flex', alignItems:'center', justifyContent:'center', gap:8,
      }}>Sign in <ArrowRight size={13} strokeWidth={1.5}/></button>
      <div style={{ display:'flex', alignItems:'center', gap:12, margin:'32px 0 18px',
        fontSize:9, color:t.textMute, letterSpacing:2, fontWeight:600 }}>
        <span style={{ flex:1, height:1, background:t.border }}/> OR <span style={{ flex:1, height:1, background:t.border }}/>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {[{ i:Apple, l:'Continue with Apple' },{ i:Globe, l:'Continue with Google' }].map(s => (
          <button key={s.l} style={{
            padding:'14px 16px', border:`1px solid ${t.borderSolid}`, background:'transparent',
            color:t.text, ...T.buttonSm, cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center', gap:10, fontFamily:'inherit', borderRadius:r.md,
          }}><s.i size={14} strokeWidth={1.5}/> {s.l}</button>
        ))}
      </div>
      <div style={{ marginTop:'auto', textAlign:'center', ...T.caption, color:t.textDim, paddingTop:28 }}>
        New to Vision?{' '}
        <span style={{ color:t.text, fontWeight:600, borderBottom:`1px solid ${t.text}`, cursor:'pointer', paddingBottom:1 }}>Become a member</span>
      </div>
    </div>
  );
};

/* ──────── HOME ──────── */
const HomeScreen = ({ t, go, toggleWish, wishlist, cartCount, openDrawer, tier, spend }) => {
  const [heroIdx, setHeroIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setHeroIdx(i => (i+1) % HEROES.length), 5000);
    return () => clearInterval(id);
  }, []);
  const hero = HEROES[heroIdx];
  const handleHeroCta = () => {
    if (hero.slug === '__story') go('story');
    else go('category', null, hero.slug);
  };

  return (
    <div style={{ flex:1, overflowY:'auto', paddingBottom:64, background:t.bg }}>
      <div style={{ padding:'12px 20px', display:'flex', justifyContent:'space-between', alignItems:'center',
        position:'sticky', top:0, background:t.bg, zIndex:10, borderBottom:`1px solid ${t.border}` }}>
        <button onClick={openDrawer} style={{ background:'none', border:'none', padding:8, margin:-8, cursor:'pointer', color:t.text, display:'flex' }}>
          <Menu size={19} strokeWidth={1.5}/>
        </button>
        <div style={{ ...T.wordmark }}>VISION<span style={{ color:t.primary }}>.</span></div>
        <div style={{ display:'flex', gap:14 }}>
          <button onClick={() => go('search')} style={{ background:'none', border:'none', padding:8, margin:-8, cursor:'pointer', color:t.text, display:'flex' }}>
            <Search size={17} strokeWidth={1.5}/>
          </button>
          <button onClick={() => go('cart')} style={{ background:'none', border:'none', padding:8, margin:-8, cursor:'pointer', color:t.text, position:'relative', display:'flex' }}>
            <ShoppingBag size={17} strokeWidth={1.5}/>
            {cartCount > 0 && (
              <span style={{ position:'absolute', top:-4, right:-6, fontSize:8, fontWeight:700, color:'#fff',
                background:t.primary, minWidth:13, height:13, borderRadius:r.pill,
                display:'flex', alignItems:'center', justifyContent:'center' }}>{cartCount}</span>
            )}
          </button>
        </div>
      </div>

      <div style={{ height:480, position:'relative', overflow:'hidden',
        background:`linear-gradient(170deg, ${hero.bg[0]} 0%, ${hero.bg[1]} 100%)` }}>
        <div style={{ position:'absolute', inset:0,
          background:'radial-gradient(ellipse 80% 50% at 60% 30%, rgba(255,255,255,0.18) 0%, transparent 60%)' }}/>
        <div style={{ position:'absolute', inset:0, opacity:0.05, mixBlendMode:'overlay',
          backgroundImage:'radial-gradient(rgba(255,255,255,0.5) 0.5px, transparent 0.5px)', backgroundSize:'3px 3px' }}/>
        <div style={{ position:'absolute', bottom:30, left:22, right:22, color: hero.dark?'#F1ECDF':'#1A1815' }}>
          <div style={{ ...T.eyebrowS, marginBottom:16 }}>{hero.eyebrow}</div>
          <div style={{ ...T.display1, fontSize:64, letterSpacing:-3 }}>
            {hero.title}<br/><em style={{ fontStyle:'italic', fontWeight:300 }}>{hero.italic}</em>
          </div>
          <button onClick={handleHeroCta} style={{
            marginTop:24, background:'transparent', border:'none', color:'inherit', padding:0, cursor:'pointer',
            ...T.buttonSm, fontFamily:'inherit', borderBottom:`1px solid ${hero.dark?'#F1ECDF':'#1A1815'}`, paddingBottom:4,
          }}>{hero.cta} →</button>
        </div>
        <div style={{ position:'absolute', bottom:14, right:22, display:'flex', gap:4 }}>
          {HEROES.map((_,i) => (
            <span key={i} style={{ width: i===heroIdx?18:4, height:1.5, background: hero.dark?'#F1ECDF':'#1A1815',
              opacity: i===heroIdx?1:0.4, transition:'all .4s' }}/>
          ))}
        </div>
      </div>

      <div onClick={() => go('tier')} style={{
        margin:'24px 20px', padding:'14px 16px', cursor:'pointer', borderRadius:r.lg,
        background:`linear-gradient(95deg, ${tier.gradient[0]} 0%, ${tier.gradient[1]} 60%, ${tier.gradient[2]} 100%)`,
        color:tier.foil, position:'relative', overflow:'hidden',
      }}>
        <div style={{ position:'absolute', inset:0, pointerEvents:'none',
          background:`radial-gradient(ellipse 60% 100% at 80% 50%, ${tier.foil}30 0%, transparent 60%)` }}/>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', position:'relative' }}>
          <div>
            <div style={{ ...T.eyebrowS, opacity:0.75 }}>VISION MEMBER</div>
            <div style={{ fontSize:18, fontWeight:300, letterSpacing:-0.5, marginTop:3 }}>
              {tier.name} · ${spend.toLocaleString()}
            </div>
          </div>
          <ArrowRight size={16} strokeWidth={1.5}/>
        </div>
        {tier.next && (
          <div style={{ marginTop:10, position:'relative' }}>
            <div style={{ height:1.5, background:`${tier.foil}30`, borderRadius:r.pill }}>
              <div style={{ height:'100%', width:`${Math.min(1, (spend - tier.threshold) / (tier.next - tier.threshold))*100}%`,
                background:tier.foil, borderRadius:r.pill }}/>
            </div>
            <div style={{ ...T.eyebrowS, letterSpacing:1.4, opacity:0.75, marginTop:6 }}>
              ${(tier.next - spend).toLocaleString()} TO {TIERS[TIERS.findIndex(x => x.id===tier.id)+1].name.toUpperCase()}
            </div>
          </div>
        )}
      </div>

      <div style={{ padding:'24px 20px 4px' }}>
        <div style={{ marginBottom:16 }}><Eyebrow t={t}>Departments</Eyebrow></div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
          {CATEGORIES_GRID.map(c => (
            <button key={c.name} onClick={() => go('category', null, c.slug)} style={{
              aspectRatio:'1/1.25', position:'relative', overflow:'hidden', cursor:'pointer',
              background:`linear-gradient(165deg, ${c.bg[0]} 0%, ${c.bg[1]} 100%)`,
              border:'none', padding:0, fontFamily:'inherit', textAlign:'left', borderRadius:r.md,
            }}>
              <div style={{ position:'absolute', inset:0,
                background:'radial-gradient(ellipse 70% 50% at 50% 30%, rgba(255,255,255,0.15) 0%, transparent 60%)' }}/>
              <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:16, color: c.dark?'#F1ECDF':'#1A1815' }}>
                <div style={{ ...T.display4, fontSize:22, letterSpacing:-0.5, lineHeight:1 }}>{c.name}</div>
                <div style={{ ...T.eyebrowS, fontSize:9, marginTop:6, opacity:0.7 }}>SHOP →</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding:'40px 0 4px' }}>
        <div style={{ padding:'0 20px', display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:18 }}>
          <div>
            <Eyebrow t={t}>The edit</Eyebrow>
            <div style={{ ...T.display4, marginTop:6 }}>New this week</div>
          </div>
          <button onClick={() => go('category', null, 'new-season')} style={{
            background:'none', border:'none', padding:0, cursor:'pointer',
            ...T.buttonSm, color:t.textDim, fontFamily:'inherit',
          }}>See all</button>
        </div>
        <div style={{ display:'flex', gap:10, padding:'0 20px', overflowX:'auto' }} className="no-scrollbar">
          {PRODUCTS.slice(0,5).map(p => (
            <div key={p.id} onClick={() => go('product', p)} style={{ minWidth:158, cursor:'pointer' }}>
              <div style={{ width:158, height:211 }}><ProductImage p={p} t={t} fill/></div>
              <div style={{ marginTop:10 }}>
                <div style={{ ...T.eyebrowS, color:t.textDim, fontSize:9, letterSpacing:1.2 }}>{p.brand}</div>
                <div style={{ ...T.bodySm, marginTop:4, overflow:'hidden', display:'-webkit-box', WebkitLineClamp:1, WebkitBoxOrient:'vertical' }}>{p.name}</div>
                <div style={{ ...T.price, marginTop:4, color: p.sale?t.primary:t.text }}>
                  ${p.price}{p.mrp && <span style={{ marginLeft:6, color:t.textMute, textDecoration:'line-through', fontWeight:400 }}>${p.mrp}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div onClick={() => go('story')} style={{ marginTop:36, height:400, position:'relative', overflow:'hidden', cursor:'pointer',
        background:'linear-gradient(170deg, #2A2520 0%, #0E0D0B 100%)' }}>
        <div style={{ position:'absolute', inset:0,
          background:'radial-gradient(ellipse 50% 35% at 30% 70%, rgba(185,28,28,0.16) 0%, transparent 60%)' }}/>
        <div style={{ position:'absolute', top:36, left:22, right:22, color:'#F1ECDF' }}>
          <div style={{ ...T.eyebrowS, color:t.primary }}>STORY N°04</div>
          <div style={{ ...T.display2, marginTop:14, maxWidth:220 }}>
            The art<br/>of <em style={{ fontStyle:'italic' }}>restraint.</em>
          </div>
        </div>
        <div style={{ position:'absolute', bottom:32, left:22, right:22, color:'#F1ECDF' }}>
          <div style={{ ...T.bodySm, opacity:0.7, maxWidth:240, marginBottom:18 }}>
            How our atelier in Porto reimagined the everyday wardrobe — one essential at a time.
          </div>
          <span style={{ ...T.buttonSm, fontSize:11, letterSpacing:1.6, borderBottom:'1px solid #F1ECDF', paddingBottom:4 }}>Read the story</span>
        </div>
      </div>

      <div style={{ padding:'32px 20px 24px' }}>
        <div onClick={() => go('category', null, 'sale')} style={{
          height:380, position:'relative', overflow:'hidden', cursor:'pointer', borderRadius:r.lg,
          background:'linear-gradient(180deg, #4A0E0E 0%, #7F1D1D 30%, #B91C1C 60%, #5A0F0F 100%)',
        }}>
          <div style={{ position:'absolute', inset:14, border:'1px solid rgba(252,165,165,0.28)', borderRadius:r.md, pointerEvents:'none' }}/>
          <div style={{ position:'absolute', inset:0,
            background:'radial-gradient(ellipse 70% 50% at 50% 35%, rgba(252,165,165,0.18) 0%, transparent 60%)' }}/>
          <div style={{ position:'absolute', inset:0, opacity:0.06, mixBlendMode:'overlay',
            backgroundImage:'radial-gradient(rgba(255,255,255,0.5) 0.5px, transparent 0.5px)', backgroundSize:'3px 3px' }}/>
          <div style={{ position:'absolute', inset:0, padding:'34px 28px',
            display:'flex', flexDirection:'column', justifyContent:'space-between', alignItems:'center', textAlign:'center', color:'#fff' }}>
            <div style={{ display:'flex', alignItems:'center', gap:14, opacity:0.9 }}>
              <span style={{ width:28, height:1, background:'#FCA5A5' }}/>
              <span style={{ ...T.eyebrowS, color:'#FCA5A5', letterSpacing:3 }}>MEMBERS&rsquo; DAYS</span>
              <span style={{ width:28, height:1, background:'#FCA5A5' }}/>
            </div>
            <div>
              <div style={{ fontSize:54, fontWeight:200, letterSpacing:-2, lineHeight:0.95 }}>
                Up to<br/><em style={{ fontStyle:'italic', fontWeight:300 }}>50% off.</em>
              </div>
              <div style={{ marginTop:18, ...T.bodySm, opacity:0.85, maxWidth:230, marginInline:'auto' }}>
                The full season — privately previewed for members. Three days only.
              </div>
            </div>
            <button style={{
              background:'#fff', color:'#1A1815', border:'none', cursor:'pointer',
              padding:'14px 32px', borderRadius:r.pill, ...T.buttonSm, fontFamily:'inherit',
              display:'flex', alignItems:'center', gap:8,
            }}>Shop the sale <ArrowRight size={13} strokeWidth={2}/></button>
          </div>
        </div>
      </div>

      <div style={{ padding:'0 20px 40px' }}>
        <div style={{ marginBottom:18 }}>
          <Eyebrow t={t}>Trending</Eyebrow>
          <div style={{ ...T.display4, marginTop:6 }}>Most loved</div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          {PRODUCTS.slice(2,8).map(p => (
            <ProductCard key={p.id} p={p} t={t} go={go} toggleWish={toggleWish} wished={wishlist.has(p.id)}/>
          ))}
        </div>
      </div>
    </div>
  );
};

const ProductCard = ({ p, t, go, toggleWish, wished }) => (
  <div onClick={() => go('product', p)} style={{ cursor:'pointer' }}>
    <div style={{ position:'relative' }}>
      <ProductImage p={p} t={t}/>
      <button onClick={(e) => { e.stopPropagation(); toggleWish(p.id); }} style={{
        position:'absolute', top:8, left:8,
        background:'rgba(255,255,255,0.85)', backdropFilter:'blur(6px)',
        border:'none', cursor:'pointer', padding:5, color:'#1A1815',
        width:28, height:28, borderRadius:r.pill,
        display:'flex', alignItems:'center', justifyContent:'center',
      }}><Heart size={13} fill={wished?'#1A1815':'none'} strokeWidth={1.5}/></button>
    </div>
    <div style={{ marginTop:10 }}>
      <div style={{ ...T.eyebrowS, color:t.textDim, fontSize:9, letterSpacing:1.2 }}>{p.brand}</div>
      <div style={{ ...T.bodySm, marginTop:4,
        overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', minHeight:36 }}>{p.name}</div>
      <div style={{ ...T.price, marginTop:4, color: p.sale?t.primary:t.text }}>
        ${p.price}{p.mrp && <span style={{ marginLeft:6, color:t.textMute, textDecoration:'line-through', fontWeight:400 }}>${p.mrp}</span>}
      </div>
    </div>
  </div>
);

/* ──────── CATEGORY ──────── */
const SORTS = ['Featured', 'Low to high', 'High to low', 'Top rated'];
const CategoryScreen = ({ t, go, slug, toggleWish, wishlist }) => {
  const c = COLLECTIONS[slug] || COLLECTIONS['new-season'];
  const baseItems = c.productIds.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);
  const [sortIdx, setSortIdx] = useState(0);
  const [saleOnly, setSaleOnly] = useState(false);
  const filtered = saleOnly ? baseItems.filter(p => p.sale) : baseItems;
  const items = [...filtered].sort((a,b) => {
    if (sortIdx === 1) return a.price - b.price;
    if (sortIdx === 2) return b.price - a.price;
    if (sortIdx === 3) return b.rating - a.rating;
    return 0;
  });
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', background:t.bg }}>
      <div style={{ position:'sticky', top:0, zIndex:10, background:t.bg }}>
        <div style={{ padding:'12px 20px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <button onClick={() => go('home')} style={{ background:'none', border:'none', padding:8, margin:-8, cursor:'pointer', color:t.text, display:'flex' }}>
            <ArrowLeft size={18} strokeWidth={1.5}/>
          </button>
          <div style={{ ...T.wordmark, fontSize:13, letterSpacing:3 }}>VISION<span style={{ color:t.primary }}>.</span></div>
          <button onClick={() => go('search')} style={{ background:'none', border:'none', padding:8, margin:-8, cursor:'pointer', color:t.text, display:'flex' }}>
            <Search size={17} strokeWidth={1.5}/>
          </button>
        </div>
      </div>

      <div style={{ flex:1, overflowY:'auto', minHeight:0, paddingBottom:30 }}>
        <div style={{ height:300, position:'relative', overflow:'hidden',
          background:`linear-gradient(170deg, ${c.hero[0]} 0%, ${c.hero[1]} 100%)` }}>
          <div style={{ position:'absolute', inset:0,
            background:'radial-gradient(ellipse 70% 50% at 50% 35%, rgba(255,255,255,0.16) 0%, transparent 60%)' }}/>
          <div style={{ position:'absolute', inset:0, opacity:0.05, mixBlendMode:'overlay',
            backgroundImage:'radial-gradient(rgba(255,255,255,0.5) 0.5px, transparent 0.5px)', backgroundSize:'3px 3px' }}/>
          <div style={{ position:'absolute', bottom:24, left:22, right:22, color: c.dark?'#F1ECDF':'#1A1815' }}>
            <div style={{ ...T.eyebrowS, opacity:0.85 }}>{c.eyebrow}</div>
            <div style={{ ...T.display2, fontSize:44, letterSpacing:-1.8, marginTop:12 }}>
              {c.title}{c.italic && <><br/><em style={{ fontStyle:'italic', fontWeight:300 }}>{c.italic}</em></>}
            </div>
            <div style={{ ...T.bodySm, marginTop:14, opacity:0.85, maxWidth:240 }}>{c.subtitle}</div>
          </div>
        </div>

        <div style={{ padding:'14px 20px', display:'flex', justifyContent:'space-between', alignItems:'center',
          borderBottom:`1px solid ${t.border}`, background:t.bg }}>
          <div style={{ ...T.caption, color:t.textDim, fontWeight:500 }}>{items.length} items</div>
          <div style={{ display:'flex', gap:14 }}>
            <button onClick={() => setSortIdx(i => (i+1) % SORTS.length)} style={{ background:'none', border:'none', padding:0, cursor:'pointer', color:t.text,
              ...T.buttonSm, fontFamily:'inherit', display:'flex', alignItems:'center', gap:5 }}>
              <SlidersHorizontal size={12} strokeWidth={1.5}/> {SORTS[sortIdx]}
            </button>
            <button onClick={() => setSaleOnly(s => !s)} style={{ background:'none', border:'none', padding:0, cursor:'pointer',
              ...T.buttonSm, fontFamily:'inherit', display:'flex', alignItems:'center', gap:5,
              color: saleOnly ? t.primary : t.text }}>
              <Filter size={12} strokeWidth={1.5}/> {saleOnly ? 'Sale ✓' : 'Filter'}
            </button>
          </div>
        </div>

        <div style={{ padding:'20px 20px 40px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          {items.map(p => (
            <ProductCard key={p.id} p={p} t={t} go={go} toggleWish={toggleWish} wished={wishlist.has(p.id)}/>
          ))}
          {items.length === 0 && (
            <div style={{ gridColumn:'1/-1', padding:'40px 0', textAlign:'center', ...T.bodySm, color:t.textDim }}>
              No items match these filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ──────── STORY ──────── */
const StoryScreen = ({ t, go, toggleWish, wishlist }) => {
  const featured = [PRODUCTS[0], PRODUCTS[5], PRODUCTS[7], PRODUCTS[2]];
  const handleShare = () => {
    if (navigator.share) navigator.share({ title:'Vision · Story N°04', text:'The art of restraint.' }).catch(() => {});
  };
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', background:t.bg }}>
      <div style={{ position:'sticky', top:0, zIndex:10, background:t.bg, borderBottom:`1px solid ${t.border}` }}>
        <div style={{ padding:'12px 20px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <button onClick={() => go('home')} style={{ background:'none', border:'none', padding:8, margin:-8, cursor:'pointer', color:t.text, display:'flex' }}>
            <ArrowLeft size={18} strokeWidth={1.5}/>
          </button>
          <div style={{ ...T.eyebrowS }}>STORY N°04</div>
          <button onClick={handleShare} style={{ background:'none', border:'none', padding:8, margin:-8, cursor:'pointer', color:t.text, display:'flex' }}>
            <Share2 size={16} strokeWidth={1.5}/>
          </button>
        </div>
      </div>
      <div style={{ flex:1, overflowY:'auto', minHeight:0, paddingBottom:30 }}>
        <div style={{ height:420, position:'relative', overflow:'hidden',
          background:'linear-gradient(170deg, #2A2520 0%, #0E0D0B 100%)' }}>
          <div style={{ position:'absolute', inset:0,
            background:'radial-gradient(ellipse 50% 40% at 30% 65%, rgba(185,28,28,0.20) 0%, transparent 60%)' }}/>
          <div style={{ position:'absolute', inset:0, opacity:0.06, mixBlendMode:'overlay',
            backgroundImage:'radial-gradient(rgba(255,255,255,0.5) 0.5px, transparent 0.5px)', backgroundSize:'3px 3px' }}/>
          <div style={{ position:'absolute', top:40, left:22, right:22, color:'#F1ECDF' }}>
            <div style={{ ...T.eyebrowS, color:t.primary }}>STORY N°04 · NEW SEASON</div>
            <div style={{ ...T.display1, fontSize:48, letterSpacing:-2, marginTop:18 }}>
              The art<br/>of <em style={{ fontStyle:'italic' }}>restraint.</em>
            </div>
          </div>
          <div style={{ position:'absolute', bottom:28, left:22, right:22, color:'#F1ECDF' }}>
            <div style={{ ...T.eyebrowS, opacity:0.7, marginBottom:8 }}>WORDS — MIRA SODHI</div>
            <div style={{ ...T.caption, opacity:0.7, display:'flex', alignItems:'center', gap:10 }}>
              <span>Photography by Lucien Frey</span>
              <span style={{ width:3, height:3, borderRadius:r.pill, background:'#F1ECDF', opacity:0.5 }}/>
              <span style={{ display:'flex', alignItems:'center', gap:4 }}><Clock size={11} strokeWidth={1.5}/> 8 min</span>
            </div>
          </div>
        </div>

        <div style={{ padding:'32px 24px 24px' }}>
          <p style={{ ...T.body, fontSize:14, lineHeight:1.75, color:t.text, margin:0 }}>
            There is a certain courage in subtraction. In an industry built on ornamentation, our atelier in Porto begins each season with a question that feels almost defiant: <em>what can we leave out?</em>
          </p>
          <p style={{ ...T.body, fontSize:14, lineHeight:1.75, color:t.text, marginTop:18 }}>
            The answer, season after season, has been silhouettes that breathe, materials that age into themselves, and palettes drawn from the wall of the studio at six in the morning. Stone. Ash. Ochre. The particular cream of unbleached linen.
          </p>

          <div style={{ margin:'34px -8px 34px', padding:'24px 22px', borderLeft:`2px solid ${t.primary}` }}>
            <div style={{ fontFamily:'Georgia, serif', fontStyle:'italic', fontSize:22, lineHeight:1.4, color:t.text, fontWeight:300, letterSpacing:-0.4 }}>
              &ldquo;We are not designing for this season. We are designing for the wardrobe you will still reach for in five years.&rdquo;
            </div>
            <div style={{ ...T.eyebrowS, color:t.textDim, marginTop:14 }}>— ANA RIBEIRO, ATELIER DIRECTOR</div>
          </div>

          <p style={{ ...T.body, fontSize:14, lineHeight:1.75, color:t.text, margin:0 }}>
            This idea — the long view — guides every decision. The buttons are corozo, not plastic. The seams are felled, not serged. The lining of the coat is a single piece of cupro, hand-set into the shoulder. None of it is visible. All of it matters.
          </p>
        </div>

        <div style={{ height:280, margin:'8px 24px 32px', borderRadius:r.md, overflow:'hidden',
          background:`linear-gradient(165deg, #E8E1D6 0%, #C9B89A 50%, #A89880 100%)`, position:'relative' }}>
          <div style={{ position:'absolute', inset:0,
            background:'radial-gradient(ellipse 60% 45% at 50% 25%, rgba(255,255,255,0.20) 0%, transparent 55%)' }}/>
          <div style={{ position:'absolute', bottom:14, left:16, right:16, ...T.eyebrowS, color:'#1A1815', opacity:0.7 }}>
            ATELIER VISION · PORTO · 2026
          </div>
        </div>

        <div style={{ padding:'0 24px 28px' }}>
          <p style={{ ...T.body, fontSize:14, lineHeight:1.75, color:t.text, margin:0 }}>
            &ldquo;What you wear should disappear into the day,&rdquo; Ribeiro says, folding a coat back onto its hanger. &ldquo;It should not perform. It should arrive.&rdquo;
          </p>
        </div>

        <div style={{ padding:'24px 20px 36px', borderTop:`1px solid ${t.border}` }}>
          <Eyebrow t={t}>Shop the story</Eyebrow>
          <div style={{ ...T.display4, marginTop:6, marginBottom:18 }}>The edit, in full</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            {featured.map(p => (
              <ProductCard key={p.id} p={p} t={t} go={go} toggleWish={toggleWish} wished={wishlist.has(p.id)}/>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ──────── SEARCH ──────── */
const SearchScreen = ({ t, go, toggleWish, wishlist }) => {
  const [q, setQ] = useState('');
  const [sortIdx, setSortIdx] = useState(0);
  const [saleOnly, setSaleOnly] = useState(false);
  const matches = q ? PRODUCTS.filter(p => p.name.toLowerCase().includes(q.toLowerCase()) || p.brand.toLowerCase().includes(q.toLowerCase())) : PRODUCTS;
  const filtered = saleOnly ? matches.filter(p => p.sale) : matches;
  const list = [...filtered].sort((a,b) => {
    if (sortIdx === 1) return a.price - b.price;
    if (sortIdx === 2) return b.price - a.price;
    if (sortIdx === 3) return b.rating - a.rating;
    return 0;
  });
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', background:t.bg }}>
      <div style={{ padding:'16px 20px', borderBottom:`1px solid ${t.border}` }}>
        <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:16 }}>
          <button onClick={() => go('home')} style={{ background:'none', border:'none', padding:8, margin:-8, cursor:'pointer', color:t.text, display:'flex' }}>
            <X size={20} strokeWidth={1.5}/>
          </button>
          <div style={{ ...T.button, fontSize:12, letterSpacing:1.6 }}>Search</div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:10, paddingBottom:12, borderBottom:`1.5px solid ${t.text}` }}>
          <Search size={15} color={t.text} strokeWidth={1.5}/>
          <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder="What are you looking for?"
            style={{ flex:1, border:'none', outline:'none', background:'transparent', color:t.text, fontSize:14, fontFamily:'inherit', fontWeight:400 }}/>
          {q && <button onClick={() => setQ('')} style={{ background:'none', border:'none', cursor:'pointer', color:t.textDim, padding:0, display:'flex' }}><X size={14} strokeWidth={1.5}/></button>}
        </div>
      </div>
      {!q ? (
        <div style={{ flex:1, overflowY:'auto', minHeight:0, padding:'20px 20px 80px' }}>
          <div style={{ marginBottom:28 }}>
            <Eyebrow t={t}>Recent</Eyebrow>
            <div style={{ marginTop:14 }}>
              {['linen blazer','oversized coat','leather bag','merino knit'].map(s => (
                <div key={s} onClick={() => setQ(s)} style={{
                  padding:'14px 0', borderBottom:`1px solid ${t.border}`,
                  display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'pointer',
                }}>
                  <span style={{ ...T.body }}>{s}</span>
                  <ArrowRight size={13} color={t.textDim} strokeWidth={1.5}/>
                </div>
              ))}
            </div>
          </div>
          <div>
            <Eyebrow t={t}>Trending</Eyebrow>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginTop:14 }}>
              {['Vision Studio','Spring &rsquo;26','Wide-leg','Cashmere','SALE'].map(s => (
                <span key={s} onClick={() => setQ(s)} style={{
                  padding:'8px 14px', border:`1px solid ${t.borderStrong}`, borderRadius:r.pill,
                  ...T.caption, fontWeight:500, cursor:'pointer',
                }}>{s}</span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ flex:1, overflowY:'auto', minHeight:0, paddingBottom:80 }}>
          <div style={{ padding:'14px 20px', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:`1px solid ${t.border}` }}>
            <span style={{ ...T.caption, color:t.textDim }}>{list.length} items</span>
            <div style={{ display:'flex', gap:18 }}>
              <button onClick={() => setSortIdx(i => (i+1) % SORTS.length)} style={{
                background:'none', border:'none', padding:0, cursor:'pointer', color:t.text,
                ...T.buttonSm, fontFamily:'inherit', display:'flex', alignItems:'center', gap:5,
              }}><SlidersHorizontal size={12} strokeWidth={1.5}/> {SORTS[sortIdx]}</button>
              <button onClick={() => setSaleOnly(s => !s)} style={{
                background:'none', border:'none', padding:0, cursor:'pointer',
                ...T.buttonSm, fontFamily:'inherit', display:'flex', alignItems:'center', gap:5,
                color: saleOnly ? t.primary : t.text,
              }}><Filter size={12} strokeWidth={1.5}/> {saleOnly ? 'Sale ✓' : 'Filter'}</button>
            </div>
          </div>
          <div style={{ padding:20, display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            {list.map(p => <ProductCard key={p.id} p={p} t={t} go={go} toggleWish={toggleWish} wished={wishlist.has(p.id)}/>)}
          </div>
        </div>
      )}
    </div>
  );
};

/* ──────── PRODUCT ──────── */
const ProductScreen = ({ t, go, goBack, product, addToCart, toggleWish, wished, tier }) => {
  const p = product || PRODUCTS[0];
  const [size, setSize] = useState(null);
  const [colorIdx, setColorIdx] = useState(0);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const tierIdx = TIERS.findIndex(x => x.id === tier.id);
  const memberDiscount = [0,5,10,15][tierIdx];
  const finalPrice = memberDiscount ? Math.round(p.price * (1 - memberDiscount/100)) : p.price;
  const handleShare = () => {
    if (navigator.share) navigator.share({ title:p.name, text:`${p.brand} · ${p.name}` }).catch(() => {});
  };

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', background:t.bg }}>
      <div style={{ flex:1, overflowY:'auto', minHeight:0, paddingBottom:80 }}>
        <div style={{ position:'relative' }}>
          <ImageCarousel p={p} t={t}/>
          <div style={{ position:'absolute', top:16, left:0, right:0, padding:'0 20px',
            display:'flex', justifyContent:'space-between', alignItems:'center', zIndex:5 }}>
            <button onClick={goBack} style={{
              width:38, height:38, borderRadius:r.pill, border:'none',
              background:'rgba(255,255,255,0.85)', backdropFilter:'blur(10px)', cursor:'pointer',
              display:'flex', alignItems:'center', justifyContent:'center', color:'#1A1815',
            }}><ArrowLeft size={16} strokeWidth={1.5}/></button>
            <div style={{ display:'flex', gap:6 }}>
              <button onClick={handleShare} style={{
                width:38, height:38, borderRadius:r.pill, border:'none',
                background:'rgba(255,255,255,0.85)', backdropFilter:'blur(10px)', cursor:'pointer',
                display:'flex', alignItems:'center', justifyContent:'center', color:'#1A1815',
              }}><Share2 size={15} strokeWidth={1.5}/></button>
              <button onClick={() => toggleWish(p.id)} style={{
                width:38, height:38, borderRadius:r.pill, border:'none',
                background:'rgba(255,255,255,0.85)', backdropFilter:'blur(10px)', cursor:'pointer',
                display:'flex', alignItems:'center', justifyContent:'center', color:'#1A1815',
              }}><Heart size={15} fill={wished?'#1A1815':'none'} strokeWidth={1.5}/></button>
            </div>
          </div>
        </div>

        <div style={{ padding:'24px 20px' }}>
          <div style={{ ...T.eyebrow, color:t.textDim }}>{p.brand}</div>
          <div style={{ ...T.display4, marginTop:10 }}>{p.name}</div>
          <div style={{ marginTop:14, display:'flex', alignItems:'baseline', gap:10 }}>
            <span style={{ ...T.priceL, color: p.sale?t.primary:t.text }}>${p.price}</span>
            {p.mrp && (<>
              <span style={{ ...T.bodySm, fontSize:14, color:t.textMute, textDecoration:'line-through' }}>${p.mrp}</span>
              <span style={{ ...T.eyebrowS, color:t.primary }}>SAVE ${p.mrp-p.price}</span>
            </>)}
          </div>
          <div style={{ marginTop:10, display:'flex', alignItems:'center', gap:8 }}>
            <Star size={12} fill={t.text} stroke={t.text}/>
            <span style={{ ...T.caption, fontWeight:600 }}>{p.rating}</span>
            <span style={{ ...T.caption, color:t.textDim }}>· {p.reviews?.toLocaleString()} reviews</span>
          </div>

          {memberDiscount > 0 && (
            <div style={{
              marginTop:18, padding:'12px 14px', borderRadius:r.md, position:'relative', overflow:'hidden',
              background:`linear-gradient(95deg, ${tier.gradient[0]} 0%, ${tier.gradient[1]} 100%)`,
              color:tier.foil, display:'flex', alignItems:'center', gap:10,
            }}>
              <div style={{ position:'absolute', inset:0,
                background:`radial-gradient(ellipse 60% 100% at 80% 50%, ${tier.foil}30 0%, transparent 60%)` }}/>
              <Award size={14} strokeWidth={1.5} style={{ position:'relative' }}/>
              <div style={{ flex:1, position:'relative' }}>
                <div style={{ ...T.eyebrowS, opacity:0.85 }}>{tier.name.toUpperCase()} MEMBER</div>
                <div style={{ ...T.bodySm, marginTop:1 }}>{memberDiscount}% rewards · pay <strong>${finalPrice}</strong></div>
              </div>
            </div>
          )}

          <div style={{ height:1, background:t.border, margin:'24px 0' }}/>

          <div>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
              <Eyebrow t={t}>Colour — {['Stone','Sand','Onyx'][colorIdx]}</Eyebrow>
              <span style={{ ...T.caption, color:t.textDim }}>3 available</span>
            </div>
            <div style={{ display:'flex', gap:10 }}>
              {[p.bg[0], p.bg[2], '#1F1F1F'].map((c,i) => (
                <button key={c+i} onClick={() => setColorIdx(i)} aria-label={`Colour ${i+1}`} style={{
                  width:44, height:56, background:c, borderRadius:r.sm, cursor:'pointer', padding:0,
                  border:'none', outline: i===colorIdx?`1.5px solid ${t.text}`:'none', outlineOffset:3,
                }}/>
              ))}
            </div>
          </div>

          <div style={{ marginTop:28 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
              <Eyebrow t={t}>Size</Eyebrow>
              <button onClick={() => setShowSizeGuide(true)} style={{
                background:'none', border:'none', padding:0, ...T.buttonSm, color:t.textDim,
                borderBottom:`1px solid ${t.textDim}`, paddingBottom:1, cursor:'pointer', fontFamily:'inherit',
              }}>Size guide</button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:6 }}>
              {['XS','S','M','L','XL'].map((s,i) => (
                <button key={s} onClick={() => setSize(s)} disabled={i===4} style={{
                  padding:'13px 0', cursor:i===4?'not-allowed':'pointer', borderRadius:r.sm,
                  background: size===s?t.text:'transparent',
                  color: size===s?t.bg:(i===4?t.textMute:t.text),
                  border:`1px solid ${size===s?t.text:t.borderSolid}`,
                  ...T.bodySm, fontSize:12, fontWeight:600, letterSpacing:1,
                  textDecoration:i===4?'line-through':'none', fontFamily:'inherit',
                }}>{s}</button>
              ))}
            </div>
          </div>

          <div style={{ marginTop:28, padding:'16px 0', borderTop:`1px solid ${t.border}`, borderBottom:`1px solid ${t.border}` }}>
            {[
              { i:Truck, l:'Free delivery', sub:'Tomorrow before 4 PM' },
              { i:Package, l:'Free returns', sub:'Within 30 days' },
              { i:Shield, l:'2-year warranty', sub:'Quality guaranteed' },
            ].map((it,idx) => (
              <div key={idx} style={{ display:'flex', alignItems:'center', gap:14, padding:'10px 0' }}>
                <it.i size={15} color={t.text} strokeWidth={1.5}/>
                <div style={{ flex:1, ...T.bodySm, fontWeight:500 }}>{it.l}</div>
                <div style={{ ...T.caption, color:t.textDim }}>{it.sub}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop:24 }}>
            <Eyebrow t={t}>Description</Eyebrow>
            <div style={{ ...T.body, marginTop:14, fontSize:13, lineHeight:1.7 }}>{p.description}</div>
            <div style={{ marginTop:18 }}>
              <Eyebrow t={t} size={8}>Materials</Eyebrow>
              <div style={{ ...T.bodySm, marginTop:8, color:t.textDim }}>{p.materials}</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ position:'absolute', bottom:0, left:0, right:0,
        background:t.bg, borderTop:`1px solid ${t.border}`, padding:'12px 20px', display:'flex', gap:8 }}>
        <button onClick={() => toggleWish(p.id)} style={{
          width:50, height:48, border:`1px solid ${t.borderStrong}`, background:t.bg, color:t.text,
          cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:r.md,
        }}><Heart size={16} fill={wished?t.text:'none'} strokeWidth={1.5}/></button>
        <button onClick={() => { addToCart(p); go('cart'); }} style={{
          flex:1, background:t.text, color:t.bg, border:'none', cursor:'pointer',
          ...T.button, fontFamily:'inherit', borderRadius:r.md,
          display:'flex', alignItems:'center', justifyContent:'center', gap:8,
        }}>Add to bag — ${memberDiscount?finalPrice:p.price}</button>
      </div>

      {showSizeGuide && (
        <div onClick={() => setShowSizeGuide(false)} style={{
          position:'absolute', inset:0, background:'rgba(10,10,10,0.55)', zIndex:50,
          display:'flex', alignItems:'flex-end',
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            width:'100%', background:t.bg, color:t.text, borderTopLeftRadius:r.lg, borderTopRightRadius:r.lg,
            padding:'18px 20px 22px', maxHeight:'80%', overflowY:'auto', minHeight:0,
          }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
              <div style={{ ...T.button, fontSize:12, letterSpacing:1.4 }}>Size guide</div>
              <button onClick={() => setShowSizeGuide(false)} style={{
                background:'none', border:'none', cursor:'pointer', color:t.text, padding:0, display:'flex',
              }}><X size={18} strokeWidth={1.5}/></button>
            </div>
            <div style={{ ...T.bodySm, color:t.textDim, marginBottom:14 }}>Measurements in cm. Take your most accurate measurements while standing.</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:1, background:t.borderSolid, borderRadius:r.sm, overflow:'hidden' }}>
              {['Size','Bust','Waist','Hip'].map(h => (
                <div key={h} style={{ padding:'10px 8px', background:t.bg2, ...T.eyebrowS }}>{h}</div>
              ))}
              {[['XS','82','64','90'],['S','86','68','94'],['M','90','72','98'],['L','94','76','102'],['XL','98','80','106']].map(row => (
                <React.Fragment key={row[0]}>
                  {row.map((v,j) => (
                    <div key={j} style={{ padding:'10px 8px', background:t.bg2, ...T.bodySm, fontWeight: j===0?600:400 }}>{v}</div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ──────── CART ──────── */
const CartScreen = ({ t, go, cart, setCart, tier }) => {
  const update = (id, d) => setCart(c => c.map(i => i.id===id?{ ...i, qty:Math.max(0, i.qty+d) }:i).filter(i => i.qty>0));
  const remove = (id) => setCart(c => c.filter(i => i.id !== id));
  const [showOffers, setShowOffers] = useState(false);
  const [appliedCode, setAppliedCode] = useState(null);
  const subtotal = cart.reduce((s,i) => s + i.price * i.qty, 0);
  const total = subtotal * 1.08;
  const tierIdx = TIERS.findIndex(x => x.id === tier.id);
  const earnPercent = [0,5,10,15][tierIdx];
  const earned = Math.round(subtotal * earnPercent / 100);
  const offers = [
    { code:'WELCOME10', label:'10% off your first order', sub:'New members only' },
    { code:'FREESHIP',  label:'Free express delivery',     sub:'On orders over $100' },
    { code:'TIER5',     label:'5% extra off',              sub:`${tier.name} members` },
  ];

  if (cart.length === 0) {
    return (
      <div style={{ flex:1, display:'flex', flexDirection:'column', background:t.bg }}>
        <Header t={t} go={go} title="Shopping bag"/>
        <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', padding:30, textAlign:'center' }}>
          <ShoppingBag size={36} strokeWidth={1} color={t.text}/>
          <div style={{ ...T.display4, marginTop:20 }}>Your bag is empty</div>
          <div style={{ ...T.bodySm, color:t.textDim, marginTop:10, maxWidth:220 }}>Find pieces you love and they&rsquo;ll appear here.</div>
          <button onClick={() => go('home')} style={{
            marginTop:26, padding:'14px 24px', background:t.text, color:t.bg, border:'none', cursor:'pointer',
            ...T.button, fontFamily:'inherit', borderRadius:r.md,
          }}>Continue shopping</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', background:t.bg }}>
      <Header t={t} go={go} title={`Bag (${cart.length})`}/>
      <div style={{ flex:1, overflowY:'auto', minHeight:0, paddingBottom:200 }}>
        {cart.map(item => (
          <div key={item.id} style={{ display:'flex', gap:14, padding:'18px 20px', borderBottom:`1px solid ${t.border}` }}>
            <div style={{ width:84, height:112, flexShrink:0, borderRadius:r.sm, overflow:'hidden' }}>
              <ProductImage p={item} t={t} fill showSale={false}/>
            </div>
            <div style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column', minHeight:112 }}>
              <div style={{ display:'flex', justifyContent:'space-between', gap:10 }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ ...T.eyebrowS, color:t.textDim, fontSize:9, letterSpacing:1.2 }}>{item.brand}</div>
                  <div style={{ ...T.bodySm, marginTop:5, lineHeight:1.4,
                    overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>{item.name}</div>
                </div>
                <button onClick={() => remove(item.id)} style={{
                  background:'none', border:'none', cursor:'pointer', color:t.textDim, padding:0,
                  display:'flex', alignSelf:'flex-start', flexShrink:0,
                }}><X size={14} strokeWidth={1.5}/></button>
              </div>
              <div style={{ ...T.caption, color:t.textDim, marginTop:6 }}>Size M · Stone</div>
              <div style={{ marginTop:'auto', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <QtyStepper t={t} qty={item.qty} onMinus={() => update(item.id, -1)} onPlus={() => update(item.id, +1)}/>
                <div style={{ ...T.price, fontSize:14 }}>${(item.price * item.qty).toFixed(2)}</div>
              </div>
            </div>
          </div>
        ))}

        {earnPercent > 0 && (
          <div style={{ margin:20, padding:'14px 16px', borderRadius:r.md,
            background:`linear-gradient(95deg, ${tier.gradient[0]} 0%, ${tier.gradient[1]} 100%)`,
            color:tier.foil, display:'flex', alignItems:'center', gap:12, position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', inset:0,
              background:`radial-gradient(ellipse 60% 100% at 80% 50%, ${tier.foil}30 0%, transparent 60%)` }}/>
            <Sparkles size={16} strokeWidth={1.5} style={{ position:'relative' }}/>
            <div style={{ flex:1, position:'relative' }}>
              <div style={{ ...T.eyebrowS, opacity:0.85 }}>{tier.name.toUpperCase()} REWARDS</div>
              <div style={{ ...T.bodySm, marginTop:1 }}>You&rsquo;ll earn <strong>${earned}</strong> in store credit</div>
            </div>
          </div>
        )}

        <button onClick={() => setShowOffers(true)} style={{
          margin:'0 20px 20px', padding:'14px 16px', border:`1px solid ${t.borderStrong}`, borderRadius:r.md,
          display:'flex', alignItems:'center', gap:12, width:'calc(100% - 40px)',
          background:'transparent', color:t.text, cursor:'pointer', fontFamily:'inherit', textAlign:'left',
        }}>
          <Tag size={14} strokeWidth={1.5}/>
          <div style={{ flex:1 }}>
            <div style={{ ...T.buttonSm, fontSize:11, letterSpacing:1.4 }}>{appliedCode ? `Code applied · ${appliedCode}` : 'Add code or member offer'}</div>
            <div style={{ ...T.caption, color:t.textDim, marginTop:2 }}>{offers.length} offers available</div>
          </div>
          <ChevronRight size={14} strokeWidth={1.5}/>
        </button>

        <div style={{ padding:'8px 20px 20px' }}>
          <Eyebrow t={t}>Order summary</Eyebrow>
          <div style={{ marginTop:14 }}>
            {[['Subtotal',`$${subtotal.toFixed(2)}`],['Estimated delivery','Free'],['Estimated tax',`$${(subtotal*0.08).toFixed(2)}`]].map(([l,v]) => (
              <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', ...T.bodySm }}>
                <span style={{ color:t.textDim }}>{l}</span>
                <span style={{ color:t.text, fontWeight:500 }}>{v}</span>
              </div>
            ))}
            <div style={{ height:1, background:t.border, margin:'12px 0' }}/>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
              <span style={{ ...T.button, fontSize:12, letterSpacing:1.4 }}>Total (incl. tax)</span>
              <span style={{ ...T.display4, fontSize:24 }}>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ position:'absolute', bottom:0, left:0, right:0,
        padding:'12px 20px 16px', background:t.bg, borderTop:`1px solid ${t.border}` }}>
        <button onClick={() => go('checkout')} style={{
          width:'100%', padding:'15px', background:t.text, color:t.bg, border:'none', cursor:'pointer',
          ...T.button, fontFamily:'inherit', borderRadius:r.md,
          display:'flex', alignItems:'center', justifyContent:'center', gap:10,
        }}>Continue to checkout <ArrowRight size={14} strokeWidth={1.5}/></button>
      </div>

      {showOffers && (
        <div onClick={() => setShowOffers(false)} style={{
          position:'absolute', inset:0, background:'rgba(10,10,10,0.55)', zIndex:50,
          display:'flex', alignItems:'flex-end',
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            width:'100%', background:t.bg, color:t.text, borderTopLeftRadius:r.lg, borderTopRightRadius:r.lg,
            padding:'18px 20px 22px', maxHeight:'80%', overflowY:'auto', minHeight:0,
          }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
              <div style={{ ...T.button, fontSize:12, letterSpacing:1.4 }}>Available offers</div>
              <button onClick={() => setShowOffers(false)} style={{
                background:'none', border:'none', cursor:'pointer', color:t.text, padding:0, display:'flex',
              }}><X size={18} strokeWidth={1.5}/></button>
            </div>
            {offers.map(o => (
              <button key={o.code} onClick={() => { setAppliedCode(o.code); setShowOffers(false); }} style={{
                width:'100%', textAlign:'left', padding:'14px 16px', marginBottom:8, borderRadius:r.md,
                border: appliedCode===o.code?`1.5px solid ${t.text}`:`1px solid ${t.borderSolid}`,
                background:t.bg, color:t.text, cursor:'pointer', fontFamily:'inherit',
                display:'flex', alignItems:'center', gap:12,
              }}>
                <Tag size={14} strokeWidth={1.5}/>
                <div style={{ flex:1 }}>
                  <div style={{ ...T.bodySm, fontWeight:600 }}>{o.label}</div>
                  <div style={{ ...T.caption, color:t.textDim, marginTop:2 }}>{o.code} · {o.sub}</div>
                </div>
                {appliedCode===o.code && <Check size={14} strokeWidth={2}/>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ──────── CHECKOUT ──────── */
const Steps = ({ t, active }) => (
  <div style={{ padding:'16px 20px', borderBottom:`1px solid ${t.border}`, display:'flex', alignItems:'center', gap:4 }}>
    {['Delivery','Payment','Confirm'].map((s,i) => (
      <React.Fragment key={s}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{
            width:22, height:22, borderRadius:r.pill,
            background: i<=active?t.text:'transparent',
            color: i<=active?t.bg:t.textDim,
            border:`1px solid ${i<=active?t.text:t.borderSolid}`,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:10, fontWeight:700,
          }}>{i<active?<Check size={10} strokeWidth={3}/>:i+1}</span>
          <span style={{ ...T.buttonSm, fontSize:10, letterSpacing:1.2, color: i<=active?t.text:t.textDim }}>{s}</span>
        </div>
        {i<2 && <div style={{ flex:1, height:1, background:t.borderSolid, margin:'0 8px' }}/>}
      </React.Fragment>
    ))}
  </div>
);

const CheckoutScreen = ({ t, go, cart }) => {
  const subtotal = cart.reduce((s,i) => s + i.price * i.qty, 0);
  const total = subtotal * 1.08;
  const [address, setAddress] = useState(0);
  const [delivery, setDelivery] = useState(1);
  const [addresses, setAddresses] = useState([
    { label:'Home', name:'Alex Mehta', addr:'12B Pali Hill, Bandra W\nMumbai 400050, IN', tag:'Default' },
    { label:'Work', name:'Alex Mehta', addr:'WeWork BKC, G Block\nMumbai 400051, IN' },
  ]);
  const [addingNew, setAddingNew] = useState(false);
  const handleAddAddress = () => {
    setAddresses(prev => [...prev, {
      label:`Other ${prev.length - 1}`,
      name:'Alex Mehta',
      addr:'New address — tap to edit\nMumbai, IN',
    }]);
    setAddress(addresses.length);
    setAddingNew(false);
  };
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', background:t.bg }}>
      <Header t={t} go={go} title="Checkout" back="cart"/>
      <Steps t={t} active={0}/>
      <div style={{ flex:1, overflowY:'auto', minHeight:0, paddingBottom:110 }}>
        <div style={{ padding:20 }}>
          <Eyebrow t={t}>Delivery address</Eyebrow>
          <div style={{ marginTop:14 }}>
            {addresses.map((a,i) => (
              <button key={i} onClick={() => setAddress(i)} style={{
                width:'100%', textAlign:'left', padding:'16px', marginBottom:8, borderRadius:r.md,
                border: address===i?`1.5px solid ${t.text}`:`1px solid ${t.borderSolid}`,
                background:t.bg, color:t.text, cursor:'pointer', fontFamily:'inherit',
                display:'flex', gap:12,
              }}>
                <div style={{ width:16, height:16, borderRadius:r.pill, marginTop:2,
                  border:`1.5px solid ${address===i?t.text:t.borderSolid}`,
                  background: address===i?t.text:'transparent', flexShrink:0 }}/>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <span style={{ ...T.buttonSm, fontSize:11, letterSpacing:1.2 }}>{a.label}</span>
                    {a.tag && <span style={{ ...T.eyebrowS, fontSize:9, letterSpacing:1.2, color:t.textDim }}>· {a.tag}</span>}
                  </div>
                  <div style={{ ...T.bodySm, marginTop:6 }}>{a.name}</div>
                  <div style={{ ...T.caption, color:t.textDim, marginTop:4, whiteSpace:'pre-line' }}>{a.addr}</div>
                </div>
              </button>
            ))}
          </div>
          <button onClick={() => setAddingNew(true)} style={{
            width:'100%', padding:14, marginTop:4, borderRadius:r.md,
            background:'transparent', border:`1px dashed ${t.borderSolid}`, color:t.text, cursor:'pointer',
            ...T.buttonSm, fontFamily:'inherit',
            display:'flex', alignItems:'center', justifyContent:'center', gap:6,
          }}><Plus size={13} strokeWidth={1.5}/> Add new address</button>
        </div>
        <div style={{ height:1, background:t.border, margin:'12px 20px' }}/>
        <div style={{ padding:20 }}>
          <Eyebrow t={t}>Delivery method</Eyebrow>
          <div style={{ marginTop:14 }}>
            {[
              { name:'Standard',       sub:'Tomorrow · 12 – 4 PM',  price:'Free' },
              { name:'Vision Express', sub:'Today before 8 PM',     price:'$4.99', tag:'Recommended' },
              { name:'Click & collect',sub:'Pick up in-store',      price:'Free' },
            ].map((d,i) => (
              <button key={d.name} onClick={() => setDelivery(i)} style={{
                width:'100%', textAlign:'left', padding:'14px 16px', marginBottom:8, borderRadius:r.md,
                border: delivery===i?`1.5px solid ${t.text}`:`1px solid ${t.borderSolid}`,
                background:t.bg, color:t.text, cursor:'pointer', fontFamily:'inherit',
                display:'flex', alignItems:'center', gap:12,
              }}>
                <Truck size={16} strokeWidth={1.5}/>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <span style={{ ...T.bodySm, fontWeight:600 }}>{d.name}</span>
                    {d.tag && <span style={{ ...T.eyebrowS, fontSize:9, letterSpacing:1.2, color:t.primary }}>· {d.tag}</span>}
                  </div>
                  <div style={{ ...T.caption, color:t.textDim, marginTop:2 }}>{d.sub}</div>
                </div>
                <div style={{ ...T.price }}>{d.price}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div style={{ position:'absolute', bottom:0, left:0, right:0,
        padding:'12px 20px 16px', background:t.bg, borderTop:`1px solid ${t.border}` }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:10 }}>
          <span style={{ ...T.caption, color:t.textDim }}>Total (incl. tax)</span>
          <span style={{ ...T.priceL, fontSize:18 }}>${total.toFixed(2)}</span>
        </div>
        <button onClick={() => go('payment')} style={{
          width:'100%', padding:'15px', background:t.text, color:t.bg, border:'none', cursor:'pointer',
          ...T.button, fontFamily:'inherit', borderRadius:r.md,
          display:'flex', alignItems:'center', justifyContent:'center', gap:8,
        }}>Continue to payment <ArrowRight size={14} strokeWidth={1.5}/></button>
      </div>

      {addingNew && (
        <div onClick={() => setAddingNew(false)} style={{
          position:'absolute', inset:0, background:'rgba(10,10,10,0.55)', zIndex:50,
          display:'flex', alignItems:'flex-end',
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            width:'100%', background:t.bg, color:t.text, borderTopLeftRadius:r.lg, borderTopRightRadius:r.lg,
            padding:'18px 20px 22px',
          }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
              <div style={{ ...T.button, fontSize:12, letterSpacing:1.4 }}>Add new address</div>
              <button onClick={() => setAddingNew(false)} style={{
                background:'none', border:'none', cursor:'pointer', color:t.text, padding:0, display:'flex',
              }}><X size={18} strokeWidth={1.5}/></button>
            </div>
            <div style={{ ...T.bodySm, color:t.textDim, marginBottom:14 }}>A blank address will be added to your saved list. You can edit details from your profile.</div>
            <button onClick={handleAddAddress} style={{
              width:'100%', padding:'14px', background:t.text, color:t.bg, border:'none', cursor:'pointer',
              ...T.button, fontFamily:'inherit', borderRadius:r.md,
            }}>Save address</button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ──────── PAYMENT ──────── */
const PaymentScreen = ({ t, go, cart, tier, spend }) => {
  const subtotal = cart.reduce((s,i) => s + i.price * i.qty, 0);
  const total = subtotal * 1.08;
  const [method, setMethod] = useState('card');
  const earnPercent = [0,5,10,15][TIERS.findIndex(x => x.id === tier.id)];
  const earned = Math.round(subtotal * earnPercent / 100);
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', background:t.bg }}>
      <Header t={t} go={go} title="Payment" back="checkout"/>
      <Steps t={t} active={1}/>
      <div style={{ flex:1, overflowY:'auto', minHeight:0, paddingBottom:110 }}>
        <div style={{ padding:20 }}>
          <TierCard tier={tier} member="A. Mehta" spend={spend} t={t}/>
          <div style={{ marginTop:28 }}>
            <Eyebrow t={t}>Payment method</Eyebrow>
            <div style={{ marginTop:14 }}>
              {[
                { id:'card',  icon:CreditCard, name:'Vision Card',     sub:'•••• 4218 · 09/29' },
                { id:'upi',   icon:Smartphone, name:'UPI / Google Pay',sub:'alex@oksbi' },
                { id:'apple', icon:Apple,      name:'Apple Pay',       sub:'Touch ID required' },
                { id:'cod',   icon:Package,    name:'Cash on delivery',sub:'Pay on arrival' },
              ].map(m => (
                <button key={m.id} onClick={() => setMethod(m.id)} style={{
                  width:'100%', textAlign:'left', padding:'14px 16px', marginBottom:8, borderRadius:r.md,
                  border: method===m.id?`1.5px solid ${t.text}`:`1px solid ${t.borderSolid}`,
                  background:t.bg, color:t.text, cursor:'pointer', fontFamily:'inherit',
                  display:'flex', alignItems:'center', gap:12,
                }}>
                  <m.icon size={16} strokeWidth={1.5}/>
                  <div style={{ flex:1 }}>
                    <div style={{ ...T.bodySm, fontWeight:600 }}>{m.name}</div>
                    <div style={{ ...T.caption, color:t.textDim, marginTop:2 }}>{m.sub}</div>
                  </div>
                  <div style={{ width:16, height:16, borderRadius:r.pill,
                    border:`1.5px solid ${method===m.id?t.text:t.borderSolid}`,
                    background: method===m.id?t.text:'transparent',
                    display:'flex', alignItems:'center', justifyContent:'center' }}>
                    {method===m.id && <Check size={9} color={t.bg} strokeWidth={3}/>}
                  </div>
                </button>
              ))}
            </div>
          </div>
          {earnPercent > 0 && (
            <div style={{ marginTop:20, padding:'12px 14px', display:'flex', alignItems:'center', gap:10, borderRadius:r.md,
              background:t.primarySoft, border:`1px solid ${t.primary}33` }}>
              <Sparkles size={14} color={t.primary} strokeWidth={1.5}/>
              <div style={{ flex:1, ...T.caption, color:t.text }}>
                You&rsquo;ll earn <strong>${earned} store credit</strong> from this order
              </div>
            </div>
          )}
          <div style={{ marginTop:24, paddingTop:20, borderTop:`1px solid ${t.border}` }}>
            <Eyebrow t={t}>Order summary</Eyebrow>
            <div style={{ marginTop:14 }}>
              {[['Items','$'+subtotal.toFixed(2)],['Delivery','Free'],['Tax','$'+(subtotal*0.08).toFixed(2)]].map(([l,v]) => (
                <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', ...T.bodySm }}>
                  <span style={{ color:t.textDim }}>{l}</span><span>{v}</span>
                </div>
              ))}
              <div style={{ height:1, background:t.border, margin:'12px 0' }}/>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
                <span style={{ ...T.button, fontSize:12, letterSpacing:1.4 }}>You pay</span>
                <span style={{ ...T.display4 }}>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ position:'absolute', bottom:0, left:0, right:0,
        padding:'12px 20px 16px', background:t.bg, borderTop:`1px solid ${t.border}` }}>
        <button onClick={() => go('success')} style={{
          width:'100%', padding:'15px', background:t.text, color:t.bg, border:'none', cursor:'pointer',
          ...T.button, fontFamily:'inherit', borderRadius:r.md,
          display:'flex', alignItems:'center', justifyContent:'center', gap:10,
        }}><Lock size={12} strokeWidth={1.5}/> Pay ${total.toFixed(2)}</button>
      </div>
    </div>
  );
};

/* ──────── SUCCESS ──────── */
const SuccessScreen = ({ t, go, clearCart, tier }) => {
  const earnPercent = [0,5,10,15][TIERS.findIndex(x => x.id === tier.id)];
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', background:t.bg }}>
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', padding:30, textAlign:'center' }}>
        <div style={{ width:64, height:64, borderRadius:r.pill, border:`1.5px solid ${t.text}`,
          display:'flex', alignItems:'center', justifyContent:'center', marginBottom:26 }}>
          <Check size={28} color={t.text} strokeWidth={1.5}/>
        </div>
        <Eyebrow t={t} color={t.primary}>Order #VSN-72491</Eyebrow>
        <div style={{ ...T.display3, fontSize:36, marginTop:14 }}>
          Thank you,<br/><em style={{ fontStyle:'italic' }}>Alex.</em>
        </div>
        <div style={{ ...T.bodySm, color:t.textDim, marginTop:14, maxWidth:250 }}>
          Your order has been confirmed. We&rsquo;ve sent a receipt to alex@vision.com.
        </div>
        <div style={{ marginTop:32, width:'100%', textAlign:'left' }}>
          <div style={{ padding:'14px 0', borderTop:`1px solid ${t.border}`, borderBottom:`1px solid ${t.border}`, display:'flex', alignItems:'center', gap:14 }}>
            <Truck size={16} strokeWidth={1.5}/>
            <div style={{ flex:1 }}>
              <div style={{ ...T.eyebrowS, color:t.textDim }}>ARRIVING</div>
              <div style={{ ...T.bodySm, fontWeight:500, marginTop:3 }}>Tomorrow before 4 PM</div>
            </div>
            <ArrowRight size={14} strokeWidth={1.5}/>
          </div>
          {earnPercent > 0 && (
            <div style={{ padding:'14px 0', borderBottom:`1px solid ${t.border}`, display:'flex', alignItems:'center', gap:14 }}>
              <Sparkles size={16} strokeWidth={1.5} color={t.primary}/>
              <div style={{ flex:1 }}>
                <div style={{ ...T.eyebrowS, color:t.textDim }}>EARNED</div>
                <div style={{ ...T.bodySm, fontWeight:500, marginTop:3 }}>$54 store credit · {tier.name}</div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div style={{ padding:'20px', display:'flex', gap:8, borderTop:`1px solid ${t.border}` }}>
        <button onClick={() => go('orders')} style={{
          flex:1, padding:'14px', background:t.bg, color:t.text, border:`1px solid ${t.borderStrong}`, cursor:'pointer',
          ...T.buttonSm, fontFamily:'inherit', borderRadius:r.md,
        }}>Track order</button>
        <button onClick={() => { clearCart(); go('home'); }} style={{
          flex:1, padding:'14px', background:t.text, color:t.bg, border:'none', cursor:'pointer',
          ...T.buttonSm, fontFamily:'inherit', borderRadius:r.md,
        }}>Continue</button>
      </div>
    </div>
  );
};

/* ──────── ORDERS ──────── */
const OrdersScreen = ({ t, go }) => {
  const [tab, setTab] = useState('All');
  const [openId, setOpenId] = useState(null);
  const orders = [
    { id:'VSN-72491', date:'Today · 9:42', status:'Out for delivery', step:2, items:3, total:547.89, color:t.primary,  bucket:'Active' },
    { id:'VSN-72380', date:'Yesterday',     status:'Delivered',        step:3, items:1, total:78.00,  color:t.success,  bucket:'Delivered' },
    { id:'VSN-71998', date:'12 May',         status:'Delivered',        step:3, items:2, total:198.50, color:t.success,  bucket:'Delivered' },
    { id:'VSN-71755', date:'4 May',          status:'Cancelled',        step:0, items:1, total:64.00,  color:t.textDim,  bucket:'Cancelled' },
  ];
  const tabs = ['All','Active','Delivered','Cancelled'];
  const visible = tab === 'All' ? orders : orders.filter(o => o.bucket === tab);
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', background:t.bg }}>
      <Header t={t} go={go} title="My orders" back="profile"/>
      <div style={{ display:'flex', borderBottom:`1px solid ${t.border}` }}>
        {tabs.map(label => {
          const active = label === tab;
          return (
            <button key={label} onClick={() => setTab(label)} style={{
              flex:1, padding:'14px 0', background:'transparent', border:'none', cursor:'pointer',
              ...T.buttonSm, fontSize:10, letterSpacing:1.4, color: active?t.text:t.textDim,
              borderBottom: active?`2px solid ${t.text}`:'2px solid transparent',
              fontFamily:'inherit',
            }}>{label}</button>
          );
        })}
      </div>
      <div style={{ flex:1, overflowY:'auto', minHeight:0, paddingBottom:30 }}>
        {visible.length === 0 && (
          <div style={{ padding:'40px 20px', textAlign:'center', ...T.bodySm, color:t.textDim }}>No orders in this view.</div>
        )}
        {visible.map(o => {
          const open = openId === o.id;
          return (
            <div key={o.id} style={{ padding:20, borderBottom:`1px solid ${t.border}` }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                <div>
                  <div style={{ ...T.eyebrowS, color:t.textDim, fontSize:9, letterSpacing:1.4 }}>{o.date.toUpperCase()}</div>
                  <div style={{ ...T.bodySm, fontSize:14, fontWeight:600, marginTop:5 }}>#{o.id}</div>
                </div>
                <div style={{ ...T.eyebrowS, fontSize:9, letterSpacing:1.4, color:o.color }}>● {o.status.toUpperCase()}</div>
              </div>
              {o.step > 0 && o.step < 3 && (
                <div style={{ display:'flex', gap:4, margin:'14px 0' }}>
                  {[0,1,2,3].map(i => (
                    <div key={i} style={{ flex:1, height:2, background: i<=o.step?o.color:t.border, borderRadius:r.pill }}/>
                  ))}
                </div>
              )}
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop: o.step>0&&o.step<3?0:14 }}>
                <span style={{ ...T.caption, color:t.textDim }}>{o.items} item{o.items>1?'s':''} · ${o.total}</span>
                <button onClick={() => setOpenId(open ? null : o.id)} style={{
                  background:'none', border:'none', padding:0, cursor:'pointer', color:t.text,
                  ...T.buttonSm, fontFamily:'inherit', borderBottom:`1px solid ${t.text}`, paddingBottom:1,
                }}>{open ? 'Hide' : 'View'}</button>
              </div>
              {open && (
                <div style={{ marginTop:14, padding:'12px 14px', background:t.bg2, border:`1px solid ${t.border}`, borderRadius:r.md, ...T.caption, color:t.textDim, lineHeight:1.7 }}>
                  Tracking: <strong style={{ color:t.text }}>VSNTRK-{o.id.split('-')[1]}</strong><br/>
                  Carrier: Vision Express · Updated just now<br/>
                  Est. delivery: <strong style={{ color:t.text }}>{o.bucket==='Active'?'Tomorrow before 4 PM':'Completed'}</strong>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ──────── WISHLIST ──────── */
const WishlistScreen = ({ t, go, wishlist, toggleWish }) => {
  const list = PRODUCTS.filter(p => wishlist.has(p.id));
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', background:t.bg }}>
      <Header t={t} go={go} title={`Saved (${list.length})`}/>
      {list.length === 0 ? (
        <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', padding:30, textAlign:'center' }}>
          <Heart size={36} strokeWidth={1} color={t.text}/>
          <div style={{ ...T.display4, marginTop:20 }}>Save things you love</div>
          <div style={{ ...T.bodySm, color:t.textDim, marginTop:10, maxWidth:200 }}>Tap the heart on any product to keep it here.</div>
        </div>
      ) : (
        <div style={{ flex:1, overflowY:'auto', minHeight:0, padding:'20px 20px 80px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            {list.map(p => <ProductCard key={p.id} p={p} t={t} go={go} toggleWish={toggleWish} wished/>)}
          </div>
        </div>
      )}
    </div>
  );
};

/* ──────── PROFILE ──────── */
const ProfileSection = ({ t, title, rows, notify }) => (
  <div style={{ borderBottom:`1px solid ${t.border}` }}>
    <div style={{ padding:'20px 20px 8px' }}><Eyebrow t={t}>{title}</Eyebrow></div>
    {rows.map((row,i) => (
      <button key={i} onClick={row.go || (() => notify(row.l))} style={{
        width:'100%', padding:'14px 20px', background:'transparent', border:'none', cursor:'pointer',
        display:'flex', alignItems:'center', gap:14, color:t.text, textAlign:'left', fontFamily:'inherit',
        borderTop: i===0?'none':`1px solid ${t.border}`,
      }}>
        <row.i size={16} strokeWidth={1.5}/>
        <span style={{ flex:1, ...T.bodySm, fontWeight:500 }}>{row.l}</span>
        {row.h && <span style={{ ...T.caption, color:t.textDim }}>{row.h}</span>}
        <ChevronRight size={14} color={t.textDim} strokeWidth={1.5}/>
      </button>
    ))}
  </div>
);

const ProfileScreen = ({ t, go, theme, setTheme, tier, spend }) => {
  const [toast, setToast] = useState(null);
  const notify = (label) => {
    setToast(`${label} — coming soon`);
    setTimeout(() => setToast(null), 1800);
  };
  return (
  <div style={{ flex:1, display:'flex', flexDirection:'column', background:t.bg, position:'relative' }}>
    <Header t={t} go={go} title="Account"/>
    <div style={{ flex:1, overflowY:'auto', minHeight:0, paddingBottom:80 }}>
      <div style={{ padding:'28px 20px 20px' }}>
        <Eyebrow t={t} color={tier.color}>VISION · {tier.name.toUpperCase()}</Eyebrow>
        <div style={{ ...T.display3, marginTop:14 }}>Hello, <em style={{ fontStyle:'italic' }}>Alex.</em></div>
        <div style={{ ...T.caption, color:t.textDim, marginTop:6 }}>alex@vision.com · since 2023</div>
      </div>
      <div style={{ padding:'0 20px 20px' }}>
        <div onClick={() => go('tier')} style={{ cursor:'pointer' }}>
          <TierCard tier={tier} member="A. Mehta" spend={spend} t={t}/>
        </div>
      </div>
      <div style={{ padding:'0 20px 24px', display:'flex', gap:16 }}>
        {[{ l:'Orders',v:'12' },{ l:'Saved',v:'8' },{ l:'Credit',v:'$192' }].map(s => (
          <div key={s.l} style={{ flex:1 }}>
            <div style={{ fontSize:26, fontWeight:200, letterSpacing:-1 }}>{s.v}</div>
            <div style={{ ...T.eyebrowS, color:t.textDim, marginTop:4 }}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{ padding:'16px 20px', borderTop:`1px solid ${t.border}`, borderBottom:`1px solid ${t.border}`,
        display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          {theme==='light' ? <Sun size={16} strokeWidth={1.5}/> : <Moon size={16} strokeWidth={1.5}/>}
          <span style={{ ...T.bodySm, fontWeight:500 }}>{theme==='light'?'Light mode':'Dark mode'}</span>
        </div>
        <button onClick={() => setTheme(theme==='light'?'dark':'light')} style={{
          width:42, height:24, border:`1px solid ${t.borderStrong}`, borderRadius:r.pill,
          background: theme==='dark'?t.text:'transparent', position:'relative', cursor:'pointer',
        }}>
          <span style={{ position:'absolute', top:1, left: theme==='dark'?19:1,
            width:20, height:20, borderRadius:r.pill, background: theme==='dark'?t.bg:t.text, transition:'all .25s' }}/>
        </button>
      </div>
      <ProfileSection t={t} notify={notify} title="Shopping" rows={[
        { i:Package, l:'My orders', h:'2 active', go:() => go('orders') },
        { i:Heart, l:'Saved items', go:() => go('wishlist') },
        { i:Award, l:'Membership & rewards', h:tier.name, go:() => go('tier') },
        { i:MapPin, l:'Addresses', h:'2 saved', go:() => go('checkout') },
        { i:CreditCard, l:'Payment methods', go:() => go('payment') },
      ]}/>
      <ProfileSection t={t} notify={notify} title="More" rows={[
        { i:Bell, l:'Notifications' },
        { i:HelpCircle, l:'Help & support' },
        { i:Settings, l:'Settings' },
      ]}/>
      <button onClick={() => go('splash')} style={{
        margin:'20px', padding:14, background:'transparent', border:`1px solid ${t.borderStrong}`, color:t.text,
        ...T.buttonSm, fontFamily:'inherit', borderRadius:r.md, cursor:'pointer', width:'calc(100% - 40px)',
        display:'flex', alignItems:'center', justifyContent:'center', gap:8,
      }}><LogOut size={13} strokeWidth={1.5}/> Sign out</button>
      <div style={{ textAlign:'center', padding:'0 20px 24px', ...T.eyebrowS, color:t.textMute, letterSpacing:1.4 }}>
        VISION · APP V1.0 · MUMBAI
      </div>
    </div>
    {toast && (
      <div style={{
        position:'absolute', left:20, right:20, bottom:80, padding:'12px 16px',
        background:t.text, color:t.bg, borderRadius:r.md, ...T.bodySm, fontWeight:500,
        boxShadow:'0 8px 24px rgba(0,0,0,0.18)', textAlign:'center', zIndex:20,
      }}>{toast}</div>
    )}
  </div>
  );
};

/* ──────── TIER ──────── */
const TierScreen = ({ t, go, tier, spend }) => {
  const tierIdx = TIERS.findIndex(x => x.id === tier.id);
  const next = TIERS[tierIdx + 1];
  const remaining = next ? next.threshold - spend : 0;
  const progressInTier = next ? (spend - tier.threshold) / (next.threshold - tier.threshold) : 1;
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', background:t.bg }}>
      <Header t={t} go={go} title="Membership" back="profile"/>
      <div style={{ flex:1, overflowY:'auto', minHeight:0, paddingBottom:30 }}>
        <div style={{ padding:'24px 20px' }}>
          <TierCard tier={tier} member="A. Mehta" spend={spend} t={t}/>
        </div>
        {next && (
          <div style={{ padding:'0 20px 28px' }}>
            <div style={{ padding:'20px', background:t.bg2, border:`1px solid ${t.border}`, borderRadius:r.md }}>
              <Eyebrow t={t}>Progress to {next.name}</Eyebrow>
              <div style={{ marginTop:16, display:'flex', alignItems:'baseline', gap:8 }}>
                <span style={{ ...T.display3, fontSize:36 }}>${remaining.toLocaleString()}</span>
                <span style={{ ...T.bodySm, color:t.textDim }}>to unlock</span>
              </div>
              <div style={{ marginTop:18, position:'relative', height:4, background:t.borderSolid, borderRadius:r.pill }}>
                <div style={{ position:'absolute', inset:0, width:`${progressInTier*100}%`, borderRadius:r.pill,
                  background:`linear-gradient(90deg, ${tier.color}, ${next.color})`, transition:'width .6s ease' }}/>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', marginTop:8, ...T.eyebrowS, fontSize:9, letterSpacing:1.2, color:t.textDim }}>
                <span>${tier.threshold.toLocaleString()} · {tier.name.toUpperCase()}</span>
                <span>${next.threshold.toLocaleString()} · {next.name.toUpperCase()}</span>
              </div>
            </div>
          </div>
        )}
        <div style={{ padding:'0 20px 28px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:14 }}>
            <Eyebrow t={t}>Your benefits</Eyebrow>
            <span style={{ ...T.eyebrowS, fontSize:10, color:tier.color, letterSpacing:1.4 }}>{tier.name}</span>
          </div>
          {tier.benefits.map((b,i) => (
            <div key={i} style={{ padding:'14px 0', borderBottom: i<tier.benefits.length-1?`1px solid ${t.border}`:'none',
              display:'flex', alignItems:'center', gap:14 }}>
              <div style={{ width:18, height:18, borderRadius:r.pill, background:tier.color, color:'#fff',
                display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Check size={10} strokeWidth={3}/>
              </div>
              <span style={{ ...T.bodySm }}>{b}</span>
            </div>
          ))}
        </div>
        <div style={{ padding:'20px 20px 32px', borderTop:`1px solid ${t.border}` }}>
          <Eyebrow t={t}>The ladder</Eyebrow>
          <div style={{ marginTop:16 }}>
            {TIERS.map((tr,i) => {
              const unlocked = i <= tierIdx;
              const current = i === tierIdx;
              return (
                <div key={tr.id} style={{ padding:'16px 0',
                  borderBottom: i<TIERS.length-1?`1px solid ${t.border}`:'none',
                  display:'flex', alignItems:'center', gap:14, opacity: unlocked?1:0.5 }}>
                  <div style={{ width:28, height:28, borderRadius:r.pill,
                    background: unlocked?tr.color:'transparent',
                    border: unlocked?'none':`1px solid ${t.borderSolid}`,
                    display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, color:'#fff' }}>
                    {unlocked ? <Check size={14} strokeWidth={2}/> : <Lock size={11} strokeWidth={1.5} color={t.textDim}/>}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <span style={{ ...T.body, fontSize:14, fontWeight:500 }}>{tr.name}</span>
                      {current && <span style={{ ...T.eyebrowS, fontSize:8, letterSpacing:1.4, color:'#fff', background:tr.color, padding:'2px 6px', borderRadius:r.sm }}>CURRENT</span>}
                    </div>
                    <div style={{ ...T.caption, color:t.textDim, marginTop:2 }}>
                      {tr.threshold===0 ? 'Welcome tier' : `$${tr.threshold.toLocaleString()}+ annually`}
                    </div>
                  </div>
                  <span style={{ ...T.eyebrowS, fontSize:10, letterSpacing:1.2, color:t.textDim }}>{tr.benefits.length} perks</span>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ padding:'0 20px 32px' }}>
          <div style={{ ...T.micro, color:t.textMute, lineHeight:1.7, fontWeight:400 }}>
            Tiers are reviewed annually based on calendar-year spend. Benefits renew on 1 January. Some perks subject to availability and region.
          </div>
        </div>
      </div>
    </div>
  );
};

/* ──────── BOTTOM NAV ──────── */
const BottomNav = ({ t, screen, go, cartCount, wishCount }) => {
  const items = [
    { id:'home',     icon:Globe,       label:'Shop' },
    { id:'search',   icon:Search,      label:'Search' },
    { id:'wishlist', icon:Heart,       label:'Saved', badge:wishCount },
    { id:'cart',     icon:ShoppingBag, label:'Bag',   badge:cartCount },
    { id:'profile',  icon:User,        label:'Me' },
  ];
  return (
    <div style={{ position:'absolute', bottom:0, left:0, right:0, height:60,
      background:t.nav, borderTop:`1px solid ${t.navBorder}`,
      display:'flex', justifyContent:'space-around', alignItems:'flex-start', paddingTop:11 }}>
      {items.map(i => {
        const active = screen === i.id;
        return (
          <button key={i.id} onClick={() => go(i.id)} style={{
            background:'transparent', border:'none', cursor:'pointer', fontFamily:'inherit',
            display:'flex', flexDirection:'column', alignItems:'center', gap:5,
            color: active?t.text:t.textDim, position:'relative', padding:'4px 8px',
          }}>
            <div style={{ position:'relative' }}>
              <i.icon size={17} strokeWidth={active?2:1.5}/>
              {!!i.badge && (
                <span style={{ position:'absolute', top:-3, right:-7,
                  fontSize:7, fontWeight:700, color:'#fff', background:t.primary,
                  minWidth:13, height:13, borderRadius:r.pill, padding:'0 3px',
                  display:'flex', alignItems:'center', justifyContent:'center' }}>{i.badge}</span>
              )}
            </div>
            <span style={{ ...T.eyebrowS, fontSize:8, letterSpacing:1.2 }}>{i.label}</span>
          </button>
        );
      })}
    </div>
  );
};

/* ──────── ROOT ──────── */
export default function VisionApp() {
  const [theme, setTheme] = useState('light');
  const [screen, setScreen] = useState('splash');
  const [prevScreen, setPrevScreen] = useState('home');
  const [product, setProduct] = useState(null);
  const [collectionSlug, setCollectionSlug] = useState('new-season');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cart, setCart] = useState([{ ...PRODUCTS[0], qty:1 },{ ...PRODUCTS[3], qty:2 }]);
  const [wishlist, setWishlist] = useState(new Set([2,6]));
  const [view, setView] = useState('interactive');
  const [spend, setSpend] = useState(3847);

  const t = themes[theme];
  const tier = getTier(spend);

  const go = (s, p, ctx) => {
    if (p) setProduct(p);
    if (ctx) setCollectionSlug(ctx);
    if (s !== screen) setPrevScreen(screen);
    setScreen(s);
    setDrawerOpen(false);
  };
  const goBack = () => setScreen(prevScreen || 'home');
  const addToCart = (p) => setCart(prev => {
    const ex = prev.find(i => i.id === p.id);
    return ex ? prev.map(i => i.id===p.id?{ ...i, qty:i.qty+1 }:i) : [...prev, { ...p, qty:1 }];
  });
  const toggleWish = (id) => setWishlist(prev => { const n = new Set(prev); n.has(id)?n.delete(id):n.add(id); return n; });
  const clearCart = () => setCart([]);

  const showNav = ['home','search','wishlist','profile'].includes(screen);
  const cartCount = cart.reduce((s,i) => s+i.qty, 0);

  const renderScreen = () => {
    switch (screen) {
      case 'splash':   return <SplashScreen t={t} go={go}/>;
      case 'login':    return <LoginScreen t={t} go={go}/>;
      case 'home':     return <HomeScreen t={t} go={go} toggleWish={toggleWish} wishlist={wishlist} cartCount={cartCount} openDrawer={() => setDrawerOpen(true)} tier={tier} spend={spend}/>;
      case 'category': return <CategoryScreen t={t} go={go} slug={collectionSlug} toggleWish={toggleWish} wishlist={wishlist}/>;
      case 'story':    return <StoryScreen t={t} go={go} toggleWish={toggleWish} wishlist={wishlist}/>;
      case 'search':   return <SearchScreen t={t} go={go} toggleWish={toggleWish} wishlist={wishlist}/>;
      case 'product':  return <ProductScreen t={t} go={go} goBack={goBack} product={product} addToCart={addToCart} toggleWish={toggleWish} wished={wishlist.has(product?.id)} tier={tier}/>;
      case 'cart':     return <CartScreen t={t} go={go} cart={cart} setCart={setCart} tier={tier}/>;
      case 'checkout': return <CheckoutScreen t={t} go={go} cart={cart}/>;
      case 'payment':  return <PaymentScreen t={t} go={go} cart={cart} tier={tier} spend={spend}/>;
      case 'success':  return <SuccessScreen t={t} go={go} clearCart={clearCart} tier={tier}/>;
      case 'orders':   return <OrdersScreen t={t} go={go}/>;
      case 'wishlist': return <WishlistScreen t={t} go={go} wishlist={wishlist} toggleWish={toggleWish}/>;
      case 'profile':  return <ProfileScreen t={t} go={go} theme={theme} setTheme={setTheme} tier={tier} spend={spend}/>;
      case 'tier':     return <TierScreen t={t} go={go} tier={tier} spend={spend}/>;
      default: return null;
    }
  };

  const showcase = [
    { id:'splash',label:'Splash' },{ id:'login',label:'Sign in' },
    { id:'home',label:'Home' },{ id:'category',label:'Category' },
    { id:'story',label:'Story' },{ id:'search',label:'Search' },
    { id:'product',label:'Product' },{ id:'cart',label:'Bag' },
    { id:'checkout',label:'Checkout' },{ id:'payment',label:'Payment' },
    { id:'success',label:'Confirmed' },{ id:'orders',label:'Orders' },
    { id:'wishlist',label:'Saved' },{ id:'profile',label:'Account' },
    { id:'tier',label:'Membership' },
  ];

  return (
    <div style={{ minHeight:'100vh', background: theme==='light'?'#EDE8DD':'#080705',
      padding:'36px 16px 64px', transition:'background .3s', fontFamily:'Inter,-apple-system,sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700;800&display=swap');
        * { box-sizing:border-box; -webkit-font-smoothing:antialiased; }
        html, body, #root { height:100%; }
        body { margin:0; font-family:Inter,sans-serif; -webkit-tap-highlight-color:transparent; touch-action:manipulation; overscroll-behavior:none; }
        .no-scrollbar::-webkit-scrollbar { display:none; }
        .no-scrollbar { -ms-overflow-style:none; scrollbar-width:none; }
        /* Android + iOS scroll fixes — momentum on iOS, correct touch direction, no scroll chaining */
        [style*="overflow-y: auto"], [style*="overflow-y:auto"] {
          -webkit-overflow-scrolling:touch;
          overscroll-behavior-y:contain;
          touch-action:pan-y;
        }
        [style*="overflow-x: auto"], [style*="overflow-x:auto"] {
          -webkit-overflow-scrolling:touch;
          overscroll-behavior-x:contain;
          touch-action:pan-x;
        }
        button, input, select, textarea { font-family:inherit; -webkit-tap-highlight-color:transparent; }
        button { touch-action:manipulation; user-select:none; -webkit-user-select:none; outline:none; }
        button:focus { outline:none; }
        input, textarea { -webkit-user-select:text; user-select:text; }
        button:active { opacity:0.85; }
      `}</style>

      <div style={{ maxWidth:1280, margin:'0 auto 36px',
        display:'flex', justifyContent:'space-between', alignItems:'center', gap:16, flexWrap:'wrap' }}>
        <div>
          <div style={{ fontSize:22, fontWeight:800, letterSpacing:4, color:t.text }}>
            VISION<span style={{ color:t.primary }}>.</span>
          </div>
          <div style={{ ...T.eyebrowS, color:t.textDim, marginTop:6 }}>ANDROID PROTOTYPE — SS&rsquo;26 · V4</div>
        </div>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <div style={{ display:'flex', padding:3, gap:2,
            border:`1px solid ${t.borderSolid}`, background:t.bg, borderRadius:r.md }}>
            {['interactive','showcase'].map(v => (
              <button key={v} onClick={() => setView(v)} style={{
                padding:'8px 14px', border:'none', cursor:'pointer', fontFamily:'inherit', borderRadius:r.sm,
                background: view===v?t.text:'transparent', color: view===v?t.bg:t.text, ...T.buttonSm,
              }}>{v==='interactive'?'Interactive':'All screens'}</button>
            ))}
          </div>
          <select value={spend} onChange={e => setSpend(Number(e.target.value))} style={{
            padding:'11px 14px', border:`1px solid ${t.borderSolid}`, background:t.bg, color:t.text,
            ...T.buttonSm, fontFamily:'inherit', cursor:'pointer', appearance:'none', paddingRight:28, borderRadius:r.md,
          }}>
            <option value={1240}>EMBER · $1,240</option>
            <option value={3847}>SILVER · $3,847</option>
            <option value={6120}>GOLD · $6,120</option>
            <option value={9450}>PLATINUM · $9,450</option>
          </select>
          <button onClick={() => setTheme(theme==='light'?'dark':'light')} style={{
            display:'flex', alignItems:'center', gap:8, padding:'11px 14px',
            border:`1px solid ${t.borderSolid}`, background:t.bg, color:t.text, cursor:'pointer',
            ...T.buttonSm, fontFamily:'inherit', borderRadius:r.md,
          }}>
            {theme==='light' ? <><Moon size={13} strokeWidth={1.5}/> Dark</> : <><Sun size={13} strokeWidth={1.5}/> Light</>}
          </button>
        </div>
      </div>

      {view === 'interactive' ? (
        <div style={{ display:'flex', justifyContent:'center' }}>
          <PhoneFrame t={t}>
            {renderScreen()}
            {showNav && <BottomNav t={t} screen={screen} go={go} cartCount={cartCount} wishCount={wishlist.size}/>}
            <Drawer t={t} open={drawerOpen} close={() => setDrawerOpen(false)} go={go} tier={tier} spend={spend}/>
          </PhoneFrame>
        </div>
      ) : (
        <div style={{ maxWidth:1280, margin:'0 auto',
          display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:36, justifyItems:'center' }}>
          {showcase.map(s => (
            <PhoneFrame key={s.id} t={t} label={s.label}>
              <PreviewScreen id={s.id} t={t} theme={theme} setTheme={setTheme} tier={tier} spend={spend}/>
              {['home','search','cart','wishlist','profile'].includes(s.id) && (
                <BottomNav t={t} screen={s.id} go={() => {}} cartCount={cartCount} wishCount={wishlist.size}/>
              )}
            </PhoneFrame>
          ))}
        </div>
      )}
    </div>
  );
}

const PreviewScreen = ({ id, t, theme, setTheme, tier, spend }) => {
  const noop = () => {};
  const product = PRODUCTS[2];
  const cart = [{ ...PRODUCTS[0], qty:1 },{ ...PRODUCTS[3], qty:2 }];
  const wishlist = new Set([2,6]);
  switch (id) {
    case 'splash':   return <SplashScreen t={t} go={noop}/>;
    case 'login':    return <LoginScreen t={t} go={noop}/>;
    case 'home':     return <HomeScreen t={t} go={noop} toggleWish={noop} wishlist={wishlist} cartCount={3} openDrawer={noop} tier={tier} spend={spend}/>;
    case 'category': return <CategoryScreen t={t} go={noop} slug="women" toggleWish={noop} wishlist={wishlist}/>;
    case 'story':    return <StoryScreen t={t} go={noop} toggleWish={noop} wishlist={wishlist}/>;
    case 'search':   return <SearchScreen t={t} go={noop} toggleWish={noop} wishlist={wishlist}/>;
    case 'product':  return <ProductScreen t={t} go={noop} goBack={noop} product={product} addToCart={noop} toggleWish={noop} wished={false} tier={tier}/>;
    case 'cart':     return <CartScreen t={t} go={noop} cart={cart} setCart={noop} tier={tier}/>;
    case 'checkout': return <CheckoutScreen t={t} go={noop} cart={cart}/>;
    case 'payment':  return <PaymentScreen t={t} go={noop} cart={cart} tier={tier} spend={spend}/>;
    case 'success':  return <SuccessScreen t={t} go={noop} clearCart={noop} tier={tier}/>;
    case 'orders':   return <OrdersScreen t={t} go={noop}/>;
    case 'wishlist': return <WishlistScreen t={t} go={noop} wishlist={new Set([1,3,5,7])} toggleWish={noop}/>;
    case 'profile':  return <ProfileScreen t={t} go={noop} theme={theme} setTheme={setTheme} tier={tier} spend={spend}/>;
    case 'tier':     return <TierScreen t={t} go={noop} tier={tier} spend={spend}/>;
    default: return null;
  }
};
