import React, { useState, useEffect } from 'react'
import axios, { AxiosResponse } from 'axios'
import { apiCreateUser, getUserById, updateuser } from '@/services/UserService'
import DoctorForm from '../doctor/DoctorInfo'
import 'react-toastify/dist/ReactToastify.css'

import { NotificationToast } from '@/components/shared/NotificationToast'
import { useParams, useNavigate } from 'react-router-dom'
import { APP_PREFIX_PATH } from '@/constants/route.constant'

const AddUser: React.FC = () => {
    const { id } = useParams<{ id?: any }>()
    const navigate = useNavigate()
    const token = localStorage.getItem('token')
    const [formData, setFormData] = useState({
        userName: '',
        password: '',
        email: '',
        role: 'Select Role',
    })

    const [showDoctorModal, setShowDoctorModal] = useState(false)
    const [demo, setDemo] = useState<any>()

    useEffect(() => {
        const fetchData = async () => {
            if (id) {
                try {
                    const response: AxiosResponse = await getUserById(id)
                    const userData = response.data
                    setFormData(userData)
                    setDemo(response?.data)
                    if (userData.role === 'doctor') {
                        setShowDoctorModal(true)
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error)
                }
            }
        }

        fetchData()
    }, [])
   console.log(demo)

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target
        setFormData((prevData) => ({ ...prevData, [name]: value }))
        if (name === 'role' && value === 'doctor') {
            setShowDoctorModal(true)
        } else {
            setShowDoctorModal(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            if (id) {
                const payload = {
                    ...formData,
                    doctorDto: demo,
                }
                const response: AxiosResponse = await updateuser(
                    id,
                    payload,
                    token
                )
                if (response.status === 200) {
                    NotificationToast('User Updated Successfully', 'success')
                    navigate(`${APP_PREFIX_PATH}/listUser`)
                }
            } else {
                const response: AxiosResponse = await apiCreateUser({
                       id,
                    ...formData,
                    doctorDto: demo,
                })
                if (response) {
                    NotificationToast('User Created Successfully', 'success')
                    navigate(`${APP_PREFIX_PATH}/listUser`) // Specify the path to the list of users
                }
            }
        } catch (error: any) {
            NotificationToast(
                error.response?.data.message || 'An unexpected error occurred',
                'error'
            )
        }
    }

    const handleModalClose = () => {
        setShowDoctorModal(false)
    }
    return (
        <div className="w-80 mx-auto mt-8 p-6 bg-white shadow-md rounded-md">
            <h2 className="text-xl text-[#107dc7] font-semibold mb-4">
                {id ? 'Update User' : 'Add User'}
            </h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600">
                        Username
                    </label>
                    <input
                        type="text"
                        name="userName"
                        value={formData.userName}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border rounded-md"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600">
                        Password
                    </label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border rounded-md"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border rounded-md"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600">
                        Role
                    </label>
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border rounded-md"
                        required
                    >
                        <option value="Select Role" disabled>
                            Select Role
                        </option>
                        <option value="admin">Admin</option>
                        <option value="frontdesk">Frontdesk</option>
                        <option value="doctor">Doctor</option>
                        <option value="accountant">Accountant</option>
                    </select>
                </div>
                <button
                    type="submit"
                    className=" text-white p-2 px-6 rounded-md myButton"
                >
                    {id ? 'Update' : 'Save'}
                </button>

                {showDoctorModal && (
                    <div className="modal-overlay">
                        <div className="modal2">
                            <DoctorForm
                                handleModalClose={handleModalClose}
                                demo={demo}
                                setDemo={setDemo}
                            />
                        </div>
                    </div>
                )}
            </form>
        </div>
    )
}

export default AddUser
