import LogoImg from "../assets/logo.png";

export const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwrM9UQdB6vgBmpqJi4NJ3S8g4orNGT38JGfxIcdVXsNHxxIfTMmBH6wXyY8aO2YdUawg/exec";
export const Logo = LogoImg;

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Background utama menggunakan warna Deep Brown baru */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#3f372f] via-[#2d2822] to-[#3f372f]"></div>
      
      {/* Efek cahaya Gold Bronze di beberapa titik */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#c3a11d]/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#c3a11d]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      {/* Titik cahaya tambahan untuk kedalaman visual */}
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#c3a11d]/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
    </div>
  );
}

export function GlassCard({ children, className = "" }) {
  return (
    <div className={`relative bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-3xl p-8 ring-1 ring-white/10 transition-all duration-300 hover:shadow-[0_20px_60px_rgba(195,161,29,0.2)] hover:border-[#c3a11d]/40 ${className}`}>
      {/* Overlay gradasi emas saat di-hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#c3a11d]/10 to-transparent rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}