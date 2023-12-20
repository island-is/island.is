import {
  CheckboxField,
  DateField,
  Field,
  FieldComponents,
  FieldTypes,
  Form,
  FormItemTypes,
  FormModes,
  IField,
  IForm,
  IFormItem,
  Section,
  SectionChildren,
  SubSection,
  ExternalDataProvider,
  DescriptionField,
  TextField,
  RadioField,
  SubmitField,
  PaymentPendingField,
  LinkField,
  AlertMessageField,
  ExpandableDescriptionField,
  MessageWithLinkButtonField,
  PdfViewerField,
  MultiField,
} from '@island.is/application/types'

export class FormTypeConverter {
  private fieldMappers: {
    [key: string]: (sourceField: IField) => Field
  }

  constructor() {
    this.fieldMappers = {
      [FieldTypes.DESCRIPTION]: this.createDescriptionField.bind(this),
      [FieldTypes.TEXT]: this.createTextField.bind(this),
      [FieldTypes.RADIO]: this.createRadioField.bind(this),
      [FieldTypes.CHECKBOX]: this.createCheckboxField.bind(this),
      [FieldTypes.SUBMIT]: this.createSubmitField.bind(this),
      [FieldTypes.DATE]: this.createDateField.bind(this),
      [FieldTypes.PAYMENT_PENDING]: this.createPaymentPendingField.bind(this),
      [FieldTypes.LINK]: this.createLinkField.bind(this),
      [FieldTypes.ALERT_MESSAGE]: this.createAlertMessageField.bind(this),
      [FieldTypes.EXPANDABLE_DESCRIPTION]:
        this.createExpandableDescriptionField.bind(this),
      [FieldTypes.MESSAGE_WITH_LINK_BUTTON_FIELD]:
        this.createMessageWithLinkButtonField.bind(this),
      [FieldTypes.PDF_VIEWER]: this.createPdfViewerField.bind(this),
    }
  }

  public convertIField(sourceField: IField): Field {
    const mapper = this.fieldMappers[sourceField.type]
    if (!mapper) {
      throw new Error(`Unhandled field type: ${sourceField.type}`)
    }
    return mapper(sourceField) as Field
  }

  private createDescriptionField(sourceField: IField): DescriptionField {
    return {
      id: sourceField.id,
      type: FieldTypes.DESCRIPTION,
      component: FieldComponents.DESCRIPTION,
      title: sourceField.title,
      description: sourceField.description,
      children: undefined,
    }
  }

  private createTextField(sourceField: IField): TextField {
    return {
      id: sourceField.id,
      type: FieldTypes.TEXT,
      component: FieldComponents.TEXT,
      title: sourceField.title,
      description: sourceField.description,
      defaultValue: sourceField.defaultValue,
      children: undefined,
    }
  }

  private createRadioField(sourceField: IField): RadioField {
    return {
      id: sourceField.id,
      type: FieldTypes.RADIO,
      title: sourceField.title,
      component: FieldComponents.RADIO,
      children: undefined,
    } as RadioField //not finished so casting
  }

  private createCheckboxField(sourceField: IField): CheckboxField {
    return {
      id: sourceField.id,
      type: FieldTypes.CHECKBOX,
      component: FieldComponents.CHECKBOX,
      title: sourceField.title,
      children: undefined,
      // ... other CheckboxField specific mappings
    } as CheckboxField
  }

  private createSubmitField(sourceField: IField): SubmitField {
    return {
      id: sourceField.id,
      type: FieldTypes.SUBMIT,
      component: FieldComponents.SUBMIT,
      title: sourceField.title,
      actions: [
        {
          name: sourceField.specifics?.name?.toString() ?? '',
          type: sourceField.specifics?.type?.toString() as
            | 'primary'
            | 'subtle'
            | 'reject'
            | 'sign',
          event: sourceField.specifics?.event?.toString() ?? '',
        },
      ],
      placement: sourceField.specifics?.placement?.toString() as
        | 'footer'
        | 'screen',
      refetchApplicationAfterSubmit: true,
      children: undefined,
    }
  }

  private createDateField(sourceField: IField): DateField {
    // ... mappings for DateField
    return {} as DateField
  }

  private createPaymentPendingField(sourceField: IField): PaymentPendingField {
    return {
      id: sourceField.id,
      title: sourceField.title,
      type: FieldTypes.PAYMENT_PENDING,
      component: FieldComponents.PAYMENT_PENDING,
      children: undefined,
    }
  }

  private createLinkField(sourceField: IField): LinkField {
    return {
      id: sourceField.id,
      type: FieldTypes.LINK,
      component: FieldComponents.LINK,
      title: sourceField.title,
      s3key: sourceField.specifics?.s3key?.toString(),
      link: sourceField.specifics?.link?.toString(),
      iconProps: {
        type: sourceField.specifics?.iconType?.toString(),
        icon: sourceField.specifics?.icon?.toString(),
      },
    } as LinkField //not finished so casting
  }

