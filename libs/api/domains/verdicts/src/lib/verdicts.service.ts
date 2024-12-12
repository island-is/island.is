import { Injectable } from '@nestjs/common'
import { VerdictsClientService } from '@island.is/clients/verdicts'

@Injectable()
export class VerdictsService {
  constructor(private readonly verdictsClientService: VerdictsClientService) {}
}
