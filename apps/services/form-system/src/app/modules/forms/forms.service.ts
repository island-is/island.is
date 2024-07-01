import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { SectionTypes } from '../../enums/sectionTypes'
import { FormApplicantDto } from '../applicants/models/dto/formApplicant.dto'
import { ScreenDto } from '../screens/models/dto/screen.dto'
import { Screen } from '../screens/models/screen.model'
import { FieldSettingsMapper } from '../fieldSettings/models/fieldSettings.mapper'
import { FieldSettings } from '../fieldSettings/models/fieldSettings.model'
import { FieldDto } from '../fields/models/dto/field.dto'
import { FieldTypeDto } from '../fields/models/dto/fieldType.dto'
import { Field } from '../fields/models/field.model'
import { FieldType } from '../fields/models/fieldType.model'
import { ListTypeDto } from '../lists/models/dto/listType.dto'
import { ListType } from '../lists/models/listType.model'
import { Organization } from '../organizations/models/organization.model'
import { SectionDto } from '../sections/models/dto/section.dto'
import { Section } from '../sections/models/section.model'
import { FormCertificationTypeDto } from '../certifications/models/dto/formCertificationType.dto'
import { CertificationTypeDto } from '../certifications/models/dto/certificationType.dto'
import { CertificationType } from '../certifications/models/certificationType.model'
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
    @InjectModel(Screen)
    private readonly screenModel: typeof Screen,
    @InjectModel(Organization)
    private readonly organizationModel: typeof Organization,
    @InjectModel(FieldType)
    private readonly fieldTypeModel: typeof FieldType,
    @InjectModel(ListType)
    private readonly listTypeModel: typeof ListType,
    private readonly fieldSettingsMapper: FieldSettingsMapper,
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
              model: Screen,
              as: 'screens',
              include: [
                {
                  model: Field,
                  as: 'fields',
                  include: [
                    {
                      model: FieldSettings,
                      as: 'fieldSettings',
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
      fieldTypes: await this.getFieldTypes(form.organizationId),
      certificationTypes: await this.getCertificationTypes(form.organizationId),
      listTypes: await this.getListTypes(form.organizationId),
    }

    return response
  }

  private async getCertificationTypes(
    organizationId: string,
  ): Promise<CertificationTypeDto[]> {
    const organizationSpecificCertificationTypes =
      await this.organizationModel.findByPk(organizationId, {
        include: [CertificationType],
      })

    const organizationCertificationTypes =
      organizationSpecificCertificationTypes?.organizationCertificationTypes as CertificationType[]

    const certificationTypesDto: CertificationTypeDto[] = []

    organizationCertificationTypes?.map((certificationType) => {
      certificationTypesDto.push({
        id: certificationType.id,
        type: certificationType.type,
        name: certificationType.name,
        description: certificationType.description,
      } as CertificationTypeDto)
    })

    return certificationTypesDto
  }

  private async getFieldTypes(organizationId: string): Promise<FieldTypeDto[]> {
    const commonFieldTypes = await this.fieldTypeModel.findAll({
      where: { isCommon: true },
    })
    const organizationSpecificFieldTypes =
      await this.organizationModel.findByPk(organizationId, {
        include: [FieldType],
      })

    const organizationFieldTypes = commonFieldTypes.concat(
      organizationSpecificFieldTypes?.organizationFieldTypes as FieldType[],
    )

    const fieldTypesDto: FieldTypeDto[] = []
    organizationFieldTypes.map((fieldType) => {
      fieldTypesDto.push({
        id: fieldType.id,
        type: fieldType.type,
        name: fieldType.name,
        description: fieldType.description,
        isCommon: fieldType.isCommon,
        fieldSettings: this.fieldSettingsMapper.mapFieldTypeToFieldSettingsDto(
          null,
          fieldType.type,
        ),
      } as FieldTypeDto)
    })

    return fieldTypesDto
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
      stopProgressOnValidatingScreen: form.stopProgressOnValidatingScreen,
      completedMessage: form.completedMessage,
      certificationTypes: [],
      applicants: [],
      sections: [],
      screens: [],
      fields: [],
    }

    form.certificationTypes?.map((certificationType) => {
      formDto.certificationTypes?.push({
        id: certificationType.id,
        name: certificationType.name,
        description: certificationType.description,
        type: certificationType.type,
      } as FormCertificationTypeDto)
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
      } as SectionDto)
      section.screens?.map((screen) => {
        formDto.screens?.push({
          id: screen.id,
          sectionId: section.id,
          name: screen.name,
          created: screen.created,
          modified: screen.modified,
          displayOrder: screen.displayOrder,
          isHidden: screen.isHidden,
          multiset: screen.multiset,
          callRuleset: screen.callRuleset,
        } as ScreenDto)
        screen.fields?.map((field) => {
          formDto.fields?.push({
            id: field.id,
            screenId: screen.id,
            name: field.name,
            created: field.created,
            modified: field.modified,
            displayOrder: field.displayOrder,
            description: field.description,
            isHidden: field.isHidden,
            isPartOfMultiset: field.isPartOfMultiset,
            fieldSettings:
              this.fieldSettingsMapper.mapFieldTypeToFieldSettingsDto(
                field.fieldSettings,
                field.fieldType,
              ),
            fieldType: field.fieldType,
          } as FieldDto)
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
      name: { is: 'Kafli', en: 'Section' },
    } as Section)

    await this.sectionModel.create({
      formId: form.id,
      sectionType: SectionTypes.PAYMENT,
      displayOrder: 3,
      name: { is: 'Greiðsla', en: 'Payment' },
    } as Section)

    await this.screenModel.create({
      sectionId: inputSection.id,
      displayOrder: 0,
      name: { is: 'innsláttarsíða 1', en: 'Input screen 1' },
    } as Screen)
  }
}
