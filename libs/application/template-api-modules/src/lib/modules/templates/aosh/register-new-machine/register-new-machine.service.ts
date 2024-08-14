import { Inject, Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { TemplateApiModuleActionProps } from '../../../../types'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { TemplateApiError } from '@island.is/nest/problem'
import { coreErrorMessages } from '@island.is/application/core'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { NewMachineAnswers } from '@island.is/application/templates/aosh/register-new-machine'
import {
  MachineTypeDto,
  MachineParentCategoryDto,
  WorkMachinesClientService,
} from '@island.is/clients/work-machines'
@Injectable()
export class RegisterNewMachineTemplateService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly workMachineClientService: WorkMachinesClientService,
  ) {
    super(ApplicationTypes.MACHINE_REGISTRATION)
  }

  async getMachineTypes({
    auth,
  }: TemplateApiModuleActionProps): Promise<MachineTypeDto[]> {
    const result = await this.workMachineClientService.getMachineTypes(auth)
    if (!result) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.machinesEmptyListDefault,
          summary: coreErrorMessages.machinesEmptyListDefault,
        },
        400,
      )
    }
    return result
  }

  async getMachineParentCategories({
    auth,
  }: TemplateApiModuleActionProps): Promise<MachineParentCategoryDto[]> {
    const result =
      await this.workMachineClientService.getMachineParentCategories(auth)
    if (!result) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.machinesEmptyListDefault,
          summary: coreErrorMessages.machinesEmptyListDefault,
        },
        400,
      )
    }
    return result
  }

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    const answers = application.answers as unknown as NewMachineAnswers
    const techInfo = {} as { [key: string]: string | undefined }

    answers.techInfo.forEach(({ variableName, value }) => {
      if (variableName) {
        techInfo[variableName] = value
      }
    })

    await this.workMachineClientService.addNewMachine(auth, {
      machineRegistrationCreateDto: {
        importer: {
          nationalId: answers.importerInformation.importer.nationalId,
          name: answers.importerInformation.importer.name,
          address: answers.importerInformation.importer.address,
          postalCode: parseInt(
            answers.importerInformation.importer.postCode,
            10,
          ),
          gsm: answers.importerInformation.importer.phone,
          email: answers.importerInformation.importer.email,
        },
        owner:
          answers.importerInformation.isOwnerOtherThanImporter === 'yes'
            ? {
                nationalId: answers.importerInformation.owner?.nationalId ?? '',
                name: answers.importerInformation.owner?.name ?? '',
                address: answers.importerInformation.owner?.address ?? '',
                postalCode: answers.importerInformation.owner?.postCode
                  ? parseInt(answers.importerInformation.owner?.postCode, 10)
                  : 0,
                gsm: answers.importerInformation.owner?.phone ?? '',
                email: answers.importerInformation.owner?.email ?? '',
              }
            : undefined,
        supervisor:
          answers.operatorInformation.hasOperator === 'yes'
            ? {
                nationalId:
                  answers.operatorInformation.operator?.nationalId ?? '',
                name: answers.operatorInformation.operator?.name ?? '',
                address: answers.operatorInformation.operator?.address ?? '',
                postalCode: answers.operatorInformation.operator?.postCode
                  ? parseInt(answers.operatorInformation.operator?.postCode, 10)
                  : 0,
                gsm: answers.operatorInformation.operator?.phone ?? '',
                email: answers.operatorInformation.operator?.email ?? '',
              }
            : undefined,
        isPreRegistered:
          answers.machine.basicInformation?.preRegistration === 'yes',
        isCECertified: answers.machine.basicInformation?.markedCE === 'yes',
        countryOfProduction:
          answers.machine.basicInformation?.productionCountry ?? '',
        containerNumber:
          answers.machine.basicInformation?.cargoFileNumber ?? '',
        locationOfMachine: answers.machine.basicInformation?.location ?? '',
        serialNumber: answers.machine.basicInformation?.productionNumber ?? '',
        yearOfProduction: answers.machine.basicInformation?.productionYear
          ? parseInt(answers.machine.basicInformation?.productionYear, 10)
          : 1801,
        used: answers.machine.basicInformation?.isUsed === 'used',
        type: answers.machine.aboutMachine?.type ?? '',
        model: answers.machine.aboutMachine?.model ?? '',
        parentCategory: answers.machine.aboutMachine?.category ?? '',
        subCategory: answers.machine.aboutMachine?.subcategory ?? '',
        streetRegistrationRequested:
          answers.machine.streetRegistration?.registerToTraffic === 'yes',
        plateSize: answers.machine.streetRegistration?.size
          ? parseInt(answers.machine.streetRegistration?.size, 10)
          : 1,
        technicalInfo: JSON.stringify(techInfo),
      },
    })
  }
}
