import { Test, TestingModule } from '@nestjs/testing'
import { HttpModule, HttpService } from '@nestjs/axios'
import { PlausibleService } from './plausible.service'
import { of } from 'rxjs'

describe('PlausibleService', () => {
  let plausibleService: PlausibleService
  let httpService: HttpService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [PlausibleService],
    }).compile()

    plausibleService = module.get<PlausibleService>(PlausibleService)
    httpService = module.get<HttpService>(HttpService)
  })

  it('should send event', async () => {
    const testEvent = {
      name: 'Application Finished',
      url: 'localhost:4200/umsoknir',
      domain: 'island.is',
      props: {
        featureName: 'Application-System',
        applicationType: 'example',
        timestamp: '1633029446198',
        applicationId: '1234567890',
      },
    }

    const testHeaders = {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36 OPR/71.0.3770.284',
      'X-Forwarded-For': '127.0.0.1',
    }

    const successResponse = jest
      .spyOn(httpService, 'post')
      .mockImplementationOnce(() =>
        of({
          status: 200,
          data: { value: 'something' },
          statusText: '',
          headers: {},
          config: {},
        }),
      )

    const result = await plausibleService.sendEvent(testEvent, testHeaders)

    expect(result).toEqual(successResponse.mock.results[0].value.data)
    expect(httpService.post).toHaveBeenCalledWith(
      'https://plausible.io/api/event',
      testEvent,
      {
        headers: testHeaders,
      },
    )
  })

  it('should throw on failure to send event', async () => {
    const testEvent = {
      name: 'Application Finished',
      url: 'localhost:4200/umsoknir',
      domain: 'island.is',
      props: {
        featureName: 'Application-System',
        applicationType: 'example',
        timestamp: '1633029446198',
        applicationId: '1234567890',
      },
    }

    const testHeaders = {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36 OPR/71.0.3770.284',
      'X-Forwarded-For': '127.0.0.1',
    }

    const failureError = new Error('Failed to send event')
    jest.spyOn(httpService, 'post').mockImplementationOnce(() => {
      throw failureError
    })

    await expect(
      plausibleService.sendEvent(testEvent, testHeaders),
    ).rejects.toThrow(failureError)
  })
})
