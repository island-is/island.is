import {
  InternalServerErrorException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { logger } from '@island.is/logging'
import format from 'date-fns/format'

import {
  GetSjukratryggdurTypeDto,
  GetFaUmsoknSjukratryggingTypeDto,
  GetVistaSkjalDtoType,
  // GetVistaSkjalBody,
} from './dto'
import { SoapClient } from './soapClient'
import { VistaSkjalModel } from '../graphql/models'
import { VistaSkjalInput } from '../types'

export const HEALTH_INSURANCE_CONFIG = 'HEALTH_INSURANCE_CONFIG'

export interface HealthInsuranceConfig {
  wsdlUrl: string
  baseUrl: string
  username: string
  password: string
}

@Injectable()
export class HealthInsuranceAPI {
  constructor(
    @Inject(HEALTH_INSURANCE_CONFIG)
    private clientConfig: HealthInsuranceConfig,
  ) {}

  public async getProfun(): Promise<string> {
    logger.info(`--- Starting getProfun api call ---`)

    const args = {
      sendandi: '',
    }
    const res = await this.xroadCall('profun', args)
    return res.ProfunType.radnumer_si ?? null
  }

  // check whether the person is health insured
  public async isHealthInsured(nationalId: string): Promise<boolean> {
    logger.info(`--- Starting isHealthInsured api call for ${nationalId} ---`)

    const args = {
      sendandi: '',
      kennitala: nationalId,
      dagsetning: Date.now(),
    }
    const res: GetSjukratryggdurTypeDto = await this.xroadCall(
      'sjukratryggdur',
      args,
    )

    if (!res.SjukratryggdurType) {
      logger.error(
        `Something went totally wrong in 'Sjukratryggdur' call for ${nationalId} with result: ${JSON.stringify(
          res,
          null,
          2,
        )}`,
      )
      throw new NotFoundException(`Unexpected results: ${JSON.stringify(res)}`)
    } else {
      logger.info(`--- Finished isHealthInsured api call for ${nationalId} ---`)
      return res.SjukratryggdurType.sjukratryggdur == 1
    }
  }

  // get user's pending applications
  public async getPendingApplication(nationalId: string): Promise<number[]> {
    logger.info(
      `--- Starting getPendingApplication api call for ${nationalId} ---`,
    )

    const args = {
      sendandi: '',
      kennitala: nationalId,
    }
    /*
      API returns null when there is no application in the system,
      but it returns also null when the nationalId is not correct,
      we return all reponses to developer to handle them

      Application statuses:
      0: Samþykkt/Accepted
      1: Synjað/Refused
      2: Í bið/Pending
      3: Ógilt/Invalid
    */
    const res: GetFaUmsoknSjukratryggingTypeDto = await this.xroadCall(
      'faumsoknirsjukratrygginga',
      args,
    )

    if (!res.FaUmsoknSjukratryggingType?.umsoknir) {
      logger.info(`return empty array to graphQL`)
      return []
    }

    logger.info(`Start filtering Pending status`)
    // Return all caseIds with Pending status
    const pendingCases: number[] = []
    res.FaUmsoknSjukratryggingType.umsoknir
      .filter((umsokn) => {
        return umsokn.stada == 2
      })
      .forEach((value) => {
        pendingCases.push(value.skjalanumer)
      })

    logger.info(
      `--- Finished getPendingApplication api call for ${nationalId} ---`,
    )
    return pendingCases
  }

  // Apply Insurance without attachment
  public async applyInsurance(appNumber: number, inputObj: VistaSkjalInput): Promise<VistaSkjalModel>{
    logger.info(
      `--- Starting applyInsurance api call ---`,
    )

    // var fs = require('fs')

    // let buff = fs.readFileSync('C:/Users/qdong/Downloads/kitten.jpg')
    // let resultStr = buff.toString('base64')
    // console.log('Image converted to base 64 is:\n\n' + resultStr)

    const request = require('request-promise-native');

    let jpgDataUrlPrefix = 'data:image/png;base64,';
    let imageUrl         = 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png';

    const resultStr = await request({
      url: imageUrl,
      method: 'GET',
      encoding: null // This is actually important, or the image string will be encoded to the default encoding
    })
    .then((result: any) => {
      let imageBuffer  = Buffer.from(result);
      return imageBuffer.toString('base64');
    });

    
    // Attachment's name need to be exactly same as the file name, including file type (ex: skra.txt)

    // TODO: NEED TO IMPLEMENTED and stop hard-coding the xml in the body
    // const xml: GetVistaSkjalBody = {
    //   sjukratryggingumsokn: {
    //     // $: {
    //     //   'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
    //     //   'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
    //     // },
    //     numerumsoknar: inputObj.applicationNumber,
    //     dagsumsoknar: format(new Date(inputObj.applicationDate), "yyyy-MM-dd"),
    //     dagssidustubusetuthjodskra: format(new Date(inputObj.residenceDateFromNationalRegistry), "yyyy-MM-dd"),
    //     dagssidustubusetu: format(new Date(inputObj.residenceDateUserThink), "yyyy-MM-dd"),
    //     stadaeinstaklings: inputObj.userStatus,
    //     bornmedumsaekjanda: inputObj.isChildrenFollowed,
    //     fyrrautgafuland: inputObj.previousCountry,
    //     fyrrautgafulandkodi: inputObj.previousCountryCode,
    //     fyrriutgafustofnunlands: inputObj.previousIssuingInstitution,
    //     tryggdurfyrralandi: inputObj.isHealthInsuredInPreviousCountry,
    //     vidbotarupplysingar: inputObj.additionalInformation ?? '',
    //     einstaklingur: {
    //       kennitala: inputObj.nationalId,
    //       erlendkennitala: inputObj.foreignNationalId,
    //       nafn: inputObj.name,
    //       heimili: inputObj.address ?? '',
    //       postfangstadur: inputObj.postalAddress ?? '',
    //       rikisfang: inputObj.citizenship ?? '',
    //       rikisfangkodi: inputObj.postalAddress ? 'IS' : '',
    //       simi: inputObj.phoneNumber,
    //       netfang: inputObj.email,
    //     },
    //     fylgiskjol: {
    //       fylgiskjal: [
    //         {
    //           heiti: 'google',
    //           innihald: resultStr,
    //         },
    //       ]
    //     }
    //   }
    // }

    const xml = `<![CDATA[<?xml version="1.0" encoding="ISO-8859-1"?>
    <sjukratryggingumsokn xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
      <einstaklingur>
        <kennitala>${inputObj.nationalId}</kennitala>
        <erlendkennitala>${inputObj.foreignNationalId}</erlendkennitala>
        <nafn>${inputObj.name}</nafn>
        <heimili>${inputObj.address ?? ''}</heimili>
        <postfangstadur>${inputObj.postalAddress ?? ''}</postfangstadur>
        <rikisfang>${inputObj.citizenship ?? ''}</rikisfang>
        <rikisfangkodi>${inputObj.postalAddress ? 'IS' : ''}</rikisfangkodi>
        <simi>${inputObj.phoneNumber}</simi>
        <netfang>${inputObj.email}</netfang>
      </einstaklingur>
      <numerumsoknar>${inputObj.applicationNumber}</numerumsoknar>
      <dagsumsoknar>${format(new Date(inputObj.applicationDate), "yyyy-MM-dd")}</dagsumsoknar>
      <dagssidustubusetuthjodskra>${format(new Date(inputObj.residenceDateFromNationalRegistry), "yyyy-MM-dd")}</dagssidustubusetuthjodskra>
      <dagssidustubusetu>${format(new Date(inputObj.residenceDateUserThink), "yyyy-MM-dd")}</dagssidustubusetu>
      <stadaeinstaklings>${inputObj.userStatus}</stadaeinstaklings>
      <bornmedumsaekjanda>${inputObj.isChildrenFollowed}</bornmedumsaekjanda>
      <fyrrautgafuland>${inputObj.previousCountry}</fyrrautgafuland>
      <fyrrautgafulandkodi>${inputObj.previousCountryCode}</fyrrautgafulandkodi>
      <fyrriutgafustofnunlands>${inputObj.previousIssuingInstitution}</fyrriutgafustofnunlands>
      <tryggdurfyrralandi>${inputObj.isHealthInsuredInPreviousCountry}</tryggdurfyrralandi>
      <vidbotarupplysingar>${inputObj.additionalInformation ?? ''}</vidbotarupplysingar>
      <fylgiskjol>
        <fylgiskjal>
          <heiti>googlelogo_color_272x92dp.png</heiti>
          <innihald>${resultStr}</innihald>
        </fylgiskjal>
        <fylgiskjal>
          <heiti>googlelogo_color_272x92dp.png</heiti>
          <innihald>${resultStr}</innihald>
        </fylgiskjal>
      </fylgiskjol>
    </sjukratryggingumsokn>]]>`

    const args = {
      sendandi: '',
      tegundskjals: appNumber,
      skjal: xml,
    }
    /*
      Application statuses:
      0: annars/hafnað/Rejected
      1: tókst/Succeeded
      2: tókst með athugasemd/Succeeded with comment
    */
    const res: GetVistaSkjalDtoType = await this.xroadCall(
      'vistaskjal',
      args,
    )

    const vistaSkjal = new VistaSkjalModel()
    if (!res.VistaSkjalType?.tokst) {
      logger.info(`Failed to upload document to sjukra because: ${res.VistaSkjalType.villulysing ?? 'unknown error'}`)
      vistaSkjal.isSucceeded = false
      vistaSkjal.caseId = -1
      vistaSkjal.comment = res.VistaSkjalType?.villulysing ?? 'Unknown error'

      if (res.VistaSkjalType.villulisti && res.VistaSkjalType.villulisti.length > 0){
        if (res.VistaSkjalType.villulisti[0].villulysinginnri){
          vistaSkjal.comment = res.VistaSkjalType.villulisti[0].villulysinginnri
        }
      }

      return vistaSkjal
    }

    vistaSkjal.isSucceeded = true
    vistaSkjal.caseId = res.VistaSkjalType.skjalanumer_si
    vistaSkjal.comment = res.VistaSkjalType.villulysing ?? ''

    logger.info(
      `--- Finished applyInsurance api call ---`,
    )
    return vistaSkjal
  }

  private async xroadCall(functionName: string, args: object): Promise<any> {
    // create 'soap' client
    logger.info(`Start ${functionName} function call.`)
    const client = await SoapClient.generateClient(
      this.clientConfig.wsdlUrl,
      this.clientConfig.baseUrl,
      this.clientConfig.username,
      this.clientConfig.password,
      functionName,
    )
    if (!client) {
      logger.error('HealthInsurance Soap Client not initialized')
      throw new InternalServerErrorException(
        'HealthInsurance Soap Client not initialized',
      )
    }

    return new Promise((resolve, reject) => {
      // call 'faumsoknirsjukratrygginga' function/endpoint
      client[functionName](args, function (err: any, result: any) {
        if (err) {
          logger.error(JSON.stringify(err, null, 2))
          reject(err)
        } else {
          logger.info(
            `Successful call ${functionName} function with result: ${JSON.stringify(
              result,
              null,
              2,
            )}`,
          )
          resolve(result)
        }
      })
    })
  }
}
