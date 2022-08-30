import slugify from '@sindresorhus/slugify'
import {
  ContentTypeProps,
  Role,
  RoleProps,
  TagProps,
} from 'contentful-management'
import type { NextApiRequest, NextApiResponse } from 'next'
import {
  applyAssetPolicies,
  applyEditEntryPolicies,
  applyReadOnlyEntryPolicies,
  extractInitialCheckboxStateFromRolesAndContentTypes,
  extractInititalReadonlyCheckboxStateFromRolesAndContentTypes,
  getAllContentTypesInAscendingOrder,
  getAllRoles,
  getContentfulManagementApiClient,
} from '../../utils'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const data = JSON.parse(req.body) as {
    checkboxState: ReturnType<
      typeof extractInitialCheckboxStateFromRolesAndContentTypes
    >
    readonlyCheckboxState: ReturnType<
      typeof extractInititalReadonlyCheckboxStateFromRolesAndContentTypes
    >
    roleNamesThatCanReadAllAssets: string[]
    tags: TagProps[]
  }

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

    for (const contentTypeName in data.checkboxState[roleName]) {
      const contentType = contentTypesMap.get(contentTypeName)
      if (!contentType) continue

      const checked = data.checkboxState[roleName][contentTypeName]
      if (!checked) continue

      const readOnlyChecked =
        data.readonlyCheckboxState?.[roleName]?.[contentTypeName]

      applyEditEntryPolicies(policies, contentType, tagId)

      if (readOnlyChecked) {
        applyReadOnlyEntryPolicies(policies, contentType)
      }
    }

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
