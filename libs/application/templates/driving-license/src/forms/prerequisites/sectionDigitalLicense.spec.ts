import { FormValue } from '@island.is/application/types'
import { sectionDigitalLicense } from './sectionDigitalLicense'
import { B_FULL, B_FULL_RENEWAL_65, B_TEMP, BE } from '../../lib/constants'

// The digital-licence info screen is reusable: it takes the application types it
// should appear for and its sub-section condition gates on `applicationFor`, so
// the screen (and its stepper entry) render only for those types. This pins:
//   - it shows for the configured types and hides for the rest,
//   - it defaults to B-full only,
//   - an unanswered applicationFor never shows it,
//   - it carries the info alert and persists nothing (doesNotRequireAnswer).

const evalCondition = (
  subSection: ReturnType<typeof sectionDigitalLicense>,
  answers: FormValue,
): boolean => {
  const { condition } = subSection
  if (typeof condition !== 'function') {
    throw new Error('expected a dynamic (function) condition')
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
  describe('default (B-full only)', () => {
    const section = sectionDigitalLicense()

    it('shows for B-full', () => {
      expect(evalCondition(section, { applicationFor: B_FULL })).toBe(true)
    })

    it.each([B_TEMP, BE, B_FULL_RENEWAL_65])(
      'is hidden for %s',
      (applicationFor) => {
        expect(evalCondition(section, { applicationFor })).toBe(false)
      },
    )

    it('is hidden when applicationFor is unanswered', () => {
      expect(evalCondition(section, {})).toBe(false)
    })
  })

  describe('reusable across types', () => {
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
