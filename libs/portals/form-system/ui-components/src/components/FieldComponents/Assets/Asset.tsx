import { FormSystemField } from '@island.is/api/schema'
import { ApplicationState, Action } from '../../../lib'
import { Vehicle } from './Vehicle'
import { Dispatch } from 'react'
import { RealEstate } from './RealEstate'

interface Props {
  state?: ApplicationState
  item: FormSystemField
  valueIndex?: number
  dispatch?: Dispatch<Action>
}
export const Asset = ({ state, item, valueIndex, dispatch }: Props) => {
  if (item?.fieldSettings?.assetType === 'VEHICLE') {
    return (
      <Vehicle
        state={state}
        item={item}
        valueIndex={valueIndex}
        dispatch={dispatch}
      />
    )
  } else if (item?.fieldSettings?.assetType === 'REAL_ESTATE') {
    return (
      <RealEstate
        state={state}
        item={item}
        valueIndex={valueIndex}
        dispatch={dispatch}
      />
    )
  }
}
