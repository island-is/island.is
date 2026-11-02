import type {
  GetChildBenefitData,
  GetVehicleTaxData,
  GetWithholdingTaxData,
} from '../../../gen/fetch'
import {
  zGetChildBenefitData,
  zGetVehicleTaxData,
  zGetWithholdingTaxData,
} from '../../../gen/fetch/zod.gen'
import { toClientQuery } from './toClientQuery'

describe('toClientQuery', () => {
  it('passes non-ratio values through unchanged', () => {
    const input: GetChildBenefitData['query'] = {
      hjuskaparstada: 'Gift/Í sambúð',
      tekjuar: 2025,
      tekjustofn: 5000000,
      fjoldiBarna: 2,
    }

    expect(
      toClientQuery(zGetChildBenefitData.shape.query.shape, input),
    ).toEqual(input)
  })

  it('divides 0–1 bounded non-integer parameters by 100', () => {
    const input: GetWithholdingTaxData['query'] = {
      launGreidast: 'Mánaðarlega',
      hjuskaparstada: 'Einhleypingur',
      tekjuar: 2026,
      launamanudur: 1,
      laun: 800000,
      lifeyrissjodurHlutfall: 4,
      sereignHlutfall: 2,
      nytingSkattkorts: 100,
      nytingSkattkortsMaka: 0,
      uppsafnadurPersonuafslattur: 0,
      orlof: 0,
      stettarfelag: 0,
      annad: 0,
      motframlagLifeyrissjodur: 11.5,
      okutaekjastyrkurUtan: 0,
      idgjaldSlysatryggingSjomanna: 0,
    }

    const query = toClientQuery(zGetWithholdingTaxData.shape.query.shape, input)

    expect(query.lifeyrissjodurHlutfall).toBe(0.04)
    expect(query.nytingSkattkorts).toBe(1)
    expect(query.motframlagLifeyrissjodur).toBeCloseTo(0.115)
    expect(query.laun).toBe(800000)
    expect(query.launamanudur).toBe(1)
  })

  it('passes dates through unchanged', () => {
    const gjaldskipting = new Date('2026-03-01')
    const input: GetVehicleTaxData['query'] = {
      ar: 2026,
      bilnumer: 'AB123',
      gjaldtimabil: '1. jan - 30. júlí',
      gjaldskipting,
    }

    expect(
      toClientQuery(zGetVehicleTaxData.shape.query.shape, input).gjaldskipting,
    ).toBe(gjaldskipting)
  })
})
