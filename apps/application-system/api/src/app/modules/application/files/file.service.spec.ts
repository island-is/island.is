import { Test } from '@nestjs/testing'
import { FileService } from './file.service'
import { SigningModule, SigningService } from '@island.is/dokobit-signing'
import { AwsService } from './aws.service'
import * as pdf from './pdfGenerators'
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

  const parentB = {
    id: 'id',
    fullName: 'parent b',
    nationalId: '0022993322',
    address: {
      postalCode: '101',
      streetName: 'Borgartún',
      city: 'Reykjavík',
    },
  }

  const parentBWithContactInfo = {
    ...parentB,
    phoneNumber: '222-1111',
    email: 'email2@email2.is',
  }

  const child = {
    fullName: 'child',
    nationalId: '1234567890',
    otherParent: parentB,
  }

  const parentA = {
    nationalId: '0113215029',
    fullName: 'Test name',
    children: [child],
  }

  const parentAWithContactInfo = {
    ...parentA,
    phoneNumber: '111-2222',
    email: 'email@email.is',
  }

  const createApplication = (answers?: object, typeId?: string) =>
    (({
      id: applicationId,
      state: 'draft',
      applicant: parentA.nationalId,
      assignees: [],
      typeId: typeId ?? ApplicationTypes.CHILDREN_RESIDENCE_CHANGE,
      modified: new Date(),
      created: new Date(),
      attachments: {},
      answers: answers ?? {
        useMocks: 'no',
        selectedChildren: [child.nationalId],
        parentA: {
          phoneNumber: parentAWithContactInfo.phoneNumber,
          email: parentAWithContactInfo.email,
        },
        parentB: {
          email: parentBWithContactInfo.email,
          phoneNumber: parentBWithContactInfo.phoneNumber,
        },
        expiry: 'permanent',
      },
      externalData: {
        nationalRegistry: {
          data: { ...parentA },
          status: 'success',
          date: new Date().toISOString(),
        },
      },
    } as unknown) as Application)

  beforeEach(async () => {
    const config: ApplicationConfig = { presignBucket: bucket }
    const module = await Test.createTestingModule({
      imports: [
        LoggingModule,
        SigningModule.register({
          url: 'Test Url',
          accessToken: 'Test Access Token',
        }),
      ],
      providers: [
        FileService,
        AwsService,
        { provide: APPLICATION_CONFIG, useValue: config },
      ],
    }).compile()

    awsService = module.get(AwsService)

    jest
      .spyOn(awsService, 'getFile')
      .mockImplementation(() => Promise.resolve({ Body: 'body' }))

    jest.spyOn(awsService, 'fileExists').mockResolvedValue(false)

    jest
      .spyOn(awsService, 'uploadFile')
      .mockImplementation(() => Promise.resolve())

    jest
      .spyOn(awsService, 'getPresignedUrl')
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

    const response = await service.generatePdf(
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
      parentAWithContactInfo.phoneNumber,
      'Lögheimilisbreyting barns',
      parentA.fullName,
      'Ísland',
      'Logheimilisbreyting-barns.pdf',
      'body',
    )

    expect(response.controlCode).toEqual(
      signingServiceRequestSignatureResponse.controlCode,
    )
    expect(response.documentToken).toEqual(
      signingServiceRequestSignatureResponse.documentToken,
    )
  })

  it('should throw error for request file signature since file content is missing', async () => {
    const application = createApplication()

    jest
      .spyOn(awsService, 'getFile')
      .mockImplementation(() => Promise.resolve({ Body: '' }))

    const act = async () =>
      await service.requestFileSignature(
        application,
        PdfTypes.CHILDREN_RESIDENCE_CHANGE,
      )

    await expect(act).rejects.toThrowError(NotFoundException)

    expect(awsService.getFile).toHaveBeenCalledWith(
      bucket,
      `children-residence-change/${applicationId}.pdf`,
    )

    expect(signingService.requestSignature).not.toHaveBeenCalled()
  })

  it('should throw error for generatePdf since application type is not supported', async () => {
    const application = createApplication(undefined, ApplicationTypes.EXAMPLE)

    const act = async () =>
      await service.generatePdf(application, PdfTypes.CHILDREN_RESIDENCE_CHANGE)

    await expect(act).rejects.toThrow(
      'Application type is not supported in file service.',
    )
  })

  it('should have an application type that is valid for generatePdf', async () => {
    const application = createApplication()

    const act = async () =>
      await service.generatePdf(application, PdfTypes.CHILDREN_RESIDENCE_CHANGE)

    expect(act).not.toThrow()
  })
  it('should return presigned url', async () => {
    const application = createApplication()
    const fileName = `children-residence-change/${application.id}.pdf`

    const result = await service.getPresignedUrl(
      application,
      PdfTypes.CHILDREN_RESIDENCE_CHANGE,
    )

    expect(awsService.getPresignedUrl).toHaveBeenCalledWith(bucket, fileName)
    expect(result).toEqual('url')
  })

  it('should throw error for uploadSignedFile since application type is not supported', async () => {
    const application = createApplication(undefined, ApplicationTypes.EXAMPLE)

    const act = async () =>
      await service.uploadSignedFile(
        application,
        'token',
        PdfTypes.CHILDREN_RESIDENCE_CHANGE,
      )

    await expect(act).rejects.toThrow(
      'Application type is not supported in file service.',
    )
  })

  it('should have an application type that is valid for uploadSignedFile', async () => {
    const application = createApplication()

    const act = async () =>
      await service.uploadSignedFile(
        application,
        'token',
        PdfTypes.CHILDREN_RESIDENCE_CHANGE,
      )

    expect(act).not.toThrow()
  })

  it('should throw error for requestFileSignature since application type is not supported', async () => {
    const application = createApplication(undefined, ApplicationTypes.EXAMPLE)

    const act = async () =>
      await service.requestFileSignature(
        application,
        PdfTypes.CHILDREN_RESIDENCE_CHANGE,
      )

    await expect(act).rejects.toThrow(
      'Application type is not supported in file service.',
    )
  })

  it('should have an application type that is valid for requestFileSignature', async () => {
    const application = createApplication()

    const act = async () =>
      await service.requestFileSignature(
        application,
        PdfTypes.CHILDREN_RESIDENCE_CHANGE,
      )

    expect(act).not.toThrow()
  })

  it('should throw error for getPresignedUrl since application type is not supported', async () => {
    const application = createApplication(undefined, ApplicationTypes.EXAMPLE)

    const act = async () =>
      await service.getPresignedUrl(
        application,
        PdfTypes.CHILDREN_RESIDENCE_CHANGE,
      )

    await expect(act).rejects.toThrow(
      'Application type is not supported in file service.',
    )
  })

  it('should have an application type that is valid for getPresignedUrl', async () => {
    const application = createApplication()

    const act = async () =>
      await service.getPresignedUrl(
        application,
        PdfTypes.CHILDREN_RESIDENCE_CHANGE,
      )

    await expect(act).resolves.toEqual('url')
  })
})
