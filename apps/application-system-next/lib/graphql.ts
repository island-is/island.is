import type { SdfComparatorValue } from '@island.is/application/sdf-types'

/**
 * Server-side GraphQL client for fetching SDF screens.
 *
 * Uses the internal API URL (cluster-internal) when running on the server
 * so requests never leave the cluster. The BFF proxy handles auth tokens.
 */

const SERVER_GRAPHQL_ENDPOINT = process.env.INTERNAL_API_URL
  ? `${process.env.INTERNAL_API_URL}/api/graphql`
  : 'http://localhost:4444/api/graphql'

const CLIENT_GRAPHQL_ENDPOINT = '/bff/api/graphql'
const LOCAL_BFF_GRAPHQL_ENDPOINT = process.env.BFF_PROXY_TARGET
  ? `${process.env.BFF_PROXY_TARGET}${CLIENT_GRAPHQL_ENDPOINT}`
  : 'http://localhost:3010/bff/api/graphql'

export interface ForwardAuthHeaders {
  cookie?: string
  authorization?: string
  host?: string
  protocol?: string
}

export class GraphqlHttpError extends Error {
  status: number
  detail?: string

  constructor(status: number, message: string, detail?: string) {
    super(message)
    this.name = 'GraphqlHttpError'
    this.status = status
    this.detail = detail
  }
}

export interface SdfScreen {
  applicationId: string
  locale: string
  header: {
    title: string
    description?: string
    applicationName?: string
    institutionName?: string
  }
  stepper: {
    sections: SdfStepperSection[]
    activeSectionIndex: number
    activeSubSectionIndex: number
  }
  page: {
    id: string
    index: number
    sectionIndex: number
    subSectionIndex: number
    components: SdfComponentData[]
    errors: SdfValidationError[]
  }
  footer: {
    buttons: SdfFooterButton[]
    canGoBack: boolean
  }
  answers?: Record<string, unknown>
}

export interface SdfStepperSection {
  id: string
  title: string
  isComplete: boolean
  children: { id: string; title: string }[]
}

export interface SdfValidationError {
  componentId: string
  message: string
}

export interface SdfFooterButton {
  id: string
  text: string
  variant: string
  actionType: string
}

export interface SingleClientCondition {
  questionId: string
  comparator: SdfComparatorValue | string
  value: string
}

export interface MultiClientCondition {
  on: 'ALL' | 'ANY'
  checks: SingleClientCondition[]
}

export type ClientCondition = SingleClientCondition | MultiClientCondition
export type FormExpressionOperator =
  | 'GET'
  | 'SUM'
  | 'MULTIPLY'
  | 'EQUALS'
  | 'IS_EMPTY'
  | 'NOT'
  | 'OR'
  | 'AND'
  | 'IF'

export type FormExpression =
  | string
  | number
  | boolean
  | {
      operator: FormExpressionOperator
      args: FormExpression[]
    }

export interface SdfDataTableInput {
  key: string
  label?: string
  type: 'text' | 'number'
  min?: number
  max?: number
  format?: string
  suffix?: string
}

export interface SdfDataTableEditableRow {
  id: string
  label: string
  cells: string[]
  hasCheckbox: boolean
  checkboxKey?: string
  inputs: SdfDataTableInput[]
  payload?: Record<string, unknown>
  defaultValues?: Record<string, unknown>
}

export interface SdfDataTableRow {
  id: string
  cells: string[]
  expandable?: {
    rows: SdfDataTableEditableRow[]
  }
}

