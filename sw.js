// Offline cache. Holds only the password page, the ENCRYPTED game payload, the manifest and icons.
// CACHE changes on every build so phones pick up updates.
const CACHE='rz-20261018-215101';
const FILES=['./','./index.html','./game.enc.json','./manifest.webmanifest','./icons/apple-touch-icon.png','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);if(r.method!=='GET'||u.origin!==location.origin)return;
  const net=r.mode==='navigate'||u.pathname.endsWith('/game.enc.json'); // network first for page + payload (updates), cache when offline
  if(net){e.respondWith(fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put(r.mode==='navigate'?'./index.html':'./game.enc.json',cp));}return res;})
    .catch(()=>caches.match(r.mode==='navigate'?'./index.html':'./game.enc.json')));return;}
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(hit=>hit||fetch(r)));});
