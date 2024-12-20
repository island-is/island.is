import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import {
  AlertMessage,
  Box,
  Button,
  Divider,
  Text,
} from '@island.is/island-ui/core'
import { ApplicantOverview } from '../overview/ApplicantOverview'
import { CustodianOverview } from '../overview/CustodianOverview'
import { SchoolSelectionOverview } from '../overview/SchoolSelectionOverview'
import { ExtraInformationOverview } from '../overview/ExtraInformationOverview'
import { useLocale } from '@island.is/localization'
import { conclusion, overview } from '../../lib/messages'
import { ConclusionView } from '../../utils'

interface Props {
  setView: (view: ConclusionView) => void
}

export const ConclusionOverview: FC<
  React.PropsWithChildren<Props & FieldBaseProps>
> = (props) => {
  const { formatMessage } = useLocale()

  const onBackButtonClick = () => {
    props.setView(ConclusionView.DEFAULT)
  }

  return (
    <Box>
      <Text variant="h1" marginBottom={2}>
        {formatMessage(overview.general.pageTitle)}
      </Text>
      <AlertMessage
        type="info"
        title={formatMessage(conclusion.overview.alertTitle)}
        message={formatMessage(conclusion.overview.alertMessage)}
      />

      <ApplicantOverview {...props} />
      <CustodianOverview {...props} />
      <SchoolSelectionOverview {...props} />
      <ExtraInformationOverview {...props} />

      <Divider />
      <Box display="flex" justifyContent="spaceBetween" paddingY={5}>
        <Button variant="ghost" onClick={onBackButtonClick}>
          {formatMessage(conclusion.buttons.back)}
        </Button>
      </Box>
    </Box>
  )
}