export interface SdfComponentData {
  __typename: string
  id?: string
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  maxLength?: number
  inputVariant?: string
  textareaRows?: number
  inputBackgroundColor?: string
  readOnly?: boolean
  rightAlign?: boolean
  textFormat?: string
  textSuffix?: string
  showMaxLength?: boolean
  thousandSeparator?: boolean
  allowNegative?: boolean
  textNumberMin?: number
  textNumberMax?: number
  textStep?: string
  defaultValue?: string
  width?: string
  options?: { label: string; value: string }[]
  isMulti?: boolean
  strong?: boolean
  large?: boolean
  spacing?: number
  checkboxBackgroundColor?: string
  displayInputLabel?: string
  clientValueExpression?: FormExpression
  titleVariant?: string
  halfWidthOwnline?: boolean
  clientShowWhen?: FormExpression | null
  componentName?: string
  props?: string
  description?: string
  url?: string
  message?: string
  buttonTitle?: string
  introText?: string
  alertType?: string
  title?: string
  value?: string
  displayValue?: string
  imageUrl?: string
  min?: number
  max?: number
  step?: number
  minDate?: string
  maxDate?: string
  maxSize?: number
  accept?: string
  header?: string[]
  rows?: string[][] | SdfDataTableRow[]
  staticTableRows?: string[][]
  watchValue?: string
  items?: SdfComponentData[][] | { label: string; content: string }[]
  expandableDescription?: string
  linkMessage?: string
  accordionItems?: { label: string; content: string }[]
  arrayPath?: string
  addItemLabel?: string
  removeItemLabel?: string
  minItems?: number
  maxItems?: number
  event?: string
  actions?: { event: string; name: string; type: string }[]
  placement?: string
  subTitle?: string
  checkboxLabel?: string
  dataProviders?: { id: string; title: string; subTitle?: string }[]
  onSelectRefetchTemplateApis?: string[]
  refetchTargets?: string[]
  searchAction?: string
  minQueryLength?: number
  informationCardItems?: Array<{ label: string; value: string }>
  paymentChargeHeading?: string
  paymentChargeLines?: Array<{
    description: string
    quantity?: string
    amount: string
  }>
  paymentChargeTotalLabel?: string
  paymentChargeTotalAmount?: string
  pdfDescription?: string
  pdfLinkTitle?: string
  pdfLinkUrl?: string
  copyLinkTitle?: string
  copyLinkText?: string
  copyButtonTitle?: string
  marginTop?: number
  marginBottom?: number
}

