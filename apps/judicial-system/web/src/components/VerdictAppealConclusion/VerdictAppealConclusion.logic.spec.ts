import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import {
  AppealCaseState,
  AppealRulingType,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { getVerdictAppealConclusion } from './VerdictAppealConclusion.logic'

type VerdictAppealCase = NonNullable<WorkingCase['verdictAppealCase']>

const withAppeal = (
  appeal: Partial<VerdictAppealCase>,
): Pick<WorkingCase, 'verdictAppealCase'> => ({
  verdictAppealCase: { id: 'verdict-appeal', ...appeal } as VerdictAppealCase,
})

describe('getVerdictAppealConclusion', () => {
  it('is undefined when there is no verdict appeal', () => {
    expect(getVerdictAppealConclusion({})).toBeUndefined()
    expect(
      getVerdictAppealConclusion({ verdictAppealCase: null }),
    ).toBeUndefined()
  })

  it('is undefined while the appeal is not completed', () => {
    expect(
      getVerdictAppealConclusion(
        withAppeal({
          appealState: AppealCaseState.READY_TO_COMPLETE,
          appealConclusion: 'Héraðsdómur skal vera óraskaður.',
        }),
      ),
    ).toBeUndefined()
  })

  it('is undefined when a completed appeal has no concluding words', () => {
    expect(
      getVerdictAppealConclusion(
        withAppeal({
          appealState: AppealCaseState.COMPLETED,
          appealConclusion: '',
        }),
      ),
    ).toBeUndefined()
  })

  it('titles the words of a verdict as Dómsorð Landsréttar', () => {
    expect(
      getVerdictAppealConclusion(
        withAppeal({
          appealState: AppealCaseState.COMPLETED,
          appealRulingType: AppealRulingType.VERDICT,
          appealConclusion: 'Héraðsdómur skal vera óraskaður.',
        }),
      ),
    ).toEqual({
      title: 'Dómsorð Landsréttar',
      text: 'Héraðsdómur skal vera óraskaður.',
    })
  })

  it('titles the words of a ruling as Úrskurðarorð Landsréttar', () => {
    expect(
      getVerdictAppealConclusion(
        withAppeal({
          appealState: AppealCaseState.COMPLETED,
          appealRulingType: AppealRulingType.RULING,
          appealConclusion: 'Málinu er vísað frá Landsrétti.',
        }),
      ),
    ).toEqual({
      title: 'Úrskurðarorð Landsréttar',
      text: 'Málinu er vísað frá Landsrétti.',
    })
  })

  it('titles the words as a verdict when no ruling type is set', () => {
    expect(
      getVerdictAppealConclusion(
        withAppeal({
          appealState: AppealCaseState.COMPLETED,
          appealRulingType: null,
          appealConclusion: 'Héraðsdómur skal vera óraskaður.',
        }),
      ),
    ).toEqual({
      title: 'Dómsorð Landsréttar',
      text: 'Héraðsdómur skal vera óraskaður.',
    })
  })
})
