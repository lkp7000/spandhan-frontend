import React, { useState, useEffect } from 'react'
import {
    apiCreateAppointment,
    getAllFacilities,
} from '@/services/HospitalAppointment'
import 'react-datepicker/dist/react-datepicker.css'
import { useSearchParams } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { getDoctorById, getDoctorDetails } from '@/services/DoctorService'
import { AxiosResponse } from 'axios'
import { NotificationToast } from '@/components/shared/NotificationToast'
import SearchApicomponents from '../patient/patientManagement/SearchApicomponents'

interface Doctor {
    id: any
    firstName: string // assuming this property exists
}

interface AddAppointmentProps {
    selectedTime: string
    submitAddAppointmentHandler: () => void
    closeAddAppointmentHandler: () => void
}

const AddAppointment: React.FC<AddAppointmentProps> = ({
    selectedTime,
    submitAddAppointmentHandler,
    closeAddAppointmentHandler,
}) => {
    const [hospitalNames, setHospitalNames] = useState<
        { facilityId: number; label: string }[]
    >([])
    const [doctors, setDoctors] = useState<Doctor[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selctedAppointmentDate, setSelctedAppointmentDate] = useState('')
    const [selctedAppointmentTime, setSelctedAppointmentTime] = useState('')
    const [formSubmitted, setFormSubmitted] = useState(false)
    const [searchParams, setSearchParams] = useSearchParams()
    const No = searchParams.get('mrNo')
    const selectedDate = searchParams.get('selectedDate')
    const [selectedDoctorFee, setSelectedDoctorFee] = useState<string>('')
    const [doctorDetails, setDoctorDetails] = useState([])

    const [formData, setFormData] = useState({
        mrNo: '',
        facilityId: '',
        appointmentDate: '',
        appointmentTime: '',
        doctorId: '',
        status: 'scheduled',
        category: '',
        paidAmount: '',
        unpaidAmount: '',
        doctorFee: '',
    })

    const openModal = () => {
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
    }

    const [selectedPaymentStatus, setSelectedPaymentStatus] =
        useState<string>('')

    const fetchFacilities = async () => {
        try {
            const response: AxiosResponse = await getAllFacilities()
            const facilities = response.data.map((item: any) => ({
                facilityId: item.id,
                label: item.facilityName,
            }))
            setHospitalNames(facilities)
        } catch (error) {
            console.error('Error fetching facilities:', error)
        }
    }

    useEffect(() => {
        fetchFacilities()
    }, [])

    const fetchDoctors = async (facilityId: any) => {
        try {
            const response: AxiosResponse = await getDoctorById(facilityId)
            setDoctors(response.data)
            console.log(response.data)
        } catch (error) {
            console.error('Error fetching doctors:', error)
        }
    }

    const handleInputChange = async (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target

        const [id, label] = value.split(':')

        if (name === 'facilityId') {
            fetchDoctors(Number(value))
        }

        if (name === 'doctor') {
            // Set the doctorId property in the formData
            const [doctorId, firstName, doctorFee] = value.split(':')
            try {
                // Make an API call to get additional details about the doctor
                const doctorDetailsResponse = await getDoctorDetails(doctorId)
                const doctorDetails = doctorDetailsResponse.data

                setFormData((prevFormData) => ({
                    ...prevFormData,
                    doctorId: id,
                    doctorFee: doctorDetails?.doctorFee,
                    [name]: label,
                }))
            } catch (error) {
                console.error('Error fetching doctor details:', error)
            }
            setFormData((prevFormData) => ({
                ...prevFormData,
                doctorId: id,
                [name]: label, // Use the label for display in the dropdown
            }))
        } else {
            // Update other form data properties
            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: value,
            }))
        }
    }

    useEffect(() => {
        const mrNoFromSearchParams = searchParams.get('mrNo')
        if (mrNoFromSearchParams) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                mrNo: mrNoFromSearchParams,
            }))
        }
        if (selectedTime) {
            // Assume the conversion function is available

            function convertToFormattedDateTime(dateTimeString: any) {
                const dateTimeArray = dateTimeString.split(',')

                const trimmedDateTimeArray = dateTimeArray.map((part: any) =>
                    part.trim()
                )
                const [month, day, year] = trimmedDateTimeArray[0].split('/')
                const [time, period] = trimmedDateTimeArray[1].split(' ')
                const [hours, minutes] = time.split(':')

                let adjustedHours = parseInt(hours, 10)
                if (period === 'PM' && adjustedHours < 12) {
                    adjustedHours += 12
                } else if (period === 'AM' && adjustedHours === 12) {
                    adjustedHours = 0
                }

                const dateTimeObject = new Date(
                    `${year}-${month}-${day} ${adjustedHours}:${minutes}:00`
                )
                const a: any = `${year}-${month.padStart(
                    2,
                    '0'
                )}-${day.padStart(2, '0')}`

                const formattedDate = dateTimeObject.toISOString().split('T')[0]
                const formattedTime = dateTimeObject.toLocaleTimeString(
                    'en-US',
                    {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                    }
                )
                return { a, formattedTime }
            }
            const { a, formattedTime }: any =
                convertToFormattedDateTime(selectedTime)

            setFormData((prevState: any) => ({
                ...prevState,
                appointmentDate: a,
                appointmentTime: formattedTime,
            }))
            setSelctedAppointmentDate(a)
            setSelctedAppointmentTime(formattedTime)
        }
    }, [selectedTime])

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            const response = await apiCreateAppointment(formData)
            if (response) {
                const data: any = response.data
                NotificationToast('Appointment created successfully', 'success')
                setFormSubmitted(true)

                submitAddAppointmentHandler()
            } else {
                throw new Error('Failed to create appointment')
            }
        } catch (error) {
            console.error('Error creating appointment:', error)
        }
    }

    const mrSetter = (mr: any) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            mrNo: mr,
        }))
    }

    const calculateTotalAmount = () => {
        const paidAmount = parseFloat(formData.paidAmount) || 0
        const unpaidAmount = parseFloat(formData.unpaidAmount) || 0
        return paidAmount + unpaidAmount
    }

    const ModalForm = ({ onClose, onSubmit, mrSetter }: any) => {
        const [isClicked, setIsClicked] = useState(false)

        const handleSubmit = (values: any, { setSubmitting }: any) => {
            onSubmit(values)
            setSubmitting(false)
            onClose()
        }

        const [isOpen, setIsOpen] = useState(false)

        const openModal = () => {
            setIsOpen(true)
            setIsClicked(true)
        }

        const closeModal = () => {
            setIsOpen(false)
            onClose()
        }

        return (
            <>
                <button
                    onClick={openModal}
                    type="button"
                    className="text-white  py-2 px-4 rounded mr-2  myButton"
                >
                    <span className="mr-2">
                        <FontAwesomeIcon icon={faSearch} />
                    </span>
                    Search Patient
                </button>

                {isOpen && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <span className="close" onClick={closeModal}>
                                &times;
                            </span>
                            <SearchApicomponents
                                mrSetter={mrSetter}
                                closeModal={closeModal}
                            />
                            <div className="side-close" onClick={closeModal}>
                                &times;
                            </div>
                        </div>
                    </div>
                )}
            </>
        )
    }
    const userRoleFromLocalStorage = localStorage.getItem('role')
    const doctorNameFromLocalStorage = localStorage.getItem('userName')
    return (
        <div className="">
            <ToastContainer />
            <h2>Add Appointment</h2>
            <br />
            <ModalForm
                isOpen={isModalOpen}
                onSubmit={handleFormSubmit}
                mrSetter={mrSetter}
            />
            {isModalOpen ? null : (
                <div className=" ">
                    <form onSubmit={(e) => handleFormSubmit(e)}>
                        <br />

                        <div className="mb-4 relative flex flex-col lg:flex-row">
                            <div className="mb-4 pr-2 relative">
                                <label
                                    htmlFor="mrNo"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    MR No.
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    name="mrNo"
                                    value={formData.mrNo}
                                    onChange={(e) => handleInputChange(e)}
                                    className="p-2  border border-gray-100 rounded focus:outline-none focus:border-blue-600 hover:border-gray-500 shadow-lg"
                                    placeholder="MR No."
                                />
                            </div>

                            <div className="mb-4 mr-2">
                                <label
                                    htmlFor="facility"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Facility
                                </label>
                                <select
                                    name={'facilityId'}
                                    value={formData.facilityId}
                                    onChange={(e: any) => handleInputChange(e)}
                                    className="p-2 px-4 border border-gray-100 rounded focus:outline-none focus:border-blue-600 hover:border-gray-500 shadow-lg w-[100%]"
                                >
                                    <option value="">Select Facility</option>
                                    {hospitalNames.map((facility: any) => (
                                        <option
                                            key={facility.facilityId}
                                            value={`${facility.facilityId}`}
                                        >
                                            {facility.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {(userRoleFromLocalStorage === 'admin' ||
                                userRoleFromLocalStorage === 'frontdesk') && (
                                <div className="mb-4 relative">
                                    <label
                                        htmlFor="doctor"
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        Doctor
                                    </label>
                                    <select
                                        name="doctor"
                                        value={`${formData.doctorId}`}
                                        onChange={(e: any) =>
                                            handleInputChange(e)
                                        }
                                        className="p-2 px-6 border border-gray-100 rounded focus:outline-none focus:border-blue-600 hover:border-gray-500 shadow-lg w-[100%]"
                                    >
                                        <option value="">Select Doctor</option>
                                        {doctors.map((doctor: any) => (
                                            <option
                                                key={doctor.id}
                                                value={`${doctor.id}`}
                                            >
                                                {doctor.firstName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {userRoleFromLocalStorage !== 'admin' &&
                                userRoleFromLocalStorage !== 'frontdesk' && (
                                    // Render the doctor dropdown with only the logged-in doctor's name for other roles
                                    <div className="mb-4 relative">
                                        <label
                                            htmlFor="doctor"
                                            className="text-sm font-medium text-gray-700"
                                        >
                                            Doctor
                                        </label>
                                        <select
                                            name="doctor"
                                            value={doctorNameFromLocalStorage} // This line might be causing the issue
                                            onChange={(e: any) =>
                                                handleInputChange(e)
                                            }
                                            className="p-2 px-6 border border-gray-100 rounded focus:outline-none focus:border-blue-600 hover:border-gray-500 shadow-lg w-[100%]"
                                        >
                                            <option value="">
                                                {doctorNameFromLocalStorage}
                                            </option>
                                        </select>
                                    </div>
                                )}
                        </div>

                        <div className="mb-4 relative flex flex-col lg:flex-row">
                            <div className="mb-4 pr-2 relative ">
                                <label
                                    htmlFor="datepicker"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Select Date
                                </label>
                                <input
                                    type="date"
                                    name="appointmentDate"
                                    value={formData.appointmentDate}
                                    onChange={(e) => handleInputChange(e)}
                                    className="p-2 px-10 border border-gray-100 rounded focus:outline-none focus:border-blue-600 hover:border-gray-500 shadow-lg"
                                    placeholder="Select a date"
                                />
                            </div>
                            <div className="mb-4 mr-2">
                                <label
                                    htmlFor="time"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Enter Time
                                </label>
                                <input
                                    type="time"
                                    id="appointmentTime"
                                    name="appointmentTime"
                                    value={formData.appointmentTime}
                                    onChange={(e) => handleInputChange(e)}
                                    className="p-2 px-16  border border-gray-100 rounded focus:outline-none focus:border-blue-600 hover:border-gray-500 shadow-lg w-[100%]"
                                />
                            </div>
                            <div className="mb-4 relative">
                                <label
                                    htmlFor="status"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Select Status
                                </label>
                                <select
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={(e: any) => handleInputChange(e)}
                                    className="p-2 px-16 border border-gray-100 rounded focus:outline-none focus:border-blue-600 hover:border-gray-500 shadow-lg w-[100%]"
                                >
                                    <option value="default">Scheduled</option>
                                </select>
                            </div>
                        </div>

                        <div className="mb-4 relative flex flex-col lg:flex-row">
                            <div className="mb-4 relative">
                                <label
                                    htmlFor="category"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Select Category
                                </label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={(e) => handleInputChange(e)}
                                    className="p-2 px-14 border border-gray-100 rounded focus:outline-none focus:border-blue-600 hover:border-gray-500 shadow-lg w-[100%]"
                                >
                                    <option value="All">All</option>
                                    <option value="New patient">
                                        New Patient
                                    </option>
                                    <option value="Office visit">
                                        Office Visit
                                    </option>
                                </select>
                            </div>
                        </div>

                        <div className="border-b border-gray-500 my-4 w-full"></div>

                        <div className="mb-4 relative flex flex-col lg:flex-row mt-4">
                            <div className="mb-4 relative">
                                <label
                                    htmlFor="paidAmount"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Paid Amount
                                </label>
                                <div>
                                    <input
                                        type="number"
                                        min="0"
                                        id="paidAmount"
                                        name="paidAmount"
                                        value={formData.paidAmount}
                                        onChange={(e) => handleInputChange(e)}
                                        className="p-2 px-4  border border-gray-100 rounded focus:outline-none focus:border-blue-600 hover:border-gray-500 shadow-lg w-[100%]"
                                    />
                                </div>
                            </div>

                            <div className="mb-4 relative">
                                <label
                                    htmlFor="doctorsFee"
                                    className="block text-sm font-medium text-gray-700 ml-2"
                                >
                                    Doctor's Fee
                                </label>
                                <div>
                                    <input
                                        type="number"
                                        id="doctorsFee"
                                        name="doctorsFee"
                                        value={formData.doctorFee}
                                        onChange={(e) => handleInputChange(e)}
                                        className="p-2 px-4 ml-2 border border-gray-100 rounded focus:outline-none focus:border-blue-600 hover:border-gray-500 shadow-lg w-[100%]"
                                        readOnly // Make it read-only if it's fixed
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <button
                                type="button"
                                onClick={(e) => handleFormSubmit(e)}
                                className=" text-white  py-2 px-4 rounded mr-2  myButton"
                            >
                                Submit
                            </button>
                            <button
                                type="reset"
                                className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded"
                            >
                                Reset
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}

export default AddAppointment
