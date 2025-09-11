import {
  ApplicantTypesEnum,
  IndividualApplicant,
} from '@island.is/form-system/ui'
import { useQuery } from '@apollo/client'
import { FormSystemField } from '@island.is/api/schema'
import { USER_PROFILE } from '@island.is/portals/my-pages/graphql'
import { useUserInfo } from '@island.is/react-spa/bff'
import { useApplicationContext } from '../../../../context/ApplicationProvider'

interface Props {
  applicantField: FormSystemField
}

export const Applicants = ({ applicantField }: Props) => {
  const { data } = useQuery(USER_PROFILE, {
    fetchPolicy: 'cache-first',
  })
  const userInfo = useUserInfo()
  const { dispatch } = useApplicationContext()
  const { applicantType } = applicantField.fieldSettings ?? {}
  return (
    <>
      {applicantType === ApplicantTypesEnum.INDIVIDUAL && (
        <IndividualApplicant
          applicant={applicantField}
          user={data?.getUserProfile}
          actor={userInfo?.profile?.nationalId ?? ''}
          dispatch={dispatch}
        />
      )}
      {applicantType ===
        ApplicantTypesEnum.INDIVIDUAL_WITH_DELEGATION_FROM_INDIVIDUAL ||
        (applicantType ===
          ApplicantTypesEnum.INDIVIDUAL_WITH_DELEGATION_FROM_LEGAL_ENTITY && (
          // Display agent
          // eslint-disable-next-line react/jsx-no-useless-fragment
          <></>
        ))}
      {applicantType === ApplicantTypesEnum.LEGAL_ENTITY && (
        // Display legal entity
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <></>
      )}
    </>
  )
}
