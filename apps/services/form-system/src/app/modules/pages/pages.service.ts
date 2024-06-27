import { Injectable, NotFoundException } from '@nestjs/common'
import { Page } from './models/page.model'
import { InjectModel } from '@nestjs/sequelize'
import { Input } from '../inputs/models/input.model'
import { CreatePageDto } from './models/dto/createPage.dto'
import { UpdatePageDto } from './models/dto/updatePage.dto'
import { PageDto } from './models/dto/page.dto'
import { UpdatePagesDisplayOrderDto } from './models/dto/updatePagesDisplayOrder.dto'

@Injectable()
export class PagesService {
  constructor(
    @InjectModel(Page)
    private readonly pageModel: typeof Page,
  ) {}

  async findAll(): Promise<Page[]> {
    return await this.pageModel.findAll()
  }

  async findOne(id: string): Promise<Page> {
    const page = await this.pageModel.findByPk(id, { include: [Input] })

    if (!page) {
      throw new NotFoundException(`Page with id '${id}' not found`)
    }

    return page
  }

  async create(createPageDto: CreatePageDto): Promise<Page> {
    const page = createPageDto as Page
    const newPage: Page = new this.pageModel(page)
    return await newPage.save()
  }

  async update(id: string, updatePageDto: UpdatePageDto): Promise<PageDto> {
    const page = await this.findOne(id)

    page.name = updatePageDto.name
    page.multiset = updatePageDto.multiset
    page.modified = new Date()

    await page.save()

    const pageDto: PageDto = {
      id: page.id,
      sectionId: page.sectionId,
      name: page.name,
      displayOrder: page.displayOrder,
      multiset: page.multiset,
    }

    return pageDto
  }

  async updateDisplayOrder(
    updatePagesDisplayOrderDto: UpdatePagesDisplayOrderDto,
  ): Promise<void> {
    const { pagesDisplayOrderDto: pagesDisplayOrderDto } =
      updatePagesDisplayOrderDto

    for (let i = 0; i < pagesDisplayOrderDto.length; i++) {
      const page = await this.pageModel.findByPk(pagesDisplayOrderDto[i].id)

      if (!page) {
        throw new NotFoundException(
          `Page with id '${pagesDisplayOrderDto[i].id}' not found`,
        )
      }

      page.update({
        displayOrder: i,
        sectionId: pagesDisplayOrderDto[i].sectionId,
      })
    }
  }

  async delete(id: string): Promise<void> {
    const page = await this.findOne(id)
    page?.destroy()
  }
}
