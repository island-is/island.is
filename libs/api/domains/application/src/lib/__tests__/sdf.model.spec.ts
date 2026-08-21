import {
  resolveComponentType,
  SdfExternalDataProviderField,
  SdfNationalIdWithNameField,
  SdfVehiclePermnoWithInfoField,
  SdfTitleField,
  SdfPaginatedSearchableTableField,
  SdfFieldsRepeaterField,
  SdfOverviewField,
} from '../sdf.model'

describe('resolveComponentType', () => {
  it('resolves external data provider components', () => {
    expect(
      resolveComponentType({
        type: 'EXTERNAL_DATA_PROVIDER',
        id: 'approveExternalData',
        label: 'External data',
        componentName: undefined,
      }),
    ).toBe(SdfExternalDataProviderField.name)
  })

  it('resolves national id with name components', () => {
    expect(
      resolveComponentType({
        type: 'NATIONAL_ID_WITH_NAME',
        id: 'nationalIdWithNameField1',
        label: 'Lookup name',
      }),
    ).toBe(SdfNationalIdWithNameField.name)
  })

  it('resolves vehicle permno with info components', () => {
    expect(
      resolveComponentType({
        type: 'VEHICLE_PERMNO_WITH_INFO',
        id: 'vehicle',
        label: 'Vehicle permno',
      }),
    ).toBe(SdfVehiclePermnoWithInfoField.name)
  })

  it('resolves title components', () => {
    expect(
      resolveComponentType({
        type: 'TITLE',
        id: '',
        label: 'Minimal slider field',
      }),
    ).toBe(SdfTitleField.name)
  })

  it('resolves paginated searchable table components', () => {
    expect(
      resolveComponentType({
        type: 'PAGINATED_SEARCHABLE_TABLE',
        id: 'table',
        label: 'Table',
      }),
    ).toBe(SdfPaginatedSearchableTableField.name)
  })

  it('resolves fields repeater components', () => {
    expect(
      resolveComponentType({
        type: 'FIELDS_REPEATER',
        id: 'repeater',
        label: 'Entries',
      }),
    ).toBe(SdfFieldsRepeaterField.name)
  })

  it('resolves overview components', () => {
    expect(
      resolveComponentType({
        type: 'OVERVIEW',
        id: 'overview',
        label: 'Overview',
      }),
    ).toBe(SdfOverviewField.name)
  })
})
