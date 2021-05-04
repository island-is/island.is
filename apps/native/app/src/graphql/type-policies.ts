import allDocuments from './samples/all-documents.json'
import allLicenses from './samples/all-licenses.json'
import allNotifications from './samples/all-notifications.json';
import sampleDocument from './samples/sample-document.json'

export const typePolicies = {
  Query: {
    fields: {
      // listDocuments: {
      //   read() {
      //     return allDocuments
      //   },
      // },
      // Document: {
      //   read(_noop: unknown, { args: { id } }: any) {
      //     const doc = allDocuments.find((d) => d.id === id)
      //     if (doc) {
      //       return { ...doc, ...sampleDocument }
      //     }
      //     return null
      //   },
      // },
      listLicenses: {
        read() {
          return allLicenses
        },
      },
      License: {
        read(_noop: unknown, { args: { id } }: any) {
          return allLicenses.find((l) => l.id === id)
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
