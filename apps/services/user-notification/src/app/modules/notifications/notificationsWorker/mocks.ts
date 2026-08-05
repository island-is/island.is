import faker from 'faker'
import { generatePerson } from 'kennitala'

import {
  AuthDelegationType,
  DelegationRecordDTO,
} from '@island.is/clients/auth/delegation-api'
import { UserProfileDto } from '@island.is/clients/user-profile'
import { Features } from '@island.is/feature-flags'
import { createNationalId } from '@island.is/testing/fixtures'

import { UserNotificationsConfig } from '../../../../config'
import { HnippTemplate } from '../dto/hnippTemplate.response'
import { DECEASED_STATUS, INACTIVE_COMPANY_STATUS } from './helpers'

import type { User } from '@island.is/auth-nest-tools'
import type { ConfigType } from '@island.is/nest/config'

export const mockFullName = 'mockFullName'
export const mockBirtNafn = 'mockBirtNafn'
export const delegationSubjectId = 'delegation-subject-id'

interface MockUserProfileDto extends UserProfileDto {
  name: string
}

export const userWithDelegations: MockUserProfileDto = {
  name: 'userWithDelegations',
  nationalId: createNationalId('person'),
  mobilePhoneNumber: '1234567',
  email: 'email@email.com',
  emailVerified: true,
  mobilePhoneNumberVerified: true,
  documentNotifications: true,
  emailNotifications: true,
  isRestricted: false,
  smsNotifications: true,
}

export const userWithDelegations2: MockUserProfileDto = {
  name: 'userWithDelegations2',
  nationalId: createNationalId('person'),
  mobilePhoneNumber: '1234567',
  email: 'email5@email.com',
  emailVerified: true,
  mobilePhoneNumberVerified: true,
  documentNotifications: true,
  emailNotifications: true,
  isRestricted: false,
  smsNotifications: true,
}

export const userWithNoDelegations: MockUserProfileDto = {
  name: 'userWithNoDelegations',
  nationalId: createNationalId('person'),
  mobilePhoneNumber: '1234567',
  email: 'email1@email.com',
  emailVerified: true,
  mobilePhoneNumberVerified: true,
  documentNotifications: true,
  emailNotifications: true,
  isRestricted: false,
  smsNotifications: true,
}

export const userWithNoEmail: MockUserProfileDto = {
  name: 'userWithNoEmail',
  nationalId: createNationalId('person'),
  mobilePhoneNumber: '1234567',
  emailVerified: false,
  mobilePhoneNumberVerified: true,
  documentNotifications: true,
  emailNotifications: true,
  isRestricted: false,
  smsNotifications: true,
}

export const userWithEmailNotificationsDisabled: MockUserProfileDto = {
  name: 'userWithEmailNotificationsDisabled',
  nationalId: createNationalId('person'),
  mobilePhoneNumber: '1234567',
  emailVerified: true,
  mobilePhoneNumberVerified: true,
  documentNotifications: true,
  emailNotifications: false,
  isRestricted: false,
  smsNotifications: true,
}

export const userWithDocumentNotificationsDisabled: MockUserProfileDto = {
  name: 'userWithDocumentNotificationsDisabled',
  nationalId: createNationalId('person'),
  mobilePhoneNumber: '1234567',
  email: 'email2@email.com',
  emailVerified: true,
  mobilePhoneNumberVerified: true,
  documentNotifications: false,
  emailNotifications: true,
  isRestricted: false,
  smsNotifications: true,
}

export const userWithFeatureFlagDisabled: MockUserProfileDto = {
  name: 'userWithFeatureFlagDisabled',
  nationalId: createNationalId('person'),
  mobilePhoneNumber: '1234567',
  email: 'email3@email.com',
  emailVerified: true,
  mobilePhoneNumberVerified: true,
  documentNotifications: true,
  emailNotifications: true,
  isRestricted: false,
  smsNotifications: true,
}

export const userWithSendToDelegationsFeatureFlagDisabled: MockUserProfileDto =
  {
    name: 'userWithSendToDelegationsFeatureFlagDisabled',
    nationalId: createNationalId('person'),
    mobilePhoneNumber: '1234567',
    email: 'email4@email.com',
    emailVerified: true,
    mobilePhoneNumberVerified: true,
    documentNotifications: true,
    emailNotifications: true,
    isRestricted: false,
    smsNotifications: true,
  }

export const inactiveCompanyUser: MockUserProfileDto = {
  name: 'inactiveCompanyUser',
  nationalId: createNationalId('company'),
  mobilePhoneNumber: '1234567',
  email: 'email@inactivecompany.com',
  emailVerified: true,
  mobilePhoneNumberVerified: true,
  documentNotifications: true,
  emailNotifications: true,
  isRestricted: false,
  smsNotifications: true,
}

export const inactiveCompanyStatus = INACTIVE_COMPANY_STATUS

