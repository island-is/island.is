import { ApplicantTypesEnum } from '@island.is/form-system/enums'

export const applicantTypeGroups = {
  individual: [ApplicantTypesEnum.INDIVIDUAL],
  individualDelegation: [
    ApplicantTypesEnum.INDIVIDUAL_WITH_DELEGATION_FROM_INDIVIDUAL,
    ApplicantTypesEnum.INDIVIDUAL_GIVING_DELEGATION,
  ],
  legalEntityDelegation: [
    ApplicantTypesEnum.INDIVIDUAL_WITH_DELEGATION_FROM_LEGAL_ENTITY,
    ApplicantTypesEnum.LEGAL_ENTITY,
  ],
  procuration: [
    ApplicantTypesEnum.INDIVIDUAL_WITH_PROCURATION,
    ApplicantTypesEnum.LEGAL_ENTITY_OF_PROCURATION_HOLDER,
  ],
}
