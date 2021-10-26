import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op } from 'sequelize'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { EndorsementList } from './endorsementList.model'
import { EndorsementListDto } from './dto/endorsementList.dto'
import { Endorsement } from '../endorsement/models/endorsement.model'
import { ChangeEndorsmentListClosedDateDto } from './dto/changeEndorsmentListClosedDate.dto'
import { UpdateEndorsementListDto } from './dto/updateEndorsementList.dto'
import { paginate } from '@island.is/nest/pagination'
import { ENDORSEMENT_SYSTEM_GENERAL_PETITION_TAGS } from '../../../environments/environment'
import { NationalRegistryApi } from '@island.is/clients/national-registry-v1'
import { environment } from '../../../environments'

interface CreateInput extends EndorsementListDto {
  owner: string
}
@Injectable()
export class EndorsementListService {
  constructor(
    @InjectModel(Endorsement)
    private endorsementModel: typeof Endorsement,
    @InjectModel(EndorsementList)
    private readonly endorsementListModel: typeof EndorsementList,
    private readonly nationalRegistryApi: NationalRegistryApi,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  // Checks if user is admin
  isAdmin(nationalId: string) {
    return environment.accessGroups.Admin.split(',').includes(nationalId)
  }

  // generic reusable query with pagination defaults
  async findListsGenericQuery(query: any, where: any = {}) {
    return await paginate({
      Model: this.endorsementListModel,
      limit: query.limit || 10,
      after: query.after,
      before: query.before,
      primaryKeyField: 'counter',
      orderOption: [['counter', 'DESC']],
      where: where,
    })
  }

  async findListsByTags(tags: string[], query: any, nationalId: string) {
    this.logger.debug(`Finding endorsement lists by tags "${tags.join(', ')}"`)
    // check if user is admin
    const admin = this.isAdmin(nationalId)
    return await paginate({
      Model: this.endorsementListModel,
      limit: query.limit || 10,
      after: query.after,
      before: query.before,
      primaryKeyField: 'counter',
      orderOption: [['counter', 'ASC']],
      where: {
        tags: { [Op.overlap]: tags },
        adminLock: admin ? {[Op.or]: [true, false]}: false,
      },
    })
  }

  async findSingleList(listId: string) {
    this.logger.debug(`Finding single endorsement lists by id "${listId}"`)
    const result = await this.endorsementListModel.findOne({
      where: { id: listId, adminLock: false },
    })

    if (!result) {
      throw new NotFoundException(['This endorsement list does not exist.'])
    }

    return result
  }

  async findAllEndorsementsByNationalId(nationalId: string, query: any) {
    this.logger.debug(
      `Finding endorsements for single national id ${nationalId}`,
    )

    return await paginate({
      Model: this.endorsementModel,
      limit: query.limit || 10,
      after: query.after,
      before: query.before,
      primaryKeyField: 'counter',
      orderOption: [['counter', 'DESC']],
      where: { endorser: nationalId, adminLock: false },
      include: [
        {
          model: EndorsementList,
          attributes: [
            'id',
            'title',
            'description',
            'tags',
            'closedDate',
            'openedDate',
          ],
        },
      ],
    })
  }

  async findAllEndorsementListsByNationalId(nationalId: string, query: any) {
    this.logger.debug(
      `Finding endorsement lists created by single national id ${nationalId}`,
    )

    return await paginate({
      Model: this.endorsementListModel,
      limit: query.limit || 10,
      after: query.after,
      before: query.before,
      primaryKeyField: 'counter',
      orderOption: [['counter', 'ASC']],
      where: {
        owner: nationalId,
        adminLock: false,
      },
    })
  }

  async close(endorsementList: EndorsementList): Promise<EndorsementList> {
    this.logger.info(`Closing endorsement list: ${endorsementList.id}`)
    return await endorsementList.update({ closedDate: new Date() })
  }

  async open(
    endorsementList: EndorsementList,
    newDate: ChangeEndorsmentListClosedDateDto,
  ): Promise<EndorsementList> {
    this.logger.info(`Opening endorsement list: ${endorsementList.id}`)
    return await endorsementList.update({
      closedDate: newDate.closedDate,
    })
  }

  async lock(endorsementList: EndorsementList): Promise<EndorsementList> {
    this.logger.info(`Locking endorsement list: ${endorsementList.id}`)
    return await endorsementList.update({ adminLock: true })
  }

  async unlock(endorsementList: EndorsementList): Promise<EndorsementList> {
    this.logger.info(`Unlocking endorsement list: ${endorsementList.id}`)
    return await endorsementList.update({ adminLock: false })
  }

  async updateEndorsementList(
    endorsementList: EndorsementList,
    newData: UpdateEndorsementListDto,
  ): Promise<EndorsementList> {
    this.logger.info(`Updating endorsement list: ${endorsementList.id}`)
    return await endorsementList.update({ ...endorsementList, ...newData })
  }

  async create(list: CreateInput) {
    if (!list.openedDate || !list.closedDate) {
      throw new BadRequestException([
        'Body missing openedDate or closedDate value.',
      ])
    }
    if (list.openedDate >= list.closedDate) {
      throw new BadRequestException([
        'openedDate can not be bigger than closedDate.',
      ])
    }
    if (new Date() >= list.closedDate) {
      throw new BadRequestException([
        'closedDate can not have already passed on creation of Endorsement List',
      ])
    }
    this.logger.info(`Creating endorsement list: ${list.title}`)
    return this.endorsementListModel.create(list)
  }

  // generic get open lists
  async findOpenListsTaggedGeneralPetition(query: any) {
    const date_ob = new Date()
    try {
      const where = {
        tags: { [Op.eq]: ENDORSEMENT_SYSTEM_GENERAL_PETITION_TAGS },
        openedDate: { [Op.lt]: date_ob },
        closedDate: { [Op.gt]: date_ob },
        adminLock: false,
      }
      return await this.findListsGenericQuery(query, where)
    } catch (error) {
      throw new NotFoundException()
    }
  }

  async findSingleOpenListTaggedGeneralPetition(
    listId: string,
  ): Promise<EndorsementList | null> {
    const date_ob = new Date()
    const result = await this.endorsementListModel.findOne({
      where: {
        id: listId,
        tags: ENDORSEMENT_SYSTEM_GENERAL_PETITION_TAGS,
        openedDate: { [Op.lt]: date_ob },
        closedDate: { [Op.gt]: date_ob },
        adminLock: false,
      },
    })
    if (!result) {
      throw new NotFoundException()
    }
    return result
  }

  async getOwnerInfo(endorsementList: EndorsementList) {
    return (await this.nationalRegistryApi.getUser(endorsementList.owner))
      .Fulltnafn
  }
}
