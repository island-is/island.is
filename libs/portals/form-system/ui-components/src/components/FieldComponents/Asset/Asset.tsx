import { FormSystemField } from '@island.is/api/schema'
import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Dispatch } from 'react'
import { useFormContext } from 'react-hook-form'
import { Action } from '../../../lib'
import { RealEstate } from './components/RealEstate'

interface Props {
  item: FormSystemField
  dispatch?: Dispatch<Action>
  valueIndex?: number
}

export const Asset = ({ item, dispatch, valueIndex = 0 }: Props) => {
  const { control } = useFormContext()
  const { formatMessage } = useLocale()
  const { assetType, isDropdown } = item.fieldSettings || {}

  return (
    <Box marginBottom={2}>
      {assetType === 'realEstate' && (
        <RealEstate isDropdown={isDropdown ?? false} />
      )}
    </Box>
  )
}

export default Asset
