import React, { useState } from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Box, Button, Hidden, Tag, Text } from '@island.is/island-ui/core'
import { Link } from 'react-router-dom'
import * as styles from './AdrLicense.css'
import { getExpiresIn, toDate } from '../../utils/dateUtils'
import { ServicePortalPath } from '@island.is/service-portal/core'
import { m } from '../../lib/messages'
import { Pkass } from '../QRCodeModal/PkPass'

export const AdrLicense = ({
  id,
  expireDate,
}: {
  id: string
  expireDate: string
}) => {
  useNamespaces('sp.license')
  const { formatMessage } = useLocale()

  const [currentDate] = useState(new Date())

  const expiresIn = getExpiresIn(currentDate, new Date(expireDate))

  return (
    <Box
      border="standard"
      borderRadius="large"
      padding={4}
      display="flex"
      flexDirection="row"
    >
      <Box
        display="flex"
        flexDirection="column"
        width="full"
        paddingLeft={[0, 2]}
      >
        <Box
          display="flex"
          flexDirection={['column', 'column', 'column', 'row']}
          justifyContent="spaceBetween"
          alignItems="flexStart"
        >
          <Text variant="h4" as="h2">
            {formatMessage(m.adrLicense)}
          </Text>
          <Box
            display="flex"
            flexDirection={['column', 'column', 'row']}
            alignItems={['flexStart', 'flexStart', 'flexEnd']}
            justifyContent="flexEnd"
            textAlign="right"
            marginBottom={1}
          >
            {expiresIn && (
              <Box paddingRight={1} paddingTop={[1, 0]}>
                {expiresIn.value <= 0 ? (
                  <Tag disabled variant="red">
                    {formatMessage(m.isExpired)}
                  </Tag>
                ) : (
                  <Tag disabled variant="red">
                    {formatMessage(m.expiresIn)}
                    {'\xa0'}
                    {Math.round(expiresIn.value)}
                    {'\xa0'}
                    {expiresIn.key === 'months'
                      ? formatMessage(m.months)
                      : formatMessage(m.days)}
                  </Tag>
                )}
              </Box>
            )}
            <Box paddingTop={expiresIn ? [1, 1, 0] : undefined}>
              <Tag disabled variant="blue">
                {formatMessage(m.validUntil)}
                {'\xa0'}
                {toDate(new Date(expireDate).getTime().toString())}
              </Tag>
            </Box>
          </Box>
        </Box>

        <Box
          display="flex"
          flexDirection={['column', 'row']}
          justifyContent={'spaceBetween'}
          paddingTop={[1, 0]}
        >
          <Box className={styles.flexShrink}>
            <Text>
              {formatMessage(m.licenseNumber)}
              {' - '}
              {id}
            </Text>
          </Box>
          <Box
            display="flex"
            flexDirection={['column', 'row']}
            justifyContent={'flexEnd'}
            alignItems={['flexStart', 'center']}
            className={styles.flexGrow}
            paddingTop={[1, 0]}
          >
            <Link
              to={{
                pathname: ServicePortalPath.LicensesAdrDetail.replace(
                  ':id',
                  id,
                ),
              }}
            >
              <Box paddingTop={[1, 0]}>
                <Button variant="text" size="small" icon="arrowForward">
                  {formatMessage(m.seeDetails)}
                </Button>
              </Box>
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default AdrLicense
