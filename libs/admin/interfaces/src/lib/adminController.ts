import { User} from "@island.is/auth-nest-tools";
import {
  ApplicationTypeDto
} from "../../../../../apps/services/form-system/src/app/modules/applications/models/dto/applicationType.dto";
import {
  InstitutionDto
} from "../../../../../apps/services/form-system/src/app/modules/applications/models/dto/institution.dto";
import {AdminApplicationCardDto} from "../types/AdminApplicationCardDto";

export interface AdminController {

  getOverviewForSuperAdmin(
    page: number,
    count: number,
    status?: string,
    applicantNationalId?: string,
    institutionNationalId?: string,
    from?: string,
    to?: string,
    typeIdValue?: string,
    searchStr?: string,
    applicationId?: string, //todo: implement
  ): Promise<AdminApplicationCardDto>

  getOverviewForInstitutionAdmin(
    user: User,
    page: number,
    count: number,
    status?: string,
    applicantNationalId?: string,
    institutionNationalId?: string,
    from?: string,
    to?: string,
    typeIdValue?: string,
    searchStr?: string,
    applicationId?: string, //todo: implement
  ): Promise<AdminApplicationCardDto>

  getApplicationTypesForSuperAdmin(): Promise<ApplicationTypeDto>

  getApplicationTypesForInstitutionAdmin(
    nationalId: string,
  ): Promise<ApplicationTypeDto[]>

  getInstitutions(): Promise<InstitutionDto[]>

  getStatisticsForSuperAdmin(
    startDate: string,
    endDate: string,
  ): Promise<null>

  getStatisticsForInstitutionAdmin(
    user: User,
    startDate: string,
    endDate: string,
    ): Promise<null>


}
