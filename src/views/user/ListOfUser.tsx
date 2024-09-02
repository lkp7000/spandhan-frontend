import Box from '@mui/material/Box'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'

import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { AxiosResponse } from 'axios'
import { apiGetAllUser, deleteById } from '@/services/UserService'
import {
    MaterialReactTable,
    useMaterialReactTable,
    MRT_ColumnDef,
} from 'material-react-table'
import { HiPencil } from 'react-icons/hi'
import Tooltip from '@/components/ui/Tooltip'
import { IconButton, MenuItem } from '@mui/material'
import { FaEraser } from 'react-icons/fa'
import {
    QueryClient,
    QueryClientProvider,
    useQuery,
} from '@tanstack/react-query'
import { APP_PREFIX_PATH } from '@/constants/route.constant'

interface User {
    id: number
    userName: string
    email: string
    status: string
    role: string
}

interface ListOfPatientProps {
    Setter: (mrNo: number) => void
}

const ListOfUser = () => {
    const [users, setUsers] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)
    const [id, setId] = useState<any>()
    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const response: AxiosResponse = await apiGetAllUser()
            const data: User[] = response.data
            setUsers(data)
        } catch (error) {
            console.error('Error fetching data from the API:', error)
        }
    }

    const handleDelete = async (id: number) => {
        try {
            setIsLoading(true)
            console.log('Deleting user with id:', id)
            const response: AxiosResponse = await deleteById(id)
            fetchData()

            if (response.status === 200) {
                setUsers((prevUsers) =>
                    prevUsers.filter((user) => user.id !== id)
                )
            }
        } catch (error) {
            console.log('Error deleting user:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const today = new Date()
    const formattedDate = today.toLocaleDateString()

    const columns: MRT_ColumnDef<User>[] = useMemo(
        () => [
            { accessorKey: 'id', header: 'User ID', size: 100 },
            { accessorKey: 'userName', header: 'Username', size: 150 },
            { accessorKey: 'email', header: 'E-mail', size: 200 },
            { accessorKey: 'status', header: 'Status', size: 100 },
            { accessorKey: 'role', header: 'Role', size: 100 },
        ],
        [handleDelete]
    )

    const {
        data: fetchedUsers = [],
        isError: isLoadingUsersError,
        isFetching: isFetchingUsers,
        isLoading: isLoadingUsers,
    } = useGetUsers()
    const handleModal = (id: any) => {
        setIsDeleteModalOpen(true)
        setId(id)
    }
    const table = useMaterialReactTable({
        columns,
        data: users,
        createDisplayMode: 'modal',
        editDisplayMode: 'modal',
        enableEditing: true,
        state :{
            isLoading: isLoadingUsers,
        },
        enableColumnActions: false,
        positionActionsColumn: 'last',
        renderRowActions: ({ row }: any) => (
            <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '0px' }}>
                <Link to={`${APP_PREFIX_PATH}/addUser/${row.original.id}`} title="Edit">
                    <button className=" mr-2">
                        <svg
                            className="fill-[#466991]"
                            xmlns="http://www.w3.org/2000/svg"
                            height="14"
                            width="14"
                            viewBox="0 0 512 512"
                        >
                            <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z" />
                        </svg>
                    </button>
                </Link>

                <button
                    onClick={() => handleModal(row.original.id)}
                    className=""
                    title="Delete"
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
    })

    return (
        <>
        {isDeleteModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <p className="mb-3 font-bold text-center text-md">
                            Are you sure you want to delete this User?
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
            <h2 className="text-lg font-semibold text-[#107dc7]">User List</h2>
            <div className="w-full mb-3 bg-white border-gray-300 my-5 shadow-lg px-8 py-4 rounded-lg">
                <div className="flex my-2 justify-between font-bold text-red-800">
                    <p>Total User: {users.length}</p>
                    <p>Date: {formattedDate}</p>
                </div>
                <MaterialReactTable table={table} />
            </div>
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
        <ListOfUser />
    </QueryClientProvider>
)

export default ExampleWithProviders
