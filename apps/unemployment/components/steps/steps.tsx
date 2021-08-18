import React from 'react'
import { UnemploymentStep } from "./../../entities/enums/unemployment-step.enum";
import {
    FormStepper
} from '@island.is/island-ui/core'
import { stepState } from "../../utils/state";
import { useRecoilState } from "recoil";

interface Props {
    step: UnemploymentStep
}

const Steps: React.FC<Props> = ({ step }) => {
    // TODO: List up steps and set the active step
    const [steps,] = useRecoilState(stepState);

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
            }]} activeSection={steps - 1} />
    </div>
}

export default Steps