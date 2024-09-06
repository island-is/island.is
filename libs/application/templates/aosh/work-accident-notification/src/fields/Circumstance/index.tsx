import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import { Box } from '@island.is/island-ui/core'
import { getValueViaPath } from '@island.is/application/core'
import { MultiSelectController } from '../Components/MultiSelectController'

export type SpecificPhysicalActivityGroup = {
  Code: number
  LabelIs: string
  LabelEn: string
  ValidToSelect: number
}

export type SpecificPhysicalActivity = {
  Code: number
  FK_Group: number
  LabelIs: string
  LabelEn: string
  ValidToSelect: number
}

export const Circumstance: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { application } = props
  const activitiesGroups = getValueViaPath(
    application.externalData,
    'aoshData.data.specificPhysicalActivityGroups',
  )
  const activites = getValueViaPath(
    application.externalData,
    'aoshData.data.activites',
  )

  return (
    <Box>
      <MultiSelectController groups={[]} items={[]} {...props} />
    </Box>
  )
}
