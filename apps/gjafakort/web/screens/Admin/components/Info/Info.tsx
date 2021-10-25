import React from 'react'

import { CompanyApplication } from '@island.is/gjafakort-web/graphql/schema'
import { KeyValue } from '@island.is/gjafakort-web/components'

import {
  Accordion,
  AccordionItem,
  BulletList,
  Bullet,
  Stack,
  Box,
  Typography,
} from '@island.is/island-ui/core'

import * as styles from './Info.css'

interface PropTypes {
  application: CompanyApplication
}

function Info({ application }: PropTypes) {
  return (
    <>
      <Box marginBottom={8}>
        {application.logs && (
          <Box>
            <Accordion dividerOnTop={false} dividerOnBottom={false}>
              <AccordionItem
                label="Skoða atburðarsögu"
                labelVariant="h5"
                id={application.id}
              >
                <Stack space="gutter">
                  {application.logs.map((log) => (
                    <Box key={log.id}>
                      <Typography variant="h4">{log.title}</Typography>
                      <Box display="flex" flexWrap="wrap">
                        <KeyValue
                          label="Búin til"
                          value={new Date(log.created).toLocaleString('is-IS')}
                          size="p"
                        />
                        <KeyValue
                          label="Staða umsóknar"
                          value={log.state}
                          size="p"
                        />
                        <KeyValue
                          label="Kennitala geranda"
                          value={log.authorSSN || '-'}
                          size="p"
                        />
                      </Box>
                      <pre className={styles.data}>
                        <code>
                          {JSON.stringify(JSON.parse(log.data), null, 2)}
                        </code>
                      </pre>
                    </Box>
                  ))}
                </Stack>
              </AccordionItem>
            </Accordion>
          </Box>
        )}
        <Box marginBottom={1}>
          <Typography variant="p">
            {application.companyDisplayName} er skráð í eftirfarandi flokka:
          </Typography>
        </Box>
        <BulletList type="ul">
          {application.validLicenses && (
            <Bullet>
              Fyrirtækið er með rekstrarleyfi vegna veitingastaða, gististaða og
              skemmtanahalds.
            </Bullet>
          )}
          {application.validPermit && (
            <Bullet>Fyrirtækið er með gilt starfsleyfi Ferðamálastofu.</Bullet>
          )}
          {application.operationsTrouble && (
            <Bullet>
              Fyrirtækið var skráð í rekstrarerfiðleikum 31. desember 2019.
            </Bullet>
          )}
          {application.operatingPermitForRestaurant && (
            <Bullet>Fyrirtæki er með starfsleyfi vegna veitingastaða.</Bullet>
          )}
          {application.operatingPermitForVehicles && (
            <Bullet>
              Fyrirtæki er með starfsleyfi vegna leigu skráningarskyldra
              ökutækja.
            </Bullet>
          )}
          {application.exhibition && (
            <Bullet>
              Fyrirtækið heldur sýningar sem gerir út á náttúru, menningu eða
              sögu.
            </Bullet>
          )}
        </BulletList>
      </Box>

      <Box marginBottom={4}>
        <Box marginBottom={2}>
          <Typography variant="h4" as="h2">
            Upplýsingar fyrirtækis
          </Typography>
        </Box>
        <Box display="flex" flexWrap="wrap">
          <KeyValue
            label="Kennitala"
            value={`${application.companySSN.slice(
              0,
              6,
            )}-${application.companySSN.slice(6)}`}
            color="blue400"
          />
          <KeyValue
            label="Þjónustuflokkur"
            value={application.serviceCategory}
            color="blue400"
          />
          <KeyValue
            label="Vefsíða"
            value={application.webpage}
            color="blue400"
          />
          <KeyValue
            label="Fjárhæð ríkisaðstoðar"
            value={`${(application.publicHelpAmount || 0).toLocaleString(
              'de-DE',
            )} kr`}
            color="blue400"
          />
        </Box>
      </Box>
      <Box marginBottom={12}>
        <Box marginBottom={2}>
          <Typography variant="h4" as="h2">
            Tengiliður
          </Typography>
        </Box>
        <Box display="flex" flexWrap="wrap">
          <KeyValue label="Nafn" value={application.name} />
          <KeyValue label="Netfang (aðal)" value={application.generalEmail} />
          <KeyValue label="Netfang" value={application.email} />
          <KeyValue
            label="Símanúmer"
            value={`${application.phoneNumber.slice(
              0,
              3,
            )}-${application.phoneNumber.slice(3)}`}
          />
        </Box>
      </Box>
    </>
  )
}

export default Info
