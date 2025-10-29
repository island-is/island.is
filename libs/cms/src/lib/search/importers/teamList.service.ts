import { Injectable } from '@nestjs/common'
import { logger } from '@island.is/logging'
import type { MappedData } from '@island.is/content-search-indexer/types'
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer'
import type { ITeamList } from '../../generated/contentfulTypes'
import { mapTeamList } from '../../models/teamList.model'
import type { CmsSyncProvider, processSyncDataInput } from '../cmsSync.service'
import { extractChildEntryIds } from './utils'

@Injectable()
export class TeamListSyncService implements CmsSyncProvider<ITeamList> {
  processSyncData(entries: processSyncDataInput<ITeamList>) {
    const entriesToUpdate = entries.filter(
      (entry) => entry.sys.contentType.sys.id === 'teamList',
    )
    return {
      entriesToUpdate,
      entriesToDelete: [],
    }
  }

  doMapping(entries: ITeamList[]): MappedData[] {
    if (entries.length > 0) {
      logger.info('Mapping Team List', { count: entries.length })
    }

    const teamMembers: MappedData[] = []

    const dateUpdated = new Date().getTime().toString()

    for (const teamListEntry of entries) {
      const teamList = mapTeamList(teamListEntry)
      let counter = teamList.teamMembers?.length ?? 9999
      for (const member of teamList.teamMembers ?? []) {
        if (!member.name) {
          continue
        }
        try {
          const memberEntry = teamListEntry.fields.teamMembers?.find(
            (m) => m.sys.id === member.id,
          )
          const contentSection: string[] = []

          contentSection.push(
            memberEntry?.fields?.intro
              ? documentToPlainTextString(memberEntry.fields.intro)
              : '',
          )
          if (member.title) {
            contentSection.push(member.title)
          }

          const content = contentSection.join(' ')
          teamMembers.push({
            _id: member.id,
            title: member.name.toLowerCase(),
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
            // Use the release date field as a way to order search results in the  same order as the team members list in the CMS
            releaseDate: String(counter--),
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
      // Append the team list document tagged with the id's of its members so we can later look up what list a member belongs to
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
