import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import { causeAndConsequences } from '../../lib/messages'
import { Option } from '../Components/types'
import { WorkAccidentNotification } from '../../lib/dataSchema'
import { CausesAndEffects } from '../Components/CausesAndEffects'

export type OptionAndKey = {
  option: Option
  key: string
}

export const Circumstance: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { application } = props
  const answers = application.answers as WorkAccidentNotification

  return (
    <CausesAndEffects
      externalDataKey={'aoshData.data.specificPhysicalActivity'}
      heading={causeAndConsequences.circumstances.heading}
      subHeading={causeAndConsequences.circumstances.subHeading}
      answerId={'circumstances.physicalActivities'}
      mostSeriousAnswerId={'circumstances.physicalActivitiesMostSerious'}
      screenId={'circumstances'}
      mostSeriousAnswer={
        (answers?.circumstances?.physicalActivitiesMostSerious as string) || ''
      }
      {...props}
    />
  )

  // const { application } = props
  // const answers = application.answers as WorkAccidentNotification
  // const { setValue } = useFormContext()
  // const { formatMessage } = useLocale()
  // const [mostSerious, setMostSeriousList] = useState<Option[]>([])
  // const [mostSeriousChosen, setMostSeriousChosen] = useState<string>(
  //   answers?.circumstances?.physicialActivitiesMostSerious || '',
  // )
  // const [pickedValue, setPickedValue] = useState<OptionAndKey>()
  // const activityGroups = (
  //   getValueViaPath(
  //     application.externalData,
  //     'aoshData.data.specificPhysicalActivity',
  //   ) as Group[]
  // ).filter((group) => !group.validToSelect)
  // const activites = (
  //   getValueViaPath(
  //     application.externalData,
  //     'aoshData.data.specificPhysicalActivity',
  //   ) as Item[]
  // ).filter((group) => group.validToSelect)

  // const onChange = (answers: OptionWithKey) => {
  //   const options: Option[] = []
  //   for (const key in answers) {
  //     answers[key].forEach((option) => {
  //       options.push(option)
  //     })
  //   }
  //   setMostSeriousList(options)
  // }

  // // TODO(balli) Need to cover case where user chooses a most serious circumstance and then removes that option from the list
  // return (
  //   <Box>
  //     <Box marginBottom={2} marginTop={2}>
  //       <Controller
  //         render={() => {
  //           return (
  //             <Select
  //               name=""
  //               options={activites.map((activity) => ({
  //                 value: activity.code,
  //                 label: activity.name,
  //               }))}
  //               backgroundColor="blue"
  //               placeholder={formatMessage(
  //                 causeAndConsequences.shared.searchPlaceholder,
  //               )}
  //               onChange={(value) => {
  //                 const code = value?.value.substring(0, 1)
  //                 const activity: Option = {
  //                   value: value?.value || '',
  //                   label: value?.label || '',
  //                 }
  //                 if (!code) return
  //                 setPickedValue({
  //                   option: activity,
  //                   key: code,
  //                 })
  //               }}
  //               icon="search"
  //             />
  //           )
  //         }}
  //         name={'searchBar.circumstance'}
  //       />
  //     </Box>
  //     <Box>
  //       <Text variant="h4" marginBottom={1}>
  //         {formatMessage(causeAndConsequences.circumstances.heading)}
  //       </Text>
  //       <Text variant="small">
  //         {formatMessage(causeAndConsequences.circumstances.subHeading)}
  //       </Text>
  //     </Box>
  //     <Box>
  //       <MultiSelectDropdownController
  //         onAnswerChange={onChange}
  //         groups={activityGroups}
  //         items={activites}
  //         pickedValue={pickedValue}
  //         answerId="circumstances.physicalActivities"
  //         {...props}
  //       />
  //     </Box>
  //     {mostSerious.length > 0 ? (
  //       <Box marginTop={2} border="standard" padding={4}>
  //         <Box marginBottom={2}>
  //           <AlertMessage
  //             type="warning"
  //             message={'Hakaðu við það sem þú telur að sé alvarlegast.'}
  //           />
  //         </Box>
  //         <Box>
  //           {mostSerious.map((item, index) => {
  //             return (
  //               <Box marginBottom={1}>
  //                 <RadioButton
  //                   id={`${item.label}-${index}-radio`}
  //                   name={`most serious-${index}`}
  //                   label={item.label}
  //                   value={item.value}
  //                   checked={item.value === mostSeriousChosen}
  //                   //error={errors && getErrorViaPath(errors, operatesWithinEuropeField)}
  //                   backgroundColor="white"
  //                   onChange={(e) => {
  //                     setMostSeriousChosen(e.target.value)
  //                     setValue(
  //                       'circumstances.physicalActivitiesMostSerious',
  //                       e.target.value,
  //                     )
  //                   }}
  //                 />
  //               </Box>
  //             )
  //           })}
  //         </Box>
  //       </Box>
  //     ) : null}
  //   </Box>
  // )
}
