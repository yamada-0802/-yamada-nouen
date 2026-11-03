import {readData,renderGallery,publicLink} from './content.js';
const toggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('#navigation');
function closeMenu(focus=false){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','メニューを開く');if(focus)toggle.focus();}
toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';nav.classList.toggle('open',open);toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'メニューを閉じる':'メニューを開く');});
nav.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu(true);});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&toggle.getAttribute('aria-expanded')==='true')closeMenu(true);});
document.addEventListener('click',e=>{if(!e.target.closest('.header'))closeMenu();});
document.addEventListener('focusin',e=>{if(!e.target.closest('.header'))closeMenu();});
matchMedia('(min-width:701px)').addEventListener('change',()=>closeMenu());
const base=new URL('../',import.meta.url);
function photoUrl(value){if(typeof value!=='string'||!/^assets\/[A-Za-z0-9_./-]+\.(?:jpe?g|png|webp|avif)$/i.test(value)||value.split('/').includes('..'))return null;return new URL(value,base).href;}
async function settings(){try{const data=await readData('settings');for(const slot of document.querySelectorAll('[data-photo]')){const src=photoUrl(data[slot.dataset.photo]);if(!src)continue;const image=new Image();image.alt=slot.dataset.alt;image.decoding='async';image.onload=()=>slot.replaceChildren(image);image.src=src;}
for(const block of document.querySelectorAll('[data-background]')){const src=photoUrl(data[block.dataset.background]);if(!src)continue;const image=new Image();image.onload=()=>{block.style.backgroundImage=`url("${src}")`;block.querySelector('.photo-status').hidden=true;};image.src=src;}
const contact=publicLink(data.contactUrl);if(contact){const link=document.querySelector('#contact-link');link.href=contact;link.hidden=false;document.querySelector('#contact-status').hidden=true;}
for(const key of ['instagramUrl','xUrl']){const url=publicLink(data[key]);if(!url||!url.startsWith('https:'))continue;const link=document.querySelector(`[data-social="${key}"]`);link.href=url;link.hidden=false;link.rel='noopener noreferrer';document.querySelector(`[data-social-status="${key}"]`).hidden=true;}}
catch{document.querySelector('#contact-status').textContent='設定を読み込めませんでした';}}
async function gallery(){const container=document.querySelector('#gallery-list');const status=document.querySelector('#gallery-status');try{const entries=await readData('gallery');renderGallery(container,entries);if(!entries.length){status.textContent='写真未設定';for(const caption of ['土づくり','マルチ張り','定植','生育状況']){const figure=document.createElement('figure');const empty=document.createElement('div');empty.className='empty-photo';empty.textContent='写真未設定';const text=document.createElement('figcaption');text.textContent=caption;figure.append(empty,text);container.append(figure);}}else{status.textContent='';}}
catch{status.textContent='写真データを読み込めませんでした。gallery.jsonを確認してください。';}}
async function news(){const container=document.querySelector('#news-list');try{const entries=await readData('news');if(!Array.isArray(entries))throw Error();const fragment=document.createDocumentFragment();for(const entry of entries){if(typeof entry.text!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(entry.date))throw Error();const article=document.createElement('article');article.className='news-item';const time=document.createElement('time');time.dateTime=entry.date;time.textContent=entry.date.replaceAll('-','.');const text=document.createElement('p');text.textContent=entry.text;article.append(time,text);fragment.append(article);}if(entries.length)container.replaceChildren(fragment);}
catch{container.textContent='お知らせデータを読み込めませんでした';}}
await Promise.allSettled([settings(),gallery(),news()]);
const galleryTrack=document.querySelector('#gallery-list');
const galleryPages=document.querySelector('#gallery-pages');
const figures=[...galleryTrack.querySelectorAll('figure')];
if(figures.length>1){
  const buttons=figures.map((figure,index)=>{const button=document.createElement('button');button.type='button';button.setAttribute('aria-label',`写真${index+1}を表示`);button.setAttribute('aria-current',String(index===0));button.addEventListener('click',()=>galleryTrack.scrollTo({left:figure.offsetLeft-figures[0].offsetLeft,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'}));galleryPages.append(button);return button;});
  const update=()=>{let nearest=0;let distance=Infinity;figures.forEach((figure,index)=>{const d=Math.abs(figure.offsetLeft-figures[0].offsetLeft-galleryTrack.scrollLeft);if(d<distance){distance=d;nearest=index;}});buttons.forEach((button,index)=>button.setAttribute('aria-current',String(index===nearest)));};
  galleryTrack.addEventListener('scroll',update,{passive:true});
  new ResizeObserver(()=>{const canScroll=galleryTrack.scrollWidth>galleryTrack.clientWidth+1;galleryPages.hidden=!canScroll;update();}).observe(galleryTrack);
}

