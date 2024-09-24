import request from 'supertest'
import { EndorsementsScope } from '@island.is/auth/scopes'
import { getAuthenticatedApp } from '../../../../../../test/setup'
import { errorExpectedStructure } from '../../../../../../test/testHelpers'
import { EndorsementTag } from '../../constants'
import { authNationalId } from '../closeEndorsementList/seed'

describe('createEndorsementList', () => {
  it(`POST /endorsement-list should return 200 OK if scope is ok`, async () => {
    const app = await getAuthenticatedApp({
      nationalId: authNationalId,
      scope: [EndorsementsScope.main],
    })
    const newEndorsementList = {
      title: 'string',
      description: 'string',
      endorsementMetadata: [
        {
          field: 'fullName',
        },
      ],
      tags: ['generalPetition'],
      meta: { email: 'asdf@asdf.is', phone: '5559999' },
      closedDate: '2029-06-12T15:31:00.254Z',
      openedDate: '2023-06-12T15:31:00.254Z',

      adminLock: false,
    }

    await request(app.getHttpServer())
      .post('/endorsement-list')
      .send(newEndorsementList)
      // .expect(201) // Check the status code
      .expect('Content-Type', /json/) // Ensure it's JSON response
      .expect((res) => {
        // Validate response body fields
        expect(res.body.title).toBe('string');
        expect(res.body.meta.email).toBe('asdf@asdf.is');
        expect(res.body.meta.phone).toBe('5559999');
      });
  })
  it(`POST /endorsement-list should fail and return 403 error if scope is missing`, async () => {
    const app = await getAuthenticatedApp({
      nationalId: authNationalId,
      scope: [],
    })
    const newEndorsementList = {
      title: 'Some title',
      description: 'Some description',
      tags: [EndorsementTag.GENERAL_PETITION],
      endorsementMeta: ['fullName'],
      endorsement_metadata: [{ field: 'fullName' }],
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
})
