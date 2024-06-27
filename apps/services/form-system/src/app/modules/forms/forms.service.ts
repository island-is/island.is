import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { SectionTypes } from '../../enums/sectionTypes'
import { FormApplicantDto } from '../applicants/models/dto/formApplicant.dto'
import { PageDto } from '../pages/models/dto/page.dto'
import { Page } from '../pages/models/page.model'
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
import { SectionDto } from '../sections/models/dto/section.dto'
import { Section } from '../sections/models/section.model'
import { FormTestimonyTypeDto } from '../testimonies/models/dto/formTestimonyType.dto'
import { TestimonyTypeDto } from '../testimonies/models/dto/testimonyType.dto'
import { TestimonyType } from '../testimonies/models/testimonyType.model'
import { CreateFormDto } from './models/dto/createForm.dto'
import { FormDto } from './models/dto/form.dto'
import { FormResponse } from './models/dto/form.response.dto'
import { Form } from './models/form.model'
import { ListItem } from '../listItems/models/listItem.model'
import { FormsListDto } from './models/dto/formsList.dto'
import { FormMapper } from './models/form.mapper'

@Injectable()
export class FormsService {
  constructor(
    @InjectModel(Form)
    private readonly formModel: typeof Form,
    @InjectModel(Section)
    private readonly sectionModel: typeof Section,
    @InjectModel(Page)
    private readonly pageModel: typeof Page,
    @InjectModel(Organization)
    private readonly organizationModel: typeof Organization,
    @InjectModel(InputType)
    private readonly inputTypeModel: typeof InputType,
    @InjectModel(ListType)
    private readonly listTypeModel: typeof ListType,
    private readonly inputSettingsMapper: InputSettingsMapper,
    private readonly formMapper: FormMapper,
  ) {}

  async findAll(organizationId: string): Promise<FormsListDto> {
    const forms = await this.formModel.findAll({
      where: { organizationId: organizationId },
    })

    const formsListDto: FormsListDto =
      this.formMapper.mapFormsToFormsListDto(forms)

    return formsListDto
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
          model: Section,
          as: 'sections',
          include: [
            {
              model: Page,
              as: 'pages',
              include: [
                {
                  model: Input,
                  as: 'inputs',
                  include: [
                    {
                      model: InputSettings,
                      as: 'inputSettings',
                      include: [
                        {
                          model: ListItem,
                          as: 'list',
                        },
                      ],
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
        inputSettings: this.inputSettingsMapper.mapInputTypeToInputSettingsDto(
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
      urlName: form.urlName,
      invalidationDate: form.invalidationDate,
      created: form.created,
      modified: form.modified,
      isTranslated: form.isTranslated,
      applicationDaysToRemove: form.applicationDaysToRemove,
      derivedFrom: form.derivedFrom,
      stopProgressOnValidatingPage: form.stopProgressOnValidatingPage,
      completedMessage: form.completedMessage,
      testimonyTypes: [],
      applicants: [],
      sections: [],
      pages: [],
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

    form.sections.map((section) => {
      formDto.sections?.push({
        id: section.id,
        name: section.name,
        created: section.created,
        modified: section.modified,
        sectionType: section.sectionType,
        displayOrder: section.displayOrder,
        waitingText: section.waitingText,
        isHidden: section.isHidden,
        isCompleted: section.isCompleted,
        callRuleset: section.callRuleset,
      } as SectionDto)
      section.pages?.map((page) => {
        formDto.pages?.push({
          id: page.id,
          sectionId: section.id,
          name: page.name,
          created: page.created,
          modified: page.modified,
          displayOrder: page.displayOrder,
          isHidden: page.isHidden,
          multiset: page.multiset,
        } as PageDto)
        page.inputs?.map((input) => {
          formDto.inputs?.push({
            id: input.id,
            pageId: page.id,
            name: input.name,
            created: input.created,
            modified: input.modified,
            displayOrder: input.displayOrder,
            description: input.description,
            isHidden: input.isHidden,
            isPartOfMultiset: input.isPartOfMultiset,
            inputSettings:
              this.inputSettingsMapper.mapInputTypeToInputSettingsDto(
                input.inputSettings,
                input.inputType,
              ),
            inputType: input.inputType,
          } as InputDto)
        })
      })
    })

    return formDto
  }

  private async createFormTemplate(form: Form): Promise<void> {
    await this.sectionModel.create({
      formId: form.id,
      sectionType: SectionTypes.PREMISES,
      displayOrder: 0,
      name: { is: 'Forsendur', en: 'Premises' },
    } as Section)

    await this.sectionModel.create({
      formId: form.id,
      sectionType: SectionTypes.PARTIES,
      displayOrder: 1,
      name: { is: 'Hlutaðeigandi aðilar', en: 'Relevant parties' },
    } as Section)

    const inputSection = await this.sectionModel.create({
      formId: form.id,
      sectionType: SectionTypes.INPUT,
      displayOrder: 2,
      name: { is: 'Innsláttarsíða', en: 'InputPage' },
    } as Section)

    await this.sectionModel.create({
      formId: form.id,
      sectionType: SectionTypes.PAYMENT,
      displayOrder: 3,
      name: { is: 'Greiðsla', en: 'Payment' },
    } as Section)

    await this.pageModel.create({
      sectionId: inputSection.id,
      displayOrder: 0,
      name: { is: 'Síða 1', en: 'Page 1' },
    } as Page)
  }
}
