import request from 'supertest'
import { errorExpectedStructure } from '../../../../../../test/testHelpers'
import { EndorsementTag } from '../../constants'
import { getAuthenticatedApp } from '../../../../../../test/setup'
import { authNationalId } from './seed'
import { EndorsementsScope } from '@island.is/auth/scopes'

describe('findByTagsEndorsementList', () => {
  it(`GET /endorsement-list?tags should return validation error when called with a non existing tag`, async () => {
    const app = await getAuthenticatedApp({
      nationalId: authNationalId,
      scope: [EndorsementsScope.main],
    })
    const response = await request(app.getHttpServer())
      .get(
        `/endorsement-list?tags[]=thisTagIsUsedInE2ETests&tags[]=${EndorsementTag.GENERAL_PETITION}`,
      )
      .send()
      .expect(400)
    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 400,
      message: ['each value in tags must be a valid enum value'],
    })
  })
  it(`GET /endorsement-list?tags should return 200 and empty list when no data exists for given tags`, async () => {
    const app = await getAuthenticatedApp({
      nationalId: authNationalId,
      scope: [EndorsementsScope.main],
    })
    const response = await request(app.getHttpServer())
      .get(`/endorsement-list?tags=${EndorsementTag.PARTY_LETTER_2021}`)
      .send()
      .expect(200)
    expect(response.body.data).toStrictEqual([])
  })
  it(`GET /endorsement-list?tags should return 200 and a list`, async () => {
    const app = await getAuthenticatedApp({
      nationalId: authNationalId,
      scope: [EndorsementsScope.main],
    })
    const response = await request(app.getHttpServer())
      .get(`/endorsement-list?tags=${EndorsementTag.GENERAL_PETITION}`)
      .send()
      .expect(200)
    expect(Array.isArray(response.body.data)).toBeTruthy()
    expect(response.body.data.length).toBeGreaterThanOrEqual(2)
    expect(response.body.totalCount).toBeGreaterThanOrEqual(2)
    // Create endorsement test does not clear db so there is one more endorsment list than should be when all tests are run together
  })

  // general petition tests
  it(`GET /endorsement-list/general-petition-lists should return 200 and 2 lists`, async () => {
    const app = await getAuthenticatedApp({
      nationalId: authNationalId,
      scope: [],
    })
    const response = await request(app.getHttpServer())
      .get(`/endorsement-list/general-petition-lists?limit=5`)
      .send()
      .expect(200)
    expect(response.body.data).toHaveLength(5)
    expect(response.body.pageInfo.hasNextPage).toBeTruthy()
    expect(response.body.pageInfo.hasPreviousPage).toBeFalsy()
  })
})
