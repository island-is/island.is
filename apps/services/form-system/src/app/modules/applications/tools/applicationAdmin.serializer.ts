import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs'
import { IdentityClientService } from '@island.is/clients/identity'
import { getOrganizationInfoByNationalId } from '../../../../utils/organizationInfo'
import { ApplicationAdminDto } from '../models/dto/applicationAdmin.dto'
import { ApplicationAdminResponseDto } from '../models/dto/applicationAdminResponse.dto'
import { InstitutionDto } from '../models/dto/institution.dto'

@Injectable()
export class ApplicationAdminSerializer
  implements
    NestInterceptor<
      ApplicationAdminResponseDto,
      Promise<ApplicationAdminResponseDto>
    >
{
  constructor(private identityService: IdentityClientService) {}

  intercept(
    _context: ExecutionContext,
    next: CallHandler<ApplicationAdminResponseDto>,
  ): Observable<Promise<ApplicationAdminResponseDto>> {
    return next.handle().pipe(
      map(async (res: ApplicationAdminResponseDto) => {
        return plainToInstance(ApplicationAdminResponseDto, {
          count: res.count,
          rows: await Promise.all(
            res.rows.map((application) => this.serialize(application)),
          ),
        })
      }),
    )
  }

  private async serialize(
    application: ApplicationAdminDto,
  ): Promise<ApplicationAdminDto> {
    const applicantName = await this.identityService.tryToGetNameFromNationalId(
      application.applicant,
      false,
    )

    const institutionName =
      application.institutionNationalId &&
      (await this.identityService.tryToGetNameFromNationalId(
        application.institutionNationalId,
        false,
      ))

    const institutionInfo = getOrganizationInfoByNationalId(
      application.institutionNationalId,
    )

    return plainToInstance(ApplicationAdminDto, {
      ...application,
      applicantName: applicantName ?? '',
      institutionName: institutionName ?? '',
      institutionContentfulSlug: institutionInfo?.type,
    })
  }
}

@Injectable()
export class InstitutionSerializer
  implements NestInterceptor<InstitutionDto[], Promise<InstitutionDto[]>>
{
  intercept(
    _context: ExecutionContext,
    next: CallHandler<InstitutionDto[]>,
  ): Observable<Promise<InstitutionDto[]>> {
    return next.handle().pipe(
      map(async (institutions: InstitutionDto[]) => {
        return plainToInstance(
          InstitutionDto,
          await Promise.all(
            institutions.map((institution) => this.serialize(institution)),
          ),
        )
      }),
    )
  }

  private async serialize(
    institution: InstitutionDto,
  ): Promise<InstitutionDto> {
    const institutionInfo = getOrganizationInfoByNationalId(
      institution.nationalId,
    )

    return plainToInstance(InstitutionDto, {
      ...institution,
      contentfulSlug: institutionInfo?.type,
    })
  }
}
