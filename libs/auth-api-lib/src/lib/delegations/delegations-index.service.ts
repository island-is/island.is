import { Injectable } from '@nestjs/common'
import { DelegationsIncomingCustomService } from './delegations-incoming-custom.service'
import { User } from '@island.is/auth-nest-tools'
import { DelegationIndex } from './models/delegation-index.model'
import { InjectModel } from '@nestjs/sequelize'
import { DelegationIndexMeta } from './models/delegation-index-meta.model'
import { DelegationDTO, DelegationProvider } from './dto/delegation.dto'
import { PersonalRepresentativeService } from '../personal-representative/services/personalRepresentative.service'
import { DelegationType } from './types/delegationType'
import { DelegationsIncomingRepresentativeService } from './delegations-incoming-representative.service'
import { IncomingDelegationsCompanyService } from './delegations-incoming-company.service'
import { DelegationsIncomingWardService } from './delegations-incoming-ward.service'

const TEN_MINUTES = 1000 * 60 * 10
const ONE_WEEK = 1000 * 60 * 60 * 24 * 7

export type DelegationIndexInfo = Pick<
  DelegationIndex,
  'toNationalId' | 'fromNationalId' | 'provider' | 'type' | 'validTo'
>

const toDelegationIndexInfo = (
  delegation: DelegationDTO,
): DelegationIndexInfo => ({
  fromNationalId: delegation.fromNationalId,
  toNationalId: delegation.toNationalId,
  type: delegation.type,
  provider: delegation.provider,
})

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
    private delegationsIncomingRepresentativeService: DelegationsIncomingRepresentativeService,
    private delegationsIncomingCompanyService: IncomingDelegationsCompanyService,
    private delegationsIncomingWardService: DelegationsIncomingWardService,
  ) {}

  async indexDelegations(user: User) {
    const now = new Date().getTime()

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
    await this.delegationIndexMetaModel.upsert({
      nationalId: user.nationalId,
      nextReindex: new Date(now + TEN_MINUTES),
    })

    const delegationRes = await Promise.all([
      this.delegationsIncomingCustomService.findAllValidIncoming(user),
      this.delegationsIncomingRepresentativeService.findAllIncoming(user),
      this.delegationsIncomingCompanyService.findAllIncoming(user),
      this.delegationsIncomingWardService.findAllIncoming(user),
    ])

    // delete all existing delegations
    await this.deleteDelegationIndexItems(user.nationalId)

    const delegations = delegationRes.flat().map(toDelegationIndexInfo)

    await this.delegationIndexModel.bulkCreate(delegations)

    // set next reindex to one week in the future
    await this.delegationIndexMetaModel.update(
      {
        nextReindex: new Date(now + ONE_WEEK),
        lastFullReindex: new Date(),
      },
      {
        where: {
          nationalId: user.nationalId,
        },
      },
    )
  }

  /*
   * Private methods
   * */
  private deleteDelegationIndexItems(
    nationalId: string,
    delegationTypesToDelete: DelegationType[] = [
      DelegationType.Custom,
      DelegationType.LegalGuardian,
      DelegationType.ProcurationHolder,
      DelegationType.PersonalRepresentative,
    ],
  ) {
    return Promise.all(
      delegationTypesToDelete.map((type) =>
        this.delegationIndexModel.destroy({
          where: {
            toNationalId: nationalId,
            type,
          },
        }),
      ),
    )
  }
}
