import { FormSystemApplicant } from '@island.is/api/schema'
import {
  Agent,
  ApplicantTypesEnum,
  IndividualApplicant,
  LegalEntity,
} from '@island.is/form-system/ui'
import { useQuery } from '@apollo/client'
import { useLocale } from '@island.is/localization'
import { GET_NAME_BY_NATIONALID } from '@island.is/form-system/graphql'
import { GET_ADDRESS_BY_NATIONALID } from '@island.is/form-system/graphql'

interface Props {
  applicantTypes: FormSystemApplicant[]
}

export const Applicants = ({ applicantTypes }: Props) => {
  const { lang } = useLocale()
  const id = '0101302399'
  const { data } = useQuery(GET_NAME_BY_NATIONALID, {
    variables: { input: id },
    skip: !id,
    fetchPolicy: 'cache-first',
  })

  const { data: addressData } = useQuery(GET_ADDRESS_BY_NATIONALID, {
    variables: { input: id },
    skip: !id,
    fetchPolicy: 'cache-first',
  })

  const agentType =
    ApplicantTypesEnum.INDIVIDUAL_WITH_DELEGATION_FROM_INDIVIDUAL ||
    ApplicantTypesEnum.INDIVIDUAL_WITH_DELEGATION_FROM_LEGAL_ENTITY
  return (
    <>
      {applicantTypes.map((applicantType) => {
        if (applicantType.applicantTypeId === ApplicantTypesEnum.INDIVIDUAL) {
          return (
            <IndividualApplicant
              applicantType={applicantType}
              lang={lang}
              key={applicantType.id}
              nationalId={id || ''}
              name={data?.formSystemNameByNationalId?.fulltNafn || ''}
              address={
                addressData?.formSystemHomeByNationalId?.heimilisfang
                  ?.husHeiti || ''
              }
              postalCode={
                addressData?.formSystemHomeByNationalId?.heimilisfang
                  ?.postnumer || ''
              }
            />
          )
        } else if (applicantType.applicantTypeId === agentType) {
          return (
            <Agent
              applicantType={applicantType}
              lang={lang}
              key={applicantType.id}
            />
          )
        } else if (
          applicantType.applicantTypeId === ApplicantTypesEnum.LEGAL_ENTITY
        ) {
          return (
            <LegalEntity
              applicantType={applicantType}
              lang={lang}
              key={applicantType.id}
            />
          )
        }
        return null
      })}
    </>
  )
}
