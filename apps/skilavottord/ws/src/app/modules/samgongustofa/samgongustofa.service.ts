import { Injectable, Inject, forwardRef } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { lastValueFrom } from 'rxjs'
import * as xml2js from 'xml2js'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { environment } from '../../../environments'
import { RecyclingRequestService } from '../recyclingRequest'
import { VehicleInformation } from './samgongustofa.model'

@Injectable()
export class SamgongustofaService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private httpService: HttpService,
    @Inject(forwardRef(() => RecyclingRequestService))
    private recyclingRequestService: RecyclingRequestService,
  ) {}

  async getUserVehiclesInformation(
    nationalId: string,
  ): Promise<VehicleInformation[]> {
    try {
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

      const allCarsResponse = await lastValueFrom(
        this.httpService.post(soapUrl, xmlAllCarsBodyStr, {
          headers: headersRequest,
        }),
      )
      if (allCarsResponse.status != 200) {
        throw new Error(
          `Failed on getUserVehiclesInformation request with status: ${allCarsResponse.statusText}`,
        )
      }

      // Parse xml to Json all Soap and added all vehicles and their information to vehicleInformationList
      const vehicleInformationList: VehicleInformation[] = await parser
        .parseStringPromise(allCarsResponse.data.replace(/(\t\n|\t|\n)/gm, ''))
        .then(function (allCarsResult) {
          // check if SOAP returns 200 status code but with Fault message
          if (
            Object.prototype.hasOwnProperty.call(
              allCarsResult['soapenv:Envelope']['soapenv:Body'][0],
              'soapenv:Fault',
            )
          ) {
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
              const vehicleArr: VehicleInformation[] = []
              allCars['persidnolookup']['vehicleList'][0]['vehicle'].forEach(
                (car) => {
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
              throw new Error(
                `Failed while parsing xml to json on getUserVehiclesInformation request with error: ${err}`,
              )
            })
        })
        .catch(function (err) {
          throw new Error(
            `Failed while parsing xml to json on allVehiclesForPersidno request with error: ${err}`,
          )
        })

      const newVehicleArr = vehicleInformationList

      // ForEach vehicle in vehicleInformationList, check and update vehicle's status
      for (let i = 0; i < newVehicleArr.length; i++) {
        const carObj = newVehicleArr[i]
        if (carObj['status'] === 'inUse' && carObj['isRecyclable']) {
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
          if (basicInforesponse.status !== 200) {
            throw new Error(
              `Failed on basicInforesponse request with status: ${basicInforesponse.statusText}`,
            )
          }
          // parse xml to Json all Soap
          vehicleInformationList[i] = await parser
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
                      .ownerregistrationerror !== 'undefined'
                  ) {
                    //Handle registrationerror
                    newVehicleArr[i].isRecyclable = false
                  }
                  if (
                    //Handle stolen
                    typeof basicInfo.vehicle.stolens[0].stolen !== 'undefined'
                  ) {
                    for (const stolenEndDate of basicInfo.vehicle.stolens[0]
                      .stolen) {
                      if (!stolenEndDate.enddate[0].trim()) {
                        newVehicleArr[i].isRecyclable = false
                        break
                      }
                    }
                  }
                  if (
                    typeof basicInfo.vehicle.updatelocks[0].updatelock !==
                    'undefined'
                  ) {
                    //Handle lock
                    for (const lockEndDate of basicInfo.vehicle.updatelocks[0]
                      .updatelock) {
                      if (!lockEndDate.enddate[0].trim()) {
                        newVehicleArr[i].isRecyclable = false
                        break
                      }
                    }
                  }
                  return newVehicleArr[i]
                })
                .catch(function (err) {
                  throw new Error(
                    `Failed while parsing xml to json on basicVehicleInformation with error: ${err}`,
                  )
                })
            })
            .catch(function (err) {
              throw new Error(
                `Failed while parsing xml to json on basicVehicleInformation with error: ${err}`,
              )
            })
        }
      }

      for (let i = 0; i < vehicleInformationList.length; i++) {
        const vehicle = vehicleInformationList[i]
        try {
          if (vehicle.isRecyclable) {
            const resRequestType =
              await this.recyclingRequestService.findAllWithPermno(
                vehicle['permno'],
              )
            if (resRequestType.length > 0) {
              const requestType = resRequestType[0]['dataValues']['requestType']
              vehicleInformationList[i]['status'] = requestType
            }
          }
        } catch (err) {
          this.logger.warn(
            `Error while checking requestType in DB for vehicle ${vehicle['permno']} with error: ${err} but continue on next vehicle`,
          )
        }
      }
      return vehicleInformationList ?? []
    } catch (err) {
      throw new Error(
        `Failed on getting vehicles information from Samgongustofa with error: ${err}`,
      )
    }
  }

  async getUserVehicle(
    nationalId: string,
    permno: string,
    requireRecyclable = true,
  ): Promise<VehicleInformation> {
    const userVehicles = await this.getUserVehiclesInformation(nationalId)
    const car = userVehicles.find((car) => car && car.permno === permno)

    if (requireRecyclable && car) {
      return car.isRecyclable ? car : null
    }
    return car
  }
}
