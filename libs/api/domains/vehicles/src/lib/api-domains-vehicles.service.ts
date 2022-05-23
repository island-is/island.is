import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'

import { Inject, Injectable } from '@nestjs/common'
import {
  VehicleSearchApi,
  BasicVehicleInformationGetRequest,
  BasicVehicleInformationTechnicalMass,
  BasicVehicleInformationTechnicalAxle,
  BasicVehicleInformationTechnicalTyre,
  PersidnoLookup,
} from '@island.is/clients/vehicles'
import { VehiclesAxle, VehiclesDetail } from '../models/getVehicleDetail.model'
import { ApolloError } from 'apollo-server-express'
import { FetchError } from '@island.is/clients/middlewares'

@Injectable()
export class VehiclesService {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    @Inject(VehicleSearchApi)
    private vehiclesApi: VehicleSearchApi,
  ) {}

  private handle4xx(error: FetchError): ApolloError | null {
    if (error.status === 403 || error.status === 404) {
      return null
    }
    throw new ApolloError(
      'Failed to resolve request',
      error?.message || error?.status.toString(),
    )
  }

  async getVehiclesForUser(
    nationalId: string,
  ): Promise<PersidnoLookup | null | ApolloError> {
    try {
      const res = await this.vehiclesApi.vehicleHistoryGet({
        requestedPersidno: nationalId,
      })
      const { data } = res
      if (!data) return {}
      return data
    } catch (e) {
      const errMsg = 'Failed to get vehicle list'
      this.logger.error(errMsg, { e })
      return this.handle4xx(e)
    }
  }

  async getVehicleDetail(
    input: BasicVehicleInformationGetRequest,
  ): Promise<VehiclesDetail | null | ApolloError> {
    try {
      const res = await this.vehiclesApi.basicVehicleInformationGet({
        clientPersidno: input.clientPersidno,
        permno: input.permno,
        regno: input.regno,
        vin: input.vin,
      })
      const { data } = res

      if (!data) return {}
      const newestInspection = data.inspections?.sort((a, b) => {
        if (a && b && a.date && b.date)
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        else return 0
      })[0]

      const axleMaxWeight =
        (data.techincal?.mass?.massdaxle1
          ? data.techincal?.mass?.massdaxle1
          : 0) +
        (data.techincal?.mass?.massdaxle2
          ? data.techincal?.mass?.massdaxle2
          : 0) +
        (data.techincal?.mass?.massdaxle3
          ? data.techincal?.mass?.massdaxle3
          : 0) +
        (data.techincal?.mass?.massdaxle4
          ? data.techincal?.mass?.massdaxle4
          : 0) +
        (data.techincal?.mass?.massdaxle5
          ? data.techincal?.mass?.massdaxle5
          : 0)

      const numberOfAxles = data.techincal?.axle?.axleno ?? 0

      const axles: VehiclesAxle[] = []

      if (
        data &&
        data.techincal &&
        data.techincal.axle &&
        data.techincal.mass
      ) {
        for (let i = 1; i <= numberOfAxles; i++) {
          axles.push({
            axleMaxWeight:
              data.techincal.mass[
                `massdaxle${i}` as keyof BasicVehicleInformationTechnicalMass
              ],
            wheelAxle: data.techincal.axle[
              `wheelaxle${i}` as keyof BasicVehicleInformationTechnicalAxle
            ]?.toString(),
          })
        }
      }

      const year =
        data.modelyear ??
        data.productyear ??
        (data.firstregdate ? new Date(data?.firstregdate).getFullYear() : null)

      const operators = data.operators?.filter((x) => x.current)

      const coOwners = data.owners?.find((x) => x.current)?.coOwners

      const response: VehiclesDetail = {
        mainInfo: {
          model: data.make,
          subModel: data.vehcom ?? '' + data.speccom ?? '',
          regno: data.regno,
          year: year,
          co2: null,
          cubicCapacity: data.techincal?.capacity,
          trailerWithBrakesWeight: data.techincal?.tMassoftrbr,
          trailerWithoutBrakesWeight: data.techincal?.tMassoftrunbr,
        },
        basicInfo: {
          model: data.make,
          regno: data.regno,
          subModel: data.vehcom ?? '' + data.speccom ?? '',
          permno: data.permno,
          verno: data.vin,
          year: year,
          country: data.country,
          preregDateYear: data.preregdate?.slice(0, 4), // "2013-09-26" return only year as string
          formerCountry: data.formercountry,
          importStatus: data._import,
        },
        registrationInfo: {
          firstRegistrationDate: data.firstregdate,
          preRegistrationDate: data.preregdate,
          newRegistrationDate: data.newregdate ?? data.firstregdate,
          vehicleGroup: data.techincal?.vehgroup,
          color: data.color,
          reggroup: data.plates
            ? data.plates.length > 0
              ? data.plates[0].reggroup
              : null
            : null,
          passengers: data.techincal?.pass,
          useGroup: data.usegroup,
          driversPassengers: data.techincal?.passbydr,
          standingPassengers: data.techincal?.standingno,
        },
        currentOwnerInfo: {
          owner: data.owners?.find((x) => x.current === true)?.fullname,
          nationalId: data.owners?.find((x) => x.current === true)?.persidno,
          address: data.owners?.find((x) => x.current === true)?.address,
          postalcode: data.owners?.find((x) => x.current === true)?.postalcode,
          city: data.owners?.find((x) => x.current === true)?.city,
          dateOfPurchase: data.owners?.find((x) => x.current === true)
            ?.purchasedate,
        },
        inspectionInfo: {
          type: newestInspection?.type,
          date: newestInspection?.date,
          result: newestInspection?.result,
          plateStatus: data.platestatus,
          nextInspectionDate: data.nextinspectiondate,
          lastInspectionDate: data.inspections
            ? data.inspections[0]?.date
            : null,
          insuranceStatus: data.insurancestatus,
          encumbrances: data?.fees?.hasEncumbrances,
          carTax: data?.fees?.gjold?.bifreidagjald,
          inspectionFine: data?.fees?.inspectionfine,
        },
        technicalInfo: {
          engine: data.techincal?.engine,
          totalWeight: data.techincal?.mass?.massladen,
          cubicCapacity: data.techincal?.capacity,
          capacityWeight: data.techincal?.mass?.masscapacity,
          length: data.techincal?.size?.length,
          vehicleWeight: data.techincal?.mass?.massinro,
          width: data.techincal?.size?.width,
          trailerWithoutBrakesWeight: data.techincal?.tMassoftrunbr,
          horsepower: null,
          trailerWithBrakesWeight: data.techincal?.tMassoftrbr,
          carryingCapacity: data.techincal?.mass?.masscapacity,
          axleTotalWeight: axleMaxWeight,
          axle: axles,
          tyres: {
            tyre1: data.techincal?.tyre?.tyreaxle1,
            tyre2: data.techincal?.tyre?.tyreaxle2,
            tyre3: data.techincal?.tyre?.tyreaxle3,
            tyre4: data.techincal?.tyre?.tyreaxle4,
            tyre5: data.techincal?.tyre?.tyreaxle5,
          },
        },
        ownersInfo:
          data.owners?.map((x) => {
            return {
              name: x.fullname,
              nationalId: x.persidno,
              address: x.address + ', ' + x.postalcode + ' ' + x.city,
              dateOfPurchase: x.purchasedate,
            }
          }) || [],
        coOwners:
          coOwners?.map((x) => {
            return {
              owner: x.fullname,
              nationalId: x.persidno,
              address: x.address,
              postalCode: x.postalcode,
              city: x.city,
            }
          }) || [],
        operators:
          operators?.map((operator) => {
            return {
              nationalId: operator.persidno,
              name: operator.fullname,
              address: operator.address,
              postalcode: operator.postalcode,
              city: operator.city,
              startDate: operator.startdate,
              endDate: operator.enddate,
            }
          }) || undefined,
      }
      return response
    } catch (e) {
      const errMsg = 'Failed to get vehicle details'
      this.logger.error(errMsg, { e })
      return this.handle4xx(e)
    }
  }
}
