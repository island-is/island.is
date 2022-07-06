export const processAggregationQuery = () => {
  const query = {
    aggs: {
      processEntryCount: {
        terms: {
          field: 'processEntryCount',
        },
      },
    },
  }
  return query
}
