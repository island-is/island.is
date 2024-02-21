import { OJOIFieldBaseProps } from '../lib/types'

export const AttachmentsScreen = ({ application }: OJOIFieldBaseProps) => {
  return (
    <div>
      <h1>AttachmentsScreen</h1>
      <p>Application id: {application.id}</p>
    </div>
  )
}
