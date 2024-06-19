import { MappedData } from '@island.is/content-search-indexer/types'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import type { ITeamList } from '../../generated/contentfulTypes'
import { CmsSyncProvider, processSyncDataInput } from '../cmsSync.service'
import { mapTeamMember } from '../../models/teamMember.model'

@Injectable()
export class SupportQNASyncService implements CmsSyncProvider<ITeamList> {
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
            dateUpdated: new Date().getTime().toString(),
          })
        } catch (error) {
          logger.warn('Failed to import Team Member', {
            error: error.message,
            id: teamMemberEntry?.sys?.id,
          })
        }
      }
    }

    return teamMembers
  }
}
