import {
  Text,
  Button,
  ModalBase,
  Box,
  RadioButton,
  Input,
  Select,
} from '@island.is/island-ui/core'

import React, { FC, useMemo, useState } from 'react'
import { m } from '../../lib/messages'
import { FormWrap } from '../../components/FormWrap/FormWrap'
import { FieldBaseProps } from '@island.is/application/types'
import * as styles from './BasicInformation.css'
import { FormGroup } from '../../components/FromGroup/FormGroup'
import { SelectController } from '@island.is/shared/form-fields'
import { useFormatMessage } from '../../hooks'
import { useMutation } from '@apollo/client'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
export type CaseTemplate = {
  applicationId?: string
  department?: string
  category?: string
  subCategory?: string
  title?: string
  template?: string
  documentContents?: string
  signatureType?: string
  signatureContents?: string
  signatureDate?: string
  ministry?: string
  preferedPublicationDate?: string
  fastTrack?: boolean
}

type ExternalData = {
  caseData?: {
    data?: {
      categories: string[]
      subCategories: string[]
      departments: string[]
      templates: CaseTemplate[]
    }
  }
}

export const BasicInformation: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
  setBeforeSubmitCallback,
  refetch,
}) => {
  const { f, locale } = useFormatMessage(application)
  const [updateApplication] = useMutation(UPDATE_APPLICATION)

  const [visibility, setVisibility] = useState(false)
  const [templateFilter, setTemplateFilter] = useState('')
  const [selectedPreviousTemplate, setSelectedPreviousTemplate] =
    useState<CaseTemplate | null>(null)

  const externalData = application.externalData as ExternalData

  const oldTemplates = externalData.caseData?.data?.templates
  const departments = externalData.caseData?.data?.departments

  const categories = externalData.caseData?.data?.categories
  const subCategories = externalData.caseData?.data?.subCategories

  const [newCase, setNewCase] = useState<CaseTemplate>({
    applicationId: '',
    department: departments?.[0],
    category: '',
    subCategory: '',
    title: '',
    template: '',
    documentContents: '',
    signatureType: '',
    signatureContents: '',
    signatureDate: '',
    ministry: '',
    preferedPublicationDate: '',
    fastTrack: false,
  })

  const filteredTemplates = useMemo(() => {
    if (!oldTemplates) {
      return []
    }
    return oldTemplates.filter((template) =>
      template?.title?.toLowerCase().includes(templateFilter.toLowerCase()),
    )
  }, [oldTemplates, templateFilter])

  setBeforeSubmitCallback &&
    setBeforeSubmitCallback(async () => {
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
    })

  const handleTemplateChange = () => {
    setVisibility(false)
    if (selectedPreviousTemplate) {
      setNewCase(selectedPreviousTemplate)
    }
  }

  return (
    <>
      <FormWrap
        header={{
          children: (
            <Text variant="h2" as="h1">
              {f(m.basicInformationFormTitle)}
            </Text>
          ),
          button: (
            <Button
              disabled={oldTemplates?.length === 0}
              variant="utility"
              iconType="outline"
              icon="copy"
              onClick={() => setVisibility(true)}
            >
              {f(m.copyOlderApplicationTemplate)}
            </Button>
          ),
        }}
      >
        <Text marginBottom={4}>{f(m.basicInformationIntro)}</Text>
        <FormGroup>
          <Box width="half">
            <SelectController
              size="sm"
              id="department"
              disabled={departments?.length === 1}
              placeholder={f(m.chooseDepartment)}
              label={f(m.department)}
              options={departments?.map((department) => ({
                label: department,
                value: department,
              }))}
              defaultValue={newCase.department}
              onSelect={(value) =>
                setNewCase({ ...newCase, department: value.value })
              }
            />
          </Box>
          <Box width="half">
            <SelectController
              required
              size="sm"
              backgroundColor="blue"
              id="publishingType"
              label={f(m.publishingType)}
              defaultValue={newCase.category}
              placeholder={f(m.choosePublishingType)}
              options={categories?.map((category) => ({
                label: category,
                value: category,
              }))}
              onSelect={(value) =>
                setNewCase({ ...newCase, category: value.value })
              }
            />
          </Box>
          <Box width="full">
            <Input
              backgroundColor="blue"
              label={f(m.caseTitle)}
              textarea
              rows={4}
              placeholder={f(m.chooseCaseTitle)}
              onChange={(e) =>
                setNewCase({ ...newCase, title: e.target.value })
              }
              name="case-title"
              value={newCase.title}
            />
          </Box>
        </FormGroup>
        <FormGroup title={f(m.materialForPublication)}>
          <Box width="half">
            <Input
              size="sm"
              backgroundColor="blue"
              name="content-template"
              placeholder={f(m.chooseContentTemplate)}
              label={f(m.contentTemplate)}
              value={newCase.template}
              onChange={(e) =>
                setNewCase({ ...newCase, template: e.target.value })
              }
            />
          </Box>
          <Box width="full">
            <Input
              textarea
              rows={4}
              name="case-content"
              value={newCase.documentContents}
              onChange={(e) =>
                setNewCase({ ...newCase, documentContents: e.target.value })
              }
            />
          </Box>
        </FormGroup>
        <FormGroup
          title={f(m.textOfSignatureSectionTitle)}
          description={f(m.textOfSignatureSectionDescription)}
        >
          <Box
            display="flex"
            justifyContent="spaceBetween"
            alignItems="flexEnd"
            width="full"
          >
            <Box width="half">
              <Input
                size="sm"
                backgroundColor="blue"
                name="signature-template"
                placeholder={f(m.chooseTypeOfSignature)}
                label={f(m.typeOfSignature)}
                value={newCase.signatureType}
                onChange={(e) =>
                  setNewCase({ ...newCase, signatureType: e.target.value })
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
                {f(m.copyLastSignature)}
              </Button>
            </Box>
          </Box>
          <Box width="full">
            <Input
              textarea
              rows={4}
              name="signature-content"
              value={newCase.signatureContents}
              onChange={(e) =>
                setNewCase({ ...newCase, signatureContents: e.target.value })
              }
            />
          </Box>
        </FormGroup>
      </FormWrap>
      <ModalBase
        baseId="confirmationModal"
        isVisible={visibility}
        className={styles.modalBase}
        onVisibilityChange={(visibility) => setVisibility(visibility)}
      >
        <Box
          className={styles.modalContent}
          background="white"
          paddingX={3}
          paddingY={10}
          width="full"
        >
          <Box className={styles.modalContentInner}>
            <Text marginBottom={4} variant="h2">
              {f(m.caseForCopying)}
            </Text>
            <Box marginBottom={2} display="flex" justifyContent="flexStart">
              <Input
                type="text"
                onChange={(e) => setTemplateFilter(e.target.value)}
                icon={{ name: 'search' }}
                size="xs"
                placeholder={f(m.searchPlaceholder)}
                name="template-filter"
              />
            </Box>
            <Box marginBottom={6}>
              {filteredTemplates?.map((template, i) => (
                <Box
                  padding={2}
                  key={i}
                  borderBottomWidth="standard"
                  borderColor="blue200"
                  borderTopWidth={i === 0 ? 'standard' : undefined}
                >
                  <RadioButton
                    label={template.title}
                    checked={
                      selectedPreviousTemplate?.applicationId ===
                      template.applicationId
                    }
                    name={`option-${i}`}
                    value={template.applicationId}
                    onChange={() => setSelectedPreviousTemplate(template)}
                  />
                </Box>
              ))}
            </Box>
            <Box
              className={styles.modalButtons}
              display="flex"
              justifyContent="spaceBetween"
            >
              <Button variant="ghost" onClick={() => setVisibility(false)}>
                {f(m.cancel)}
              </Button>
              <Button onClick={() => handleTemplateChange()}>
                {f(m.confirm)}
              </Button>
            </Box>
          </Box>
        </Box>
      </ModalBase>
    </>
  )
}

export default BasicInformation
