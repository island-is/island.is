import {
  Body,
  Controller,
  Delete,
  Post,
  HttpCode,
  UseGuards,
  VERSION_NEUTRAL,
} from '@nestjs/common'
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { FormApplicantTypesService } from './formApplicantTypes.service'
import { CreateFormApplicantTypeDto } from './models/dto/createFormApplicantType.dto'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  User,
} from '@island.is/auth-nest-tools'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { ScreenDto } from '../screens/models/dto/screen.dto'
import { DeleteFormApplicantTypeDto } from './models/dto/deleteFormApplicantType.dto'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(AdminPortalScope.formSystem)
@ApiTags('form applicant types')
@Controller({ path: 'formApplicantTypes', version: ['1', VERSION_NEUTRAL] })
export class FormApplicantTypesController {
  constructor(
    private readonly formApplicantTypesService: FormApplicantTypesService,
  ) {}

  @ApiOperation({ summary: 'Add form applicant type' })
  @ApiCreatedResponse({
    description: 'Add form applicant type',
    type: ScreenDto,
  })
  @ApiBody({ type: CreateFormApplicantTypeDto })
  @Post()
  create(
    @CurrentUser() user: User,
    @Body() createFormApplicantTypeDto: CreateFormApplicantTypeDto,
  ): Promise<ScreenDto> {
    return this.formApplicantTypesService.create(
      user,
      createFormApplicantTypeDto,
    )
  }

  @ApiOperation({ summary: 'Delete form applicant' })
  @ApiOkResponse({
    description: 'Delete form applicant',
    type: ScreenDto,
  })
  @ApiBody({ type: DeleteFormApplicantTypeDto })
  @Delete()
  @HttpCode(200)
  async delete(
    @CurrentUser() user: User,
    @Body() deleteFormApplicantTypeDto: DeleteFormApplicantTypeDto,
  ): Promise<ScreenDto> {
    return this.formApplicantTypesService.delete(
      user,
      deleteFormApplicantTypeDto,
    )
  }
}
