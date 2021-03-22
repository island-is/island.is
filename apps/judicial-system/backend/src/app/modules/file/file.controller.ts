import {
  Body,
  Controller,
  ForbiddenException,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger'

import {
  CurrentHttpUser,
  JwtAuthGuard,
  RolesGuard,
  RolesRule,
  RolesRules,
} from '@island.is/judicial-system/auth'
import { User, UserRole } from '@island.is/judicial-system/types'

import { Case, CaseService, isCaseBlockedFromUser } from '../case'
import { CreatePresignedPostDto } from './dto'
import { PresignedPost } from './models'
import { FileService } from './file.service'

// Allows prosecutors to perform any action
const prosecutorRule = UserRole.PROSECUTOR as RolesRule

@UseGuards(JwtAuthGuard, RolesGuard)
@RolesRules(prosecutorRule)
@Controller('api/case/:id')
@ApiTags('files')
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private readonly caseService: CaseService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesRules(prosecutorRule)
  @Post('file/url')
  @ApiCreatedResponse({
    type: PresignedPost,
    description: 'Creates a new presigned post',
  })
  async createPresignedPost(
    @Param('id') id: string,
    @CurrentHttpUser() user: User,
    @Body() createPresignedPost: CreatePresignedPostDto,
  ): Promise<PresignedPost> {
    const existingCase = await this.caseService.findByIdAndUser(id, user)

    return this.fileService.createPresignedPost(
      existingCase.id,
      createPresignedPost,
    )
  }
}
