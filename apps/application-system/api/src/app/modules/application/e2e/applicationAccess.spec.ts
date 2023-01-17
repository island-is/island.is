import { ApplicationAccessService } from '../tools/applicationAccess.service'
import { Test } from '@nestjs/testing'
import { ApplicationService } from '@island.is/application/api/core'
import {
  createApplicationTemplate,
  createApplication,
} from '@island.is/application/testing'
import * as faker from 'faker'
import type { User } from '@island.is/auth-nest-tools'
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'
import { AllowedDelegation } from '@island.is/application/types'
import { AuthDelegationType } from '@island.is/shared/types'
import { createCurrentUser } from '@island.is/testing/fixtures'

const testApplicationTemplate = createApplicationTemplate()

const createMockUser = (nationalId?: string) => {
  return {
    nationalId: nationalId || '111111-3000',
    scope: [],
    authorization: faker.random.word(),
    client: faker.random.word(),
  }
}

const procurationHolderUser = createCurrentUser({
  delegationType: AuthDelegationType.ProcurationHolder,
})

const legalGuardianUser = createCurrentUser({
  delegationType: AuthDelegationType.LegalGuardian,
})

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
        {
          provide: FeatureFlagService,
          useClass: jest.fn(() => ({
            getValue(
              feature: Features,
              defaultValue: boolean | string,
              user?: User,
            ) {
              if (user?.nationalId === procurationHolderUser.nationalId) {
                if (feature === Features.testing) {
                  return true
                }
              }

              if (user?.nationalId === legalGuardianUser.nationalId) {
                if (feature === Features.testing) {
                  return false
                }
              }

              return defaultValue
            },
          })),
        },
      ],
    }).compile()

    applicationAccessService = moduleRef.get<ApplicationAccessService>(
      ApplicationAccessService,
    )
  })
  it('should show on Overview if delegations and flags are correct', async () => {
    const allowedDelegation: AllowedDelegation = {
      type: AuthDelegationType.ProcurationHolder,
      featureFlag: Features.testing,
    }
    const applicationInDraft = createApplication({
      state: 'draft',
      applicant: procurationHolderUser.nationalId,
    })

    const template = createApplicationTemplate({
      allowedDelegations: [allowedDelegation],
    })

    const results = await applicationAccessService.shouldShowApplicationOnOverview(
      applicationInDraft,
      procurationHolderUser,
      template,
    )

    expect(results).toBe(true)
  })

  it('should return true for correct delegation type and feature flag for isDelegationAllowed ', async () => {
    const allowedDelegation: AllowedDelegation = {
      type: AuthDelegationType.ProcurationHolder,
      featureFlag: Features.testing,
    }
    const results = await applicationAccessService.isDelegatationAllowed(
      allowedDelegation,
      procurationHolderUser,
    )
    expect(results).toBe(true)
  })

  it('should return true with no flag and valid delegation type for isDelegationAllowed', async () => {
    const allowedDelegation: AllowedDelegation = {
      type: AuthDelegationType.LegalGuardian,
    }
    const results = await applicationAccessService.isDelegatationAllowed(
      allowedDelegation,
      legalGuardianUser,
    )
    expect(results).toBe(true)
  })

  it('should return false on false feature flag for isDelegationAllowed', async () => {
    const allowedDelegation: AllowedDelegation = {
      type: AuthDelegationType.LegalGuardian,
      featureFlag: Features.testing,
    }
    const results = await applicationAccessService.isDelegatationAllowed(
      allowedDelegation,
      legalGuardianUser,
    )
    expect(results).toBe(false)
  })

  it('should return false on invalid delegation type for isDelegationAllowed', async () => {
    const allowedDelegation: AllowedDelegation = {
      type: AuthDelegationType.PersonalRepresentative,
      featureFlag: Features.testing,
    }
    const results = await applicationAccessService.isDelegatationAllowed(
      allowedDelegation,
      procurationHolderUser,
    )
    expect(results).toBe(false)
  })

  it('should not show on Overview if delegation is does not match', async () => {
    const allowedDelegation: AllowedDelegation = {
      type: AuthDelegationType.LegalGuardian,
      featureFlag: Features.testing,
    }

    const applicationInDraft = createApplication({
      state: 'draft',
      applicant: procurationHolderUser.nationalId,
    })

    const template = createApplicationTemplate({
      allowedDelegations: [allowedDelegation],
    })

    const results = await applicationAccessService.shouldShowApplicationOnOverview(
      applicationInDraft,
      procurationHolderUser,
      template,
    )

    expect(results).toBe(false)
  })

  it('should not show on Overview if user has delegation and feature flag returns false', async () => {
    const allowedDelegation: AllowedDelegation = {
      type: AuthDelegationType.LegalGuardian,
      featureFlag: Features.testing,
    }

    const applicationInDraft = createApplication({
      state: 'draft',
      applicant: legalGuardianUser.nationalId,
    })

    const template = createApplicationTemplate({
      allowedDelegations: [allowedDelegation],
    })

    const results = await applicationAccessService.shouldShowApplicationOnOverview(
      applicationInDraft,
      procurationHolderUser,
      template,
    )

    expect(results).toBe(false)
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

  it('should return true when application is in draft and user is applicant, shouldBeListedForRole defined as true for applicant', async () => {
    const applicationInDraft = createApplication({
      state: 'draft',
      applicant: '111111-3000',
    })

    const results = await applicationAccessService.shouldShowApplicationOnOverview(
      applicationInDraft,
      createMockUser(),
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
      createMockUser(),
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
      createMockUser('111111-3001'),
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
      createMockUser(),
      testApplicationTemplate,
    )
    expect(results).toBe(true)
  })
})
