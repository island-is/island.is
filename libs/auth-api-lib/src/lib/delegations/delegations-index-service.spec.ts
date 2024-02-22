import { TestApp, testServer, useDatabase } from '@island.is/testing/nest'
import { SequelizeConfigService } from '../core/sequelizeConfig.service'
import { DelegationsIncomingCustomService } from './delegations-incoming-custom.service'
import { DelegationsIndexService } from './delegations-index.service'
import { DelegationIndex } from './models/delegation-index.model'
import { DelegationIndexMeta } from './models/delegation-index-meta.model'
import { getModelToken, SequelizeModule } from '@nestjs/sequelize'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { Module } from '@nestjs/common'
import { LoggingModule } from '@island.is/logging'

const testNationalId = '090990-0909'

@Module({
  imports: [
    LoggingModule,
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    SequelizeModule.forFeature([DelegationIndex, DelegationIndexMeta]),
  ],
  providers: [DelegationsIndexService, DelegationsIncomingCustomService],
})
export class DelegationsModule {}

class MockDelegationIncomingCustomService {
  async findAllValidIncoming() {
    console.log('is this called')
    return ['something']
  }
}

describe('DelegationIndexService', () => {
  let app: TestApp
  let delegationIndexService: DelegationsIndexService
  let delegationIndexModel: typeof DelegationIndex
  let delegationIndexMetaModel: typeof DelegationIndexMeta

  beforeEach(async () => {
    app = await testServer({
      appModule: DelegationsModule,
      hooks: [
        useDatabase({ type: 'postgres', provider: SequelizeConfigService }),
      ],
      override: (builder) =>
        builder
          .overrideProvider(DelegationsIncomingCustomService)
          .useClass(MockDelegationIncomingCustomService),
    })

    delegationIndexService = app.get(DelegationsIndexService)
    delegationIndexModel = app.get(getModelToken(DelegationIndex))
    delegationIndexMetaModel = app.get(getModelToken(DelegationIndexMeta))
  })

  afterEach(async () => {
    await app.cleanUp()
  })

  it('should not index delegations if next reindex date is in the future', async () => {
    // Arrange
    const user = createCurrentUser({ nationalId: testNationalId })
    await delegationIndexMetaModel.create({
      nationalId: user.nationalId,
      nextReindex: new Date(new Date().getTime() + 1000), // future date
      lastFullReindex: new Date(new Date().getTime() - 1000),
    })

    // Act
    const result = await delegationIndexService.indexDelegations(user)

    // Assert
    expect(result).toBeUndefined()
  })

  it('should not index delegations if next reindex date is in the future', async () => {
    // Arrange
    const user = createCurrentUser({ nationalId: testNationalId })

    // Act
    const result = await delegationIndexService.indexDelegations(user)
    console.log('result', result)
    // Assert
    expect(result).not.toBeUndefined()
  })
})
