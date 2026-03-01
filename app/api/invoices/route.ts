import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

function generateInvoiceNumber() {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const random = Math.floor(1000 + Math.random() * 9000)

    return `INV-${year}${month}-${random}`
}

export async function POST(req: Request) {
    const body = await req.json()

    const student = await prisma.student.findUnique({
        where: { id: body.studentId }
    })

    if (!student) {
        return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    const pricing = await prisma.pricing.findFirst({
  where: {
    jenjang: student.jenjang,
    type: student.type
  }
})

    if (!pricing) {
        return NextResponse.json({ error: "Pricing not found" }, { status: 404 })
    }

    const transportFee = student.isLongDistance ? 10000 : 0
    const finalPricePerSession = pricing.price + transportFee
    const total = finalPricePerSession * body.sessionCount

    const invoice = await prisma.invoice.create({
        data: {
            invoiceNumber: generateInvoiceNumber(),
            studentId: student.id,
            month: body.month,
            year: body.year,
            sessionCount: body.sessionCount,
            basePrice: pricing.price,
            transportFee: transportFee,
            finalPricePerSession,
            total
        }
    })

    return NextResponse.json(invoice)
}

export async function GET() {
    const invoices = await prisma.invoice.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            student: true
        }
    })

    return NextResponse.json(invoices)
}
