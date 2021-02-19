import { Test } from '@nestjs/testing'
import { FileService } from './file.service'
import { SigningService, SIGNING_OPTIONS } from 'libs/dokobit-signing/src'
import * as aws from './utils/aws'
import * as pdf from './utils/pdf'
import { Application } from './../application.model'
import { ApplicationTypes, PdfTypes } from 'libs/application/core/src'
import { LoggingModule } from '@island.is/logging'

describe('FileService', () => {
  let service: FileService
  let signingService: SigningService
  let signingServiceRequestSignatureResponse = {
    controlCode: 'code',
    documentToken: 'token',
  }
  let applicantsPhoneNumber = '111-2222'
  let parentBPhoneNumber = '222-1111'
  let applicantName = 'Test name'
  let applicantSsn = '0113215029'
  let applicationId = '1111-2222-3333-4444'

  let application = ({
    id: applicationId,
    state: 'draft',
    applicant: applicantSsn,
    assignees: [],
    typeId: ApplicationTypes.CHILDREN_RESIDENCE_CHANGE,
    modified: new Date(),
    created: new Date(),
    attachments: {},
    answers: {
      email: 'email@email.is ',
      phoneNumber: applicantsPhoneNumber,
      parentB : {
        email: 'emailb@email.b.is',
        phoneNumber: parentBPhoneNumber
      },
      expiry: 'permanent'
    },
    externalData: {
      parentNationalRegistry: {
        data: {
          id: 'id',
          name: 'parent b',
          ssn: '0022993322',
          postalCode: '101',
          address: 'Borgartún',
          city: 'Reykjavík'
        },
        status: 'success',
        date: new Date(),
      },
      nationalRegistry: {
        data: { nationalId: applicantSsn, fullName: applicantName },
        status: 'success',
        date: new Date(),
      }
    },
  } as unknown) as Application


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
    console.log({application})
    let response = await service.createPdf(
      application,
      PdfTypes.CHILDREN_RESIDENCE_CHANGE,
    )

    const fileName = `children-residence-change/${applicationId}/unsigned.pdf`

    expect(aws.uploadFile).toHaveBeenCalledWith(Buffer.from('buffer'), fileName)

    expect(aws.getPresignedUrl).toHaveBeenCalledWith(fileName)

    expect(response).toEqual('url')
  })
  it('should request file signature for children residence transfer then return controlCode and documentToken', async () => {
    let response = await service.requestFileSignature(
      application,
      PdfTypes.CHILDREN_RESIDENCE_CHANGE,
    )

    expect(aws.getFile).toHaveBeenCalledWith(
      `children-residence-change/${applicationId}/unsigned.pdf`,
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
})
