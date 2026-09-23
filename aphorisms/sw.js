self.addEventListener("push", (event) => {
  console.log("[sw] Push received");

  const titles = [
    "Darcie's dropped another one",
    "Wise of Wordsdom",
    "A new aphorism awaits",
    "Knowledge just dropped",
    "This is better than news",
    "A new perspective is waiting",
    "Wit for me!",
    "Clever clogging up your feed",
    "Smarty shoes shared something",
    "Hey, guess what",
  ];

  let data = {
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

  data.title = titles[Math.floor(Math.random() * titles.length)];

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
