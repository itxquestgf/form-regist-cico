import { Link } from "react-router-dom";
import { AnimatedBackground, GlassCard, Logo } from "./components/SharedLayout";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <AnimatedBackground />
      <div className="w-full max-w-lg relative z-10 animate-fade-in">
        <GlassCard className="transform hover:scale-[1.02] transition-transform duration-500">
          <div className="flex flex-col items-center gap-4">
            {/* LOGO SECTION WITH NEW GOLD GLOW */}
            <div className="relative">
              <div className="absolute inset-0 bg-[#c3a11d]/30 blur-3xl rounded-full animate-pulse"></div>
              <img 
                src={Logo} 
                className="w-44 mx-auto mb-2 relative z-10 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] animate-float" 
                alt="Logo Chocolatos" 
              />
            </div>
            
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#c3a11d] via-[#e2c14d] to-[#c3a11d] text-center tracking-tight">
              Chocolatos X-Quest
            </h1>
            
            <p className="text-sm text-gray-300 text-center leading-relaxed max-w-xs opacity-90">
              Silakan melakukan registrasi check-in kunjungan Anda sesuai dengan area yang dituju.
            </p>

            <div className="w-full mt-8 flex flex-col gap-5">
              {/* TOMBOL WAHANA - FULL GOLD BRONZE */}
              <Link
                to="/checkin?area=Wahana"
                className="group relative block text-center py-4 px-6 rounded-2xl font-bold text-white overflow-hidden transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#c3a11d]/20"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#c3a11d] via-[#d4b53c] to-[#c3a11d] bg-[length:200%_100%] animate-gradient-x"></div>
                <span className="relative z-10 tracking-wide">CHECK IN Wahana Chocolatos X-Quest</span>
              </Link>

              {/* TOMBOL CAFE - OUTLINE GOLD BRONZE */}
              <Link
                to="/checkin?area=Cafe"
                className="group relative block text-center py-4 px-6 rounded-2xl font-bold text-[#c3a11d] border-2 border-[#c3a11d] overflow-hidden transition-all duration-300 transform hover:scale-105"
              >
                <div className="absolute inset-0 bg-[#c3a11d]/5 group-hover:bg-[#c3a11d]/10 transition-colors"></div>
                <span className="relative z-10 tracking-wide">CHECK IN Café & Merchandise</span>
              </Link>

              {/* TOMBOL CHECKOUT - OPTIONAL (Jika ingin diletakkan di home juga) */}
              <Link
                to="/checkout"
                className="text-center text-gray-400 hover:text-[#c3a11d] text-xs font-medium transition-colors mt-2 tracking-[0.2em] uppercase"
              >
                Sudah selesai? Klik di sini untuk Check Out
              </Link>
            </div>
          </div>
        </GlassCard>
      </div>
      
      {/* FOOTER DECORATION */}
      <p className="absolute bottom-6 text-[10px] text-gray-500 tracking-widest uppercase z-10">
        Premium Visitor Management System
      </p>
    </div>
  );
}