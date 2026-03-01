import { prisma } from "@/lib/prisma"
import Link from "next/link"

export const revalidate = 0

const MONTHS = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
]

const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(number)
}

const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
        dateStyle: "long",
    }).format(date)
}

export default async function InvoicePage(props: {
    searchParams?: Promise<{ q?: string }>
}) {
    const searchParams = await props.searchParams
    const query = searchParams?.q || ""

    const invoices = await prisma.invoice.findMany({
        where: query ? {
            OR: [
                {
                    invoiceNumber: {
                        contains: query,
                        mode: 'insensitive',
                    }
                },
                {
                    student: {
                        name: {
                            contains: query,
                            mode: 'insensitive',
                        }
                    }
                }
            ]
        } : undefined,
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            student: true
        }
    })

    return (
        <div className="flex flex-col gap-8 max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Daftar Invoice</h1>
                    <p className="text-[#00a36c]/70 text-lg font-medium mt-2">
                        Kelola tagihan pembayaran siswa bimbingan belajar
                    </p>
                </div>
                <Link
                    href="/invoice/buat"
                    className="flex items-center gap-2 rounded-xl h-12 px-4 sm:px-6 bg-[#00a36c] text-white text-sm sm:text-base font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                    <span className="material-symbols-outlined">add_notes</span>
                    <span className="hidden sm:inline">Buat Invoice Baru</span>
                    <span className="sm:hidden">Buat Baru</span>
                </Link>
            </div>

            {/* List Table Section */}
            <div className="bg-white rounded-2xl border border-[#00a36c]/10 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#ecffdc] border-b border-[#00a36c]/10">
                                <th className="px-6 py-4 text-sm font-bold text-[#00a36c] uppercase tracking-wider">
                                    No. Invoice
                                </th>
                                <th className="px-6 py-4 text-sm font-bold text-[#00a36c] uppercase tracking-wider">
                                    Siswa
                                </th>
                                <th className="px-6 py-4 text-sm font-bold text-[#00a36c] uppercase tracking-wider">
                                    Periode
                                </th>
                                <th className="px-6 py-4 text-sm font-bold text-[#00a36c] uppercase tracking-wider">
                                    Total Tagihan
                                </th>
                                <th className="px-6 py-4 text-sm font-bold text-[#00a36c] uppercase tracking-wider">
                                    Tanggal Dibuat
                                </th>
                                <th className="px-6 py-4 text-right text-sm font-bold text-[#00a36c] uppercase tracking-wider">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#00a36c]/5">
                            {invoices.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <span className="material-symbols-outlined text-4xl text-[#00a36c]/50">
                                                receipt_long
                                            </span>
                                            <p>Belum ada invoice yang dibuat.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                invoices.map((invoice: any) => (
                                    <tr
                                        key={invoice.id}
                                        className="transition-colors hover:bg-[#ecffdc]/40 group"
                                    >
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-slate-800">{invoice.invoiceNumber}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-800">{invoice.student.name}</span>
                                                <span className="text-xs text-slate-500">{invoice.student.jenjang} - {invoice.student.type}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#afe1af]/40 text-[#00a36c]">
                                                {MONTHS[invoice.month - 1]} {invoice.year}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-[#00a36c]">
                                                {formatRupiah(invoice.total)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {formatDate(invoice.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 relative z-10 text-right">
                                            <Link
                                                href={`/invoice/${invoice.invoiceNumber}`}
                                                className="inline-flex items-center justify-center p-2 text-[#00a36c] bg-[#ecffdc] hover:bg-[#afe1af]/40 rounded-lg transition-colors font-bold text-sm gap-2"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">visibility</span>
                                                Lihat
                                            </Link>
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
