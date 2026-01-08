import { Flex, FormControl, Text } from '@contentful/f36-components'

interface FormFieldHeadingProps {
  text: string
  locale: string
  localeNames: Record<string, string>
}

export const FormFieldHeading = ({
  text,
  locale,
  localeNames,
}: FormFieldHeadingProps) => {
  return (
    <Flex flexDirection="row" flexWrap="nowrap" gap="spacingXs">
      <FormControl.Label>{text}</FormControl.Label>
      <Flex flexDirection="row" flexWrap="nowrap" gap="spacingXs">
        <Text fontColor="gray500">|</Text>
        <Text fontColor="gray500">{localeNames[locale]}</Text>
      </Flex>
    </Flex>
  )
}
