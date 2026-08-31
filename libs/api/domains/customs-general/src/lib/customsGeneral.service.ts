import { Injectable } from '@nestjs/common'
import { CustomsGeneralClientService } from '@island.is/clients/rsk/customs/general'
import { CustomsGeneralEntry } from './models/customsGeneralEntry.model'
import { CustomsGeneralExchangeRate } from './models/customsGeneralExchangeRate.model'
import { CustomsGeneralCountryCurrency } from './models/customsGeneralCountryCurrency.model'
import { CustomsGeneralTariffKey } from './models/customsGeneralTariffKey.model'
import { CustomsGeneralDetermination } from './models/customsGeneralDetermination.model'
import { CustomsGeneralStorageLocation } from './models/customsGeneralStorageLocation.model'
import { CustomsGeneralExemption } from './models/customsGeneralExemption.model'
import { CustomsGeneralProhibition } from './models/customsGeneralProhibition.model'
import { CustomsGeneralCharge } from './models/customsGeneralCharge.model'
import { CustomsGeneralPermit } from './models/customsGeneralPermit.model'
import { getCombinedValidity, getValidity } from './utils/validity'

@Injectable()
export class CustomsGeneralService {
  constructor(
    private readonly customsGeneralClientService: CustomsGeneralClientService,
  ) {}

  async getExchangeRates(
    date: string,
    system: string,
  ): Promise<CustomsGeneralExchangeRate[]> {
    const result = await this.customsGeneralClientService.getTollgengi({
      Dags: date,
      Kerfi: system,
    })
    const list = result.data?.Listi ?? []
    return list.map((item) => ({
      code: item.Kodi,
      name: item.Heiti,
      rate: item.Gengi,
      ...getValidity(date, item.DagsFra, item.DagsTil),
    }))
  }

  async getAdvisories(
    date: string,
    system: string,
  ): Promise<CustomsGeneralEntry[]> {
    const result = await this.customsGeneralClientService.getAbendi({
      Dags: date,
      Kerfi: system,
    })
    const list = result.data?.Listi ?? []
    return list.map((item) => ({
      code: item.Kodi,
      description: item.Lysing,
      ...getValidity(date, item.DagsFra, item.DagsTil),
    }))
  }

  async getProhibitions(
    date: string,
    system: string,
  ): Promise<CustomsGeneralProhibition[]> {
    const result = await this.customsGeneralClientService.getBonn({
      Dags: date,
      Kerfi: system,
    })
    const list = result.data?.Listi ?? []
    return list.map((item) => ({
      code: item.Kodi,
      name: item.Heiti,
      description: item.Astaeda,
      ...getValidity(date, item.DagsFra, item.DagsTil),
      exemptionProvider: item.UndanthVeitir,
    }))
  }

  async getCharges(
    date: string,
    system: string,
  ): Promise<CustomsGeneralCharge[]> {
    const result = await this.customsGeneralClientService.getGjold({
      Dags: date,
      Kerfi: system,
    })
    const list = result.data?.Listi ?? []
    return list.map((item) => ({
      code: item.Kodi,
      name: item.Heiti,
      description: item.Lysing,
      ...getValidity(date, item.DagsFra, item.DagsTil),
      taxtiUpphaed: item.TaxtiUpphaed ?? undefined,
      taxtiProsenta: item.TaxtiProsenta ?? undefined,
    }))
  }

  async getPermits(
    date: string,
    system: string,
  ): Promise<CustomsGeneralPermit[]> {
    const result = await this.customsGeneralClientService.getLeyfi({
      Dags: date,
      Kerfi: system,
    })
    const list = result.data?.Listi ?? []
    return list.map((item) => ({
      code: item.Kodi,
      name: item.Heiti,
      description: item.Lysing,
      ...getValidity(date, item.DagsFra, item.DagsTil),
      leyfiVeitir: item.LeyfiVeitir,
    }))
  }

  async getTariffs(
    date: string,
    system: string,
  ): Promise<CustomsGeneralEntry[]> {
    const result = await this.customsGeneralClientService.getTollar({
      Dags: date,
      Kerfi: system,
    })
    const list = result.data?.Listi ?? []
    return list.map((item) => ({
      name: item.Tollur,
      description: item.Lysing,
      ...getValidity(date, item.DagsFra, item.DagsTil),
    }))
  }

