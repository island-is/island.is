import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  NotFoundException,
  Put,
} from '@nestjs/common'
import { PagesService } from './pages.service'
import { CreatePageDto } from './models/dto/createPage.dto'
import { Page } from './models/page.model'
import { Documentation } from '@island.is/nest/swagger'
import { ApiTags } from '@nestjs/swagger'
import { UpdatePageDto } from './models/dto/updatePage.dto'
import { PageDto } from './models/dto/page.dto'
import { UpdatePagesDisplayOrderDto } from './models/dto/updatePagesDisplayOrder.dto'

@ApiTags('pages')
@Controller('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Post()
  create(@Body() createPageDto: CreatePageDto): Promise<Page> {
    return this.pagesService.create(createPageDto)
  }

  @Get()
  @Documentation({
    description: 'Get all Pages',
    response: { status: 200, type: [Page] },
  })
  async findAll(): Promise<Page[]> {
    return await this.pagesService.findAll()
  }

  @Get(':id')
  @Documentation({
    description: 'Get Page by id',
    response: { status: 200, type: Page },
  })
  async findOne(@Param('id') id: string): Promise<Page> {
    const page = await this.pagesService.findOne(id)
    if (!page) {
      throw new NotFoundException(`Page not found`)
    }

    return page
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePageDto: UpdatePageDto,
  ): Promise<PageDto> {
    return await this.pagesService.update(id, updatePageDto)
  }

  @Put()
  @Documentation({
    description: 'Update display order of pages',
    response: { status: 204 },
  })
  async updateDisplayOrder(
    @Body() updatePagesDisplayOrderDto: UpdatePagesDisplayOrderDto,
  ): Promise<void> {
    return this.pagesService.updateDisplayOrder(updatePagesDisplayOrderDto)
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.pagesService.delete(id)
  }
}
