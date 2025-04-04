import { Inject, Injectable } from '@nestjs/common'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'
import { SharedTemplateApiService } from '../../shared'

const LOGGING_CATEGORY = 'LegalGazetteTemplateService'

type OptionType = {
  label: string
  value: string
}

@Injectable()
export class LegalGazetteTemplateService extends BaseTemplateApiService {
  private applicationTypes = [
    { label: 'Áskorun', value: 'almenn-auglysing' },
    { label: 'Dómsbirting', value: 'almenn-auglysing' },
    { label: 'Embætti, sýslanir, leyfi o.fl.', value: 'almenn-auglysing' },
    {
      label: 'Fasteigna-, fyrirtækja- og skipasala',
      value: 'almenn-auglysing',
    },
    { label: 'Félagsslit', value: 'almenn-auglysing' },
    { label: 'Firmaskrá', value: 'firmaskra' },
    { label: 'Fjármálastarfsemi', value: 'almenn-auglysing' },
    { label: 'Framhald uppboðs', value: 'almenn-auglysing' },
    { label: 'Fyrirkall', value: 'almenn-auglysing' },
    { label: 'Greiðsluaðlögun', value: 'almenn-auglysing' },
    { label: 'Greiðsluáskorun', value: 'almenn-auglysing' },
    { label: 'Happdrætti', value: 'almenn-auglysing' },
    { label: 'Hlutafélög', value: 'almenn-auglysing' },
    { label: 'Húsbréf', value: 'almenn-auglysing' },
    { label: 'Innköllun dánarbú', value: 'innkollun-danarbu' },
    { label: 'Innköllun þrotabú', value: 'innkollun-throtabu' },
    { label: 'Kaupmáli', value: 'almenn-auglysing' },
    { label: 'Laus störf, stöður, embætti o.fl.', value: 'almenn-auglysing' },
    { label: 'Mat á umhverfisáhrifum', value: 'almenn-auglysing' },
    { label: 'Nauðasamningar', value: 'almenn-auglysing' },
    { label: 'Nauðungarsala', value: 'naudungarsala' },
    { label: 'Skiptafundur', value: 'skiptafundur' },
    { label: 'Skiptalok', value: 'skiptalok' },
    { label: 'Skipulagsauglýsing', value: 'almenn-auglysing' },
    { label: 'Starfsleyfi', value: 'almenn-auglysing' },
    { label: 'Stefna', value: 'almenn-auglysing' },
    { label: 'Svipting fjárræðis', value: 'almenn-auglysing' },
    { label: 'Umferðarauglýsinga', value: 'almenn-auglysing' },
    { label: 'Vátryggingastarfsemi', value: 'almenn-auglysing' },
    { label: 'Veðhafafundur', value: 'almenn-auglysing' },
    { label: 'Ýmsar auglýsingar frá ráðuneytum', value: 'almenn-auglysing' },
    { label: 'Ýmsar auglýsingar og tilkynningar', value: 'almenn-auglysing' },
  ]
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {
    super(ApplicationTypes.LEGAL_GAZETTE)
  }
  async getUserLegalEntities(): Promise<OptionType[]> {
    try {
      return [
        {
          label: 'Mock lögfræðistofa ehf.',
          value: '1111110000',
        },
        {
          label: 'Gervimaður Færeyjar',
          value: '0101302399',
        },
      ]
    } catch (error) {
      this.logger.error('Failed to get user legal entities', {
        category: LOGGING_CATEGORY,
        error,
      })
      throw error
    }
  }

  async getAdvertTypes(): Promise<OptionType[]> {
    try {
      return this.applicationTypes
    } catch (error) {
      this.logger.error('Failed to get advert types', {
        category: LOGGING_CATEGORY,
        error,
      })
      throw error
    }
  }

  async getUserRecentlySelectedAdvertTypes(): Promise<OptionType[]> {
    try {
      const count = Math.random() * 5
      const recents = []

      for (let i = 0; i < count; i++) {
        recents.push(
          this.applicationTypes[
            Math.floor(Math.random() * this.applicationTypes.length)
          ],
        )
      }

      return recents
    } catch (error) {
      this.logger.error('Failed to get user recently selected advert types', {
        category: LOGGING_CATEGORY,
        error,
      })
      throw error
    }
  }
}
