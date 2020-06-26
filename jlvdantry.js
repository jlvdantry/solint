var cacheName = '022';
var filesToCache = [
  'index.html',
  'pwa.json',
  'js/app.js',
  'js/bootstrap.bundle.min.js',
  'js/font-awesome_5.13.0_all.js',
  'js/jquery.easing.min.js',
  'js/jquery.min.js',
  'js/scripts.js',
  'assets/img/portfolio/ACERVO512x512.png',
  'assets/img/portfolio/firma.svg',
  'assets/img/portfolio/pluma512x512.png',
  'assets/img/jlvdantry_144x144.png',
  'assets/img/avatar_jlv_completo.jpg',
  'assets/img/favicon.ico',
  'css/body.css',
  'css/heading.css',
  'css/styles.css',
  'fonts/lato_v16_S6u8w4BMUTPHjxsAXC-qNiXg7Q.woff2',
  'fonts/lato_v16_S6u_w4BMUTPHjxsI5wq_Gwftx9897g.woff2',
  'fonts/montserrat_v14_JTURjIg1_i6t8kCHKm45_dJE3gnD_vx3rCs.woff2',
  'fonts/lato_v16_S6u9w4BMUTPHh6UVSwiPGQ3q5d0.woff2',
  'fonts/lato_v16_S6uyw4BMUTPHjx4wXiWtFCc.woff2',
  'fonts/montserrat_v14_JTUSjIg1_i6t8kCHKm459WRhyyTh89ZNpQ.woff2'
]

self.addEventListener('install', function(e) {
  console.log('[install] Install cacheName'+cacheName);
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[install] Caching app shell');
      cache.addAll(filesToCache).then(function () { console.log('[install] agrego archivos'); } ).catch(function () { console.log('error en cache'); });
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[activate] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      console.log('[activate] entro en caches.keys elementos='+keyList.length);
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName) {
          console.log('[activate] va a remover el cache=', key);
          return caches.delete(key).then(function() {console.log('[activate] removio el cache');
                       notifica('Se instalo una nueva version '+cacheName,'Instalacion');});
        }
      }));
    })
  );
  return self.clients.claim();
});

var notifica = function (msg,tag) {
    self.registration.showNotification(msg, {
          tag    : tag,
          vibrate: [500,110,500,110,450,110,200,110,170,40,450,110,200,110,170,40,500]
          }
    );
}


var responseContent = "<html>" +
"<body>" +
"<style>" +
"body {text-align: center; background-color: #333; color: #eee;}" +
"</style>" +
"<h1>JLVDANTRY</h1>" +
"<p>Parece que hay un problema con tu conexion.</p>" +
"</body>" +
"</html>";



self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      if (response) { console.log('[fetch] fetch regreso cache ', response.url); return response; }
      console.log('[fetch] fetch regreso servidor ',e.request.url);
      return fetch(e.request);
    })
    .catch(function(err) {
        console.log('[fetch] error catch '+e.request.url+' '+err);
        return new Response(responseContent, {headers: {"Content-Type": "text/html"}});
                         })
  );
});

self.addEventListener('message', function(event){
        console.log('[message] recibio mensaje de cliente ' + event.data);
        if (event.data=='dame_versiones') {
           event.ports[0].postMessage(cacheName);
        }
        console.log('No reconocio mensaje');
    });

