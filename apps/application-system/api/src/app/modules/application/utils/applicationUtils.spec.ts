import {
  getApplicantName,
  getApplicationNameTranslationString,
  getApplicationStatisticsNameTranslationString,
  getPaymentStatusForAdmin,
  removeAttachmentFromAnswers,
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

  describe('getApplicantName', () => {
    it('Should return the applicant name  when nationalRegistry has a fullName', () => {
      expect(
        getApplicantName(
          createApplication({
            externalData: {
              nationalRegistry: {
                data: {
                  fullName: 'Test User',
                },
                date: new Date(),
                status: 'success',
              },
            },
          }),
        ),
      ).toEqual('Test User')
    })

    it('Should return name of the applicant when identity external data is defined', () => {
      expect(
        getApplicantName(
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
        ),
      ).toEqual('Test User')
    })

    it('Should return name of the applicant when person external data is defined', () => {
      expect(
        getApplicantName(
          createApplication({
            externalData: {
              person: {
                data: {
                  fullname: 'Test User',
                },
                date: new Date(),
                status: 'success',
              },
            },
          }),
        ),
      ).toEqual('Test User')
    })

    it('Should return null when no external data is defined', () => {
      expect(
        getApplicantName(
          createApplication({
            externalData: {},
          }),
        ),
      ).toBeNull()
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
})