  async getExemptions(
    date: string,
    system: string,
  ): Promise<CustomsGeneralExemption[]> {
    const result = await this.customsGeneralClientService.getUndanthagur({
      Dags: date,
      Kerfi: system,
    })
    const list = result.data?.Listi ?? []
    return list.map((item) => ({
      code: item.Kodi,
      name: item.Heiti,
      description: item.Lysing,
      legalArticle: item.LagaGrein,
      system: item.Kerfi,
      ...getValidity(date, item.DagsFra, item.DagsTil),
    }))
  }

  async getDeliveryTerms(
    date: string,
    system: string,
  ): Promise<CustomsGeneralEntry[]> {
    const result = await this.customsGeneralClientService.getAfhendingarskilmalar(
      {
        Dags: date,
        Kerfi: system,
      },
    )
    const list = result.data?.Listi ?? []
    return list.map((item) => ({
      code: item.Kodi,
      name: item.Heiti,
      system: item.Kerfi,
      ...getValidity(date, item.DagsFra, item.DagsTil),
    }))
  }

  async getTransportModes(
    date: string,
    system: string,
  ): Promise<CustomsGeneralEntry[]> {
    const result = await this.customsGeneralClientService.getFlutningsmati({
      Dags: date,
      Kerfi: system,
    })
    const list = result.data?.Listi ?? []
    return list.map((item) => ({
      code: item.Kodi,
      name: item.Heiti,
      system: item.Kerfi,
      ...getValidity(date, item.DagsFra, item.DagsTil),
    }))
  }

  async getStorageLocations(
    date: string,
  ): Promise<CustomsGeneralStorageLocation[]> {
    const result = await this.customsGeneralClientService.getGeymslustadur({
      Dags: date,
      Kerfi: 'I',
    })
    const list = result.data?.Listi ?? []
    return list.map((item) => ({
      nationalId: item.Kennitala,
      code: item.Kodi,
      companyName: item.Nafn,
      location: item.Stadsetning,
      system: item.Kerfi,
      ...getValidity(date, item.DagsFra, item.DagsTil),
    }))
  }

  async getCosts(date: string, system: string): Promise<CustomsGeneralEntry[]> {
    const result = await this.customsGeneralClientService.getKostnadur({
      Dags: date,
      Kerfi: system,
    })
    const list = result.data?.Listi ?? []
    return list.map((item) => ({
      code: item.Kodi,
      name: item.Heiti,
      description: item.Lysing,
      system: item.Kerfi,
      ...getValidity(date, item.DagsFra, item.DagsTil),
    }))
  }

  async getQuantityUnits(
    date: string,
    system: string,
  ): Promise<CustomsGeneralEntry[]> {
    const result = await this.customsGeneralClientService.getMagntala({
      Dags: date,
      Kerfi: system,
    })
    const list = result.data?.Listi ?? []
    return list.map((item) => ({
      code: item.Kodi,
      name: item.Heiti,
      system: item.Kerfi,
      ...getValidity(date, item.DagsFra, item.DagsTil),
    }))
  }

  async getMarketAreas(
    date: string,
    system: string,
  ): Promise<CustomsGeneralEntry[]> {
    const result = await this.customsGeneralClientService.getMarkadssvaedi({
      Dags: date,
      Kerfi: system,
    })
    const list = result.data?.Listi ?? []
    return list.map((item) => ({
      code: item.Kodi,
      name: item.Heiti,
      system: item.Kerfi,
      ...getValidity(date, item.DagsFra, item.DagsTil),
    }))
  }

  async getClearanceTypes(
    date: string,
    system: string,
  ): Promise<CustomsGeneralEntry[]> {
    const result = await this.customsGeneralClientService.getTegundAfgreidslu({
      Dags: date,
      Kerfi: system,
    })
    const list = result.data?.Listi ?? []
    return list.map((item) => ({
      code: item.Kodi,
      description: item.StuttLysing,
      system: item.Kerfi,
      ...getValidity(date, item.DagsFra, item.DagsTil),
    }))
  }

  async getTransactionTypes(
    date: string,
    system: string,
  ): Promise<CustomsGeneralEntry[]> {
    const result = await this.customsGeneralClientService.getTegundVidskipta({
      Dags: date,
      Kerfi: system,
    })
    const list = result.data?.Listi ?? []
    return list.map((item) => ({
      code: item.TegundVidskiptaSkyrslaKodi,
      name: item.tegundVidskiptaSkyrslaHeiti,
      system: item.KerfiID,
      ...getValidity(date, item.dtFra, item.dtTil),
    }))
  }

