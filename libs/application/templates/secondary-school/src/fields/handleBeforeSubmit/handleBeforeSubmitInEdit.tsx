import { FC } from 'react'
import { DefaultEvents, FieldBaseProps } from '@island.is/application/types'
import { useMutation } from '@apollo/client'
import { useLocale } from '@island.is/localization'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import { useFormContext } from 'react-hook-form'
import { getValueViaPath } from '@island.is/application/core'

export const HandleBeforeSubmitInEdit: FC<FieldBaseProps> = ({
  application,
  setBeforeSubmitCallback,
}) => {
  const { locale } = useLocale()
  const { setValue, getValues } = useFormContext()
  const [updateApplication] = useMutation(UPDATE_APPLICATION)

  setBeforeSubmitCallback?.(async (event) => {
    if (event === DefaultEvents.ABORT) {
      try {
        const oldCopy = getValues('copy')

        if (oldCopy) {
          Object.keys(oldCopy).forEach((key) => {
            setValue(key, getValueViaPath(oldCopy, key))
          })
        }
        setValue('copy', null)

        await updateApplication({
          variables: {
            input: {
              id: application.id,
              answers: { ...oldCopy, copy: null },
            },
            locale,
          },
        })
      } catch (e) {
        return [false, 'error occured']
      }
    } else if (event === DefaultEvents.SUBMIT) {
      try {
        setValue('copy', null)

        await updateApplication({
          variables: {
            input: {
              id: application.id,
              answers: {
                copy: null,
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
