import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const body = await req.json()

    const student = await prisma.student.create({
        data: {
            name: body.name,
            jenjang: body.jenjang,
            type: body.type,
            kelas: body.kelas,
            isLongDistance: body.isLongDistance ?? false,
        },
    })

    return NextResponse.json(student)
}


export async function GET() {
    const students = await prisma.student.findMany({
        orderBy: { createdAt: "desc" }
    })

    return NextResponse.json(students)
}

export async function DELETE(req: Request) {
    try {
        const body = await req.json()

        if (!body.id) {
            return NextResponse.json({ error: "Student ID is required" }, { status: 400 })
        }

        const deletedStudent = await prisma.student.delete({
            where: { id: body.id }
        })

        return NextResponse.json(deletedStudent)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Failed to delete student" }, { status: 500 })
    }
}
