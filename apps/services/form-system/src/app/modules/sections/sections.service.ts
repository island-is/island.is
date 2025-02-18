import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Section } from './models/section.model'
import { CreateSectionDto } from './models/dto/createSection.dto'
import { UpdateSectionDto } from './models/dto/updateSection.dto'
import { SectionDto } from './models/dto/section.dto'
import { UpdateSectionsDisplayOrderDto } from './models/dto/updateSectionsDisplayOrder.dto'
import defaults from 'lodash/defaults'
import pick from 'lodash/pick'
import zipObject from 'lodash/zipObject'

@Injectable()
export class SectionsService {
  constructor(
    @InjectModel(Section)
    private readonly sectionModel: typeof Section,
  ) {}

  async create(createSectionDto: CreateSectionDto): Promise<SectionDto> {
    const section = createSectionDto as Section
    const newSection: Section = new this.sectionModel(section)
    await newSection.save()

    const keys = ['id', 'formId']
    const sectionDto: SectionDto = defaults(
      pick(newSection, keys),
      zipObject(keys, Array(keys.length).fill(null)),
    ) as SectionDto

    return sectionDto
  }

  async update(id: string, updateSectionDto: UpdateSectionDto): Promise<void> {
    const section = await this.sectionModel.findByPk(id)

    if (!section) {
      throw new NotFoundException(`Section with id '${id}' not found`)
    }

    Object.assign(section, updateSectionDto)

    await section.save()
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
    const section = await this.sectionModel.findByPk(id)

    if (!section) {
      throw new NotFoundException(`Section with id '${id}' not found`)
    }

    section.destroy()
  }
}