  private createAlertMessageField(sourceField: IField): AlertMessageField {
    return {
      id: sourceField.id,
      type: FieldTypes.ALERT_MESSAGE,
      component: FieldComponents.ALERT_MESSAGE,
      message: sourceField.specifics?.message?.toString(),
      links: sourceField.specifics?.links?.toString(),
      alertType: sourceField.specifics?.alertType?.toString(),
    } as AlertMessageField
  }

  private createExpandableDescriptionField(
    sourceField: IField,
  ): ExpandableDescriptionField {
    return {
      id: sourceField.id,
      title: sourceField.title,
      type: FieldTypes.EXPANDABLE_DESCRIPTION,
      component: FieldComponents.EXPANDABLE_DESCRIPTION,
      introText: sourceField.specifics?.introText?.toString(),
      description: sourceField.specifics?.description?.toString() ?? '',
      startExpanded: sourceField.specifics?.startExpanded as boolean,
      children: undefined,
    }
  }

  private createMessageWithLinkButtonField(
    sourceField: IField,
  ): MessageWithLinkButtonField {
    return {
      id: sourceField.id,
      title: sourceField.title,
      type: FieldTypes.MESSAGE_WITH_LINK_BUTTON_FIELD,
      component: FieldComponents.MESSAGE_WITH_LINK_BUTTON_FIELD,
      url: sourceField.specifics?.url?.toString() ?? '',
      buttonTitle: sourceField.specifics?.buttonTitle?.toString() ?? '',
      message: sourceField.specifics?.message?.toString() ?? '',
      children: undefined,
    }
  }

  private createPdfViewerField(sourceField: IField): PdfViewerField {
    return {
      id: sourceField.id,
      type: FieldTypes.PDF_VIEWER,
      component: FieldComponents.PDF_VIEWER,
      title: sourceField.title,
      description: sourceField.description,
      pdfKey: sourceField.specifics?.pdfKey?.toString() ?? '',
      openMySitesLabel:
        sourceField.specifics?.openMySitesLabel?.toString() ?? '',
      downloadPdfButtonLabel:
        sourceField.specifics?.downloadPdfButtonLabel?.toString() ?? '',
      successTitle: sourceField.specifics?.successTitle?.toString() ?? '',
      successDescription:
        sourceField.specifics?.successDescription?.toString() ?? '',
      verificationDescription:
        sourceField.specifics?.verificationDescription?.toString() ?? '',
      verificationLinkUrl:
        sourceField.specifics?.verificationLinkUrl?.toString() ?? '',
      verificationLinkTitle:
        sourceField.specifics?.verificationLinkTitle?.toString() ?? '',
      viewPdfButtonLabel:
        sourceField.specifics?.viewPdfButtonLabel?.toString() ?? '',
      openInboxButtonLabel:
        sourceField.specifics?.openInboxButtonLabel?.toString() ?? '',
      confirmationMessage:
        sourceField.specifics?.confirmationMessage?.toString() ?? '',
      children: undefined,
    }
  }

  public convertIDataProviderItem(sourceItem: IFormItem): ExternalDataProvider {
    if (sourceItem.dataProviders === undefined) {
      throw new Error(`Missing dataProviders property`)
    }
    return {
      id: sourceItem.id,
      type: FormItemTypes.EXTERNAL_DATA_PROVIDER,
      title: sourceItem.title,
      dataProviders: sourceItem.dataProviders,
      children: undefined,
    } as ExternalDataProvider
  }

  public convertIFormItem(sourceItem: IFormItem): SectionChildren {
    switch (sourceItem.type) {
      case FormItemTypes.EXTERNAL_DATA_PROVIDER:
        return this.convertIDataProviderItem(sourceItem)
      case FormItemTypes.SUB_SECTION:
        return {
          id: sourceItem.id,
          type: FormItemTypes.SUB_SECTION,
          title: sourceItem.title,
          children: sourceItem.children.map((child) =>
            this.convertIFormItem(child),
          ),
        } as SubSection
      case FormItemTypes.MULTI_FIELD:
        return {
          id: sourceItem.id,
          title: sourceItem.title,
          type: FormItemTypes.MULTI_FIELD,
          children: sourceItem.fields
            ? sourceItem.fields.map((field) => this.convertIField(field))
            : [],
        } as MultiField
      // ... cases for other FormChildren subtypes
      default:
        throw new Error(`Unhandled form item type: ${sourceItem.type}`)
    }
  }

  public convertSection(sourceSection: IFormItem): Section {
    return {
      id: sourceSection.id,
      type: FormItemTypes.SECTION,
      title: sourceSection.title,
      children: sourceSection.children.map((child) =>
        this.convertIFormItem(child),
      ),
      // ... other Section specific mappings
    } as Section
  }

  public convertIForm(sourceForm: IForm): Form {
    return {
      children: sourceForm.children.map((child) => this.convertSection(child)),
      icon: sourceForm.icon,
      id: sourceForm.id,
      mode: sourceForm.mode,
      renderLastScreenBackButton: sourceForm.renderLastScreenBackButton,
      renderLastScreenButton: sourceForm.renderLastScreenButton,
      title: sourceForm.title,
      type: FormItemTypes.FORM,
    } as Form
  }
}
