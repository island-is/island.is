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
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiOperation,
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

import { SdfScreenService } from './sdf-screen.service'
import { ExecuteActionDto, SdfActionType } from './dto/action.dto'
import { ScreenDto, ValidateResponseDto } from './dto/screen.dto'
import { createSdfProblem, SdfProblemDetailsDto } from './problem-details'
import { DelegationGuard } from '../application/guards/delegation.guard'

@UseGuards(IdsUserGuard, ScopesGuard, DelegationGuard)
@ApiTags('sdf')
@ApiBearerAuth()
@Controller('sdf')
export class SdfController {
  constructor(private readonly sdfScreenService: SdfScreenService) {}

  @Scopes(ApplicationScope.read)
  @Get(':applicationId/screen')
  @ApiOperation({
    summary: 'Get an SDF screen',
    description:
      'Compiles the current application state and form AST into a server-driven screen payload.',
  })
  @ApiParam({ name: 'applicationId', type: String })
  @ApiQuery({
    name: 'step',
    required: false,
    type: Number,
    description:
      'Optional override for deep-linking. Omit to use the persisted page index.',
  })
  @ApiQuery({ name: 'locale', required: false, type: String })
  @ApiOkResponse({ type: ScreenDto })
  @ApiBadRequestResponse({
    description: 'Invalid screen request.',
    type: SdfProblemDetailsDto,
  })
  async getScreen(
    @Param('applicationId', new ParseUUIDPipe()) applicationId: string,
    @Query('step') step?: string,
    @Query('locale') locale?: string,
    @CurrentUser() user?: User,
  ): Promise<ScreenDto> {
    let pageIndexOverride: number | undefined
    if (step !== undefined) {
      const n = parseInt(step, 10)
      if (!Number.isFinite(n) || n < 0) {
        throw new BadRequestException(
          createSdfProblem({
            type: 'https://island.is/problems/application-system/sdf/bad-request',
            title: 'Bad request',
            status: 400,
            detail: 'step must be a non-negative integer',
            instance: `/sdf/${applicationId}/screen`,
          }),
        )
      }
      pageIndexOverride = n
    }
    return this.sdfScreenService.getScreen(
      applicationId,
      pageIndexOverride,
      (locale ?? 'is') as Locale,
      user!,
    )
  }

  @Scopes(ApplicationScope.write)
  @Post(':applicationId/action')
  @ApiOperation({
    summary: 'Execute an SDF action',
    description:
      'Executes navigation, validation, submit, or side-effect-free refetch actions for an SDF application.',
  })
  @ApiParam({ name: 'applicationId', type: String })
  @ApiOkResponse({ type: ScreenDto })
  @ApiBadRequestResponse({
    description: 'Invalid action request.',
    type: SdfProblemDetailsDto,
  })
  @ApiConflictResponse({
    description: 'The client page index is stale for a write action.',
    type: SdfProblemDetailsDto,
  })
  async executeAction(
    @Param('applicationId', new ParseUUIDPipe()) applicationId: string,
    @Body() dto: ExecuteActionDto,
    @CurrentUser() user?: User,
  ): Promise<ScreenDto | ValidateResponseDto> {
    const locale = (dto.locale ?? 'is') as Locale

    switch (dto.actionType) {
      case SdfActionType.VALIDATE:
        // fieldIds may be empty when the caller only wants recomputed
        // displayValues (no error surface). In that case validation is skipped
        // and only the displayValues map is returned. See plan §2d.
        return this.sdfScreenService.validateFields(
          applicationId,
          dto.answers ?? {},
          dto.fieldIds ?? [],
          locale,
          user!,
          dto.lastKnownPageIndex,
        )

      case SdfActionType.NEXT_PAGE:
        return this.sdfScreenService.persistAnswersAndAdvance(
          applicationId,
          dto.answers ?? {},
          locale,
          user!,
          dto.lastKnownPageIndex,
        )

      case SdfActionType.PREV_PAGE:
        return this.sdfScreenService.goToPreviousPage(
          applicationId,
          locale,
          user!,
        )

      case SdfActionType.GO_TO_PAGE:
        // The destination page id rides on `event` (see SdfActionType).
        return this.sdfScreenService.goToPage(
          applicationId,
          dto.event ?? '',
          locale,
          user!,
        )

      case SdfActionType.REFETCH:
        return this.sdfScreenService.handleRefetch(
          applicationId,
          dto.answers,
          dto.refetchTemplateApiActions,
          locale,
          user!,
        )

      case SdfActionType.SUBMIT:
        return this.sdfScreenService.handleSubmit(
          applicationId,
          dto.event ?? 'SUBMIT',
          dto.answers,
          locale,
          user!,
        )

      default:
        throw new BadRequestException(
          createSdfProblem({
            type: 'https://island.is/problems/application-system/sdf/unknown-action',
            title: 'Unknown action type',
            status: 400,
            detail: `Unknown actionType: ${dto.actionType}`,
            instance: `/sdf/${applicationId}/action`,
          }),
        )
    }
  }
}
