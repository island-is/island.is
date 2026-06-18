/**
 * Single checklist for SDF coverage: every {@link FieldTypes} value must resolve
 * end-to-end (screen-mapper → REST → GraphQL union → FormRenderer).
 *
 * @see ServerDriven-App-Sys.md — GraphQL Screen contract
 */
import { FieldTypes } from '@island.is/application/types'

/** Every FieldTypes enum value except synthetic routing-only kinds. */
export const ALL_SDF_FIELD_TYPES: FieldTypes[] = Object.values(
  FieldTypes,
) as FieldTypes[]

/**
 * GraphQL object type name (Sdf-prefixed) returned by Nest `resolveComponentType`
 * for `{ type: FieldTypes.X }`. Must stay aligned with
 * `libs/api/domains/application/src/lib/sdf.model.ts` (`resolveComponentTypeByName`).
 */
export const FIELD_TYPE_TO_GRAPHQL_TYPENAME: Record<FieldTypes, string> = {
  [FieldTypes.TEXT]: 'SdfTextField',
  [FieldTypes.EMAIL]: 'SdfTextField',
  [FieldTypes.SEARCH]: 'SdfSearchField',
  [FieldTypes.SELECT]: 'SdfSelectField',
  [FieldTypes.DATA_TABLE]: 'SdfDataTableField',
  [FieldTypes.RADIO]: 'SdfRadioField',
  [FieldTypes.CHECKBOX]: 'SdfCheckboxField',
  [FieldTypes.DATE]: 'SdfDateField',
  [FieldTypes.FILEUPLOAD]: 'SdfFileUploadField',
  [FieldTypes.PHONE]: 'SdfPhoneField',
  [FieldTypes.NATIONAL_ID_WITH_NAME]: 'SdfNationalIdWithNameField',
  [FieldTypes.COMPANY_SEARCH]: 'SdfCompanySearchField',
  [FieldTypes.ASYNC_SELECT]: 'SdfAsyncSelectField',
  [FieldTypes.SUBMIT]: 'SdfSubmitField',
  [FieldTypes.DIVIDER]: 'SdfDividerField',
  [FieldTypes.DESCRIPTION]: 'SdfDescriptionField',
  [FieldTypes.KEY_VALUE]: 'SdfKeyValueField',
  [FieldTypes.ALERT_MESSAGE]: 'SdfAlertMessageField',
  [FieldTypes.LINK]: 'SdfLinkField',
  [FieldTypes.REDIRECT_TO_SERVICE_PORTAL]: 'SdfRedirectToServicePortalField',
  [FieldTypes.PAYMENT_PENDING]: 'SdfPaymentPendingField',
  [FieldTypes.MESSAGE_WITH_LINK_BUTTON_FIELD]: 'SdfMessageWithLinkButtonField',
  [FieldTypes.EXPANDABLE_DESCRIPTION]: 'SdfExpandableDescriptionField',
  [FieldTypes.ACCORDION]: 'SdfAccordionField',
  [FieldTypes.ACTION_CARD_LIST]: 'SdfActionCardListField',
  [FieldTypes.TABLE_REPEATER]: 'SdfTableRepeaterField',
  [FieldTypes.FIELDS_REPEATER]: 'SdfFieldsRepeaterField',
  [FieldTypes.STATIC_TABLE]: 'SdfStaticTableField',
  [FieldTypes.PAGINATED_SEARCHABLE_TABLE]: 'SdfPaginatedSearchableTableField',
  [FieldTypes.HIDDEN_INPUT]: 'SdfHiddenInputField',
  [FieldTypes.HIDDEN_INPUT_WITH_WATCHED_VALUE]:
    'SdfHiddenInputWithWatchedValueField',
  [FieldTypes.FIND_VEHICLE]: 'SdfFindVehicleField',
  [FieldTypes.VEHICLE_RADIO]: 'SdfRadioField',
  [FieldTypes.VEHICLE_SELECT]: 'SdfSelectField',
  [FieldTypes.DISPLAY]: 'SdfDisplayField',
  [FieldTypes.IMAGE]: 'SdfImageField',
  [FieldTypes.BANK_ACCOUNT]: 'SdfBankAccountField',
  [FieldTypes.SLIDER]: 'SdfSliderField',
  [FieldTypes.TITLE]: 'SdfTitleField',
  [FieldTypes.OVERVIEW]: 'SdfOverviewField',
  [FieldTypes.VEHICLE_PERMNO_WITH_INFO]: 'SdfVehiclePermnoWithInfoField',
  [FieldTypes.INFORMATION_CARD]: 'SdfInformationCardField',
  [FieldTypes.PAYMENT_CHARGE_OVERVIEW]: 'SdfPaymentChargeOverviewField',
  [FieldTypes.PDF_LINK_BUTTON]: 'SdfPdfLinkButtonField',
  [FieldTypes.COPY_LINK]: 'SdfCopyLinkField',
  [FieldTypes.CUSTOM]: 'SdfCustomComponent',
}
