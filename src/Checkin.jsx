import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AnimatedBackground, GlassCard, Logo, SCRIPT_URL } from "./components/SharedLayout";

export default function Checkin() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const area = searchParams.get("area") || "Wahana";

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

  const isFormValid = form.nama && form.tujuan && form.jumlah && agree;

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
      
      if (!res.ok) throw new Error("Network response was not ok");
      
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
      setError("Gagal menghubungi server. Pastikan koneksi internet stabil.");
    }
  };

  return (
    <div className="min-h-screen p-6 flex items-center justify-center relative overflow-x-hidden">
      <AnimatedBackground />

      {/* --- SPLASH SCREEN LOADING (NEW COLORS) --- */}
      {loading && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#3f372f]/95 backdrop-blur-md animate-fade-in">
          <div className="relative">
            <div className="absolute inset-0 bg-[#c3a11d] blur-3xl opacity-20 animate-pulse"></div>
            <img src={Logo} className="w-32 mb-8 animate-bounce-slow relative z-10" alt="Loading" />
          </div>
          <div className="flex flex-col items-center gap-3 px-6 text-center">
            <div className="flex gap-2 mb-2">
              <div className="w-3 h-3 bg-[#c3a11d] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-3 h-3 bg-[#c3a11d] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-3 h-3 bg-[#c3a11d] rounded-full animate-bounce"></div>
            </div>
            <p className="text-[#c3a11d] font-bold tracking-[0.2em] text-sm animate-pulse uppercase">
              Generating Booking Code...
            </p>
            <p className="text-gray-400 text-xs italic">Menyimpan data kunjungan ke database Chocolatos</p>
          </div>
        </div>
      )}

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <GlassCard>
          <div className="flex flex-col items-center mb-6 text-center">
            <img src={Logo} className="w-24 mb-4 drop-shadow-lg" alt="Logo" />
            <h2 className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-[#c3a11d] to-[#e2c14d]">
              {judulHalaman}
            </h2>
            <div className="w-20 h-1 bg-[#c3a11d] rounded-full mt-2"></div>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-200 text-sm flex items-start gap-3">
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
              placeholder="Nama Lengkap PIC"
              className="w-full px-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c3a11d]/50 transition-all duration-300"
              value={form.nama}
              onChange={(e) => setForm({...form, nama: e.target.value})}
            />

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white">
              <p className="text-sm font-bold mb-3 text-[#c3a11d]">Tujuan Kunjungan</p>
              <div className="space-y-3">
                {opsiTujuan.map((opt) => (
                  <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="tujuan"
                      required
                      className="w-4 h-4 accent-[#c3a11d]"
                      onChange={() => setForm({...form, tujuan: opt})} 
                    />
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            <input
              type="number"
              required
              placeholder="Jumlah Rombongan (Orang)"
              className="w-full px-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c3a11d]/50"
              value={form.jumlah}
              onChange={(e) => setForm({...form, jumlah: e.target.value})}
            />

            <input
              type="number"
              placeholder="Jumlah kendaraan (angka)"
              className="w-full px-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c3a11d]/50"
              value={form.jumlahKendaraan || ""}
              onChange={(e) => handleJumlahKendaraan(e.target.value)}
            />

            {form.kendaraan.map((k, i) => (
              <div key={i} className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 animate-slide-in">
                <select
                  required
                  className="px-4 py-3 rounded-xl bg-[#2d2822] border border-white/10 text-white focus:outline-none"
                  value={k.jenis}
                  onChange={(e) => handleKendaraanChange(i, "jenis", e.target.value)}
                >
                  <option value="">Jenis</option>
                  {["Bus", "Mobil", "Motor", "Elf / Hiace", "Lainnya"].map((j) => (
                    <option key={j} value={j}>{j}</option>
                  ))}
                </select>
                <input
                  required
                  placeholder={`Plat Nomor`}
                  className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white uppercase placeholder-gray-500 focus:outline-none"
                  value={k.plat}
                  onChange={(e) => handleKendaraanChange(i, "plat", e.target.value)}
                />
              </div>
            ))}

            <div className="mt-4">
              <label className="flex gap-4 text-sm text-gray-300 items-start cursor-pointer group p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#c3a11d]/30 transition-all duration-300">
                <input
                  type="checkbox"
                  required
                  checked={agree}
                  onChange={() => setAgree(!agree)}
                  className="mt-1 w-5 h-5 accent-[#c3a11d] flex-shrink-0"
                />
                <div className="text-[12px] leading-relaxed text-gray-300">
                  <p className="mb-2">
                    Dengan ini saya selaku <span className="text-[#c3a11d] font-semibold">PIC/Penanggung Jawab Rombongan</span> menyatakan bahwa saya dan seluruh anggota rombongan telah membaca, memahami, serta memberikan pengarahan keselamatan (safety induction) kunjungan Chocolatos X-Quest sebagaimana informasi di atas.
                  </p>
                  <p className="mb-2">
                    Saya dan seluruh rombongan menyatakan tidak membawa barang terlarang ke dalam wahana, termasuk namun tidak terbatas pada korek api, senjata tajam, serta makanan dan/atau minuman yang dibatasi, serta berada dalam kondisi kesehatan yang layak tanpa penyakit berisiko.
                  </p>
                  <p>
                    Apabila saya atau anggota rombongan melanggar ketentuan tersebut, maka kami bersedia menerima konsekuensi yang berlaku.
                  </p>
                </div>
              </label>
            </div>

            <button
              type="submit"
              disabled={!isFormValid || loading}
              className="w-full mt-2 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-[#c3a11d] to-[#e2c14d] hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 shadow-lg shadow-[#c3a11d]/20"
            >
              SUBMIT CHECK IN
            </button>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}