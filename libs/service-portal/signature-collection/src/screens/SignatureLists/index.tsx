import {
  Box,
  Button,
  GridColumn,
  ToggleSwitchButton,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { IntroHeader } from '@island.is/portals/core'
import { m } from '../../lib/messages'
import OwnerView from './ownerView'
import SigneeView from './signeeView'
import { useState } from 'react'
import { useGetOwnerLists, useIsOwner } from '../hooks'

const SignatureLists = () => {
  useNamespaces('sp.signatureCollection')
  const { formatMessage } = useLocale()

  const { isOwner, loadingIsOwner } = useIsOwner()
  const [viewAsOwner, setViewAsOwner] = useState(isOwner.success)
  const { ownerLists } = useGetOwnerLists()

  return (
    <>
      {!loadingIsOwner && (
        <Box>
          <IntroHeader
            title={formatMessage(m.pageTitle)}
            intro={formatMessage(m.pageDescription)}
          >
            {isOwner.success && ownerLists.length === 0 && (
              <GridColumn span={['8/8', '3/8']}>
                <Box
                  display={'flex'}
                  justifyContent={['flexStart', 'flexEnd']}
                  paddingTop={[2]}
                >
                  <Button
                    icon="open"
                    iconType="outline"
                    onClick={() =>
                      window.open(
                        `${document.location.origin}/umsoknir/medmaelalisti/`,
                      )
                    }
                    size="small"
                  >
                    {formatMessage(m.createListButton)}
                  </Button>
                </Box>
              </GridColumn>
            )}
          </IntroHeader>

          {/*for dev purposes while WIP*/}
          <ToggleSwitchButton
            checked={!viewAsOwner}
            label={
              viewAsOwner
                ? 'Switch to view as signee'
                : 'Switch to view as owner'
            }
            onChange={() => {
              setViewAsOwner(!viewAsOwner)
            }}
          />
          {viewAsOwner ? <OwnerView /> : <SigneeView />}
        </Box>
      )}
    </>
  )
}

export default SignatureLists
