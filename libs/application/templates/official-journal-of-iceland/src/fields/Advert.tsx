import { useCallback, useState } from 'react'
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

type Props = OJOIFieldBaseProps & {
  timeStamp: string
}

export const Advert = ({ application, timeStamp }: Props) => {
  const { setValue } = useFormContext()
  const { application: currentApplication } = useApplication({
    applicationId: application.id,
  })
  const { departments, loading: loadingDepartments } = useDepartments()
  const {
    useLazyTypes,
    types,
    loading: loadingTypes,
  } = useTypes({
    initalDepartmentId: application.answers?.advert?.departmentId,
  })

  const [localTypeId, setLocalTypeId] = useState<string | undefined>(
    application.answers?.advert?.typeId,
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
            defaultValue={application.answers?.advert?.title}
            placeholder={advert.inputs.title.placeholder}
            textarea={true}
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
            editorKey={timeStamp}
            // we have use setValue from useFormContext to update the value
            // because this is not a controlled component
            onChange={(value) => setValue(InputFields.advert.html, value)}
          />
        </Box>
      </FormGroup>
    </>
  )
}
