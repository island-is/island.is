import { OJOIFieldBaseProps } from '../lib/types'

export const OriginalScreen = ({ application }: OJOIFieldBaseProps) => {
  return (
    <div>
      <h1>OriginalDocumentsScreen</h1>
      <p>Application id: {application.id}</p>
    </div>
  )
}
