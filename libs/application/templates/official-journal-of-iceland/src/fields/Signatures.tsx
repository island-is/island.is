import { useLocale } from '@island.is/localization'
import { FormGroup } from '../components/form/FormGroup'
import { InputFields, OJOIFieldBaseProps } from '../lib/types'
import { signatures } from '../lib/messages/signatures'
import { useState } from 'react'
import {
  Box,
  Button,
  SkeletonLoader,
  Stack,
  Tabs,
  toast,
} from '@island.is/island-ui/core'
import { useApplication } from '../hooks/useUpdateApplication'
import { useLastSignatureLazy } from '../hooks/useLastSignature'
import { SignaturesTab } from '../components/signatures/SignaturesTab'
import { OfficialJournalOfIcelandApplicationSignatureType } from '@island.is/api/schema'
import { SignatureRecordSchema } from '../lib/dataSchema'
import { OJOI_INPUT_HEIGHT } from '../lib/constants'

export const SignaturesField = ({ application }: OJOIFieldBaseProps) => {
  const { formatMessage: f } = useLocale()
  const { updateApplicationV2 } = useApplication({
    applicationId: application.id,
  })

  const [selectedTab, setSelectedTab] = useState(
    application.answers?.misc?.signatureType ?? 'regular',
  )

  const [loadingTabChange, setLoadingTabChange] = useState(false)

  const [getLastSignature, { loading }] = useLastSignatureLazy({
    involvedPartyId: application.answers.advert?.involvedPartyId,
    onError: () => {
      setLoadingTabChange(false)
      toast.error(f(signatures.errors.lastSignature))
    },
    onCompleted: (data) => {
      const lastSignature =
        data.officialJournalOfIcelandApplicationInvolvedPartySignature
      const records: SignatureRecordSchema[] = lastSignature.records.map(
        (record) => ({
          institution: record.institution,
          signatureDate: record.signatureDate,
          chairman: record.chairman
            ? {
                above: record.chairman?.above ?? '',
                name: record.chairman?.name ?? '',
                after: record.chairman?.after ?? '',
                below: record.chairman?.below ?? '',
              }
            : undefined,
          additional: record?.additionalSignature ?? '',
          members: record.members.map((member) => ({
            above: member?.above ?? '',
            name: member?.name ?? '',
            after: member?.after ?? '',
            below: member?.below ?? '',
          })),
        }),
      )

      const signatureType =
        lastSignature.type ===
        OfficialJournalOfIcelandApplicationSignatureType.Regular
          ? 'regular'
          : 'committee'

      const path =
        lastSignature.type ===
        OfficialJournalOfIcelandApplicationSignatureType.Regular
          ? `${InputFields.signature.regular}.records`
          : `${InputFields.signature.committee}.records`

      updateApplicationV2({
        path: path,
        value: records,
        onComplete: () => {
          updateApplicationV2({
            path: InputFields.misc.signatureType,
            value: signatureType,
            onComplete: () => {
              setSelectedTab(signatureType)
              setLoadingTabChange(false)
            },
          })
        },
        onError: () => {
          setLoadingTabChange(false)
          toast.error(f(signatures.errors.lastSignature))
        },
      })
    },
  })

  const isLoading = loading || loadingTabChange

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
            onClick={() => {
              setLoadingTabChange(true)
              getLastSignature()
            }}
            variant="utility"
            size="small"
            icon="copy"
            iconType="outline"
          >
            {f(signatures.buttons.copyLastSignature)}
          </Button>
        </Box>
        {isLoading ? (
          <SkeletonLoader
            height={OJOI_INPUT_HEIGHT}
            repeat={5}
            borderRadius="standard"
          />
        ) : (
          <Tabs
            selected={selectedTab}
            tabs={tabs}
            label={f(signatures.general.title)}
            contentBackground="white"
            onChange={onTabChangeHandler}
          />
        )}
      </FormGroup>
    </Stack>
  )
}
