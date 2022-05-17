import { FishingLicenseUnfulfilledLicense } from '@island.is/api/schema'
import {
  Box,
  Text,
  BulletList,
  Bullet,
  Button,
} from '@island.is/island-ui/core'
import React, { FC, useState } from 'react'
import AnimateHeight from 'react-animate-height'

interface UnfulfilledLicenseReasonsProps {
  unfulfilledLicense: FishingLicenseUnfulfilledLicense
}

export const UnfulfilledLicenseReasons: FC<UnfulfilledLicenseReasonsProps> = ({
  unfulfilledLicense,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const handleExpandClick = () => setIsExpanded(!isExpanded)
  return (
    <Box paddingBottom={1}>
      <Text variant="small" paddingBottom={1}>
        description
      </Text>
      <AnimateHeight duration={400} height={isExpanded ? 'auto' : 0}>
        <Box paddingBottom={4} paddingTop={3}>
          <BulletList space={3}>
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
        Nánar
      </Button>
    </Box>
  )
}
