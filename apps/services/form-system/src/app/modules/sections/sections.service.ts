import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
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
import { User } from '@island.is/auth-nest-tools'
import { AdminPortalScope } from '@island.is/auth/scopes'

@Injectable()
export class SectionsService {
  constructor(
    @InjectModel(Section)
    private readonly sectionModel: typeof Section,
    @InjectModel(Form)
    private readonly formModel: typeof Form,
  ) {}

  async create(
    user: User,
    createSectionDto: CreateSectionDto,
  ): Promise<SectionDto> {
    const isAdmin = user.scope.includes(AdminPortalScope.formSystemAdmin)

    const form = await this.formModel.findByPk(createSectionDto.formId)
    if (!form) {
      throw new NotFoundException(
        `Form with id '${createSectionDto.formId}' not found`,
      )
    }

    const formOwnerNationalId = form.organizationNationalId
    if (user.nationalId !== formOwnerNationalId && !isAdmin) {
      throw new UnauthorizedException(
        `User with nationalId '${user.nationalId}' does not have permission to create section for form with id '${createSectionDto.formId}'`,
      )
    }

    const section = createSectionDto as Section
    const newSection: Section = new this.sectionModel(section)
    await newSection.save()

    const keys = ['id', 'formId']
    const sectionDto: SectionDto = defaults(
      pick(newSection, keys),
      zipObject(keys, Array(keys.length).fill(null)),
    ) as SectionDto

    if (form) {
      form.draftTotalSteps++
      await form.save()
    }

    return sectionDto
  }

  async update(
    user: User,
    id: string,
    updateSectionDto: UpdateSectionDto,
  ): Promise<void> {
    const isAdmin = user.scope.includes(AdminPortalScope.formSystemAdmin)

    const section = await this.sectionModel.findByPk(id)

    if (!section) {
      throw new NotFoundException(`Section with id '${id}' not found`)
    }

    const form = await this.formModel.findByPk(section.formId, {
      attributes: ['organizationNationalId'],
      raw: true,
    })
    if (!form) {
      throw new NotFoundException(`Form with id '${section.formId}' not found`)
    }

    const formOwnerNationalId = form.organizationNationalId
    if (user.nationalId !== formOwnerNationalId && !isAdmin) {
      throw new UnauthorizedException(
        `User with nationalId '${user.nationalId}' does not have permission to update section with id '${section.id}'`,
      )
    }

    Object.assign(section, updateSectionDto)

    await section.save()
  }

  async updateDisplayOrder(
    user: User,
    updateSectionDisplayOrderDto: UpdateSectionsDisplayOrderDto,
  ): Promise<void> {
    const isAdmin = user.scope.includes(AdminPortalScope.formSystemAdmin)

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
      ) {
        continue
      }

      const form = await this.formModel.findByPk(section.formId, {
        attributes: ['organizationNationalId'],
        raw: true,
      })
      if (!form) {
        throw new NotFoundException(
          `Form with id '${section.formId}' not found`,
        )
      }

      const formOwnerNationalId = form.organizationNationalId

      if (user.nationalId !== formOwnerNationalId && !isAdmin) {
        throw new UnauthorizedException(
          `User with nationalId '${user.nationalId}' does not have permission to update display order of section with id '${section.id}'`,
        )
      }

      await section.update({
        displayOrder: i,
      })
    }
  }

  async delete(user: User, id: string): Promise<void> {
    const isAdmin = user.scope.includes(AdminPortalScope.formSystemAdmin)

    const section = await this.sectionModel.findByPk(id)

    if (!section) {
      throw new NotFoundException(`Section with id '${id}' not found`)
    }

    const form = await this.formModel.findByPk(section.formId, {
      attributes: ['organizationNationalId'],
      raw: true,
    })
    if (!form) {
      throw new NotFoundException(`Form with id '${section.formId}' not found`)
    }

    const formOwnerNationalId = form.organizationNationalId
    if (user.nationalId !== formOwnerNationalId && !isAdmin) {
      throw new UnauthorizedException(
        `User with nationalId '${user.nationalId}' does not have permission to delete section with id '${section.id}'`,
      )
    }

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

    await section.destroy()
  }
}