export const GET_SCREEN_QUERY = `
  query ApplicationSdfScreen($input: SdfGetScreenInput!, $locale: String) {
    applicationSdfScreen(input: $input, locale: $locale) {
      applicationId
      locale
      header {
        title
        description
        applicationName
        institutionName
      }
      stepper {
        sections {
          id
          title
          isComplete
          children {
            id
            title
          }
        }
        activeSectionIndex
        activeSubSectionIndex
      }
      page {
        id
        index
        sectionIndex
        subSectionIndex
        components {
          __typename
          ... on SdfTextField {
            id
            label
            placeholder
            required
            disabled
            maxLength
            inputVariant
            textareaRows
            inputBackgroundColor
            readOnly
            rightAlign
            textFormat
            textSuffix
            showMaxLength
            thousandSeparator
            allowNegative
            textNumberMin
            textNumberMax
            textStep
            defaultValue
            width
            clientShowWhen
          }
          ... on SdfSelectField {
            id
            label
            placeholder
            required
            disabled
            isMulti
            options { label value }
            width
            onSelectRefetchTemplateApis
            refetchTargets
            clientShowWhen
          }
          ... on SdfSearchField {
            id
            label
            placeholder
            required
            disabled
            options { label value }
            searchAction
            minQueryLength
            width
            onSelectRefetchTemplateApis
            refetchTargets
            clientShowWhen
          }
          ... on SdfDataTableField {
            id
            label
            header
            rows {
              id
              cells
              expandable {
                rows {
                  id
                  label
                  cells
                  hasCheckbox
                  checkboxKey
                  inputs {
                    key
                    label
                    type
                    min
                    max
                    format
                    suffix
                  }
                  payload
                  defaultValues
                }
              }
            }
            clientShowWhen
          }
          ... on SdfRadioField {
            id
            label
            required
            disabled
            options { label value }
            width
            clientShowWhen
          }
          ... on SdfCheckboxField {
            id
            label
            description
            required
            disabled
            options { label value }
            width
            strong
            large
            spacing
            checkboxBackgroundColor
            clientShowWhen
          }
          ... on SdfDateField {
            id
            label
            placeholder
            required
            disabled
            minDate
            maxDate
            width
            clientShowWhen
          }
          ... on SdfFileUploadField {
            id
            label
            required
            disabled
            maxSize
            accept
            clientShowWhen
          }
          ... on SdfPhoneField {
            id
            label
            placeholder
            required
            disabled
            width
            clientShowWhen
          }
          ... on SdfNationalIdField {
            id
            label
            required
            disabled
            clientShowWhen
          }
          ... on SdfDescriptionField {
            id
            label
            description
            marginTop
            marginBottom
            clientShowWhen
          }
          ... on SdfSubmitField {
            id
            label
            placement
            actions { event name type }
            clientShowWhen
          }
          ... on SdfDividerField {
            id
            clientShowWhen
          }
          ... on SdfKeyValueField {
            id
            label
            value
            clientShowWhen
          }
          ... on SdfAlertMessageField {
            id
            alertType
            title
            message
            clientShowWhen
          }
          ... on SdfLinkField {
            id
            label
            url
            clientShowWhen
          }
          ... on SdfDisplayField {
            id
            label
            displayValue: value
            displayInputLabel
            clientValueExpression
            inputVariant
            textSuffix
            rightAlign
            titleVariant
            halfWidthOwnline
            width
            clientShowWhen
          }
          ... on SdfSliderField {
            id
            label
            min
            max
            step
            clientShowWhen
          }
          ... on SdfExternalDataProviderField {
            id
            label
            subTitle
            description
            checkboxLabel
            dataProviders { id title subTitle }
          }
          ... on SdfTitleField {
            id
            label
            clientShowWhen
          }
          ... on SdfPaginatedSearchableTableField {
            id
            label
            clientShowWhen
          }
          ... on SdfNationalIdWithNameField {
            id
            label
            clientShowWhen
          }
          ... on SdfFieldsRepeaterField {
            id
            label
            clientShowWhen
          }
          ... on SdfOverviewField {
            id
            label
            clientShowWhen
          }
          ... on SdfVehiclePermnoWithInfoField {
            id
            label
            clientShowWhen
          }
          ... on SdfInformationCardField {
            id
            label
            informationCardItems { label value }
            clientShowWhen
          }
          ... on SdfPaymentChargeOverviewField {
            id
            paymentChargeHeading
            paymentChargeLines { description quantity amount }
            paymentChargeTotalLabel
            paymentChargeTotalAmount
            clientShowWhen
          }
          ... on SdfPdfLinkButtonField {
            id
            pdfDescription
            pdfLinkTitle
            pdfLinkUrl
            clientShowWhen
          }
          ... on SdfCopyLinkField {
            id
            copyLinkTitle
            copyLinkText
            copyButtonTitle
            clientShowWhen
          }
          ... on SdfExpandableDescriptionField {
            id
            label
            introText
            expandableDescription: description
            clientShowWhen
          }
          ... on SdfMessageWithLinkButtonField {
            id
            linkMessage: message
            url
            buttonTitle
            clientShowWhen
          }
          ... on SdfAccordionField {
            id
            label
            accordionItems: items { label content }
            clientShowWhen
          }
          ... on SdfStaticTableField {
            id
            label
            header
            staticTableRows: rows
            clientShowWhen
          }
          ... on SdfCustomComponent {
            componentName
            props
          }
          ... on SdfRepeaterComponent {
            id
            arrayPath
            addItemLabel
            removeItemLabel
            minItems
            maxItems
            items
          }
        }
        errors {
          componentId
          message
        }
      }
      footer {
        buttons {
          id
          text
          variant
          actionType
        }
        canGoBack
      }
      answers
    }
  }
`

