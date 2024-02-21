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

  return useState(initialRoleNamesThatCanReadAllAssets.includes(role.name))
}
