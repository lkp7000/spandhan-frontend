import React, { useEffect, useState } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import axios from 'axios'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import AddAppointment from '../appointment/AddAppointment'
import { getAllDoctors } from '@/services/DoctorService'
import {
    deleteAppointment,
    getAppointment,
    getAppointmentId,
} from '@/services/AppointmentService'
import { AxiosResponse } from 'axios'
import { CalendarView } from '@/components/shared'
import Container from '@/components/shared/Container'
import EventDialog from '../crm/Calendar/components/EventDialog'
import Select from '@/components/ui/Select/Select'

const localizer = momentLocalizer(moment)

const DoctorDash: React.FC = () => {
    const [events, setEvents] = useState<any>([])
    const [selectedEvent, setSelectedEvent] = useState<any>()
    const [selectedTime, setSelectedTime] = useState<string | null>(null)
    const [isFirstPopup, setIsFirstPopup] = useState(false)
    const [isAddAppointmentModel, setIsAddAppointmentModel] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState()
    const [selectedDoctor, setSelectedDoctor] = useState<any>(4)
    const [loading, setLoading] = useState<boolean>(false)
    const [doctorList, setDoctorList] = useState<any[]>([])
    const [selectedDoctorId, setSelectedDoctorId] = useState<any>(null)

    const fetchData = async (doctorId?: any) => {
        try {
            setLoading(true)
            let response

            if (doctorId) {
                response = await getAppointmentId(doctorId)
            } else {
                response = await getAppointment()
            }

            const appointments: any = response.data

            const formattedAppointments = appointments.map(
                (appointment: any) => ({
                    id: appointment.id,
                    title: `${
                        appointment.patientName || 'Unknown Patient'
                    } - Unpaid Amount: ${appointment.unpaidAmount}`,
                    start: new Date(
                        `${appointment.appointmentDate}T${appointment.appointmentTime}`
                    ),
                    end: new Date(
                        `${appointment.appointmentDate}T${appointment.endAppointmentTime}`
                    ),
                    facility: appointment.facility,
                    doctor: appointment.doctor,
                    status: appointment.status,
                    category: appointment.category,
                    unpaidAmount: appointment.unpaidAmount,
                })
            )

            setEvents(formattedAppointments)
            setLoading(false)
        } catch (error) {
            console.error('Error fetching appointments:', error)
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData(selectedDoctorId)
    }, [selectedDoctorId])

    const handleSelectSlot = (slotInfo: any) => {
        // const selectedDate = new Date(slotInfo.start);
        // const currentDate = new Date();
        // if (selectedDate < currentDate) {
        //   alert('Cannot create appointments in the past.');
        //   return;
        // }
        // setIsFirstPopup(true);
        // const newEvent = {
        //   id: events.length + 1,
        //   title: '',
        //   start: slotInfo.start,
        //   end: slotInfo.end,
        //   doctor: selectedDoctor,
        // };
        // setEvents([...events, newEvent]);
        // setSelectedEvent(newEvent);
    }

    const handleSelectEvent = (event: any) => {
        // setSelectedTime(event.start?.toLocaleString());
        // setIsDeleteModalOpen(true);
        // setSelectedEvent(event);
    }

    const firstModelCloseHandler = () => {
        const newArray = events.slice(0, -1)
        setEvents(newArray)
        setIsFirstPopup(false)
    }

    const openAddAppointmentModel = (time: string | null) => {
        setSelectedTime(time)
        setIsAddAppointmentModel(true)
        setIsFirstPopup(false)
    }

    const closeAddAppointmentModel = () => {
        fetchData()
        setIsAddAppointmentModel(false)
    }

    const submitAddAppointmentHandler = () => {
        fetchData()
        setIsAddAppointmentModel(false)
    }

    const handleDeleteAppointment = async (id: number) => {
        try {
            const response: AxiosResponse = await deleteAppointment(id)
            if (response.status === 204) {
                fetchData()
                setIsDeleteModalOpen(false)
            } else {
                console.error('Error deleting appointment:', response.data)
            }
        } catch (error) {
            console.error('Error deleting appointment:', error)
        }
    }

    const handleCancel = () => {
        setSelectedEvent(null)
        setIsDeleteModalOpen(false)
    }

    const eventStyleGetter = (event: { color: string }) => {
        const style = {
            backgroundColor: 'green',
            borderRadius: '5px',
            opacity: 0.8,
            color: 'blue',
            border: '0',
            display: 'block',
        }
        if (event.color === 'green') {
            style.backgroundColor = 'green'
        }
        return { style }
    }

    const openDeleteModal = () => {
        // setIsOpen(true);
    }

    const closeAddAppointmentHandler = () => {
        setIsAddAppointmentModel(false)
        fetchData()
    }

    const selectedEventIsBooked =
        selectedEvent && selectedEvent.status === 'booked'

    const fetchDoctors = async () => {
        try {
            const response = await getAllDoctors()
            const data: any = response.data
            const formattedDoctorList = data.map((doctor: any) => ({
                label: doctor.firstName,
                id: doctor.id,
            }))
            console.log(formattedDoctorList[0]?.id)
            fetchData(formattedDoctorList[0]?.id)
            setDoctorList(formattedDoctorList)
        } catch (error) {
            console.error('Error fetching doctors:', error)
        }
    }

    useEffect(() => {
        fetchDoctors()
    }, [])

    return (
        <div>
            <h2></h2>

            <div
                style={{
                    margin: '45px',
                    width: '250px',
                    fontSize: '16px',
                    marginLeft: '65%',
                }}
            ></div>

            <div style={{ height: '500px' }}>
                <Calendar
                    className="bg-white p-4 rounded-md  "
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{
                        margin: '30px',
                    }}
                    selectable
                    onSelectSlot={handleSelectSlot}
                    onSelectEvent={handleSelectEvent}
                    views={['month', 'week', 'day']}
                    defaultView="day"
                    step={15}
                />
            </div>

            {isFirstPopup && (
                <div className="fixed top-1/2 left-1/2  p-3 bg-white border border-black-300 shadow-lg rounded-lg z-50">
                    <p className="mb-4 font-bold">{`Selected Date: ${
                        selectedEvent
                            ? selectedEvent.start?.toLocaleString()
                            : 'No time selected'
                    }`}</p>

                    <div className="flex justify-center">
                        <button
                            onClick={() => {
                                openAddAppointmentModel(
                                    selectedEvent.start?.toLocaleString()
                                )
                            }}
                            className="text-white px-5 py-1 mr-2 rounded focus:outline-none focus:ring focus:border-blue-300 shadow-lg rounded-xl myButton"
                        >
                            Add Appointment
                        </button>

                        <button
                            onClick={() => {
                                firstModelCloseHandler()
                            }}
                            className="bg-red-500 hover:bg-red-700 px-2 mr-1 rounded border text-white border-gray-400 shadow-lg"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {isAddAppointmentModel && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <span
                            className="close"
                            onClick={closeAddAppointmentModel}
                        >
                            &times;
                        </span>
                        <AddAppointment
                            selectedTime={selectedTime || ' '}
                            submitAddAppointmentHandler={
                                submitAddAppointmentHandler
                            }
                            closeAddAppointmentHandler={
                                closeAddAppointmentHandler
                            }
                        />
                        <div
                            className="side-close"
                            onClick={closeAddAppointmentModel}
                        >
                            &times;
                        </div>
                    </div>
                </div>
            )}

            {isDeleteModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <p className="mb-3 font-bold text-center text-md">
                        Are you want to Delete or Add Prescription?
                        </p>
                        <div className="flex justify-center">
                            <Link to="/addprescription" className="block">
                                <div className="text-white px-2 py-1 mr-1 rounded focus:outline-none focus:ring focus:border-blue-300 myButton">
                                    <button>Add Prescription</button>
                                </div>
                            </Link>
                            <button
                                onClick={() => {
                                    console.log('Button clicked')
                                    handleDeleteAppointment(selectedEvent.id)
                                }}
                                className="bg-red-500 hover:bg-red-700 text-white px-2 py-1 mr-1 rounded focus:outline-none focus:ring focus:border-blue-300"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => {
                                    handleCancel()
                                }}
                                className="bg-gray-300 hover:bg-gray-200 text-black-500 px-2 mr-1 rounded border text-black border-gray-400 shadow-lg"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DoctorDash
