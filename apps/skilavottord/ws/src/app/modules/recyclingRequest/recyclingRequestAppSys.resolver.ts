import {
  Inject,
  NotFoundException,
  UseGuards,
  forwardRef,
} from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { IdsUserGuard, ScopesGuard } from '@island.is/auth-nest-tools'
import { CurrentUser, Role, User } from '../auth'
import { SamgongustofaService } from '../samgongustofa'
import { CreateRecyclingRequestInput } from './dto/createRecyclingRequest.input'
import {
  RecyclingRequestModel,
  RecyclingRequestResponse,
} from './recyclingRequest.model'
import { RecyclingRequestService } from './recyclingRequest.service'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver(() => RecyclingRequestModel)
export class RecyclingRequestAppSysResolver {
  constructor(
    private recyclingRequestService: RecyclingRequestService,
    @Inject(forwardRef(() => SamgongustofaService))
    private samgongustofaService: SamgongustofaService,
  ) {}

  @Mutation(() => RecyclingRequestResponse)
  async createSkilavottordRecyclingRequestAppSys(
    @CurrentUser() user: User,
    @Args('input') input: CreateRecyclingRequestInput,
  ): Promise<typeof RecyclingRequestResponse> {
    if (
      input.requestType === 'pendingRecycle' ||
      input.requestType === 'cancelled'
    ) {
      const vehicle = await this.samgongustofaService.getUserVehicle(
        user.nationalId,
        input.permno,
      )
      // Check if user owns the vehicle
      if (!vehicle) {
        throw new NotFoundException(
          `User doesn't have right to deregistered the vehicle`,
        )
      }
    }
    const hasPermission = [
      Role.developer,
      Role.recyclingCompany,
      Role.recyclingCompanyAdmin,
    ].includes(user.role)
    if (input.requestType === 'deregistered' && !hasPermission) {
      throw new NotFoundException(
        `User doesn't have right to deregistered the vehicle`,
      )
    }
    return this.recyclingRequestService.createRecyclingRequest(
      user,
      input.requestType,
      input.permno,
    )
  }
}
