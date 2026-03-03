import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { Screen } from './models/screen.model'
import { InjectModel } from '@nestjs/sequelize'
import { CreateScreenDto } from './models/dto/createScreen.dto'
import { UpdateScreenDto } from './models/dto/updateScreen.dto'
import { ScreenDto } from './models/dto/screen.dto'
import { UpdateScreensDisplayOrderDto } from './models/dto/updateScreensDisplayOrder.dto'
import defaults from 'lodash/defaults'
import pick from 'lodash/pick'
import zipObject from 'lodash/zipObject'
import { Section } from '../sections/models/section.model'
import { Form } from '../forms/models/form.model'
import {
  filterArrayDependency,
  filterDependency,
} from '../../../utils/dependenciesHelper'
import { User } from '@island.is/auth-nest-tools'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { Field } from '../fields/models/field.model'

@Injectable()
export class ScreensService {
  constructor(
    @InjectModel(Screen)
    private readonly screenModel: typeof Screen,
    @InjectModel(Section)
    private readonly sectionModel: typeof Section,
    @InjectModel(Form)
    private readonly formModel: typeof Form,
  ) {}

  async create(
    user: User,
    createScreenDto: CreateScreenDto,
  ): Promise<ScreenDto> {
    const isAdmin = user.scope.includes(AdminPortalScope.formSystemAdmin)
    const section = await this.sectionModel.findByPk(createScreenDto.sectionId)
    if (!section) {
      throw new NotFoundException(
        `Section with id '${createScreenDto.sectionId}' not found`,
      )
    }

    const form = await this.formModel.findByPk(section.formId)
    if (!form) {
      throw new NotFoundException(`Form with id '${section.formId}' not found`)
    }

    const formOwnerNationalId = form.organizationNationalId
    if (user.nationalId !== formOwnerNationalId && !isAdmin) {
      throw new UnauthorizedException(
        `User does not have permission to create screen for section with id '${createScreenDto.sectionId}'`,
      )
    }

    const screen = createScreenDto as Screen
    const newScreen: Screen = new this.screenModel(screen)
    await newScreen.save()

    const keys = ['id', 'sectionId']
    const screenDto: ScreenDto = defaults(
      pick(newScreen, keys),
      zipObject(keys, Array(keys.length).fill(null)),
    ) as ScreenDto

    return screenDto
  }

  async update(
    user: User,
    id: string,
    updateScreenDto: UpdateScreenDto,
  ): Promise<void> {
    const isAdmin = user.scope.includes(AdminPortalScope.formSystemAdmin)

    const screen = await this.screenModel.findByPk(id)

    if (!screen) {
      throw new NotFoundException(`Screen with id '${id}' not found`)
    }

    const section = await this.sectionModel.findByPk(screen.sectionId)
    if (!section) {
      throw new NotFoundException(
        `Section with id '${screen.sectionId}' not found`,
      )
    }

    const form = await this.formModel.findByPk(section.formId)
    if (!form) {
      throw new NotFoundException(`Form with id '${section.formId}' not found`)
    }

    const formOwnerNationalId = form.organizationNationalId
    if (user.nationalId !== formOwnerNationalId && !isAdmin) {
      throw new UnauthorizedException(
        `User does not have permission to update screen with id '${id}'`,
      )
    }

    Object.assign(screen, updateScreenDto)

    await screen.save()
  }

  async updateDisplayOrder(
    user: User,
    updateScreensDisplayOrderDto: UpdateScreensDisplayOrderDto,
  ): Promise<void> {
    const isAdmin = user.scope.includes(AdminPortalScope.formSystemAdmin)

    const { screensDisplayOrderDto: screensDisplayOrderDto } =
      updateScreensDisplayOrderDto

    for (let i = 0; i < screensDisplayOrderDto.length; i++) {
      const screen = await this.screenModel.findByPk(
        screensDisplayOrderDto[i].id,
      )

      if (!screen) {
        throw new NotFoundException(
          `Screen with id '${screensDisplayOrderDto[i].id}' not found`,
        )
      }

      const section = await this.sectionModel.findByPk(screen.sectionId)
      if (!section) {
        throw new NotFoundException(
          `Section with id '${screen.sectionId}' not found`,
        )
      }

      const form = await this.formModel.findByPk(section.formId)
      if (!form) {
        throw new NotFoundException(
          `Form with id '${section.formId}' not found`,
        )
      }

      const formOwnerNationalId = form.organizationNationalId
      if (user.nationalId !== formOwnerNationalId && !isAdmin) {
        throw new UnauthorizedException(
          `User does not have permission to update display order of screen with id '${screen.id}'`,
        )
      }

      await screen.update({
        displayOrder: i,
        sectionId: screensDisplayOrderDto[i].sectionId,
      })
    }
  }

  async delete(user: User, id: string): Promise<void> {
    const isAdmin = user.scope.includes(AdminPortalScope.formSystemAdmin)

    const screen = await this.screenModel.findByPk(id, {
      include: [{ model: Field, as: 'fields' }],
    })
    if (!screen) {
      throw new NotFoundException(`Screen with id '${id}' not found`)
    }

    const section = await this.sectionModel.findByPk(screen.sectionId)
    if (!section) {
      throw new NotFoundException(
        `Section with id '${screen.sectionId}' not found`,
      )
    }

    const form = await this.formModel.findByPk(section.formId)
    if (!form) {
      throw new NotFoundException(`Form with id '${section.formId}' not found`)
    }

    const formOwnerNationalId = form.organizationNationalId
    if (user.nationalId !== formOwnerNationalId && !isAdmin) {
      throw new UnauthorizedException(
        `User does not have permission to delete screen with id '${id}'`,
      )
    }

    const { dependencies } = form
    if (screen.fields) {
      const fields = await screen.$get('fields', {
        attributes: ['id'],
      })
      if (Array.isArray(fields) && fields.length) {
        const fieldIds = fields.map((field: { id: string }) => field.id)
        const newDependencies = filterArrayDependency(dependencies, [
          ...fieldIds,
          id,
        ])
        form.dependencies = newDependencies
      }
    } else {
      form.dependencies = filterDependency(dependencies, id)
    }
    await form.save()

    await screen.destroy()
  }
}
