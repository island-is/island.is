import {
  AuthMiddleware,
  CurrentUser,
  IdsAuthGuard,
  IdsUserGuard,
  Scopes,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'
import { UseGuards } from '@nestjs/common'
import { Query, Resolver } from '@nestjs/graphql'
import { RettindiFyrirIslandIsApi } from '@island.is/clients/district-commissioners-licenses'
import { ApiScope } from '@island.is/auth/scopes'
import { OccupationalLicenseV2 } from './models/occupationalLicense.model'
import { isDefined } from '@island.is/shared/utils'

@UseGuards(IdsUserGuard, IdsAuthGuard)
@Scopes(ApiScope.internal)
@Resolver()
export class OccupationalLicensesV2Resolver {
  constructor(private readonly api: RettindiFyrirIslandIsApi) {}

  @Query(() => [OccupationalLicenseV2], {
    name: 'occupationalLicenseV2',
    nullable: true,
  })
  @Audit()
  async occupationalLicenses(
    @CurrentUser() user: User,
  ): Promise<Array<OccupationalLicenseV2> | null> {
    const res = await this.api
      .withMiddleware(new AuthMiddleware(user))
      .rettindiFyrirIslandIsGet({ kennitala: user.nationalId })

    if (!res) {
      return null
    }

    return (
      res.leyfi
        ?.map((l) => {
          if (!l.audkenni) {
            return null
          }

          return {
            id: l.audkenni,
            title: l.titill,
            status: l.stada?.titill,
            validFrom: l.utgafudagur,
            issuer: l.utgefandi?.titill,
          }
        })
        .filter(isDefined) ?? []
    )
  }
}
