import { OJOIFieldBaseProps } from '../lib/types'

export const PreviewScreen = ({ application }: OJOIFieldBaseProps) => {
  return (
    <div>
      <h1>PreviewScreen</h1>
      <p>Application id: {application.id}</p>
    </div>
  )
}
