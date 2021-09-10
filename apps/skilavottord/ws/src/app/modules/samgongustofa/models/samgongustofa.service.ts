import { VehicleInformation } from './samgongustofa.model'
import { Injectable, Inject } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { lastValueFrom } from 'rxjs'
import * as xml2js from 'xml2js'
import { environment } from '../../../../environments'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { RecyclingRequestService } from '../../recycling.request/recycling.request.service'

@Injectable()
export class SamgongustofaService {
  vehicleInformationList: VehicleInformation[]
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private httpService: HttpService,
    @Inject(RecyclingRequestService)
    private recyclingRequestService: RecyclingRequestService,
  ) {}

  async getVehicleInformation(nationalId: string) {
    try {
      this.logger.info('Starting getVehicleInformation call on ${nationalId}')
      const { soapUrl, soapUsername, soapPassword } = environment.samgongustofa

      const parser = new xml2js.Parser()

      // First soap call to get all vehicles own by person with nationalId in input
      const xmlAllCarsBodyStr = `<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:usx="https://xml.samgongustofa.is/scripts/WebObjects.dll/XML.woa/1/ws/.USXMLWS">
        <soapenv:Header/>
          <soapenv:Body>
            <usx:allVehiclesForPersidno soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
              <username xsi:type="xsd:string">${soapUsername}</username>
              <password xsi:type="xsd:string">${soapPassword}</password>
              <xmlVersion xsi:type="xsd:string">2</xmlVersion>
              <clientPersidno xsi:type="xsd:string">${nationalId}</clientPersidno>
              <lawyerPersidno xsi:type="xsd:string">${nationalId}</lawyerPersidno>
              <requestedPersidno xsi:type="xsd:string">${nationalId}</requestedPersidno>
              <showDeregistered xsi:type="xsd:boolean">true</showeregistered>
              <showHistory xsi:type="xsd:boolean">false</showHistory>
            </usx:allVehiclesForPersidno>
          </soapenv:Body>
        </soapenv:Envelope>`

      const headersRequest = {
        'Content-Type': 'application/xml',
      }

      this.logger.info('Start allVehiclesForPersidno Soap request.')
      const allCarsResponse = await lastValueFrom(
        this.httpService.post(soapUrl, xmlAllCarsBodyStr, {
          headers: headersRequest,
        }),
      )
      if (allCarsResponse.status != 200) {
        this.logger.error(allCarsResponse.statusText)
        throw new Error(allCarsResponse.statusText)
      }
      this.logger.info(
        'allVehiclesForPersidno Soap request successed and start parsing xml to json',
      )

      const loggerReplacement = this.logger
      // Parse xml to Json all Soap and added all vehicles and their information to vehicleInformationList
      this.vehicleInformationList = await parser
        .parseStringPromise(allCarsResponse.data.replace(/(\t\n|\t|\n)/gm, ''))
        .then(function (allCarsResult) {
          // check if SOAP returns 200 status code but with Fault message
          if (
            Object.prototype.hasOwnProperty.call(
              allCarsResult['soapenv:Envelope']['soapenv:Body'][0],
              'soapenv:Fault',
            )
          ) {
            loggerReplacement.error(
              allCarsResult['soapenv:Envelope']['soapenv:Body'][0][
                'soapenv:Fault'
              ][0]['faultstring'][0],
            )
            throw new Error(
              allCarsResult['soapenv:Envelope']['soapenv:Body'][0][
                'soapenv:Fault'
              ][0]['faultstring'][0],
            )
          }
          // parse xml to Json Result
          return parser
            .parseStringPromise(
              allCarsResult['soapenv:Envelope']['soapenv:Body'][0][
                'ns1:allVehiclesForPersidnoResponse'
              ][0]['allVehiclesForPersidnoReturn'][0]['_'],
            )
            .then(function (allCars) {
              if (allCars['persidnolookup']['vehicleList'][0] == '') {
                return []
              }
              let vehicleArr: VehicleInformation[]
              vehicleArr = []
              // TODO: will be fixed
              vehicleArr.push(
                new VehicleInformation(
                  'HX111',
                  'black',
                  'vinNumber',
                  'Nissan',
                  '01.01.2020',
                  true,
                  true,
                  'inUse',
                ),
              )
              vehicleArr = []
              allCars['persidnolookup']['vehicleList'][0]['vehicle'].forEach(
                (car) => {
                  loggerReplacement.info(
                    `getting information for ${car['permno'][0]}`,
                  )
                  let carIsRecyclable = true
                  let carStatus = 'inUse'
                  // If vehicle status is 'Afskráð' then the vehicle is 'deregistered'
                  // otherwise is 'inUse'
                  if (car['vehiclestatus'][0] == 'Afskráð') {
                    carStatus = 'deregistered'
                    carIsRecyclable = false
                  }
                  let carHasCoOwner = true
                  if (car['otherowners'][0] == '0') {
                    carHasCoOwner = false
                  } else {
                    carIsRecyclable = false
                  }

                  // Create new Vehicle information object on each vehicle
                  const vehicleObj = new VehicleInformation(
                    car['permno'][0],
                    car['type'][0],
                    car['color'][0],
                    car['vin'][0],
                    car['firstregdate'][0],
                    carIsRecyclable,
                    carHasCoOwner,
                    carStatus,
                  )
                  vehicleArr.push(vehicleObj)
                },
              )
              return vehicleArr
            })
            .catch(function (err) {
              loggerReplacement.error(
                `Getting error while parsing second xml to json on allVehiclesForPersidno request: ${err}`,
              )
              throw new Error('Getting Error while parsing xml to json...')
            })
        })
        .catch(function (err) {
          loggerReplacement.error(
            `Getting error while parsing first xml to json on allVehiclesForPersidno request: ${err}`,
          )
          throw new Error('Getting Error while parsing xml to json...')
        })

      this.logger.info('Finished extracting all vehicles')

      const newVehicleArr = this.vehicleInformationList

      // ForEach vehicle in vehicleInformationList, check and update vehicle's status
      for (let i = 0; i < newVehicleArr.length; i++) {
        const carObj = newVehicleArr[i]
        this.logger.info(
          `Starting extracting details information on ${carObj['permno']}`,
        )
        if (carObj['status'] == 'inUse' && carObj['isRecyclable']) {
          // Vehicle information's Soap body
          const xmlBasicInfoBodyStr = `<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:usx="https://xml.samgongustofa.is/scripts/WebObjects.dll/XML.woa/1/ws/.USXMLWS">
            <soapenv:Header/>
            <soapenv:Body>
              <usx:basicVehicleInformation soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
                  <username xsi:type="xsd:string">${soapUsername}</username>
                  <password xsi:type="xsd:string">${soapPassword}</password>
                  <xmlVersion xsi:type="xsd:string">8</xmlVersion>
                  <clientPersidno xsi:type="xsd:string">${nationalId}</clientPersidno>
                  <permno xsi:type="xsd:string">${carObj['permno']}</permno>
                  <regno xsi:type="xsd:string">null</regno>
                  <vin xsi:type="xsd:string">null</vin>
              </usx:basicVehicleInformation>
            </soapenv:Body>
          </soapenv:Envelope>`

          const basicInforesponse = await lastValueFrom(
            this.httpService.post(soapUrl, xmlBasicInfoBodyStr, {
              headers: headersRequest,
            }),
          )
          if (basicInforesponse.status != 200) {
            this.logger.error(basicInforesponse.statusText)
            throw new Error(basicInforesponse.statusText)
          }
          // parse xml to Json all Soap
          this.logger.info(
            `Finished basicVehicleInformation Soap request and starting parsing xml to json on ${carObj['permno']}`,
          )
          this.vehicleInformationList[i] = await parser
            .parseStringPromise(
              basicInforesponse.data.replace(/(\t\n|\t|\n)/gm, ''),
            )
            .then(function (basicResult) {
              // check if SOAP returns 200 status code but with Fault message
              if (
                Object.prototype.hasOwnProperty.call(
                  basicResult['soapenv:Envelope']['soapenv:Body'][0],
                  'soapenv:Fault',
                )
              ) {
                loggerReplacement.error(
                  basicResult['soapenv:Envelope']['soapenv:Body'][0][
                    'soapenv:Fault'
                  ][0]['faultstring'][0],
                )
                throw new Error(
                  basicResult['soapenv:Envelope']['soapenv:Body'][0][
                    'soapenv:Fault'
                  ][0]['faultstring'][0],
                )
              }
              // parse xml to Json Result
              return parser
                .parseStringPromise(
                  basicResult['soapenv:Envelope']['soapenv:Body'][0][
                    'ns1:basicVehicleInformationResponse'
                  ][0]['basicVehicleInformationReturn'][0]['_'],
                )
                .then(function (basicInfo) {
                  //  If there is any information in updatelocks, stolens, ownerregistrationerrors then we may not deregister it
                  if (
                    typeof basicInfo.vehicle.ownerregistrationerrors[0]
                      .ownerregistrationerror != 'undefined'
                  ) {
                    //Handle registrationerror
                    loggerReplacement.info(
                      'vehicle has ownerregistrationerrors',
                    )
                    newVehicleArr[i].isRecyclable = false
                  }
                  if (
                    //Handle stolen
                    typeof basicInfo.vehicle.stolens[0].stolen != 'undefined'
                  ) {
                    for (const stolenEndDate of basicInfo.vehicle.stolens[0]
                      .stolen) {
                      if (!stolenEndDate.enddate[0].trim()) {
                        loggerReplacement.info('vehicle is stolen')
                        newVehicleArr[i].isRecyclable = false
                        break
                      }
                    }
                  }
                  if (
                    typeof basicInfo.vehicle.updatelocks[0].updatelock !=
                    'undefined'
                  ) {
                    //Handle lock
                    for (const lockEndDate of basicInfo.vehicle.updatelocks[0]
                      .updatelock) {
                      if (!lockEndDate.enddate[0].trim()) {
                        loggerReplacement.info('vehicle is locked')
                        newVehicleArr[i].isRecyclable = false
                        break
                      }
                    }
                  }
                  if (newVehicleArr[i].isRecyclable) {
                    loggerReplacement.info(
                      'vehicle is clean. not stolen, not locked, no registrationerror',
                    )
                  }
                  loggerReplacement.info(
                    'isRecycleble=' + newVehicleArr[i].isRecyclable,
                  )
                  return newVehicleArr[i]
                })
                .catch(function (err) {
                  loggerReplacement.error(
                    `Getting error while parsing second xml to json on basicVehicleInformation request: ${err}`,
                  )
                  throw new Error('Getting Error while parsing xml to json...')
                })
            })
            .catch(function (err) {
              loggerReplacement.error(
                `Getting error while parsing first xml to json on basicVehicleInformation request: ${err}`,
              )
              throw new Error('Getting Error while parsing xml to json...')
            })
        }
      }

      for (let i = 0; i < this.vehicleInformationList.length; i++) {
        const vehicle = this.vehicleInformationList[i]
        try {
          if (vehicle.isRecyclable) {
            this.logger.info(
              `Start getting requestType from DB for vehicle ${vehicle['permno']}`,
            )
            const resRequestType =
              await this.recyclingRequestService.findAllWithPermno(
                vehicle['permno'],
              )
            if (resRequestType.length > 0) {
              const requestType = resRequestType[0]['dataValues']['requestType']
              this.vehicleInformationList[i]['status'] = requestType
              this.logger.info(
                `Got ${requestType} for vehicle ${vehicle['permno']}`,
              )
            }
          }
        } catch (err) {
          this.logger.error(
            `Error while checking requestType in DB for vehicle ${vehicle['permno']} with error: ${err}`,
          )
        }
      }

      this.logger.info(
        `---- Finished getVehicleInformation call on ${nationalId} ----`,
      )
      return this.vehicleInformationList
    } catch (err) {
      this.logger.error(
        `Failed on getting vehicles information from Samgongustofa: ${err}`,
      )
      throw new Error('Failed on getting vehicles information...')
    }
  }

  /* test */
  static test(): any {
    return 'test'
  }
}
