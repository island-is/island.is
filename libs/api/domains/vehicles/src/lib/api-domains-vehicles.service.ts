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
  VehicleSearchDto,
  PersidnoLookupResultDto,
  CurrentVehiclesWithMilageAndNextInspDtoListPagedResponse,
} from '@island.is/clients/vehicles'
import {
  CanregistermileagePermnoGetRequest,
  GetMileageReadingRequest,
  MileageReadingApi,
  PostMileageReadingModel,
  PutMileageReadingModel,
  RequiresmileageregistrationPermnoGetRequest,
  RootPostRequest,
  RootPutRequest,
} from '@island.is/clients/vehicles-mileage'
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'
import { AuthMiddleware } from '@island.is/auth-nest-tools'
import type { Auth, User } from '@island.is/auth-nest-tools'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { basicVehicleInformationMapper } from '../utils/basicVehicleInformationMapper'
import { VehiclesDetail, VehiclesExcel } from '../models/getVehicleDetail.model'
import {
  GetVehiclesForUserInput,
  GetVehiclesListV2Input,
} from '../dto/getVehiclesForUserInput'
import { VehicleMileageOverview } from '../models/getVehicleMileage.model'
import isSameDay from 'date-fns/isSameDay'
import { mileageDetailConstructor } from '../utils/helpers'

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
    private vehiclesApi: VehicleSearchApi,
    private mileageReadingApi: MileageReadingApi,
    private readonly featureFlagService: FeatureFlagService,
    @Inject(PublicVehicleSearchApi)
    private publicVehiclesApi: PublicVehicleSearchApi,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  private getVehiclesWithAuth(auth: Auth) {
    return this.vehiclesApi.withMiddleware(new AuthMiddleware(auth))
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

  async getExcelVehiclesForUser(auth: User): Promise<VehiclesExcel> {
    const res = await this.getVehiclesWithAuth(auth).ownershipReportDataGet({
      ssn: auth.nationalId,
    })

    return {
      persidno: res.persidno ?? undefined,
      name: res.name ?? undefined,
      vehicles: res.vehicles?.map((item) =>
        basicVehicleInformationMapper(item),
      ),
    }
  }

  async getPublicVehicleSearch(search: string) {
    const data = await this.publicVehiclesApi.publicVehicleSearchGet({
      search,
    })
    return data
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
  ): Promise<VehicleSearchDto | null> {
    const res = await this.getVehiclesWithAuth(auth).vehicleSearchGet({
      search,
    })
    const { data } = res
    if (!data) return null
    return data[0]
  }

  async getVehicleMileage(
    auth: User,
    input: GetMileageReadingRequest,
  ): Promise<VehicleMileageOverview | null> {
    const featureFlagOn = await this.featureFlagService.getValue(
      Features.servicePortalVehicleMileagePageEnabled,
      false,
      auth,
    )

    if (!featureFlagOn) {
      return null
    }

    await this.hasVehicleServiceAuth(auth, input.permno)

    const res = await this.getMileageWithAuth(auth).getMileageReading({
      permno: input.permno,
    })

    const latestDate = res?.[0]?.readDate
    const isIslandIsReading = res?.[0]?.originCode === ORIGIN_CODE
    const isEditing =
      isReadDateToday(latestDate ?? undefined) && isIslandIsReading

    const returnData = res.map((item) => {
      return mileageDetailConstructor(item)
    })

    return {
      data: returnData,
      permno: input.permno,
      editing: isEditing,
    }
  }

  async postMileageReading(
    auth: User,
    input: RootPostRequest['postMileageReadingModel'],
  ): Promise<PostMileageReadingModel | null> {
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

    const res = await this.getMileageWithAuth(auth).rootPost({
      postMileageReadingModel: input,
    })

    return res
  }

  async putMileageReading(
    auth: User,
    input: RootPutRequest['putMileageReadingModel'],
  ): Promise<PutMileageReadingModel | null> {
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

    const res = await this.getMileageWithAuth(auth).rootPut({
      putMileageReadingModel: input,
    })
    return res
  }

  async canRegisterMileage(
    auth: User,
    input: CanregistermileagePermnoGetRequest,
  ): Promise<boolean> {
    const featureFlagOn = await this.featureFlagService.getValue(
      Features.servicePortalVehicleMileagePageEnabled,
      false,
      auth,
    )

    if (!featureFlagOn) {
      return false
    }

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

    const featureFlagOn = await this.featureFlagService.getValue(
      Features.servicePortalVehicleMileagePageEnabled,
      false,
      auth,
    )

    if (!featureFlagOn) {
      return false
    }

    const res = await this.isAllowedMileageRegistration(auth, input.permno)

    return res
  }

  async requiresMileageRegistration(
    auth: User,
    input: RequiresmileageregistrationPermnoGetRequest,
  ): Promise<boolean> {
    const featureFlagOn = await this.featureFlagService.getValue(
      Features.servicePortalVehicleMileagePageEnabled,
      false,
      auth,
    )

    if (!featureFlagOn) {
      return false
    }

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
