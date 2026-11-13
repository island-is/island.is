/**
 * One organization whose staff list on island.is is synced from its Entra ID.
 * Credentials and the Entra ID group come from env variables, see the README.
 */
export interface AdStaffSource {
  /** Short key used in env variable names and entry ids, e.g. `rgr` */
  key: string
  /** The teamList entry the synced staff members are listed in */
  teamListId: string
  /** Tag added to created entries and assets so the organization's editors can edit them */
  contentfulTagId: string
  /** Asset used when a person has no photo in Entra ID (teamMember.mynd is required) */
  placeholderPhotoAssetId: string
  /** Entra ID department name -> genericTag entry id (teamMember.filterTags) */
  departmentTagIds: Record<string, string>
  /** Icelandic job title -> English job title. Falls back to the Icelandic title */
  englishJobTitles?: Record<string, string>
}

export interface GraphUser {
  id: string
  displayName?: string | null
  jobTitle?: string | null
  department?: string | null
  mail?: string | null
  businessPhones?: Array<string> | null
  accountEnabled?: boolean | null
}

export interface GraphPhoto {
  data: ArrayBuffer
  contentType: string
}

/** A staff member as Entra ID says they should appear on island.is */
export interface StaffMember {
  entryId: string
  adObjectId: string
  name: string
  title: { 'is-IS': string; en: string }
  email?: string
  phone?: string
  filterTagIds: Array<string>
}

/** The fields of an existing teamMember entry that the sync owns */
export interface ExistingStaffEntry {
  id: string
  name?: string
  title: { 'is-IS'?: string; en?: string }
  email?: string
  phone?: string
  filterTagIds: Array<string>
  isArchived: boolean
  /** False when a previous run created the entry but publishing failed */
  isPublished: boolean
  /** Edited in Contentful but not published, the sync leaves it alone */
  hasUnpublishedChanges: boolean
}

export type StaffField = 'name' | 'title' | 'email' | 'phone' | 'filterTags'

export interface StaffSyncPlan {
  create: Array<StaffMember>
  update: Array<{
    member: StaffMember
    changedFields: Array<StaffField>
    unarchive: boolean
  }>
  /** Removed from the team list and archived, never deleted */
  remove: Array<string>
  skipped: Array<{ entryId: string; reason: string }>
  /** The team list after the sync: manually added members are kept as they are */
  teamMemberIds: Array<string>
  teamListChanged: boolean
}
