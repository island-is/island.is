import { OJOIFieldBaseProps } from '../lib/types'

export const AdvertScreen = ({ application }: OJOIFieldBaseProps) => {
  return (
    <div>
      <h1>AdvertScreen</h1>
      <p>Application id: {application.id}</p>
    </div>
  )
}
