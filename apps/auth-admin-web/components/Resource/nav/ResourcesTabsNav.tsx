import React from 'react';
import { ResourceTabs } from '../../../entities/common/ResourceTabs';

interface Props {
    handleStepChange: (step: ResourceTabs) => void;
    activeStep: ResourceTabs;
}

const ResourcesTabsNav: React.FC<Props> = ({ handleStepChange, activeStep, children }) => {
    return <div><nav className="resource-tab-nav">
        <ul>
            <li><a onClick={() => handleStepChange(ResourceTabs.ApiScopes)}  className={activeStep === ResourceTabs.ApiScopes ? 'active' : ''}>Api scopes</a></li>
            <li><a onClick={() => handleStepChange(ResourceTabs.ApiResourceScopes)} className={activeStep === ResourceTabs.ApiResourceScopes ? 'active' : ''}>Api resources</a></li>
            <li><a onClick={() => handleStepChange(ResourceTabs.IdentityResource)} className={activeStep === ResourceTabs.IdentityResource ? 'active' : ''}>Identity Resource</a></li>
        </ul>
    </nav>
    <div className="resource-tab-nav__container__content">{children}</div>
    </div>
}

export default ResourcesTabsNav;