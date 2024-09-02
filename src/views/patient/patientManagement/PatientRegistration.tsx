import { Formik, Form, Field, ErrorMessage } from 'formik'
import { useEffect, useState } from 'react'
import * as Yup from 'yup'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { FormItem } from '@/components/ui'
import { useMediaQuery } from 'react-responsive'
import axios, { AxiosResponse } from 'axios'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
    apiCreatePatient,
    apiGetPatientByMrNo,
    updateUserData,
} from '@/services/PaitantData'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'
import { NotificationToast } from '@/components/shared/NotificationToast'
import { format } from 'date-fns'
import { APP_PREFIX_PATH } from '@/constants/route.constant'

const SingleMenuView = ({ selectedRow, onClose, fetchData }: any) => {
    const isSmallDevice = useMediaQuery({ maxWidth: 767 })
    const navigate = useNavigate()
    const [submittedData, setSubmittedData] = useState(null)
    const [isFormOpen, setFormOpen] = useState(true)
    const [isFormOpen1, setFormOpen1] = useState(false)
    const [isFormOpen3, setFormOpen3] = useState(false)
    const [isFormOpen4, setFormOpen4] = useState(false)
    const [initialValues, setInitialValues] = useState({
        // Define your initial form values here
        personalInfoDto: {
            firstName: '',
            lastName: '',
            dob: '',
            maritalStatus: '',
            gender: '',
            weight: '',
            height: '',
            email: '',
            contact: '',
            identityType: '',
            identityNumber: '',
            addressDto: {
                streetAddOne: '',
                streetAddTwo: '',
                city: '',
                state: '',
                zipCode: '',
            },
        },
        emergencyDto: {
            emerFirstName: '',
            emerLastName: '',
            relation: '',
            emergencyContact: '',
            emergencyAddressDto: {
                emerStreetAddOne: '',
                emerStreetAddTwo: '',
                emerCity: '',
                emerState: '',
                emerZipCode: '',
            },
        },
        medicalInfoDto: {
            chiefComplaints: '',
            medication: '',
            allergies: '',
            medicationDetails: '',
            allergiesDetails: '',
            bloodPressure: '',
            temperature: '',
            spo2: '',
        },
    })
    const { mrNo } = useParams()
    const handleUpdate = async () => {
        // try {
        //     const response: AxiosResponse = await updateUserData(selectedRow.id, {
        //         personalInfoDto: {
        //             firstName: selectedRow.personalInfoDto.firstName,
        //             lastName: selectedRow.personalInfoDto.lastName,
        //             dob: selectedRow.personalInfoDto.dob,
        //             contact: selectedRow.personalInfoDto.contact,
        //             email: selectedRow.personalInfoDto.email,
        //             // ... other fields
        //         },
        //         emergencyDto: {
        //             emerFirstName: selectedRow.emergencyDto.emerFirstName,
        //             emerLastName: selectedRow.emergencyDto.emerLastName,
        //             // ... other fields
        //         },
        //         medicalInfoDto: {
        //             medication: selectedRow.medicalInfoDto.medication,
        //             allergies: selectedRow.medicalInfoDto.allergies,
        //             // ... other fields
        //         },
        //     });
        //     // Handle the response as needed
        //     console.log(response.data);
        //     // Optionally, refetch data after updating
        //     fetchData();
        // } catch (error) {
        //     console.error('Error updating user:', error);
        // }
    }
    function convertToFormattedString(inputDateString: any) {
        const dateObject = new Date(inputDateString)

        const formattedDate = dateObject.toLocaleString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            timeZoneName: 'short',
            timeZone: 'Asia/Kolkata',
        })

        return formattedDate
    }
    useEffect(() => {
        // function convertToFormattedString(inputDateString: any) {
        //     const dateObject = new Date(inputDateString);

        //     const formattedDate = dateObject.toLocaleString('IN-US', {
        //         weekday: 'short',
        //         month: 'short',
        //         day: 'numeric',
        //         year: 'numeric',
        //         hour: 'numeric',
        //         minute: 'numeric',
        //         second: 'numeric',
        //         timeZoneName: 'short',
        //         timeZone: 'Asia/Kolkata',
        //     });

        //     return formattedDate;

        // }

        if (mrNo) {
            const fetchData = async () => {
                try {
                    const response: AxiosResponse = await apiGetPatientByMrNo(
                        Number(mrNo)
                    )
                    if (response.status === 200) {
                        const data: any = response.data
                        // setPatientData(data);
                        const formattedDate = format(
                            new Date(data?.personalInfoDto?.dob),
                            'yyyy-MM-dd'
                        )

                        let updatedData = {
                            ...data,
                            personalInfoDto: {
                                ...data?.personalInfoDto,
                                dob: formattedDate,
                            },
                        }

                        setInitialValues(updatedData)
                    } else {
                        throw new Error('Failed to fetch patient data')
                    }

                    //   setLoading(false);
                } catch (error) {
                    console.error('Error fetching patient data:', error)
                    //   setError('Failed to fetch patient data. Please try again.');
                    //   setLoading(false);
                }
            }

            fetchData()
        }
    }, [mrNo])

    useEffect(() => {
        if (selectedRow) {
            setInitialValues({
                personalInfoDto: {
                    firstName: selectedRow.personalInfoDto.firstName || '',
                    lastName: selectedRow.personalInfoDto.lastName || '',
                    dob: selectedRow.personalInfoDto.dob || '',
                    maritalStatus:
                        selectedRow.personalInfoDto.maritalStatus || '',
                    gender: selectedRow.personalInfoDto.gender || '',
                    weight: selectedRow.personalInfoDto.weight || '',
                    height: selectedRow.personalInfoDto.height || '',
                    email: selectedRow.personalInfoDto.email || '',
                    contact: selectedRow.personalInfoDto.contact || '',
                    identityType:
                        selectedRow.personalInfoDto.identityType || '',
                    identityNumber:
                        selectedRow.personalInfoDto.identityNumber || '',
                    addressDto: {
                        streetAddOne:
                            selectedRow.personalInfoDto.addressDto
                                .streetAddOne || '',
                        streetAddTwo:
                            selectedRow.personalInfoDto.addressDto
                                .streetAddTwo || '',
                        city: selectedRow.personalInfoDto.addressDto.city || '',
                        state:
                            selectedRow.personalInfoDto.addressDto.state || '',
                        zipCode:
                            selectedRow.personalInfoDto.addressDto.zipCode ||
                            '',
                    },
                },
                emergencyDto: {
                    emerFirstName: selectedRow.emergencyDto.emerFirstName || '',
                    emerLastName: selectedRow.emergencyDto.emerLastName || '',
                    relation: selectedRow.emergencyDto.relation || '',
                    emergencyContact:
                        selectedRow.emergencyDto.emergencyContact || '',
                    emergencyAddressDto: {
                        emerStreetAddOne:
                            selectedRow.emergencyDto.emergencyAddressDto
                                .emerStreetAddOne || '',
                        emerStreetAddTwo:
                            selectedRow.emergencyDto.emergencyAddressDto
                                .emerStreetAddTwo || '',
                        emerCity:
                            selectedRow.emergencyDto.emergencyAddressDto
                                .emerCity || '',
                        emerState:
                            selectedRow.emergencyDto.emergencyAddressDto
                                .emerState || '',
                        emerZipCode:
                            selectedRow.emergencyDto.emergencyAddressDto
                                .emerZipCode || '',
                    },
                },
                medicalInfoDto: {
                    medication: selectedRow.medicalInfoDto.medication || '',
                    allergies: selectedRow.medicalInfoDto.allergies || '',
                    medicationDetails:
                        selectedRow.medicalInfoDto.medicationDetails || '',
                    allergiesDetails:
                        selectedRow.medicalInfoDto.allergiesDetails || '',
                    chiefComplaints: '',
                    bloodPressure: '',
                    temperature: '',
                    spo2: '',
                },
            })
        }
    }, [selectedRow])

    const identityInputMap = {
        aadhar: 'aadharNumber',
        voterId: 'voterIdNumber',
        pan: 'panNumber',
        passport: 'passportNumber',
        drivingLicense: 'drivingLicenseNumber',
        rationCard: 'rationCardNumber',
    }

    const FormContainer = ({
        title,
        isOpen,
        onToggle,
        children,
    }: {
        title: any
        isOpen: any
        onToggle: any
        children?: React.ReactNode // Make children prop optional
    }) => (
        <div>
            <div
                className="info cursor-pointer text-[#107dc7]  text-md  text-left p-1 rounded font-bold relative"
                onClick={onToggle}
            >
                {title}
                <span className="ml-2">
                    {isOpen ? (
                        <FontAwesomeIcon icon={faAngleUp} />
                    ) : (
                        <FontAwesomeIcon icon={faAngleDown} />
                    )}
                </span>
            </div>
            {isOpen && (
                <div className="form-container mb-4  p-2 border border-gray-50 gap-4 shadow-xm rounded flex-row w-fit">
                    {children}
                </div>
            )}
        </div>
    )
    const commonValidationSchema = Yup.object({
        personalInfoDto: Yup.object({
            firstName: Yup.string().required('First name is required'),
            lastName: Yup.string().required('Last name is required'),
            dob: Yup.string().required('Date of birth is required'),
            maritalStatus: Yup.string().required('Please select'),
            gender: Yup.string().required('Please select'),
            weight: Yup.string().required('Weight is required'),
            height: Yup.string().required('Height is required'),
            email: Yup.string()
                .email('Invalid email address')
                .required('Email is required'),
            contact: Yup.string()
                .matches(/^[0-9]{10}$/, 'Invalid contact number')
                .required('Contact number is required'),

            addressDto: Yup.object({
                streetAddOne: Yup.string().required('This field is required'),
                streetAddTwo: Yup.string().required('This field is required'),
                city: Yup.string().required('This field is required'),
                state: Yup.string().required('This field is required'),
                zipCode: Yup.string().required('This field is required'),
            }),
        }),
    })
    const doctorValidationSchema = Yup.object({
        personalInfoDto: Yup.object({
            firstName: Yup.string().required('First name is required'),
            lastName: Yup.string().required('Last name is required'),
            gender: Yup.string().required('Please select'),
            contact: Yup.string()
                .matches(/^[0-9]{10}$/, 'Invalid contact number')
                .required('Contact number is required'),
        }),
    })

    const getUserRole = (): string => {
        return localStorage.getItem('role') || 'default'
    }
    const getValidationSchema = (role: string) => {
        switch (role) {
            case 'doctor':
                return doctorValidationSchema

            default:
                return commonValidationSchema
        }
    }
    const userRole: string = getUserRole()
    const validationSchema = getValidationSchema(userRole)

    const handleDivClick = () => {
        setFormOpen(!isFormOpen)
    }
    const handleDivClick2 = () => {
        // Handle click to open/close the second form container
        setFormOpen1(!isFormOpen1)
    }
    const handleDivClick3 = () => {
        // Handle click to open/close the third form container
        setFormOpen3(!isFormOpen3)
    }
    const handleDivClick4 = () => {
        setFormOpen4(!isFormOpen4)
    }
    const onSubmit = async (values: any, { setSubmitting }: any) => {
        try {
            const jwtToken = localStorage.getItem('token')

            if (!mrNo) {
                const response = await apiCreatePatient(values)
                if (response.status === 200) {
                    NotificationToast(
                        'Patient registered successfully',
                        'success'
                    )
                    const patientId = response?.data.personalInfoDto.mrNo

                    // console.log(`Form ${mrNo ? "Edited" : "Submitted"} successfully`);

                    console.log('Success')
                    navigate(`${APP_PREFIX_PATH}/get-Patient/${patientId}`)
                } else {
                    console.error(
                        `Error ${mrNo ? 'Editing' : 'Submitting'} form:`,
                        response.statusText
                    )
                }
            } else {
                const response: AxiosResponse = await updateUserData(
                    mrNo,
                    values
                )
                if (response?.status === 200) {
                    const patientId = mrNo
                    console.log(
                        `Form ${mrNo ? 'Edited' : 'Submitted'} successfully`
                    )
                    navigate(`${APP_PREFIX_PATH}/get-Patient/${patientId}`)
                } else {
                    console.error(
                        `Error ${mrNo ? 'Editing' : 'Submitting'} form:`,
                        response.statusText
                    )
                }
            }
        } catch (error) {
            console.error('Error submitting form:', error.response?.data)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Formik
            initialValues={initialValues}
            enableReinitialize={true}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >
            {({ values, setFieldValue, isSubmitting, touched, errors }) => (
                <>
                    <Form>
                        {/* Personal Information Section */}
                        <FormContainer
                            title="Personal Information"
                            isOpen={isFormOpen}
                            onToggle={handleDivClick}
                        >
                            <div
                                className={
                                    isSmallDevice
                                        ? 'flex flex-col'
                                        : 'flex flex-row'
                                }
                            >
                                <FormItem
                                    label="First name "
                                    asterisk={
                                        userRole === 'doctor' ||
                                        userRole === 'admin'
                                    }
                                >
                                    <Field
                                        type="text"
                                        name="personalInfoDto.firstName"
                                        className={`p-2 mr-2 border ${
                                            touched.personalInfoDto
                                                ?.firstName &&
                                            errors.personalInfoDto?.firstName
                                                ? 'border-red-600 border-2' // Apply red border if there's an error and the field has been touched
                                                : 'border-gray-100 border-1'
                                        } rounded focus:outline-none focus:border-blue-600 hover:border-gray-500 shadow-sm `}
                                        style={{
                                            width: isSmallDevice
                                                ? '100%'
                                                : '290px',
                                        }}
                                        placeholder="First name"
                                    />
                                    <ErrorMessage
                                        name="personalInfoDto.firstName"
                                        component="div"
                                        className="text-red-500"
                                    />
                                </FormItem>
                                <FormItem
                                    label="Last name"
                                    asterisk={
                                        userRole === 'doctor' ||
                                        userRole === 'admin'
                                    }
                                    //asterisk={!!(touched.personalInfoDto?.lastName && errors.personalInfoDto?.lastName)}
                                >
                                    <Field
                                        type="text"
                                        name="personalInfoDto.lastName"
                                        className={`p-2 mr-2 border ${
                                            touched.personalInfoDto?.lastName &&
                                            errors.personalInfoDto?.lastName
                                                ? 'border-red-600 border-2' // Apply red border if there's an error and the field has been touched
                                                : 'border-gray-100 border-1'
                                        } rounded focus:outline-none focus:border-blue-600 hover:border-gray-500 shadow-sm`}
                                        style={{
                                            width: isSmallDevice
                                                ? '100%'
                                                : '290px',
                                        }}
                                        placeholder="Last name"
                                    />
                                    <ErrorMessage
                                        name="personalInfoDto.lastName"
                                        component="div"
                                        className="text-red-500"
                                    />
                                </FormItem>
                                <FormItem
                                    label="Date of birth"
                                    asterisk={userRole === 'admin'}
                                >
                                    <DatePicker
                                        selected={
                                            values?.personalInfoDto?.dob
                                                ? new Date(
                                                      values?.personalInfoDto
                                                          ?.dob as string
                                                  )
                                                : null
                                        }
                                        onChange={(date) => {
                                            console.log('Selected Date:', date)
                                            if (date) {
                                                const formattedDate = format(
                                                    date,
                                                    'yyyy-MM-dd'
                                                )
                                                console.log(
                                                    'Formatted Date:',
                                                    formattedDate
                                                )
                                                setFieldValue(
                                                    'personalInfoDto.dob',
                                                    formattedDate
                                                )
                                            } else {
                                                setFieldValue(
                                                    'personalInfoDto.dob',
                                                    ''
                                                )
                                            }
                                        }}
                                        shouldCloseOnSelect={false}
                                        dateFormat={`yyyy/MM/dd`}
                                        showYearDropdown
                                        showMonthDropdown
                                        dropdownMode="select"
                                        // yearDropdownItemNumber={10} // Number of years to display in the dropdown
                                        scrollableYearDropdown
                                        // yearDropdownMin={2001} // Minimum selectable year
                                        // yearDropdownMax={2023} // Maximum selectable year
                                        className={`p-2 w-1/2 md:w-[280px] mr-2 border ${
                                            touched.personalInfoDto?.dob &&
                                            errors.personalInfoDto?.dob
                                                ? 'border-red-600 border-2' // Apply red border if there's an error
                                                : 'border-gray-100 border-1'
                                        } rounded focus:outline-none focus:border-blue-600 hover:border-gray-500 shadow-sm`}
                                        placeholderText="Select a date"
                                    />
                                    <ErrorMessage
                                        name="personalInfoDto.dob"
                                        component="div"
                                        className="text-red-500"
                                    />
                                </FormItem>
                            </div>

                            <div
                                className={`flex ${
                                    isSmallDevice ? 'flex-col' : 'flex-row'
                                }`}
                            >
                                <FormItem
                                    label="Gender"
                                    asterisk={
                                        userRole === 'doctor' ||
                                        userRole === 'admin'
                                    }
                                >
                                    <Field
                                        as="select"
                                        name="personalInfoDto.gender"
                                        className={`mt-1 p-2 mr-2 border ${
                                            touched.personalInfoDto?.gender &&
                                            errors.personalInfoDto?.gender
                                                ? 'border-red-600 border-2' // Apply red border if there's an error or if the role is "doctor"
                                                : 'border-gray-100 border-1'
                                        } rounded focus:outline-none focus:border-blue-600 hover:border-gray-500 shadow-sm`}
                                        style={{
                                            width: isSmallDevice
                                                ? '100%'
                                                : '290px',
                                        }}
                                    >
                                        <option value="" label="Select" />
                                        <option value="male" label="Male" />
                                        <option value="female" label="Female" />
                                        <option value="other" label="Other" />
                                    </Field>

                                    <ErrorMessage
                                        name="personalInfoDto.gender"
                                        component="div"
                                        className="text-red-500"
                                    />
                                </FormItem>

                                <FormItem
                                    label="Marital status"
                                    asterisk={userRole === 'admin'}
                                >
                                    <Field
                                        as="select"
                                        name="personalInfoDto.maritalStatus"
                                        className={`p-2 mt-1 mr-2 border ${
                                            touched.personalInfoDto
                                                ?.maritalStatus &&
                                            errors.personalInfoDto
                                                ?.maritalStatus
                                                ? 'border-red-600 border-2' // Apply red border if there's an error or if the role is "doctor"
                                                : 'border-gray-100'
                                        } rounded focus:outline-none focus:border-blue-600 hover:border-gray-500 shadow-sm`}
                                        style={{
                                            width: isSmallDevice
                                                ? '100%'
                                                : '290px',
                                        }}
                                    >
                                        <option value="" label="Select" />
                                        <option
                                            value="married"
                                            label="Married"
                                        />
                                        <option
                                            value="unmarried"
                                            label="Unmarried"
                                        />
                                    </Field>

                                    <ErrorMessage
                                        name="personalInfoDto.maritalStatus"
                                        component="div"
                                        className="text-red-500"
                                    />
                                </FormItem>
                                <FormItem
                                    label="Weight"
                                    asterisk={userRole === 'admin'}
                                >
                                    <Field
                                        type="text"
                                        name="personalInfoDto.weight"
                                        className={`p-2 mr-2 border ${
                                            touched.personalInfoDto?.weight &&
                                            errors.personalInfoDto?.weight
                                                ? 'border-red-600 border-2' // Apply red border if there's an error
                                                : 'border-gray-100 border-1'
                                        } rounded focus:outline-none focus:border-blue-600 hover:border-gray-500 shadow-sm`}
                                        style={{
                                            width: isSmallDevice
                                                ? '100%'
                                                : '290px',
                                        }}
                                        placeholder="Enter weight"
                                    />
                                    <ErrorMessage
                                        name="personalInfoDto.weight"
                                        component="div"
                                        className="text-red-500"
                                    />
                                </FormItem>
                            </div>
                            <div
                                className={
                                    isSmallDevice
                                        ? 'flex flex-col'
                                        : 'flex flex-row'
                                }
                            >
                                <FormItem
                                    label="Height"
                                    asterisk={userRole === 'admin'}
                                >
                                    <Field
                                        type="text"
                                        name="personalInfoDto.height"
                                        className={`p-2 mr-2 border ${
                                            touched.personalInfoDto?.height &&
                                            errors.personalInfoDto?.height
                                                ? 'border-red-600 border-2' // Apply red border if there's an error
                                                : 'border-gray-100 border-1'
                                        } rounded focus:outline-none focus:border-blue-600 hover:border-gray-500 shadow-sm`}
                                        style={{
                                            width: isSmallDevice
                                                ? '100%'
                                                : '290px',
                                        }}
                                        placeholder="Enter height"
                                    />
                                    <ErrorMessage
                                        name="personalInfoDto.height"
                                        component="div"
                                        className="text-red-500"
                                    />
                                </FormItem>

                                <FormItem
                                    label="E-mail"
                                    asterisk={userRole === 'admin'}
                                >
                                    <Field
                                        type="text"
                                        name="personalInfoDto.email"
                                        className={`p-2 mr-2 border ${
                                            touched.personalInfoDto?.email &&
                                            errors.personalInfoDto?.email
                                                ? 'border-red-600 border-2' // Apply red border if there's an error
                                                : 'border-gray-100 border-1'
                                        } rounded focus:outline-none focus:border-blue-600 hover:border-gray-500 shadow-sm`}
                                        style={{
                                            width: isSmallDevice
                                                ? '100%'
                                                : '290px',
                                        }}
                                        placeholder="E-mail"
                                    />

                                    <ErrorMessage
                                        name="personalInfoDto.email"
                                        component="div"
                                        className="text-red-500"
                                    />
                                </FormItem>

                                <FormItem
                                    label="Contact number"
                                    asterisk={
                                        userRole === 'doctor' ||
                                        userRole === 'admin'
                                    }
                                >
                                    <Field
                                        type="text"
                                        name="personalInfoDto.contact"
                                        className={`p-2 border ${
                                            touched.personalInfoDto?.contact &&
                                            errors.personalInfoDto?.contact
                                                ? 'border-red-600 border-2' // Apply red border if there's an error or if the role is "doctor"
                                                : 'border-gray-100'
                                        } rounded focus:outline-none focus:border-blue-600 hover:border-gray-500 shadow-sm`}
                                        style={{
                                            width: isSmallDevice
                                                ? '100%'
                                                : '290px',
                                        }}
                                        placeholder="Contact number"
                                    />

                                    <ErrorMessage
                                        name="personalInfoDto.contact"
                                        component="div"
                                        className="text-red-500"
                                    />
                                </FormItem>
                            </div>

                            <div
                                className={
                                    isSmallDevice
                                        ? 'flex flex-col'
                                        : 'flex flex-row'
                                }
                            >
                                <FormItem
                                    label="Address"
                                    asterisk={userRole === 'admin'}
                                >
                                    <Field
                                        type="text"
                                        name="personalInfoDto.addressDto.streetAddOne"
                                        className={`p-2 mr-2 border ${
                                            touched.personalInfoDto?.addressDto
                                                ?.streetAddOne &&
                                            errors.personalInfoDto?.addressDto
                                                ?.streetAddOne
                                                ? 'border-red-600 border-2' // Apply red border if there's an error
                                                : 'border-gray-100 border-1'
                                        } rounded focus:outline-none focus:border-blue-600 hover:border-gray-500 shadow-sm`}
                                        style={{
                                            width: isSmallDevice
                                                ? '100%'
                                                : '435px',
                                        }}
                                        placeholder="Street address"
                                    />
                                    <ErrorMessage
                                        name="personalInfoDto.addressDto.streetAddOne"
                                        component="div"
                                        className="text-red-500"
                                    />
                                </FormItem>

                                <FormItem>
                                    <Field
                                        type="text"
                                        name="personalInfoDto.addressDto.streetAddTwo"
                                        className={`mt-5 p-2 border ${
                                            touched.personalInfoDto?.addressDto
                                                ?.streetAddTwo &&
                                            errors.personalInfoDto?.addressDto
                                                ?.streetAddTwo
                                                ? 'border-red-600 border-2' // Apply red border if there's an error
                                                : 'border-gray-100 border-1'
                                        } rounded focus:outline-none focus:border-blue-600 hover:border-gray-500 shadow-sm`}
                                        style={{
                                            width: isSmallDevice
                                                ? '100%'
                                                : '435px',
                                        }}
                                        placeholder="Street address line 2"
                                    />
                                    <ErrorMessage
                                        name="personalInfoDto.addressDto.streetAddTwo"
                                        component="div"
                                        className="text-red-500"
                                    />
                                </FormItem>
                            </div>

                            <div
                                className={
                                    isSmallDevice
                                        ? 'flex flex-col'
                                        : 'flex flex-row'
                                }
                            >
                                <FormItem>
                                    <Field
                                        type="text"
                                        name="personalInfoDto.addressDto.city"
                                        className={`p-2 mr-2 border ${
                                            touched.personalInfoDto?.addressDto
                                                ?.city &&
                                            errors.personalInfoDto?.addressDto
                                                ?.city
                                                ? 'border-red-600 border-2' // Apply red border if there's an error
                                                : 'border-gray-100 border-1'
                                        } rounded focus:outline-none focus:border-blue-600 hover:border-gray-500 shadow-sm`}
                                        style={{
                                            width: isSmallDevice
                                                ? '100%'
                                                : '284px',
                                        }}
                                        placeholder="City"
                                    />
                                    <ErrorMessage
                                        name="personalInfoDto.addressDto.city"
                                        component="div"
                                        className="text-red-500"
                                    />
                                </FormItem>

                                <FormItem>
                                    <Field
                                        type="text"
                                        name="personalInfoDto.addressDto.state"
                                        className={`p-2 mr-2 border ${
                                            touched.personalInfoDto?.addressDto
                                                ?.state &&
                                            errors.personalInfoDto?.addressDto
                                                ?.state
                                                ? 'border-red-600 border-2' // Apply red border if there's an error
                                                : 'border-gray-100 border-1'
                                        } rounded focus:outline-none focus:border-blue-600 hover:border-gray-500 shadow-sm`}
                                        style={{
                                            width: isSmallDevice
                                                ? '100%'
                                                : '290px',
                                        }}
                                        placeholder="State"
                                    />
                                    <ErrorMessage
                                        name="personalInfoDto.addressDto.state"
                                        component="div"
                                        className="text-red-500"
                                    />
                                </FormItem>

                                <FormItem>
                                    <Field
                                        type="text"
                                        name="personalInfoDto.addressDto.zipCode"
                                        className={`p-2 border ${
                                            touched.personalInfoDto?.addressDto
                                                ?.zipCode &&
                                            errors.personalInfoDto?.addressDto
                                                ?.zipCode
                                                ? 'border-red-600 border-2' // Apply red border if there's an error
                                                : 'border-gray-100 border-1'
                                        } rounded focus:outline-none focus:border-blue-600 hover:border-gray-500 shadow-sm`}
                                        style={{
                                            width: isSmallDevice
                                                ? '100%'
                                                : '290px',
                                        }}
                                        placeholder="Postal code"
                                    />
                                    <ErrorMessage
                                        name="personalInfoDto.addressDto.zipCode"
                                        component="div"
                                        className="text-red-500"
                                    />
                                </FormItem>
                            </div>
                            <div
                                className={
                                    isSmallDevice
                                        ? 'flex flex-col'
                                        : 'flex flex-row'
                                }
                            >
                                <FormItem
                                    label="Identity"
                                    //asterisk={userRole === 'admin'}
                                >
                                    <Field
                                        as="select"
                                        name="personalInfoDto.identityType"
                                        className={`p-2 mt-1 mr-2 border ${
                                            touched.personalInfoDto
                                                ?.identityType &&
                                            errors.personalInfoDto?.identityType
                                                ? 'border-red-600 border-2'
                                                : 'border-gray-100'
                                        } rounded focus:outline-none focus:border-blue-600 hover:border-gray-500 shadow-sm`}
                                        style={{
                                            width: isSmallDevice
                                                ? '100%'
                                                : '290px',
                                        }}
                                    >
                                        <option value="">Select </option>
                                        <option value="aadhar">
                                            Aadhar Number
                                        </option>
                                        <option value="voterId">
                                            VoterID Number
                                        </option>
                                        <option value="pan">PAN Number</option>
                                        <option value="passport">
                                            Passport Number
                                        </option>
                                        <option value="drivingLicense">
                                            Driving License Number
                                        </option>
                                        <option value="rationCard">
                                            Ration Number
                                        </option>
                                    </Field>

                                    {values.personalInfoDto.identityType && (
                                        <Field
                                            type="text"
                                            name="personalInfoDto.identityNumber"
                                            placeholder={`Enter ${
                                                values.personalInfoDto
                                                    .identityType === 'voterId'
                                                    ? 'VoterId'
                                                    : values.personalInfoDto
                                                          .identityType ===
                                                      'drivingLicense'
                                                    ? 'Driving License'
                                                    : values.personalInfoDto
                                                          .identityType
                                            } Number`}
                                            className="p-2 mt-1 mr-2 border rounded focus:outline-none focus:border-blue-600 hover:border-gray-500 shadow-sm"
                                        />
                                    )}

                                    <ErrorMessage
                                        name="personalInfoDto.identityType"
                                        component="div"
                                        className="text-red-500"
                                    />
                                </FormItem>
                            </div>
                        </FormContainer>

                        {/* Emergency Contact Information Section */}
                        <FormContainer
                            title="Emergency Contact Information"
                            isOpen={isFormOpen3}
                            onToggle={handleDivClick3}
                        >
                            <div
                                className={
                                    isSmallDevice
                                        ? 'flex flex-col'
                                        : 'flex flex-row'
                                }
                            >
                                <FormItem label="First name">
                                    <Field
                                        type="text"
                                        name="emergencyDto.emerFirstName"
                                        className="p-2 mr-2 border border-gray-100 rounded focus:outline-none focus:border-blue-600 hover:border-gray-500 shadow-sm"
                                        style={{
                                            width: isSmallDevice
                                                ? '100%'
                                                : '210px',
                                        }}
                                        placeholder="First name"
                                    />
                                    <ErrorMessage
                                        name="emergencyDto.emerFirstName"
                                        component="div"
                                        className="text-red-500"
                                    />
                                </FormItem>
                                <FormItem label="Last name">
                                    <Field
                                        type="text"
                                        name="emergencyDto.emerLastName"
                                        className="p-2 mr-2 border border-gray-100 rounded focus:outline-none focus:border-blue-600 hover:border-gray-500 shadow-sm"
                                        style={{
                                            width: isSmallDevice
                                                ? '100%'
                                                : '210px',
                                        }}
                                        placeholder="Last name"
                                    />
                                    <ErrorMessage
                                        name="emergencyDto.emerLastName"
                                        component="div"
                                        className="text-red-500"
                                    />
                                </FormItem>
                                <FormItem label="Relationship">
                                    <Field
                                        type="text"
                                        name="emergencyDto.relation"
                                        className="mr-2 p-2 border border-gray-100 rounded
        focus:outline-none focus:border-blue-600 hover:border-gray-500 shadow-sm"
                                        style={{
                                            width: isSmallDevice
                                                ? '100%'
                                                : '210px',
                                        }}
                                        placeholder="Relationship"
                                    />
                                    <ErrorMessage
                                        name="emergencyDto.relation"
                                        component="div"
                                        className="text-red-500"
                                    />
                                </FormItem>
                                <FormItem label="Contact number">
                                    <Field
                                        type="text"
                                        name="emergencyDto.emergencyContact"
                                        className="mr-2 p-2 border border-gray-100 rounded
        focus:outline-none focus:border-blue-600 hover:border-gray-500 shadow-sm"
                                        style={{
                                            width: isSmallDevice
                                                ? '100%'
                                                : '220px',
                                        }}
                                        placeholder="Contact number"
                                    />
                                    <ErrorMessage
                                        name="emergencyDto.emergencyContact"
                                        component="div"
                                        className="text-red-500"
                                    />
                                </FormItem>
                            </div>

                            <div
                                className={
                                    isSmallDevice
                                        ? 'flex flex-col'
                                        : 'flex flex-row'
                                }
                            >
                                <FormItem label="Address">
                                    <Field
                                        type="text"
                                        name="emergencyDto.emergencyAddressDto.emerStreetAddOne"
                                        className="p-2 mr-2 border border-gray-100 rounded
        focus:outline-none focus:border-blue-600 hover:border-gray-500 shadow-sm"
                                        style={{
                                            width: isSmallDevice
                                                ? '100%'
                                                : '435px',
                                        }}
                                        placeholder="Street address"
                                    />
                                    <ErrorMessage
                                        name="emergencyDto.emergencyAddressDto.emerStreetAddOne"
                                        component="div"
                                        className="text-red-500"
                                    />
                                </FormItem>
                                <FormItem>
                                    <Field
                                        type="text"
                                        name="emergencyDto.emergencyAddressDto.emerStreetAddTwo"
                                        className="mt-5 p-2 border border-gray-100 rounded
        focus:outline-none focus:border-blue-600 hover:border-gray-500 shadow-sm"
                                        style={{
                                            width: isSmallDevice
                                                ? '100%'
                                                : '435px',
                                        }}
                                        placeholder="Street address line 2"
                                    />
                                    <ErrorMessage
                                        name="emergencyDto.emergencyAddressDto.emerStreetAddTwo"
                                        component="div"
                                        className="text-red-500"
                                    />
                                </FormItem>
                            </div>
                            <div
                                className={
                                    isSmallDevice
                                        ? 'flex flex-col'
                                        : 'flex flex-row'
                                }
                            >
                                <FormItem>
                                    <Field
                                        type="text"
                                        name="emergencyDto.emergencyAddressDto.emerCity"
                                        className="p-2 mr-2 border border-gray-100 rounded
        focus:outline-none focus:border-blue-600 hover:border-gray-500 shadow-sm"
                                        style={{
                                            width: isSmallDevice
                                                ? '100%'
                                                : '284px',
                                        }}
                                        placeholder="City"
                                    />
                                    <ErrorMessage
                                        name="emergencyDto.emergencyAddressDto.emerCity"
                                        component="div"
                                        className="text-red-500"
                                    />
                                </FormItem>

                                <FormItem>
                                    <Field
                                        type="text"
                                        name="emergencyDto.emergencyAddressDto.emerState"
                                        className="p-2 mr-2 border border-gray-100 rounded
        focus:outline-none focus:border-blue-600 hover:border-gray-500 shadow-sm"
                                        style={{
                                            width: isSmallDevice
                                                ? '100%'
                                                : '290px',
                                        }}
                                        placeholder="State"
                                    />
                                    <ErrorMessage
                                        name="emergencyDto.emergencyAddressDto.emerState"
                                        component="div"
                                        className="text-red-500"
                                    />
                                </FormItem>
                                <FormItem>
                                    <Field
                                        type="text"
                                        name="emergencyDto.emergencyAddressDto.emerZipCode"
                                        className="p-2 border border-gray-100 rounded
        focus:outline-none focus:border-blue-600 hover:border-gray-500 shadow-sm"
                                        style={{
                                            width: isSmallDevice
                                                ? '100%'
                                                : '290px',
                                        }}
                                        placeholder="Postal code"
                                    />
                                    <ErrorMessage
                                        name="emergencyDto.emergencyAddressDto.emerZipCode"
                                        component="div"
                                        className="text-red-500"
                                    />
                                </FormItem>
                            </div>
                        </FormContainer>

                        <FormContainer
                            title="Medical Aid Information"
                            isOpen={isFormOpen4}
                            onToggle={handleDivClick4}
                        >
                            <div className="sm:flex flex-row">
                                <FormItem
                                    label="Blood pressure"
                                    className="text-md  "
                                >
                                    <div className="flex items-center">
                                        <Field
                                            type="text"
                                            name="medicalInfoDto.bloodPressure"
                                            className="p-2 mr-2 border border-gray-100 rounded focus:outline-none focus:border-blue-600 hover:border-gray-500 shadow-sm"
                                            style={{
                                                width: isSmallDevice
                                                    ? '100%'
                                                    : '280px',
                                            }}
                                            placeholder=""
                                        />
                                    </div>
                                </FormItem>
                                <FormItem
                                    label="Temperature"
                                    className="text-md mr-2 "
                                >
                                    <div className="flex items-center">
                                        <Field
                                            type="text"
                                            name="medicalInfoDto.temperature"
                                            className="p-2 mr-0 border border-gray-100 rounded focus:outline-none focus:border-blue-600 hover:border-gray-500 shadow-sm"
                                            style={{
                                                width: isSmallDevice
                                                    ? '100%'
                                                    : '280px',
                                            }}
                                            placeholder=""
                                        />
                                        <span className="ml-1  mr-2">°C</span>
                                    </div>
                                </FormItem>
                                <FormItem label="SpO2" className="text-md ">
                                    <div className="flex items-center">
                                        <Field
                                            type="text"
                                            name="medicalInfoDto.spo2"
                                            className="p-2 mr-2 border border-gray-100 rounded focus:outline-none focus:border-blue-600 hover:border-gray-500 shadow-sm"
                                            style={{
                                                width: isSmallDevice
                                                    ? '100%'
                                                    : '280px',
                                            }}
                                            placeholder=""
                                        />
                                    </div>
                                </FormItem>
                            </div>
                            <div className="sm:flex flex-row">
                                <FormItem
                                    label="Chief complaints"
                                    className="text-md  mr-2"
                                >
                                    <Field
                                        as="textarea"
                                        name="medicalInfoDto.chiefComplaints"
                                        id="chiefComplaints"
                                        className=" p-2 border border-gray-100 rounded focus:outline-none focus:border-blue-600 hover:border-gray-500 shadow-sm"
                                        style={{
                                            width: isSmallDevice
                                                ? '100%'
                                                : '280px',
                                        }}
                                    />
                                </FormItem>
                                <FormItem
                                    label="Taking any medications currently"
                                    className="text-md p-2 mr-4 "
                                >
                                    <div className="flex ">
                                        <label className="mr-10 text-md mt-5">
                                            <Field
                                                type="radio"
                                                name="medicalInfoDto.medication"
                                                value="yes"
                                                className="custom-radio w-4 h-4 mr-1"
                                            />
                                            Yes
                                        </label>
                                        <label className="mr-2 text-md mt-5">
                                            <Field
                                                type="radio"
                                                name="medicalInfoDto.medication"
                                                value="no"
                                                className="custom-radio w-4 h-4 mr-1"
                                            />
                                            No
                                        </label>
                                    </div>

                                    {/* Conditionally render the textarea based on the selected value */}
                                    {values.medicalInfoDto.medication ===
                                        'yes' && (
                                        <div className="mt-2 flex flex-col">
                                            <label
                                                htmlFor="medicationInfo"
                                                className="mr-2 mt-5 mb-5"
                                            >
                                                If yes , please mention
                                            </label>
                                            <Field
                                                as="textarea"
                                                name="medicalInfoDto.medicationDetails"
                                                id="medicationInfo"
                                                className=" p-2 border border-gray-100 rounded focus:outline-none focus:border-blue-600 hover:border-gray-500 shadow-sm"
                                                style={{ width: '250px' }}
                                            />
                                            <ErrorMessage
                                                name="medicalInfoDto.medicationDetails"
                                                component="div"
                                                className="text-red-500"
                                            />
                                        </div>
                                    )}
                                </FormItem>
                                <FormItem
                                    label="Do you  have any allergies"
                                    className="text-md p-2 ml-6 "
                                >
                                    <div className="flex ">
                                        <label className="mr-10 text-md mt-5">
                                            <Field
                                                type="radio"
                                                name="medicalInfoDto.allergies"
                                                value="yes"
                                                className="custom-radio w-4 h-4 mr-1"
                                            />
                                            Yes
                                        </label>
                                        <label className="mr-10 text-md mt-5">
                                            <Field
                                                type="radio"
                                                name="medicalInfoDto.allergies"
                                                value="no"
                                                className="custom-radio w-4 h-4 mr-1"
                                            />
                                            No
                                        </label>
                                    </div>
                                    {values.medicalInfoDto.allergies ===
                                        'yes' && (
                                        <div className="mt-2 flex flex-col">
                                            <label
                                                htmlFor="medicationInfo"
                                                className="mr-2 mb-5 mt-5"
                                            >
                                                If yes , please mention
                                            </label>
                                            <Field
                                                as="textarea"
                                                name="medicalInfoDto.allergiesDetails"
                                                id="medicationInfo"
                                                className=" p-2 border border-gray-100 rounded focus:outline-none focus:border-blue-600 hover:border-gray-500 shadow-sm"
                                                style={{
                                                    width: '250px', // Default width
                                                    '@media (max-width: 768px)': { // Adjust as needed for your specific breakpoint
                                                        width: '150px', // Decreased width for smaller devices
                                                    }
                                                }}
                                            />
                                            <ErrorMessage
                                                name="medicalInfoDto.allergiesDetails"
                                                component="div"
                                                className="text-red-500"
                                            />
                                        </div>
                                    )}
                                </FormItem>
                            </div>

                            {/* <div className="flex flex-row sm:flex-col">
                                <div className="mr-10">
                                    <FormItem label="Taking any medications currently" className="text-md p-2  ">
                                        <div className="flex ">
                                            <label className="mr-10 text-md mt-5">

                                                <Field type="radio" name="medicalInfoDto.medication" value="yes" className="custom-radio w-4 h-4 mr-1" />
                                                Yes
                                            </label>
                                            <label className="mr-2 text-md mt-5">
                                                <Field type="radio" name="medicalInfoDto.medication" value="no" className="custom-radio w-4 h-4 mr-1" />
                                                No
                                            </label>
                                        </div>

                                      
                                        {values.medicalInfoDto.medication === 'yes' && (
                                            <div className="mt-2 flex flex-col">
                                                <label htmlFor="medicationInfo" className="mr-2 mt-5 mb-5">
                                                    If yes , please mention
                                                </label>
                                                <Field
                                                    as="textarea"
                                                    name="medicalInfoDto.medicationDetails"
                                                    id="medicationInfo"
                                                    className=" p-2 border border-gray-100 rounded focus:outline-none focus:border-blue-600 hover:border-gray-500 shadow-sm" style={{ width: '250px' }}

                                                />
                                                <ErrorMessage name="medicalInfoDto.medicationDetails" component="div" className="text-red-500" />
                                            </div>
                                        )}
                                    </FormItem>
                                </div>
                                <div className="">
                                    <FormItem label="Do you  have any Allergies" className="text-md p-2  ">
                                        <div className="flex ">
                                            <label className="mr-10 text-md mt-5">
                                                <Field type="radio" name="medicalInfoDto.allergies" value="yes" className="custom-radio w-4 h-4 mr-1" />
                                                Yes
                                            </label>
                                            <label className="mr-10 text-md mt-5">
                                                <Field type="radio" name="medicalInfoDto.allergies" value="no" className="custom-radio w-4 h-4 mr-1" />
                                                No
                                            </label >
                                        </div>
                                        {values.medicalInfoDto.allergies === 'yes' && (
                                            <div className="mt-2 flex flex-col">
                                                <label htmlFor="medicationInfo" className="mr-2 mb-5 mt-5">
                                                    If yes , please mention
                                                </label>
                                                <Field
                                                    as="textarea"
                                                    name="medicalInfoDto.allergiesDetails"
                                                    id="medicationInfo"
                                                    className=" p-2 border border-gray-100 rounded focus:outline-none focus:border-blue-600 hover:border-gray-500 shadow-sm" style={{ width: '250px' }}

                                                />
                                                <ErrorMessage name="medicalInfoDto.allergiesDetails" component="div" className="text-red-500" />
                                            </div>
                                        )}
                                    </FormItem>

                                </div>
                               
                            </div> */}
                        </FormContainer>

                        {!mrNo ? (
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="mt-4 p-2 w-[10%]   text-white font-bold rounded mr-2 myButton"
                            >
                                Save
                            </button>
                        ) : (
                            <button
                                type="submit"
                                // onClick={handleUpdate}

                                className="mt-4 p-2 w-[10%]   text-white font-bold rounded mr-2 myButton"
                            >
                                Update
                            </button>
                        )}
                    </Form>
                </>
            )}
        </Formik>
    )
}
export default SingleMenuView
