import { useIntl } from 'react-intl'

import { GridColumn, GridRow, Text } from '@island.is/island-ui/core'

import { translationStrings } from './translationStrings'
import * as styles from './PensionCalculator.css'

interface PensionCalculatorTitleProps {
  isNewSystemActive: boolean
  title: string
  titlePostfix: string
  titleVariant: 'h1' | 'h2'
}

export const PensionCalculatorTitle = ({
  isNewSystemActive,
  title,
  titlePostfix,
  titleVariant,
}: PensionCalculatorTitleProps) => {
  const { formatMessage } = useIntl()
  if (isNewSystemActive)
    return (
      <GridRow rowGap={3} className={styles.noWrap}>
        <GridColumn hiddenBelow="lg">
          <img
            width={84}
            height={70}
            src={formatMessage(translationStrings.after1stSeptember2025IconUrl)}
            alt=""
          />
        </GridColumn>
        <GridColumn>
          <Text variant={titleVariant} as="h1">
            {title} <div>{titlePostfix}</div>
          </Text>
        </GridColumn>
      </GridRow>
    )
  return (
    <Text variant={titleVariant} as="h1">
      {title} {titlePostfix}
    </Text>
  )
}
