import allLicenses from './samples/all-licenses.json'
import allNotifications from './samples/all-notifications.json';

export const typePolicies = {
  Query: {
    fields: {
      listLicenses: {
        read() {
          return allLicenses
        },
      },
      License: {
        read(_noop: unknown, { args: { id } }: any) {
          return allLicenses.find((l) => l.license.type === id)
        },
      },
      listNotifications: {
        read() {
          return allNotifications;
        }
      },
      Notification: {
        read(_noop: unknown, { args: { id } }: any) {
          const notification = allNotifications.find((d) => d.id === id)
          if (notification) {
            return notification;
          }
          return null
        }
      },
    },
  },
}
