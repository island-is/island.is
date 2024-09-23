import { Inject, Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Sequelize } from 'sequelize-typescript'
import { uuid } from 'uuidv4'

import { AuthDelegationType } from '@island.is/shared/types'
import { User } from '@island.is/auth-nest-tools'
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
import { NEW_DELEGATION_TEMPLATE_ID } from '../constants/hnipp'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { NotificationsApi } from '../../user-notification'
import { Features } from '@island.is/feature-flags'
import { FeatureFlagService } from '@island.is/nest/feature-flags'

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
    private notificationsApi: NotificationsApi,
    private namesService: NamesService,
    private featureFlagService: FeatureFlagService,
    private sequelize: Sequelize,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  private async notifyDelegationCreated({
    user,
    delegation, fromName }: {
  user: User,
    delegation: DelegationDTO,
    fromName: string,
  }) {

    try {
      const allowDelegationNotification =
        await this.featureFlagService.getValue(
          Features.isDelegationNotificationEnabled,
          false,
          user,
        )

      if (
        !allowDelegationNotification
      ) {
        return
      }

    const args = [
      { key: 'name', value: fromName },
      {
        key: 'domainNameIs',
        value: 'öll kerfi',
      },
      {
        key: 'domainNameEn',
        value: 'all systems',
      },
    ]
      // Notify toNationalId of new delegation
      await this.notificationsApi.notificationsControllerCreateHnippNotification(
        {
          createHnippNotificationDto: {
            args,
            recipient: delegation.toNationalId,
            templateId: NEW_DELEGATION_TEMPLATE_ID,
          },
        },
      )
    } catch (e) {
      this.logger.error(`Failed to send delegation notification`, e)
    }
  }

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
    const incomingDelegationPromises = []

    incomingDelegationPromises.push(
      this.delegationsIncomingCustomService.findAllValidIncoming({
        nationalId: nationalId,
        validity: DelegationValidity.ALL,
      }),
    )

    incomingDelegationPromises.push(
      this.delegationsIncomingCustomService.findAllValidGeneralMandate({
        nationalId: nationalId,
      }),
    )

    const [
      incomingDelegationSets,
      outgoingDelegations,
      generalOutgoingDelegations,
    ] = await Promise.all([
      await Promise.all(incomingDelegationPromises),
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
      incoming: ([] as DelegationDTO[]).concat(...incomingDelegationSets),
      outgoing: [
        generalOutgoingDelegations.map((d) =>
          d.toDTO(AuthDelegationType.GeneralMandate),
        ),
        outgoingDelegations.map((delegation) => delegation.toDTO()),
      ].flat(),
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


    const createdDelegation = await this.sequelize.transaction(async (transaction) => {
      const newDelegation = await this.delegationModel.create(
        {
          id: uuid(),
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

      await this.delegationDelegationTypeModel.create(
        {
          delegationId: newDelegation.id,
          delegationTypeId: AuthDelegationType.GeneralMandate,
          validTo: delegation.validTo,
        },
        {
          transaction,
        },
      )

      // Index custom delegations for the toNationalId
      void this.delegationIndexService.indexCustomDelegations(
        delegation.toNationalId,
      )

      return newDelegation.toDTO(AuthDelegationType.GeneralMandate)
    })

    await this.notifyDelegationCreated({
      user,
      delegation: createdDelegation,
     fromName: fromDisplayName,
    })

    return createdDelegation
  }

  async deleteDelegation(user: User, delegationId: string): Promise<void> {
    const delegation = await this.delegationModel.findByPk(delegationId)

    if (!delegation) {
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

      await this.delegationDelegationTypeModel.destroy({
        transaction,
        where: {
          delegationId,
        },
      })

      // Index custom delegations for the toNationalId
      void this.delegationIndexService.indexCustomDelegations(
        delegation.toNationalId,
      )
    })
  }
}
