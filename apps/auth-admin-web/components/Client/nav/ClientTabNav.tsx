import React, { useState } from 'react'
import { ClientTab } from '../../../entities/common/ClientTab'
import LocalizationUtils from '../../../utils/localization.utils'
import { Localization } from '../../../entities/common/Localization'

interface Props {
  handleTabChange: (tab: ClientTab) => void
  activeTab?: ClientTab
}

const ClientTabNav: React.FC<React.PropsWithChildren<Props>> = ({
  handleTabChange,
  activeTab: activetab,
  children,
}) => {
  const [localization] = useState<Localization>(
    LocalizationUtils.getLocalization(),
  )
  return (
    <div className="client-tab-nav">
      <nav className="client-tab-nav__nav">
        <ul>
          <li className={activetab === ClientTab.BasicForm ? 'active' : ''}>
            <button
              type="button"
              onClick={() => handleTabChange(ClientTab.BasicForm)}
              className={activetab === ClientTab.BasicForm ? 'active' : ''}
              title={
                localization.navigations['clientTabNav'].items['basicForm']
                  .title
              }
            >
              {localization.navigations['clientTabNav'].items['basicForm'].text}
            </button>
          </li>
          <li className={activetab === ClientTab.DetailedForm ? 'active' : ''}>
            <button
              type="button"
              onClick={() => handleTabChange(ClientTab.DetailedForm)}
              className={activetab === ClientTab.DetailedForm ? 'active' : ''}
              title={
                localization.navigations['clientTabNav'].items['detailedForm']
                  .title
              }
            >
              {
                localization.navigations['clientTabNav'].items['detailedForm']
                  .text
              }
            </button>
          </li>
        </ul>
      </nav>
      <div className="client-tab-nav__container__help">
        Use either the simplified form or the detailed form to create a new
        client
        <div className="client-tab-nav__container__help__selected">
          {activetab === ClientTab.BasicForm
            ? 'You are using the simplified form'
            : 'You are using the detailed form'}
        </div>
      </div>

      <div className="client-tab-nav__container__content">{children}</div>
    </div>
  )
}

export default ClientTabNav
