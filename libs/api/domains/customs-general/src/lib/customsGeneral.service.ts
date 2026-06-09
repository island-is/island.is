import { Injectable } from '@nestjs/common'
import { CustomsGeneralClientService } from '@island.is/clients/rsk/customs/general'
import { CustomsGeneralEntry } from './models/customsGeneralEntry.model'
import { CustomsGeneralExchangeRate } from './models/customsGeneralExchangeRate.model'
import { CustomsGeneralCountryCurrency } from './models/customsGeneralCountryCurrency.model'
import { CustomsGeneralTariffKey } from './models/customsGeneralTariffKey.model'
import { CustomsGeneralDetermination } from './models/customsGeneralDetermination.model'
import { CustomsGeneralProcessingFee } from './models/customsGeneralProcessingFee.model'
import { CustomsGeneralStorageLocation } from './models/customsGeneralStorageLocation.model'
import { CustomsGeneralExemption } from './models/customsGeneralExemption.model'
import { writeFileSync } from 'fs'

@Injectable()
export class CustomsGeneralService {
  constructor(
    private readonly customsGeneralClientService: CustomsGeneralClientService,
  ) {}

  async getTollgengi(
    dags: string,
    kerfi: string,
  ): Promise<CustomsGeneralExchangeRate[]> {
    const result = await this.customsGeneralClientService.getTollgengi({
      Dags: dags,
      Kerfi: kerfi,
    })
    const list = result.data?.Listi ?? []
    return list.map((item) => ({
      code: item.Kodi,
      name: item.Heiti,
      rate: item.Gengi,
    }))
  }

  async getAbendi(dags: string, kerfi: string): Promise<CustomsGeneralEntry[]> {
    const result = await this.customsGeneralClientService.getAbendi({
      Dags: dags,
      Kerfi: kerfi,
    })
    const list = result.data?.Listi ?? []
    return list.map((item) => ({
      code: item.Kodi,
      description: item.Lysing,
    }))
  }

  async getBonn(dags: string, kerfi: string): Promise<CustomsGeneralEntry[]> {
    const result = await this.customsGeneralClientService.getBonn({
      Dags: dags,
      Kerfi: kerfi,
    })
    const list = result.data?.Listi ?? []
    return list.map((item) => ({
      code: item.Kodi,
      name: item.Heiti,
    }))
  }

  async getGjold(dags: string, kerfi: string): Promise<CustomsGeneralEntry[]> {
    const result = await this.customsGeneralClientService.getGjold({
      Dags: dags,
      Kerfi: kerfi,
    })
    const list = result.data?.Listi ?? []
    return list.map((item) => ({
      code: item.Kodi,
      name: item.Heiti,
      description: item.Lysing,
    }))
  }

  async getLeyfi(dags: string, kerfi: string): Promise<CustomsGeneralEntry[]> {
    const result = await this.customsGeneralClientService.getLeyfi({
      Dags: dags,
      Kerfi: kerfi,
    })
    const list = result.data?.Listi ?? []
    return list.map((item) => ({
      code: item.Kodi,
      name: item.Heiti,
      description: item.Lysing,
      validFrom: item.DagsFra,
      validTo: item.DagsTil,
      system: item.Kerfi,
    }))
  }

  async getTollar(dags: string, kerfi: string): Promise<CustomsGeneralEntry[]> {
    const result = await this.customsGeneralClientService.getTollar({
      Dags: dags,
      Kerfi: kerfi,
    })
    const list = result.data?.Listi ?? []
    return list.map((item) => ({
      description: item.Lysing,
      name: item.Tollur,
    }))
  }

  async getUndanthagur(
    dags: string,
    kerfi: string,
  ): Promise<CustomsGeneralExemption[]> {
    const result = await this.customsGeneralClientService.getUndanthagur({
      Dags: dags,
      Kerfi: kerfi,
    })
    const list = result.data?.Listi ?? []
    return list.map((item) => ({
      code: item.Kodi,
      name: item.Heiti,
      description: item.Lysing,
      lagaGrein: item.LagaGrein,
      validFrom: item.DagsFra?.toISOString(),
      validTo: item.DagsTil?.toISOString(),
      system: item.Kerfi,
    }))
  }

