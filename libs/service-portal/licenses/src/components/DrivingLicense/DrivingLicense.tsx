import React, { useState } from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Box, Button, Hidden, Tag, Text } from '@island.is/island-ui/core'
import { Link } from 'react-router-dom'
import * as styles from './DrivingLicense.css'
import { getExpiresIn, toDate } from '../../utils/dateUtils'
import { ServicePortalPath } from '@island.is/service-portal/core'
import QRCodeModal from '../../components/QRCodeModal/QRCodeModal'
import { m } from '../../lib/messages'

export const DrivingLicense = ({
  id,
  expireDate,
}: {
  id: string
  expireDate: string
}) => {
  useNamespaces('sp.license')
  const { formatMessage } = useLocale()
  const [modalOpen, setModalOpen] = useState(false)
  const [currentDate] = useState(new Date())

  const toggleModal = () => {
    setModalOpen(!modalOpen)
  }
  const drivingLicenceImg =
    'https://images.ctfassets.net/8k0h54kbe6bj/6XhCz5Ss17OVLxpXNVDxAO/d3d6716bdb9ecdc5041e6baf68b92ba6/coat_of_arms.svg?w=100&h=100&fit=pad&bg=white&fm=png'

  const expiresIn = getExpiresIn(currentDate, new Date(expireDate))
  return (
    <>
      <Box
        border="standard"
        borderRadius="large"
        padding={4}
        display="flex"
        flexDirection="row"
      >
        <Hidden below="sm">
          <img
            className={styles.image}
            src={drivingLicenceImg}
            alt={formatMessage(m.drivingLicense)}
          />
        </Hidden>
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
              {formatMessage(m.drivingLicense)}
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
                      {Math.round(expiresIn.value)}
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
                {formatMessage(m.drivingLicenseNumber)}
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
              <Button
                variant="text"
                size="small"
                icon="QRCode"
                iconType="outline"
                onClick={toggleModal}
              >
                {formatMessage(m.sendToPhone)}
              </Button>
              <Hidden below="sm">
                <Box className={styles.line} marginLeft={2} marginRight={2} />
              </Hidden>
              <Link
                to={{
                  pathname: ServicePortalPath.LicensesDrivingDetail.replace(
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
      <QRCodeModal
        id="qrcode-modal"
        toggleClose={modalOpen}
        onCloseModal={toggleModal}
        expires={toDate(new Date(expireDate).getTime().toString())}
      />
    </>
  )
}

export default DrivingLicense
