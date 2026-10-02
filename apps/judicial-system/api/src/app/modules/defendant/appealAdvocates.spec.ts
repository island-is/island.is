import { ForbiddenException } from '@nestjs/common'

import { Feature } from '@island.is/judicial-system/types'

import { FeatureService } from '../feature/feature.service'
import { assertAppealAdvocatesAvailable } from './appealAdvocates'

describe('assertAppealAdvocatesAvailable', () => {
  const featureService = (hidden: Feature[]) =>
    ({
      isHidden: (feature: Feature) => hidden.includes(feature),
    } as FeatureService)

  const hidden = featureService([Feature.INDICTMENT_APPEAL])
  const shown = featureService([])

  const assertRefused = (update: Record<string, unknown>) =>
    expect(() => assertAppealAdvocatesAvailable(hidden, update)).toThrow(
      ForbiddenException,
    )

  const assertAllowed = (update: Record<string, unknown>) =>
    expect(() => assertAppealAdvocatesAvailable(hidden, update)).not.toThrow()

  // The routes this guards carry plenty of fields that have nothing to do with
  // the appeal, and they must keep working while the feature is hidden.
  it('lets an update that says nothing about the appeal through', () => {
    assertAllowed({})
    assertAllowed({ defenderName: 'Lára Lögmann', punishmentType: 'FINE' })
    assertAllowed({ isDefenderChoiceConfirmed: true })
    assertAllowed({ isSpokespersonConfirmed: true })
  })

  it.each([
    'appealDefenderNationalId',
    'appealDefenderName',
    'appealDefenderEmail',
    'appealDefenderPhoneNumber',
    'appealDefenderWaived',
    'isAppealDefenderConfirmed',
    'hasAppealSpokesperson',
    'appealSpokespersonIsLawyer',
    'appealSpokespersonNationalId',
    'appealSpokespersonName',
    'appealSpokespersonEmail',
    'appealSpokespersonPhoneNumber',
    'isAppealSpokespersonConfirmed',
  ])('refuses %s while the feature is hidden', (field) => {
    assertRefused({ [field]: 'anything' })
  })

  // Clearing a defender is as much a change as naming one, so null has to
  // count as touched - only an absent field is untouched.
  it('counts an explicit null as touching the appeal', () => {
    assertRefused({ appealDefenderName: null })
    assertRefused({ isAppealDefenderConfirmed: false })
  })

  it('refuses an appeal field hiding among ordinary ones', () => {
    assertRefused({
      defenderName: 'Lára Lögmann',
      isAppealDefenderConfirmed: true,
    })
  })

  it('allows everything once the feature is shown', () => {
    expect(() =>
      assertAppealAdvocatesAvailable(shown, {
        isAppealDefenderConfirmed: true,
        appealSpokespersonName: 'Lára Lögmann',
      }),
    ).not.toThrow()
  })
})
