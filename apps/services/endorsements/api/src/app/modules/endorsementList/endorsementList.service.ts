import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op } from 'sequelize'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { EndorsementList } from './endorsementList.model'
import { EndorsementListDto } from './dto/endorsementList.dto'
import { Endorsement } from '../endorsement/models/endorsement.model'

import { paginate } from '../pagination/paginate';

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
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  async findListsByTags(tags: string[], query: any) {
    // this.logger.debug(`Finding endorsement lists by tags "${tags.join(', ')}"`)
    // TODO: Add option to get only open endorsement lists
    
    console.log(query)

    // pagination setup defaults
    const limit = parseInt(query.limit) || 5;
    const after = query.after || null;
    const before = query.before || null;
    const primaryKeyField = 'id'
    const orderOption = [['id', 'ASC']]
    const where = {
      tags: { [Op.overlap]: tags },
    } 
    // const where = null
    
    
    return await paginate(
      this.endorsementListModel,
      primaryKeyField,
      orderOption,
      where,
      after,
      before,
      limit
    );
    
    // return this.endorsementListModel.findAll({
    //   where: {
    //     tags: { [Op.overlap]: tags },
    //   },
    // })
  }


  
  async findSingleList(listId: string) {
    this.logger.debug(`Finding single endorsement lists by id "${listId}"`)
    const result = await this.endorsementListModel.findOne({
      where: { id: listId },
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
    console.log(query)

    // pagination setup defaults
    const limit = parseInt(query.limit) || 5;
    const after = query.after || null;
    const before = query.before || null;
    const primaryKeyField = 'id'
    const orderOption = [['id', 'ASC']]
    const where = { endorser: nationalId } 

    
    return await paginate(
      this.endorsementModel,
      primaryKeyField,
      orderOption,
      where,
      after,
      before,
      limit
    );
    // return this.endorsementModel.findAll({
    //   where: { endorser: nationalId },
    //   include: [
    //     {
    //       model: EndorsementList,
    //       attributes: ['id', 'title', 'description', 'tags', 'closedDate'],
    //     },
    //   ],
    // })
  }

  async close(endorsementList: EndorsementList): Promise<EndorsementList> {
    this.logger.info(`Closing endorsement list: ${endorsementList.id}`)
    return await endorsementList.update({ closedDate: new Date() })
  }

  async open(endorsementList: EndorsementList): Promise<EndorsementList> {
    this.logger.info(`Opening endorsement list: ${endorsementList.id}`)
    return await endorsementList.update({ closedDate: null })
  }

  async create(list: CreateInput) {
    this.logger.info(`Creating endorsement list: ${list.title}`)
    return this.endorsementListModel.create(list)
  }
}
