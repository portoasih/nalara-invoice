import { prisma } from "@/lib/prisma"
import InvoiceForm from "@/components/invoice/InvoiceForm"

export const revalidate = 0 // Ensure fresh data for student lists always

export default async function TambahInvoicePage() {
    // We need all active students to populate the dropdown
    const students = await prisma.student.findMany({
        orderBy: { name: 'asc' }
    })

    // We need pricing structures to do live calculation on the client Side
    const pricings = await prisma.pricing.findMany()

    return (
        <InvoiceForm
            students={students}
            pricings={pricings}
        />
    )
}
