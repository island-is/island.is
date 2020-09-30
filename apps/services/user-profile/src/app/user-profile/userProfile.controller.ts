import {
  Body,
  Controller,
  UseInterceptors,
  Get,
  Put,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger'
import { CreateUserProfileDto } from './dto/createUserProfileDto'
import { UpdateUserProfileDto } from './dto/updateUserProfileDto'
import { UserProfile } from './userProfile.model'
import { UserProfileService } from './userProfile.service'

@Controller('UserProfile')
@Controller('user-profile')
export class UserProfileController {
  constructor(private userProfileService: UserProfileService) {}

  @Get(':id')
  @ApiOkResponse({ type: UserProfile })
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<UserProfile> {
    const profile = await this.userProfileService.findById(id)

    if (!profile) {
      throw new NotFoundException(
        `A User profile with the id ${id} does not exist`,
      )
    }

    return profile
  }

  @Get(':nationalId')
  @ApiOkResponse({ type: UserProfile })
  async findOneByNationalId(
    @Param('nationalId') nationalId: string,
  ): Promise<UserProfile> {
    const profile = await this.userProfileService.findByNationalId(nationalId)

    if (!profile) {
      throw new NotFoundException(
        `A User profile with the id ${nationalId} does not exist`,
      )
    }

    return profile
  }

  @Post()
  @ApiCreatedResponse({ type: UserProfile })
  async create(
    @Body()
    application: CreateUserProfileDto,
  ): Promise<UserProfile> {
    return await this.userProfileService.create(application)
  }

  @Put('userProfile/:id')
  @ApiOkResponse({ type: UserProfile })
  async update(
    @Param('id') id: string,
    @Body() userProfileToUpdate: UpdateUserProfileDto,
  ): Promise<UserProfile> {
    const {
      numberOfAffectedRows,
      updatedUserProfile,
    } = await this.userProfileService.update(id, userProfileToUpdate)
    if (numberOfAffectedRows === 0) {
      throw new NotFoundException(`A user profile with ${id} does not exist`)
    }
    return updatedUserProfile
  }
}
