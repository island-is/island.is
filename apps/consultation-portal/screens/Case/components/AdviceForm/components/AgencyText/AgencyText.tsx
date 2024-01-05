import { Text } from '@island.is/island-ui/core'
import localization from '../../../../Case.json'

export const AgencyText = () => {
  const loc = localization['agencyText']

  return (
    <Text marginTop={2} variant="small">
      {loc.textBefore}{' '}
      <span>
        <a
          target="_blank"
          href="https://island.is/minar-sidur-adgangsstyring"
          rel="noopener noreferrer"
        >
          {loc.textAfter}
        </a>
      </span>
    </Text>
  )
}
