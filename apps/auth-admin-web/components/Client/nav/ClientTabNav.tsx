import React from 'react'
import { ClientTab } from '../../../entities/common/ClientTab'
import HelpBox from '../../common/HelpBox'

interface Props {
  handleTabChange: (tab: ClientTab) => void
  activeTab?: ClientTab
}

const ClientTabNav: React.FC<Props> = ({
  handleTabChange: handleTabChange,
  activeTab: activetab,
  children,
}) => {
  return (
    <div className="client-tab-nav">
      <nav className="client-tab-nav__nav">
        <ul>
          <li className={activetab === ClientTab.BasicForm ? 'active' : ''}>
            <button
              type="button"
              onClick={() => handleTabChange(ClientTab.BasicForm)}
              className={activetab === ClientTab.BasicForm ? 'active' : ''}
              title="Simple form for easily creating a client"
            >
              Simple Form
            </button>
          </li>
          <li className={activetab === ClientTab.DetailedForm ? 'active' : ''}>
            <button
              type="button"
              onClick={() => handleTabChange(ClientTab.DetailedForm)}
              className={activetab === ClientTab.DetailedForm ? 'active' : ''}
              title="Detailed form for creating a client"
            >
              Detailed form
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
