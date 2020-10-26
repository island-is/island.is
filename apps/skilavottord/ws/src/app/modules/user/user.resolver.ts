import { Query, Resolver, Args, ResolveField } from '@nestjs/graphql'
import { User } from './models'
import { UserService } from './models/user.service'
import { Authorize, AuthService, CurrentUser, AuthUser } from '../auth'
console.log(' --- user.resolver starting')
@Resolver(() => User)
export class UserResolver {
  userService: UserService
  constructor(private authService: AuthService) {}
  @Authorize({ throwOnUnAuthorized: false })
  @ResolveField('role')
  resolveRole(@CurrentUser() user: AuthUser): string {
    return this.authService.getRole(user)
  }
  //  @Authorize({ throwOnUnAuthorized: false })
  //query b {getUserByNationalId(nationalId: "2222222222"){name, mobile}}
  @Query(() => User)
  getUserByNationalId(@Args('nationalId') nid: string): User {
    return this.userService.getUserBynationalId(nid)
  }
}
