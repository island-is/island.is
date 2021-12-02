import { Test } from '@nestjs/testing'
import { SyslumennService } from './syslumenn.service'
import { SyslumennModule } from './syslumenn.module'
import {
    SYSLUMENN_CLIENT_CONFIG,
    SyslumennClient,
    SyslumennClientConfig,
  } from './client/syslumenn.client'
import { startMocking } from '@island.is/shared/mocking'
import { createLogger } from 'winston'
import { requestHandlers } from './__mock-data__/requestHandlers'
import {VHSUCCESS, VHFAIL }from './__mock-data__/virkarHeimagistingar'
import { HttpModule } from '@nestjs/common'
import { Homestay, mapHomestay } from './models/homestay'
import { IHomestay } from './client/models/homestay'

const YEAR = 2021

const config = {
    url: 'http://localhost',
    username: '',
    password: ''
  } as SyslumennClientConfig

startMocking(requestHandlers)

describe('SyslumennService', () => {
  let service: SyslumennService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        HttpModule.register({
            timeout: 10000,
          }),
      ],
      providers: [
        SyslumennService,
        SyslumennClient,
        {
          provide: SYSLUMENN_CLIENT_CONFIG,
          useValue: config,
        },],
    }).compile()

    service = module.get(SyslumennService)
  })

  describe('Module', () => {
    it('should be defined', () => {
      expect(service).toBeTruthy()
    })
  })

  describe('getHomestays', () => {
    it('should return false for a normal license', async () => {
      const response = await service.getHomestays(YEAR)
      expect(response).toStrictEqual((VHSUCCESS ?? []).map(mapHomestay))
    })

    // it('should return true for a teacher', async () => {
    //   const response = await service.getTeachingRights(MOCK_NATIONAL_ID_TEACHER)

    //   expect(response).toStrictEqual({
    //     nationalId: MOCK_NATIONAL_ID_TEACHER,
    //     hasTeachingRights: true,
    //   })
    // })
  })


})
