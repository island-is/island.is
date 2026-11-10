import { Injectable } from '@nestjs/common'
import { logger } from '@island.is/logging'
import { Entry } from 'contentful-management'
import { LOCALE } from '../constants'
import { MicrosoftGraphClient } from '../repositories/microsoft-graph/microsoftGraph.client'
import { AdStaffSourceSettings, getSourceSettings, isDryRun } from './config'
import { AD_STAFF_SOURCES } from './constants'
import {
  getStaffPhotoAssetId,
  isSyncedEntryId,
  mapEntryToExistingStaffEntry,
  mapGraphUserToStaffMember,
} from './mapper'
import { checkPlanSafety, planStaffSync } from './planner'
import { StaffCmsRepository } from './staffCms.repository'
import { AdStaffSource, StaffMember, StaffSyncPlan } from './types'

@Injectable()
export class AdStaffImportService {
  constructor(private readonly cms: StaffCmsRepository) {}

  async run() {
    const dryRun = isDryRun()
    logger.info('AD staff import starting', { dryRun })

    let failed = false
    for (const source of AD_STAFF_SOURCES) {
      const settings = getSourceSettings(source.key)
      if (!settings) {
        logger.info('AD staff source not configured, skipping', {
          source: source.key,
        })
        continue
      }
      try {
        await this.syncSource(source, settings, dryRun)
      } catch (error) {
        failed = true
        logger.error('AD staff source failed', {
          source: source.key,
          error: error instanceof Error ? error.message : error,
        })
      }
    }

    if (failed) {
      throw new Error('One or more AD staff sources failed')
    }
    logger.info('AD staff import finished')
  }

  private async syncSource(
    source: AdStaffSource,
    settings: AdStaffSourceSettings,
    dryRun: boolean,
  ) {
    const graph = new MicrosoftGraphClient(settings.credentials)
    const users = await graph.getGroupUsers(settings.groupId)

    const desired: Array<StaffMember> = []
    const retainedIds: Array<string> = []
    for (const user of users) {
      const result = mapGraphUserToStaffMember(source, user)
      if (result.ok) {
        desired.push(result.member)
        for (const warning of result.warnings) {
          logger.warn(`AD staff member: ${warning}`, {
            source: source.key,
            entryId: result.member.entryId,
          })
        }
      } else {
        if (result.retain) retainedIds.push(result.entryId)
        logger.warn(`AD staff member skipped: ${result.reason}`, {
          source: source.key,
          entryId: result.entryId,
        })
      }
    }

    const teamList = await this.cms.getTeamList(source.teamListId)
    const currentTeamMemberIds = (
      (teamList.fields.teamMembers?.[LOCALE] ?? []) as Array<{
        sys: { id: string }
      }>
    ).map((link) => link.sys.id)
    const syncedIdsInList = currentTeamMemberIds.filter((id) =>
      isSyncedEntryId(source, id),
    )

    const entries = await this.cms.getTeamMembers([
      ...new Set([
        ...syncedIdsInList,
        ...desired.map((member) => member.entryId),
      ]),
    ])
    const entriesById = new Map(entries.map((entry) => [entry.sys.id, entry]))

    const plan = planStaffSync({
      source,
      desired,
      existing: entries.map(mapEntryToExistingStaffEntry),
      currentTeamMemberIds,
      retainedIds,
    })

    logger.info('AD staff sync plan', {
      source: source.key,
      dryRun,
      groupUsers: users.length,
      create: plan.create.map((member) => member.entryId),
      update: plan.update.map(({ member, changedFields, unarchive }) => ({
        entryId: member.entryId,
        changedFields,
        unarchive,
      })),
      remove: plan.remove,
      skipped: plan.skipped,
      teamListChanged: plan.teamListChanged,
    })

    const safetyError = checkPlanSafety(plan, syncedIdsInList.length)
    if (safetyError) {
      throw new Error(safetyError)
    }
    if (dryRun) {
      logger.info('Dry run, nothing written to Contentful', {
        source: source.key,
      })
      return
    }

    await this.applyPlan({
      source,
      plan,
      graph,
      teamList,
      currentTeamMemberIds,
      entriesById,
    })
  }

  private async applyPlan({
    source,
    plan,
    graph,
    teamList,
    currentTeamMemberIds,
    entriesById,
  }: {
    source: AdStaffSource
    plan: StaffSyncPlan
    graph: MicrosoftGraphClient
    teamList: Entry
    currentTeamMemberIds: Array<string>
    entriesById: Map<string, Entry>
  }) {
    let failures = 0
    const failedCreates = new Set<string>()
    const fail = (entryId: string, action: string, error: unknown) => {
      failures += 1
      logger.error(`AD staff ${action} failed`, {
        source: source.key,
        entryId,
        error: error instanceof Error ? error.message : error,
      })
    }

    for (const member of plan.create) {
      try {
        const photo = await graph.getUserPhoto(member.adObjectId)
        const photoAssetId = photo
          ? await this.cms.upsertPhotoAsset(
              getStaffPhotoAssetId(member.entryId),
              member.name,
              photo,
              source.contentfulTagId,
            )
          : source.placeholderPhotoAssetId
        await this.cms.createTeamMember(
          member,
          photoAssetId,
          source.contentfulTagId,
        )
      } catch (error) {
        failedCreates.add(member.entryId)
        fail(member.entryId, 'create', error)
      }
    }

    for (const { member, changedFields, unarchive } of plan.update) {
      const entry = entriesById.get(member.entryId)
      if (!entry) continue
      try {
        await this.cms.updateTeamMember(entry, member, changedFields, unarchive)
      } catch (error) {
        fail(member.entryId, 'update', error)
      }
    }

    // The list is published before anything is archived, so it never links an archived entry
    let listUpdated = !plan.teamListChanged
    if (plan.teamListChanged) {
      if (teamList.isUpdated()) {
        logger.warn(
          'Team list has unpublished changes in Contentful, not updating it',
          { source: source.key, teamListId: teamList.sys.id },
        )
      } else {
        try {
          await this.cms.setTeamListMembers(
            teamList,
            plan.teamMemberIds.filter((id) => !failedCreates.has(id)),
          )
          listUpdated = true
        } catch (error) {
          fail(teamList.sys.id, 'team list update', error)
        }
      }
    }

    for (const entryId of plan.remove) {
      const entry = entriesById.get(entryId)
      if (!entry) continue
      if (!listUpdated && currentTeamMemberIds.includes(entryId)) {
        // Still linked from the published list, archived on a later run
        continue
      }
      try {
        await this.cms.archiveTeamMember(entry)
      } catch (error) {
        fail(entryId, 'archive', error)
      }
    }

    if (failures > 0) {
      throw new Error(`${failures} staff changes failed`)
    }
  }
}
