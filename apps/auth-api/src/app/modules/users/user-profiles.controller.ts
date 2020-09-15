import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common'
import { ApiOkResponse, ApiTags, ApiOAuth2, ApiCreatedResponse } from '@nestjs/swagger'
import { UserProfile, UserProfilesService, UserProfileDto } from '@island.is/auth-api'
import { AuthGuard } from '@nestjs/passport'

@ApiOAuth2(['openid:profile']) // add OAuth restriction to this controller
@UseGuards(AuthGuard('jwt'))
@ApiTags('user-profiles')
@Controller('user-profiles')
export class UserProfilesController {
  constructor(
    private readonly userProfilesService: UserProfilesService,
  ) {}

  @Get(':subjectId')
  @ApiOkResponse({ type: UserProfile })
  async findOne(@Param('subjectId') subjectId: string): Promise<UserProfile> {
    const userProfile = await this.userProfilesService.findBySubjectId(
      subjectId,
    )

    if (!userProfile) {
      throw new NotFoundException("This user profile doesn't exist")
    }

    return userProfile
  }

  @Post()
  @ApiCreatedResponse({ type: UserProfile })
  async create(@Body() userProfile: UserProfileDto): Promise<UserProfile> {
    return await this.userProfilesService.create(userProfile)
  }

  @Put(":id")
  @ApiOkResponse({ type: UserProfile }) 
  async update(@Body() userProfile: UserProfileDto, @Param('id') id: string): Promise<UserProfile> {
    return await this.userProfilesService.update(userProfile, id)
  }

  @Delete(":id")
  @ApiOkResponse()
  async delete(@Param('id') id: string): Promise<number> {
    return await this.userProfilesService.delete(id)
  }
  
}

