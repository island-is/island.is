import { Injectable, NotFoundException } from '@nestjs/common'
import {
  ContextService,
  TemplateService,
} from '@island.is/application/api/core'
import { FormDto } from './dto/form.dto'
import {
  Application as BaseApplication,
  Field,
  Form,
  FormChildren,
  FormItemChildren,
  FormItemTypes,
  FormLeaf,
  FormNode,
  FormatMessage,
  MultiField,
  Section,
  SectionChildren,
  SubSection,
} from '@island.is/application/types'
import { ApplicationTemplateHelper } from '@island.is/application/core'
import { SectionFactory } from './formFactory/formItems/sectionFactory'

type AllChildren = Section | SubSection | FormLeaf | SectionChildren

type NavSection = { id: number; title: string; idd: string; active: boolean }

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
    formatMessage: FormatMessage,
  ): Promise<any> {
    const template = await this.templateService.getApplicationTemplate(
      application.typeId,
    )

    this.contextService.setContext(application, formatMessage)
    //TODO: Refactor template functions
    const templateHelper = new ApplicationTemplateHelper(application, template)

    const userRole = template.mapUserToRole(nationalId, application) ?? ''

    const form = templateHelper.getRoleInState(userRole)?.form

    if (!form) return undefined
    //have to check for conditoions on pages to get the right indexd
    const multifields = this.getPagesFromForm(form)

    for (let i = 0; i < multifields.length; i++) {
      console.log('multifield', multifields[i].id)
    }

    const id = multifields[2].id ?? ''

    return this.getCurrentPageDetails(form, id)
  }

  getPagesFromForm(form: Form): MultiField[] {
    const findMultiField = (children: FormItemChildren[]): MultiField[] => {
      let pages: MultiField[] = []
      children.forEach((child) => {
        if (child.type === FormItemTypes.MULTI_FIELD) {
          pages.push(child) // Add the multifield itself to the list
        }

        // Recursively find multifields in the children, regardless of the child type
        pages = [...pages, ...findMultiField(child.children || [])] // Handle undefined case with default value of empty array
      })
      return pages
    }

    const fueild = findMultiField(form.children)
    return fueild
  }

  async renderForm(form: Form): Promise<FormDto> {
    const formDto = new FormDto()

    formDto.icon = form.icon
    formDto.id = form.id
    formDto.logo = form.logo as unknown as string //TODO , Cant return a react component
    formDto.mode = form.mode
    formDto.renderLastScreenBackButton = form.renderLastScreenBackButton
    formDto.renderLastScreenButton = form.renderLastScreenButton
    formDto.title = this.contextService.formatText(form.title)
    formDto.type = form.type
    formDto.children = []
    form.children.forEach((child) => {
      formDto.children.push(this.sectionFactory.create(child))
    })

    return formDto
  }

  private findPage(form: FormChildren[], pageId: string): FormLeaf | null {
    const stack: FormItemChildren[] = form
    while (stack.length > 0) {
      console.log('stack ' + stack)
      const current = stack.pop()
      if (!current) {
        continue
      }
      if (this.isSection(current)) {
        console.log(current.id)
        console.log('type : ' + current.type)

        //log ouat the children ids
        if (current.children) {
          current.children.forEach((child) => {
            console.log('child id : ' + child.id)
          })
        }
      }
      3
      if (current.id === pageId && this.isFormLeaf(current)) {
        console.log('stack ' + stack)
        return current as FormLeaf
      }
      if (current.children) {
        stack.push(...current.children)
      }
    }
    return null
  }

  private findPageWithParents(
    item: FormItemChildren | Section | Form,
    pageId: string,
    parents: (FormItemChildren | Section | Form)[] = [],
  ): { page: FormLeaf | null; parents: (FormItemChildren | Section | Form)[] } {
    if (item.id === pageId && this.isFormLeaf(item)) {
      return { page: item as FormLeaf, parents }
    }

    if (item.children) {
      for (const child of item.children) {
        const result = this.findPageWithParents(child, pageId, [
          ...parents,
          item,
        ])
        if (result.page) {
          return result
        }
      }
    }

    return { page: null, parents: [] }
  }

  private isSection(item: FormItemChildren): item is Section | SubSection {
    return (
      item.type === FormItemTypes.SECTION ||
      item.type === FormItemTypes.SUB_SECTION
    )
  }

  private isFormLeaf(item: FormItemChildren | Form): item is FormLeaf {
    return (
      item.type === FormItemTypes.MULTI_FIELD ||
      item.type === FormItemTypes.EXTERNAL_DATA_PROVIDER ||
      item.type === FormItemTypes.REPEATER
    )
  }
  private getSections(form: Form, currentSectionId: string): NavSection[] {
    const sections: NavSection[] = []
    let idCounter = 1

    const addSection = (item: FormItemChildren) => {
      if (
        item.type === FormItemTypes.SECTION ||
        item.type === FormItemTypes.SUB_SECTION
      ) {
        sections.push({
          id: idCounter++,
          title: item.title as string,
          idd: item.id ?? 'noID',
          active: item.id === currentSectionId,
        })
        if ('children' in item) {
          item.children.forEach((child) => addSection(child))
        }
      }
    }

    form.children.forEach((child) => addSection(child))

    return sections
  }

  getCurrentPageDetails(form: Form, pageId: string) {
    const { page, parents } = this.findPageWithParents(form, pageId)
    if (!page) {
      throw new NotFoundException('Page not found')
    }

    parents.forEach((parent) => {
      if (this.isSection(parent as FormItemChildren)) {
        console.log('parent id : ' + parent.id)
      }
    })

    const sectionId =
      parents.find((parent) => this.isSection(parent as FormItemChildren))
        ?.id ?? 'notfoaund'

    const sections = this.getSections(form, sectionId)

    return {
      sectionProgress: 1,
      sections: sections,
      page: {
        index: 1,
        components: page.children,
        footer: {
          rightButton: {
            text: 'Next',
            type: 'Primary',
          },
          leftButton: {
            text: 'Back',
            type: 'Secondary',
          },
        },
      },
    }
  }
}
