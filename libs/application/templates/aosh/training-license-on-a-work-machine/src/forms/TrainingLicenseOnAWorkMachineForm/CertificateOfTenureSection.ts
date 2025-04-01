import {
  buildMultiField,
  buildTextField,
  buildSection,
  buildDateField,
  buildCustomField,
  buildAlertMessageField,
  getValueViaPath,
  buildHiddenInput,
  buildTableRepeaterField,
} from '@island.is/application/core'
import { certificateOfTenure } from '../../lib/messages'
import {
  alreadyHaveTrainingLicense,
  isUnknownMachineType,
  isUnknownPracticalRight,
  isWrongPracticalRight,
  isWrongPracticalRightWithInfo,
} from '../../utils'
import {
  MachineLicenseCategoryDto,
  MachineSubCategoryDto,
} from '@island.is/clients/work-machines'
import { MACHINE_TYPE_BY_REGISTRATION_NUMBER_QUERY } from '../../graphql/queries'
import { Application, RepeaterOptionValue } from '@island.is/application/types'
import { ApolloClient } from '@apollo/client'

export const certificateOfTenureSection = buildSection({
  id: 'certificateOfTenureSection',
  title: certificateOfTenure.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'certificateOfTenureMultiField',
      title: certificateOfTenure.general.title,
      description: certificateOfTenure.general.description,
      children: [
        buildTableRepeaterField({
          id: 'certificateOfTenure',
          addItemButtonText: 'Skrá vinnuvélar',
          table: {
            header: [
              certificateOfTenure.labels.machineNumber,
              certificateOfTenure.labels.practicalRight,
              certificateOfTenure.labels.machineType,
              certificateOfTenure.labels.dateFrom,
              certificateOfTenure.labels.dateTo,
              'Starfstími í klst',
            ],
          },
          fields: {
            machineNumber: {
              component: 'input',
              label: certificateOfTenure.labels.machineNumber,
              width: 'half',
              clearOnChange: (index) => [
                `certificateOfTenure[${index}].machineType`,
                `certificateOfTenure[${index}].practicalRight`,
              ],
              setOnChange: async (
                value,
                application,
                index,
                activeField,
                apolloClient,
                lang,
              ) => {
                console.log(
                  value,
                  application,
                  activeField,
                  activeField?.dateTo,
                )
                const licenseCategories = getValueViaPath<
                  MachineLicenseCategoryDto[]
                >(
                  application.externalData,
                  'licenses.data.licenseCategories',
                  [],
                )
                const subCategories = getValueViaPath<MachineSubCategoryDto[]>(
                  application.externalData,
                  'subCategories.data',
                  [],
                )

                const selectedCategory =
                  value && value.length > 0
                    ? licenseCategories?.find(
                        (category) =>
                          category.categoryPrefix === value[0].toUpperCase(),
                      )
                    : undefined

                const onlyFirstLetterInSubCategoryCorrect =
                  value && value.length > 1
                    ? subCategories?.filter(
                        (category) =>
                          category.registrationNumberPrefix &&
                          typeof value === 'string' &&
                          category.registrationNumberPrefix[0] ===
                            value[0].toUpperCase() &&
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
                console.log(
                  licenseCategories,
                  subCategories,
                  selectedCategory,
                  onlyFirstLetterInSubCategoryCorrect,
                  bothLettersInSubCategoryCorrect,
                )
                console.log(apolloClient)
                if (
                  value &&
                  value.length > 5 &&
                  apolloClient &&
                  selectedCategory &&
                  bothLettersInSubCategoryCorrect &&
                  !selectedCategory.hasInstructorLicense
                ) {
                  console.log('here')
                  const { data } = await apolloClient.query<{
                    getTypeByRegistrationNumber: { name: string }
                  }>({
                    query: MACHINE_TYPE_BY_REGISTRATION_NUMBER_QUERY,
                    variables: {
                      registrationNumber: value,
                      applicationId: application.id,
                    },
                  })
                  console.log(data)
                  // run query
                  return data
                    ? [
                        {
                          key: `certificateOfTenure[${index}].practicalRight`,
                          value: data.getTypeByRegistrationNumber.name,
                        },
                        {
                          key: `certificateOfTenure[${index}].machineType`,
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

                return []
              },
            },
            practicalRight: {
              component: 'input',
              label: certificateOfTenure.labels.practicalRight,
              width: 'half',
              readonly: true,
            },
            machineType: {
              component: 'input',
              label: certificateOfTenure.labels.machineType,
              readonly: true,
            },
            dateFrom: {
              component: 'date',
              label: certificateOfTenure.labels.dateFrom,
              width: 'half',
              placeholder: certificateOfTenure.labels.datePlaceholder,
              // maxDate: (application) => {
              //   const dateTo = getValueViaPath<string>(
              //     application.answers,
              //     'certificateOfTenure.dateTo',
              //   )
              //   return dateTo
              //     ? new Date(
              //         new Date(dateTo).setDate(new Date(dateTo).getDate() - 1),
              //       )
              //     : new Date()
              // },
            },
            dateTo: {
              component: 'date',
              label: certificateOfTenure.labels.dateTo,
              width: 'half',
              placeholder: certificateOfTenure.labels.datePlaceholder,
              // minDate: (application) => {
              //   const dateFrom = getValueViaPath<string>(
              //     application.answers,
              //     'certificateOfTenure.dateFrom',
              //   )
              //   return dateFrom
              //     ? new Date(
              //         new Date(dateFrom).setDate(
              //           new Date(dateFrom).getDate() + 1,
              //         ),
              //       )
              //     : new Date('1900-01-01')
              // },
              maxDate: new Date(),
            },
            tenureInHours: {
              component: 'input',
              type: 'number',
              label: certificateOfTenure.labels.tenureInHours,
              width: 'half',
            },
          },
        }),
        // buildTextField({
        //   id: 'certificateOfTenure.machineNumber',
        //   title: certificateOfTenure.labels.machineNumber,
        //   width: 'half',
        //   required: true,
        //   clearOnChange: [
        //     'certificateOfTenure.machineType',
        //     'certificateOfTenure.practicalRight',
        //   ],
        // }),
        buildCustomField({
          id: 'certificateOfTenure.machineType2',
          title: '',
          width: 'half',
          component: 'SetAnswersForCertificateOfTenure',
        }),
        // buildTextField({
        //   id: 'certificateOfTenure.practicalRight',
        //   title: certificateOfTenure.labels.practicalRight,
        //   readOnly: true,
        //   required: true,
        // }),
        buildAlertMessageField({
          id: 'certificateOfTenure.unknownPracticalRight',
          title: '',
          message: certificateOfTenure.labels.unknownPracticalRight,
          alertType: 'warning',
          doesNotRequireAnswer: true,
          condition: (answers) => isUnknownPracticalRight(answers),
        }),
        buildAlertMessageField({
          id: 'certificateOfTenure.wrongPracticalRight',
          title: '',
          message: certificateOfTenure.labels.wrongPracticalRight,
          alertType: 'warning',
          doesNotRequireAnswer: true,
          condition: (answers) => isWrongPracticalRight(answers),
        }),
        buildAlertMessageField({
          id: 'certificateOfTenure.wrongPracticalRightWithInfo',
          title: '',
          message: (application) => {
            const listOfPossiblePracticalRights = getValueViaPath<string[]>(
              application.answers,
              'certificateOfTenure.listOfPossiblePracticalRights',
            )
            return {
              ...certificateOfTenure.labels.wrongPracticalRightWithInfo,
              values: {
                firstLetter: `${
                  listOfPossiblePracticalRights
                    ? listOfPossiblePracticalRights[0].charAt(0).toUpperCase()
                    : ''
                }`,
                allAggregates: `${
                  listOfPossiblePracticalRights
                    ? listOfPossiblePracticalRights.join(', ')
                    : ''
                }`,
              },
            }
          },
          alertType: 'warning',
          doesNotRequireAnswer: true,
          condition: (answers) => isWrongPracticalRightWithInfo(answers),
        }),
        buildAlertMessageField({
          id: 'certificateOfTenure.unknownMachineType',
          title: '',
          message: certificateOfTenure.labels.unknownMachineType,
          alertType: 'warning',
          doesNotRequireAnswer: true,
          condition: (answers) => isUnknownMachineType(answers),
        }),
        buildAlertMessageField({
          id: 'certificateOfTenure.alreadyHaveTrainingLicense',
          title: '',
          message: certificateOfTenure.labels.alreadyHaveTrainingLicense,
          alertType: 'warning',
          doesNotRequireAnswer: true,
          condition: (answers) => alreadyHaveTrainingLicense(answers),
        }),
        // buildDateField({
        //   id: 'certificateOfTenure.dateFrom',
        //   title: certificateOfTenure.labels.dateFrom,
        //   width: 'half',
        //   required: true,
        //   placeholder: certificateOfTenure.labels.datePlaceholder,
        //   maxDate: (application) => {
        //     const dateTo = getValueViaPath<string>(
        //       application.answers,
        //       'certificateOfTenure.dateTo',
        //     )
        //     return dateTo
        //       ? new Date(
        //           new Date(dateTo).setDate(new Date(dateTo).getDate() - 1),
        //         )
        //       : new Date()
        //   },
        // }),
        // buildDateField({
        //   id: 'certificateOfTenure.dateTo',
        //   title: certificateOfTenure.labels.dateTo,
        //   width: 'half',
        //   required: true,
        //   placeholder: certificateOfTenure.labels.datePlaceholder,
        //   minDate: (application) => {
        //     const dateFrom = getValueViaPath<string>(
        //       application.answers,
        //       'certificateOfTenure.dateFrom',
        //     )
        //     return dateFrom
        //       ? new Date(
        //           new Date(dateFrom).setDate(new Date(dateFrom).getDate() + 1),
        //         )
        //       : new Date('1900-01-01')
        //   },
        //   maxDate: new Date(),
        // }),
        // buildTextField({
        //   id: 'certificateOfTenure.tenureInHours',
        //   title: certificateOfTenure.labels.tenureInHours,
        //   width: 'half',
        //   required: true,
        //   variant: 'number',
        // }),
        buildHiddenInput({
          id: 'certificateOfTenure.licenseCategoryPrefix',
        }),
      ],
    }),
  ],
})
