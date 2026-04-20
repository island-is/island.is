import {
  Inject,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common'
import {
  VehicleSearchApi,
  BasicVehicleInformationGetRequest,
  PublicVehicleSearchApi,
  VehicleDtoListPagedResponse,
  PersidnoLookupResultDto,
  CurrentVehiclesWithMilageAndNextInspDtoListPagedResponse,
  VehiclesClientService,
} from '@island.is/clients/vehicles'
import {
  CanregistermileagePermnoGetRequest,
  GetMileageReadingRequest,
  MileageReadingApi,
  MileageReadingDto,
  RequiresmileageregistrationPermnoGetRequest,
  RootPostRequest,
  RootPutRequest,
  VehiclesMileageClientService,
} from '@island.is/clients/vehicles-mileage'
import { AuthMiddleware } from '@island.is/auth-nest-tools'
import type { Auth, User } from '@island.is/auth-nest-tools'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { basicVehicleInformationMapper } from '../utils/basicVehicleInformationMapper'
import { VehiclesDetail } from '../models/getVehicleDetail.model'
import {
  GetVehiclesForUserInput,
  GetVehiclesListV2Input,
} from '../dto/getVehiclesForUserInput'
import { VehicleMileageOverview } from '../models/getVehicleMileage.model'
import isSameDay from 'date-fns/isSameDay'
import { mileageDetailConstructor } from '../utils/helpers'
import { FetchError, handle404 } from '@island.is/clients/middlewares'
import { VehicleSearchCustomDto } from '../vehicles.type'
import { operatorStatusMapper } from '../utils/operatorStatusMapper'
import { VehiclesListInputV3 } from '../dto/vehiclesListInputV3'
import { isDefined } from '@island.is/shared/utils'
import { GetVehicleMileageInput } from '../dto/getVehicleMileageInput'
import { MileageRegistrationHistory } from '../models/v3/mileageRegistrationHistory.model'
import { VehiclesMileageUpdateError } from '../models/v3/vehicleMileageResponseError.model'
import { UpdateResponseError } from '../dto/updateResponseError.dto'
import { VehiclePagedList } from '../models/v3/vehiclePagedList.model'

const ORIGIN_CODE = 'ISLAND.IS'
const LOG_CATEGORY = 'vehicle-service'
const UNAUTHORIZED_LOG = 'Vehicle user authorization failed'
const UNAUTHORIZED_OWNERSHIP_LOG =
  'Vehicle user ownership does not allow registration'

const isReadDateToday = (d?: Date) => {
  if (!d) {
    return false
  }

  const today = new Date()
  const inputDate = new Date(d)

  return isSameDay(today, inputDate)
}

@Injectable()
export class VehiclesService {
  constructor(
    private vehicleClientService: VehiclesClientService,
    private vehicleMileageClientService: VehiclesMileageClientService,
    private vehiclesApi: VehicleSearchApi,
    private mileageReadingApi: MileageReadingApi,
    @Inject(PublicVehicleSearchApi)
    private publicVehiclesApi: PublicVehicleSearchApi,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  private getVehiclesWithAuth(auth: Auth) {
    return this.vehiclesApi.withMiddleware(new AuthMiddleware(auth))
  }

  private getPublicVehiclesWithAuth(auth: Auth) {
    return this.publicVehiclesApi.withMiddleware(new AuthMiddleware(auth))
  }

  private getMileageWithAuth(auth: Auth) {
    return this.mileageReadingApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getVehiclesListV2(
    auth: User,
    input: GetVehiclesListV2Input,
  ): Promise<CurrentVehiclesWithMilageAndNextInspDtoListPagedResponse> {
    return await this.getVehiclesWithAuth(
      auth,
    ).currentvehicleswithmileageandinspGet({
      ...input,
      onlyMileageRequiredVehicles: input.onlyMileage,
      permno: input.permno
        ? input.permno.length < 5
          ? `${input.permno}*`
          : `${input.permno}`
        : undefined,
    })
  }

  async getVehiclesListV3(
    auth: User,
    input: VehiclesListInputV3,
  ): Promise<VehiclePagedList | null> {
    const res = await this.vehicleClientService.getVehicles(auth, {
      pageSize: input.pageSize,
      page: input.page,
      includeNextMainInspectionDate: input.includeNextMainInspectionDate,
      onlyMileageRegisterableVehicles:
        input.filterOnlyVehiclesUserCanRegisterMileage,
      onlyMileageRequiredVehicles: input.filterOnlyMileageRequiredVehicles,
      query: input.query,
    })

    if (!res) {
      return null
    }

    return {
      pageSize: res.pageSize,
      pageNumber: res.pageNumber,
      totalPages: res.totalPages,
      totalRecords: res.totalRecords,
      vehicleList: res.vehicles.map((v) => ({
        ...v,
        nextInspection: v.nextInspection
          ? v.nextInspection.toISOString()
          : undefined,
        mileageDetails: {
          canRegisterMileage: v.canRegisterMileage,
          requiresMileageRegistration: v.requiresMileageRegistration,
          lastMileageRegistration: v.lastMileageRegistration
            ? {
                ...v.lastMileageRegistration,
                date: v.lastMileageRegistration.date.toISOString(),
              }
            : undefined,
        },
      })),
    }
  }

  async getVehiclesForUser(
    auth: User,
    input: GetVehiclesForUserInput,
  ): Promise<VehicleDtoListPagedResponse> {
    return await this.getVehiclesWithAuth(
      auth,
    ).vehicleHistoryRequestedPersidnoGet({
      requestedPersidno: auth.nationalId,
      showDeregistered: input.showDeregeristered,
      showHistory: input.showHistory,

      page: input.page,
      pageSize: input.pageSize,
      type: input.type,
      dtFrom: input.dateFrom,
      dtTo: input.dateTo,
      permno: input.permno
        ? input.permno.length < 5
          ? `${input.permno}*`
          : `${input.permno}`
        : undefined,
    })
  }

  async getVehiclesForUserOldService(
    auth: User,
    showDeregistered: boolean,
    showHistory: boolean,
  ): Promise<PersidnoLookupResultDto> {
    return await this.getVehiclesWithAuth(auth).vehicleHistoryGet({
      requestedPersidno: auth.nationalId,
      showDeregistered: showDeregistered,
      showHistory: showHistory,
    })
  }

  async publicVehicleSearch(search: string) {
    return await this.publicVehiclesApi
      .publicVehicleSearchGet({
        search,
      })
      .catch(handle404)
  }

  async publicVehicleSearchWithAuth(auth: User, search: string) {
    return await this.getPublicVehiclesWithAuth(auth)
      .publicVehicleSearchGet({
        search,
      })
      .catch(handle404)
  }

  async getSearchLimit(auth: User): Promise<number | null> {
    const res = await this.getVehiclesWithAuth(auth).searchesRemainingGet()
    if (!res) return null
    return res
  }

  async getVehicleDetail(
    auth: User,
    input: BasicVehicleInformationGetRequest,
  ): Promise<VehiclesDetail | null> {
    const res = await this.getVehiclesWithAuth(auth).basicVehicleInformationGet(
      {
        clientPersidno: input.clientPersidno,
        permno: input.permno,
        regno: input.regno,
        vin: input.vin,
      },
    )

    if (!res) return null

    return basicVehicleInformationMapper(res)
  }

  private async hasVehicleServiceAuth(
    auth: User,
    permno: string,
  ): Promise<void> {
    try {
      await this.getVehicleDetail(auth, {
        clientPersidno: auth.nationalId,
        permno,
      })
    } catch (e) {
      if (e.status === 401 || e.status === 403) {
        this.logger.error(UNAUTHORIZED_LOG, {
          category: LOG_CATEGORY,
          error: e,
        })
        throw new UnauthorizedException(UNAUTHORIZED_LOG)
      }
      throw e as Error
    }
  }

  // This is a temporary solution until we can get this information from the SGS API.
  private async isAllowedMileageRegistration(
    auth: User,
    permno: string,
  ): Promise<boolean> {
    const res = await this.getVehicleDetail(auth, {
      clientPersidno: auth.nationalId,
      permno,
    })

    return this.isAllowedMileageRegistrationNoFetch(auth, res ?? undefined)
  }

  private isAllowedMileageRegistrationNoFetch(
    auth: User,
    res?: VehiclesDetail,
  ): boolean {
    // String of owners where owner can delegate registration.
    const allowedCoOwners = process.env.VEHICLES_ALLOW_CO_OWNERS?.split(
      ',',
    ).map((i) => i.trim())

    const owner = res?.currentOwnerInfo?.nationalId
    const operators = res?.operators?.filter((person) => person.mainOperator)
    const mainOperator = operators?.map((mainOp) => mainOp.nationalId)
    const isCreditInstitutionOwner = owner
      ? allowedCoOwners?.includes(owner)
      : false

    // If owner is authenticated
    if (owner === auth.nationalId) {
      // If owner is credit institution and car has operators
      if (isCreditInstitutionOwner && operators?.length) {
        return false
      }
      return true
    }

    // If main operator is authenticated and owner is credit institution
    if (
      mainOperator &&
      mainOperator.includes(auth.nationalId) &&
      isCreditInstitutionOwner
    ) {
      return true
    }

    return false
  }

  async getVehiclesSearch(
    auth: User,
    search: string,
  ): Promise<VehicleSearchCustomDto | null> {
    const res = await this.getVehiclesWithAuth(auth).vehicleSearchGet({
      search,
    })
    const { data } = res
    if (!data || !data.length) return null

    const vehicle = data[0]

    const operatorNames = vehicle.operators
      ?.map((operator) => operator.fullname)
      .filter(isDefined)

    const operatorAnonymityStatus = operatorStatusMapper(
      operatorNames,
      !!vehicle.allOperatorsAreAnonymous,
      !!vehicle.someOperatorsAreAnonymous,
    )

    return {
      ...data[0],

      operatorNames:
        operatorNames && operatorNames.length ? operatorNames : undefined,
      operatorAnonymityStatus,
    }
  }

  async getVehicleMileage(
    auth: User,
    input: GetMileageReadingRequest,
  ): Promise<VehicleMileageOverview | null> {
    //need to auth check
    const basicData = await this.getVehicleDetail(auth, {
      clientPersidno: auth.nationalId,
      permno: input.permno,
    }).catch((e) => {
      if (e.status === 401 || e.status === 403) {
        this.logger.error(UNAUTHORIZED_LOG, {
          category: LOG_CATEGORY,
          error: e,
        })
        throw new UnauthorizedException(UNAUTHORIZED_LOG)
      }
      throw e as Error
    })

    const res = await this.getMileageWithAuth(auth).getMileageReading({
      permno: input.permno,
      includeDeleted: false,
    })

    const latestDate = res?.[0]?.readDate
    const isIslandIsReading = res?.[0]?.originCode === ORIGIN_CODE
    const isEditing =
      isReadDateToday(latestDate ?? undefined) && isIslandIsReading

    const canUserRegisterVehicleMileage =
      this.isAllowedMileageRegistrationNoFetch(auth, basicData ?? undefined)

    const returnData = (res ?? []).map((item) => {
      return mileageDetailConstructor(item)
    })

    return {
      data: returnData,
      permno: input.permno,
      editing: isEditing,
      canUserRegisterVehicleMileage,
      canRegisterMileage: basicData?.mainInfo?.canRegisterMileage,
      requiresMileageRegistration:
        basicData?.mainInfo?.requiresMileageRegistration,
    }
  }

  async getVehicleMileageHistory(
    auth: User,
    input: GetVehicleMileageInput,
  ): Promise<MileageRegistrationHistory | null> {
    const data = await this.vehicleMileageClientService.getMileageHistory(
      auth,
      {
        vehicleId: input.permno,
      },
    )

    if (!data) {
      return null
    }

    return {
      vehicleId: data.vehicleId,
      mileageRegistrationHistory: data.registrationHistory.map((r) => ({
        originCode: r.originCode,
        mileage: r.mileage,
        date: r.readDate.toISOString(),
        internalId: r.internalId,
        operation: r.operation,
        transactionDate: r.transactionDate
          ? r.transactionDate.toISOString()
          : undefined,
      })),
    }
  }

  async postMileageReading(
    auth: User,
    input: RootPostRequest['postMileageReadingModel'],
  ): Promise<MileageReadingDto | null> {
    if (!input) return null

    const isAllowed = await this.isAllowedMileageRegistration(
      auth,
      input.permno,
    )
    if (!isAllowed) {
      this.logger.error(UNAUTHORIZED_OWNERSHIP_LOG, {
        category: LOG_CATEGORY,
        error: 'postMileageReading failed',
      })
      throw new ForbiddenException(UNAUTHORIZED_OWNERSHIP_LOG)
    }

    const res = await this.getMileageWithAuth(auth).rootPostRaw({
      postMileageReadingModel: input,
    })

    if (res.raw.status === 200) {
      this.logger.info(
        'Tried to post already existing mileage reading. Should use PUT',
      )
      return null
    }

    return res.value()
  }

  async putMileageReading(
    auth: User,
    input: RootPutRequest['putMileageReadingModel'],
  ): Promise<MileageReadingDto | null> {
    if (!input) return null

    const isAllowed = await this.isAllowedMileageRegistration(
      auth,
      input.permno,
    )
    if (!isAllowed) {
      this.logger.error(UNAUTHORIZED_OWNERSHIP_LOG, {
        category: LOG_CATEGORY,
        error: 'putMileageReading failed',
      })
      throw new ForbiddenException(UNAUTHORIZED_OWNERSHIP_LOG)
    }
    try {
      const res = await this.getMileageWithAuth(auth).rootPutRaw({
        putMileageReadingModel: input,
      })

      if (res.raw.status === 204) {
        this.logger.debug('Successfully updated mileage reading')
        return {
          ...input,
          operation: input.operation ?? null,
          readDate: input.readDate ?? undefined,
          internalId: input.internalId ? input.internalId + 1 : undefined,
        }
      }
      return null
    } catch (error) {
      this.logger.warn('milege update failed', {
        category: LOG_CATEGORY,
        error,
      })
      throw error
    }
  }

  async postMileageReadingV2(
    auth: User,
    input: RootPostRequest['postMileageReadingModel'],
  ): Promise<MileageReadingDto | VehiclesMileageUpdateError | null> {
    if (!input) return null

    const isAllowed = await this.isAllowedMileageRegistration(
      auth,
      input.permno,
    )
    if (!isAllowed) {
      this.logger.error(UNAUTHORIZED_OWNERSHIP_LOG, {
        category: LOG_CATEGORY,
        error: 'postMileageReading failed',
      })
      throw new ForbiddenException(UNAUTHORIZED_OWNERSHIP_LOG)
    }

    try {
      const res = await this.getMileageWithAuth(auth).rootPostRaw({
        postMileageReadingModel: input,
      })

      if (res.raw.status === 200) {
        this.logger.info(
          'Tried to post already existing mileage reading. Should use PUT',
        )
        return null
      }

      const value = await res.value()
      return value
    } catch (e) {
      if (e instanceof FetchError && (e.status === 400 || e.status === 429)) {
        const errorBody = e.body as UpdateResponseError
        return {
          code: e.status,
          message: errorBody.Errors?.[0]?.errorMess || 'Unknown error',
        }
      } else throw e
    }
  }

  async putMileageReadingV2(
    auth: User,
    input: RootPutRequest['putMileageReadingModel'],
  ): Promise<MileageReadingDto | VehiclesMileageUpdateError | null> {
    if (!input) return null

    const isAllowed = await this.isAllowedMileageRegistration(
      auth,
      input.permno,
    )
    if (!isAllowed) {
      this.logger.error(UNAUTHORIZED_OWNERSHIP_LOG, {
        category: LOG_CATEGORY,
        error: 'putMileageReading failed',
      })
      throw new ForbiddenException(UNAUTHORIZED_OWNERSHIP_LOG)
    }

    try {
      const res = await this.getMileageWithAuth(auth).rootPutRaw({
        putMileageReadingModel: input,
      })

      if (res.raw.status === 204) {
        this.logger.debug('mileage update successful')
        return {
          ...input,
          operation: input.operation ?? null,
          readDate: input.readDate ?? undefined,
          internalId: input.internalId ? input.internalId + 1 : undefined,
        }
      }

      this.logger.warn('Something went wrong while updating mileage')
      return {
        code: 500,
        message: 'Something went wrong while updating mileage',
      }
    } catch (e) {
      if (e instanceof FetchError && (e.status === 400 || e.status === 429)) {
        const errorBody = e.body as UpdateResponseError
        return {
          code: e.status,
          message: errorBody.Errors?.[0]?.errorMess || 'Unknown error',
        }
      } else throw e
    }
  }

  async canRegisterMileage(
    auth: User,
    input: CanregistermileagePermnoGetRequest,
  ): Promise<boolean> {
    const res = await this.getMileageWithAuth(auth).canregistermileagePermnoGet(
      {
        permno: input.permno,
      },
    )

    if (typeof res === 'string') {
      return res === 'true'
    }
    return res
  }

  async canUserRegisterMileage(
    auth: User,
    input: CanregistermileagePermnoGetRequest,
  ): Promise<boolean> {
    if (!input) return false

    const res = await this.isAllowedMileageRegistration(auth, input.permno)

    return res
  }

  async requiresMileageRegistration(
    auth: User,
    input: RequiresmileageregistrationPermnoGetRequest,
  ): Promise<boolean> {
    const res = await this.getMileageWithAuth(
      auth,
    ).requiresmileageregistrationPermnoGet({
      permno: input.permno,
    })

    if (typeof res === 'string') {
      return res === 'true'
    }
    return res
  }
}
