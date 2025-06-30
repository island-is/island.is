import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
  VERSION_NEUTRAL,
} from '@nestjs/common'
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
import { FormUrlsService } from './formUrls.services'
import { FormUrlDto } from '../../../../../../../libs/form-system/src/dto/formUrl.dto'
import { IdsUserGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'
import { AdminPortalScope } from '@island.is/auth/scopes'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(AdminPortalScope.formSystem)
@ApiTags('form urls')
@Controller({
  path: 'formUrls',
  version: ['1', VERSION_NEUTRAL],
})
export class FormUrlsController {
  constructor(private formUrlsService: FormUrlsService) {}

  @ApiOperation({ summary: 'Add form url' })
  @ApiCreatedResponse({
    description: 'Add form url',
    type: FormUrlDto,
  })
  @ApiBody({ type: FormUrlDto })
  @Post()
  create(
    @Body()
    createFormUrlDto: FormUrlDto,
  ): Promise<FormUrlDto> {
    return this.formUrlsService.create(createFormUrlDto)
  }

  @ApiOperation({ summary: 'Remove form url' })
  @ApiNoContentResponse({
    description: 'Remove form url',
  })
  @ApiBody({ type: FormUrlDto })
  @Delete()
  async delete(
    @Body()
    deleteFormUrlDto: FormUrlDto,
  ): Promise<void> {
    return this.formUrlsService.delete(deleteFormUrlDto)
  }
}
