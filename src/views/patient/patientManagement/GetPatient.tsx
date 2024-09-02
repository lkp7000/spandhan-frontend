import { APP_PREFIX_PATH } from '@/constants/route.constant'
import { apiGetPatientByMrNo } from '@/services/PaitantData'
import { getPrescriptionByMrNo } from '@/services/PrescriptionService'
import { AxiosResponse } from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

const GetPatient = () => {
    const { id } = useParams()
    const [patientData, setPatientData] = useState<any>({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response: AxiosResponse = await getPrescriptionByMrNo(
                    Number(id)
                )
                if (response.status === 200) {
                    const data: any = response.data
                    setPatientData(data)
                } else {
                    throw new Error('Failed to fetch patient data')
                }

                setLoading(false)
            } catch (error) {
                console.error('Error fetching patient data:', error)
                setError('Failed to fetch patient data. Please try again.')
                setLoading(false)
            }
        }

        fetchData()
    }, [id])
    const handlePrint = () => {
        window.print()
    }
    const handleAddAppointment = () => {
        // Add logic for navigating to the "Add Appointment" page
        // e.g., use react-router Link or history.push
    }
    return (
        <div>
            <div className="flex justify-between items-center">
                <h2 className="text-start">Patient Details</h2>

                <div className="flex">
                    {/* <div className="mt-4 p-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded text-center">
                        <button onClick={handlePrint}>Print</button>
                    </div> */}

                    <Link to={`${APP_PREFIX_PATH}/scheduleAppointment`} className="block">
                        <div className="mt-4 ml-2 p-2  text-white font-bold rounded text-center myButton">
                            <button onClick={handleAddAppointment}>
                                Add Appointment
                            </button>
                        </div>
                    </Link>
                </div>
            </div>

            {patientData ? (
                <>
                    <div key={patientData} className="mt-2   ">
                        <div className=" text-white py-1 px-1 ">
                            <h2 className="text-lg font-semibold">
                                Personal Information
                            </h2>
                            <hr className="my-2 border-1 border-black" />
                        </div>

          <div className='flex  p-4'>
          <div className="flex-1">
            <p className="mb-1"><strong>First name : </strong> {patientData?.personalInfoDto?.firstName}</p>
            <p className="mb-1"><strong>Last name : </strong> {patientData?.personalInfoDto?.lastName}</p>
            <p className="mb-1"><strong>Date of birth : </strong> {patientData?.personalInfoDto?.dob}</p>
            <p className="mb-1"><strong>Gender : </strong> {patientData?.personalInfoDto?.gender}</p>
            {/* <p className="mb-1"><strong>Marital Status : </strong> {patientData?.personalInfoDto?.maritalStatus}</p> */}
            <p className="mb-1"><strong>Weight : </strong> {patientData?.personalInfoDto?.weight}</p>
            <p className="mb-1"><strong>Height : </strong> {patientData?.personalInfoDto?.height}</p>
            <p className="mb-1"><strong>Identity type : </strong> {patientData?.personalInfoDto?.identityType}</p>
            <p className="mb-1"><strong>Identity number: </strong> {patientData?.personalInfoDto?.identityNumber}</p>
            </div>
            <div className="flex-1">
            {/* <p className="mb-1"><strong>Weight : </strong> {patientData?.personalInfoDto?.weight}</p>
            <p><strong>Height : </strong> {patientData?.personalInfoDto?.height}</p> */}
                                <p className="mb-1">
                                    <strong>Marital Status : </strong>{' '}
                                    {
                                        patientData?.personalInfoDto
                                            ?.maritalStatus
                                    }
                                </p>
                                <p className="mb-1">
                                    <strong>Email : </strong>{' '}
                                    {patientData?.personalInfoDto?.email}
                                </p>
                                <p className="mb-1">
                                    <strong>Contact Number : </strong>{' '}
                                    {patientData?.personalInfoDto?.contact}
                                </p>
                                <p className="mb-1">
                                    <strong>Street Address : </strong>{' '}
                                    {
                                        patientData?.personalInfoDto?.addressDto
                                            .streetAddOne
                                    }
                                </p>
                                <p className="mb-1">
                                    <strong>Street Address Line 2 : </strong>{' '}
                                    {
                                        patientData?.personalInfoDto?.addressDto
                                            .streetAddTwo
                                    }
                                </p>
                                <p className="mb-1">
                                    <strong>City : </strong>{' '}
                                    {
                                        patientData?.personalInfoDto?.addressDto
                                            .city
                                    }
                                </p>
                                <p className="mb-1">
                                    <strong>State : </strong>{' '}
                                    {
                                        patientData?.personalInfoDto?.addressDto
                                            .state
                                    }
                                </p>
                                <p className="mb-1">
                                    <strong>Postal code : </strong>{' '}
                                    {
                                        patientData?.personalInfoDto?.addressDto
                                            .zipCode
                                    }
                                </p>
                                {/* Add more patient details fields */}
                            </div>
                        </div>

                        <div className="b text-white py-1 px-1">
                            <h2 className="text-lg font-semibold">
                                Emergency Contact Information
                            </h2>
                            <hr className="my-2 border-1 border-black" />
                        </div>
                        <div className="flex  p-4">
                            <div className="flex-1">
                                <p className="mb-1">
                                    <strong>First name : </strong>{' '}
                                    {patientData?.emergencyDto?.emerFirstName}
                                </p>
                                <p className="mb-1">
                                    <strong>Last name : </strong>{' '}
                                    {patientData?.emergencyDto?.emerLastName}
                                </p>
                                <p className="mb-1">
                                    <strong>Relationship : </strong>{' '}
                                    {patientData?.emergencyDto?.relation}
                                </p>
                                <p className="mb-1">
                                    <strong>Contact Number : </strong>{' '}
                                    {
                                        patientData?.emergencyDto
                                            ?.emergencyContact
                                    }
                                </p>
                            </div>
                            <div className="flex-1">
                                <p className="mb-1">
                                    <strong>Street Address : </strong>{' '}
                                    {
                                        patientData?.emergencyDto
                                            ?.emergencyAddressDto
                                            .emerStreetAddOne
                                    }
                                </p>
                                <p className="mb-1">
                                    <strong>Street Address Line 2 : </strong>{' '}
                                    {
                                        patientData?.emergencyDto
                                            ?.emergencyAddressDto
                                            .emerStreetAddTwo
                                    }
                                </p>
                                <p className="mb-1">
                                    <strong>City : </strong>{' '}
                                    {
                                        patientData?.emergencyDto
                                            ?.emergencyAddressDto.emerCity
                                    }
                                </p>
                                <p className="mb-1">
                                    <strong>State : </strong>{' '}
                                    {
                                        patientData?.emergencyDto
                                            ?.emergencyAddressDto.emerState
                                    }
                                </p>
                                <p className="mb-1">
                                    <strong>Postal code : </strong>{' '}
                                    {
                                        patientData?.emergencyDto
                                            ?.emergencyAddressDto.emerZipCode
                                    }
                                </p>
                            </div>
                            {/* Add more patient details fields */}
                        </div>
                        <div className=" text-white py-1 px-1">
                            <h2 className="text-lg font-semibold">
                                Medical Aid Information
                            </h2>
                            <hr className="my-2 border-1 border-black" />
                        </div>
                        <div className="p-4">
                            <p className="mb-1">
                                <strong>Blood Pressure : </strong>{' '}
                                {patientData?.medicalInfoDto?.bloodPressure}
                            </p>
                            <p className="mb-1">
                                <strong>Temperature : </strong>{' '}
                                {patientData?.medicalInfoDto?.temperature}
                            </p>
                            <p className="mb-1">
                                <strong>SpO2 : </strong>{' '}
                                {patientData?.medicalInfoDto?.spo2}
                            </p>
                            <p className="mb-1">
                                <strong>Chief Complaints: </strong>{' '}
                                {patientData?.medicalInfoDto?.chiefComplaints}
                            </p>
                            <p className="mb-1">
                                <strong>
                                    Taking any medications currently :{' '}
                                </strong>{' '}
                                {patientData?.medicalInfoDto?.medication}
                            </p>
                            <p className="mb-1">
                                <strong>If yes , please mention : </strong>{' '}
                                {patientData?.medicalInfoDto?.medicationDetails}
                            </p>
                            <p className="mb-1">
                                <strong>Do you have any allergies : </strong>{' '}
                                {patientData?.medicalInfoDto?.allergies}
                            </p>
                            <p className="mb-1">
                                <strong>If yes , please mention : </strong>{' '}
                                {patientData?.medicalInfoDto?.allergiesDetails}
                            </p>

                            {/* Add more patient details fields */}
                        </div>
                    </div>
                </>
            ) : (
                <p>Loading patient data...{patientData}</p>
            )}
        </div>
    )
}

export default GetPatient
