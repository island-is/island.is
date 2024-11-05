import { FieldBaseProps } from '@island.is/application/types'
import { Box, GridColumn, GridRow, Select } from '@island.is/island-ui/core'
import { FC, useEffect, useState } from 'react'
import { gql, useLazyQuery } from '@apollo/client'
import { machine } from '../../lib/messages'
import { InputController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { coreErrorMessages, getValueViaPath } from '@island.is/application/core'
import { Controller, useFormContext } from 'react-hook-form'
import { MACHINE_SUB_CATEGORIES } from '../../graphql/queries'
import { CategoryType } from '../../shared/types'
import { getAboutMachineAnswers } from '../../utils'

export const machineSubCategories = gql`
  ${MACHINE_SUB_CATEGORIES}
`

export const AboutMachine: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { application, field, setBeforeSubmitCallback } = props
  const { formatMessage, lang } = useLocale()
  const { control, register, setValue } = useFormContext()

  const {
    machineParentCategories,
    machineType,
    machineModel,
    machineCategory,
    machineSubCategory,
    fromService,
    categoriesFromService,
  } = getAboutMachineAnswers(application.answers, application.externalData)

  const [category, setCategory] = useState<CategoryType>({
    nameIs: machineCategory.nameIs,
    nameEn: machineCategory.nameEn,
  })
  const [subCategory, setSubCategory] = useState<CategoryType>({
    nameIs: machineSubCategory.nameIs,
    nameEn: machineSubCategory.nameEn,
  })
  const [subCategories, setSubCategories] = useState<
    { subCat: CategoryType; registrationNumberPrefix: string }[]
  >([])
  const [registrationNumberPrefix, setRegistrationNumberPrefix] =
    useState<string>(
      getValueViaPath(
        application.answers,
        'machine.aboutMachine.registrationNumberPrefix',
        '',
      ) as string,
    )
  const [subCategoryDisabled, setSubCategoryDisabled] = useState<boolean>(
    (fromService && categoriesFromService.length === 1) ||
      (!fromService && !subCategory.nameIs.length),
  )
  const [type, setType] = useState<string>(machineType)
  const [model, setModel] = useState<string>(machineModel)
  const [displayError, setDisplayError] = useState<boolean>(false)

  const [runQuery, { loading }] = useLazyQuery(machineSubCategories, {
    onCompleted(result) {
      if (result?.getMachineSubCategories) {
        setSubCategoryDisabled(false)
        setSubCategories(
          result.getMachineSubCategories.map(
            (subCat: {
              name: string
              nameEn: string
              registrationNumberPrefix: string
            }) => {
              return {
                subCat: {
                  nameIs: subCat.name,
                  nameEn: subCat.nameEn,
                },
                registrationNumberPrefix: subCat.registrationNumberPrefix,
              }
            },
          ),
        )
      }
    },
  })

  const setCategoryValue = (value: CategoryType) => {
    setSubCategory({ nameIs: '', nameEn: '' })
    setSubCategoryDisabled(true)
    setCategory({ nameIs: value.nameIs, nameEn: value.nameEn })
  }

  const setDisabledCategoryValue = (value: CategoryType) => {
    const newCategory = categoriesFromService.find(
      (category) => category.subcategoryIs === value.nameIs,
    )
    setCategory({
      nameIs: newCategory?.categoryIs ?? '',
      nameEn: newCategory?.categoryEn ?? '',
    })
  }

  useEffect(() => {
    // Call subcategory
    if (category.nameIs.length && !fromService) {
      runQuery({
        variables: {
          parentCategory: category.nameIs,
        },
      })
    }
  }, [category])

  setBeforeSubmitCallback?.(async () => {
    if (
      type.length === 0 ||
      model.length === 0 ||
      category.nameIs.length === 0 ||
      subCategory.nameIs.length === 0
    ) {
      setDisplayError(true)
      return [false, '']
    }
    setValue(`${field.id}.registrationNumberPrefix`, registrationNumberPrefix)
    return [true, null]
  })

  return (
    <Box paddingTop={2}>
      <GridRow>
        <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
          <InputController
            id={`${field.id}.type`}
            label={formatMessage(machine.labels.basicMachineInformation.type)}
            backgroundColor="blue"
            required
            disabled={fromService}
            maxLength={50}
            onChange={(e) => setType(e.target.value)}
            error={
              displayError && type.length === 0
                ? formatMessage(coreErrorMessages.defaultError)
                : undefined
            }
          />
        </GridColumn>
        <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
          <InputController
            id={`${field.id}.model`}
            label={formatMessage(machine.labels.basicMachineInformation.model)}
            backgroundColor="blue"
            required
            disabled={fromService}
            maxLength={50}
            onChange={(e) => setModel(e.target.value)}
            error={
              displayError && model.length === 0
                ? formatMessage(coreErrorMessages.defaultError)
                : undefined
            }
          />
        </GridColumn>
      </GridRow>
      <GridRow>
        <GridColumn span={['1/1', '1/2']} paddingBottom={[2, 0]}>
          <Controller
            name={`${field.id}.category`}
            render={({ field: { onChange } }) => {
              return (
                <Select
                  id={`${field.id}.category`}
                  label={formatMessage(
                    machine.labels.basicMachineInformation.category,
                  )}
                  options={machineParentCategories.map(({ name, nameEn }) => {
                    return {
                      value: { nameIs: name, nameEn: nameEn },
                      label: lang === 'is' ? name : nameEn,
                    }
                  })}
                  onChange={(option) => {
                    onChange(option?.value)
                    option &&
                      setCategoryValue({
                        nameIs: option.value.nameIs ?? '',
                        nameEn: option.value.nameEn ?? '',
                      })
                  }}
                  value={
                    category
                      ? {
                          value: {
                            nameIs: category.nameIs,
                            nameEn: category.nameEn,
                          },
                          label:
                            lang === 'is' ? category.nameIs : category.nameEn,
                        }
                      : undefined
                  }
                  backgroundColor="blue"
                  isDisabled={fromService}
                  required
                  hasError={displayError && category.nameIs.length === 0}
                  errorMessage={formatMessage(coreErrorMessages.defaultError)}
                />
              )
            }}
          />
        </GridColumn>
        <GridColumn span={['1/1', '1/2']}>
          <Controller
            name={`${field.id}.subcategory`}
            render={({ field: { onChange } }) => {
              return (
                <Select
                  id={`${field.id}.subcategory`}
                  label={formatMessage(
                    machine.labels.basicMachineInformation.subcategory,
                  )}
                  options={
                    fromService && categoriesFromService.length
                      ? categoriesFromService.map(
                          ({ subcategoryEn, subcategoryIs }) => {
                            return {
                              value: {
                                nameIs: subcategoryIs,
                                nameEn: subcategoryEn,
                              },
                              label:
                                lang === 'is' ? subcategoryIs : subcategoryEn,
                            }
                          },
                        )
                      : subCategories.map((cat) => {
                          return {
                            value: {
                              nameIs: cat.subCat.nameIs,
                              nameEn: cat.subCat.nameEn,
                            },
                            label:
                              lang === 'is'
                                ? cat.subCat.nameIs
                                : cat.subCat.nameEn,
                          }
                        })
                  }
                  isLoading={loading}
                  isDisabled={subCategoryDisabled}
                  value={{
                    value: {
                      nameIs: subCategory.nameIs,
                      nameEn: subCategory.nameEn,
                    },
                    label:
                      lang === 'is' ? subCategory.nameIs : subCategory.nameEn,
                  }}
                  onChange={(option) => {
                    onChange(option?.value)
                    option && setSubCategory(option.value)
                    option &&
                      setRegistrationNumberPrefix(
                        fromService && categoriesFromService.length
                          ? categoriesFromService.find(
                              ({ subcategoryIs }) =>
                                subcategoryIs === option.value.nameIs,
                            )?.registrationNumberPrefix ?? ''
                          : subCategories.find(
                              ({ subCat }) =>
                                subCat.nameIs === option.value.nameIs,
                            )?.registrationNumberPrefix ?? '',
                      )
                    fromService &&
                      categoriesFromService.length &&
                      option &&
                      setDisabledCategoryValue(option.value)
                  }}
                  backgroundColor="blue"
                  required
                  hasError={displayError && subCategory.nameIs.length === 0}
                  errorMessage={formatMessage(coreErrorMessages.defaultError)}
                />
              )
            }}
          />
        </GridColumn>
      </GridRow>
      <Controller
        name={`${field.id}.registrationNumberPrefix`}
        control={control}
        render={() => (
          <input
            type="hidden"
            value={registrationNumberPrefix}
            {...register(`${field.id}.registrationNumberPrefix`)}
          />
        )}
      />
    </Box>
  )
}
