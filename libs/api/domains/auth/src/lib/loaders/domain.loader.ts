import DataLoader from 'dataloader'
import { Injectable, UnauthorizedException } from '@nestjs/common'

import { NestDataLoader, GraphQLContext } from '@island.is/nest/dataloader'
import { Domain } from '../models/domain.model'
import { DomainService } from '../services/domain.service'
import { DomainInput } from '../dto/domain.input'
import { User } from '@island.is/auth-nest-tools'

export type DomainDataLoader = DataLoader<DomainInput, Domain | null, string>

@Injectable()
export class DomainLoader
  implements NestDataLoader<DomainInput, Domain | null>
{
  constructor(private readonly domainService: DomainService) {}

  keyFn(input: DomainInput): string {
    return `${input.lang}##${input.domain}`
  }

  async loadDomains(
    user: User | undefined,
    inputs: readonly DomainInput[],
  ): Promise<Array<Domain | null>> {
    if (!user) {
      throw new UnauthorizedException()
    }

    // Only support one language at a time.
    const lang = inputs[0].lang
    const domains = await this.domainService.getDomains(user, {
      lang,
      domainNames: inputs.map((input) => input.domain),
    })
    return inputs.map(
      (input) => domains.find((domain) => domain.name === input.domain) ?? null,
    )
  }

  generateDataLoader(ctx: GraphQLContext): DomainDataLoader {
    return new DataLoader(this.loadDomains.bind(this, ctx.req.user), {
      cacheKeyFn: this.keyFn,
    })
  }
}
