import slugify from '@sindresorhus/slugify'
import {
  ContentTypeProps,
  Role,
  RoleProps,
  TagProps,
} from 'contentful-management'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { CheckboxState } from '../../types'
import {
  applyAssetPolicies,
  applyEntryEditPolicies,
  applyEntryGlobalReadPolicies,
  getAllContentTypesInAscendingOrder,
  getAllRoles,
  getContentfulManagementApiClient,
} from '../../utils'

interface RequestBody {
  checkboxState: CheckboxState
  readonlyCheckboxState: CheckboxState
  roleNamesThatCanReadAllAssets: string[]
  tags: TagProps[]
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const data = JSON.parse(req.body) as RequestBody

  const client = getContentfulManagementApiClient()

  const rolesMap = new Map<string, RoleProps>()
  const contentTypesMap = new Map<string, ContentTypeProps>()

  const roles = await getAllRoles()
  for (const role of roles) {
    rolesMap.set(role.name, role)
  }

  const contentTypes = await getAllContentTypesInAscendingOrder()
  for (const contentType of contentTypes) {
    contentTypesMap.set(contentType.name, contentType)
  }

  const roleNamesThatCanReadAllAssetsSet = new Set(
    data.roleNamesThatCanReadAllAssets,
  )

  const tagsMap = new Map(data.tags.map((tag) => [tag.name, tag.sys.id]))

  const updateQueries = []

  for (const roleName in data.checkboxState) {
    const role = rolesMap.get(roleName)
    if (!role) continue
    const tagName = slugify(roleName)

    if (!tagsMap.has(tagName)) {
      console.log(`No tag exists with tag name: ${tagName}`)
      return res
        .status(500)
        .json({ message: `No tag exists with tag name: ${tagName}` })
    }

    const tagId = tagsMap.get(tagName)

    const policies: Role['policies'] = []

    const globallyReadableContentTypeIds = new Set<string>()

    // Gather all content types we want the user to be able to read globally
    for (const contentTypeName in data.readonlyCheckboxState[roleName]) {
      const contentType = contentTypesMap.get(contentTypeName)
      if (!contentType) continue

      const checked = data.readonlyCheckboxState[roleName][contentTypeName]
      if (!checked) continue

      globallyReadableContentTypeIds.add(contentType.sys.id)
    }

    const scopedEditableContentTypeIds = new Set<string>()

    // Gather all "scoped" (only editable if there's a tag) editable content types
    for (const contentTypeName in data.checkboxState[roleName]) {
      const contentType = contentTypesMap.get(contentTypeName)
      if (!contentType) continue

      const checked = data.checkboxState[roleName][contentTypeName]
      if (!checked) continue

      scopedEditableContentTypeIds.add(contentType.sys.id)
    }

    applyEntryEditPolicies(
      policies,
      scopedEditableContentTypeIds,
      tagId,
      globallyReadableContentTypeIds,
    )

    applyEntryGlobalReadPolicies(policies, globallyReadableContentTypeIds)

    applyAssetPolicies(
      policies,
      roleNamesThatCanReadAllAssetsSet.has(role.name),
      tagId,
    )

    const updateQuery = client.role.update(
      { roleId: role.sys.id },
      {
        ...role,
        policies,
      },
    )

    updateQueries.push(updateQuery)
  }

  await Promise.all(updateQueries)

  return res.status(200).json(data)
}

export default handler
