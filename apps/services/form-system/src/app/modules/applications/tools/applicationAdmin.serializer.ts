import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { mergeMap } from 'rxjs/operators'
import { Observable, from } from 'rxjs'
import { IdentityClientService } from '@island.is/clients/identity'
import { getOrganizationInfoByNationalId } from '../../../../utils/organizationInfo'
import { ApplicationAdminDto } from '../models/dto/admin/applicationAdmin.dto'
import { ApplicationAdminResponseDto } from '../models/dto/admin/applicationAdminResponse.dto'
import { InstitutionDto } from '../models/dto/admin/institution.dto'
import { ApplicationStatisticsDto } from '../models/dto/admin/applicationStatistics.dto'
import { ApplicationsService } from '../applications.service'
import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

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
            Promise.allSettled(
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

@Injectable()
export class ApplicationStatisticsSerializer
  implements
    NestInterceptor<ApplicationStatisticsDto[], ApplicationStatisticsDto[]>
{
  constructor(
    private identityService: IdentityClientService,
    private applicationService: ApplicationsService,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
  ) {}
  intercept(
    _context: ExecutionContext,
    next: CallHandler<ApplicationStatisticsDto[]>,
  ): Observable<ApplicationStatisticsDto[]> {
    return next
      .handle()
      .pipe(
        mergeMap((applicationStatistics: ApplicationStatisticsDto[]) =>
          from(
            Promise.all(
              applicationStatistics.map((applicationStatistic) =>
                this.serialize(applicationStatistic),
              ),
            ).then((serialized) =>
              plainToInstance(
                ApplicationStatisticsDto,
                serialized.filter(
                  (item): item is ApplicationStatisticsDto => item !== null,
                ),
              ),
            ),
          ),
        ),
      )
  }

  private async serialize(
    applicationStatistic: ApplicationStatisticsDto,
  ): Promise<ApplicationStatisticsDto | null> {
    try {
      const institutionName =
        await this.identityService.tryToGetNameFromNationalId(
          applicationStatistic.institutionNationalId,
          false,
        )
      const institutionInfo = getOrganizationInfoByNationalId(
        applicationStatistic.institutionNationalId,
      )

      return plainToInstance(ApplicationStatisticsDto, {
        ...applicationStatistic,
        institutionName: institutionName ?? '',
        institutionContentfulSlug: institutionInfo?.slug,
      })
    } catch (error) {
      this.logger.warn(
        `Failed to serialize ApplicationStatisticsDto for formId ${applicationStatistic.formId}`,
        { error },
      )

      return null
    }
  }
}
