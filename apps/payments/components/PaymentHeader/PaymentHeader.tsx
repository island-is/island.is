import { Box, Text } from '@island.is/island-ui/core'

type PaymentHeaderProps = {
  organizationTitle?: string
  organizationImageSrc?: string
  organizationImageAlt?: string
  amount?: number
  productTitle?: string
}

const todoCallGlobalFormatUtilFunction = (value: number): string =>
  `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} kr.`

export const PaymentHeader = ({
  organizationTitle,
  organizationImageSrc,
  organizationImageAlt,
  amount,
  productTitle,
}: PaymentHeaderProps) => {
  return (
    <>
      <Box>
        {organizationTitle && (
          <Box
            display="flex"
            justifyContent="center"
            marginTop={3}
            marginBottom={1}
          >
            <Text color="purple400" variant="eyebrow">
              {organizationTitle}
            </Text>
          </Box>
        )}
        <Text variant="h1">
          {amount && todoCallGlobalFormatUtilFunction(amount)}
        </Text>
        <Text variant="default" fontWeight={'medium'}>
          {productTitle}
        </Text>
      </Box>

      {organizationImageSrc && (
        <img
          style={{ width: 64, height: 64 }}
          src={organizationImageSrc}
          alt={organizationImageAlt}
        />
      )}
    </>
  )
}
