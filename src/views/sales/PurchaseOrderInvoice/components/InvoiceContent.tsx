import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Loading from '@/components/shared/Loading'
import Logo from '@/components/template/Logo'
import ContentTable from './ContentTable'
import { useLocation, useParams } from 'react-router-dom'
import isEmpty from 'lodash/isEmpty'
import { apiGetAccountInvoiceData } from '@/services/AccountServices'
import { HiLocationMarker, HiPhone } from 'react-icons/hi'
import useThemeClass from '@/utils/hooks/useThemeClass'
import { useAppSelector } from '@/store'
import dayjs from 'dayjs'
import type { Product, Summary } from './ContentTable'
import { apiGetPurchaseOrderInvoice } from '@/services/SalesService'

type Invoice = {
    id: string
    recipient: string
    email: string
    address: string[]
    phoneNumber: string
    dateTime: number
    product: Product[]
    paymentSummary: Summary
}

type GetAccountInvoiceDataRequest =  number

type GetAccountInvoiceDataResponse = Invoice

const InvoiceContent = () => {
    const { textTheme } = useThemeClass()

    const {id} = useParams();
    const location = useLocation()

    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<any>({})

    const mode = useAppSelector((state) => state.theme.mode)

    useEffect(() => {
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const fetchData = async () => {
        // const id:any = id;
        if (id) {
            setLoading(true)
            const response = await apiGetPurchaseOrderInvoice<
                GetAccountInvoiceDataRequest
            >(Number(id))
            if (response?.status === 200) {
                setLoading(false)
                setData(response?.data)
            }
        }
    }

    return (
        <Loading loading={loading}>
            {!isEmpty(data) && (
                <>
                    <div className="flex flex-col md:flex-row justify-between gap-4 mb-10">
                        <div>
                            <Logo className="mb-3" mode={mode} />
                            <address className="not-italic">
                                <div>
                                    <h5>{data?.supplierCompany}Inc.</h5>
                                    <br />
                                    <span>{data?.supplierAddress}</span>
                                    <br />
                                    {/* <span>Fairfield, Chicago Town 06824</span> */}
                                    <br />
                                    <abbr title="Phone">Phone:</abbr>
                                    <span>{data?.supplierPhone}</span>
                                </div>
                            </address>
                        </div>
                        <div className="my-4">
                            <div className="mb-2">
                                <h4>Invoice #{data?.purchaseOrderNumber}</h4>
                                <span>
                                    Date:{' '}
                                    { new Date(data?.date).toLocaleString()}
                                </span>
                            </div>
                            {/* <h6>{data?.supplierAddress}</h6> */}
                            <div className="mt-4 flex">
                               {/*  <HiLocationMarker
                                    className={`text-xl ${textTheme}`}
                                /> */}
                                {/* <div className="ltr:ml-3 rtl:mr-3">
                                    {data?.address?.map((line) => (
                                        <div key={line} className="mb-1">
                                            {line}
                                        </div>
                                    ))}
                                </div> */}
                            </div>
                            <div className="mt-4 flex">
                                <HiPhone className={`text-xl ${textTheme}`} />
                                <div className="ltr:ml-3 rtl:mr-3">
                                    {data.supplierPhone}
                                </div>
                            </div>
                        </div>
                    </div>
                    <ContentTable
                        products={data?.purchaseItems}
                        summary={{subTotal : data?.total}}
                    />
                    <div className="print:hidden mt-6 flex items-center justify-between">
                        <small className="italic">
                            Invoice was created on a computer and is valid
                            without the signature and seal.
                        </small>
                        <Button variant="solid" onClick={() => window.print()}>
                            Print
                        </Button>
                    </div>
                </>
            )}
        </Loading>
    )
}

export default InvoiceContent
