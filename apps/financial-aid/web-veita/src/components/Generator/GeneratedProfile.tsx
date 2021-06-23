import { FunctionComponent } from 'react'
import Identicon from 'identicon.js'
import { createHash } from 'crypto'

interface Props {
  ssn: string
  size: number
}

const GeneratedProfile: FunctionComponent<Props> = ({ ssn, size }) => {
  const data = new Identicon(
    createHash('sha1').update(ssn, 'ascii').digest('hex'),
    {
      size,
      background: [255, 255, 255, 0],
      format: 'svg',
      margin: 0.1,
    },
  )

  // const data = {
  //   size,
  //   background: [255, 255, 255, 0],
  //   format: 'svg',
  //   margin: 0.1,
  // }

  return (
    <img
      src={`data:image/svg+xml;base64,${data}`}
      style={{ height: size, width: size }}
    />
  )
}

export default GeneratedProfile
