import { getStaffEntryId, mapGraphUserToStaffMember } from './mapper'
import { AdStaffSource } from './types'

const source: AdStaffSource = {
  key: 'test',
  teamListId: 'team-list',
  contentfulTagId: 'ownerTest',
  placeholderPhotoAssetId: 'placeholder',
  departmentTagIds: { Greiningarsvið: 'tag-greining' },
  englishJobTitles: { Sálfræðingur: 'Psychologist' },
}

const objectId = '0b3c6f1e-6a1d-4c8e-9a51-2f7d1c0e9b42'

describe('mapGraphUserToStaffMember', () => {
  it('maps an Entra ID user to a staff member', () => {
    const result = mapGraphUserToStaffMember(source, {
      id: objectId,
      displayName: ' Test Person ',
      jobTitle: 'Sálfræðingur',
      department: 'Greiningarsvið',
      mail: 'test.person@example.is',
      businessPhones: ['', ' 555 0000 '],
      accountEnabled: true,
    })

    expect(result).toEqual({
      ok: true,
      warnings: [],
      member: {
        entryId: `adstaff-test-${objectId}`,
        adObjectId: objectId,
        name: 'Test Person',
        title: { 'is-IS': 'Sálfræðingur', en: 'Psychologist' },
        email: 'test.person@example.is',
        phone: '555 0000',
        filterTagIds: ['tag-greining'],
      },
    })
  })

  it('falls back to the Icelandic job title and warns about unknown departments', () => {
    const result = mapGraphUserToStaffMember(source, {
      id: objectId,
      displayName: 'Test Person',
      jobTitle: 'Ritari',
      department: 'Óþekkt svið',
    })

    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.member.title).toEqual({ 'is-IS': 'Ritari', en: 'Ritari' })
    expect(result.member.filterTagIds).toEqual([])
    expect(result.member.email).toBeUndefined()
    expect(result.member.phone).toBeUndefined()
    expect(result.warnings).toEqual(['unknown department "Óþekkt svið"'])
  })

  it('skips disabled accounts without retaining them', () => {
    expect(
      mapGraphUserToStaffMember(source, {
        id: objectId,
        displayName: 'Test Person',
        jobTitle: 'Ritari',
        accountEnabled: false,
      }),
    ).toEqual({
      ok: false,
      entryId: `adstaff-test-${objectId}`,
      reason: 'account disabled',
      retain: false,
    })
  })

  it('skips people without a job title but retains their entry', () => {
    expect(
      mapGraphUserToStaffMember(source, {
        id: objectId,
        displayName: 'Test Person',
        jobTitle: '  ',
      }),
    ).toMatchObject({ ok: false, reason: 'missing job title', retain: true })
  })

  it('creates entry ids Contentful accepts', () => {
    const id = getStaffEntryId({ ...source, key: 'rgr' }, objectId)

    expect(id.length).toBeLessThanOrEqual(64)
    expect(id).toMatch(/^[a-zA-Z0-9\-_.]+$/)
  })
})
