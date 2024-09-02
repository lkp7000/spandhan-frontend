import React, { useState, useEffect } from 'react'
import CountUp from 'react-countup'
import { GrowShrinkTag } from '@/components/shared'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
} from 'recharts'
import {
    getAllFacilities,
    getDataUsingDate,
} from '@/services/HospitalAppointment'
import { faUserMd } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { apiGetAllUser } from '@/services/UserService'
import { AxiosResponse } from 'axios'
import { Link } from 'react-router-dom'

interface ListItem {
    mrNo: string
    facility: string
    doctor: string
    date: string
    time: string
    status: string
    category: string
}
interface PatientListItem {
    mrNo: string
    firstName: string
    lastName: string
    email: string
    contact: string
    dob: string
    medicationDetails: string
    allergies: string
}
interface DataPoint {
    name: string
    uv: number
    pv: number
    amt: number
}
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

const Frontdesk: React.FC = () => {
    const [showTable, setShowTable] = useState<boolean>(false)
    const [facilityData, setFacilityData] = useState<any>()
    const [data, setData] = useState<{ name: string; Appointments: any }[]>([])
    const [cases, setCases] = useState<{ Cases: any }[]>([])
    const [users, setUsers] = useState<User[]>([])

    const [facilityDropdownOpen, setFacilityDropdownOpen] =
        useState<boolean>(false)
    const [patientDropdownOpen, setPatientDropdownOpen] =
        useState<boolean>(false)
    const [selectedFacility, setSelectedFacility] = useState()
    const [selectedPatient, setSelectedPatient] = useState<number | null>(null)
    const [facilityDropdownItems, setFacilityDropdownItems] = useState<
        string[]
    >([])

    const [searchTerm, setSearchTerm] = useState('')

    // const doctors = [
    //     { id: 1, name: 'Dr. Smith', qualification: 'MD', isAvailable: true },
    //     { id: 2, name: 'Dr. Johnson', qualification: 'PhD', isAvailable: false },
    //     { id: 3, name: 'Dr. John', qualification: 'MBBS', isAvailable: false },

    //     // Add more doctors as needed
    // ];

    useEffect(() => {
        const fetchFacilities = async () => {
            try {
                const response: any = await getAllFacilities()
                const facilities = response.data.map(
                    (item: { id: any; facilityName: any }) => ({
                        facilityId: item.id,
                        label: item.facilityName,
                    })
                )

                const facilityNames = facilities.map(
                    (facility: { label: any }) => facility.label
                )
                setFacilityDropdownItems(facilityNames) // Set dropdown items here
                setSelectedFacility(facilityNames[0]) // Set default selected facility
            } catch (error) {
                console.error('Error fetching facilities:', error)
            }
        }

        fetchFacilities()
    }, [])

    const getAuthToken = () => {
        return localStorage.getItem('token')
    }
    useEffect(() => {
        const fetchFacilityData = async () => {
            try {
                if (selectedFacility) {
                    const authToken = getAuthToken()
                    const response: any = await getDataUsingDate(
                        selectedFacility
                    )
                    response?.data?.map((item: any) => {
                        setFacilityData(item)
                        const weeklyAppointments = Object.entries(
                            item.weeklyAppointmentDto
                        ).map(([day, Appointments]) => ({
                            name: day,
                            Appointments: Appointments,
                        }))

                        setData(weeklyAppointments)
                        const cases: any = weeklyAppointments.map(
                            (appointment) => appointment
                        )

                        setCases(cases)
                    })
                }
            } catch (error) {
                console.error('Error fetching facility data:', error)
            }
        }

        fetchFacilityData()
    }, [selectedFacility])

    const handleFacilityDropdownClick = (index: any) => {
        const selectedFacilityValue: any = facilityDropdownItems[index]
        setSelectedFacility(selectedFacilityValue)
        setFacilityDropdownOpen(false)
    }

    const handlePatientDropdownClick = (index: number | null) => {
        setPatientDropdownOpen(!patientDropdownOpen)
        setSelectedPatient(index)
    }

    const chartStyle = {
        marginTop: '10px',
    }

    const handleSearchBarClick = () => {
        setShowTable(true)
    }

    const handleEditButtonClick = (selectedPatient: PatientListItem): void => {
        console.log('Editing patient:', selectedPatient)
    }
    const handleCloseButtonClick = () => {
        setShowTable(false)
    }
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

    return (
        <div>
            <div className="flex justify-center">
                <div className="mr-4">
                    <button
                        onClick={() =>
                            setFacilityDropdownOpen(!facilityDropdownOpen)
                        }
                        className=" py-1 h-12 md:mr-2 mt-2 border shadow-md-blue text-black-800 font-bold text-sm border-gray-100 rounded md:w-60 focus:outline-none text-lg hover:shadow-slate-400 shadow-md text-[#0f4164]"
                    >
                        {selectedFacility}
                    </button>
                    {facilityDropdownOpen && (
                        <ul className="absolute mt-2 bg-white shadow-md w-70">
                            {facilityDropdownItems.map((item, index) => (
                                <li
                                    key={index}
                                    onClick={() =>
                                        handleFacilityDropdownClick(index)
                                    }
                                    className={`block px-4 py-2 text-base hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-200 hover:text-[#107dc7] dark:hover:text-white ${
                                        selectedFacility === item
                                            ? 'bg-gray-200 font-bold text-sm text-[#107dc7]'
                                            : ''
                                    }`}
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
            {facilityData && (
                <>
                    <div className="w-full flex justify-center my-8 mt-12 ">
                        <div className=" flex flex-col lg:w-fit w-fit lg:flex-row justify-center  mt-2 gap-1">
                            <div data-aos="fade-up" data-aos-duration="1000">
                                <div className=" group h-[3rem] flex cursor-pointer rounded-2xl bg-white  border border-gray-300 py-0 px-2 gap-2 hover:border-secondary hover:bg-slate-100 shadow-xl items-center">
                                    <div className="">
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 30 30"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="text-secondary transition  justify-center align-middle dark:group-hover:text-black"
                                        >
                                            <g clipPath="url(#clip0_6_2631)">
                                                <path
                                                    opacity="0.3"
                                                    d="M4.2757 15.6078C4.27493 15.6078 4.27425 15.6084 4.27403 15.6091C4.06737 16.3065 3.94528 17.0263 3.9104 17.7528L3.9 18.2V25C3.9 25.5523 3.45228 26 2.9 26H1C0.447715 26 1.18712e-07 25.5523 1.18712e-07 25V20.15C-0.000255849 19.0289 0.413437 17.9471 1.16173 17.1122C1.91001 16.2773 2.94021 15.7481 4.0547 15.626L4.2757 15.6078ZM22.0225 17.0047C21.9324 16.3161 22.4694 15.6613 23.1157 15.9157C23.7351 16.1595 24.299 16.5384 24.7632 17.0317C25.5575 17.8757 25.9998 18.991 26 20.15V25.0001C26 25.5523 25.5523 26 25 26H23.1C22.5477 26 22.1 25.5523 22.1 25V18.2C22.1 17.7948 22.0737 17.3958 22.0225 17.0047ZM4.55 7.80005C5.41195 7.80005 6.2386 8.14246 6.8481 8.75195C7.45759 9.36145 7.8 10.1881 7.8 11.05C7.8 11.912 7.45759 12.7387 6.8481 13.3481C6.2386 13.9576 5.41195 14.3 4.55 14.3C3.68805 14.3 2.8614 13.9576 2.2519 13.3481C1.64241 12.7387 1.3 11.912 1.3 11.05C1.3 10.1881 1.64241 9.36145 2.2519 8.75195C2.8614 8.14246 3.68805 7.80005 4.55 7.80005ZM21.45 7.80005C22.312 7.80005 23.1386 8.14246 23.7481 8.75195C24.3576 9.36145 24.7 10.1881 24.7 11.05C24.7 11.912 24.3576 12.7387 23.7481 13.3481C23.1386 13.9576 22.312 14.3 21.45 14.3C20.588 14.3 19.7614 13.9576 19.1519 13.3481C18.5424 12.7387 18.2 11.912 18.2 11.05C18.2 10.1881 18.5424 9.36145 19.1519 8.75195C19.7614 8.14246 20.588 7.80005 21.45 7.80005Z"
                                                    fill="currentColor"
                                                />
                                                <path
                                                    d="M13 11.7C14.7239 11.7 16.3772 12.3848 17.5962 13.6038C18.8152 14.8228 19.5 16.4761 19.5 18.2V25C19.5 25.5523 19.0523 26 18.5 26H7.5C6.94772 26 6.5 25.5523 6.5 25V18.2C6.5 16.4761 7.18482 14.8228 8.40381 13.6038C9.62279 12.3848 11.2761 11.7 13 11.7ZM13 0C14.3791 0 15.7018 0.547856 16.677 1.52304C17.6521 2.49823 18.2 3.82087 18.2 5.2C18.2 6.57913 17.6521 7.90177 16.677 8.87696C15.7018 9.85214 14.3791 10.4 13 10.4C11.6209 10.4 10.2982 9.85214 9.32304 8.87696C8.34786 7.90177 7.8 6.57913 7.8 5.2C7.8 3.82087 8.34786 2.49823 9.32304 1.52304C10.2982 0.547856 11.6209 0 13 0Z"
                                                    fill="currentColor"
                                                />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_6_2631">
                                                    <rect
                                                        width="40"
                                                        height="40"
                                                        fill="white"
                                                    />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                    </div>
                                    <div className="flex flex-col items-center justify-center">
                                        <span className="font-bold text-sm text-slate-600 transition dark:text-gray dark:group-hover:text-black ">
                                            Today's Appointments
                                        </span>
                                    </div>
                                    <h5 className="text-lg leading-none transition text-[#38658b]">
                                        <CountUp
                                            start={0}
                                            end={
                                                facilityData
                                                    ?.todaysAppointmentDto
                                                    ?.todayAppointments
                                            }
                                            duration={4}
                                            suffix=""
                                        ></CountUp>
                                    </h5>

                                    <GrowShrinkTag
                                        className=""
                                        value={facilityData?.todaysAppointmentDto?.averageAppointments.toFixed(
                                            1
                                        )}
                                        suffix="%"
                                    />
                                </div>
                            </div>

                            <div data-aos="fade-up" data-aos-duration="1000">
                                <div className="group h-[3rem] flex cursor-pointer rounded-2xl bg-white  border border-gray-300 py-0 px-2 gap-2 hover:border-secondary hover:bg-slate-100 shadow-xl items-center">
                                    <div className="">
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 30 30"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="text-secondary transition dark:group-hover:text-black"
                                        >
                                            <g clipPath="url(#clip0_6_2631)">
                                                <path
                                                    opacity="0.3"
                                                    d="M4.2757 15.6078C4.27493 15.6078 4.27425 15.6084 4.27403 15.6091C4.06737 16.3065 3.94528 17.0263 3.9104 17.7528L3.9 18.2V25C3.9 25.5523 3.45228 26 2.9 26H1C0.447715 26 1.18712e-07 25.5523 1.18712e-07 25V20.15C-0.000255849 19.0289 0.413437 17.9471 1.16173 17.1122C1.91001 16.2773 2.94021 15.7481 4.0547 15.626L4.2757 15.6078ZM22.0225 17.0047C21.9324 16.3161 22.4694 15.6613 23.1157 15.9157C23.7351 16.1595 24.299 16.5384 24.7632 17.0317C25.5575 17.8757 25.9998 18.991 26 20.15V25.0001C26 25.5523 25.5523 26 25 26H23.1C22.5477 26 22.1 25.5523 22.1 25V18.2C22.1 17.7948 22.0737 17.3958 22.0225 17.0047ZM4.55 7.80005C5.41195 7.80005 6.2386 8.14246 6.8481 8.75195C7.45759 9.36145 7.8 10.1881 7.8 11.05C7.8 11.912 7.45759 12.7387 6.8481 13.3481C6.2386 13.9576 5.41195 14.3 4.55 14.3C3.68805 14.3 2.8614 13.9576 2.2519 13.3481C1.64241 12.7387 1.3 11.912 1.3 11.05C1.3 10.1881 1.64241 9.36145 2.2519 8.75195C2.8614 8.14246 3.68805 7.80005 4.55 7.80005ZM21.45 7.80005C22.312 7.80005 23.1386 8.14246 23.7481 8.75195C24.3576 9.36145 24.7 10.1881 24.7 11.05C24.7 11.912 24.3576 12.7387 23.7481 13.3481C23.1386 13.9576 22.312 14.3 21.45 14.3C20.588 14.3 19.7614 13.9576 19.1519 13.3481C18.5424 12.7387 18.2 11.912 18.2 11.05C18.2 10.1881 18.5424 9.36145 19.1519 8.75195C19.7614 8.14246 20.588 7.80005 21.45 7.80005Z"
                                                    fill="currentColor"
                                                />
                                                <path
                                                    d="M13 11.7C14.7239 11.7 16.3772 12.3848 17.5962 13.6038C18.8152 14.8228 19.5 16.4761 19.5 18.2V25C19.5 25.5523 19.0523 26 18.5 26H7.5C6.94772 26 6.5 25.5523 6.5 25V18.2C6.5 16.4761 7.18482 14.8228 8.40381 13.6038C9.62279 12.3848 11.2761 11.7 13 11.7ZM13 0C14.3791 0 15.7018 0.547856 16.677 1.52304C17.6521 2.49823 18.2 3.82087 18.2 5.2C18.2 6.57913 17.6521 7.90177 16.677 8.87696C15.7018 9.85214 14.3791 10.4 13 10.4C11.6209 10.4 10.2982 9.85214 9.32304 8.87696C8.34786 7.90177 7.8 6.57913 7.8 5.2C7.8 3.82087 8.34786 2.49823 9.32304 1.52304C10.2982 0.547856 11.6209 0 13 0Z"
                                                    fill="currentColor"
                                                />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_6_2631">
                                                    <rect
                                                        width="20"
                                                        height="20"
                                                        fill="white"
                                                    />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                    </div>

                                    <div className="flex flex-col items-center justify-center">
                                        <span className="font-bold text-sm text-slate-600 transition dark:text-gray dark:group-hover:text-black ">
                                            Availability of Doctors
                                        </span>
                                    </div>
                                    <h5 className="pb-2.5  text-2xl font-black leading-none transition text-[#38658b]">
                                        <CountUp
                                            start={0}
                                            end={50}
                                            duration={4}
                                            suffix=""
                                        ></CountUp>
                                    </h5>

                                    <GrowShrinkTag
                                        className=""
                                        value={34}
                                        suffix="%"
                                    />
                                </div>
                            </div>
                            <div data-aos="fade-up" data-aos-duration="1000">
                                <div className="group h-[3rem] flex cursor-pointer rounded-2xl bg-white  border border-gray-300 py-0 px-2 gap-2 hover:border-secondary hover:bg-slate-100 shadow-xl items-center">
                                    <div className="">
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 30 30"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="text-secondary transition dark:group-hover:text-black"
                                        >
                                            <g clipPath="url(#clip0_6_2631)">
                                                <path
                                                    opacity="0.3"
                                                    d="M4.2757 15.6078C4.27493 15.6078 4.27425 15.6084 4.27403 15.6091C4.06737 16.3065 3.94528 17.0263 3.9104 17.7528L3.9 18.2V25C3.9 25.5523 3.45228 26 2.9 26H1C0.447715 26 1.18712e-07 25.5523 1.18712e-07 25V20.15C-0.000255849 19.0289 0.413437 17.9471 1.16173 17.1122C1.91001 16.2773 2.94021 15.7481 4.0547 15.626L4.2757 15.6078ZM22.0225 17.0047C21.9324 16.3161 22.4694 15.6613 23.1157 15.9157C23.7351 16.1595 24.299 16.5384 24.7632 17.0317C25.5575 17.8757 25.9998 18.991 26 20.15V25.0001C26 25.5523 25.5523 26 25 26H23.1C22.5477 26 22.1 25.5523 22.1 25V18.2C22.1 17.7948 22.0737 17.3958 22.0225 17.0047ZM4.55 7.80005C5.41195 7.80005 6.2386 8.14246 6.8481 8.75195C7.45759 9.36145 7.8 10.1881 7.8 11.05C7.8 11.912 7.45759 12.7387 6.8481 13.3481C6.2386 13.9576 5.41195 14.3 4.55 14.3C3.68805 14.3 2.8614 13.9576 2.2519 13.3481C1.64241 12.7387 1.3 11.912 1.3 11.05C1.3 10.1881 1.64241 9.36145 2.2519 8.75195C2.8614 8.14246 3.68805 7.80005 4.55 7.80005ZM21.45 7.80005C22.312 7.80005 23.1386 8.14246 23.7481 8.75195C24.3576 9.36145 24.7 10.1881 24.7 11.05C24.7 11.912 24.3576 12.7387 23.7481 13.3481C23.1386 13.9576 22.312 14.3 21.45 14.3C20.588 14.3 19.7614 13.9576 19.1519 13.3481C18.5424 12.7387 18.2 11.912 18.2 11.05C18.2 10.1881 18.5424 9.36145 19.1519 8.75195C19.7614 8.14246 20.588 7.80005 21.45 7.80005Z"
                                                    fill="currentColor"
                                                />
                                                <path
                                                    d="M13 11.7C14.7239 11.7 16.3772 12.3848 17.5962 13.6038C18.8152 14.8228 19.5 16.4761 19.5 18.2V25C19.5 25.5523 19.0523 26 18.5 26H7.5C6.94772 26 6.5 25.5523 6.5 25V18.2C6.5 16.4761 7.18482 14.8228 8.40381 13.6038C9.62279 12.3848 11.2761 11.7 13 11.7ZM13 0C14.3791 0 15.7018 0.547856 16.677 1.52304C17.6521 2.49823 18.2 3.82087 18.2 5.2C18.2 6.57913 17.6521 7.90177 16.677 8.87696C15.7018 9.85214 14.3791 10.4 13 10.4C11.6209 10.4 10.2982 9.85214 9.32304 8.87696C8.34786 7.90177 7.8 6.57913 7.8 5.2C7.8 3.82087 8.34786 2.49823 9.32304 1.52304C10.2982 0.547856 11.6209 0 13 0Z"
                                                    fill="currentColor"
                                                />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_6_2631">
                                                    <rect
                                                        width="20"
                                                        height="20"
                                                        fill="white"
                                                    />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                    </div>
                                    <div className="flex flex-col items-center justify-center">
                                        <span className="font-bold text-sm text-slate-600 transition dark:text-gray dark:group-hover:text-black ">
                                            Number of Patients
                                        </span>
                                    </div>
                                    <h5 className="text-lg font-black leading-none transition text-[#38658b]">
                                        <CountUp
                                            start={0}
                                            end={
                                                facilityData?.todaysPatientDto
                                                    ?.todayPatient
                                            }
                                            duration={4}
                                            suffix=""
                                        ></CountUp>{' '}
                                    </h5>

                                    <GrowShrinkTag
                                        className=""
                                        value={facilityData?.todaysPatientDto?.averagePatient.toFixed(
                                            1
                                        )}
                                        suffix="%"
                                    />
                                </div>
                            </div>
                            {/* Available staff */}
                            <div data-aos="fade-up" data-aos-duration="1000">
                                <div className="group h-[3rem] flex cursor-pointer rounded-2xl bg-white  border border-gray-300 py-0 px-2 gap-2 hover:border-secondary hover:bg-slate-100 shadow-xl items-center">
                                    <div className="">
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 30 30"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="text-secondary transition dark:group-hover:text-black"
                                        >
                                            <g clipPath="url(#clip0_6_2631)">
                                                <path
                                                    opacity="0.3"
                                                    d="M4.2757 15.6078C4.27493 15.6078 4.27425 15.6084 4.27403 15.6091C4.06737 16.3065 3.94528 17.0263 3.9104 17.7528L3.9 18.2V25C3.9 25.5523 3.45228 26 2.9 26H1C0.447715 26 1.18712e-07 25.5523 1.18712e-07 25V20.15C-0.000255849 19.0289 0.413437 17.9471 1.16173 17.1122C1.91001 16.2773 2.94021 15.7481 4.0547 15.626L4.2757 15.6078ZM22.0225 17.0047C21.9324 16.3161 22.4694 15.6613 23.1157 15.9157C23.7351 16.1595 24.299 16.5384 24.7632 17.0317C25.5575 17.8757 25.9998 18.991 26 20.15V25.0001C26 25.5523 25.5523 26 25 26H23.1C22.5477 26 22.1 25.5523 22.1 25V18.2C22.1 17.7948 22.0737 17.3958 22.0225 17.0047ZM4.55 7.80005C5.41195 7.80005 6.2386 8.14246 6.8481 8.75195C7.45759 9.36145 7.8 10.1881 7.8 11.05C7.8 11.912 7.45759 12.7387 6.8481 13.3481C6.2386 13.9576 5.41195 14.3 4.55 14.3C3.68805 14.3 2.8614 13.9576 2.2519 13.3481C1.64241 12.7387 1.3 11.912 1.3 11.05C1.3 10.1881 1.64241 9.36145 2.2519 8.75195C2.8614 8.14246 3.68805 7.80005 4.55 7.80005ZM21.45 7.80005C22.312 7.80005 23.1386 8.14246 23.7481 8.75195C24.3576 9.36145 24.7 10.1881 24.7 11.05C24.7 11.912 24.3576 12.7387 23.7481 13.3481C23.1386 13.9576 22.312 14.3 21.45 14.3C20.588 14.3 19.7614 13.9576 19.1519 13.3481C18.5424 12.7387 18.2 11.912 18.2 11.05C18.2 10.1881 18.5424 9.36145 19.1519 8.75195C19.7614 8.14246 20.588 7.80005 21.45 7.80005Z"
                                                    fill="currentColor"
                                                />
                                                <path
                                                    d="M13 11.7C14.7239 11.7 16.3772 12.3848 17.5962 13.6038C18.8152 14.8228 19.5 16.4761 19.5 18.2V25C19.5 25.5523 19.0523 26 18.5 26H7.5C6.94772 26 6.5 25.5523 6.5 25V18.2C6.5 16.4761 7.18482 14.8228 8.40381 13.6038C9.62279 12.3848 11.2761 11.7 13 11.7ZM13 0C14.3791 0 15.7018 0.547856 16.677 1.52304C17.6521 2.49823 18.2 3.82087 18.2 5.2C18.2 6.57913 17.6521 7.90177 16.677 8.87696C15.7018 9.85214 14.3791 10.4 13 10.4C11.6209 10.4 10.2982 9.85214 9.32304 8.87696C8.34786 7.90177 7.8 6.57913 7.8 5.2C7.8 3.82087 8.34786 2.49823 9.32304 1.52304C10.2982 0.547856 11.6209 0 13 0Z"
                                                    fill="currentColor"
                                                />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_6_2631">
                                                    <rect
                                                        width="20"
                                                        height="20"
                                                        fill="white"
                                                    />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                    </div>
                                    <div className="flex flex-col items-center justify-center">
                                        <span className="font-bold text-sm text-slate-600 transition dark:text-gray dark:group-hover:text-black ">
                                            Available Staff
                                        </span>
                                    </div>
                                    <h5 className="text-lg font-black leading-none transition text-[#38658b]">
                                        <CountUp
                                            start={0}
                                            end={
                                                facilityData?.todaysPatientDto
                                                    ?.todayPatient
                                            }
                                            duration={4}
                                            suffix=""
                                        ></CountUp>{' '}
                                    </h5>

                                    <GrowShrinkTag
                                        className=""
                                        value={facilityData?.todaysPatientDto?.averagePatient.toFixed(
                                            1
                                        )}
                                        suffix="%"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col lg:md:flex-row gap-3">
                        <div className=" w-full mt-8 shadow-xl rounded-md   border border-gray-300">
                            <div className="w-fit mx-auto">
                                <h5 className="mt-3 mb-6  text-[#107dc7]">
                                    Weekly Updates
                                </h5>
                            </div>

                            <div className="w-full md:w-full mx-auto">
                                <ResponsiveContainer
                                    width="100%"
                                    height={250}
                                    style={chartStyle}
                                    className={'overflow-hidden pr-4'}
                                >
                                    <LineChart data={data}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="grey"
                                        />
                                        <XAxis
                                            dataKey="name"
                                            stroke="#000080"
                                            tick={{ fontSize: 10 }}
                                            tickFormatter={(value) =>
                                                value.charAt(0).toUpperCase() +
                                                value.slice(1)
                                            }
                                        />
                                        <YAxis
                                            domain={[0, 100]}
                                            ticks={[0, 25, 50, 75, 100]}
                                            stroke="#000080"
                                        />
                                        <Tooltip />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="Appointments"
                                            // stroke="#82ca9d"
                                            stroke="#000080"
                                            activeDot={{ r: 7 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="w-full mt-8 shadow-xl rounded-md border border-gray-300 mx-auto max-w-full">
                            <div className="w-fit mx-auto">
                                <h5 className="mt-3   text-[#107dc7]">
                                    User List
                                </h5>
                            </div>
                            <div className="  font-bold text-sm mt-[-3px] mx-3 text-red-800">
                                <p>Total User: {users.length}</p>
                            </div>
                            <div className="h-[15rem] overflow-auto mt-2 px-3">
                                <table className="w-full border-collapse border border-gray-300 my-4 shadow-lg">
                                    <thead>
                                        <tr>
                                            <th className="bg-gray-100 border border-gray-300 text-left py-2 px-4">
                                                User ID
                                            </th>
                                            <th className="bg-gray-100 border border-gray-300 text-left py-2 px-4">
                                                UserName
                                            </th>
                                            <th className="bg-gray-100 border border-gray-300 text-left py-2 px-4">
                                                Status
                                            </th>
                                            <th className="bg-gray-100 border border-gray-300 text-left py-2 px-4">
                                                Role
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => (
                                            <tr
                                                key={user.id}
                                                className="hover:bg-gray-100"
                                            >
                                                <td className="border border-gray-300 py-2 px-4">
                                                    {user.id}
                                                </td>
                                                <td className="border border-gray-300 py-2 px-4">
                                                    {user.userName}
                                                </td>
                                                <td className="border border-gray-300 py-2 px-4">
                                                    {user.status}
                                                </td>
                                                <td className="border border-gray-300 py-2 px-4">
                                                    {user.role}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default Frontdesk
