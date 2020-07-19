import { Test, TestingModule } from '@nestjs/testing'

import { IndexingController } from './indexing.controller'
import { IndexingService } from './indexing.service'
import { ElasticService } from "@island.is/api/content-search";
import { Syncer } from "../contentful/syncer";

describe('IndexingController', () => {
  let app: TestingModule
  let service: IndexingService

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [IndexingController],
      providers: [IndexingService, ElasticService, Syncer],
    }).compile()

    service = app.get<IndexingService>(IndexingService)
  })

  describe('sync', () => {
    it('should return an empty response on first sync', async () => {
      const appController = app.get<IndexingController>(IndexingController)
      const getLastSyncToken = jest
        .spyOn(service, 'getLastSyncToken')
        .mockClear()
        .mockImplementation(() => undefined)
      const continueSync = jest
        .spyOn(service, 'continueSync')
        .mockClear()
        .mockImplementation(() => {
          throw Error('Should not be invoked')
        })
      const initialSync = jest
        .spyOn(service, 'initialSync')
        .mockClear()
        .mockImplementation(() => undefined)

      expect(await appController.sync()).toEqual({
        acknowledge: true,
      })
      expect(getLastSyncToken.mock.calls.length).toBe(1)
      expect(initialSync.mock.calls.length).toBe(1)
      expect(continueSync.mock.calls.length).toBe(0)
    })
    it('should return an empty response on continue sync', async () => {
      const appController = app.get<IndexingController>(IndexingController)
      const getLastSyncToken = jest
        .spyOn(service, 'getLastSyncToken')
        .mockClear()
        .mockImplementation(async () => '1')
      const continueSync = jest
        .spyOn(service, 'continueSync')
        .mockClear()
        .mockImplementation(() => undefined)
      const initialSync = jest
        .spyOn(service, 'initialSync')
        .mockClear()
        .mockImplementation(() => {
          throw Error('Should not be invoked')
        })

      expect(await appController.sync()).toEqual({
        acknowledge: true,
      })
      expect(getLastSyncToken.mock.calls.length).toBe(1)
      expect(initialSync.mock.calls.length).toBe(0)
      expect(continueSync.mock.calls.length).toBe(1)
    })
  })
})
