import { useLocation, Link } from "react-router-dom";
import { AnimatedBackground, GlassCard, Logo } from "./components/SharedLayout";

export default function Thanks() {
  const { state } = useLocation();
  const bookingCode = state?.bookingCode || "N/A";
  const type = state?.type || "checkin";

  return (
    <div className="min-h-screen p-6 flex items-center justify-center relative overflow-hidden">
      <AnimatedBackground />

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <GlassCard className="text-center">
          <div className="flex flex-col items-center">
            {/* SUCCESS ICON */}
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 border border-green-500/30">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">
              {type === "checkin" ? "Check In Berhasil!" : "Check Out Berhasil!"}
            </h2>
            
            <p className="text-gray-400 text-sm mb-8 italic">
              Prosedur kunjungan telah tercatat di sistem kami.
            </p>

            {/* BOOKING CODE BOX */}
            <div className="w-full p-6 rounded-3xl bg-white/5 border border-[#c3a11d]/30 mb-8 relative group overflow-hidden shadow-inner">
              <div className="absolute inset-0 bg-gradient-to-r from-[#c3a11d]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <p className="text-[#c3a11d] text-xs font-bold tracking-[0.2em] mb-2 uppercase">Kode Booking</p>
              <h1 className="text-3xl font-black text-white tracking-wider drop-shadow-lg">
                {bookingCode}
              </h1>
            </div>

            {/* UPDATE: Pesan Penutup Sesuai Permintaan */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-8">
              <div className="text-gray-200 text-[13px] leading-relaxed space-y-4">
                <p className="font-semibold text-[#c3a11d]">
                  Terima kasih atas kunjungan Anda dan rombongan ke Chocolatos X-Quest.
                </p>
                <p className="italic opacity-90">
                  Kami senang dapat bertemu dengan Anda dan rombongan, dan menantikan kesempatan untuk menyambut kedatangan kembali di lain waktu.
                </p>
              </div>
            </div>

            <Link
              to="/"
              className="w-full py-4 rounded-2xl font-bold text-white bg-white/10 border border-white/10 hover:bg-white/20 transition-all active:scale-95 uppercase tracking-widest text-xs"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}