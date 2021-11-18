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
import environment, {
  ENDORSEMENT_SYSTEM_GENERAL_PETITION_TAGS,
} from '../../../environments/environment'
import { NationalRegistryApi } from '@island.is/clients/national-registry-v1'
import type { User } from '@island.is/auth-nest-tools'
import { EndorsementsScope } from '@island.is/auth/scopes'
import { EmailService } from '@island.is/email-service'
import PDFDocument from 'pdfkit'
import getStream from 'get-stream'

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
    @Inject(EmailService)
    private emailService: EmailService,
  ) {}

  async hasAdminScope(user: User): Promise<boolean> {
    for (const [key, value] of Object.entries(user.scope)) {
      if (value == EndorsementsScope.admin) {
        return true
      }
    }
    return false
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

  async findListsByTags(tags: string[], query: any, user: User) {
    const isAdmin = await this.hasAdminScope(user)
    this.logger.debug(`Finding endorsement lists by tags "${tags.join(', ')}"`)
    // check if user is admin
    return await paginate({
      Model: this.endorsementListModel,
      limit: query.limit || 10,
      after: query.after,
      before: query.before,
      primaryKeyField: 'counter',
      orderOption: [['counter', 'ASC']],
      where: {
        tags: { [Op.overlap]: tags },
        adminLock: isAdmin ? { [Op.or]: [true, false] } : false,
      },
    })
  }

  async findSingleList(listId: string, user?: User, check?: boolean) {
    // Check variable needed since finAll function in Endorsement controller uses this function twice
    // on the second call it passes nationalID of user but does not go throught the get list pipe
    const isAdmin = user && check ? await this.hasAdminScope(user) : false
    this.logger.debug(`Finding single endorsement lists by id "${listId}"`)
    const result = await this.endorsementListModel.findOne({
      where: {
        id: listId,
        adminLock: isAdmin ? { [Op.or]: [true, false] } : false,
      },
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
          required: true,
          as: 'endorsementList',
          where: { adminLock: false },
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

  async getOwnerInfo(listId: string, owner?: string) {
    // Is used by both unauthenticated users, authenticated users and admin
    // Admin needs to access locked lists and can not use the EndorsementListById pipe
    // Since the endpoint is not authenticated
    this.logger.debug(`Finding single endorsement lists by id "${listId}"`)
    if (!owner) {
      const endorsementList = await this.endorsementListModel.findOne({
        where: {
          id: listId,
        },
      })
      if (!endorsementList) {
        throw new NotFoundException(['This endorsement list does not exist.'])
      }
      owner = endorsementList.owner
    }

    try {
      return (await this.nationalRegistryApi.getUser(owner)).Fulltnafn
    } catch (e) {
      if (e instanceof Error) {
        this.logger.warn(
          `Occured when fetching owner name from NationalRegistryApi ${e.message} \n${e.stack}`,
        )
        return ''
      } else {
        throw e
      }
    }
  }

  async createDocumentBuffer(endorsementList: any, ownerName: string) {
    // build pdf
    const doc = new PDFDocument()
    const locale = 'is-IS'
    const big = 16
    const regular = 8
    const fontRegular = 'Helvetica'
    const fontBold = 'Helvetica-Bold'

    doc
      .fontSize(big)
      .text('Upplýsingar um meðmælendalista')
      .moveDown()

      .fontSize(regular)
      .font(fontBold)
      .text('Heiti meðmælendalista: ')
      .font(fontRegular)
      .text(endorsementList.title)
      .moveDown()

      .font(fontBold)
      .text('Um meðmælendalista: ')
      .font(fontRegular)
      .text(endorsementList.description)
      .moveDown()

      .font(fontBold)
      .text('Ábyrgðarmaður: ')
      .font(fontRegular)
      .text(ownerName)
      .moveDown()

      .font(fontBold)
      .text('Tímabil lista: ')
      .font(fontRegular)
      .text(
        endorsementList.openedDate.toLocaleDateString(locale) +
          ' - ' +
          endorsementList.closedDate.toLocaleDateString(locale),
      )
      .moveDown()

      .font(fontBold)
      .text('Fjöldi skráðir: ')
      .font(fontRegular)
      .text(endorsementList.endorsements.length)
      .moveDown(2)

    if (endorsementList.endorsements.length) {
      doc.fontSize(big).text('Yfirlit meðmæla').fontSize(regular).moveDown()
      for (const val of endorsementList.endorsements) {
        doc.text(
          val.created.toLocaleDateString(locale) +
            ' ' +
            (val.meta.fullName ? val.meta.fullName : 'Nafn ótilgreint'),
        )
      }
    }
    doc
      .moveDown()

      .fontSize(regular)
      .text(
        'Þetta skjal var framkallað sjálfvirkt þann: ' +
          new Date().toLocaleDateString(locale),
      )
    doc.end()
    return await getStream.buffer(doc)
  }

  async emailPDF(
    listId: string,
    recipientEmail: string,
  ): Promise<{ success: boolean }> {
    const endorsementList = await this.endorsementListModel.findOne({
      where: { id: listId },
      include: [
        {
          model: Endorsement,
        },
      ],
    })
    if (!endorsementList) {
      throw new NotFoundException(['This endorsement list does not exist.'])
    }
    let ownerName = await this.getOwnerInfo(
      endorsementList?.id,
      endorsementList.owner,
    )
    this.logger.info(
      `sending list ${listId} to ${recipientEmail} from ${environment.email.sender}`,
    )
    try {
      await this.emailService.sendEmail({
        from: {
          name: environment.email.sender,
          address: environment.email.address,
        },
        to: [
          {
            // message can be sent to any email so recipient name is unknown
            name: recipientEmail,
            address: recipientEmail,
          },
        ],
        subject: `Meðmælendalisti "${endorsementList?.title}"`,
        template: {
          title: `Meðmælendalisti "${endorsementList?.title}"`,
          body: [
            {
              component: 'Heading',
              context: {
                copy: `Meðmælendalisti "${endorsementList?.title}"`,
              },
            },
            { component: 'Copy', context: { copy: 'Sæl/l/t' } },
            {
              component: 'Copy',
              context: {
                copy: `Meðfylgjandi er meðmælendalisti "${endorsementList?.title}", 
                sem ${ownerName} er skráður ábyrgðarmaður fyrir. 
                Vakin er athygli á lögum um persónuvernd og vinnslu persónuupplýsinga nr. 90/2018.`,
              },
            },
            { component: 'Copy', context: { copy: 'Kær kveðja,' } },
            { component: 'Copy', context: { copy: 'Ísland.is' } },
          ],
        },
        attachments: [
          {
            filename: 'Meðmælendalisti.pdf',
            content: await this.createDocumentBuffer(
              endorsementList,
              ownerName,
            ),
          },
        ],
      })
      return { success: true }
    } catch (error) {
      this.logger.error('Failed to send email', error)
      return { success: false }
    }
  }
}
