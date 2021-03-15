import { NationalRegistryUser } from '@island.is/api/schema'
import { PersonResidenceChange, UserInfo, CRCApplication } from '../types'

export const extractApplicantFromApplication = (
  application: CRCApplication,
) => {
  return (application.externalData.nationalRegistry?.data as {
    parent?: unknown
  }) as NationalRegistryUser
}

// TODO: remove all these helpers when we implement the new way of mocking data
type ValidKeys =
  | 'nationalRegistry'
  | 'childrenNationalRegistry'
  | 'parentNationalRegistry'
  | 'userProfile'

const dataToUse = (
  { answers, externalData }: CRCApplication,
  key: ValidKeys,
) => {
  const mockData = answers.mockData?.[key]?.data
  const data = externalData[key]?.data
  if (answers.useMocks === 'no') {
    return data
  }
  return mockData || data
}

export const extractParentFromApplication = (application: CRCApplication) => {
  return dataToUse(
    application,
    'parentNationalRegistry',
  ) as PersonResidenceChange
}

export const extractUserInfoFromApplication = (application: CRCApplication) => {
  return dataToUse(application, 'userProfile') as UserInfo
}

export const extractChildrenFromApplication = (application: CRCApplication) => {
  const data = dataToUse(application, 'childrenNationalRegistry')
  return (data as unknown) as PersonResidenceChange[]
}
// END TODO

export const constructParentAddressString = (parent: PersonResidenceChange) => {
  if (!parent) {
    return null
  }
  return `${parent?.address}, ${parent?.postalCode} ${parent?.city}`
}
