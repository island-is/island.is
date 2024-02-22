import { getErrorViaPath } from '@island.is/application/core'
import { Box, Button } from '@island.is/island-ui/core'
import { useEffect, useState } from 'react'
import { FormGroup } from '../../components/form/FormGroup'
import { useFormatMessage } from '../../hooks'
import { advert } from '../../lib/messages'
import { AdvertOption, InputFields, OJOIFieldBaseProps } from '../../lib/types'
import { TemplateModal } from './TemplateModal'
import { HTMLEditor } from '../../components/htmlEditor/HTMLEditor'
import { HTMLText } from '@island.is/regulations-tools/types'
import { baseConfig } from '../../components/htmlEditor/config/baseConfig'
import { SignatureSection } from './SignatureSection'
import { FormIntro } from '../../components/form/FormIntro'
import { MinistryOfJusticeAdvert } from '@island.is/api/schema'
import { useLazyQuery, useQuery } from '@apollo/client'
import { TYPES_QUERY } from '../../graphql/queries'
import { CustomInputController } from '../../components/controllers/CustomInputController'
import { CustomSelectController } from '../../components/controllers/CustomSelectController'

type AvertTypeResponse = {
  ministryOfJusticeTypes: AdvertOption<'types'>
}

export const Advert = ({
  application,
  errors,
  refetch,
}: OJOIFieldBaseProps) => {
  const { f } = useFormatMessage(application)

  const [modalToggle, setModalToggle] = useState(false)
  const [reRenderEditor, setReRenderEditor] = useState(false)

  const { answers } = application
  const { departments } = application.externalData

  useEffect(() => {
    if (reRenderEditor) {
      setReRenderEditor(false)
    }
  }, [reRenderEditor])

  const setDocumentHTML = () => {
    setReRenderEditor(true)
  }

  const onSave = (advert: MinistryOfJusticeAdvert) => {
    setModalToggle(false)
    setDocumentHTML()
  }

  const { data: typeOptions } = useQuery<AvertTypeResponse>(TYPES_QUERY, {
    variables: {
      params: {
        search: '',
        page: '1',
        department: answers.advert?.department,
      },
    },
  })

  return (
    <>
      <FormIntro
        title={f(advert.general.formTitle)}
        intro={f(advert.general.formIntro)}
        button={
          <Button
            variant="utility"
            iconType="outline"
            icon="copy"
            onClick={() => setModalToggle((prev) => !prev)}
          >
            {f(advert.buttons.copyOldAdvert.label)}
          </Button>
        }
      />
      <FormGroup>
        <Box width="half">
          <CustomSelectController
            // shouldRefetch
            application={application}
            name={InputFields.advert.department}
            label={f(advert.inputs.department.label)}
            placeholder={f(advert.inputs.department.placeholder)}
            defaultValue={answers.advert?.department}
            options={departments.data.departments.map((d) => ({
              label: d.title,
              value: d.id,
            }))}
            errorMessage={
              errors && getErrorViaPath(errors, InputFields.advert.department)
            }
          />
        </Box>
        {typeOptions && (
          <Box width="half">
            {/* <CustomSelectController
              application={application}
              name={InputFields.advert.type}
              label={f(advert.inputs.type.label)}
              placeholder={f(advert.inputs.type.placeholder)}
              options={typeOptions.ministryOfJusticeTypes.types.map((t) => ({
                label: t.title,
                value: t.id,
              }))}
            /> */}
          </Box>
        )}
        {/* <SelectController
            // internalKey={typeInternalKey}
            disabled={!typeOptions}
            id={InputFields.advert.type}
            name={InputFields.advert.type}
            label={f(advert.inputs.type.label)}
            placeholder={f(advert.inputs.type.placeholder)}
            defaultValue={state.type}
            backgroundColor="blue"
            options={typeOptions?.types.map((t) => ({
              label: t.title,
              value: t.id,
            }))}
            onSelect={(opt) => {
              const adverb =
                opt.value === TypeIds.GJALDSKRA ||
                opt.value === TypeIds.GJALDSKRA
                  ? 'fyrir'
                  : 'um'
              const title = `${opt.label.toUpperCase()} ${adverb}`
              if (state.title === '') {
                setValue(InputFields.advert.title, title, {
                  shouldValidate: true,
                })
              }
              setState({
                ...state,
                type: opt.value,
                title: state.title ? state.title : title,
              })
            }}
            size="sm"
            error={errors && getErrorViaPath(errors, InputFields.advert.type)}
          /> */}
        <Box width="full">
          <CustomInputController
            application={application}
            name={InputFields.advert.title}
            label={f(advert.inputs.title.label)}
            placeholder={f(advert.inputs.title.placeholder)}
            defaultValue={answers?.advert?.title ?? ''}
            textarea
          />
        </Box>
        <Box width="full">
          <CustomInputController
            application={application}
            name={InputFields.advert.template}
            label={f(advert.inputs.template.label)}
            placeholder={f(advert.inputs.template.placeholder)}
            defaultValue={answers?.advert?.template ?? ''}
            textarea
          />
        </Box>
      </FormGroup>
      <FormGroup title={f(advert.materialForPublicationChapter.title)}>
        {!reRenderEditor && (
          <Box width="full">
            <HTMLEditor
              config={baseConfig}
              value={answers.advert?.document as HTMLText}
              name={InputFields.advert.documentContents}
              error={
                errors &&
                getErrorViaPath(errors, InputFields.advert.documentContents)
              }
            />
          </Box>
        )}
      </FormGroup>
      <SignatureSection application={application} errors={errors} />
      <TemplateModal
        visible={modalToggle}
        onClose={() => setModalToggle(false)}
        onSave={onSave}
      />
    </>
  )
}

export default Advert
