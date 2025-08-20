import { FormSystemApplicant } from '@island.is/api/schema'
import {
  Agent,
  ApplicantTypesEnum,
  IndividualApplicant,
  LegalEntity,
} from '@island.is/form-system/ui'
import { useQuery } from '@apollo/client'
import { useLocale } from '@island.is/localization'
import { USER_PROFILE } from '@island.is/portals/my-pages/graphql'
import { useUserInfo } from '@island.is/react-spa/bff'
interface Props {
  applicantTypes: FormSystemApplicant[]
}
export const Applicants = ({ applicantTypes }: Props) => {
  const { lang } = useLocale()
  const { data } = useQuery(USER_PROFILE, {
    fetchPolicy: 'cache-first',
  })
  const user = useUserInfo()

  const nationalId = user?.profile.actor
    ? user.profile.actor.nationalId
    : user?.profile.nationalId
  return (
    <>
      {applicantTypes.map((applicantType) => {
        if (
          applicantType.applicantTypeId ===
          ApplicantTypesEnum.INDIVIDUAL_WITH_DELEGATION_FROM_LEGAL_ENTITY
        ) {
          return (
            <IndividualApplicant
              applicantType={applicantType}
              lang={lang}
              key={applicantType.id}
              user={data?.getUserProfile}
              nationalId={nationalId}
            />
          )
        } else if (
          applicantType.applicantTypeId ===
            ApplicantTypesEnum.INDIVIDUAL_WITH_DELEGATION_FROM_LEGAL_ENTITY ||
          applicantType.applicantTypeId ===
            ApplicantTypesEnum.INDIVIDUAL_WITH_DELEGATION_FROM_LEGAL_ENTITY
        ) {
          return (
            <Agent
              applicantType={applicantType}
              lang={lang}
              key={applicantType.id}
              user={data?.getUserProfile}
              nationalId={user?.profile.nationalId}
            />
          )
        } else if (
          applicantType.applicantTypeId === ApplicantTypesEnum.INDIVIDUAL
        ) {
          return (
            <LegalEntity
              applicantType={applicantType}
              lang={lang}
              key={applicantType.id}
              user={data?.getUserProfile}
            />
          )
        }
        return null
      })}
    </>
  )
}
