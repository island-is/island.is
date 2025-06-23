import DataLoader from 'dataloader'
import { Injectable, UnauthorizedException } from '@nestjs/common'

import { NestDataLoader, GraphQLContext } from '@island.is/nest/dataloader'
import { User } from '@island.is/auth-nest-tools'
import { EmailsDto } from '@island.is/clients/user-profile'
import { UserEmailsService } from './userEmails.service'

export type EmailsDataLoader = DataLoader<string, EmailsDto[]>

@Injectable()
export class EmailsLoader implements NestDataLoader<string, EmailsDto[]> {
  constructor(private readonly userEmailService: UserEmailsService) {}

  async loadEmails(
    keys: readonly string[],
    user: User | undefined,
  ): Promise<EmailsDto[][]> {
    if (!user) {
      throw new UnauthorizedException()
    }

    const emails = await this.userEmailService.getEmails(user)

    return keys.map(() => emails)
  }

  generateDataLoader(ctx: GraphQLContext): DataLoader<string, EmailsDto[]> {
    return new DataLoader((keys) => this.loadEmails(keys, ctx.req.user))
  }
}
