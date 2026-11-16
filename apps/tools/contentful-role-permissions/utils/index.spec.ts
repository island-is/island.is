import type { Role } from 'contentful-management'

import { READABLE_BY_ALL_TAG_ID } from '../constants'
import { applyAssetPolicies, applyEntryEditPolicies } from './index'

const OWNER_TAG = 'ownerTest'
const EDIT_ACTIONS = [
  'update',
  'delete',
  'publish',
  'unpublish',
  'archive',
  'unarchive',
]

const denies = (policies: Role['policies']) =>
  policies.filter((p) => p.effect === 'deny')

describe('applyEntryEditPolicies', () => {
  it('denies editing per content type without denying reading there', () => {
    const policies: Role['policies'] = []
    applyEntryEditPolicies(
      policies,
      new Set(['news', 'article']),
      OWNER_TAG,
      new Set(['article']),
    )

    const editDenies = denies(policies).filter(
      (p) => JSON.stringify(p.actions) !== '["read"]',
    )
    expect(editDenies).toHaveLength(2)
    for (const policy of editDenies) {
      expect(policy.actions).toEqual(EDIT_ACTIONS)
      expect(JSON.stringify(policy)).not.toContain(READABLE_BY_ALL_TAG_ID)
    }
  })

  it('denies reading in one policy that the readable-by-all tag unlocks', () => {
    const policies: Role['policies'] = []
    applyEntryEditPolicies(
      policies,
      new Set(['news', 'link', 'article']),
      OWNER_TAG,
      new Set(['article']),
    )

    const readDenies = denies(policies).filter(
      (p) => JSON.stringify(p.actions) === '["read"]',
    )
    expect(readDenies).toEqual([
      {
        actions: ['read'],
        effect: 'deny',
        constraint: {
          and: [
            { equals: [{ doc: 'sys.type' }, 'Entry'] },
            // Globally readable content types are left out, ids are sorted
            { in: [{ doc: 'sys.contentType.sys.id' }, ['link', 'news']] },
            {
              not: {
                or: [
                  {
                    equals: [{ doc: 'sys.createdBy.sys.id' }, 'User.current()'],
                  },
                  { in: [{ doc: 'metadata.tags.sys.id' }, [OWNER_TAG]] },
                  {
                    in: [
                      { doc: 'metadata.tags.sys.id' },
                      [READABLE_BY_ALL_TAG_ID],
                    ],
                  },
                ],
              },
            },
          ],
        },
      },
    ])
  })

  it('adds no read policy when every editable content type is globally readable', () => {
    const policies: Role['policies'] = []
    applyEntryEditPolicies(
      policies,
      new Set(['article']),
      OWNER_TAG,
      new Set(['article']),
    )

    expect(
      denies(policies).some((p) => JSON.stringify(p.actions) === '["read"]'),
    ).toBe(false)
  })
})

describe('applyAssetPolicies', () => {
  it('lets the readable-by-all tag unlock reading assets', () => {
    const policies: Role['policies'] = []
    applyAssetPolicies(policies, false, OWNER_TAG)

    const [deny] = denies(policies)
    expect(deny.actions).toEqual(['read'])
    expect(JSON.stringify(deny)).toContain(READABLE_BY_ALL_TAG_ID)
  })

  it('never lets the readable-by-all tag unlock editing assets', () => {
    const policies: Role['policies'] = []
    applyAssetPolicies(policies, true, OWNER_TAG)

    const [deny] = denies(policies)
    expect(deny.actions).toEqual(EDIT_ACTIONS)
    expect(JSON.stringify(deny)).not.toContain(READABLE_BY_ALL_TAG_ID)
  })
})
