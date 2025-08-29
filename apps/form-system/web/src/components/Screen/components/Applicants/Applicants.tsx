import { FormSystemApplicant } from '@island.is/api/schema'
import {
  Agent,
  ApplicantTypesEnum,
  IndividualApplicant,
  LegalEntity,
} from '@island.is/form-system/ui'
import { useQuery } from '@apollo/client'
import { FormSystemField } from '@island.is/api/schema'
import { useLocale } from '@island.is/localization'
import { USER_PROFILE } from '@island.is/portals/my-pages/graphql'
import { useUserInfo } from '@island.is/react-spa/bff'
interface Props {
  applicantFields: FormSystemField[]
}
export const Applicants = ({ applicantTypes }: Props) => {

  export const Applicants = ({ applicantFields }: Props) => {
    const { lang } = useLocale()
    const { data } = useQuery(USER_PROFILE, {
      fetchPolicy: 'cache-first',
    })
    const userInfo = useUserInfo()
    console.log('applicantFields:', applicantFields)
    return (
      <>
        {applicantFields.map((applicantField, index) => {
          return <h4 key={index}>{applicantField.name[lang]}</h4>
        })}
      </>
    )
  }
