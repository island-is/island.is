import { theme } from '@island.is/island-ui/theme'
import React, { FC } from 'react'
import dynamic from 'next/dynamic'
import { useWindowSize } from 'react-use'

type IllustrationProps = {
  illustrationIndex?: number
}

const illustrations = [
  dynamic(() => import('./ManWithPhoneIllustration')),
  dynamic(() => import('./WomanWithLaptopIllustration')),
  dynamic(() => import('./WomanFeedingBabyIllustration')),
  dynamic(() => import('./ManWithStrollerIllustration')),
  dynamic(() => import('./WomanOnBusIllustration')),
  dynamic(() => import('./ManOnBenchIllustration')),
]

const Illustration: React.FC<IllustrationProps> = ({
  illustrationIndex = 0,
}) => {
  const isMobile = useWindowSize().width < theme.breakpoints.md
  if (isMobile) {
    return null
  }

  const SelectedIllustration = illustrations[illustrationIndex]
  const NextIllustration =
    illustrations[(illustrationIndex + 1) % illustrations.length]

  if (!SelectedIllustration) {
    return null
  }

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 451 510">
      <g fill="#ccdfff">
        <circle cx="311.385" cy="122.243" r="2"></circle>
        <circle cx="263.385" cy="122.243" r="2"></circle>
        <circle cx="215.385" cy="122.243" r="2"></circle>
        <circle cx="311.385" cy="170.243" r="2"></circle>
        <circle cx="311.385" cy="242.243" r="2"></circle>
        <circle cx="263.385" cy="170.243" r="2"></circle>
        <circle cx="215.385" cy="170.243" r="2"></circle>
        <circle cx="263.385" cy="242.243" r="2"></circle>
        <circle cx="215.385" cy="242.243" r="2"></circle>
        <circle cx="287.385" cy="122.243" r="2"></circle>
        <circle cx="239.385" cy="122.243" r="2"></circle>
        <circle cx="191.385" cy="122.243" r="2"></circle>
        <circle cx="167.385" cy="122.243" r="2"></circle>
        <circle cx="287.385" cy="170.243" r="2"></circle>
        <circle cx="287.385" cy="242.243" r="2"></circle>
        <circle cx="239.385" cy="170.243" r="2"></circle>
        <circle cx="191.385" cy="170.243" r="2"></circle>
        <circle cx="167.385" cy="170.243" r="2"></circle>
        <circle cx="239.385" cy="242.243" r="2"></circle>
        <circle cx="191.385" cy="242.243" r="2"></circle>
        <circle cx="167.385" cy="242.243" r="2"></circle>
        <circle cx="311.385" cy="146.243" r="2"></circle>
        <circle cx="311.385" cy="218.243" r="2"></circle>
        <circle cx="263.385" cy="146.243" r="2"></circle>
        <circle cx="215.385" cy="146.243" r="2"></circle>
        <circle cx="263.385" cy="218.243" r="2"></circle>
        <circle cx="215.385" cy="218.243" r="2"></circle>
        <circle cx="311.385" cy="194.243" r="2"></circle>
        <circle cx="311.385" cy="266.243" r="2"></circle>
        <circle cx="263.385" cy="194.243" r="2"></circle>
        <circle cx="215.385" cy="194.243" r="2"></circle>
        <circle cx="263.385" cy="266.243" r="2"></circle>
        <circle cx="215.385" cy="266.243" r="2"></circle>
        <circle cx="287.385" cy="146.243" r="2"></circle>
        <circle cx="287.385" cy="218.243" r="2"></circle>
        <circle cx="239.385" cy="146.243" r="2"></circle>
        <circle cx="191.385" cy="146.243" r="2"></circle>
        <circle cx="167.385" cy="146.243" r="2"></circle>
        <circle cx="239.385" cy="218.243" r="2"></circle>
        <circle cx="191.385" cy="218.243" r="2"></circle>
        <circle cx="167.385" cy="218.243" r="2"></circle>
        <circle cx="287.385" cy="194.243" r="2"></circle>
        <circle cx="287.385" cy="266.243" r="2"></circle>
        <circle cx="239.385" cy="194.243" r="2"></circle>
        <circle cx="191.385" cy="194.243" r="2"></circle>
        <circle cx="167.385" cy="194.243" r="2"></circle>
        <circle cx="239.385" cy="266.243" r="2"></circle>
        <circle cx="191.385" cy="266.243" r="2"></circle>
        <circle cx="167.385" cy="266.243" r="2"></circle>
        <circle cx="335.385" cy="122.243" r="2"></circle>
        <circle cx="335.385" cy="170.243" r="2"></circle>
        <circle cx="335.385" cy="242.243" r="2"></circle>
        <circle cx="335.385" cy="146.243" r="2"></circle>
        <circle cx="335.385" cy="218.243" r="2"></circle>
        <circle cx="335.385" cy="194.243" r="2"></circle>
        <circle cx="335.385" cy="266.243" r="2"></circle>
        <circle cx="143.385" cy="122.243" r="2"></circle>
        <circle cx="95.385" cy="122.243" r="2"></circle>
        <circle cx="47.385" cy="122.243" r="2"></circle>
        <circle cx="143.385" cy="170.243" r="2"></circle>
        <circle cx="143.385" cy="242.243" r="2"></circle>
        <circle cx="95.385" cy="170.243" r="2"></circle>
        <circle cx="47.385" cy="170.243" r="2"></circle>
        <circle cx="95.385" cy="242.243" r="2"></circle>
        <circle cx="47.385" cy="242.243" r="2"></circle>
        <circle cx="119.385" cy="122.243" r="2"></circle>
        <circle cx="71.385" cy="122.243" r="2"></circle>
        <circle cx="23.385" cy="122.243" r="2"></circle>
        <circle cx="119.385" cy="170.243" r="2"></circle>
        <circle cx="119.385" cy="242.243" r="2"></circle>
        <circle cx="71.385" cy="170.243" r="2"></circle>
        <circle cx="23.385" cy="170.243" r="2"></circle>
        <circle cx="71.385" cy="242.243" r="2"></circle>
        <circle cx="23.385" cy="242.243" r="2"></circle>
        <circle cx="143.385" cy="146.243" r="2"></circle>
        <circle cx="143.385" cy="218.243" r="2"></circle>
        <circle cx="95.385" cy="146.243" r="2"></circle>
        <circle cx="47.385" cy="146.243" r="2"></circle>
        <circle cx="95.385" cy="218.243" r="2"></circle>
        <circle cx="47.385" cy="218.243" r="2"></circle>
        <circle cx="143.385" cy="194.243" r="2"></circle>
        <circle cx="143.385" cy="266.243" r="2"></circle>
        <circle cx="95.385" cy="194.243" r="2"></circle>
        <circle cx="47.385" cy="194.243" r="2"></circle>
        <circle cx="95.385" cy="266.243" r="2"></circle>
        <circle cx="47.385" cy="266.243" r="2"></circle>
        <circle cx="119.385" cy="146.243" r="2"></circle>
        <circle cx="119.385" cy="218.243" r="2"></circle>
        <circle cx="71.385" cy="146.243" r="2"></circle>
        <circle cx="23.385" cy="146.243" r="2"></circle>
        <circle cx="71.385" cy="218.243" r="2"></circle>
        <circle cx="23.385" cy="218.243" r="2"></circle>
        <circle cx="119.385" cy="194.243" r="2"></circle>
        <circle cx="119.385" cy="266.243" r="2"></circle>
        <circle cx="71.385" cy="194.243" r="2"></circle>
        <circle cx="23.385" cy="194.243" r="2"></circle>
        <circle cx="71.385" cy="266.243" r="2"></circle>
        <circle cx="23.385" cy="266.243" r="2"></circle>
        <circle cx="311.385" cy="290.243" r="2"></circle>
        <circle cx="263.385" cy="290.243" r="2"></circle>
        <circle cx="215.385" cy="290.243" r="2"></circle>
        <circle cx="311.385" cy="338.243" r="2"></circle>
        <circle cx="311.385" cy="410.243" r="2"></circle>
        <circle cx="263.385" cy="338.243" r="2"></circle>
        <circle cx="215.385" cy="338.243" r="2"></circle>
        <circle cx="263.385" cy="410.243" r="2"></circle>
        <circle cx="215.385" cy="410.243" r="2"></circle>
        <circle cx="287.385" cy="290.243" r="2"></circle>
        <circle cx="239.385" cy="290.243" r="2"></circle>
        <circle cx="191.385" cy="290.243" r="2"></circle>
        <circle cx="167.385" cy="290.243" r="2"></circle>
        <circle cx="287.385" cy="338.243" r="2"></circle>
        <circle cx="287.385" cy="410.243" r="2"></circle>
        <circle cx="239.385" cy="338.243" r="2"></circle>
        <circle cx="191.385" cy="338.243" r="2"></circle>
        <circle cx="167.385" cy="338.243" r="2"></circle>
        <circle cx="239.385" cy="410.243" r="2"></circle>
        <circle cx="191.385" cy="410.243" r="2"></circle>
        <circle cx="167.385" cy="410.243" r="2"></circle>
        <circle cx="311.385" cy="314.243" r="2"></circle>
        <circle cx="311.385" cy="386.243" r="2"></circle>
        <circle cx="263.385" cy="314.243" r="2"></circle>
        <circle cx="215.385" cy="314.243" r="2"></circle>
        <circle cx="263.385" cy="386.243" r="2"></circle>
        <circle cx="215.385" cy="386.243" r="2"></circle>
        <circle cx="311.385" cy="362.243" r="2"></circle>
        <circle cx="311.385" cy="434.243" r="2"></circle>
        <circle cx="263.385" cy="362.243" r="2"></circle>
        <circle cx="215.385" cy="362.243" r="2"></circle>
        <circle cx="263.385" cy="434.243" r="2"></circle>
        <circle cx="215.385" cy="434.243" r="2"></circle>
        <circle cx="287.385" cy="314.243" r="2"></circle>
        <circle cx="287.385" cy="386.243" r="2"></circle>
        <circle cx="239.385" cy="314.243" r="2"></circle>
        <circle cx="191.385" cy="314.243" r="2"></circle>
        <circle cx="167.385" cy="314.243" r="2"></circle>
        <circle cx="239.385" cy="386.243" r="2"></circle>
        <circle cx="191.385" cy="386.243" r="2"></circle>
        <circle cx="167.385" cy="386.243" r="2"></circle>
        <circle cx="287.385" cy="362.243" r="2"></circle>
        <circle cx="287.385" cy="434.243" r="2"></circle>
        <circle cx="239.385" cy="362.243" r="2"></circle>
        <circle cx="191.385" cy="362.243" r="2"></circle>
        <circle cx="167.385" cy="362.243" r="2"></circle>
        <circle cx="239.385" cy="434.243" r="2"></circle>
        <circle cx="191.385" cy="434.243" r="2"></circle>
        <circle cx="167.385" cy="434.243" r="2"></circle>
        <circle cx="335.385" cy="290.243" r="2"></circle>
        <circle cx="335.385" cy="338.243" r="2"></circle>
        <circle cx="335.385" cy="410.243" r="2"></circle>
        <circle cx="335.385" cy="314.243" r="2"></circle>
        <circle cx="335.385" cy="386.243" r="2"></circle>
        <circle cx="335.385" cy="362.243" r="2"></circle>
        <circle cx="335.385" cy="434.243" r="2"></circle>
        <circle cx="311.385" cy="74.243" r="2"></circle>
        <circle cx="263.385" cy="74.243" r="2"></circle>
        <circle cx="215.385" cy="74.243" r="2"></circle>
        <circle cx="287.385" cy="74.243" r="2"></circle>
        <circle cx="239.385" cy="74.243" r="2"></circle>
        <circle cx="191.385" cy="74.243" r="2"></circle>
        <circle cx="167.385" cy="74.243" r="2"></circle>
        <circle cx="311.385" cy="50.243" r="2"></circle>
        <circle cx="263.385" cy="50.243" r="2"></circle>
        <circle cx="215.385" cy="50.243" r="2"></circle>
        <circle cx="311.385" cy="98.243" r="2"></circle>
        <circle cx="263.385" cy="98.243" r="2"></circle>
        <circle cx="215.385" cy="98.243" r="2"></circle>
        <circle cx="287.385" cy="50.243" r="2"></circle>
        <circle cx="239.385" cy="50.243" r="2"></circle>
        <circle cx="191.385" cy="50.243" r="2"></circle>
        <circle cx="167.385" cy="50.243" r="2"></circle>
        <circle cx="287.385" cy="98.243" r="2"></circle>
        <circle cx="239.385" cy="98.243" r="2"></circle>
        <circle cx="191.385" cy="98.243" r="2"></circle>
        <circle cx="167.385" cy="98.243" r="2"></circle>
        <circle cx="335.385" cy="74.243" r="2"></circle>
        <circle cx="335.385" cy="50.243" r="2"></circle>
        <circle cx="335.385" cy="98.243" r="2"></circle>
        <circle cx="143.385" cy="290.243" r="2"></circle>
        <circle cx="95.385" cy="290.243" r="2"></circle>
        <circle cx="47.385" cy="290.243" r="2"></circle>
        <circle cx="143.385" cy="338.243" r="2"></circle>
        <circle cx="143.385" cy="410.243" r="2"></circle>
        <circle cx="95.385" cy="338.243" r="2"></circle>
        <circle cx="47.385" cy="338.243" r="2"></circle>
        <circle cx="95.385" cy="410.243" r="2"></circle>
        <circle cx="47.385" cy="410.243" r="2"></circle>
        <circle cx="119.385" cy="290.243" r="2"></circle>
        <circle cx="71.385" cy="290.243" r="2"></circle>
        <circle cx="23.385" cy="290.243" r="2"></circle>
        <circle cx="119.385" cy="338.243" r="2"></circle>
        <circle cx="119.385" cy="410.243" r="2"></circle>
        <circle cx="71.385" cy="338.243" r="2"></circle>
        <circle cx="23.385" cy="338.243" r="2"></circle>
        <circle cx="71.385" cy="410.243" r="2"></circle>
        <circle cx="23.385" cy="410.243" r="2"></circle>
        <circle cx="143.385" cy="314.243" r="2"></circle>
        <circle cx="143.385" cy="386.243" r="2"></circle>
        <circle cx="95.385" cy="314.243" r="2"></circle>
        <circle cx="47.385" cy="314.243" r="2"></circle>
        <circle cx="95.385" cy="386.243" r="2"></circle>
        <circle cx="47.385" cy="386.243" r="2"></circle>
        <circle cx="143.385" cy="362.243" r="2"></circle>
        <circle cx="143.385" cy="434.243" r="2"></circle>
        <circle cx="95.385" cy="362.243" r="2"></circle>
        <circle cx="47.385" cy="362.243" r="2"></circle>
        <circle cx="95.385" cy="434.243" r="2"></circle>
        <circle cx="47.385" cy="434.243" r="2"></circle>
        <circle cx="119.385" cy="314.243" r="2"></circle>
        <circle cx="119.385" cy="386.243" r="2"></circle>
        <circle cx="71.385" cy="314.243" r="2"></circle>
        <circle cx="23.385" cy="314.243" r="2"></circle>
        <circle cx="71.385" cy="386.243" r="2"></circle>
        <circle cx="23.385" cy="386.243" r="2"></circle>
        <circle cx="119.385" cy="362.243" r="2"></circle>
        <circle cx="119.385" cy="434.243" r="2"></circle>
        <circle cx="71.385" cy="362.243" r="2"></circle>
        <circle cx="23.385" cy="362.243" r="2"></circle>
        <circle cx="71.385" cy="434.243" r="2"></circle>
        <circle cx="23.385" cy="434.243" r="2"></circle>
        <circle cx="143.385" cy="74.243" r="2"></circle>
        <circle cx="95.385" cy="74.243" r="2"></circle>
        <circle cx="47.385" cy="74.243" r="2"></circle>
        <circle cx="119.385" cy="74.243" r="2"></circle>
        <circle cx="71.385" cy="74.243" r="2"></circle>
        <circle cx="23.385" cy="74.243" r="2"></circle>
        <circle cx="143.385" cy="50.243" r="2"></circle>
        <circle cx="95.385" cy="50.243" r="2"></circle>
        <circle cx="47.385" cy="50.243" r="2"></circle>
        <circle cx="143.385" cy="98.243" r="2"></circle>
        <circle cx="95.385" cy="98.243" r="2"></circle>
        <circle cx="47.385" cy="98.243" r="2"></circle>
        <circle cx="119.385" cy="50.243" r="2"></circle>
        <circle cx="71.385" cy="50.243" r="2"></circle>
        <circle cx="23.385" cy="50.243" r="2"></circle>
        <circle cx="119.385" cy="98.243" r="2"></circle>
        <circle cx="71.385" cy="98.243" r="2"></circle>
        <circle cx="23.385" cy="98.243" r="2"></circle>
        <circle cx="311.385" cy="458.243" r="2"></circle>
        <circle cx="263.385" cy="458.243" r="2"></circle>
        <circle cx="215.385" cy="458.243" r="2"></circle>
        <circle cx="311.385" cy="506.243" r="2"></circle>
        <circle cx="263.385" cy="506.243" r="2"></circle>
        <circle cx="215.385" cy="506.243" r="2"></circle>
        <circle cx="287.385" cy="458.243" r="2"></circle>
        <circle cx="239.385" cy="458.243" r="2"></circle>
        <circle cx="191.385" cy="458.243" r="2"></circle>
        <circle cx="167.385" cy="458.243" r="2"></circle>
        <circle cx="287.385" cy="506.243" r="2"></circle>
        <circle cx="239.385" cy="506.243" r="2"></circle>
        <circle cx="191.385" cy="506.243" r="2"></circle>
        <circle cx="167.385" cy="506.243" r="2"></circle>
        <circle cx="311.385" cy="482.243" r="2"></circle>
        <circle cx="263.385" cy="482.243" r="2"></circle>
        <circle cx="215.385" cy="482.243" r="2"></circle>
        <circle cx="311.385" cy="530.243" r="2"></circle>
        <circle cx="263.385" cy="530.243" r="2"></circle>
        <circle cx="215.385" cy="530.243" r="2"></circle>
        <circle cx="287.385" cy="482.243" r="2"></circle>
        <circle cx="239.385" cy="482.243" r="2"></circle>
        <circle cx="191.385" cy="482.243" r="2"></circle>
        <circle cx="167.385" cy="482.243" r="2"></circle>
        <circle cx="287.385" cy="530.243" r="2"></circle>
        <circle cx="239.385" cy="530.243" r="2"></circle>
        <circle cx="191.385" cy="530.243" r="2"></circle>
        <circle cx="167.385" cy="530.243" r="2"></circle>
        <circle cx="335.385" cy="458.243" r="2"></circle>
        <circle cx="335.385" cy="506.243" r="2"></circle>
        <circle cx="335.385" cy="482.243" r="2"></circle>
        <circle cx="335.385" cy="530.243" r="2"></circle>
        <circle cx="143.385" cy="458.243" r="2"></circle>
        <circle cx="95.385" cy="458.243" r="2"></circle>
        <circle cx="47.385" cy="458.243" r="2"></circle>
        <circle cx="143.385" cy="506.243" r="2"></circle>
        <circle cx="95.385" cy="506.243" r="2"></circle>
        <circle cx="47.385" cy="506.243" r="2"></circle>
        <circle cx="119.385" cy="458.243" r="2"></circle>
        <circle cx="71.385" cy="458.243" r="2"></circle>
        <circle cx="23.385" cy="458.243" r="2"></circle>
        <circle cx="119.385" cy="506.243" r="2"></circle>
        <circle cx="71.385" cy="506.243" r="2"></circle>
        <circle cx="23.385" cy="506.243" r="2"></circle>
        <circle cx="143.385" cy="482.243" r="2"></circle>
        <circle cx="95.385" cy="482.243" r="2"></circle>
        <circle cx="47.385" cy="482.243" r="2"></circle>
        <circle cx="143.385" cy="530.243" r="2"></circle>
        <circle cx="95.385" cy="530.243" r="2"></circle>
        <circle cx="47.385" cy="530.243" r="2"></circle>
        <circle cx="119.385" cy="482.243" r="2"></circle>
        <circle cx="71.385" cy="482.243" r="2"></circle>
        <circle cx="23.385" cy="482.243" r="2"></circle>
        <circle cx="119.385" cy="530.243" r="2"></circle>
        <circle cx="71.385" cy="530.243" r="2"></circle>
        <circle cx="23.385" cy="530.243" r="2"></circle>
        <circle cx="407.5" cy="122.243" r="2"></circle>
        <circle cx="359.5" cy="122.243" r="2"></circle>
        <circle cx="407.5" cy="170.243" r="2"></circle>
        <circle cx="359.5" cy="170.243" r="2"></circle>
        <circle cx="407.5" cy="242.243" r="2"></circle>
        <circle cx="359.5" cy="242.243" r="2"></circle>
        <circle cx="431.5" cy="122.243" r="2"></circle>
        <circle cx="383.5" cy="122.243" r="2"></circle>
        <circle cx="431.5" cy="170.243" r="2"></circle>
        <circle cx="431.5" cy="242.243" r="2"></circle>
        <circle cx="383.5" cy="170.243" r="2"></circle>
        <circle cx="383.5" cy="242.243" r="2"></circle>
        <circle cx="407.5" cy="146.243" r="2"></circle>
        <circle cx="359.5" cy="146.243" r="2"></circle>
        <circle cx="407.5" cy="218.243" r="2"></circle>
        <circle cx="359.5" cy="218.243" r="2"></circle>
        <circle cx="407.5" cy="194.243" r="2"></circle>
        <circle cx="359.5" cy="194.243" r="2"></circle>
        <circle cx="407.5" cy="266.243" r="2"></circle>
        <circle cx="359.5" cy="266.243" r="2"></circle>
        <circle cx="431.5" cy="146.243" r="2"></circle>
        <circle cx="431.5" cy="218.243" r="2"></circle>
        <circle cx="383.5" cy="146.243" r="2"></circle>
        <circle cx="383.5" cy="218.243" r="2"></circle>
        <circle cx="431.5" cy="194.243" r="2"></circle>
        <circle cx="431.5" cy="266.243" r="2"></circle>
        <circle cx="383.5" cy="194.243" r="2"></circle>
        <circle cx="383.5" cy="266.243" r="2"></circle>
        <circle cx="407.5" cy="290.243" r="2"></circle>
        <circle cx="359.5" cy="290.243" r="2"></circle>
        <circle cx="407.5" cy="338.243" r="2"></circle>
        <circle cx="359.5" cy="338.243" r="2"></circle>
        <circle cx="407.5" cy="410.243" r="2"></circle>
        <circle cx="359.5" cy="410.243" r="2"></circle>
        <circle cx="431.5" cy="290.243" r="2"></circle>
        <circle cx="383.5" cy="290.243" r="2"></circle>
        <circle cx="431.5" cy="338.243" r="2"></circle>
        <circle cx="431.5" cy="410.243" r="2"></circle>
        <circle cx="383.5" cy="338.243" r="2"></circle>
        <circle cx="383.5" cy="410.243" r="2"></circle>
        <circle cx="407.5" cy="314.243" r="2"></circle>
        <circle cx="359.5" cy="314.243" r="2"></circle>
        <circle cx="407.5" cy="386.243" r="2"></circle>
        <circle cx="359.5" cy="386.243" r="2"></circle>
        <circle cx="407.5" cy="362.243" r="2"></circle>
        <circle cx="359.5" cy="362.243" r="2"></circle>
        <circle cx="407.5" cy="434.243" r="2"></circle>
        <circle cx="359.5" cy="434.243" r="2"></circle>
        <circle cx="431.5" cy="314.243" r="2"></circle>
        <circle cx="431.5" cy="386.243" r="2"></circle>
        <circle cx="383.5" cy="314.243" r="2"></circle>
        <circle cx="383.5" cy="386.243" r="2"></circle>
        <circle cx="431.5" cy="362.243" r="2"></circle>
        <circle cx="431.5" cy="434.243" r="2"></circle>
        <circle cx="383.5" cy="362.243" r="2"></circle>
        <circle cx="383.5" cy="434.243" r="2"></circle>
        <circle cx="407.5" cy="74.243" r="2"></circle>
        <circle cx="359.5" cy="74.243" r="2"></circle>
        <circle cx="431.5" cy="74.243" r="2"></circle>
        <circle cx="383.5" cy="74.243" r="2"></circle>
        <circle cx="407.5" cy="50.243" r="2"></circle>
        <circle cx="359.5" cy="50.243" r="2"></circle>
        <circle cx="407.5" cy="98.243" r="2"></circle>
        <circle cx="359.5" cy="98.243" r="2"></circle>
        <circle cx="431.5" cy="50.243" r="2"></circle>
        <circle cx="383.5" cy="50.243" r="2"></circle>
        <circle cx="431.5" cy="98.243" r="2"></circle>
        <circle cx="383.5" cy="98.243" r="2"></circle>
        <circle cx="407.5" cy="458.243" r="2"></circle>
        <circle cx="359.5" cy="458.243" r="2"></circle>
        <circle cx="407.5" cy="506.243" r="2"></circle>
        <circle cx="359.5" cy="506.243" r="2"></circle>
        <circle cx="431.5" cy="458.243" r="2"></circle>
        <circle cx="383.5" cy="458.243" r="2"></circle>
        <circle cx="431.5" cy="506.243" r="2"></circle>
        <circle cx="383.5" cy="506.243" r="2"></circle>
        <circle cx="407.5" cy="482.243" r="2"></circle>
        <circle cx="359.5" cy="482.243" r="2"></circle>
        <circle cx="407.5" cy="530.243" r="2"></circle>
        <circle cx="359.5" cy="530.243" r="2"></circle>
        <circle cx="431.5" cy="482.243" r="2"></circle>
        <circle cx="383.5" cy="482.243" r="2"></circle>
        <circle cx="431.5" cy="530.243" r="2"></circle>
        <circle cx="383.5" cy="530.243" r="2"></circle>
      </g>
      <SelectedIllustration />
      <g style={{ display: 'none' }}>
        <NextIllustration />
      </g>
    </svg>
  )
}

export default Illustration
