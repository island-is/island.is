import { Inject, Injectable } from '@nestjs/common'
import chunk from 'lodash/chunk'
import { ClientAPI, Entry, Environment } from 'contentful-management'
import { EN_LOCALE, ENVIRONMENT, LOCALE, SPACE_ID } from '../constants'
import { TEAM_MEMBER_CONTENT_TYPE } from './constants'
import { GraphPhoto, StaffField, StaffMember } from './types'

const link = (linkType: 'Entry' | 'Asset' | 'Upload', id: string) => ({
  sys: { type: 'Link' as const, linkType, id },
})

const tagMetadata = (tagId: string) => ({
  tags: [
    { sys: { type: 'Link' as const, linkType: 'Tag' as const, id: tagId } },
  ],
})

const isNotFound = (error: unknown) =>
  (error as { name?: string })?.name === 'NotFound'

/** Sets or clears one non-localized field */
const setField = (entry: Entry, key: string, value: unknown) => {
  if (value === undefined) {
    delete entry.fields[key]
  } else {
    entry.fields[key] = { [LOCALE]: value }
  }
}

@Injectable()
export class StaffCmsRepository {
  private environment?: Promise<Environment>

  constructor(
    @Inject('contentful-management-client')
    private readonly client: ClientAPI,
  ) {}

  private getEnvironment() {
    if (!this.environment) {
      this.environment = this.client
        .getSpace(SPACE_ID)
        .then((space) => space.getEnvironment(ENVIRONMENT))
    }
    return this.environment
  }

  async getTeamList(teamListId: string): Promise<Entry> {
    return (await this.getEnvironment()).getEntry(teamListId)
  }

  async getTeamMembers(ids: Array<string>): Promise<Array<Entry>> {
    const environment = await this.getEnvironment()
    const entries: Array<Entry> = []
    for (const idChunk of chunk(ids, 50)) {
      const response = await environment.getEntries({
        content_type: TEAM_MEMBER_CONTENT_TYPE,
        'sys.id[in]': idChunk.join(','),
        limit: 1000,
      })
      entries.push(...response.items)
    }
    return entries
  }

  /** Creates (or reuses) the person's photo asset and returns its id */
  async upsertPhotoAsset(
    assetId: string,
    title: string,
    photo: GraphPhoto,
    tagId: string,
  ): Promise<string> {
    const environment = await this.getEnvironment()
    try {
      // TODO: replace the file when the photo changes in Entra ID
      await environment.getAsset(assetId)
      return assetId
    } catch (error) {
      if (!isNotFound(error)) throw error
    }

    const upload = await environment.createUpload({ file: photo.data })
    const file = {
      fileName: `${assetId}.jpg`,
      contentType: photo.contentType,
      uploadFrom: link('Upload', upload.sys.id),
    }
    const asset = await environment.createAssetWithId(assetId, {
      fields: {
        title: { [LOCALE]: title, [EN_LOCALE]: title },
        // The en locale has no fallback, so it gets the same file
        file: { [LOCALE]: file, [EN_LOCALE]: file },
      },
      metadata: tagMetadata(tagId),
    })
    const processed = await asset.processForAllLocales()
    await processed.publish()
    return assetId
  }

  async createTeamMember(
    member: StaffMember,
    photoAssetId: string,
    tagId: string,
  ): Promise<Entry> {
    const environment = await this.getEnvironment()
    const entry = await environment.createEntryWithId(
      TEAM_MEMBER_CONTENT_TYPE,
      member.entryId,
      {
        fields: {
          name: { [LOCALE]: member.name },
          title: member.title,
          mynd: { [LOCALE]: link('Asset', photoAssetId) },
          ...(member.email && { email: { [LOCALE]: member.email } }),
          ...(member.phone && { phone: { [LOCALE]: member.phone } }),
          filterTags: {
            [LOCALE]: member.filterTagIds.map((id) => link('Entry', id)),
          },
        },
        metadata: tagMetadata(tagId),
      },
    )
    return entry.publish()
  }

  /** Updates only the given fields, everything else editors set is kept */
  async updateTeamMember(
    entry: Entry,
    member: StaffMember,
    changedFields: Array<StaffField>,
    unarchive: boolean,
  ): Promise<Entry> {
    let current = unarchive ? await entry.unarchive() : entry

    for (const field of changedFields) {
      switch (field) {
        case 'name':
          setField(current, 'name', member.name)
          break
        case 'title':
          current.fields.title = { ...member.title }
          break
        case 'email':
          setField(current, 'email', member.email)
          break
        case 'phone':
          setField(current, 'phone', member.phone)
          break
        case 'filterTags':
          setField(
            current,
            'filterTags',
            member.filterTagIds.map((id) => link('Entry', id)),
          )
          break
      }
    }

    if (changedFields.length > 0) {
      current = await current.update()
    }
    return current.publish()
  }

  /** Unpublishes and archives, never deletes */
  async archiveTeamMember(entry: Entry): Promise<void> {
    if (entry.isArchived()) return
    const unpublished = entry.isPublished() ? await entry.unpublish() : entry
    await unpublished.archive()
  }

  async setTeamListMembers(teamList: Entry, ids: Array<string>) {
    teamList.fields.teamMembers = {
      [LOCALE]: ids.map((id) => link('Entry', id)),
    }
    const updated = await teamList.update()
    return updated.publish()
  }
}
