import { getErrorViaPath } from '@island.is/application/core'
import { Box, Button, Text } from '@island.is/island-ui/core'
import {
  InputController,
  SelectController,
} from '@island.is/shared/form-fields'
import { useState } from 'react'
import { FormWrap } from '../../components/FormWrap/FormWrap'
import { FormGroup } from '../../components/FromGroup/FormGroup'
import { useFormatMessage } from '../../hooks'
import { newCase } from '../../lib/messages'
import { InputFields, OJOIFieldBaseProps } from '../../lib/types'
export const NewCase = ({ application, errors }: OJOIFieldBaseProps) => {
  const { answers } = application
  const { f } = useFormatMessage(application)
  const [modalToggle, setModalToggle] = useState(false)

  const [state, setState] = useState({
    department: answers?.case?.department ?? '',
    category: answers?.case?.category ?? '',
    title: answers?.case?.title ?? '',
    template: answers?.case?.template ?? '',
    documentContents: answers?.case?.documentContents ?? '',
    signatureType: answers?.case?.signatureType ?? '',
    signatureContents: answers?.case?.signatureContents ?? '',
  })

  const { data: options } = application.externalData.options

  // setBeforeSubmitCallback &&
  //   setBeforeSubmitCallback(async () => {
  //     await updateApplication({
  //       variables: {
  //         locale,
  //         input: {
  //           id: application.id,
  //           answers: {
  //             ...application.answers,
  //             case: {
  //               ...state,
  //             },
  //           },
  //         },
  //       },
  //     }).catch(() => {
  //       return [false, f(error.dataSubmissionErrorTitle)]
  //     })
  //     return [true, null]
  //   })

  return (
    <>
      <FormWrap
        header={{
          children: (
            <Text variant="h2" as="h1">
              {f(newCase.general.formTitle)}
            </Text>
          ),
          button: (
            <Button
              variant="utility"
              iconType="outline"
              icon="copy"
              onClick={() => setModalToggle((prev) => !prev)}
            >
              {f(newCase.buttons.copyOldCase.label)}
            </Button>
          ),
        }}
      >
        <Text marginBottom={4}>{f(newCase.general.formIntro)}</Text>
        <FormGroup>
          <Box width="half">
            <SelectController
              id={InputFields.case.department}
              name={InputFields.case.department}
              label={f(newCase.inputs.department.label)}
              placeholder={f(newCase.inputs.department.placeholder)}
              defaultValue={state.department}
              options={options.departments}
              onSelect={(opt) => setState({ ...state, department: opt.value })}
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
              label={f(newCase.inputs.publishingType.label)}
              placeholder={f(newCase.inputs.publishingType.placeholder)}
              defaultValue={state.department}
              backgroundColor="blue"
              options={options.categories}
              onSelect={(opt) => setState({ ...state, category: opt.value })}
              size="sm"
              error={
                errors && getErrorViaPath(errors, InputFields.case.category)
              }
            />
          </Box>
          <Box width="full">
            <InputController
              id={InputFields.case.title}
              name={InputFields.case.title}
              label={f(newCase.inputs.nameOfCase.label)}
              placeholder={f(newCase.inputs.nameOfCase.placeholder)}
              defaultValue={state.title}
              backgroundColor="blue"
              textarea
              rows={4}
              onChange={(e) => setState({ ...state, title: e.target.value })}
              error={errors && getErrorViaPath(errors, InputFields.case.title)}
            />
          </Box>
        </FormGroup>
        <FormGroup title={f(newCase.materialForPublicationChapter.title)}>
          <Box width="half">
            <SelectController
              id={InputFields.case.template}
              name={InputFields.case.template}
              label={f(newCase.inputs.template.label)}
              placeholder={f(newCase.inputs.template.placeholder)}
              defaultValue={state.template}
              backgroundColor="blue"
              options={options.templates}
              onSelect={(opt) => setState({ ...state, template: opt.value })}
              size="sm"
              error={
                errors && getErrorViaPath(errors, InputFields.case.template)
              }
            />
          </Box>
          <Box width="full">
            <InputController
              id={InputFields.case.documentContents}
              name={InputFields.case.documentContents}
              defaultValue={state.documentContents}
              backgroundColor="blue"
              textarea
              rows={4}
              onChange={(e) =>
                setState({ ...state, documentContents: e.target.value })
              }
              error={
                errors &&
                getErrorViaPath(errors, InputFields.case.documentContents)
              }
            />
          </Box>
        </FormGroup>
        <FormGroup
          title={f(newCase.signatureChapter.title)}
          description={f(newCase.signatureChapter.intro)}
        >
          <Box
            display="flex"
            justifyContent="spaceBetween"
            alignItems="flexEnd"
            width="full"
          >
            <Box width="half">
              <SelectController
                id={InputFields.case.signatureType}
                name={InputFields.case.signatureType}
                label={f(newCase.inputs.signatureType.label)}
                placeholder={f(newCase.inputs.signatureType.placeholder)}
                defaultValue={state.signatureType}
                options={options.signatureTypes}
                onSelect={(opt) =>
                  setState({ ...state, signatureType: opt.value })
                }
                size="sm"
                error={
                  errors &&
                  getErrorViaPath(errors, InputFields.case.signatureType)
                }
              />
            </Box>
            <Box>
              <Button
                onClick={() => console.log('fetch old signatures')}
                variant="text"
                size="small"
                icon="reload"
                iconType="outline"
              >
                {f(newCase.buttons.copyLastSignature.label)}
              </Button>
            </Box>
          </Box>
          <Box width="full">
            <InputController
              id={InputFields.case.signatureContents}
              name={InputFields.case.signatureContents}
              defaultValue={state.signatureContents}
              backgroundColor="blue"
              textarea
              rows={4}
              onChange={(e) =>
                setState({ ...state, signatureContents: e.target.value })
              }
              error={
                errors &&
                getErrorViaPath(errors, InputFields.case.signatureContents)
              }
            />
          </Box>
        </FormGroup>
      </FormWrap>
      {/* <TemplateModal
        visible={modalToggle}
        onVisibilityChange={(visible) => setModalToggle(visible)}
        onClose={() => setModalToggle(false)}
        selectedTemplateId={selectedTemplateId}
        onSelectChange={(id) => setSelectedTemplateId(id)}
        onSave={(template) => {
          setState({ ...state, ...template })
          setModalToggle(false)
        }}
      /> */}
    </>
  )
}

export default NewCase
