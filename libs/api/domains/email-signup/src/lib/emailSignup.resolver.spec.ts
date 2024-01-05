import { EmailSignupResolver } from './emailSignup.resolver'
import { Test } from '@nestjs/testing'
import { CmsContentfulService, CmsModule, EmailSignup } from '@island.is/cms'
import axios from 'axios'
import { emailSignup } from './fixtures/emailSignup'
import { EmailSignupInput } from './dto/emailSignup.input'
import { EmailSignupService } from './emailSignup.service'
import { ZenterSignupService } from './services/zenter/zenter.service'
import { MailchimpSignupService } from './services/mailchimp/mailchimp.service'
import { ZENTER_IMPORT_ENDPOINT_URL } from './constants'

describe('emailSignupResolver', () => {
  let emailSignupResolver: EmailSignupResolver
  let cmsContentfulService: CmsContentfulService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CmsModule],
      providers: [
        {
          provide: ZenterSignupService,
          useFactory() {
            return new ZenterSignupService({
              fiskistofaZenterClientId: '',
              fiskistofaZenterClientPassword: '',
              fiskistofaZenterEmail: '',
              fiskistofaZenterPassword: '',
              isConfigured: true,
            })
          },
        },
        MailchimpSignupService,
        EmailSignupService,
        EmailSignupResolver,
        EmailSignupResolver,
      ],
    }).compile()

    emailSignupResolver =
      moduleRef.get<EmailSignupResolver>(EmailSignupResolver)
    cmsContentfulService =
      moduleRef.get<CmsContentfulService>(CmsContentfulService)
  })

  describe('subscribeMailchimp', () => {
    const testInput: EmailSignupInput = {
      signupID: '123',
      inputFields: [
        {
          name: 'EMAIL',
          type: 'email',
          value: 'test@example.com',
          id: '1',
        },
        {
          name: 'NAME',
          type: 'input',
          value: 'Tester',
          id: '2',
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
          'https://example.com/signup?EMAIL=test@example.com&NAME=Tester'
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
        .spyOn(cmsContentfulService, 'getEmailSignup')
        .mockImplementation(({ id }) =>
          Promise.resolve(id === '123' ? emailSignup : null),
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
        ...emailSignup,
        signupUrl: 'https://example.com/invalid_url',
      }

      jest
        .spyOn(cmsContentfulService, 'getEmailSignup')
        .mockImplementation(({ id }) =>
          Promise.resolve(id === '123' ? testEmailSlice : null),
        )

      const result = await emailSignupResolver.emailSignupSubscription(
        testInput,
      )

      expect(result?.subscribed).toBe(false)
    })
  })

  describe('subscribeToZenter', () => {
    it('should get a successful response if input is valid', async () => {
      const testEmailSlice: EmailSignup = {
        id: '456',
        title: '',
        configuration: {
          owner: 'fiskistofa',
        },
        description: '',
        formFields: [
          {
            id: '1',
            options: [],
            placeholder: '',
            required: true,
            title: '',
            type: 'email',
            name: 'email',
            emailConfig: {},
          },
        ],
        signupType: 'zenter',
        translations: {},
      }
      jest
        .spyOn(cmsContentfulService, 'getEmailSignup')
        .mockImplementation(({ id }) =>
          Promise.resolve(id === '456' ? testEmailSlice : null),
        )

      jest.spyOn(axios, 'post').mockImplementation((url) => {
        console.log('yee', url, url === ZENTER_IMPORT_ENDPOINT_URL)
        return Promise.resolve({
          data: url === ZENTER_IMPORT_ENDPOINT_URL ? 1 : 0,
        })
      })

      const result = await emailSignupResolver.emailSignupSubscription({
        inputFields: [
          { id: '1', name: 'email', type: 'email', value: 'test@example.com' },
        ],
        signupID: '456',
      })

      expect(result?.subscribed).toBe(true)
    })
  })
})
