import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { mergeMap } from 'rxjs/operators'
import { Observable, from } from 'rxjs'
import { IdentityClientService } from '@island.is/clients/identity'
import { getOrganizationInfoByNationalId } from '../../../../utils/organizationInfo'
import { ApplicationAdminDto } from '../models/dto/admin/applicationAdmin.dto'
import { ApplicationAdminResponseDto } from '../models/dto/admin/applicationAdminResponse.dto'
import { InstitutionDto } from '../models/dto/admin/institution.dto'

@Injectable()
export class ApplicationAdminSerializer
  implements
    NestInterceptor<ApplicationAdminResponseDto, ApplicationAdminResponseDto>
{
  constructor(private identityService: IdentityClientService) {}

  intercept(
    _context: ExecutionContext,
    next: CallHandler<ApplicationAdminResponseDto>,
  ): Observable<ApplicationAdminResponseDto> {
    return next.handle().pipe(
      mergeMap((res: ApplicationAdminResponseDto) =>
        from(
          Promise.all(
            res.rows.map((application) => this.serialize(application)),
          ).then((rows) =>
            plainToInstance(ApplicationAdminResponseDto, {
              count: res.count,
              rows,
            }),
          ),
        ),
      ),
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
      institutionContentfulSlug: institutionInfo?.slug,
    })
  }
}

@Injectable()
export class InstitutionSerializer
  implements NestInterceptor<InstitutionDto[], InstitutionDto[]>
{
  constructor(private identityService: IdentityClientService) {}

  intercept(
    _context: ExecutionContext,
    next: CallHandler<InstitutionDto[]>,
  ): Observable<InstitutionDto[]> {
    return next
      .handle()
      .pipe(
        mergeMap((institutions: InstitutionDto[]) =>
          from(
            Promise.all(
              institutions.map((institution) => this.serialize(institution)),
            ).then((serialized) => plainToInstance(InstitutionDto, serialized)),
          ),
        ),
      )
  }

  private async serialize(
    institution: InstitutionDto,
  ): Promise<InstitutionDto> {
    const institutionInfo = getOrganizationInfoByNationalId(
      institution.nationalId,
    )

    const institutionName =
      await this.identityService.tryToGetNameFromNationalId(
        institution.nationalId,
        false,
      )

    return plainToInstance(InstitutionDto, {
      ...institution,
      name: institutionName,
      contentfulSlug: institutionInfo?.slug,
    })
  }
}
