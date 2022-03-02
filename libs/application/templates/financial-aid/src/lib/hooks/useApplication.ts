import { useContext, useMemo } from 'react'
import { gql, useMutation } from '@apollo/client'
import { ApproveOptions, FAApplication } from '../types'
import {
  ApplicationState,
  FamilyStatus,
  FileType,
} from '@island.is/financial-aid/shared/lib'
import { UploadFile } from '@island.is/island-ui/core'

export const CreateApplicationMutation = gql`
  mutation createApplication($input: CreateApplicationInput!) {
    createApplication(input: $input) {
      id
    }
  }
`

const useApplication = () => {
  const [
    createApplicationMutation,
    { loading: isCreatingApplication },
  ] = useMutation(CreateApplicationMutation)

  const formatFiles = (files: UploadFile[], type: FileType) => {
    return files.map((f) => {
      return {
        name: f.name ?? '',
        key: f.key ?? '',
        size: f.size ?? 0,
        type: type,
      }
    })
  }

  const createApplication = useMemo(
    () => async (application: FAApplication): Promise<string | undefined> => {
      const { id, answers, externalData } = application
      // const { applicant, municipality } = externalData.nationalRegistry.data

      console.log(answers, 'here er application', answers.contactInfo.email)
      const { data } = await createApplicationMutation({
        variables: {
          input: {
            name: externalData.nationalRegistry.data.applicant.fullName,
            phoneNumber: answers.contactInfo.phone,
            email: answers.contactInfo.email,
            homeCircumstances: answers.homeCircumstances.type,
            homeCircumstancesCustom: answers.homeCircumstances.custom ?? '',
            student: Boolean(answers.student.isStudent === ApproveOptions.Yes),
            studentCustom: answers.student.custom,
            hasIncome: Boolean(answers.income === ApproveOptions.Yes),
            usePersonalTaxCredit: Boolean(
              answers.personalTaxCredit === ApproveOptions.Yes,
            ),
            bankNumber: answers.bankInfo.bankNumber,
            ledger: answers.bankInfo.ledger,
            accountNumber: answers.bankInfo.accountNumber,
            // interview: Boolean(form?.interview),
            employment: answers.employment.type,
            employmentCustom: answers.employment.custom ?? '',
            formComment: answers.formComment,
            state: ApplicationState.NEW,
            files: [],
            // spouseNationalId:
            //   externalData.nationalRegistry.data.applicant.spouse?.nationalId ??
            //   answers.relationshipStatus?.spouseNationalId,
            // spouseEmail:
            //   answers.spouse.email ?? answers.relationshipStatus.spouseEmail,
            // spouseName:
            //   externalData.nationalRegistry.data.applicant.spouse?.name,
            familyStatus: FamilyStatus.COHABITATION,
            streetName:
              externalData.nationalRegistry.data.applicant.address.streetName,
            postalCode:
              externalData.nationalRegistry.data.applicant.address.postalCode,
            city: externalData.nationalRegistry.data.applicant.address.city,
            municipalityCode:
              externalData.nationalRegistry.data.applicant.address
                .municipalityCode,
          },
        },
      })
      console.log(data)

      return
    },
    [],
  )
  return { createApplication }
}

export default useApplication
