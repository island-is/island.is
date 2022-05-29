import { Injectable } from '@nestjs/common'
import { createClient as createManagementClient } from 'contentful-management'
import { ClientAPI } from 'contentful-management/dist/typings/create-contentful-api'
import { TagProps } from 'contentful-management/dist/typings/entities/tag'
import { Entry } from './types'

const SPACE_ID = '8k0h54kbe6bj'
const ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || 'master'
const MAX_TAGS_PER_ENVIRONMENT = 500

const mapTagsToSysObjects = (tags?: TagProps[]) => {
  return (
    tags?.map((t) => ({
      sys: { type: 'Link', linkType: 'Tag', id: t.sys.id },
    })) ?? []
  )
}

@Injectable()
export class AppRepository {
  // https://www.contentful.com/developers/docs/references/content-management-api/
  private managementClient!: ClientAPI

  private getManagementClient() {
    if (!this.managementClient)
      this.managementClient = createManagementClient({
        accessToken: process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN as string,
      })
    return this.managementClient
  }

  async getUserSpaceRoles(userId: string) {
    const managementClient = this.getManagementClient()
    const space = await managementClient.getSpace(SPACE_ID)
    const user = await space.getSpaceMember(userId)
    const roles = await Promise.all(
      user.roles.map((roleLink) => space.getRole(roleLink.sys.id)),
    )
    return roles
  }

  async tagEntry(entry: Entry, tags: string[]) {
    const managementClient = this.getManagementClient()
    const space = await managementClient.getSpace(SPACE_ID)
    const environment = await space.getEnvironment(ENVIRONMENT)
    const entryFromServer = await environment.getEntry(entry.sys.id)
    const { items: allTagsFromServer } = await environment.getTags({
      limit: MAX_TAGS_PER_ENVIRONMENT,
    })
    const tagsToApply = allTagsFromServer.filter((serverTag) =>
      tags.includes(serverTag.name),
    )

    // Since we need to cut fields from the entry in order to update it we need to interpret it as any, otherwise we get a type error
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updatedEntry = entryFromServer as any

    updatedEntry.metadata = {
      tags: [
        ...mapTagsToSysObjects(entryFromServer.metadata?.tags),
        ...mapTagsToSysObjects(tagsToApply),
      ],
    }

    await updatedEntry.update()

    // TODO: think about what should really be returned
    return updatedEntry
  }
}
