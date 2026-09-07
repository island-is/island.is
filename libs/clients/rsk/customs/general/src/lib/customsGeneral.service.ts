import { Inject, Injectable } from '@nestjs/common'
import {
  tollgengiGet1,
  abendiGet2,
  bonnGet3,
  gjoldGet4,
  leyfiGet5,
  tollarGet6,
  undanthagurGet7,
  urvinnslugjoldGet8,
  afhendingarskilmalarGet9,
  flutningsmatiGet10,
  geymslustadurGet11,
  kostnadurGet12,
  magntalaGet13,
  markadssvaediGet14,
  tegundAfgreidsluGet15,
  tegundVidskiptaGet16,
  landMyntGet17,
  tollmedferdGet18,
  umbudirGet19,
  uppruniGet20,
  valykillGet21,
  vidbotarskjolGet22,
  villurGet23,
  tollskrarLyklarGet24,
  akvordunarstadirGet25,
} from '../../gen/fetch'
import type {
  TollgengiGet1Data,
  AbendiGet2Data,
  BonnGet3Data,
  GjoldGet4Data,
  LeyfiGet5Data,
  TollarGet6Data,
  UndanthagurGet7Data,
  UrvinnslugjoldGet8Data,
  AfhendingarskilmalarGet9Data,
  FlutningsmatiGet10Data,
  GeymslustadurGet11Data,
  KostnadurGet12Data,
  MagntalaGet13Data,
  MarkadssvaediGet14Data,
  TegundAfgreidsluGet15Data,
  TegundVidskiptaGet16Data,
  LandMyntGet17Data,
  TollmedferdGet18Data,
  UmbudirGet19Data,
  UppruniGet20Data,
  ValykillGet21Data,
  VidbotarskjolGet22Data,
  VillurGet23Data,
  TollskrarLyklarGet24Data,
  AkvordunarstadirGet25Data,
} from '../../gen/fetch'
import type { Client } from '../../gen/fetch/client'
import { CUSTOMS_GENERAL_CLIENT } from './customsGeneral.apiConfig'

@Injectable()
export class CustomsGeneralClientService {
  constructor(
    @Inject(CUSTOMS_GENERAL_CLIENT) private readonly client: Client,
  ) {}

  /** Tollgengi - exchange rates from a reference date and system */
  getTollgengi(query: TollgengiGet1Data['query']) {
    return tollgengiGet1({ query, client: this.client })
  }

  /** Abendi - hints/pointers on tariff numbers from a reference date and system */
  getAbendi(query: AbendiGet2Data['query']) {
    return abendiGet2({ query, client: this.client })
  }

  /** Bonn - prohibition types from a reference date and system */
  getBonn(query: BonnGet3Data['query']) {
    return bonnGet3({ query, client: this.client })
  }

  /** Gjold - charge types from a reference date and system */
  getGjold(query: GjoldGet4Data['query']) {
    return gjoldGet4({ query, client: this.client })
  }

  /** Leyfi - permit types from a reference date and system */
  getLeyfi(query: LeyfiGet5Data['query']) {
    return leyfiGet5({ query, client: this.client })
  }

  /** Tollar - customs duty types from a reference date and system */
  getTollar(query: TollarGet6Data['query']) {
    return tollarGet6({ query, client: this.client })
  }

  /** Undanthagur - exemption types from a reference date and system */
  getUndanthagur(query: UndanthagurGet7Data['query']) {
    return undanthagurGet7({ query, client: this.client })
  }

  /** Urvinnslugjold - processing fees for tariff numbers from a reference date and number range */
  getUrvinnslugjold(query: UrvinnslugjoldGet8Data['query']) {
    return urvinnslugjoldGet8({ query, client: this.client })
  }

  /** Afhendingarskilmalar - delivery terms from a reference date and system */
  getAfhendingarskilmalar(query: AfhendingarskilmalarGet9Data['query']) {
    return afhendingarskilmalarGet9({ query, client: this.client })
  }

  /** Flutningsmati - transport modes from a reference date and system */
  getFlutningsmati(query: FlutningsmatiGet10Data['query']) {
    return flutningsmatiGet10({ query, client: this.client })
  }

  /** Geymslustadur - storage locations from a reference date and system */
  getGeymslustadur(query: GeymslustadurGet11Data['query']) {
    return geymslustadurGet11({ query, client: this.client })
  }

  /** Kostnadur - cost types from a reference date and system */
  getKostnadur(query: KostnadurGet12Data['query']) {
    return kostnadurGet12({ query, client: this.client })
  }

  /** Magntala - quantity unit types from a reference date and system */
  getMagntala(query: MagntalaGet13Data['query']) {
    return magntalaGet13({ query, client: this.client })
  }

  /** Markadssvaedi - market areas from a reference date */
  getMarkadssvaedi(query: MarkadssvaediGet14Data['query']) {
    return markadssvaediGet14({ query, client: this.client })
  }

  /** TegundAfgreidslu - procedure types from a reference date and system */
  getTegundAfgreidslu(query: TegundAfgreidsluGet15Data['query']) {
    return tegundAfgreidsluGet15({ query, client: this.client })
  }

  /** TegundVidskipta - transaction types from a reference date and system */
  getTegundVidskipta(query: TegundVidskiptaGet16Data['query']) {
    return tegundVidskiptaGet16({ query, client: this.client })
  }

  /** LandMynt - country and currency codes from a reference date */
  getLandMynt(query: LandMyntGet17Data['query']) {
    return landMyntGet17({ query, client: this.client })
  }

  /** Tollmedferd - customs procedure types from a reference date and system */
  getTollmedferd(query: TollmedferdGet18Data['query']) {
    return tollmedferdGet18({ query, client: this.client })
  }

  /** Umbudir - packaging types from a reference date and system */
  getUmbudir(query: UmbudirGet19Data['query']) {
    return umbudirGet19({ query, client: this.client })
  }

  /** Uppruni - origin types from a reference date */
  getUppruni(query: UppruniGet20Data['query']) {
    return uppruniGet20({ query, client: this.client })
  }

  /** Valykill - VAT keys from a reference date and system */
  getValykill(query: ValykillGet21Data['query']) {
    return valykillGet21({ query, client: this.client })
  }

  /** Vidbotarskjol - supporting document types from a reference date and system */
  getVidbotarskjol(query: VidbotarskjolGet22Data['query']) {
    return vidbotarskjolGet22({ query, client: this.client })
  }

  /** Villur - error types from a reference date and system */
  getVillur(query: VillurGet23Data['query']) {
    return villurGet23({ query, client: this.client })
  }

  /** TollskrarLyklar - tariff schedule keys from a reference date and system (query params) */
  getTollskrarLyklar(query: TollskrarLyklarGet24Data['query']) {
    return tollskrarLyklarGet24({ query, client: this.client })
  }

  /** Akvordunarstadir - determination locations by country code (query params) */
  getAkvordunarstadir(query: AkvordunarstadirGet25Data['query']) {
    return akvordunarstadirGet25({ query, client: this.client })
  }
}
