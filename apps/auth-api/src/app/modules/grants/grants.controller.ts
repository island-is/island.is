import { GrantsService } from './grants.service'
import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Delete,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common'
import {
  ApiOkResponse,
  ApiTags,
  ApiOAuth2,
  ApiCreatedResponse,
} from '@nestjs/swagger'
import { Grant } from './grants.model'
import { AuthGuard } from '@nestjs/passport'
import { GrantDTO } from './dto/grant-dto'

@ApiOAuth2(['openid:profile']) // add OAuth restriction to this controller
@UseGuards(AuthGuard('jwt'))
@ApiTags('grants')
@Controller('grants')
export class GrantsController {
  constructor(private readonly grantsService: GrantsService) {}

  @Get(':subjectId')
  @ApiOkResponse({ type: Grant })
  async getAll(@Param('subjectId') subjectId: string): Promise<Grant[]> {
    const grants = await this.grantsService.getAllAsync(subjectId)

    if (!grants) {
      throw new NotFoundException('Nothing found')
    }

    return grants
  }

  @Get(':key')
  @ApiOkResponse({ type: Grant })
  async getAsync(@Param('key') key: string): Promise<Grant> {
    const grants = await this.grantsService.getAsync(key)

    if (!grants) {
      throw new NotFoundException("This particular grant doesn't exist")
    }

    return grants
  }

  @Delete(':subjectId/:clientId')
  @ApiOkResponse()
  async removeAllAsync(
    @Param('subjectId') subjectId: string,
    @Param('clientId') clientId: string,
  ): Promise<number> {
    return await this.grantsService.removeAllAsync(subjectId, clientId)
  }

  @Delete(':subjectId/:clientId/:type')
  @ApiOkResponse()
  async removeAllAsyncV2(
    @Param('subjectId') subjectId: string,
    @Param('clientId') clientId: string,
    @Param('type') type: string,
  ): Promise<number> {
    return await this.grantsService.removeAllAsync(subjectId, clientId)
  }

  @Delete(':key')
  @ApiOkResponse()
  async removeAsync(@Param('key') key: string): Promise<number> {
    return await this.grantsService.removeAsync(key)
  }

  @Post()
  @ApiCreatedResponse({ type: Grant })
  async create(@Body() grant: GrantDTO): Promise<Grant> {
    return await this.grantsService.createAsync(grant)
  }
}
