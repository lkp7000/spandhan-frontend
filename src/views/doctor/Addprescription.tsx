import {
    GetPatientData,
    apiCreatePrescription,
} from '@/services/PrescriptionService'
import axios, { AxiosResponse } from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { date } from 'yup'
import { APP_PREFIX_PATH } from '@/constants/route.constant'
interface Prescription {
    note: string
    beforeDosage: string[]
    dosage: string[]
    duration: string
    edited: boolean
}
interface MedicineDto {
    medicineName: string
    morning: boolean
    afternoon: boolean
    evening: boolean
    night: boolean
    beforeFood: boolean
    afterFood: boolean
    emptyStomach: boolean
    days: number
}
interface ApiResponse {
    data: {
        prescriptionId: string // Adjust the type according to your API response
        // other properties...
    }
    // other properties...
}
const Addprescription = () => {
    const { mrNo } = useParams()
    const mrNum = mrNo
    console.log(mrNo, 'mr')

    const jwtToken = localStorage.getItem('token')
    const doctorUserId = localStorage.getItem('userId')
    const [submitted, setSubmitted] = useState(false)
    const [isTextareaVisible, setIsTextareaVisible] = useState(false)
    const [isDiagnosisAreaVisible, setIsDiagnosisAreaVisible] = useState(false)
    const [isFollowAreaVisible, setIsFollowAreaVisible] = useState(false)
    const [showInput, setShowInput] = useState(false)
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
    const [inputValue, setInputValue] = useState('')
    const [inputDiagnosisValue, setInputDiagnosisValue] = useState('')
    const [inputFollowValue, setInputFollowValue] = useState('')
    const [schedules, setSchedules] = useState<any>([])
    const [dosageValue, setDosageValue] = useState('')
    const [durationValue, setDurationValue] = useState('')
    const [prescriptionData, setPrescriptionData] = useState<any>({})
    const [patientData, setPatientData] = useState<any>({})
    const [medicalData, setMedicalData] = useState<any>({})
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [advice, setAdvice] = useState<string[]>([])
    const [diagnosis, setDiagnosis] = useState<string[]>([])
    const [followUp, setFollowUp] = useState<string[]>([])
    const [doctorName, setDoctorName] = useState<string>('')
    const [doctorId, setDoctorId] = useState<string>('')
    const [date, setDate] = useState<string>('')
    const [patientDob, setPatientDob] = useState<string>('')
    const navigate = useNavigate()
    const [editIndex, setEditIndex] = useState(null)
    const [editFollowIndex, setEditFollowIndex] = useState(null)
    const [editDiagnosisIndex, setEditDiagnosisIndex] = useState(null)
    const [editTimeIndex, setEditTimeIndex] = useState(null)
    const [time, setTime] = useState<any>({
        medicineName: '',
        morning: false,
        afternoon: false,
        evening: false,
        night: false,
        days: '',
        beforeFood: false,
        afterFood: false,
        emptyStomach: false,
    })

    // const [prescriptionToDelete, setPrescriptionToDelete] = useState<
    //     number | null
    // >(null)
    // const [suggestedMedicines, setSuggestedMedicines] = useState([])
    // const doctorUserId = 5

    const [initialValues, setInitialValues] = useState({
        // Define Initial values
        mrNo: mrNum,
        prescriptionDate: '',
        doctor: '',
        doctorId: '',
        medicineDtos: [
            {
                medicineName: '',
                morning: false,
                afternoon: false,
                evening: false,
                night: false,
                days: '',
                beforeFood: false,
                afterFood: false,
                emptyStomach: false,
            },
        ],
        diagnosisDtos: [
            {
                diagnosisName: '',
            },
        ],
        adviceDtos: [
            {
                adviceName: '',
            },
        ],
        followUpDtos: [
            {
                followName: '',
            },
        ],
    })

    // const handleAddNewClick = () => {
    //     setShowInput(true)
    // }
    const handleDosageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDosageValue(e.target.value)
    }

    const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDurationValue(e.target.value)
    }

    const handleAddPrescription = () => {
        if (time.medicineName.trim() !== '') {
            if (editTimeIndex !== null) {
                // If editing, update the schedule at editIndex
                const updatedSchedules: any = [...schedules]
                updatedSchedules[editTimeIndex] = time
                setSchedules(updatedSchedules)
                setEditTimeIndex(null)
            } else {
                // If not editing, add a new schedule
                setSchedules([...schedules, time])
            }

            // Reset the time state
            setTime({
                medicineName: '',
                morning: false,
                afternoon: false,
                evening: false,
                night: false,
                days: '',
                beforeFood: false,
                afterFood: false,
                emptyStomach: false,
            })
        }
    }

    const handleAdvice = () => {
        if (inputValue.trim() !== '') {
            if (editIndex !== null) {
                // If editing, update the item at editIndex
                const updatedItems = [...advice]
                updatedItems[editIndex] = inputValue
                setAdvice(updatedItems)
                setEditIndex(null)
            } else {
                // If not editing, add a new item
                setAdvice([...advice, inputValue])
            }

            setInputValue('')
        }
    }
    const handleDiagnosis = () => {
        if (inputDiagnosisValue.trim() !== '') {
            if (editDiagnosisIndex !== null) {
                // If editing, update the item at editIndex
                const updatedItems = [...diagnosis]
                updatedItems[editDiagnosisIndex] = inputDiagnosisValue
                setDiagnosis(updatedItems)
                setEditDiagnosisIndex(null)
            } else {
                // If not editing, add a new item
                setDiagnosis([...diagnosis, inputDiagnosisValue])
            }

            setInputDiagnosisValue('')
        }
    }
    const handleFollowUp = () => {
        if (inputFollowValue.trim() !== '') {
            if (editFollowIndex !== null) {
                // If editing, update the item at editIndex
                const updatedFollowList = [...followUp]
                updatedFollowList[editFollowIndex] = inputFollowValue
                setFollowUp(updatedFollowList)
                setEditFollowIndex(null)
            } else {
                // If not editing, add a new item
                setFollowUp([...followUp, inputFollowValue])
            }

            setInputFollowValue('')
        }
    }
    const scheduleDtos = schedules.map((schedule: any) => ({
        medicineName: schedule.medicineName,
        morning: schedule.morning,
        afternoon: schedule.afternoon,
        evening: schedule.evening,
        night: schedule.night,
        days: schedule.days,
        beforeFood: schedule.beforeFood,
        afterFood: schedule.afterFood,
        emptyStomach: schedule.emptyStomach,
    }))
    const adviceDtos = advice?.map((adviceName) => ({ adviceName }))
    const followDtos = followUp?.map((followName) => ({ followName }))
    const diagnosisDtos = diagnosis?.map((diagnosisName) => ({ diagnosisName }))
    const payload = {
        ...initialValues,
        medicineDtos: scheduleDtos,
        prescriptionDate: date,
        doctor: doctorName,
        doctorId: doctorId,
        adviceDtos: adviceDtos,
        diagnosisDtos: diagnosisDtos,
        followUpDtos: followDtos,
    }

    const submitPrescription = async () => {
        const jwtToken = localStorage.getItem('token')
        const mrNo = initialValues.mrNo

        try {
            let response = await apiCreatePrescription(payload)
            console.log(response)

            if (
                response.status === 200 ||
                response.status === 201 ||
                response.statusText == 'OK'
            ) {
                const id = (response as any)?.data?.prescriptionId
                console.log(id)
                toast.push(
                    <Notification
                        title={`Successfuly`}
                        type="success"
                        duration={2500}
                    >
                        Created successfuly
                    </Notification>,
                    {
                        placement: 'top-end',
                    }
                )
                navigate(`${APP_PREFIX_PATH}/PrescriptionPreview/${id}`)
            }
        } catch (error) {
            console.error('Error Adding prescription:', error)
        }

        //   console.log(payload);
    }

    useEffect(() => {
        const fetchPatientData = async () => {
            const para = {
                mrNo: mrNum,
                doctorUserId: doctorUserId,
            }
            console.log(para)

            try {
                const response = await GetPatientData(para)

                if ((response.status === 200, 'view patient')) {
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
                    setDoctorId(docName.id)
                    console.log(dob)

                    if (docName) {
                        const fullName = `${docName.firstName} ${docName.lastName}`
                        console.log(fullName)
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
    // console.log(patientData?.personalInfoDto?.firstName )

    const deleteMedicine = (index: number) => {
        const updatedSchedules = [...schedules]
        updatedSchedules.splice(index, 1)
        setSchedules(updatedSchedules)
    }
    const deleteAdvice = (index: number) => {
        setAdvice((prevValues) => prevValues.filter((_, i) => i !== index))
    }
    const deleteDiagnose = (index: number) => {
        setDiagnosis((prevValues) => prevValues.filter((_, i) => i !== index))
    }
    const deleteFollow = (index: number) => {
        setFollowUp((prevValues) => prevValues.filter((_, i) => i !== index))
    }

    // const handleEdit = (index: number) => {
    //     const updatedPrescriptions = [...prescriptions]
    //     updatedPrescriptions[index].edited = true
    //     setPrescriptions(updatedPrescriptions)
    // }

    // const handleSaveEdit = (index: number) => {
    //     const updatedPrescriptions = [...prescriptions]
    //     updatedPrescriptions[index].edited = false
    //     setPrescriptions(updatedPrescriptions)
    // }

    // const handleDelete = (index: number) => {
    //     setPrescriptionToDelete(index)
    //     setShowConfirmation(true)
    // }

    // const confirmDelete = () => {
    //     if (prescriptionToDelete !== null) {
    //         const updatedPrescriptions = prescriptions.filter(
    //             (_, i) => i !== prescriptionToDelete
    //         )
    //         setPrescriptions(updatedPrescriptions)
    //     }
    //     setPrescriptionToDelete(null)
    //     setShowConfirmation(false)
    // }

    // const handleSubmitted = () => {
    //     setSubmitted(true)
    // }

    const handleDiagnosisToggle = () => {
        setIsDiagnosisAreaVisible(!isDiagnosisAreaVisible)
    }
    const handleToggle = () => {
        setIsTextareaVisible(!isTextareaVisible)
    }
    const handleFollowToggle = () => {
        setIsFollowAreaVisible(!isFollowAreaVisible)
    }

    const ToggleFollowTextArea = () => {
        setIsFollowAreaVisible(true)
    }
    const ToggleTextarea = () => {
        setIsTextareaVisible(true)
    }
    const ToggleDiagnosisTextArea = () => {
        setIsDiagnosisAreaVisible(true)
    }

    const handleAction = (e: any) => {
        const { name, value, type, checked } = e.target
        const newValue = type === 'checkbox' ? checked : value
        setTime((prevTime: any) => ({
            ...prevTime,
            [name]: newValue,
        }))
    }

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

    console.log('Age: ' + year_diff)

    const handleEditSchedule = (index: any) => {
        setEditTimeIndex(index)
        setTime(schedules[index])
    }

    const editAdviceData = (index: any) => {
        setEditIndex(index)
        setInputValue(advice[index])
    }
    const editDiagnosisData = (index: any) => {
        setEditDiagnosisIndex(index)
        setInputDiagnosisValue(diagnosis[index])
    }
    const handleFollowEdit = (index: any) => {
        setEditFollowIndex(index)
        setInputFollowValue(followUp[index])
    }

    const handlePrint = () => {
        window.print()
    }

    return (
        <div className="container mx-auto p-4 bg-white">
            <div className="">
                <h3 className="font-bold text-2xl text-[#1cc88a]">
                    {prescriptionData?.doctorDto?.firstName}{' '}
                    {prescriptionData?.doctorDto?.lastName}
                </h3>
                <p className="text-sm text-[#808080]">
                    {prescriptionData?.doctorDto?.qualification}{' '}
                    {prescriptionData?.doctorDto?.specialization}
                </p>
                <br />
                <h5 className="font-bold text-lg">
                    {' '}
                    {prescriptionData?.facilityDto?.facilityName}{' '}
                </h5>
                <h6 className="text-sm text-[#808080] mt-1">
                    {prescriptionData?.facilityDto?.facilityAddress}
                </h6>
                <h6 className="text-xs mt-1">
                    Email : {prescriptionData?.doctorDto?.email}
                </h6>
                <h5 className="text-xs mt-1">
                    Contact No.: {prescriptionData?.doctorDto?.contact}
                </h5>
                <div className="w-1/2 ">
                    <h5 className="text-sm mt-3">MR Number: {mrNum}</h5>
                </div>
                <div className="float-right mt-[-6rem] mr-2">
                    <h5 className="text-xs mt-2">
                        Temperature:
                        <span className="ml-1 font-normal ">
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
                        SpO2:{' '}
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

            <div className="mt-5">
                <div className="flex lg:md:flex-row flex-col">
                    {time.medicineNamec !== '' && (
                        <input
                            type="text"
                            className="w-7/12 h-14 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 "
                            placeholder="Enter your medications"
                            name="medicineName"
                            value={time?.medicineName}
                            onChange={(e: any) => {
                                setTime({
                                    ...time,
                                    medicineName: e.target.value,
                                })
                            }}
                        />
                    )}
                    <div className="flex lg:md:flex-row flex-col">
                        {time.beforeFood !== null && (
                            <div className="flex ">
                                <input
                                    type="checkbox"
                                    className="ml-2 mt-1"
                                    name="beforeFood"
                                    checked={time?.beforeFood}
                                    onChange={handleAction}
                                />
                                <label className="mx-2 mt-5">
                                    (Before Food)
                                </label>
                            </div>
                        )}
                        {time.afterFood !== null && (
                            <div className="flex ">
                                <input
                                    type="checkbox"
                                    className="ml-2 mt-1"
                                    name="afterFood"
                                    checked={time?.afterFood}
                                    onChange={handleAction}
                                />
                                <label className="mx-2 mt-5">
                                    (After Food)
                                </label>
                            </div>
                        )}
                        {time.emptyStomach !== null && (
                            <div className="flex ">
                                <input
                                    type="checkbox"
                                    className="ml-2 mt-1"
                                    name="emptyStomach"
                                    checked={time.emptyStomach}
                                    onChange={handleAction}
                                />
                                <label className="mx-2 mt-5">
                                    (Empty Stomach)
                                </label>
                            </div>
                        )}
                    </div>
                </div>
                <div className="mt-3 flex lg:md:flex-row flex-col">
                    <label className="mx-2 mt-2">
                        <input
                            type="checkbox"
                            className="mr-2"
                            name="morning"
                            checked={time?.morning}
                            onChange={handleAction}
                        />
                        Morning
                    </label>
                    <label className="mx-2 mt-2">
                        <input
                            type="checkbox"
                            className="mr-2"
                            name="afternoon"
                            checked={time?.afternoon}
                            onChange={handleAction}
                        />
                        Afternoon
                    </label>
                    <label className="mx-2 mt-2">
                        <input
                            type="checkbox"
                            className="mr-2"
                            name="evening"
                            checked={time?.evening}
                            onChange={handleAction}
                        />
                        Evening
                    </label>
                    <label className="mx-2 mt-2">
                        <input
                            type="checkbox"
                            className="mr-2"
                            checked={time?.night}
                            name="night"
                            onChange={handleAction}
                        />
                        Night
                    </label>

                    <label className="ml-28">
                        <input
                            className="w-16 mx-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 "
                            type="number"
                            min="0"
                            name="days"
                            value={time?.days}
                            onChange={handleAction}
                            placeholder="no."
                        />
                        <span>Days</span>
                    </label>
                </div>
                <button
                    type="button"
                    onClick={handleAddPrescription}
                    title={editTimeIndex !== null ? 'Update' : 'Save'}
                    className="inline-block lg:md:mt-[-23px] float-right  text-white myButton font-medium rounded-lg text-sm px-3 py-2.5 me-2 mb-2  "
                >
                    {editTimeIndex !== null ? 'Update' : 'Save'}
                </button>
            </div>

            <div className="grid grid-cols-12 w-full border-collapse border border-gray-300 my-5 shadow-md px-2 py-4 rounded-lg">
                <div className="lg:md:col-span-3 col-span-12 border-r-2 px-3">
                    <div className="mt-5">
                        <h5 className="text-sm  font-bold text-[#1cc88a] ">
                            Chief Complaints
                        </h5>
                        <ul>
                            <li className="font-semibold  mt-2">
                                {medicalData?.chiefComplaints}
                            </li>
                            {/* <li className="font-semibold text-black mt-2">
                                allergies: {medicalData?.allergies}
                            </li> */}
                            <span>{medicalData?.allergiesDetails}</span>
                        </ul>
                    </div>
                    <div className="my-5">
                        <h5 className="text-sm  font-bold text-[#1cc88a] ">
                            History
                        </h5>
                        <ul>
                            <li className="font-semibold text-black mt-2">
                                {}
                            </li>
                            <span>{}</span>
                            <li className="font-semibold text-black mt-2">
                                {}
                            </li>
                            <span>{}</span>
                            <li className="font-semibold text-black mt-2">
                                {}
                            </li>
                            <span>{}</span>
                        </ul>
                    </div>
                </div>
                <div className="overflow-auto  lg:md:col-span-9 col-span-12 mx-4">
                    <div className="mt-5">
                        <h5 className="text-sm  font-bold text-[#1cc88a] ">
                            Medicine
                        </h5>
                    </div>
                    <div>
                        <table className="w-full mt-4">
                            <thead>
                                <tr>
                                    <th className="border py-2"></th>
                                    <th className="border w-5/12">Medicine</th>
                                    <th className="border py-2 w-2/12">Time</th>
                                    <th className="border py-2 w-3/12">
                                        Before/After
                                    </th>
                                    <th className="border py-2 w-2/12">Days</th>
                                    <th className="border py-2 w-5"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {schedules.map(
                                    (
                                        prescription: MedicineDto,
                                        index: number
                                    ) => (
                                        <tr key={index} className="mb-6">
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
                                            <td className="border px-3 py-1">
                                                <div className="flex gap-3 ">
                                                    <button title="Edit">
                                                        <svg
                                                            className="fill-[#466991]"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            height="14"
                                                            width="14"
                                                            viewBox="0 0 512 512"
                                                            onClick={() =>
                                                                handleEditSchedule(
                                                                    index
                                                                )
                                                            }
                                                        >
                                                            <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        className=""
                                                        title="Delete"
                                                    >
                                                        <svg
                                                            className="fill-[#dc1212]"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            height="16"
                                                            width="14"
                                                            viewBox="0 0 448 512"
                                                            onClick={() =>
                                                                deleteMedicine(
                                                                    index
                                                                )
                                                            }
                                                        >
                                                            <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="my-6">
                        <div className="mt-8 flex">
                            <h5 className="text-sm  font-bold text-[#1cc88a] ">
                                Diagnosis
                            </h5>
                            <button onClick={handleDiagnosisToggle}>
                                {isDiagnosisAreaVisible ? (
                                    <svg
                                        className="fill-[#1cc88a] mx-2"
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="13"
                                        width="14"
                                        viewBox="0 0 384 512"
                                    >
                                        <path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z" />
                                    </svg>
                                ) : (
                                    <svg
                                        className="fill-[#1cc88a] mx-2"
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="16"
                                        width="14"
                                        viewBox="0 0 448 512"
                                    >
                                        <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        <div className="mt-6">
                            {isDiagnosisAreaVisible && (
                                <div>
                                    <textarea
                                        className="w-8/12 h-14 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 "
                                        placeholder="Enter your Diagnose"
                                        value={inputDiagnosisValue}
                                        onChange={(e) =>
                                            setInputDiagnosisValue(
                                                e.target.value
                                            )
                                        }
                                    />

                                    <button
                                        type="button"
                                        onClick={handleDiagnosis}
                                        title={
                                            editDiagnosisIndex !== null
                                                ? 'Update'
                                                : 'Save'
                                        }
                                        className="float-right text-white  myButton font-medium rounded-lg text-sm px-3 py-2.5 me-2 mb-2  "
                                    >
                                        {editDiagnosisIndex !== null
                                            ? 'Update'
                                            : 'Save'}
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="mx-3 my-3">
                            <ol className="list-disc space-y-2">
                                {diagnosis.map((ob, index) => (
                                    <li key={index}>
                                        <p>
                                            {ob}
                                            <span className="float-right">
                                                <button
                                                    value={'edit'}
                                                    onClick={() =>
                                                        editDiagnosisData(index)
                                                    }
                                                >
                                                    <svg
                                                        className="inline mr-2 mt-[-5px] fill-[#466991]"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        height="14"
                                                        width="14"
                                                        viewBox="0 0 512 512"
                                                    >
                                                        <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z" />
                                                    </svg>
                                                </button>
                                                <button value={'delete'}>
                                                    <svg
                                                        className="inline mx-3 mt-[-5px] fill-[#dc1212]"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        height="14"
                                                        width="14"
                                                        viewBox="0 0 448 512"
                                                        onClick={() =>
                                                            deleteDiagnose(
                                                                index
                                                            )
                                                        }
                                                    >
                                                        <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                                                    </svg>
                                                </button>
                                            </span>
                                        </p>
                                    </li>
                                ))}
                            </ol>
                        </div>
                        <div className="mt-8 flex">
                            <h5 className="text-sm  font-bold text-[#1cc88a] ">
                                Advice
                            </h5>
                            <button onClick={handleToggle}>
                                {isTextareaVisible ? (
                                    <svg
                                        className="fill-[#1cc88a] mx-2"
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="13"
                                        width="14"
                                        viewBox="0 0 384 512"
                                    >
                                        <path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z" />
                                    </svg>
                                ) : (
                                    <svg
                                        className="fill-[#1cc88a] mx-2"
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="16"
                                        width="14"
                                        viewBox="0 0 448 512"
                                    >
                                        <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        <div className="mt-6">
                            {isTextareaVisible && (
                                <div>
                                    <textarea
                                        className="w-8/12 h-14 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 "
                                        placeholder="Enter your Advice"
                                        value={inputValue}
                                        onChange={(e) =>
                                            setInputValue(e.target.value)
                                        }
                                    />

                                    <button
                                        type="button"
                                        onClick={handleAdvice}
                                        title={
                                            editIndex !== null
                                                ? 'Update'
                                                : 'Save'
                                        }
                                        className="float-right text-white  myButton font-medium rounded-lg text-sm px-3 py-2.5 me-2 mb-2  "
                                    >
                                        {editIndex !== null ? 'Update' : 'Save'}
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="mx-3 my-3">
                            <ol className="list-disc space-y-2">
                                {advice.map((ob, index) => (
                                    <li key={index}>
                                        <p>
                                            {ob}
                                            <span className="float-right">
                                                <button
                                                    value={'edit'}
                                                    onClick={() =>
                                                        editAdviceData(index)
                                                    }
                                                >
                                                    <svg
                                                        className="inline mr-2 mt-[-5px] fill-[#466991]"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        height="14"
                                                        width="14"
                                                        viewBox="0 0 512 512"
                                                    >
                                                        <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z" />
                                                    </svg>
                                                </button>
                                                <button value={'delete'}>
                                                    <svg
                                                        className="inline mx-3 mt-[-5px] fill-[#dc1212]"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        height="14"
                                                        width="14"
                                                        viewBox="0 0 448 512"
                                                        onClick={() =>
                                                            deleteAdvice(index)
                                                        }
                                                    >
                                                        <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                                                    </svg>
                                                </button>
                                            </span>
                                        </p>
                                    </li>
                                ))}
                            </ol>
                        </div>

                        <div>
                            <div className="mt-8 flex">
                                <h5 className="text-sm  font-bold text-[#1cc88a] ">
                                    Follow up
                                </h5>
                                <button onClick={handleFollowToggle}>
                                    {isFollowAreaVisible ? (
                                        <svg
                                            className="fill-[#1cc88a] mx-2"
                                            xmlns="http://www.w3.org/2000/svg"
                                            height="13"
                                            width="14"
                                            viewBox="0 0 384 512"
                                        >
                                            <path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z" />
                                        </svg>
                                    ) : (
                                        <svg
                                            className="fill-[#1cc88a] mx-2"
                                            xmlns="http://www.w3.org/2000/svg"
                                            height="16"
                                            width="14"
                                            viewBox="0 0 448 512"
                                        >
                                            <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            <div className="mt-6">
                                {isFollowAreaVisible && (
                                    <div>
                                        <textarea
                                            className="w-8/12 h-14 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 "
                                            placeholder="Enter your Follow up"
                                            value={inputFollowValue}
                                            onChange={(e) =>
                                                setInputFollowValue(
                                                    e.target.value
                                                )
                                            }
                                        />

                                        <button
                                            type="button"
                                            title={
                                                editFollowIndex !== null
                                                    ? 'Update'
                                                    : 'Save'
                                            }
                                            onClick={handleFollowUp}
                                            className="float-right text-white  myButton font-medium rounded-lg text-sm px-3 py-2.5 me-2 mb-2  "
                                        >
                                            {editFollowIndex !== null
                                                ? 'Update'
                                                : 'Save'}
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="mx-3 my-3">
                                <ol className="list-disc space-y-2">
                                    {followUp.map((ob, index) => (
                                        <li key={index}>
                                            <p>
                                                {ob}
                                                <span className="float-right">
                                                    <button
                                                        onClick={() => {
                                                            handleFollowEdit(
                                                                index
                                                            )
                                                        }}
                                                    >
                                                        <svg
                                                            className="inline mr-2 mt-[-5px] fill-[#466991]"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            height="14"
                                                            width="14"
                                                            viewBox="0 0 512 512"
                                                        >
                                                            <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            deleteFollow(index)
                                                        }
                                                    >
                                                        <svg
                                                            className="inline mx-3 mt-[-5px] fill-[#dc1212]"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            height="14"
                                                            width="14"
                                                            viewBox="0 0 448 512"
                                                        >
                                                            <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                                                        </svg>
                                                    </button>
                                                </span>
                                            </p>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex mt-6 mx-auto  gap-3 w-11/12">
                <div className="flex myButton text-white py-2 rounded-full w-36 h-9 align-middle">
                    <button
                        className="flex align-middle justify-center mx-auto my-auto"
                        onClick={submitPrescription}
                    >
                        <svg
                            className="  mr-1.5 my-1 fill-white"
                            xmlns="http://www.w3.org/2000/svg"
                            height="14"
                            width="12"
                            viewBox="0 0 448 512"
                        >
                            <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
                        </svg>
                        Save & Send
                    </button>
                </div>

                {/* <div className="flex border hover:bg-gray-100 text-teal-600 py-2 px-4 rounded-full w-36 h-9 align-middle">
                    <button className="flex align-middle justify-center my-auto">
                        <svg
                            className=" mx-2 my-0.5 fill-teal-600 "
                            xmlns="http://www.w3.org/2000/svg"
                            height="16"
                            width="18"
                            viewBox="0 0 576 512"
                        >
                            <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" />
                        </svg>
                        Preview
                    </button>
                </div> */}

                {/* <div className="flex myButton text-white py-2 rounded-full w-40 h-9 align-middle">
                    <button className="flex text-sm my-auto mx-auto">
                        Save as template
                    </button>
                </div> */}

                {/* <div className="flex border hover:bg-gray-100 text-teal-600 py-2 px-4 rounded-full w-28 h-9 align-middle">
                    <button
                        onClick={handlePrint}
                        className="flex align-middle justify-center my-auto"
                    >
                        <svg
                            className=" mx-2 my-0.5 fill-teal-600"
                            type="button"
                            xmlns="http://www.w3.org/2000/svg"
                            height="16"
                            width="12"
                            viewBox="0 0 384 512"
                        >
                            <path d="M64 464c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16H224v80c0 17.7 14.3 32 32 32h80V448c0 8.8-7.2 16-16 16H64zM64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V154.5c0-17-6.7-33.3-18.7-45.3L274.7 18.7C262.7 6.7 246.5 0 229.5 0H64zm56 256c-13.3 0-24 10.7-24 24s10.7 24 24 24H264c13.3 0 24-10.7 24-24s-10.7-24-24-24H120zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24H264c13.3 0 24-10.7 24-24s-10.7-24-24-24H120z" />
                        </svg>
                        Print
                    </button>
                </div> */}

                <div className="flex bg-red-500 hover:bg-red-700 text-black py-2 px-4 rounded-full w-28 h-9 align-middle">
                    <button className="flex align-middle justify-center my-auto">
                        <svg
                            className=" ml-1 mr-2 my-0.5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            height="16"
                            width="12"
                            viewBox="0 0 384 512"
                        >
                            {' '}
                            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                        </svg>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Addprescription
