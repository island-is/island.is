import { Test, TestingModule } from '@nestjs/testing'

import { IndexingController } from './indexing.controller'
import { IndexingService } from './indexing.service'

describe('IndexingController', () => {
  let app: TestingModule

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [IndexingController],
      providers: [IndexingService],
    }).compile()
  })

  describe('getData', () => {
    it('should return "Welcome to services/search-indexer!"', () => {
      const appController = app.get<IndexingController>(IndexingController)
      expect(appController.getData()).toEqual({
        message: 'Welcome to services/search-indexer!',
      })
    })
  })
})
