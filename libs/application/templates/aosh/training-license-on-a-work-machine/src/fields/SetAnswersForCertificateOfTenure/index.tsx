import { FieldBaseProps } from '@island.is/application/types'
import { FC, useEffect } from 'react'
import { getErrorViaPath, getValueViaPath } from '@island.is/application/core'
import { MachineLicenseCategoryDto } from '@island.is/clients/work-machines'
import { useFormContext } from 'react-hook-form'
import { gql, useLazyQuery } from '@apollo/client'
import { MACHINE_TYPE_BY_REGISTRATION_NUMBER } from '../../graphql/queries'
import { Box } from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import { certificateOfTenure } from '../../lib/messages'
import { useLocale } from '@island.is/localization'

export const machineTypeByRegistrationNumber = gql`
  ${MACHINE_TYPE_BY_REGISTRATION_NUMBER}
`

export const SetAnswersForCertificateOfTenure: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ ...props }) => {
  const { application, field, errors } = props
  const { formatMessage, lang } = useLocale()
  const { watch, setValue } = useFormContext()
  const watchMachineNumber = watch(
    'certificateOfTenure.machineNumber',
  ) as string
  const licenseCategories = getValueViaPath<MachineLicenseCategoryDto[]>(
    application.externalData,
    'licenses.data.licenseCategories',
    [],
  )

  const [runQuery, { loading }] = useLazyQuery(
    machineTypeByRegistrationNumber,
    {
      onCompleted: (data) => {
        if (data?.getTypeByRegistrationNumber) {
          setValue(
            'certificateOfTenure.machineType',
            data.getTypeByRegistrationNumber.name,
          )
        } else {
          setValue('certificateOfTenure.unknownMachineType', true)
        }
      },
      onError: () => {
        setValue('certificateOfTenure.unknownMachineType', true)
      },
    },
  )

  useEffect(() => {
    setValue('certificateOfTenure.unknownPracticalRight', false)
    setValue('certificateOfTenure.unknownMachineType', false)
    setValue('certificateOfTenure.alreadyHaveTrainingLicense', false)
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
        `${selectedCategory.categoryPrefix} - ${
          lang === 'is'
            ? selectedCategory.categoryName
            : selectedCategory.categoryNameEn
        }`,
      )
      setValue(
        'certificateOfTenure.licenseCategoryPrefix',
        selectedCategory.categoryPrefix,
      )
      runQuery({
        variables: {
          registrationNumber: watchMachineNumber,
          applicationId: application.id,
        },
      })
    } else if (
      watchMachineNumber &&
      watchMachineNumber.length > 5 &&
      selectedCategory &&
      selectedCategory.hasInstructorLicense
    ) {
      setValue('certificateOfTenure.alreadyHaveTrainingLicense', true)
    } else if (
      watchMachineNumber &&
      watchMachineNumber.length > 5 &&
      !selectedCategory
    ) {
      setValue('certificateOfTenure.unknownPracticalRight', true)
    }
  }, [watchMachineNumber])

  return (
    <Box paddingTop={2}>
      <InputController
        id={field.id}
        label={formatMessage(certificateOfTenure.labels.machineType)}
        backgroundColor="blue"
        required
        readOnly
        loading={loading}
        error={errors && getErrorViaPath(errors, field.id)}
      />
    </Box>
  )
}
