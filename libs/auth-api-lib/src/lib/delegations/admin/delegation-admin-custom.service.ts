import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Sequelize } from 'sequelize-typescript'
import kennitala from 'kennitala'
import { uuid } from 'uuidv4'

import { AuthDelegationType } from '@island.is/shared/types'
import { Auth, User } from '@island.is/auth-nest-tools'
import { NoContentException } from '@island.is/nest/problem'
import {
  Ticket,
  TicketStatus,
  ZendeskService,
} from '@island.is/clients/zendesk'

import { Delegation } from '../models/delegation.model'
import { DelegationAdminCustomDto } from '../dto/delegation-admin-custom.dto'
import { DelegationScope } from '../models/delegation-scope.model'
import { ApiScope } from '../../resources/models/api-scope.model'
import { ApiScopeDelegationType } from '../../resources/models/api-scope-delegation-type.model'
import { DelegationResourcesService } from '../../resources/delegation-resources.service'
import { DelegationsIndexService } from '../delegations-index.service'
import { DelegationScopeService } from '../delegation-scope.service'
import { CreatePaperDelegationDto } from '../dto/create-paper-delegation.dto'
import { DelegationDTO } from '../dto/delegation.dto'
import { NamesService } from '../names.service'
import { DELEGATION_TAG, ZENDESK_CUSTOM_FIELDS } from '../constants/zendesk'
import { DelegationDelegationType } from '../models/delegation-delegation-type.model'
import { DelegationsIncomingCustomService } from '../delegations-incoming-custom.service'
import { DelegationValidity } from '../types/delegationValidity'
import { ErrorCodes } from '@island.is/shared/utils'

@Injectable()
export class DelegationAdminCustomService {
  constructor(
    @InjectModel(Delegation)
    private delegationModel: typeof Delegation,
    @InjectModel(DelegationDelegationType)
    private delegationDelegationTypeModel: typeof DelegationDelegationType,
    private readonly zendeskService: ZendeskService,
    private delegationResourceService: DelegationResourcesService,
    private delegationsIncomingCustomService: DelegationsIncomingCustomService,
    private delegationIndexService: DelegationsIndexService,
    private delegationScopeService: DelegationScopeService,
    private namesService: NamesService,
    private sequelize: Sequelize,
  ) {}

  private getZendeskCustomFields(ticket: Ticket): {
    fromReferenceId: string
    toReferenceId: string
    validTo: string | null
    createdByNationalId: string | null
  } {
    const fromReferenceId = ticket.custom_fields.find(
      (field) => field.id === ZENDESK_CUSTOM_FIELDS.DelegationFromReferenceId,
    )
    const toReferenceId = ticket.custom_fields.find(
      (field) => field.id === ZENDESK_CUSTOM_FIELDS.DelegationToReferenceId,
    )
    const validTo = ticket.custom_fields.find(
      (field) => field.id === ZENDESK_CUSTOM_FIELDS.DelegationValidToId,
    )
    const createdById = ticket.custom_fields.find(
      (field) => field.id === ZENDESK_CUSTOM_FIELDS.DelegationCreatedById,
    )

    if (!fromReferenceId || !toReferenceId) {
      throw new BadRequestException({
        message: 'Zendesk ticket is missing required custom fields',
        error: ErrorCodes.ZENDESK_CUSTOM_FIELDS_MISSING,
      })
    }

    return {
      fromReferenceId: fromReferenceId.value,
      toReferenceId: toReferenceId.value,
      createdByNationalId: createdById?.value ?? null,
      validTo: validTo?.value ?? null,
    }
  }

