import { Args, Query, Resolver } from '@nestjs/graphql'
import { CustomsGeneralService } from './customsGeneral.service'
import {
  CustomsGeneralInput,
  CustomsGeneralUrvinnslugjoldInput,
  CustomsGeneralDagsInput,
} from './dto/customsGeneral.input'
import { CustomsGeneralEntry } from './models/customsGeneralEntry.model'
import { CustomsGeneralExchangeRate } from './models/customsGeneralExchangeRate.model'
import { CustomsGeneralCountryCurrency } from './models/customsGeneralCountryCurrency.model'
import { CustomsGeneralTariffKey } from './models/customsGeneralTariffKey.model'
import { CustomsGeneralDetermination } from './models/customsGeneralDetermination.model'
import { CustomsGeneralProcessingFee } from './models/customsGeneralProcessingFee.model'
import { CustomsGeneralStorageLocation } from './models/customsGeneralStorageLocation.model'
import { CustomsGeneralExemption } from './models/customsGeneralExemption.model'

@Resolver()
export class CustomsGeneralResolver {
  constructor(private readonly customsGeneralService: CustomsGeneralService) {}

  @Query(() => [CustomsGeneralExchangeRate])
  async customsGeneralTollgengi(
    @Args('input') input: CustomsGeneralInput,
  ): Promise<CustomsGeneralExchangeRate[]> {
    return this.customsGeneralService.getTollgengi(input.dags, input.kerfi)
  }

  @Query(() => [CustomsGeneralEntry])
  async customsGeneralAbendi(
    @Args('input') input: CustomsGeneralInput,
  ): Promise<CustomsGeneralEntry[]> {
    return this.customsGeneralService.getAbendi(input.dags, input.kerfi)
  }

  @Query(() => [CustomsGeneralEntry])
  async customsGeneralBonn(
    @Args('input') input: CustomsGeneralInput,
  ): Promise<CustomsGeneralEntry[]> {
    return this.customsGeneralService.getBonn(input.dags, input.kerfi)
  }

  @Query(() => [CustomsGeneralEntry])
  async customsGeneralGjold(
    @Args('input') input: CustomsGeneralInput,
  ): Promise<CustomsGeneralEntry[]> {
    return this.customsGeneralService.getGjold(input.dags, input.kerfi)
  }

  @Query(() => [CustomsGeneralEntry])
  async customsGeneralLeyfi(
    @Args('input') input: CustomsGeneralInput,
  ): Promise<CustomsGeneralEntry[]> {
    return this.customsGeneralService.getLeyfi(input.dags, input.kerfi)
  }

  @Query(() => [CustomsGeneralEntry])
  async customsGeneralTollar(
    @Args('input') input: CustomsGeneralInput,
  ): Promise<CustomsGeneralEntry[]> {
    return this.customsGeneralService.getTollar(input.dags, input.kerfi)
  }

  @Query(() => [CustomsGeneralExemption])
  async customsGeneralUndanthagur(
    @Args('input') input: CustomsGeneralInput,
  ): Promise<CustomsGeneralExemption[]> {
    return this.customsGeneralService.getUndanthagur(input.dags, input.kerfi)
  }

  @Query(() => [CustomsGeneralProcessingFee])
  async customsGeneralUrvinnslugjold(
    @Args('input') input: CustomsGeneralUrvinnslugjoldInput,
  ): Promise<CustomsGeneralProcessingFee[]> {
    return this.customsGeneralService.getUrvinnslugjold(
      input.dags,
      input.tollskrarnumerFra,
      input.tollskrarnumerTil,
    )
  }

  @Query(() => [CustomsGeneralEntry])
  async customsGeneralAfhendingarskilmalar(
    @Args('input') input: CustomsGeneralInput,
  ): Promise<CustomsGeneralEntry[]> {
    return this.customsGeneralService.getAfhendingarskilmalar(
      input.dags,
      input.kerfi,
    )
  }

  @Query(() => [CustomsGeneralEntry])
  async customsGeneralFlutningsmati(
    @Args('input') input: CustomsGeneralInput,
  ): Promise<CustomsGeneralEntry[]> {
    return this.customsGeneralService.getFlutningsmati(input.dags, input.kerfi)
  }

