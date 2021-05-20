import React from 'react'

import { NewsletterSignup } from './NewsletterSignup'

export default {
  title: 'Components/NewsletterSignup',
  component: NewsletterSignup,
}

export const Default = () => {
  return (
    <NewsletterSignup
      heading="Vertu með"
      id="newsletter"
      text="Skráðu þig á póstlista Stafræns Íslands og fylgstu með því nýjast í
          stafrænni opinberri þjónustu."
      buttonText="Skrá mig"
      placeholder="Settu inn netfangið þitt"
      label="Netfang"
      onChange={() => console.log('change')}
      onSubmit={() => console.log('submit')}
      successTitle="Skráning tókst!"
      successMessage="Tölvupóstur hefur verið sendur á jon@jonsbakari.is til staðfestingar. Takk fyrir."
      errorMessage="Skráning tókst ekki"
      value=""
    />
  )
}

export const BlueVariant = () => {
  return (
    <NewsletterSignup
      heading="Vertu með"
      id="newsletter-2"
      text="Skráðu þig á póstlista Stafræns Íslands og fylgstu með því nýjast í
          stafrænni opinberri þjónustu."
      buttonText="Skrá mig"
      placeholder="Settu inn netfangið þitt"
      label="Netfang"
      variant="blue"
      onChange={() => console.log('change')}
      onSubmit={() => console.log('submit')}
      successTitle="Skráning tókst!"
      successMessage="Tölvupóstur hefur verið sendur á jon@jonsbakari.is til staðfestingar. Takk fyrir."
      errorMessage="Skráning tókst ekki"
      value=""
    />
  )
}

export const errorState = () => {
  return (
    <NewsletterSignup
      heading="Vertu með"
      id="newsletter-3"
      text="Skráðu þig á póstlista Stafræns Íslands og fylgstu með því nýjast í
          stafrænni opinberri þjónustu."
      buttonText="Skrá mig"
      placeholder="Settu inn netfangið þitt"
      label="Netfang"
      variant="blue"
      onChange={() => console.log('change')}
      onSubmit={() => console.log('submit')}
      value="example@example.com"
      state="error"
      successTitle="Skráning tókst!"
      successMessage="Tölvupóstur hefur verið sendur á jon@jonsbakari.is til staðfestingar. Takk fyrir."
      errorMessage="Skráning tókst ekki"
    />
  )
}

export const successState = () => {
  return (
    <NewsletterSignup
      heading="Vertu með"
      id="newsletter-4"
      text="Skráðu þig á póstlista Stafræns Íslands og fylgstu með því nýjast í
          stafrænni opinberri þjónustu."
      buttonText="Skrá mig"
      placeholder="Settu inn netfangið þitt"
      label="Netfang"
      variant="blue"
      onChange={() => console.log('change')}
      onSubmit={() => console.log('submit')}
      value="example@example.com"
      state="success"
      successTitle="Skráning tókst!"
      successMessage="Tölvupóstur hefur verið sendur á jon@jonsbakari.is til staðfestingar. Takk fyrir."
      errorMessage="Skráning tókst ekki"
    />
  )
}
