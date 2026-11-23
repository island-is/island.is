import { readFileSync } from 'fs'
import { resolve } from 'path'
import { buildSchema, parse, validate } from 'graphql'
import {
  GET_SCREEN_QUERY,
  EXECUTE_ACTION_MUTATION,
  normalizeAliasedComponentValues,
  buildGraphqlHeaders,
  extractOperationResult,
  executeAction,
  fetchScreen,
  validateAction,
} from './graphql'

describe('graphql SDF queries', () => {
  const schema = buildSchema(
    readFileSync(resolve(process.cwd(), 'apps/api/src/api.graphql'), 'utf8'),
  )

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('aliases display field value to avoid GraphQL value conflicts', () => {
    expect(GET_SCREEN_QUERY).toContain('displayValue: value')
    expect(EXECUTE_ACTION_MUTATION).toContain('displayValue: value')
  })

  it('requests value expressions for display fields', () => {
    expect(GET_SCREEN_QUERY).toContain('clientValueExpression')
    expect(EXECUTE_ACTION_MUTATION).toContain('clientValueExpression')
  })

  it('requests clientShowWhen expressions for fields', () => {
    expect(GET_SCREEN_QUERY).toContain('clientShowWhen')
    expect(EXECUTE_ACTION_MUTATION).toContain('clientShowWhen')
  })

  it('requests inline refetch targets for select and search fields', () => {
    expect(GET_SCREEN_QUERY).toContain('onSelectRefetchTemplateApis')
    expect(GET_SCREEN_QUERY).toContain('refetchTargets')
    expect(EXECUTE_ACTION_MUTATION).toContain('onSelectRefetchTemplateApis')
    expect(EXECUTE_ACTION_MUTATION).toContain('refetchTargets')
  })

  it('requests data table row payload and default metadata', () => {
    expect(GET_SCREEN_QUERY).toContain('payload')
    expect(GET_SCREEN_QUERY).toContain('defaultValues')
    expect(EXECUTE_ACTION_MUTATION).toContain('payload')
    expect(EXECUTE_ACTION_MUTATION).toContain('defaultValues')
  })

  it('validates the screen query against the api schema', () => {
    expect(validate(schema, parse(GET_SCREEN_QUERY))).toEqual([])
  })

  it('normalizes aliased display value fields into value', () => {
    const normalized = normalizeAliasedComponentValues([
      {
        __typename: 'SdfDisplayField',
        id: 'field-1',
        label: 'Label',
        displayValue: 'Visible text',
      },
      {
        __typename: 'SdfKeyValueField',
        id: 'field-2',
        label: 'Key',
        value: 'Value',
      },
    ])

    expect(normalized[0]).toMatchObject({
      __typename: 'SdfDisplayField',
      value: 'Visible text',
    })
    expect(normalized[1]).toMatchObject({
      __typename: 'SdfKeyValueField',
      value: 'Value',
    })
  })

  it('forwards auth headers when provided', () => {
    expect(
      buildGraphqlHeaders({
        cookie: 'sid=123',
        authorization: 'Bearer token',
      }),
    ).toEqual({
      'Content-Type': 'application/json',
      cookie: 'sid=123',
      authorization: 'Bearer token',
    })
  })

  it('extracts operation result from GraphQL data wrapper', () => {
    const result = extractOperationResult<{ id: string }>(
      {
        data: {
          applicationSdfScreen: { id: 'screen-1' },
        },
      },
      'applicationSdfScreen',
    )

    expect(result).toEqual({ id: 'screen-1' })
  })

  it('extracts operation result from unwrapped payload', () => {
    const result = extractOperationResult<{ id: string }>(
      {
        applicationSdfScreen: { id: 'screen-2' },
      },
      'applicationSdfScreen',
    )

    expect(result).toEqual({ id: 'screen-2' })
  })

  it('surfaces problem-detail unauthorized responses as http errors', async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
      text: async () =>
        JSON.stringify({
          status: 401,
          title: 'Unauthorized',
          detail: 'Missing sid cookie',
        }),
    } as Response)
    ;(
      globalThis as typeof globalThis & {
        fetch: typeof fetch
      }
    ).fetch = fetchMock as typeof fetch

    await expect(fetchScreen('app-1')).rejects.toMatchObject({
      message: 'Unauthorized',
      status: 401,
      detail: 'Missing sid cookie',
    })
  })

  it('sends the screen id with validate actions', async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: async () =>
        JSON.stringify({
          data: {
            applicationSdfValidate: {
              errors: [],
              displayValues: { displayField: '77' },
            },
          },
        }),
    } as Response)
    ;(
      globalThis as typeof globalThis & {
        fetch: typeof fetch
      }
    ).fetch = fetchMock as typeof fetch

    await validateAction(
      'app-1',
      'page-7',
      { input1: '23', input2: '23', input3: '31' },
      [],
      'is',
    )

    const [, init] = fetchMock.mock.calls[0]
    const body = JSON.parse(String(init.body)) as {
      variables: {
        input: {
          screen?: string
        }
      }
    }

    expect(body.variables.input.screen).toBe('page-7')
  })

  it('sends the screen id with fetch and action requests', async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ data: {} }),
    } as Response)
    ;(
      globalThis as typeof globalThis & {
        fetch: typeof fetch
      }
    ).fetch = fetchMock as typeof fetch

    // The empty payload makes both calls reject; only the request matters.
    await fetchScreen('app-1', 'page-3').catch(() => undefined)
    await executeAction('app-1', 'NEXT_PAGE', 'page-3').catch(() => undefined)

    const inputs = fetchMock.mock.calls.map(
      ([, init]) => JSON.parse(String(init.body)).variables.input,
    )
    expect(inputs[0]).toEqual({ applicationId: 'app-1', screen: 'page-3' })
    expect(inputs[1]).toMatchObject({
      applicationId: 'app-1',
      actionType: 'NEXT_PAGE',
      screen: 'page-3',
    })
  })
})
