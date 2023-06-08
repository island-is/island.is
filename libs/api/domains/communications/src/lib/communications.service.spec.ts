import { EmailModule, EmailService } from '@island.is/email-service'
import { LoggingModule } from '@island.is/logging'
import { Test } from '@nestjs/testing'
import { ZendeskModule, ZendeskService } from '@island.is/clients/zendesk'
import { CommunicationsService } from './communications.service'
import { ContactUsInput } from './dto/contactUs.input'
import { TellUsAStoryInput } from './dto/tellUsAStory.input'
import {
  ServiceWebFormsInput,
  ServiceWebFormsInputWithInstitutionEmail,
} from './dto/serviceWebForms.input'
import { CmsModule } from '@island.is/cms'
import { FileStorageConfig, FileStorageModule } from '@island.is/file-storage'
import { ConfigModule } from '@nestjs/config'
import { CommunicationsConfig } from './communications.config'

describe('communicationsService', () => {
  const fakeServiceWebInput: ServiceWebFormsInput = {
    email: 'test@example.com',
    message: 'Test message',
    name: 'Tester',
    subject: 'Test',
    institutionSlug: 'stafraent-island',
    syslumadur: '',
    category: '',
    type: 'serviceWebForms',
  }
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
  let zendeskService: ZendeskService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        LoggingModule,
        EmailModule.register({ useTestAccount: true }),
        ZendeskModule.register({
          email: 'email',
          token: 'token',
          subdomain: 'subdomain',
        }),
        CmsModule,
        FileStorageModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [FileStorageConfig, CommunicationsConfig],
        }),
      ],
      providers: [CommunicationsService],
    }).compile()

    emailService = moduleRef.get<EmailService>(EmailService)
    zendeskService = moduleRef.get<ZendeskService>(ZendeskService)
    communicationsService = moduleRef.get<CommunicationsService>(
      CommunicationsService,
    )
  })

  describe('getEmailTemplate', () => {
    it('should generate different templates', () => {
      // we know these two inputs should generate different templates
      const contactUsTemplate =
        communicationsService.getEmailTemplate(fakeContactUsInput)
      const tellUsAStoryTemplate = communicationsService.getEmailTemplate(
        fakeTellUsAStoryInput,
      )
      expect(contactUsTemplate).not.toMatchObject(tellUsAStoryTemplate)
    })
  })

  describe('getInputWithInstitutionEmail', () => {
    it('should get service web input with institution email', async () => {
      const inputWithInstitutionEmail: ServiceWebFormsInputWithInstitutionEmail =
        {
          ...fakeServiceWebInput,
          institutionEmail: 'test@email.com',
        }

      jest
        .spyOn(communicationsService, 'getInputWithInstitutionEmail')
        .mockImplementation(() => Promise.resolve(inputWithInstitutionEmail))

      const response = await communicationsService.getInputWithInstitutionEmail(
        fakeServiceWebInput,
      )

      expect(response).toEqual(inputWithInstitutionEmail)
    })
  })

  describe('submitTicket', () => {
    it('should try to submit a ticket', async () => {
      const testUser = {
        name: 'John Smith',
        email: 'john@smith.com',
        id: 1234,
      }

      jest
        .spyOn(zendeskService, 'submitTicket')
        .mockImplementation(() => Promise.resolve(true))

      jest
        .spyOn(zendeskService, 'getUserByEmail')
        .mockImplementation(() => Promise.resolve(testUser))

      jest
        .spyOn(zendeskService, 'createUser')
        .mockImplementation(() => Promise.resolve(testUser))

      expect(
        await communicationsService.sendZendeskTicket(fakeContactUsInput),
      ).toBe(true)
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

    it('should normalize thrown errors', async () => {
      jest.spyOn(emailService, 'sendEmail').mockImplementation(() => {
        throw new Error('Some unexpected error')
      })

      expect(async () => {
        await communicationsService.sendEmail(fakeContactUsInput)
      }).rejects.not.toThrowError('Some unexpected error')
    })
  })
})
