importScripts('https://www.gstatic.com/firebasejs/6.3.5/firebase-app.js');

importScripts('https://www.gstatic.com/firebasejs/6.3.5/firebase-messaging.js');

firebase.initializeApp({
    'messagingSenderId':"769776781349"
});

const messaging=firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = 'New job created'+payload.notificationTitle;
    const notificationOptions = {
      body: 'Background Message body.',
      icon: 'assets/icons/icon-72x72.png'
    };
  
    return self.registration.showNotification(notificationTitle,
      notificationOptions);
  });