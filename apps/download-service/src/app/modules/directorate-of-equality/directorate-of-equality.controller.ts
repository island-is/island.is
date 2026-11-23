import {
  Controller,
  ForbiddenException,
  Header,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  StreamableFile,
  UseGuards,
} from '@nestjs/common'
import {
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger'
import kennitala from 'kennitala'

import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import {
  ApplicationReportListItemDto,
  DirectorateOfEqualityClientService,
  ReportTypeEnum,
} from '@island.is/clients/directorate-of-equality'
import { AuditService } from '@island.is/nest/audit'
import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'
import { HttpProblemResponse } from '@island.is/nest/problem'

import { ReportParamsDto } from './dto/reportParams.dto'

const REPORT_TYPE_SCOPES: Record<ReportTypeEnum, ApiScope> = {
  [ReportTypeEnum.EQUALITY]: ApiScope.directorateOfEquality,
  [ReportTypeEnum.SALARY]: ApiScope.directorateOfEqualitySalary,
}

const toPdfFile = async (file: Blob, fileName: string) => {
  const buffer = Buffer.from(await file.arrayBuffer())
  return new StreamableFile(buffer, {
    type: 'application/pdf',
    disposition: `inline; filename="${fileName}"`,
    length: buffer.length,
  })
}

@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Scopes(ApiScope.directorateOfEqualityCompany)
@FeatureFlag(Features.isServicePortalEqualityPageEnabled)
@Controller('directorate-of-equality')
export class DirectorateOfEqualityController {
  constructor(
    private readonly directorateOfEqualityService: DirectorateOfEqualityClientService,
    private readonly auditService: AuditService,
  ) {}

  private async getOwnReport(
    user: User,
    id: string,
  ): Promise<ApplicationReportListItemDto> {
    if (!kennitala.isCompany(user.nationalId)) {
      throw new ForbiddenException()
    }
    const response = await this.directorateOfEqualityService.getReports(user)
    const report = response?.reports.find((item) => item.providerId === id)
    if (!report) {
      throw new NotFoundException('Report not found')
    }
    if (!user.scope.includes(REPORT_TYPE_SCOPES[report.type])) {
      throw new ForbiddenException()
    }
    return report
  }

  @Post('/reports/:id/pdf')
  @HttpCode(200)
  @Header('X-Content-Type-Options', 'nosniff')
  @ApiOkResponse({
    content: { 'application/pdf': {} },
    description:
      'The signed-off equality plan or salary report as a PDF, rendered by Jafnréttisstofa',
  })
  @ApiForbiddenResponse({ type: HttpProblemResponse })
  @ApiNotFoundResponse({ type: HttpProblemResponse })
  async getReportPdf(
    @Param() { id }: ReportParamsDto,
    @CurrentUser() user: User,
  ) {
    const report = await this.getOwnReport(user, id)
    const file = await this.directorateOfEqualityService.getReportPdf(user, id)

    this.auditService.audit({
      action: 'getDirectorateOfEqualityReportPdf',
      auth: user,
      resources: id,
    })

    return toPdfFile(file, `${report.identifier ?? 'skyrsla'}.pdf`)
  }

  @Post('/reports/:id/improvement-plan-pdf')
  @HttpCode(200)
  @Header('X-Content-Type-Options', 'nosniff')
  @ApiOkResponse({
    content: { 'application/pdf': {} },
    description:
      'The úrbótaáætlun of a signed-off salary report as a PDF, rendered by Jafnréttisstofa',
  })
  @ApiForbiddenResponse({ type: HttpProblemResponse })
  @ApiNotFoundResponse({ type: HttpProblemResponse })
  async getImprovementPlanPdf(
    @Param() { id }: ReportParamsDto,
    @CurrentUser() user: User,
  ) {
    const report = await this.getOwnReport(user, id)
    if (report.type !== ReportTypeEnum.SALARY) {
      throw new NotFoundException('Report not found')
    }
    const file =
      await this.directorateOfEqualityService.getReportImprovementPlanPdf(
        user,
        id,
      )

    this.auditService.audit({
      action: 'getDirectorateOfEqualityImprovementPlanPdf',
      auth: user,
      resources: id,
    })

    return toPdfFile(file, `${report.identifier ?? 'skyrsla'}-urbotaaetlun.pdf`)
  }
}
