import { FieldTypes, FormItemTypes } from '@island.is/application/types'
import type { CustomField, MultiField } from '@island.is/application/types'
import { ProgressPaths } from '../../../utils/constants'
import { reportSection } from './index'

// The report screens are what a returning applicant resumes into, and the only
// thing that makes them resumable is each one declaring its progress marker via
// childInputIds. `doesNotRequireAnswer: true` would undo that: the shell skips a
// screen that requires no answer without advancing the resume point, which is
// how every report step used to be invisible to findCurrentScreen.
describe('reportSection resume markers', () => {
  const screens = reportSection.children.map((subSection) => {
    const [screen] = subSection.children
    return screen as MultiField
  })

  const customFieldOf = (screen: MultiField) => {
    const field = screen.children.find(
      (child) => child.type === FieldTypes.CUSTOM,
    )
    return field as CustomField | undefined
  }

  it('has one screen per report step, each a multiField', () => {
    expect(screens).toHaveLength(6)
    screens.forEach((screen) => {
      expect(screen.type).toBe(FormItemTypes.MULTI_FIELD)
    })
  })

  it.each([
    ['dataEntry', ProgressPaths.dataEntry],
    ['criteria', ProgressPaths.criteria],
    ['subCriteria', ProgressPaths.subCriteria],
    ['employees', ProgressPaths.employees],
    ['jobClassification', ProgressPaths.jobClassification],
    ['employeeClassification', ProgressPaths.employeeClassification],
  ])('declares %s as childInputIds: %s', (subSectionId, expectedPath) => {
    const subSection = reportSection.children.find(
      (child) => child.id === subSectionId,
    )
    expect(subSection).toBeDefined()

    const field = customFieldOf(subSection?.children[0] as MultiField)
    expect(field?.childInputIds).toEqual([expectedPath])
  })

  it('never marks a report screen as not requiring an answer', () => {
    screens.forEach((screen) => {
      // buildCustomField defaults it to false, so falsy is the assertion — the
      // regression to catch is someone reinstating an explicit `true`.
      expect(customFieldOf(screen)?.doesNotRequireAnswer).toBe(false)
    })
  })

  // Every marker path has to be distinct, or one step's completion would stand
  // in for another's. Two screens share the `employees` field id, so the
  // markers are the only thing telling them apart.
  it('gives every step its own marker path', () => {
    const paths = Object.values(ProgressPaths)
    expect(new Set(paths).size).toBe(paths.length)
  })
})
