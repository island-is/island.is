import tracer from 'dd-trace'
import {
  BaseContext,
  GraphQLRequestContextWillSendResponse,
} from '@apollo/server'

import {
  GRAPHQL_OPERATION_TAG,
  GRAPHQL_RESPONSE_BYTES_TAG,
  responseSizePlugin,
} from './responseSize.plugin'

jest.mock('dd-trace')

type WillSendResponse = (
  context: GraphQLRequestContextWillSendResponse<BaseContext>,
) => Promise<void>

describe('responseSizePlugin', () => {
  let activeSpan: { addTags: jest.Mock } | null
  let willSendResponse: WillSendResponse

  const context = (
    names: { requested?: string | null; resolved?: string },
    body: GraphQLRequestContextWillSendResponse<BaseContext>['response']['body'],
  ) =>
    ({
      request: { operationName: names.requested },
      operation: names.resolved
        ? { kind: 'OperationDefinition', name: { value: names.resolved } }
        : undefined,
      response: { body },
    } as GraphQLRequestContextWillSendResponse<BaseContext>)

  beforeEach(async () => {
    activeSpan = { addTags: jest.fn() }
    ;(tracer.scope as jest.Mock).mockImplementation(() => ({
      active: () => activeSpan,
    }))

    if (!responseSizePlugin.requestDidStart) {
      throw new Error('plugin has no requestDidStart hook')
    }

    const listener = await responseSizePlugin.requestDidStart({} as never)

    if (!listener?.willSendResponse) {
      throw new Error('plugin has no willSendResponse hook')
    }

    willSendResponse = listener.willSendResponse as WillSendResponse
  })

  it('tags the span with the operation name and the serialized body size', async () => {
    const singleResult = {
      data: { case: { id: 'case-id', courtCaseNumber: 'S-1/2026' } },
    }

    await willSendResponse(
      context(
        { requested: 'Case', resolved: 'Case' },
        { kind: 'single', singleResult },
      ),
    )

    expect(activeSpan?.addTags).toHaveBeenCalledWith({
      [GRAPHQL_OPERATION_TAG]: 'Case',
      [GRAPHQL_RESPONSE_BYTES_TAG]: Buffer.byteLength(
        JSON.stringify(singleResult),
      ),
    })
  })

  it('takes the name from the resolved operation when the request omits it', async () => {
    await willSendResponse(
      context(
        { requested: undefined, resolved: 'Case' },
        { kind: 'single', singleResult: { data: null } },
      ),
    )

    expect(activeSpan?.addTags).toHaveBeenCalledWith(
      expect.objectContaining({ [GRAPHQL_OPERATION_TAG]: 'Case' }),
    )
  })

  it('falls back to the requested name when no operation was resolved', async () => {
    await willSendResponse(
      context(
        { requested: 'Case', resolved: undefined },
        { kind: 'single', singleResult: { errors: [{ message: 'Syntax' }] } },
      ),
    )

    expect(activeSpan?.addTags).toHaveBeenCalledWith(
      expect.objectContaining({ [GRAPHQL_OPERATION_TAG]: 'Case' }),
    )
  })

  it('names an anonymous operation', async () => {
    await willSendResponse(
      context(
        { requested: null, resolved: undefined },
        { kind: 'single', singleResult: { data: null } },
      ),
    )

    expect(activeSpan?.addTags).toHaveBeenCalledWith(
      expect.objectContaining({ [GRAPHQL_OPERATION_TAG]: 'anonymous' }),
    )
  })

  it('skips incremental responses', async () => {
    await willSendResponse(
      context(
        { requested: 'Case', resolved: 'Case' },
        {
          kind: 'incremental',
          initialResult: { data: null, hasNext: true },
          subsequentResults: (async function* () {
            /* nothing */
          })(),
        },
      ),
    )

    expect(activeSpan?.addTags).not.toHaveBeenCalled()
  })

  it('does nothing without an active span', async () => {
    activeSpan = null

    await expect(
      willSendResponse(
        context(
          { requested: 'Case', resolved: 'Case' },
          { kind: 'single', singleResult: { data: null } },
        ),
      ),
    ).resolves.toBeUndefined()
  })

  it('never fails the response over a body it cannot serialize', async () => {
    const circular: Record<string, unknown> = {}
    circular.self = circular

    await expect(
      willSendResponse(
        context(
          { requested: 'Case', resolved: 'Case' },
          {
            kind: 'single',
            singleResult: { data: circular },
          },
        ),
      ),
    ).resolves.toBeUndefined()
    expect(activeSpan?.addTags).not.toHaveBeenCalled()
  })
})
