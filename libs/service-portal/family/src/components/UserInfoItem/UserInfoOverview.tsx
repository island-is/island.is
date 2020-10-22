import React, { FC } from 'react'
import {
  Typography,
  Box,
  GridRow,
  GridColumn,
  ArrowLink,
} from '@island.is/island-ui/core'
import { Link } from 'react-router-dom'
import { useLocale } from '@island.is/localization'
import * as styles from './UserInfo.treat'
import { MessageDescriptor } from 'react-intl'

interface UserInfoOverviewItemComponent {
  heading: MessageDescriptor | string
  subtext: MessageDescriptor | string
  link: string
  image: string
}

const UserInfoOverviewItem: FC<UserInfoOverviewItemComponent> = ({
  heading,
  subtext,
  link,
  image,
}) => {
  const { formatMessage } = useLocale()
  return (
    <GridRow>
      <GridColumn span={['12/12', '12/12', '8/12', '8/12']}>
        <Box marginBottom={2}>
          <Typography variant="h2" as="h2">
            {formatMessage(heading)}
          </Typography>
        </Box>
        <Typography variant="p" as="p">
          {formatMessage(subtext)}
        </Typography>
        <Box marginTop={[3, 4]}>
          <Link to={link}>
            <ArrowLink>
              {formatMessage({
                id: 'service.portal:continue-button',
                defaultMessage: 'Halda áfram',
              })}
            </ArrowLink>
          </Link>
        </Box>
      </GridColumn>
      <GridColumn
        span={['0', '0', '2/12', '2/12']}
        offset={['0', '0', '1/12', '1/12']}
      >
        <Box>
          <img className={styles.figure} src={image} />
        </Box>
      </GridColumn>
    </GridRow>
  )
}

export default UserInfoOverviewItem
