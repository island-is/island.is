import { useMemo } from 'react'
import { useMutation } from '@apollo/client'

import {
  CreateApplicationQuery,
  CreateApplicationEventQuery,
} from '@island.is/financial-aid-web/osk/graphql/sharedGql'

import { User, ApplicationState } from '@island.is/financial-aid/shared'
import { Form } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'
import { UploadFile } from '@island.is/island-ui/core'

const useApplication = () => {
  const [
    createApplicationMutation,
    { loading: isCreatingApplication },
  ] = useMutation(CreateApplicationQuery)

  const createApplication = useMemo(
    () => async (
      form: Form,
      user: User,
      allFiles: UploadFile[],
    ): Promise<string | undefined> => {
      if (isCreatingApplication === false) {
        const formatAllFiles = allFiles.map((f) => {
          return {
            name: f.name ?? '',
            key: f.key ?? '',
            size: f.size ?? 0,
          }
        })

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
              files: formatAllFiles,
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
