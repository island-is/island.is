import { Fragment, useState } from 'react'
import ReactHtmlParser from 'react-html-parser'
import { useIntl } from 'react-intl'

import {
  Accordion,
  AccordionItem,
  Box,
  Bullet,
  BulletList,
  Text,
} from '@island.is/island-ui/core'
import { Table as T } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { SecondarySchoolProgrammeByIdQuery } from '@island.is/web/graphql/schema'

import { m } from '../../messages/messages'

interface DetailContentProps {
  programme: SecondarySchoolProgrammeByIdQuery['secondarySchoolProgrammeById']
}

export const DetailContent = ({ programme }: DetailContentProps) => {
  const [isOpen, setIsOpen] = useState({
    admissionRequirements: false,
    studyStructure: false,
    assessment: false,
    competenceCriteria: false,
    coursesLevelsUnits: false,
  })
  const { formatMessage } = useIntl()

  const toggleIsOpen = (key: keyof typeof isOpen) => {
    setIsOpen((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <Box>
      <Box marginBottom={4}>
        <Text variant="h2" as="h3" marginBottom={2}>
          {formatMessage(m.details.aboutProgramme)}
        </Text>
      </Box>

      <Accordion
        singleExpand={false}
        dividerOnTop={false}
        dividerOnBottom={false}
      >
        <AccordionItem
          id="admission-requirements"
          label={formatMessage(m.details.admissionRequirements)}
          labelUse="p"
          labelVariant="h3"
          iconVariant="default"
          expanded={isOpen.admissionRequirements}
          onToggle={() => toggleIsOpen('admissionRequirements')}
        >
          <Box>
            <Text>{programme.admissionRequirements?.freeText}</Text>
          </Box>
        </AccordionItem>

        <AccordionItem
          id="study-structure"
          label={formatMessage(m.details.studyStructure)}
          labelUse="p"
          labelVariant="h3"
          iconVariant="default"
          expanded={isOpen.studyStructure}
          onToggle={() => toggleIsOpen('studyStructure')}
        >
          <Box>
            <Text>{programme.structureDescription}</Text>
          </Box>
        </AccordionItem>

        <AccordionItem
          id="academic-evaluation"
          label={formatMessage(m.details.assessment)}
          labelUse="p"
          labelVariant="h3"
          iconVariant="default"
          expanded={isOpen.assessment}
          onToggle={() => toggleIsOpen('assessment')}
        >
          <Box>
            <Text>{programme.academicEvaluation}</Text>
          </Box>
        </AccordionItem>

        <AccordionItem
          id="competence-criteria"
          label={formatMessage(m.details.competenceCriteria)}
          labelUse="p"
          labelVariant="h3"
          iconVariant="default"
          expanded={isOpen.competenceCriteria}
          onToggle={() => toggleIsOpen('competenceCriteria')}
        >
          <Box>
            <Text marginBottom={2}>
              {formatMessage(m.details.competencyCriteriaIntro)}
            </Text>
            {programme.competencyCriteria &&
              programme.competencyCriteria.length > 0 && (
                <BulletList type="ul">
                  {programme.competencyCriteria.map((criterion, index) => (
                    <Bullet key={index}>{criterion}</Bullet>
                  ))}
                </BulletList>
              )}
          </Box>
        </AccordionItem>

        <AccordionItem
          id="courses-levels-units"
          label={formatMessage(m.details.coursesLevelsUnits)}
          labelUse="p"
          labelVariant="h3"
          iconVariant="default"
          expanded={isOpen.coursesLevelsUnits}
          onToggle={() => toggleIsOpen('coursesLevelsUnits')}
        >
          <Box>
            {!programme.programmeStructure ? (
              <Text>{formatMessage(m.details.coursesLevelsUnits)}</Text>
            ) : (
              <T.Table>
                <T.Head>
                  <T.Row>
                    <T.HeadData>
                      {formatMessage(m.details.subjectName)}
                    </T.HeadData>
                    <T.HeadData style={{ textAlign: 'right' }}>
                      <Box display={['none', 'none', 'block']}>
                        {formatMessage(m.details.level1)}
                      </Box>
                      <Box display={['block', 'block', 'none']}>
                        {formatMessage(m.details.level1Mobile)}
                      </Box>
                    </T.HeadData>
                    <T.HeadData style={{ textAlign: 'right' }}>
                      <Box display={['none', 'none', 'block']}>
                        {formatMessage(m.details.level2)}
                      </Box>
                      <Box display={['block', 'block', 'none']}>
                        {formatMessage(m.details.level2Mobile)}
                      </Box>
                    </T.HeadData>
                    <T.HeadData style={{ textAlign: 'right' }}>
                      <Box display={['none', 'none', 'block']}>
                        {formatMessage(m.details.level3)}
                      </Box>
                      <Box display={['block', 'block', 'none']}>
                        {formatMessage(m.details.level3Mobile)}
                      </Box>
                    </T.HeadData>
                    <T.HeadData style={{ textAlign: 'right' }}>
                      <Box display={['none', 'none', 'block']}>
                        {formatMessage(m.details.level4)}
                      </Box>
                      <Box display={['block', 'block', 'none']}>
                        {formatMessage(m.details.level4Mobile)}
                      </Box>
                    </T.HeadData>
                    <T.HeadData style={{ textAlign: 'right' }}>
                      {formatMessage(m.details.units)}
                    </T.HeadData>
                  </T.Row>
                </T.Head>
                <T.Body>
                  {/* Core Subject Groups */}
                  {programme.programmeStructure.coreSubjectGroups?.map(
                    (group, groupIndex) => {
                      const groupTotalCredits =
                        group.subjects?.reduce(
                          (sum, subject) => sum + (subject.credits || 0),
                          0,
                        ) || 0

                      return (
                        <Fragment key={`core-fragment-${groupIndex}`}>
                          <T.Row key={`core-group-${groupIndex}`}>
                            <T.Data colSpan={5}>
                              <Text variant="small" color="dark300">
                                {group.title
                                  ? group.title
                                  : formatMessage(m.details.coreSubjects)}
                              </Text>
                            </T.Data>
                            <T.Data colSpan={1} style={{ textAlign: 'right' }}>
                              <Text variant="small" color="dark300">
                                {groupTotalCredits}{' '}
                                {formatMessage(m.details.credits)}
                              </Text>
                            </T.Data>
                          </T.Row>
                          {group.subjects?.map((subject, subjectIndex) => {
                            const isLastSubject =
                              subjectIndex === (group.subjects?.length || 0) - 1
                            const borderStyle = isLastSubject
                              ? {
                                  borderBottom: `2px solid ${theme.color.borderPrimaryContrast}`,
                                }
                              : {}
                            return (
                              <T.Row
                                key={`core-subject-${groupIndex}-${subjectIndex}`}
                              >
                                <T.Data style={borderStyle}>
                                  <Text variant="eyebrow">{subject.name}</Text>
                                </T.Data>
                                <T.Data
                                  style={{ textAlign: 'right', ...borderStyle }}
                                >
                                  {subject.level1 || '-'}
                                </T.Data>
                                <T.Data
                                  style={{ textAlign: 'right', ...borderStyle }}
                                >
                                  {subject.level2 || '-'}
                                </T.Data>
                                <T.Data
                                  style={{ textAlign: 'right', ...borderStyle }}
                                >
                                  {subject.level3 || '-'}
                                </T.Data>
                                <T.Data
                                  style={{ textAlign: 'right', ...borderStyle }}
                                >
                                  {subject.level4 || '-'}
                                </T.Data>
                                <T.Data
                                  style={{ textAlign: 'right', ...borderStyle }}
                                >
                                  {subject.credits || '-'}
                                </T.Data>
                              </T.Row>
                            )
                          })}
                        </Fragment>
                      )
                    },
                  )}
                  {/* Package Choices */}
                  {programme.programmeStructure.packageChoices?.map(
                    (choice, choiceIndex) => {
                      return (
                        <Fragment
                          key={`package-choice-fragment-${choiceIndex}`}
                        >
                          {choice.requiredPackages !== undefined &&
                            choice.packages &&
                            choice.packages.length > 1 && (
                              <T.Row key={`package-choice-${choiceIndex}`}>
                                <T.Data colSpan={6}>
                                  <Text variant="small" color="dark300">
                                    {formatMessage(m.details.chooseXofY, {
                                      required: choice.requiredPackages,
                                      total: choice.packages.length,
                                    })}
                                  </Text>
                                </T.Data>
                              </T.Row>
                            )}
                          {choice.packages?.map((pkg, pkgIndex) => {
                            const isLastPackage =
                              pkgIndex === (choice.packages?.length || 0) - 1
                            const pkgTotalCredits =
                              pkg.subjects?.reduce(
                                (sum, subject) => sum + (subject.credits || 0),
                                0,
                              ) || 0
                            return (
                              <Fragment
                                key={`package-${choiceIndex}-${pkgIndex}`}
                              >
                                {pkg.title && (
                                  <T.Row
                                    key={`package-${choiceIndex}-${pkgIndex}`}
                                  >
                                    <T.Data
                                      colSpan={5}
                                      style={{ paddingLeft: '24px' }}
                                    >
                                      <Text variant="small" color="dark300">
                                        {pkg.title}
                                      </Text>
                                    </T.Data>
                                    <T.Data
                                      colSpan={1}
                                      style={{ textAlign: 'right' }}
                                    >
                                      <Text variant="small" color="dark300">
                                        {pkgTotalCredits}{' '}
                                        {formatMessage(m.details.credits)}
                                      </Text>
                                    </T.Data>
                                  </T.Row>
                                )}
                                {pkg.subjects?.map((subject, subjectIndex) => {
                                  const isLastSubject =
                                    subjectIndex ===
                                      (pkg.subjects?.length || 0) - 1 &&
                                    isLastPackage
                                  const borderStyle = isLastSubject
                                    ? { borderBottom: '2px solid #0061FF' }
                                    : {}
                                  return (
                                    <T.Row
                                      key={`package-subject-${choiceIndex}-${pkgIndex}-${subjectIndex}`}
                                    >
                                      <T.Data
                                        style={{
                                          paddingLeft: '32px',
                                          ...borderStyle,
                                        }}
                                      >
                                        <Text variant="eyebrow">
                                          {subject.name}
                                        </Text>
                                      </T.Data>
                                      <T.Data
                                        style={{
                                          textAlign: 'right',
                                          ...borderStyle,
                                        }}
                                      >
                                        {subject.level1 || '-'}
                                      </T.Data>
                                      <T.Data
                                        style={{
                                          textAlign: 'right',
                                          ...borderStyle,
                                        }}
                                      >
                                        {subject.level2 || '-'}
                                      </T.Data>
                                      <T.Data
                                        style={{
                                          textAlign: 'right',
                                          ...borderStyle,
                                        }}
                                      >
                                        {subject.level3 || '-'}
                                      </T.Data>
                                      <T.Data
                                        style={{
                                          textAlign: 'right',
                                          ...borderStyle,
                                        }}
                                      >
                                        {subject.level4 || '-'}
                                      </T.Data>
                                      <T.Data
                                        style={{
                                          textAlign: 'right',
                                          ...borderStyle,
                                        }}
                                      >
                                        {subject.credits || '-'}
                                      </T.Data>
                                    </T.Row>
                                  )
                                })}
                              </Fragment>
                            )
                          })}
                        </Fragment>
                      )
                    },
                  )}

                  {/* Subject Choice Groups */}
                  {programme.programmeStructure.subjectChoiceGroups?.map(
                    (group, groupIndex) => {
                      const groupTotalCredits =
                        group.subjects?.reduce(
                          (sum, subject) => sum + (subject.credits || 0),
                          0,
                        ) || 0

                      return (
                        <Fragment key={`subject-choice-fragment-${groupIndex}`}>
                          {group.requiredCredits !== undefined && (
                            <T.Row key={`choice-group-${groupIndex}`}>
                              <T.Data colSpan={5}>
                                <Text variant="small" color="dark300">
                                  {formatMessage(
                                    m.details.subjectChoiceGroupsSubtitle,
                                  )}
                                </Text>
                              </T.Data>
                              <T.Data
                                colSpan={1}
                                style={{ textAlign: 'right' }}
                              >
                                <Text variant="small" color="dark300">
                                  {formatMessage(m.details.XofYCredits, {
                                    required: group.requiredCredits,
                                    total: groupTotalCredits,
                                  })}
                                </Text>
                              </T.Data>
                            </T.Row>
                          )}
                          {group.subjects?.map((subject, subjectIndex) => {
                            const isLastSubject =
                              subjectIndex === (group.subjects?.length || 0) - 1
                            const borderStyle = isLastSubject
                              ? { borderBottom: '2px solid #0061FF' }
                              : {}
                            return (
                              <T.Row
                                key={`choice-subject-${groupIndex}-${subjectIndex}`}
                              >
                                <T.Data style={borderStyle}>
                                  <Text variant="eyebrow">{subject.name}</Text>
                                </T.Data>
                                <T.Data
                                  style={{ textAlign: 'right', ...borderStyle }}
                                >
                                  {subject.level1 || '-'}
                                </T.Data>
                                <T.Data
                                  style={{ textAlign: 'right', ...borderStyle }}
                                >
                                  {subject.level2 || '-'}
                                </T.Data>
                                <T.Data
                                  style={{ textAlign: 'right', ...borderStyle }}
                                >
                                  {subject.level3 || '-'}
                                </T.Data>
                                <T.Data
                                  style={{ textAlign: 'right', ...borderStyle }}
                                >
                                  {subject.level4 || '-'}
                                </T.Data>
                                <T.Data
                                  style={{ textAlign: 'right', ...borderStyle }}
                                >
                                  {subject.credits || '-'}
                                </T.Data>
                              </T.Row>
                            )
                          })}
                        </Fragment>
                      )
                    },
                  )}

                  {/* Free Choice */}
                  {programme.freeChoiceDescription && (
                    <T.Row key="free-choice">
                      <T.Data colSpan={5}>
                        <Box>
                          <Text
                            variant="small"
                            color="dark300"
                            marginBottom={1}
                          >
                            {formatMessage(m.details.freeChoice)}
                          </Text>
                          <Box />
                          {ReactHtmlParser(
                            programme.freeChoiceDescription.replaceAll(
                              '\n',
                              '<br/>',
                            ),
                          )}
                        </Box>
                      </T.Data>
                    </T.Row>
                  )}
                </T.Body>
              </T.Table>
            )}
          </Box>
        </AccordionItem>
      </Accordion>
    </Box>
  )
}
