"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface Student {
    id: string
    name: string
    jenjang: string
    type: string
    isLongDistance: boolean
}

interface Pricing {
    jenjang: string
    type: string
    price: number
}

interface InvoiceFormProps {
    students: Student[]
    pricings: Pricing[]
}

const MONTHS = [
    { value: 1, label: "Januari" },
    { value: 2, label: "Februari" },
    { value: 3, label: "Maret" },
    { value: 4, label: "April" },
    { value: 5, label: "Mei" },
    { value: 6, label: "Juni" },
    { value: 7, label: "Juli" },
    { value: 8, label: "Agustus" },
    { value: 9, label: "September" },
    { value: 10, label: "Oktober" },
    { value: 11, label: "November" },
    { value: 12, label: "Desember" }
]

export default function InvoiceForm({ students, pricings }: InvoiceFormProps) {
    const router = useRouter()

    // Form state
    const [studentId, setStudentId] = useState("")
    const [month, setMonth] = useState(new Date().getMonth() + 1)
    const [year, setYear] = useState(new Date().getFullYear())
    const [sessionCount, setSessionCount] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Derived states
    const selectedStudent = students.find(s => s.id === studentId)
    const selectedPricing = selectedStudent
        ? pricings.find(p => p.jenjang === selectedStudent.jenjang && p.type === selectedStudent.type)
        : null

    const basePrice = selectedPricing?.price || 0
    const transportFee = (selectedStudent?.isLongDistance) ? 10000 : 0
    const parsedSessions = parseInt(sessionCount) || 0
    const finalPricePerSession = basePrice + transportFee
    const total = finalPricePerSession * parsedSessions

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!studentId || !month || !year || !sessionCount || parsedSessions <= 0) {
            alert("Harap lengkapi semua field dengan benar.")
            return
        }

        setIsSubmitting(true)
        try {
            const res = await fetch("/api/invoices", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    studentId,
                    month,
                    year: Number(year),
                    sessionCount: parsedSessions
                })
            })

            if (res.ok) {
                router.push("/invoice") // Assuming /invoice is the list
                router.refresh()
            } else {
                const data = await res.json()
                alert(data.error || "Gagal membuat invoice")
            }
        } catch (error) {
            console.error(error)
            alert("Terjadi kesalahan saat membuat invoice.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl shadow-[#00a36c]/5 overflow-hidden border border-[#00a36c]/10">
                {/* Header Section */}
                <div className="bg-[#00a36c]/5 p-8 border-b border-[#00a36c]/10">
                    <div className="flex items-center gap-4 mb-2">
                        <span className="material-symbols-outlined text-[#00a36c] text-3xl">add_notes</span>
                        <h2 className="text-2xl font-bold text-slate-900">Buat Invoice Baru</h2>
                    </div>
                    <p className="text-slate-500">Silakan lengkapi detail pertemuan bimbingan belajar untuk menagih pembayaran.</p>
                </div>

                <form className="p-8 space-y-6" onSubmit={handleSubmit}>
                    {/* Dropdown: Pilih Siswa */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-700">Pilih Siswa</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#00a36c]/60">person</span>
                            <select
                                value={studentId}
                                onChange={(e) => setStudentId(e.target.value)}
                                required
                                className="w-full pl-12 pr-4 py-3.5 bg-[#ecffdc]/30 border border-[#00a36c]/20 rounded-xl focus:ring-2 focus:ring-[#00a36c]/20 focus:border-[#00a36c] outline-none transition-all appearance-none text-slate-900"
                            >
                                <option value="" disabled>Cari nama siswa...</option>
                                {students.map(student => (
                                    <option key={student.id} value={student.id}>{student.name} ({student.jenjang} - {student.type})</option>
                                ))}
                            </select>
                            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#00a36c]/60 pointer-events-none">expand_more</span>
                        </div>
                    </div>

                    {/* Row: Bulan & Tahun */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-700">Bulan</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#00a36c]/60">calendar_month</span>
                                <select
                                    value={month}
                                    onChange={(e) => setMonth(Number(e.target.value))}
                                    required
                                    className="w-full pl-12 pr-4 py-3.5 bg-[#ecffdc]/30 border border-[#00a36c]/20 rounded-xl focus:ring-2 focus:ring-[#00a36c]/20 focus:border-[#00a36c] outline-none transition-all appearance-none text-slate-900"
                                >
                                    {MONTHS.map(m => (
                                        <option key={m.value} value={m.value}>{m.label}</option>
                                    ))}
                                </select>
                                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#00a36c]/60 pointer-events-none">expand_more</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-700">Tahun</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#00a36c]/60">event</span>
                                <input
                                    type="number"
                                    value={year}
                                    onChange={(e) => setYear(Number(e.target.value))}
                                    required
                                    className="w-full pl-12 pr-4 py-3.5 bg-[#ecffdc]/30 border border-[#00a36c]/20 rounded-xl focus:ring-2 focus:ring-[#00a36c]/20 focus:border-[#00a36c] outline-none transition-all text-slate-900"
                                    placeholder="2024"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Input: Jumlah Pertemuan */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-700">Jumlah Pertemuan</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#00a36c]/60">counter_4</span>
                            <input
                                type="number"
                                min="1"
                                value={sessionCount}
                                onChange={(e) => setSessionCount(e.target.value)}
                                required
                                className="w-full pl-12 pr-4 py-3.5 bg-[#ecffdc]/30 border border-[#00a36c]/20 rounded-xl focus:ring-2 focus:ring-[#00a36c]/20 focus:border-[#00a36c] outline-none transition-all text-slate-900"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    {/* Preview Section */}
                    {studentId && (
                        <div className="bg-[#afe1af]/10 rounded-xl p-6 space-y-4 border border-[#afe1af]/30 mt-4">
                            <h3 className="text-sm font-bold text-[#00a36c] uppercase tracking-wider">Ringkasan Pembayaran</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between text-slate-600">
                                    <span>Harga per sesi (Dasar)</span>
                                    <span>{basePrice ? formatCurrency(basePrice) : "Tidak Tersedia"}</span>
                                </div>

                                <div className="flex justify-between text-slate-600">
                                    <span>Transport {selectedStudent?.isLongDistance ? '(Luar Area)' : '(Dalam Area)'}</span>
                                    <span>{formatCurrency(transportFee)}</span>
                                </div>
                                <div className="flex justify-between text-slate-600">
                                    <span>Total Harga per sesi</span>
                                    <span className="font-semibold">{formatCurrency(finalPricePerSession)}</span>
                                </div>

                                <div className="pt-3 border-t border-[#afe1af]/40 flex justify-between items-center text-lg">
                                    <span className="font-bold text-slate-900">Total Tagihan ({parsedSessions} Sesi)</span>
                                    <span className="text-2xl font-bold text-[#00a36c]">{formatCurrency(total)}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="flex-1 order-2 sm:order-1 px-6 py-4 bg-[#afe1af]/30 text-[#00a36c] font-bold rounded-xl hover:bg-[#afe1af]/50 transition-all flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined">arrow_back</span>
                            Kembali
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !studentId || parsedSessions <= 0}
                            className="flex-[2] order-1 sm:order-2 px-6 py-4 bg-[#00a36c] text-white font-bold rounded-xl shadow-lg shadow-[#00a36c]/20 hover:bg-[#008f5d] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="material-symbols-outlined">send</span>
                            {isSubmitting ? "Menyimpan..." : "Buat Invoice"}
                        </button>
                    </div>
                </form>

                {/* Optional Card Footer Graphic */}
                <div className="h-2 w-full bg-gradient-to-r from-[#afe1af] via-[#00a36c] to-[#afe1af]"></div>
            </div>
        </div>
    )
}
