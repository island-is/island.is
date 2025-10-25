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
import { Form } from '../forms/models/form.model'
import {
  filterArrayDependency,
  filterDependency,
} from '../../../utils/dependenciesHelper'
import { SectionTypes } from '@island.is/form-system/shared'

@Injectable()
export class SectionsService {
  constructor(
    @InjectModel(Section)
    private readonly sectionModel: typeof Section,
    @InjectModel(Form)
    private readonly formModel: typeof Form,
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

    const form = await this.formModel.findByPk(section.formId)
    if (form) {
      form.draftTotalSteps++
      await form.save()
    }

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

      if (
        section.sectionType === SectionTypes.SUMMARY ||
        section.sectionType === SectionTypes.PAYMENT ||
        section.sectionType === SectionTypes.COMPLETED
      )
        continue

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

    const form = await this.formModel.findByPk(section.formId)

    if (form) {
      const { dependencies } = form
      const screens = await section.$get('screens', {
        attributes: ['id'],
      })
      if (Array.isArray(screens) && screens.length) {
        const screenIds = screens.map((screen: { id: string }) => screen.id)
        const fieldsPerScreen = await Promise.all(
          screens.map((s) => s.$get('fields', { attributes: ['id'] })),
        )
        const fieldIds = fieldsPerScreen
          .flat()
          .map((field: { id: string }) => field.id)
        const newDependencies = filterArrayDependency(dependencies, [
          ...screenIds,
          ...fieldIds,
          id,
        ])
        form.dependencies = newDependencies
      } else {
        form.dependencies = filterDependency(dependencies, id)
      }
      form.draftTotalSteps--
      await form.save()
    }

    section.destroy()
  }
}
