import { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { useFormContext } from 'react-hook-form'
import { Routes } from '../../lib/constants'
import { useMutation } from '@apollo/client'
import { useLocale } from '@island.is/localization'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import { updateAnswers } from '../../utils'

export const ClearAnswers: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
  setBeforeSubmitCallback,
}) => {
  const { locale } = useLocale()
  const { setValue, getValues } = useFormContext()
  const [updateApplication] = useMutation(UPDATE_APPLICATION)

  setBeforeSubmitCallback &&
    setBeforeSubmitCallback(async () => {
      const chosenApplicants = getValues(Routes.CHOSENAPPLICANTS)
      const newAnswers = updateAnswers(application, chosenApplicants, setValue)
      try {
        await updateApplication({
          variables: {
            input: {
              id: application.id,
              answers: newAnswers,
            },
            locale,
          },
        })
      } catch (e) {
        return [false, 'error occured']
      }
      return [true, null]
    })

  return null
}
