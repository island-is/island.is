import React, { useState, useMemo, useContext, useEffect } from 'react'
import { Box } from '@island.is/island-ui/core'

import * as styles from './Profile.css'

import {
  Application,
  ApplicationState,
  aidCalculator,
  getMonth,
  calculateAidFinalAmount,
  showSpouseData,
  AmountModal,
  getAidAmountModalInfo,
  UserType,
  ApplicationFile,
} from '@island.is/financial-aid/shared/lib'

import format from 'date-fns/format'

import {
  CollapsibleProfileUnit,
  ProfileUnit,
  StateModal,
  AidAmountModal,
  History,
  CommentSection,
  ApplicationHeader,
  FilesListWithHeaderContainer,
} from '@island.is/financial-aid-web/veita/src/components'
import { AdminContext } from '@island.is/financial-aid-web/veita/src/components/AdminProvider/AdminProvider'
import {
  getApplicant,
  getApplicantMoreInfo,
  getApplicantSpouse,
  getDirectTaxPayments,
  getNationalRegistryInfo,
} from '@island.is/financial-aid-web/veita/src/utils/applicationHelper'
import { TaxBreakdown } from '@island.is/financial-aid/shared/components'
import { gql, useLazyQuery, useMutation } from '@apollo/client'
import { CreateSignedUrlMutation } from '@island.is/financial-aid-web/osk/graphql'
import { item } from 'libs/island-ui/core/src/lib/AsyncSearch/shared/Item/Item.css'
import PrintableImages from './PrintableImages'

