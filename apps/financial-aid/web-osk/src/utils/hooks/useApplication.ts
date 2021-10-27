import { useContext, useMemo } from 'react'
import { useMutation } from '@apollo/client'

import { CreateApplicationMutation } from '@island.is/financial-aid-web/osk/graphql/sharedGql'

import {
  User,
  ApplicationState,
  FileType,
} from '@island.is/financial-aid/shared/lib'
import { Form } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'
import { UploadFile } from '@island.is/island-ui/core'
import { AppContext } from '../../components/AppProvider/AppProvider'

const useApplication = () => {
  const [
    createApplicationMutation,
    { loading: isCreatingApplication },
  ] = useMutation(CreateApplicationMutation)

  const { nationalRegistryData } = useContext(AppContext)

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
    () => async (
      form: Form,
      user: User,
      updateForm?: any,
    ): Promise<string | undefined> => {
      if (isCreatingApplication === false) {
        const files = formatFiles(form.taxReturnFiles, FileType.TAXRETURN)
          .concat(formatFiles(form.incomeFiles, FileType.INCOME))
          .concat(formatFiles(form.otherFiles, FileType.OTHER))

        const { data } = await createApplicationMutation({
          variables: {
            input: {
              nationalId: user?.nationalId,
              name: user?.name,
              phoneNumber: form?.phoneNumber,
              email: form?.emailAddress,
              homeCircumstances: form?.homeCircumstances,
              homeCircumstancesCustom: form?.homeCircumstancesCustom,
              student: Boolean(form?.student),
              studentCustom: form?.studentCustom,
              hasIncome: Boolean(form?.hasIncome),
              usePersonalTaxCredit: Boolean(form?.usePersonalTaxCredit),
              bankNumber: form?.bankNumber,
              ledger: form?.ledger,
              accountNumber: form?.accountNumber,
              interview: Boolean(form?.interview),
              employment: form?.employment,
              employmentCustom: form?.employmentCustom,
              formComment: form?.formComment,
              state: ApplicationState.NEW,
              files: files,
              spouseNationalId:
                nationalRegistryData?.spouse.nationalId ??
                form?.spouse?.nationalId,
              spouseEmail: form?.spouse?.email,
              familyStatus: form?.familyStatus,
              streetName: nationalRegistryData?.address.streetName,
              postalCode: nationalRegistryData?.address.postalCode,
              city: nationalRegistryData?.address.city,
              municipalityCode: nationalRegistryData?.address.municipalityCode,
            },
          },
        })

        if (data) {
          updateForm({ ...form, applicationId: data.createApplication.id })
          return data
        }
      }
    },
    [createApplicationMutation, isCreatingApplication],
  )

  return {
    createApplication,
    isCreatingApplication,
  }
}

export default useApplication
