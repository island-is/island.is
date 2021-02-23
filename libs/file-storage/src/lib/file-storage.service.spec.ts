import { Test } from '@nestjs/testing'
import { FileStorageService } from './file-storage.service'
import { ConfigModule } from '@nestjs/config'
import { fileStorageConfiguration } from './file-storage.configuration'

describe('FileStorageService', () => {
  let service: FileStorageService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [ConfigModule.forFeature(fileStorageConfiguration)],
      providers: [FileStorageService],
    }).compile()

    service = module.get(FileStorageService)
  })

  it('should be defined', () => {
    expect(service).toBeTruthy()
  })
})
