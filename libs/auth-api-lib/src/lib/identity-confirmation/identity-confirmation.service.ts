import { Injectable } from '@nestjs/common'
import { IdentityConfirmationInputDto } from './dto/IdentityConfirmationInput.dto'
import { InjectModel } from '@nestjs/sequelize'
import { IdentityConfirmation } from './models/Identity-Confirmation.model'
import { ZendeskService } from '@island.is/clients/zendesk'

@Injectable()
export class IdentityConfirmationService {
  constructor(
    @InjectModel(IdentityConfirmation)
    private identityConfirmationModel: typeof IdentityConfirmation,
    private readonly zendeskService: ZendeskService,
  ) {}

  async identityConfirmation({
    id,
    type,
  }: IdentityConfirmationInputDto): Promise<string> {
    return `This action returns a #${id} identityConfirmation of type ${type}`
  }
}
