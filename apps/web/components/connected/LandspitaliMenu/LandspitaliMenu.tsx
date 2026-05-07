import { useState } from 'react'
import { useIntl } from 'react-intl'
import { useDebounce } from 'react-use'
import addDays from 'date-fns/addDays'
import isToday from 'date-fns/isToday'
import { useLazyQuery } from '@apollo/client'

import {
  Box,
  Button,
  Inline,
  LoadingDots,
  Stack,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import type {
  ConnectedComponent,
  WebLandspitaliMenuQuery,
  WebLandspitaliMenuQueryVariables,
} from '@island.is/web/graphql/schema'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'
import { GET_LANDSPITALI_MENU } from '@island.is/web/screens/queries/Landspitali'

import { m } from './translation.string'

interface LandspitaliMenuProps {
  slice: ConnectedComponent
}

type MenuCourse = NonNullable<
  WebLandspitaliMenuQuery['webLandspitaliMenu']
>['meals'][number]['courses'][number]

const CourseDetails = ({ course }: { course: MenuCourse }) => {
  return (
    <Stack space={2}>
      {course.nutrients?.length ? (
        <Stack space={1}>
          <Text variant="eyebrow">Næringargildi</Text>
          <Inline alignY="center" space={1}>
            {course.nutrients.map((nutrient, index) => (
              <Tag
                key={`${nutrient.name ?? 'nutrient'}-${index}`}
                variant="blue"
                disabled
                outlined
              >
                {`${nutrient.name ?? 'Næring'}: ${nutrient.amount ?? '-'}${
                  nutrient.unit ?? ''
                }`}
              </Tag>
            ))}
          </Inline>
        </Stack>
      ) : null}

      {course.ingredients?.length ? (
        <Stack space={1}>
          <Text variant="eyebrow">Innihaldsefni</Text>
          <Text>
            {course.ingredients.map((ingredient) => ingredient.name).join(', ')}
          </Text>
        </Stack>
      ) : null}

      {course.co2Equivalents != null ? (
        <Text variant="small">{`CO2: ${course.co2Equivalents}`}</Text>
      ) : null}

      {course.prices?.length ? (
        <Inline alignY="center" space={1}>
          {course.prices.map((price, index) => (
            <Tag
              key={`${price.name}-${index}`}
              variant="purple"
              disabled
              outlined
            >
              {`${price.name}: ${price.value}${
                price.currency ? ` ${price.currency}` : ''
              }`}
            </Tag>
          ))}
        </Inline>
      ) : null}

      {course.labelOfContents ? (
        <Text variant="small">{course.labelOfContents}</Text>
      ) : null}

      {course.description ? (
        <Text variant="small">{course.description}</Text>
      ) : null}
    </Stack>
  )
}

const hasCourseDetails = (course: MenuCourse) =>
  Boolean(
    course.nutrients?.length ||
      course.ingredients?.length ||
      course.prices?.length ||
      course.co2Equivalents != null ||
      course.labelOfContents ||
      course.description,
  )

export const LandspitaliMenu = ({ slice: _slice }: LandspitaliMenuProps) => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString(),
  )
  const [data, setData] = useState<WebLandspitaliMenuQuery | null>(null)
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(new Set())

  const { format } = useDateUtils()
  const { formatMessage } = useIntl()

  const [getLandspitaliMenu, { loading }] = useLazyQuery<
    WebLandspitaliMenuQuery,
    WebLandspitaliMenuQueryVariables
  >(GET_LANDSPITALI_MENU, { onCompleted: setData })

  useDebounce(
    () => {
      getLandspitaliMenu({
        variables: {
          selectedDate: selectedDate,
        },
      })
    },
    100,
    [selectedDate],
  )

  console.log(data)

  return (
    <Stack space={2}>
      <Stack space={4}>
        <Box display="flex" justifyContent="center">
          <Inline alignY="center" space={4}>
            <Button
              icon="arrowBack"
              onClick={() =>
                setSelectedDate(
                  addDays(new Date(selectedDate), -1).toISOString(),
                )
              }
            />
            <Box style={{ width: '260px' }}>
              <Text variant="h3" textAlign="center">
                {isToday(new Date(selectedDate)) ? 'Í dag - ' : ''}
                {format(new Date(selectedDate), 'd. MMMM yyyy')}
              </Text>
            </Box>
            <Button
              icon="arrowForward"
              onClick={() =>
                setSelectedDate(
                  addDays(new Date(selectedDate), 1).toISOString(),
                )
              }
            />
          </Inline>
        </Box>

        <Box
          display="flex"
          justifyContent="center"
          style={{ visibility: loading ? 'visible' : 'hidden' }}
        >
          <LoadingDots />
        </Box>
      </Stack>

      <Stack space={5}>
        {data?.webLandspitaliMenu.meals.map((meal, mealIndex) => {
          return (
            <Stack space={2} key={`${meal.name ?? 'meal'}-${mealIndex}`}>
              <Text variant="h3">{meal.name}</Text>
              <Stack space={2}>
                {meal.courses.map((course, courseIndex) => {
                  const courseKey = `${mealIndex}-${course.id ?? courseIndex}`
                  let eyebrow = course.optionName?.split(',')[0].trim() ?? ''
                  const [title, ...rest] = (course.name?.split(',') ?? []).map(
                    (item) => item.trim(),
                  )
                  const description = rest.join(', ')
                  const hasDetails = hasCourseDetails(course)
                  const isExpanded = expandedCourses.has(courseKey)
                  if (eyebrow in m)
                    eyebrow = formatMessage(m[eyebrow as keyof typeof m])

                  return (
                    <Box
                      key={`${course.id ?? title ?? 'course'}-${courseIndex}`}
                      padding={[2, 2, 3]}
                      borderWidth="standard"
                      borderColor="blue200"
                      borderRadius="large"
                    >
                      <Stack space={3}>
                        <Stack space={1}>
                          <Stack space={0}>
                            <Text variant="eyebrow" color="purple400">
                              {eyebrow}
                            </Text>
                            <Text variant="h3">{title}</Text>
                          </Stack>
                          <Text>{description}</Text>
                        </Stack>
                        <Inline
                          alignY="center"
                          space={3}
                          justifyContent="spaceBetween"
                          collapseBelow="xl"
                          flexWrap="nowrap"
                        >
                          <Inline alignY="center" space={1}>
                            {course.knownAllergens?.map(
                              (allergen, allergenIndex) =>
                                allergen.name ? (
                                  <Tag
                                    key={`${allergen.name}-${allergenIndex}`}
                                    variant={
                                      allergen.presenceLevel === 'PRESENT'
                                        ? 'red'
                                        : 'yellow'
                                    }
                                    disabled
                                    outlined
                                  >
                                    {allergen.name}
                                  </Tag>
                                ) : null,
                            )}
                          </Inline>
                          {hasDetails ? (
                            <Button
                              variant="text"
                              size="small"
                              nowrap
                              icon={isExpanded ? 'chevronUp' : 'chevronDown'}
                              onClick={() =>
                                setExpandedCourses((prev) => {
                                  const next = new Set(prev)
                                  if (next.has(courseKey)) {
                                    next.delete(courseKey)
                                  } else {
                                    next.add(courseKey)
                                  }
                                  return next
                                })
                              }
                            >
                              {isExpanded
                                ? formatMessage(m.hideMoreAboutCourse)
                                : formatMessage(m.seeMoreAboutCourse)}
                            </Button>
                          ) : null}
                        </Inline>
                        {isExpanded ? <CourseDetails course={course} /> : null}
                      </Stack>
                    </Box>
                  )
                })}
              </Stack>
            </Stack>
          )
        })}
      </Stack>
    </Stack>
  )
}
