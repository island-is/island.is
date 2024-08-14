import { useMutation, useLazyQuery } from '@apollo/client'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import { useLocale } from '@island.is/localization'
import { useCallback, useEffect, useState } from 'react'
import { ADVERT_QUERY, TYPES_QUERY } from '../graphql/queries'
import {
  InputFields,
  OfficialJournalOfIcelandGraphqlResponse,
  OJOIFieldBaseProps,
} from '../lib/types'
import { Box, SkeletonLoader } from '@island.is/island-ui/core'
import { FormGroup } from '../components/form/FormGroup'
import { advert } from '../lib/messages'
import debounce from 'lodash/debounce'
import { HTMLText } from '@island.is/regulations-tools/types'
import { getErrorViaPath } from '@island.is/application/core'
import {
  InputController,
  SelectController,
} from '@island.is/shared/form-fields'
import { HTMLEditor } from '../components/htmlEditor/HTMLEditor'
import { OfficialJournalOfIcelandAdvert } from '@island.is/api/schema'
import { useFormContext } from 'react-hook-form'
import * as styles from './Advert.css'
import { useDepartments } from '../hooks/useDepartments'
import { OJOISelectController } from '../components/input/OJOISelectController'
import { useTypes } from '../hooks/useTypes'

type TypeResonse = OfficialJournalOfIcelandGraphqlResponse<'types'>

type SelectedAdvertResponse = OfficialJournalOfIcelandGraphqlResponse<
  'advert',
  OfficialJournalOfIcelandAdvert
>

export const Advert = ({ application }: OJOIFieldBaseProps) => {
  const { departments, loading: loadingDepartments } = useDepartments()
  const {
    useLazyTypes,
    types,
    loading: loadingTypes,
  } = useTypes({ initalDepartmentId: application.answers.advert.departmentId })

  // const { answers, externalData } = application

  // const departments = externalData.departments.data.departments
  //   .map((d) => {
  //     return {
  //       slug: d.slug,
  //       label: d.title,
  //       value: d.id,
  //     }
  //   })
  //   .filter((d) => d.slug !== 'tolublod')

  // const { setValue } = useFormContext()

  // const [updateApplication] = useMutation(UPDATE_APPLICATION)
  // const [lazyTypesQuery, { loading: loadingTypes }] =
  //   useLazyQuery<TypeResonse>(TYPES_QUERY)

  // const [lazyAdvertQuery, { loading: loadingAdvert }] =
  //   useLazyQuery<SelectedAdvertResponse>(ADVERT_QUERY)

  // const [types, setTypes] = useState<{ label: string; value: string }[]>([])

  // const updateHandler = useCallback(async () => {
  //   await updateApplication({
  //     variables: {
  //       locale,
  //       input: {
  //         id: application.id,
  //         answers: {
  //           ...application.answers,
  //           advert: state,
  //         },
  //       },
  //     },
  //   })
  // }, [application.answers, application.id, locale, updateApplication])

  // if (loadingAdvert) {
  //   return (
  //     <SkeletonLoader
  //       space={2}
  //       repeat={5}
  //       borderRadius="standard"
  //       display="block"
  //       height={inputHeight}
  //     />
  //   )
  // }

  const [localTypeId, setLocalTypeId] = useState<string | undefined>(
    application.answers.advert.typeId,
  )
  const handleDepartmentChange = useCallback(
    (value: string) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useLazyTypes({
        params: {
          department: value,
          pageSize: 100,
        },
      })
      setLocalTypeId(undefined)
    },
    [useLazyTypes],
  )

  return (
    <FormGroup>
      <Box className={styles.inputWrapper}>
        <OJOISelectController
          applicationId={application.id}
          name={InputFields.advert.departmentId}
          label={advert.inputs.department.label}
          placeholder={advert.inputs.department.placeholder}
          loading={loadingDepartments}
          options={departments?.map((d) => ({
            label: d.title,
            value: d.id,
          }))}
          onChange={(value) => handleDepartmentChange(value)}
        />
      </Box>
      <Box className={styles.inputWrapper}>
        <OJOISelectController
          applicationId={application.id}
          name={InputFields.advert.typeId}
          label={advert.inputs.type.label}
          placeholder={advert.inputs.type.placeholder}
          loading={loadingTypes}
          disabled={!types}
          defaultValue={localTypeId}
          options={types?.map((d) => ({
            label: d.title,
            value: d.id,
          }))}
          onChange={(value) => setLocalTypeId(value)}
        />
      </Box>
      {/*
        <Box className={styles.inputWrapper}>
          <SelectController
            key={state.department}
            id={InputFields.advert.department}
            name={InputFields.advert.department}
            label={f(advert.inputs.department.label)}
            placeholder={f(advert.inputs.department.placeholder)}
            options={departments}
            defaultValue={state.department}
            size="sm"
            backgroundColor="blue"
            onSelect={(opt) => {
              return setState((prev) => ({
                ...prev,
                department: opt.value,
                type: '',
              }))
            }}
            error={
              errors && getErrorViaPath(errors, InputFields.advert.department)
            }
          />
        </Box>
        {loadingTypes ? (
          <Box className={styles.inputWrapper}>
            <SkeletonLoader
              borderRadius="standard"
              display="block"
              height={inputHeight}
            />
          </Box>
        ) : (
          <Box className={styles.inputWrapper}>
            <SelectController
              id={InputFields.advert.type}
              name={InputFields.advert.type}
              label={f(advert.inputs.type.label)}
              placeholder={f(advert.inputs.type.placeholder)}
              options={types}
              defaultValue={state.type}
              size="sm"
              backgroundColor="blue"
              onSelect={(opt) =>
                setState((prev) => ({ ...prev, type: opt.value }))
              }
              error={errors && getErrorViaPath(errors, InputFields.advert.type)}
            />
          </Box>
        )}
        <Box>
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
        <Box className={styles.inputWrapper}>
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
        <Box>
          <HTMLEditor
            title={f(advert.inputs.editor.label)}
            name={InputFields.advert.document}
            value={state.document as HTMLText}
            onChange={(value) => setState({ ...state, document: value })}
            error={
              errors && getErrorViaPath(errors, InputFields.advert.document)
            }
          />
        </Box>
        */}
    </FormGroup>
  )
}
