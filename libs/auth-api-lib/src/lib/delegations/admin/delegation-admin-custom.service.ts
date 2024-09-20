import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { Delegation } from '../models/delegation.model'
import { DelegationAdminCustomDto } from '../dto/delegation-admin-custom.dto'
import { DelegationScope } from '../models/delegation-scope.model'
import { ApiScope } from '../../resources/models/api-scope.model'
import { ApiScopeDelegationType } from '../../resources/models/api-scope-delegation-type.model'
import { AuthDelegationType } from '@island.is/shared/types'
import { User } from '@island.is/auth-nest-tools'
import { DelegationResourcesService } from '../../resources/delegation-resources.service'
import { DelegationsIndexService } from '../delegations-index.service'
import { DelegationScopeService } from '../delegation-scope.service'
import { NoContentException } from '@island.is/nest/problem'
import { Sequelize } from 'sequelize-typescript'
import { CreatePaperDelegationDto } from '../dto/create-paper-delegation.dto'
import { DelegationDTO } from '../dto/delegation.dto'
import { NamesService } from '../names.service'
import {
  Ticket,
  TicketStatus,
  ZendeskService,
} from '@island.is/clients/zendesk'
import { DELEGATION_TAG, ZENDESK_CUSTOM_FIELDS } from '../constants/zendesk'

@Injectable()
export class DelegationAdminCustomService {
  constructor(
    @InjectModel(Delegation)
    private delegationModel: typeof Delegation,
    private readonly zendeskService: ZendeskService,
    private delegationResourceService: DelegationResourcesService,
    private delegationIndexService: DelegationsIndexService,
    private delegationScopeService: DelegationScopeService,
    private namesService: NamesService,
    private sequelize: Sequelize,
  ) {}

  private getNationalIdsFromZendeskTicket(ticket: Ticket): {
    fromReferenceId: string
    toReferenceId: string
  } {
    const fromReferenceId = ticket.custom_fields.find(
      (field) => field.id === ZENDESK_CUSTOM_FIELDS.DelegationFromReferenceId,
    )
    const toReferenceId = ticket.custom_fields.find(
      (field) => field.id === ZENDESK_CUSTOM_FIELDS.DelegationToReferenceId,
    )

    if (!fromReferenceId || !toReferenceId) {
      throw new Error('Zendesk ticket is missing required custom fields')
    }

    return {
      fromReferenceId: fromReferenceId.value,
      toReferenceId: toReferenceId.value,
    }
  }

  async getAllDelegationsByNationalId(
    nationalId: string,
  ): Promise<DelegationAdminCustomDto> {
    const [incomingDelegations, outgoingDelegations] = await Promise.all([
      this.delegationModel.findAll({
        where: {
          toNationalId: nationalId,
        },
        include: [
          {
            model: DelegationScope,
            required: true,
            include: [
              {
                model: ApiScope,
                as: 'apiScope',
                required: true,
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
    ])

    return {
      incoming: incomingDelegations.map((delegation) => delegation.toDTO()),
      outgoing: outgoingDelegations.map((delegation) => delegation.toDTO()),
    }
  }

  async createDelegation(
    user: User,
    delegation: CreatePaperDelegationDto,
  ): Promise<DelegationDTO> {
    if (delegation.fromNationalId === delegation.toNationalId)
      throw new Error('Cannot create a delegation between the same nationalId.')

    const zenDeskCase = await this.zendeskService.getTicket(
      delegation.referenceId,
    )

    if (!zenDeskCase.tags.includes(DELEGATION_TAG)) {
      throw new Error('Zendesk ticket is missing required tag')
    }

    if (zenDeskCase.status !== TicketStatus.Solved) {
      throw new Error('Zendesk case is not solved')
    }

    const { fromReferenceId, toReferenceId } =
      this.getNationalIdsFromZendeskTicket(zenDeskCase)

    if (
      fromReferenceId !== delegation.fromNationalId ||
      toReferenceId !== delegation.toNationalId
    ) {
      throw new Error(
        'Zendesk ticket nationalIds does not match delegation nationalIds',
      )
    }

    const [fromDisplayName, toName] = await Promise.all([
      this.namesService.getPersonName(delegation.fromNationalId),
      this.namesService.getPersonName(delegation.toNationalId),
    ])

    return this.sequelize.transaction(async (transaction) => {
      const newDelegation = await this.delegationModel.create(
        {
          toNationalId: delegation.toNationalId,
          fromNationalId: delegation.fromNationalId,
          createdByNationalId: user.actor?.nationalId ?? user.nationalId,
          referenceId: delegation.referenceId,
          toName,
          fromDisplayName,
        },
        {
          transaction,
        },
      )

      // Index custom delegations for the toNationalId
      void this.delegationIndexService.indexCustomDelegations(
        delegation.toNationalId,
      )

      return newDelegation.toDTO()
    })
  }

  async deleteDelegation(user: User, delegationId: string): Promise<void> {
    const delegation = await this.delegationModel.findByPk(delegationId)

    if (!delegation || !delegation.referenceId) {
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

      // Index custom delegations for the toNationalId
      void this.delegationIndexService.indexCustomDelegations(
        delegation.toNationalId,
      )
    })
  }
}
