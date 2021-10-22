import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { json, Op } from 'sequelize'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { EndorsementList } from './endorsementList.model'
import { EndorsementListDto } from './dto/endorsementList.dto'
import { Endorsement } from '../endorsement/models/endorsement.model'
import { ChangeEndorsmentListClosedDateDto } from './dto/changeEndorsmentListClosedDate.dto'

import { paginate } from '@island.is/nest/pagination'
import { ENDORSEMENT_SYSTEM_GENERAL_PETITION_TAGS } from '../../../environments/environment'

import { EmailService } from '@island.is/email-service'



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
    @Inject(EmailService)
    private emailService: EmailService,
    ) {}

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

  async findListsByTags(tags: string[], query: any) {
    this.logger.debug(`Finding endorsement lists by tags "${tags.join(', ')}"`)
    // TODO: Add option to get only open endorsement lists

    return await paginate({
      Model: this.endorsementListModel,
      limit: query.limit || 10,
      after: query.after,
      before: query.before,
      primaryKeyField: 'counter',
      orderOption: [['counter', 'ASC']],
      where: {
        tags: { [Op.overlap]: tags },
      },
    })
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

    return await paginate({
      Model: this.endorsementModel,
      limit: query.limit || 10,
      after: query.after,
      before: query.before,
      primaryKeyField: 'counter',
      orderOption: [['counter', 'DESC']],
      where: { endorser: nationalId },
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
      },
    })
    if (!result) {
      throw new NotFoundException()
    }
    return result
  }

  async sendMail() {
    
    try {
      return await this.emailService.sendEmail({
        from: {
          name: "RABBZ",//environment.email.fromName,
          address: "rafn@juni.is",// environment.email.fromEmail,
        },
        to: [
          {
            name: "RABBZ",
            address: "rafn@juni.is",//verification.email,
          },
        ],
        subject: `Staðfesting netfangs á Ísland.is`,
        html: `Þú hefur skráð netfangið þitt á Mínum síðum á Ísland.is. 
        Vinsamlegast staðfestu skráninguna með því að smella á hlekkinn hér fyrir neðan:
        <br>Ef hlekkurinn er ekki lengur í gildi biðjum við þig að endurtaka skráninguna á Ísland.is.
        <br><br>Ef þú kannast ekki við að hafa sett inn þetta netfang, vinsamlegast hunsaðu þennan póst.`,
        attachments: [
        //   {   // utf-8 string as an attachment
        //     filename: 'text1.txt',
        //     content: 'hello world!'
        // },
        // {   // binary buffer as an attachment
        //     filename: 'text2.txt',
        //     content: new Buffer('hello world!','utf-8')
        // },
        // {   // file on disk as an attachment
        //     filename: 'text3.txt',
        //     path: '/path/to/file.txt' // stream this file
        // },
        // {   // filename and content type is derived from path
        //     path: '/path/to/file.txt'
        // },
        // {   // stream as an attachment
        //     filename: 'text4.txt',
        //     content: fs.createReadStream('file.txt')
        // },
        // {   // define custom content type for the attachment
        //     filename: 'text.bin',
        //     content: 'hello world!',
        //     contentType: 'text/plain'
        // },
        {   // use URL as an attachment
            filename: 'license.txt',
            path: 'https://raw.github.com/nodemailer/nodemailer/master/LICENSE'
        },
        // {   // encoded string as an attachment
        //     filename: 'text1.txt',
        //     content: 'aGVsbG8gd29ybGQh',
        //     encoding: 'base64'
        // },
        // {   // data uri as an attachment
        //     path: 'data:text/plain;base64,aGVsbG8gd29ybGQ='
        // }
    ]
      })
    } catch (exception) {
      this.logger.error(exception)
      return exception
    }
  }
  
}
