import {
    Body,
    Controller,
    Get,
    NotFoundException,
    Param,
    Post,
  } from '@nestjs/common'
  import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { UserProfile } from './user-profile.model'
import { UserProfilesService } from './user-profiles.service'
  
  @ApiTags('user-profiles')
  @Controller('user-profiles')
  export class UserProfilesController {
    constructor(private readonly userProfilesService: UserProfilesService) {}
  
    @Get(':subjectId')
    @ApiOkResponse({ type: UserProfile })
    async findOne(@Param('subjectId') subjectId: string): Promise<UserProfile> {
      const userProfile = await this.userProfilesService.findBySubjectId(subjectId)
  
      if (!userProfile) {
        throw new NotFoundException("This user profile doesn't exist")
      }
  
      return userProfile
    }
  
  }
  