  @Query(() => [CustomsGeneralStorageLocation])
  async customsGeneralGeymslustadur(
    @Args('input') input: CustomsGeneralDagsInput,
  ): Promise<CustomsGeneralStorageLocation[]> {
    return this.customsGeneralService.getGeymslustadur(input.dags)
  }

  @Query(() => [CustomsGeneralEntry])
  async customsGeneralKostnadur(
    @Args('input') input: CustomsGeneralInput,
  ): Promise<CustomsGeneralEntry[]> {
    return this.customsGeneralService.getKostnadur(input.dags, input.kerfi)
  }

  @Query(() => [CustomsGeneralEntry])
  async customsGeneralMagntala(
    @Args('input') input: CustomsGeneralInput,
  ): Promise<CustomsGeneralEntry[]> {
    return this.customsGeneralService.getMagntala(input.dags, input.kerfi)
  }

  @Query(() => [CustomsGeneralEntry])
  async customsGeneralMarkadssvaedi(
    @Args('input') input: CustomsGeneralInput,
  ): Promise<CustomsGeneralEntry[]> {
    return this.customsGeneralService.getMarkadssvaedi(input.dags, input.kerfi)
  }

  @Query(() => [CustomsGeneralEntry])
  async customsGeneralTegundAfgreidslu(
    @Args('input') input: CustomsGeneralInput,
  ): Promise<CustomsGeneralEntry[]> {
    return this.customsGeneralService.getTegundAfgreidslu(
      input.dags,
      input.kerfi,
    )
  }

  @Query(() => [CustomsGeneralEntry])
  async customsGeneralTegundVidskipta(
    @Args('input') input: CustomsGeneralInput,
  ): Promise<CustomsGeneralEntry[]> {
    return this.customsGeneralService.getTegundVidskipta(
      input.dags,
      input.kerfi,
    )
  }

  @Query(() => [CustomsGeneralCountryCurrency])
  async customsGeneralLandMynt(
    @Args('input') input: CustomsGeneralDagsInput,
  ): Promise<CustomsGeneralCountryCurrency[]> {
    return this.customsGeneralService.getLandMynt(input.dags)
  }

  @Query(() => [CustomsGeneralEntry])
  async customsGeneralTollmedferd(
    @Args('input') input: CustomsGeneralInput,
  ): Promise<CustomsGeneralEntry[]> {
    return this.customsGeneralService.getTollmedferd(input.dags, input.kerfi)
  }

  @Query(() => [CustomsGeneralEntry])
  async customsGeneralUmbudir(
    @Args('input') input: CustomsGeneralInput,
  ): Promise<CustomsGeneralEntry[]> {
    return this.customsGeneralService.getUmbudir(input.dags, input.kerfi)
  }

  @Query(() => [CustomsGeneralEntry])
  async customsGeneralUppruni(
    @Args('input') input: CustomsGeneralDagsInput,
  ): Promise<CustomsGeneralEntry[]> {
    return this.customsGeneralService.getUppruni(input.dags)
  }

  @Query(() => [CustomsGeneralEntry])
  async customsGeneralValykill(
    @Args('input') input: CustomsGeneralInput,
  ): Promise<CustomsGeneralEntry[]> {
    return this.customsGeneralService.getValykill(input.dags, input.kerfi)
  }

  @Query(() => [CustomsGeneralEntry])
  async customsGeneralVidbotarskjol(
    @Args('input') input: CustomsGeneralInput,
  ): Promise<CustomsGeneralEntry[]> {
    return this.customsGeneralService.getVidbotarskjol(input.dags, input.kerfi)
  }

  @Query(() => [CustomsGeneralEntry])
  async customsGeneralVillur(
    @Args('input') input: CustomsGeneralInput,
  ): Promise<CustomsGeneralEntry[]> {
    return this.customsGeneralService.getVillur(input.dags, input.kerfi)
  }

  @Query(() => [CustomsGeneralTariffKey])
  async customsGeneralTollskrarLyklar(
    @Args('input') input: CustomsGeneralInput,
  ): Promise<CustomsGeneralTariffKey[]> {
    return this.customsGeneralService.getTollskrarLyklar(
      input.dags,
      input.kerfi,
    )
  }

  @Query(() => [CustomsGeneralDetermination])
  async customsGeneralAkvordunarstadir(): Promise<
    CustomsGeneralDetermination[]
  > {
    return this.customsGeneralService.getAkvordunarstadir()
  }
}
