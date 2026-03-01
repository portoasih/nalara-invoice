import { prisma } from "@/lib/prisma"
import Link from "next/navigation"
import SiswaAction from "@/components/siswa/SiswaAction"

export const revalidate = 0 // Disable cache for realtime list

export default async function SiswaPage(props: {
    searchParams?: Promise<{ q?: string }>
}) {
    const searchParams = await props.searchParams
    const query = searchParams?.q || ""

    const students = await prisma.student.findMany({
        where: query ? {
            name: {
                contains: query,
                mode: 'insensitive',
            }
        } : undefined,
        orderBy: {
            jenjang: 'asc'
        }
    })

    return (
        <div className="flex flex-col gap-8 max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Daftar Siswa</h1>
                    <p className="text-[#00a36c]/70 text-lg font-medium mt-2">
                        Kelola data siswa bimbingan belajar Nalara yang terdaftar
                    </p>
                </div>
                <a
                    href="/siswa/tambah"
                    className="flex items-center gap-2 rounded-xl h-12 px-4 sm:px-6 bg-[#00a36c] text-white text-sm sm:text-base font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                    <span className="material-symbols-outlined">person_add</span>
                    <span className="hidden sm:inline">Tambah Siswa Baru</span>
                    <span className="sm:hidden">Tambah</span>
                </a>
            </div>

            {/* List Table Section */}
            <div className="bg-white rounded-2xl border border-[#00a36c]/10 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#ecffdc] border-b border-[#00a36c]/10">
                                <th className="px-6 py-4 text-sm font-bold text-[#00a36c] uppercase tracking-wider">
                                    Nama Lengkap
                                </th>
                                <th className="px-6 py-4 text-sm font-bold text-[#00a36c] uppercase tracking-wider">
                                    Jenjang
                                </th>
                                <th className="px-6 py-4 text-sm font-bold text-[#00a36c] uppercase tracking-wider">
                                    Kelas
                                </th>
                                <th className="px-6 py-4 text-sm font-bold text-[#00a36c] uppercase tracking-wider">
                                    Tipe Les
                                </th>
                                <th className="px-6 py-4 text-sm font-bold text-[#00a36c] uppercase tracking-wider">
                                    Status Jarak
                                </th>
                                <th className="px-6 py-4 text-right text-sm font-bold text-[#00a36c] uppercase tracking-wider">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#00a36c]/5">
                            {students.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <span className="material-symbols-outlined text-4xl text-[#00a36c]/50">
                                                group_off
                                            </span>
                                            <p>Belum ada siswa yang terdaftar.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                students.map((student) => (
                                    <tr
                                        key={student.id}
                                        className="transition-colors hover:bg-[#ecffdc]/40 group"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded-full bg-[#afe1af]/30 flex items-center justify-center text-[#00a36c] font-bold">
                                                    {student.name.charAt(0).toUpperCase()}
                                                </div>
                                                <p className="font-bold text-slate-800">{student.name}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#afe1af]/40 text-[#00a36c]">
                                                {student.jenjang}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 font-medium">
                                            {student.kelas}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1 text-slate-600 capitalize">
                                                <span className="material-symbols-outlined text-sm text-[#00a36c]">
                                                    {student.type === "private" ? "person" : "group"}
                                                </span>
                                                {student.type}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {student.isLongDistance ? (
                                                <span className="inline-flex items-center gap-1 text-sm font-semibold text-yellow-600 bg-yellow-50 border border-yellow-200 px-2.5 py-1 rounded-lg">
                                                    <span className="material-symbols-outlined text-base">
                                                        commute
                                                    </span>
                                                    Luar Area (&gt;5km)
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#00a36c] bg-[#afe1af]/20 border border-[#00a36c]/20 px-2.5 py-1 rounded-lg">
                                                    <span className="material-symbols-outlined text-base">
                                                        home_pin
                                                    </span>
                                                    Dalam Area (&lt;5km)
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 relative z-10">
                                            <SiswaAction studentId={student.id} studentName={student.name} />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
