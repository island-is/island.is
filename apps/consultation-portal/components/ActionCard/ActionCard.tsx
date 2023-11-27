import {
  Box,
  Button,
  Column,
  Columns,
  GridContainer,
  IconMapIcon,
  Input,
  Text,
} from '@island.is/island-ui/core'
import { BaseSyntheticEvent } from 'react'
import * as styles from './ActionCard.css'

interface ButtonProps {
  label: string
  onClick?: () => void
  disabled?: boolean
  isLoading?: boolean
  icon?: IconMapIcon
}

interface Props {
  heading?: string
  text?: string
  button: Array<ButtonProps>
  input?: {
    label: string
    placeholder: string
    name: string
    value?: string
    disabled?: boolean
    onChange?: (e: BaseSyntheticEvent) => void
  }
}

const ActionCard = ({ heading, text, button, input }: Props) => {
  const noInput = typeof input !== 'undefined'

  return (
    <Box
      display="flex"
      flexDirection={noInput ? 'column' : ['column', 'column', 'row', 'row']}
      justifyContent={
        noInput
          ? 'flexStart'
          : ['flexStart', 'flexStart', 'spaceBetween', 'spaceBetween']
      }
      alignItems={
        noInput ? 'flexStart' : ['flexStart', 'flexStart', 'center', 'center']
      }
      borderColor={noInput ? 'blue400' : 'blue200'}
      borderRadius="large"
      borderWidth="standard"
      background="white"
      paddingX={[3, 3, 4, 4]}
      paddingY={3}
      columnGap={3}
      rowGap={2}
      dataTestId="action-card"
    >
      <Box display="flex" flexDirection="column">
        {!!heading && <Text variant="h3">{heading}</Text>}
        {!!text && <Text paddingTop={1}>{text}</Text>}
      </Box>
      {noInput ? (
        <GridContainer>
          <Columns space={[2, 2, 3, 3]} collapseBelow="md">
            <Column width="9/12">
              <Input
                name={input.name}
                size="sm"
                label={input.label}
                placeholder={input.placeholder}
                value={input.value}
                onChange={input.onChange}
              />
            </Column>
            <Column width="3/12">
              {button &&
                button.map((btn, index) => {
                  return (
                    <Button
                      key={index}
                      icon={btn.icon}
                      iconType="outline"
                      nowrap
                      fluid
                      size="default"
                      onClick={btn.onClick}
                      disabled={btn.disabled}
                      loading={btn.isLoading}
                    >
                      {btn.label}
                    </Button>
                  )
                })}
            </Column>
          </Columns>
        </GridContainer>
      ) : (
        <Box
          paddingTop={[3, 3, 0, 0]}
          display="flex"
          alignItems="center"
          flexDirection="row"
          className={styles.buttoncontainer}
        >
          {button &&
            button.map((btn, index) => {
              return (
                <Box
                  key={index}
                  marginX={1}
                  alignItems="center"
                  className={styles.button}
                  display="flex"
                >
                  <Button
                    nowrap
                    variant={index > 0 ? 'ghost' : 'primary'}
                    fluid
                    size="small"
                    onClick={btn.onClick}
                    disabled={btn.disabled}
                    loading={btn.isLoading}
                  >
                    {btn.label}
                  </Button>
                </Box>
              )
            })}
        </Box>
      )}
    </Box>
  )
}

export default ActionCard
