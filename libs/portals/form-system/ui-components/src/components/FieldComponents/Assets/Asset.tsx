import { FormSystemField } from 'libs/api/schema/src/lib/schema'
import { ApplicationState } from '../../../lib'
import { Vehicle } from './Vehicle'

interface Props {
  state?: ApplicationState
  item: FormSystemField
  valueIndex?: number
}
export const Asset = ({ state, item, valueIndex }: Props) => {
  if (item?.fieldSettings?.assetType === 'VEHICLE') {
    return <Vehicle state={state} item={item} valueIndex={valueIndex} />
  }
}
