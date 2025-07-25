import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
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
import type { User } from '@island.is/auth-nest-tools'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { EmailService } from '@island.is/email-service'
import PDFDocument from 'pdfkit'
import getStream from 'get-stream'
import { NationalRegistryV3ClientService } from '@island.is/clients/national-registry-v3'

import csvStringify from 'csv-stringify/lib/sync'

import { S3Service } from '@island.is/nest/aws'
import { EndorsementListExportUrlResponse } from './dto/endorsementListExportUrl.response.dto'
import * as path from 'path'
import * as nationalId from 'kennitala'
import format from 'date-fns/format'
import { PassThrough } from 'stream'

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
    private readonly nationalRegistryApiV3: NationalRegistryV3ClientService,
    private readonly s3Service: S3Service,
  ) {}

  hasAdminScope(user: User): boolean {
    if (user?.scope) {
      for (const [_, value] of Object.entries(user.scope)) {
        if (value === AdminPortalScope.petitionsAdmin) {
          return true
        }
      }
    }

    return false
  }

  async getListOwnerNationalId(listId: string): Promise<string | null> {
    const endorsementList = await this.endorsementListModel.findOne({
      where: {
        id: listId,
      },
    })
    if (endorsementList) {
      return endorsementList.owner
    } else {
      return null
    }
  }

  async findListsGenericQuery(query: any, where: any = {}) {
    this.logger.info(`Finding endorsement lists`)
    return await paginate({
      Model: this.endorsementListModel,
      limit: query.limit || 10,
      after: query.after,
      before: query.before,
      primaryKeyField: 'counter',
      orderOption: [['endorsementCount', 'DESC']],
      where: where,
    })
  }

  async findListsByTags(tags: string[], query: any, user: User) {
    const isAdmin = this.hasAdminScope(user)
    this.logger.info(`Finding endorsement lists by tags "${tags.join(', ')}"`)
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
    const isAdmin = user && check ? this.hasAdminScope(user) : false
    this.logger.info(`Finding single endorsement lists by id "${listId}"`)
    const result = await this.endorsementListModel.findOne({
      where: {
        id: listId,
        adminLock: isAdmin ? { [Op.or]: [true, false] } : false,
      },
    })

    if (!result) {
      this.logger.warn('This endorsement list does not exist.')
      throw new NotFoundException(['This endorsement list does not exist.'])
    }

    return result
  }

  async findAllEndorsementsByNationalId(nationalId: string, query: any) {
    this.logger.info(
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
          where: {
            adminLock: false,
            tags: { [Op.contains]: [ENDORSEMENT_SYSTEM_GENERAL_PETITION_TAGS] },
          },
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
    this.logger.info(
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
    try {
      this.logger.info(`Locking endorsement list: ${endorsementList.id}`)
      if (process.env.NODE_ENV === 'production') {
        await this.emailLock(endorsementList)
      }
      return await endorsementList.update({ adminLock: true })
    } catch (error) {
      this.logger.error('Failed to lock endorsement list', {
        error: error.message,
        listId: endorsementList.id,
      })
      throw new InternalServerErrorException(
        `Failed to lock endorsement list: ${error.message}`,
      )
    }
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
      this.logger.warn('Body missing openedDate or closedDate value.')
      throw new BadRequestException([
        'Body missing openedDate or closedDate value.',
      ])
    }
    if (list.openedDate >= list.closedDate) {
      this.logger.warn('openedDate can not be bigger than closedDate.')
      throw new BadRequestException([
        'openedDate can not be bigger than closedDate.',
      ])
    }
    if (new Date() >= list.closedDate) {
      this.logger.warn(
        'closedDate can not have already passed on creation of Endorsement List',
      )
      throw new BadRequestException([
        'closedDate can not have already passed on creation of Endorsement List',
      ])
    }
    this.logger.info(`Creating endorsement list: ${list.title}`)
    const ownerName = await this.fetchOwnerNameFromRegistry(list.owner)
    const endorsementList = await this.endorsementListModel.create({
      ...list,
      ownerName,
    })

    if (process.env.NODE_ENV === 'production') {
      await this.emailCreated(endorsementList)
    }

    return endorsementList
  }

  async findOpenListsTaggedGeneralPetition(query: any) {
    const dateOb = new Date()
    try {
      const where = {
        tags: { [Op.eq]: ENDORSEMENT_SYSTEM_GENERAL_PETITION_TAGS },
        openedDate: { [Op.lt]: dateOb },
        closedDate: { [Op.gt]: dateOb },
        adminLock: false,
      }
      return await this.findListsGenericQuery(query, where)
    } catch (error) {
      this.logger.warn('findOpenListsTaggedGeneralPetition not found')
      throw new NotFoundException()
    }
  }

  async findSingleOpenListTaggedGeneralPetition(
    listId: string,
  ): Promise<EndorsementList | null> {
    const dateOb = new Date()
    const result = await this.endorsementListModel.findOne({
      where: {
        id: listId,
        tags: ENDORSEMENT_SYSTEM_GENERAL_PETITION_TAGS,
        openedDate: { [Op.lt]: dateOb },
        closedDate: { [Op.gt]: dateOb },
        adminLock: false,
      },
    })
    if (!result) {
      this.logger.warn('findSingleOpenListTaggedGeneralPetition not found')
      throw new NotFoundException()
    }
    return result
  }

  async getOwnerInfo(listId: string, owner?: string): Promise<string> {
    this.logger.info(`Finding single endorsement lists by id "${listId}"`)
    if (!owner) {
      const endorsementList = await this.endorsementListModel.findOne({
        where: {
          id: listId,
        },
      })
      if (!endorsementList) {
        this.logger.warn('This endorsement list does not exist.')
        throw new NotFoundException(['This endorsement list does not exist.'])
      }
      owner = endorsementList.owner
      // Use stored ownerName if available
      if (endorsementList.ownerName) {
        return endorsementList.ownerName
      }
    }

    try {
      const person = await this.nationalRegistryApiV3.getName(owner)
      return person?.fulltNafn ? person.fulltNafn : ''
    } catch (error) {
      this.logger.error('Failed to fetch owner name from NationalRegistry', {
        error: error.message,
        listId,
      })
      return ''
    }
  }

  async createDocumentBuffer(
    endorsementList: any,
    ownerName: string,
  ): Promise<Buffer> {
    const doc = new PDFDocument({ margin: 60 })
    const locale = 'is-IS'
    const buffers: Buffer[] = []
    doc.on('data', buffers.push.bind(buffers))
    doc.on('end', () =>
      this.logger.info(
        'PDF buffer created successfully for list id ' + endorsementList.id,
        { listId: endorsementList.id },
      ),
    )

    const regularFontPath = path.join(
      process.cwd(),
      'apps/services/endorsements/api/src/assets/ibm-plex-sans-v7-latin-regular.ttf',
    )
    const boldFontPath = path.join(
      process.cwd(),
      'apps/services/endorsements/api/src/assets/ibm-plex-sans-v7-latin-600.ttf',
    )
    const headerImagePath = path.join(
      process.cwd(),
      'apps/services/endorsements/api/src/assets/thjodskra.png',
    )
    const footerImagePath = path.join(
      process.cwd(),
      'apps/services/endorsements/api/src/assets/island.png',
    )

    doc.registerFont('Regular', regularFontPath)
    doc.registerFont('Bold', boldFontPath)

    // Add header image
    const headerImageHeight = 40
    doc.image(headerImagePath, 52, 40, { width: 120 })

    let currentYPosition = 40 + headerImageHeight + 30

    // Title and petition details
    doc
      .font('Bold')
      .fontSize(24)
      .text('Upplýsingar um undirskriftalista', 60, currentYPosition, {
        align: 'left',
      })
    currentYPosition = doc.y + 20

    doc
      .font('Bold')
      .fontSize(12)
      .text(
        'Þetta skjal var framkallað sjálfvirkt þann: ',
        60,
        currentYPosition,
        {
          align: 'left',
        },
      )
    currentYPosition = doc.y + 5

    doc
      .font('Regular')
      .fontSize(12)
      .text(format(new Date(), 'dd.MM.yyyy HH:mm'), 60, currentYPosition, {
        align: 'left',
      })
    currentYPosition = doc.y + 15

    doc
      .font('Bold')
      .fontSize(12)
      .text('Heiti undirskriftalista: ', 60, currentYPosition, {
        align: 'left',
      })
    currentYPosition = doc.y + 5

    doc
      .font('Regular')
      .fontSize(12)
      .text(endorsementList.title, 60, currentYPosition, {
        align: 'left',
      })

    currentYPosition = doc.y + 15

    doc
      .font('Bold')
      .fontSize(12)
      .text('Um undirskriftalista: ', 60, currentYPosition, { align: 'left' })
    currentYPosition = doc.y + 5

    doc
      .font('Regular')
      .fontSize(12)
      .text(endorsementList.description, 60, currentYPosition, {
        align: 'left',
      })
    currentYPosition = doc.y + 15

    doc
      .font('Bold')
      .fontSize(12)
      .text('Opinn til: ', 60, currentYPosition, { align: 'left' })
    currentYPosition = doc.y + 5

    doc
      .font('Regular')
      .fontSize(12)
      .text(
        endorsementList.closedDate.toLocaleDateString(locale),
        60,
        currentYPosition,
        { align: 'left' },
      )
    currentYPosition = doc.y + 15

    doc
      .font('Bold')
      .fontSize(12)
      .text('Fjöldi undirskrifta: ', 60, currentYPosition, { align: 'left' })
    currentYPosition = doc.y + 5

    doc
      .font('Regular')
      .fontSize(12)
      .text(endorsementList.endorsementCount.toString(), 60, currentYPosition, {
        align: 'left',
      })
    currentYPosition = doc.y + 15

    doc
      .font('Bold')
      .fontSize(12)
      .text('Ábyrgðarmaður: ', 60, currentYPosition, { align: 'left' })
    currentYPosition = doc.y + 5

    doc
      .font('Regular')
      .fontSize(12)
      .text(ownerName, 60, currentYPosition, { align: 'left' })
    currentYPosition = doc.y + 15

    doc
      .font('Bold')
      .fontSize(12)
      .text('Kennitala ábyrgðarmanns: ', 60, currentYPosition, {
        align: 'left',
      })
    currentYPosition = doc.y + 5

    doc
      .font('Regular')
      .fontSize(12)
      .text(nationalId.format(endorsementList.owner), 60, currentYPosition, {
        align: 'left',
      })
    currentYPosition = doc.y + 50

    const dateX = 60 // Column X position for 'Dags. skráð'
    const nameX = 160 // Column X position for 'Nafn'
    const localityX = 360 // Column X position for 'Sveitarfélag'

    // Table headers drawing function
    const drawTableHeaders = () => {
      doc.font('Bold').fontSize(12)
      doc.text('Dags. skráð', dateX, currentYPosition, {
        width: 100,
        align: 'left',
      })
      doc.text('Nafn', nameX, currentYPosition, { width: 200, align: 'left' })
      doc.text('Sveitarfélag', localityX, currentYPosition, {
        width: 200,
        align: 'left',
      })
      currentYPosition = doc.y + 5 // Adjust space between header and rows
    }

    // Endorsements List (Rows)
    drawTableHeaders()
    endorsementList.endorsements.forEach((endorsement: Endorsement) => {
      if (doc.y + 20 > doc.page.height - 100) {
        // Add a new page if content is about to overflow
        doc.addPage()
        currentYPosition = 60 // Reset Y-position for the new page
        drawTableHeaders() // Draw table headers at the top of the new page
      }

      // Draw the endorsement data
      doc.font('Regular').fontSize(10)
      doc.text(
        endorsement.created.toLocaleDateString(locale),
        dateX,
        currentYPosition,
        { width: 100, align: 'left' },
      )
      doc.text(
        endorsement.meta.fullName || 'Nafn ótilgreint',
        nameX,
        currentYPosition,
        { width: 200, align: 'left' },
      )
      doc.text(
        endorsement.meta.locality || 'Sveitafélag ótilgreint',
        localityX,
        currentYPosition,
        { width: 200, align: 'left' },
      )

      currentYPosition = doc.y + 5 // Move down slightly for the next row
    })

    // Add footer image at the bottom of the page
    const footerY = doc.page.height - 60
    doc.image(footerImagePath, 60, footerY, { width: 120 })

    const stream = new PassThrough()
    doc.pipe(stream)
    doc.end()
    return await getStream.buffer(stream)
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
      this.logger.warn('This endorsement list does not exist.')
      throw new NotFoundException(['This endorsement list does not exist.'])
    }
    const ownerName = await this.getOwnerInfo(
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
        subject: `Undirskriftalisti "${endorsementList?.title}"`,
        template: {
          title: `Undirskriftalisti "${endorsementList?.title}"`,
          body: [
            {
              component: 'Heading',
              context: {
                copy: `Undirskriftalisti "${endorsementList?.title}"`,
                small: true,
              },
            },
            { component: 'Copy', context: { copy: 'Sæl/l/t', small: true } },
            {
              component: 'Copy',
              context: {
                copy: `Meðfylgjandi er undirskriftalisti "${endorsementList?.title}",
                sem ${ownerName} er skráður ábyrgðarmaður fyrir.`,
                small: true,
              },
            },
            {
              component: 'Copy',
              context: {
                copy: `Vakin er athygli á lögum um persónuvernd og vinnslu persónuupplýsinga nr. 90/2018.`,
                small: true,
              },
            },
            {
              component: 'Copy',
              context: { copy: 'Kær kveðja,', small: true },
            },
            { component: 'Copy', context: { copy: 'Ísland.is', small: true } },
          ],
        },
        attachments: [
          {
            filename: 'Undirskriftalisti.pdf',
            content: await this.createDocumentBuffer(
              endorsementList,
              ownerName,
            ),
          },
        ],
      })
      return { success: true }
    } catch (error) {
      this.logger.error('Failed to send PDF email', {
        error: error.message,
        listId,
        recipientEmail,
      })
      return { success: false }
    }
  }

  getOwnerContact(obj: any, search: string): string {
    for (const [key, value] of Object.entries(obj)) {
      if (key === search) {
        return value as string
      }
    }
    this.logger.warn('This endorsement list does not include owner email.')
    throw new NotFoundException([
      'This endorsement list does not include owner email.',
    ])
  }

  async emailLock(
    endorsementList: EndorsementList,
  ): Promise<{ success: boolean }> {
    if (!endorsementList) {
      this.logger.warn('This endorsement list does not exist.')
      throw new NotFoundException(['This endorsement list does not exist.'])
    }
    const recipientEmail = this.getOwnerContact(endorsementList.meta, 'email')
    const ownerName = await this.getOwnerInfo(
      endorsementList?.id,
      endorsementList.owner,
    )
    this.logger.info(
      `sending list ${endorsementList.id} to ${recipientEmail} from ${environment.email.sender}`,
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
        subject: `Undirskriftalista "${endorsementList?.title} hefur verið læst"`,
        template: {
          title: `Undirskriftalisti "${endorsementList?.title}"`,
          body: [
            {
              component: 'Heading',
              context: {
                copy: `Undirskriftalisti "${endorsementList?.title}"`,
                small: true,
              },
            },
            { component: 'Copy', context: { copy: 'Sæl/l/t', small: true } },
            {
              component: 'Copy',
              context: {
                copy: `Undirskriftalista "${endorsementList?.title}" sem, ${ownerName}
                er skráður ábyrgðarmaður fyrir, hefur verið læst af þjónustuaðila kerfisins hjá Þjóðskrá Íslands
                og er því ekki aðgengilegur inn á Ísland.is. Metið hefur verið að listinn uppfyllir ekki skilmála undirskriftalista.`,
                small: true,
              },
            },
            {
              component: 'Copy',
              context: { copy: 'Kær kveðja,', small: true },
            },
            { component: 'Copy', context: { copy: 'Ísland.is', small: true } },
          ],
        },
      })
      return { success: true }
    } catch (error) {
      this.logger.error('Failed to send creation notification email', {
        error: error.message,
        listId: endorsementList.id,
      })
      return { success: false }
    }
  }

  async emailCreated(
    endorsementList: EndorsementList,
  ): Promise<{ success: boolean }> {
    if (!endorsementList) {
      this.logger.warn('This endorsement list does not exist.')
      throw new NotFoundException(['This endorsement list does not exist.'])
    }
    const locale = 'is-IS'
    const ownerEmail = this.getOwnerContact(endorsementList.meta, 'email')
    const ownerPhone = this.getOwnerContact(endorsementList.meta, 'phone')
    const ownerName = await this.getOwnerInfo(
      endorsementList?.id,
      endorsementList.owner,
    )
    this.logger.info(
      `sending new list ${endorsementList.id} to urtok@skra.is from ${environment.email.sender}`,
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
            name: 'urtok@skra.is',
            address: 'urtok@skra.is',
          },
        ],
        subject: `Nýr undirskriftalisti  hefur verið stofnaður`,
        template: {
          title: `Undirskriftalisti "${endorsementList?.title}"`,
          body: [
            {
              component: 'Heading',
              context: {
                copy: `Undirskriftalisti "${endorsementList?.title}"`,
                small: true,
              },
            },
            {
              component: 'Copy',
              context: {
                copy: `Lýsing: ${endorsementList?.description}`,
                small: true,
              },
            },
            {
              component: 'Copy',
              context: {
                copy: `Gildistímabil lista: ${
                  endorsementList.openedDate.toLocaleDateString(locale) +
                  ' - ' +
                  endorsementList.closedDate.toLocaleDateString(locale)
                }`,
                small: true,
              },
            },
            {
              component: 'Copy',
              context: {
                copy: `Stofnandi lista: ${ownerName}`,
                small: true,
              },
            },
            {
              component: 'Copy',
              context: {
                copy: `Kennitala stofnenda: ${endorsementList.owner}`,
                small: true,
              },
            },
            {
              component: 'Copy',
              context: {
                copy: `Netfang stofnenda: ${ownerEmail}`,
                small: true,
              },
            },
            {
              component: 'Copy',
              context: {
                copy: `Sími stofnenda: ${ownerPhone}`,
                small: true,
              },
            },
            {
              component: 'Copy',
              context: { copy: 'Kær kveðja,', small: true },
            },
            { component: 'Copy', context: { copy: 'Ísland.is', small: true } },
          ],
        },
      })
      return { success: true }
    } catch (error) {
      this.logger.error('Failed to send creation notification email', {
        error: error.message,
        listId: endorsementList.id,
      })
      return { success: false }
    }
  }
  async exportList(
    listId: string,
    user: User,
    fileType: 'pdf' | 'csv',
  ): Promise<EndorsementListExportUrlResponse> {
    try {
      if (!['pdf', 'csv'].includes(fileType)) {
        throw new BadRequestException(
          `Invalid file type. Allowed values are "pdf" or "csv"`,
        )
      }

      const endorsementList = await this.fetchEndorsementList(listId, user)
      if (!endorsementList) {
        throw new NotFoundException(
          `Endorsement list ${listId} not found or access denied`,
        )
      }

      const fileBuffer =
        fileType === 'pdf'
          ? await this.createPdfBuffer(endorsementList)
          : this.createCsvBuffer(endorsementList)

      const filename = `undirskriftalisti-${listId}-${new Date()
        .toISOString()
        .replace(/[:.]/g, '-')}.${fileType}`

      await this.uploadFileToS3(fileBuffer, filename, fileType)

      const url = await this.s3Service.getPresignedUrl({
        bucket: environment.exportsBucketName,
        key: filename,
      })

      return { url }
    } catch (error) {
      this.logger.error('Failed to export list', {
        error: error.message,
        listId,
        fileType,
      })

      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error // Re-throw validation errors
      }

      throw new InternalServerErrorException(
        `Failed to export list: ${error.message}`,
      )
    }
  }

  private async fetchEndorsementList(
    listId: string,
    user: User,
  ): Promise<EndorsementList | null> {
    // Only admin or list owner can access the list
    const isAdmin = this.hasAdminScope(user)
    return this.endorsementListModel.findOne({
      where: {
        id: listId,
        ...(isAdmin ? {} : { owner: user.nationalId }),
      },
      include: [{ model: Endorsement }],
    })
  }

  private createCsvBuffer(endorsementList: EndorsementList): Buffer {
    const records = (endorsementList.endorsements || []).map((endorsement) => ({
      Dagsetning: endorsement.created.toLocaleDateString('is-IS'),
      Nafn: endorsement.meta?.fullName || 'Nafn ótilgreint',
      Sveitafélag: endorsement.meta?.locality || 'Sveitafélag ótilgreint',
    }))
    const csvString = csvStringify(records, { header: true })
    return Buffer.from(csvString, 'utf-8')
  }

  private async createPdfBuffer(
    endorsementList: EndorsementList,
  ): Promise<Buffer> {
    try {
      const ownerName = await this.getOwnerInfo(
        endorsementList.id,
        endorsementList.owner,
      )
      const pdfBuffer = await this.createDocumentBuffer(
        endorsementList,
        ownerName,
      )

      if (!Buffer.isBuffer(pdfBuffer)) {
        throw new InternalServerErrorException(
          'Generated PDF is not a valid buffer',
        )
      }

      return pdfBuffer
    } catch (error) {
      this.logger.error('Failed to create PDF buffer', {
        error: error.message,
        listId: endorsementList.id,
      })
      throw new InternalServerErrorException(
        `Failed to generate PDF: ${error.message}`,
      )
    }
  }

  private async uploadFileToS3(
    fileBuffer: Buffer,
    filename: string,
    fileType: 'pdf' | 'csv',
  ): Promise<void> {
    try {
      if (!environment.exportsBucketName) {
        throw new InternalServerErrorException('S3 bucket name is undefined')
      }

      await this.s3Service.uploadFile(
        fileBuffer,
        { bucket: environment.exportsBucketName, key: filename },
        { ContentType: fileType === 'pdf' ? 'application/pdf' : 'text/csv' },
      )
    } catch (error) {
      this.logger.error('Failed to upload file to S3', {
        error: error.message,
        filename,
        bucketName: environment.exportsBucketName,
      })
      throw new InternalServerErrorException(
        `Failed to upload file to S3: ${error.message}`,
      )
    }
  }

  private async fetchOwnerNameFromRegistry(
    nationalId: string,
  ): Promise<string> {
    try {
      const person = await this.nationalRegistryApiV3.getName(nationalId)
      return person?.fulltNafn ? person.fulltNafn : ''
    } catch (error) {
      this.logger.error('Failed to fetch owner name from NationalRegistry', {
        error: error.message,
        nationalId,
      })
      return ''
    }
  }
}
