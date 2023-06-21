import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import { Box, Divider } from '@island.is/island-ui/core'
import { ApplicantReview } from './ApplicantReview'
import { ChildrenReview } from './ChildrenReview'
import { ResidencyConditionReview } from './ResidencyConditionReview'
import { ParentsReview } from './ParentsReview'
import { MaritalStatusReview } from './MaritalStatusReview'
import { ResidencyReview } from './ResidencyReview'
import { DocumentReview } from './DocumentReview'
import { StaysAbroadReview } from './StaysAbroadReview'


export const Review: FC<FieldBaseProps> = (props) => {
  return (
    <Box>
        <Divider></Divider>
        <ApplicantReview 
            field={props.field}
            application={props.application}
        />
        <Divider></Divider>
        <ChildrenReview 
            field={props.field}
            application={props.application}
        />
        <Divider></Divider>
        <ResidencyConditionReview 
            field={props.field}
            application={props.application}
        />
        <Divider></Divider>
        <ParentsReview 
            field={props.field}
            application={props.application}
        />
        <Divider></Divider>
        <MaritalStatusReview 
            field={props.field}
            application={props.application}
        />
        <Divider></Divider>
        <ResidencyReview 
            field={props.field}
            application={props.application}
        />
        <Divider></Divider>
        <StaysAbroadReview
            field={props.field}
            application={props.application}
        />
        <Divider></Divider>
        <DocumentReview 
            field={props.field}
            application={props.application}
        />
    </Box>
  )
}
