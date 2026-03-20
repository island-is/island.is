import { Text, LinkContext, LinkV2 } from '@island.is/island-ui/core'

const DirectTaxPaymentsInfo = () => {
  return (
    <>
      <Text as="h2" variant="h3" marginBottom={2}>
        Hvar finn ég staðfestingarskjal úr staðgreiðsluskrá?
      </Text>
      <Text marginBottom={[3, 3, 10]}>
        Eftir að þú hefur innskráð þig á þjónustuvef Skattsins ferð þú í Almennt
        → Staðgreiðsluskrá RSK → Sækja PDF.
      </Text>
    </>
  )
}

const TaxReturnInfo = () => {
  return (
    <>
      <Text as="h2" variant="h3" marginBottom={2}>
        Hvar finn ég staðfest afrit af mínu skattframtali?
      </Text>

      <LinkContext.Provider
        value={{
          linkRenderer: (href, children) => (
            <a
              style={{
                color: '#0061ff',
              }}
              href={href}
              rel="noopener noreferrer"
              target="_blank"
            >
              {children}
            </a>
          ),
        }}
      >
        <Text marginBottom={[3, 3, 5]}>
          Á vef Skattsins finnur þú{' '}
          <LinkV2
            href="https://www.skatturinn.is/einstaklingar/framtal-og-alagning/stadfest-afrit-framtals/"
            color="blue400"
            underline="small"
            underlineVisibility="always"
          >
            leiðbeiningar
          </LinkV2>{' '}
          um hvernig sækja má staðfest afrit skattframtals.
        </Text>
      </LinkContext.Provider>
    </>
  )
}

export const getTaxFormContent = (
  taxReturnFailed: boolean,
  directTaxPaymentsFailed: boolean,
) => {
  switch (true) {
    case taxReturnFailed && !directTaxPaymentsFailed:
      return {
        data: (
          <Text marginBottom={2}>
            Við þurfum að fá afrit af nýjasta <strong>skattframtali</strong>{' '}
            þínu þar sem ekki náðist að sækja gögnin sjálfvirkt.
          </Text>
        ),
        reason: (
          <Text marginBottom={[4, 4, 5]}>
            Skattframtal er staðfesting á öllum þeim tekjum, eignum og skuldum
            sem þú áttir á skattárinu og er nauðsynlegt fyrir úrvinnslu á
            fjárhagsaðstoð.
          </Text>
        ),
        info: <TaxReturnInfo />,
      }
    case directTaxPaymentsFailed && !taxReturnFailed:
      return {
        data: (
          <Text marginBottom={2}>
            Við þurfum að fá afrit úr <strong>staðgreiðsluskrá</strong>{' '}
            Skattsins þar sem ekki náðist að sækja gögnin sjálfvirkt.
          </Text>
        ),
        reason: (
          <Text marginBottom={[4, 4, 5]}>
            Staðgreiðsluskrá er staðfesting/yfirlit frá Skattinum um
            skattskyldar tekjur umsækjanda á árinu. Það er nauðsynlegt fyrir
            úrvinnslu umsóknar um fjárhagsaðstoð.
          </Text>
        ),
        info: <DirectTaxPaymentsInfo />,
      }

    default:
      return {
        data: (
          <Text marginBottom={2}>
            Við þurfum að fá afrit af nýjasta <strong>skattframtali</strong>{' '}
            þínu og staðfestingarskjal úr <strong>staðgreiðsluskrá</strong>{' '}
            Skattsins þar sem ekki tókst að sækja gögnin sjálfvikrt.
          </Text>
        ),
        reason: (
          <Text marginBottom={[4, 4, 5]}>
            Skattframtal er staðfesting á öllum þeim tekjum, eignum og skuldum
            sem þú áttir á skattárinu og staðgreiðsluskrá er staðfesting/yfirlit
            frá Skattinum um skattskyldar tekjur umsækjanda á árinu. Bæði gögn
            eru nauðsynleg fylgigögn fyrir úrvinnslu á fjárhagsaðstoð.
          </Text>
        ),
        info: (
          <>
            <TaxReturnInfo />
            <DirectTaxPaymentsInfo />
          </>
        ),
      }
  }
}
