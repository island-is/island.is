import { AppealSummonsAppellantSide } from '@island.is/judicial-system/types'

import { prefillAppealSummonsClaims } from './AppealSummons.logic'

describe('prefillAppealSummonsClaims', () => {
  const defendant = {
    name: 'Jón Sigurður Jónsson',
    nationalId: '0101303019',
    address: 'Laugavegur 1, Reykjavík',
  }

  it('returns the defence wording', () => {
    expect(
      prefillAppealSummonsClaims(
        AppealSummonsAppellantSide.DEFENCE,
        defendant,
      ),
    ).toContain('Ákærði krefst þess aðallega að hann verði sýknaður')
  })

  it('returns the prosecution wording with defendant details', () => {
    const claims = prefillAppealSummonsClaims(
      AppealSummonsAppellantSide.PROSECUTION,
      defendant,
    )

    expect(claims).toContain(
      'Málinu er áfrýjað gagnvart ákærða, Jón Sigurður Jónsson, kennitala 010130-3019, Laugavegur 1, Reykjavík.',
    )
  })

  it('appends civil claimant lines when present', () => {
    const claims = prefillAppealSummonsClaims(
      AppealSummonsAppellantSide.DEFENCE,
      defendant,
      [{ name: 'Guðrún Jónsdóttir', nationalId: '0101302989' }],
    )

    expect(claims).toContain('Dæmda einkaréttarkröfu á:')
    expect(claims).toContain(
      'Guðrún Jónsdóttir, kennitala 010130-2989, heimilisfang, Reykjavík.',
    )
    expect(claims).toContain(
      'Guðrún Jónsdóttir hafði uppi einkaréttarkröfu fyrir héraðsdómi.',
    )
  })

  it('uses the plural civil claimant heading for several claimants', () => {
    expect(
      prefillAppealSummonsClaims(
        AppealSummonsAppellantSide.PROSECUTION,
        defendant,
        [
          { name: 'A', nationalId: '0101303019' },
          { name: 'B', nationalId: '0101302989' },
        ],
      ),
    ).toContain('Dæmdar einkaréttarkröfur eiga:')
  })
})
