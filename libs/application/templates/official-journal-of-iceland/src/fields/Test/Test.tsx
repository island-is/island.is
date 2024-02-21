import { Box, Input, Select } from '@island.is/island-ui/core'
import { InputFields, OJOIFieldBaseProps } from '../../lib/types'
import { INITIAL_ANSWERS } from '../../lib/constants'
import { useCallback, useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import { useLocale } from '@island.is/localization'

export const Test = ({ application }: OJOIFieldBaseProps) => {
  const { answers } = application

  const { locale } = useLocale()

  const [updateApplication] = useMutation(UPDATE_APPLICATION)

  const [state, setState] = useState<typeof INITIAL_ANSWERS['test']>({
    name: answers?.test?.name || '',
    department: answers?.test?.department || '',
    job: answers?.test?.job || '',
  })

  const options = [
    {
      label: 'Forritari',
      value: '1',
    },
    {
      label: 'Lögfræðingur',

      value: '2',
    },
    {
      label: 'Verkefnistjóri',
      value: '3',
    },
  ]

  const updateHandler = useCallback(async () => {
    await updateApplication({
      variables: {
        locale,
        input: {
          skipValidation: true,
          id: application.id,
          answers: {
            test: state,
          },
        },
      },
    })
  }, [application.id, locale, state, updateApplication])

  useEffect(() => {
    window.addEventListener('beforeunload', updateHandler)
    return () => {
      window.removeEventListener('beforeunload', updateHandler)
    }
  }, [])

  useEffect(() => {
    updateHandler()
  }, [updateHandler])

  return (
    <div>
      <h2>Test screen</h2>
      <Box width="half" marginBottom={3}>
        <Input
          onChange={(e) => setState({ ...state, name: e.target.value })}
          name={InputFields.test.name}
          label="Nafn"
          placeholder="Sláðu inn nafn"
          defaultValue={state.name}
        />
      </Box>
      <Box width="half" marginBottom={3}>
        <Input
          onChange={(e) => setState({ ...state, department: e.target.value })}
          name={InputFields.test.department}
          label="Deild"
          placeholder="Sláðu inn deild"
          defaultValue={state.department}
        />
      </Box>
      <Box width="half" marginBottom={3}>
        <Select
          label="Veldu starf"
          placeholder="Veldu starf"
          options={options}
          defaultValue={options.find((opt) => opt.value === state.job)}
          onChange={(opt) => {
            if (!opt) return
            setState({ ...state, job: opt.value })
          }}
        />
      </Box>
    </div>
  )
}
