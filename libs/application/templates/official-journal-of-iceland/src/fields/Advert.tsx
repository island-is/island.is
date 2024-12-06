import { InputFields, OJOIFieldBaseProps } from '../lib/types'
import { Box } from '@island.is/island-ui/core'
import { FormGroup } from '../components/form/FormGroup'
import { advert } from '../lib/messages'
import * as styles from './Advert.css'
import { useDepartments } from '../hooks/useDepartments'
import { OJOISelectController } from '../components/input/OJOISelectController'
import { useTypes } from '../hooks/useTypes'
import { OJOIInputController } from '../components/input/OJOIInputController'
import { OJOIHtmlController } from '../components/input/OJOIHtmlController'
import { useFormContext } from 'react-hook-form'
import { useApplication } from '../hooks/useUpdateApplication'
import set from 'lodash/set'
import { HTMLEditor } from '../components/htmlEditor/HTMLEditor'
import { getAdvertMarkup } from '../lib/utils'

export const Advert = ({ application }: OJOIFieldBaseProps) => {
  const { setValue } = useFormContext()
  const { application: currentApplication } = useApplication({
    applicationId: application.id,
  })
  const { departments, loading: loadingDepartments } = useDepartments()
  const {
    getLazyTypes,
    types,
    loading: loadingTypes,
  } = useTypes({
    initalDepartmentId: application.answers?.advert?.department?.id,
  })

  const titlePreview = getAdvertMarkup({
    type: currentApplication.answers.advert?.type?.title,
    title: currentApplication.answers.advert?.title,
  })

  const departmentOptions = departments?.map((d) => ({
    label: d.title,
    value: {
      id: d.id,
      title: d.title,
      slug: d.slug,
    },
  }))

  const typeOptions = types?.map((d) => ({
    label: d.title,
    value: {
      id: d.id,
      title: d.title,
      slug: d.slug,
    },
  }))

  return (
    <>
      <FormGroup>
        <Box className={styles.inputWrapper}>
          <OJOISelectController
            applicationId={application.id}
            name={InputFields.advert.department}
            label={advert.inputs.department.label}
            placeholder={advert.inputs.department.placeholder}
            loading={loadingDepartments}
            options={departmentOptions}
            defaultValue={application.answers?.advert?.department}
            onBeforeChange={(answers) => {
              setValue(InputFields.advert.type, null)
              set(answers, InputFields.advert.type, null)
            }}
            onChange={(value) =>
              getLazyTypes({
                variables: {
                  params: {
                    department: value.id,
                    pageSize: 100,
                  },
                },
              })
            }
          />
        </Box>
        <Box className={styles.inputWrapper}>
          <OJOISelectController
            applicationId={application.id}
            name={InputFields.advert.type}
            label={advert.inputs.type.label}
            placeholder={advert.inputs.type.placeholder}
            loading={loadingTypes}
            disabled={!types}
            options={typeOptions}
          />
        </Box>
        <Box>
          <OJOIInputController
            applicationId={application.id}
            name={InputFields.advert.title}
            label={advert.inputs.title.label}
            defaultValue={application.answers?.advert?.title}
            placeholder={advert.inputs.title.placeholder}
            textarea={true}
          />
        </Box>
        <Box>
          <HTMLEditor
            name="preview.title"
            config={{ toolbar: false }}
            readOnly={true}
            value={titlePreview}
          />
        </Box>
      </FormGroup>

      <FormGroup title={advert.headings.materialForPublication}>
        <Box className={styles.inputWrapper}>
          <OJOISelectController
            name={InputFields.misc.selectedTemplate}
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
            defaultValue={currentApplication.answers?.advert?.html}
            // we have use setValue from useFormContext to update the value
            // because this is not a controlled component
            onChange={(value) => setValue(InputFields.advert.html, value)}
          />
        </Box>
      </FormGroup>
    </>
  )
}
