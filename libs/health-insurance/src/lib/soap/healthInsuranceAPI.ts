import {
  InternalServerErrorException,
  Inject,
  Injectable,
} from '@nestjs/common'
import { logger } from '@island.is/logging'
import { format } from 'date-fns' // eslint-disable-line no-restricted-imports

import {
  GetVistaSkjalDtoType,
  GetVistaSkjalBody,
  Fylgiskjal,
  Fylgiskjol,
} from './dto'
import { SoapClient } from './soapClient'
import { VistaSkjalModel } from '../graphql/models'
import { VistaSkjalInput } from '../types'
import { BucketService } from '../bucket/bucket.service'

export const HEALTH_INSURANCE_CONFIG = 'HEALTH_INSURANCE_CONFIG'

export interface HealthInsuranceConfig {
  wsdlUrl: string
  baseUrl: string
  username: string
  password: string
  clientID: string
  xroadID: string
}

@Injectable()
export class HealthInsuranceAPI {
  constructor(
    @Inject(HEALTH_INSURANCE_CONFIG)
    private clientConfig: HealthInsuranceConfig,
    @Inject(BucketService)
    private bucketService: BucketService,
  ) {}

  public async getProfun(): Promise<string> {
    logger.info(`--- Starting getProfun api call ---`)

    const args = {
      sendandi: '',
    }
    const res = await this.xroadCall('profun', args)
    return res.ProfunType.radnumer_si ?? null
  }

  // Apply Health Insurance
  public async applyInsurance(
    appNumber: number,
    attachmentNames: string[],
    inputObj: VistaSkjalInput,
  ): Promise<VistaSkjalModel> {
    logger.info(`--- Starting applyInsurance api call ---`)
    const vistaSkjalBody: GetVistaSkjalBody = {
      sjukratryggingumsokn: {
        einstaklingur: {
          kennitala: inputObj.nationalId,
          erlendkennitala: inputObj.foreignNationalId,
          nafn: inputObj.name,
          heimili: inputObj.address ?? '',
          postfangstadur: inputObj.postalAddress ?? '',
          rikisfang: inputObj.citizenship ?? '',
          rikisfangkodi: inputObj.postalAddress ? 'IS' : '',
          simi: inputObj.phoneNumber,
          netfang: inputObj.email,
        },
        numerumsoknar: inputObj.applicationNumber,
        dagsumsoknar: format(new Date(inputObj.applicationDate), 'yyyy-MM-dd'),
        // 'dagssidustubusetuthjodskra' could be empty string
        dagssidustubusetuthjodskra: inputObj.residenceDateFromNationalRegistry
          ? format(
              new Date(inputObj.residenceDateFromNationalRegistry),
              'yyyy-MM-dd',
            )
          : '',
        // 'dagssidustubusetu' could be empty string
        dagssidustubusetu: inputObj.residenceDateUserThink
          ? format(new Date(inputObj.residenceDateUserThink), 'yyyy-MM-dd')
          : '',
        // There is 'Employed' status in frontend
        // but we don't have it yet in request
        // So we convert it to 'Other/O'
        stadaeinstaklings: inputObj.userStatus,
        bornmedumsaekjanda: inputObj.isChildrenFollowed,
        fyrrautgafuland: inputObj.previousCountry,
        fyrrautgafulandkodi: inputObj.previousCountryCode,
        fyrriutgafustofnunlands: inputObj.previousIssuingInstitution ?? '',
        tryggdurfyrralandi: inputObj.isHealthInsuredInPreviousCountry,
        tryggingaretturfyrralandi:
          inputObj.hasHealthInsuranceRightInPreviousCountry,
        vidbotarupplysingar: inputObj.additionalInformation ?? '',
      },
    }

    // Add attachments from S3 bucket
    // Attachment's name need to be exactly same as the file name, including file type (ex: skra.txt)
    const arrAttachments = inputObj.attachmentsFileNames
    if (arrAttachments && arrAttachments.length > 0) {
      if (arrAttachments.length !== attachmentNames.length) {
        logger.error(
          `Failed to extract filenames or bucket's attachment filenames`,
        )
        throw new Error(
          `Failed to extract filenames or bucket's attachment filenames`,
        )
      }
      logger.info(`Start getting attachments`)
      const fylgiskjol: Fylgiskjol = {
        fylgiskjal: [],
      }
      for (let i = 0; i < arrAttachments.length; i++) {
        const filename = arrAttachments[i]
        const fylgiskjal: Fylgiskjal = {
          heiti: filename,
          innihald: await this.bucketService.getFileContentAsBase64(
            attachmentNames[i],
          ),
        }
        fylgiskjol.fylgiskjal.push(fylgiskjal)
      }
      vistaSkjalBody.sjukratryggingumsokn.fylgiskjol = fylgiskjol
      logger.info(`Finished getting attachments`)
    }

    // Student has to have status confirmation document
    if (
      inputObj.userStatus == 'S' &&
      !vistaSkjalBody.sjukratryggingumsokn.fylgiskjol
    ) {
      logger.error(
        `Student applys for health insurance must have confirmation document`,
      )
      throw new Error(
        `Student applys for health insurance must have confirmation document`,
      )
    }

    const xml = `<![CDATA[<?xml version="1.0" encoding="ISO-8859-1"?>${this.OBJtoXML(
      vistaSkjalBody,
    )}]]>`

    const args = {
      sendandi: '',
      tegundskjals: appNumber,
      skjal: xml,
    }
    /*
      Application statuses:
      0: annars/hafnað/Rejected
      1: tókst/Succeeded
      2: tókst en með athugasemd/Succeeded but with comment
    */
    logger.info(`Calling vistaskjal through xroad`)
    const res: GetVistaSkjalDtoType = await this.xroadCall('vistaskjal', args)

    const vistaSkjal = new VistaSkjalModel()
    if (!res.VistaSkjalType?.tokst) {
      vistaSkjal.isSucceeded = false
      vistaSkjal.comment = res.VistaSkjalType?.villulysing ?? 'Unknown error'

      if (
        res.VistaSkjalType.villulisti &&
        res.VistaSkjalType.villulisti.length > 0
      ) {
        if (res.VistaSkjalType.villulisti[0].villulysinginnri) {
          vistaSkjal.comment = res.VistaSkjalType.villulisti[0].villulysinginnri
        }
      }
      logger.error(
        `Failed to upload document to sjukra because: ${
          vistaSkjal.comment ?? 'unknown error'
        }`,
      )

      return vistaSkjal
    }

    vistaSkjal.isSucceeded = true
    vistaSkjal.caseId = res.VistaSkjalType.skjalanumer_si
    vistaSkjal.comment = res.VistaSkjalType.villulysing ?? ''

    logger.info(`--- Finished applyInsurance api call ---`)
    return vistaSkjal
  }

