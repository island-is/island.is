import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { IdsUserGuard, MockAuthGuard } from '@island.is/auth-nest-tools'
import { setup } from '../../../../../../test/setup'
import { errorExpectedStructure } from '../../../../../../test/testHelpers'
import { EndorsementTag } from '../../endorsementList.model'

let app: INestApplication

beforeAll(async () => {
  app = await setup({
    override: (builder) => {
      builder
        .overrideProvider(IdsUserGuard)
        .useValue(new MockAuthGuard({ nationalId: '0000000008' }))
        .compile()
    },
  })
})

describe('createEndorsementList', () => {
  it(`POST /endorsement-list should create new endorsement list`, async () => {
    const newEndorsementList = {
      title: 'Some title',
      description: 'Some description',
      tags: [EndorsementTag.PARTY_LETTER_NORDAUSTURKJORDAEMI_2021],
      endorsementMeta: ['fullName'],
      validationRules: [
        {
          type: 'minAgeAtDate',
          value: {
            date: '2021-04-15T00:00:00Z',
            age: 18,
          },
        },
      ],
    }
    const response = await request(app.getHttpServer())
      .post('/endorsement-list')
      .send(newEndorsementList)
      .expect(201)

    expect(response.body).toMatchObject(newEndorsementList) // should return the created object
  })
  it(`POST /endorsement-list should return error when list data is invalid`, async () => {
    const validEndorsementList = {
      title: 'Some title',
      description: 'Some description',
      tags: [EndorsementTag.PARTY_LETTER_NORDAUSTURKJORDAEMI_2021],
      endorsementMeta: ['fullName'],
      validationRules: [],
    }
    const endorsementListsWithWrongFields = [
      {
        ...validEndorsementList,
        title: 123, // invalid
      },
      {
        ...validEndorsementList,
        validationRules: [
          {
            type: 'minAgeAtDate',
            value: {
              date: '2021-04-15', // invalid
              age: 18,
            },
          },
        ],
      },
      {
        ...validEndorsementList,
        validationRules: [
          {
            type: 'randomNonExistingType', // invalid
          },
        ],
      },
    ]

    for (let i = 0; i < endorsementListsWithWrongFields.length; i++) {
      const response = await request(app.getHttpServer())
        .post('/endorsement-list')
        .send(endorsementListsWithWrongFields[i])
        .expect(400)

      expect(response.body).toMatchObject({
        ...errorExpectedStructure,
        statusCode: 400,
      })
    }
  })
})
