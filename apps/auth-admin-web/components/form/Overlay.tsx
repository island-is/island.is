import React, { useState, useEffect } from 'react';

interface Props {
  handleButtonClosed?: () => void;
  title?: string;
  showOverlay: boolean
}

const Overlay: React.FC<Props> = ({ handleButtonClosed, title, showOverlay, children }) => {
    const [show, setShow] = useState<boolean>(false);
  return (
    <div className={`overlay ${show ? "show" : "hidden"}`}>
      <h3 className={`overlay-content ${title ? "show": "hidden"}`}>{title}</h3>
      <div className="step-end__container__form">
        <div className="step-end__content">{children}</div>
      </div>
    </div>
  );
};

export default Overlay;