  public async xroadCall(functionName: string, args: object): Promise<any> {
    // create 'soap' client
    logger.info(`Start ${functionName} function call.`)
    console.log(this.clientConfig)
    const client = await SoapClient.generateClient(
      this.clientConfig.wsdlUrl,
      this.clientConfig.baseUrl,
      this.clientConfig.username,
      this.clientConfig.password,
      this.clientConfig.clientID,
      this.clientConfig.xroadID,
      functionName,
    )
    if (!client) {
      logger.error('HealthInsurance Soap Client not initialized')
      throw new InternalServerErrorException(
        'HealthInsurance Soap Client not initialized',
      )
    }

    return new Promise((resolve, reject) => {
      // call 'functionName' function/endpoint
      client[functionName](args, function (err: any, result: any) {
        if (err) {
          logger.error(JSON.stringify(err, null, 2))
          reject(err)
        } else {
          logger.info(`Successful call ${functionName} function`)
          resolve(result)
        }
      })
    })
  }

  private OBJtoXML(obj: object) {
    let xml = ''
    Object.entries(obj).forEach((entry) => {
      const [key, value] = entry
      xml += value instanceof Array ? '' : '<' + key + '>'
      if (value instanceof Array) {
        for (const i in value) {
          xml += '<' + key + '>'
          xml += this.OBJtoXML(value[i])
          xml += '</' + key + '>'
        }
      } else if (typeof value == 'object') {
        xml += this.OBJtoXML(new Object(value))
      } else {
        xml += value
      }
      xml += value instanceof Array ? '' : '</' + key + '>'
    })
    return xml
  }
}
