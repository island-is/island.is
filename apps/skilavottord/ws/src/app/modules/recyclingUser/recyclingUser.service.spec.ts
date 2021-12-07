import { Test, TestingModule } from '@nestjs/testing'
import { RecyclingUserService } from './recyclingUser.service'
import { logger, LOGGER_PROVIDER } from '@island.is/logging'
import { SequelizeModule } from '@nestjs/sequelize'
import { RecyclingUserModel } from './recyclingUser.model'

describe('skilavottordUserService', () => {
  let recyclingUserServie: RecyclingUserService
  let moduleRef: TestingModule

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        SequelizeModule.forFeature([RecyclingUserModel]),
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
        RecyclingUserService,
        {
          provide: LOGGER_PROVIDER,
          useValue: logger,
        },
      ],
    }).compile()
    recyclingUserServie = moduleRef.get(RecyclingUserService)
  })

  afterEach(async () => {
    await moduleRef.close()
  })

  describe('testRecyclingService', () => {
    it('get all recycling users', async () => {
      const res = await recyclingUserServie.findAll()
      expect(true).toEqual(true)
    })
    it('get one recycling user', async () => {
      const res = await recyclingUserServie.findOne('7777777777')
      expect(true).toEqual(true)
    })
    it('create recycling user', async () => {
      const user = new RecyclingUserModel()
      user.nationalId = '3333333333'
      user.name = 'Jónas Jónsson'
      user.role = 'citizen'
      user.partnerid = '123'
      user.active = true
      const res = await recyclingUserServie.createRecyclingUser(user)
      expect(true).toEqual(true)
    })
  })
})
