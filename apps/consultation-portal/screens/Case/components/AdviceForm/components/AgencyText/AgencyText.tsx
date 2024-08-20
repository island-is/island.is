import { Text } from '@island.is/island-ui/core'
import localization from '../../../../Case.json'

import * as styles from './AgencyText.css'

export const AgencyText = () => {
  const loc = localization['agencyText']

  return (
    <Text marginTop={2} variant="small">
      {loc.textBefore}{' '}
      <span className={styles.linkText}>
        <a
          target="_blank"
          href="https://island.is/minar-sidur-adgangsstyring"
          rel="noopener noreferrer"
        >
          {loc.textAfter}
        </a>
      </span>
      {'.'}
    </Text>
  )
}
