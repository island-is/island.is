import { Sequelize } from 'sequelize-typescript'

import {
  Body,
  Controller,
  Inject,
  InternalServerErrorException,
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

import { CaseExistsGuard, CaseTypeGuard, CurrentCase } from '../case'
import { CurrentDefendant, SplitDefendantExistsGuard } from '../defendant'
import { Case, Defendant, Subpoena } from '../repository'
import { DeliverDto } from './dto/deliver.dto'
import { UpdateSubpoenaDto } from './dto/updateSubpoena.dto'
import { PoliceSubpoenaExistsGuard } from './guards/policeSubpoenaExists.guard'
import { CurrentSubpoena } from './guards/subpoena.decorator'
import { SubpoenaExistsGuard } from './guards/subpoenaExists.guard'
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

    const theCase = subpoena.case
    const defendant = subpoena.defendant

    if (!theCase || !defendant) {
      // This should never happen because of the PoliceSubpoenaExistsGuard
      throw new InternalServerErrorException(
        `Cannot update subpoena with police subpoena id ${policeSubpoenaId} because it is not linked to a case and/or a defendant`,
      )
    }

    return this.sequelize.transaction((transaction) =>
      this.subpoenaService.update(
        theCase,
        defendant,
        subpoena,
        update,
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
        results?: DeliverResponse,
      ) => {
        const currentSubpoena = await this.subpoenaService.findById(
          subpoena.id,
          transaction,
        )

        return {
          deliveredToPolice: Boolean(results?.delivered),
          subpoenaId: subpoena.id,
          subpoenaCreated: subpoena.created,
          policeSubpoenaId: currentSubpoena.policeSubpoenaId,
          subpoenaHash: currentSubpoena.hash,
          subpoenaDeliveredToPolice: new Date(),
          indictmentHash: theCase.indictmentHash,
        }
      }

      const response = await this.auditTrailService.runAndAuditRequest({
        userId: deliverDto.user.id,
        actionType:
          AuditedAction.DELIVER_SUBPOENA_TO_NATIONAL_COMMISSIONERS_OFFICE,
        action:
          this.subpoenaService.deliverSubpoenaToNationalCommissionersOffice,
        actionProps: {
          theCase,
          defendant,
          subpoena,
          user: deliverDto.user,
          transaction,
        },
        auditedResult: caseId,
        getAuditDetails:
          getDeliveredSubpoenaNationalCommissionersOfficeLogDetails,
      })

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

    return this.sequelize.transaction((transaction) =>
      this.subpoenaService.deliverSubpoenaFileToPolice(
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
