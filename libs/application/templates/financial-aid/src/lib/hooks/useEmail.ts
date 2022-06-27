import { useMutation } from '@apollo/client'
import { gql } from '@apollo/client'
import { FAApplication } from '../types'

export const SpouseEmailMutation = gql`
  mutation SendMunicipalitiesFinancialAidSpouseEmail(
    $input: MunicipalitiesFinancialAidSpouseEmailInput!
  ) {
    sendMunicipalitiesFinancialAidSpouseEmail(input: $input) {
      success
    }
  }
`

export const useEmail = (application: FAApplication) => {
  const { id, answers, externalData } = application

  const [spouseEmail] = useMutation<{
    sendMunicipalitiesFinancialAidSpouseEmail: { success: boolean }
  }>(SpouseEmailMutation)

  const sendSpouseEmail = async () => {
    try {
      return Boolean(
        (
          await spouseEmail({
            variables: {
              input: {
                name: externalData.nationalRegistry.data.applicant.fullName,
                email: answers.contactInfo.email,
                spouseName:
                  externalData.nationalRegistry.data.applicant.spouse?.name,
                spouseEmail:
                  answers.spouse?.email ||
                  answers.relationshipStatus?.spouseEmail,
                municipalityCode:
                  externalData.nationalRegistry.data.municipality
                    .municipalityId,
                created: application.created,
                applicationSystemId: id,
              },
            },
          })
        ).data?.sendMunicipalitiesFinancialAidSpouseEmail.success,
      )
    } catch {
      return false
    }
  }

  return {
    sendSpouseEmail,
  }
}
