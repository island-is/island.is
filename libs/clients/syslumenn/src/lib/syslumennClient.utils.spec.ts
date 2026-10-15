import { readFileSync } from 'fs'
import { join } from 'path'
import { logger } from '@island.is/logging'
import { EignirDanarbus, TegundAndlags } from '../../gen/fetch'
import { DebtTypes } from './syslumennClient.types'
import {
  mapEstateInfo,
  mapEstateRegistrant,
  mapEstateToInheritanceReportInfo,
  parseShare,
  withAssetTypeValue,
} from './syslumennClient.utils'

describe('syslumennClient.utils.parseShare', () => {
  it('Should handle commas', () => {
    expect(parseShare('1,5')).toStrictEqual(1.5)
    expect(parseShare('50,002')).toStrictEqual(50.002)
  })

  it('Should handle normal floating point numbers', () => {
    expect(parseShare('1.5')).toStrictEqual(1.5)
    expect(parseShare('50.002')).toStrictEqual(50.002)
  })

  it('Should handle integers', () => {
    expect(parseShare('1')).toStrictEqual(1)
    expect(parseShare('50')).toStrictEqual(50)
  })

  it('Should handle edge cases', () => {
    expect(parseShare('0')).toStrictEqual(0)
    expect(parseShare('0.0')).toStrictEqual(0)
    expect(parseShare('0,0')).toStrictEqual(0)

    expect(parseShare('100')).toStrictEqual(100)
    expect(parseShare('100.0')).toStrictEqual(100)
    expect(parseShare('100,0')).toStrictEqual(100)
  })
})

const asset = (
  lysing: string,
  fastanumer: string,
  tegundAngalgs: TegundAndlags | string,
): EignirDanarbus => ({
  lysing,
  fastanumer,
  upphaed: '1000',
  tegundAngalgs: tegundAngalgs as TegundAndlags,
})

// The District Commissioners' API sends the asset type by name
// ('InnistaedaIBanka') where it used to send the value (8)
const assetsByName = [
  asset('Hús', 'F2010005', 'Fasteign'),
  asset('Bíll', 'VA334', 'Okutaeki'),
  asset('Banki', '1', 'InnistaedaIBanka'),
  asset('Lán', '2', 'Lan'),
  asset('Óþekkt', '3', 'NyTegund'),
]

const assetsByValue = [
  asset('Hús', 'F2010005', TegundAndlags.NUMBER_0),
  asset('Bíll', 'VA334', TegundAndlags.NUMBER_1),
  asset('Banki', '1', TegundAndlags.NUMBER_8),
  asset('Lán', '2', TegundAndlags.NUMBER_19),
]

describe('syslumennClient.utils.withAssetTypeValue', () => {
  it('maps every asset type name in the API spec to its value', () => {
    const spec = JSON.parse(
      readFileSync(join(__dirname, '../clientConfig.json'), 'utf8'),
    )
    const { enum: values, 'x-enumNames': names } =
      spec.components.schemas.TegundAndlags

    expect(names).toHaveLength(values.length)
    names.forEach((name: string, i: number) => {
      expect(withAssetTypeValue({ tegundAngalgs: name }).tegundAngalgs).toBe(
        values[i],
      )
    })
  })

  it('leaves asset type values unchanged', () => {
    expect(withAssetTypeValue(assetsByValue[2])).toEqual(assetsByValue[2])
  })

  it('drops and logs unknown asset type names', () => {
    const warn = jest.spyOn(logger, 'warn').mockImplementation()

    expect(
      withAssetTypeValue({ tegundAngalgs: 'NyTegund' }).tegundAngalgs,
    ).toBeUndefined()
    expect(warn).toHaveBeenCalledWith(expect.any(String), {
      assetType: 'NyTegund',
    })

    warn.mockRestore()
  })
})

describe.each([
  ['names', assetsByName],
  ['values', assetsByValue],
])('estate asset mapping with asset types as %s', (_, eignir) => {
  it('mapEstateInfo sorts assets by type', () => {
    const estate = mapEstateInfo({ eignir })

    expect(estate.assets.map((a) => a.description)).toEqual(['Hús'])
    expect(estate.vehicles.map((a) => a.description)).toEqual(['Bíll'])
    expect(estate.bankAccounts).toEqual([
      expect.objectContaining({ description: 'Banki', marketValue: '1000' }),
    ])
    expect(estate.otherDebts).toEqual([
      expect.objectContaining({ description: 'Lán', debtType: DebtTypes.Loan }),
    ])
  })

  it('mapEstateRegistrant sorts assets by type', () => {
    const registrant = mapEstateRegistrant({ eignir })

    expect(registrant.assets.map((a) => a.description)).toEqual(['Hús'])
    expect(registrant.vehicles.map((a) => a.description)).toEqual(['Bíll'])
  })

  it('mapEstateToInheritanceReportInfo sorts assets by type', () => {
    const report = mapEstateToInheritanceReportInfo({ eignir })

    expect(report.assets.map((a) => a.description)).toEqual(['Hús'])
    expect(report.vehicles.map((a) => a.description)).toEqual(['Bíll'])
    expect(report.bankAccounts.map((a) => a.description)).toEqual(['Banki'])
    expect(report.otherDebts.map((a) => a.description)).toEqual(['Lán'])
  })
})
