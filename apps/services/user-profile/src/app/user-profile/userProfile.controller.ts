import { InjectQueue } from '@nestjs/bull'
import {
  Body,
  Controller,
  Get,
  Put,
  NotFoundException,
  Param,
  Post, NotImplementedException, Optional
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger'
import { Queue } from 'bull'
import { CreateUserProfileDto } from './dto/createUserProfileDto'
import { UpdateImageDto } from './dto/updateImageDto'
import { UpdateUserProfileDto } from './dto/updateUserProfileDto'
import { UserProfileByNationalIdPipe } from './pipes/userProfileByNationalId.pipe'
import { UserProfile } from './userProfile.model'
import { UserProfileService } from './userProfile.service'

@ApiTags('User Profile')
@Controller()
export class UserProfileController {

  constructor(private userProfileService: UserProfileService,
    @Optional() @InjectQueue('upload') private readonly uploadQueue: Queue) { }

  @Get('userProfile/:nationalId')
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

  @Post('userProfile/')
  @ApiCreatedResponse({ type: UserProfile })
  async create(
    @Body()
    application: CreateUserProfileDto,
  ): Promise<UserProfile> {
    return await this.userProfileService.create(application)
  }

  @Put('userProfile/:nationalId')
  @ApiOkResponse({ type: UserProfile })
  @ApiParam({
    name: 'nationalId',
    type: String,
    required: true,
    description: 'The national id of the user profile to be updated.',
    allowEmptyValue: false,
  })
  async update(
    @Param('nationalId') nationalId: string,
    @Body() userProfileToUpdate: UpdateUserProfileDto,
  ): Promise<UserProfile> {
    const {
      numberOfAffectedRows,
      updatedUserProfile,
    } = await this.userProfileService.update(nationalId, userProfileToUpdate)
    if (numberOfAffectedRows === 0) {
      throw new NotFoundException(`A user profile with national Id ${nationalId} does not exist`)
    }
    return updatedUserProfile
  }

  @Put('userProfile/:nationalId/profileImage')
  @ApiParam({
    name: 'nationalId',
    type: String,
    required: true,
    description: 'The national id of the user profile to update the profile image for.',
    allowEmptyValue: false,
  })
  @ApiOkResponse({ type: UserProfile })
  async addImage(
    @Param('nationalId', UserProfileByNationalIdPipe)
    profile: UserProfile,
    @Body() input: UpdateImageDto,
  ) {

    return await this.uploadQueue.add('upload', {
      profile: profile,
      attachmentUrl: input.url,
    })
  }
}
