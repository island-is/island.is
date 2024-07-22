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
import { FC, useEffect, useState } from 'react'
import { gql, useLazyQuery } from '@apollo/client'
import { machine } from '../../lib/messages'
import { InputController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import debounce from 'lodash/debounce'
import { getValueViaPath } from '@island.is/application/core'
import { Controller } from 'react-hook-form'
import { MACHINE_MODELS } from '../../graphql/queries'

export const machineModelsQuery = gql`
  ${MACHINE_MODELS}
`

export const MachineType: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { application, field } = props
  const { formatMessage } = useLocale()
  const machineTypes = getValueViaPath(
    application.externalData,
    'machineTypes.data',
    [],
  ) as { name: string }[]

  const [type, setType] = useState<string>()
  const [machineModels, setMachineModels] =
    useState<{ value: string; label: string }[]>()
  const [model, setModel] = useState<string>()
  const [disabled, setDisabled] = useState<boolean>(true)

  const [runQuery, { loading }] = useLazyQuery(machineModelsQuery, {
    onCompleted(result) {
      console.log(result)
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
      }
    },
    onError() {
      setMachineModels([])
      setDisabled(true)
      // Something happens? Maybe a message to the user?
    },
  })

  useEffect(() => {
    // Call service if manufacturer exists
    // If exists, make type disabled false
    // If not show error message
    if (type) {
      setModel(undefined)
      runQuery({
        variables: {
          type: type,
        },
      })
    }
  }, [type])

  useEffect(() => {
    // Call service if type exists
    // If not show error message
  }, [model])
  return (
    <Box>
      <Box paddingBottom={2}>
        <Text variant="h5">
          {formatMessage(machine.labels.machineType.inputTitle)}
        </Text>
      </Box>
      <GridRow marginBottom={5}>
        <GridColumn span={['1/1', '1/2']}>
          <Controller
            name={`${field.id}.type`}
            render={() => {
              return (
                <Select
                  id={`${field.id}.type`}
                  label={formatMessage(machine.labels.machineType.type)}
                  icon="search"
                  options={machineTypes.map(({ name }) => {
                    return { value: name, label: name }
                  })}
                  onChange={(option) => option && setType(option.value)}
                  backgroundColor="blue"
                />
              )
            }}
          />
        </GridColumn>
        <GridColumn span={['1/1', '1/2']}>
          <Controller
            name={`${field.id}.model`}
            render={() => {
              return (
                <Select
                  id={`${field.id}.model`}
                  label={formatMessage(machine.labels.machineType.model)}
                  icon="search"
                  isLoading={loading}
                  options={machineModels}
                  isDisabled={disabled}
                  value={model ? { value: model, label: model } : undefined}
                  onChange={(option) => option && setModel(option.value)}
                  backgroundColor="blue"
                />
              )
            }}
          />
        </GridColumn>
      </GridRow>
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
