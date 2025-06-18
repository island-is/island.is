import { FormSystemApplicant } from '@island.is/api/schema'
import {
  Agent,
  ApplicantTypesEnum,
  IndividualApplicant,
  LegalEntity,
} from '@island.is/form-system/ui'
import { useLocale } from '@island.is/localization'

interface Props {
  applicantTypes: FormSystemApplicant[]
}

export const Applicants = ({ applicantTypes }: Props) => {
  const { lang } = useLocale()
  const agentType =
    ApplicantTypesEnum.INDIVIDUAL_WITH_DELEGATION_FROM_INDIVIDUAL ||
    ApplicantTypesEnum.INDIVIDUAL_WITH_DELEGATION_FROM_LEGAL_ENTITY
  return (
    <>
      {applicantTypes.map((applicantType) => {
        if (applicantType.applicantTypeId === ApplicantTypesEnum.INDIVIDUAL) {
          return (
            <IndividualApplicant applicantType={applicantType} lang={lang} key={applicantType.id} />
          )
        } else if (applicantType.applicantTypeId === agentType) {
          return <Agent applicantType={applicantType} lang={lang} key={applicantType.id} />
        } else if (
          applicantType.applicantTypeId === ApplicantTypesEnum.LEGAL_ENTITY
        ) {
          return <LegalEntity applicantType={applicantType} lang={lang} key={applicantType.id} />
        }
        return null
      })}
    </>
  )
}
