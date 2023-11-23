import { gql, useQuery } from '@apollo/client'
import { FieldBaseProps } from '@island.is/application/types'
import {
  AlertMessage,
  Box,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { InputController } from '@island.is/shared/form-fields'
import { FC, useEffect } from 'react'
import { GET_MACHINE_DETAILS } from '../../graphql/queries'
import { information } from '../../lib/messages'
import { getSelectedMachine } from '../../utils/getSelectedMachine'
import { Machine } from '../../shared/types'
import { MachineHateoasDto } from '@island.is/clients/aosh/transfer-of-machine-ownership'

export const AdditionalMachineSubSection: FC<
  React.PropsWithChildren<FieldBaseProps>
> = (props) => {
  const { application, field, setFieldLoadingState } = props

  const { formatMessage } = useLocale()
  const { id } = field
  const machine = getSelectedMachine(
    application.externalData,
    application.answers,
  ) as Machine

  const { data, loading, error } = useQuery<{
    aoshMachineDetails: MachineHateoasDto
  }>(
    gql`
      ${GET_MACHINE_DETAILS}
    `,
    {
      variables: {
        id: machine.id,
      },
    },
  )

  useEffect(() => {
    setFieldLoadingState?.(loading || !!error)
  }, [loading, error])

  return !loading && !error ? (
    data?.aoshMachineDetails.id ? (
      <Box>
        <Box marginTop={1}>
          <GridRow>
            <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
              <InputController
                id={`machine.plate`}
                name={`${id}information.labels.machine.plate`}
                defaultValue={data?.aoshMachineDetails.licensePlateNumber || ''}
                label={formatMessage(information.labels.machine.plate)}
                readOnly
              />
            </GridColumn>
            <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
              <InputController
                id={`machine.ownerNumber`}
                name={`${id}information.labels.machine.ownerNumber`}
                defaultValue={data?.aoshMachineDetails.ownerNumber || ''}
                label={formatMessage(information.labels.machine.ownerNumber)}
                readOnly
              />
            </GridColumn>
          </GridRow>
        </Box>
      </Box>
    ) : null
  ) : error ? (
    <Box marginTop={3}>
      <AlertMessage
        type="error"
        title={formatMessage(information.labels.machineSubSection.error)}
      />
    </Box>
  ) : null
}
