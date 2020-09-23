import React from 'react'
import NewsletterSignup from './NewsletterSignup'

export default {
  title: 'Components/NewsletterSignup',
  component: NewsletterSignup,
}

export const Default = () => {
  return (
    <NewsletterSignup
      heading="Vertu með"
      text="Skráðu þig á póstlista Stafræns Íslands og fylgstu með því nýjast í
          stafrænni opinberri þjónustu."
      buttonText="Skrá mig"
      placeholder="Settu inn netfangið þitt"
      label="Netfang"
      onChange={() => console.log('change')}
      value=""
    />
  )
}

export const BlueVariant = () => {
  return (
    <NewsletterSignup
      heading="Vertu með"
      text="Skráðu þig á póstlista Stafræns Íslands og fylgstu með því nýjast í
          stafrænni opinberri þjónustu."
      buttonText="Skrá mig"
      placeholder="Settu inn netfangið þitt"
      label="Netfang"
      variant="blue"
      onChange={() => console.log('change')}
      value=""
    />
  )
}
