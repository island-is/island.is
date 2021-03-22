import { Application, ApplicationTypes } from '@island.is/application/core'
import { faker } from '@island.is/shared/mocking'
import { Applications } from './dataProviders/APIDataTypes'
import {
  getOldestDraftApplicationId,
  hasActiveDraftApplication,
  getDraftApplications,
} from './healthInsuranceUtils'

describe('health insurance utils', () => {
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
    answers?: object,
    typeId?: string,
    externalData?: any,
    applicationState = 'draft',
    id = faker.random.uuid(),
  ) =>
    (({
      id: id,
      state: applicationState,
      applicant: applicant.nationalId,
      assignees: [],
      typeId: typeId ?? ApplicationTypes.HEALTH_INSURANCE,
      modified: new Date(),
      created: new Date(),
      attachments: {},
      answers: answers ?? {},
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

  describe('Filter draft applications', () => {
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

      const application = createApplication(undefined, undefined, externalData)

      // act and arrange
      expect(hasActiveDraftApplication(application.externalData)).toEqual(false)
    })

    it('should return false if there is only one (current) draft in application list', () => {
      // assert
      const currentApplicationId = faker.random.uuid()

      const otherApplications = {
        data: [
          createApplication(
            undefined,
            undefined,
            undefined,
            'draft',
            currentApplicationId,
          ),
          createApplication(undefined, undefined, undefined, 'inReview'),
          createApplication(undefined, undefined, undefined, 'inReview'),
          createApplication(undefined, undefined, undefined, 'inReview'),
        ],
        status: 'success',
        date: new Date(),
      }

      const externalData = {
        applications: otherApplications,
      }

      const application = createApplication(
        undefined,
        undefined,
        externalData,
        currentApplicationId,
      )

      // act and arrange
      expect(hasActiveDraftApplication(application.externalData)).toEqual(false)
    })

    it('should return true if there is more than one drafts in application list and is not active application', () => {
      // assert
      const currentApplicationId = faker.random.uuid()

      const otherApplications = {
        data: [
          createApplication(
            undefined,
            undefined,
            undefined,
            'draft',
            currentApplicationId,
          ),
          createApplication(undefined, undefined, undefined),
          createApplication(undefined, undefined, undefined, 'inReview'),
          createApplication(undefined, undefined, undefined, 'inReview'),
        ],
        status: 'success',
        date: new Date(),
      }

      const externalData = {
        applications: otherApplications,
      }

      // act
      const application = createApplication(
        undefined,
        undefined,
        externalData,
        currentApplicationId,
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

      // check so that the oldest is not the current active.
      expect(currentApplicationId).not.toBe(oldestDraftId)

      // Check that we dont use any applications that are not drafts.
      expect(drafts).toEqual(
        expect.arrayContaining([
          expect.not.objectContaining({
            state: 'inReview',
          }),
        ]),
      )
      expect(drafts).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            state: 'draft',
          }),
        ]),
      )
    })

    // it('should return false if oldest draft is current application', () => {
    // })

    // TODO add test to check that dates are sorted by ascending
  })
})
