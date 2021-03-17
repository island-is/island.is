import { mock } from 'jest-mock-extended'
import { ZendeskService } from './zendesk.service'
import { Logger } from '@island.is/logging'

describe('zendeskService', () => {
  it('should work', () => {
    const zendeskService = new ZendeskService(
      {
        token: 'Test token',
        email: 'Test email',
        subdomain: 'Test subdomain',
      },
      mock<Logger>(),
    )

    expect(zendeskService).toBeInstanceOf(ZendeskService)
  })
})
