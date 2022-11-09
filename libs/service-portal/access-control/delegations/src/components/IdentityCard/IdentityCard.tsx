import { Box, Text } from '@island.is/island-ui/core'

type IdentityCardProps = {
  title: string
  description?: string
  label?: string
  color?: 'blue' | 'purple'
  imgSrc?: string | null
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
      background={color ? `${color}100` : 'white'}
      paddingX={[3, 4]}
      paddingY={3}
      borderRadius="standard"
      width="full"
      alignItems="center"
      columnGap={3}
      {...(!color ? { borderColor: 'blue200', borderWidth: 'standard' } : {})}
    >
      {imgSrc ? (
        <>
          <img src={imgSrc} alt={label ?? ''} width="48" />
          {renderContent()}
        </>
      ) : (
        renderContent()
      )}
    </Box>
  )
}
