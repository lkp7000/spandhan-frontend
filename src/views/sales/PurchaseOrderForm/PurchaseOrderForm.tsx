/* eslint-disable import/no-unresolved */
import Input from '@/components/ui/Input'
import InputGroup from '@/components/ui/InputGroup'
import Button from '@/components/ui/Button'
import DatePicker from '@/components/ui/DatePicker'
import Select from '@/components/ui/Select'
import { FormItem, FormContainer } from '@/components/ui/Form'
import { Field, Form, Formik } from 'formik'
import { NumericFormat, NumericFormatProps } from 'react-number-format'
import { countryList } from '@/constants/countries.constant'
import { components } from 'react-select'
import dayjs from 'dayjs'
import * as Yup from 'yup'
import type { OptionProps, SingleValueProps } from 'react-select'
import type { FieldInputProps, FieldProps } from 'formik'
import { useState, type ComponentType } from 'react'
import type { InputProps } from '@/components/ui/Input'
import { statusCurrency, statusOptions } from '@/views/sales/constants'

import ProductTable from '../ProductList/components/ProductTable'
import OrderDetails from '../OrderDetails'
import THead from '@/components/ui/Table/THead'
import PaymentSummary from '../OrderDetails/components/PaymentSummary'
import { apiCreatePurchaseOrder } from '@/services/SalesService'
import { Card } from '@/components/ui'
import { useNavigate } from 'react-router-dom'
import { APP_PREFIX_PATH } from '@/constants/route.constant'

type CountryOption = {
    label: string
    dialCode: string
    value: string
}
export type PurchaseOrderFormType = {
    supplierName: string,
    supplierCompany: string,
    countryCode:CountryOption | null,
    supplierPhone: string,
    supplierAddress: string,
    currency: string,
    date: string,
    total: number,
    purchaseItems:
        {
            itemDesc: string,
            amount: number,
            quantity: number,
            unitPrice: number
        }[]
    ,
    notes: string,
    terms: string
}

const genderOptions = [
    { label: 'Male', value: 'M' },
    { label: 'Female', value: 'F' },
    { label: 'Others', value: 'O' },
]
let data: PurchaseOrderFormType = {
    supplierName: "",
    supplierCompany: "",
    supplierPhone: "",
    countryCode:null,
    supplierAddress: "",
    currency: "",
    date: "",
    total: 0,
    purchaseItems: [
        {
            itemDesc: "",
            amount: 0.0,
            quantity: 0,
            unitPrice: 0
        }
    ],
    notes: "",
    terms: "terms"
}


type FormModel = PurchaseOrderFormType

type PurchaseOrderFormProps = {
    data: PurchaseOrderFormType
    onNextChange?: (
        values: FormModel,
        formName: string,
        setSubmitting: (isSubmitting: boolean) => void
    ) => void
    currentStepStatus?: string
}

const { SingleValue } = components



const NumberInput = (props: InputProps) => {
    return <Input {...props} value={props.field.value} />
}

const NumericFormatInput = ({
    onValueChange,
    ...rest
}: Omit<NumericFormatProps, 'form'> & {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    form: any
    field: FieldInputProps<unknown>
}) => {
    return (
        <NumericFormat
            customInput={Input as ComponentType}
            type="text"
            autoComplete="off"
            onValueChange={onValueChange}
            {...rest}
        />
    )
}

