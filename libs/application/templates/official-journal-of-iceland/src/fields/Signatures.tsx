import { useLocale } from '@island.is/localization'
import { FormGroup } from '../components/form/FormGroup'
import { InputFields, OJOIFieldBaseProps } from '../lib/types'
import { signatures } from '../lib/messages/signatures'
import { useState } from 'react'
import { Box, Button, Stack, Tabs } from '@island.is/island-ui/core'
import { useApplication } from '../hooks/useUpdateApplication'
import set from 'lodash/set'
import { useLastSignature } from '../hooks/useLastSignature'
import { useFormContext } from 'react-hook-form'
import { SignaturesTab } from '../components/signatures/SignaturesTab'

export const SignaturesField = ({ application }: OJOIFieldBaseProps) => {
  const { formatMessage: f } = useLocale()
  const { setValue } = useFormContext()
  const {
    updateApplication,
    application: currentApplication,
    refetchApplication,
  } = useApplication({
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
      content: <SignaturesTab />,
    },
    {
      id: 'committee',
      label: f(signatures.tabs.committee),
      content: <SignaturesTab />,
    },
  ]

  // const onCopyLastSignatureClick = () => {
  //   if (!lastSignature) {
  //     return
  //   }

  //   const mapSignatureMember = (
  //     member?: OfficialJournalOfIcelandApplicationSignatureMember,
  //   ): SignatureMember | undefined => {
  //     if (!member) {
  //       return undefined
  //     }
  //     return {
  //       name: member.name,
  //       above: member.above ?? '',
  //       below: member.below ?? '',
  //       after: member.after ?? '',
  //       before: member.before ?? '',
  //     }
  //   }

  //   const signatureToSet: SignatureItem | SignatureItemWithChairman = {
  //     date: lastSignature.date,
  //     institution: lastSignature.institution,
  //     members: lastSignature?.members
  //       .map((m) => mapSignatureMember(m))
  //       .filter(isDefined),
  //     html: lastSignature.html ?? undefined,
  //   }

  //   const signature: Signature = {
  //     signatures: {
  //       ...(isCommitteeSignature
  //         ? {
  //             committee: {
  //               ...signatureToSet,
  //               chairman: mapSignatureMember(
  //                 lastSignature?.chairman ?? undefined,
  //               ),
  //             },
  //           }
  //         : { regular: [signatureToSet] }),
  //     },
  //   }

  //   setValue(
  //     isCommitteeSignature
  //       ? InputFields.signature.committee
  //       : InputFields.signature.regular,
  //     signature,
  //   )
  //   updateApplication(signature, () => {
  //     refetchApplication()
  //   })
  // }

  const onTabChangeHandler = (tabId: string) => {
    setSelectedTab(tabId)

    const currentAnswers = structuredClone(application.answers)
    const newAnswers = set(
      currentAnswers,
      InputFields.misc.signatureType,
      tabId,
    )

    updateApplication(newAnswers)
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
      <FormGroup title={f(signatures.headings.preview)}>
        {/* <AdvertPreview
          advertText={getSignaturesMarkup({
            signatures: currentApplication.answers.signatures,
            type: selectedTab as SignatureTypes,
          })}
        /> */}
      </FormGroup>
    </Stack>
  )
}
