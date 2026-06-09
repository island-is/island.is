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
  getTollgengi(body: TollgengiGet1Data['body']) {
    return tollgengiGet1({ body, client: this.client })
  }

  /** Abendi - hints/pointers on tariff numbers from a reference date and system */
  getAbendi(body: AbendiGet2Data['body']) {
    return abendiGet2({ body, client: this.client })
  }

  /** Bonn - prohibition types from a reference date and system */
  getBonn(body: BonnGet3Data['body']) {
    return bonnGet3({ body, client: this.client })
  }

  /** Gjold - charge types from a reference date and system */
  getGjold(body: GjoldGet4Data['body']) {
    return gjoldGet4({ body, client: this.client })
  }

  /** Leyfi - permit types from a reference date and system */
  getLeyfi(body: LeyfiGet5Data['body']) {
    return leyfiGet5({ body, client: this.client })
  }

  /** Tollar - customs duty types from a reference date and system */
  getTollar(body: TollarGet6Data['body']) {
    return tollarGet6({ body, client: this.client })
  }

  /** Undanthagur - exemption types from a reference date and system */
  getUndanthagur(body: UndanthagurGet7Data['body']) {
    return undanthagurGet7({ body, client: this.client })
  }

  /** Urvinnslugjold - processing fees for tariff numbers from a reference date and number range */
  getUrvinnslugjold(body: UrvinnslugjoldGet8Data['body']) {
    return urvinnslugjoldGet8({ body, client: this.client })
  }

  /** Afhendingarskilmalar - delivery terms from a reference date and system */
  getAfhendingarskilmalar(body: AfhendingarskilmalarGet9Data['body']) {
    return afhendingarskilmalarGet9({ body, client: this.client })
  }

  /** Flutningsmati - transport modes from a reference date and system */
  getFlutningsmati(body: FlutningsmatiGet10Data['body']) {
    return flutningsmatiGet10({ body, client: this.client })
  }

  /** Geymslustadur - storage locations from a reference date and system */
  getGeymslustadur(body: GeymslustadurGet11Data['body']) {
    return geymslustadurGet11({ body, client: this.client })
  }

  /** Kostnadur - cost types from a reference date and system */
  getKostnadur(body: KostnadurGet12Data['body']) {
    return kostnadurGet12({ body, client: this.client })
  }

  /** Magntala - quantity unit types from a reference date and system */
  getMagntala(body: MagntalaGet13Data['body']) {
    return magntalaGet13({ body, client: this.client })
  }

  /** Markadssvaedi - market areas from a reference date */
  getMarkadssvaedi(body: MarkadssvaediGet14Data['body']) {
    return markadssvaediGet14({ body, client: this.client })
  }

  /** TegundAfgreidslu - procedure types from a reference date and system */
  getTegundAfgreidslu(body: TegundAfgreidsluGet15Data['body']) {
    return tegundAfgreidsluGet15({ body, client: this.client })
  }

  /** TegundVidskipta - transaction types from a reference date and system */
  getTegundVidskipta(body: TegundVidskiptaGet16Data['body']) {
    return tegundVidskiptaGet16({ body, client: this.client })
  }

  /** LandMynt - country and currency codes from a reference date */
  getLandMynt(body: LandMyntGet17Data['body']) {
    return landMyntGet17({ body, client: this.client })
  }

  /** Tollmedferd - customs procedure types from a reference date and system */
  getTollmedferd(body: TollmedferdGet18Data['body']) {
    return tollmedferdGet18({ body, client: this.client })
  }

  /** Umbudir - packaging types from a reference date and system */
  getUmbudir(body: UmbudirGet19Data['body']) {
    return umbudirGet19({ body, client: this.client })
  }

  /** Uppruni - origin types from a reference date */
  getUppruni(body: UppruniGet20Data['body']) {
    return uppruniGet20({ body, client: this.client })
  }

  /** Valykill - VAT keys from a reference date and system */
  getValykill(body: ValykillGet21Data['body']) {
    return valykillGet21({ body, client: this.client })
  }

  /** Vidbotarskjol - supporting document types from a reference date and system */
  getVidbotarskjol(body: VidbotarskjolGet22Data['body']) {
    return vidbotarskjolGet22({ body, client: this.client })
  }

  /** Villur - error types from a reference date and system */
  getVillur(body: VillurGet23Data['body']) {
    return villurGet23({ body, client: this.client })
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
