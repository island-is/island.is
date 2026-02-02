import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, ReactNode } from 'react'
import { m } from '../../lib/messages'

interface QuestionnaireHeaderProps {
  img?: string
  title: string
  enableStepper?: boolean
  buttonGroup?: Array<ReactNode>
}

export const QuestionnaireHeader: FC<QuestionnaireHeaderProps> = ({
  title,
  img,
  buttonGroup,
  enableStepper = false,
}) => {
  const { formatMessage } = useLocale()

  return (
    <Box
      borderBottomWidth="standard"
      borderColor="blue200"
      display="flex"
      justifyContent="spaceBetween"
      alignItems="flexEnd"
      flexDirection="row"
      columnGap={3}
      padding={[0, 0, 0, 3]}
    >
      <Box display="flex" flexDirection="row" columnGap={3}>
        {img && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            background={enableStepper ? 'blue100' : 'white'}
            borderRadius="full"
            padding={1}
            style={{ maxWidth: 48, maxHeight: 48 }}
          >
            <img src={img} alt="" style={{ height: '100%' }} />
          </Box>
        )}
        <Box display={'flex'} flexDirection={'column'}>
          <Text variant="small">{formatMessage(m.questionnaires)}</Text>
          <Text variant="h5" as="h1" marginBottom={2}>
            {title}
          </Text>
        </Box>
      </Box>
      {buttonGroup && <Box>{buttonGroup}</Box>}
    </Box>
  )
}
