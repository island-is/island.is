import { Query, Resolver, ResolveField, Parent, Args } from '@nestjs/graphql'

import { User as TUser } from '@island.is/air-discount-scheme/types'
//import { Authorize, CurrentUser, AuthService, AuthUser } from '../auth'
import { User } from './models'
import { string } from 'yargs'

@Resolver(() => User)
export class UserResolver {
  constructor() {}

//  @Query(() => String)
//  Geiri( id: string): string {
 //   if (!user) {
 //     return null
 //   }

 //   return 'Gáfulegt' // as User
//  }
  


//  @Authorize({ throwOnUnAuthorized: false })
  @Query(() => User, { nullable: true })
  getUser( @Args('id') id: number): User {
 //   if (!user) {
 //     return null
 //   }
 let U:User = new User()
 U.name = "Maur"
 U.mobile ="8926309"

    return U // as User
  }

 // @Authorize({ throwOnUnAuthorized: false })
  @ResolveField('role')
  resolveRole( user: User): string {
    return 'Gaur'//this.authService.getRole(user)
  }

 // @ResolveField('meetsADSRequirements')
 // resolveMeetsADSRequirements(@Parent() user: TUser): boolean {
 //   if (user.fund) {
 //     return user.fund.credit === user.fund.total - user.fund.used
 //   }

 //   return false
 // }
}
