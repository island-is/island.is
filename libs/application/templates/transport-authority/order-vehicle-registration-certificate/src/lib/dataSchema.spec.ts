import { OrderVehicleRegistrationCertificateSchema } from './dataSchema'

const baseAnswers = {
  approveExternalData: true,
  pickVehicle: { plate: 'AB123' },
  vehicle: { plate: 'AB123', type: 'X' },
}

const emptyAddress = {
  name: '',
  address1: '',
  address2: '',
  apartment: '',
  postalCode: '',
  city: '',
  country: '',
}

describe('OrderVehicleRegistrationCertificateSchema sendToAddress', () => {
  it('passes without sendToAddress', () => {
    const result =
      OrderVehicleRegistrationCertificateSchema.safeParse(baseAnswers)

    expect(result.success).toBe(true)
  })

  it('skips address validation when the checkbox is unchecked', () => {
    const result = OrderVehicleRegistrationCertificateSchema.safeParse({
      ...baseAnswers,
      sendToAddress: { ...emptyAddress, useOtherAddress: [] },
    })

    expect(result.success).toBe(true)
  })

  it('requires the mandatory address fields when the checkbox is checked', () => {
    const result = OrderVehicleRegistrationCertificateSchema.safeParse({
      ...baseAnswers,
      sendToAddress: { ...emptyAddress, useOtherAddress: ['yes'] },
    })

    expect(result.success).toBe(false)

    const paths = result.success
      ? []
      : result.error.issues.map((issue) => issue.path.join('.'))

    expect(paths.sort()).toEqual([
      'sendToAddress.address1',
      'sendToAddress.city',
      'sendToAddress.country',
      'sendToAddress.name',
      'sendToAddress.postalCode',
    ])
  })

  it('passes with a filled address when the checkbox is checked', () => {
    const result = OrderVehicleRegistrationCertificateSchema.safeParse({
      ...baseAnswers,
      sendToAddress: {
        ...emptyAddress,
        useOtherAddress: ['yes'],
        name: 'Jón Jónsson',
        address1: 'Nørregade 1',
        postalCode: '1165',
        city: 'København',
        country: 'DK',
      },
    })

    expect(result.success).toBe(true)
  })
})