  async getAllDelegationsByNationalId(
    nationalId: string,
  ): Promise<DelegationAdminCustomDto> {
    const [
      incomingCustomDelegations,
      incomingGeneralDelegations,
      outgoingCustomDelegations,
      outgoingGeneralDelegations,
    ] = await Promise.all([
      this.delegationsIncomingCustomService.findAllValidIncoming({
        nationalId: nationalId,
        validity: DelegationValidity.ALL,
      }),
      this.delegationsIncomingCustomService.findAllValidGeneralMandate({
        nationalId: nationalId,
      }),
      this.delegationModel.findAll({
        where: {
          fromNationalId: nationalId,
        },
        include: [
          {
            model: DelegationScope,
            required: true,
            include: [
              {
                model: ApiScope,
                required: true,
                as: 'apiScope',
                where: {
                  enabled: true,
                },
                include: [
                  {
                    model: ApiScopeDelegationType,
                    required: true,
                    where: {
                      delegationType: AuthDelegationType.Custom,
                    },
                  },
                ],
              },
            ],
          },
        ],
      }),
      this.delegationModel.findAll({
        where: {
          fromNationalId: nationalId,
        },
        include: [
          {
            model: DelegationDelegationType,
            required: true,
            where: {
              delegationTypeId: AuthDelegationType.GeneralMandate,
            },
          },
        ],
      }),
    ])

    return {
      incoming: [...incomingCustomDelegations, ...incomingGeneralDelegations],
      outgoing: [
        ...outgoingGeneralDelegations.map((d) =>
          d.toDTO(AuthDelegationType.GeneralMandate),
        ),
        ...outgoingCustomDelegations.map((delegation) => delegation.toDTO()),
      ],
    }
  }

  async createDelegationByZendeskId(zendeskId: string): Promise<DelegationDTO> {
    const zendeskCase = await this.zendeskService.getTicket(zendeskId)

    const {
      fromReferenceId: fromNationalId,
      toReferenceId: toNationalId,
      validTo,
      createdByNationalId,
    } = this.getZendeskCustomFields(zendeskCase)

    if (!createdByNationalId) {
      throw new BadRequestException({
        message: 'Zendesk ticket is missing created by national id',
        error: ErrorCodes.ZENDESK_CUSTOM_FIELDS_MISSING,
      })
    }

    if (!kennitala.isPerson(createdByNationalId)) {
      throw new BadRequestException({
        message: 'Created by National Id is not valid person national id',
        error: ErrorCodes.INPUT_VALIDATION_INVALID_PERSON,
      })
    }

    this.validatePersonsNationalIds(toNationalId, fromNationalId)

    this.verifyTicketCompletion(zendeskCase)

    const resp = await this.insertDelegation({
      fromNationalId,
      toNationalId,
      referenceId: zendeskId,
      validTo: this.formatZendeskDate(validTo),
      createdBy: createdByNationalId,
    })

    return resp.toDTO(AuthDelegationType.GeneralMandate)
  }

  async createDelegation(
    user: User,
    delegation: CreatePaperDelegationDto,
  ): Promise<DelegationDTO> {
    this.validatePersonsNationalIds(
      delegation.toNationalId,
      delegation.fromNationalId,
    )

    const zendeskCase = await this.zendeskService.getTicket(
      delegation.referenceId,
    )

    this.verifyZendeskTicket(
      zendeskCase,
      delegation.fromNationalId,
      delegation.toNationalId,
    )

    const newDelegation = await this.insertDelegation({
      ...delegation,
      createdBy: user.actor?.nationalId ?? user.nationalId,
    })

    // Index delegations for the toNationalId
    void this.indexDelegations(delegation.toNationalId, user)

    return newDelegation.toDTO(AuthDelegationType.GeneralMandate)
  }

  async deleteDelegation(user: User, delegationId: string): Promise<void> {
    const delegation = await this.delegationModel.findByPk(delegationId)

    if (!delegation || !delegation.referenceId) {
      throw new NoContentException()
    }

    if (!delegation.referenceId) {
      throw new NoContentException()
    }

    const userScopes = await this.delegationResourceService.findScopes(
      user,
      delegation.domainName ?? null,
    )

    await this.sequelize.transaction(async (transaction) => {
      await this.delegationScopeService.delete(
        delegationId,
        userScopes.map((scope) => scope.name),
        transaction,
      )

      // If no scopes are left delete the delegation.
      const remainingScopes = await this.delegationScopeService.findAll(
        delegationId,
      )

      if (remainingScopes.length === 0) {
        await this.delegationModel.destroy({
          transaction,
          where: {
            id: delegationId,
          },
        })
      }

      // Index delegations for the toNationalId
      void this.indexDelegations(delegation.toNationalId, user)
    })
  }

