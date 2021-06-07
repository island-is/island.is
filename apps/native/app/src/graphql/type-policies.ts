import allDocuments from './samples/all-documents.json'
import allLicenses from './samples/all-licenses.json'
import newLicenses from './samples/new-licenses.json';
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
          return newLicenses
        },
      },
      License: {
        read(_noop: unknown, { args: { id } }: any) {
          return newLicenses.find((l) => l.license.type === id)
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
