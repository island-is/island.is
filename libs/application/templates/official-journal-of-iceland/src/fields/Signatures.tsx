import { useLocale } from '@island.is/localization'
import { FormGroup } from '../components/form/FormGroup'
import { InputFields, OJOIFieldBaseProps } from '../lib/types'
import { signatures } from '../lib/messages/signatures'
import { useState } from 'react'
import { Box, Button, Stack, Tabs } from '@island.is/island-ui/core'
import { useApplication } from '../hooks/useUpdateApplication'
import { useLastSignature } from '../hooks/useLastSignature'
import { SignaturesTab } from '../components/signatures/SignaturesTab'

export const SignaturesField = ({ application }: OJOIFieldBaseProps) => {
  const { formatMessage: f } = useLocale()
  const { updateApplicationV2 } = useApplication({
    applicationId: application.id,
  })

  const [selectedTab, setSelectedTab] = useState(
    application.answers?.misc?.signatureType ?? 'regular',
  )

  const { lastSignature } = useLastSignature({
    involvedPartyId: application.answers.advert?.involvedPartyId,
  })

  const tabs = [
    {
      id: 'regular',
      label: f(signatures.tabs.regular),
      content: <SignaturesTab application={application} variant="regular" />,
    },
    {
      id: 'committee',
      label: f(signatures.tabs.committee),
      content: <SignaturesTab application={application} variant="committee" />,
    },
  ]

  const onTabChangeHandler = (tabId: string) => {
    setSelectedTab(tabId)

    updateApplicationV2({
      path: InputFields.misc.signatureType,
      value: tabId,
    })
  }

  return (
    <Stack space={2}>
      <FormGroup
        title={f(signatures.general.title)}
        intro={f(signatures.general.intro)}
      >
        <Box marginTop={2}>
          <Button
            onClick={() => console.log(lastSignature)}
            variant="utility"
            size="small"
            icon="copy"
            disabled={!lastSignature}
            iconType="outline"
          >
            {f(signatures.buttons.copyLastSignature)}
          </Button>
        </Box>
        <Tabs
          selected={selectedTab}
          tabs={tabs}
          label={f(signatures.general.title)}
          contentBackground="white"
          onChange={onTabChangeHandler}
        />
      </FormGroup>
    </Stack>
  )
}
