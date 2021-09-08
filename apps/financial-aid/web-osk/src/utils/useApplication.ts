import { useMemo } from 'react'
import { useMutation } from '@apollo/client'

import { CreateApplicationQuery } from '@island.is/financial-aid-web/osk/graphql/sharedGql'

import {
  User,
  ApplicationState,
  FileType,
} from '@island.is/financial-aid/shared/lib'
import { Form } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'
import { UploadFile } from '@island.is/island-ui/core'

const useApplication = () => {
  const [
    createApplicationMutation,
    { loading: isCreatingApplication },
  ] = useMutation(CreateApplicationQuery)

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
    () => async (form: Form, user: User): Promise<string | undefined> => {
      if (isCreatingApplication === false) {
        const files = formatFiles(form.taxReturnFiles, FileType.TAXRETURN)
          .concat(formatFiles(form.incomeFiles, FileType.INCOME))
          .concat(formatFiles(form.otherFiles, FileType.OTHER))

        const { data } = await createApplicationMutation({
          variables: {
            input: {
              nationalId: user?.nationalId,
              name: user?.name,
              phoneNumber: user?.phoneNumber,
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
            },
          },
        })

        if (data) {
          return data?.id
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
