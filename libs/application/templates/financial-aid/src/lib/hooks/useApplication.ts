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
  mutation createMunicipalitiesApplication(
    $input: CreateMunicipalitiesApplicationInput!
  ) {
    createMunicipalitiesApplication(input: $input) {
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
    if (!files) {
      return []
    }
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

      if (isCreatingApplication === false) {
        const files = formatFiles(
          answers.taxReturnFiles,
          FileType.TAXRETURN,
        ).concat(formatFiles(answers.incomeFiles, FileType.INCOME))

        const { data } = await createApplicationMutation({
          variables: {
            input: {
              name: externalData.nationalRegistry.data.applicant.fullName,
              phoneNumber: answers.contactInfo.phone,
              email: answers.contactInfo.email,
              homeCircumstances: answers.homeCircumstances.type,
              homeCircumstancesCustom: answers.homeCircumstances.custom,
              student: Boolean(
                answers.student.isStudent === ApproveOptions.Yes,
              ),
              studentCustom: answers.student.custom,
              hasIncome: Boolean(answers.income === ApproveOptions.Yes),
              usePersonalTaxCredit: Boolean(
                answers.personalTaxCredit === ApproveOptions.Yes,
              ),
              bankNumber: answers.bankInfo.bankNumber,
              ledger: answers.bankInfo.ledger,
              accountNumber: answers.bankInfo.accountNumber,
              employment: answers.employment.type,
              employmentCustom: answers.employment.custom,
              formComment: answers.formComment,
              state: ApplicationState.NEW,
              files: files,
              spouseNationalId:
                externalData.nationalRegistry.data.applicant.spouse
                  ?.nationalId || answers.relationshipStatus?.spouseNationalId,
              spouseEmail:
                answers.spouse?.email ||
                answers.relationshipStatus?.spouseEmail,
              spouseName:
                externalData.nationalRegistry.data.applicant.spouse?.name,
              // TODO not hardcoded
              familyStatus: FamilyStatus.NOT_COHABITATION,
              streetName:
                externalData.nationalRegistry.data.applicant.address.streetName,
              postalCode:
                externalData.nationalRegistry.data.applicant.address.postalCode,
              city: externalData.nationalRegistry.data.applicant.address.city,
              municipalityCode:
                externalData.nationalRegistry.data.applicant.address
                  .municipalityCode,
              directTaxPayments: [],
              applicationSystemId: id,
            },
          },
        })

        if (data) {
          return data.createMunicipalitiesApplication.id
        }
      }
    },
    [createApplicationMutation],
  )
  return { createApplication }
}

export default useApplication
