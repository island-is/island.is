import {
  Box,
  Button,
  Column,
  Columns,
  GridContainer,
  Input,
  Text,
} from '@island.is/island-ui/core'
import * as styles from './SubscriptionActionCard.css'

export interface SubscriptionActionCardProps {
  userIsLoggedIn: boolean
  heading: string
  text: string
  button: {
    label: string
    onClick?: () => void
    disabled?: boolean
  }
  input?: {
    label: string
    placeholder: string
    name: string
    value?: string
    disabled?: boolean
  }
}

const SubscriptionActionCard = ({
  userIsLoggedIn,
  heading,
  text,
  button,
  input,
}: SubscriptionActionCardProps) => {
  return (
    <Box
      display="flex"
      flexDirection={
        userIsLoggedIn ? 'column' : ['column', 'column', 'row', 'row']
      }
      justifyContent={
        userIsLoggedIn
          ? 'flexStart'
          : ['flexStart', 'flexStart', 'spaceBetween', 'spaceBetween']
      }
      alignItems={
        userIsLoggedIn
          ? 'flexStart'
          : ['flexStart', 'flexStart', 'center', 'center']
      }
      borderColor={userIsLoggedIn ? 'blue400' : 'blue200'}
      borderRadius="large"
      borderWidth="standard"
      background="white"
      paddingX={[3, 3, 4, 4]}
      paddingY={3}
      columnGap={3}
      rowGap={2}
    >
      <Box display="flex" flexDirection="column">
        <Text variant="h3">{heading}</Text>
        <Text paddingTop={1}>{text}</Text>
      </Box>
      {userIsLoggedIn ? (
        <GridContainer>
          <Columns space={[2, 2, 3, 3]} collapseBelow="md">
            <Column width="9/12">
              <Input
                name={input.name}
                size="sm"
                label={input.label}
                placeholder={input.placeholder}
              />
            </Column>
            <Column width="3/12">
              <Button
                icon={'open'}
                iconType="outline"
                nowrap
                fluid
                size="default"
                onClick={button.onClick}
                disabled={button.disabled}
              >
                {button.label}
              </Button>
            </Column>
          </Columns>
        </GridContainer>
      ) : (
        <Box
          paddingTop={[3, 3, 0, 0]}
          display="flex"
          alignItems="center"
          className={styles.button}
        >
          <Button
            nowrap
            fluid
            size="small"
            onClick={button.onClick}
            disabled={button.disabled}
          >
            {button.label}
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default SubscriptionActionCard
