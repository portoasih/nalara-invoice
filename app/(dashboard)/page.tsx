export default function DashboardPage() {
    return (
        <div className="flex flex-col gap-8 max-w-6xl mx-auto">
            {/* Welcome Section */}
            <div className="flex flex-wrap justify-between items-end gap-4">
                <div className="flex flex-col gap-2">
                    <p className="text-[#00a36c] font-bold tracking-wider text-sm uppercase">
                        Ringkasan Pengelolaan
                    </p>
                    <h1 className="text-slate-900 text-4xl font-extrabold leading-tight tracking-tight">
                        Dashboard Utama
                    </h1>
                    <p className="text-[#00a36c]/70 text-lg font-medium">
                        Pengelolaan Rekapan Pembayaran Nalara Bimbingan Belajar
                    </p>
                </div>
            </div>
        </div>
    )
}
