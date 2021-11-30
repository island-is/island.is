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

export const YEAR = 0

const config = {
    url: 'https://localhost',
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
        console.log(service)
      expect(service).toBeTruthy()
    })
  })

  describe('getHomestays', () => {
    it('should return false for a normal license', async () => {
      const response = await service.getHomestays(YEAR)

      expect(response).toStrictEqual(VHSUCCESS)
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
