import { ApolloClient } from '@apollo/client'
import { getValueViaPath } from '@island.is/application/core'
import {
  Application,
  FormValue,
  RepeaterOptionValue,
} from '@island.is/application/types'
import {
  MachineLicenseCategoryDto,
  MachineSubCategoryDto,
} from '@island.is/clients/work-machines'
import { Locale } from '@island.is/shared/types'
import { MACHINE_TYPE_BY_REGISTRATION_NUMBER_QUERY } from '../graphql/queries'
import { TrainingLicenseOnAWorkMachineAnswers } from '../shared/types'

export const setOnMachineNumberChange = async (
  value: RepeaterOptionValue,
  application: Application<FormValue>,
  index: number,
  apolloClient: ApolloClient<object> | undefined,
  lang: Locale | undefined,
) => {
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
  const certificateOfTenure = getValueViaPath<
    TrainingLicenseOnAWorkMachineAnswers['certificateOfTenure']
  >(application.answers, 'certificateOfTenure', [])

  const selectedCategory =
    value && value.length > 0
      ? licenseCategories?.find(
          (category) => category.categoryPrefix === value[0].toUpperCase(),
        )
      : undefined

  const onlyFirstLetterInSubCategoryCorrect =
    value && value.length > 1
      ? subCategories?.filter(
          (category) =>
            category.registrationNumberPrefix &&
            typeof value === 'string' &&
            category.registrationNumberPrefix[0] === value[0].toUpperCase() &&
            category.registrationNumberPrefix.slice(0, 2) !==
              value.slice(0, 2).toUpperCase(),
        )
      : undefined
  const bothLettersInSubCategoryCorrect =
    value && value.length > 1
      ? subCategories?.find(
          (category) =>
            category.registrationNumberPrefix &&
            typeof value === 'string' &&
            category.registrationNumberPrefix.slice(0, 2) ===
              value.slice(0, 2).toUpperCase(),
        )
      : undefined
  const isMachineTypeValid =
    certificateOfTenure && certificateOfTenure.length > 1
      ? certificateOfTenure
          ?.slice(0, -1) // Remove the last object from the list because it is the active field
          .find(
            ({ machineNumber }) =>
              typeof value === 'string' &&
              value.length > 0 &&
              machineNumber[0].toUpperCase() === value[0].toUpperCase(),
          )
      : true
  if (value && value.length > 0 && !isMachineTypeValid) {
    return [
      {
        key: `certificateOfTenure[${index}].machineTypeDoesNotMatch`,
        value: true,
      },
    ]
  } else if (
    value &&
    value.length > 5 &&
    apolloClient &&
    selectedCategory &&
    bothLettersInSubCategoryCorrect &&
    !selectedCategory.hasInstructorLicense
  ) {
    const response = await apolloClient
      .query<{
        getTypeByRegistrationNumber: { name: string }
      }>({
        query: MACHINE_TYPE_BY_REGISTRATION_NUMBER_QUERY,
        variables: {
          registrationNumber: value,
          applicationId: application.id,
        },
      })
      .catch(() => {
        return null
      })
    // run query
    return response?.data
      ? [
          {
            key: `certificateOfTenure[${index}].machineType`,
            value: response?.data.getTypeByRegistrationNumber.name,
          },
          {
            key: `certificateOfTenure[${index}].practicalRight`,
            value: `${selectedCategory.categoryPrefix} - ${
              lang === 'is'
                ? selectedCategory.categoryName
                : selectedCategory.categoryNameEn
            }`,
          },
          {
            key: `certificateOfTenure[${index}].licenseCategoryPrefix`,
            value: selectedCategory.categoryPrefix,
          },
        ]
      : [
          {
            key: `certificateOfTenure[${index}].unknownMachineType`,
            value: true,
          },
        ]
  } else if (
    value &&
    value.length > 1 &&
    selectedCategory &&
    selectedCategory.hasInstructorLicense
  ) {
    return [
      {
        key: `certificateOfTenure[${index}].alreadyHaveTrainingLicense`,
        value: true,
      },
    ]
  } else if (
    value &&
    value.length > 1 &&
    onlyFirstLetterInSubCategoryCorrect &&
    onlyFirstLetterInSubCategoryCorrect.length > 0 &&
    !bothLettersInSubCategoryCorrect
  ) {
    return [
      {
        key: `certificateOfTenure[${index}].wrongPracticalRightWithInfo`,
        value: true,
      },
      {
        key: `certificateOfTenure[${index}].licenseCategoryPrefix`,
        value: onlyFirstLetterInSubCategoryCorrect.map(
          (category) => category.registrationNumberPrefix,
        ),
      },
    ]
  } else if (
    value &&
    value.length > 1 &&
    !selectedCategory &&
    bothLettersInSubCategoryCorrect
  ) {
    return [
      {
        key: `certificateOfTenure[${index}].unknownPracticalRight`,
        value: true,
      },
    ]
  } else if (
    value &&
    value.length > 1 &&
    !selectedCategory &&
    ((onlyFirstLetterInSubCategoryCorrect &&
      onlyFirstLetterInSubCategoryCorrect.length === 0) ||
      !bothLettersInSubCategoryCorrect)
  ) {
    return [
      {
        key: `certificateOfTenure[${index}].wrongPracticalRight`,
        value: true,
      },
    ]
  }

  return [
    {
      key: `certificateOfTenure[${index}].unknownMachineType`,
      value: false,
    },
    {
      key: `certificateOfTenure[${index}].unknownPracticalRight`,
      value: false,
    },
    {
      key: `certificateOfTenure[${index}].alreadyHaveTrainingLicense`,
      value: false,
    },
    {
      key: `certificateOfTenure[${index}].wrongPracticalRight`,
      value: false,
    },
    {
      key: `certificateOfTenure[${index}].wrongPracticalRightWithInfo`,
      value: false,
    },
    {
      key: `validCertificateOfTenure`,
      value: true,
    },
    {
      key: `certificateOfTenure[${index}].machineTypeDoesNotMatch`,
      value: false,
    },
  ]
}
