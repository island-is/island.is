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
import { OJOIInputController } from '../components/input/OJOIInputController'
import { OJOIHtmlController } from '../components/input/OJOIHtmlController'

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
    <>
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
        <Box>
          <OJOIInputController
            applicationId={application.id}
            name={InputFields.advert.title}
            label={advert.inputs.title.label}
            defaultValue={application.answers.advert.title}
            placeholder={advert.inputs.title.placeholder}
            textarea={true}
          />
        </Box>
      </FormGroup>

      <FormGroup title={advert.headings.materialForPublication}>
        <Box className={styles.inputWrapper}>
          <OJOISelectController
            name={'other.template'}
            label={advert.inputs.template.label}
            placeholder={advert.inputs.template.placeholder}
            applicationId={application.id}
            disabled={true}
          />
        </Box>
        <Box>
          <OJOIHtmlController
            applicationId={application.id}
            name={InputFields.advert.html}
            defaultValue={application.answers.advert.html}
          />
        </Box>
      </FormGroup>
    </>
  )
}
