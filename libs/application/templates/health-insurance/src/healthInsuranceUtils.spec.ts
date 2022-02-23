import { Application, ApplicationTypes } from '@island.is/application/core'
import { faker } from '@island.is/shared/mocking'
import { Applications } from './dataProviders/APIDataTypes'
import {
  getOldestDraftApplicationId,
  hasActiveDraftApplication,
  getDraftApplications,
} from './healthInsuranceUtils'

describe('Health insurance utils', () => {
  const applicant = {
    nationalId: '1234567890',
    fullName: 'Test name',
    phoneNumber: '111-2222',
    email: 'email@email.is',
    age: 99,
  }

  const undefinedExternalData = {
    data: {},
    status: 'success',
    date: new Date(),
  }

  const createApplication = (
    applicationState = 'draft',
    id = faker.datatype.uuid(),
    externalData?: any,
    createDate?: string,
  ) =>
    (({
      id: id,
      state: applicationState,
      applicant: applicant.nationalId,
      assignees: [],
      typeId: ApplicationTypes.HEALTH_INSURANCE,
      modified: new Date(),
      created: createDate ?? new Date(),
      attachments: {},
      answers: {},
      externalData: {
        nationalRegistry:
          externalData?.nationalRegistry ?? undefinedExternalData,
        userProfile: externalData?.nationalRegistry ?? undefinedExternalData,
        applications: externalData?.applications ?? undefinedExternalData,
        healthInsurance: externalData?.healthInsurance ?? undefinedExternalData,
        directorateOfLabor: undefinedExternalData,
        internalRevenue: undefinedExternalData,
        insuranceAdministration: undefinedExternalData,
        moreInfo: undefinedExternalData,
      },
    } as unknown) as Application)

  describe('Check draft applications', () => {
    it('should return false if draft application list is undefined', () => {
      // assert
      const application = createApplication()

      // act and arrange
      expect(hasActiveDraftApplication(application.externalData)).toEqual(false)
    })

    it('should return false if application list is empty', () => {
      // assert
      const otherApplications = {
        data: {
          applications: [],
        },
        status: 'success',
        date: new Date(),
      }

      const externalData = {
        applications: otherApplications,
      }

      const application = createApplication(
        'draft',
        faker.datatype.uuid(),
        externalData,
      )

      // act and arrange
      expect(hasActiveDraftApplication(application.externalData)).toEqual(false)
    })

    it('should return false if there is only one draft in application list', () => {
      // assert
      const currentApplicationId = faker.datatype.uuid()

      const otherApplications = {
        data: [
          createApplication('draft', currentApplicationId),
          createApplication('inReview'),
          createApplication('inReview'),
          createApplication('inReview'),
        ],
        status: 'success',
        date: new Date(),
      }

      const externalData = {
        applications: otherApplications,
      }

      const application = createApplication(
        'draft',
        currentApplicationId,
        externalData,
      )

      // act and arrange
      expect(hasActiveDraftApplication(application.externalData)).toEqual(false)
    })

    it('should return true if there is more than one draft in application list', () => {
      // assert
      const currentApplicationId = faker.datatype.uuid()

      const clock = jest.useFakeTimers('modern')
      clock.setSystemTime(new Date('2020-06-14T12:00-00:00').getTime())

      const otherApplications = {
        data: [
          createApplication('draft', currentApplicationId),
          createApplication('draft'),
          createApplication('inReview'),
          createApplication('inReview'),
        ],
        status: 'success',
        date: new Date(),
      }

      const externalData = {
        applications: otherApplications,
      }

      // act
      const application = createApplication(
        'draft',
        currentApplicationId,
        externalData,
      )

      const hasActiveDraft = hasActiveDraftApplication(application.externalData)
      const drafts = getDraftApplications(
        application.externalData?.applications?.data as Applications[],
      )
      const oldestDraftId = getOldestDraftApplicationId(
        application.externalData?.applications?.data as Applications[],
      )

      // arrange
      // Check so that we get true
      expect(hasActiveDraft).toEqual(true)

      // Check so that the oldest is not the current active.
      expect(currentApplicationId).not.toBe(oldestDraftId)

      // Check that we dont use any applications that are not drafts.
      expect(drafts).toEqual(
        expect.arrayContaining([
          expect.not.objectContaining({
            state: 'inReview',
          }),
          expect.objectContaining({
            state: 'draft',
          }),
        ]),
      )
    })

    it('should return false if oldest draft is current application', () => {
      // assert
      const currentApplicationId = faker.datatype.uuid()

      const windowSpy = jest.spyOn(window, 'window', 'get')

      windowSpy.mockImplementation(
        () =>
          ({
            location: {
              pathname: `/umsoknir/sjukratryggingar/${currentApplicationId}`,
            },
          } as any),
      )

      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)

      const otherApplications = {
        data: [
          createApplication(
            'draft',
            currentApplicationId,
            faker.datatype.uuid(),
            yesterday,
          ),
          createApplication('draft'),
          createApplication('inReview'),
          createApplication('inReview'),
        ],
        status: 'success',
        date: new Date(),
      }

      const externalData = {
        applications: otherApplications,
      }

      // act
      const application = createApplication(
        'draft',
        currentApplicationId,
        externalData,
      )

      const hasActiveDraft = hasActiveDraftApplication(application.externalData)

      const oldestDraftId = getOldestDraftApplicationId(
        application?.externalData?.applications?.data as Applications[],
      )

      // arrange
      expect(hasActiveDraft).toEqual(false)
      expect(currentApplicationId).toBe(oldestDraftId)

      windowSpy.mockRestore()
    })
  })
  describe('Getting oldest draft application id', () => {
    it('should return application that was created first', () => {
      // assert
      const expectedApplicationId = faker.datatype.uuid()

      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)

      const lastYear = new Date()
      lastYear.setDate(lastYear.getDate() - 365)

      const applications = [
        createApplication('draft', expectedApplicationId, undefined, lastYear),
        createApplication('draft', faker.datatype.uuid(), undefined, yesterday),
        createApplication('draft'),
        createApplication(
          'inReview',
          faker.datatype.uuid(),
          undefined,
          lastYear,
        ),
        createApplication('inReview'),
      ]

      // act
      const actualApplicationId = getOldestDraftApplicationId(
        (applications as unknown) as Applications[],
      )

      // assert
      expect(expectedApplicationId).toBe(actualApplicationId)
    })
  })
})
