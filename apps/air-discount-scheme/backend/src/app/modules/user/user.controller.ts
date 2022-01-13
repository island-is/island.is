import {
  Controller,
  Param,
  Get,
  UseGuards,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiExcludeEndpoint,
} from '@nestjs/swagger'
import { GetUserByDiscountCodeParams, GetUserRelationsParams } from './dto'
import { UserService } from './user.service'
import { AirlineUser, User } from './user.model'
import { DiscountService } from '../discount'
import { FlightService } from '../flight'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { NationalRegistryXRoadService } from '@island.is/api/domains/national-registry-x-road'
import { User as AuthUser } from '@island.is/auth-nest-tools'
import { Person } from '../nationalRegistryV2/person.model'

@ApiTags('Users')
@Controller('api/public')
//@UseGuards(AuthGuard)
//@UseGuards(IdsAuthGuard)
@ApiBearerAuth()
export class PublicUserController {
  constructor(
    private readonly discountService: DiscountService,
    private readonly userService: UserService,
  ) {}

  @Get('discounts/:discountCode/user')
  @ApiOkResponse({ type: AirlineUser })
  async getUserByDiscountCode(
    @Param() params: GetUserByDiscountCodeParams,
  ): Promise<AirlineUser> {
    const discount = await this.discountService.getDiscountByDiscountCode(
      params.discountCode,
    )
    if (!discount) {
      throw new BadRequestException('Discount code is invalid')
    }

    const user = await this.userService.getAirlineUserInfoByNationalId(
      discount.nationalId,
    )
    if (!user) {
      throw new NotFoundException(`User<${discount.nationalId}> not found`)
    }
    return user
  }
}
@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes('@vegagerdin.is/air-discount-scheme-scope')
@Controller('api/private')
export class PrivateUserController {
  constructor(
    private readonly flightService: FlightService,
    private readonly userService: UserService,
    private thjodskraXroad: NationalRegistryXRoadService,
  ) {}

  @Get('users/:nationalId/relations')
  @ApiExcludeEndpoint()
  async getUserRelations(
    @Param() params: GetUserRelationsParams,
    @CurrentUser() user: AuthUser,
  ): Promise<User[]> {
    console.log('parent')
    console.log(user.nationalId)
    const person = await this.thjodskraXroad.getNationalRegistryPerson(
      user,
      user.nationalId,
    )

    console.log(person)
    const relations = await this.thjodskraXroad.getChildrenCustodyInformation(
      user,
      user.nationalId,
    )
    console.log('children')
    console.log(relations)
    console.log('child 0')
    console.log(relations[0])
    console.log('')
    // const relations = await this.userService.getRelations(params.nationalId)
    // const users = await Promise.all([
    //   this.userService.getUserInfoByNationalId(params.nationalId),
    //   ...relations.map((nationalId) =>
    //     this.userService.getUserInfoByNationalId(nationalId),
    //   ),
    // ])
    // const users = await Promise.all([
    //   this.thjodskraXroad.getNationalRegistryPerson(user, user.nationalId),
    //   ...relations.map((nationalId) =>
    //     this.thjodskraXroad.getNationalRegistryPerson({scope: user.scope, authorization: user.authorization, client: user.client} as AuthUser, nationalId as any)
    //     )
    // ])
    // return users.filter((user) => user) as Person[]
    return {} as User[]
  }
}
