import {
  AccessService,
  AdminAccess,
  AdminAccessDTO,
  AdminAccessUpdateDTO,
} from '@island.is/auth-api-lib'
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger'
import { IdsUserGuard } from '@island.is/auth-nest-tools'
import { NationalIdGuard } from '../access/national-id-guard'
import { FullAdminAccessGuard } from './full-admin-access-guard'

@UseGuards(IdsUserGuard, NationalIdGuard)
@ApiTags('admin-access')
@Controller('backend/admin-access')
export class AccessController {
  constructor(private readonly accessService: AccessService) {}

  /** Gets admin's access rights by id */
  @Get(':nationalId')
  @ApiOkResponse({ type: AdminAccess })
  async findOne(@Param('nationalId') nationalId: string): Promise<AdminAccess> {
    if (!nationalId) {
      throw new BadRequestException('NationalId must be provided')
    }

    const admin = await this.accessService.findOne(nationalId)
    return admin
  }

  /** Gets x many admins based on pagenumber and count variable */
  @Get()
  @ApiQuery({ name: 'page', required: true })
  @ApiQuery({ name: 'count', required: true })
  @ApiOkResponse({
    schema: {
      allOf: [
        {
          properties: {
            count: {
              type: 'number',
              example: 1,
            },
            rows: {
              type: 'array',
              items: { $ref: getSchemaPath(AdminAccess) },
            },
          },
        },
      ],
    },
  })
  async findAndCountAll(
    @Query('searchString') searchString: string,
    @Query('page') page: number,
    @Query('count') count: number,
  ): Promise<{ rows: AdminAccess[]; count: number } | null> {
    const admins = await this.accessService.findAndCountAll(
      searchString,
      page,
      count,
    )
    return admins
  }

  /** Creates a new admin */
  @Post()
  @UseGuards(FullAdminAccessGuard)
  @ApiCreatedResponse({ type: AdminAccess })
  async create(@Body() admin: AdminAccessDTO): Promise<AdminAccess> {
    return await this.accessService.create(admin)
  }

  /** Updates an existing admin */
  @Put(':nationalId')
  @UseGuards(FullAdminAccessGuard)
  @ApiCreatedResponse({ type: AdminAccess })
  async update(
    @Body() admin: AdminAccessUpdateDTO,
    @Param('nationalId') nationalId: string,
  ): Promise<AdminAccess | null> {
    if (!nationalId) {
      throw new BadRequestException('NationalId must be provided')
    }

    return await this.accessService.update(admin, nationalId)
  }

  /** Deleting an admin by nationalId */
  @Delete(':nationalId')
  @UseGuards(FullAdminAccessGuard)
  @ApiCreatedResponse()
  async delete(@Param('nationalId') nationalId: string): Promise<number> {
    if (!nationalId) {
      throw new BadRequestException('nationalId must be provided')
    }

    return await this.accessService.delete(nationalId)
  }
}
