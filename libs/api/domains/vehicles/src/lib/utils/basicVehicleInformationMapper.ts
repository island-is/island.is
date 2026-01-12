import {
  BasicVehicleInformationDto,
  BasicVehicleInformationTechnicalAxleDto,
  BasicVehicleInformationTechnicalMassDto,
} from '@island.is/clients/vehicles'
import { VehiclesAxle, VehiclesDetail } from '../models/getVehicleDetail.model'

// 1kW equals 1.359622 metric horsepower.
const KW_TO_METRIC_HP = 1.359622
const EXCLUDED_INSURANCE_STATUS = ['TE1', 'TE2', 'TE3']

export const basicVehicleInformationMapper = (
  data: BasicVehicleInformationDto,
): VehiclesDetail => {
  const newestInspection = data.inspections?.sort((a, b) => {
    if (a && b && a.date && b.date)
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    else return 0
  })[0]
  let axleMaxWeight = 0
  const numberOfAxles = data.technical?.axle?.axleno ?? 0

  const axles: VehiclesAxle[] = []
  if (data && data.technical && data.technical.axle && data.technical.mass) {
    for (let i = 1; i <= numberOfAxles; i++) {
      axles.push({
        axleMaxWeight:
          data.technical.mass[
            `massmaxle${i}` as keyof BasicVehicleInformationTechnicalMassDto
          ],
        wheelAxle:
          data.technical.axle[
            `wheelaxle${i}` as keyof BasicVehicleInformationTechnicalAxleDto
          ]?.toString(),
      })
      axleMaxWeight +=
        data.technical.mass[
          `massmaxle${i}` as keyof BasicVehicleInformationTechnicalMassDto
        ] ?? 0
    }
  }

  const operators = data.operators?.filter((x) => x.current)
  const coOwners = data.owners?.find((x) => x.current)?.coOwners
  const owner = data.owners?.find((x) => x.current === true)

  const excludeInsurance = EXCLUDED_INSURANCE_STATUS.includes(
    data.technical?.vehgroup ?? '',
  )

  const subModel = [data.vehcom, data.speccom].filter(Boolean).join(' ')
  const response: VehiclesDetail = {
    mainInfo: {
      model: data.make,
      subModel: subModel,
      regno: data.regno,
      year: data.modelyear,
      co2: data?.technical?.co2,
      weightedCo2: data?.technical?.weightedCo2,
      co2Wltp: data?.technical?.co2Wltp,
      weightedCo2Wltp: data?.technical?.weightedco2Wltp,
      cubicCapacity: data.technical?.capacity,
      trailerWithBrakesWeight: data.technical?.tMassoftrbr,
      trailerWithoutBrakesWeight: data.technical?.tMassoftrunbr,
      nextAvailableMileageReadDate: data.nextAvailableMileageReadDate,
      requiresMileageRegistration: data.requiresMileageRegistration,
      canRegisterMileage: data.canRegisterMileage,
      availableMileageRegistration: data.availableMileageRegistration,
    },
    basicInfo: {
      model: data.make,
      regno: data.regno,
      subModel: subModel,
      permno: data.permno,
      verno: data.vin,
      year: data.modelyear,
      country: data.country,
      preregDateYear: data.productyear?.toString(),
      formerCountry: data.formercountry,
      importStatus: data._import,
      vehicleStatus: data.vehiclestatus,
    },
    registrationInfo: {
      firstRegistrationDate: data.firstregdate,
      preRegistrationDate: data.preregdate,
      newRegistrationDate: data.newregdate,
      vehicleGroup: data.technical?.vehgroup,
      color: data.color,
      reggroup: data.plates?.[0]?.reggroup ?? null,
      reggroupName: data.plates?.[0]?.reggroupname ?? null,
      passengers: data.technical?.pass,
      useGroup: data.usegroup,
      driversPassengers: data.technical?.passbydr,
      standingPassengers: data.technical?.standingno,
      plateLocation: data.platestoragelocation,
      specialName: data.speccom,
      plateStatus: data.platestatus,
      plateTypeFront: data.platetypefront,
      plateTypeRear: data.platetyperear,
    },
    currentOwnerInfo: {
      owner: owner?.fullname,
      nationalId: owner?.persidno,
      address: owner?.address,
      postalcode: owner?.postalcode,
      city: owner?.city,
      dateOfPurchase: owner?.purchasedate,
    },
    inspectionInfo: {
      type: newestInspection?.type,
      date: newestInspection?.date,
      result: newestInspection?.result,
      odometer: newestInspection?.odometer,
      nextInspectionDate: data.nextinspectiondate,
      lastInspectionDate: data.inspections?.[0]?.date ?? null,
      insuranceStatus: excludeInsurance ? undefined : data.insurancestatus,
      mortages: data?.fees?.hasEncumbrances,
      carTax: data?.fees?.gjold?.total,
      inspectionFine: data?.fees?.inspectionfine,
    },
    technicalInfo: {
      engine: data.technical?.engine,
      totalWeight: data.technical?.mass?.massladen,
      cubicCapacity: data.technical?.capacity,
      capacityWeight: data.technical?.mass?.massofcomb,
      length: data.technical?.size?.length,
      vehicleWeight: data.technical?.mass?.massinro,
      width: data.technical?.size?.width,
      trailerWithoutBrakesWeight: data.technical?.tMassoftrunbr,
      horsepower: data.technical?.maxNetPower
        ? Math.round(data.technical.maxNetPower * KW_TO_METRIC_HP * 10) / 10
        : null,
      trailerWithBrakesWeight: data.technical?.tMassoftrbr,
      carryingCapacity: data.technical?.mass?.masscapacity,
      axleTotalWeight: axleMaxWeight,
      axles: axles,
      tyres: {
        axle1: data.technical?.tyre?.tyreaxle1,
        axle2: data.technical?.tyre?.tyreaxle2,
        axle3: data.technical?.tyre?.tyreaxle3,
        axle4: data.technical?.tyre?.tyreaxle4,
        axle5: data.technical?.tyre?.tyreaxle5,
      },
    },
    ownersInfo:
      data.owners?.map((x) => {
        const ownerAdderss = x.address
          ? `${x.address}${x.postalcode || x.city ? ', ' : ''}${
              x.postalcode ? `${x.postalcode} ` : ''
            }${x.city ?? ''}`
          : undefined
        return {
          name: x.fullname,
          nationalId: x.persidno,
          address: ownerAdderss,
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
          mainOperator: operator.mainoperator,
          serial: operator.serial,
        }
      }) || undefined,
    isOutOfCommission: data.vehiclestatus === 'Úr umferð',
    latestMileageRegistration: data.latestMileageRegistration ?? undefined,
    lastMileage: {
      permno: undefined,
      readDate: undefined,
      originCode: undefined,
      mileage: data.latestMileageRegistration
        ? data.latestMileageRegistration.toString()
        : undefined,
      mileageNumber: data.latestMileageRegistration ?? undefined,
      internalId: undefined,
    },
  }

  return response
}
