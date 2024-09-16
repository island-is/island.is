import { MappedData } from '@island.is/content-search-indexer/types'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import type { ITeamList } from '../../generated/contentfulTypes'
import { CmsSyncProvider, processSyncDataInput } from '../cmsSync.service'
import { mapTeamList } from '../../models/teamList.model'

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

    return teamMembers
  }
}
