/**
 * @jest-environment node
 */
import { IGenericTag, IGrant } from '../generated/contentfulTypes'
import { mapGrant } from './grant.model'

const buildTag = (id: string): IGenericTag =>
  ({
    sys: { id },
    fields: { title: `Title ${id}`, slug: `slug-${id}` },
  } as unknown as IGenericTag)

const buildGrant = (
  fields: Pick<IGrant['fields'], 'grantTypeTag' | 'grantTypeTags'>,
): IGrant =>
  ({
    sys: { id: 'grant', createdAt: '2026-01-01T00:00:00.000Z' },
    fields: { grantName: 'Grant', ...fields },
  } as unknown as IGrant)

const typeTagIds = (grant: IGrant) =>
  mapGrant(grant).typeTags?.map((tag) => tag.id)

describe('mapGrant typeTags', () => {
  it('uses the old type tag when the new field is not set', () => {
    expect(typeTagIds(buildGrant({ grantTypeTag: buildTag('old') }))).toEqual([
      'old',
    ])
  })

  it('uses the old type tag when the new field is empty', () => {
    expect(
      typeTagIds(
        buildGrant({ grantTypeTag: buildTag('old'), grantTypeTags: [] }),
      ),
    ).toEqual(['old'])
  })

  it('uses only the new type tags when both fields are set', () => {
    expect(
      typeTagIds(
        buildGrant({
          grantTypeTag: buildTag('old'),
          grantTypeTags: [buildTag('new1'), buildTag('new2')],
        }),
      ),
    ).toEqual(['new1', 'new2'])
  })

  it('uses the new type tags when only the new field is set', () => {
    expect(
      typeTagIds(
        buildGrant({ grantTypeTags: [buildTag('new1'), buildTag('new2')] }),
      ),
    ).toEqual(['new1', 'new2'])
  })

  it('returns an empty list when neither field is set', () => {
    expect(typeTagIds(buildGrant({}))).toEqual([])
  })

  it('keeps typeTag mapped from the old field', () => {
    const grant = mapGrant(
      buildGrant({
        grantTypeTag: buildTag('old'),
        grantTypeTags: [buildTag('new1')],
      }),
    )
    expect(grant.typeTag?.id).toBe('old')
  })
})
