import { Sequelize } from 'sequelize-typescript'

import {
  Body,
  Controller,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import { InjectConnection } from '@nestjs/sequelize'
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

import { getOrCreateTransaction } from '../../middleware'
import {
  CaseExistsForUpdateGuard,
  CaseExistsGuard,
  CaseTypeGuard,
  CurrentCase,
} from '../case'
import { CurrentDefendant, SplitDefendantExistsGuard } from '../defendant'
import { Case, Defendant, Subpoena } from '../repository'
import { DeliverDto } from './dto/deliver.dto'
import { UpdateSubpoenaDto } from './dto/updateSubpoena.dto'
import { PoliceSubpoenaExistsGuard } from './guards/policeSubpoenaExists.guard'
import { CurrentSubpoena } from './guards/subpoena.decorator'
import { SubpoenaExistsGuard } from './guards/subpoenaExists.guard'
import { SubpoenaOnCaseGuard } from './guards/subpoenaOnCase.guard'
import { DeliverResponse } from './models/deliver.response'
import { SubpoenaService } from './subpoena.service'

@Controller('api/internal')
@ApiTags('internal subpoenas')
@UseGuards(TokenGuard)
export class InternalSubpoenaController {
  constructor(
    private readonly subpoenaService: SubpoenaService,
    private readonly auditTrailService: AuditTrailService,
    @InjectConnection() private readonly sequelize: Sequelize,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  // The police name the subpoena, not the case: PoliceSubpoenaExistsGuard
  // resolves it by its police subpoena id and puts the case id on the request
  // params, which is where CaseExistsForUpdateGuard reads it from - so it has
  // to run first. The case is then read under FOR UPDATE, and
  // SubpoenaOnCaseGuard swaps the subpoena, and the defendant it summons, for
  // the copies the locked case carries: the first read happened before the
  // lock, so its fields may be stale, and the service status change below is
  // decided from them. Two deliveries of the same status at once both read the
  // subpoena unserved before either locks; the second serializes behind the
  // first's commit and then sees the status already there, so it neither files
  // a second service certificate nor announces twice.
  @UseGuards(
    PoliceSubpoenaExistsGuard,
    CaseExistsForUpdateGuard,
    SubpoenaOnCaseGuard,
  )
  @Patch('subpoena/:policeSubpoenaId')
  async updateSubpoena(
    @Param('policeSubpoenaId') policeSubpoenaId: string,
    @CurrentCase() theCase: Case,
    @CurrentDefendant() defendant: Defendant,
    @CurrentSubpoena() subpoena: Subpoena,
    @Body() update: UpdateSubpoenaDto,
  ): Promise<Subpoena> {
    this.logger.debug(
      `Updating subpoena by police subpoena id ${policeSubpoenaId}`,
    )

    // The same transaction the guard read the case in - opening one of our own
    // would block on its row lock while it waits for this handler to return,
    // which is a deadlock rather than a race.
    const transaction = await getOrCreateTransaction(this.sequelize)

    return this.subpoenaService.update(
      theCase,
      defendant,
      subpoena,
      update,
      transaction,
    )
  }

  @UseGuards(
    CaseExistsGuard,
    new CaseTypeGuard(indictmentCases),
    SplitDefendantExistsGuard,
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
  async deliverSubpoenaToNationalCommissionersOffice(
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

    const transaction = await this.sequelize.transaction()

    try {
      // callback function to fetch the updated subpoena fields after delivering subpoena to police
      const getDeliveredSubpoenaNationalCommissionersOfficeLogDetails = async (
        results: DeliverResponse,
      ) => {
        const currentSubpoena = await this.subpoenaService.findById(
          subpoena.id,
          transaction,
        )
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

      const response = await this.auditTrailService.audit(
        deliverDto.user.id,
        AuditedAction.DELIVER_SUBPOENA_TO_NATIONAL_COMMISSIONERS_OFFICE,
        this.subpoenaService.deliverSubpoenaToNationalCommissionersOffice({
          theCase,
          defendant,
          subpoena,
          user: deliverDto.user,
          transaction,
        }),
        caseId,
        getDeliveredSubpoenaNationalCommissionersOfficeLogDetails,
      )

      await transaction.commit()

      return response
    } catch (error) {
      this.logger.error(
        `Failed to deliver subpoena ${subpoenaId} to national commissioners office for defendant ${defendantId} of case ${caseId}`,
        { error },
      )

      await transaction.rollback()

      throw error
    }
  }

  @UseGuards(
    CaseExistsGuard,
    new CaseTypeGuard(indictmentCases),
    SplitDefendantExistsGuard,
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

    return this.sequelize.transaction((transaction) =>
      this.subpoenaService.deliverSubpoenaToCourt(
        theCase,
        defendant,
        subpoena,
        deliverDto.user,
        transaction,
      ),
    )
  }

  @UseGuards(
    CaseExistsGuard,
    new CaseTypeGuard(indictmentCases),
    SplitDefendantExistsGuard,
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
    SplitDefendantExistsGuard,
    SubpoenaExistsGuard,
  )
  @Post(
    `case/:caseId/${
      messageEndpoint[MessageType.DELIVERY_TO_POLICE_SERVICE_CERTIFICATE]
    }/:defendantId/:subpoenaId`,
  )
  @ApiOkResponse({
    type: DeliverResponse,
    description: 'Delivers a service certificate to the police',
  })
  deliverServiceCertificateToPolice(
    @Param('caseId') caseId: string,
    @Param('defendantId') defendantId: string,
    @Param('subpoenaId') subpoenaId: string,
    @CurrentCase() theCase: Case,
    @CurrentDefendant() defendant: Defendant,
    @CurrentSubpoena() subpoena: Subpoena,
    @Body() deliverDto: DeliverDto,
  ): Promise<DeliverResponse> {
    this.logger.debug(
      `Delivering service certificate pdf to police for subpoena ${subpoenaId} of defendant ${defendantId} and case ${caseId}`,
    )

    return this.subpoenaService.deliverServiceCertificateToPolice(
      theCase,
      defendant,
      subpoena,
      deliverDto.user,
    )
  }

  @UseGuards(
    CaseExistsGuard,
    new CaseTypeGuard(indictmentCases),
    SplitDefendantExistsGuard,
    SubpoenaExistsGuard,
  )
  @Post([
    `case/:caseId/${
      messageEndpoint[
        MessageType
          .DELIVERY_TO_NATIONAL_COMMISSIONERS_OFFICE_SUBPOENA_REVOCATION
      ]
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
