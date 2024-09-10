import { MappedData } from '@island.is/content-search-indexer/types'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import type { ITeamList } from '../../generated/contentfulTypes'
import { CmsSyncProvider, processSyncDataInput } from '../cmsSync.service'
import { mapTeamMember } from '../../models/teamMember.model'
import { extractChildEntryIds } from './utils'

@Injectable()
export class TeamListSyncService implements CmsSyncProvider<ITeamList> {
  processSyncData(entries: processSyncDataInput<ITeamList>) {
    return entries.filter(
      (entry) => entry.sys.contentType.sys.id === 'teamList',
    )
  }

  doMapping(entries: ITeamList[]): MappedData[] {
    if (entries.length > 0) {
      logger.info('Mapping Team List', { count: entries.length })
    }

    const teamMembers: MappedData[] = []

    const dateUpdated = new Date().getTime().toString()

    for (const teamListEntry of entries) {
      for (const teamMemberEntry of teamListEntry.fields.teamMembers ?? []) {
        try {
          const content = teamMemberEntry.fields.name
            ? teamMemberEntry.fields.name
            : undefined

          teamMembers.push({
            _id: teamMemberEntry.sys.id,
            title: teamMemberEntry.fields.name,
            content,
            contentWordCount: content?.split(/\s+/).length,
            type: 'webTeamMember',
            response: JSON.stringify({
              ...mapTeamMember(teamMemberEntry),
              typename: 'webTeamMember',
            }),
            tags: [{ key: teamListEntry.sys.id, type: 'referencedBy' }],
            dateCreated: teamMemberEntry.sys.createdAt,
            dateUpdated: dateUpdated,
          })
        } catch (error) {
          logger.warn('Failed to import Team Member', {
            error: error.message,
            id: teamMemberEntry?.sys?.id,
          })
        }
      }
    }

    return teamMembers.concat(
      entries.map((teamListEntry) => {
        // Tag the document with the ids of its children so we can later look up what document a child belongs to
        const childEntryIds = extractChildEntryIds(teamListEntry)
        return {
          _id: teamListEntry.sys.id,
          title: teamListEntry.fields.title ?? '',
          type: 'webTeamList',
          dateCreated: teamListEntry.sys.createdAt,
          dateUpdated: dateUpdated,
          tags: childEntryIds.map((id) => ({
            key: id,
            type: 'hasChildEntryWithId',
          })),
        }
      }),
    )
  }
}
