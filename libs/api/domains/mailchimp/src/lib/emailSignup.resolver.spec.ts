import { EmailSignupResolver } from './emailSignup.resolver'
import { Test } from '@nestjs/testing'
import { CmsContentfulService, CmsModule } from '@island.is/cms'
import axios from 'axios'
import { emailSignup } from './fixtures/emailSignup'
import { EmailSignupInput } from './dto/emailSignup.input'

describe('emailSignupResolver', () => {
  let emailSignupResolver: EmailSignupResolver
  let cmsContentfulService: CmsContentfulService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CmsModule],
      providers: [EmailSignupResolver],
    }).compile()

    emailSignupResolver = moduleRef.get<EmailSignupResolver>(
      EmailSignupResolver,
    )
    cmsContentfulService = moduleRef.get<CmsContentfulService>(
      CmsContentfulService,
    )
  })

  describe('subscribeMailchimp', () => {
    const testInput: EmailSignupInput = {
      signupID: '123',
      inputFields: [
        // {
        //   name: 'EMAIL',
        //   type: 'email',
        //   value: 'test@example.com',
        // },
        {
          name: 'NAME',
          type: 'input',
          value: 'Tester',
        },
      ],
    }

    it('should try to subscribe to a valid mailing list', async () => {
      jest
        .spyOn(cmsContentfulService, 'getEmailSignup')
        .mockImplementation(({ id }) =>
          Promise.resolve(id === '123' ? emailSignup : null),
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

      const result = await emailSignupResolver.emailSignupSubscription(
        testInput,
      )

      expect(result?.subscribed).toBe(true)
    })

    it('should try to subscribe to a mailing list that responds with an error', async () => {
      jest
        .spyOn(cmsContentfulService, 'getMailingListSignupSlice')
        .mockImplementation(({ id }) =>
          Promise.resolve(id === '123' ? emailSlice : null),
        )

      // Mock axios throwing an error
      jest.spyOn(axios, 'get').mockImplementation(() => Promise.reject())

      const result = await emailSignupResolver.emailSignupSubscription(
        testInput,
      )

      expect(result?.subscribed).toBe(false)
    })

    it('should try to subscribe to a mailing list that has an invalid URL', async () => {
      const testEmailSlice = {
        ...emailSlice,
        signupUrl: 'https://example.com/invalid_url',
      }

      jest
        .spyOn(cmsContentfulService, 'getMailingListSignupSlice')
        .mockImplementation(({ id }) =>
          Promise.resolve(id === '123' ? testEmailSlice : null),
        )

      const result = await emailSignupResolver.mailchimpSubscribe(testInput)

      expect(result?.subscribed).toBe(false)
    })
  })
})
