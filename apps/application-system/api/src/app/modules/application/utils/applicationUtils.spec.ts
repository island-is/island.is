import {
  getApplicationNameTranslationString,
  getApplicationStatisticsNameTranslationString,
  getPaymentStatusForAdmin,
  removeObjectWithKeyFromAnswers,
} from './application'
import {
  createApplication,
  createApplicationTemplate,
} from '@island.is/application/testing'

describe('Testing utility functions for applications', () => {
  describe('getPaymentStatusForAdmin', () => {
    it('Should return unpaid when not fulfilled and payment created date defined', () => {
      expect(
        getPaymentStatusForAdmin({ fulfilled: false, created: new Date() }),
      ).toEqual('unpaid')
    })

    it('Should return paid when fulfilled and payment created date defined', () => {
      expect(
        getPaymentStatusForAdmin({ fulfilled: true, created: new Date() }),
      ).toEqual('paid')
    })

    it('Should return null when payment object is not defined', () => {
      expect(getPaymentStatusForAdmin(null)).toEqual(null)
    })
  })

  describe('getApplicationNameTranslationString', () => {
    it('Should return the name of the application when defined with a string', () => {
      expect(
        getApplicationNameTranslationString(
          createApplicationTemplate(),
          createApplication({
            externalData: {
              identity: {
                data: {
                  name: 'Test User',
                },
                date: new Date(),
                status: 'success',
              },
            },
          }),
          (message) => message as any,
        ),
      ).toEqual('Test application')
    })

    it('Should return the correct application name based on a predefined age threshold', () => {
      expect(
        getApplicationNameTranslationString(
          createApplicationTemplate({
            name: (application) =>
              Number(application.answers.age) >= 20
                ? 'Adult Application'
                : 'Child Application',
          }),
          createApplication({
            answers: {
              age: 20,
            },
          }),
          (message) => message as any,
        ),
      ).toEqual('Adult Application')
    })

    it('Should return the name of the application when defined with a static string', () => {
      expect(
        getApplicationNameTranslationString(
          createApplicationTemplate({
            name: 'Normal Application',
          }),
          createApplication(),
          (message) => message as any,
        ),
      ).toEqual('Normal Application')
    })

    describe('getApplicationStatisticsNameTranslationString', () => {
      const applicationStatistics = {
        typeid: 'test',
        count: 1,
        draft: 1,
        inprogress: 1,
        completed: 1,
        rejected: 1,
        approved: 1,
      }
      it('Should return the translated name of the application statistics when defined with a string', () => {
        expect(
          getApplicationStatisticsNameTranslationString(
            createApplicationTemplate({
              name: 'test name',
            }),
            applicationStatistics,
            (message) => (message + ' formatted') as string,
          ),
        ).toEqual('test name formatted')
      })

      it('Should return the translated name of the application statistics when defined with a function', () => {
        expect(
          getApplicationStatisticsNameTranslationString(
            createApplicationTemplate({
              name: (application) => application.typeId + ' name',
            }),
            applicationStatistics,
            (message) => (message + ' formatted') as string,
          ),
        ).toEqual('test name formatted')
      })

      it('Should return the translated name of the application statistics when defined with a function that returns an object', () => {
        expect(
          getApplicationStatisticsNameTranslationString(
            createApplicationTemplate({
              name: (application) => ({
                name: application.typeId + ' name',
                value: '1',
              }),
            }),
            applicationStatistics,
            (message, value) => `${message} ${value?.value} formatted`,
          ),
        ).toEqual('test name 1 formatted')
      })
    })
  })

  describe('removeAttachmentFromAnswers', () => {
    it('Should remove an object from an array that contains the given key and leave the array empty', () => {
      const givenAnswers = {
        documents: [
          { id: 'doc1', attachmentId: 'some-key-123', name: 'Document 1' },
        ],
      }
      const expectedAnswers = {
        documents: [],
      }

      const result = removeObjectWithKeyFromAnswers(
        givenAnswers,
        'some-key-123',
      )

      expect(result).toEqual(expectedAnswers)
    })

    it('Should remove nested objects that contain the given key', () => {
      const givenAnswers = {
        section1: {
          attachment: { id: 'some-key-123', name: 'Remove me' },
          otherData: 'keep this',
        },
        section2: {
          data: 'keep this too',
        },
      }
      const expectedAnswers = {
        section1: {
          otherData: 'keep this',
        },
        section2: {
          data: 'keep this too',
        },
      }

      const result = removeObjectWithKeyFromAnswers(
        givenAnswers,
        'some-key-123',
      )

      expect(result).toEqual(expectedAnswers)
    })

    it('Should remove an object from an array that contains the given key', () => {
      const givenAnswers = {
        documents: [
          { id: 'doc1', attachmentId: 'some-key-123', name: 'Document 1' },
          { id: 'doc2', attachmentId: 'keep-this-key', name: 'Document 2' },
        ],
      }
      const expectedAnswers = {
        documents: [
          { id: 'doc2', attachmentId: 'keep-this-key', name: 'Document 2' },
        ],
      }

      const result = removeObjectWithKeyFromAnswers(
        givenAnswers,
        'some-key-123',
      )

      expect(result).toEqual(expectedAnswers)
    })

    it('Should remove nested objects that contain the given key', () => {
      const givenAnswers = {
        section1: {
          attachment: { id: 'some-key-123', name: 'Remove me' },
          otherData: 'keep this',
        },
        section2: {
          data: 'keep this too',
        },
      }
      const expectedAnswers = {
        section1: {
          otherData: 'keep this',
        },
        section2: {
          data: 'keep this too',
        },
      }

      const result = removeObjectWithKeyFromAnswers(
        givenAnswers,
        'some-key-123',
      )

      expect(result).toEqual(expectedAnswers)
    })

    it('Should handle deeply nested arrays and objects', () => {
      const givenAnswers = {
        deepSection: {
          documents: [
            {
              files: [
                { id: 'file1', attachmentId: 'some-key-123' },
                { id: 'file2', attachmentId: 'keep-this' },
              ],
            },
            {
              files: [{ id: 'file3', attachmentId: 'also-keep-this' }],
            },
          ],
        },
      }
      const expectedAnswers = {
        deepSection: {
          documents: [
            {
              files: [{ id: 'file2', attachmentId: 'keep-this' }],
            },
            {
              files: [{ id: 'file3', attachmentId: 'also-keep-this' }],
            },
          ],
        },
      }

      const result = removeObjectWithKeyFromAnswers(
        givenAnswers,
        'some-key-123',
      )

      expect(result).toEqual(expectedAnswers)
    })

    it('Should handle even more complex deeply nested arrays and objects', () => {
      const givenAnswers = {
        deepSection: {
          someRandomProp: { data: 'Some data' },
          deeperSection: {
            documents: [
              {
                files: [
                  { id: 'file1', attachmentId: 'some-key-123', nr: 77 },
                  { id: 'file2', attachmentId: 'keep-this', nr: 55 },
                ],
              },
              {
                files: [{ id: 'file3', attachmentId: 'also-keep-this' }],
              },
            ],
            otherSection: {
              nr: 100,
              name: 'Some Name',
              kids: [
                { kid: 'Some kid', phone: 1234567 },
                { kid: 'Some other kid', phone: 1234568 },
              ],
            },
          },
        },
      }

      const expectedAnswers = {
        deepSection: {
          someRandomProp: { data: 'Some data' },
          deeperSection: {
            documents: [
              {
                files: [{ id: 'file2', attachmentId: 'keep-this', nr: 55 }],
              },
              {
                files: [{ id: 'file3', attachmentId: 'also-keep-this' }],
              },
            ],
            otherSection: {
              nr: 100,
              name: 'Some Name',
              kids: [
                { kid: 'Some kid', phone: 1234567 },
                { kid: 'Some other kid', phone: 1234568 },
              ],
            },
          },
        },
      }

      const result = removeObjectWithKeyFromAnswers(
        givenAnswers,
        'some-key-123',
      )

      expect(result).toEqual(expectedAnswers)
    })

    it('Should return empty object when no answers provided', () => {
      const givenAnswers = {}
      const expectedAnswers = {}

      const result = removeObjectWithKeyFromAnswers(
        givenAnswers,
        'some-key-123',
      )

      expect(result).toEqual(expectedAnswers)
    })
  })
})
