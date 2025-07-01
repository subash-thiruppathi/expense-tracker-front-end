import { useEffect, useCallback, useState } from 'react';
import { messaging, getToken, onMessage } from '../config/firebase';
import authService from '../services/auth.service';
import socketService from '../services/socket.service';

/**
 * @param {import("../types").User | null} user
 */
const useNotifications = (user = null) => {
  const [notificationPermission, setNotificationPermission] = useState(Notification.permission);

  // Show in-app notification function
  const showInAppNotification = useCallback((payload) => {
    
    if (payload.notification) {
      const { title, body } = payload.notification;
      
      if (Notification.permission === 'granted') {
        new Notification(title, {
          body,
          icon: '/icon-192x192.png',
          badge: '/badge-72x72.png',
          tag: 'app-notification',
        });
      }
    }
  }, []);

  // Request notification permission
  const requestPermission = useCallback(async () => {
    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    } catch (error) {
    }
  }, []);

  // Effect to request permission on component mount
  useEffect(() => {
    if (!('Notification' in window)) {
      return;
    }
    if (!messaging) {
      return;
    }
    if (notificationPermission === 'default') {
      requestPermission();
    }
  }, [notificationPermission, requestPermission]);

  // Effect to get FCM token and register it with backend
  useEffect(() => {
    const registerFCMToken = async () => {
      if (user && notificationPermission === 'granted') {
        try {
          const token = await getToken(messaging, {
            vapidKey: 'BLb75PsbiORd1MbvZC9IHT4NZGx8r4rxFXqac9diYFqhl5ikv3GVLe40190f8mfI6EkVynGNOUcxu0YvnZxxR8g'
          });
          if (token) {
            const device_type = getDeviceType();
            const device_info = {
              userAgent: navigator.userAgent,
              platform: navigator.platform,
              language: navigator.language,
              screen: {
                width: window.screen.width,
                height: window.screen.height,
                pixelRatio: window.devicePixelRatio
              },
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              timestamp: new Date().toISOString()
            };
            let payload = {
              user_id: user.id, 
              token: token,
              device_type: device_type,
              device_info: device_info
            };
            await authService.registerNotificationToken(payload);
          } else {
          }
        } catch (error) {
        }
      }
    };
    registerFCMToken();
  }, [user?.id, notificationPermission]);

  // Listen for foreground messages
  useEffect(() => {
    if (!messaging) return;
    
    const unsubscribe = onMessage(messaging, (payload) => {
      showInAppNotification(payload);
    });

    return () => {
      unsubscribe();
    };
  }, [showInAppNotification]);

  // Socket connection effect
  useEffect(() => {
    if (user) {
        socketService.connect();

        socketService.on('notification', (data) => {
            const formattedPayload = {
                notification: {
                    title: data.title,
                    body: data.body,
                },
            };
            showInAppNotification(formattedPayload);
        });

        return () => {
            socketService.off('notification');
            socketService.disconnect();
        };
    }
}, [user?.id, showInAppNotification]);

  return {
    requestPermission,
    showInAppNotification
  };
};

const getDeviceType = () => {
  const ua = navigator.userAgent.toLowerCase();

  if (/android|iphone|ipad|mobile|tablet/.test(ua)) return 'mobile';
  if (/mac|win|linux/.test(ua)) return 'web';

  return 'unknown';
};

export default useNotifications;
