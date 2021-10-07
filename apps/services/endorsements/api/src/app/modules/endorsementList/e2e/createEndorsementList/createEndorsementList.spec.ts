import request from 'supertest'
import { EndorsementsScope } from '@island.is/auth/scopes'
import { getAuthenticatedApp } from '../../../../../../test/setup'
import { errorExpectedStructure } from '../../../../../../test/testHelpers'
import { EndorsementTag } from '../../constants'
import { authNationalId } from '../closeEndorsementList/seed'

describe('createEndorsementList', () => {
  it(`POST /endorsement-list should fail and return 403 error if scope is missing`, async () => {
    const app = await getAuthenticatedApp({
      nationalId: authNationalId,
      scope: [],
    })
    const newEndorsementList = {
      title: 'Some title',
      description: 'Some description',
      tags: [EndorsementTag.PARTY_APPLICATION_NORDAUSTURKJORDAEMI_2021],
      endorsementMeta: ['fullName'],
      endorsement_metadata: [{ field: 'fullName' }],
      validationRules: [
        {
          type: 'minAgeAtDate',
          value: {
            date: '2021-04-15T00:00:00Z',
            age: 18,
          },
        },
      ],
      meta: {
        random: 'data',
        moreRandom: 1337,
      },
    }
    const response = await request(app.getHttpServer())
      .post('/endorsement-list')
      .send(newEndorsementList)
      .expect(403)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 403,
    })
  })
  it(`POST /endorsement-list should return error when list data is invalid`, async () => {
    const app = await getAuthenticatedApp({
      nationalId: authNationalId,
      scope: [EndorsementsScope.main],
    })
    const validEndorsementList = {
      title: 'Some title',
      description: 'Some description',
      tags: [EndorsementTag.PARTY_APPLICATION_NORDAUSTURKJORDAEMI_2021],
      endorsementMeta: ['fullName'],
      endorsement_metadata: [{ field: 'fullName' }],
      validationRules: [],
      meta: {},
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
      {
        ...validEndorsementList,
        meta: '', // invalid
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
  it(`POST /endorsement-list should create new endorsement list`, async () => {
    const app = await getAuthenticatedApp({
      nationalId: authNationalId,
      scope: [EndorsementsScope.main],
    })
    const today = new Date()
    const newEndorsementList = {
      title: 'Some title',
      description: 'Some description',
      tags: [EndorsementTag.GENERAL_PETITION],
      endorsementMetadata: [{ field: 'fullName' }],
      openedDate: today.toISOString(),
      closedDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      adminLock: false,
      validationRules: [
      ],
      meta: {}
    }
    const response = await request(app.getHttpServer())
      .post('/endorsement-list')
      .send(newEndorsementList)
      .expect(201)

    expect(response.body).toMatchObject(newEndorsementList) // should return the created object
  })
})
