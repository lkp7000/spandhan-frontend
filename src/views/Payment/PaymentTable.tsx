import { useEffect, useMemo, useState } from 'react';

import {
    QueryClient,
    QueryClientProvider,
    useQuery,
} from '@tanstack/react-query';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
    type MRT_ColumnDef,
    useMaterialReactTable,
    MaterialReactTable,
    MRT_Table,
} from 'material-react-table';
import { AxiosResponse } from 'axios';
import { getPayment } from '@/services/AppointmentService';
import { getAllFacilities } from '@/services/HospitalAppointment';
import { getAllDoctors, getDoctorById } from '@/services/DoctorService';

interface Facility {
    id: any;
    name: string;
}

interface Doctor {
    id: any;
    name: string;
}

interface MaterialReactTableProps<T> {
    cellStyle?: React.CSSProperties;
}

const Paymentlist = (): any => {
    const [data, setData] = useState<any[]>([]);
    const [selectedRow, setSelectedRow] = useState<any>();
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [selectedFacility, setSelectedFacility] = useState<string>('');
    const [selectedDoctor, setSelectedDoctor] = useState<string>('');
    const [facilities, setFacilities] = useState<Facility[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [docName, setDocName] = useState<Doctor[]>([]);
    const [selectedDoctorId, setSelectedDoctorId] = useState<any>('');
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [pdf, setPdf] = useState<any>();

    useEffect(() => {
        if (Array.isArray(data) && data.length > 0) {
            const total = data.reduce((acc, curr) => acc + curr.totalAmount, 0);
            setTotalAmount(total);
        }
    }, [data]);

    const fetchFacilities = async () => {
        try {
            const response = await getAllFacilities();
            const data = response?.data as Facility[];
            setFacilities(data);
        } catch (error) {
            console.error('Error fetching facilities:', error);
        }
    };

    const fetchDoctorsByFacility = async (facilityId: any) => {
        try {
            const response = await getDoctorById(facilityId);
            const data = response?.data as Doctor[];
            console.log(data, "don");
            setDoctors(data);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    };

    const fetchDoctors = async () => {
        try {
            const response: any = await getAllDoctors();
            const data: any = response.data;
            setDoctors(data);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    };

    const fetchData = async () => {
        try {
            const params: {
                facility?: string;
                doctor?: string;
                doctorId?: any;
            } = {};

            if (selectedFacility) {
                params.facility = selectedFacility;
            }

            if (selectedDoctor) {
                params.doctor = selectedDoctor;
            }

            if (selectedDoctorId !== null) {
                params.doctorId = selectedDoctorId;
            }

            const response: AxiosResponse = await getPayment(params);
            if (response.status === 200) {
                const responseData = response?.data;
                const { pdf, ...appointmentListData } = responseData;
                setData(appointmentListData.paymentDtoList);
                setPdf(pdf);
            }
        } catch (error: any) {
            console.error('Error fetching data:', error);
        }
    };

    console.log(data);
    useEffect(() => {
        fetchFacilities();
        fetchDoctors();
    }, []);

    useEffect(() => {
        fetchData();
    }, [selectedFacility, selectedDoctor, selectedDoctorId]);

    const handleFacilityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedFacilityValue = e.target.value;
        setSelectedFacility(selectedFacilityValue);
        if (selectedFacilityValue) {
            const [id, label] = selectedFacilityValue.split(':');
            fetchDoctorsByFacility(Number(id));
        } else {
            setDoctors([]);
        }
        setSelectedDoctor('');
    };

    const handleDoctorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedDoctorValue = e.target.value;
        setSelectedDoctor(selectedDoctorValue);

        if (selectedDoctorValue) {
            const [id, label] = selectedDoctorValue.split(':');
            setSelectedDoctorId(Number(id));

            setData([]);
        } else {
            setSelectedDoctorId(null);
        }
    };

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
    };

    const handledownload = () => {
        try {
            const pdfBlob = new Blob([pdf], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(pdfBlob);
            const link = document.createElement("a");
            link.href = url; 
            link.download = "Report_Download.pdf"; // Corrected file name
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error handling download:", error);
        }
    };

    // const handleTransactionClick = async () => {
    //     try {
    //       const response = await CallTrasactionPdfGen(TransactionId);
    //       const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
    //       const pdfUrl = URL.createObjectURL(pdfBlob);
    //       const link = document.createElement('a');
    //       link.href = pdfUrl;
    //       link.download = `transaction_report_${TransactionId}.pdf`;
    //       document.body.appendChild(link);
    //       link.click();
    //       document.body.removeChild(link);
    //       URL.revokeObjectURL(pdfUrl);
    //     } catch (error) {
    //       console.error('Error handling PDF:', error);
    //     }
    //   };

    const columns = useMemo<MRT_ColumnDef<any>[]>(
        () => [
            {
                accessorKey: 'mrNo',
                header: 'MR No.',
                size: 50,
            },
            {
                accessorKey: 'facilityName',
                header: 'Facility Name',
                size: 50,
            },
            {
                accessorKey: 'doctorName',
                header: 'Doctor Name',
                size: 50,
            },
            {
                accessorKey: 'patientName',
                header: 'Patient Name',
                size: 50,
            },
            {
                accessorKey: 'contactNumber',
                header: 'Contact No.',
                size: 50,
            },
            {
                accessorKey: 'date',
                header: 'Date',
                size: 50,
            },
            {
                accessorKey: 'paidAmount',
                header: 'Paid Amount',
                size: 50,
            },
            {
                accessorKey: 'unpaidAmount',
                header: 'Unpaid Amount',
                size: 50,
                cellRenderer: (rowData: any) => <div style={{ textAlign: 'center' }}>{rowData}</div>,
            },
            {
                accessorKey: 'totalAmount',
                header: 'Total Amount',
                size: 50,
                cellRenderer: (rowData: {
                    paidAmount: any;
                    unpaidAmount: any;
                }) => rowData.paidAmount + rowData.unpaidAmount,
            },
        ],
        [data]
    );

    const {
        data: fetchedUsers = [],
        isError: isLoadingUsersError,
        isFetching: isFetchingUsers,
        isLoading: isLoadingUsers,
    } = useGetUsers();

    const table = useMaterialReactTable({
        columns,
        data,
        state: {
            isLoading: isLoadingUsers,
        },
        enableGlobalFilter: false,
    });

    return (
        <>
            <h6 className=" text-[#107dc7] mb-4">Payment Status</h6>
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

                <div className='z-10'>
                    <DatePicker
                        selected={selectedDate}
                        onChange={handleDateChange}
                        dateFormat="yyyy/MM/dd"
                        placeholderText="Select Date"
                        className="w-300px p-2 border border-gray-300 rounded-md mt-2 cursor-pointer bg-#f5f5f5"
                    />
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
            <div className="justify-end mt-6  flex">
                <span className='border p-2 text-white  myButton rounded-lg'>Total Amount: {totalAmount}</span>
                <span>
                    <button onClick={handledownload} className='border p-2 ml-2 text-white  myButton rounded-lg'>Download Report</button>
                </span>
            </div>
        </>
    );
}

function useGetUsers() {
    return useQuery<any[]>({
        queryKey: ['users'],
        refetchOnWindowFocus: false,
    });
}

const queryClient = new QueryClient();

const ExampleWithProviders = () => (
    <QueryClientProvider client={queryClient}>
        <Paymentlist />
    </QueryClientProvider>
);

export default ExampleWithProviders;
