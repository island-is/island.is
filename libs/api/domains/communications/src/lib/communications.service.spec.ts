import { EmailService, EMAIL_OPTIONS } from '@island.is/email-service'
import { Logger, logger, LOGGER_PROVIDER } from '@island.is/logging'
import { Test } from '@nestjs/testing'
import { CommunicationsService } from './communications.service'
import { ContactUsInput } from './dto/contactUs.input'
import { TellUsAStoryInput } from './dto/tellUsAStory.input'

describe('communicationsService', () => {
  const fakeContactUsInput: ContactUsInput = {
    email: 'test@example.com',
    message: 'Test message',
    name: 'Tester',
    phone: '1231234',
    subject: 'Test',
    type: 'contactUs',
  }
  const fakeTellUsAStoryInput: TellUsAStoryInput = {
    email: 'test@example.com',
    message: 'Test message',
    name: 'Tester',
    subject: 'Test',
    type: 'tellUsAStory',
    dateOfStory: '2020-11-21',
    organization: 'test',
    publicationAllowed: false,
  }
  let communicationsService: CommunicationsService
  let emailService: EmailService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: EMAIL_OPTIONS,
          useValue: { useTestAccount: true },
        },
        {
          provide: LOGGER_PROVIDER,
          useValue: logger,
        },
        CommunicationsService,
        EmailService,
      ],
    }).compile()

    emailService = moduleRef.get<EmailService>(EmailService)
    communicationsService = moduleRef.get<CommunicationsService>(
      CommunicationsService,
    )
  })

  describe('getEmailTemplate', () => {
    it('should genereate difrent templates', () => {
      // we know these two inputs should generate difrent templates
      const contactUsTemplate = communicationsService.getEmailTemplate(
        fakeContactUsInput,
      )
      const tellUsAStoryTemplate = communicationsService.getEmailTemplate(
        fakeTellUsAStoryInput,
      )
      expect(contactUsTemplate).not.toMatchObject(tellUsAStoryTemplate)
    })
  })

  describe('sendEmail', () => {
    it('should try to send emails', async () => {
      const result = 'successId'
      jest
        .spyOn(emailService, 'sendEmail')
        .mockImplementation(() => Promise.resolve(result))

      expect(await communicationsService.sendEmail(fakeContactUsInput)).toBe(
        true,
      )
    })

    it('should normalize throw errors', async () => {
      const result = 'successId'
      jest.spyOn(emailService, 'sendEmail').mockImplementation(() => {
        throw new Error('Some unexpected error')
      })

      expect(async () => {
        await communicationsService.sendEmail(fakeContactUsInput)
      }).rejects.not.toThrowError('Some unexpected error')
    })
  })
})