export const GetSignedUrlQuery = gql`
  query GetSignedUrlQuery($input: GetSignedUrlForIdInput!) {
    getSignedUrlForId(input: $input) {
      url
      key
    }
  }
`
interface ApplicationProps {
  application: Application
  setApplication: React.Dispatch<React.SetStateAction<Application | undefined>>
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

interface CalculationsModal {
  visible: boolean
  type: AmountModal
}

const ApplicationProfile = ({
  application,
  setApplication,
  setIsLoading,
}: ApplicationProps) => {
  const [isStateModalVisible, setStateModalVisible] = useState(false)

  const [calculationsModal, setCalculationsModal] = useState<CalculationsModal>(
    {
      visible: false,
      type: AmountModal.ESTIMATED,
    },
  )

  const { municipality } = useContext(AdminContext)

  const aidAmount = useMemo(() => {
    if (application && municipality && application.homeCircumstances) {
      return aidCalculator(
        application.homeCircumstances,
        showSpouseData[application.familyStatus]
          ? municipality.cohabitationAid
          : municipality.individualAid,
      )
    }
  }, [application, municipality])

  const applicationInfo = [
    {
      title: 'Tímabil',
      content:
        getMonth(new Date(application.created).getMonth()) +
        format(new Date(application.created), ' y'),
    },
    {
      title: 'Sótt um',
      content: format(new Date(application.created), 'dd.MM.y  · kk:mm'),
    },
    aidAmount
      ? {
          title: 'Áætluð aðstoð',
          content: `${calculateAidFinalAmount(
            aidAmount,
            application.usePersonalTaxCredit,
          ).toLocaleString('de-DE')} kr.`,
          onclick: () => {
            setCalculationsModal({ visible: true, type: AmountModal.ESTIMATED })
          },
        }
      : {
          title: 'Áætluð aðstoð',
          content: `Útreikningur misstókst`,
        },
  ]

  if (application.state === ApplicationState.APPROVED) {
    applicationInfo.push({
      title: 'Veitt',
      content: `${application.amount?.finalAmount.toLocaleString('de-DE')} kr.`,
      onclick: () => {
        setCalculationsModal({ visible: true, type: AmountModal.PROVIDED })
      },
    })
  }
  if (application.state === ApplicationState.REJECTED) {
    applicationInfo.push({
      title: 'Aðstoð synjað',
      content: application?.rejection
        ? application?.rejection
        : 'enginn ástæða gefin',
    })
  }

  const applicant = getApplicant(application)

  const applicantSpouse = getApplicantSpouse(application)

  const applicantMoreInfo = getApplicantMoreInfo(application)

  const nationalRegistryInfo = getNationalRegistryInfo(application)

  const modalInfo = getAidAmountModalInfo(
    calculationsModal.type,
    aidAmount,
    application.usePersonalTaxCredit,
    application?.amount,
  )

  const applicantDirectPayments =
    application.directTaxPayments.filter(
      (d) => d.userType === UserType.APPLICANT,
    ) ?? []

  const spouseDirectPayments =
    application.directTaxPayments.filter(
      (d) => d.userType === UserType.SPOUSE,
    ) ?? []

  function isImage(filename: string): boolean {
    const imagesFileExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp']

    const extension = filename.split('.').pop()?.toLowerCase() || ''

    return imagesFileExtensions.includes(extension)
  }

  // const [allImages, setImages] = useState([])
  const [createSignedUrlMutation] = useMutation(CreateSignedUrlMutation)

  const [allImages, setallImages] = useState<any[]>([])

  const [openFile] = useLazyQuery(GetSignedUrlQuery, {
    fetchPolicy: 'no-cache',
    onCompleted: (data: { getSignedUrlForId: { url: string } }) => {
      return data.getSignedUrlForId.url
    },
    onError: (error) => {
      // TODO: What should happen here?
      console.log(error)
    },
  })

  // useEffect(() => {
  //   async function fetchMyAPI() {
  //     if (application?.files) {
  //       await application?.files.map(async (img) => {
  //         const blaa = await Promise.all([
  //           openFile({ variables: { input: { id: img.id } } }),
  //         ])
  //         return blaa
  //       })
  //     }
  //   }
  //   console.log(fetchMyAPI())

  // const bla =
  //    application.files
  //     .map(async (img) => {
  //       const blaa = await Promise.all( [openFile({ variables: { input: { id: img.id } } })] )
  //       return blaa
  //     })
  //     console.log(await bla)

  // const asyncRes = await Promise.all(arr.map(async (i) => {
  //   await sleep(10);
  //   return i + 1;
  // }));

  // const asyncRes = await Promise.all(arr.map(async (i) => {
  //   await sleep(10);
  //   return i + 1;
  // }));

  // console.log(asyncRes);

  // setallImages( Promise.all([async () => {
  //     application.files
  //     ?.filter((el) => {
  //       if (isImage(el.name)) {
  //         return el.name
  //       }
  //     })
  //     .map((image) => () => {
  //       return await openFile({ variables: { input: { id: image.id } } })
  //     }),
  // }]))
  // async function fetchMyAPI() {
  //   await application.files
  //     ?.filter((el) => {
  //       if (isImage(el.name)) {
  //         return el.name
  //       }
  //     })
  //     .map((image) => () => {
  //       return openFile({ variables: { input: { id: image.id } } })
  //     })
  // }
  //   // console.log(Promise.all([fetchMyAPI()]))
  // }, [application?.files])

  // useEffect(() => {
  //   window.onbeforeprint = (event) => {
  //     console.log('Before print')
  //   }
  // }, [])
  // console.log(allImages)

  return (
    <>
      <Box
        marginTop={10}
        marginBottom={15}
        className={`${styles.applicantWrapper} hideOnPrintMarginBottom hideOnPrintMarginTop`}
      >
        <ApplicationHeader
          application={application}
          onClickApplicationState={() => {
            setStateModalVisible((isStateModalVisible) => !isStateModalVisible)
          }}
          setApplication={setApplication}
          setIsLoading={setIsLoading}
        />

        <ProfileUnit
          heading="Umsókn"
          info={applicationInfo}
          className={`contentUp delay-50`}
        />

        <ProfileUnit
          heading="Umsækjandi"
          info={applicant}
          className={`contentUp delay-75`}
        />

        {applicantDirectPayments.length > 0 && (
          <CollapsibleProfileUnit
            heading="Upplýsingar um staðgreiðslu"
            info={getDirectTaxPayments(applicantDirectPayments)}
            className={`contentUp delay-75`}
          >
            <TaxBreakdown items={applicantDirectPayments} />
          </CollapsibleProfileUnit>
        )}

        {showSpouseData[application.familyStatus] && (
          <CollapsibleProfileUnit
            heading="Maki"
            info={applicantSpouse}
            className={`contentUp delay-100`}
          />
        )}

        {spouseDirectPayments.length > 0 && (
          <CollapsibleProfileUnit
            heading="Upplýsingar um staðgreiðslu maka"
            info={getDirectTaxPayments(spouseDirectPayments)}
            className={`contentUp delay-125`}
          >
            <TaxBreakdown items={spouseDirectPayments} />
          </CollapsibleProfileUnit>
        )}

        <CollapsibleProfileUnit
          heading="Umsóknarferli"
          info={applicantMoreInfo}
          className={`contentUp delay-125`}
        />

        <CollapsibleProfileUnit
          heading="Þjóðskrá"
          info={nationalRegistryInfo}
          className={`contentUp delay-125`}
        />

        {application.files && (
          <FilesListWithHeaderContainer applicationFiles={application.files} />
        )}

        <CommentSection
          className={`contentUp delay-125 ${styles.widthAlmostFull}`}
          setApplication={setApplication}
        />

        <History
          applicantName={application.name}
          applicationEvents={application.applicationEvents}
          spouseName={application.spouseName ?? ''}
        />

        {application?.files && (
          <Box className={` ${styles.widthFull} `}>
            <PrintableImages
              images={application?.files.filter((el) => isImage(el.name))}
            />
            {/* {application?.files &&
            application?.files
              .filter((el) => isImage(el.name))
              .map((img) => {
                return (
                  <div>{img.name}</div>
                  // <img
                  //   // src={openFile({ variables: { input: { id: img.id } } })}
                  //   className=""
                  //   loading="lazy"
                  // />
                )
              })} */}
            {/* <img
            src="https://fjarhagsadstod.dev.sveitarfelog.net/files/8af72f08-1cfa-4155-a9ab-e67cdb8ab68b/austin-powers-sex-yes-please.jpeg?Expires=1647256842&Key-Pair-Id=K2DUN2ISOH197V&Signature=ibo54sXoFP~yncxpIada2jMokVl3yf6t-gL5XNz5UA1TtxlXS2R5jUaWKGVdhUnL6t1ledO-~P2mkQz7hOCr54y7mhQ3sDRl7FydL0Ksgtqp4tyDLddwQdlgHcWmgFk6fl2mDUR6YW4-riM1RSwOORDZvywtniLbwcjUS9Ot-3pT3-JE6u62ktQ3hh57NVc-eC~hcN9oGjVTAUI33cvmXHqr~eFvKFGD94Zio~QRfrFOu0-l0fotOKPxsjIcYkb~G3LG3gq18888Bt~x~fG5X~sNfD54IdQCzx0rqX6NXJZzvEJzjXCYhoN5lCoyptAFwi1jRuuLthiQcx8T6sBvDA__"
            className="printableImages"
          /> */}
            {/* {application.files?.map((el) => {
            if (isImage(el.name)) {
              return <img />
            }
          })} */}
          </Box>
        )}
      </Box>
      {application.state && (
        <StateModal
          isVisible={isStateModalVisible}
          onVisibilityChange={(isVisibleBoolean) => {
            setStateModalVisible(isVisibleBoolean)
          }}
          setApplication={setApplication}
          applicationId={application.id}
          currentState={application.state}
          homeCircumstances={application.homeCircumstances}
          familyStatus={application.familyStatus}
          setIsLoading={setIsLoading}
          applicationCreated={application.created}
        />
      )}

      <AidAmountModal
        headline={modalInfo.headline}
        calculations={modalInfo.calculations}
        isVisible={calculationsModal.visible}
        onVisibilityChange={() => {
          setCalculationsModal({ ...calculationsModal, visible: false })
        }}
      />
    </>
  )
}

export default ApplicationProfile