export const companyUser: MockUserProfileDto = {
  name: 'companyUser',
  nationalId: createNationalId('company'),
  mobilePhoneNumber: '1234567',
  email: 'email@company.com',
  emailVerified: true,
  mobilePhoneNumberVerified: true,
  documentNotifications: true,
  emailNotifications: true,
  isRestricted: false,
  smsNotifications: true,
}

export const deceasedUser: MockUserProfileDto = {
  name: 'deceasedUser',
  nationalId: createNationalId('person'),
  mobilePhoneNumber: '1234567',
  email: 'deceased@email.com',
  emailVerified: true,
  mobilePhoneNumberVerified: true,
  documentNotifications: true,
  emailNotifications: true,
  isRestricted: false,
  smsNotifications: true,
}

// Children with controlled ages for the health-notification / legal-guardian flow.
export const childUnder16: MockUserProfileDto = {
  name: 'childUnder16',
  nationalId: generatePerson(new Date(2015, 0, 1)) as string,
  mobilePhoneNumber: '1234567',
  email: 'childunder16@email.com',
  emailVerified: true,
  mobilePhoneNumberVerified: true,
  documentNotifications: true,
  emailNotifications: true,
  isRestricted: false,
  smsNotifications: false,
}

export const childOver16: MockUserProfileDto = {
  name: 'childOver16',
  nationalId: generatePerson(new Date(2005, 0, 1)) as string,
  mobilePhoneNumber: '1234567',
  email: 'childover16@email.com',
  emailVerified: true,
  mobilePhoneNumberVerified: true,
  documentNotifications: true,
  emailNotifications: true,
  isRestricted: false,
  smsNotifications: false,
}

// Legal guardians who have NOT opted in to SMS (smsNotifications: false) but have a
// phone number — they must still receive the forced SMS for a child under 16.
export const legalGuardianOne: MockUserProfileDto = {
  name: 'legalGuardianOne',
  nationalId: createNationalId('person'),
  mobilePhoneNumber: '1111111',
  email: 'guardianone@email.com',
  emailVerified: true,
  mobilePhoneNumberVerified: true,
  documentNotifications: true,
  emailNotifications: true,
  isRestricted: false,
  smsNotifications: false,
}

export const legalGuardianTwo: MockUserProfileDto = {
  name: 'legalGuardianTwo',
  nationalId: createNationalId('person'),
  mobilePhoneNumber: '2222222',
  email: 'guardiantwo@email.com',
  emailVerified: true,
  mobilePhoneNumberVerified: true,
  documentNotifications: true,
  emailNotifications: true,
  isRestricted: false,
  smsNotifications: false,
}

export const mockTemplateId = 'HNIPP.DEMO.ID'

export const getMockHnippTemplate = ({
  templateId = mockTemplateId,
  title = 'Demo title ',
  externalBody = 'Demo body {{arg1}}',
  internalBody = 'Demo data copy',
  clickActionUrl = 'https://island.is/minarsidur/postholf',
  args = ['arg1', 'arg2'],
  scope = '@island.is/documents',
  smsPayer = 'Landlæknir',
  smsDelivery = 'OPT_IN',
}: Partial<HnippTemplate>): HnippTemplate => ({
  templateId,
  title,
  externalBody,
  internalBody,
  clickActionUrl,
  args,
  scope,
  smsPayer,
  smsDelivery,
})

export const userProfiles = [
  userWithDelegations,
  userWithDelegations2,
  userWithNoDelegations,
  userWithEmailNotificationsDisabled,
  userWithDocumentNotificationsDisabled,
  userWithFeatureFlagDisabled,
  userWithSendToDelegationsFeatureFlagDisabled,
  userWithNoEmail,
  companyUser,
  inactiveCompanyUser,
  deceasedUser,
  childUnder16,
  childOver16,
  legalGuardianOne,
  legalGuardianTwo,
]

