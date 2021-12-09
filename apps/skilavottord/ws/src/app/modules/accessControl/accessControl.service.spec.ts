import { Test, TestingModule } from '@nestjs/testing'
import { logger, LOGGER_PROVIDER } from '@island.is/logging'
import { SequelizeModule } from '@nestjs/sequelize'
import { AccessControlService } from './accessControl.service'
import { AccessControlModel } from './accessControl.model'
import { Role } from '../auth'
import { RecyclingPartnerModel } from '../recyclingPartner/recyclingPartner.model'
import { RecyclingRequestModel } from '../recyclingRequest'

describe('accessControlService', () => {
  let accessControlService: AccessControlService
  let moduleRef: TestingModule

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        SequelizeModule.forFeature([AccessControlModel, RecyclingPartnerModel, RecyclingRequestModel]),
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

  describe('testAccessControl', () => {
    it('get all access control', async () => {
      const res = await accessControlService.findAll()
      logger.debug('' + JSON.stringify(res, null, 2))
      expect(true).toEqual(true)
    })
    // it('get one recycling user', async () => {
    //   const res = await accessControlService.findOne('7777777777')
    //   expect(true).toEqual(true)
    // })
    it('create access', async () => {
      const user = new AccessControlModel()
      user.nationalId = '1111111111'
      user.name = 'Jónas Jónsson'
      user.role = Role.recyclingCompany
      user.partnerId = '8888888888'
      const res = await accessControlService.createAccess(user)
      logger.debug('created access success:' + JSON.stringify(res, null, 2))
      expect(true).toEqual(true)
    })
    it('get one recycling user', async () => {
      let kt = '1111111111'
      let user = await accessControlService.findOne(kt)
      if (user) {
        let dd = user as AccessControlModel
        dd.name = 'Jón Jónsson'
        const res = await accessControlService.updateAccess(dd)
      } else {
        logger.debug('fann ekki access notanda: ' + kt)
      }
      expect(true).toEqual(true)
    })
    it('remove access', async () => {
      const count = await accessControlService.removeAccess('1111111111')
      logger.debug('removed access success: ' + count)
      expect(true).toEqual(true)
    })
  })
})
