import { FC } from 'react'
import { useLocale } from '@island.is/localization'
import { useMutation } from '@apollo/client'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import { FieldBaseProps } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { useFormContext } from 'react-hook-form'

export const SetDefaultEmployeeAmount: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ application, setBeforeSubmitCallback }) => {
  const { locale } = useLocale()
  const [updateApplication] = useMutation(UPDATE_APPLICATION)
  const { setValue } = useFormContext()
  const employeeAmount = getValueViaPath(
    application.answers,
    'employeeAmount',
  ) as number | undefined

  setBeforeSubmitCallback?.(async () => {
    if (employeeAmount === undefined) {
      setValue('employeeAmount', 1)
      const res = await updateApplication({
        variables: {
          input: {
            id: application.id,
            answers: {
              ...application.answers,
              employeeAmount: 1,
            },
          },
          locale,
        },
      })
      if (res.data) {
        return [true, null]
      }
    }
    return [false, '']
  })

  return <></>
}
