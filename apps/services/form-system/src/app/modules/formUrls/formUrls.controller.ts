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
import { FormUrlDto } from './models/dto/formUrl.dto'
import { CreateFormUrlDto } from './models/dto/createFormUrl.dto'
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
  @ApiBody({ type: CreateFormUrlDto })
  @Post()
  create(
    @Body()
    createFormUrlDto: CreateFormUrlDto,
  ): Promise<FormUrlDto> {
    return this.formUrlsService.create(createFormUrlDto)
  }

  @ApiOperation({ summary: 'Remove form url' })
  @ApiNoContentResponse({
    description: 'Remove form url',
  })
  @ApiParam({ name: 'id', type: String })
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.formUrlsService.delete(id)
  }
}
