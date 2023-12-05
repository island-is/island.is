import { Injectable } from '@nestjs/common'
import {
  ContextService,
  TemplateService,
} from '@island.is/application/api/core'
import { FormDto } from './dto/form.dto'
import {
  Application as BaseApplication,
  Form,
} from '@island.is/application/types'
import { ApplicationTemplateHelper } from '@island.is/application/core'
import { SectionFactory } from './formFactory/formItems/sectionFactory'

@Injectable()
export class FormService {
  constructor(
    private readonly templateService: TemplateService,
    private sectionFactory: SectionFactory,
    private contextService: ContextService,
  ) {}

  async getFormByApplicationId(
    nationalId: string,
    application: BaseApplication,
  ): Promise<FormDto> {
    const template = await this.templateService.getApplicationTemplate(
      application.typeId,
    )
    this.contextService.setContext(application)
    //TODO: Refactor template functions
    const templateHelper = new ApplicationTemplateHelper(application, template)
    const userRole = template.mapUserToRole(nationalId, application) ?? ''
    const form = templateHelper.getRoleInState(userRole)?.form

    if (!form) throw new Error('Form not found')
    return this.renderForm(form)
  }

  async renderForm(form: Form): Promise<FormDto> {
    const formDto = new FormDto()

    formDto.icon = form.icon
    formDto.id = form.id
    formDto.logo = form.logo as unknown as string
    formDto.mode = form.mode
    formDto.renderLastScreenBackButton = form.renderLastScreenBackButton
    formDto.renderLastScreenButton = form.renderLastScreenButton
    formDto.title = form.title as unknown as string
    formDto.type = form.type
    formDto.children = []

    form.children.forEach((child) => {
      formDto.children.push(this.sectionFactory.create(child))
    })

    console.log('formDto rendiering ', formDto)

    return formDto
  }
}
