import { Formik, Form, Field, ErrorMessage } from "formik";
import { Key, useEffect, useState } from "react";
import * as Yup from "yup";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FormContainer, FormItem } from "@/components/ui";
import { useMediaQuery } from 'react-responsive';
import axios, { AxiosResponse } from 'axios';
import { apiSearchByPatients } from "@/services/AppointmentService";

const SearchPatient = () => {

    const [submittedData, setSubmittedData] = useState<any | null>(null);
    const isSmallDevice = useMediaQuery({ maxWidth: 767 });

    const validationSchema = Yup.object({
        mrNo: Yup.number().required('MR No. is required'),
        firstName: Yup.string().required('First Name is required'),
        lastName: Yup.string().required('Last Name is required'),
        dob: Yup.date().required('Date of Birth is required'),
        contact: Yup.string().required('Contact Number is required'),
        email: Yup.string().email('Invalid email address').required('Email is required'),
    });

    const initialValues = {

        mrNo: '',
        firstName: '',
        lastName: '',
        dob: '',
        contact: '',
        email: '',

    }

    const onSubmit = async (values: any, { setSubmitting }: any) => {
        try {
            const jwtToken = localStorage.getItem("token");
            const payload: any = {};

            if (values.mrNo) {
                payload.mrNo = values.mrNo;
            }

            if (values.firstName) {
                payload.firstName = values.firstName;
            }

            if (values.lastName) {
                payload.lastName = values.lastName;
            }

            if (values.dob) {
                payload.dob = values.dob;
            }

            if (values.contact) {
                payload.contact = values.contact;
            }

            if (values.email) {
                payload.email = values.email;
            }

            const response: AxiosResponse = await apiSearchByPatients(payload)
            console.log('Response:', response.data);

            setSubmittedData(response.data);

        } catch (error) {

            console.error('Error:', error);
        } finally {

            setSubmitting(false);
        };
    };
    <br />

    const renderTable = () => {
        const [searchName, setSearchName] = useState('');


        if (submittedData) {
            const filteredData = submittedData.filter((data: {
                data: any; personalInfoDto: { mrNo: number | null | undefined; firstName: string; lastName: string; dob: number; contact: number; email: string; };
            }) =>
                data.personalInfoDto?.firstName.toLowerCase().includes(searchName.toLowerCase()) ||
                data.personalInfoDto?.lastName.toLowerCase().includes(searchName.toLowerCase()) ||
                data.personalInfoDto?.dob.toString().includes(searchName.toLowerCase()) ||
                data.personalInfoDto?.mrNo?.toString().toLowerCase().includes(searchName.toLowerCase()) ||
                data.personalInfoDto?.contact?.toString().toLowerCase().includes(searchName.toLowerCase()) ||
                data.personalInfoDto?.email.toLowerCase().includes(searchName.toLowerCase())
            );

            return (

                <table className="min-w-full border border-gray-300">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 bg-gray-100 border-b">MR No.</th>
                            <th className="py-2 px-4 bg-gray-100 border-b">First Name</th>
                            <th className="py-2 px-4 bg-gray-100 border-b">Last Name</th>
                            <th className="py-2 px-4 bg-gray-100 border-b">Date of Birth</th>
                            <th className="py-2 px-4 bg-gray-100 border-b">Contact Number</th>
                            <th className="py-2 px-4 bg-gray-100 border-b">Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((data: { personalInfoDto: { mrNo: Key | null | undefined; firstName: any; lastName: any; dob: any; contact: any; email: any; }; }) => (
                            <tr key={data.personalInfoDto?.mrNo}>
                                <td className="py-2 px-4 border-b">{data.personalInfoDto?.mrNo || '-'}</td>
                                <td className="py-2 px-4 border-b">{data.personalInfoDto?.firstName || '-'}</td>
                                <td className="py-2 px-4 border-b">{data.personalInfoDto?.lastName || '-'}</td>
                                <td className="py-2 px-4 border-b">{data.personalInfoDto?.dob || '-'}</td>
                                <td className="py-2 px-4 border-b">{data.personalInfoDto?.contact || '-'}</td>
                                <td className="py-2 px-4 border-b">{data.personalInfoDto?.email || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        }

        return null;
    };


    return (
        <>
            <h2>Search Patient</h2>

            <Formik

                initialValues={initialValues}
                onSubmit={onSubmit}
            >
                {({ values, setFieldValue, isSubmitting }) => (
                    <>
                        <Form>


                            {/* Personal Information Section */}
                            <FormContainer >
                                <div className={isSmallDevice ? 'flex flex-col' : 'flex flex-row'}>
                                    <FormItem label="Mr no." >

                                        <Field
                                            type="text"
                                            name="mrNo"
                                            className="p-2 mr-2  border border-gray-100 rounded focus:outline-none focus:border-blue-600 hover:border-gray-500 shadow-lg" style={{ width: isSmallDevice ? '100%' : '290px' }}
                                            placeholder="mrNo"
                                        />
                                        <ErrorMessage name="mrNo" component="div" className="text-red-500" />
                                    </FormItem>
                                    <FormItem label="First name" >

                                        <Field
                                            type="text"
                                            name="firstName"
                                            className="p-2 mr-2  border border-gray-100 rounded focus:outline-none focus:border-blue-600 hover:border-gray-500 shadow-lg" style={{ width: isSmallDevice ? '100%' : '290px' }}
                                            placeholder="First name"
                                        />
                                        <ErrorMessage name="firstName" component="div" className="text-red-500" />
                                    </FormItem>
                                    <FormItem label="Last name">
                                        <Field
                                            type="text"
                                            name="lastName"
                                            className="p-2 border border-gray-100 rounded focus:outline-none focus:border-blue-600 hover:border-gray-500 shadow-lg" style={{ width: isSmallDevice ? '100%' : '290px' }}
                                            placeholder="Last name"
                                        />
                                        <ErrorMessage name="lastName" component="div" className="text-red-500" />
                                    </FormItem>
                                </div>

                                <div className={`flex ${isSmallDevice ? 'flex-col' : 'flex-row'}`}>
                                    <FormItem label="Date of birth">
                                        <DatePicker
                                            selected={values.dob}
                                            onChange={(date) => setFieldValue("dob", date)}
                                            dateFormat="dd/MM/yyyy"
                                            showYearDropdown
                                            showMonthDropdown
                                            dropdownMode="select"
                                            yearDropdownItemNumber={10} // Number of years to display in the dropdown
                                            scrollableYearDropdown
                                            yearDropdownMin={2001} // Minimum selectable year
                                            yearDropdownMax={2023} // Maximum selectable year
                                            className="p-2 w-1/2 md:w-[290px] mr-2 border border-gray-100 rounded focus:outline-none focus:border-blue-600 hover:border-gray-500 shadow-lg"
                                            placeholderText="Select a date"
                                        />
                                        <ErrorMessage name="dob" component="div" className="text-red-500" />
                                    </FormItem>

                                    <FormItem label="Contact number">
                                        <Field
                                            type="text"
                                            name="contact"
                                            className="p-2 mr-2 border border-gray-100 rounded focus:outline-none focus:border-blue-600 hover:border-gray-500 shadow-lg" style={{ width: isSmallDevice ? '100%' : '290px' }}
                                            placeholder="contact Number"
                                        />
                                        <ErrorMessage name="contact" component="div" className="text-red-500" />
                                    </FormItem>

                                    <FormItem label="Email">
                                        <Field
                                            type="text"
                                            name="email"
                                            className="p-2 border border-gray-100 rounded focus:outline-none focus:border-blue-600 hover:border-gray-500 shadow-lg" style={{ width: isSmallDevice ? '100%' : '290px' }}
                                            placeholder="email"
                                        />
                                        <ErrorMessage name="email" component="div" className="text-red-500" />
                                    </FormItem>
                                </div>

                            </FormContainer>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="mt-4 p-2 w-[10%]  text-white font-bold rounded mr-2 myButton"

                            >
                                Search
                            </button>
                            <button
                                type="reset"
                                disabled={isSubmitting}
                                className="mt-4 p-2 w-[10%] bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded"

                            >
                                reset
                            </button>

                        </Form>
                        {renderTable()}
                    </>
                )}
            </Formik>
        </>
    );
};

export default SearchPatient;