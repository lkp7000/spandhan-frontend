/* eslint-disable import/no-unresolved */
import reducer from './store'
import { injectReducer } from '@/store'
import AdaptableCard from '@/components/shared/AdaptableCard'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { apiGetSalesProductList, apiSearchByPurchaseOrder } from '@/services/SalesService'
import Table from '@/components/ui/Table/Table'
import THead from '@/components/ui/Table/THead'
import Td from '@/components/ui/Table/Td'
import Tr from '@/components/ui/Table/Tr'
import TBody from '@/components/ui/Table/TBody'
import { useNavigate } from 'react-router'
import { HiOutlineEye, HiOutlineSearch, HiOutlineTrash, HiPlusCircle } from 'react-icons/hi'
import { APP_PREFIX_PATH } from '@/constants/route.constant'
import Button from '@/components/ui/Button'
import { Link } from 'react-router-dom'
import { Input } from '@/components/ui'

injectReducer('salesProductList', reducer)
type GetAccountInvoiceDataRequest =  string

const ProductList = () => {
    const navigate = useNavigate();
    const searchInput = useRef(null)
    const [search, setSearch] = useState<any>();
    const [demo,setDemo] = useState(false);
    const [data , setData] = useState<any>();

    const fet =async ()=>{
        const res = await apiGetSalesProductList();
        setData(res.data)
    }
    useEffect(()=>{
        fet();
    },[])

    const onEdit = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
    }

    const searchData = async ()=>{
        
        const res = await apiSearchByPurchaseOrder<GetAccountInvoiceDataRequest>(search);
        if(res){
            
            setSearch(res.data)
            setDemo(true)
        }
    }
    
    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="lg:flex items-center justify-between mb-4">
                <h3 className="mb-4 lg:mb-0">Purchase</h3>
                <div className="flex flex-col lg:flex-row lg:items-center gap-2">
                    <Input
                        ref={searchInput}
                        className="max-w-md md:w-52 md:mb-0 mb-4"
                        size="sm"
                        placeholder="Search product"
                        prefix={<HiOutlineSearch className="text-lg" onClick={searchData}/>}
                        onChange={onEdit}
                    />            
                    <Link
                        className="block lg:inline-block md:mb-0 mb-4"
                        to={`${APP_PREFIX_PATH}/sales/purchase-order-form`}
                    >
                    <Button block variant="solid" size="sm" icon={<HiPlusCircle />}>
                        Add Purchase Order
                    </Button>
                </Link>
            </div>            
        </div>
        <Table>
            <THead>
                <Tr>
                    <Td >PurchaseOrderNumber</Td>
                    <Td >Created On</Td>
                    <Td >View</Td>
                    <Td >Delete</Td>
                </Tr>
            </THead>
            <TBody>
                {!demo && data?.map((row:any, index:number) => (
                    <Tr key={index}>
                        <Td>
                            {row?.purchaseOrderNumber}
                        </Td>
                        <Td>
                            {row?.creationDateTime}
                        </Td>
                        <Td
                            className={`cursor-pointer p-2`}
                            onClick={()=>{ navigate(`${APP_PREFIX_PATH}/sales/purchase-order-invoice/${row?.purchaseOrderId}`)}}
                        >
                            <HiOutlineEye />
                        </Td>
                        <Td
                            className={`cursor-pointer p-2`}
                            onClick={()=>{console.log("delete")}}
                        >
                            <HiOutlineTrash />
                        </Td>
                    </Tr>
                ))}

                { demo &&
                    <Tr >
                        <Td>
                            {search?.purchaseOrderNumber}
                        </Td>
                        <Td>
                            {search?.creationDateTime}
                        </Td>
                        <Td
                            className={`cursor-pointer p-2`}
                            onClick={()=>{ navigate(`${APP_PREFIX_PATH}/sales/purchase-order-invoice/${search?.purchaseOrderId}`)}}
                            >
                            <HiOutlineEye />
                        </Td>
                        <Td
                            className={`cursor-pointer p-2`}
                            onClick={()=>{console.log("delete")}}
                        >
                            <HiOutlineTrash />
                        </Td>
                    </Tr>
                }       
            </TBody>
        </Table>
        </AdaptableCard>
    )
}

export default ProductList
