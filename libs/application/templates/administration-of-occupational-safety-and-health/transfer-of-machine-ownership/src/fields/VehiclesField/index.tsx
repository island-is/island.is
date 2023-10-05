import { FieldBaseProps } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { FC, useCallback, useEffect } from 'react'
import { VehicleSelectField } from './VehicleSelectField'
import { VehicleRadioField } from './VehicleRadioField'
import { useFormContext } from 'react-hook-form'
import { VehiclesCurrentVehicle } from '../../shared'
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
  console.log("application", application);
  const currentVehicleList = []as VehiclesCurrentVehicle[];//application?.externalData.currentVehicleList
    //.data as VehiclesCurrentVehicle[]

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
      {currentVehicleList.length > 5 ? (
        <VehicleSelectField
          currentVehicleList={currentVehicleList}
          {...props}
        />
      ) : (
        <VehicleRadioField currentVehicleList={currentVehicleList} {...props} />
      )}
    </Box>
  )
}
