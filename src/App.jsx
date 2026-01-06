import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation
} from "react-router-dom";
import { useState, useEffect } from "react";
import Logo from "./assets/logo.png";

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyrBcC73znrYvYxuw8mGpMhu6b3h7327UBDVzHehhez8lYYD7EbRYgKg-4BetBP2CBY/exec";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/checkin" element={<Form type="checkin" />} />
        <Route path="/checkout" element={<Form type="checkout" />} />
        <Route path="/thanks" element={<Thanks />} />
      </Routes>
    </Router>
  );
}

/* ================= ANIMATED BACKGROUND ================= */

function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0b1220] via-[#192232] to-[#0f1724]"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#f7c201]/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#ffd54a]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
    </div>
  );
}

/* ================= GLASS CARD ================= */

function GlassCard({ children, className = "" }) {
  return (
    <div className={`relative bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-3xl p-8 ring-1 ring-white/10 transition-all duration-300 hover:shadow-[0_20px_60px_rgba(247,194,1,0.15)] hover:border-[#f7c201]/30 ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-[#f7c201]/5 to-transparent rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

/* ================= HOME ================= */

function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <AnimatedBackground />
      <div className="w-full max-w-lg relative z-10 animate-fade-in">
        <GlassCard className="transform hover:scale-[1.02] transition-transform duration-300">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-[#f7c201]/20 blur-2xl rounded-full animate-pulse"></div>
              <img src={Logo} className="w-40 mx-auto mb-2 relative z-10 drop-shadow-2xl animate-float" />
            </div>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#f7c201] via-[#ffd54a] to-[#f7c201] animate-gradient">
              Chocolatos X-Quest
            </h1>
            <p className="text-sm text-gray-300 text-center leading-relaxed max-w-sm">
              Registrasi kunjungan dan pengelolaan check-in / check-out
            </p>

            <div className="w-full mt-8">
              <Link
                to="/checkin"
                className="group relative block text-center py-4 rounded-2xl font-bold text-[#192232] overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-[0_10px_30px_rgba(247,194,1,0.4)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#f7c201] via-[#ffd54a] to-[#f7c201] bg-[length:200%_100%] animate-gradient-x"></div>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  CHECK IN
                </span>
              </Link>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

/* ================= FORM ================= */

function Form({ type }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    bookingCode: "",
    jumlah: "",
    jumlahKendaraan: 0,
    kendaraan: []
  });

  const jenisKendaraanList = [
    "Bus",
    "Mobil",
    "Motor",
    "Elf / Hiace",
    "Lainnya"
  ];

  const handleJumlahKendaraan = (val) => {
    const jumlah = Math.min(10, Math.max(0, Number(val)));
    setForm((prev) => ({
      ...prev,
      jumlahKendaraan: jumlah,
      kendaraan: Array.from(
        { length: jumlah },
        (_, i) => prev.kendaraan[i] || { jenis: "", plat: "" }
      )
    }));
  };

  const handleKendaraanChange = (i, key, value) => {
    const arr = [...form.kendaraan];
    arr[i] = { ...arr[i], [key]: key === "plat" ? value.toUpperCase() : value };
    setForm({ ...form, kendaraan: arr });
  };

  const isFormValid =
    type === "checkout"
      ? form.bookingCode && agree
      : form.bookingCode && form.jumlah && agree;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const kendaraanString =
      type === "checkin"
        ? form.kendaraan
            .map((k) => `${k.jenis || "?"} - ${k.plat || "?"}`)
            .join(" | ")
        : "";

    const params = new URLSearchParams();
    params.append("bookingCode", form.bookingCode);
    params.append("jumlah", type === "checkin" ? form.jumlah : "");
    params.append(
      "jumlahKendaraan",
      type === "checkin" ? form.jumlahKendaraan : ""
    );
    params.append("kendaraan", kendaraanString);
    params.append("type", type);

    try {
      const res = await fetch(SCRIPT_URL, {
        method: "POST",
        body: params
      });

      const text = await res.text();

      if (text === "OK") {
        navigate("/thanks", {
          state: { bookingCode: form.bookingCode, type }
        });
      } else {
        const messages = {
          ALREADY_CHECKIN: "Booking sudah check-in",
          ALREADY_CHECKOUT: "Booking sudah check-out",
          NOT_CHECKED_IN: "Belum check-in"
        };
        setError(messages[text] || "Terjadi kesalahan");
      }
    } catch {
      setError("Gagal menghubungi server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 flex items-center justify-center relative">
      <AnimatedBackground />
      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <GlassCard className="transform hover:scale-[1.01] transition-transform duration-300">
          <div className="flex flex-col items-center mb-6">
            <img src={Logo} className="w-28 mx-auto mb-4 drop-shadow-lg" />
            <h2 className="text-center font-bold text-2xl mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#f7c201] to-[#ffd54a]">
              {type === "checkin" ? "CHECK IN" : "CHECK OUT"}
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-[#f7c201] to-[#ffd54a] rounded-full"></div>
          </div>

          {error && (
            <div className="mb-4 p-4 rounded-2xl bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-red-300">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Kode Booking"
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f7c201]/50 focus:border-[#f7c201]/50 transition-all duration-300 backdrop-blur-sm"
                value={form.bookingCode}
                onChange={(e) =>
                  setForm({ ...form, bookingCode: e.target.value })
                }
              />
            </div>

            {type === "checkin" && (
              <>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <input
                    type="number"
                    placeholder="Jumlah Rombongan"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f7c201]/50 focus:border-[#f7c201]/50 transition-all duration-300 backdrop-blur-sm"
                    value={form.jumlah}
                    onChange={(e) =>
                      setForm({ ...form, jumlah: e.target.value })
                    }
                  />
                </div>

                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    placeholder="Jumlah Kendaraan (Max 10)"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f7c201]/50 focus:border-[#f7c201]/50 transition-all duration-300 backdrop-blur-sm"
                    value={form.jumlahKendaraan}
                    onChange={(e) => handleJumlahKendaraan(e.target.value)}
                  />
                </div>

                {form.kendaraan.map((k, i) => (
                  <div key={i} className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm animate-slide-in">
                    <select
                      className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#f7c201]/50 focus:border-[#f7c201]/50 transition-all duration-300 backdrop-blur-sm"
                      value={k.jenis}
                      onChange={(e) =>
                        handleKendaraanChange(i, "jenis", e.target.value)
                      }
                    >
                      <option value="" className="bg-[#192232]">Jenis</option>
                      {jenisKendaraanList.map((j) => (
                        <option key={j} value={j} className="bg-[#192232]">
                          {j}
                        </option>
                      ))}
                    </select>

                    <input
                      placeholder={`Plat ${i + 1}`}
                      className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f7c201]/50 focus:border-[#f7c201]/50 transition-all duration-300 backdrop-blur-sm uppercase"
                      value={k.plat}
                      onChange={(e) =>
                        handleKendaraanChange(i, "plat", e.target.value)
                      }
                    />
                  </div>
                ))}

                {/* SAFETY CHECK-IN */}
                <div className="mt-4 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      Dengan ini saya selaku PIC/Penanggung jawab rombongan menyatakan
                      bahwa seluruh rombongan telah membaca/diberikan pengarahan
                      keselamatan (safety induction) melalui handbook kunjungan
                      Chocolatos X-Quest, tidak membawa barang terlarang seperti korek
                      api, senjata tajam, atau makanan/minuman yang dibatasi, serta
                      berada dalam kondisi kesehatan yang layak tanpa penyakit
                      berisiko.
                    </p>
                  </div>
                </div>
              </>
            )}

            {type === "checkout" && (
              <div className="mt-4 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Dengan ini saya selaku PIC/Penanggung jawab rombongan menyatakan
                    bahwa seluruh rombongan telah menyelesaikan kunjungan dengan aman,
                    tidak membawa keluar barang yang tidak sesuai ketentuan PT
                    Garudafood Putra Putri Jaya Tbk, serta berada dalam kondisi
                    kesehatan yang tetap layak tanpa keluhan atau kondisi berisiko
                    lainnya selama kegiatan berlangsung.
                  </p>
                </div>
              </div>
            )}

            {/* CHECKBOX SETUJU */}
            <label className="flex gap-3 text-sm text-gray-300 items-start cursor-pointer group p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#f7c201]/30 transition-all duration-300 backdrop-blur-sm">
              <div className="relative flex-shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={() => setAgree(!agree)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded border-2 transition-all duration-300 flex items-center justify-center ${
                  agree 
                    ? 'bg-gradient-to-r from-[#f7c201] to-[#ffd54a] border-[#f7c201]' 
                    : 'border-gray-400 group-hover:border-[#f7c201]'
                }`}>
                  {agree && (
                    <svg className="w-3 h-3 text-[#192232] animate-check" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="flex-1">Saya menyetujui pernyataan di atas</span>
            </label>

            <button
              type="submit"
              disabled={!isFormValid || loading}
              className="group relative py-4 rounded-2xl font-bold text-[#192232] overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-[0_10px_30px_rgba(247,194,1,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <div className={`absolute inset-0 bg-gradient-to-r from-[#f7c201] via-[#ffd54a] to-[#f7c201] bg-[length:200%_100%] transition-all duration-300 ${!loading ? 'animate-gradient-x' : ''}`}></div>
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    MENGIRIM...
                  </>
                ) : (
                  <>
                    SUBMIT
                    <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </span>
            </button>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}

/* ================= THANKS ================= */

function Thanks() {
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

            <img src={Logo} className="w-32 mx-auto mb-4 drop-shadow-lg" />

            <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-[#f7c201] via-[#ffd54a] to-[#f7c201] text-3xl font-bold text-center mb-2 animate-gradient">
              TERIMA KASIH
            </h1>

            <div className="w-24 h-1 bg-gradient-to-r from-[#f7c201] to-[#ffd54a] rounded-full mb-6"></div>

            {/* PESAN UTAMA */}
            <p className="text-center text-gray-300 mb-4 leading-relaxed">
              {isCheckin ? (
                <>
                  Anda berhasil <span className="font-bold text-[#f7c201]">Check-In</span> dengan kode booking:
                </>
              ) : (
                <>
                  Anda berhasil <span className="font-bold text-[#f7c201]">Check-Out</span> dengan kode booking:
                </>
              )}
            </p>

            {/* KODE BOOKING */}
            <div className="w-full mb-6">
              <div className="relative group">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#f7c201]/20 to-[#ffd54a]/20 border-2 border-[#f7c201]/30 backdrop-blur-sm">
                  <p className="text-center font-bold text-[#f7c201] text-2xl tracking-wider">
                    {bookingCode}
                  </p>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="absolute top-2 right-2 p-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-300 group-hover:scale-110"
                  title="Salin kode"
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
            </div>

            {/* PESAN KEAMANAN */}
            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm mb-6">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p className="text-center text-gray-300 text-sm leading-relaxed">
                  {isCheckin ? (
                    <>
                      Silakan tangkap layar (capture) pesan ini dan tunjukkan kepada
                      security di pos satpam PT Garudafood Putra Putri Jaya, Tbk
                      Sumedang, Factory, untuk menukar KTP/SIM Anda dengan identitas
                      pengunjung.
                    </>
                  ) : (
                    <>
                      Silakan tangkap layar (capture) pesan ini dan tunjukkan kepada
                      security di pos satpam PT Garudafood Putra Putri Jaya, Tbk
                      Sumedang Factory, untuk menukar identitas pengunjung dengan
                      KTP/SIM Anda.
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* TOMBOL */}
            <div className="mt-4 w-full">
              {isCheckin && (
                <Link
                  to="/checkout"
                  className="group relative block text-center py-4 rounded-2xl font-bold text-[#192232] overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-[0_10px_30px_rgba(247,194,1,0.4)]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#f7c201] via-[#ffd54a] to-[#f7c201] bg-[length:200%_100%] animate-gradient-x"></div>
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    CHECK OUT
                    <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Link>
              )}

              {!isCheckin && (
                <Link
                  to="/"
                  className="group relative block text-center py-4 rounded-2xl font-bold text-[#192232] overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-[0_10px_30px_rgba(247,194,1,0.4)]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#f7c201] via-[#ffd54a] to-[#f7c201] bg-[length:200%_100%] animate-gradient-x"></div>
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    KEMBALI KE BERANDA
                  </span>
                </Link>
              )}
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

