"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface SiswaActionProps {
    studentId: string
    studentName: string
}

export default function SiswaAction({ studentId, studentName }: SiswaActionProps) {
    const router = useRouter()
    const [isDeleting, setIsDeleting] = useState(false)

    const [isOpen, setIsOpen] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const confirmDelete = async () => {
        setIsDeleting(true)
        try {
            const res = await fetch("/api/students", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: studentId })
            })

            if (res.ok) {
                setShowDeleteModal(false)
                router.refresh()
            } else {
                alert("Gagal menghapus siswa")
            }
        } catch (error) {
            console.error("Failed to delete", error)
            alert("Terjadi kesalahan saat menghapus data.")
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div className="relative flex justify-end">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-[#00a36c] hover:bg-[#ecffdc] p-2 rounded-lg transition-colors focus:ring-2 focus:ring-[#00a36c]/40 outline-none"
                title="Pilihan Aksi"
            >
                <span className="material-symbols-outlined">more_vert</span>
            </button>

            {isOpen && (
                <>
                    {/* Fixed backdrop to close dropdown when clicking outside */}
                    <div
                        className="fixed inset-0 z-[99]"
                        onClick={() => setIsOpen(false)}
                    />

                    <div className="absolute right-8 top-0 z-[100] w-48 bg-white border border-[#00a36c]/10 rounded-xl shadow-xl shadow-[#00a36c]/10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex flex-col py-1">
                            <button
                                onClick={() => {
                                    setIsOpen(false)
                                    router.push(`/siswa/edit/${studentId}`)
                                }}
                                className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-[#ecffdc] hover:text-[#00a36c] transition-colors text-left w-full"
                            >
                                <span className="material-symbols-outlined text-[20px]">edit</span>
                                Edit Data
                            </button>

                            <div className="h-px bg-[#00a36c]/10 my-1 mx-2" />

                            <button
                                onClick={() => {
                                    setIsOpen(false)
                                    setShowDeleteModal(true)
                                }}
                                disabled={isDeleting}
                                className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors text-left w-full disabled:opacity-50"
                            >
                                <span className="material-symbols-outlined text-[20px]">delete</span>
                                Hapus Siswa
                            </button>
                        </div>
                    </div>
                </>
            )}

            {showDeleteModal && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    {/* Modal Backdrop */}
                    <div
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
                        onClick={() => !isDeleting && setShowDeleteModal(false)}
                    />

                    {/* Modal Content */}
                    <div className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="size-16 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                                <span className="material-symbols-outlined text-3xl">warning</span>
                            </div>

                            <div className="flex flex-col gap-1">
                                <h3 className="text-xl font-bold text-slate-900">
                                    Hapus Data Siswa?
                                </h3>
                                <p className="text-sm font-medium text-slate-500">
                                    Apakah Anda yakin ingin menghapus <strong>{studentName}</strong>? Data yang dihapus tidak dapat dikembalikan.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    disabled={isDeleting}
                                    className="flex-1 py-3 px-4 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    disabled={isDeleting}
                                    className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20 disabled:opacity-50 focus:ring-4 focus:ring-red-600/30"
                                >
                                    {isDeleting ? "Menghapus..." : "Ya, Hapus"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
