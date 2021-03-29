import allDocuments from './samples/all-documents.json'
import allLicenses from './samples/all-licenses.json'
import sampleDocument from './samples/sample-document.json'

export const typePolicies = {
  Query: {
    fields: {
      listDocuments: {
        read() {
          return allDocuments
        },
      },
      Document: {
        read(_noop: unknown, { args: { id } }: any) {
          const doc = allDocuments.find((d) => d.id === id)
          if (doc) {
            return { ...doc, ...sampleDocument }
          }
          return null
        },
      },
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
    },
  },
}
