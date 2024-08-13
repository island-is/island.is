import { FieldBaseProps } from '@island.is/application/types'
import { Box, GridColumn, GridRow, Select } from '@island.is/island-ui/core'
import { FC, useEffect, useState } from 'react'
import { gql, useLazyQuery } from '@apollo/client'
import { machine } from '../../lib/messages'
import { InputController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { coreErrorMessages, getValueViaPath } from '@island.is/application/core'
import { Controller } from 'react-hook-form'
import { MACHINE_SUB_CATEGORIES } from '../../graphql/queries'

export const machineSubCategories = gql`
  ${MACHINE_SUB_CATEGORIES}
`

export const AboutMachine: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { application, field, setBeforeSubmitCallback } = props
  const { formatMessage } = useLocale()

  const machineParentCategories = getValueViaPath(
    application.externalData,
    'machineParentCategories.data',
    [],
  ) as { name: string }[]
  const machineType = getValueViaPath(
    application.answers,
    'machine.aboutMachine.type',
    '',
  ) as string
  const machineModel = getValueViaPath(
    application.answers,
    'machine.aboutMachine.model',
    '',
  ) as string
  const machineCategory = getValueViaPath(
    application.answers,
    'machine.aboutMachine.category',
    '',
  ) as string
  const machineSubCategory = getValueViaPath(
    application.answers,
    'machine.aboutMachine.subcategory',
    '',
  ) as string
  const fromService = getValueViaPath(
    application.answers,
    'machine.aboutMachine.fromService',
    false,
  ) as boolean

  const [category, setCategory] = useState<string>(machineCategory)
  const [subCategory, setSubCategory] = useState<string>(machineSubCategory)
  const [subCategories, setSubCategories] = useState<string[]>([])
  const [subCategoryDisabled, setSubCategoryDisabled] = useState<boolean>(
    fromService || (!fromService && !subCategory.length),
  )
  const [type, setType] = useState<string>(machineType)
  const [model, setModel] = useState<string>(machineModel)
  const [displayError, setDisplayError] = useState<boolean>(false)

  const [runQuery, { loading }] = useLazyQuery(machineSubCategories, {
    onCompleted(result) {
      console.log(result)
      if (result?.getMachineSubCategories) {
        setSubCategoryDisabled(false)
        setSubCategories(
          result.getMachineSubCategories.map((subCat: { name: string }) => {
            return subCat.name
          }),
        )
      }
    },
    onError() {
      // Something happens? Maybe a message to the user?
    },
  })

  const setCategoryValue = (value: string) => {
    setSubCategory('')
    setSubCategoryDisabled(true)
    setCategory(value)
  }

  useEffect(() => {
    // Call subcategory
    if (category.length && !fromService) {
      runQuery({
        variables: {
          parentCategory: category,
        },
      })
    }
  }, [category])

  setBeforeSubmitCallback?.(async () => {
    if (
      type.length === 0 ||
      model.length === 0 ||
      category.length === 0 ||
      subCategory.length === 0
    ) {
      console.log('hello here')
      setDisplayError(true)
      return [false, '']
    }
    return [true, null]
  })

  return (
    <Box paddingTop={2}>
      <GridRow marginBottom={2}>
        <GridColumn span={['1/1', '1/2']}>
          <InputController
            id={`${field.id}.type`}
            label={formatMessage(machine.labels.basicMachineInformation.type)}
            backgroundColor="blue"
            required
            disabled={fromService}
            onChange={(e) => setType(e.target.value)}
            error={
              displayError && type.length === 0
                ? formatMessage(coreErrorMessages.defaultError)
                : undefined
            }
          />
        </GridColumn>
        <GridColumn span={['1/1', '1/2']}>
          <InputController
            id={`${field.id}.model`}
            label={formatMessage(machine.labels.basicMachineInformation.model)}
            backgroundColor="blue"
            required
            disabled={fromService}
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
        <GridColumn span={['1/1', '1/2']}>
          <Controller
            name={`${field.id}.category`}
            render={({ field: { onChange } }) => {
              return (
                <Select
                  id={`${field.id}.category`}
                  label={formatMessage(
                    machine.labels.basicMachineInformation.category,
                  )}
                  options={machineParentCategories.map(({ name }) => {
                    return { value: name, label: name }
                  })}
                  onChange={(option) => {
                    onChange(option?.value)
                    option && setCategoryValue(option.value)
                  }}
                  value={
                    category ? { value: category, label: category } : undefined
                  }
                  backgroundColor="blue"
                  isDisabled={fromService}
                  required
                  hasError={displayError && category.length === 0}
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
                    fromService && subCategory
                      ? [{ value: subCategory, label: subCategory }]
                      : subCategories.map((name) => {
                          return {
                            value: name,
                            label: name,
                          }
                        })
                  }
                  isLoading={loading}
                  isDisabled={subCategoryDisabled}
                  value={{ value: subCategory ?? '', label: subCategory ?? '' }}
                  onChange={(option) => {
                    onChange(option?.value)
                    option && setSubCategory(option.value)
                  }}
                  backgroundColor="blue"
                  required
                  hasError={displayError && subCategory.length === 0}
                  errorMessage={formatMessage(coreErrorMessages.defaultError)}
                />
              )
            }}
          />
        </GridColumn>
      </GridRow>
    </Box>
  )
}
