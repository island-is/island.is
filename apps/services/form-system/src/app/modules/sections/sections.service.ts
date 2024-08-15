import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Section } from './models/section.model'
import { CreateSectionDto } from './models/dto/createSection.dto'
import { Screen } from '../screens/models/screen.model'
import { Field } from '../fields/models/field.model'
import { UpdateSectionDto } from './models/dto/updateSection.dto'
import { SectionDto } from './models/dto/section.dto'
import { UpdateSectionsDisplayOrderDto } from './models/dto/updateSectionsDisplayOrder.dto'
import { defaults, pick, zipObject } from 'lodash'

@Injectable()
export class SectionsService {
  constructor(
    @InjectModel(Section)
    private readonly sectionModel: typeof Section,
  ) {}

  // async findAll(): Promise<Section[]> {
  //   return await this.sectionModel.findAll()
  // }

  // async findOne(id: string): Promise<Section> {
  //   const section = await this.sectionModel.findByPk(id, {
  //     include: [
  //       {
  //         model: Screen,
  //         as: 'screens',
  //         include: [{ model: Field, as: 'fields' }],
  //       },
  //     ],
  //   })

  //   if (!section) {
  //     throw new NotFoundException(`Section with id '${id}' not found`)
  //   }

  //   return section
  // }

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

  async update(
    id: string,
    updateSectionDto: UpdateSectionDto,
  ): Promise<SectionDto> {
    const section = await this.sectionModel.findByPk(id)

    if (!section) {
      throw new NotFoundException(`Section with id '${id}' not found`)
    }

    section.name = updateSectionDto.name
    section.waitingText = updateSectionDto.waitingText
    section.modified = new Date()

    await section.save()

    const keys = ['id', 'name', 'sectionType', 'displayOrder', 'waitingText']
    const sectionDto: SectionDto = defaults(
      pick(section, keys),
      zipObject(keys, Array(keys.length).fill(null)),
    ) as SectionDto

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
    const section = await this.sectionModel.findByPk(id)

    if (!section) {
      throw new NotFoundException(`Section with id '${id}' not found`)
    }

    section.destroy()
  }
}
