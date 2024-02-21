import { OJOIFieldBaseProps } from '../lib/types'

export const PublishingScreen = ({ application }: OJOIFieldBaseProps) => {
  return (
    <div>
      <h1>PublishingScreen</h1>
      <p>Application id: {application.id}</p>
    </div>
  )
}
