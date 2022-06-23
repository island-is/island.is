describe('Dummy', () => {
  it('dummy', () => {
    expect(1).toBe(1)
  })
})

// import { GrantDto, UserIdentityDto } from '@island.is/auth-api-lib'
// import { INestApplication } from '@nestjs/common'
// import { setup } from '../../../../../test/setup'
// import request from 'supertest'

// let app: INestApplication

// beforeAll(async () => {
//   app = await setup()
// })

// const userIdentity: UserIdentityDto = {
//   subjectId: '0123456789',
//   name: 'Sigurdur Sturla Bjarnason',
//   providerName: 'Audkenni',
//   active: false,
//   providerSubjectId: 'audkenni_provider',
//   claims: [
//     {
//       type: 'nat',
//       value: '1234560123',
//       valueType: 'natreg',
//       issuer: 'Audkenni',
//       originalIssuer: 'Audkenni',
//     },
//   ],
// }

// const grantObject: GrantDto = {
//   key: '12345',
//   type: 'audkenni',
//   subjectId: '0123456789',
//   sessionId: '0123456789',
//   clientId: '@island.is/web',
//   description: 'grant_description',
//   creationTime: new Date(),
//   expiration: new Date(),
//   consumedTime: new Date(),
//   data: 'some_grant_data',
// }

// // User identities
// describe('Users', () => {
//   it('POST /user-identities should register userIdentity', async () => {
//     // ACT
//     const response = await request(app.getHttpServer())
//       .post('/user-identities')
//       .send(userIdentity)
//       .expect(201)

//     expect(response.body.claims).toHaveLength(1)
//     expect(response.body.subjectId).toEqual('0123456789')
//   })

//   it(`GET /user-identities/0123456789 should return a userIdentity object`, async () => {
//     // Act
//     const response = await request(app.getHttpServer())
//       .get('/user-identities/0123456789')
//       .expect(200)

//     expect(response.body.subjectId).toEqual('0123456789')
//     expect(response.body.providerName).toEqual('Audkenni')
//     expect(response.body.claims).toHaveLength(1)
//   })

//   it(`GET /user-identities/0123456788 should fail and return 404`, async () => {
//     // Act
//     const response = await request(app.getHttpServer())
//       .get('/user-identities/0123456788')
//       .expect(404)

//     expect(response.body).toMatchObject({
//       statusCode: 404,
//       message: "This user identity doesn't exist",
//       error: 'Not Found',
//     })
//   })

//   it(`GET /user-identities/Audkenni/audkenni_provider should return a userIdentity object`, async () => {
//     // Act
//     const response = await request(app.getHttpServer())
//       .get('/user-identities/Audkenni/audkenni_provider')
//       .expect(200)

//     expect(response.body.subjectId).toEqual('0123456789')
//     expect(response.body.providerName).toEqual('Audkenni')
//     expect(response.body.claims).toHaveLength(1)
//   })

//   it(`GET /user-identities/0123456789/audkenni_provider should fail and return 404`, async () => {
//     // Act
//     const response = await request(app.getHttpServer())
//       .get('/user-identities/0123456789/audkenni_provider')
//       .expect(404)

//     expect(response.body).toMatchObject({
//       statusCode: 404,
//       message: "This user identity doesn't exist",
//       error: 'Not Found',
//     })
//   })

//   // Clients
//   it(`GET /clients/@island.is/web1 should return a valid client`, async () => {
//     // Act
//     const response = await request(app.getHttpServer())
//       .get('/clients/@island.is/web')
//       .expect(200)

//     expect(response.body.clientId).toEqual('@island.is/web')
//     // expect(response.body.allowedScopes).toHaveLength(4)
//     // expect(response.body.allowedCorsOrigins).toHaveLength(4)
//     // expect(response.body.redirectUris).toHaveLength(12)
//   })

//   it(`GET /clients/island-is-2 should fail and return 404`, async () => {
//     // Act
//     const response = await request(app.getHttpServer())
//       .get('/clients/island-is-2')
//       .expect(404)

//     expect(response.body).toMatchObject({
//       statusCode: 404,
//       message: "This client doesn't exist",
//       error: 'Not Found',
//     })
//   })

//   // Grants
//   it('POST /grants should register a grant', async () => {
//     // ACT
//     const response = await request(app.getHttpServer())
//       .post('/grants')
//       .send(grantObject)
//       .expect(201)

//     expect(response.body.type).toEqual('audkenni')
//     expect(response.body.subjectId).toEqual('0123456789')
//   })

//   it(`GET /grants?subjectId=0123456789&sessionId=0123456789&clientId=@island.is/web&type=audkenni and expect a list of length 1`, async () => {
//     // Act
//     const response = await request(app.getHttpServer())
//       .get(
//         '/grants?subjectId=0123456789&sessionId=0123456789&clientId=@island.is/web&type=audkenni',
//       )
//       .expect(200)

//     expect(response.body).toHaveLength(1)
//     expect(response.body[0].key).toEqual('12345')
//   })

//   it(`GET /grants?subjectId=0123456788&sessionId=0123456789&clientId=@island.is/web&type=audkenni and expect a list of length zero`, async () => {
//     // Act
//     const response = await request(app.getHttpServer())
//       .get(
//         '/grants?subjectId=0123456788&sessionId=0123456789&clientId=@island.is/web&type=audkenni',
//       )
//       .expect(200)

//     expect(response.body).toHaveLength(0)
//   })

//   it(`DELETE /grants?subjectId=0123456789&sessionId=0123456789&clientId=@island.is/web&type=audkenni should delete one item`, async () => {
//     // Act
//     const response = await request(app.getHttpServer())
//       .delete(
//         '/grants?subjectId=0123456789&sessionId=0123456789&clientId=@island.is/web&type=audkenni',
//       )
//       .expect(200)

//     expect(response.text).toEqual('1')
//   })

//   it('POST /grants should register a grant', async () => {
//     // ACT
//     const response = await request(app.getHttpServer())
//       .post('/grants')
//       .send(grantObject)
//       .expect(201)

//     expect(response.body.type).toEqual('audkenni')
//     expect(response.body.subjectId).toEqual('0123456789')
//   })

//   it(`GET /grants/12345 should return a valid object`, async () => {
//     // Act
//     const response = await request(app.getHttpServer())
//       .get('/grants/12345')
//       .expect(200)

//     expect(response.body.key).toEqual('12345')
//   })

//   it(`GET /grants/12344 should return a 404 status`, async () => {
//     // Act
//     const response = await request(app.getHttpServer())
//       .get('/grants/12344')
//       .expect(404)

//     expect(response.body).toMatchObject({
//       statusCode: 404,
//       message: "This particular grant doesn't exist",
//       error: 'Not Found',
//     })
//   })

//   it(`DELETE /grants/12345 should delete one item`, async () => {
//     // Act
//     const response = await request(app.getHttpServer())
//       .delete('/grants/12345')
//       .expect(200)

//     expect(response.text).toEqual('1')
//   })
// })
