import { FormValue } from '@island.is/application/types'
import { sectionDigitalLicense } from './sectionDigitalLicense'
import { B_FULL, B_FULL_RENEWAL_65, B_TEMP, BE } from '../../lib/constants'

// The digital-licence info screen applies to every driving-licence flow, so by
// default it has no condition and always renders. Passing a list of
// `applicationFor` values restricts it to those flows. This pins:
//   - default: shown for every type (and even when applicationFor is unanswered),
//   - restricted: shown only for the configured types,
//   - it carries the info alert and persists nothing (doesNotRequireAnswer).

const evalCondition = (
  subSection: ReturnType<typeof sectionDigitalLicense>,
  answers: FormValue,
): boolean => {
  const { condition } = subSection
  // No condition means the sub-section always renders.
  if (condition === undefined) return true
  if (typeof condition !== 'function') {
    throw new Error('expected a dynamic (function) condition or none')
  }
  return condition(answers, {}, null)
}

const collectFields = (node: unknown): Array<Record<string, unknown>> => {
  const item = node as { children?: unknown[] } & Record<string, unknown>
  const kids = Array.isArray(item?.children)
    ? item.children.flatMap(collectFields)
    : []
  return [item, ...kids]
}

describe('sectionDigitalLicense', () => {
  describe('default — applies to every flow', () => {
    const section = sectionDigitalLicense()

    it('has no condition (renders unconditionally)', () => {
      expect(section.condition).toBeUndefined()
    })

    it.each([B_FULL, B_TEMP, BE, B_FULL_RENEWAL_65])(
      'shows for %s',
      (applicationFor) => {
        expect(evalCondition(section, { applicationFor })).toBe(true)
      },
    )

    it('shows even when applicationFor is unanswered', () => {
      expect(evalCondition(section, {})).toBe(true)
    })
  })

  describe('restricted to specific flows', () => {
    it('shows for every configured type and hides the rest', () => {
      const section = sectionDigitalLicense([B_FULL, B_TEMP])
      expect(evalCondition(section, { applicationFor: B_FULL })).toBe(true)
      expect(evalCondition(section, { applicationFor: B_TEMP })).toBe(true)
      expect(evalCondition(section, { applicationFor: BE })).toBe(false)
    })
  })

  describe('content', () => {
    it('renders an info alert and persists nothing', () => {
      const fields = collectFields(sectionDigitalLicense())
      const alert = fields.find((f) => f.id === 'digitalLicenseAlert')
      expect(alert).toBeDefined()
      expect(alert?.alertType).toBe('info')
      // Purely informational — the screen must not require an answer.
      expect(alert?.doesNotRequireAnswer).toBe(true)
    })
  })
})
