import { useEffect, useMemo, useState } from 'react'
import {
    type MRT_ColumnDef,
    useMaterialReactTable,
    MaterialReactTable,
} from 'material-react-table'

import {
    QueryClient,
    QueryClientProvider,
    useQuery,
} from '@tanstack/react-query'

import { AxiosResponse } from 'axios'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { APP_PREFIX_PATH } from '@/constants/route.constant'
import { apiGetPatientAllData, deleteUserData } from '@/services/PaitantData'
import Box from '@mui/material/Box'
import { Button } from '@/components/ui'
import SingleMenuView from './PatientRegistration'
import { number } from 'prop-types'
import { ConfirmDialog } from '@/components/shared'
import { title } from 'process'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile } from '@fortawesome/free-regular-svg-icons'

const Specsidentification = (): any => {
    const [openModel, setOpenModel] = useState(false)
    const [data, setData] = useState<any[]>([])
    const [selectedRow, setSelectedRow] = useState<any>()
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)
    const [id, setId] = useState<any>()
    const navigate = useNavigate()
    const handleEdit = (mrNo: any) => {
        navigate(`${APP_PREFIX_PATH}/patientRegistration/${mrNo}`)
    }

    useEffect(() => {}, [selectedRow])

    useEffect(() => {
        fetchData()
    }, [])

    const handleAddAppointment = (mrNo: any) => {
        navigate(`/add-appointment/${mrNo}`)
    }

    useEffect(() => {}, [selectedRow])

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const response: AxiosResponse = await apiGetPatientAllData()
            const responseData = response?.data
            const dataWithSrNo = responseData.map((item: any, index: any) => ({
                ...item,
                srNo: index + 1,
            }))
            setData(dataWithSrNo)
        } catch (error: any) {
            console.log(error?.response?.data?.message)
        }
    }

    const handleDelete = async (mrNo: number) => {
        try {
            const response: AxiosResponse = await deleteUserData(mrNo)
            if (response) {
                fetchData()
            }
        } catch (error) {
            console.log('Error deleting user:', error)
        }
    }

    const handleCloseModal = () => {
        console.log('Closing modal')
        setOpenModel(false)
    }
    const handleModal = (id: any) => {
        setIsDeleteModalOpen(true)
        setId(id)
    }

    const handlePrescriptionNavigate = (mrNO: any) => {
        navigate(`${APP_PREFIX_PATH}/PrescriptionList/${mrNO}`)
    }
    const handleAppointmentNavigate = () => {
        navigate(`${APP_PREFIX_PATH}/scheduleAppointment`)
    }
    const columns = useMemo<MRT_ColumnDef<any>[]>(
        () => [
            // {
            //     accessorKey: 'srNo',
            //     header: 'SrNo.',
            //     size: 50,
            //     renderCell: (index: any) => <div>{index + 1}</div>,
            // },
            {
                accessorKey: 'personalInfoDto.mrNo',
                header: 'MR No.',
                size: 50,
            },
            {
                accessorKey: 'personalInfoDto.firstName',
                header: 'First name',
                size: 50,
            },

            {
                accessorKey: 'personalInfoDto.lastName',
                header: 'Last name',
                size: 50,
            },
            {
                accessorKey: 'personalInfoDto.dob',
                header: 'DOB',
                size: 50,
            },
            {
                accessorKey: 'personalInfoDto.contact',
                header: 'Contact',
                size: 50,
            },
            {
                accessorKey: 'personalInfoDto.email',
                header: 'E-mail',
                size: 50,
            },
        ],
        []
    )

    const {
        data: fetchedUsers = [],
        isError: isLoadingUsersError,
        isFetching: isFetchingUsers,
        isLoading: isLoadingUsers,
    } = useGetUsers()

    const table = useMaterialReactTable({
        columns,
        data: data,
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
        initialState: { density: 'compact' },

        getRowId: (row) => row.mrNo,
        muiToolbarAlertBannerProps: isLoadingUsersError
            ? {
                  className: 'z-10',
                  color: 'error',
                  children: 'Error loading data',
              }
            : undefined,

        renderRowActions: ({ row }: any) => (
            <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '2px' }}>
                <button
                    onClick={() => handleAppointmentNavigate()}
                    title="Add appointment"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="blue"
                        className="h-5 w-5 inline-block mr-1"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                    </svg>
                </button>
                {/* Add prescription */}
                <button
                    onClick={() =>
                        handlePrescriptionNavigate(
                            row?.original?.personalInfoDto?.mrNo
                        )
                    }
                    title="Prescription"
                >
                    <FontAwesomeIcon
                        icon={faFile}
                        className="h-5 w-5 inline-block mr-1"
                        style={{ color: 'green' }}
                    />
                </button>

                {/* Edit */}
                <button
                    onClick={() => {
                        handleEdit(row?.original?.personalInfoDto?.mrNo)
                        console.log({
                            roe: row?.original?.personalInfoDto?.mrNo,
                        })
                    }}
                    title="Edit"
                    className=""
                >
                    <svg
                        className="fill-[#466991] mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        height="14"
                        width="14"
                        viewBox="0 0 512 512"
                    >
                        <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z" />
                    </svg>
                </button>
                {/* Delete */}
                <button
                    onClick={() => {
                        // handleDelete(row?.original?.personalInfoDto?.mrNo);
                        handleModal(row?.original?.personalInfoDto?.mrNo)
                    }}
                    title="Delete"
                    className=""
                >
                    <svg
                        className="fill-[#dc1212]"
                        xmlns="http://www.w3.org/2000/svg"
                        height="16"
                        width="14"
                        viewBox="0 0 448 512"
                    >
                        <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                    </svg>
                </button>
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
            </div>
        ),
    })

    return (
        <>
            {isDeleteModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <p className="mb-3 font-bold text-center text-md">
                            Are you sure you want to delete this PatientInfo?
                        </p>
                        <div className="flex justify-center">
                            <button
                                onClick={() => {
                                    handleDelete(id)
                                    setIsDeleteModalOpen(false)
                                }}
                                className="bg-red-500 text-white px-2 py-1 mr-1 rounded hover:bg-red-600 focus:outline-none focus:ring focus:border-blue-300"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => {
                                    setIsDeleteModalOpen(false)
                                }}
                                className="text-black-500 px-2 mr-1 rounded border border-gray-400 hover:bg-gray-100 shadow-lg"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="lg:flex items-center justify-between my-5">
                <div className="flex flex-col lg:mb-0">
                    <h2 className="text-lg font-semibold text-[#107dc7]">
                        Patient List
                    </h2>
                </div>
            </div>

            <MaterialReactTable table={table} />

            {/* <ConfirmDialog
            isOpen={isDeleteModalOpen}
            title={'Are you sure you want to delete'}
onConfirm={()=>handleDelete(row?.original?.personalInfoDto?.mrNo)}
            /> */}
            {openModel && <SingleMenuView selectedRow={selectedRow} />}
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
        <Specsidentification />
    </QueryClientProvider>
)

export default ExampleWithProviders