const PhoneSelectOption = ({
    innerProps,
    data,
    isSelected,
}: OptionProps<CountryOption>) => {
    return (
        <div
            className={`cursor-pointer flex items-center justify-between p-2 ${isSelected
                    ? 'bg-gray-100 dark:bg-gray-500'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
            {...innerProps}
        >
            <div className="flex items-center gap-2">
                <span>
                    ({data.value}) {data.dialCode}
                </span>
            </div>
        </div>
    )
}

const PhoneControl = (props: SingleValueProps<CountryOption>) => {
    const selected = props.getValue()[0]
    return (
        <SingleValue {...props}>
            {selected && <span>{selected.dialCode}</span>}
        </SingleValue>
    )
}

const validationSchema = Yup.object().shape({
    supplierName: Yup.string().required('Name Required'),
    // supplierCompany: Yup.string().required('Name Required'),

    // supplierPhone: Yup.string().required('Name Required'),

    // supplierAddress: Yup.string().required('Name Required'),


    // company: Yup.string().required('Componay Name Required'),
    // address: Yup.string().required('Email Required'),
    // nationality: Yup.string().required('Please select your nationality'),
    // phoneNumber: Yup.string().required('Please enter your phone number'),
    // dare: Yup.string().required('Please enter date'),
    // gender: Yup.string().required('Please enter your gender'),
    // maritalStatus: Yup.string().required('Please enter your marital status'),
    // dialCode: Yup.string().required('Please select dial code'),
})

type PaymentInfoProps = {
    label?: string
    value?: number
    isLast?: boolean
}

type PaymentSummaryProps = {
    data?: {
        subTotal: number
        tax: number
        deliveryFees: number
        total: number
    }
}
const PaymentInfo = ({ label, value, isLast }: PaymentInfoProps) => {
    return (
        <li
            className={`flex items-center justify-between${
                !isLast ? ' mb-3' : ''
            }`}
        >
            <span>{label}</span>
            <span className="font-semibold">
                <NumericFormat
                    displayType="text"
                    value={(Math.round((value as number) * 100) / 100).toFixed(
                        2
                    )}
                    prefix={'$'}
                    thousandSeparator={true}
                />
            </span>
        </li>
    )
}


const PurchaseOrderForm = () => {
    const navigate = useNavigate();
    const [tableData, setTableData] = useState([
        {
            itemDesc: "",
            amount: 0,
            quantity: 0,
            unitPrice: 0
        },
    ]);

    const handleAddLine = () => {
        setTableData([...tableData,  {
            itemDesc: "",
            amount: 0,
            quantity: 0,
            unitPrice: 0
        }]);
    };


    const handleInputChange = (index: number, field: string, value: any, setFieldValue: (field: string, value: any) => void) => {
        const newData: any['purchaseItems'] = [...tableData];
        newData[index][field] = value;
      
        setTableData(newData);
        let totalSum = 0;
        for (const item of newData) {
          // Calculate the amount for each item
          item.amount = item.quantity * item.unitPrice;
          totalSum += item.amount;
        }
      
        // Update the total value in the data object
            data.total = totalSum      
        // Update the purchaseItems in the data object
        setFieldValue('purchaseItems', newData);
      };

    // const handleInputChange = (index: any, field: any, value: any) => {
        
    //     // const newData: any = [...tableData];
    //     // newData[index][field] = value;
        
    //     // setTableData(newData);

    //     // let totalSum = 0;
    //     // for (const item of newData) {
    //     //     // Make sure these properties are numbers in the newData array,
    //     //     // so parseFloat won't be necessary.
    //     //     data.purchaseItems[index].amount = item.quantity * item.unitPrice;
    //     //     totalSum += data.purchaseItems[index].amount;
    //     // }

    //     // data.total = totalSum;

    //     const newData: any['purchaseItems'] = [...tableData];
    //                 newData[index][field] = value;

    //                 setTableData(newData);

    //                 let totalSum = 0;
    //                 for (const item of newData) {
    //                     // Calculate the amount for each item
    //                     item.amount = item.quantity * item.unitPrice;
    //                     totalSum += item.amount;
    //                 }

    //                 // Update the total value in the data object
    //                 setFieldValue('total', totalSum);

    //                 // Update the purchaseItems in the data object
    //                 setFieldValue('purchaseItems', newData);
    //         };

    const submitHandler =async (values: any, { setSubmitting }: any) => {
        // Your submit logic here, e.g., sending form data to a server
        setSubmitting(true); // Set submitting to true when the form submission starts

       console.log(values)
        try{
            values.purchaseItems = tableData;
            data.purchaseItems = tableData;

            const res:any = await apiCreatePurchaseOrder(values)

            
            localStorage.setItem("poId", res?.data.purchaseOrderId);
           
        
            navigate(`${APP_PREFIX_PATH}/sales/purchase-order-invoice/${res?.data.purchaseOrderId}`)
        }
        catch(error:any){
            console.log(error)
        }
        
        

        // Simulate an asynchronous operation (e.g., API call)
        setTimeout(() => {

            setSubmitting(false);
        }, 1000);
    };

    console.log("0000")
    return (
        <>
            <div className="mb-8">
                <h3 className="mb-2">Purchase Order</h3>
                <p>Information for an Purchase order</p>
            </div>
            <Formik
                initialValues={data}
                enableReinitialize={true}
                validationSchema={validationSchema}
                onSubmit={submitHandler}
            >
                {({ values, touched, errors, isSubmitting,handleChange,handleSubmit,setFieldValue }) => {
                    return (
                        <Form onSubmit={handleSubmit} >
                            <FormContainer>
                                <div className="md:grid grid-cols-2 gap-4">
                                    <FormItem
                                        label="Name"
                                        invalid={
                                            errors.supplierName &&
                                            touched.supplierName
                                        }
                                        errorMessage={errors.supplierName}
                                    >
                                        <Field
                                            type="text"
                                            autoComplete="off"
                                            name="supplierName"
                                            placeholder="Supplier Name"
                                            component={Input}
                                            onChange={handleChange}
                                        />
                                    </FormItem>
                                    <FormItem
                                        label="Company"
                                        invalid={
                                            errors.supplierCompany && touched.supplierCompany
                                        }
                                        errorMessage={errors.supplierCompany}
                                    >
                                        <Field
                                            type="text"
                                            autoComplete="off"
                                            name="supplierCompany"
                                            placeholder="Company"
                                            component={Input}
                                            onChange={handleChange}

                                        />
                                    </FormItem>
                                </div>
                                <FormItem
                                    label="Address"
                                    invalid={errors.supplierAddress && touched.supplierAddress}
                                    errorMessage={errors.supplierAddress}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="supplierAddress"
                                        placeholder="Address"
                                        component={Input}
                                        onChange={handleChange}

                                    />
                                </FormItem>


                                <div className="md:grid grid-cols-2 gap-4">
                                    <FormItem
                                        label="Phone Number"
                                        invalid={
                                            (errors.supplierPhone &&
                                                touched.supplierPhone) ||
                                            (errors.supplierPhone &&
                                                touched.supplierPhone)
                                        }
                                        errorMessage="Please enter your phone number"
                                    >
                                        <InputGroup>
                                            <Field >
                                                {({
                                                    field,
                                                    form,
                                                }: FieldProps) => (
                                                    <Select<CountryOption>
                                                        className="min-w-[130px]"
                                                        placeholder="Dial Code"
                                                        name="countryCode"
                                                        components={{
                                                            Option: PhoneSelectOption,
                                                            SingleValue:
                                                                PhoneControl,
                                                        }}
                                                        field={field}
                                                        form={form}
                                                        options={countryList}
                                                        value={countryList.find(
                                                            (country) =>
                                                                country.value ===
                                                                values.countryCode?.value
                                                        )}
                                                        onChange={(value:any)=>{
                                                            setFieldValue("countryCode",value)
                                                            console.log(value)}}

                                                    />
                                                )}
                                            </Field>
                                            <Field name="supplierPhone">
                                                {({
                                                    field,
                                                    form,
                                                }: FieldProps) => {
                                                    return (
                                                        <NumericFormatInput
                                                            form={form}
                                                            field={field}
                                                            customInput={
                                                                NumberInput as ComponentType
                                                            }
                                                            placeholder="Phone Number"
                                                    
                                                            onChange={handleChange}

                                                        />
                                                    )
                                                }}
                                            </Field>
                                        </InputGroup>
                                    </FormItem>
                                    <FormItem
                                        label="Date"
                                        invalid={errors.date && touched.date}
                                        errorMessage={errors.date}
                                    >
                                        <Field  placeholder="Date">
                                            {({ field, form }: FieldProps) => (
                                                <DatePicker
                                                    field={field}
                                                    form={form}
                                                    name="date"
                                                    
                                                    onChange={(value:any)=>{setFieldValue("date",value)
                                                        console.log(value)}}

                                                />
                                            )}
                                        </Field>
                                    </FormItem>
                                    <FormItem
                                        label="Currency"
                                        invalid={
                                            errors.currency &&
                                            touched.currency
                                        }
                                        errorMessage={errors.currency}
                                    >
                                        <Field >
                                            {({ field, form }: FieldProps) => (
                                                <Select
                                                    placeholder="Currency"
                                                    field={field}
                                                    name="currency"
                                                    form={form}
                                                    options={statusCurrency}
                                                    value={statusCurrency.find(
                                                        (status) =>
                                                            status.value ===
                                                            values.currency

                                                            
                                                    )}
                                                    onChange={(value:any)=>{console.log(value)
                                                        setFieldValue("currency",value.label)}}

                                                    
                                                   
                                                />
                                            )}
                                        </Field>
                                    </FormItem>
                                </div>


                                <table className=" mb-4">
                                    <THead className="bg-[#e5e7eb] h-8 m-0">
                                        <tr>
                                            <th className="ring-offset-0 ring-offset-transparent ring-blue-500 shadow-none text-left pl-4 md:w-1/2 capitalize">ITEM</th>
                                            <th className="ring-offset-0 ring-offset-transparent ring-blue-500 shadow-none md:w-1/6 capitalize">QUANTITY</th>
                                            <th className="ring-offset-0 ring-offset-transparent ring-blue-500 shadow-none md:w-1/6 capitalize">RATE</th>       
                                            <th className="ring-offset-0 ring-offset-transparent ring-blue-500 shadow-none md:w-1/6 capitalize">AMOUNT</th>
                                        </tr>
                                    </THead>
                                    {tableData.map((row, index:number) => (
                                        <tr key={index}>
                                            <td>
                                                <Field
                                                    className="m-0"
                                                    type="text"
                                                    autoComplete="off"
                                                    name="itemDesc"
                                                    placeholder="Item"
                                                    component={Input}
                                                    onChange={(e: any) => handleInputChange(index, 'itemDesc', e.target.value)}
                                                />
                                            </td>
                                            <td>
                                                <Field
                                                    className="m-0"
                                                    type="text"
                                                    autoComplete="off"
                                                    name="quantity"
                                                    placeholder="Quantity"
                                                    component={Input}
                                                    onChange={(e: any) => handleInputChange(index, 'quantity', e.target.value)}
                                                />
                                            </td>
                                            <td>
                                                <Field
                                                    className="m-0"
                                                    type="text"
                                                    autoComplete="off"
                                                    name="unitPrice"
                                                    placeholder="Unit Price"
                                                    component={Input}
                                                    onChange={(e: any) => handleInputChange(index, 'unitPrice', e.target.value)}
                                                />
                                            </td>
                                            <td className='text-center'>
                                                ${row?.quantity * row?.unitPrice}

                                                
                                            </td>

                                            {/* <td>{row.amount}</td> */}
                                        </tr>
                                    ))}
                                </table>
                                <button className="mr-2 px-4 py-2 bg-green-700 text-white rounded" type="button" onClick={handleAddLine}>+ Line Item</button>

                                <div className='mt-10'>
                                <FormItem
                                    label="Notes and Terms"
                                    invalid={
                                        errors.notes &&
                                        touched.notes
                                    }
                                    errorMessage={errors.notes}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="notes"
                                        placeholder="Notes & Terms"
                                        component={Input}
                                        onChange={handleChange}

                                    />
                                </FormItem>

                                <Card className="mb-4">
            <h5 className="mb-4">Payment Summary</h5>
            <ul>
                <PaymentInfo label="Subtotal" value={data?.total} />
                {/* <PaymentInfo label="Delivery fee" value={data?.deliveryFees} />
                <PaymentInfo label="Tax(6%)" value={data?.tax} />
                <hr className="mb-3" /> */}
                <PaymentInfo isLast label="Total" value={data?.total} />
            </ul>
        </Card>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button
                                        loading={isSubmitting}
                                        variant="solid"
                                        type="submit"
                                    >
                                        Save
                                    </Button>
                                </div>
                            </FormContainer>
                        </Form>
                    )
                }}
            </Formik>
        </>
    )
}

export default PurchaseOrderForm
