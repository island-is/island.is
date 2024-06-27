import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Section } from './models/section.model'
import { CreateSectionDto } from './models/dto/createSection.dto'
import { Page } from '../pages/models/page.model'
import { Input } from '../inputs/models/input.model'
import { UpdateSectionDto } from './models/dto/updateSection.dto'
import { SectionDto } from './models/dto/section.dto'
import { UpdateSectionsDisplayOrderDto } from './models/dto/updateSectionsDisplayOrder.dto'

@Injectable()
export class SectionsService {
  constructor(
    @InjectModel(Section)
    private readonly sectionModel: typeof Section,
  ) {}

  async findAll(): Promise<Section[]> {
    return await this.sectionModel.findAll()
  }

  async findOne(id: string): Promise<Section> {
    const section = await this.sectionModel.findByPk(id, {
      include: [
        {
          model: Page,
          as: 'pages',
          include: [{ model: Input, as: 'inputs' }],
        },
      ],
    })

    if (!section) {
      throw new NotFoundException(`Section with id '${id}' not found`)
    }

    return section
  }

  async create(createSectionDto: CreateSectionDto): Promise<Section> {
    const section = createSectionDto as Section
    const newSection: Section = new this.sectionModel(section)
    return await newSection.save()
  }

  async update(
    id: string,
    updateSectionDto: UpdateSectionDto,
  ): Promise<SectionDto> {
    const section = await this.findOne(id)

    section.name = updateSectionDto.name
    section.waitingText = updateSectionDto.waitingText
    section.callRuleset = updateSectionDto.callRuleset
    section.modified = new Date()

    await section.save()

    const sectionDto: SectionDto = {
      id: section.id,
      name: section.name,
      sectionType: section.sectionType,
      displayOrder: section.displayOrder,
      waitingText: section.waitingText,
      callRuleset: section.callRuleset,
    }

    return sectionDto
  }

  async updateDisplayOrder(
    updateSectionDisplayOrderDto: UpdateSectionsDisplayOrderDto,
  ): Promise<void> {
    const { sectionsDisplayOrderDto: sectionsDisplayOrderDto } =
      updateSectionDisplayOrderDto

    for (let i = 0; i < sectionsDisplayOrderDto.length; i++) {
      const section = await this.sectionModel.findByPk(
        sectionsDisplayOrderDto[i].id,
      )

      if (!section) {
        throw new NotFoundException(
          `Section with id '${sectionsDisplayOrderDto[i].id}' not found`,
        )
      }

      await section.update({
        displayOrder: i,
      })
    }
  }

  async delete(id: string): Promise<void> {
    const section = await this.findOne(id)
    section?.destroy()
  }
}
