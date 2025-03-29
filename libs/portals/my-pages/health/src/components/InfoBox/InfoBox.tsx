import React from 'react'
import {
  IconProps,
  Box,
  Text,
  Icon,
  Divider,
  Button,
  Stack,
} from '@island.is/island-ui/core'

interface InfoBoxProps {
  title: string
  icon: Pick<IconProps, 'icon'>
  button: {
    action: () => void
    label: string
  }
  children: React.ReactNode
}

const InfoBox: React.FC<InfoBoxProps> = ({ title, icon, children, button }) => {
  return (
    <Box
      border="standard"
      borderRadius="large"
      borderColor="blue200"
      padding={3}
      width="half"
      style={{ height: 'fit-content' }}
    >
      <Stack space={3}>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="flexStart"
          alignItems="center"
        >
          <Icon
            icon={icon.icon ?? 'business'}
            color="blue400"
            size="medium"
            type="outline"
          />
          <Box marginLeft={2}>
            <Text variant="h4" color="blue400">
              {title}
            </Text>
          </Box>
        </Box>
        <Divider />
        {children}
        {button && (
          <Box display="flex" justifyContent="center">
            <Button variant="text" icon="arrowForward" size="small">
              {button.label}
            </Button>
          </Box>
        )}
      </Stack>
    </Box>
  )
}

export default InfoBox
