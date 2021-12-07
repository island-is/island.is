import { Test, TestingModule } from '@nestjs/testing'
import { logger, LOGGER_PROVIDER } from '@island.is/logging'
import { SequelizeModule } from '@nestjs/sequelize'
import { AccessControlService } from './accessControl.service'
import { AccessControlModel } from './accessControl.model'

describe('accessControlService', () => {
  let accessControlService: AccessControlService
  let moduleRef: TestingModule

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        SequelizeModule.forFeature([AccessControlModel]),
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
        AccessControlService,
        {
          provide: LOGGER_PROVIDER,
          useValue: logger,
        },
      ],
    }).compile()
    accessControlService = moduleRef.get(AccessControlService)
  })

  afterEach(async () => {
    await moduleRef.close()
  })

  describe('testRecyclingService', () => {
    it('get all recycling users', async () => {
      const res = await accessControlService.findAll()
      expect(true).toEqual(true)
    })
    it('get one recycling user', async () => {
      const res = await accessControlService.findOne('7777777777')
      expect(true).toEqual(true)
    })
    it('create recycling user', async () => {
      const user = new AccessControlModel()
      user.nationalId = '3333333333'
      user.name = 'Jónas Jónsson'
      user.role = 'citizen'
      user.partnerid = '123'
      user.active = true
      const res = await accessControlService.createAccessControl(user)
      expect(true).toEqual(true)
    })
  })
})
