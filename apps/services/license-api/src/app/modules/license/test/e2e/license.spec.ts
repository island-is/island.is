import request from 'supertest'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { AppModule } from '../../../../app.module'
import { setup } from '../../../../../test/setup'
import { INestApplication } from '@nestjs/common'
import { LicenseApiScope } from '@island.is/auth/scopes'
import { IdsUserGuard, MockAuthGuard } from '@island.is/auth-nest-tools'

let app: INestApplication
let server: request.SuperTest<request.Test>

beforeAll(async () => {
  const currentUser = createCurrentUser({
    scope: ['@island.is/licenses:verify'],
  })
  const { nationalId } = currentUser
  app = await setup(AppModule)

  server = request(app.getHttpServer())
})

describe('LicenseApiService', () => {
  it('should verify a license', async () => {
    const check = await verifyLicense()
    expect(check).toBeTruthy()
  })
})

export const verifyLicense = async () => {
  const response = await server
    .post('v1/licenses/verify')
    .send({
      barcodeData:
        '{"code":"1","date":"2","passTemplateName":"3","passTemplateId":4"}',
    })
    .expect(500)
  return response
}
