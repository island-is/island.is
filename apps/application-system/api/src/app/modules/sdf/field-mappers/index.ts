import { FieldTypes } from '@island.is/application/types'
import { FieldDef } from '@island.is/application/screen-compiler'

import { ComponentDto } from '../dto/screen.dto'
import { FormTextResolver } from '../i18n-resolver.service'
import { mapAccordionField } from './accordion.mapper'
import { mapAlertMessageField } from './alert-message.mapper'
import { mapCheckboxField } from './checkbox.mapper'
import { mapCopyLinkField } from './copy-link.mapper'
import { mapCustomField } from './custom.mapper'
import { mapDataTableField } from './data-table.mapper'
import { mapDateField } from './date.mapper'
import { mapDescriptionField } from './description.mapper'
import { mapDisplayField } from './display.mapper'
import { mapExpandableDescriptionField } from './expandable-description.mapper'
import { mapFileUploadField } from './fileupload.mapper'
import { mapHiddenInputWithWatchedValueField } from './hidden-input-with-watched-value.mapper'
import { mapImageField } from './image.mapper'
import { mapInformationCardField } from './information-card.mapper'
import { mapKeyValueField } from './key-value.mapper'
import { mapLinkField } from './link.mapper'
import { mapMessageWithLinkButtonField } from './message-with-link-button-field.mapper'
import { mapOverviewField } from './overview.mapper'
import { mapPaymentChargeOverviewField } from './payment-charge-overview.mapper'
import { mapPdfLinkButtonField } from './pdf-link-button.mapper'
import { mapPhoneField } from './phone.mapper'
import { mapSearchField } from './search.mapper'
import { mapSelectField } from './select.mapper'
import { mapSliderField } from './slider.mapper'
import { mapStaticTableField } from './static-table.mapper'
import { mapSubmitField } from './submit.mapper'
import { mapTextField } from './text.mapper'
import { FieldMapper, FieldMapperContext, FieldMapperRaw } from './types'
import { applySharedFieldProps, createBaseComponent } from './utils'

const fieldMappers: Partial<Record<FieldTypes, FieldMapper>> = {
  [FieldTypes.ACCORDION]: mapAccordionField,
  [FieldTypes.ALERT_MESSAGE]: mapAlertMessageField,
  [FieldTypes.CHECKBOX]: mapCheckboxField,
  [FieldTypes.COPY_LINK]: mapCopyLinkField,
  [FieldTypes.CUSTOM]: mapCustomField,
  [FieldTypes.DATA_TABLE]: mapDataTableField,
  [FieldTypes.DATE]: mapDateField,
  [FieldTypes.DESCRIPTION]: mapDescriptionField,
  [FieldTypes.DISPLAY]: mapDisplayField,
  [FieldTypes.EXPANDABLE_DESCRIPTION]: mapExpandableDescriptionField,
  [FieldTypes.FILEUPLOAD]: mapFileUploadField,
  [FieldTypes.HIDDEN_INPUT_WITH_WATCHED_VALUE]: mapHiddenInputWithWatchedValueField,
  [FieldTypes.IMAGE]: mapImageField,
  [FieldTypes.INFORMATION_CARD]: mapInformationCardField,
  [FieldTypes.KEY_VALUE]: mapKeyValueField,
  [FieldTypes.LINK]: mapLinkField,
  [FieldTypes.MESSAGE_WITH_LINK_BUTTON_FIELD]: mapMessageWithLinkButtonField,
  [FieldTypes.OVERVIEW]: mapOverviewField,
  [FieldTypes.PAYMENT_CHARGE_OVERVIEW]: mapPaymentChargeOverviewField,
  [FieldTypes.PDF_LINK_BUTTON]: mapPdfLinkButtonField,
  [FieldTypes.PHONE]: mapPhoneField,
  [FieldTypes.SEARCH]: mapSearchField,
  [FieldTypes.SELECT]: mapSelectField,
  [FieldTypes.SLIDER]: mapSliderField,
  [FieldTypes.STATIC_TABLE]: mapStaticTableField,
  [FieldTypes.SUBMIT]: mapSubmitField,
  [FieldTypes.TEXT]: mapTextField,
}

export const mapFieldToComponent = (
  field: FieldDef,
  resolver: FormTextResolver,
  application: FieldMapperContext['application'],
): ComponentDto => {
  const raw = field as FieldMapperRaw
  const context: FieldMapperContext = {
    application,
    resolver,
  }
  const component = createBaseComponent(field, raw, context)

  applySharedFieldProps(component, raw, context)
  fieldMappers[raw.type as FieldTypes]?.(component, raw, context)

  return component
}

export { asResolvableFormText } from './utils'
