import { Args, Query, Resolver } from '@nestjs/graphql'
import { CustomsGeneralService } from './customsGeneral.service'
import {
  CustomsGeneralInput,
  CustomsGeneralDagsInput,
} from './dto/customsGeneral.input'
import { CustomsGeneralEntry } from './models/customsGeneralEntry.model'
import { CustomsGeneralExchangeRate } from './models/customsGeneralExchangeRate.model'
import { CustomsGeneralCountryCurrency } from './models/customsGeneralCountryCurrency.model'
import { CustomsGeneralTariffKey } from './models/customsGeneralTariffKey.model'
import { CustomsGeneralDetermination } from './models/customsGeneralDetermination.model'
import { CustomsGeneralStorageLocation } from './models/customsGeneralStorageLocation.model'
import { CustomsGeneralExemption } from './models/customsGeneralExemption.model'

@Resolver()
export class CustomsGeneralResolver {
  constructor(private readonly customsGeneralService: CustomsGeneralService) {}

  @Query(() => [CustomsGeneralExchangeRate])
  async customsGeneralExchangeRates(
    @Args('input') input: CustomsGeneralInput,
  ): Promise<CustomsGeneralExchangeRate[]> {
    return this.customsGeneralService.getExchangeRates(input.date, input.system)
  }

  @Query(() => [CustomsGeneralEntry])
  async customsGeneralAdvisories(
    @Args('input') input: CustomsGeneralInput,
  ): Promise<CustomsGeneralEntry[]> {
    return this.customsGeneralService.getAdvisories(input.date, input.system)
  }

  @Query(() => [CustomsGeneralEntry])
  async customsGeneralProhibitions(
    @Args('input') input: CustomsGeneralInput,
  ): Promise<CustomsGeneralEntry[]> {
    return this.customsGeneralService.getProhibitions(input.date, input.system)
  }

  @Query(() => [CustomsGeneralEntry])
  async customsGeneralCharges(
    @Args('input') input: CustomsGeneralInput,
  ): Promise<CustomsGeneralEntry[]> {
    return this.customsGeneralService.getCharges(input.date, input.system)
  }

  @Query(() => [CustomsGeneralEntry])
  async customsGeneralPermits(
    @Args('input') input: CustomsGeneralInput,
  ): Promise<CustomsGeneralEntry[]> {
    return this.customsGeneralService.getPermits(input.date, input.system)
  }

  @Query(() => [CustomsGeneralEntry])
  async customsGeneralTariffs(
    @Args('input') input: CustomsGeneralInput,
  ): Promise<CustomsGeneralEntry[]> {
    return this.customsGeneralService.getTariffs(input.date, input.system)
  }

  @Query(() => [CustomsGeneralExemption])
  async customsGeneralExemptions(
    @Args('input') input: CustomsGeneralInput,
  ): Promise<CustomsGeneralExemption[]> {
    return this.customsGeneralService.getExemptions(input.date, input.system)
  }

  @Query(() => [CustomsGeneralEntry])
  async customsGeneralDeliveryTerms(
    @Args('input') input: CustomsGeneralInput,
  ): Promise<CustomsGeneralEntry[]> {
    return this.customsGeneralService.getDeliveryTerms(input.date, input.system)
  }

  @Query(() => [CustomsGeneralEntry])
  async customsGeneralTransportModes(
    @Args('input') input: CustomsGeneralInput,
  ): Promise<CustomsGeneralEntry[]> {
    return this.customsGeneralService.getTransportModes(
      input.date,
      input.system,
    )
  }

  @Query(() => [CustomsGeneralStorageLocation])
  async customsGeneralStorageLocations(
    @Args('input') input: CustomsGeneralDagsInput,
  ): Promise<CustomsGeneralStorageLocation[]> {
    return this.customsGeneralService.getStorageLocations(input.date)
  }

