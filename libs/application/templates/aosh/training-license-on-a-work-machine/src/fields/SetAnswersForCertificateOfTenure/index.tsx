import { FieldBaseProps } from '@island.is/application/types'
import { FC, useEffect } from 'react'
import { getErrorViaPath, getValueViaPath } from '@island.is/application/core'
import {
  MachineLicenseCategoryDto,
  MachineSubCategoryDto,
} from '@island.is/clients/work-machines'
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
  const subCategories = getValueViaPath<MachineSubCategoryDto[]>(
    application.externalData,
    'subCategories.data',
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
    setValue('certificateOfTenure.wrongPracticalRight', false)
    setValue('certificateOfTenure.unknownMachineType', false)
    setValue('certificateOfTenure.alreadyHaveTrainingLicense', false)
    const selectedCategory =
      watchMachineNumber && watchMachineNumber.length > 0
        ? licenseCategories?.find(
            (category) =>
              category.categoryPrefix === watchMachineNumber[0].toUpperCase(),
          )
        : undefined
    const onlyFirstLetterInSubCategoryCorrect =
      watchMachineNumber && watchMachineNumber.length > 1
        ? subCategories?.filter(
            (category) =>
              category.registrationNumberPrefix &&
              category.registrationNumberPrefix[0] ===
                watchMachineNumber[0].toUpperCase() &&
              category.registrationNumberPrefix.slice(0, 2) !==
                watchMachineNumber.slice(0, 2).toUpperCase(),
          )
        : undefined
    const bothLettersInSubCategoryCorrect =
      watchMachineNumber && watchMachineNumber.length > 1
        ? subCategories?.find(
            (category) =>
              category.registrationNumberPrefix &&
              category.registrationNumberPrefix.slice(0, 2) ===
                watchMachineNumber.slice(0, 2).toUpperCase(),
          )
        : undefined
    if (
      watchMachineNumber &&
      watchMachineNumber.length > 5 &&
      selectedCategory &&
      bothLettersInSubCategoryCorrect &&
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
      onlyFirstLetterInSubCategoryCorrect &&
      onlyFirstLetterInSubCategoryCorrect.length > 0 &&
      !bothLettersInSubCategoryCorrect
    ) {
      setValue('certificateOfTenure.wrongPracticalRight', true)
      setValue(
        'certificateOfTenure.listOfPossiblePracticalRights',
        onlyFirstLetterInSubCategoryCorrect.map(
          (category) => category.registrationNumberPrefix,
        ),
      )
    } else if (
      watchMachineNumber &&
      watchMachineNumber.length > 5 &&
      !selectedCategory &&
      bothLettersInSubCategoryCorrect
    ) {
      setValue('certificateOfTenure.unknownPracticalRight', true)
    }
  }, [watchMachineNumber, licenseCategories, subCategories])

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
