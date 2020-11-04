import {
  Grant,
  GrantDto,
  GrantsService,
  IdsAuthGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-api-lib'
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

@UseGuards(IdsAuthGuard, ScopesGuard)
@ApiTags('grants')
@Controller('grants')
export class GrantsController {
  constructor(private readonly grantsService: GrantsService) {}

  /** Gets grants by provided parameters */
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

  /** Gets a grant by it's key */
  @Scopes('@identityserver.api/authentication')
  @Get(':key')
  @ApiOkResponse({ type: Grant })
  async getAsync(@Param('key') key: string): Promise<Grant> {
    if (!key) {
      throw new BadRequestException('Key needs to be provided')
    }

    const grant = await this.grantsService.getAsync(key)

    if (!grant) {
      throw new NotFoundException("This particular grant doesn't exist")
    }

    return grant
  }

  /** Removes a grant by subjectId and other properties if provided */
  @Scopes('@identityserver.api/authentication')
  @Delete()
  @ApiOkResponse()
  async removeAllAsync(
    @Query('subjectId') subjectId: string,
    @Query('sessionId') sessionId?: string,
    @Query('clientId') clientId?: string,
    @Query('type') type?: string,
  ): Promise<number> {
    if (!subjectId) {
      throw new BadRequestException('SubjectId can not be empty')
    }

    return await this.grantsService.removeAllAsync(
      subjectId,
      sessionId,
      clientId,
      type,
    )
  }

  /** Removes a grant by it's key */
  @Scopes('@identityserver.api/authentication')
  @Delete(':key')
  @ApiOkResponse()
  async removeAsync(@Param('key') key: string): Promise<number> {
    if (!key) {
      throw new BadRequestException('Key needs to be provided')
    }

    return await this.grantsService.removeAsync(key)
  }

  /** Creates a grant */
  @Scopes('@identityserver.api/authentication')
  @Post()
  @ApiCreatedResponse({ type: Grant })
  async create(@Body() grant: GrantDto): Promise<Grant> {
    return await this.grantsService.createAsync(grant)
  }
}
