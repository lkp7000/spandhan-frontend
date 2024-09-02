import { useState, useEffect } from 'react'
import classNames from 'classnames'
import Tag from '@/components/ui/Tag'
import Loading from '@/components/shared/Loading'
import Container from '@/components/shared/Container'
import DoubleSidedImage from '@/components/shared/DoubleSidedImage'
import OrderProducts from './components/OrderProducts'
import PaymentSummary from './components/PaymentSummary'
import ShippingInfo from './components/ShippingInfo'
import Activity from './components/Activity'
import CustomerInfo from './components/CustomerInfo'
import { HiOutlineCalendar } from 'react-icons/hi'
import { apiGetSalesOrderDetails } from '@/services/SalesService'
import { useLocation } from 'react-router-dom'
import isEmpty from 'lodash/isEmpty'
import dayjs from 'dayjs'
import { FormItem, Table } from '@/components/ui'
import { Field } from 'formik'
import Input from '@/components/ui/Input'
import THead from '@/components/ui/Table/THead'


type SalesOrderDetailsResponse = {
    id?: string
    progressStatus?: number
    payementStatus?: number
    dateTime?: number
    paymentSummary?: {
        subTotal: number
        tax: number
        deliveryFees: number
        total: number
    }
    shipping?: {
        deliveryFees: number
        estimatedMin: number
        estimatedMax: number
        shippingLogo: string
        shippingVendor: string
    }
    product?: {
        id: string
        name: string
        productCode: string
        img: string
        price: number
        quantity: number
        total: number
        details: Record<string, string[]>
    }[]
    activity?: {
        date: number
        events: {
            time: number
            action: string
            recipient?: string
        }[]
    }[]
    customer?: {
        name: string
        email: string
        phone: string
        img: string
        previousOrder: number
        shippingAddress: {
            line1: string
            line2: string
            line3: string
            line4: string
        }
        billingAddress: {
            line1: string
            line2: string
            line3: string
            line4: string
        }
    }
}

type PayementStatus = {
    label: string
    class: string
}

const paymentStatus: Record<number, PayementStatus> = {
    0: {
        label: 'Paid',
        class: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100',
    },
    1: {
        label: 'Unpaid',
        class: 'text-red-500 bg-red-100 dark:text-red-100 dark:bg-red-500/20',
    },
}

const progressStatus: Record<number, PayementStatus> = {
    0: {
        label: 'Fulfilled',
        class: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-100',
    },
    1: {
        label: 'Unfulfilled',
        class: 'text-amber-600 bg-amber-100 dark:text-amber-100 dark:bg-amber-500/20',
    },
}

const OrderDetails = () => {
    const location = useLocation()

    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<SalesOrderDetailsResponse>({})


    const [tableData, setTableData] = useState([
        { item: '', quantity: '', rate: '', amount: '' },
      ]);

      const handleAddLine = () => {
        setTableData([...tableData, { item: '', quantity: '', rate: '', amount: '' }]);
      };

      const handleInputChange = (index:any, field:any, value:any) => {
        const newData:any = [...tableData];
        newData[index][field] = value;
        setTableData(newData);
      };
      
    useEffect(() => {
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const fetchData = async () => {
        const id = location.pathname.substring(
            location.pathname.lastIndexOf('/') + 1
        )
        if (id) {
            setLoading(true)
            const response = await apiGetSalesOrderDetails<
                SalesOrderDetailsResponse,
                { id: string }
            >({ id })
            if (response) {
                setLoading(false)
                setData(response.data)
            }
        }
    }

    return (
        <Container className="h-full">
            <Loading loading={loading}>
                {!isEmpty(data) && (
                    <>
                        <div className="mb-6">
                            <div className="flex items-center mb-2">
                               
                            </div>
                           
                        </div>
                        <div className="xl:flex gap-4">
                            <div className="w-full">
                                {/* <OrderProducts data={data.product} /> */}
                                <table className=" mb-10">
                                            <THead className="bg-[#e5e7eb] h-8 m-0">
                                                <tr>
                                                    <th className="ring-offset-0 ring-offset-transparent ring-blue-500 shadow-none text-left pl-4 md:w-1/2 capitalize">ITEM</th>
                                                    <th  className="ring-offset-0 ring-offset-transparent ring-blue-500 shadow-none md:w-1/6 capitalize">QUANTITY</th>
                                                    <th  className="ring-offset-0 ring-offset-transparent ring-blue-500 shadow-none md:w-1/6 capitalize">RATE</th>
                                                    <th  className="ring-offset-0 ring-offset-transparent ring-blue-500 shadow-none md:w-1/6 capitalize">AMOUNT</th>
                                                </tr>
                                            </THead>
                                        <tbody>
                                            <tr>
                                            <td> <Field
                                            className="m-0"
                                            type="text"
                                            autoComplete="off"
                                            name="lastName"
                                            placeholder="Company"
                                            component={Input}
                                        /></td>
                                            <td><Field
                                            type="text"
                                            autoComplete="off"
                                            name="lastName"
                                            placeholder="Company"
                                            component={Input}
                                        /></td>
                                            <td><Field
                                            type="text"
                                            autoComplete="off"
                                            name="lastName"
                                            placeholder="Company"
                                            component={Input}
                                        /></td>
                                            <td className='text-center'>$0000</td>

                                            </tr>
                                            
                                        </tbody>
                                </table>
                                <button className="mr-2 px-4 py-2 bg-green-700 text-white rounded" onClick={handleAddLine}>+ Line Item</button>
                                <div className="xl:grid grid-cols-2 gap-4">
                                    {/* <ShippingInfo data={data.shipping} /> */}
                                    <FormItem
                                    label="Notes"
                                    // invalid={errors.address && touched.address}
                                    // errorMessage={errors.address}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="address"
                                        placeholder="Notes"
                                        component={Input}
                                    />
                                </FormItem>
                                
                                    <PaymentSummary
                                        data={data.paymentSummary}
                                    />
                                </div>
                                {/* <Activity data={data.activity} /> */}
                            </div>
                            {/* <div className="xl:max-w-[360px] w-full">
                                <CustomerInfo data={data.customer} />
                            </div> */}
                            
                        </div>
                        
                    </>
                )}
            </Loading>
            {!loading && isEmpty(data) && (
                <div className="h-full flex flex-col items-center justify-center">
                    <DoubleSidedImage
                        src="/img/others/img-2.png"
                        darkModeSrc="/img/others/img-2-dark.png"
                        alt="No order found!"
                    />
                    <h3 className="mt-8">No order found!</h3>
                </div>
            )}
        </Container>
    )
}

export default OrderDetails
