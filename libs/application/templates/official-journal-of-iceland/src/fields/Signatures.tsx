import { useLocale } from '@island.is/localization'
import { FormGroup } from '../components/form/FormGroup'
import { InputFields, OJOIFieldBaseProps } from '../lib/types'
import { signatures } from '../lib/messages/signatures'
import { useState } from 'react'
import { SignatureType, SignatureTypes } from '../lib/constants'
import { Tabs } from '@island.is/island-ui/core'
import { CommitteeSignature } from '../components/signatures/Committee'
import { RegularSignature } from '../components/signatures/Regular'
import { useApplication } from '../hooks/useUpdateApplication'
import set from 'lodash/set'

export const Signatures = ({ application }: OJOIFieldBaseProps) => {
  const { formatMessage: f } = useLocale()
  const { updateApplication } = useApplication({
    applicationId: application.id,
  })

  const [selectedTab, setSelectedTab] = useState<SignatureType>(
    (application.answers?.misc?.signatureType as SignatureType) ??
      SignatureTypes.REGULAR,
  )

  const tabs = [
    {
      id: SignatureTypes.REGULAR,
      label: f(signatures.tabs.regular),
      content: <RegularSignature applicationId={application.id} />,
    },
    {
      id: SignatureTypes.COMMITTEE,
      label: f(signatures.tabs.committee),
      content: <CommitteeSignature applicationId={application.id} />,
    },
  ]

  const onTabChangeHandler = (tabId: string) => {
    if (Object.values(SignatureTypes).includes(tabId as SignatureTypes)) {
      setSelectedTab(tabId as SignatureType)

      const currentAnswers = structuredClone(application.answers)
      const newAnswers = set(
        currentAnswers,
        InputFields.other.signatureType,
        tabId,
      )

      updateApplication(newAnswers)
    }
  }

  return (
    <>
      <FormGroup
        title={f(signatures.general.title)}
        intro={f(signatures.general.intro)}
      >
        <Tabs
          selected={selectedTab}
          tabs={tabs}
          label={f(signatures.general.title)}
          contentBackground="white"
          onChange={onTabChangeHandler}
        />
        {/* <AdditionalSignature
          application={application}
          errors={errors}
          setSignature={debouncedAdditionalSignatureUpdate}
          signature={state.additional}
        /> */}
      </FormGroup>
      {/* <FormGroup title={f(signatures.headings.preview)}>
        <HTMLEditor
          key={selectedTab}
          value={preview}
          config={signatureConfig}
          readOnly={true}
          name={InputFields.signature.contents}
          />
    </FormGroup> */}
    </>
  )
}
