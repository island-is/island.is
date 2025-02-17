import { FieldBaseProps } from '@island.is/application/types'
import { FC, useEffect } from 'react'
import { isContractor, isSameAsApplicant } from '../../utils'
import { getValueViaPath } from '@island.is/application/core'
import { MachineLicenseCategoryDto } from '@island.is/clients/work-machines'
import { useFormContext } from 'react-hook-form'
import { gql, useLazyQuery } from '@apollo/client'
import { MACHINE_TYPE_BY_REGISTRATION_NUMBER } from '../../graphql/queries'

export const machineTypeByRegistrationNumber = gql`
  ${MACHINE_TYPE_BY_REGISTRATION_NUMBER}
`

export const SetAnswersForCertificateOfTenure: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ ...props }) => {
  const { application } = props
  const { watch, setValue } = useFormContext()
  const watchMachineNumber = watch(
    'certificateOfTenure.machineNumber',
  ) as string
  const licenseCategories = getValueViaPath<MachineLicenseCategoryDto[]>(
    application.externalData,
    'licenses.data.licenseCategories',
    [],
  )
  const bla = 0
  console.log(watchMachineNumber)

  const [runQuery, { loading }] = useLazyQuery(
    machineTypeByRegistrationNumber,
    {
      onCompleted: (data) => {
        console.log(data)
        // If machine type, setvalue for machine type
        if (data?.getTypeByRegistrationNumber) {
          setValue(
            'certificateOfTenure.machineType',
            data.getTypeByRegistrationNumber.name,
          )
        } else {
          // If no machine type, then error message
          setValue('certificateOfTenure.unknownMachineType', true)
        }
      },
      onError: (error) => {
        console.log(error)
        // If has no machine type, then error message
        setValue('certificateOfTenure.unknownMachineType', true)
      },
    },
  )

  useEffect(() => {
    console.log('hello')
    const selectedCategory =
      watchMachineNumber && watchMachineNumber.length > 0
        ? licenseCategories?.find(
            (category) =>
              category.categoryPrefix === watchMachineNumber[0].toUpperCase(),
          )
        : undefined
    if (
      watchMachineNumber &&
      watchMachineNumber.length > 5 &&
      selectedCategory &&
      !selectedCategory.hasInstructorLicense
    ) {
      setValue(
        'certificateOfTenure.practicalRight',
        `${selectedCategory.categoryPrefix} - ${selectedCategory.categoryName}`,
      )
      // TODO: We have to call for machine type
      runQuery({
        variables: {
          registrationNumber: watchMachineNumber,
          applicationId: application.id,
        },
      })
    } else if (selectedCategory && selectedCategory.hasInstructorLicense) {
      // An error message
      // Clear practicalRight and machineType values
    } else {
      // If no selected value clear values and show error message
    }
  }, [watchMachineNumber])

  return <></>
}
