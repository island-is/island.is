import { OJOIFieldBaseProps } from '../lib/types'

export const CompleteScreen = ({ application }: OJOIFieldBaseProps) => {
  return (
    <div>
      <h1>CompleteScreen</h1>
      <p>Application id: {application.id}</p>
    </div>
  )
}
