import { FC, ReactNode } from 'react'

import { Box, Icon, IconMapIcon, Text } from '@island.is/island-ui/core'

import * as styles from './BlueBoxWithIcon.css'

interface Props {
  data: { title: string; value?: ReactNode }[]
  icon?: IconMapIcon
}

const BlueBoxWithIcon: FC<Props> = (props) => {
  const { data, icon } = props

  return (
    <Box className={styles.container} padding={[2, 2, 3, 3]}>
      <Box className={styles.dataContainer}>
        {data.map((dataItem, index) => (
          <Box
            data-testid={`infoCardDataContainer${index}`}
            key={dataItem.title}
            marginTop={index > 1 ? 1 : 0}
          >
            <Text variant="h4">{dataItem.title}</Text>
            {typeof dataItem.value === 'string' ? (
              <Text>{dataItem.value}</Text>
            ) : (
              dataItem.value
            )}
          </Box>
        ))}
        {icon && (
          <Icon icon={icon} type="outline" color="blue400" size="large" />
        )}
      </Box>
    </Box>
  )
}

export default BlueBoxWithIcon
