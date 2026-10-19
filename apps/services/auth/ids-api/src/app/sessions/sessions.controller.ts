import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  VERSION_NEUTRAL,
} from '@nestjs/common'
import { ApiNoContentResponse, ApiTags } from '@nestjs/swagger'

import {
  SessionDto,
  SessionFilter,
  SessionRemoveOptions,
  SessionsService,
} from '@island.is/auth-api-lib'
import { IdsAuthGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'
import { NoContentException } from '@island.is/nest/problem'
import { Documentation } from '@island.is/nest/swagger'

@ApiTags('sessions')
@Controller({
  path: 'sessions',
  version: ['1', VERSION_NEUTRAL],
})
@UseGuards(IdsAuthGuard, ScopesGuard)
@Scopes('@identityserver.api/authentication')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get()
  @Documentation({
    description: 'Retrieves multiple sessions based on the provided filter.',
    response: { status: 200, type: [SessionDto] },
  })
  findMany(@Query() filter: SessionFilter): Promise<SessionDto[]> {
    return this.sessionsService.findMany(filter)
  }

  @Get(':key')
  @Documentation({
    description: 'Retrieves a single session by its key.',
    response: { status: 200, type: SessionDto },
  })
  @ApiNoContentResponse()
  async findOne(@Param('key') key: string): Promise<SessionDto> {
    const result = await this.sessionsService.findOne(key)
    if (result == null) {
      throw new NoContentException()
    }
    return result
  }

  @Post()
  @Documentation({
    description: 'Creates a new session.',
    response: { status: 201, type: SessionDto },
  })
  create(@Body() session: SessionDto): Promise<SessionDto | null> {
    return this.sessionsService.create(session)
  }

  @Put()
  @Documentation({
    description: 'Updates an existing session.',
    response: { status: 200, type: SessionDto },
  })
  update(@Body() session: SessionDto): Promise<SessionDto | null> {
    return this.sessionsService.update(session)
  }

  @Delete(':key')
  @Documentation({
    description: 'Deletes a session by its key.',
    response: { status: 204 },
  })
  delete(@Param('key') key: string): Promise<void> {
    return this.sessionsService.delete(key)
  }

  @Post('delete')
  @Documentation({
    description: 'Deletes multiple sessions based on the provided filter.',
    response: { status: 204 },
  })
  deleteMany(@Body() filter: SessionFilter): Promise<void> {
    return this.sessionsService.deleteMany(filter)
  }

  @Post('delete-expired')
  @Documentation({
    description: 'Retrieves and removes expired sessions.',
    response: { status: 200, type: [SessionDto] },
  })
  getAndRemoveExpired(
    @Body() options: SessionRemoveOptions,
  ): Promise<SessionDto[]> {
    return this.sessionsService.getAndRemoveExpired(options)
  }
}
