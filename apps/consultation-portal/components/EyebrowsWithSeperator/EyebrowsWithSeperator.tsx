import { Inline, Text } from '@island.is/island-ui/core'

export const EyebrowsWithSeperator = ({
  instances,
  color,
  style,
  wrap,
  truncate,
}) => {
  const mapInstances = instances.map((item, index) => {
    return (
      <>
        <Text variant="eyebrow" color={color} truncate={truncate} key={index}>
          {item}
        </Text>
        {instances[index + 1] && <div className={style} />}
      </>
    )
  })

  return (
    <Inline space={1} alignY="center" flexWrap={wrap ? 'wrap' : 'nowrap'}>
      {mapInstances}
    </Inline>
  )
}

export default EyebrowsWithSeperator
