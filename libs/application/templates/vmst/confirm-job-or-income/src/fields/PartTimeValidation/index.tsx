import { FieldBaseProps } from '@island.is/application/types'
import { useApolloClient } from '@apollo/client/react'
import { useLocale } from '@island.is/localization'
import { FC } from 'react'
import { useFormContext } from 'react-hook-form'
import { validatePartTimeJobs } from '../../utils/validatePartTimeJobs'

export const PartTimeValidation: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { setBeforeSubmitCallback } = props
  const { getValues, setValue } = useFormContext()
  const apolloClient = useApolloClient()
  const { formatMessage } = useLocale()

  setBeforeSubmitCallback?.(async () => {
    const rows = getValues('registerPartTime') ?? []

    if (!rows.length) {
      return [true, null]
    }

    const { pathItems, isValid } = await validatePartTimeJobs(
      apolloClient,
      rows,
      formatMessage,
    )

    pathItems.forEach(({ path, value }) => setValue(path, value))

    if (!isValid) {
      return [false, '']
    }

    return [true, null]
  })

  return null
}
