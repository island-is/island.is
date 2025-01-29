import { useLocale } from '@island.is/localization'
import { FormGroup } from '../components/form/FormGroup'
import {
  InputFields,
  OJOIFieldBaseProps,
  Signature,
  SignatureItem,
  SignatureItemWithChairman,
  SignatureMember,
} from '../lib/types'
import { signatures } from '../lib/messages/signatures'
import { useState } from 'react'
import { SignatureType, SignatureTypes } from '../lib/constants'
import { Box, Button, Stack, Tabs } from '@island.is/island-ui/core'
import { CommitteeSignature } from '../components/signatures/Committee'
import { RegularSignature } from '../components/signatures/Regular'
import { useApplication } from '../hooks/useUpdateApplication'
import set from 'lodash/set'
import { HTMLEditor } from '../components/htmlEditor/HTMLEditor'
import { getSignaturesMarkup } from '../lib/utils'
import { useLastSignature } from '../hooks/useLastSignature'
import { useFormContext } from 'react-hook-form'
import { OfficialJournalOfIcelandApplicationSignatureMember } from '@island.is/api/schema'
import { isDefined } from '@island.is/shared/utils'

export const Signatures = ({ application }: OJOIFieldBaseProps) => {
  const { formatMessage: f } = useLocale()
  const { setValue } = useFormContext()
  const {
    updateApplication,
    application: currentApplication,
    refetchApplication,
  } = useApplication({
    applicationId: application.id,
  })

  const [lastCopied, setLastCopied] = useState(new Date().toISOString())

  const [selectedTab, setSelectedTab] = useState<SignatureType>(
    (application.answers?.misc?.signatureType as SignatureType) ??
      SignatureTypes.REGULAR,
  )

  const { lastSignature } = useLastSignature({
    involvedPartyId: application.answers.advert?.involvedPartyId,
  })

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

  const onCopyLastSignatureClick = () => {
    if (!lastSignature) {
      return
    }

    const isCommitteeSignature =
      lastSignature.__typename ===
      'OfficialJournalOfIcelandApplicationInvolvedPartySignaturesCommittee'

    const mapSignatureMember = (
      member?: OfficialJournalOfIcelandApplicationSignatureMember,
    ): SignatureMember | undefined => {
      if (!member) {
        return undefined
      }
      return {
        name: member.name,
        above: member.above ?? '',
        below: member.below ?? '',
        after: member.after ?? '',
        before: member.before ?? '',
      }
    }
    const signatureToSet: SignatureItem | SignatureItemWithChairman = {
      date: lastSignature.date,
      institution: lastSignature.institution,
      members: lastSignature?.members
        .map((m) => mapSignatureMember(m))
        .filter(isDefined),
      html: lastSignature.html ?? undefined,
    }

    const signature: Signature = {
      signatures: {
        ...(isCommitteeSignature
          ? {
              committee: {
                ...signatureToSet,
                chairman: mapSignatureMember(
                  lastSignature?.chairman ?? undefined,
                ),
              },
            }
          : { regular: [signatureToSet] }),
      },
    }

    setValue(
      isCommitteeSignature
        ? InputFields.signature.committee
        : InputFields.signature.regular,
      signature,
    )
    updateApplication(signature, () => {
      refetchApplication()
      setLastCopied(new Date().toISOString())
    })
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
    <Stack space={2} key={lastCopied}>
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
      <FormGroup title={f(signatures.headings.preview)}>
        <HTMLEditor
          name="signaturePreview"
          config={{ toolbar: false }}
          key={selectedTab}
          value={getSignaturesMarkup({
            signatures: currentApplication.answers.signatures,
            type: selectedTab as SignatureTypes,
          })}
          readOnly={true}
        />
      </FormGroup>
    </Stack>
  )
}
