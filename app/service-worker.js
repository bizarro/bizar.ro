const staticCacheName = 'bizarro-v1'

const filesToCache = [
  '/offline/index.html'
]

this.addEventListener('install', event => {
  this.skipWaiting()

  event.waitUntil(
    caches.open(staticCacheName).then(cache => {
      return cache.addAll(filesToCache)
    })
  )
})

// Serve from Cache
this.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request)
    }).catch(() => {
      return caches.match('/offline/index.html')
    })
  )
})
