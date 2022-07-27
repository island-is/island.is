import { MailchimpResolver } from '@island.is/api/domains/mailchimp'
import { Test } from '@nestjs/testing'
import {
  CmsContentfulService,
  CmsModule,
  MailingListSignupSlice,
} from '@island.is/cms'
import axios from 'axios'

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
    it('should try to subscribe an email address', async () => {
      const testInput = {
        signupID: '123',
        email: 'test@example.com',
        name: 'Tester',
        toggle: true,
      }

      const testEmailSlice: MailingListSignupSlice = {
        id: '123',
        title: 'Test',
        variant: 'test',
        description: 'Test',
        inputLabel: 'test',
        fullNameLabel: 'test',
        questionLabel: 'test',
        yesLabel: 'yes',
        noLabel: 'no',
        disclaimerLabel: 'disclaimer',
        buttonText: 'submit',
        signupUrl:
          'https://example.com/signup?email={{EMAIL}}&name={{NAME}}&toggle={{TOGGLE}}',
      }

      jest
        .spyOn(cmsContentfulService, 'getMailingListSignupSlice')
        .mockImplementation(({ id }) =>
          Promise.resolve(id === '123' ? testEmailSlice : null),
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
  })
})
