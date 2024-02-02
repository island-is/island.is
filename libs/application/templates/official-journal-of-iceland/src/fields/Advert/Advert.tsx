import { getErrorViaPath } from '@island.is/application/core'
import { Box, Button } from '@island.is/island-ui/core'
import {
  InputController,
  SelectController,
} from '@island.is/shared/form-fields'
import { useState } from 'react'
import { FormGroup } from '../../components/FromGroup/FormGroup'
import { useFormatMessage } from '../../hooks'
import { advert } from '../../lib/messages'
import { InputFields, OJOIFieldBaseProps } from '../../lib/types'
import { useFormContext } from 'react-hook-form'
import { TemplateModal } from './TemplateModal'
import { HTMLEditor } from '../../components/HTMLEditor/HTMLEditor'
import { HTMLText } from '@island.is/regulations-tools/types'
import { baseConfig } from '../../components/HTMLEditor/config/baseConfig'
import { SignatureSection } from './SignatureSection'
import { FormIntro } from '../../components/FormIntro/FormIntro'
import { CategoryIds } from '../../lib/constants'

export const Advert = ({ application, errors }: OJOIFieldBaseProps) => {
  const { answers } = application
  const { f } = useFormatMessage(application)
  const [modalToggle, setModalToggle] = useState(false)

  const { setValue } = useFormContext()

  const [state, setState] = useState({
    department: answers?.case?.department ?? '',
    category: answers?.case?.category ?? '',
    subCategory: answers?.case?.subCategory ?? '',
    title: answers?.case?.title ?? '',
    template: answers?.case?.template ?? '',
    documentContents: answers?.case?.documentContents ?? '',
    signatureType: answers?.case?.signatureType ?? 'regular',
  })

  const onSave = (template: typeof state) => {
    const newState: typeof state = {
      category: template.category ?? '',
      department: template.department ?? '',
      documentContents: template.documentContents ?? '',
      subCategory: template.subCategory ?? '',
      template: template.template ?? '',
      title: template.title ?? '',
      signatureType: template.signatureType ?? 'regular',
    }

    setValue(InputFields.case.category, newState.category, {
      shouldValidate: true,
    })
    setValue(InputFields.case.department, newState.department, {
      shouldValidate: true,
    })
    setValue(InputFields.case.documentContents, newState.documentContents, {
      shouldValidate: true,
    })
    setValue(InputFields.case.subCategory, newState.subCategory, {
      shouldValidate: true,
    })
    setValue(InputFields.case.template, newState.template, {
      shouldValidate: true,
    })
    setValue(InputFields.case.title, newState.title, { shouldValidate: true })
    setValue(InputFields.case.signatureType, newState.signatureType, {
      shouldValidate: true,
    })

    setState(newState)
    setModalToggle(false)
  }

  const { data: options } = application.externalData.options

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
            options={options.departments}
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
            id={InputFields.case.category}
            name={InputFields.case.category}
            label={f(advert.inputs.category.label)}
            placeholder={f(advert.inputs.category.placeholder)}
            defaultValue={state.category}
            backgroundColor="blue"
            options={options.categories}
            onSelect={(opt) => {
              const adverb =
                opt.value === CategoryIds.GJALDSKRA ||
                opt.value === CategoryIds.GJALDSKRA
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
                category: opt.value,
                title: state.title ? state.title : title,
              })
            }}
            size="sm"
            error={errors && getErrorViaPath(errors, InputFields.case.category)}
          />
        </Box>
        {state.category === CategoryIds.REGLUGERDIR &&
          options.subCategories.length && (
            <Box width="half">
              <SelectController
                id={InputFields.case.subCategory}
                name={InputFields.case.subCategory}
                label={f(advert.inputs.subCategory.label)}
                placeholder={f(advert.inputs.subCategory.placeholder)}
                defaultValue={state.subCategory}
                backgroundColor="blue"
                options={options.subCategories}
                onSelect={(opt) =>
                  setState({ ...state, subCategory: opt.value })
                }
                size="sm"
                error={
                  errors &&
                  getErrorViaPath(errors, InputFields.case.subCategory)
                }
              />
            </Box>
          )}
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
        <Box width="half">
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
        </Box>
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
