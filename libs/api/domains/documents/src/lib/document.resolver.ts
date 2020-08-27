import { Args, Query, Resolver, Mutation } from '@nestjs/graphql'

@Resolver()
export class DocumentResolver {
  @Query(() => String, { nullable: true })
  getDocument(): string {
    return 'Document Api'
  }
}
