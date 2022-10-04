import { Box, Text } from '@island.is/island-ui/core'

type IdentityCardProps = {
  title: string
  description?: string
  label?: string
  color?: 'blue' | 'purple'
  /**
   * Image src
   */
  imgSrc?: string
}

export const IdentityCard = ({
  title,
  description,
  label,
  color,
  imgSrc,
}: IdentityCardProps) => {
  const renderContent = () => {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        rowGap={1}
      >
        {label && (
          <Text
            color={color ? `${color}400` : 'dark400'}
            variant="small"
            fontWeight="semiBold"
          >
            {label}
          </Text>
        )}
        <Text variant="h3">{title}</Text>
        {description && <Text>{description}</Text>}
      </Box>
    )
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      background={color ? `${color}100` : 'white'}
      paddingX={[3, 4]}
      paddingY={3}
      borderRadius="standard"
      width="full"
      {...(!color ? { borderColor: 'blue200', borderWidth: 'standard' } : {})}
    >
      {imgSrc ? (
        <Box display="flex" alignItems="center" columnGap={3}>
          <img src={imgSrc} alt={label ?? ''} />
          {renderContent()}
        </Box>
      ) : (
        renderContent()
      )}
    </Box>
  )
}
