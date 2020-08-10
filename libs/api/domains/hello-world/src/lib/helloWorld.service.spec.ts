import { Test } from '@nestjs/testing'
import { HelloWorldService } from './helloWorld.service'
import { HelloWorldRepository } from './helloWorld.repository'

describe('HelloWorldService', () => {
  let helloWorldRepository: HelloWorldRepository
  let helloWorldService: HelloWorldService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [HelloWorldService, HelloWorldRepository],
    }).compile()

    helloWorldService = moduleRef.get(HelloWorldService)
    helloWorldRepository = moduleRef.get(HelloWorldRepository)
  })

  describe('getMessage', () => {
    it('should return a greeting', () => {
      // Arrange
      jest
        .spyOn(helloWorldRepository, 'getHelloWord')
        .mockImplementation(() => 'Hi')

      // Act
      const message = helloWorldService.getMessage('test')

      // Assert
      expect(message).toBe('Hi test!')
    })
  })
})
