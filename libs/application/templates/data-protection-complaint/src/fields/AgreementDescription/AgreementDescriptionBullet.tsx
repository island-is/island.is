import { Bullet, Link } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { FC } from 'react'
import { MessageDescriptor } from 'react-intl'
import * as styles from '../AgreementDescription/AgreementDescription.css'

interface AgreementDescriptionBulletProps {
  summary: MessageDescriptor | string
  link: MessageDescriptor | string
  linkName: MessageDescriptor | string
}

export const AgreementDescriptionBullet: FC<
  React.PropsWithChildren<AgreementDescriptionBulletProps>
> = ({ summary, link, linkName }) => {
  const { formatMessage } = useLocale()

  return (
    <Bullet>
      {formatMessage(summary, {
        link: (
          <Link href={formatMessage(link)} newTab>
            <span className={styles.link}>{formatMessage(linkName)}</span>
          </Link>
        ),
      })}
    </Bullet>
  )
}
