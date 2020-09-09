import { Query, Resolver, Args } from '@nestjs/graphql'
import { User } from './models'
@Resolver(() => User)
export class UserResolver {
  @Query(() => User, { nullable: true })
  getUser(@Args('id') id: number): User {
    const U: User = new User()
    U.name = 'Maur'
    U.mobile = '8926309'
    return U
  }
}
