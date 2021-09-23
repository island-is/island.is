import { FormValue } from '@island.is/application/core'
import { getInjuredPersonInformation } from './getInjuredPersonInformation'

describe('getInjuredPersonInformation', () => {
  const injuredPersonInformation: FormValue = {
    injuredPersonInformation: {
      email: 'sigrun@sendiradid.is',
      name: 'Sigrún Tinna',
    },
  }

  const emptyInjuredPersonInformation: FormValue = {
    injuredPersonInformation: {
      email: '',
      name: '',
    },
  }

  it('should return an array of length 4 when submitting on behalf of employee', () => {
    expect(
      getInjuredPersonInformation(injuredPersonInformation)?.email,
    ).toEqual('sigrun@sendiradid.is')
  })

  it('should return an array of length 5 when not submitting on behalf of employee', () => {
    expect(getInjuredPersonInformation(injuredPersonInformation)?.name).toEqual(
      'Sigrún Tinna',
    )
  })

  it('should return an array of length 5 for empty object', () => {
    expect(
      getInjuredPersonInformation(emptyInjuredPersonInformation)?.email,
    ).toEqual('')
  })

  it('should have work as first option when submitting on behalf of employee', () => {
    expect(
      getInjuredPersonInformation(emptyInjuredPersonInformation)?.name,
    ).toEqual('')
  })
})
