import React, { useEffect, useMemo, useState } from 'react'
import {
    type MRT_ColumnDef,
    useMaterialReactTable,
    MaterialReactTable,
} from 'material-react-table'
import { Button } from '@/components/ui'
import Box from '@mui/material/Box'
import { useNavigate, useParams } from 'react-router-dom'
import { AxiosResponse } from 'axios'
import {
    GetPrescriptionAllData,
    getPrescriptionByMrNo,
} from '@/services/PrescriptionService'
import { apiGetPatientByMrNo } from '@/services/PaitantData'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-solid-svg-icons'
import {
    QueryClient,
    QueryClientProvider,
    useQuery,
} from '@tanstack/react-query'
import { APP_PREFIX_PATH } from '@/constants/route.constant'

const PrescriptionList = () => {
    const { mrNo } = useParams()
    const role = localStorage.getItem('role')
    const mrno: any = mrNo
    localStorage.setItem('mrNo', mrno)
    console.log(mrNo)
    const navigate = useNavigate()
    const [prescriptionData, setPrescriptionsData] = useState<any>({})
    const [patientData, setPatientData] = useState<any>({})

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response: AxiosResponse = await apiGetPatientByMrNo(
                    Number(mrNo)
                )
                console.log(response)

                if (response.status === 200) {
                    const data: any = response.data
                    // console.log(data.doctorUserId)

                    setPatientData(data)
                } else {
                    throw new Error('Failed to fetch patient data')
                }

                // setLoading(false);
            } catch (error) {
                console.error('Error fetching patient data:', error)
                // setError('Failed to fetch patient data. Please try again.');
                // setLoading(false);
            }
        }

        fetchData()
    }, [mrNo])

    useEffect(() => {
        const fetchAllPrescriptionData = async () => {
            try {
                const response: AxiosResponse = await GetPrescriptionAllData(
                    Number(mrNo)
                )
                console.log(response)

                if (response.status === 200) {
                    const data: any = response.data
                    setPrescriptionsData(data)
                } else {
                    throw new Error('Failed to fetch patient data')
                }

                // setLoading(false);
            } catch (error) {
                console.error('Error fetching patient data:', error)
                // setError('Failed to fetch patient data. Please try again.');
                // setLoading(false);
            }
        }

        fetchAllPrescriptionData()
    }, [mrNo])

    const columns = useMemo<MRT_ColumnDef<any>[]>(
        () => [
            {
                accessorKey: 'doctor',
                header: "Doctor's Name",
                size: 50,
            },

            {
                accessorKey: 'creationDate',
                header: 'Appointment Date',
                size: 50,
            },
        ],
        []
    )

    const handlePreview = (e: any) => {
        navigate(`${APP_PREFIX_PATH}/PrescriptionPreview/${e}`)
    }

    const {
        data: fetchedUsers = [],
        isError: isLoadingUsersError,
        isFetching: isFetchingUsers,
        isLoading: isLoadingUsers,
    } = useGetUsers()

    const table = useMaterialReactTable({
        columns,
        data: prescriptionData,
        enableRowNumbers: true,
        createDisplayMode: 'modal',
        editDisplayMode: 'modal',
        state: {
            isLoading: isLoadingUsers,
        },
        enableEditing: true,
        positionActionsColumn: 'last',
        enableStickyHeader: true,
        enableStickyFooter: true,
        isMultiSortEvent: () => true,

        //  getRowId: (row) => row.mrNo,
        // muiToolbarAlertBannerProps: isLoadingUsersError
        //     ? {
        //         color: 'error',
        //         children: 'Error loading data',
        //     }
        //     : undefined,

        renderRowActions: ({ row }: any) => (
            <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '2px' }}>
                {/* <GrowShrinkTag value={'Assign Specs'} status={''} /> */}

                <button
                    onClick={() => {
                        const doctorUserId = row?.original?.doctorUserId
                        handlePreview(row?.original?.prescriptionId)
                        console.log({ row: row?.original?.prescriptionId })
                        localStorage.setItem('doctorId', doctorUserId)
                        // navigate(`${APP_PREFIX_PATH}/PrescriptionPreview/:id`)
                    }}
                    title="preview"
                >
                    <FontAwesomeIcon
                        className="mr-3 text-[#466991]"
                        height="16"
                        width="16"
                        icon={faEye}
                    />
                </button>
                {/* <button title="Edit">
                    <svg
                        className="fill-[#466991]"
                        xmlns="http://www.w3.org/2000/svg"
                        height="14"
                        width="14"
                        viewBox="0 0 512 512"
                        // onClick={han}
                    >
                        <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z" />
                    </svg>
                </button> */}

                {/* <button className="" title="Delete">
                    <svg
                        className="ml-3 fill-[#dc1212]"
                        xmlns="http://www.w3.org/2000/svg"
                        height="16"
                        width="14"
                        viewBox="0 0 448 512"
                        // onClick={() => deleteMedicine(index)}
                    >
                        <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                    </svg>
                </button> */}
            </Box>
        ),

        renderTopToolbarCustomActions: ({ table }: any) => (
            <div className="flex justify-start gap-2">
                {/* <Button
                    onClick={() => {
                        table.setSorting([])
                        table.setColumnVisibility({})
                    }}
                >
                    Clear All
                </Button> */}
                {role == 'doctor' ? (
                    <Button
                        onClick={() => {
                            // table.setSorting([])
                            // table.setColumnVisibility({})
                            navigate(
                                `${APP_PREFIX_PATH}/addprescription/${mrno}`
                            )
                        }}
                        style={{
                            // backgroundColor: '#00897B',
                            backgroundColor: '#3498db',
                            color: 'white',
                            cursor: 'pointer',
                        }}
                    >
                        Add Prescription
                    </Button>
                ) : (
                    ''
                )}
            </div>
        ),
    })

    return (
        <>
            <div className="lg:flex items-center justify-between my-5">
                <div className="flex flex-col lg:mb-0">
                    <h2 className="text-xl text-[#107dc7]">
                        Prescription List
                    </h2>
                </div>
            </div>

            <div className="">
                <p className="font-bold text-lg ">
                    Patient Name:
                    <span className="mx-4 text-[#86B4E7]">
                        {patientData.personalInfoDto?.firstName}{' '}
                        {patientData.personalInfoDto?.lastName}
                    </span>
                </p>
                <br />
                <div className="w-1/2 ">
                    <h5 className="text-sm mt-2">
                        MR Number: {patientData.personalInfoDto?.mrNo}
                    </h5>
                </div>

                <br />
            </div>

            <MaterialReactTable table={table} />
        </>
    )
}

function useGetUsers() {
    return useQuery<any[]>({
        queryKey: ['users'],
        // queryFn: async () => {
        //     // const res: AxiosResponse = await apiGetAllModels()

        //     // return Promise.resolve(res?.data)
        // },
        refetchOnWindowFocus: false,
    })
}

const queryClient = new QueryClient()

const ExampleWithProviders = () => (
    <QueryClientProvider client={queryClient}>
        <PrescriptionList />
    </QueryClientProvider>
)

export default ExampleWithProviders
