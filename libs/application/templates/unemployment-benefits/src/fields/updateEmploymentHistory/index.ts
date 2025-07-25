import { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { useFormContext } from 'react-hook-form'
import { useMutation } from '@apollo/client'
import { useLocale } from '@island.is/localization'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import { getValueViaPath } from '@island.is/application/core'
import { EmploymentHistoryInAnswers } from '../../shared'

export const UpdateEmploymentHistory: FC<FieldBaseProps> = ({
  application,
  setBeforeSubmitCallback,
}) => {
  const { locale } = useLocale()
  const { setValue } = useFormContext()
  const [updateApplication] = useMutation(UPDATE_APPLICATION)

  setBeforeSubmitCallback?.(async (event) => {
    try {
      setValue('employmentHistory.lastJobs', [])
      const employmentHistoryAnswers =
        getValueViaPath<EmploymentHistoryInAnswers>(
          application.answers,
          'employmentHistory',
          undefined,
        )

      //check if the page has answers that are required, just update if the page has been submitted before
      if (employmentHistoryAnswers?.isIndependent) {
        await updateApplication({
          variables: {
            input: {
              id: application.id,
              answers: {
                employmentHistory: {
                  ...employmentHistoryAnswers,
                  lastJobs: [],
                },
              },
            },
            locale,
          },
        })
      }
    } catch (e) {
      return [false, 'error occured']
    }

    return [true, null]
  })

  return null
}
