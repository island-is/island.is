import type { Application, FormValue } from '@island.is/application/types'
import type { SalaryAnalysisResponseDto } from '@island.is/clients/directorate-of-equality'
// The shell's reducer is not part of ui-shell's public API, but it is what
// decides where Continue lands, so the spec drives the real thing.
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  ApplicationReducer,
  initializeReducer,
} from '../../../../../../ui-shell/src/reducer/ApplicationFormReducer'
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ActionTypes } from '../../../../../../ui-shell/src/reducer/ReducerTypes'
import { dataSchema } from '../../lib/dataSchema'
import { ScreenIds } from '../../utils/constants'
import {
  navigationAnswersForAnalysisResult,
  salaryAnalysisOutlierPlanIsReviewed,
} from '../../utils/salaryAnalysisNavigation'
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

// The shell as a page load seeds it: externalData is copied in once here and
// nothing the template does afterwards replaces it.
const loadPage = (
  storedAnalysis: SalaryAnalysisResponseDto | undefined,
  answers: FormValue,
) =>
  initializeReducer({
    application: {
      id: 'application-id',
      state: 'draft',
      answers,
      externalData: storedAnalysis
        ? { salaryAnalysisResult: { status: 'success', data: storedAnalysis } }
        : {},
    } as unknown as Application,
    nationalRegistryId: '0101302989',
    dataSchema,
    form: MainForm,
    activeScreen: 0,
    screens: [],
    sections: [],
    historyReason: 'initial',
    user: null,
  })

// What the results screen does when its re-run comes back: mirror the flags
// into the answers (ANSWER), then the applicant presses Continue
// (ANSWER_AND_GO_NEXT_SCREEN with the same values set on the form).
const reanalyseAndContinue = (
  state: ReturnType<typeof loadPage>,
  freshAnalysis: SalaryAnalysisResponseDto,
) => {
  const flags = navigationAnswersForAnalysisResult(freshAnalysis, {
    resetReviewed: true,
  })
  let next = ApplicationReducer(state, {
    type: ActionTypes.GO_TO_SCREEN,
    payload: ScreenIds.analysisOverview,
  })
  expect(next.screens[next.activeScreen].id).toBe(ScreenIds.analysisOverview)
  next = ApplicationReducer(next, { type: ActionTypes.ANSWER, payload: flags })
  next = ApplicationReducer(next, {
    type: ActionTypes.ANSWER_AND_GO_NEXT_SCREEN,
    payload: flags,
  })
  return {
    landedOn: next.screens[next.activeScreen].id,
    submitAllowed: salaryAnalysisOutlierPlanIsReviewed(
      next.application.answers,
      next.application.externalData,
    ),
  }
}

describe('MainForm: the improvement plan step after a page load', () => {
  it('shows the plan step when edits after the page load create outliers', () => {
    const shell = loadPage(analysis(0), {
      salaryAnalysis: {
        hasMinimumSetOutliers: false,
        outlierPlanReviewed: false,
      },
    })

    expect(reanalyseAndContinue(shell, analysis(3))).toEqual({
      landedOn: ScreenIds.improvementPlan,
      submitAllowed: false,
    })
  })

  it('skips the plan step when edits after the page load remove every outlier', () => {
    const shell = loadPage(analysis(2), {
      salaryAnalysis: {
        hasMinimumSetOutliers: true,
        outlierPlanReviewed: true,
      },
    })

    expect(reanalyseAndContinue(shell, analysis(0))).toEqual({
      landedOn: 'overviewMultiField',
      submitAllowed: true,
    })
  })

  it('still shows the plan step on a first visit with no stored analysis', () => {
    const shell = loadPage(undefined, {})

    expect(reanalyseAndContinue(shell, analysis(3))).toEqual({
      landedOn: ScreenIds.improvementPlan,
      submitAllowed: false,
    })
  })
})
