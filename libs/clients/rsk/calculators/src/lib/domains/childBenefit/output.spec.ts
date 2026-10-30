import { toChildBenefitOutput } from './output'

const result = {
  hjuskaparstada: 'text-1',
  fjoldiBarna: 2,
  fjoldiBarnaUndir7ara: 3,
  tekjuar: 4,
  botaAr: 5,
  tekjustofn: 6,
  skerdingarhlutfall: 0.07,
  skerdingarmork: 8,
  efriSkerdingarmork: 9,
  stofnTilSkerdingar: 10,
  stofnTilUmframskerdingar: 11,
  skerdingVegnaTekna: 12,
  umframskerdingVegnaTekna: 13,
  umframskerdingarhlutfall: 0.14,
  oskertarBarnabaetur: 15,
  barnabaeturPerBarn: 16,
  barnabaeturAlls: 17,
  greidslurArsfjordungi: 18,
  tekjutengdarBarnabaetur: 19,
  barnabaeturAllsPrHjon: 20,
  vidbotBornYngriEn7ara: 21,
  vidbotPerBarnYngraEn7ara: 22,
  skerdingUndir7ara: 23,
  skerdingarhlutfallUndir7ara: 0.24,
  faedingararBarna: 'text-25',
  skiptBuseta: true,
  skiptYfir7ara: 27,
  skiptUndir7ara: 28,
  barnabaeturFyrirSkiptingu: 29,
}

describe('toChildBenefitOutput', () => {
  it('converts the ratio fields to whole percents and keeps the rest', () => {
    expect(toChildBenefitOutput(result)).toEqual({
      ...result,
      skerdingarhlutfall: 7,
      umframskerdingarhlutfall: 14,
      skerdingarhlutfallUndir7ara: 24,
    })
  })

  it('maps absent and null ratios to undefined', () => {
    expect(
      toChildBenefitOutput({ umframskerdingarhlutfall: null })
        .umframskerdingarhlutfall,
    ).toBeUndefined()
    expect(toChildBenefitOutput({}).skerdingarhlutfall).toBeUndefined()
  })
})
