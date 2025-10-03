import { ApplicationTypeEnum } from './enums'
import { ApplicationType } from './socialInsuranceAdministrationClient.type'

export const mapApplicationEnumToType = (
  applicationType: ApplicationTypeEnum,
): ApplicationType | undefined => {
  switch (applicationType) {
    case ApplicationTypeEnum.DISABILITY_PENSION:
      return 'ORORKA'
    default:
      return undefined
  }
}
