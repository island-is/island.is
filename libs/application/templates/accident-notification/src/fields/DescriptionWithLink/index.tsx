import { Link, Text } from '@island.is/island-ui/core'
import React, { FC } from 'react'
import { useLocale } from '@island.is/localization'
import { formatText } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import * as styles from './descriptionWithLink.css'

type DescriptionLinkProps = {
  field: {
    props: {
      descriptionFirstPart: string
      descriptionSecondPart: string
      linkName: string
      url: string
    }
  }
}

export const DescriptionWithLink: FC<
  React.PropsWithChildren<FieldBaseProps & DescriptionLinkProps>
> = ({ application, field }) => {
  const { props } = field
  const { formatMessage } = useLocale()
  const { descriptionFirstPart, descriptionSecondPart, linkName, url } = props
  return (
    <Box paddingTop="smallGutter">
      <Box component="span" display="block" paddingTop={'smallGutter'}>
        <Text>
          {`${formatText(descriptionFirstPart, application, formatMessage)} `}
          <Link href={formatText(url, application, formatMessage)}>
            <span className={styles.link}>{` ${formatText(
              linkName,
              application,
              formatMessage,
            )}`}</span>
          </Link>
          {formatText(descriptionSecondPart, application, formatMessage)}
        </Text>
      </Box>
    </Box>
  )
}
