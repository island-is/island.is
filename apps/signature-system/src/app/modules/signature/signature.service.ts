import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Signature } from './signature.model'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { Op } from 'sequelize'

interface FindSignaturesByNationalIdInput {
  nationalId: string
  listId?: string
}

interface CreateSignatureOnListInput {
  listId: string
  nationalId: string
}

interface DeleteFromListByNationalIdInput {
  listId: string
  nationalId: string
}
@Injectable()
export class SignatureService {
  constructor (
    @InjectModel(Signature)
    private signatureModel: typeof Signature,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  async findSignaturesByNationalId ({
    nationalId,
    listId,
  }: FindSignaturesByNationalIdInput): Promise<Signature[]> {
    this.logger.debug(
      `Finding signature in list "${listId}" by nationalId "${nationalId}"`,
    )

    // we get all signatures for given national id and optionally scope that to a list (returns single nationalId in the given list)
    const whereConditions: object[] = [
      { signaturee: nationalId },
      ...(listId ? [{ signatureListId: listId }] : []),
    ]

    return this.signatureModel.findAll({
      where: { [Op.and]: whereConditions },
    })
  }

  async createSignatureOnList ({
    listId,
    nationalId,
  }: CreateSignatureOnListInput): Promise<Signature> {
    this.logger.debug(`Creating resource with nationalId - ${nationalId}`)

    // TODO: Prevent this from adding multiple signatures to same list
    return this.signatureModel.create({
      signaturee: nationalId,
      signatureListId: listId,
      meta: [], // TODO: Add list metadata here
    })
  }

  async deleteFromListByNationalId ({
    nationalId,
    listId,
  }: DeleteFromListByNationalIdInput): Promise<number> {
    this.logger.debug(
      `Removing signature from list "${listId}" by nationalId "${nationalId}"`,
    )
    // TODO: Prevent this from deleting from a closed list
    return this.signatureModel.destroy({
      where: {
        signaturee: nationalId,
        signatureListId: listId,
      },
    })
  }
}
