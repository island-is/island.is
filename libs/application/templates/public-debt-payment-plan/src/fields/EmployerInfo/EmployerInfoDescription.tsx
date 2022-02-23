import { Button, Link, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React from 'react'
import { employer } from '../../lib/messages'
import * as styles from './EmployerInfoDescription.css'

export const EmployerInfoDescription = () => {
  const { formatMessage } = useLocale()

  return (
    <div className={styles.wrapper}>
      <Text>
        {`${formatMessage(employer.general.pageDescription)} `}
        <Link href="https://www.skatturinn.is/">
          <Button variant="text" icon="open" iconType="outline">
            {formatMessage(employer.labels.taxHomePage)}
          </Button>
        </Link>
      </Text>
    </div>
  )
}
