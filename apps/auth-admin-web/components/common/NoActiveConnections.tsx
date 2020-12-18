import React from 'react';

interface Props {
  title: string;
  helpText: string;
  show: boolean;
}

const NoActiveConnections: React.FC<Props> = ({show, title, helpText, children}) => {

    if (!show){
        return "";
    }

    return <div className="no-active-connections">
        <h3>{title}</h3>
        <div className="no-active-connections__help"><i className="icon__info"></i>{helpText}</div>
        {children}
    </div>
}
export default NoActiveConnections;