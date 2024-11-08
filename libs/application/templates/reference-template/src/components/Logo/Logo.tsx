import { useEffect, useState } from 'react'
import { Application } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'

type Props = {
  application: Application
}

// In the prereq when there is no applicant, the logo is the default one.
// When there is an applicant, the logo is dynamic based on the applicant's identity number.
// Gervimaður Færeyjar shows the logo of Ísafjarðarbær and all others show the logo of Akureyri.
export const Logo = ({ application }: Props) => {
  const [logo, setLogo] = useState<string>()

  useEffect(() => {
    const getLogo = async () => {
      console.log(application)

      const applicant = application.applicant

      const town = !applicant
        ? 'sambandid'
        : applicant === '0101302399'
        ? 'isafjardarbaer'
        : 'akureyri'

      const svgLogo = await import(`../../assets/${town}.svg`)
      setLogo(svgLogo.default)
    }
    getLogo()
  }, [])

  return <img src={logo} alt="Municipality logo" />
}
