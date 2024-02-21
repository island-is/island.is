import { OJOIFieldBaseProps } from '../lib/types'

export const RequirementsScreen = ({ application }: OJOIFieldBaseProps) => {
  return (
    <div>
      <h1>RequirementsScreen</h1>
      <p>Application id: {application.id}</p>
    </div>
  )
}
