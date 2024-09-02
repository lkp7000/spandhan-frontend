import { APP_PREFIX_PATH } from '@/constants/route.constant'
import {
    GetPatientData,
    GetPrescriptionById,
} from '@/services/PrescriptionService'
import axios, { AxiosResponse } from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

interface ApiResponse {
    data: {
        mrNo: string // Adjust the type according to your API response
        // other properties...
    }
    // other properties...
}

export default function GetPrescription() {
    const navigate = useNavigate()
    const jwtToken = localStorage.getItem('token')
    const doctorUserId = localStorage.getItem('userId')
    const role = localStorage.getItem('role')
    const doctorId = localStorage.getItem('doctorId')
    const [prescription, setPrescription] = useState<any>({})
    const { id } = useParams()
    const { mrNo } = prescription
    const [advice, setAdvice] = useState<any>([])
    const [diagnosis, setDiagnosis] = useState<any>([])
    const [followUp, setFollowUp] = useState<any>([])
    const [medicine, setMedicine] = useState<any>([])
    const [buttonClicked, setButtonClicked] = useState(false)
    const [date, setDate] = useState<string>('')
    const [patientDob, setPatientDob] = useState<string>('')
    const [doctorName, setDoctorName] = useState<string>('')
    const [prescriptionData, setPrescriptionData] = useState<any>({})
    const [patientData, setPatientData] = useState<any>({})
    const [medicalData, setMedicalData] = useState<any>({})
    const mrNum = localStorage.getItem('mrNo')

    const doct = role == 'admin' ? doctorId : doctorUserId

    useEffect(() => {
        const fetchPrescriptionById = async () => {
            try {
                const response: AxiosResponse = await GetPrescriptionById(
                    Number(id)
                )
                console.log(response, 'res')

                if (response.status === 200) {
                    const data: any = response.data
                    console.log(data)

                    setPrescription(data)
                    setAdvice(data.adviceDtos)
                    setFollowUp(data.followUpDtos)
                    setMedicine(data.medicineDtos)
                    setDiagnosis(data.diagnosisDtos)
                } else {
                    throw new Error('Failed to fetch patient data')
                }
                const mrNo = (response as any)?.data?.mrNo

                // setLoading(false);
            } catch (error) {
                console.error('Error fetching patient data:', error)
                // setError('Failed to fetch patient data. Please try again.');
                // setLoading(false);
            }
        }

        fetchPrescriptionById()
    }, [id])
    const handlePrint = () => {
        window.print()
        setButtonClicked(true)
    }

    useEffect(() => {
        const fetchPatientData = async () => {
            const para = {
                mrNo: mrNum,
                doctorUserId: doct,
            }
            // console.log(para)
            try {
                const response = await GetPatientData(para)

                if (response.status === 200) {
                    const data: any = response.data
                    console.log(data)
                    setPrescriptionData(data)
                    setPatientData(data?.patientDto)
                    setMedicalData(data?.patientDto?.medicalInfoDto)
                    const docName = data?.doctorDto
                    const date = data?.patientDto?.medicalInfoDto
                    setDate(date.createdAt)
                    const dob = data?.patientDto?.personalInfoDto?.dob
                    setPatientDob(dob)
                    // console.log(dob)

                    if (docName) {
                        const fullName = `${docName.firstName} ${docName.lastName}`
                        // console.log(fullName)
                        setDoctorName(fullName)
                    }
                } else {
                    throw new Error('Failed to fetch patient data')
                }
                const mrNo = (response as any)?.data?.mrNo

                // setLoading(false);
            } catch (error) {
                console.error('Error fetching patient data:', error)
                // setError('Failed to fetch patient data. Please try again.');
                // setLoading(false);
            }
        }

        fetchPatientData()
    }, [mrNum, doctorUserId])

    var dob = new Date(patientDob)

    // Get the current date
    var currentDate = new Date()

    // Check if the birthdate is in the current year
    var year_diff =
        dob.getFullYear() === currentDate.getFullYear()
            ? dob.getMonth() === currentDate.getMonth()
                ? currentDate.getDate() - dob.getDate() + ' days'
                : currentDate.getMonth() - dob.getMonth() + ' months'
            : currentDate.getFullYear() - dob.getFullYear() + ' years'

    // console.log('Age: ' + year_diff)

    return (
        <>
            <div className="container mx-auto p-4 border-gray-300 my-5 shadow-lg py-4 rounded-lg px-7">
                <div className="flex mt-1 mx-auto   w-11/12 justify-end">
                    <div className="flex border bg-gray-300 hover:bg-gray-400 text-black py-2 justify-center  w-14 h-9 align-middle">
                        <button
                            onClick={handlePrint}
                            className="flex align-middle justify-center my-auto"
                        >
                            Print
                        </button>
                    </div>
                </div>
                <div className="flex mt-[-2rem] mr-3 mx-auto  gap-3 w-11/12 justify-end">
                    <div className="flex bg-red-600 hover:bg-red-700 h-5 w-5 ">
                        <button
                            onClick={() => {
                                navigate(
                                    `${APP_PREFIX_PATH}/PrescriptionList/${mrNo}`
                                )
                            }}
                            className="flex align-middle justify-center my-auto"
                        >
                            <svg
                                className=" ml-1 mr-2 my-0.5 fill-white"
                                xmlns="http://www.w3.org/2000/svg"
                                height="16"
                                width="12"
                                viewBox="0 0 384 512"
                            >
                                <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="">
                    <p className="font-bold text-lg text-[#86B4E7]">
                        {prescriptionData?.doctorDto?.firstName}{' '}
                        {prescriptionData?.doctorDto?.lastName}
                    </p>
                    <p className="text-sm text-[#808080]">
                        {prescriptionData?.doctorDto?.qualification}{' '}
                        {prescriptionData?.doctorDto?.specialization}
                    </p>
                    <br />
                    <h5> {prescriptionData?.facilityDto?.facilityName} </h5>
                    <h6 className="text-sm mt-1">
                        {prescriptionData?.facilityDto?.facilityAddress}
                    </h6>
                    <h6 className="text-xs mt-1">
                        Email : {prescriptionData?.doctorDto?.email}
                    </h6>
                    <h5 className="text-xs mt-1">
                        Cell: {prescriptionData?.doctorDto?.contact}
                    </h5>
                    <div className="w-1/2 ">
                        <h5 className="text-sm mt-3">MR Number: {mrNo}</h5>
                    </div>
                    <div className="float-right mt-[-6rem] mr-2">
                        <h5 className="text-xs mt-2">
                            Temprature:
                            <span className="ml-1 font-normal">
                                {medicalData?.temperature}
                            </span>
                        </h5>
                        <h5 className="text-xs mt-2">
                            BP:{' '}
                            <span className="ml-1 font-normal">
                                {medicalData?.bloodPressure}
                            </span>
                        </h5>
                        <h5 className="text-xs mt-2">
                            Spo2:{' '}
                            <span className="ml-1 font-normal">
                                {medicalData?.spo2}
                            </span>
                        </h5>
                    </div>

                    <br />
                </div>
                <div className="w-full h-0.5 bg-gradient-to-r from-blue-300 to-green-600"></div>

                <div className="flex justify-between">
                    <div className="flex">
                        <p className="text-sm mt-3 mb-1 font-extralight mx-1">
                            Patient Name:
                            <span className="ml-1 font-semibold text-black">
                                {patientData?.personalInfoDto?.firstName}{' '}
                                {patientData?.personalInfoDto?.lastName}
                            </span>
                        </p>
                        <p className="text-sm mt-3 mb-1 font-extralight mx-3">
                            Age:
                            <span className="ml-1 font-semibold text-black">
                                {year_diff}
                            </span>
                        </p>
                        <p className="text-sm mt-3 mb-1 font-extralight mx-3">
                            Weight:
                            <span className="font-semibold text-black">
                                {' '}
                                {patientData?.personalInfoDto?.weight}
                            </span>
                        </p>
                    </div>
                    <div className="flex justify-end">
                        <p className="text-sm mt-3 mb-1 font-extralight mx-1">
                            Date:{' '}
                            <span className="font-semibold text-black">
                                {medicalData?.createdAt}
                            </span>
                        </p>
                    </div>
                </div>
                <div className="w-full h-0.5 my-2 bg-gradient-to-r from-blue-300 to-green-600"></div>

                <div className="grid grid-cols-12 w-full border-collapse">
                    <div className="col-span-3 border-r-2 px-3">
                        <div className="mt-5">
                            <h5 className="text-sm  font-bold text-[#86B4E7] ">
                                Chief Complaints
                            </h5>
                            <ul className="list-disc text-xs ml-3">
                                <li className="font-semibold  mt-2">
                                    {medicalData?.chiefComplaints}
                                </li>
                                <li className="font-semibold text-black mt-2">
                                    allergies: {medicalData?.allergies}
                                </li>
                                <span>{medicalData?.allergiesDetails}</span>
                            </ul>
                        </div>
                        <div className="my-5">
                            <h5 className="text-sm  font-bold text-[#86B4E7] ">
                                History
                            </h5>
                            <ul className="list-disc text-xs ml-3">
                                <li className="font-semibold text-black mt-2"></li>
                                <span></span>
                            </ul>
                        </div>
                        <div className="my-5">
                            <h5 className="text-sm  font-bold text-[#86B4E7] ">
                                Diagnosis
                            </h5>
                            <ul className="list-disc text-xs ml-3">
                                <li className="font-semibold text-black mt-2"></li>
                                <span></span>
                            </ul>
                        </div>
                        <div className="my-5">
                            <h5 className="text-sm  font-bold text-[#86B4E7] ">
                                Investigation
                            </h5>
                            <ul className="list-disc text-xs ml-3">
                                <li className="font-semibold text-black mt-2"></li>
                                <span></span>
                            </ul>
                        </div>
                    </div>
                    <div className="col-span-9 mx-4 overflow-auto">
                        <div className="mt-5">
                            <h5 className="text-sm  font-bold text-[#86B4E7] ">
                                Medicine
                            </h5>
                        </div>
                        <div>
                            <table className="w-full mt-4">
                                <thead>
                                    <tr>
                                        <th className="border py-2"></th>
                                        <th className="border w-5/12">
                                            Medicine
                                        </th>
                                        <th className="border py-2 w-2/12">
                                            Time
                                        </th>
                                        <th className="border py-2 w-3/12">
                                            Before/After
                                        </th>
                                        <th className="border py-2 w-2/12">
                                            Days
                                        </th>
                                        <th className="border py-2 w-5"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {medicine.map(
                                        (prescription: any, index: any) => (
                                            <tr className="mb-6">
                                                <td className="border px-2">
                                                    {index + 1}
                                                </td>
                                                <td className="px-2 border py-1">
                                                    {prescription?.medicineName}
                                                </td>
                                                <td className="border lg:pl-8 md:pl-6  py-1">
                                                    <ul className="list-disc text-sm space-y-1">
                                                        {prescription?.morning
                                                            ? 'morning'
                                                            : null}
                                                    </ul>
                                                    <ul className="list-disc text-sm space-y-1">
                                                        {prescription?.afternoon
                                                            ? 'Afternoon'
                                                            : null}
                                                    </ul>
                                                    <ul className="list-disc text-sm space-y-1">
                                                        {prescription?.evening
                                                            ? 'Evening'
                                                            : null}
                                                    </ul>
                                                    <ul className="list-disc text-sm space-y-1">
                                                        {prescription?.night
                                                            ? 'Night'
                                                            : null}
                                                    </ul>
                                                </td>
                                                <td className="border lg:pl-8 md:pl-6  py-1">
                                                    <ul className="list-disc text-sm space-y-1">
                                                        {prescription?.beforeFood
                                                            ? 'Before Food'
                                                            : null}
                                                    </ul>
                                                    <ul className="list-disc text-sm space-y-1">
                                                        {prescription?.afterFood
                                                            ? 'After Food'
                                                            : null}
                                                    </ul>
                                                    <ul className="list-disc text-sm space-y-1">
                                                        {prescription?.emptyStomach
                                                            ? 'Empty Stomach'
                                                            : null}
                                                    </ul>
                                                </td>
                                                <td className="border pl-10">
                                                    {prescription?.days}
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="my-6">
                            <div className="mt-8 flex">
                                <h5 className="text-sm  font-bold text-[#86B4E7] ">
                                    Diagnosis
                                </h5>
                            </div>
                            <div className="mx-3 my-3">
                                <ol className="list-disc space-y-2">
                                    {diagnosis.map((ob: any, index: any) => (
                                        <li key={index}>
                                            <p>{ob.diagnosisName}</p>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                            <div className="mt-8 flex">
                                <h5 className="text-sm  font-bold text-[#86B4E7] ">
                                    Advice
                                </h5>
                            </div>
                            <div className="mx-3 my-3">
                                <ol className="list-disc space-y-2">
                                    {advice.map((ob: any, index: any) => (
                                        <li key={index}>
                                            <p>{ob.adviceName}</p>
                                        </li>
                                    ))}
                                </ol>
                            </div>

                            <div>
                                <div className="mt-8 flex">
                                    <h5 className="text-sm  font-bold text-[#86B4E7] ">
                                        Follow up
                                    </h5>
                                </div>
                                <div className="mx-3 my-3">
                                    <ol className="list-disc space-y-2">
                                        {followUp.map((ob: any, index: any) => (
                                            <li key={index}>
                                                <p>{ob.followName}</p>
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
