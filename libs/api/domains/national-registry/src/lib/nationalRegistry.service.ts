import * as kennitala from 'kennitala'
import some from 'lodash/some'
import { Injectable, ForbiddenException, Inject } from '@nestjs/common'

import { FamilyMember, FamilyChild, User, Gender, MaritalStatus } from './types'
import { NationalRegistryApi } from '@island.is/clients/national-registry-v1'
import { FamilyCorrectionInput } from './dto/FamilyCorrectionInput.input'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { FamilyCorrectionResponse } from './models'
import { SoffiaService } from './services/v1/soffia.service'

@Injectable()
export class NationalRegistryService {
  constructor(
    private soffiaService: SoffiaService
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}
    getUser = (nationalId: string) => this.soffiaService.getUser(nationalId)
    getFamily = (nationalId: string) => this.soffiaService.getFamily(nationalId)
    getFamilyMember = (nationalId: string, familyMemberNationalId: string) => this.soffiaService.getFamilyMemberDetails(nationalId, familyMemberNationalId)
    getChildren = (nationalId: string) => this.soffiaService.getChildren(nationalId)
}
