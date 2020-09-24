import { Query, Resolver, Args } from '@nestjs/graphql'
import { User } from './models'
import { UserService } from './models/user.service'
@Resolver(() => User)
export class UserResolver {
  userService: UserService

  constructor() {
    this.userService = new UserService()
  }

  //query b {getUserByNationalId(nationalId: "2222222222"){name, mobile}}
  @Query(() => User)
  getUserByNationalId(@Args('nationalId') nid: string): User {
    return this.userService.getUserBynationalId(nid)
  }
}
