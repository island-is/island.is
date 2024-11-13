import { FC, ReactElement, useEffect, useState } from 'react'
import {
  Box,
  DropdownMenu,
  Button,
  FocusableBox,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import * as styles from '../styles.css'
import { m } from '../../../lib/messages'
import copyToClipboard from 'copy-to-clipboard'
import { toast } from 'react-toastify'
import { usePDF } from '@react-pdf/renderer'
import MyPdfDocument from './DownloadPdf'
import { EndorsementList } from '@island.is/api/schema'
import cn from 'classnames'
import { useGetAllPetitionEndorsements } from '../../hooks'
import { getCSV } from './downloadCSV'

interface Props {
  petition?: EndorsementList
  petitionId: string
  dropdownItems?: {
    href?: string
    onClick?: () => void
    title: string
    render?: (
      element: ReactElement,
      index: number,
      className: string,
    ) => ReactElement
  }[]
}

const baseUrl = `${document.location.origin}/undirskriftalistar/`

const DropdownExport: FC<React.PropsWithChildren<Props>> = ({
  petition,
  petitionId,
  dropdownItems = [],
}) => {
  useNamespaces('sp.petitions')
  const { formatMessage } = useLocale()

  const [canGetAllEndorsements, setCanGetAllEndorsements] = useState(false)
  const { allEndorsements } = useGetAllPetitionEndorsements(
    petitionId,
    canGetAllEndorsements,
  )

  const [instance, updateInstance] = usePDF({
    document: (
      <MyPdfDocument petition={petition} petitionSigners={allEndorsements} />
    ),
  })

  useEffect(() => {
    if (allEndorsements.data?.length > 0) {
      updateInstance()
    }
  }, [allEndorsements])

  return (
    <Box display="flex">
      <Box marginRight={2} className={styles.hideInMobile}>
        <Button
          onClick={() => {
            const copied = copyToClipboard(baseUrl + petitionId)
            if (!copied) {
              return toast.error(formatMessage(m.copyLinkError.defaultMessage))
            }
            toast.success(formatMessage(m.copyLinkSuccess.defaultMessage))
          }}
          variant="utility"
          icon="link"
        >
          {formatMessage(m.copyLinkToList)}
        </Button>
      </Box>
      <FocusableBox onClick={() => setCanGetAllEndorsements(true)}>
        <DropdownMenu
          icon="ellipsisVertical"
          iconType="outline"
          menuLabel={formatMessage(m.downloadPetitions)}
          items={[
            {
              title: formatMessage(m.downloadPetitions),
              render: () => {
                return (
                  <button
                    key="copyLinkDesktop"
                    className={cn(styles.hideOnDesktop)}
                    onClick={() => {
                      const copied = copyToClipboard(baseUrl + petitionId)
                      if (!copied) {
                        return toast.error(
                          formatMessage(m.copyLinkError.defaultMessage),
                        )
                      }
                      toast.success(
                        formatMessage(m.copyLinkSuccess.defaultMessage),
                      )
                    }}
                  >
                    {formatMessage(m.linkToList)}
                  </button>
                )
              },
            },
            {
              title: formatMessage(m.asPdf),
              render: () => (
                <a
                  key={petitionId}
                  href={instance.url ?? ''}
                  download={'Undirskriftalisti.pdf'}
                  className={styles.menuItem}
                >
                  {formatMessage(m.asPdf)}
                </a>
              ),
            },
            {
              onClick: () => getCSV(allEndorsements),
              title: formatMessage(m.asCsv),
            },
            ...dropdownItems,
          ]}
          title={formatMessage(m.downloadPetitions)}
        />
      </FocusableBox>
    </Box>
  )
}

export default DropdownExport
