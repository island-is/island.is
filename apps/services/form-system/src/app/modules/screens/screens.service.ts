import { Injectable, NotFoundException } from '@nestjs/common'
import { Screen } from './models/screen.model'
import { InjectModel } from '@nestjs/sequelize'
import { Field } from '../fields/models/field.model'
import { CreateScreenDto } from './models/dto/createScreen.dto'
import { UpdateScreenDto } from './models/dto/updateScreen.dto'
import { ScreenDto } from './models/dto/screen.dto'
import { UpdateScreensDisplayOrderDto } from './models/dto/updateScreensDisplayOrder.dto'

@Injectable()
export class ScreensService {
  constructor(
    @InjectModel(Screen)
    private readonly screenModel: typeof Screen,
  ) {}

  // async findAll(): Promise<Screen[]> {
  //   return await this.screenModel.findAll()
  // }

  async findOne(id: string): Promise<Screen> {
    const screen = await this.screenModel.findByPk(id, { include: [Field] })

    if (!screen) {
      throw new NotFoundException(`Screen with id '${id}' not found`)
    }

    return screen
  }

  async create(createScreenDto: CreateScreenDto): Promise<Screen> {
    const screen = createScreenDto as Screen
    const newScreen: Screen = new this.screenModel(screen)
    return await newScreen.save()
  }

  async update(
    id: string,
    updateScreenDto: UpdateScreenDto,
  ): Promise<ScreenDto> {
    const screen = await this.findOne(id)

    screen.name = updateScreenDto.name
    screen.multiset = updateScreenDto.multiset
    screen.callRuleset = updateScreenDto.callRuleset
    screen.modified = new Date()

    await screen.save()

    const screenDto: ScreenDto = {
      id: screen.id,
      sectionId: screen.sectionId,
      name: screen.name,
      displayOrder: screen.displayOrder,
      multiset: screen.multiset,
      callRuleset: screen.callRuleset,
    }

    return screenDto
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
    const screen = await this.findOne(id)
    screen?.destroy()
  }
}
