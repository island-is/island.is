import { FormSystemField } from '@island.is/api/schema'
import { FamilyTypes } from '@island.is/form-system/enums'
import { Dispatch } from 'react'
import { Action, ApplicationState } from '../../../lib'
import { Child } from './Child'
import { Estate } from './Estate'
import { Spouse } from './Spouse'

interface Props {
  state?: ApplicationState
  item: FormSystemField
  valueIndex?: number
  dispatch?: Dispatch<Action>
  isPreview?: boolean
}

export const Family = ({
  state,
  item,
  valueIndex,
  dispatch,
  isPreview = false,
}: Props) => {
  switch (item.fieldSettings?.familyType) {
    case FamilyTypes.CHILD:
      return (
        <Child
          item={item}
          valueIndex={valueIndex}
          dispatch={dispatch}
          isPreview={isPreview}
        />
      )
    case FamilyTypes.SPOUSE:
      return (
        <Spouse
          item={item}
          valueIndex={valueIndex}
          dispatch={dispatch}
          isPreview={isPreview}
        />
      )
    case FamilyTypes.NATIONAL_ID_ESTATE:
      return <Estate item={item} valueIndex={valueIndex} dispatch={dispatch} />
    default:
      return null
  }
}