export const EXECUTE_ACTION_MUTATION = `
  mutation ApplicationSdfAction($input: SdfExecuteActionInput!, $locale: String) {
    applicationSdfAction(input: $input, locale: $locale) {
      applicationId
      locale
      header { title description applicationName institutionName }
      stepper {
        sections { id title isComplete children { id title } }
        activeSectionIndex
        activeSubSectionIndex
      }
      page {
        id
        index
        sectionIndex
        subSectionIndex
        components {
          __typename
          ... on SdfTextField { id label placeholder required disabled maxLength inputVariant textareaRows inputBackgroundColor readOnly rightAlign textFormat textSuffix showMaxLength thousandSeparator allowNegative textNumberMin textNumberMax textStep defaultValue width clientShowWhen }
          ... on SdfSelectField { id label placeholder required disabled isMulti options { label value } width onSelectRefetchTemplateApis refetchTargets clientShowWhen }
          ... on SdfSearchField { id label placeholder required disabled options { label value } searchAction minQueryLength width onSelectRefetchTemplateApis refetchTargets clientShowWhen }
          ... on SdfDataTableField { id label header rows { id cells expandable { rows { id label cells hasCheckbox checkboxKey inputs { key label type min max format suffix } payload defaultValues } } } clientShowWhen }
          ... on SdfRadioField { id label required disabled options { label value } width clientShowWhen }
          ... on SdfCheckboxField { id label description required disabled options { label value } width strong large spacing checkboxBackgroundColor clientShowWhen }
          ... on SdfDateField { id label placeholder required disabled minDate maxDate width clientShowWhen }
          ... on SdfFileUploadField { id label required disabled maxSize accept clientShowWhen }
          ... on SdfPhoneField { id label placeholder required disabled width clientShowWhen }
          ... on SdfNationalIdField { id label required disabled clientShowWhen }
          ... on SdfDescriptionField { id label description marginTop marginBottom clientShowWhen }
          ... on SdfSubmitField { id label placement actions { event name type } clientShowWhen }
          ... on SdfDividerField { id clientShowWhen }
          ... on SdfKeyValueField { id label value clientShowWhen }
          ... on SdfAlertMessageField { id alertType title message clientShowWhen }
          ... on SdfLinkField { id label url clientShowWhen }
          ... on SdfDisplayField { id label displayValue: value displayInputLabel clientValueExpression inputVariant textSuffix rightAlign titleVariant halfWidthOwnline width clientShowWhen }
          ... on SdfSliderField { id label min max step clientShowWhen }
          ... on SdfExternalDataProviderField { id label subTitle description checkboxLabel dataProviders { id title subTitle } }
          ... on SdfTitleField { id label clientShowWhen }
          ... on SdfPaginatedSearchableTableField { id label clientShowWhen }
          ... on SdfNationalIdWithNameField { id label clientShowWhen }
          ... on SdfFieldsRepeaterField { id label clientShowWhen }
          ... on SdfOverviewField { id label clientShowWhen }
          ... on SdfVehiclePermnoWithInfoField { id label clientShowWhen }
          ... on SdfInformationCardField { id label informationCardItems { label value } clientShowWhen }
          ... on SdfPaymentChargeOverviewField { id paymentChargeHeading paymentChargeLines { description quantity amount } paymentChargeTotalLabel paymentChargeTotalAmount clientShowWhen }
          ... on SdfPdfLinkButtonField { id pdfDescription pdfLinkTitle pdfLinkUrl clientShowWhen }
          ... on SdfCopyLinkField { id copyLinkTitle copyLinkText copyButtonTitle clientShowWhen }
          ... on SdfExpandableDescriptionField { id label introText expandableDescription: description clientShowWhen }
          ... on SdfMessageWithLinkButtonField { id linkMessage: message url buttonTitle clientShowWhen }
          ... on SdfAccordionField { id label accordionItems: items { label content } clientShowWhen }
          ... on SdfStaticTableField { id label header staticTableRows: rows clientShowWhen }
          ... on SdfCustomComponent { componentName props }
          ... on SdfRepeaterComponent { id arrayPath addItemLabel removeItemLabel minItems maxItems items }
        }
        errors { componentId message }
      }
      footer { buttons { id text variant actionType } canGoBack }
      answers
    }
  }
`

