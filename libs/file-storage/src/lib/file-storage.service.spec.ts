import { ConfigModule } from '@nestjs/config'
import { Test } from '@nestjs/testing'
import { FileStorageConfig } from './file-storage.configuration'
import { FileStorageService } from './file-storage.service'
import { S3Service } from '@island.is/nest/aws'

describe('FileStorageService', () => {
  let service: FileStorageService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [FileStorageConfig],
        }),
      ],
      providers: [
        FileStorageService,
        {
          provide: S3Service,
          useValue: {},
        },
      ],
    }).compile()

    service = module.get(FileStorageService)
  })

  it('should be defined', () => {
    expect(service).toBeTruthy()
  })
})
