import DataLoader from 'dataloader'
import { Injectable, UnauthorizedException } from '@nestjs/common'

import type { User } from '@island.is/auth-nest-tools'
import { FriggKeyInfoClientService } from '@island.is/clients/mms/frigg'
import { GraphQLContext, NestDataLoader } from '@island.is/nest/dataloader'

export type PrimarySchoolChildIdDataLoader = DataLoader<string, string | null>

/**
 * Whether frigg knows a child, resolved from a single `listChildren` call per
 * request: the student id back when frigg has the child, null when it does not.
 *
 * Frigg keys children on the same id the primary-school screens route on
 * (`base.users.id`, the id the data gateway returns — contract v0.3 §4.3,
 * confirmed against dev), so this is an existence check rather than a
 * translation. It is still a call worth making: without it `hasKeyInfo` cannot
 * be answered, and each section resolver would ask frigg for a child it does
 * not have and get a 404 instead of returning "no information".
 *
 * DataLoader is instantiated per request, so the saving is per request too: a
 * client that splits the key-info fields across several requests pays for a
 * `listChildren` call in each. My-pages therefore reads all three sections in
 * one query (see PrimarySchoolKeyInfo.graphql); it posts with a plain
 * HttpLink, so separate queries would be separate requests.
 */
@Injectable()
export class PrimarySchoolChildIdLoader
  implements NestDataLoader<string, string | null>
{
  constructor(private readonly keyInfoClient: FriggKeyInfoClientService) {}

  async loadChildIds(
    user: User | undefined,
    studentIds: readonly string[],
  ): Promise<Array<string | null>> {
    if (!user) {
      throw new UnauthorizedException()
    }

    const children = await this.keyInfoClient.getChildren(user)
    return studentIds.map(
      (studentId) =>
        children.find((child) => child.id === studentId)?.id ?? null,
    )
  }

  generateDataLoader(ctx: GraphQLContext): PrimarySchoolChildIdDataLoader {
    return new DataLoader(this.loadChildIds.bind(this, ctx.req.user))
  }
}
