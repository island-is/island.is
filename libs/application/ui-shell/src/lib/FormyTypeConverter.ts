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
} from '@island.is/application/types'

export class FormTypeConverter {
  convertIField(sourceField: IField): Field {
    switch (sourceField.type) {
      case FieldTypes.DESCRIPTION:
        return {
          id: sourceField.id,
          type: FieldTypes.DESCRIPTION,
          component: FieldComponents.DESCRIPTION,
          title: sourceField.title,
          description: sourceField.description,
        } as DescriptionField
      case FieldTypes.TEXT:
        return {
          id: sourceField.id,
          type: FieldTypes.TEXT,
          component: FieldComponents.TEXT,
          title: sourceField.title,
          description: sourceField.description,
          defaultValue: sourceField.defaultValue,
        } as TextField
      case FieldTypes.RADIO:
        return {
          id: sourceField.id,
          type: FieldTypes.RADIO,
          title: sourceField.title,
          component: FieldComponents.RADIO,
        } as RadioField
      case FieldTypes.CHECKBOX:
        return {
          id: sourceField.id,
          type: FieldTypes.CHECKBOX,
          component: FieldComponents.CHECKBOX,
          title: sourceField.title,
          // ... other CheckboxField specific mappings
        } as CheckboxField
      case FieldTypes.SUBMIT:
        return {
          //Figure out how to handle this.
          //dynamic actions on conditions might be a way to go.
          id: sourceField.id,
          type: FieldTypes.SUBMIT,
          component: FieldComponents.SUBMIT,
          title: sourceField.title,
          actions: [
            {
              name: sourceField.specifics?.name,
              type: sourceField.specifics?.type,
              event: sourceField.specifics?.event,
            },
          ],
          placement: sourceField.specifics?.placement,
          refetchApplicationAfterSubmit: true,
        } as SubmitField
      case FieldTypes.DATE:
        return {
          // ... mappings for DateField
        } as DateField
      case FieldTypes.PAYMENT_PENDING:
        return {
          id: sourceField.id,
          type: FieldTypes.PAYMENT_PENDING,
          component: FieldComponents.PAYMENT_PENDING,
        } as PaymentPendingField
      case FieldTypes.LINK:
        return {
          id: sourceField.id,
          type: FieldTypes.LINK,
          component: FieldComponents.LINK,
          title: sourceField.title,
          s3key: sourceField.specifics?.s3key?.toString(),
        } as LinkField
      case FieldTypes.ALERT_MESSAGE:
        return {
          id: sourceField.id,
          type: FieldTypes.ALERT_MESSAGE,
          component: FieldComponents.ALERT_MESSAGE,
          message: sourceField.specifics?.message?.toString(),
          links: sourceField.specifics?.links?.toString(),
        } as AlertMessageField
      case FieldTypes.EXPANDABLE_DESCRIPTION:
        return {
          id: sourceField.id,
          type: FieldTypes.EXPANDABLE_DESCRIPTION,
          component: FieldComponents.EXPANDABLE_DESCRIPTION,
          introText: sourceField.specifics?.introText?.toString(),
          description: sourceField.specifics?.description?.toString(),
          startExpanded: sourceField.specifics?.startExpanded ?? false,
        } as ExpandableDescriptionField
      case FieldTypes.MESSAGE_WITH_LINK_BUTTON_FIELD:
        return {
          id: sourceField.id,
          type: FieldTypes.MESSAGE_WITH_LINK_BUTTON_FIELD,
          component: FieldComponents.MESSAGE_WITH_LINK_BUTTON_FIELD,
          url: sourceField.specifics?.url?.toString() ?? '',
          buttonTitle: sourceField.specifics?.buttonTitle?.toString() ?? '',
          message: sourceField.specifics?.message?.toString() ?? '',
        } as MessageWithLinkButtonField
      // ... cases for other Field subtypes
      default:
        throw new Error(`Unhandled field type: ${sourceField.type}`)
    }
  }

  convertIDataProviderItem(sourceItem: IFormItem): ExternalDataProvider {
    if (sourceItem.dataProviders === undefined)
      throw new Error(`Missing dataProviders property`)
    return {
      id: sourceItem.id,
      type: FormItemTypes.EXTERNAL_DATA_PROVIDER,
      title: sourceItem.title,
      dataProviders: sourceItem.dataProviders,
      children: undefined,
    }
  }

  convertIFormItem(sourceItem: IFormItem): SectionChildren {
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
        }

      // ... cases for other FormChildren subtypes
      default:
        throw new Error(`Unhandled form item type: ${sourceItem.type}`)
    }
  }

  convertSection(sourceSection: IFormItem): Section {
    return {
      id: sourceSection.id,
      type: FormItemTypes.SECTION,
      title: sourceSection.title,
      children: sourceSection.children.map((child) =>
        this.convertIFormItem(child),
      ),
      // ... other Section specific mappings
    }
  }

  convertIForm(sourceForm: IForm): Form {
    return {
      children: sourceForm.children.map((child) => this.convertSection(child)),
      icon: sourceForm.icon,
      id: sourceForm.id,
      //logo: '',
      mode: FormModes.IN_PROGRESS, // Take this form the sourceForm.mode
      renderLastScreenBackButton: sourceForm.renderLastScreenBackButton,
      renderLastScreenButton: sourceForm.renderLastScreenButton,
      title: sourceForm.title,
      type: FormItemTypes.FORM,
    }
  }
}
