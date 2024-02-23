import { useMutation, useLazyQuery } from '@apollo/client'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import { useLocale } from '@island.is/localization'
import { useCallback, useEffect, useState } from 'react'
import { TYPES_QUERY } from '../graphql/queries'
import { DEBOUNCE_INPUT_TIMER, INITIAL_ANSWERS } from '../lib/constants'
import {
  InputFields,
  MinistryOfJusticeGraphqlResponse,
  OJOIFieldBaseProps,
} from '../lib/types'
import { Box, SkeletonLoader } from '@island.is/island-ui/core'
import { FormGroup } from '../components/form/FormGroup'
import { advert } from '../lib/messages'
import debounce from 'lodash/debounce'
import { HTMLEditor } from '../components/htmlEditor/HTMLEditor'
import { HTMLText } from '@island.is/regulations-tools/types'
import { getErrorViaPath } from '@island.is/application/core'
import {
  InputController,
  SelectController,
} from '@island.is/shared/form-fields'

type LocalState = typeof INITIAL_ANSWERS['advert']
type TypeResonse = MinistryOfJusticeGraphqlResponse<'types'>

export const Advert = ({ application, errors }: OJOIFieldBaseProps) => {
  const { formatMessage: f, locale } = useLocale()
  const { answers, externalData } = application

  const inputHeight = 64

  const departments = externalData.departments.data.departments.map((d) => {
    return {
      label: d.title,
      value: d.id,
    }
  })

  const [updateApplication] = useMutation(UPDATE_APPLICATION)
  const [lazyTypesQuery, { loading: loadingTypes }] =
    useLazyQuery<TypeResonse>(TYPES_QUERY)

  const [types, setTypes] = useState<{ label: string; value: string }[]>([])

  const [state, setState] = useState<LocalState>({
    department: answers.advert?.department ?? '',
    type: answers.advert?.type ?? '',
    title: answers.advert?.title ?? '',
    document: answers.advert?.document ?? '',
    subType: answers.advert?.subType ?? '',
    template: answers.advert?.template ?? '',
  })

  const updateState = useCallback((newState: typeof state) => {
    setState((prev) => ({ ...prev, ...newState }))
  }, [])

  const updateHandler = useCallback(async () => {
    await updateApplication({
      variables: {
        locale,
        input: {
          skipValidation: true,
          id: application.id,
          answers: {
            advert: state,
          },
        },
      },
    })
  }, [application.id, locale, state, updateApplication])

  useEffect(() => {
    updateHandler()
  }, [updateHandler])

  const debouncedStateUpdate = debounce(updateState, DEBOUNCE_INPUT_TIMER)

  useEffect(() => {
    const fetchTypes = async () => {
      await lazyTypesQuery({
        variables: {
          params: {
            search: '',
            page: '1',
            department: state.department,
          },
        },
        onCompleted: (data) =>
          setTypes(
            data.ministryOfJusticeTypes.types.map((t) => ({
              label: t.title,
              value: t.id,
            })),
          ),
      })
    }

    fetchTypes()
  }, [lazyTypesQuery, state.department])

  return (
    <>
      <FormGroup>
        <Box width="half">
          <SelectController
            id={InputFields.advert.department}
            name={InputFields.advert.department}
            label={f(advert.inputs.department.label)}
            placeholder={f(advert.inputs.department.placeholder)}
            options={departments}
            defaultValue={state.department}
            size="sm"
            backgroundColor="blue"
            onSelect={(opt) =>
              setState((prev) => ({ ...prev, department: opt.value, type: '' }))
            }
            error={
              errors && getErrorViaPath(errors, InputFields.advert.department)
            }
          />
        </Box>
        {loadingTypes ? (
          <Box width="half">
            <SkeletonLoader
              borderRadius="standard"
              display="block"
              height={inputHeight}
            />
          </Box>
        ) : (
          <Box width="half">
            <SelectController
              id={InputFields.advert.type}
              name={InputFields.advert.type}
              label={f(advert.inputs.type.label)}
              placeholder={f(advert.inputs.type.placeholder)}
              options={types}
              defaultValue={state.type}
              size="sm"
              backgroundColor="blue"
              onSelect={(opt) => setState((prev) => ({ ...prev, type: '' }))}
              error={errors && getErrorViaPath(errors, InputFields.advert.type)}
            />
          </Box>
        )}
        <Box width="full">
          <InputController
            id={InputFields.advert.title}
            name={InputFields.advert.title}
            label={f(advert.inputs.title.label)}
            placeholder={f(advert.inputs.title.placeholder)}
            defaultValue={state.title}
            size="sm"
            textarea
            rows={4}
            backgroundColor="blue"
            onChange={(e) =>
              debouncedStateUpdate({ ...state, title: e.target.value })
            }
            error={errors && getErrorViaPath(errors, InputFields.advert.title)}
          />
        </Box>
      </FormGroup>
      <FormGroup title={f(advert.headings.materialForPublication)}>
        <Box width="half">
          <InputController
            id={InputFields.advert.template}
            name={InputFields.advert.template}
            label={f(advert.inputs.template.label)}
            placeholder={f(advert.inputs.template.placeholder)}
            defaultValue={state.template}
            size="sm"
            backgroundColor="blue"
            onChange={(e) =>
              debouncedStateUpdate({
                ...state,
                template: e.target.value,
              })
            }
            error={
              errors && getErrorViaPath(errors, InputFields.advert.template)
            }
          />
        </Box>
        <Box width="full">
          <HTMLEditor
            name={InputFields.advert.document}
            value={state.document as HTMLText}
            onChange={(value) => setState({ ...state, document: value })}
            error={
              errors && getErrorViaPath(errors, InputFields.advert.document)
            }
          />
        </Box>
      </FormGroup>
    </>
  )
}
