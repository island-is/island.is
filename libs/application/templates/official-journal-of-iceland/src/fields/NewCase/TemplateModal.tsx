import { useLazyQuery } from '@apollo/client'
import {
  MinistryOfJusticeCase,
  MinistryOfJusticeSearchCaseTemplateResponse,
} from '@island.is/api/schema'
import {
  Box,
  Button,
  Input,
  ModalBase,
  RadioButton,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useEffect, useState } from 'react'
import { useDebounce } from 'react-use'
import { SEARCH_CASE_TEMPLATES } from '../../graphql/queries'
import { general, newCase } from '../../lib/messages'
import * as styles from './NewCase.css'

type Props = {
  visible?: boolean
  selectedTemplateId?: MinistryOfJusticeCase['applicationId']
  onVisibilityChange?: (visibility: boolean) => void
  onSelectChange: (id: MinistryOfJusticeCase['applicationId']) => void
  onClose?: () => void
  onSave: (template: MinistryOfJusticeCase) => void
}

type TemplateRepsonse = {
  ministryOfJusticeSearchCaseTemplates: MinistryOfJusticeSearchCaseTemplateResponse
}

export const TemplateModal = ({
  visible = false,
  selectedTemplateId,
  onVisibilityChange,
  onSelectChange,
  onClose,
  onSave,
}: Props) => {
  const { formatMessage: f } = useLocale()
  const [templates, setTemplates] = useState([])
  const [filter, setFilter] = useState('')
  const [lazyFilter, setLazyFilter] = useState('')
  const [loading, setLoading] = useState(false)
  const [lazySearchQuery] = useLazyQuery<TemplateRepsonse>(
    SEARCH_CASE_TEMPLATES,
  )

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      return lazySearchQuery({
        variables: {
          input: {
            q: lazyFilter,
          },
        },
        fetchPolicy: 'no-cache',
        onCompleted(data) {
          setLoading(false)
          setTemplates(data.ministryOfJusticeSearchCaseTemplates.items)
        },
        onError(error) {
          console.log(error)
          setLoading(false)
        },
      })
    }
    load()
  }, [lazySearchQuery, lazyFilter])

  useDebounce(
    () => {
      setLazyFilter(filter)
    },
    250,
    [filter],
  )

  return (
    <ModalBase
      baseId="template-modal"
      isVisible={visible}
      className={styles.modalBase}
      onVisibilityChange={onVisibilityChange}
    >
      <Box className={styles.modalContent}>
        <Box className={styles.modalContentInner}>
          <Text marginBottom={4} variant="h2">
            {f(newCase.modal.title)}
          </Text>
          <Box marginBottom={2} display="flex" justifyContent="flexStart">
            <Input
              type="text"
              onChange={(e) => setFilter(e.target.value)}
              icon={{ name: 'search' }}
              size="xs"
              placeholder={f(newCase.modal.searchPlaceholder)}
              name="template-filter"
            />
          </Box>
          <Box marginBottom={6}>
            {templates.map((template, i) => (
              <Box
                padding={2}
                key={i}
                borderBottomWidth="standard"
                borderColor="blue200"
                borderTopWidth={i === 0 ? 'standard' : undefined}
              >
                <RadioButton
                  label={template.title}
                  checked={template.applicationId === selectedTemplateId}
                  name={`option-${i}`}
                  value={i}
                  onChange={() => onSelectChange(template.applicationId)}
                />
              </Box>
            ))}
          </Box>
          <Box
            className={styles.modalButtons}
            display="flex"
            justifyContent="spaceBetween"
          >
            <Button variant="ghost" onClick={onClose}>
              {f(general.cancel)}
            </Button>
            <Button
              disabled={!selectedTemplateId}
              loading={loading}
              onClick={() => {
                const template = templates.find(
                  (t) => t.applicationId === selectedTemplateId,
                )
                if (template) {
                  onSave(template)
                }
              }}
            >
              {f(general.confirm)}
            </Button>
          </Box>
        </Box>
      </Box>
    </ModalBase>
  )
}
