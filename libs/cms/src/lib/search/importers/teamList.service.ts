import { Injectable } from '@nestjs/common'
import { logger } from '@island.is/logging'
import type { MappedData } from '@island.is/content-search-indexer/types'
import type { ITeamList } from '../../generated/contentfulTypes'
import { mapTeamList } from '../../models/teamList.model'
import type { CmsSyncProvider, processSyncDataInput } from '../cmsSync.service'
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
      const teamList = mapTeamList(teamListEntry)
      for (const member of teamList.teamMembers ?? []) {
        try {
          const content = member.name ? member.name : undefined
          teamMembers.push({
            _id: member.id,
            title: member.name,
            content,
            contentWordCount: content?.split(/\s+/).length,
            type: 'webTeamMember',
            response: JSON.stringify({
              ...member,
              typename: 'webTeamMember',
            }),
            tags: [
              { key: teamListEntry.sys.id, type: 'referencedBy' },
              ...(member.filterTags ?? []).map((tag) => ({
                key: tag.slug,
                type: 'genericTag',
              })),
            ],
            dateCreated: member.createdAt ?? '',
            dateUpdated: new Date().getTime().toString(),
          })
        } catch (error) {
          logger.warn('Failed to import Team Member', {
            error: error.message,
            id: member?.id,
          })
        }
      }
    }

    return teamMembers.concat(
      // Append the team list document tagged with the ids of its members so we can later look up what list a member belongs to
      entries.map((teamListEntry) => {
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
