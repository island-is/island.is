import {
  buildDescriptionField,
  buildForm,
  buildPaymentPendingField,
  buildPdfPreviewField,
  buildRadioField,
  buildSubmitField,
  buildTextField,
} from '@island.is/application/core'
import {
  Field,
  FieldComponents,
  FieldTypes,
  Form,
  FormItemTypes,
  FormLeaf,
  FormModes,
  MultiField,
  Section,
  SubSection,
  FieldWidth,
  RadioField,
  StaticCheck,
  PdfViewerField,
} from '@island.is/application/types'

export class FormBuilder {
  private formDefinition: Form
  private section: SectionBuilder
  sectionsDefinitions: Section[] = []

  constructor(id: string, title: string) {
    this.section = new SectionBuilder(this)
    this.formDefinition = buildForm({
      id,
      title,
      mode: FormModes.DRAFT,
      renderLastScreenBackButton: true,
      renderLastScreenButton: true,
      children: [],
    })
  }

  startSection(data: { title: string }) {
    return this.section.add(data.title)
  }

  endForm() {
    this.formDefinition.children = this.sectionsDefinitions
    return this.formDefinition
  }
}

export class SectionBuilder {
  sectionDefinition: Section | null = null
  children: SectionChildrenBuilder
  subsection: SubSectionBuilder
  private sectionIdCounter = 0

  constructor(readonly formBuilder: FormBuilder) {
    this.children = new SectionChildrenBuilder(this)
    this.subsection = new SubSectionBuilder(this)
  }

  add(title: string) {
    const id = `section_${this.sectionIdCounter++}`
    this.sectionDefinition = {
      id,
      title,
      children: [],
      type: FormItemTypes.SECTION,
    }
    return this.children
  }

  startSubSection(data: { title: string }) {
    return this.subsection.add(data.title)
  }

  endSection() {
    if (this.sectionDefinition) {
      this.formBuilder.sectionsDefinitions.push(this.sectionDefinition)
    }
    return this.formBuilder
  }
}

export class SubSectionBuilder {
  sectionDefinition: SubSection | null = null
  private subSectionChildren: SubSectionChildrenBuilder
  private sectionIdCounter = 0
  constructor(readonly sectionBuilder: SectionBuilder) {
    this.subSectionChildren = new SubSectionChildrenBuilder(this)
  }
  add(title: string) {
    const id = `subSection_${this.sectionIdCounter++}`
    this.sectionDefinition = {
      id,
      title,
      children: [],
      type: FormItemTypes.SUB_SECTION,
    }
    return this.subSectionChildren
  }

  endSubSection() {
    if (this.sectionDefinition) {
      this.sectionBuilder.sectionDefinition?.children.push(
        this.sectionDefinition,
      )
    }
    return this.sectionBuilder
  }
}

export interface ISectionBuilderRestricted {
  startSubSection(data: { title: string }): SubSectionChildrenBuilder
  endSection(): FormBuilder
}

export class SubSectionChildrenBuilder {
  private fieldIdCounter = 0
  constructor(private readonly subSectionBuilder: SubSectionBuilder) {}

  private generateFieldId(prefix: string): string {
    return `subSectionChildren_${prefix}_${this.fieldIdCounter++}`
  }

  page(data: { title: string; children: Field[] }) {
    const multiField: MultiField = {
      id: this.generateFieldId(FormItemTypes.MULTI_FIELD),
      title: data.title,
      children: data.children,
      type: FormItemTypes.MULTI_FIELD,
    }
    this.subSectionBuilder.sectionDefinition?.children.push(multiField)
    return this
  }

  endSubSection(): ISectionBuilderRestricted {
    this.subSectionBuilder.endSubSection()
    return {
      startSubSection:
        this.subSectionBuilder.sectionBuilder.startSubSection.bind(
          this.subSectionBuilder.sectionBuilder,
        ),
      endSection: this.subSectionBuilder.sectionBuilder.endSection.bind(
        this.subSectionBuilder.sectionBuilder,
      ),
    }
  }
}

export class SectionChildrenBuilder {
  private fieldIdCounter = 0
  constructor(private readonly sectionBuilder: SectionBuilder) {}

  private generateFieldId(prefix: string): string {
    return `sectionChildren_${prefix}_${this.fieldIdCounter++}`
  }

