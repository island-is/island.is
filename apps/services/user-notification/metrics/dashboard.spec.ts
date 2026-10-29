interface MetricQuery {
  data_source: 'metrics'
  name: string
  query: string
}
interface LogQuery {
  data_source: 'logs'
  name: string
  search: { query: string }
  compute: { interval: number }
}
interface DashboardWidget {
  definition: {
    title?: string
    requests?: { queries: (MetricQuery | LogQuery)[] }[]
  }
}
const dashboard: { widgets: DashboardWidget[] } = require('./dashboard.json')

describe('notification metrics dashboard', () => {
  it('uses snapshot gauges without summing retries or pod replicas', () => {
    const queries = dashboard.widgets
      .flatMap((widget) =>
        (widget.definition.requests ?? []).flatMap(
          (request) => request.queries,
        ),
      )
      .filter((query): query is MetricQuery => query.data_source === 'metrics')
    expect(queries.length).toBeGreaterThan(10)
    for (const query of queries) {
      expect(query.query).toMatch(/^max:islandis\.notifications\.analytics\./)
      expect(query.query).toContain('.fill(null)')
      expect(query.query).not.toContain('rollup(sum')
    }
  })

  it('makes the unconfigured DLQ query explicit instead of counting all errors', () => {
    const widget = dashboard.widgets.find((widget) =>
      widget.definition.title?.startsWith('DLQ-'),
    )
    const query = widget?.definition.requests?.[0].queries[0]
    if (!query || query.data_source !== 'logs')
      throw new Error('Missing DLQ query')
    expect(query.search.query).toContain('service:user-notification')
    expect(query.search.query).toContain('__CONFIGURE_DLQ_TRANSITION_FILTER__')
    expect(query.compute.interval).toBe(86400000)
  })
})
