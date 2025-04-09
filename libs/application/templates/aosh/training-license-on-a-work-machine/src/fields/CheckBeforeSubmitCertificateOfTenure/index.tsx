import { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { useFormContext } from 'react-hook-form'
import { getValueViaPath } from '@island.is/application/core'
import { TrainingLicenseOnAWorkMachine } from '../..'

export const CheckBeforeSubmitCertificateOfTenure: FC<FieldBaseProps> = ({
  setBeforeSubmitCallback,
}) => {
  const { getValues, setValue } = useFormContext()

  setBeforeSubmitCallback?.(async () => {
    const answers = getValues()
    const certificateOfTenure = getValueViaPath<
      TrainingLicenseOnAWorkMachine['certificateOfTenure']
    >(answers, 'certificateOfTenure')
    const totalTenureInHours = certificateOfTenure?.reduce(
      (sum, tenure) => sum + (parseInt(tenure.tenureInHours, 10) || 0),
      0,
    )
    setValue('validCertificateOfTenure', true)
    if (!certificateOfTenure) {
      console.log('Certificate of tenure is missing')
      return [false, '']
    } else if (totalTenureInHours && totalTenureInHours < 1000) {
      console.log('Total tenure in hours is less than 1000')
      setValue('validCertificateOfTenure', false)
      return [false, 'Total tenure in hours must be at least 1000']
    }
    return [true, null]
  })

  return <></>
}
