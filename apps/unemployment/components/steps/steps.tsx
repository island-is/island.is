import React from 'react'
import { UnemploymentStep } from "./../../entities/enums/unemployment-step.enum";

interface Props {
    step: UnemploymentStep
}

const Steps: React.FC<Props> = ({step}) => {
    // TODO: List up steps and set the active step
    return <div className="step active"></div>
}

export default Steps