  async getUrvinnslugjold(
    dags: string,
    tollskrarnumerFra: string,
    tollskrarnumerTil: string,
  ): Promise<CustomsGeneralProcessingFee[]> {
    const result = await this.customsGeneralClientService.getUrvinnslugjold({
      Dags: dags,
      TollskrarnumerFra: tollskrarnumerFra,
      TollskrarnumerTil: tollskrarnumerTil,
    })
    const list = result.data?.Listi ?? []
    return list.map((item) => ({
      tariffNumber: item.Tollskrarnumer,
      plRatio: item.PLhlutfall,
      ppRatio: item.PPhlutfall,
      validFrom: item.DagsFra,
      validTo: item.DagsTil,
    }))
  }

  async getAfhendingarskilmalar(
    dags: string,
    kerfi: string,
  ): Promise<CustomsGeneralEntry[]> {
    const result =
      await this.customsGeneralClientService.getAfhendingarskilmalar({
        Dags: dags,
        Kerfi: kerfi,
      })
    const list = result.data?.Listi ?? []
    return list.map((item) => ({
      code: item.Kodi,
      name: item.Heiti,
      validFrom: item.DagsFra,
      validTo: item.DagsTil,
      system: item.Kerfi,
    }))
  }

  async getFlutningsmati(
    dags: string,
    kerfi: string,
  ): Promise<CustomsGeneralEntry[]> {
    const result = await this.customsGeneralClientService.getFlutningsmati({
      Dags: dags,
      Kerfi: kerfi,
    })
    const list = result.data?.Listi ?? []
    return list.map((item) => ({
      code: item.Kodi,
      name: item.Heiti,
      validFrom: item.DagsFra,
      validTo: item.DagsTil,
      system: item.Kerfi,
    }))
  }

  async getGeymslustadur(
    dags: string,
  ): Promise<CustomsGeneralStorageLocation[]> {
    const result = await this.customsGeneralClientService.getGeymslustadur({
      Dags: dags,
      Kerfi: 'I',
    })
    const list = result.data?.Listi ?? []
    return list.map((item) => ({
      kennitala: item.Kennitala,
      code: item.Kodi,
      companyName: item.Nafn,
      location: item.Stadsetning,
      validFrom: item.DagsFra,
      validTo: item.DagsTil,
      system: item.Kerfi,
    }))
  }

  async getKostnadur(
    dags: string,
    kerfi: string,
  ): Promise<CustomsGeneralEntry[]> {
    const result = await this.customsGeneralClientService.getKostnadur({
      Dags: dags,
      Kerfi: kerfi,
    })
    const list = result.data?.Listi ?? []
    return list.map((item) => ({
      code: item.Kodi,
      name: item.Heiti,
      description: item.Lysing,
      validFrom: item.DagsFra,
      validTo: item.DagsTil,
      system: item.Kerfi,
    }))
  }

  async getMagntala(
    dags: string,
    kerfi: string,
  ): Promise<CustomsGeneralEntry[]> {
    const result = await this.customsGeneralClientService.getMagntala({
      Dags: dags,
      Kerfi: kerfi,
    })
    const list = result.data?.Listi ?? []
    return list.map((item) => ({
      code: item.Kodi,
      name: item.Heiti,
      validFrom: item.DagsFra,
      validTo: item.DagsTil,
      system: item.Kerfi,
    }))
  }

  async getMarkadssvaedi(
    dags: string,
    kerfi: string,
  ): Promise<CustomsGeneralEntry[]> {
    const result = await this.customsGeneralClientService.getMarkadssvaedi({
      Dags: dags,
      Kerfi: kerfi,
    })
    const list = result.data?.Listi ?? []
    return list.map((item) => ({
      code: item.Kodi,
      name: item.Heiti,
      validFrom: item.DagsFra,
      validTo: item.DagsTil,
      system: item.Kerfi,
    }))
  }

  async getTegundAfgreidslu(
    dags: string,
    kerfi: string,
  ): Promise<CustomsGeneralEntry[]> {
    const result = await this.customsGeneralClientService.getTegundAfgreidslu({
      Dags: dags,
      Kerfi: kerfi,
    })
    const list = result.data?.Listi ?? []
    return list.map((item) => ({
      code: item.Kodi,
      description: item.StuttLysing,
      validFrom: item.DagsFra,
      validTo: item.DagsTil,
      system: item.Kerfi,
    }))
  }

  async getTegundVidskipta(
    dags: string,
    kerfi: string,
  ): Promise<CustomsGeneralEntry[]> {
    const result = await this.customsGeneralClientService.getTegundVidskipta({
      Dags: dags,
      Kerfi: kerfi,
    })
    const list = result.data?.Listi ?? []
    return list.map((item) => ({
      code: item.TegundVidskiptaSkyrslaKodi,
      name: item.tegundVidskiptaSkyrslaHeiti,
      validFrom: item.dtFra,
      validTo: item.dtTil,
      system: item.KerfiID,
    }))
  }

