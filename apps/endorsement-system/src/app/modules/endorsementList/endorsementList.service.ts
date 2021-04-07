import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { EndorsementList } from './endorsementList.model'
import { EndorsementListDto } from './dto/EndorsementLists.dto'
import { Endorsement } from '../endorsement/endorsement.model'
import { Op } from 'sequelize'

interface createInput extends EndorsementListDto {
  owner: string
}
@Injectable()
export class EndorsementListService {
  constructor (
    @InjectModel(EndorsementList)
    private endorsementListModel: typeof EndorsementList,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  async findListsByTag (tag: string) {
    this.logger.debug(`Finding endorsement lists by tag "${tag}"`)
    // TODO: Add option to get only open endorsement lists
    return this.endorsementListModel.findAll({
      where: { tags: { [Op.contains]: [tag] } },
    })
  }

  async findSingleList (id: string) {
    this.logger.debug(`Finding single endorsement lists by id "${id}"`)
    return this.endorsementListModel.findOne({
      where: { id },
    })
  }

  async findSingleListEndorsements (id: string) {
    this.logger.debug(
      `Finding endorsements form single endorsement lists by id "${id}"`,
    )
    return this.endorsementListModel.findOne({
      include: [{ model: Endorsement, as: 'endorsements' }],
      where: { id },
    })
  }

  async close (id: string): Promise<EndorsementList | null> {
    this.logger.debug('Closing endorsement list', id)
    const [_, endorsementLists] = await this.endorsementListModel.update(
      { closedDate: new Date() },
      { where: { id }, returning: true },
    )

    return endorsementLists[0] ?? null
  }

  async create (list: createInput) {
    this.logger.debug('Creating endorsement list')
    return this.endorsementListModel.create({
      title: list.title,
      description: list.description,
      endorsementMeta: list.endorsementMeta,
      tags: list.tags,
      validationRules: list.validationRules,
      owner: list.owner,
    })
  }
}
