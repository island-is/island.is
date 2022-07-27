import { MailchimpResolver } from './mailchimp.resolver'
import { Test } from '@nestjs/testing'
import { CmsContentfulService, CmsModule } from '@island.is/cms'
import axios from 'axios'
import { emailSlice } from './fixtures/mailingSlice'

describe('mailchimpResolver', () => {
  let mailchimpResolver: MailchimpResolver
  let cmsContentfulService: CmsContentfulService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CmsModule],
      providers: [MailchimpResolver],
    }).compile()

    mailchimpResolver = moduleRef.get<MailchimpResolver>(MailchimpResolver)
    cmsContentfulService = moduleRef.get<CmsContentfulService>(
      CmsContentfulService,
    )
  })

  describe('subscribeMailchimp', () => {
    it('should try to subscribe to a valid mailing list', async () => {
      const testInput = {
        signupID: '123',
        email: 'test@example.com',
        name: 'Tester',
        toggle: true,
      }

      jest
        .spyOn(cmsContentfulService, 'getMailingListSignupSlice')
        .mockImplementation(({ id }) =>
          Promise.resolve(id === '123' ? emailSlice : null),
        )

      jest.spyOn(axios, 'get').mockImplementation((url) => {
        if (
          url ===
          'https://example.com/signup?email=test@example.com&name=Tester&toggle=Yes'
        ) {
          return Promise.resolve(true)
        } else {
          return Promise.reject()
        }
      })

      const result = await mailchimpResolver.mailchimpSubscribe(testInput)

      expect(result?.subscribed).toBe(true)
    })

    it('should try to subscribe to a mailing list that responds with an error', async () => {
      const testInput = {
        signupID: '123',
        email: 'test@example.com',
        name: 'Tester',
        toggle: true,
      }

      jest
        .spyOn(cmsContentfulService, 'getMailingListSignupSlice')
        .mockImplementation(({ id }) =>
          Promise.resolve(id === '123' ? emailSlice : null),
        )

      // Mock axios throwing an error
      jest.spyOn(axios, 'get').mockImplementation(() => Promise.reject())

      const result = await mailchimpResolver.mailchimpSubscribe(testInput)

      expect(result?.subscribed).toBe(false)
    })

    it('should try to subscribe to a mailing list that has an invalid URL', async () => {
      const testInput = {
        signupID: '123',
        email: 'invalid_email',
        name: 'Tester',
        toggle: true,
      }

      const testEmailSlice = {
        ...emailSlice,
        signupUrl: 'https://example.com/invalid_url',
      }

      jest
        .spyOn(cmsContentfulService, 'getMailingListSignupSlice')
        .mockImplementation(({ id }) =>
          Promise.resolve(id === '123' ? testEmailSlice : null),
        )

      const result = await mailchimpResolver.mailchimpSubscribe(testInput)

      expect(result?.subscribed).toBe(false)
    })
  })
})
