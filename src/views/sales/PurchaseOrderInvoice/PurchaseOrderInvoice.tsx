import Container from '@/components/shared/Container'
import InvoiceContent from './components/InvoiceContent'
import Card from '@/components/ui/Card'

const PurchaseOrderInvoice = () => {
    return (
        <Container className="h-full">
            <Card className="h-full" bodyClass="h-full">
                <InvoiceContent />
            </Card>
        </Container>
    )
}

export default PurchaseOrderInvoice
