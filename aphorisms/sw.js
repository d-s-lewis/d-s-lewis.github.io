self.addEventListener("push", (event) => {
  console.log("[sw] Push received");

  let data = {
    title: "Darcie's Aphorisms",
    body: "A new aphorism awaits.",
    url: "/aphorisms/",
  };

  if (event.data) {
    try {
      data = {
        ...data,
        ...event.data.json(),
      };
    } catch {
      data.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/aphorisms/icon-192.png",
      badge: "/aphorisms/icon-192.png",
      data: {
        url: data.url,
      },
    })
  );
});

self.registration.showNotification("TEST", {
  body: "If you can see this, notifications work.",
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((clientList) => {
        for (const client of clientList) {
          if ("focus" in client) {
            client.navigate(url);
            return client.focus();
          }
        }

        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});
