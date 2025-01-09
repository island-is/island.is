import { useLocale } from '@island.is/localization'
import { FormGroup } from '../components/form/FormGroup'
import { InputFields, OJOIFieldBaseProps } from '../lib/types'
import { signatures } from '../lib/messages/signatures'
import { useState } from 'react'
import { SignatureType, SignatureTypes } from '../lib/constants'
import { Box, Button, SkeletonLoader, Tabs } from '@island.is/island-ui/core'
import { CommitteeSignature } from '../components/signatures/Committee'
import { RegularSignature } from '../components/signatures/Regular'
import { useApplication } from '../hooks/useUpdateApplication'
import set from 'lodash/set'
import { HTMLEditor } from '../components/htmlEditor/HTMLEditor'
import { getSignaturesMarkup } from '../lib/utils'
import { useLastSignature } from '../hooks/useLastSignature'
import { useFormContext } from 'react-hook-form'

export const Signatures = ({ application }: OJOIFieldBaseProps) => {
  const { formatMessage: f } = useLocale()
  const { setValue } = useFormContext()
  const {
    updateApplication,
    updateLoading,
    application: currentApplication,
    refetchApplication,
  } = useApplication({
    applicationId: application.id,
  })

  const [selectedTab, setSelectedTab] = useState<SignatureType>(
    (application.answers?.misc?.signatureType as SignatureType) ??
      SignatureTypes.REGULAR,
  )

  const { lastSignature } = useLastSignature({
    involvedPartyId: application.answers.advert?.involvedPartyId ?? '',
  })

  const tabs = [
    {
      id: SignatureTypes.REGULAR,
      label: f(signatures.tabs.regular),
      content: updateLoading ? (
        <SkeletonLoader />
      ) : (
        <RegularSignature applicationId={application.id} />
      ),
    },
    {
      id: SignatureTypes.COMMITTEE,
      label: f(signatures.tabs.committee),
      content: updateLoading ? (
        <SkeletonLoader />
      ) : (
        <CommitteeSignature applicationId={application.id} />
      ),
    },
  ]

  const currentAnswers = structuredClone(currentApplication.answers)

  const onCopyLastSignatureClick = () => {
    if (lastSignature?.type?.slug === 'hefdbundin-undirritun') {
      const signatureToSet = [
        {
          date: lastSignature.date,
          institution: lastSignature.institution,
          members: lastSignature.members?.map((member) => ({
            name: member.name,
            above: member.above ?? '',
            below: member.below ?? '',
            after: member.after ?? '',
            before: member.before ?? '',
          })),
          html: lastSignature.html,
        },
      ]

      const updatedAnswers = set(
        currentAnswers,
        InputFields.signature.regular,
        signatureToSet,
      )

      setValue(InputFields.signature.regular, signatureToSet)
      updateApplication(updatedAnswers, refetchApplication)
    }
  }

  const onTabChangeHandler = (tabId: string) => {
    if (Object.values(SignatureTypes).includes(tabId as SignatureTypes)) {
      setSelectedTab(tabId as SignatureType)

      const currentAnswers = structuredClone(application.answers)
      const newAnswers = set(
        currentAnswers,
        InputFields.misc.signatureType,
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
        <Box marginTop={2}>
          <Button
            onClick={() => onCopyLastSignatureClick()}
            variant="utility"
            size="small"
            icon="copy"
            disabled={!lastSignature}
            iconType="outline"
          >
            {'Afrita seinustu undirskrift'}
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
      <FormGroup title={f(signatures.headings.preview)}>
        <HTMLEditor
          name="signaturePreview"
          key={selectedTab}
          value={getSignaturesMarkup({
            signatures: currentApplication.answers.signatures,
            type: selectedTab as SignatureTypes,
          })}
          readOnly={true}
        />
      </FormGroup>
    </>
  )
}
