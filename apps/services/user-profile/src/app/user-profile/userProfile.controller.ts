<<<<<<< HEAD
import { InjectQueue } from '@nestjs/bull'
=======
>>>>>>> d0b8e1dc0733438593aa212862cc485c1c7c189e
import {
  Body,
  Controller,
  Get,
  Put,
  NotFoundException,
  Param,
  Post,
<<<<<<< HEAD
  ConflictException,
  Optional,
=======
  NotImplementedException,
  ConflictException,
>>>>>>> d0b8e1dc0733438593aa212862cc485c1c7c189e
} from '@nestjs/common'
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
<<<<<<< HEAD
import { Queue } from 'bull'
=======
>>>>>>> d0b8e1dc0733438593aa212862cc485c1c7c189e
import { CreateUserProfileDto } from './dto/createUserProfileDto'
import { UpdateImageDto } from './dto/updateImageDto'
import { UpdateUserProfileDto } from './dto/updateUserProfileDto'
import { UserProfileByNationalIdPipe } from './pipes/userProfileByNationalId.pipe'
import { UserProfile } from './userProfile.model'
import { UserProfileService } from './userProfile.service'

@ApiTags('User Profile')
@Controller()
export class UserProfileController {
<<<<<<< HEAD
  constructor(private userProfileService: UserProfileService,
    @Optional() @InjectQueue('upload') private readonly uploadQueue: Queue,) { }
=======
  constructor(private userProfileService: UserProfileService) {}
>>>>>>> d0b8e1dc0733438593aa212862cc485c1c7c189e

  @Get('userProfile/:nationalId')
  @ApiParam({
    name: 'nationalId',
    type: String,
    required: true,
    description: 'The nationalId of the application to update.',
    allowEmptyValue: false,
  })
  @ApiOkResponse({ type: UserProfile })
  async findOneByNationalId(
    @Param('nationalId', UserProfileByNationalIdPipe) profile: UserProfile,
  ): Promise<UserProfile> {
    return profile
  }

  @Post('userProfile/')
  @ApiCreatedResponse({ type: UserProfile })
  async create(
    @Body()
    userProfileDto: CreateUserProfileDto,
  ): Promise<UserProfile> {
    if (
      await this.userProfileService.findByNationalId(userProfileDto.nationalId)
    ) {
      throw new ConflictException(
        `A profile with nationalId - "${userProfileDto.nationalId}" already exists`,
      )
    }
    return await this.userProfileService.create(userProfileDto)
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
      throw new NotFoundException(
        `A user profile with nationalId ${nationalId} does not exist`,
      )
    }
    return updatedUserProfile
  }

  @Put('userProfile/:nationalId/profileImage')
  @ApiParam({
    name: 'nationalId',
    type: String,
    required: true,
    description: 'The national id of the user profile to upload.',
    allowEmptyValue: false,
  })
  @ApiOkResponse({ type: UserProfile })
  async addImage(
    @Param('nationalId', UserProfileByNationalIdPipe)
    profile: UserProfile,
    @Body() input: UpdateImageDto,
  ) {
<<<<<<< HEAD

    const job = await this.uploadQueue.add('upload', {
      profile: profile,
      attachmentUrl: input.url,
    })

    return job.data.profile.dataValues
=======
    throw new NotImplementedException()
>>>>>>> d0b8e1dc0733438593aa212862cc485c1c7c189e
  }
}
