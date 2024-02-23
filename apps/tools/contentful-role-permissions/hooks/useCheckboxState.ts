import { useState } from 'react'
import { ContentTypeProps, RoleProps } from 'contentful-management'

import {
  extractInitialCheckboxStateFromRolesAndContentTypes,
  extractInitialReadonlyCheckboxStateFromRolesAndContentTypes,
} from '../utils'

export const useCheckboxState = (
  type: 'readonly' | 'edit',
  role: RoleProps,
  contentTypes: ContentTypeProps[],
) => {
  const initialStateFunction =
    type === 'readonly'
      ? extractInitialReadonlyCheckboxStateFromRolesAndContentTypes
      : extractInitialCheckboxStateFromRolesAndContentTypes

  const [initialState, setInitialState] = useState(
    initialStateFunction([role], contentTypes)[role.name],
  )
  const [currentState, setCurrentState] = useState(initialState)

  return {
    initialState,
    setInitialState,
    currentState,
    setCurrentState,
  }
}
