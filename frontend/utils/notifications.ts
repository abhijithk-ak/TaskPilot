'use client';

type NotificationType = 'task' | 'personal' | 'quote' | 'all';

// Fallback list of random productivity/mindfulness quotes
const NOTIF_QUOTES = [
  "Focus on being productive instead of busy.",
  "Take a deep breath. Hydrate, and stretch your back.",
  "You don't have to see the whole staircase, just take the first step.",
  "Your mind is for having ideas, not holding them. Dump it to TaskPilot.",
  "The secret of getting ahead is getting started.",
  "Drink a glass of water right now. Your brain will thank you."
];

/**
 * Fires a system notification (HTML5 Web Notifications API on web, and bridges
 * to Capacitor LocalNotifications on native Android if compiled).
 */
export async function sendLocalNotification(
  title: string,
  body: string,
  type: NotificationType = 'task'
) {
  // 1. Check if user allowed notifications in settings
  const setting = localStorage.getItem(`notif-pref-${type}`);
  if (setting === 'false') return;

  // 2. Android APK / Native wrapper check (Capacitor LocalNotifications)
  const win = window as any;
  if (win.Capacitor && win.Capacitor.isPluginAvailable('LocalNotifications')) {
    try {
      const { LocalNotifications } = win.Capacitor.Plugins;
      const hasPerm = await LocalNotifications.checkPermissions();
      if (hasPerm.display !== 'granted') {
        await LocalNotifications.requestPermissions();
      }
      await LocalNotifications.schedule({
        notifications: [
          {
            id: Math.floor(Math.random() * 100000),
            title,
            body,
            schedule: { at: new Date(Date.now() + 100) },
            sound: 'default',
            actionTypeId: 'OPEN_APP',
            extra: { type }
          }
        ]
      });
      return;
    } catch (e) {
      console.warn("Native Notification Plugin failed, falling back to Web API", e);
    }
  }

  // 3. Standard Web Browser Notifications API
  if ('Notification' in window) {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.ico', // fallback image path
        tag: `taskpilot-${type}`,
        requireInteraction: false
      });
    } else if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        new Notification(title, { body });
      }
    }
  }
}

/**
 * Schedules periodic quote notifications & hydration checkups.
 */
export function initializeNotificationEngine() {
  if (typeof window === 'undefined') return;

  // Ensure notification defaults are set in localStorage
  ['task', 'personal', 'quote'].forEach(type => {
    if (localStorage.getItem(`notif-pref-${type}`) === null) {
      localStorage.setItem(`notif-pref-${type}`, 'true');
    }
  });

  // Request browser permissions on initialization
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }

  // Set up periodic random notification checks (runs every 15 minutes)
  const checkInterval = 15 * 60 * 1000;
  
  setInterval(() => {
    const hr = new Date().getHours();
    // Only fire between 9 AM and 9 PM to avoid disturbing the user
    if (hr >= 9 && hr < 21) {
      const dice = Math.random();
      
      if (dice < 0.3) {
        // Hydration check (Personal care)
        sendLocalNotification(
          "Personal Care Reminder",
          "Time for a quick stretch and a glass of water. Keep your energy up!",
          "personal"
        );
      } else if (dice < 0.6) {
        // Random Productivity Quote
        const quote = NOTIF_QUOTES[Math.floor(Math.random() * NOTIF_QUOTES.length)];
        sendLocalNotification(
          "Mindful Moment",
          quote,
          "quote"
        );
      }
    }
  }, checkInterval);
}
