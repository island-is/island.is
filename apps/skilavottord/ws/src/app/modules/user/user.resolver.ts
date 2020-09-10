import { Query, Resolver, Args } from '@nestjs/graphql'
import { User } from './models'
import { userService } from './models/userService'
@Resolver(() => User)
export class UserResolver {
  userService: userService

  constructor() {
    this.userService = new userService()
  }

  @Query(() => User)
  getUserByNationalId(@Args('nationalId') nid: string): User {
    return this.userService.getUserBynationalId(nid)
  }
}
