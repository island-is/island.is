import { useRef, useState } from 'react'
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
import { sortAlpha } from '@island.is/shared/utils'
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

const formatRoundedNumber = (value?: number | null): string => {
  if (value == null || Number.isNaN(value)) {
    return '-'
  }

  return Number(value.toFixed(2)).toString()
}

const CourseDetails = ({ course }: { course: MenuCourse }) => {
  const { formatMessage } = useIntl()

  return (
    <Stack space={2}>
      {course.nutrients?.length ? (
        <Stack space={1}>
          <Text variant="eyebrow">{formatMessage(m.nutritionTitle)}</Text>
          <Inline alignY="center" space={1}>
            {course.nutrients.map((nutrient, index) => (
              <Tag
                key={`${nutrient.name ?? 'nutrient'}-${index}`}
                variant="dark"
                disabled
                outlined
              >
                {`${
                  nutrient.name ?? formatMessage(m.nutritionFallbackName)
                }: ${formatRoundedNumber(nutrient.amount)}${
                  nutrient.unit ?? ''
                }`}
              </Tag>
            ))}
          </Inline>
        </Stack>
      ) : null}

      {course.ingredients?.length ? (
        <Stack space={1}>
          <Text variant="eyebrow">{formatMessage(m.ingredientsTitle)}</Text>
          <Text>
            {course.ingredients.map((ingredient) => ingredient.name).join(', ')}
          </Text>
        </Stack>
      ) : null}

      {course.co2Equivalents != null ? (
        <Text variant="small">
          {formatMessage(m.co2Label, {
            value: formatRoundedNumber(course.co2Equivalents),
          })}
        </Text>
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
              {`${price.name}: ${formatRoundedNumber(price.value)}${
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

const formatDateOnlyLocal = (date: Date): string => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export const LandspitaliMenu = ({ slice: _slice }: LandspitaliMenuProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [data, setData] = useState<WebLandspitaliMenuQuery | null>(null)
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(new Set())
  const [selectedOption, setSelectedOption] = useState<string>('A1')
  const isLoading = useRef<boolean>(false)

  const { format } = useDateUtils()
  const { formatMessage } = useIntl()

  const [getLandspitaliMenu, { loading, called }] = useLazyQuery<
    WebLandspitaliMenuQuery,
    WebLandspitaliMenuQueryVariables
  >(GET_LANDSPITALI_MENU, {
    onCompleted(a) {
      setData(a)
      isLoading.current = false
    },
    onError: () => {
      isLoading.current = false
    },
  })

  useDebounce(
    () => {
      getLandspitaliMenu({
        variables: {
          selectedDate: formatDateOnlyLocal(selectedDate),
        },
      })
    },
    300,
    [selectedDate],
  )

  const optionTags = Array.from(
    (data?.webLandspitaliMenu.meals ?? [])
      .flatMap((meal) => meal.courses)
      .reduce((acc, course) => {
        const fullOptionName = course.optionName?.trim()
        const optionKey = fullOptionName?.split(',')[0].trim()

        if (!optionKey || !fullOptionName || acc.has(optionKey)) {
          return acc
        }

        acc.set(optionKey, fullOptionName)
        return acc
      }, new Map<string, string>())
      .entries(),
  )
    .map(([key, fullName]) => ({ key, fullName }))
    .sort(sortAlpha('key'))

  const filteredMeals =
    data?.webLandspitaliMenu.meals
      .map((meal) => ({
        ...meal,
        courses: meal.courses.filter((course) => {
          const option = course.optionName?.split(',')[0].trim()
          return option === selectedOption
        }),
      }))
      .filter((meal) => meal.courses.length > 0) ?? []

  return (
    <Stack space={2}>
      <Stack space={5}>
        <Box display="flex" justifyContent="center">
          <Inline alignY="center" space={4} flexWrap="nowrap">
            <Button
              icon="arrowBack"
              size="small"
              variant="utility"
              onClick={() => {
                isLoading.current = true
                setSelectedDate(addDays(selectedDate, -1))
              }}
            />
            <Box style={{ width: '200px' }}>
              <Text variant="h4" textAlign="center">
                {isToday(selectedDate) ? formatMessage(m.todayPrefix) : ''}
                {format(selectedDate, 'd. MMMM yyyy')}
              </Text>
            </Box>
            <Button
              icon="arrowForward"
              size="small"
              variant="utility"
              onClick={() => {
                isLoading.current = true
                setSelectedDate(addDays(selectedDate, 1))
              }}
            />
          </Inline>
        </Box>

        <Stack space={5}>
          {optionTags.length ? (
            <Inline alignY="center" space={1}>
              {optionTags.map((option) => (
                <Tag
                  key={option.key}
                  onClick={() => setSelectedOption(option.key)}
                  active={selectedOption === option.key}
                >
                  {option.key in m
                    ? formatMessage(m[option.key as keyof typeof m])
                    : option.key}
                </Tag>
              ))}
            </Inline>
          ) : null}
        </Stack>

        <Stack space={1}>
          <Box
            display="flex"
            justifyContent="center"
            style={{ visibility: loading ? 'visible' : 'hidden' }}
          >
            <LoadingDots />
          </Box>

          <Stack space={5}>
            {filteredMeals.map((meal, mealIndex) => {
              return (
                <Stack space={2} key={`${meal.name ?? 'meal'}-${mealIndex}`}>
                  <Text variant="h3">{meal.name}</Text>
                  <Stack space={2}>
                    {meal.courses.map((course, courseIndex) => {
                      const courseKey = `${mealIndex}-${
                        course.id ?? courseIndex
                      }`
                      let eyebrow =
                        course.optionName?.split(',')[0].trim() ?? ''
                      const [title, ...rest] = (
                        course.name?.split(',') ?? []
                      ).map((item) => item.trim())
                      const description = rest.join(', ')
                      const hasDetails = hasCourseDetails(course)
                      const isExpanded = expandedCourses.has(courseKey)
                      if (eyebrow in m)
                        eyebrow = formatMessage(m[eyebrow as keyof typeof m])

                      return (
                        <Box
                          key={`${
                            course.id ?? title ?? 'course'
                          }-${courseIndex}`}
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
                                  icon={
                                    isExpanded ? 'chevronUp' : 'chevronDown'
                                  }
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
                            {isExpanded ? (
                              <CourseDetails course={course} />
                            ) : null}
                          </Stack>
                        </Box>
                      )
                    })}
                  </Stack>
                </Stack>
              )
            })}

            {called &&
              !loading &&
              !isLoading.current &&
              filteredMeals.length === 0 && (
                <Text>
                  {formatMessage(m.noMenuPublished, {
                    date: format(selectedDate, 'd. MMMM yyyy'),
                  })}
                </Text>
              )}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  )
}
