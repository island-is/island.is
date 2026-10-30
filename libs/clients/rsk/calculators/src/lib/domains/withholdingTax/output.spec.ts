import { toWithholdingTaxOutput } from './output'

const bracket = {
  nedriMork: 100,
  numerThreps: 200,
  stadgreidsluhlutfall: 0.3,
  reiknudStadgreidsla: 400,
}

const result = {
  manadarlaun: 1,
  lifeyrisjodurProsenta: 0.02,
  sereignProsenta: 0.03,
  lifeyrissjodur: 4,
  sereignarsjodur: 5,
  fradratturAlls: 6,
  personuafslattur: 7,
  personuafslatturFraMaka: 8,
  skattstofn: 9,
  reiknudStadgreidsla: 10,
  greiddStadgreidsla: 11,
  hatekjuskattur: 12,
  reiknadiHatekjuskatt: true,
  utborgudLaun: 14,
  uppsafnadurPersonuafslattur: 15,
  tekjuar: 16,
  hjuskaparstada: 17,
  launamanudur: 18,
  fritekjumarkBarns: 19,
  faedingararBarns: 20,
  stadgreidsluhlutfall: 0.21,
  motframlag: 22,
  tryggingagjaldsstofn: 23,
  tryggingagjald: 24,
  skattthrep: [bracket],
}

describe('toWithholdingTaxOutput', () => {
  it('converts the ratio fields and bracket rates to whole percents', () => {
    expect(toWithholdingTaxOutput(result)).toEqual({
      ...result,
      lifeyrisjodurProsenta: 2,
      sereignProsenta: 3,
      stadgreidsluhlutfall: 21,
      skattthrep: [{ ...bracket, stadgreidsluhlutfall: 30 }],
    })
  })

  it('falls back to an empty skattthrep array for both flavours of absence', () => {
    expect(toWithholdingTaxOutput({}).skattthrep).toEqual([])
    expect(toWithholdingTaxOutput({ skattthrep: null }).skattthrep).toEqual([])
  })
})
