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

      this.logger.info(`DEBUG# soapUrl ${soapUrl}`)

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
        this.logger.error(
          `Failed on getUserVehiclesInformation request with status: ${allCarsResponse.statusText}`,
        )
        throw new Error(
          `Failed on getUserVehiclesInformation request with status: ${allCarsResponse.statusText}`,
        )
      }

      //  const data = getAnswer()

      this.logger.info(`DEBUG# allCarsResponse data`, {
        data: allCarsResponse.data,
      })

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
            this.logger.error(
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
              const vehicleArr: VehicleInformation[] = []
              allCars['persidnolookup']['vehicleList'][0]['vehicle'].forEach(
                (car) => {
                  let carIsRecyclable = true
                  let carStatus = 'inUse'
                  // If vehicle status is 'Afskráð' then the vehicle is 'deregistered'
                  // otherwise is 'inUse'
                  if (car['vehiclestatus'][0] == 'Afskráð') {
                    carStatus = 'deregistered'
                    this.logger.info(
                      `DEBUG# Vehicle ${car['permno'][0]} is deregistered and not recyclable`,
                    )
                    carIsRecyclable = false
                  }
                  let carHasCoOwner = true
                  if (car['otherowners'][0] == '0') {
                    carHasCoOwner = false
                  } else {
                    carIsRecyclable = false

                    this.logger.info(
                      `DEBUG# Vehicle ${car['permno'][0]} has co-owner and not recyclable`,
                    )
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
              this.logger.error(
                `Failed while parsing xml to json on getUserVehiclesInformation request with error: ${err}`,
              )
              throw new Error(
                `Failed while parsing xml to json on getUserVehiclesInformation request with error: ${err}`,
              )
            })
        })
        .catch(function (err) {
          this.logger.error(
            `Failed while parsing xml to json on allVehiclesForPersidno request with error: ${err}`,
          )
          throw new Error(
            `Failed while parsing xml to json on allVehiclesForPersidno request with error: ${err}`,
          )
        })

      const newVehicleArr = vehicleInformationList

      this.logger.info(`DEBUG# newVehicleArr`, {
        data: newVehicleArr,
      })

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
            this.logger.error(
              `Failed on basicInforesponse request with status: ${basicInforesponse.statusText}`,
            )
            throw new Error(
              `Failed on basicInforesponse request with status: ${basicInforesponse.statusText}`,
            )
          }

          this.logger.info(`DEBUG# basicInforesponse data`, {
            data: basicInforesponse.data,
          })

          //   const info = getCarInfo()

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
                  this.logger.info(`DEBUG# basicInfo`, { basicInfo })

                  //  If there is any information in updatelocks, stolens, ownerregistrationerrors then we may not deregister it
                  if (
                    typeof basicInfo.vehicle.ownerregistrationerrors[0]
                      .ownerregistrationerror !== 'undefined'
                  ) {
                    //Handle registrationerror
                    newVehicleArr[i].isRecyclable = false

                    this.logger.info(
                      `DEBUG#  NOT isRecyclable ownerregistrationerrors`,
                    )
                  }
                  if (
                    //Handle stolen
                    typeof basicInfo.vehicle.stolens[0].stolen !== 'undefined'
                  ) {
                    for (const stolenEndDate of basicInfo.vehicle.stolens[0]
                      .stolen) {
                      if (!stolenEndDate.enddate[0].trim()) {
                        newVehicleArr[i].isRecyclable = false
                        this.logger.info(`DEBUG#  NOT isRecyclable Stolen`)
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
                        this.logger.info(
                          `DEBUG#  NOT isRecyclable Update Locks`,
                        )
                        break
                      }
                    }
                  }
                  return newVehicleArr[i]
                })
                .catch(function (err) {
                  this.logger.error(
                    `Failed while parsing xml to json on basicVehicleInformation with error: ${err}`,
                  )
                  throw new Error(
                    `Failed while parsing xml to json on basicVehicleInformation with error: ${err}`,
                  )
                })
            })
            .catch(function (err) {
              this.logger.error(
                `Failed while parsing xml to json on basicVehicleInformation with error: ${err}`,
              )
              throw new Error(
                `Failed while parsing xml to json on basicVehicleInformation with error: ${err}`,
              )
            })
        }
      }

      this.logger.info(`DEBUG# vehicleInformationList`, {
        vehicleInformationList,
      })

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
      this.logger.error(
        `Failed on getting vehicles information from Samgongustofa with error: ${err}`,
      )
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

    this.logger.info(`DEBUG# Vehicle TO recycle`, { requireRecyclable, car })

    if (requireRecyclable && car) {
      return car.isRecyclable ? car : null
    }
    return car
  }
}
/*
function getAnswer() {
  return '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><soapenv:Body><ns1:allVehiclesForPersidnoResponse soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/" xmlns:ns1="http://vefekja.us.is"><allVehiclesForPersidnoReturn xsi:type="soapenc:string" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"><![CDATA[<?xml version="1.0" encoding="UTF-8" ?><persidnolookup><persidno>1811794149</persidno><name>Sædís Jónasdóttir</name><address>Stórikriki 17</address><poststation>270 Mosfellsbæ</poststation><vehicleList><vehicle><isCurrent>1</isCurrent><permno>TDX78</permno><regno>TDX78</regno><vin>TMAJE812DNJ037221</vin><type>HYUNDAI TUCSON</type><color>Dökkgrár</color><firstregdate>22.07.2021</firstregdate><modelyear></modelyear><productyear></productyear><registrationtype>Nýskráð - Almenn</registrationtype><role>Eigandi</role><startdate>02.09.2021</startdate><enddate></enddate><outofuse>0</outofuse><otherowners>0</otherowners><termination>Núverandi eigandi</termination><buyerpersidno></buyerpersidno><ownerpersidno>1811794149</ownerpersidno><vehiclestatus>Í lagi</vehiclestatus><usegroup>Almenn notkun</usegroup><vehgroup>Fólksbifreið (M1)</vehgroup><platestatus>Á ökutæki</platestatus></vehicle> </vehicleList></persidnolookup>]]></allVehiclesForPersidnoReturn></ns1:allVehiclesForPersidnoResponse></soapenv:Body></soapenv:Envelope>'
}

function getCarInfo() {
  return '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><soapenv:Body><ns1:basicVehicleInformationResponse soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/" xmlns:ns1="http://vefekja.us.is"><basicVehicleInformationReturn xsi:type="soapenc:string" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"><![CDATA[<?xml version="1.0" encoding="UTF-8" ?><vehicle><message></message><permno>TDX78</permno><regno>TDX78</regno><vin>TMAJE812DNJ037221</vin><typeno>TMAJE8120012</typeno><typeapproval>1940</typeapproval><typeapprovalextension>12</typeapprovalextension><eutypeapproval>e5*2018/858*00001*02</eutypeapproval><variant>F5P74</variant><version>A63E11</version><modelcode>NX1 19957</modelcode><make>HYUNDAI</make><vehcom>TUCSON</vehcom><speccom></speccom><color>Dökkgrár</color><productyear></productyear><modelyear></modelyear><preregdate>01.09.2021</preregdate><customsdate>01.09.2021</customsdate><firstregdate>22.07.2021</firstregdate><newregdate>02.09.2021</newregdate><deregdate></deregdate><reregdate></reregdate><ownregdate>02.09.2021</ownregdate><manufacturer>HYUNDAI TÉKKLANDI</manufacturer><country>Tékkland</country><formercountry>Belgía</formercountry><importerpersidno>4903162480</importerpersidno><importername>Bílamiðstöðin ehf.</importername><import>Notað</import><vehiclestatus>Í lagi</vehiclestatus><disastertype></disastertype><hasdisasters>0</hasdisasters><fixed>0</fixed><hasaccidents>0</hasaccidents><usegroup>Almenn notkun</usegroup><regtype>Almenn merki</regtype><platetypefront>Gerð A</platetypefront><platetyperear>Gerð A</platetyperear><platestatus>Á ökutæki</platestatus><platestoragelocation></platestoragelocation><insurancecompany>Sjóvá Almennar</insurancecompany><insurancestatus>1</insurancestatus><nextinspectiondate>01.08.2025</nextinspectiondate><nextinspectiondateIfPassedInspectionToday>01.08.2025</nextinspectiondateIfPassedInspectionToday><rebuilt>0</rebuilt><offroad>0</offroad><taxgroup>Ökutæki án skattflokks</taxgroup><technical><vehgroup>Fólksbifreið (M1)</vehgroup><vehsubgroup></vehsubgroup><engine>Bensín /Raf.tengill</engine><pass>4</pass><passbydr>1</passbydr><engingemanuf></engingemanuf><enginecode>G4FT</enginecode><workingpr>Þjöppukveikja</workingpr><directinj>0</directinj><nocylinders>4</nocylinders><arrcylinders></arrcylinders><capacity>1598</capacity><maxnetpow>132.2</maxnetpow><atmin>5500</atmin><clutchtype></clutchtype><gearbox>2</gearbox><gearratio1></gearratio1><gearratio2></gearratio2><gearratio3></gearratio3><gearratio4></gearratio4><gearratio5></gearratio5><gearratio6></gearratio6><findrivratio></findrivratio><steermeth>0</steermeth><typeofbody>AF</typeofbody><doorsno>5</doorsno><seatno>5</seatno><standingno></standingno><maxspeed>191</maxspeed><soundstat>75.0</soundstat><sounddrive>68.0</sounddrive><co></co><hc></hc><nox></nox><hcnox></hcnox><remark></remark><roofload></roofload><noofgears></noofgears><soundatmin>3750.0</soundatmin><particulates></particulates><urban></urban><extraurban></extraurban><combined>1.5</combined><co2></co2><weightedco2>35</weightedco2><co2_wltp></co2_wltp><weightedco2_wltp>31</weightedco2_wltp><brakedevice></brakedevice><snumber>EC  </snumber><t_massoftrbr>1350</t_massoftrbr><t_massoftrunbr>750</t_massoftrunbr><tyre><tyreaxle1>235/50R19 103V</tyreaxle1><tyreaxle2>235/50R19 103V</tyreaxle2><tyreaxle3></tyreaxle3><tyreaxle4></tyreaxle4><tyreaxle5></tyreaxle5></tyre><size><length>4500</length><width>1865</width><height>1650</height></size><axle><axleno>2</axleno><wheelsno>4</wheelsno><axlepow1>1</axlepow1><axlepow2>1</axlepow2><axlepow3>0</axlepow3><axlepow4>0</axlepow4><axlepow5>0</axlepow5><wheelbase>2680</wheelbase><axletrack1>1615</axletrack1><axletrack2>1622</axletrack2><axletrack3></axletrack3><axletrack4></axletrack4><axletrack5></axletrack5><wheelaxle1>7.5JX19 51</wheelaxle1><wheelaxle2>7.5JX19 51</wheelaxle2><wheelaxle3></wheelaxle3><wheelaxle4></wheelaxle4><wheelaxle5></wheelaxle5></axle><mass><massinro>1939</massinro><massofveh></massofveh><massdaxle1></massdaxle1><massdaxle2></massdaxle2><massdaxle3></massdaxle3><massdaxle4></massdaxle4><massdaxle5></massdaxle5><massmaxle1>1260</massmaxle1><massmaxle2>1200</massmaxle2><massmaxle3></massmaxle3><massmaxle4></massmaxle4><massmaxle5></massmaxle5><massladen>2415</massladen><massoftrbr>1350</massoftrbr><massoftrunbr>750</massoftrunbr><massofcomb>3765</massofcomb><massatcoup>100</massatcoup><masscapacity>476</masscapacity></mass></technical><owners><owner><current>1</current><anonymous>1</anonymous><purchasedate>02.09.2021</purchasedate><ownregdate>02.09.2021</ownregdate><receptiondate>02.09.2021</receptiondate><persidno>1811794149</persidno><fullname>Sædís Jónasdóttir</fullname><address>Stórikriki 17</address><postalcode>270</postalcode><city>Mosfellsbæ</city><ownerinsurancecode>6080</ownerinsurancecode><co-owners><co-owner><persidno>1102763629</persidno><fullname>Daníel Már Einarsson</fullname><address>Stórikriki 17</address><postalcode>270</postalcode><city>Mosfellsbæ</city></co-owner></co-owners></owner></owners><operators><operator><current>0</current><mainoperator>1</mainoperator><serial>0</serial><startdate>01.09.2021</startdate><enddate>02.09.2021</enddate><persidno>4903162480</persidno><fullname>Bílamiðstöðin ehf.</fullname><address>Krókhálsi 7</address><postalcode>110</postalcode><city>Reykjavík</city></operator></operators><plates><plate><date>02.09.2021</date><regno>TDX78</regno><reggroup>N1</reggroup><reggroupname>Almenn merki</reggroupname></plate><plate><date>01.09.2021</date><regno>TDX78</regno><reggroup>S3</reggroup><reggroupname>Skammtímamerki</reggroupname></plate></plates><disasters></disasters><registrations><registration><date>02.09.2021</date><type>Nýskráð</type><subtype>Almenn</subtype></registration><registration><date>01.09.2021</date><type>Forskráð</type><subtype>Almenn</subtype></registration><registration><date>01.09.2021</date><type>Tollafgreitt</type><subtype>Almenn</subtype></registration></registrations><outofuses></outofuses><updatelocks></updatelocks><stolens></stolens><remarks></remarks><inspections><inspection><date>02.09.2021</date><reinspectiondate></reinspectiondate><station>Frumherji Hádegismóum</station><type>Skráningarskoðun</type><officer>Sæmundur Jónsson</officer><result>Án athugasemda</result><odometer>67</odometer><remarks></remarks></inspection></inspections><ownerregistrationerrors></ownerregistrationerrors><vehicleChanges><vehicleChange><date>07.09.2021</date><changes><change><fieldName>Litur</fieldName><oldValue>Óþekktur litur</oldValue><newValue>Dökkgrár</newValue></change></changes></vehicleChange></vehicleChanges><typeChanges><typeChange><date>02.09.2021</date><changes></changes></typeChange><typeChange><date>01.09.2021</date><changes><change><fieldName></fieldName><oldValue></oldValue><newValue>31.0</newValue></change><change><fieldName></fieldName><oldValue></oldValue><newValue>1.5</newValue></change><change><fieldName>Vigtað CO2</fieldName><oldValue></oldValue><newValue>35.0</newValue></change></changes></typeChange></typeChanges><specialEquipmentChanges></specialEquipmentChanges><addonsChanges></addonsChanges><superstructureChanges></superstructureChanges><adrs></adrs></vehicle>]]></basicVehicleInformationReturn></ns1:basicVehicleInformationResponse></soapenv:Body></soapenv:Envelope>'
}*/
