import { logger } from '@island.is/logging'
import { SmartSolutionsApi } from './smartSolutions.api'

describe('SmartSolutionsApi', () => {
  let service: SmartSolutionsApi

  beforeEach(async () => {
    service = new SmartSolutionsApi(logger)
  })

  describe('Module', () => {
    it('should be defined', () => {
      expect(service).toBeTruthy()
    })
  })

  describe('listTemplates', () => {
    it('should return a valid response', async () => {
      const res = await service.listTemplates()
      expect(res).not.toBeNull()
    })
  })
})
