import {
  Body,
  Controller,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  AuditedAction,
  AuditTrailService,
} from '@island.is/judicial-system/audit-trail'
import { TokenGuard } from '@island.is/judicial-system/auth'
import {
  messageEndpoint,
  MessageType,
} from '@island.is/judicial-system/message'
import { indictmentCases } from '@island.is/judicial-system/types'

import { CaseExistsGuard, CaseTypeGuard, CurrentCase } from '../case'
import { Case } from '../case/models/case.model'
import { CurrentDefendant } from '../defendant/guards/defendant.decorator'
import { DefendantExistsGuard } from '../defendant/guards/defendantExists.guard'
import { Defendant } from '../defendant/models/defendant.model'
import { DeliverDto } from './dto/deliver.dto'
import { UpdateSubpoenaDto } from './dto/updateSubpoena.dto'
import { PoliceSubpoenaExistsGuard } from './guards/policeSubpoenaExists.guard'
import { CurrentSubpoena } from './guards/subpoena.decorator'
import { SubpoenaExistsGuard } from './guards/subpoenaExists.guard'
import { DeliverResponse } from './models/deliver.response'
import { Subpoena } from './models/subpoena.model'
import { SubpoenaService } from './subpoena.service'

@Controller('api/internal')
@ApiTags('internal subpoenas')
@UseGuards(TokenGuard)
export class InternalSubpoenaController {
  constructor(
    private readonly subpoenaService: SubpoenaService,
    private readonly auditTrailService: AuditTrailService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(PoliceSubpoenaExistsGuard)
  @Patch('subpoena/:policeSubpoenaId')
  updateSubpoena(
    @Param('policeSubpoenaId') policeSubpoenaId: string,
    @CurrentSubpoena() subpoena: Subpoena,
    @Body() update: UpdateSubpoenaDto,
  ): Promise<Subpoena> {
    this.logger.debug(
      `Updating subpoena by police subpoena id ${policeSubpoenaId}`,
    )

    return this.subpoenaService.update(subpoena, update)
  }

  @UseGuards(
    CaseExistsGuard,
    new CaseTypeGuard(indictmentCases),
    DefendantExistsGuard,
    SubpoenaExistsGuard,
  )
  @Post([
    `case/:caseId/${
      messageEndpoint[
        MessageType.DELIVERY_TO_NATIONAL_COMMISSIONERS_OFFICE_SUBPOENA
      ]
    }/:defendantId/:subpoenaId`,
  ])
  @ApiOkResponse({
    type: DeliverResponse,
    description: 'Delivers a subpoena to the police centralized file service',
  })
  deliverSubpoenaToNationalCommissionersOffice(
    @Param('caseId') caseId: string,
    @Param('defendantId') defendantId: string,
    @Param('subpoenaId') subpoenaId: string,
    @CurrentCase() theCase: Case,
    @CurrentDefendant() defendant: Defendant,
    @CurrentSubpoena() subpoena: Subpoena,
    @Body() deliverDto: DeliverDto,
  ): Promise<DeliverResponse> {
    this.logger.debug(
      `Delivering subpoena ${subpoenaId} pdf to the police centralized file service for defendant ${defendantId} of case ${caseId}`,
    )

    // callback function to fetch the updated subpoena fields after delivering subpoena to police
    const getDeliveredSubpoenaNationalCommissionersOfficeLogDetails = async (
      results: DeliverResponse,
    ) => {
      const currentSubpoena = await this.subpoenaService.findById(subpoena.id)
      return {
        deliveredToPolice: results.delivered,
        subpoenaId: subpoena.id,
        subpoenaCreated: subpoena.created,
        policeSubpoenaId: currentSubpoena.policeSubpoenaId,
        subpoenaHash: currentSubpoena.hash,
        subpoenaDeliveredToPolice: new Date(),
        indictmentHash: theCase.indictmentHash,
      }
    }

    return this.auditTrailService.audit(
      deliverDto.user.id,
      AuditedAction.DELIVER_SUBPOENA_TO_NATIONAL_COMMISSIONERS_OFFICE,
      this.subpoenaService.deliverSubpoenaToNationalCommissionersOffice(
        theCase,
        defendant,
        subpoena,
        deliverDto.user,
      ),
      caseId,
      getDeliveredSubpoenaNationalCommissionersOfficeLogDetails,
    )
  }

  @UseGuards(
    CaseExistsGuard,
    new CaseTypeGuard(indictmentCases),
    DefendantExistsGuard,
    SubpoenaExistsGuard,
  )
  @Post(
    `case/:caseId/${
      messageEndpoint[MessageType.DELIVERY_TO_POLICE_SUBPOENA_FILE]
    }/:defendantId/:subpoenaId`,
  )
  @ApiOkResponse({
    type: DeliverResponse,
    description: 'Delivers a subpoena to the police',
  })
  deliverSubpoenaFileToPolice(
    @Param('caseId') caseId: string,
    @Param('defendantId') defendantId: string,
    @Param('subpoenaId') subpoenaId: string,
    @CurrentCase() theCase: Case,
    @CurrentDefendant() defendant: Defendant,
    @CurrentSubpoena() subpoena: Subpoena,
    @Body() deliverDto: DeliverDto,
  ): Promise<DeliverResponse> {
    this.logger.debug(
      `Delivering subpoena ${subpoenaId} pdf to police for defendant ${defendantId} of case ${caseId}`,
    )

    return this.subpoenaService.deliverSubpoenaFileToPolice(
      theCase,
      defendant,
      subpoena,
      deliverDto.user,
    )
  }

  @UseGuards(
    CaseExistsGuard,
    new CaseTypeGuard(indictmentCases),
    DefendantExistsGuard,
    SubpoenaExistsGuard,
  )
  @Post(
    `case/:caseId/${
      messageEndpoint[MessageType.DELIVERY_TO_COURT_SUBPOENA]
    }/:defendantId/:subpoenaId`,
  )
  @ApiOkResponse({
    type: DeliverResponse,
    description: 'Delivers a subpoena to the court',
  })
  deliverSubpoenaToCourt(
    @Param('caseId') caseId: string,
    @Param('defendantId') defendantId: string,
    @Param('subpoenaId') subpoenaId: string,
    @CurrentCase() theCase: Case,
    @CurrentDefendant() defendant: Defendant,
    @CurrentSubpoena() subpoena: Subpoena,
    @Body() deliverDto: DeliverDto,
  ): Promise<DeliverResponse> {
    this.logger.debug(
      `Delivering subpoena ${subpoenaId} pdf to court for defendant ${defendantId} of case ${caseId}`,
    )

    return this.subpoenaService.deliverSubpoenaToCourt(
      theCase,
      defendant,
      subpoena,
      deliverDto.user,
    )
  }

  @UseGuards(
    CaseExistsGuard,
    new CaseTypeGuard(indictmentCases),
    DefendantExistsGuard,
    SubpoenaExistsGuard,
  )
  @Post(
    `case/:caseId/${
      messageEndpoint[MessageType.DELIVERY_TO_COURT_SERVICE_CERTIFICATE]
    }/:defendantId/:subpoenaId`,
  )
  @ApiOkResponse({
    type: DeliverResponse,
    description: 'Delivers a service certificate to the court',
  })
  deliverServiceCertificateToCourt(
    @Param('caseId') caseId: string,
    @Param('defendantId') defendantId: string,
    @Param('subpoenaId') subpoenaId: string,
    @CurrentCase() theCase: Case,
    @CurrentDefendant() defendant: Defendant,
    @CurrentSubpoena() subpoena: Subpoena,
    @Body() deliverDto: DeliverDto,
  ): Promise<DeliverResponse> {
    this.logger.debug(
      `Delivering service certificate pdf to court for subpoena ${subpoenaId} of defendant ${defendantId} and case ${caseId}`,
    )

    return this.subpoenaService.deliverServiceCertificateToCourt(
      theCase,
      defendant,
      subpoena,
      deliverDto.user,
    )
  }

  @UseGuards(
    CaseExistsGuard,
    new CaseTypeGuard(indictmentCases),
    DefendantExistsGuard,
    SubpoenaExistsGuard,
  )
  @Post([
    `case/:caseId/${
      messageEndpoint[
        MessageType
          .DELIVERY_TO_NATIONAL_COMMISSIONERS_OFFICE_SUBPOENA_REVOCATION
      ]
    }/:defendantId/:subpoenaId`,
    `case/:caseId/${
      messageEndpoint[MessageType.DELIVERY_TO_POLICE_SUBPOENA_REVOCATION]
    }/:defendantId/:subpoenaId`,
  ])
  @ApiOkResponse({
    type: DeliverResponse,
    description: 'Delivers subpoena revocation to police',
  })
  deliverSubpoenaRevocationToNationalCommissionersOffice(
    @Param('caseId') caseId: string,
    @Param('defendantId') defendantId: string,
    @Param('subpoenaId') subpoenaId: string,
    @CurrentCase() theCase: Case,
    @CurrentSubpoena() subpoena: Subpoena,
    @Body() deliverDto: DeliverDto,
  ): Promise<DeliverResponse> {
    this.logger.debug(
      `Delivering subpoena revocation of ${subpoenaId} to national commissioners office for defendant ${defendantId} of case ${caseId}`,
    )

    return this.subpoenaService.deliverSubpoenaRevocationToNationalCommissionersOffice(
      theCase,
      subpoena,
      deliverDto.user,
    )
  }
}
