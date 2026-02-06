import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatedBackground, GlassCard, Logo, SCRIPT_URL } from "./components/SharedLayout";

export default function Checkout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [bookingCode, setBookingCode] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const params = new URLSearchParams();
    params.append("bookingCode", bookingCode.trim());
    params.append("type", "checkout");

    try {
      const res = await fetch(SCRIPT_URL, { method: "POST", body: params });
      const result = await res.json();

      if (result.status === "OK") {
        setTimeout(() => {
          navigate("/thanks", { state: { bookingCode, type: "checkout" } });
        }, 1500);
      } else {
        const messages = { 
          NOT_CHECKED_IN: "Kode booking ini belum melakukan Check-in.", 
          ALREADY_CHECKOUT: "Kode booking ini sudah melakukan Check-out sebelumnya.",
          INVALID: "Kode booking tidak valid."
        };
        setError(messages[result.status] || "Terjadi kesalahan pada sistem.");
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      setError("Gagal menghubungi server. Pastikan koneksi internet stabil.");
    }
  };

  return (
    <div className="min-h-screen p-6 flex items-center justify-center relative">
      <AnimatedBackground />

      {/* --- SPLASH SCREEN LOADING (THEME MATCHED) --- */}
      {loading && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#3f372f]/95 backdrop-blur-md animate-fade-in">
          <div className="relative">
            <div className="absolute inset-0 bg-[#c3a11d] blur-3xl opacity-20 animate-pulse"></div>
            <img src={Logo} className="w-32 mb-8 animate-bounce-slow relative z-10" alt="Loading" />
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-[#c3a11d] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-3 h-3 bg-[#c3a11d] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-3 h-3 bg-[#c3a11d] rounded-full animate-bounce"></div>
            </div>
            <p className="text-[#c3a11d] font-bold tracking-[0.2em] text-sm animate-pulse uppercase">
              Processing Check Out...
            </p>
          </div>
        </div>
      )}

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <GlassCard className="transform hover:scale-[1.01] transition-transform duration-300">
          <div className="flex flex-col items-center mb-6 text-center">
            <img src={Logo} className="w-28 mx-auto mb-4 drop-shadow-lg" alt="Logo" />
            <h2 className="font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-[#c3a11d] to-[#e2c14d]">
              CHECK OUT
            </h2>
            <div className="w-20 h-1 bg-[#c3a11d] rounded-full mt-2"></div>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-200 text-sm flex items-start gap-3 animate-shake">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              required
              placeholder="Masukkan Kode Booking Anda"
              className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c3a11d]/50 transition-all duration-300 backdrop-blur-sm"
              value={bookingCode}
              onChange={(e) => setBookingCode(e.target.value.toUpperCase())}
            />

            <div className="mt-2 p-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-[12px] text-gray-400 leading-relaxed italic text-center">
                "Dengan ini saya selaku PIC rombongan menyatakan bahwa seluruh rombongan telah menyelesaikan kunjungan dengan aman dan tidak membawa barang milik perusahaan tanpa izin."
              </p>
            </div>

            <label className="flex gap-4 text-sm text-gray-300 items-start cursor-pointer group p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#c3a11d]/30 transition-all duration-300 mt-2">
              <input 
                type="checkbox" 
                required
                checked={agree} 
                onChange={() => setAgree(!agree)} 
                className="mt-1 w-5 h-5 accent-[#c3a11d] flex-shrink-0" 
              />
              <span className="text-xs">Saya menyatakan data di atas benar dan rombongan telah keluar area.</span>
            </label>

            <button
              type="submit"
              disabled={!bookingCode || !agree || loading}
              className="w-full mt-4 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-[#c3a11d] to-[#e2c14d] shadow-lg shadow-[#c3a11d]/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
            >
              SUBMIT CHECK OUT
            </button>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}