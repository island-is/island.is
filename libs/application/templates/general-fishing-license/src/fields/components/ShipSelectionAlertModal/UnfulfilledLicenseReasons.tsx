import { FishingLicenseUnfulfilledLicense } from '@island.is/api/schema'
import {
  Box,
  Text,
  BulletList,
  Bullet,
  Button,
  AlertMessage,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { FC, useState } from 'react'
import AnimateHeight from 'react-animate-height'
import { fishingLicense, shipSelection } from '../../../lib/messages'

interface UnfulfilledLicenseReasonsProps {
  unfulfilledLicense: FishingLicenseUnfulfilledLicense
}

export const UnfulfilledLicenseReasons: FC<UnfulfilledLicenseReasonsProps> = ({
  unfulfilledLicense,
}) => {
  const { formatMessage } = useLocale()
  const [isExpanded, setIsExpanded] = useState(false)
  const handleExpandClick = () => setIsExpanded(!isExpanded)
  if (unfulfilledLicense.fishingLicense.code === 'unknown') return null
  return (
    <Box paddingTop={2}>
      <AlertMessage
        type="warning"
        title={formatMessage(
          fishingLicense.warningMessageTitle[
            unfulfilledLicense.fishingLicense.code
          ],
        )}
        message={
          <Box paddingBottom={1}>
            <Text variant="small" paddingBottom={1}>
              {formatMessage(
                fishingLicense.warningMessageDescription[
                  unfulfilledLicense.fishingLicense.code
                ],
              )}
            </Text>
            <AnimateHeight duration={400} height={isExpanded ? 'auto' : 0}>
              <Box paddingBottom={4} paddingTop={3}>
                <BulletList space={3} color="yellow600">
                  {unfulfilledLicense?.reasons.map((reason, index) => {
                    return (
                      <Bullet key={`bullet-${index}`}>
                        <Text variant="eyebrow">{reason.description}</Text>
                        <Text variant="small">{reason.directions}</Text>
                      </Bullet>
                    )
                  })}
                </BulletList>
              </Box>
            </AnimateHeight>
            <Button
              variant="text"
              size="small"
              icon={isExpanded ? 'arrowUp' : 'arrowDown'}
              iconType="outline"
              onClick={handleExpandClick}
            >
              {formatMessage(
                shipSelection.labels.unfulfilledLicensesModalExpandButton,
              )}
            </Button>
          </Box>
        }
      />
    </Box>
  )
}
