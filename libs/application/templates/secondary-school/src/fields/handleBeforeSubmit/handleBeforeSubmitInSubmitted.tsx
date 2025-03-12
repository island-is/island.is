import { FC } from 'react'
import { DefaultEvents, FieldBaseProps } from '@island.is/application/types'
import { useFormContext } from 'react-hook-form'
import { useMutation } from '@apollo/client'
import { useLocale } from '@island.is/localization'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'

export const HandleBeforeSubmitInSubmitted: FC<FieldBaseProps> = ({
  application,
  setBeforeSubmitCallback,
}) => {
  const { locale } = useLocale()
  const { setValue, getValues } = useFormContext()
  const [updateApplication] = useMutation(UPDATE_APPLICATION)

  setBeforeSubmitCallback?.(async (event) => {
    if (event === DefaultEvents.EDIT) {
      try {
        const { copy, ...answers } = getValues()

        setValue('copy', answers)

        await updateApplication({
          variables: {
            input: {
              id: application.id,
              answers: {
                copy: answers,
              },
            },
            locale,
          },
        })
      } catch (e) {
        return [false, 'error occured']
      }
    }
    return [true, null]
  })

  return null
}
