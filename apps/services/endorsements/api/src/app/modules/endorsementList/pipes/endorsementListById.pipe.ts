import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common'

import { EndorsementList } from '../endorsementList.model'
import { EndorsementListService } from '../endorsementList.service'

@Injectable()
export class EndorsementListByIdPipe
  implements PipeTransform<string, Promise<EndorsementList>> {
  constructor(
    private readonly endorsementListService: EndorsementListService,
  ) {}

  async transform(id: string): Promise<EndorsementList> {
    const endorsementList = await this.endorsementListService.findSingleList(id)

    if (!endorsementList) {
      throw new NotFoundException(
        `An endorsement list with the id ${id} does not exist`,
      )
    }
    return endorsementList
  }
}
