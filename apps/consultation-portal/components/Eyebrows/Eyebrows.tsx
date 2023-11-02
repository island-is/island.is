import { Inline, Text } from '@island.is/island-ui/core'
import { Colors } from '@island.is/island-ui/theme'
import { Fragment } from 'react'

interface Props {
  instances: Array<string>
  color: Colors
  style: string
  wrap?: boolean
  truncate?: boolean
}

const Eyebrows = ({ instances, color, style, wrap, truncate }: Props) => {
  const mapInstances = instances.map((item, index) => {
    return (
      <Fragment key={index}>
        <Text variant="eyebrow" color={color} truncate={truncate}>
          {item}
        </Text>
        {instances[index + 1] && <div className={style} />}
      </Fragment>
    )
  })

  return (
    <Inline space={1} alignY="center" flexWrap={wrap ? 'wrap' : 'nowrap'}>
      {mapInstances}
    </Inline>
  )
}

export default Eyebrows
