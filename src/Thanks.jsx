import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { AnimatedBackground, GlassCard, Logo } from "./components/SharedLayout";

export default function Thanks() {
    const { state } = useLocation();
    const bookingCode = state?.bookingCode || "-";
    const type = state?.type || "checkin";
    const [copied, setCopied] = useState(false);

    const isCheckin = type === "checkin";

    const copyToClipboard = () => {
        navigator.clipboard.writeText(bookingCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative">
            <AnimatedBackground />
            <div className="w-full max-w-md relative z-10 animate-fade-in">
                <GlassCard className="transform hover:scale-[1.01] transition-transform duration-300">
                    <div className="flex flex-col items-center">
                        <div className="relative mb-6">
                            <div className="absolute inset-0 bg-green-500/20 blur-2xl rounded-full animate-pulse"></div>
                            <div className="relative bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full p-6 border border-green-500/30">
                                <svg className="w-16 h-16 text-green-400 animate-bounce-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>

                        <img src={Logo} className="w-32 mx-auto mb-4 drop-shadow-lg" alt="Logo" />

                        <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-[#f7c201] via-[#ffd54a] to-[#f7c201] text-3xl font-bold text-center mb-2 animate-gradient">
                            TERIMA KASIH
                        </h1>

                        <div className="w-24 h-1 bg-gradient-to-r from-[#f7c201] to-[#ffd54a] rounded-full mb-6"></div>

                        <p className="text-center text-gray-300 mb-4 leading-relaxed">
                            Anda berhasil <span className="font-bold text-[#f7c201]">{isCheckin ? "Check-In" : "Check-Out"}</span> dengan kode booking:
                        </p>

                        <div className="w-full mb-6 relative group">
                            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#f7c201]/20 to-[#ffd54a]/20 border-2 border-[#f7c201]/30 backdrop-blur-sm">
                                <p className="text-center font-bold text-[#f7c201] text-2xl tracking-wider">
                                    {bookingCode}
                                </p>
                            </div>
                            <button
                                onClick={copyToClipboard}
                                className="absolute top-2 right-2 p-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-300"
                            >
                                {copied ? (
                                    <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                            <p className="text-gray-300 text-sm leading-relaxed">
                                Silakan capture/Screen Shoot/Tangkap layar kode booking ini dan tunjukkan pada security saat memasuki kawasan Pabrik Garudafood Sumedang
                            </p>
                        </div>

                        <Link
                            to={isCheckin ? "/checkout" : "/"}
                            className="w-full group relative block text-center py-4 rounded-2xl font-bold text-[#192232] overflow-hidden transition-all duration-300 transform hover:scale-105"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-[#f7c201] via-[#ffd54a] to-[#f7c201] animate-gradient-x"></div>
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {isCheckin ? "LANJUT CHECK OUT" : "KEMBALI KE BERANDA"}
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </span>
                        </Link>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}