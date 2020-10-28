import { VehicleInformation, DeRegisterVehicle } from '.'
import { Injectable, HttpService } from '@nestjs/common'
import xml2js from 'xml2js'
import { environment } from '../../../../environments'

//TODO: create partnerDummy list
@Injectable()
export class SamgongustofaService {
  vehicleInformationList: VehicleInformation[]
  httpService: HttpService

  // constructor() {}

  async getVehicleInformation(nationalId: string) {
    try {
      const { soapUrl, soapUsername, soapPassword } = environment.samgongustofa

      const parser = new xml2js.Parser()
      const vehicleArr = VehicleInformation[0]

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

      this.httpService = new HttpService()
      const allCarsResponse = await this.httpService
        .post(soapUrl, xmlAllCarsBodyStr, { headers: headersRequest })
        .toPromise()
      if (allCarsResponse.status != 200) {
        console.log(allCarsResponse.statusText)
        return []
      }

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
            console.log(
              allCarsResult['soapenv:Envelope']['soapenv:Body'][0][
                'soapenv:Fault'
              ][0]['faultstring'][0],
            )
            return []
          }
          // parse xml to Json Result
          return parser
            .parseStringPromise(
              allCarsResult['soapenv:Envelope']['soapenv:Body'][0][
                'ns1:allVehiclesForPersidnoResponse'
              ][0]['allVehiclesForPersidnoReturn'][0]['_'],
            )
            .then(function (allCars) {
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
                  }

                  // Create new Vehicle information object on each vehicle
                  const vehicleObj = new VehicleInformation(
                    car['permno'][0],
                    car['type'][0],
                    car['color'][0],
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
              console.log(err)
              return []
            })
        })
        .catch(function (err) {
          console.log(err)
          return []
        })

      // TODO: connect to database and get 'pending' status
      const newVehicleArr = this.vehicleInformationList

      // ForEach vehicle in vehicleInformationList, check and update vehicle's status
      for (let i = 0; i < newVehicleArr.length; i++) {
        const carObj = newVehicleArr[i]
        if (carObj['status'] == 'inUse') {
          // Vehicle information
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

          const httpService1 = new HttpService()

          const basicInforesponse = await httpService1
            .post(soapUrl, xmlBasicInfoBodyStr, { headers: headersRequest })
            .toPromise()
          if (basicInforesponse.status != 200) {
            console.log(basicInforesponse.status)
          }
          // parse xml to Json all Soap
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
                console.log(
                  basicResult['soapenv:Envelope']['soapenv:Body'][0][
                    'soapenv:Fault'
                  ][0]['faultstring'][0],
                )
                return newVehicleArr[i]
              }
              // parse xml to Json Result
              return parser
                .parseStringPromise(
                  basicResult['soapenv:Envelope']['soapenv:Body'][0][
                    'ns1:basicVehicleInformationResponse'
                  ][0]['basicVehicleInformationReturn'][0]['_'],
                )
                .then(function (basicInfo) {
                  // If there is any information in updatelocks, stolens, ownerregistrationerrors then we may not deregister it
                  if (
                    !(
                      basicInfo['vehicle']['updatelocks'][0] == '' &&
                      basicInfo['vehicle']['stolens'][0] == '' &&
                      basicInfo['vehicle']['ownerregistrationerrors'][0] == ''
                    )
                  ) {
                    newVehicleArr[i]['isRecyclable'] = false
                  }
                  return newVehicleArr[i]
                })
                .catch(function (err) {
                  console.log(err)
                })
            })
            .catch(function (err) {
              console.log(err)
            })
        }
      }

      return this.vehicleInformationList
    } catch (err) {
      console.log(err)
      return []
    }
  }

  async deRegisterVehicle(vehiclePermno: string) {
    // Get jToken
    try {
      const {
        restAuthUrl,
        restDeRegUrl,
        restUsername,
        restPassword,
        restReportingStation,
      } = environment.samgongustofa

      const jsonObj = {
        username: restUsername,
        password: restPassword,
      }
      const jsonAuthBody = JSON.stringify(jsonObj)

      const headerAuthRequest = {
        'Content-Type': 'application/json',
      }

      this.httpService = new HttpService()
      const authRes = await this.httpService
        .post(restAuthUrl, jsonAuthBody, { headers: headerAuthRequest })
        .toPromise()

      // DeRegisterd vehicle
      const jToken = authRes.data['jwtToken']

      const dateNow = new Date()
      console.log(
        dateNow.toLocaleDateString() +
          'T' +
          dateNow.toTimeString().split(' ')[0] +
          'Z',
      )
      const jsonDeRegBody = JSON.stringify({
        permno: vehiclePermno,
        deRegisterDate:
          dateNow.toLocaleDateString() +
          'T' +
          dateNow.toTimeString().split(' ')[0] +
          'Z',
        subCode: 'U',
        plateCount: 0,
        destroyed: 0,
        lost: 0,
        reportingStation: restReportingStation,
        reportingStationType: 'R',
        disposalStation: '300',
        disposalStationType: 'M',
        explanation: 'TODO, what to put here?',
      })

      const headerDeRegRequest = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + jToken,
      }

      this.httpService = new HttpService()
      const deRegRes = await this.httpService
        .post(restDeRegUrl, jsonDeRegBody, { headers: headerDeRegRequest })
        .toPromise()
      console.log(authRes.data['jwtToken'])
      console.log(deRegRes.statusText)
      if (deRegRes.status < 300) {
        return new DeRegisterVehicle(true)
      } else {
        return new DeRegisterVehicle(false)
      }
    } catch (err) {
      console.log(err)
      return new DeRegisterVehicle(false)
    }
  }
}
