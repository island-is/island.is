import { Entry } from 'contentful-management'
import { EN_LOCALE, LOCALE } from '../constants'
import { ENTRY_ID_PREFIX } from './constants'
import {
  AdStaffSource,
  ExistingStaffEntry,
  GraphUser,
  StaffMember,
} from './types'

export const getStaffEntryId = (source: AdStaffSource, adObjectId: string) =>
  `${ENTRY_ID_PREFIX}-${source.key}-${adObjectId}`

export const getStaffPhotoAssetId = (entryId: string) => `${entryId}-photo`

/** Only entries created by the sync are ever changed or archived by it */
export const isSyncedEntryId = (source: AdStaffSource, entryId: string) =>
  entryId.startsWith(`${ENTRY_ID_PREFIX}-${source.key}-`)

export type StaffMemberMapResult =
  | { ok: true; member: StaffMember; warnings: Array<string> }
  | {
      ok: false
      entryId: string
      reason: string
      /** Keep an existing entry: the person is still in the group, the data is just incomplete */
      retain: boolean
    }

export const mapGraphUserToStaffMember = (
  source: AdStaffSource,
  user: GraphUser,
): StaffMemberMapResult => {
  const entryId = getStaffEntryId(source, user.id)
  const name = user.displayName?.trim()
  const jobTitle = user.jobTitle?.trim()

  if (user.accountEnabled === false) {
    return { ok: false, entryId, reason: 'account disabled', retain: false }
  }
  if (!name) {
    return { ok: false, entryId, reason: 'missing name', retain: true }
  }
  if (!jobTitle) {
    return { ok: false, entryId, reason: 'missing job title', retain: true }
  }

  const warnings: Array<string> = []
  const department = user.department?.trim()
  const departmentTagId = department
    ? source.departmentTagIds[department]
    : undefined
  if (department && !departmentTagId) {
    warnings.push(`unknown department "${department}"`)
  }

  return {
    ok: true,
    warnings,
    member: {
      entryId,
      adObjectId: user.id,
      name,
      title: {
        [LOCALE]: jobTitle,
        [EN_LOCALE]: source.englishJobTitles?.[jobTitle] ?? jobTitle,
      },
      email: user.mail?.trim() || undefined,
      // Work numbers only, mobile numbers are personal
      phone:
        user.businessPhones?.map((phone) => phone.trim()).find(Boolean) ||
        undefined,
      filterTagIds: departmentTagId ? [departmentTagId] : [],
    },
  }
}

type LinkField = Array<{ sys: { id: string } }>

export const mapEntryToExistingStaffEntry = (
  entry: Entry,
): ExistingStaffEntry => {
  const fields = entry.fields
  return {
    id: entry.sys.id,
    name: fields.name?.[LOCALE],
    title: {
      [LOCALE]: fields.title?.[LOCALE],
      [EN_LOCALE]: fields.title?.[EN_LOCALE],
    },
    email: fields.email?.[LOCALE],
    phone: fields.phone?.[LOCALE],
    filterTagIds: ((fields.filterTags?.[LOCALE] ?? []) as LinkField).map(
      (link) => link.sys.id,
    ),
    isArchived: entry.isArchived(),
    isPublished: entry.isPublished(),
    hasUnpublishedChanges: entry.isUpdated(),
  }
}
