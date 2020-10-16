import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Delete,
  Post,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common'
import {
  ApiOkResponse,
  ApiTags,
  ApiOAuth2,
  ApiCreatedResponse,
} from '@nestjs/swagger'
import {
  Grant,
  GrantDto,
  GrantsService,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-api-lib'
import { AuthGuard } from '@nestjs/passport'

@UseGuards(AuthGuard('jwt'), ScopesGuard)
@ApiTags('grants')
@Controller('grants')
export class GrantsController {
  constructor(private readonly grantsService: GrantsService) {}

  @Scopes('@identityserver.api/authentication')
  @Get()
  @ApiOkResponse({ type: Grant })
  async getAll(
    @Query('subjectId') subjectId: string,
    @Query('sessionId') sessionId: string,
    @Query('clientId') clientId: string,
    @Query('type') type: string,
  ): Promise<Grant[]> {
    const grants = await this.grantsService.getAllAsync(
      subjectId,
      sessionId,
      clientId,
      type,
    )

    if (!grants) {
      throw new NotFoundException('Nothing found')
    }

    return grants
  }

  @Scopes('@identityserver.api/authentication')
  @Get(':key')
  @ApiOkResponse({ type: Grant })
  async getAsync(@Param('key') key: string): Promise<Grant> {
    const grant = await this.grantsService.getAsync(key)

    if (!grant) {
      throw new NotFoundException("This particular grant doesn't exist")
    }

    return grant
  }

  @Scopes('@identityserver.api/authentication')
  @Delete()
  @ApiOkResponse()
  async removeAllAsync(
    @Query('subjectId') subjectId: string,
    @Query('sessionId') sessionId?: string,
    @Query('clientId') clientId?: string,
    @Query('type') type?: string,
  ): Promise<number> {
    return await this.grantsService.removeAllAsync(
      subjectId,
      sessionId,
      clientId,
      type,
    )
  }

  @Scopes('@identityserver.api/authentication')
  @Delete(':key')
  @ApiOkResponse()
  async removeAsync(@Param('key') key: string): Promise<number> {
    return await this.grantsService.removeAsync(key)
  }

  @Scopes('@identityserver.api/authentication')
  @Post()
  @ApiCreatedResponse({ type: Grant })
  async create(@Body() grant: GrantDto): Promise<Grant> {
    console.log(grant)
    return await this.grantsService.createAsync(grant)
  }
}
