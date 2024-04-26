import { useState } from 'react'
import { RoleProps, TagProps } from 'contentful-management'

import {
  extractInitialRoleNamesThatCanReadAllAssetsFromRoles,
  getTagNameToTagIdMap,
} from '../utils'

export const useCanReadAllAssetsState = (role: RoleProps, tags: TagProps[]) => {
  const tagsMap = getTagNameToTagIdMap(tags)

  const initialRoleNamesThatCanReadAllAssets =
    extractInitialRoleNamesThatCanReadAllAssetsFromRoles([role], tagsMap)

  const [initialState, setInitialState] = useState(
    initialRoleNamesThatCanReadAllAssets.includes(role.name),
  )
  const [currentState, setCurrentState] = useState(initialState)

  return {
    initialState,
    setInitialState,
    currentState,
    setCurrentState,
  }
}
