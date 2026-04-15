/**
 * Server-side GraphQL client for fetching SDF screens.
 *
 * Uses the internal API URL (cluster-internal) when running on the server
 * so requests never leave the cluster. The BFF proxy handles auth tokens.
 */

const SERVER_GRAPHQL_ENDPOINT =
  process.env.INTERNAL_API_URL
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
  comparator: string
  value: string
}

export interface MultiClientCondition {
  on: 'ALL' | 'ANY'
  checks: SingleClientCondition[]
}

export type ClientCondition = SingleClientCondition | MultiClientCondition

export interface SdfComponentData {
  __typename: string
  id?: string
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  maxLength?: number
  defaultValue?: string
  width?: string
  options?: { label: string; value: string }[]
  clientCondition?: ClientCondition | null
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
  rows?: string[][]
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
}

export const GET_SCREEN_QUERY = `
  query ApplicationSdfScreen($input: SdfGetScreenInput!, $locale: String) {
    applicationSdfScreen(input: $input, locale: $locale) {
      applicationId
      locale
      header {
        title
        description
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
            defaultValue
            width
            clientCondition {
              ... on SdfSingleClientCondition {
                questionId
                comparator
                value
              }
              ... on SdfMultiClientCondition {
                on
                checks {
                  questionId
                  comparator
                  value
                }
              }
            }
          }
          ... on SdfSelectField {
            id
            label
            placeholder
            required
            disabled
            options { label value }
            width
            clientCondition {
              ... on SdfSingleClientCondition { questionId comparator value }
              ... on SdfMultiClientCondition { on checks { questionId comparator value } }
            }
          }
          ... on SdfRadioField {
            id
            label
            required
            disabled
            options { label value }
            width
            clientCondition {
              ... on SdfSingleClientCondition { questionId comparator value }
              ... on SdfMultiClientCondition { on checks { questionId comparator value } }
            }
          }
          ... on SdfCheckboxField {
            id
            label
            required
            disabled
            options { label value }
            width
            clientCondition {
              ... on SdfSingleClientCondition { questionId comparator value }
              ... on SdfMultiClientCondition { on checks { questionId comparator value } }
            }
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
            clientCondition {
              ... on SdfSingleClientCondition { questionId comparator value }
              ... on SdfMultiClientCondition { on checks { questionId comparator value } }
            }
          }
          ... on SdfFileUploadField {
            id
            label
            required
            disabled
            maxSize
            accept
            clientCondition {
              ... on SdfSingleClientCondition { questionId comparator value }
              ... on SdfMultiClientCondition { on checks { questionId comparator value } }
            }
          }
          ... on SdfPhoneField {
            id
            label
            placeholder
            required
            disabled
            width
            clientCondition {
              ... on SdfSingleClientCondition { questionId comparator value }
              ... on SdfMultiClientCondition { on checks { questionId comparator value } }
            }
          }
          ... on SdfNationalIdField {
            id
            label
            required
            disabled
            clientCondition {
              ... on SdfSingleClientCondition { questionId comparator value }
              ... on SdfMultiClientCondition { on checks { questionId comparator value } }
            }
          }
          ... on SdfDescriptionField {
            id
            label
            description
            clientCondition {
              ... on SdfSingleClientCondition { questionId comparator value }
              ... on SdfMultiClientCondition { on checks { questionId comparator value } }
            }
          }
          ... on SdfSubmitField {
            id
            label
            placement
            actions { event name type }
            clientCondition {
              ... on SdfSingleClientCondition { questionId comparator value }
              ... on SdfMultiClientCondition { on checks { questionId comparator value } }
            }
          }
          ... on SdfDividerField {
            id
            clientCondition {
              ... on SdfSingleClientCondition { questionId comparator value }
              ... on SdfMultiClientCondition { on checks { questionId comparator value } }
            }
          }
          ... on SdfKeyValueField {
            id
            label
            value
            clientCondition {
              ... on SdfSingleClientCondition { questionId comparator value }
              ... on SdfMultiClientCondition { on checks { questionId comparator value } }
            }
          }
          ... on SdfAlertMessageField {
            id
            alertType
            title
            message
            clientCondition {
              ... on SdfSingleClientCondition { questionId comparator value }
              ... on SdfMultiClientCondition { on checks { questionId comparator value } }
            }
          }
          ... on SdfLinkField {
            id
            label
            url
            clientCondition {
              ... on SdfSingleClientCondition { questionId comparator value }
              ... on SdfMultiClientCondition { on checks { questionId comparator value } }
            }
          }
          ... on SdfDisplayField {
            id
            label
            displayValue: value
            clientCondition {
              ... on SdfSingleClientCondition { questionId comparator value }
              ... on SdfMultiClientCondition { on checks { questionId comparator value } }
            }
          }
          ... on SdfSliderField {
            id
            label
            min
            max
            step
            clientCondition {
              ... on SdfSingleClientCondition { questionId comparator value }
              ... on SdfMultiClientCondition { on checks { questionId comparator value } }
            }
          }
          ... on SdfExternalDataProviderField {
            id
            label
          }
          ... on SdfTitleField {
            id
            label
            clientCondition {
              ... on SdfSingleClientCondition { questionId comparator value }
              ... on SdfMultiClientCondition { on checks { questionId comparator value } }
            }
          }
          ... on SdfPaginatedSearchableTableField {
            id
            label
            clientCondition {
              ... on SdfSingleClientCondition { questionId comparator value }
              ... on SdfMultiClientCondition { on checks { questionId comparator value } }
            }
          }
          ... on SdfNationalIdWithNameField {
            id
            label
            clientCondition {
              ... on SdfSingleClientCondition { questionId comparator value }
              ... on SdfMultiClientCondition { on checks { questionId comparator value } }
            }
          }
          ... on SdfFieldsRepeaterField {
            id
            label
            clientCondition {
              ... on SdfSingleClientCondition { questionId comparator value }
              ... on SdfMultiClientCondition { on checks { questionId comparator value } }
            }
          }
          ... on SdfOverviewField {
            id
            label
            clientCondition {
              ... on SdfSingleClientCondition { questionId comparator value }
              ... on SdfMultiClientCondition { on checks { questionId comparator value } }
            }
          }
          ... on SdfVehiclePermnoWithInfoField {
            id
            label
            clientCondition {
              ... on SdfSingleClientCondition { questionId comparator value }
              ... on SdfMultiClientCondition { on checks { questionId comparator value } }
            }
          }
          ... on SdfExpandableDescriptionField {
            id
            label
            introText
            expandableDescription: description
            clientCondition {
              ... on SdfSingleClientCondition { questionId comparator value }
              ... on SdfMultiClientCondition { on checks { questionId comparator value } }
            }
          }
          ... on SdfMessageWithLinkButtonField {
            id
            linkMessage: message
            url
            buttonTitle
            clientCondition {
              ... on SdfSingleClientCondition { questionId comparator value }
              ... on SdfMultiClientCondition { on checks { questionId comparator value } }
            }
          }
          ... on SdfAccordionField {
            id
            label
            accordionItems: items { label content }
            clientCondition {
              ... on SdfSingleClientCondition { questionId comparator value }
              ... on SdfMultiClientCondition { on checks { questionId comparator value } }
            }
          }
          ... on SdfStaticTableField {
            id
            label
            header
            rows
            clientCondition {
              ... on SdfSingleClientCondition { questionId comparator value }
              ... on SdfMultiClientCondition { on checks { questionId comparator value } }
            }
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
    }
  }
`