  async getLandMynt(dags: string): Promise<CustomsGeneralCountryCurrency[]> {
    const result = await this.customsGeneralClientService.getLandMynt({
      Dags: dags,
    })
    const list = result.data?.Listi ?? []
    return list.map((item) => ({
      countryCode: item.LandKodi,
      countryName: item.LandHeiti,
      countryValidFrom: item.LandDagsFra,
      countryValidTo: item.LandDagsTil,
      currencyCode: item.MyntKodi,
      currencyName: item.MyntHeiti,
      currencyValidFrom: item.MyntDagsFra,
      currencyValidTo: item.MyntDagsTil,
    }))
  }

  async getTollmedferd(
    dags: string,
    kerfi: string,
  ): Promise<CustomsGeneralEntry[]> {
    const result = await this.customsGeneralClientService.getTollmedferd({
      Dags: dags,
      Kerfi: kerfi,
    })
    const list = result.data?.Listi ?? []
    return list.map((item) => ({
      code: item.Kodi,
      name: item.Heiti,
      validFrom: item.DagsFra,
      validTo: item.DagsTil,
      system: item.Kerfi,
    }))
  }

  async getUmbudir(
    dags: string,
    kerfi: string,
  ): Promise<CustomsGeneralEntry[]> {
    const result = await this.customsGeneralClientService.getUmbudir({
      Dags: dags,
      Kerfi: kerfi,
    })
    const list = result.data?.Listi ?? []
    return list.map((item) => ({
      code: item.Kodi,
      name: item.Heiti,
      validFrom: item.DagsFra,
      validTo: item.DagsTil,
      system: item.Kerfi,
    }))
  }

  async getUppruni(dags: string): Promise<CustomsGeneralEntry[]> {
    const result = await this.customsGeneralClientService.getUppruni({
      Dags: dags,
    })
    const list = result.data?.Listi ?? []
    return list.map((item) => ({
      name: item.Heiti,
      description: item.Lysing,
      validFrom: item.DagsFra,
      validTo: item.DagsTil,
    }))
  }

  async getValykill(
    dags: string,
    kerfi: string,
  ): Promise<CustomsGeneralEntry[]> {
    const result = await this.customsGeneralClientService.getValykill({
      Dags: dags,
      Kerfi: kerfi,
    })
    const list = result.data?.Listi ?? []
    return list.map((item) => ({
      code: item.Kodi,
      name: item.Heiti,
      validFrom: item.DagsFra,
      validTo: item.DagsTil,
      system: item.Kerfi,
    }))
  }

  async getVidbotarskjol(
    dags: string,
    kerfi: string,
  ): Promise<CustomsGeneralEntry[]> {
    const result = await this.customsGeneralClientService.getVidbotarskjol({
      Dags: dags,
      Kerfi: kerfi,
    })
    const list = result.data?.Listi ?? []
    return list.map((item) => ({
      code: item.Kodi,
      name: item.Heiti,
      validFrom: item.DagsFra,
      validTo: item.DagsTil,
      system: item.Kerfi,
    }))
  }

  async getVillur(dags: string, kerfi: string): Promise<CustomsGeneralEntry[]> {
    const result = await this.customsGeneralClientService.getVillur({
      Dags: dags,
      Kerfi: kerfi,
    })
    const list = result.data?.Listi ?? []
    return list.map((item) => ({
      code: item.Kodi,
      name: item.Heiti,
      validFrom: item.DagsFra,
      validTo: item.DagsTil,
      system: item.Kerfi,
    }))
  }

  async getTollskrarLyklar(
    dags: string,
    kerfi: string,
  ): Promise<CustomsGeneralTariffKey[]> {
    const result = await this.customsGeneralClientService.getTollskrarLyklar({
      Dags: dags,
      Kerfi: kerfi,
    })
    const list = result.data?.Listi ?? []
    return list.map((item) => ({
      version: item.Utgafa,
      description: item.Lysing,
      periodFrom: item.TimabilFra,
      periodTo: item.TimabilTil,
      jsonUrl: item.UrlAJsonSkra,
      textUrl: item.UrlATextaSkra,
    }))
  }

  async getAkvordunarstadir(): Promise<CustomsGeneralDetermination[]> {
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
