import { FieldBaseProps } from '@island.is/application/types'
import {
  AlertMessage,
  AsyncSearch,
  Box,
  GridColumn,
  GridRow,
  Select,
  Text,
} from '@island.is/island-ui/core'
import { FC, useCallback, useEffect, useState } from 'react'
import { gql, useLazyQuery, useMutation } from '@apollo/client'
import { machine } from '../../lib/messages'
import { InputController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import debounce from 'lodash/debounce'
import { getValueViaPath } from '@island.is/application/core'
import { Controller, useFormContext } from 'react-hook-form'
import { MACHINE_MODELS, MACHINE_SUB_CATEGORIES } from '../../graphql/queries'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import { useLazyMachineCategory } from '../../hooks/useLazyMachineCategory'

export const machineSubCategories = gql`
  ${MACHINE_SUB_CATEGORIES}
`

export const AboutMachine: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { application, field, setBeforeSubmitCallback } = props
  const { formatMessage, locale } = useLocale()

  const machineParentCategories = getValueViaPath(
    application.externalData,
    'machineParentCategories.data',
    [],
  ) as { name: string }[]
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

  const [updateApplication] = useMutation(UPDATE_APPLICATION)

  const [machineModels, setMachineModels] =
    useState<{ value: string; label: string }[]>()
  const [category, setCategory] = useState<string>(machineCategory)
  const [subCategory, setSubCategory] = useState<string>(machineSubCategory)
  const [subCategories, setSubCategories] = useState<string[]>([])
  const [subCategoryDisabled, setSubCategoryDisabled] = useState<boolean>(
    fromService || (!fromService && !subCategory.length),
  )
  const [displayError, setDisplayError] = useState<boolean>(false)
  const { setValue } = useFormContext()

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
      // const models = result.getMachineModels.map(
      //   (machineModel: { name: string }) => {
      //     return {
      //       value: machineModel.name,
      //       label: machineModel.name,
      //     }
      //   },
      // )
      // setMachineModels(models)
      // if (models.length > 0) {
      //   setDisabled(false)
      // } else {
      //   setDisplayError(true)
      // }
    },
    onError() {
      // setMachineModels([])
      // setDisplayError(true)
      // setDisabled(true)
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

  // setBeforeSubmitCallback?.(async () => {
  //   // Call updateApplication for basicInformation.type and basicInformation.model
  //   if (type !== undefined) {
  //     // Get information for basicInformation here and updateApplication
  //     await updateApplication({
  //       variables: {
  //         input: {
  //           id: application.id,
  //           answers: {

  //             ...application.answers,
  //           }
  //         },
  //         locale,
  //       }
  //     })
  //   }
  //   return [true, null]
  // })

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
          />
        </GridColumn>
        <GridColumn span={['1/1', '1/2']}>
          <InputController
            id={`${field.id}.model`}
            label={formatMessage(machine.labels.basicMachineInformation.model)}
            backgroundColor="blue"
            required
            disabled={fromService}
          />
        </GridColumn>
      </GridRow>
      <GridRow>
        <GridColumn span={['1/1', '1/2']}>
          <Controller
            name={`${field.id}.category`}
            render={() => {
              return (
                <Select
                  id={`${field.id}.category`}
                  label={formatMessage(
                    machine.labels.basicMachineInformation.category,
                  )}
                  options={machineParentCategories.map(({ name }) => {
                    return { value: name, label: name }
                  })}
                  onChange={(option) =>
                    option && setCategoryValue(option.value)
                  }
                  value={
                    category ? { value: category, label: category } : undefined
                  }
                  backgroundColor="blue"
                  isDisabled={fromService}
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
                />
              )
            }}
          />
        </GridColumn>
      </GridRow>
    </Box>
  )
}
