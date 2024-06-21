import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { StepTypes } from '../../enums/stepTypes'
import { FormApplicantDto } from '../applicants/models/dto/formApplicant.dto'
import { GroupDto } from '../groups/models/dto/group.dto'
import { Group } from '../groups/models/group.model'
import { InputSettingsDto } from '../inputSettings/models/dto/inputSettings.dto'
import { InputSettingsMapper } from '../inputSettings/models/inputSettings.mapper'
import { InputSettings } from '../inputSettings/models/inputSettings.model'
import { InputDto } from '../inputs/models/dto/input.dto'
import { InputTypeDto } from '../inputs/models/dto/inputType.dto'
import { Input } from '../inputs/models/input.model'
import { InputType } from '../inputs/models/inputType.model'
import { ListTypeDto } from '../lists/models/dto/listType.dto'
import { ListType } from '../lists/models/listType.model'
import { Organization } from '../organizations/models/organization.model'
import { StepDto } from '../steps/models/dto/step.dto'
import { Step } from '../steps/models/step.model'
import { FormTestimonyTypeDto } from '../testimonies/models/dto/formTestimonyType.dto'
import { TestimonyTypeDto } from '../testimonies/models/dto/testimonyType.dto'
import { TestimonyType } from '../testimonies/models/testimonyType.model'
import { CreateFormDto } from './models/dto/createForm.dto'
import { FormDto } from './models/dto/form.dto'
import { FormResponse } from './models/dto/form.response.dto'
import { Form } from './models/form.model'

@Injectable()
export class FormsService {
  constructor(
    @InjectModel(Form)
    private readonly formModel: typeof Form,
    @InjectModel(Step)
    private readonly stepModel: typeof Step,
    @InjectModel(Group)
    private readonly groupModel: typeof Group,
    @InjectModel(Organization)
    private readonly organizationModel: typeof Organization,
    @InjectModel(InputType)
    private readonly inputTypeModel: typeof InputType,
    @InjectModel(ListType)
    private readonly listTypeModel: typeof ListType,
    private readonly inputSettingsMapper: InputSettingsMapper,
  ) {}

  async findAll(organizationId: string): Promise<Form[]> {
    return await this.formModel.findAll({
      where: { organizationId: organizationId },
    })
  }

  async findOne(id: string): Promise<FormResponse | null> {
    const form = await this.findById(id)

    if (!form) {
      return null
    }
    const formResponse = await this.buildFormResponse(form)

    return formResponse
  }

  async create(createFormDto: CreateFormDto): Promise<FormResponse | null> {
    const { organizationId } = createFormDto

    if (!organizationId) {
      throw new Error('Missing organizationId')
    }

    const organization = this.organizationModel.findByPk(organizationId)
    if (!organization) {
      throw new NotFoundException(
        `Organization with id ${organizationId} not found`,
      )
    }

    const newForm: Form = await this.formModel.create({
      organizationId: organizationId,
    } as Form)

    await this.createFormTemplate(newForm)

    const form = await this.findById(newForm.id)

    const formResponse = await this.buildFormResponse(form)

    return formResponse
  }

  async delete(id: string): Promise<void> {
    const form = await this.findById(id)
    form?.destroy()
  }

