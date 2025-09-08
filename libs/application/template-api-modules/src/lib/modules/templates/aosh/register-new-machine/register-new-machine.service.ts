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
    const answers = application.answers as NewMachineAnswers
    const techInfo = {} as { [key: string]: string | boolean | undefined }

    answers.techInfo.forEach(({ variableName, value }) => {
      if (variableName && value) {
        techInfo[variableName] =
          value.nameIs === 'yes'
            ? true
            : value.nameIs === 'no'
            ? false
            : value.nameIs
      }
    })

    await this.workMachineClientService.addNewMachine(auth, {
      xCorrelationID: application.id,
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
          answers.ownerInformation.isOwnerOtherThanImporter === 'yes'
            ? {
                nationalId: answers.ownerInformation.owner?.nationalId ?? '',
                name: answers.ownerInformation.owner?.name ?? '',
                address: answers.ownerInformation.owner?.address ?? '',
                postalCode: answers.ownerInformation.owner?.postCode
                  ? parseInt(answers.ownerInformation.owner?.postCode, 10)
                  : 0,
                gsm: answers.ownerInformation.owner?.phone ?? '',
                email: answers.ownerInformation.owner?.email ?? '',
              }
            : undefined,
        supervisor:
          answers.operatorInformation?.hasOperator === 'yes'
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
        parentCategory: answers.machine.aboutMachine?.category?.nameIs ?? '',
        subCategory: answers.machine.aboutMachine?.subcategory?.nameIs ?? '',
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
