import DataLoader from 'dataloader'
import { Injectable, UnauthorizedException } from '@nestjs/common'

import { GraphQLContext, User } from '@island.is/auth-nest-tools'
import { NestDataLoader } from '@island.is/nest/dataloader'

import { UsedFlightLeg } from '../models/usedFlightLeg.model'
import { MemberService } from './member.service'

export type UsedFlightLegsDataLoader = DataLoader<string, UsedFlightLeg[]>

@Injectable()
export class UsedFlightLegsLoader
  implements NestDataLoader<string, UsedFlightLeg[]>
{
  constructor(private readonly memberService: MemberService) {}

  async loadUsedFlightLegs(
    user: User | undefined,
    nationalIds: readonly string[],
  ): Promise<UsedFlightLeg[][]> {
    if (!user) {
      throw new UnauthorizedException()
    }
    const flightLegs = await this.memberService.getUsedFlightLegsByNationalId(
      user,
    )
    return nationalIds.map((nationalId) => flightLegs.get(nationalId) ?? [])
  }

  generateDataLoader(ctx: GraphQLContext): UsedFlightLegsDataLoader {
    return new DataLoader(this.loadUsedFlightLegs.bind(this, ctx.req.user))
  }
}
