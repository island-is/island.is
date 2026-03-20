import { Text } from '@island.is/island-ui/core'

interface PensionCalculatorTitleProps {
  title: string
  titlePostfix: string
}

export const PensionCalculatorTitle = ({
  title,
  titlePostfix,
}: PensionCalculatorTitleProps) => {
  return (
    <Text variant="h1" as="h1">
      {title} {titlePostfix}
    </Text>
  )
}
