import { Test } from '@nestjs/testing'
import { FileService } from './file.service'
import { FormValue } from '@island.is/application/core'
import {
  ParentResidenceChange,
  PersonResidenceChange,
} from '@island.is/application/templates/children-residence-change'

describe('FileService', () => {
  let service: FileService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [FileService],
    }).compile()

    service = module.get(FileService)
  })

  it('should be defined', () => {
    expect(service).toBeTruthy()
  })

  it('should create parameters for legal residence change from application answers and externalData', () => {
    const expectedExpiry = 'expiry'

    const expectedParentA: ParentResidenceChange = {
      id: 'parent a ssn',
      name: 'parent a name',
      ssn: 'parent a ssn',
      postalCode: 'parent a postal code',
      address: 'parent a address',
      city: 'parent a city',
      phoneNumber: '0009999',
      email: 'thisisnotanemail',
    }

    const expectedParentB: ParentResidenceChange = {
      id: 'parent b id',
      name: 'parent b name',
      ssn: 'parent b ssn',
      postalCode: 'parent b postal code',
      address: 'parent b address',
      city: 'parent b city',
      phoneNumber: '0008888',
      email: 'thisisneitheranemail',
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
      expiry: expectedExpiry,
      selectChild: [
        {
          ssn: expectedChildrenAppliedFor[0].ssn,
          name: expectedChildrenAppliedFor[0].name,
        },
      ],
      parentBEmail: expectedParentB.email as string,
      parentBPhoneNumber: expectedParentB.phoneNumber as string,
      email: expectedParentA.email as string,
      phoneNumber: expectedParentA.phoneNumber as string,
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
    }

    const {
      parentA,
      parentB,
      childrenAppliedFor,
      expiry,
    } = service.variablesForResidenceChange(answers, externalData)

    expect(expectedExpiry).toEqual(expiry)
    expect(expectedParentA).toEqual(parentA)
    expect(expectedParentB).toEqual(parentB)

    expectedChildrenAppliedFor.forEach((c, i) => {
      expect(c.name).toEqual(childrenAppliedFor[i].name)
      expect(c.ssn).toEqual(childrenAppliedFor[i].ssn)
    })
  })
})
