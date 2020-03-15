var primaryCache = "primary-cache";

var assets = [
  '/',
  '/index.html',
  '/css/index.css',
  '/js/jquery-3.4.1.js',
  '/js/index.js',
  '/images/tree1.png',
  '/images/bluecar1.png',
  '/images/redcar1.png',
  '/images/greencar1.png',
  '/images/orangecar1.png',
  '/images/redcar2.png',
  '/images/orangecar1.png',
  '/images/yellowcar1.png',
  '/images/car.png'
];
// install service worker event
self.addEventListener("install", function(evt) {
  console.log("service worker installed");
  evt.waitUntil(
    caches.open(primaryCache).then(function(cache) {
      console.log("Caching assets");
      cache.addAll(assets);
    })
  );

})

// activate service worker
self.addEventListener("activate", function(evt) {
  console.log("service worker activated");
})

// intercepting fetch requests
// self.addEventListener("fetch", function(evt) {
//   // console.log("fetch event",evt);
//   evt.respondWith(
//     caches.match(evt.request).then(function(cacheRes) {
//       return cacheRes || fetch(evt.request);
//     })
//   );
// })
