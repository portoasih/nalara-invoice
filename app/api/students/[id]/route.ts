import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const body = await req.json()

        const updatedStudent = await prisma.student.update({
            where: { id },
            data: {
                name: body.name,
                jenjang: body.jenjang,
                type: body.type,
                kelas: body.kelas,
                isLongDistance: body.isLongDistance ?? false,
            },
        })

        return NextResponse.json(updatedStudent)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Failed to update student" }, { status: 500 })
    }
}
