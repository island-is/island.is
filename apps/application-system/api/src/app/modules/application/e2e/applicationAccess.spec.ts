import { ApplicationAccessService } from '../tools/applicationAccess.service'
import { Test } from '@nestjs/testing'
import { ApplicationService } from '@island.is/application/api/core'
import {
  createApplicationTemplate,
  createApplication,
} from '@island.is/testing/fixtures'

const testApplicationTemplate = createApplicationTemplate()

describe('ApplicationAccesService', () => {
  let applicationAccessService: ApplicationAccessService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ApplicationAccessService,
        {
          provide: ApplicationService,
          useValue: {},
        },
      ],
    }).compile()

    applicationAccessService = moduleRef.get<ApplicationAccessService>(
      ApplicationAccessService,
    )
  })

  it('should return true when application is in draft and user is an applicant', async () => {
    const applicationInDraft = createApplication({
      state: 'draft',
      applicant: '111111-3000',
    })
    const results = await applicationAccessService.canDeleteApplication(
      applicationInDraft,
      '111111-3000',
    )
    expect(results).toBe(true)
  })

  it('should return false when application is in inReview and user is an applicant', async () => {
    const applicationInReview = createApplication({
      state: 'inReview',
      applicant: '111111-3000',
    })
    const results = await applicationAccessService.canDeleteApplication(
      applicationInReview,
      '111111-3000',
    )
    expect(results).toBe(false)
  })

  it('should return true when application is in draft and has both shouldBeListedForRole set as true for applicant and undefined for reviewer', async () => {
    const applicationInDraft = createApplication({
      state: 'draft',
      applicant: '111111-3000',
    })

    const results = await applicationAccessService.shouldShowApplicationOnOverview(
      applicationInDraft,
      '111111-3000',
      testApplicationTemplate,
    )
    expect(results).toBe(true)

    const results2 = await applicationAccessService.shouldShowApplicationOnOverview(
      applicationInDraft,
      '111111-3001',
      testApplicationTemplate,
    )
    expect(results2).toBe(true)
  })

  it('should return correct ', async () => {
    const applicationInReview = createApplication({
      state: 'inReview',
      applicant: '111111-3000',
    })
    const results = await applicationAccessService.shouldShowApplicationOnOverview(
      applicationInReview,
      '111111-3001',
      testApplicationTemplate,
    )
    expect(results).toBe(false)

    const results2 = await applicationAccessService.shouldShowApplicationOnOverview(
      applicationInReview,
      '111111-3001',
      testApplicationTemplate,
    )
    expect(results2).toBe(true)
  })

  it('should return true when application is in rejected and should be listed is not defined for the role', async () => {
    const applicationInRejected = createApplication({
      state: 'rejected',
      applicant: '111111-3000',
    })
    const results = await applicationAccessService.shouldShowApplicationOnOverview(
      applicationInRejected,
      '111111-3000',
      testApplicationTemplate,
    )
    expect(results).toBe(true)
  })
})
