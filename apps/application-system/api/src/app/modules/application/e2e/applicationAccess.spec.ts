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

  it('should return true when application is in draft and user is an applicant attempting to delete', async () => {
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

  it('should return false when application is in inReview and user is an applicant attempting to delete', async () => {
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

  // true check for applicant in draft defined as true
  it('should return true when application is in draft and user is applicant, shouldBeListedForRole defined as true for applicant', async () => {
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
  })

  it('should return true when application is in draft and user is reviewer, shouldBeListedForRole is undefined for reviewer', async () => {
    const applicationInDraft = createApplication({
      state: 'draft',
      applicant: '111111-3000',
    })

    const results = await applicationAccessService.shouldShowApplicationOnOverview(
      applicationInDraft,
      '111111-3001',
      testApplicationTemplate,
    )
    expect(results).toBe(true)
  })

  it('should return false when application is in review and user is reviewer, shouldBeListed defined as false', async () => {
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
  })

  it('should return true when application is in review and user is applicant, shouldBeListed defined as true', async () => {
    const applicationInReview = createApplication({
      state: 'inReview',
      applicant: '111111-3000',
    })
    const results = await applicationAccessService.shouldShowApplicationOnOverview(
      applicationInReview,
      '111111-3000',
      testApplicationTemplate,
    )
    expect(results).toBe(true)
  })
})
