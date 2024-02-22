import { useLocale } from '@island.is/localization'
import { FormGroup } from '../components/form/FormGroup'
import { InputFields, OJOIFieldBaseProps } from '../lib/types'
import { signatures } from '../lib/messages/signatures'
import { Tabs } from '@island.is/island-ui/core'
import { CommitteeSignature } from '../components/signatures/Committee'
import { RegularSignature } from '../components/signatures/Regular'
import { useCallback, useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import { DEBOUNCE_INPUT_TIMER, INITIAL_ANSWERS } from '../lib/constants'
import debounce from 'lodash/debounce'
import { HTMLEditor } from '../components/htmlEditor/HTMLEditor'
import {
  committeeSignatureTemplate,
  regularSignatureTemplate,
} from '../components/htmlEditor/templates/signatures'
import { signatureConfig } from '../components/htmlEditor/config/signatureConfig'

type LocalState = typeof INITIAL_ANSWERS['signature']

export const Signatures = ({ application, errors }: OJOIFieldBaseProps) => {
  const { formatMessage: f, locale } = useLocale()

  const { answers } = application

  const [updateApplication] = useMutation(UPDATE_APPLICATION)

  const [selectedTab, setSelectedTab] = useState<string>(
    answers?.signature?.type ?? 'regular',
  )
  const [state, setState] = useState<LocalState>({
    type: answers?.signature?.type ?? '',
    signature: answers?.signature?.signature ?? '',
    regular: answers?.signature?.regular ?? INITIAL_ANSWERS.signature.regular,
    committee:
      answers?.signature.committee ?? INITIAL_ANSWERS.signature.committee,
    additional: answers?.signature.additional ?? '',
  })

  const updateHandler = useCallback(async () => {
    await updateApplication({
      variables: {
        locale,
        input: {
          skipValidation: true,
          id: application.id,
          answers: {
            signature: state,
          },
        },
      },
    })
  }, [application.id, locale, state, updateApplication])

  const updateState = useCallback((newState: typeof state) => {
    setState((prev) => ({ ...prev, ...newState }))
  }, [])

  const debouncedStateUpdate = debounce(updateState, DEBOUNCE_INPUT_TIMER)

  const preview =
    selectedTab === 'regular'
      ? regularSignatureTemplate({
          signatureGroups: state.regular,
          additionalSignature: state.additional,
        })
      : committeeSignatureTemplate({
          signature: state.committee,
          additionalSignature: state.additional,
        })

  useEffect(() => {
    updateHandler()
  }, [updateHandler])

  const tabs = [
    {
      id: 'regular',
      label: f(signatures.tabs.regular),
      content: (
        <RegularSignature
          state={state}
          errors={errors}
          setState={debouncedStateUpdate}
        />
      ),
    },
    {
      id: 'committee',
      label: f(signatures.tabs.committee),
      content: (
        <CommitteeSignature
          errors={errors}
          state={state}
          setState={debouncedStateUpdate}
        />
      ),
    },
  ]

  return (
    <>
      <FormGroup
        title={f(signatures.general.title)}
        intro={f(signatures.general.intro)}
      >
        <Tabs
          selected={selectedTab}
          onChange={(id) => {
            updateState({ ...state, type: id })
            setSelectedTab(id)
          }}
          tabs={tabs}
          label={f(signatures.general.title)}
        />
      </FormGroup>
      <FormGroup title={f(signatures.headings.preview)}>
        <HTMLEditor
          key={selectedTab}
          value={preview}
          config={signatureConfig}
          readOnly={true}
          name={InputFields.signature.contents}
        />
      </FormGroup>
    </>
  )
}
