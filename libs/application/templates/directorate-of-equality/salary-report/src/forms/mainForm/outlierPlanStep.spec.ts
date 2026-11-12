import { mergeAnswers, shouldShowFormItem } from '@island.is/application/core'
import {
  FormItemTypes,
  type ExternalData,
  type FormItem,
  type FormValue,
  type SubmitField,
} from '@island.is/application/types'
import type { SalaryAnalysisResponseDto } from '@island.is/clients/directorate-of-equality'
import { ScreenIds } from '../../utils/constants'
import { navigationAnswersForAnalysisResult } from '../../utils/salaryAnalysisNavigation'
import { MainForm } from './index'

// Hoisted above the imports by babel-jest. The generated logo module is not
// built in a plain checkout, and the form only needs it to exist.
jest.mock(
  '@island.is/application/assets/institution-logos',
  () => ({ DirectorateOfEqualityLogo: () => null }),
  { virtual: true },
)

const analysis = (outlierCount: number): SalaryAnalysisResponseDto =>
  ({
    outliers: Array.from({ length: outlierCount }, (_, index) => ({
      employeeOrdinal: index + 1,
    })),
  } as unknown as SalaryAnalysisResponseDto)

type Screen = { id: string; isNavigable: boolean; item: FormItem }

const childrenOf = (item: FormItem): FormItem[] =>
  (item as { children?: FormItem[] }).children ?? []

// The form's screens in order, navigable by the rules the form shell applies
// (ui-shell's convertFormToScreens, which cannot be imported here without a
// dependency cycle): every enclosing section and sub-section has to be shown,
// and a multi-field needs at least one visible child.
const screensOf = (
  answers: FormValue,
  externalData: ExternalData,
): Screen[] => {
  const shown = (item: FormItem) =>
    shouldShowFormItem(item, answers, externalData, null)
  const walk = (item: FormItem, parentNavigable: boolean): Screen[] => {
    const navigable = parentNavigable && shown(item)
    if (
      item.type === FormItemTypes.SECTION ||
      item.type === FormItemTypes.SUB_SECTION
    ) {
      return childrenOf(item).flatMap((child) => walk(child, navigable))
    }
    const isNavigable =
      item.type === FormItemTypes.MULTI_FIELD
        ? navigable && childrenOf(item).some(shown)
        : navigable
    return [{ id: item.id ?? '', isNavigable, item }]
  }
  return MainForm.children.flatMap((child) => walk(child, true))
}

// The form as a page load leaves it: the shell keeps this externalData for
// the rest of the visit, and only the answers move.
const pageLoadExternalData = (
  storedAnalysis: SalaryAnalysisResponseDto | undefined,
): ExternalData =>
  (storedAnalysis
    ? { salaryAnalysisResult: { status: 'success', data: storedAnalysis } }
    : {}) as unknown as ExternalData

// What the results screen does when its re-run comes back: mirror the flags
// into the answers, then the applicant presses Continue, which lands on the
// next navigable screen. Reads the submit button's condition off the form.
const reanalyseAndContinue = (
  storedAnalysis: SalaryAnalysisResponseDto | undefined,
  persistedAnswers: FormValue,
  freshAnalysis: SalaryAnalysisResponseDto,
) => {
  const externalData = pageLoadExternalData(storedAnalysis)
  const answers = mergeAnswers(
    persistedAnswers,
    navigationAnswersForAnalysisResult(freshAnalysis, { resetReviewed: true }),
  )
  const screens = screensOf(answers, externalData)
  const results = screens.findIndex((s) => s.id === ScreenIds.analysisOverview)
  expect(results).toBeGreaterThanOrEqual(0)
  const landedOn = screens.slice(results + 1).find((s) => s.isNavigable)?.id

  const overview = screens.find((s) => s.id === 'overviewMultiField')
  const submit = childrenOf(overview?.item as FormItem).find(
    (field) => field.id === 'submit',
  ) as SubmitField
  const submitCondition = submit.actions[0].condition
  const submitAllowed =
    typeof submitCondition === 'function'
      ? submitCondition(answers, externalData, null)
      : true

  return { landedOn, submitAllowed }
}

describe('MainForm: the improvement plan step after a page load', () => {
  it('shows the plan step when edits after the page load create outliers', () => {
    const persisted = {
      salaryAnalysis: {
        hasMinimumSetOutliers: false,
        outlierPlanReviewed: false,
      },
    }

    expect(reanalyseAndContinue(analysis(0), persisted, analysis(3))).toEqual({
      landedOn: ScreenIds.improvementPlan,
      submitAllowed: false,
    })
  })

  it('skips the plan step when edits after the page load remove every outlier', () => {
    const persisted = {
      salaryAnalysis: {
        hasMinimumSetOutliers: true,
        outlierPlanReviewed: true,
      },
    }

    expect(reanalyseAndContinue(analysis(2), persisted, analysis(0))).toEqual({
      landedOn: 'overviewMultiField',
      submitAllowed: true,
    })
  })

  it('still shows the plan step on a first visit with no stored analysis', () => {
    expect(reanalyseAndContinue(undefined, {}, analysis(3))).toEqual({
      landedOn: ScreenIds.improvementPlan,
      submitAllowed: false,
    })
  })
})