  private validatePersonsNationalIds(
    toNationalId: string,
    fromNationalId: string,
  ) {
    if (toNationalId === fromNationalId) {
      throw new BadRequestException({
        message: 'National Ids cannot be the same',
        error: ErrorCodes.INPUT_VALIDATION_SAME_NATIONAL_ID,
      })
    }

    if (
      !(kennitala.isPerson(fromNationalId) && kennitala.isPerson(toNationalId))
    ) {
      throw new BadRequestException({
        message: 'National Ids are not valid',
        error: ErrorCodes.INPUT_VALIDATION_INVALID_PERSON,
      })
    }
  }

  private indexDelegations(nationalId: string, auth: Auth) {
    void this.delegationIndexService.indexCustomDelegations(nationalId, auth)
    void this.delegationIndexService.indexGeneralMandateDelegations(
      nationalId,
      auth,
    )
  }

  private async insertDelegation(
    delegation: CreatePaperDelegationDto & {
      createdBy: string
    },
  ): Promise<Delegation> {
    const [fromDisplayName, toName] = await Promise.all([
      this.namesService.getPersonName(delegation.fromNationalId),
      this.namesService.getPersonName(delegation.toNationalId),
    ])

    return this.sequelize.transaction(async (transaction) => {
      return this.delegationModel.create(
        {
          id: uuid(),
          toNationalId: delegation.toNationalId,
          fromNationalId: delegation.fromNationalId,
          createdByNationalId: delegation.createdBy,
          referenceId: delegation.referenceId,
          toName,
          fromDisplayName,
          delegationDelegationTypes: [
            {
              delegationTypeId: AuthDelegationType.GeneralMandate,
              validTo: delegation.validTo ? new Date(delegation.validTo) : null,
            },
          ] as DelegationDelegationType[],
        },
        {
          transaction,
          include: [this.delegationDelegationTypeModel],
        },
      )
    })
  }

  private verifyTicketCompletion(ticket: Ticket) {
    if (!ticket.tags.includes(DELEGATION_TAG)) {
      throw new BadRequestException({
        message: 'Zendesk case is missing required tag',
        error: ErrorCodes.ZENDESK_TAG_MISSING,
      })
    }

    if (ticket.status !== TicketStatus.Solved) {
      throw new BadRequestException({
        message: 'Zendesk case is not solved',
        error: ErrorCodes.ZENDESK_STATUS,
      })
    }
  }

  private verifyZendeskTicket(
    ticket: Ticket,
    fromNationalId: string,
    toNationalId: string,
  ) {
    this.verifyTicketCompletion(ticket)

    const { fromReferenceId, toReferenceId } =
      this.getZendeskCustomFields(ticket)

    if (fromReferenceId !== fromNationalId || toReferenceId !== toNationalId) {
      throw new BadRequestException({
        message: 'National Ids do not match the Zendesk ticket',
        error: ErrorCodes.ZENDESK_NATIONAL_IDS_MISMATCH,
      })
    }
  }

  private formatZendeskDate(date: string | null): Date | null {
    if (!date) {
      return null
    }

    const [day, month, year] = date.split('.').map(Number)

    if (!day || !month || !year || isNaN(day) || isNaN(month) || isNaN(year)) {
      throw new BadRequestException({
        message: 'Invalid date format in Zendesk ticket',
        error: ErrorCodes.INVALID_DATE_FORMAT,
      })
    }

    return new Date(year, month - 1, day)
  }
}
