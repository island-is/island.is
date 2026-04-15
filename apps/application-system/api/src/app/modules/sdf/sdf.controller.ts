import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  ParseUUIDPipe,
  UseGuards,
  BadRequestException,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger'
import {
  IdsUserGuard,
  ScopesGuard,
  Scopes,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { ApplicationScope } from '@island.is/auth/scopes'
import type { Locale } from '@island.is/shared/types'

import { AstAdapterService } from './ast-adapter.service'
import { ExecuteActionDto, SdfActionType } from './dto/action.dto'
import { ScreenDto, ValidateResponseDto } from './dto/screen.dto'

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('sdf')
@ApiBearerAuth()
@Controller('sdf')
export class SdfController {
  constructor(private readonly astAdapter: AstAdapterService) {}

  @Scopes(ApplicationScope.read)
  @Get(':applicationId/screen')
  @ApiParam({ name: 'applicationId', type: String })
  @ApiQuery({ name: 'step', required: false, type: Number, description: 'Optional override for deep-linking. Omit to use the persisted page index.' })
  @ApiQuery({ name: 'locale', required: false, type: String })
  @ApiOkResponse({ type: ScreenDto })
  async getScreen(
    @Param('applicationId', new ParseUUIDPipe()) applicationId: string,
    @Query('step') step?: string,
    @Query('locale') locale?: string,
    @CurrentUser() user?: User,
  ): Promise<ScreenDto> {
    const pageIndexOverride = step !== undefined ? parseInt(step, 10) : undefined
    return this.astAdapter.getScreen(
      applicationId,
      pageIndexOverride,
      (locale ?? 'is') as Locale,
      user!,
    )
  }

  @Scopes(ApplicationScope.write)
  @Post(':applicationId/action')
  @ApiParam({ name: 'applicationId', type: String })
  @ApiOkResponse({ type: ScreenDto })
  async executeAction(
    @Param('applicationId', new ParseUUIDPipe()) applicationId: string,
    @Body() dto: ExecuteActionDto,
    @CurrentUser() user?: User,
  ): Promise<ScreenDto | ValidateResponseDto> {
    const locale = (dto.locale ?? 'is') as Locale

    switch (dto.actionType) {
      case SdfActionType.VALIDATE:
        if (!dto.fieldIds || dto.fieldIds.length === 0) {
          throw new BadRequestException(
            'fieldIds is required for VALIDATE action',
          )
        }
        return this.astAdapter.validateFields(
          applicationId,
          dto.answers ?? {},
          dto.fieldIds,
          locale,
          user!,
        )

      case SdfActionType.NEXT_PAGE:
        return this.astAdapter.persistAnswersAndAdvance(
          applicationId,
          dto.answers ?? {},
          locale,
          user!,
        )

      case SdfActionType.PREV_PAGE:
        return this.astAdapter.goToPreviousPage(
          applicationId,
          locale,
          user!,
        )

      case SdfActionType.REFETCH:
        return this.astAdapter.getScreen(
          applicationId,
          undefined,
          locale,
          user!,
          { ephemeral: true },
        )

      case SdfActionType.SUBMIT:
        return this.astAdapter.handleSubmit(
          applicationId,
          dto.event ?? 'SUBMIT',
          dto.answers,
          locale,
          user!,
        )

      default:
        throw new BadRequestException(
          `Unknown actionType: ${dto.actionType}`,
        )
    }
  }
}
