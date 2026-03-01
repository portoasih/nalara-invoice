"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function TambahSiswaPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        jenjang: "",
        kelas: "",
        type: "",
        isLongDistance: false
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target
        const checked = (e.target as HTMLInputElement).checked

        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const res = await fetch("/api/students", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                router.push("/siswa")
                router.refresh()
            } else {
                alert("Gagal menambahkan siswa")
            }
        } catch (error) {
            console.error(error)
            alert("Terjadi kesalahan saat menambahkan data.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-[#AFE1AF]/30">
                {/* Header */}
                <div className="mb-8 flex items-center gap-3">
                    <div className="p-3 bg-[#00a36d]/10 rounded-lg text-[#00a36d]">
                        <span className="material-symbols-outlined text-3xl">person_add</span>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Tambah Siswa Baru</h1>
                        <p className="text-sm text-slate-500">Lengkapi informasi detail siswa untuk memulai pendaftaran.</p>
                    </div>
                </div>

                {/* Form */}
                <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                    {/* Nama Siswa */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-slate-700 ml-1">Nama Siswa</label>
                        <input
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full rounded-lg border-[#98FB98] bg-white px-4 py-3 text-slate-900 focus:border-[#00a36d] focus:ring-1 focus:ring-[#00a36d] outline-none transition-all border-2"
                            placeholder="Masukkan nama lengkap siswa"
                            type="text"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Jenjang */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Jenjang Pendidikan</label>
                            <select
                                name="jenjang"
                                required
                                value={formData.jenjang}
                                onChange={handleChange}
                                className="w-full rounded-lg border-[#98FB98] bg-white px-4 py-3 text-slate-900 focus:border-[#00a36d] focus:ring-1 focus:ring-[#00a36d] outline-none transition-all border-2 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2300A36C%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[right_1rem_center] bg-no-repeat"
                            >
                                <option value="">Pilih Jenjang</option>
                                <option value="SD">SD (Sekolah Dasar)</option>
                                <option value="SMP">SMP (Sekolah Menengah Pertama)</option>
                            </select>
                        </div>

                        {/* Kelas */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Kelas</label>
                            <input
                                name="kelas"
                                required
                                value={formData.kelas}
                                onChange={handleChange}
                                className="w-full rounded-lg border-[#98FB98] bg-white px-4 py-3 text-slate-900 focus:border-[#00a36d] focus:ring-1 focus:ring-[#00a36d] outline-none transition-all border-2"
                                placeholder="Contoh: 4 SD / 8 SMP"
                                type="text"
                            />
                        </div>
                    </div>

                    {/* Tipe Les */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-slate-700 ml-1">Tipe Les</label>
                        <div className="grid grid-cols-2 gap-3">
                            <label className="relative flex cursor-pointer items-center justify-center rounded-lg border-2 border-[#98FB98] bg-white p-3 text-slate-700 transition-all hover:bg-[#ECFFDC] has-[:checked]:border-[#00a36d] has-[:checked]:bg-[#AFE1AF]/20">
                                <input
                                    className="sr-only"
                                    name="type"
                                    required
                                    type="radio"
                                    value="private"
                                    checked={formData.type === "private"}
                                    onChange={handleChange}
                                />
                                <span className="flex items-center gap-2 font-medium">
                                    <span className="material-symbols-outlined text-xl">person</span> Private
                                </span>
                            </label>
                            <label className="relative flex cursor-pointer items-center justify-center rounded-lg border-2 border-[#98FB98] bg-white p-3 text-slate-700 transition-all hover:bg-[#ECFFDC] has-[:checked]:border-[#00a36d] has-[:checked]:bg-[#AFE1AF]/20">
                                <input
                                    className="sr-only"
                                    name="type"
                                    required
                                    type="radio"
                                    value="kelompok"
                                    checked={formData.type === "kelompok"}
                                    onChange={handleChange}
                                />
                                <span className="flex items-center gap-2 font-medium">
                                    <span className="material-symbols-outlined text-xl">group</span> Kelompok
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Checkbox Transport */}
                    <label className="flex items-center gap-3 p-4 bg-[#AFE1AF]/10 rounded-xl border border-[#98FB98] cursor-pointer group">
                        <input
                            name="isLongDistance"
                            checked={formData.isLongDistance}
                            onChange={handleChange}
                            className="w-5 h-5 rounded border-[#98FB98] text-[#00a36d] focus:ring-[#00a36d]"
                            type="checkbox"
                        />
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-800">Perlu Transportasi Khusus</span>
                            <span className="text-xs text-slate-500">Pilih jika jarak rumah ke lokasi les &gt; 5km</span>
                        </div>
                    </label>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-4">
                        <button
                            onClick={() => router.back()}
                            className="flex-1 px-6 py-4 rounded-xl bg-[#AFE1AF] text-[#004d33] font-bold text-base hover:bg-[#98FB98] transition-colors order-2 sm:order-1"
                            type="button"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={isLoading}
                            className="flex-[2] flex justify-center items-center gap-2 px-6 py-4 rounded-xl bg-[#00a36d] text-white font-bold text-base hover:bg-[#008f5d] shadow-lg shadow-[#00a36d]/20 transition-all order-1 sm:order-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            type="submit"
                        >
                            {isLoading ? "Menyimpan..." : "Tambah Siswa"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
