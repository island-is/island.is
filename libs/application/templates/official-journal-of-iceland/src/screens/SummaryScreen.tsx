import { OJOIFieldBaseProps } from '../lib/types'

export const SummaryScreen = ({ application }: OJOIFieldBaseProps) => {
  return (
    <div>
      <h1>SummaryScreen</h1>
      <p>Application id: {application.id}</p>
    </div>
  )
}