  private async findById(id: string): Promise<Form> {
    const form = await this.formModel.findByPk(id, {
      include: [
        {
          model: Step,
          as: 'steps',
          include: [
            {
              model: Group,
              as: 'groups',
              include: [
                {
                  model: Input,
                  as: 'inputs',
                  include: [
                    {
                      model: InputSettings,
                      as: 'inputSettings',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    })

    if (!form) {
      throw new NotFoundException(`Form with id '${id}' not found`)
    }

    return form
  }

  private async buildFormResponse(form: Form): Promise<FormResponse> {
    const response: FormResponse = {
      form: this.setArrays(form),
      inputTypes: await this.getInputTypes(form.organizationId),
      testimonyTypes: await this.getTestimonyTypes(form.organizationId),
      listTypes: await this.getListTypes(form.organizationId),
    }

    return response
  }

  private async getTestimonyTypes(
    organizationId: string,
  ): Promise<TestimonyTypeDto[]> {
    const organizationSpecificTestimonyTypes =
      await this.organizationModel.findByPk(organizationId, {
        include: [TestimonyType],
      })

    const organizationTestimonyTypes =
      organizationSpecificTestimonyTypes?.organizationTestimonyTypes as TestimonyType[]

    const testimonyTypesDto: TestimonyTypeDto[] = []

    organizationTestimonyTypes?.map((testimonyType) => {
      testimonyTypesDto.push({
        id: testimonyType.id,
        type: testimonyType.type,
        name: testimonyType.name,
        description: testimonyType.description,
      } as TestimonyTypeDto)
    })

    return testimonyTypesDto
  }

  private async getInputTypes(organizationId: string): Promise<InputTypeDto[]> {
    const commonInputTypes = await this.inputTypeModel.findAll({
      where: { isCommon: true },
    })
    const organizationSpecificInputTypes =
      await this.organizationModel.findByPk(organizationId, {
        include: [InputType],
      })

    const organizationInputTypes = commonInputTypes.concat(
      organizationSpecificInputTypes?.organizationInputTypes as InputType[],
    )

    const inputTypesDto: InputTypeDto[] = []
    organizationInputTypes.map((inputType) => {
      inputTypesDto.push({
        id: inputType.id,
        type: inputType.type,
        name: inputType.name,
        description: inputType.description,
        isCommon: inputType.isCommon,
        inputSettings: this.inputSettingsMapper.mapInputTypeToInputSettings(
          null,
          inputType.type,
        ),
      } as InputTypeDto)
    })

    console.log('blalala:', InputSettingsDto)
    return inputTypesDto
  }

  private async getListTypes(organizationId: string): Promise<ListTypeDto[]> {
    const commonListTypes = await this.listTypeModel.findAll({
      where: { isCommon: true },
    })
    const organizationSpecificListTypes = await this.organizationModel.findByPk(
      organizationId,
      { include: [ListType] },
    )

    const organizationListTypes = commonListTypes.concat(
      organizationSpecificListTypes?.organizationListTypes as ListType[],
    )

    const listTypesDto: ListTypeDto[] = []
    organizationListTypes.map((listType) => {
      listTypesDto.push({
        id: listType.id,
        type: listType.type,
        name: listType.name,
        description: listType.description,
        isCommon: listType.isCommon,
      } as ListTypeDto)
    })

    return listTypesDto
  }

  private setArrays(form: Form): FormDto {
    const formDto: FormDto = {
      id: form.id,
      organizationId: form.organizationId,
      name: form.name,
      invalidationDate: form.invalidationDate,
      created: form.created,
      modified: form.modified,
      isTranslated: form.isTranslated,
      applicationDaysToRemove: form.applicationDaysToRemove,
      derivedFrom: form.derivedFrom,
      stopProgressOnValidatingStep: form.stopProgressOnValidatingStep,
      completedMessage: form.completedMessage,
      testimonyTypes: [],
      applicants: [],
      steps: [],
      groups: [],
      inputs: [],
    }

    form.testimonyTypes?.map((testimonyType) => {
      formDto.testimonyTypes?.push({
        id: testimonyType.id,
        name: testimonyType.name,
        description: testimonyType.description,
        type: testimonyType.type,
      } as FormTestimonyTypeDto)
    })

    form.applicants?.map((applicant) => {
      formDto.applicants?.push({
        id: applicant.id,
        applicantType: applicant.applicantType,
        name: applicant.name,
      } as FormApplicantDto)
    })

    form.steps.map((step) => {
      formDto.steps?.push({
        id: step.id,
        name: step.name,
        created: step.created,
        modified: step.modified,
        stepType: step.stepType,
        displayOrder: step.displayOrder,
        waitingText: step.waitingText,
        isHidden: step.isHidden,
        isCompleted: step.isCompleted,
        callRuleset: step.callRuleset,
      } as StepDto)
      step.groups?.map((group) => {
        formDto.groups?.push({
          id: group.id,
          stepId: step.id,
          name: group.name,
          created: group.created,
          modified: group.modified,
          displayOrder: group.displayOrder,
          isHidden: group.isHidden,
          multiset: group.multiset,
        } as GroupDto)
        group.inputs?.map((input) => {
          formDto.inputs?.push({
            id: input.id,
            groupId: group.id,
            name: input.name,
            created: input.created,
            modified: input.modified,
            displayOrder: input.displayOrder,
            description: input.description,
            isHidden: input.isHidden,
            isPartOfMultiset: input.isPartOfMultiset,
            inputSettings: input.inputSettings,
            inputType: input.inputType,
          } as InputDto)
        })
      })
    })

    return formDto
  }

  private async createFormTemplate(form: Form): Promise<void> {
    await this.stepModel.create({
      formId: form.id,
      stepType: StepTypes.PREMISES,
      displayOrder: 0,
      name: { is: 'Forsendur', en: 'Premises' },
    } as Step)

    await this.stepModel.create({
      formId: form.id,
      stepType: StepTypes.PARTIES,
      displayOrder: 1,
      name: { is: 'Hlutaðeigandi aðilar', en: 'Relevant parties' },
    } as Step)

    const inputStep = await this.stepModel.create({
      formId: form.id,
      stepType: StepTypes.INPUT,
      displayOrder: 2,
      name: { is: 'Innsláttarskref', en: 'InputStep' },
    } as Step)

    await this.stepModel.create({
      formId: form.id,
      stepType: StepTypes.PAYMENT,
      displayOrder: 3,
      name: { is: 'Greiðsla', en: 'Payment' },
    } as Step)

    await this.groupModel.create({
      stepId: inputStep.id,
      displayOrder: 0,
      name: { is: 'Hópur 1', en: 'Group 1' },
    } as Group)
  }
}
