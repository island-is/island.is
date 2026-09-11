import { defineConfig, OpenApiOperationObject } from '@hey-api/openapi-ts'

type AnyOpenApiOperationObject =
  | OpenApiOperationObject.V2_0_X
  | OpenApiOperationObject.V3_0_X
  | OpenApiOperationObject.V3_1_X

const setOperationId =
  (operationId: string) => (operation: AnyOpenApiOperationObject) => {
    operation.operationId = operationId
  }

const definitionNameByIcelandicName: Record<string, string> = {
  BifreidagjaldSkipting: 'VehicleTaxPeriodSplit',
  NidurstadaBarnabaetur: 'ChildBenefitResult',
  NidurstadaBifreidagjold: 'VehicleTaxResult',
  NidurstadaBifreidahlunnindi: 'VehicleBenefitResult',
  NidurstadaFyrning: 'VehicleDepreciationResult',
  NidurstadaStadgreidsla: 'WithholdingTaxResult',
  NidurstadaVaxtabaetur: 'InterestBenefitResult',
  Skattthrep: 'TaxBracket',
}

const definitionNameBuilder = (name: string): string =>
  definitionNameByIcelandicName[name] ?? name

export default defineConfig({
  input: './libs/clients/rsk/calculators/src/clientConfig.json',
  output: {
    path: './libs/clients/rsk/calculators/gen/fetch',
    format: 'prettier',
    lint: 'eslint',
  },
  parser: {
    patch: {
      operations: {
        'GET /api/Barnabaetur': setOperationId('getChildBenefit'),
        'GET /api/Bifreidagjold': setOperationId('getVehicleTax'),
        'GET /api/Bifreidahlunnindi': setOperationId('getVehicleBenefit'),
        'GET /api/FyrningOkutaekja': setOperationId('getVehicleDepreciation'),
        'GET /api/Stadgreidsla': setOperationId('getWithholdingTax'),
        'GET /api/Vaxtabaetur': setOperationId('getInterestBenefit'),
      },
    },
  },
  plugins: [
    '@hey-api/client-fetch',
    {
      definitions: definitionNameBuilder,
      enums: true,
      name: '@hey-api/typescript',
    },
    { dates: true, name: '@hey-api/transformers' },
    { name: '@hey-api/sdk', transformer: true },
  ],
})
