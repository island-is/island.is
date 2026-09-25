/**
 * DEV-ONLY mock for the primary-school overview's BASE student info (school,
 * contact teacher, home room), used only to preview the page without the
 * students X-Road endpoint.
 *
 * The key-information sections (Aðstandendur / Tungumálaumhverfi /
 * Heilsufarsupplýsingar) are no longer mocked here — they now go through the
 * education GraphQL API, which returns mocked MMS payloads from
 * libs/clients/mms/primary-school until the X-Road client is connected. See
 * usePrimarySchoolKeyInfo.ts.
 *
 * This flag now ONLY shims the base student info (school / contact teacher /
 * home room), which comes from the separate, real `primarySchoolStudent`
 * (getStudents) X-Road endpoint — unavailable locally without the X-Road proxy.
 * Keeping it `true` lets the overview render so the key-info sections (real
 * GraphQL → backend mock) are visible in local preview. Set to `false` only
 * when running against an environment where the students endpoint returns data.
 */
import type { PrimarySchoolStudentOverviewQuery } from '../PrimarySchoolStudentOverview.generated'

/** DEV: shims the base student info so the overview renders without the
 * students X-Road endpoint. See the file header. */
export const USE_MOCK_KEY_INFO = true

/** Base student info — normally from usePrimarySchoolStudentOverviewQuery. */
export const mockStudent: NonNullable<
  PrimarySchoolStudentOverviewQuery['primarySchoolStudent']
> = {
  id: 'mock-student',
  name: 'Anna Björg Ólafsdóttir',
  schoolName: 'Melaskóli',
  contactTeacherName: 'Sigríður Halldórsdóttir',
  homeRoomName: '4. BE',
}