export const normalizeAliasedComponentValues = (
  components: SdfComponentData[],
): SdfComponentData[] => {
  return components.map((component) => {
    let normalized = component

    if (
      normalized.__typename === 'SdfDisplayField' &&
      normalized.value === undefined &&
      normalized.displayValue !== undefined
    ) {
      normalized = { ...normalized, value: normalized.displayValue }
    }

    if (
      normalized.__typename === 'SdfExpandableDescriptionField' &&
      normalized.expandableDescription !== undefined
    ) {
      normalized = {
        ...normalized,
        description: normalized.expandableDescription,
      }
    }

    if (
      normalized.__typename === 'SdfMessageWithLinkButtonField' &&
      normalized.linkMessage !== undefined
    ) {
      normalized = { ...normalized, message: normalized.linkMessage }
    }

    if (
      normalized.__typename === 'SdfAccordionField' &&
      normalized.accordionItems !== undefined
    ) {
      normalized = { ...normalized, items: normalized.accordionItems }
    }

    if (
      normalized.__typename === 'SdfStaticTableField' &&
      normalized.staticTableRows !== undefined
    ) {
      normalized = { ...normalized, rows: normalized.staticTableRows }
    }

    return normalized
  })
}

export const buildGraphqlHeaders = (
  forwardedHeaders?: ForwardAuthHeaders,
): Record<string, string> => {
  return {
    'Content-Type': 'application/json',
    ...(forwardedHeaders?.cookie ? { cookie: forwardedHeaders.cookie } : {}),
    ...(forwardedHeaders?.authorization
      ? { authorization: forwardedHeaders.authorization }
      : {}),
  }
}

const getServerGraphqlEndpoint = (
  forwardedHeaders?: ForwardAuthHeaders,
): string => {
  if (!forwardedHeaders?.host) {
    return SERVER_GRAPHQL_ENDPOINT
  }

  if (
    forwardedHeaders.host.startsWith('localhost') ||
    forwardedHeaders.host.startsWith('127.0.0.1')
  ) {
    return LOCAL_BFF_GRAPHQL_ENDPOINT
  }

  const protocol =
    forwardedHeaders.protocol ??
    (forwardedHeaders.host.startsWith('localhost') ||
    forwardedHeaders.host.startsWith('127.0.0.1')
      ? 'http'
      : 'https')

  return `${protocol}://${forwardedHeaders.host}${CLIENT_GRAPHQL_ENDPOINT}`
}

const getGraphqlEndpoint = (
  operationName: string,
  forwardedHeaders?: ForwardAuthHeaders,
): string => {
  const baseEndpoint =
    typeof window === 'undefined'
      ? getServerGraphqlEndpoint(forwardedHeaders)
      : CLIENT_GRAPHQL_ENDPOINT

  return `${baseEndpoint}?op=${operationName}`
}

export const extractOperationResult = <T>(
  payload: unknown,
  operationField: string,
): T => {
  const wrapped = payload as {
    data?: Record<string, T>
  }
  const unwrapped = payload as Record<string, T>

  return (wrapped.data?.[operationField] ?? unwrapped[operationField]) as T
}

const throwIfHttpError = (res: Response, payload: unknown): void => {
  if (res.ok) {
    return
  }

  const problem = payload as {
    status?: number
    title?: string
    detail?: string
  }

  throw new GraphqlHttpError(
    problem.status ?? res.status,
    problem.title ?? `Request failed with status ${res.status}`,
    problem.detail,
  )
}

