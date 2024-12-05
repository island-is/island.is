import { FieldBaseProps } from '@island.is/application/types'
import { FC, useCallback } from 'react'
import { useFormContext } from 'react-hook-form'
import { useLazyIsCompanyValid } from '../../hooks/useLazyIsCompanyValid'

export const WatchCompanyNationalId: FC<
  React.PropsWithChildren<FieldBaseProps>
> = (props) => {
  const { setBeforeSubmitCallback } = props
  const { getValues } = useFormContext()
  const getIsValidCompany = useLazyIsCompanyValid()
  const getIsCompanyValidCallback = useCallback(
    async (nationalId: string) => {
      const { data } = await getIsValidCompany({
        nationalId,
      })
      return data
    },
    [getIsValidCompany],
  )

  setBeforeSubmitCallback?.(async () => {
    const companyNationalId = getValues(
      'paymentArrangement.companyInfo.nationalId',
    )
    if (companyNationalId) {
      const response = await getIsCompanyValidCallback(companyNationalId)
      console.log(response)
    }
    console.log(companyNationalId)
    return [false, '']
  })

  return <></>
}
