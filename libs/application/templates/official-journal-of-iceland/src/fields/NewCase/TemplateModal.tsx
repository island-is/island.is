import { useLazyQuery } from '@apollo/client'
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
import { ADVERTS } from './queries'
import { general, newCase } from '../../lib/messages'
import * as styles from './NewCase.css'
import { useDebounce } from 'react-use'
import {
  MinistryOfJusticeAdvert,
  MinistryOfJusticeAdvertsResponse,
} from '@island.is/api/schema'
type Props = {
  visible?: boolean
  onClose?: () => void
  onSave: (template: any) => void
}

export const TemplateModal = ({ visible = false, onSave, onClose }: Props) => {
  const { formatMessage: f } = useLocale()
  const [selectedTemplateId, setSelectedTemplateId] = useState('')
  const [templates, setTemplates] = useState<MinistryOfJusticeAdvert[]>([])
  const [filter, setFilter] = useState('')
  const [lazyFilter, setLazyFilter] = useState('')
  const [loading, setLoading] = useState(false)
  const [lazySearchQuery] = useLazyQuery<{
    ministryOfJusticeAdverts: MinistryOfJusticeAdvertsResponse
  }>(ADVERTS)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      return lazySearchQuery({
        variables: {
          input: {
            search: lazyFilter,
          },
        },
        onCompleted(data) {
          setTemplates(data.ministryOfJusticeAdverts.adverts)
          setLoading(false)
        },
        onError(error) {
          console.error(error)
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
                  checked={template.title === selectedTemplateId}
                  name={`option-${i}`}
                  value={i}
                  onChange={() => setSelectedTemplateId(template.title)}
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
                  (t) => t.title === selectedTemplateId,
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
