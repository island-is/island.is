import { FieldBaseProps } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { FC } from 'react'
import { PlateOwnership } from '../../shared'
import { PlateSelectField } from './PlateSelectField'
import { PlateRadioField } from './PlateRadioField'

export const PlateField: FC<FieldBaseProps> = (props) => {
  const { application } = props
  const myPlateOwnershipList = application.externalData['myPlateOwnershipList']
    .data as PlateOwnership[]
  console.log(application, myPlateOwnershipList)
  return (
    <Box paddingTop={2}>
      {myPlateOwnershipList.length > 1 ? (
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
