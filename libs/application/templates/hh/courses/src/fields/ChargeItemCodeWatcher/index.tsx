import { FC, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { useApolloClient } from '@apollo/client/react'
import type { FieldBaseProps } from '@island.is/application/types'
import { GET_COURSE_BY_ID_QUERY } from '../../graphql'
import { HAS_CHARGE_ITEM_CODE } from '../../utils/constants'

export const ChargeItemCodeWatcher: FC<
  React.PropsWithChildren<FieldBaseProps>
> = () => {
  const { watch, setValue } = useFormContext()
  const apolloClient = useApolloClient()

  const courseSelect = watch('courseSelect')
  const dateSelect = watch('dateSelect')

  useEffect(() => {
    if (!courseSelect || !dateSelect) {
      setValue(HAS_CHARGE_ITEM_CODE, false)
      return
    }

    const updateChargeItemCode = async () => {
      try {
        const { data } = await apolloClient.query({
          query: GET_COURSE_BY_ID_QUERY,
          variables: {
            input: { id: courseSelect, lang: 'is' },
          },
        })

        const instances = data?.getCourseById?.course?.instances ?? []
        const instance = instances.find(
          (i: { id: string }) => i.id === dateSelect,
        )
        setValue(HAS_CHARGE_ITEM_CODE, !!instance?.chargeItemCode)
      } catch {
        setValue(HAS_CHARGE_ITEM_CODE, false)
      }
    }

    updateChargeItemCode()
  }, [courseSelect, dateSelect, apolloClient, setValue])

  return null
}
