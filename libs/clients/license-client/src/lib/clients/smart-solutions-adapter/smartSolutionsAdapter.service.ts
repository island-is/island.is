import { LOGGER_PROVIDER, type Logger } from "@island.is/logging";
import { MODULE_OPTIONS_TOKEN } from "./smartSolutionsAdapter.module-definition";
import { SmartSolutionsAdapterModuleOptions } from "./smartSolutionsAdapter.types";
import { Inject } from "@nestjs/common";
import { SmartSolutionsApi, } from "@island.is/clients/smartsolutions";
import { SmartSolutionsService } from "@island.is/clients/smart-solutions-v2";

export class SmartSolutionsAdapterService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly options: SmartSolutionsAdapterModuleOptions,
    private readonly newSmartService: SmartSolutionsService,
    /** DEPRECATED */
    private readonly oldSmartService: SmartSolutionsApi,
  ) {

  }
