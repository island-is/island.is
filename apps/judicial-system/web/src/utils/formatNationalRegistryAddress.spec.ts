import { formatNationalRegistryAddress } from './formatNationalRegistryAddress'

describe('formatNationalRegistryAddress', () => {
  it('formats a typical Icelandic address', () => {
    expect(
      formatNationalRegistryAddress({
        street: { nominative: 'Aðalgata 1' },
        postal_code: 101,
        town: { nominative: 'Reykjavík' },
        municipality: '',
      }),
    ).toBe('Aðalgata 1, 101 Reykjavík')
  })

  it('uses municipality when town nominative is missing', () => {
    expect(
      formatNationalRegistryAddress({
        street: { nominative: 'Gervigata 2' },
        postal_code: 210,
        municipality: 'Garðabær',
      }),
    ).toBe('Gervigata 2, 210 Garðabær')
  })

  it('returns undefined when there is nothing to show', () => {
    expect(
      formatNationalRegistryAddress({
        street: { nominative: '' },
        municipality: '',
      }),
    ).toBeUndefined()
  })
})
