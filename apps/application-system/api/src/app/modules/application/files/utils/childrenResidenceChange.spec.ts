import { FormValue } from '@island.is/application/core'
import { PersonResidenceChange } from '@island.is/application/templates/children-residence-change'
import { variablesForResidenceChange } from './childrenResidenceChange'

describe('ChildrenResidenceChange', () => {
  it('should create parameters for legal residence change from application answers and externalData', () => {
    const expectedExpiry = ['expiry']

    const expectedReason = 'reason'

    const expectedParentA: PersonResidenceChange & {
      phoneNumber: string
      email: string
    } = {
      id: 'parent a ssn',
      name: 'parent a name',
      ssn: 'parent a ssn',
      postalCode: 'parent a postal code',
      address: 'parent a address',
      city: 'parent a city',
      phoneNumber: '111-2222',
      email: 'email@email.is',
    }

    const expectedParentB: PersonResidenceChange = {
      id: 'parent b id',
      name: 'parent b name',
      ssn: 'parent b ssn',
      postalCode: 'parent b postal code',
      address: 'parent b address',
      city: 'parent b city',
    }

    const expectedChildrenAppliedFor: Array<PersonResidenceChange> = [
      {
        id: '1',
        ssn: '1111112222',
        name: 'Test name',
        city: 'child city',
        address: 'child address',
        postalCode: 'child postal code',
      },
    ]

    const answers: FormValue = {
      selectDuration: expectedExpiry,
      residenceChangeReason: expectedReason,
      selectChild: [expectedChildrenAppliedFor[0].name],
      parentA: {
        phoneNumber: '111-2222',
        email: 'email@email.is',
      },
    }

    const externalData: FormValue = {
      parentNationalRegistry: {
        data: {
          id: expectedParentB.id,
          name: expectedParentB.name,
          ssn: expectedParentB.ssn,
          postalCode: expectedParentB.postalCode,
          address: expectedParentB.address,
          city: expectedParentB.city,
        },
      },
      nationalRegistry: {
        data: {
          nationalId: expectedParentA.ssn,
          fullName: expectedParentA.name,
          address: {
            streetAddress: expectedParentA.address,
            postalCode: expectedParentA.postalCode,
            city: expectedParentA.city,
          },
        },
      },
      childrenNationalRegistry: {
        data: [
          {
            ssn: expectedChildrenAppliedFor[0].ssn,
            name: expectedChildrenAppliedFor[0].name,
          },
        ],
      },
    }

    const {
      parentA,
      parentB,
      childrenAppliedFor,
      expiry,
      reason,
    } = variablesForResidenceChange(answers, externalData)

    expect(expectedExpiry).toEqual(expiry)
    expect(expectedParentA).toEqual(parentA)
    expect(expectedParentB).toEqual(parentB)
    expect(expectedReason).toEqual(reason)

    expectedChildrenAppliedFor.forEach((c, i) => {
      expect(c.name).toEqual(childrenAppliedFor[i].name)
      expect(c.ssn).toEqual(childrenAppliedFor[i].ssn)
    })
  })
})
