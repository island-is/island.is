import { FieldBaseProps } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { FC, useCallback, useEffect } from 'react'
import { VehicleSelectField } from './VehicleSelectField'
import { VehicleRadioField } from './VehicleRadioField'
import { useFormContext } from 'react-hook-form'
import { Machine, VehiclesCurrentVehicle } from '../../shared'
import { useMutation } from '@apollo/client'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import { useLocale } from '@island.is/localization'

export const VehiclesField: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { locale } = useLocale()
  const { setValue } = useFormContext()
  const { application } = props
  const [updateApplication] = useMutation(UPDATE_APPLICATION)
  const currentMachineList = application?.externalData.machinesList
    .data as Machine[]

  const updateData = useCallback(async () => {
    await updateApplication({
      variables: {
        input: {
          id: application.id,
          answers: {
            sellerCoOwner: [],
          },
        },
        locale,
      },
    })
  }, [])
  useEffect(() => {
    setValue('sellerCoOwner', [])
    updateData()
  }, [setValue])
  return (
    <Box paddingTop={2}>
      {currentMachineList.length > 5 ? (
        <VehicleSelectField
          currentMachineList={currentMachineList}
          {...props}
        />
      ) : (
        <VehicleRadioField currentMachineList={currentMachineList} {...props} />
      )}
    </Box>
  )
}
