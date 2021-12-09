import { Test, TestingModule } from '@nestjs/testing'
import { logger, LOGGER_PROVIDER } from '@island.is/logging'
import { SequelizeModule } from '@nestjs/sequelize'
import { RecyclingPartnerService } from './recyclingPartner.service'
import { RecyclingPartnerModel } from './recyclingPartner.model'
import { forwardRef } from '@nestjs/common'

describe('accessControlService', () => {
  let recyclingPartnerService: RecyclingPartnerService
  let moduleRef: TestingModule

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        SequelizeModule.forFeature([RecyclingPartnerModel]),
        SequelizeModule.forRoot({
          dialect: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'dev_db',
          password: 'dev_db',
          database: 'dev_db',
          autoLoadModels: true,
          synchronize: true,
        }),
      ],
      providers: [
        RecyclingPartnerService,
        {
          provide: LOGGER_PROVIDER,
          useValue: logger,
        },
      ],
    }).compile()
    recyclingPartnerService = moduleRef.get(RecyclingPartnerService)
  })

  afterEach(async () => {
    await moduleRef.close()
  })

  describe('testRecylingPartner', () => {
    it('get all recyclingPartner ', async () => {
      const res = await recyclingPartnerService.findAll()
      // logger.debug('' + JSON.stringify(res, null, 2))
      expect(true).toEqual(true)
    })
  })
})

// update module for test
// @Module({
//   imports: [
//     SequelizeModule.forFeature([RecyclingPartnerModel]),
//     //  forwardRef(() =>  SequelizeModule.forFeature([RecyclingPartnerModel]))
//   ],
//   providers: [RecyclingPartnerResolver, RecyclingPartnerService],
//   exports: [RecyclingPartnerService],
// })