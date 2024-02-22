import { Injectable } from '@nestjs/common'
import { DelegationsIncomingCustomService } from './delegations-incoming-custom.service'
import { User } from '@island.is/auth-nest-tools'
import { DelegationIndex } from './models/delegation-index.model'
import { InjectModel } from '@nestjs/sequelize'
import { DelegationIndexMeta } from './models/delegation-index-meta.model'
import { DelegationType } from './types/delegationType'
import { DelegationProvider } from './dto/delegation.dto'

const TEN_MINUTES = 1000 * 60 * 10

export type DelegationIndexInfo = Pick<
  DelegationIndex,
  | 'toNationalId'
  | 'fromNationalId'
  | 'provider'
  | 'type'
  | 'validTo'
  | 'customDelegationScopes'
>

/**
 * Service class for delegation index.
 * Delegation index stores delegations for a user
 * to bypass the need to fetch them from third party services
 * */
@Injectable()
export class DelegationsIndexService {
  constructor(
    @InjectModel(DelegationIndex)
    private delegationIndexModel: typeof DelegationIndex,
    @InjectModel(DelegationIndexMeta)
    private delegationIndexMetaModel: typeof DelegationIndexMeta,
    private delegationsIncomingCustomService: DelegationsIncomingCustomService,
  ) {}

  async indexDelegations(user: User) {
    const now = new Date().getTime()
    // logic to determine if we need to index delegations
    const meta = await this.delegationIndexMetaModel.findOne({
      where: {
        nationalId: user.nationalId,
      },
      attributes: ['nextReindex'],
    })

    // if we have a next reindex date, and it is in the future, we don't need to reindex
    if (
      meta &&
      meta.nextReindex &&
      new Date(meta.nextReindex).getTime() > now
    ) {
      return
    }

    // set next reindex 10 minutes in the future
    const nextReindex = new Date(now + TEN_MINUTES)
    await this.delegationIndexMetaModel.upsert({
      nationalId: user.nationalId,
      nextReindex,
      lastFullReindex: new Date(),
    })

    const allDelegations: DelegationIndexInfo[] = []

    const customDelegations =
      await this.delegationsIncomingCustomService.findAllValidIncoming(user)

    allDelegations.push(
      ...customDelegations.map((delegation) => ({
        fromNationalId: delegation.fromNationalId,
        toNationalId: delegation.toNationalId,
        customDelegationScopes: delegation.scopes?.map(
          (scope) => scope.scopeName,
        ),
        type: DelegationType.Custom,
        provider: DelegationProvider.Custom,
      })),
    )

    await this.delegationIndexModel.bulkCreate(allDelegations)

    // company delegations
    // need to query the company service for delegations
    // representative delegations
    // ward delegations

    // Lastly update last full reindex to current timestamp and next reindex to 1 week in the future
  }
}
