import { FormSystemField } from '@island.is/api/schema'
import { Box, Text, Tooltip } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FieldTypesEnum } from '../../lib/enums'

interface Props {
  item: FormSystemField
}

export const FieldInformation = ({ item }: Props) => {
  const { lang } = useLocale()
  const informationText =
    item.fieldType === FieldTypesEnum.MESSAGE ||
    item.fieldType === FieldTypesEnum.APPLICANT
      ? ''
      : item.informationText?.[lang] ?? ''
  const hasInputTooltip =
    item.fieldType === FieldTypesEnum.TEXTBOX ||
    item.fieldType === FieldTypesEnum.NUMBERBOX ||
    item.fieldType === FieldTypesEnum.CHECKBOX
  const tooltip = hasInputTooltip ? '' : item.tooltip?.[lang] ?? ''

  if (!informationText.trim() && !tooltip.trim()) return null

  return (
    <Box
      marginBottom={2}
      display="flex"
      alignItems="flexStart"
      justifyContent="spaceBetween"
    >
      {informationText.trim() && (
        <Text whiteSpace="breakSpaces">{informationText}</Text>
      )}
      {tooltip.trim() && <Tooltip text={tooltip} />}
    </Box>
  )
}