  @Query(() => [CustomsGeneralEntry])
  async customsGeneralCosts(
    @Args('input') input: CustomsGeneralInput,
  ): Promise<CustomsGeneralEntry[]> {
    return this.customsGeneralService.getCosts(input.date, input.system)
  }

  @Query(() => [CustomsGeneralEntry])
  async customsGeneralQuantityUnits(
    @Args('input') input: CustomsGeneralInput,
  ): Promise<CustomsGeneralEntry[]> {
    return this.customsGeneralService.getQuantityUnits(input.date, input.system)
  }

  @Query(() => [CustomsGeneralEntry])
  async customsGeneralMarketAreas(
    @Args('input') input: CustomsGeneralInput,
  ): Promise<CustomsGeneralEntry[]> {
    return this.customsGeneralService.getMarketAreas(input.date, input.system)
  }

  @Query(() => [CustomsGeneralEntry])
  async customsGeneralClearanceTypes(
    @Args('input') input: CustomsGeneralInput,
  ): Promise<CustomsGeneralEntry[]> {
    return this.customsGeneralService.getClearanceTypes(
      input.date,
      input.system,
    )
  }

  @Query(() => [CustomsGeneralEntry])
  async customsGeneralTransactionTypes(
    @Args('input') input: CustomsGeneralInput,
  ): Promise<CustomsGeneralEntry[]> {
    return this.customsGeneralService.getTransactionTypes(
      input.date,
      input.system,
    )
  }

  @Query(() => [CustomsGeneralCountryCurrency])
  async customsGeneralCountryCurrencies(
    @Args('input') input: CustomsGeneralDagsInput,
  ): Promise<CustomsGeneralCountryCurrency[]> {
    return this.customsGeneralService.getCountryCurrencies(input.date)
  }

  @Query(() => [CustomsGeneralEntry])
  async customsGeneralCustomsProcedures(
    @Args('input') input: CustomsGeneralInput,
  ): Promise<CustomsGeneralEntry[]> {
    return this.customsGeneralService.getCustomsProcedures(
      input.date,
      input.system,
    )
  }

  @Query(() => [CustomsGeneralEntry])
  async customsGeneralPackaging(
    @Args('input') input: CustomsGeneralInput,
  ): Promise<CustomsGeneralEntry[]> {
    return this.customsGeneralService.getPackaging(input.date, input.system)
  }

  @Query(() => [CustomsGeneralEntry])
  async customsGeneralOrigins(
    @Args('input') input: CustomsGeneralDagsInput,
  ): Promise<CustomsGeneralEntry[]> {
    return this.customsGeneralService.getOrigins(input.date)
  }

  @Query(() => [CustomsGeneralEntry])
  async customsGeneralSelectionKeys(
    @Args('input') input: CustomsGeneralInput,
  ): Promise<CustomsGeneralEntry[]> {
    return this.customsGeneralService.getSelectionKeys(input.date, input.system)
  }

  @Query(() => [CustomsGeneralEntry])
  async customsGeneralSupplementaryDocuments(
    @Args('input') input: CustomsGeneralInput,
  ): Promise<CustomsGeneralEntry[]> {
    return this.customsGeneralService.getSupplementaryDocuments(
      input.date,
      input.system,
    )
  }

  @Query(() => [CustomsGeneralEntry])
  async customsGeneralErrors(
    @Args('input') input: CustomsGeneralInput,
  ): Promise<CustomsGeneralEntry[]> {
    return this.customsGeneralService.getErrors(input.date, input.system)
  }

  @Query(() => [CustomsGeneralTariffKey])
  async customsGeneralTariffKeys(
    @Args('input') input: CustomsGeneralInput,
  ): Promise<CustomsGeneralTariffKey[]> {
    return this.customsGeneralService.getTariffKeys(input.date, input.system)
  }

  @Query(() => [CustomsGeneralDetermination])
  async customsGeneralAssessmentLocations(): Promise<
    CustomsGeneralDetermination[]
  > {
    return this.customsGeneralService.getAssessmentLocations()
  }
}
