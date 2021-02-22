import { Test } from '@nestjs/testing'
import { FileService } from './file.service'
import { SigningService, SIGNING_OPTIONS } from '@island.is/dokobit-signing'
import * as aws from './utils/aws'
import * as pdf from './utils/pdf'
import { Application } from './../application.model'
import { ApplicationTypes, PdfTypes } from '@island.is/application/core'
import { LoggingModule } from '@island.is/logging'
import { NotFoundException } from '@nestjs/common'

describe('FileService', () => {
  let service: FileService
  let signingService: SigningService
  const signingServiceRequestSignatureResponse = {
    controlCode: 'code',
    documentToken: 'token',
  }
  const applicantsPhoneNumber = '111-2222'
  const parentBPhoneNumber = '222-1111'
  const applicantName = 'Test name'
  const applicantSsn = '0113215029'
  const applicationId = '1111-2222-3333-4444'

  const createApplication = (
    answers: object = {
      email: 'email@email.is ',
      phoneNumber: applicantsPhoneNumber,
      parentB: {
        email: 'emailb@email.b.is',
        phoneNumber: parentBPhoneNumber,
      },
      expiry: 'permanent',
    },
  ) =>
    (({
      id: applicationId,
      state: 'draft',
      applicant: applicantSsn,
      assignees: [],
      typeId: ApplicationTypes.CHILDREN_RESIDENCE_CHANGE,
      modified: new Date(),
      created: new Date(),
      attachments: {},
      answers,
      externalData: {
        parentNationalRegistry: {
          data: {
            id: 'id',
            name: 'parent b',
            ssn: '0022993322',
            postalCode: '101',
            address: 'Borgartún',
            city: 'Reykjavík',
          },
          status: 'success',
          date: new Date(),
        },
        nationalRegistry: {
          data: { nationalId: applicantSsn, fullName: applicantName },
          status: 'success',
          date: new Date(),
        },
      },
    } as unknown) as Application)

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggingModule],
      providers: [
        FileService,
        {
          provide: SIGNING_OPTIONS,
          useValue: {
            url: 'Test Url',
            accessToken: 'Test Access Token',
          },
        },
        SigningService,
      ],
    }).compile()

    jest
      .spyOn(aws, 'getFile')
      .mockImplementation(() => Promise.resolve({ Body: 'body' }))

    jest.spyOn(aws, 'uploadFile').mockImplementation(() => Promise.resolve())

    jest
      .spyOn(aws, 'getPresignedUrl')
      .mockImplementation(() => Promise.resolve('url'))

    jest
      .spyOn(pdf, 'generateResidenceChangePdf')
      .mockImplementation(() => Promise.resolve(Buffer.from('buffer')))

    signingService = module.get(SigningService)

    jest
      .spyOn(signingService, 'requestSignature')
      .mockImplementation(() =>
        Promise.resolve(signingServiceRequestSignatureResponse),
      )

    service = module.get(FileService)
  })

  it('should be defined', () => {
    expect(service).toBeTruthy()
  })

  it('should generate pdf for children residence change and return a presigned url', async () => {
    const application = createApplication()

    const response = await service.createPdf(
      application,
      PdfTypes.CHILDREN_RESIDENCE_CHANGE,
    )

    const fileName = `children-residence-change/${application.id}/unsigned.pdf`

    expect(aws.uploadFile).toHaveBeenCalledWith(Buffer.from('buffer'), fileName)

    expect(aws.getPresignedUrl).toHaveBeenCalledWith(fileName)

    expect(response).toEqual('url')
  })
  it('should request file signature for children residence transfer then return controlCode and documentToken', async () => {
    const application = createApplication()

    const response = await service.requestFileSignature(
      application,
      PdfTypes.CHILDREN_RESIDENCE_CHANGE,
    )

    expect(aws.getFile).toHaveBeenCalledWith(
      `children-residence-change/${application.id}/unsigned.pdf`,
    )

    expect(signingService.requestSignature).toHaveBeenCalledWith(
      applicantsPhoneNumber,
      'Lögheimilisbreyting barns',
      applicantName,
      'Ísland',
      'Lögheimilisbreyting-barns.pdf',
      'body',
    )

    expect(response.controlCode).toEqual(
      signingServiceRequestSignatureResponse.controlCode,
    )
    expect(response.documentToken).toEqual(
      signingServiceRequestSignatureResponse.documentToken,
    )
  })

  it('should throw error for request file signature since phone number is missing', async () => {
    const act = async () =>
      await service.requestFileSignature(
        createApplication({}),
        PdfTypes.CHILDREN_RESIDENCE_CHANGE,
      )

    expect(act).rejects.toThrowError(NotFoundException)

    expect(aws.getFile).toHaveBeenCalledWith(
      `children-residence-change/${applicationId}/unsigned.pdf`,
    )

    expect(signingService.requestSignature).not.toHaveBeenCalled()
  })

  it('should throw error for request file signature since file content is missing', async () => {
    jest
      .spyOn(aws, 'getFile')
      .mockImplementation(() => Promise.resolve({ Body: '' }))

    const act = async () =>
      await service.requestFileSignature(
        createApplication(),
        PdfTypes.CHILDREN_RESIDENCE_CHANGE,
      )

    expect(act).rejects.toThrowError(NotFoundException)

    expect(aws.getFile).toHaveBeenCalledWith(
      `children-residence-change/${applicationId}/unsigned.pdf`,
    )

    expect(signingService.requestSignature).not.toHaveBeenCalled()
  })
})
