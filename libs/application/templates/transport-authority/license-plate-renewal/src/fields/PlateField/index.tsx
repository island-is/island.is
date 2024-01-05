import { FieldBaseProps } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { FC, useCallback, useEffect } from 'react'
import { PlateOwnership } from '../../shared'
import { PlateSelectField } from './PlateSelectField'
import { PlateRadioField } from './PlateRadioField'
import { useMutation } from '@apollo/client'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import { useLocale } from '@island.is/localization'
import { useFormContext } from 'react-hook-form'

export const PlateField: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { locale } = useLocale()
  const { setValue } = useFormContext()
  const { application } = props
  const [updateApplication] = useMutation(UPDATE_APPLICATION)
  const myPlateOwnershipList = application.externalData['myPlateOwnershipList']
    .data as PlateOwnership[]

  // Clean data in case user will choose a new car, since we are only using defaultValue of TextFields
  const updateData = useCallback(async () => {
    await updateApplication({
      variables: {
        input: {
          id: application.id,
          answers: {
            information: undefined,
          },
        },
        locale,
      },
    })
  }, [])

  useEffect(() => {
    setValue('information', undefined)
    updateData()
  }, [setValue])

  return (
    <Box paddingTop={2}>
      {myPlateOwnershipList.length > 5 ? (
        <PlateSelectField
          myPlateOwnershipList={myPlateOwnershipList}
          {...props}
        />
      ) : (
        <PlateRadioField
          myPlateOwnershipList={myPlateOwnershipList}
          {...props}
        />
      )}
    </Box>
  )
}
