import { Box, Icon, Text } from '@island.is/island-ui/core'

import { formatCurrency } from '@island.is/shared/utils'

import * as styles from './PaymentHeader.css'

type PaymentHeaderProps = {
  title?: string
  imageSrc?: string
  imageAlt?: string
  amount?: number
  subTitle?: string
  type: keyof typeof styles.header
}

const getIconType = (type: PaymentHeaderProps['type']) => {
  switch (type) {
    case 'error':
      return 'warning'
    case 'warning':
      return 'warning'
    case 'success':
      return 'checkmarkCircle'
    default:
      return 'informationCircle'
  }
}

const getIconColor = (type: PaymentHeaderProps['type']) => {
  switch (type) {
    case 'error':
      return 'red600'
    case 'warning':
      return 'yellow600'
    case 'success':
      return 'mint400'
    default:
      return 'blue600'
  }
}

const HeaderTextContent = ({
  title,
  subTitle,
  amount,
  type,
}: PaymentHeaderProps) =>
  type === 'primary' ? (
    <Box>
      {title && (
        <Box display="flex">
          <Text color="purple400" variant="eyebrow">
            {title}
          </Text>
        </Box>
      )}
      <Text variant="h2">{amount && formatCurrency(amount)}</Text>
      <Text variant="small" fontWeight="regular">
        {subTitle}
      </Text>
    </Box>
  ) : (
    <>
      <Icon
        type="filled"
        icon={getIconType(type)}
        color={getIconColor(type)}
        size="large"
      />
      <Text variant="h3">{title}</Text>
      <Text>{subTitle}</Text>
    </>
  )

export const PaymentHeader = (props: PaymentHeaderProps) => {
  const { imageSrc, imageAlt, type } = props
  return (
    <Box
      paddingX={[3, 4]}
      paddingY={[3, 3]}
      className={styles.header[type]}
      flexDirection={type === 'primary' ? 'row' : 'column'}
      display="flex"
      justifyContent={type === 'primary' ? 'spaceBetween' : 'center'}
      textAlign={type === 'primary' ? 'left' : 'center'}
      alignItems="center"
      rowGap={type === 'primary' ? undefined : [0, 1]}
    >
      <HeaderTextContent {...props} />

      {imageSrc && (
        <img style={{ width: 64, height: 64 }} src={imageSrc} alt={imageAlt} />
      )}
    </Box>
  )
}
