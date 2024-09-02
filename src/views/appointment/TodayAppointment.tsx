import React, { useState, useEffect, useMemo } from 'react'
import {
    MaterialReactTable,
    useMaterialReactTable,
    type MRT_ColumnDef,
} from 'material-react-table'
import {
    apiChangeStatus,
    apiGetAppointmentByDate,
    apiTodaysAppointment,
} from '@/services/AppointmentService' // Update with correct import paths
import { useNavigate } from 'react-router-dom'
import { ConfirmDialog } from '@/components/shared'
import { getDoctorById } from '@/services/DoctorService'
import { getAllFacilities } from '@/services/HospitalAppointment'

interface Appointment {
    appointmentDto: any
    id: number
    mrNo: string
    patientName: string
    doctorName: string
    appointmentTime: string
    status: 'scheduled' | 'cancelled'
    facility: Facility
    doctor: Doctor
    doctorId: number
}

interface Facility {
    id: any
    name: string
}

interface Doctor {
    id: any
    name: string
}

const TodayAppointment = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [selectedFacility, setSelectedFacility] = useState<string>('')
    const [selectedDoctor, setSelectedDoctor] = useState<string>('')
    const [modal, setModal] = useState<boolean>(false)
    const [appointmentsId, setAppointmentsId] = useState<number | null>(null)
    const [facilities, setFacilities] = useState<Facility[]>([])
    const [doctors, setDoctors] = useState<Doctor[]>([])
    const [selectedDoctorId, setSelectedDoctorId] = useState<any>('')

    const navigate = useNavigate()

    const fetchFacilities = async () => {
        try {
            const response = await getAllFacilities()
            const data = response?.data as Facility[]
            setFacilities(data)
        } catch (error) {
            console.error('Error fetching facilities:', error)
        }
    }

    const fetchDoctorsByFacility = async (facilityId: any) => {
        try {
            const response = await getDoctorById(facilityId)
            const data = response?.data as Doctor[]

            setDoctors(data)
        } catch (error) {
            console.error('Error fetching doctors:', error)
        }
    }

    const fetchData = async () => {
        try {
            const params: {
                facility?: string
                doctor?: string
                doctorId?: any
            } = {}

            if (selectedFacility) {
                params.facility = selectedFacility
            }

            if (selectedDoctor) {
                params.doctor = selectedDoctor
            }

            if (selectedDoctorId !== null) {
                params.doctorId = selectedDoctorId
            }

            if (!selectedFacility && !selectedDoctor) {
                const currentDate = new Date();
                const timezoneOffsetInMs = currentDate.getTimezoneOffset() * 60000; // Convert minutes to milliseconds
                const localDate = new Date(currentDate.getTime() - timezoneOffsetInMs);
                
                const formattedDate = localDate.toISOString().split('T')[0];
                const response = await apiGetAppointmentByDate({ appointmentDate: formattedDate, ...params });
                const data = response?.data as Appointment[];
                // Handle the fetched data as needed
                console.log('Fetched Data:', data);
                setAppointments(data);
            } else {
                const response = await apiTodaysAppointment(params);
                const data = response?.data as Appointment[];
                // Handle the fetched data as needed
                const appointmentsData = data.map((item) => ({
                    ...item.appointmentDto,
                    time: new Date(item.appointmentDto.time).toLocaleTimeString(),
                }));
                console.log('Fetched Data:', data);
                setAppointments(appointmentsData);
            }
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    useEffect(() => {
        fetchFacilities()
    }, [])

    useEffect(() => {
        fetchData()
    }, [selectedFacility, selectedDoctor, selectedDoctorId])

    const handleAccept = async (appointmentId: number) => {
        try {
            await apiChangeStatus(appointmentId)
            fetchData()
            setModal(false)
        } catch (error) {
            console.error('Error updating appointment status:', error)
        }
    }

    const handleDecline = async (appointmentId: number) => {
        try {
            await apiChangeStatus(appointmentId)
            fetchData()
        } catch (error) {
            console.error('Error updating appointment status:', error)
        }
    }

    const handleFacilityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedFacilityValue = e.target.value
        setSelectedFacility(selectedFacilityValue)

        if (selectedFacilityValue) {
            const [id, label] = selectedFacilityValue.split(':')
            fetchDoctorsByFacility(Number(id))
        } else {
            setDoctors([])
        }

        setSelectedDoctor('')
    }

    const handleDoctorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedDoctorValue = e.target.value
        setSelectedDoctor(selectedDoctorValue)

        if (selectedDoctorValue) {
            const [id, label] = selectedDoctorValue.split(':')
            setSelectedDoctorId(Number(id))
            //fetchData();
            setAppointments([])
        } else {
            setSelectedDoctorId(null)
        }
    }

    const columns = useMemo<MRT_ColumnDef<Appointment>[]>(
        () => [
            { accessorKey: 'id', header: 'ID', size: 50 },
            { accessorKey: 'mrNo', header: 'MR No.', size: 100 },
            { accessorKey: 'patientName', header: 'Patient Name', size: 150 },
            { accessorKey: 'doctorName', header: 'Doctor Name', size: 150 },
            { accessorKey: 'appointmentTime', header: 'Time', size: 100 },
            { accessorKey: 'status', header: 'Status', size: 100 },
        ],
        []
    )

    const table = useMaterialReactTable({
        columns,
        data: appointments,
    })

    return (
        <>
            <h6 className=" text-[#107dc7] mb-4">Today's Appointment</h6>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <label htmlFor="facility"></label>
                    <select
                        id="facility"
                        onChange={handleFacilityChange}
                        value={selectedFacility}
                        style={{
                            width: '300px',
                            padding: '8px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            marginTop: '8px',
                            cursor: 'pointer',
                            marginBottom: '8px',
                            ...(selectedFacility
                                ? { backgroundColor: '#f5f5f5' }
                                : {}),
                        }}
                    >
                        <option value="">Select by Facility</option>
                        {facilities.map((item: any) => (
                            <option
                                key={item.id}
                                value={`${item.id}:${item.facilityName}`}
                            >
                                {item.facilityName}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="doctor"></label>
                    <select
                        id="doctor"
                        onChange={handleDoctorChange}
                        value={selectedDoctor}
                        style={{
                            width: '300px',
                            padding: '8px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            marginTop: '8px',
                            cursor: 'pointer',
                            ...(selectedDoctor
                                ? { backgroundColor: '#f5f5f5' }
                                : {}),
                        }}
                    >
                        <option value="">Select by Doctor</option>
                        {doctors.map((doctor: any) => (
                            <option
                                key={doctor.id}
                                value={`${doctor.id}:${doctor.firstName}`}
                            >
                                {doctor.firstName}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <MaterialReactTable table={table} />

            <ConfirmDialog
                isOpen={modal}
                title={'Are you sure you want to change the status?'}
                onConfirm={() => {
                    if (appointmentsId !== null) {
                        handleAccept(appointmentsId)
                    }
                }}
                onClose={() => setModal(false)}
            />
        </>
    )
}

export default TodayAppointment
