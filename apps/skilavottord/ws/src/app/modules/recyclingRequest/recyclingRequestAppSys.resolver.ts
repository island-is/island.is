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
import { AccessControlService } from '../accessControl'
import { logger } from '@island.is/logging'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver(() => RecyclingRequestModel)
export class RecyclingRequestAppSysResolver {
  constructor(
    private recyclingRequestService: RecyclingRequestService,
    @Inject(forwardRef(() => SamgongustofaService))
    private samgongustofaService: SamgongustofaService,
    @Inject(forwardRef(() => AccessControlService))
    private accessControlService: AccessControlService,
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
        logger.error(
          `User ${user.nationalId} does not have the right to deregistered the vehicle`,
          { permno: input.permno, user },
        )

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

    // Check in the accesss control if the user is a registered user and get his partnerId
    const userDto = await this.accessControlService.findOne(user.nationalId)
    if (userDto) {
      logger.debug(`User ${userDto.name} found in the accessControl`, {
        partnerId: userDto.partnerId,
        userDto,
      })
      user.partnerId = userDto.partnerId
    }

    user.name = input.fullName

    return this.recyclingRequestService.createRecyclingRequest(
      user,
      input.requestType,
      input.permno,
    )
  }
}
