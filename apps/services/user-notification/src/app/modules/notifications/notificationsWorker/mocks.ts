import { UserProfileDto } from '@island.is/clients/user-profile'
import { createNationalId } from '@island.is/testing/fixtures'
import { DelegationRecordDTO } from '@island.is/clients/auth/delegation-api'
import { Features } from '@island.is/feature-flags'
import type { User } from '@island.is/auth-nest-tools'
import { HnippTemplate } from '../dto/hnippTemplate.response'

export const mockFullName = 'mockFullName'

export const userWithDelegations: UserProfileDto = {
  nationalId: createNationalId('person'),
  mobilePhoneNumber: '1234567',
  email: 'email@email.com',
  emailVerified: true,
  mobilePhoneNumberVerified: true,
  documentNotifications: true,
  emailNotifications: true,
}

export const userWitNoDelegations: UserProfileDto = {
  nationalId: createNationalId('person'),
  mobilePhoneNumber: '1234567',
  email: 'email1@email.com',
  emailVerified: true,
  mobilePhoneNumberVerified: true,
  documentNotifications: true,
  emailNotifications: true,
}

export const userWithEmailNotificationsDisabled: UserProfileDto = {
  nationalId: createNationalId('person'),
  mobilePhoneNumber: '1234567',
  emailVerified: true,
  mobilePhoneNumberVerified: true,
  documentNotifications: true,
  emailNotifications: false,
}

export const userWithDocumentNotificationsDisabled: UserProfileDto = {
  nationalId: createNationalId('person'),
  mobilePhoneNumber: '1234567',
  email: 'email2@email.com',
  emailVerified: true,
  mobilePhoneNumberVerified: true,
  documentNotifications: false,
  emailNotifications: true,
}

export const userWithFeatureFlagDisabled: UserProfileDto = {
  nationalId: createNationalId('person'),
  mobilePhoneNumber: '1234567',
  email: 'email3@email.com',
  emailVerified: true,
  mobilePhoneNumberVerified: true,
  documentNotifications: true,
  emailNotifications: true,
}

export const mockHnippTemplate: HnippTemplate = {
  templateId: 'HNIPP.DEMO.ID',
  notificationTitle: 'Demo title ',
  notificationBody: 'Demo body {{arg1}}',
  notificationDataCopy: 'Demo data copy',
  clickAction: 'Demo click action {{arg2}}',
  category: 'Demo category',
  args: ['arg1', 'arg2'],
}

const userProfiles = [
  userWithDelegations,
  userWitNoDelegations,
  userWithEmailNotificationsDisabled,
  userWithDocumentNotificationsDisabled,
  userWithFeatureFlagDisabled,
]

const delegations: Record<string, DelegationRecordDTO[]> = {
  [userWithDelegations.nationalId]: [
    {
      fromNationalId: userWithDelegations.nationalId,
      toNationalId: userWitNoDelegations.nationalId,
    },
  ],
}

export class MockDelegationsService {
  delegationsControllerGetDelegationRecords({
    xQueryFromNationalId,
  }: {
    xQueryFromNationalId: string
  }) {
    return { data: delegations[xQueryFromNationalId] ?? [] }
  }
}

export class MockV2UsersApi {
  userProfileControllerFindUserProfile({
    xParamNationalId,
  }: {
    xParamNationalId: string
  }) {
    return Promise.resolve(
      userProfiles.find(
        (u) => u.nationalId === xParamNationalId,
      ) as UserProfileDto,
    )
  }
}

export class MockFeatureFlagService {
  getValue(_feature: Features, _defaultValue: boolean | string, user?: User) {
    return user?.nationalId !== userWithFeatureFlagDisabled.nationalId
  }
}

export class MockNationalRegistryV3ClientService {
  getName() {
    return {
      fulltNafn: mockFullName,
    }
  }
}