export const EXECUTE_ACTION_MUTATION = `
  mutation ApplicationSdfAction($input: SdfExecuteActionInput!, $locale: String) {
    applicationSdfAction(input: $input, locale: $locale) {
      applicationId
      locale
      header { title description }
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
          ... on SdfTextField { id label placeholder required disabled maxLength defaultValue width clientCondition { ... on SdfSingleClientCondition { questionId comparator value } ... on SdfMultiClientCondition { on checks { questionId comparator value } } } }
          ... on SdfSelectField { id label placeholder required disabled options { label value } width clientCondition { ... on SdfSingleClientCondition { questionId comparator value } ... on SdfMultiClientCondition { on checks { questionId comparator value } } } }
          ... on SdfRadioField { id label required disabled options { label value } width clientCondition { ... on SdfSingleClientCondition { questionId comparator value } ... on SdfMultiClientCondition { on checks { questionId comparator value } } } }
          ... on SdfCheckboxField { id label required disabled options { label value } width clientCondition { ... on SdfSingleClientCondition { questionId comparator value } ... on SdfMultiClientCondition { on checks { questionId comparator value } } } }
          ... on SdfDateField { id label placeholder required disabled minDate maxDate width clientCondition { ... on SdfSingleClientCondition { questionId comparator value } ... on SdfMultiClientCondition { on checks { questionId comparator value } } } }
          ... on SdfFileUploadField { id label required disabled maxSize accept clientCondition { ... on SdfSingleClientCondition { questionId comparator value } ... on SdfMultiClientCondition { on checks { questionId comparator value } } } }
          ... on SdfPhoneField { id label placeholder required disabled width clientCondition { ... on SdfSingleClientCondition { questionId comparator value } ... on SdfMultiClientCondition { on checks { questionId comparator value } } } }
          ... on SdfNationalIdField { id label required disabled clientCondition { ... on SdfSingleClientCondition { questionId comparator value } ... on SdfMultiClientCondition { on checks { questionId comparator value } } } }
          ... on SdfDescriptionField { id label description clientCondition { ... on SdfSingleClientCondition { questionId comparator value } ... on SdfMultiClientCondition { on checks { questionId comparator value } } } }
          ... on SdfSubmitField { id label placement actions { event name type } clientCondition { ... on SdfSingleClientCondition { questionId comparator value } ... on SdfMultiClientCondition { on checks { questionId comparator value } } } }
          ... on SdfDividerField { id clientCondition { ... on SdfSingleClientCondition { questionId comparator value } ... on SdfMultiClientCondition { on checks { questionId comparator value } } } }
          ... on SdfKeyValueField { id label value clientCondition { ... on SdfSingleClientCondition { questionId comparator value } ... on SdfMultiClientCondition { on checks { questionId comparator value } } } }
          ... on SdfAlertMessageField { id alertType title message clientCondition { ... on SdfSingleClientCondition { questionId comparator value } ... on SdfMultiClientCondition { on checks { questionId comparator value } } } }
          ... on SdfLinkField { id label url clientCondition { ... on SdfSingleClientCondition { questionId comparator value } ... on SdfMultiClientCondition { on checks { questionId comparator value } } } }
          ... on SdfDisplayField { id label displayValue: value clientCondition { ... on SdfSingleClientCondition { questionId comparator value } ... on SdfMultiClientCondition { on checks { questionId comparator value } } } }
          ... on SdfSliderField { id label min max step clientCondition { ... on SdfSingleClientCondition { questionId comparator value } ... on SdfMultiClientCondition { on checks { questionId comparator value } } } }
          ... on SdfExternalDataProviderField { id label }
          ... on SdfTitleField { id label clientCondition { ... on SdfSingleClientCondition { questionId comparator value } ... on SdfMultiClientCondition { on checks { questionId comparator value } } } }
          ... on SdfPaginatedSearchableTableField { id label clientCondition { ... on SdfSingleClientCondition { questionId comparator value } ... on SdfMultiClientCondition { on checks { questionId comparator value } } } }
          ... on SdfNationalIdWithNameField { id label clientCondition { ... on SdfSingleClientCondition { questionId comparator value } ... on SdfMultiClientCondition { on checks { questionId comparator value } } } }
          ... on SdfFieldsRepeaterField { id label clientCondition { ... on SdfSingleClientCondition { questionId comparator value } ... on SdfMultiClientCondition { on checks { questionId comparator value } } } }
          ... on SdfOverviewField { id label clientCondition { ... on SdfSingleClientCondition { questionId comparator value } ... on SdfMultiClientCondition { on checks { questionId comparator value } } } }
          ... on SdfVehiclePermnoWithInfoField { id label clientCondition { ... on SdfSingleClientCondition { questionId comparator value } ... on SdfMultiClientCondition { on checks { questionId comparator value } } } }
          ... on SdfExpandableDescriptionField { id label introText expandableDescription: description clientCondition { ... on SdfSingleClientCondition { questionId comparator value } ... on SdfMultiClientCondition { on checks { questionId comparator value } } } }
          ... on SdfMessageWithLinkButtonField { id linkMessage: message url buttonTitle clientCondition { ... on SdfSingleClientCondition { questionId comparator value } ... on SdfMultiClientCondition { on checks { questionId comparator value } } } }
          ... on SdfAccordionField { id label accordionItems: items { label content } clientCondition { ... on SdfSingleClientCondition { questionId comparator value } ... on SdfMultiClientCondition { on checks { questionId comparator value } } } }
          ... on SdfStaticTableField { id label header rows clientCondition { ... on SdfSingleClientCondition { questionId comparator value } ... on SdfMultiClientCondition { on checks { questionId comparator value } } } }
          ... on SdfCustomComponent { componentName props }
          ... on SdfRepeaterComponent { id arrayPath addItemLabel removeItemLabel minItems maxItems items }
        }
        errors { componentId message }
      }
      footer { buttons { id text variant actionType } canGoBack }
    }
  }
`

export function normalizeAliasedComponentValues(
  components: SdfComponentData[],
): SdfComponentData[] {
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
      normalized = { ...normalized, description: normalized.expandableDescription }
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

    return normalized
  })
}

export function buildGraphqlHeaders(
  forwardedHeaders?: ForwardAuthHeaders,
): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    ...(forwardedHeaders?.cookie
      ? { cookie: forwardedHeaders.cookie }
      : {}),
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

export function extractOperationResult<T>(
  payload: unknown,
  operationField: string,
): T {
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

export async function fetchScreen(
  applicationId: string,
  step?: number,
  locale = 'is',
  forwardedHeaders?: ForwardAuthHeaders,
): Promise<SdfScreen> {
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
  const screen = extractOperationResult<SdfScreen>(
    json,
    'applicationSdfScreen',
  )
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

export async function executeAction(
  applicationId: string,
  actionType: string,
  lastKnownPageIndex: number,
  answers?: Record<string, unknown>,
  locale = 'is',
  fieldIds?: string[],
  event?: string,
): Promise<SdfScreen> {
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
          lastKnownPageIndex,
          fieldIds,
          event,
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
