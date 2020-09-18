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
import { Grant, GrantDto, GrantsService } from '@island.is/auth-api'
import { AuthGuard } from '@nestjs/passport'

@ApiOAuth2(['openid:profile']) // add OAuth restriction to this controller
@UseGuards(AuthGuard('jwt'))
@ApiTags('grants')
@Controller('grants')
export class GrantsController {
  constructor(private readonly grantsService: GrantsService) {}

  @Get()
  @ApiOkResponse({ type: Grant })
  async getAll(@Query('subjectId') subjectId: string, @Query('sessionId') sessionId: string,
  @Query('clientId') clientId: string, @Query('type') type: string): Promise<Grant[]> {
    const grants = await this.grantsService.getAllAsync(subjectId, sessionId, clientId, type)

    if (!grants) {
      throw new NotFoundException('Nothing found')
    }

    return grants
  }

  @Get(':key')
  @ApiOkResponse({ type: Grant })
  async getAsync(@Param('key') key: string): Promise<Grant> {
    const grant = await this.grantsService.getAsync(key)

    if (!grant) {
      throw new NotFoundException("This particular grant doesn't exist")
    }

    return grant
  }

  @Delete()
  @ApiOkResponse()
  async removeAllAsync(@Query('subjectId') subjectId: string, @Query('sessionId') sessionId: string,
  @Query('clientId') clientId: string, @Query('type') type: string): Promise<number> {
    return await this.grantsService.removeAllAsync(subjectId, sessionId, clientId, type)
  }

  @Delete(':key')
  @ApiOkResponse()
  async removeAsync(@Param('key') key: string): Promise<number> {
    return await this.grantsService.removeAsync(key)
  }

  @Post()
  @ApiCreatedResponse({ type: Grant })
  async create(@Body() grant: GrantDto): Promise<Grant> {
    console.log(grant)
    return await this.grantsService.createAsync(grant)
  }
}
