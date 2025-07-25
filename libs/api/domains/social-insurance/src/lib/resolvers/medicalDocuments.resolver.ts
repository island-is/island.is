import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  type User,
} from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'
import { UseGuards } from '@nestjs/common'
import { Query, Resolver } from '@nestjs/graphql'
import { CertificateForSicknessAndRehabilitation } from '../models/medicalDocuments/certificateForSicknessAndRehabilitation.model'
import { RehabilitationPlan } from '../models/medicalDocuments/rehabilitationPlan.model'
import { SocialInsuranceService } from '../socialInsurance.service'

@Resolver()
@UseGuards(IdsUserGuard, ScopesGuard)
@Audit({ namespace: '@island.is/api/social-insurance' })
@Scopes(ApiScope.internal)
export class MedicalDocumentsResolver {
  constructor(private readonly service: SocialInsuranceService) {}

  @Query(() => RehabilitationPlan, {
    name: 'socialInsuranceRehabilitationPlan',
  })
  async siaGetRehabilitationPlan(@CurrentUser() user: User) {
    return this.service.getRehabilitationPlan(user)
  }

  @Query(() => CertificateForSicknessAndRehabilitation, {
    name: 'socialInsuranceCertificateForSicknessAndRehabilitation',
  })
  async siaGetCertificateForSicknessAndRehabilitation(
    @CurrentUser() user: User,
  ) {
    return this.service.getCertificateForSicknessAndRehabilitation(user)
  }
}
