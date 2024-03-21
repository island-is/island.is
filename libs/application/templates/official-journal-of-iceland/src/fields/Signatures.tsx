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
import { useFormContext } from 'react-hook-form'

type LocalState = typeof INITIAL_ANSWERS['signature']

export const Signatures = ({ application, errors }: OJOIFieldBaseProps) => {
  const { formatMessage: f, locale } = useLocale()

  const { answers } = application

  const { setValue } = useFormContext()

  const [updateApplication] = useMutation(UPDATE_APPLICATION)

  const [selectedTab, setSelectedTab] = useState<string>(
    answers?.signature?.type ?? 'regular',
  )

  const [state, setState] = useState<LocalState>({
    type: answers?.signature?.type ?? 'regular',
    signature: answers?.signature?.signature ?? '',
    regular: answers?.signature?.regular ?? [
      {
        institution: '',
        date: '',
        members: [
          {
            name: '',
            above: '',
            after: '',
            below: '',
          },
        ],
      },
    ],
    committee: answers?.signature?.committee ?? {
      institution: '',
      date: '',
      chairman: {
        name: '',
        above: '',
        after: '',
        below: '',
      },
      members: [
        {
          below: '',
          name: '',
        },
      ],
    },
    additional: answers?.signature?.additional ?? '',
  })

  setValue('signature', state)

  const updateHandler = useCallback(async () => {
    await updateApplication({
      variables: {
        locale,
        input: {
          skipValidation: true,
          id: application.id,
          answers: {
            ...application.answers,
            signature: {
              type: state.type,
              signature: state.signature,
              regular: state.regular,
              committee: state.committee,
              additional: state.additional,
            },
          },
        },
      },
    })
  }, [application.answers, application.id, locale, state, updateApplication])

  const updateState = useCallback((newState: typeof state) => {
    setState((prev) => {
      return {
        ...prev,
        ...newState,
        signature:
          newState.type === 'regular'
            ? regularSignatureTemplate({
                signatureGroups: newState.regular,
                additionalSignature: newState.additional,
              })
            : committeeSignatureTemplate({
                signature: newState.committee,
                additionalSignature: newState.additional,
              }),
      }
    })
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
            setValue(InputFields.signature.type, id)
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
