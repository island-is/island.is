import { Injectable, NotFoundException } from '@nestjs/common'
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

  async create(createScreenDto: CreateScreenDto): Promise<ScreenDto> {
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

  async update(id: string, updateScreenDto: UpdateScreenDto): Promise<void> {
    const screen = await this.screenModel.findByPk(id)

    if (!screen) {
      throw new NotFoundException(`Screen with id '${id}' not found`)
    }

    Object.assign(screen, updateScreenDto)

    await screen.save()
  }

  async updateDisplayOrder(
    updateScreensDisplayOrderDto: UpdateScreensDisplayOrderDto,
  ): Promise<void> {
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

      screen.update({
        displayOrder: i,
        sectionId: screensDisplayOrderDto[i].sectionId,
      })
    }
  }

  async delete(id: string): Promise<void> {
    const screen = await this.screenModel.findByPk(id)
    if (!screen) {
      throw new NotFoundException(`Screen with id '${id}' not found`)
    }

    const section = await this.sectionModel.findByPk(screen?.sectionId)
    const form = await this.formModel.findByPk(section?.formId)

    if (form) {
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
    }

    screen.destroy()
  }
}
