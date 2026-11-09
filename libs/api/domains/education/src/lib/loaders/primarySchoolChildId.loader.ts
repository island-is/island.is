import DataLoader from 'dataloader'
import { Injectable, UnauthorizedException } from '@nestjs/common'

import type { User } from '@island.is/auth-nest-tools'
import { FriggKeyInfoClientService } from '@island.is/clients/mms/frigg'
import { GraphQLContext, NestDataLoader } from '@island.is/nest/dataloader'

export type PrimarySchoolChildIdDataLoader = DataLoader<string, string | null>

/**
 * National id → frigg child id, resolved from a single `listChildren` call per
 * request. The key-info field resolvers each need the child id, so without this
 * one overview load would ask frigg for the guardian's children once per field.
 * DataLoader is instantiated per request, so the call is also cached for the
 * rest of that request.
 */
@Injectable()
export class PrimarySchoolChildIdLoader
  implements NestDataLoader<string, string | null>
{
  constructor(private readonly keyInfoClient: FriggKeyInfoClientService) {}

  async loadChildIds(
    user: User | undefined,
    nationalIds: readonly string[],
  ): Promise<Array<string | null>> {
    if (!user) {
      throw new UnauthorizedException()
    }

    const children = await this.keyInfoClient.getChildren(user)
    return nationalIds.map(
      (nationalId) =>
        children.find((child) => child.nationalId === nationalId)?.id ?? null,
    )
  }

  generateDataLoader(ctx: GraphQLContext): PrimarySchoolChildIdDataLoader {
    return new DataLoader(this.loadChildIds.bind(this, ctx.req.user))
  }
}