// Delegations keyed by nationalId and scope
// Format: `${nationalId}:${scope}` -> DelegationRecordDTO[]
const delegationsByScope: Record<string, DelegationRecordDTO[]> = {
  // A child under 16 with two legal guardians (both must get the forced SMS).
  [`${childUnder16.nationalId}:@island.is/health`]: [
    {
      fromNationalId: childUnder16.nationalId,
      toNationalId: legalGuardianOne.nationalId,
      subjectId: null,
      type: AuthDelegationType.LegalGuardianMinor,
      customDelegationScopes: null,
    },
    {
      fromNationalId: childUnder16.nationalId,
      toNationalId: legalGuardianTwo.nationalId,
      subjectId: null,
      type: AuthDelegationType.LegalGuardianMinor,
      customDelegationScopes: null,
    },
  ],
  // A child 16 or older — the index emits a plain LegalGuardian (not Minor), so
  // no forced SMS.
  [`${childOver16.nationalId}:@island.is/health`]: [
    {
      fromNationalId: childOver16.nationalId,
      toNationalId: legalGuardianOne.nationalId,
      subjectId: null,
      type: AuthDelegationType.LegalGuardian,
      customDelegationScopes: null,
    },
  ],
  // A child under 16 but with a non-guardian delegation — no forced SMS.
  [`${childUnder16.nationalId}:@island.is/documents`]: [
    {
      fromNationalId: childUnder16.nationalId,
      toNationalId: legalGuardianOne.nationalId,
      subjectId: null,
      type: AuthDelegationType.Custom,
      customDelegationScopes: null,
    },
  ],
  [`${userWithDelegations.nationalId}:@island.is/documents`]: [
    {
      fromNationalId: userWithDelegations.nationalId,
      toNationalId: userWithNoDelegations.nationalId,
      subjectId: null, // test that 3rd party login is not used if subjectId is null
      type: AuthDelegationType.ProcurationHolder,
      customDelegationScopes: null,
    },
  ],
  [`${userWithDelegations.nationalId}:@island.is/applications/samgongustofa-vehicles`]:
    [
      {
        fromNationalId: userWithDelegations.nationalId,
        toNationalId: userWithNoDelegations.nationalId,
        subjectId: null, // test that 3rd party login is not used if subjectId is null
        type: AuthDelegationType.Custom,
        customDelegationScopes: [
          '@island.is/applications/samgongustofa-vehicles',
        ],
      },
    ],
  // Fallback for backward compatibility - delegations without scope filtering
  [userWithDelegations.nationalId]: [
    {
      fromNationalId: userWithDelegations.nationalId,
      toNationalId: userWithNoDelegations.nationalId,
      subjectId: null,
      type: AuthDelegationType.ProcurationHolder,
      customDelegationScopes: null,
    },
  ],
  [userWithDelegations2.nationalId]: [
    {
      fromNationalId: userWithDelegations2.nationalId,
      toNationalId: userWithDelegations.nationalId,
      subjectId: delegationSubjectId,
      type: AuthDelegationType.ProcurationHolder,
      customDelegationScopes: null,
    },
  ],
  [userWithSendToDelegationsFeatureFlagDisabled.nationalId]: [
    {
      fromNationalId: userWithSendToDelegationsFeatureFlagDisabled.nationalId,
      toNationalId: userWithNoDelegations.nationalId,
      subjectId: faker.datatype.uuid(),
      type: AuthDelegationType.ProcurationHolder,
      customDelegationScopes: null,
    },
  ],
}

export class MockDelegationsService {
  delegationsControllerGetDelegationRecords({
    xQueryNationalId,
    scopes,
  }: {
    xQueryNationalId: string
    scopes?: string | string[]
  }) {
    // If scope is provided, try to get scope-specific delegations first
    if (scopes) {
      const scopeArray = Array.isArray(scopes) ? scopes : scopes.split(',')
      // Try each scope in order, return first match
      for (const scope of scopeArray) {
        const scopeKey = `${xQueryNationalId}:${scope}`
        if (delegationsByScope[scopeKey]) {
          return {
            data: delegationsByScope[scopeKey],
            totalCount: delegationsByScope[scopeKey].length,
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: false,
              startCursor: '',
              endCursor: '',
            },
          }
        }
      }
    }
    // Fallback to delegations without scope filtering
    return {
      data: delegationsByScope[xQueryNationalId] ?? [],
      totalCount: delegationsByScope[xQueryNationalId]?.length ?? 0,
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: '',
        endCursor: '',
      },
    }
  }
}

export class MockFeatureFlagService {
  getValue(feature: Features, _defaultValue: boolean | string, user?: User) {
    if (feature === Features.isNotificationEmailWorkerEnabled) {
      return user?.nationalId !== userWithFeatureFlagDisabled.nationalId
    }

    if (feature === Features.shouldSendEmailNotificationsToDelegations) {
      return (
        user?.nationalId !==
        userWithSendToDelegationsFeatureFlagDisabled.nationalId
      )
    }

    if (
      feature === Features.shouldSendEmailNotificationsToCompanyUserProfiles
    ) {
      return true
    }

    return true
  }
}

export class MockNationalRegistryV3ClientService {
  getName(nationalId: string) {
    const user = userProfiles.find((u) => u.nationalId === nationalId)

    return {
      fulltNafn: user?.name ?? mockFullName,
      birtNafn: user?.name ?? mockBirtNafn,
    }
  }

  getAllDataIndividual(nationalId: string) {
    if (nationalId === deceasedUser.nationalId) {
      return Promise.resolve({ afdrif: DECEASED_STATUS })
    }
    return Promise.resolve(null)
  }
}

export const MockUserNotificationsConfig: ConfigType<
  typeof UserNotificationsConfig
> = {
  isWorker: true,
  firebaseCredentials: 'firebase-credentials',
  contentfulAccessToken: 'contentful-access-token',
  emailFromAddress: 'development@island.is',
  isConfigured: true,
  servicePortalClickActionUrl: 'https://island.is/minarsidur',
  servicePortalBffLoginUrl: 'https://island.is/bff/login',
  redis: {
    nodes: ['node'],
    ssl: false,
  },
}
