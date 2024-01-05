import {
  Inject,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { EndorsementList } from '../endorsementList.model'
import { EndorsementListService } from '../endorsementList.service'
import type { EndorsementRequest } from '../../../../../types'
import type { User } from '@island.is/auth-nest-tools'

@Injectable()
export class EndorsementListByIdPipe
  implements PipeTransform<string, Promise<EndorsementList>>
{
  constructor(
    @Inject(REQUEST) private request: EndorsementRequest,
    private readonly endorsementListService: EndorsementListService,
  ) {}

  async transform(id: string): Promise<EndorsementList> {
    const endorsementList = await this.endorsementListService.findSingleList(
      id,
      this.request.auth as User,
      true,
    )
    if (!endorsementList) {
      throw new NotFoundException(
        `An endorsement list with the id ${id} does not exist`,
      )
    }
    return endorsementList
  }
}
