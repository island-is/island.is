import { AlertMessage, Button, Text, Divider } from '@island.is/island-ui/core'
import { FC } from 'react'
import { useLocale } from '@island.is/localization'
import { formatText } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { m } from '../../lib/messagess'
import { Bus } from '../../assets/Bus'

export const ConfirmationField: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()

  function renderFooter() {
    return (
      <>
        <Divider />
        <Box
          display="flex"
          justifyContent="flexEnd"
          paddingTop={4}
          marginBottom={4}
        >
          <Button
            icon="arrowForward"
            iconType="outline"
            onClick={() => {
              window.open(`${window.location.origin}/minarsidur`, '_blank')
            }}
          >
            {formatText(m.openMySites, application, formatMessage)}
          </Button>
        </Box>
      </>
    )
  }

  return (
    <>
      <Text variant="h2" marginBottom={4}>
        {formatText(m.confirmation, application, formatMessage)}
      </Text>
      <Box marginBottom={3} paddingTop={0}>
        <AlertMessage
          type="success"
          title={formatText(m.successTitle, application, formatMessage)}
          message={
            <Box component="span" display="block">
              <Text variant="small">
                {formatText(m.successDescription, application, formatMessage)}
              </Text>
            </Box>
          }
        />
      </Box>

      <Box
        display="flex"
        justifyContent="center"
        marginTop={2}
        marginBottom={4}
      >
        <Bus />
      </Box>

      {renderFooter()}
    </>
  )
}
