import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { FetchError } from '@island.is/clients/middlewares'
import { Inject, Injectable } from '@nestjs/common'
import {
  FirearmApplicationApi,
  FirearmPropertyList,
  LicenseInfo,
} from '../../../gen/fetch'
import {
  FIREARM_APPLICATION_API,
  FirearmCategories,
  Result,
} from '../firearmApi.types'

@Injectable()
export class FirearmApi {
  constructor(
    @Inject(FIREARM_APPLICATION_API)
    private readonly api: FirearmApplicationApi,
  ) {}

  private handleError(e: Error): Result<null> {
    //404 - no license for user, still ok!
    let error
    if (e instanceof FetchError) {
      //404 - no license for user, still ok!
      if (e.status === 404) {
        return {
          ok: true,
          data: null,
        }
      } else {
        error = {
          code: 13,
          message: 'Service failure',
          data: JSON.stringify(e.body),
        }
      }
    } else {
      const unknownError = e as Error
      error = {
        code: 99,
        message: 'Unknown error',
        data: JSON.stringify(unknownError),
      }
    }

    return {
      ok: false,
      error,
    }
  }

  private firearmApiWithAuth = (user: User) =>
    this.api.withMiddleware(new AuthMiddleware(user as Auth))

  public async getLicenseInfo(user: User): Promise<Result<LicenseInfo | null>> {
    /*const licenseInfo: Result<LicenseInfo | null> =
      await this.firearmApiWithAuth(user)
        .apiFirearmApplicationLicenseInfoGet()
        .then((data) => {
          const result: Result<LicenseInfo> = {
            ok: true,
            data,
          }
          return result
        })
        .catch((e) => this.handleError(e))

        return licenseInfo*/

    return {
      ok: true,
      data: {
        ssn: '9742',
        name: 'Bubbi byssukall',
        expirationDate: '2030-04-22T15:30:23Z',
        issueDate: '2017-04-22T15:30:23Z',
        licenseNumber: '987654321',
        qualifications: 'ABCD',
        collectorLicenseExpirationDate: '2017-04-22T15:30:23Z',
        address: 'Hvergigata 8',
      },
    }
  }

  public async getPropertyInfo(
    user: User,
  ): Promise<Result<FirearmPropertyList | null>> {
    /*const propertyInfo: Result<FirearmPropertyList | null> =
      await this.firearmApiWithAuth(user)
        .apiFirearmApplicationPropertyInfoGet()
        .then((data) => {
          const result: Result<FirearmPropertyList> = {
            ok: true,
            data,
          }
          return result
        })
        .catch((e) => this.handleError(e))

        return propertyInfo*/

    return {
      ok: true,
      data: {
        licenseNumber: '987654321',
        properties: [
          {
            category: 'A',
            typeOfFirearm: 'cannon',
            name: 'Howitzer',
            serialNumber: '1337',
            caliber: 'vverylarge',
            landsnumer: '999',
            limitation: 'aint no brakes',
          },
          {
            category: 'B',
            typeOfFirearm: 'laserrailgun',
            name: 'Macguffin',
            serialNumber: '010101',
            caliber: '2cm',
            landsnumer: '9123',
            limitation: 'imagination',
          },
        ],
      },
    }
  }
  public async getCategories(
    user: User,
  ): Promise<Result<FirearmCategories | null>> {
    /*const categories = await this.firearmApiWithAuth(user)
      .apiFirearmApplicationCategoriesGet()
      .then((data) => {
        const result: Result<FirearmCategories> = {
          ok: true,
          data,
        }
        return result
      })
      .catch((e) => this.handleError(e))

      return categories*/

    return {
      ok: true,
      data: {
        'Flokkur A':
          '1. Haglabyssum nr. 12 og minni, þó eigi sjálfvirkum eða hálfsjálfvirkum.\n2. Rifflum cal. 22 (long rifle og minni), þ.m.t. loftrifflum, þó eigi sjálfvirkum eða hálfsjálfvirkum.',
        'Flokkur B':
          'Leyfi fyrir rifflum með hlaupvídd allt að cal. 30 og hálfsjálfvirkum haglabyssum skal ekki veitt nema sérstakar ástæður mæli með því, enda hafi umsækjandi haft skotvopnaleyfi í a.m.k. eitt ár.',
        'Flokkur C':
          'Leyfi fyrir skotvopnum sem sérstaklega eru ætluð til minkaveiða eða meindýraeyðingar (t.d. skammbyssur fyrir haglaskot) má aðeins veita að fenginni umsögn veiðistjóra. Áskilið er að umsækjandi hafi haft aukin skotvopnaréttindi (B flokkur) í eitt ár. Slík leyfi vegna þeirra sem stunda minkaveiðar skal ekki veita til að eignast skotvopn heldur einungis til láns eða leigu. Lögreglustjóri skal senda slíkar umsóknir með umsögn sinni ríkislögreglustjóra til ákvörðunar.',
        'Flokkur D':
          'Leyfi sem sérstaklega er veitt einstaklingi eða skotfélagi fyrir skammbyssum vegna íþróttaskotfimi sbr. 11. gr. Lögreglustjóri skal senda slíkar umsóknir með umsögn sinni ríkislögreglustjóra til ákvörðunar.',
        'Flokkur E':
          'Leyfi lögreglustjóra til að hlaða skothylki til eigin nota í þau skotvopn sem viðkomandi hefur leyfi fyrir, enda sé að öðru leyti heimilt að nota slík skotfæri hér á landi.',
        'Flokkur S':
          'Söfnunarleyfi sbr. 20. gr. Reglugerð um skotvopn, skotfæri o.fl.',
      },
    }
  }
}
