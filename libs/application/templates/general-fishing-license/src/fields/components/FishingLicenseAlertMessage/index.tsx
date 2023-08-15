import {
  AlertMessage,
  Box,
  Bullet,
  BulletList,
  Button,
  Text,
} from '@island.is/island-ui/core'
import AnimateHeight from 'react-animate-height'
import React, { FC, useState } from 'react'

interface FishingLicenseAlertMessageProps {
  title: string
  description: string
  reasons: {
    description: string
    directions: string
  }[]
}

export const FishingLicenseAlertMessage: FC<
  React.PropsWithChildren<FishingLicenseAlertMessageProps>
> = ({ title, description, reasons }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleExpandClick = () => setIsExpanded(!isExpanded)
  return (
    <AlertMessage
      type="info"
      title={title}
      message={
        <Box paddingBottom={1}>
          <Text variant="small" paddingBottom={1}>
            {description}
          </Text>
          <AnimateHeight duration={400} height={isExpanded ? 'auto' : 0}>
            <Box paddingBottom={4} paddingTop={3}>
              <BulletList space={3} color="yellow600">
                {reasons.map((reason, index) => {
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
      }
    />
  )
}
