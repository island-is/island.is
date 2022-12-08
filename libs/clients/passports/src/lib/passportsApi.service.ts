import { AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { NationalRegistryClientService } from '@island.is/clients/national-registry-v2'
import { XRoadConfig, ConfigType } from '@island.is/nest/config'
import { Injectable, Inject } from '@nestjs/common'
import { IdentityDocumentApi, PreregistrationApi } from '../../gen/fetch'
import {
  IdentityDocument,
  IdentityDocumentChild,
  Passport,
  PreregistrationInput,
} from './passportsApi.types'
import { mapChildPassports, mapPassports } from './passportsApi.utils'

@Injectable()
export class PassportsService {
  constructor(
    @Inject(XRoadConfig.KEY)
    private xroadConfig: ConfigType<typeof XRoadConfig>,
    private identityDocumentApi: IdentityDocumentApi,
    private preregistrationApi: PreregistrationApi,
    private individualApi: NationalRegistryClientService,
  ) {}

  async getPassports(user: User): Promise<IdentityDocument[]> {
    const identityDocuments = await this.identityDocumentApi
      .withMiddleware(new AuthMiddleware(user))
      .identityDocumentGetIdentityDocument({
        xRoadClient: this.xroadConfig.xRoadClient,
      })
    return identityDocuments.map(mapPassports)
  }

  async getChildPassports(user: User): Promise<IdentityDocumentChild[]> {
    const identityDocuments: IdentityDocumentChild[] = await this.identityDocumentApi
      .withMiddleware(new AuthMiddleware(user))
      .identityDocumentGetChildrenIdentityDocument({
        xRoadClient: this.xroadConfig.xRoadClient,
      })
      .then((res) =>
        res.filter((child) => !!child.childrenSSN).map(mapChildPassports),
      )

    const children = await Promise.all(
      identityDocuments?.map(
        async (passports): Promise<IdentityDocumentChild> => {
          const individual = await this.individualApi.getIndividual(
            passports.nationalId,
          )
          return {
            ...passports,
            name: individual?.name,
          } as IdentityDocumentChild
        },
      ),
    )

    return children
  }

  async preregisterIdentityDocument(
    user: User,
    input: PreregistrationInput,
  ): Promise<string[]> {
    console.log('inClient', input)
    return await this.preregistrationApi
      .withMiddleware(new AuthMiddleware(user))
      .preregistrationPreregistration({
        xRoadClient: this.xroadConfig.xRoadClient,
        preregistration: input,
      })
  }

  async getCurrentPassport(user: User): Promise<Passport> {
    const userPassports = await this.getPassports(user)
    const childPassports = await this.getChildPassports(user)
    const userPassport: IdentityDocument | null =
      userPassports
        .filter(
          (passport) => passport.subType === 'A' && !!passport.expirationDate,
        )
        .sort(
          (a, b) => b?.expirationDate.getDate() - a.expirationDate.getDate(),
        )
        .pop() || null

    return {
      userPassport: userPassport || undefined,
      childPassports: childPassports,
    }
  }
}
