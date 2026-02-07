import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AnimatedBackground, GlassCard, Logo, SCRIPT_URL } from "./components/SharedLayout";
import SafetyImage from "../src/assets/safety-induction.jpg"; // Pastikan path gambar benar

export default function Checkin() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const area = searchParams.get("area") || "Wahana";

  const [step, setStep] = useState(1); // Step 1: Form, Step 2: Persetujuan
  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    nama: "",
    tujuan: "",
    jumlah: "",
    jumlahKendaraan: 0,
    kendaraan: []
  });

  const isCafe = area === "Cafe";
  const judulHalaman = isCafe 
    ? "CHECK IN Chocolatos Café dan Merchandise Store" 
    : "CHECK IN Wahana Chocolatos X-Quest";

  const opsiTujuan = isCafe
    ? ["Chocolatos Cafe", "Merchandise Store"]
    : ["Kunjungan Wahana Chocolatos X-Quest", "Survey Lokasi"];

  const handleNext = (e) => {
    e.preventDefault();
    setStep(2);
    window.scrollTo(0, 0);
  };

  const handleJumlahKendaraan = (val) => {
    const jumlah = Math.min(10, Math.max(0, Number(val)));
    setForm((prev) => ({
      ...prev,
      jumlahKendaraan: jumlah,
      kendaraan: Array.from({ length: jumlah }, (_, i) => prev.kendaraan[i] || { jenis: "", plat: "" })
    }));
  };

  const handleKendaraanChange = (i, key, value) => {
    const arr = [...form.kendaraan];
    arr[i] = { ...arr[i], [key]: key === "plat" ? value.toUpperCase() : value };
    setForm({ ...form, kendaraan: arr });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const kendaraanString = form.kendaraan
      .map((k) => `${k.jenis || "?"} - ${k.plat || "?"}`)
      .join(" | ");

    const params = new URLSearchParams();
    params.append("nama", form.nama);
    params.append("tujuanKunjungan", form.tujuan);
    params.append("jumlah", form.jumlah);
    params.append("jumlahKendaraan", form.jumlahKendaraan);
    params.append("kendaraan", kendaraanString);
    params.append("type", judulHalaman);

    try {
      const res = await fetch(SCRIPT_URL, { method: "POST", body: params });
      const result = await res.json();

      if (result.status === "OK") {
        setTimeout(() => {
          navigate("/thanks", { state: { bookingCode: result.bookingCode, type: "checkin" } });
        }, 1500);
      } else {
        throw new Error(result.message || "Database Error");
      }
    } catch (err) {
      setLoading(false);
      setError("Gagal menghubungi server. Silakan coba lagi.");
    }
  };

  return (
    <div className="min-h-screen p-6 flex items-center justify-center relative overflow-x-hidden">
      <AnimatedBackground />

      {/* --- LOADING SCREEN --- */}
      {loading && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#3f372f]/95 backdrop-blur-md">
          <img src={Logo} className="w-32 mb-8 animate-bounce-slow" alt="Loading" />
          <p className="text-[#c3a11d] font-bold tracking-[0.2em] animate-pulse">GENERATING BOOKING CODE...</p>
        </div>
      )}

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <GlassCard>
          <div className="flex flex-col items-center mb-6 text-center">
            <img src={Logo} className="w-24 mb-4" alt="Logo" />
            <h2 className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-[#c3a11d] to-[#e2c14d]">
              {step === 1 ? judulHalaman : "SAFETY INDUCTION"}
            </h2>
            <div className="w-20 h-1 bg-[#c3a11d] rounded-full mt-2"></div>
          </div>

          {step === 1 ? (
            /* --- TAMPILAN DATA (STEP 1) --- */
            <form onSubmit={handleNext} className="flex flex-col gap-4">
              <input
                type="text" required placeholder="Nama Lengkap PIC"
                className="w-full px-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-[#c3a11d]/50"
                value={form.nama} onChange={(e) => setForm({...form, nama: e.target.value})}
              />

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-sm font-bold mb-3 text-[#c3a11d]">Tujuan Kunjungan</p>
                <div className="space-y-3">
                  {opsiTujuan.map((opt) => (
                    <label key={opt} className="flex items-center gap-3 cursor-pointer text-gray-300">
                      <input type="radio" name="tujuan" required className="accent-[#c3a11d]" onChange={() => setForm({...form, tujuan: opt})} />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              <input
                type="number" required placeholder="Jumlah Rombongan (Orang)"
                className="w-full px-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white"
                value={form.jumlah} onChange={(e) => setForm({...form, jumlah: e.target.value})}
              />

              <input
                type="number" placeholder="Jumlah kendaraan"
                className="w-full px-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white"
                value={form.jumlahKendaraan || ""} onChange={(e) => handleJumlahKendaraan(e.target.value)}
              />

              {form.kendaraan.map((k, i) => (
                <div key={i} className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <select required className="bg-[#2d2822] text-white p-2 rounded-xl" value={k.jenis} onChange={(e) => handleKendaraanChange(i, "jenis", e.target.value)}>
                    <option value="">Jenis</option>
                    {["Bus", "Mobil", "Motor", "Lainnya"].map(j => <option key={j} value={j}>{j}</option>)}
                  </select>
                  <input required placeholder="Plat Nomor" className="bg-white/5 text-white p-2 rounded-xl uppercase" value={k.plat} onChange={(e) => handleKendaraanChange(i, "plat", e.target.value)} />
                </div>
              ))}

              <button type="submit" className="w-full mt-4 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-[#c3a11d] to-[#e2c14d]">
                SELANJUTNYA
              </button>
            </form>
          ) : (
            /* --- TAMPILAN PERSETUJUAN (STEP 2) --- */
            <div className="flex flex-col gap-4 animate-slide-in">
              <div className="rounded-2xl overflow-hidden border border-[#c3a11d]/30 shadow-lg bg-black/20">
                <img src={SafetyImage} alt="Safety Induction" className="w-full h-auto object-cover" />
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 max-h-60 overflow-y-auto custom-scrollbar">
                <div className="text-[12px] leading-relaxed text-gray-300 space-y-3">
                  <p>
                    Dengan ini saya selaku <span className="text-[#c3a11d] font-semibold">PIC/Penanggung Jawab Rombongan</span> menyatakan bahwa saya dan seluruh anggota rombongan telah membaca, memahami, serta memberikan pengarahan keselamatan (safety induction) kunjungan Chocolatos X-Quest sebagaimana informasi di atas.
                  </p>
                  <p>
                    Saya dan seluruh rombongan menyatakan tidak membawa barang terlarang ke dalam wahana, termasuk namun tidak terbatas pada korek api, senjata tajam, serta makanan dan/atau minuman yang dibatasi, serta berada dalam kondisi kesehatan yang layak tanpa penyakit berisiko.
                  </p>
                  <p>
                    Apabila saya atau anggota rombongan melanggar ketentuan tersebut, maka kami bersedia menerima konsekuensi yang berlaku.
                  </p>
                </div>
              </div>

              <label className="flex gap-4 items-center cursor-pointer p-4 rounded-2xl bg-[#c3a11d]/10 border border-[#c3a11d]/30">
                <input 
                  type="checkbox" required checked={agree} 
                  onChange={() => setAgree(!agree)} 
                  className="w-6 h-6 accent-[#c3a11d]" 
                />
                <span className="text-sm text-white font-medium">Saya Setuju & Patuh pada Aturan</span>
              </label>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 py-4 rounded-2xl font-bold text-gray-400 bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                  KEMBALI
                </button>
                <button 
                  onClick={handleSubmit} disabled={!agree || loading}
                  className="flex-[2] py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-[#c3a11d] to-[#e2c14d] disabled:opacity-50"
                >
                  SUBMIT CHECK IN
                </button>
              </div>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}