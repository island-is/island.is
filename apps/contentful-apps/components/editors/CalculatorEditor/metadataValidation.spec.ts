import { TaxCalculatorInputFieldType } from '../../../graphql/schema'
import type { InputFieldContract, OutputFieldContract } from './contract'
import { hasMetadataValidationError } from './metadataValidation'

const inputContract: InputFieldContract = new Map([
  [
    'status',
    {
      key: 'status',
      type: TaxCalculatorInputFieldType.Select,
      options: ['single', 'married'],
      required: false,
    },
  ],
])

const outputContract: OutputFieldContract = new Map()

const configWithField = (extra = {}) =>
  ({
    inputSections: [
      {
        key: 's1',
        fields: [
          {
            uid: 'u1',
            kind: 'field',
            key: 'status',
            size: 'large',
            ...extra,
          },
        ],
      },
    ],
    outputTotal: { uid: 'hero', kind: 'value', key: '', label: { is: '' } },
    outputSections: [],
  } as never)

describe('hasMetadataValidationError', () => {
  it('passes when every option has an Icelandic label', () => {
    expect(
      hasMetadataValidationError(
        configWithField({
          optionLabelsEnabled: true,
          optionLabels: {
            single: { is: 'Einhleypur' },
            married: { is: 'Í hjónabandi' },
          },
        }),
        inputContract,
        outputContract,
      ),
    ).toBe(false)
  })

  it('fails when an option has no label', () => {
    expect(
      hasMetadataValidationError(
        configWithField({
          optionLabelsEnabled: true,
          optionLabels: { single: { is: 'Einhleypur' } },
        }),
        inputContract,
        outputContract,
      ),
    ).toBe(true)
  })

  it('fails when an option label is blank', () => {
    expect(
      hasMetadataValidationError(
        configWithField({
          optionLabelsEnabled: true,
          optionLabels: {
            single: { is: 'Einhleypur' },
            married: { is: '   ' },
          },
        }),
        inputContract,
        outputContract,
      ),
    ).toBe(true)
  })

  it('ignores option labels when they are disabled', () => {
    expect(
      hasMetadataValidationError(
        configWithField({ optionLabelsEnabled: false }),
        inputContract,
        outputContract,
      ),
    ).toBe(false)
  })
})
