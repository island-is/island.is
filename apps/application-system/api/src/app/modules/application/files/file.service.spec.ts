import { Test } from '@nestjs/testing'
import { FileService } from './file.service'
import { SigningService, SIGNING_OPTIONS } from '@island.is/dokobit-signing'
import { AwsService } from './aws.service'
import * as pdf from './utils/pdf'
import { Application } from './../application.model'
import { ApplicationTypes, PdfTypes } from '@island.is/application/core'
import { LoggingModule } from '@island.is/logging'
import { NotFoundException, BadRequestException } from '@nestjs/common'
import {
  APPLICATION_CONFIG,
  ApplicationConfig,
} from '../application.configuration'

describe('FileService', () => {
  let service: FileService
  let signingService: SigningService
  let awsService: AwsService
  const signingServiceRequestSignatureResponse = {
    controlCode: 'code',
    documentToken: 'token',
  }

  const bucket = 'bucket'

  const applicationId = '1111-2222-3333-4444'

  const parentA = {
    nationalId: '0113215029',
    ssn: '0113215029',
    fullName: 'Test name',
    phoneNumber: '111-2222',
    email: 'email@email.is',
  }

  const parentB = {
    id: 'id',
    name: 'parent b',
    ssn: '0022993322',
    postalCode: '101',
    address: 'Borgartún',
    city: 'Reykjavík',
    phoneNumber: '222-1111',
    email: 'email2@email2.is',
  }

  const createApplication = (answers?: object) =>
    (({
      id: applicationId,
      state: 'draft',
      applicant: parentA.ssn,
      assignees: [],
      typeId: ApplicationTypes.CHILDREN_RESIDENCE_CHANGE,
      modified: new Date(),
      created: new Date(),
      attachments: {},
      answers: answers ?? {
        email: parentA.email,
        phoneNumber: parentA.phoneNumber,
        parentB: {
          email: parentB.email,
          phoneNumber: parentB.phoneNumber,
        },
        expiry: 'permanent',
      },
      externalData: {
        parentNationalRegistry: {
          data: { ...parentB },
          status: 'success',
          date: new Date(),
        },
        nationalRegistry: {
          data: { ...parentA },
          status: 'success',
          date: new Date(),
        },
      },
    } as unknown) as Application)

  beforeEach(async () => {
    const config: ApplicationConfig = { presignBucket: bucket }
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
        AwsService,
        { provide: APPLICATION_CONFIG, useValue: config },
      ],
    }).compile()

    awsService = module.get(AwsService)

    jest
      .spyOn(awsService, 'getFile')
      .mockImplementation(() => Promise.resolve({ Body: 'body' }))

    jest
      .spyOn(awsService, 'uploadFile')
      .mockImplementation(() => Promise.resolve())

    jest.spyOn(awsService, 'getPresignedUrl').mockImplementation(() => 'url')

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

    const fileName = `children-residence-change/${application.id}.pdf`

    expect(awsService.uploadFile).toHaveBeenCalledWith(
      Buffer.from('buffer'),
      bucket,
      fileName,
    )

    expect(awsService.getPresignedUrl).toHaveBeenCalledWith(bucket, fileName)

    expect(response).toEqual('url')
  })
  it('should request file signature for children residence transfer then return controlCode and documentToken', async () => {
    const application = createApplication()

    const response = await service.requestFileSignature(
      application,
      PdfTypes.CHILDREN_RESIDENCE_CHANGE,
    )

    expect(awsService.getFile).toHaveBeenCalledWith(
      bucket,
      `children-residence-change/${application.id}.pdf`,
    )

    expect(signingService.requestSignature).toHaveBeenCalledWith(
      parentA.phoneNumber,
      'Lögheimilisbreyting barns',
      parentA.fullName,
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

    expect(awsService.getFile).toHaveBeenCalledWith(
      bucket,
      `children-residence-change/${applicationId}.pdf`,
    )

    expect(signingService.requestSignature).not.toHaveBeenCalled()
  })

  it('should throw error for request file signature since file content is missing', async () => {
    jest
      .spyOn(awsService, 'getFile')
      .mockImplementation(() => Promise.resolve({ Body: '' }))

    const act = async () =>
      await service.requestFileSignature(
        createApplication(),
        PdfTypes.CHILDREN_RESIDENCE_CHANGE,
      )

    expect(act).rejects.toThrowError(NotFoundException)

    expect(awsService.getFile).toHaveBeenCalledWith(
      bucket,
      `children-residence-change/${applicationId}.pdf`,
    )

    expect(signingService.requestSignature).not.toHaveBeenCalled()
  })

  it('should throw error since application type is not supported', async () => {
    const act = () => service.validateApplicationType(ApplicationTypes.EXAMPLE)

    expect(act).toThrowError(BadRequestException)
  })

  it('should have an application type that is valid', async () => {
    const act = () =>
      service.validateApplicationType(
        ApplicationTypes.CHILDREN_RESIDENCE_CHANGE,
      )

    expect(act).not.toThrow()
  })

  it('should throw error since application is not ready for file signature', async () => {
    const act = () =>
      service.validateFileSignature(
        ApplicationTypes.CHILDREN_RESIDENCE_CHANGE,
        PdfTypes.CHILDREN_RESIDENCE_CHANGE,
        {},
      )

    expect(act).toThrowError(BadRequestException)
  })

  it('should be valid for file signature', async () => {
    const act = () =>
      service.validateFileSignature(
        ApplicationTypes.CHILDREN_RESIDENCE_CHANGE,
        PdfTypes.CHILDREN_RESIDENCE_CHANGE,
        { [PdfTypes.CHILDREN_RESIDENCE_CHANGE]: 'url' },
      )

    expect(act).not.toThrow()
  })

  it('should throw error since application is not ready for file upload', async () => {
    const act = () =>
      service.validateFileUpload(
        ApplicationTypes.CHILDREN_RESIDENCE_CHANGE,
        'token',
        {},
      )

    expect(act).toThrowError(BadRequestException)
  })

  it('should be valid for file upload', async () => {
    const token = 'token'
    const act = () =>
      service.validateFileUpload(
        ApplicationTypes.CHILDREN_RESIDENCE_CHANGE,
        token,
        { fileSignature: { data: { documentToken: token } } },
      )

    expect(act).not.toThrow()
  })
})
