import { getErrorViaPath } from '@island.is/application/core'
import { Box, Button } from '@island.is/island-ui/core'
import {
  InputController,
  SelectController,
} from '@island.is/shared/form-fields'
import { useEffect, useState } from 'react'
import { FormGroup } from '../../components/FromGroup/FormGroup'
import { useFormatMessage } from '../../hooks'
import { advert } from '../../lib/messages'
import { AdvertOption, InputFields, OJOIFieldBaseProps } from '../../lib/types'
import { useFormContext } from 'react-hook-form'
import { TemplateModal } from './TemplateModal'
import { HTMLEditor } from '../../components/HTMLEditor/HTMLEditor'
import { HTMLText } from '@island.is/regulations-tools/types'
import { baseConfig } from '../../components/HTMLEditor/config/baseConfig'
import { SignatureSection } from './SignatureSection'
import { FormIntro } from '../../components/FormIntro/FormIntro'
import { TypeIds } from '../../lib/constants'
import { MinistryOfJusticeAdvert } from '@island.is/api/schema'
import { useLazyQuery } from '@apollo/client'
import { TYPES } from './queries'
import { coerce } from 'yargs'

type AvertTypeResponse = {
  ministryOfJusticeTypes: AdvertOption<'types'>
}

export const Advert = ({ application, errors }: OJOIFieldBaseProps) => {
  const { answers } = application
  const { f } = useFormatMessage(application)
  const [modalToggle, setModalToggle] = useState(false)

  const [reRenderEditor, setReRenderEditor] = useState(false)

  const { setValue } = useFormContext()

  const [state, setState] = useState({
    department: answers?.case?.department ?? '',
    type: answers?.case?.type ?? '',
    subType: answers?.case?.subType ?? '',
    title: answers?.case?.title ?? '',
    template: answers?.case?.template ?? '',
    documentContents: answers?.case?.documentContents ?? '',
  })

  useEffect(() => {
    if (reRenderEditor) {
      setReRenderEditor(false)
    }
  }, [reRenderEditor])

  const setDocumentHTML = () => {
    setReRenderEditor(true)
  }

  const onSave = (advert: MinistryOfJusticeAdvert) => {
    const newState: typeof state = {
      type: advert.type.title,
      department: advert.department.title,
      documentContents: advert.document.html ?? '',
      subType: '', // TODO updated values when API is updated
      template: '',
      title: advert.title,
    }

    setValue(InputFields.case.type, newState.type, {
      shouldValidate: true,
    })
    setValue(InputFields.case.department, newState.department, {
      shouldValidate: true,
    })
    setValue(InputFields.case.documentContents, newState.documentContents, {
      shouldValidate: true,
    })
    setValue(InputFields.case.type, newState.type, {
      shouldValidate: true,
    })
    setValue(InputFields.case.template, newState.template, {
      shouldValidate: true,
    })
    setValue(InputFields.case.title, newState.title, { shouldValidate: true })

    setState(newState)
    setDocumentHTML()
    setModalToggle(false)
  }

  const { departments } = application.externalData

  const [typeOptions, setTypeOptions] = useState<AdvertOption<'types'>>()
  const [lazyTypeQuery, { refetch }] = useLazyQuery<AvertTypeResponse>(TYPES, {
    variables: {
      params: {
        department: state.department,
      },
    },
    onCompleted: (data) => {
      setTypeOptions(data.ministryOfJusticeTypes)
    },
  })

  useEffect(() => {
    if (state.department) {
      refetch({
        variables: {
          search: '',
          page: 1,
          department: state.department,
        },
      })
    }
  }, [state.department])

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
            {f(advert.buttons.copyOldCase.label)}
          </Button>
        }
      />
      <FormGroup>
        <Box width="half">
          <SelectController
            id={InputFields.case.department}
            name={InputFields.case.department}
            label={f(advert.inputs.department.label)}
            placeholder={f(advert.inputs.department.placeholder)}
            defaultValue={state.department}
            options={departments.data.departments.map((d) => ({
              label: d.title,
              value: d.slug,
            }))}
            onSelect={(opt) =>
              setState({
                ...state,
                department: opt.value,
              })
            }
            size="sm"
            error={
              errors && getErrorViaPath(errors, InputFields.case.department)
            }
          />
        </Box>
        <Box width="half">
          <SelectController
            disabled={!typeOptions}
            id={InputFields.case.type}
            name={InputFields.case.type}
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
                setValue(InputFields.case.title, title, {
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
            error={errors && getErrorViaPath(errors, InputFields.case.type)}
          />
        </Box>
        {/* {state.type === TypeIds.REGLUGERDIR && options.subCategories.length && (
          <Box width="half">
            <SelectController
              id={InputFields.case.subType}
              name={InputFields.case.subType}
              label={f(advert.inputs.subType.label)}
              placeholder={f(advert.inputs.subType.placeholder)}
              defaultValue={state.subType}
              backgroundColor="blue"
              options={options.subCategories}
              onSelect={(opt) => setState({ ...state, subType: opt.value })}
              size="sm"
              error={
                errors && getErrorViaPath(errors, InputFields.case.subType)
              }
            />
          </Box>
        )} */}
        <Box width="full">
          <InputController
            id={InputFields.case.title}
            name={InputFields.case.title}
            label={f(advert.inputs.title.label)}
            placeholder={f(advert.inputs.title.placeholder)}
            defaultValue={state.title}
            backgroundColor="blue"
            textarea
            rows={4}
            onChange={(e) => setState({ ...state, title: e.target.value })}
            error={errors && getErrorViaPath(errors, InputFields.case.title)}
          />
        </Box>
      </FormGroup>
      <FormGroup title={f(advert.materialForPublicationChapter.title)}>
        {/* <Box width="half">
          <SelectController
            id={InputFields.case.template}
            name={InputFields.case.template}
            label={f(advert.inputs.template.label)}
            placeholder={f(advert.inputs.template.placeholder)}
            defaultValue={state.template}
            backgroundColor="blue"
            options={options.templates}
            onSelect={(opt) => setState({ ...state, template: opt.value })}
            size="sm"
            error={errors && getErrorViaPath(errors, InputFields.case.template)}
          />
        </Box> */}
        {!reRenderEditor && (
          <Box width="full">
            <HTMLEditor
              config={baseConfig}
              value={state.documentContents as HTMLText}
              name={InputFields.case.documentContents}
              error={
                errors &&
                getErrorViaPath(errors, InputFields.case.documentContents)
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