  startSubSection(data: { title: string }) {
    return this.sectionBuilder.startSubSection(data)
  }

  page(data: { title: string; children: Field[] }) {
    const multiField: MultiField = {
      id: this.generateFieldId(FormItemTypes.MULTI_FIELD),
      title: data.title,
      children: data.children,
      type: FormItemTypes.MULTI_FIELD,
    }
    this.sectionBuilder.sectionDefinition?.children.push(multiField)
    return this
  }

  endSection() {
    return this.sectionBuilder.endSection()
  }
}

export abstract class FieldBuilderBase {
  private fieldIdCounter = 0
  protected abstract pushToChildrenArray(item: FormLeaf): void

  private generateFieldId(prefix: string): string {
    return `${prefix}_${this.fieldIdCounter++}`
  }

  descriptionField(data: { title: string; description: string }) {
    const field: FormLeaf = {
      id: this.generateFieldId(FieldTypes.DESCRIPTION),
      title: data.title,
      description: data.description,
      type: FieldTypes.DESCRIPTION,
      component: FieldComponents.DESCRIPTION,
      children: undefined,
    }
    const afield = buildDescriptionField({
      id: field.id,
      title: field.title,
      description: field.description,
      titleVariant: 'h3',
    })
    this.pushToChildrenArray(afield)
    return this
  }

  textField(data: { title: string; placeholder: string; width?: FieldWidth }) {
    const field: FormLeaf = {
      id: this.generateFieldId(FieldTypes.TEXT),
      title: data.title,
      placeholder: data.placeholder,
      type: FieldTypes.TEXT,
      component: FieldComponents.TEXT,
      children: undefined,
    }
    const textField = buildTextField({
      id: field.id,
      title: field.title,
      placeholder: field.placeholder,
      width: data.width,
      defaultValue: '',
    })
    this.pushToChildrenArray(textField)
    return this
  }

  keyValueField(data: { label: string; value: string; width?: FieldWidth }) {
    const field: FormLeaf = {
      id: this.generateFieldId(FieldTypes.KEY_VALUE),
      title: '',
      label: data.label,
      value: data.value,
      type: FieldTypes.KEY_VALUE,
      width: data.width,
      component: FieldComponents.KEY_VALUE,
      children: undefined,
    }
    this.pushToChildrenArray(field)
    return this
  }

  radioField(data: {
    id?: string
    width?: FieldWidth
    options: { label: string; value: string }[]
    largeButtons?: boolean
    condition?: StaticCheck
  }) {
    const radioField: Omit<RadioField, 'type' | 'component' | 'children'> = {
      id: data.id ? data.id : this.generateFieldId(FieldTypes.RADIO),
      backgroundColor: 'white',
      title: '',
      width: data.width,
      space: 0,
      largeButtons: data.largeButtons,
      options: data.options,
      condition: data.condition,
    }

    this.pushToChildrenArray(buildRadioField(radioField))
    return this
  }

  submitField(data?: { title?: string }) {
    const submitField = buildSubmitField({
      title: data?.title ? data.title : 'Senda inn umsókn',
      placement: 'footer',
      id: this.generateFieldId(FieldTypes.SUBMIT),
      refetchApplicationAfterSubmit: true,
      actions: [{ event: 'SUBMIT', name: 'Senda inn umsókn', type: 'primary' }],
    })

    this.pushToChildrenArray(submitField)
    return this
  }

  payementPendingField(data?: { title?: string }) {
    const field = buildPaymentPendingField({
      id: this.generateFieldId(FieldTypes.PAYMENT_PENDING),
      title: data?.title ? data.title : 'Senda inn umsókn',
    })
    this.pushToChildrenArray(field)
    return this
  }

  pdfPreviewField(
    data: Omit<PdfViewerField, 'type' | 'component' | 'children'>,
  ) {
    this.pushToChildrenArray(buildPdfPreviewField(data))
    return this
  }
}

export class FieldBuilder extends FieldBuilderBase {
  children: Field[] = []
  constructor() {
    super()
  }

  protected pushToChildrenArray(item: FormLeaf) {
    this.children.push(item as Field)
  }

  build() {
    return this.children
  }
}

export function fields() {
  return new FieldBuilder()
}

export function startForm(title: string) {
  return new FormBuilder('id', title)
}