export const fetchScreen = async (
  applicationId: string,
  step?: number,
  locale = 'is',
  forwardedHeaders?: ForwardAuthHeaders,
): Promise<SdfScreen> => {
  const res = await fetch(
    getGraphqlEndpoint('ApplicationSdfScreen', forwardedHeaders),
    {
      method: 'POST',
      headers: buildGraphqlHeaders(forwardedHeaders),
      body: JSON.stringify({
        query: GET_SCREEN_QUERY,
        variables: {
          input: { applicationId, step },
          locale,
        },
      }),
      cache: 'no-store',
    },
  )

  const json = await res.json()
  throwIfHttpError(res, json)
  if (json.errors) {
    throw new Error(json.errors[0]?.message ?? 'GraphQL error')
  }
  const screen = extractOperationResult<SdfScreen>(json, 'applicationSdfScreen')
  if (!screen) {
    throw new Error(
      `Malformed GraphQL response: missing applicationSdfScreen. Payload keys: ${Object.keys(
        json ?? {},
      ).join(', ')}`,
    )
  }
  return {
    ...screen,
    page: {
      ...screen.page,
      components: normalizeAliasedComponentValues(screen.page.components),
    },
  }
}

export interface SdfValidateResult {
  errors: SdfValidationError[]
  displayValues?: Record<string, string> | null
}

export const VALIDATE_MUTATION = `
  mutation ApplicationSdfValidate($input: SdfExecuteActionInput!, $locale: String) {
    applicationSdfValidate(input: $input, locale: $locale) {
      errors { componentId message }
      displayValues
    }
  }
`

/**
 * Lightweight alternative to `executeAction('VALIDATE', ...)`. Calls the
 * dedicated `applicationSdfValidate` mutation which returns only `errors` and
 * `displayValues` — used by `useDisplayRecompute` to drive reactive display
 * fields without a full screen re-render.
 */
export const validateAction = async (
  applicationId: string,
  answers?: Record<string, unknown>,
  fieldIds?: string[],
  locale = 'is',
  lastKnownPageIndex?: number,
): Promise<SdfValidateResult> => {
  const res = await fetch(getGraphqlEndpoint('ApplicationSdfValidate'), {
    method: 'POST',
    headers: buildGraphqlHeaders(),
    body: JSON.stringify({
      query: VALIDATE_MUTATION,
      variables: {
        input: {
          applicationId,
          actionType: 'VALIDATE',
          answers: answers ? JSON.stringify(answers) : undefined,
          fieldIds,
          lastKnownPageIndex,
        },
        locale,
      },
    }),
    cache: 'no-store',
  })

  const json = await res.json()
  throwIfHttpError(res, json)
  if (json.errors) {
    throw new Error(json.errors[0]?.message ?? 'GraphQL error')
  }
  const result = extractOperationResult<SdfValidateResult>(
    json,
    'applicationSdfValidate',
  )
  if (!result) {
    throw new Error(
      `Malformed GraphQL response: missing applicationSdfValidate. Payload keys: ${Object.keys(
        json ?? {},
      ).join(', ')}`,
    )
  }
  return result
}

export const executeAction = async (
  applicationId: string,
  actionType: string,
  answers?: Record<string, unknown>,
  locale = 'is',
  fieldIds?: string[],
  event?: string,
  refetchTemplateApiActions?: string[],
  lastKnownPageIndex?: number,
): Promise<SdfScreen> => {
  const res = await fetch(getGraphqlEndpoint('ApplicationSdfAction'), {
    method: 'POST',
    headers: buildGraphqlHeaders(),
    body: JSON.stringify({
      query: EXECUTE_ACTION_MUTATION,
      variables: {
        input: {
          applicationId,
          actionType,
          answers: answers ? JSON.stringify(answers) : undefined,
          fieldIds,
          event,
          refetchTemplateApiActions,
          lastKnownPageIndex,
        },
        locale,
      },
    }),
    cache: 'no-store',
  })

  const json = await res.json()
  throwIfHttpError(res, json)
  if (json.errors) {
    throw new Error(json.errors[0]?.message ?? 'GraphQL error')
  }
  const screen = extractOperationResult<SdfScreen>(json, 'applicationSdfAction')
  if (!screen) {
    throw new Error(
      `Malformed GraphQL response: missing applicationSdfAction. Payload keys: ${Object.keys(
        json ?? {},
      ).join(', ')}`,
    )
  }
  return {
    ...screen,
    page: {
      ...screen.page,
      components: normalizeAliasedComponentValues(screen.page.components),
    },
  }
}
