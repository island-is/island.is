import { FC, Fragment, useEffect, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { CustomField, FieldBaseProps } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import {
  AsyncSearch,
  AsyncSearchOption,
  Box,
  Checkbox,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import IconCircleClose from '../../assets/IconCircleClose'
import IconCircleOpen from '../../assets/IconCircleOpen'
import {
  stadfangData,
  fasteignByStadfangNrData,
  adalmatseiningByFasteignNrData,
} from './propertyData'
import { registerProperty } from '../../lib/messages'
import {
  StadfangProps,
  FasteignByStadfangNrProps,
  AdalmatseiningProps,
} from '../../lib/types'
import {
  input,
  tableHeadingCell,
  tableCell,
  dropdownTableCell,
  tableCellExpand,
  tableCellSize,
  tableCellNumOfRooms,
  hiddenTableRow,
  hiddenTableRowExpanded,
  tableCellMerking,
  tableCellFastNum,
} from './propertySearch.css'

interface Props extends FieldBaseProps {
  field: CustomField
}

export const PropertySearch: FC<React.PropsWithChildren<Props>> = ({
  field,
}) => {
  const { formatMessage } = useLocale()
  const { clearErrors, setValue, getValues } = useFormContext()
  const { id } = field

  const [pending, setPending] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchOptions, setSearchOptions] = useState<AsyncSearchOption[]>([])
  const [tableExpanded, setTableExpanded] = useState<Record<string, boolean>>(
    {},
  )
  const [checkedMatseiningar, setCheckedMatseiningar] = useState<
    Record<string, boolean>
  >({})
  const [matseiningSizeChangeValue, setmatseiningSizeChangeValue] = useState<
    Record<string, string>
  >({})
  const [matseiningRoomsChangeValue, setmatseiningRoomsChangeValue] = useState<
    Record<string, string>
  >({})

  const [selectedStadfang, setSelectedStadfang] = useState<
    StadfangProps | undefined
  >(undefined)
  const [propertiesByStadfangNr, setPropertiesByStadfangNr] = useState<
    FasteignByStadfangNrProps[] | undefined
  >(undefined)
  const [adalmatseiningByFasteignNr, setAdalmatseiningByFasteignNr] = useState<
    Record<number, AdalmatseiningProps[]> | undefined
  >(undefined)

  const storedValue = getValues(id)

  console.log('id: ', id)
  console.log('storedValue: ', storedValue)
  console.log('searchTerm: ', searchTerm)

  useEffect(() => {
    if (storedValue) {
      try {
        setSelectedStadfang(storedValue)
        setSearchTerm(storedValue.value)
        setCheckedMatseiningar(storedValue.checkedMatseiningar || {})
        setmatseiningSizeChangeValue(
          storedValue.changedMatseiningSizeValue || {},
        )
        setmatseiningRoomsChangeValue(
          storedValue.changedMatseiningRoomsValue || {},
        )
        setPropertiesByStadfangNr(storedValue.propertiesByStadfangNr || [])
        setAdalmatseiningByFasteignNr(
          storedValue.adalmatseiningByFasteignNr || {},
        )
      } catch (error) {
        console.error('Error parsing stored value:', error)
      }
    }
  }, [getValues, id])

  useEffect(() => {
    if (selectedStadfang) {
      fetchPropertyByStadfangNr(selectedStadfang.stadfang_nr)
    }
  }, [selectedStadfang])

  useEffect(() => {
    if (propertiesByStadfangNr) {
      fetchMatseiningByFasteignNr(propertiesByStadfangNr)
    }
  }, [propertiesByStadfangNr])

  const fetchPropertiesByStadfang = (query = '') => {
    if (query.length < 2) {
      console.log('No data - query too short')
      return
    }
    setPending(true)

    // TODO: Update when actual fetch is implemented
    // fetch('http://localhost:3001/properties')
    //   .then((res) => res.json())
    //   .then((data: PropertyStadfang[]) => {
    //     setPending(false)
    //     const filteredData = data
    //       .filter((property: PropertyStadfang) =>
    //         property.stadfang.toLowerCase().includes(query.toLowerCase()),
    //       )
    //       .sort((a: PropertyStadfang, b: PropertyStadfang) =>
    //         a.stadfang.localeCompare(b.stadfang),
    //       )

    // TODO: Update when actual fetch is implemented
    setTimeout(() => {
      const filteredData = stadfangData
        .filter((item: StadfangProps) =>
          item.stadfang.toLowerCase().includes(query.toLowerCase()),
        )
        .sort((a: StadfangProps, b: StadfangProps) =>
          a.stadfang.localeCompare(b.stadfang),
        )
        .slice(0, 10)

      setPending(false)

      if (filteredData.length) {
        setSearchOptions(
          filteredData.map((property: StadfangProps) => ({
            label: `${property.stadfang}, ${property.postnumer} ${property.sveitarfelag_nafn}`,
            value: `${property.stadfang}, ${property.postnumer} ${property.sveitarfelag_nafn}`,
            stadfang_nr: property.stadfang_nr,
            stadfang: property.stadfang,
            sveitarfelag_nafn: property.sveitarfelag_nafn,
            sveitarfelag_nr: property.sveitarfelag_nr,
            birting_sveitarfelag_nr: property.birting_sveitarfelag_nr,
            postnumer: property.postnumer,
            landeign_nr: property.landeign_nr,
            stadvisir: property.stadvisir,
            stadgreinir: property.stadgreinir,
            vidskeyti: property.vidskeyti,
          })),
        )
      }
    }, 500)
  }

  // TODO: Mock data - replace with actual fetch
  const fetchPropertyByStadfangNr = (selectedStadfangNr: number) => {
    const filteredFasteign = fasteignByStadfangNrData.filter(
      (property: FasteignByStadfangNrProps) =>
        property.stadfang_nr === selectedStadfangNr,
    )
    setPropertiesByStadfangNr(filteredFasteign)
  }

  // TODO: Mock data - replace with actual fetch
  const fetchMatseiningByFasteignNr = (
    propertiesByStadfangNr: FasteignByStadfangNrProps[],
  ) => {
    const adalmatseiningMap: Record<number, AdalmatseiningProps[]> = {}

    propertiesByStadfangNr.forEach((property) => {
      const filteredProperties = adalmatseiningByFasteignNrData.filter(
        (matseining: AdalmatseiningProps) =>
          matseining.fastnum === property.fastnum,
      )
      adalmatseiningMap[property.fastnum] = filteredProperties
    })
    setAdalmatseiningByFasteignNr(adalmatseiningMap)

    setValue(id, {
      ...getValues(id),
      propertiesByStadfangNr,
      adalmatseiningByFasteignNr: adalmatseiningMap,
    })
  }

  const handleCheckboxChange = (matseiningId: string) => {
    setCheckedMatseiningar((prev) => {
      const newCheckedMatseiningar = {
        ...prev,
        [matseiningId]: !prev[matseiningId],
      }
      setValue(id, {
        ...getValues(id),
        checkedMatseiningar: newCheckedMatseiningar,
      })
      return newCheckedMatseiningar
    })
  }

  const handleMatseiningInputChange = (
    matseiningId: string,
    value: string,
    type: 'size' | 'rooms',
  ) => {
    const stateUpdater =
      type === 'size'
        ? setmatseiningSizeChangeValue
        : setmatseiningRoomsChangeValue
    const stateKey =
      type === 'size'
        ? 'changedMatseiningSizeValue'
        : 'changedMatseiningRoomsValue'

    stateUpdater((prev) => {
      const newValues = {
        ...prev,
        [matseiningId]: value,
      }
      setValue(id, {
        ...getValues(id),
        [stateKey]: newValues,
      })
      return newValues
    })
  }

  return (
    <>
      <Box>
        <Controller
          name={`${id}_propertySearchController`}
          defaultValue=""
          render={({ field: { onChange } }) => {
            return (
              <AsyncSearch
                options={searchOptions}
                placeholder={formatMessage(
                  registerProperty.info.propertySearchPlaceholder,
                )}
                initialInputValue={
                  selectedStadfang
                    ? `${selectedStadfang.stadfang}, ${selectedStadfang.postnumer} ${selectedStadfang.sveitarfelag_nafn}`
                    : ''
                }
                inputValue={
                  searchTerm ||
                  (selectedStadfang
                    ? `${selectedStadfang.stadfang}, ${selectedStadfang.postnumer} ${selectedStadfang.sveitarfelag_nafn}`
                    : '')
                }
                closeMenuOnSubmit
                size="large"
                colored
                onChange={(selection: { value: string } | null) => {
                  clearErrors(id)
                  const selectedValue =
                    selection === null ? undefined : selection.value
                  const selectedOption = searchOptions.find(
                    (option) => option.value === selectedValue,
                  )
                  setSelectedStadfang(
                    selectedOption as unknown as StadfangProps,
                  )
                  onChange(selection ? selection : undefined)
                  setValue(id, selection ? selection : undefined)
                  setSearchTerm(selection ? selection.value : '')
                }}
                onInputValueChange={(newValue) => {
                  setSearchTerm(newValue)
                  fetchPropertiesByStadfang(newValue)
                }}
                loading={pending}
              />
            )
          }}
        />
      </Box>

      {selectedStadfang && (
        <Box marginTop={8}>
          <Text variant="h3" marginBottom={4}>
            {selectedStadfang.stadfang}, {selectedStadfang.postnumer}{' '}
            {selectedStadfang.sveitarfelag_nafn}
          </Text>
          {propertiesByStadfangNr && propertiesByStadfangNr.length > 0 && (
            <T.Table>
              <T.Head>
                <T.Row>
                  <T.HeadData
                    box={{
                      className: `${tableHeadingCell} ${tableCellExpand}`,
                    }}
                  ></T.HeadData>
                  <T.HeadData
                    box={{
                      className: `${tableHeadingCell} ${tableCellFastNum}`,
                    }}
                  >
                    {formatMessage(
                      registerProperty.info.searchResultHeaderPropertyId,
                    )}
                  </T.HeadData>
                  <T.HeadData
                    box={{
                      className: `${tableHeadingCell} ${tableCellMerking}`,
                    }}
                  >
                    {formatMessage(
                      registerProperty.info.searchResultHeaderMarking,
                    )}
                  </T.HeadData>
                  <T.HeadData
                    box={{
                      className: `${tableHeadingCell} ${tableCellSize}`,
                    }}
                  >
                    {formatMessage(
                      registerProperty.info.searchResultHeaderPropertySize,
                    )}
                  </T.HeadData>
                  <T.HeadData
                    box={{
                      className: `${tableHeadingCell} ${tableCellNumOfRooms}`,
                    }}
                  >
                    {formatMessage(
                      registerProperty.info.searchResultsHeaderNumOfRooms,
                    )}
                  </T.HeadData>
                </T.Row>
              </T.Head>
              <T.Body>
                {propertiesByStadfangNr.map((property) => {
                  const toggleExpand = (propertyId: number) => {
                    setTableExpanded((prev) => ({
                      ...prev,
                      [propertyId]: !prev[propertyId],
                    }))
                  }
                  return (
                    <Fragment key={property.fastnum}>
                      <T.Row>
                        <T.Data
                          box={{
                            className: `${tableCell} ${tableCellExpand}`,
                          }}
                        >
                          {adalmatseiningByFasteignNr &&
                            adalmatseiningByFasteignNr[property.fastnum] &&
                            adalmatseiningByFasteignNr[property.fastnum]
                              .length > 0 && (
                              <button
                                onClick={(e) => {
                                  e.preventDefault()
                                  toggleExpand(property.fastnum)
                                }}
                              >
                                {tableExpanded[property.fastnum] ? (
                                  <IconCircleClose />
                                ) : (
                                  <IconCircleOpen />
                                )}
                              </button>
                            )}
                        </T.Data>
                        <T.Data
                          box={{
                            className: `${tableCell} ${tableCellFastNum}`,
                          }}
                        >
                          {property.fasteign_nr}
                        </T.Data>
                        <T.Data
                          box={{
                            className: `${tableCell} ${tableCellMerking}`,
                          }}
                        >
                          {property.merking}
                        </T.Data>
                        <T.Data
                          box={{
                            className: `${tableCell} ${tableCellSize}`,
                          }}
                        >
                          {`${property.flatarmal} m²`}
                        </T.Data>
                        <T.Data
                          box={{
                            className: `${tableCell} ${tableCellNumOfRooms}`,
                          }}
                        >
                          {'-'}
                        </T.Data>
                      </T.Row>
                      {adalmatseiningByFasteignNr &&
                        adalmatseiningByFasteignNr[property.fastnum] &&
                        adalmatseiningByFasteignNr[property.fastnum].length >
                          0 && (
                          <>
                            {adalmatseiningByFasteignNr[property.fastnum].map(
                              (matseiningar) => {
                                return (
                                  <Fragment key={matseiningar.merking}>
                                    {matseiningar.matseiningar.map(
                                      (matseining) => (
                                        <tr key={matseining.merking}>
                                          <T.Data
                                            colSpan={5}
                                            box={{
                                              paddingLeft: 0,
                                              paddingRight: 0,
                                              paddingTop: 0,
                                              paddingBottom: 0,
                                              borderColor: 'transparent',
                                            }}
                                          >
                                            <div
                                              className={`${hiddenTableRow} ${
                                                tableExpanded[
                                                  matseiningar.fastnum
                                                ] && hiddenTableRowExpanded
                                              }`}
                                            >
                                              <T.Data
                                                box={{
                                                  className: `${dropdownTableCell} ${tableCellExpand}`,
                                                }}
                                              ></T.Data>
                                              <T.Data
                                                box={{
                                                  className: `${dropdownTableCell} ${tableCellFastNum}`,
                                                }}
                                              >
                                                <Checkbox
                                                  id={matseining.merking}
                                                  name={matseining.notkun}
                                                  label={matseining.notkun}
                                                  checked={
                                                    checkedMatseiningar[
                                                      matseining.merking
                                                    ] || false
                                                  }
                                                  onChange={() =>
                                                    handleCheckboxChange(
                                                      matseining.merking,
                                                    )
                                                  }
                                                />
                                              </T.Data>
                                              <T.Data
                                                box={{
                                                  className: `${dropdownTableCell} ${tableCellMerking}`,
                                                }}
                                              >
                                                {matseining.merking}
                                              </T.Data>
                                              <T.Data
                                                box={{
                                                  className: `${dropdownTableCell} ${tableCellSize}`,
                                                }}
                                              >
                                                <input
                                                  className={input}
                                                  type="text"
                                                  name="propertySize"
                                                  value={
                                                    matseiningSizeChangeValue[
                                                      matseining.merking
                                                    ] ||
                                                    `${matseining.einflm} ${matseining.eining}`
                                                  }
                                                  onChange={(e) =>
                                                    handleMatseiningInputChange(
                                                      matseining.merking,
                                                      e.target.value,
                                                      'size',
                                                    )
                                                  }
                                                  disabled={
                                                    !checkedMatseiningar[
                                                      matseining.merking
                                                    ]
                                                  }
                                                />
                                              </T.Data>
                                              <T.Data
                                                box={{
                                                  className: `${dropdownTableCell} ${tableCellNumOfRooms}`,
                                                }}
                                              >
                                                <input
                                                  className={input}
                                                  type="text"
                                                  name="numOfRooms"
                                                  value={
                                                    matseiningRoomsChangeValue[
                                                      matseining.merking
                                                    ] || `0`
                                                  }
                                                  onChange={(e) =>
                                                    handleMatseiningInputChange(
                                                      matseining.merking,
                                                      e.target.value,
                                                      'rooms',
                                                    )
                                                  }
                                                  disabled={
                                                    !checkedMatseiningar[
                                                      matseining.merking
                                                    ]
                                                  }
                                                />
                                              </T.Data>
                                            </div>
                                          </T.Data>
                                        </tr>
                                      ),
                                    )}
                                  </Fragment>
                                )
                              },
                            )}
                          </>
                        )}
                    </Fragment>
                  )
                })}
              </T.Body>
            </T.Table>
          )}
        </Box>
      )}
    </>
  )
}
