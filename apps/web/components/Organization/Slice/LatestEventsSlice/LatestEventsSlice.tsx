import { LatestEventsSlice as LatestEventsSliceSchema } from '@island.is/web/graphql/schema'

interface LatestEventsSliceProps {
  slice: LatestEventsSliceSchema
}

export const LatestEventsSlice = ({ slice }: LatestEventsSliceProps) => {
  return <div>LatestEventsSlice {JSON.stringify(slice)}</div>
}
