import type { Role } from 'contentful-management'

import { READABLE_BY_ALL_TAG_ID } from '../constants'
import {
  applyAssetPolicies,
  applyEntryEditPolicies,
  applyEntryGlobalReadPolicies,
  applyReadableByAllEntryPolicy,
} from './index'

const OWNER_TAG = 'ownerTest'
const OTHER_OWNER_TAG = 'ownerOther'
const CURRENT_USER = 'current-user'
const EDIT_ACTIONS = [
  'update',
  'delete',
  'publish',
  'unpublish',
  'archive',
  'unarchive',
]

interface Doc {
  type: 'Entry' | 'Asset'
  contentType?: string
  tags: string[]
  createdBy: string
}

// Minimal evaluator for the constraint operators the tool generates
// (allowed if some allow policy matches and no deny policy matches)
const getValue = (path: string, doc: Doc) => {
  switch (path) {
    case 'sys.type':
      return doc.type
    case 'sys.contentType.sys.id':
      return doc.contentType
    case 'metadata.tags.sys.id':
      return doc.tags
    case 'sys.createdBy.sys.id':
      return doc.createdBy
    default:
      throw new Error(`Unknown path ${path}`)
  }
}
const resolve = (value: unknown): string =>
  value === 'User.current()' ? CURRENT_USER : String(value)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const matches = (constraint: any, doc: Doc): boolean => {
  if (constraint.and) return constraint.and.every((c) => matches(c, doc))
  if (constraint.or) return constraint.or.some((c) => matches(c, doc))
  if (constraint.not) return !matches(constraint.not, doc)
  if (constraint.equals) {
    const value = getValue(constraint.equals[0].doc, doc)
    const expected = resolve(constraint.equals[1])
    return Array.isArray(value) ? value.includes(expected) : value === expected
  }
  if (constraint.in) {
    const value = getValue(constraint.in[0].doc, doc)
    const list = constraint.in[1].map(resolve)
    return Array.isArray(value)
      ? value.some((v) => list.includes(v))
      : list.includes(value)
  }
  throw new Error(`Unknown constraint ${JSON.stringify(constraint)}`)
}
const can = (policies: Role['policies'], action: string, doc: Doc) => {
  const covers = (p: Role['policies'][number]) =>
    p.actions === 'all' || p.actions.includes(action as never)
  return (
    policies.some(
      (p) => p.effect === 'allow' && covers(p) && matches(p.constraint, doc),
    ) &&
    !policies.some(
      (p) => p.effect === 'deny' && covers(p) && matches(p.constraint, doc),
    )
  )
}

// Generates a role's policies the same way the update-role-permissions route does
const generatePolicies = ({
  editable = ['news'],
  globallyReadable = ['article'],
  canReadAllAssets = false,
} = {}) => {
  const policies: Role['policies'] = []
  applyEntryEditPolicies(
    policies,
    new Set(editable),
    OWNER_TAG,
    new Set(globallyReadable),
  )
  applyEntryGlobalReadPolicies(policies, new Set(globallyReadable))
  applyReadableByAllEntryPolicy(policies)
  applyAssetPolicies(policies, canReadAllAssets, OWNER_TAG)
  return policies
}

const entry = (contentType: string, tags: string[], createdBy = 'someone') => ({
  type: 'Entry' as const,
  contentType,
  tags,
  createdBy,
})
const asset = (tags: string[], createdBy = 'someone') => ({
  type: 'Asset' as const,
  tags,
  createdBy,
})

describe('entry policies', () => {
  const policies = generatePolicies()

  it('lets the organization read and edit its own entries', () => {
    expect(can(policies, 'read', entry('news', [OWNER_TAG]))).toBe(true)
    for (const action of EDIT_ACTIONS) {
      expect(can(policies, action, entry('news', [OWNER_TAG]))).toBe(true)
    }
  })

  it('hides untagged entries of other organizations', () => {
    expect(can(policies, 'read', entry('news', [OTHER_OWNER_TAG]))).toBe(false)
  })

  it('lets every organization read entries with the readable-by-all tag, without editing them', () => {
    const foreign = entry('news', [OTHER_OWNER_TAG, READABLE_BY_ALL_TAG_ID])
    expect(can(policies, 'read', foreign)).toBe(true)
    for (const action of EDIT_ACTIONS) {
      expect(can(policies, action, foreign)).toBe(false)
    }
  })

  it('makes tagged entries readable even for content types the role has no access to', () => {
    const foreign = entry('customPage', [
      OTHER_OWNER_TAG,
      READABLE_BY_ALL_TAG_ID,
    ])
    expect(can(policies, 'read', foreign)).toBe(true)
    for (const action of EDIT_ACTIONS) {
      expect(can(policies, action, foreign)).toBe(false)
    }
    expect(can(policies, 'read', entry('customPage', [OTHER_OWNER_TAG]))).toBe(
      false,
    )
  })

  it('keeps edit access for the owning organization when the tag is added', () => {
    const own = entry('news', [OWNER_TAG, READABLE_BY_ALL_TAG_ID])
    for (const action of EDIT_ACTIONS) {
      expect(can(policies, action, own)).toBe(true)
    }
  })

  it('works when the role has no editable or globally readable content types', () => {
    const empty = generatePolicies({ editable: [], globallyReadable: [] })
    expect(can(empty, 'read', entry('article', [READABLE_BY_ALL_TAG_ID]))).toBe(
      true,
    )
    expect(
      can(empty, 'update', entry('article', [READABLE_BY_ALL_TAG_ID])),
    ).toBe(false)
  })

  it('denies reading in a single policy with sorted content type ids', () => {
    const readDenies = generatePolicies({
      editable: ['news', 'link', 'article'],
    }).filter(
      (p) => p.effect === 'deny' && JSON.stringify(p.actions) === '["read"]',
    )
    const entryReadDenies = readDenies.filter((p) =>
      JSON.stringify(p.constraint).includes('"Entry"'),
    )
    expect(entryReadDenies).toHaveLength(1)
    expect(entryReadDenies[0].constraint.and[1]).toEqual({
      in: [{ doc: 'sys.contentType.sys.id' }, ['link', 'news']],
    })
  })
})

describe.each([false, true])(
  'asset policies (can read all assets: %s)',
  (canReadAllAssets) => {
    const policies = generatePolicies({ canReadAllAssets })

    it('lets the organization read and edit its own assets', () => {
      expect(can(policies, 'read', asset([OWNER_TAG]))).toBe(true)
      for (const action of EDIT_ACTIONS) {
        expect(can(policies, action, asset([OWNER_TAG]))).toBe(true)
      }
    })

    it('lets the creator edit their own assets', () => {
      for (const action of EDIT_ACTIONS) {
        expect(can(policies, action, asset([], CURRENT_USER))).toBe(true)
      }
    })

    it('lets every organization read assets with the readable-by-all tag, without editing them', () => {
      const foreign = asset([OTHER_OWNER_TAG, READABLE_BY_ALL_TAG_ID])
      expect(can(policies, 'read', foreign)).toBe(true)
      for (const action of EDIT_ACTIONS) {
        expect(can(policies, action, foreign)).toBe(false)
      }
    })

    it('only shows untagged assets of other organizations if the role can read all assets', () => {
      const foreign = asset([OTHER_OWNER_TAG])
      expect(can(policies, 'read', foreign)).toBe(canReadAllAssets)
      for (const action of EDIT_ACTIONS) {
        expect(can(policies, action, foreign)).toBe(false)
      }
    })
  },
)