  async getCountryCurrencies(
    date: string,
  ): Promise<CustomsGeneralCountryCurrency[]> {
    const result = await this.customsGeneralClientService.getLandMynt({
      Dags: date,
    })
    const list = result.data?.Listi ?? []
    return list.map((item) => ({
      countryCode: item.LandKodi,
      countryName: item.LandHeiti,
      currencyCode: item.MyntKodi,
      currencyName: item.MyntHeiti,
      ...getCombinedValidity(
        date,
        { from: item.LandDagsFra, to: item.LandDagsTil },
        { from: item.MyntDagsFra, to: item.MyntDagsTil },
      ),
    }))
  }

  async getCustomsProcedures(
    date: string,
    system: string,
  ): Promise<CustomsGeneralEntry[]> {
    const result = await this.customsGeneralClientService.getTollmedferd({
      Dags: date,
      Kerfi: system,
    })
    const list = result.data?.Listi ?? []
    return list.map((item) => ({
      code: item.Kodi,
      name: item.Heiti,
      system: item.Kerfi,
      ...getValidity(date, item.DagsFra, item.DagsTil),
    }))
  }

  async getPackaging(
    date: string,
    system: string,
  ): Promise<CustomsGeneralEntry[]> {
    const result = await this.customsGeneralClientService.getUmbudir({
      Dags: date,
      Kerfi: system,
    })
    const list = result.data?.Listi ?? []
    return list.map((item) => ({
      code: item.Kodi,
      name: item.Heiti,
      system: item.Kerfi,
      ...getValidity(date, item.DagsFra, item.DagsTil),
    }))
  }

  async getOrigins(date: string): Promise<CustomsGeneralEntry[]> {
    const result = await this.customsGeneralClientService.getUppruni({
      Dags: date,
    })
    const list = result.data?.Listi ?? []
    return list.map((item) => ({
      name: item.Heiti,
      description: item.Lysing,
      ...getValidity(date, item.DagsFra, item.DagsTil),
    }))
  }

  async getSelectionKeys(
    date: string,
    system: string,
  ): Promise<CustomsGeneralEntry[]> {
    const result = await this.customsGeneralClientService.getValykill({
      Dags: date,
      Kerfi: system,
    })
    const list = result.data?.Listi ?? []
    return list.map((item) => ({
      code: item.Kodi,
      name: item.Heiti,
      system: item.Kerfi,
      ...getValidity(date, item.DagsFra, item.DagsTil),
    }))
  }

  async getSupplementaryDocuments(
    date: string,
    system: string,
  ): Promise<CustomsGeneralEntry[]> {
    const result = await this.customsGeneralClientService.getVidbotarskjol({
      Dags: date,
      Kerfi: system,
    })
    const list = result.data?.Listi ?? []
    return list.map((item) => ({
      code: item.Kodi,
      name: item.Heiti,
      system: item.Kerfi,
      ...getValidity(date, item.DagsFra, item.DagsTil),
    }))
  }

  async getErrors(
    date: string,
    system: string,
  ): Promise<CustomsGeneralEntry[]> {
    const result = await this.customsGeneralClientService.getVillur({
      Dags: date,
      Kerfi: system,
    })
    const list = result.data?.Listi ?? []
    return list.map((item) => ({
      code: item.Kodi,
      name: item.Heiti,
      system: item.Kerfi,
      ...getValidity(date, item.DagsFra, item.DagsTil),
    }))
  }

  async getTariffKeys(
    date: string,
    system: string,
  ): Promise<CustomsGeneralTariffKey[]> {
    const result = await this.customsGeneralClientService.getTollskrarLyklar({
      Dags: date,
      Kerfi: system,
    })
    const list = result.data?.Listi ?? []
    return list.map((item) => ({
      version: item.Utgafa,
      description: item.Lysing,
      periodFrom: item.TimabilFra,
      periodTo: item.TimabilTil,
      jsonUrl: item.UrlAJsonSkra,
      textUrl: item.UrlATextaSkra,
      notYetInEffect: getValidity(date, item.TimabilFra, item.TimabilTil)
        .notYetInEffect,
    }))
  }

  async getAssessmentLocations(): Promise<CustomsGeneralDetermination[]> {
    const result = await this.customsGeneralClientService.getAkvordunarstadir({
      Landakodi: 'IS',
    })
    const list = result.data?.Listi ?? []
    return list.map((item) => ({
      countryCode: item.Landakodi,
      location: item.Stadur,
      locationName: item.StadurHeiti,
    }))
  }
}
