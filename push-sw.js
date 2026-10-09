/* Push notification handlers, imported into the generated service worker. */
self.addEventListener('push', (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch { /* plain text */ }
  const title = data.title || 'CD-Track';
  const body = data.body || 'You have a recording due. Open CD-Track to record.';
  event.waitUntil(self.registration.showNotification(title, {
    body,
    icon: 'icon-192.png',
    badge: 'icon-192.png',
    tag: data.tag || 'cdtrack-reminder',
    data: { url: data.url || './#/patient' },
  }));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || './#/patient';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((wins) => {
      for (const w of wins) {
        if ('focus' in w) { w.navigate(url); return w.focus(); }
      }
      return self.clients.openWindow(url);
    }),
  );
});
