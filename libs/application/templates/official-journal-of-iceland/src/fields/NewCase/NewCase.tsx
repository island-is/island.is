import { Box, Button, Input, Select, Text } from '@island.is/island-ui/core'

import { useMutation } from '@apollo/client'
import { MinistryOfJusticeCase } from '@island.is/api/schema'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import { SelectController } from '@island.is/shared/form-fields'
import { isDefined } from '@island.is/shared/utils'
import { useEffect, useState } from 'react'
import { FormWrap } from '../../components/FormWrap/FormWrap'
import { FormGroup } from '../../components/FromGroup/FormGroup'
import { useFormatMessage } from '../../hooks'
import { newCase as m } from '../../lib/messages'
import { OJOIFieldBaseProps } from '../../lib/types'
import { TemplateModal } from './TemplateModal'
export const NewCase = ({ application }: OJOIFieldBaseProps) => {
  const { f, locale } = useFormatMessage(application)
  const [toggle, setToggle] = useState(false)

  const [selectedTemplateId, setSelectedTemplateId] =
    useState<MinistryOfJusticeCase['applicationId']>()

  const [updateApplication] = useMutation(UPDATE_APPLICATION)
  const { departments, categories, subCategories, signatureTypes, templates } =
    application.externalData.options.data

  const catOptions = categories
    .map((category) => ({
      label: category as string,
      value: category as string,
    }))
    .filter(isDefined)

  const subCatOptions = subCategories
    .map((subCategory) => ({
      label: subCategory as string,
      value: subCategory as string,
    }))
    .filter(isDefined)

  const departmentOptions = departments
    .map((department) => ({
      label: department as string,
      value: department as string,
    }))
    .filter(isDefined)

  const signatureTypeOptions = signatureTypes
    .map((signatureType) => ({
      label: signatureType as string,
      value: signatureType as string,
    }))
    .filter(isDefined)

  const templateOptions = templates
    .map((template) => ({
      label: template as string,
      value: template as string,
    }))
    .filter(isDefined)

  const [newCase, setNewCase] = useState<MinistryOfJusticeCase>({
    applicationId: application.id,
    department: departments?.[0],
    category: categories?.[0],
    subCategory: subCategories?.[0],
    title: '',
    template: undefined,
    documentContents: '',
    signatureType: undefined,
    signatureContents: '',
    signatureDate: '',
    ministry: '',
    preferedPublicationDate: '',
    fastTrack: false,
  })

  useEffect(() => {
    const updateAnswers = async () => {
      const res = await updateApplication({
        variables: {
          input: {
            id: application.id,
            answers: {
              ...application.answers,
              case: newCase,
            },
          },
          locale,
        },
      })

      if (!res) {
        return [false, 'Could not update application']
      }

      return [true, null]
    }
    updateAnswers()
  }, [newCase])

  return (
    <>
      <FormWrap
        header={{
          children: (
            <Text variant="h2" as="h1">
              {f(m.general.formTitle)}
            </Text>
          ),
          button: (
            <Button
              variant="utility"
              iconType="outline"
              icon="copy"
              onClick={() => setToggle((prev) => !prev)}
            >
              {f(m.buttons.copyOldCase.label)}
            </Button>
          ),
        }}
      >
        <Text marginBottom={4}>{f(m.general.formIntro)}</Text>
        <FormGroup>
          <Box width="half">
            <SelectController
              size="sm"
              id="department"
              name="department"
              disabled={departments?.length === 1}
              placeholder={f(m.inputs.department.placeholder)}
              label={f(m.inputs.department.label)}
              options={departmentOptions}
              defaultValue={newCase.department}
              onSelect={(value) =>
                setNewCase({
                  ...newCase,
                  department:
                    value.value as MinistryOfJusticeCase['department'],
                })
              }
            />
          </Box>
          <Box width="half">
            <SelectController
              size="sm"
              backgroundColor="blue"
              id="category"
              name="category"
              label={f(m.inputs.publishingType.label)}
              defaultValue={newCase.department}
              placeholder={f(m.inputs.publishingType.placeholder)}
              options={catOptions}
              onSelect={(value) => {
                if (value.value)
                  setNewCase({
                    ...newCase,
                    category: value.value as MinistryOfJusticeCase['category'],
                  })
              }}
            />
          </Box>
          <Box width="full">
            <Input
              backgroundColor="blue"
              label={f(m.inputs.nameOfCase.label)}
              textarea
              rows={4}
              placeholder={f(m.inputs.nameOfCase.placeholder)}
              onChange={(e) =>
                setNewCase({ ...newCase, title: e.target.value })
              }
              name="case-title"
              value={newCase.title ?? ''}
            />
          </Box>
        </FormGroup>
        <FormGroup title={f(m.materialForPublicationChapter.title)}>
          <Box width="half">
            <SelectController
              size="sm"
              backgroundColor="blue"
              id="category"
              name="category"
              label={f(m.inputs.template.label)}
              defaultValue={newCase.template}
              placeholder={f(m.inputs.template.placeholder)}
              options={templateOptions}
              onSelect={(value) => {
                if (value.value)
                  setNewCase({
                    ...newCase,
                    template: value.value as MinistryOfJusticeCase['template'],
                  })
              }}
            />
          </Box>
          <Box width="full">
            <Input
              textarea
              rows={4}
              name="case-content"
              value={newCase.documentContents ?? ''}
              onChange={(e) =>
                setNewCase({ ...newCase, documentContents: e.target.value })
              }
            />
          </Box>
        </FormGroup>
        <FormGroup
          title={f(m.signatureChapter.title)}
          description={f(m.signatureChapter.intro)}
        >
          <Box
            display="flex"
            justifyContent="spaceBetween"
            alignItems="flexEnd"
            width="full"
          >
            <Box width="half">
              <Select
                size="sm"
                backgroundColor="blue"
                id="category"
                name="category"
                label={f(m.inputs.signatureType.label)}
                placeholder={f(m.inputs.signatureType.placeholder)}
                options={signatureTypeOptions}
                value={{
                  label: newCase.signatureType as string,
                  value: newCase.signatureType as string,
                }}
                onChange={(value) => {
                  setNewCase({
                    ...newCase,
                    signatureType:
                      value?.value as MinistryOfJusticeCase['signatureType'],
                  })
                }}
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
                {f(m.buttons.copyLastSignature.label)}
              </Button>
            </Box>
          </Box>
          <Box width="full">
            <Input
              textarea
              rows={4}
              name="signature-content"
              value={newCase.signatureContents ?? ''}
              onChange={(e) =>
                setNewCase({ ...newCase, signatureContents: e.target.value })
              }
            />
          </Box>
        </FormGroup>
      </FormWrap>
      <TemplateModal
        visible={toggle}
        onVisibilityChange={(visible) => setToggle(visible)}
        onClose={() => setToggle(false)}
        selectedTemplateId={selectedTemplateId}
        onSelectChange={(id) => setSelectedTemplateId(id)}
        onSave={(template) => {
          setNewCase({ ...newCase, ...template })
          setToggle(false)
        }}
      />
    </>
  )
}

export default NewCase
