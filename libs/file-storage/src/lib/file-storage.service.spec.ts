import { Test } from '@nestjs/testing'
import { FileStorageService } from './file-storage.service'

describe('FileStorageService', () => {
  let service: FileStorageService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [FileStorageService],
    }).compile()

    service = module.get(FileStorageService)
  })

  it('should be defined', () => {
    expect(service).toBeTruthy()
  })
})
