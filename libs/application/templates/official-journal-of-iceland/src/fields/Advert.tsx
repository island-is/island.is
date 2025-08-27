import { InputFields, OJOIFieldBaseProps } from '../lib/types'
import { SkeletonLoader, Stack } from '@island.is/island-ui/core'
import { FormGroup } from '../components/form/FormGroup'
import { advert } from '../lib/messages'
import { useDepartments } from '../hooks/useDepartments'
import { OJOISelectController } from '../components/input/OJOISelectController'
import { useTypes } from '../hooks/useTypes'
import { OJOIInputController } from '../components/input/OJOIInputController'
import { OJOIHtmlController } from '../components/input/OJOIHtmlController'
import { useFormContext } from 'react-hook-form'
import { useApplication } from '../hooks/useUpdateApplication'
import set from 'lodash/set'
import { capitalizeText, cleanTypename } from '../lib/utils'
import { DEPARTMENT_A, DEPARTMENT_B, OJOI_INPUT_HEIGHT } from '../lib/constants'
import { useAdvertTemplateTypes } from '../hooks/useAdvertTemplateTypes'
import { useAdvertTemplateLazy } from '../hooks/useAdvertTemplate'
import { useMemo, useState } from 'react'
import { uuid } from 'uuidv4'
import { AdvertPreview } from '../components/advertPreview/AdvertPreview'

export const Advert = ({ application }: OJOIFieldBaseProps) => {
  const { setValue } = useFormContext()
  const [isLoadingDepartments, setLoadingDepartments] = useState(false)
  const {
    application: currentApplication,
    updateApplication,
    updateApplicationV2,
  } = useApplication({
    applicationId: application.id,
  })

  const [advertHtmlEditorKey, setAdvertHtmlEditorKey] = useState(
    'advert-html-content',
  )

  const { departments, loading: loadingDepartments } = useDepartments({
    onCompleted: (data) => {
      if (application.answers.advert?.department) return
      setLoadingDepartments(true)
      const departmentB =
        data.officialJournalOfIcelandDepartments.departments.find(
          (d) => d.slug === DEPARTMENT_B,
        )

      updateApplicationV2({
        path: InputFields.advert.department,
        value: departmentB,
        onComplete: () => {
          setLoadingDepartments(false)
          if (!departmentB) return
          getLazyMainTypes({
            variables: {
              params: {
                department: departmentB.id,
                pageSize: 100,
              },
            },
          })
        },
        onError: () => {
          setLoadingDepartments(false)
        },
      })
    },
  })
  const { templateTypes, loading: advertTemplateLoading } =
    useAdvertTemplateTypes()

  const [advertTemplateQuery] = useAdvertTemplateLazy((data) => {
    const currentAnswers = structuredClone(currentApplication.answers)
    const html = Buffer.from(
      data.officialJournalOfIcelandApplicationAdvertTemplate.html,
    ).toString('base64')
    const updatedAnswers = set(currentAnswers, InputFields.advert.html, html)
    setValue(InputFields.advert.html, html)
    updateApplication(updatedAnswers, () => setAdvertHtmlEditorKey(uuid()))
  })

  const defaultDepartment =
    application.answers?.advert?.department?.id || DEPARTMENT_A

  const { getLazyMainTypes, mainTypes, mainTypeLoading } = useTypes({
    initalDepartmentId: defaultDepartment,
    pageSize: 300,
  })
  const departmentOptions = departments?.map((d) => ({
    label: d.title,
    value: {
      id: d.id,
      title: d.title,
      slug: d.slug,
    },
  }))

  const mainTypeOptions = mainTypes?.map((d) => ({
    label: capitalizeText(d.title),
    value: d,
  }))

  const currentTypes =
    currentApplication?.answers?.advert?.mainType?.types?.map((d) => ({
      label: capitalizeText(d.title),
      value: d,
    })) ?? []

  const templateOptions = useMemo(
    () =>
      templateTypes?.map((tt) => ({
        label: tt.title,
        value: tt.type,
      })) ?? [],
    [templateTypes],
  )

  return (
    <Stack space={[2, 2, 3]}>
      <FormGroup>
        <Stack space={[2, 2, 3]}>
          {isLoadingDepartments ? (
            <SkeletonLoader height={OJOI_INPUT_HEIGHT} borderRadius="large" />
          ) : (
            <OJOISelectController
              width="half"
              applicationId={application.id}
              name={InputFields.advert.department}
              label={advert.inputs.department.label}
              placeholder={advert.inputs.department.placeholder}
              loading={loadingDepartments || isLoadingDepartments}
              options={departmentOptions}
              defaultValue={application.answers?.advert?.department}
              onBeforeChange={() => {
                updateApplicationV2({
                  path: InputFields.advert.type,
                  value: null,
                })
              }}
              onChange={(value) =>
                getLazyMainTypes({
                  variables: {
                    params: {
                      department: value.id,
                      pageSize: 100,
                    },
                  },
                })
              }
            />
          )}

          <OJOISelectController
            controller={true}
            width="half"
            applicationId={application.id}
            name={InputFields.advert.mainType}
            label={advert.inputs.mainType.label}
            placeholder={advert.inputs.mainType.placeholder}
            loading={mainTypeLoading}
            options={mainTypeOptions}
            onBeforeChange={(answers, value) => {
              const typeValue =
                value.types.length === 1 ? cleanTypename(value.types[0]) : null
              set(answers, InputFields.advert.type, typeValue)
              setValue(InputFields.advert.type, typeValue)
            }}
          />

          {currentTypes.length > 1 && (
            <OJOISelectController
              width="half"
              applicationId={application.id}
              name={InputFields.advert.type}
              label={advert.inputs.type.label}
              placeholder={advert.inputs.type.placeholder}
              options={currentTypes}
            />
          )}

          <OJOIInputController
            applicationId={application.id}
            name={InputFields.advert.title}
            label={advert.inputs.title.label}
            defaultValue={application.answers?.advert?.title}
            placeholder={advert.inputs.title.placeholder}
            textarea={true}
            maxLength={1000}
          />

          <AdvertPreview
            advertType={currentApplication.answers.advert?.type?.title}
            advertSubject={currentApplication.answers.advert?.title}
          />
        </Stack>
      </FormGroup>

      <FormGroup title={advert.headings.materialForPublication}>
        <Stack space={[2, 2, 3]}>
          <OJOISelectController
            width="half"
            name={InputFields.misc.selectedTemplate}
            label={advert.inputs.template.label}
            placeholder={advert.inputs.template.placeholder}
            applicationId={application.id}
            options={templateOptions}
            loading={advertTemplateLoading}
            onChange={(type) => {
              advertTemplateQuery({ variables: { params: { type: type } } })
            }}
          />

          <OJOIHtmlController
            applicationId={application.id}
            name={InputFields.advert.html}
            defaultValue={currentApplication.answers?.advert?.html}
            key={advertHtmlEditorKey}
            // we have use setValue from useFormContext to update the value
            // because this is not a controlled component
            onChange={(value) => {
              setValue(InputFields.advert.html, value)
            }}
          />
        </Stack>
      </FormGroup>
    </Stack>
  )
}
