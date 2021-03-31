import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { SignatureList } from './signatureList.model'
import { SignatureListDto } from './dto/signatureList.dto'
import { Signature } from '../signature/signature.model'
import { Op } from 'sequelize'

interface createInput extends SignatureListDto {
  owner: string
}
@Injectable()
export class SignatureListService {
  constructor(
    @InjectModel(SignatureList)
    private signatureListModel: typeof SignatureList,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  async findListsByTag(tag: string) {
    this.logger.debug(`Finding signature lists by tag "${tag}"`)
    // TODO: Add option to get only open signature lists
    return this.signatureListModel.findAll({
      where: { tags: { [Op.contains]: [tag] } },
    })
  }

  async findSingleList(id: string) {
    this.logger.debug(`Finding single signature lists by id "${id}"`)
    return this.signatureListModel.findOne({
      where: { id },
    })
  }

  async findSingleListSignatures(id: string) {
    this.logger.debug(
      `Finding signatures form single signature lists by id "${id}"`,
    )
    return this.signatureListModel.findOne({
      include: [{ model: Signature, as: 'signatures' }],
      where: { id },
    })
  }

  async close(id: string): Promise<SignatureList | null> {
    this.logger.debug('Closing signature list')
    const [_, signatureLists] = await this.signatureListModel.update(
      { closedDate: new Date() },
      { where: { id }, returning: true },
    )

    return signatureLists[0] ?? null
  }

  async create(list: createInput) {
    this.logger.debug('Creating signature list')
    return this.signatureListModel.create({
      title: list.title,
      description: list.description,
      signatureMeta: list.signatureMeta,
      tags: list.tags,
      validationRules: JSON.stringify(list.validationRules),
      owner: list.owner,
    })
  }
}
