import { Application } from '@island.is/application/types'
import { AddressDeliveryType } from '@island.is/application/templates/aosh/machine-license-card-reissue'
import { getOrderApplicationDto } from './machine-license-card-reissue.utils'

const applicationId = '3b3c1e7e-6b53-4d7e-9d1b-2f0f6a1c1a11'

const createApplication = (cardDelivery: Record<string, unknown>) =>
  ({
    id: applicationId,
    answers: {
      applicant: {
        name: 'Jón Jónsson',
        nationalId: '0101302989',
        email: 'jon@example.com',
        phoneNumber: '5555555',
      },
      cardDelivery,
    },
  } as unknown as Application)

describe('getOrderApplicationDto', () => {
  it('sends to legal address when current address is selected', () => {
    const dto = getOrderApplicationDto(
      createApplication({
        type: AddressDeliveryType.CURRENT,
        address: 'Should be ignored',
        postalCode: '101',
      }),
    )
    expect(dto).toEqual({
      applicationId,
      sendToLegalAddress: true,
      sendToAddress: undefined,
      phoneNumber: '5555555',
      email: 'jon@example.com',
    })
  })

  it('maps another address with numeric postal code and recipient', () => {
    const dto = getOrderApplicationDto(
      createApplication({
        type: AddressDeliveryType.OTHER,
        address: ' Skólavörðustígur 2 ',
        postalCode: '101',
        recipient: ' Anna Jónsdóttir ',
      }),
    )
    expect(dto.sendToLegalAddress).toBe(false)
    expect(dto.sendToAddress).toEqual({
      address: 'Skólavörðustígur 2',
      postalCode: 101,
      addressedTo: 'Anna Jónsdóttir',
    })
  })

  it('omits addressedTo when no recipient is given', () => {
    const dto = getOrderApplicationDto(
      createApplication({
        type: AddressDeliveryType.OTHER,
        address: 'Skólavörðustígur 2',
        postalCode: '101',
        recipient: '  ',
      }),
    )
    expect(dto.sendToAddress?.addressedTo).toBeUndefined()
  })
})
