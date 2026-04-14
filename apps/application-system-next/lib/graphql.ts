/**
 * Server-side GraphQL client for fetching SDF screens.
 *
 * Uses the internal API URL (cluster-internal) when running on the server
 * so requests never leave the cluster. The BFF proxy handles auth tokens.
 */

const GRAPHQL_ENDPOINT =
  process.env.INTERNAL_API_URL
    ? `${process.env.INTERNAL_API_URL}/api/graphql`
    : 'http://localhost:4444/api/graphql'

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
  items?: SdfComponentData[][]
  arrayPath?: string
  addItemLabel?: string
  removeItemLabel?: string
  minItems?: number
  maxItems?: number
  event?: string
  actions?: { event: string; name: string; type: string }[]
  placement?: string
}

const GET_SCREEN_QUERY = `
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
            value
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

const EXECUTE_ACTION_MUTATION = `
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
          ... on SdfDisplayField { id label value clientCondition { ... on SdfSingleClientCondition { questionId comparator value } ... on SdfMultiClientCondition { on checks { questionId comparator value } } } }
          ... on SdfSliderField { id label min max step clientCondition { ... on SdfSingleClientCondition { questionId comparator value } ... on SdfMultiClientCondition { on checks { questionId comparator value } } } }
          ... on SdfCustomComponent { componentName props }
          ... on SdfRepeaterComponent { id arrayPath addItemLabel removeItemLabel minItems maxItems items }
        }
        errors { componentId message }
      }
      footer { buttons { id text variant actionType } canGoBack }
    }
  }
`

export async function fetchScreen(
  applicationId: string,
  step?: number,
  locale = 'is',
): Promise<SdfScreen> {
  const res = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: GET_SCREEN_QUERY,
      variables: {
        input: { applicationId, step },
        locale,
      },
    }),
    cache: 'no-store',
  })

  const json = await res.json()
  if (json.errors) {
    throw new Error(json.errors[0]?.message ?? 'GraphQL error')
  }
  return json.data.applicationSdfScreen
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
  const res = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
  if (json.errors) {
    throw new Error(json.errors[0]?.message ?? 'GraphQL error')
  }
  return json.data.applicationSdfAction
}
