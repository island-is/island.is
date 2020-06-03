import { Test } from '@nestjs/testing'

import { IndexingService } from './indexing.service'

describe('AppService', () => {
  let service: IndexingService

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [IndexingService],
    }).compile()

    service = app.get<IndexingService>(IndexingService)
  })

  describe('getData', () => {
    it('should return "Welcome to services/search-indexer!"', () => {
      expect(service.getData()).toEqual({
        message: 'Welcome to services/search-indexer!',
      })
    })
  })
})
