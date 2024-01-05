import { FunctionComponent } from 'react'
import Identicon from 'identicon.js'
import { createHash } from 'crypto'

interface Props {
  nationalId: string
  size: number
}

const GeneratedProfile: FunctionComponent<React.PropsWithChildren<Props>> = ({
  nationalId,
  size,
}) => {
  const data = new Identicon(
    createHash('sha1').update(nationalId, 'ascii').digest('hex'),
    {
      size,
      background: [255, 255, 255, 0],
      format: 'svg',
      margin: 0.1,
    },
  )

  return (
    <img
      src={`data:image/svg+xml;base64,${data}`}
      style={{ height: size, width: size }}
    />
  )
}

export default GeneratedProfile
