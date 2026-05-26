import { useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { useDebounce } from 'react-use'
import addDays from 'date-fns/addDays'
import isToday from 'date-fns/isToday'
import { useLazyQuery } from '@apollo/client'

import {
  AlertMessage,
  Box,
  Button,
  Inline,
  LoadingDots,
  SkeletonLoader,
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

import { m } from './translation.strings'

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
    <Stack space={3}>
      {course.nutrients?.length ? (
        <Stack space={2}>
          <Text fontWeight="semiBold">{formatMessage(m.nutritionTitle)}:</Text>
          <Box
            display="flex"
            flexDirection={['column', 'row']}
            alignItems="center"
            justifyContent="center"
            flexWrap="wrap"
            style={{ gap: '16px' }}
          >
            {course.nutrients.map((nutrient, index) => (
              <Box
                key={`${nutrient.name ?? 'nutrient'}-${index}`}
                textAlign="center"
                style={{ minWidth: '70px' }}
              >
                <Text variant="small" color="blue400" fontWeight="semiBold">
                  {formatRoundedNumber(nutrient.amount)}
                </Text>
                <Text variant="small" fontWeight="semiBold">
                  {`${nutrient.name ?? formatMessage(m.nutritionFallbackName)}${
                    nutrient.unit ? ` ${nutrient.unit}` : ''
                  }`}
                </Text>
              </Box>
            ))}
          </Box>
        </Stack>
      ) : null}

      {course.labelOfContents ? (
        <Stack space={1}>
          <Text fontWeight="semiBold">
            {formatMessage(m.ingredientsTitle)}:
          </Text>
          <Text variant="small">{course.labelOfContents}</Text>
        </Stack>
      ) : null}
    </Stack>
  )
}

const hasCourseDetails = (course: MenuCourse) =>
  Boolean(course.nutrients?.length || course.labelOfContents)

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
  const [hasError, setHasError] = useState(false)
  const isLoading = useRef<boolean>(false)

  const { format } = useDateUtils()
  const { formatMessage } = useIntl()

  const [getLandspitaliMenu, { loading, called }] = useLazyQuery<
    WebLandspitaliMenuQuery,
    WebLandspitaliMenuQueryVariables
  >(GET_LANDSPITALI_MENU, {
    onCompleted(a) {
      setData(a)
      setHasError(false)
      isLoading.current = false
    },
    onError: () => {
      setHasError(true)
      isLoading.current = false
    },
  })

  useDebounce(
    () => {
      setHasError(false)
      getLandspitaliMenu({
        variables: {
          selectedDate: formatDateOnlyLocal(selectedDate),
        },
      })
    },
    300,
    [selectedDate],
  )
  const RDS_VARIANTS = ['RDS kjöt/fiskur', 'RDS grænmetisfæði'] as const

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
    .filter(({ key }) => key in m)
    .sort(sortAlpha('key'))

  const filteredMeals =
    data?.webLandspitaliMenu.meals
      .map((meal) => ({
        ...meal,
        courses: meal.courses.filter((course) => {
          const option = course.optionName?.split(',')[0].trim()
          if (
            RDS_VARIANTS.includes(selectedOption as typeof RDS_VARIANTS[number])
          )
            return option === selectedOption || option === 'RDS'

          return option === selectedOption
        }),
      }))
      .filter((meal) => meal.courses.length > 0) ?? []

  const skeletonMeals =
    filteredMeals.length > 0
      ? filteredMeals.map((meal) => ({
          name: meal.name,
          count: meal.courses.length,
        }))
      : [{ name: null, count: 3 }]

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
                  {formatMessage(m[option.key as keyof typeof m])}
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
            {hasError ? (
              <AlertMessage
                type="error"
                message={formatMessage(m.errorFetchingMenu)}
              />
            ) : null}

            {loading && data !== null && filteredMeals.length > 0
              ? skeletonMeals.map((skeletonMeal, mealIndex) => (
                  <Stack space={2} key={`skeleton-meal-${mealIndex}`}>
                    {skeletonMeal.name ? (
                      <Text variant="h3">
                        {skeletonMeal.name in m
                          ? formatMessage(
                              m[skeletonMeal.name as keyof typeof m],
                            )
                          : skeletonMeal.name}
                      </Text>
                    ) : null}
                    <Stack space={2}>
                      {Array.from({ length: skeletonMeal.count }).map(
                        (_, i) => (
                          <SkeletonLoader
                            key={i}
                            height={193}
                            borderRadius="large"
                          />
                        ),
                      )}
                    </Stack>
                  </Stack>
                ))
              : filteredMeals.map((meal, mealIndex) => (
                  <Stack space={2} key={`${meal.name ?? 'meal'}-${mealIndex}`}>
                    <Text variant="h3">
                      {!!meal.name && meal.name in m
                        ? formatMessage(m[meal.name as keyof typeof m])
                        : meal.name}
                    </Text>
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
                                        <div
                                          key={`${allergen.name}-${allergenIndex}`}
                                          title={
                                            allergen.presenceLevel === 'PRESENT'
                                              ? `${formatMessage(m.present)}: ${
                                                  allergen.name
                                                }`
                                              : `${formatMessage(m.absent)}: ${
                                                  allergen.name
                                                }`
                                          }
                                        >
                                          <Tag
                                            variant={
                                              allergen.presenceLevel ===
                                              'PRESENT'
                                                ? 'red'
                                                : 'yellow'
                                            }
                                            disabled
                                            outlined
                                          >
                                            {allergen.name}
                                          </Tag>
                                        </div>
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
                ))}

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
