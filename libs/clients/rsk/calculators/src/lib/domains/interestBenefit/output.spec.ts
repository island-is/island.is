import { toInterestBenefitOutput } from './output'

const result = {
  hjuskaparstada: 'text-1',
  tekjuar: 2,
  botaar: 3,
  hamarkVaxtagjalda: 4,
  vaxtagjoldTilUtreiknings: 5,
  tekjustofn: 6,
  eignastofn: 7,
  eftirstodvar: 8,
  vaxtagjold: 9,
  hamarkVaxtabota: 10,
  skerdingVegnaTekna: 11,
  vaxtabaeturEftirSkerdinguTekna: 12,
  tekjuskerdingarhlutfall: 0.13,
  skuldaskerdingarhlutfall: 0.14,
  skerdingVegnaEigna: 15,
  eignaskerdingarhlutfall: 0.16,
  skerdingLog2003: 17,
  skerdingLog2004: 18,
  vaxtabaeturAlls: 19,
  serstokVaxtanidurgreidsla: 20,
  nadiHamarki: true,
  varUndirLamarki: true,
}

describe('toInterestBenefitOutput', () => {
  it('converts the ratio fields to whole percents and keeps the rest', () => {
    expect(toInterestBenefitOutput(result)).toEqual({
      ...result,
      tekjuskerdingarhlutfall: 13,
      skuldaskerdingarhlutfall: 14,
      eignaskerdingarhlutfall: 16,
    })
  })

  it('maps an absent ratio to undefined', () => {
    expect(toInterestBenefitOutput({}).tekjuskerdingarhlutfall).toBeUndefined()
  })
})
