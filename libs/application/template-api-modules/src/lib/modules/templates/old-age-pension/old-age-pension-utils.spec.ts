import { createApplication } from '@island.is/application/testing'
import {
  getMonthNumber,
  initChildrens,
  transformApplicationToOldAgePensionDTO
} from './old-age-pension-utils'
import { ConnectedApplications, HouseholdSupplementHousing, YES } from '@island.is/application/templates/old-age-pension'

describe('Old age pesion utils', () => {
  it('should return 3 for March', () => {
    expect(getMonthNumber('March')).toBe(3)
  })

  it('should return 3 children', () => {
    const childPensionSelectedCustodyKids = ['2222222229', '5555555559']
    const childPension = [
      {
        name: 'Added Children 1',
        nationalIdOrBirthDate: '2023-09-27',
        childDoesNotHaveNationalId9: true,
      },
    ]

    const childrens = initChildrens(
      childPensionSelectedCustodyKids,
      childPension,
      true,
    )

    expect(childrens).toHaveLength(3)
  })

  it('should return 2 children', () => {
    const childPensionSelectedCustodyKids = ['2222222229', '5555555559']
    const childPension = [
      {
        name: 'Added Children 1',
        nationalIdOrBirthDate: '2023-09-27',
        childDoesNotHaveNationalId9: true,
      },
    ]

    const childrens = initChildrens(
      childPensionSelectedCustodyKids,
      childPension,
      false,
    )

    expect(childrens).toHaveLength(2)
  })


  it('should be Household renter, and childrenUnder18' , async () => {
    const application = createApplication({
      answers: {
        connectedApplications: [ConnectedApplications.HOUSEHOLDSUPPLEMENT],
        'householdSupplement.children': YES,
        'householdSupplement.housing': HouseholdSupplementHousing.RENTER,
      },
    })

    const oldAgePensionDTO = transformApplicationToOldAgePensionDTO(
      application,
      {},
    )

    expect(oldAgePensionDTO.householdSupplement).toBeDefined()
    expect(oldAgePensionDTO.householdSupplement?.isRental).toBeTruthy()
    expect(oldAgePensionDTO.householdSupplement?.childrenUnder18).toBeTruthy()
  })


})
