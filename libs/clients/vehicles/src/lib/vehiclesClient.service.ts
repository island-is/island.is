import { Injectable } from '@nestjs/common'
import { ExcelApi, PdfApi, VehicleSearchApi } from '../../gen/fetch'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import {
  VehiclesResponseDto,
  mapVehicleResponseDto,
} from './dtos/vehiclesResponse.dto'
import { GetVehiclesInput } from './input/getVehicles.input'
import { OwnershipReportInput } from './input/ownershipReport.input'
import { VehicleHistoryInput } from './input/vehicleHistory.input'

@Injectable()
export class VehiclesClientService {
  constructor(
    private readonly vehiclesSearchApi: VehicleSearchApi,
    private readonly excelApi: ExcelApi,
    private readonly pdfApi: PdfApi,
  ) {}

  private vehiclesApiWithAuth = (user: User) =>
    this.vehiclesSearchApi.withMiddleware(new AuthMiddleware(user as Auth))

  private excelApiWithAuth = (user: User) =>
    this.excelApi.withMiddleware(new AuthMiddleware(user as Auth))

  private pdfApiWithAuth = (user: User) =>
    this.pdfApi.withMiddleware(new AuthMiddleware(user as Auth))

  getVehicles = async (
    user: User,
    input: GetVehiclesInput,
  ): Promise<VehiclesResponseDto | null> => {
    const res = await this.vehiclesApiWithAuth(
      user,
    ).currentvehicleswithmileageandinspGet({
      page: input.page,
      pageSize: input.pageSize,
      includeNextMainInspectionDate: input.includeNextMainInspectionDate,
      onlyMileageRegisterableVehicles: input.onlyMileageRegisterableVehicles,
      onlyMileageRequiredVehicles: input.onlyMileageRequiredVehicles,
      permno: input.query
        ? input.query.length < 5
          ? `${input.query}*`
          : `${input.query}`
        : undefined,
    })

    return mapVehicleResponseDto(res)
  }

  vehicleReport = async (
    user: User,
    { vehicleId }: VehicleHistoryInput,
  ): Promise<Blob> =>
    this.pdfApiWithAuth(user).vehicleReportPdfGet({ permno: vehicleId })

  ownershipReportExcel = async (user: User): Promise<Blob> =>
    this.excelApiWithAuth(user).ownershipReportExcelGet()

  ownershipReportPdf = (
    user: User,
    { personNationalId }: OwnershipReportInput,
  ): Promise<Blob> =>
    this.pdfApiWithAuth(user).ownershipReportPdfGet({ ssn: personNationalId })
}
