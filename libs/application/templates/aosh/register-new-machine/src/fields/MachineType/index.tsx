import { FieldBaseProps } from '@island.is/application/types'
import {
  AlertMessage,
  Box,
  GridColumn,
  GridRow,
  Select,
  Text,
} from '@island.is/island-ui/core'
import { FC, useCallback, useEffect, useState } from 'react'
import { gql, useLazyQuery, useMutation } from '@apollo/client'
import { machine } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { getValueViaPath } from '@island.is/application/core'
import { Controller, useFormContext } from 'react-hook-form'
import { MACHINE_MODELS, MACHINE_CATEGORY } from '../../graphql/queries'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import { useLazyMachineCategory } from '../../hooks/useLazyMachineCategory'

export const machineModelsQuery = gql`
  ${MACHINE_MODELS}
`

export const machineCategoryQuery = gql`
  ${MACHINE_CATEGORY}
`

export const MachineType: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { application, field, setBeforeSubmitCallback } = props
  const { setValue } = useFormContext()
  const { formatMessage, locale } = useLocale()
  const machineTypes = getValueViaPath(
    application.externalData,
    'machineTypes.data',
    [],
  ) as { name: string }[]
  const [updateApplication] = useMutation(UPDATE_APPLICATION)
  const modelFromAnswers = getValueViaPath(
    application.answers,
    'machine.machineType.model',
  ) as string | undefined
  const typeFromAnswers = getValueViaPath(
    application.answers,
    'machine.machineType.type',
  ) as string | undefined

  const [type, setType] = useState<string | undefined>(typeFromAnswers)
  const [machineModels, setMachineModels] =
    useState<{ value: string; label: string }[]>()
  const [model, setModel] = useState<string | undefined>(modelFromAnswers)
  const [disabled, setDisabled] = useState<boolean>(true)
  const [displayError, setDisplayError] = useState<boolean>(false)

  const getMachineCategory = useLazyMachineCategory()
  const getMachineCategoryCallback = useCallback(
    async (type: string, model: string) => {
      const { data } = await getMachineCategory({
        input: {
          type,
          model,
        },
      })
      return data
    },
    [getMachineCategory],
  )

  const [runQuery, { loading }] = useLazyQuery(machineModelsQuery, {
    onCompleted(result) {
      const models = result.getMachineModels.map(
        (machineModel: { name: string }) => {
          return {
            value: machineModel.name,
            label: machineModel.name,
          }
        },
      )
      setMachineModels(models)
      if (models.length > 0) {
        setDisabled(false)
      } else {
        setDisplayError(true)
      }
    },
    onError() {
      setMachineModels([])
      setDisplayError(true)
      setDisabled(true)
    },
  })

  const setMachineType = (value: string) => {
    if (value !== type) {
      setModel(undefined)
      setDisabled(true)
    }
    setType(value)
  }

  useEffect(() => {
    // Call service if manufacturer exists
    // If exists, make type disabled false
    // If not show error message
    setDisplayError(false)
    if (type && type !== 'unknown') {
      runQuery({
        variables: {
          type: type,
        },
      })
    }
  }, [type])

  setBeforeSubmitCallback?.(async () => {
    // Call updateApplication for basicInformation.type and basicInformation.model
    // Get information for basicInformation here and updateApplication
    if (modelFromAnswers === model && typeFromAnswers === type) {
      return [true, null]
    }
    let response = undefined
    try {
      response =
        type && model && type !== 'unknown' && model !== 'unknown'
          ? await getMachineCategoryCallback(type, model)
          : undefined
    } catch (e) {
      console.error('Could not get machine category', e)
    }

    const categoryIs =
      response?.getMachineParentCategoryByTypeAndModel[0]?.name ?? ''
    const categoryEn =
      response?.getMachineParentCategoryByTypeAndModel[0]?.nameEn ?? categoryIs
    const subcategoryIs =
      response?.getMachineParentCategoryByTypeAndModel[0]?.subCategoryName ?? ''
    const subcategoryEn =
      response?.getMachineParentCategoryByTypeAndModel[0]?.subCategoryNameEn ??
      subcategoryIs
    const registrationNumberPrefix =
      response?.getMachineParentCategoryByTypeAndModel[0]
        ?.registrationNumberPrefix ?? ''

    const categories = response?.getMachineParentCategoryByTypeAndModel?.map(
      ({
        name,
        nameEn,
        subCategoryName,
        subCategoryNameEn,
        registrationNumberPrefix,
      }) => {
        return {
          categoryIs: name ?? '',
          categoryEn: nameEn ?? name ?? '',
          subcategoryIs: subCategoryName ?? '',
          subcategoryEn: subCategoryNameEn ?? subCategoryName ?? '',
          registrationNumberPrefix: registrationNumberPrefix ?? '',
        }
      },
    )

    setValue('machine.aboutMachine.categories', categories)
    setValue(
      'machine.aboutMachine.type',
      type && type !== 'unknown' ? type : '',
    )
    setValue(
      'machine.aboutMachine.model',
      model && model !== 'unknown' ? model : '',
    )
    setValue('machine.aboutMachine.category.nameIs', categoryIs)
    setValue('machine.aboutMachine.category.nameEn', categoryEn)
    setValue('machine.aboutMachine.subcategory.nameIs', subcategoryIs)
    setValue('machine.aboutMachine.subcategory.nameEn', subcategoryEn)
    setValue(
      'machine.aboutMachine.registrationNumberPrefix',
      registrationNumberPrefix,
    )
    setValue(
      'machine.aboutMachine.fromService',
      !!(categoryIs.length && categories),
    )
    const res = await updateApplication({
      variables: {
        input: {
          id: application.id,
          answers: {
            ...application.answers,
            machine: {
              aboutMachine: {
                type: type && type !== 'unknown' ? type : '',
                model: model && model !== 'unknown' ? model : '',
                category: {
                  nameIs: categoryIs,
                  nameEn: categoryEn,
                },
                categories: categories,
                subcategory: {
                  nameIs: subcategoryIs,
                  nameEn: subcategoryEn,
                },
                registrationNumberPrefix: registrationNumberPrefix,
                fromService: !!(categoryIs.length && categories),
              },
              machineType: {
                type: type ?? '',
                model: model ?? '',
              },
            },
          },
        },
        locale,
      },
    })
    if (res.data) {
      return [true, null]
    }
    return [false, '']
  })

  return (
    <Box>
      <Box paddingBottom={2}>
        <Text variant="h5">
          {formatMessage(machine.labels.machineType.inputTitle)}
        </Text>
      </Box>
      <GridRow marginBottom={3}>
        <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
          <Controller
            name={`${field.id}.type`}
            defaultValue={type}
            render={({ field: { onChange, value } }) => {
              return (
                <Select
                  name={`${field.id}.type`}
                  label={formatMessage(machine.labels.machineType.type)}
                  icon="search"
                  options={[
                    {
                      value: 'unknown',
                      label: formatMessage(
                        machine.labels.machineType.unknownType,
                      ),
                    },
                  ].concat(
                    machineTypes.map(({ name }) => {
                      return { value: name, label: name }
                    }),
                  )}
                  value={{
                    value: value,
                    label:
                      value === 'unknown'
                        ? formatMessage(machine.labels.machineType.unknownType)
                        : value,
                  }}
                  onChange={(option) => {
                    onChange(option?.value)
                    option && setMachineType(option.value)
                  }}
                  backgroundColor="blue"
                />
              )
            }}
          />
        </GridColumn>
        <GridColumn span={['1/1', '1/2']}>
          <Controller
            name={`${field.id}.model`}
            defaultValue={model}
            render={({ field: { onChange } }) => {
              return (
                <Select
                  name={`${field.id}.model`}
                  label={formatMessage(machine.labels.machineType.model)}
                  icon="search"
                  isLoading={loading}
                  options={
                    machineModels &&
                    [
                      {
                        value: 'unknown',
                        label: formatMessage(
                          machine.labels.machineType.unknownModel,
                        ),
                      },
                    ].concat(machineModels)
                  }
                  isDisabled={disabled}
                  value={{
                    value: model ?? '',
                    label:
                      model === 'unknown'
                        ? formatMessage(machine.labels.machineType.unknownModel)
                        : model ?? '',
                  }}
                  onChange={(option) => {
                    onChange(option?.value)
                    option && setModel(option.value)
                  }}
                  backgroundColor="blue"
                />
              )
            }}
          />
        </GridColumn>
      </GridRow>
      {displayError && (
        <Box marginBottom={3}>
          <AlertMessage
            type="error"
            title=""
            message={formatMessage(
              machine.labels.machineType.errorAlertMessageDescription,
            )}
          />
        </Box>
      )}
      <Box>
        <AlertMessage
          type="warning"
          title=""
          message={formatMessage(
            machine.labels.machineType.warningAlertMessageDescription,
          )}
        />
      </Box>
    </Box>
  )
}
