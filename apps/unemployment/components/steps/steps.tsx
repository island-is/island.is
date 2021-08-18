import React from 'react'
import { UnemploymentStep } from "./../../entities/enums/unemployment-step.enum";
import {
    FormStepper
} from '@island.is/island-ui/core'
interface Props {
    step: UnemploymentStep
}

const Steps: React.FC<Props> = ({ step }) => {
    // TODO: List up steps and set the active step
    console.log(step)
    return <div className="step active">
        <FormStepper theme="blue"
            sections={[{
                name: 'Samskipti'
            }, {
                name: 'Atvinnulok'
            }, {
                name: 'Fylgigögn'
            }, {
                name: 'Börn'
            }, {
                name: 'Uppgjör'
            },
            {
                name: 'Lífeyrir'
            },
            {
                name: 'Persónuafsláttur'
            },
            {
                name: 'Fjármagnstekjur'
            },
            {
                name: 'Launaupplýsingar'
            },
            {
                name: 'Viðbótarupplýsingar'
            },
            {
                name: 'Sundurliðun'
            }]} />
    </div>
}

export default Steps