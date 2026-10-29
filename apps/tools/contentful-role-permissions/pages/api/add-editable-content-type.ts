import type { NextApiRequest, NextApiResponse } from 'next'
import slugify from '@sindresorhus/slugify'

import {
  buildRolePolicies,
  extractInitialRoleNamesThatCanReadAllAssetsFromRoles,
  getAllContentTypesInAscendingOrder,
  getAllTags,
  getContentfulManagementApiClient,
  getTagNameToTagIdMap,
  policiesAreEditable,
  policiesAreReadOnlyEntries,
} from '../../utils'

interface RequestBody {
  roleId: string
  contentTypeId: string
}

// Adds a content type to a role's editable entries while keeping the rest of
// the role as is (same result as toggling it on in the UI and pressing save)
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { roleId, contentTypeId } = JSON.parse(req.body) as RequestBody

  const client = getContentfulManagementApiClient()

  // Fetch the role fresh so we never overwrite changes with stale page data
  const [role, contentTypes, tags] = await Promise.all([
    client.role.get({ roleId }),
    getAllContentTypesInAscendingOrder(),
    getAllTags(),
  ])

  if (!contentTypes.some((contentType) => contentType.sys.id === contentTypeId))
    return res
      .status(400)
      .json({ message: `No content type exists with id: ${contentTypeId}` })

  const tagsMap = getTagNameToTagIdMap(tags)
  const tagName = slugify(role.name)
  const tagId = tagsMap.get(tagName)

  if (!tagId) {
    return res
      .status(400)
      .json({ message: `No tag exists with tag name: ${tagName}` })
  }

  const scopedEditableContentTypeIds = new Set(
    contentTypes
      .filter((contentType) => policiesAreEditable(role, contentType))
      .map((contentType) => contentType.sys.id),
  )
  scopedEditableContentTypeIds.add(contentTypeId)

  const globallyReadableContentTypeIds = new Set(
    contentTypes
      .filter((contentType) => policiesAreReadOnlyEntries(role, contentType))
      .map((contentType) => contentType.sys.id),
  )

  const canReadAllAssets =
    extractInitialRoleNamesThatCanReadAllAssetsFromRoles([role], tagsMap)
      .length > 0

  const policies = buildRolePolicies({
    scopedEditableContentTypeIds,
    globallyReadableContentTypeIds,
    canReadAllAssets,
    tagId,
  })

  const updatedRole = await client.role.update(
    { roleId: role.sys.id },
    {
      ...role,
      policies,
    },
  )

  return res.status(200).json(updatedRole)
}

export default handler
