import { Text } from '@island.is/island-ui/core'
import localization from '../../../../Case.json'

export const AgencyText = () => {
  const loc = localization['agencyText']

  return (
    <Text marginTop={2} variant="small">
      {loc.textBefore}{' '}
      <a
        target="_blank"
        href="https://samradsgatt.island.is/library/Files/Umbo%C3%B0%20-%20lei%C3%B0beiningar%20fyrir%20samr%C3%A1%C3%B0sg%C3%A1tt%20r%C3%A1%C3%B0uneyta.pdf"
        rel="noopener noreferrer"
      >
        {loc.textAfter}
      </a>
    </Text>
  )
}
