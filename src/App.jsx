import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Logo from "./assets/logo.png";

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwdEdqgjowtoE-38ffowgc-O59RxJtGyyI3UxvIyR7IuNZTVc24akRPBMjKl3eBwADy/exec";

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

/* ================= GLASS CARD ================= */

function GlassCard({ children }) {
  return (
    <div className="bg-[#1f2a44]/95 backdrop-blur-xl border border-[#2c3554] shadow-2xl rounded-2xl p-6">
      {children}
    </div>
  );
}

/* ================= HOME ================= */

function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#192232] p-6">
      <GlassCard>
        <img src={Logo} className="w-32 mx-auto mb-6" />
        <div className="flex flex-col gap-4">
          <Link to="/checkin" className="bg-[#f7c201] text-[#192232] py-3 rounded-xl text-center font-bold">
            CHECK IN
          </Link>
          <Link
            to="/checkout"
            className="border-2 border-[#f7c201] text-[#f7c201] py-3 rounded-xl text-center font-bold hover:bg-[#f7c201] hover:text-[#192232]"
          >
            CHECK OUT
          </Link>
        </div>
      </GlassCard>
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
    pic: "",
    bookingCode: "",
    jumlah: "",
    instansi: "",
    fasilitas: [],
    jumlahKendaraan: 0,
    kendaraan: []
  });

  const fasilitasList = [
    "Chocolatos X-Quest",
    "Chocolatos Cafe",
    "Merchandise Store"
  ];

  const jenisKendaraanList = [
    "Bus",
    "Mobil",
    "Motor",
    "Elf / Hiace",
    "Lainnya"
  ];

  const handleCheck = (item) => {
    setForm(prev => ({
      ...prev,
      fasilitas: prev.fasilitas.includes(item)
        ? prev.fasilitas.filter(i => i !== item)
        : [...prev.fasilitas, item]
    }));
  };

  const handleJumlahKendaraan = (val) => {
    const jumlah = Math.min(10, Math.max(0, Number(val)));
    setForm(prev => ({
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
    form.pic &&
    form.bookingCode &&
    form.jumlah &&
    form.instansi &&
    form.fasilitas.length > 0 &&
    agree;

  /* ================= SUBMIT (FIXED) ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const kendaraanString = form.kendaraan
      .map(k => `${k.jenis || "?"} - ${k.plat || "?"}`)
      .join(" | ");

    const params = new URLSearchParams();
    params.append("pic", form.pic);
    params.append("bookingCode", form.bookingCode);
    params.append("jumlah", String(form.jumlah));
    params.append("instansi", form.instansi);
    params.append("fasilitas", form.fasilitas.join(", "));
    params.append("jumlahKendaraan", String(form.jumlahKendaraan));
    params.append("kendaraan", kendaraanString);
    params.append("type", type);

    try {
      const res = await fetch(SCRIPT_URL, {
        method: "POST",
        body: params
      });

      const text = await res.text();

      if (text !== "OK") {
        const messages = {
          BOOKING_NOT_FOUND: "Kode booking tidak terdaftar",
          ALREADY_CHECKIN: "Booking sudah check-in",
          ALREADY_CHECKOUT: "Booking sudah check-out",
          NOT_CHECKED_IN: "Belum check-in"
        };
        setError(messages[text] || "Terjadi kesalahan");
        setLoading(false);
        return;
      }

      navigate("/thanks");
    } catch {
      setError("Gagal menghubungi server");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#192232] p-6 flex items-center justify-center">
      <div className="w-full max-w-md">
        <GlassCard>
          <img src={Logo} className="w-24 mx-auto mb-4" />
          <h2 className="text-center font-bold text-xl mb-4 text-[#f7c201]">
            {type === "checkin" ? "CHECK IN" : "CHECK OUT"}
          </h2>

          {error && <div className="bg-red-500/20 text-red-300 p-2 rounded mb-3 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">

            {[
              ["Nama PIC", "pic"],
              ["Kode Booking", "bookingCode"],
              ["Instansi", "instansi"]
            ].map(([label, key]) => (
              <input
                key={key}
                placeholder={label}
                className="p-3 rounded-xl bg-[#192232] border border-[#2c3554] text-white"
                onChange={e => setForm({ ...form, [key]: e.target.value })}
              />
            ))}

            <input
              type="number"
              placeholder="Jumlah Rombongan"
              className="p-3 rounded-xl bg-[#192232] border border-[#2c3554] text-white"
              onChange={e => setForm({ ...form, jumlah: e.target.value })}
            />

            <input
              type="number"
              min="0"
              max="10"
              placeholder="Jumlah Kendaraan (Max 10)"
              className="p-3 rounded-xl bg-[#192232] border border-[#2c3554] text-white"
              onChange={e => handleJumlahKendaraan(e.target.value)}
            />

            {form.kendaraan.map((k, i) => (
              <div key={i} className="grid grid-cols-2 gap-2">
                <select
                  className="p-3 rounded-xl bg-[#192232] border border-[#2c3554] text-white"
                  onChange={e => handleKendaraanChange(i, "jenis", e.target.value)}
                >
                  <option value="">Jenis Kendaraan</option>
                  {jenisKendaraanList.map(j => (
                    <option key={j} value={j}>{j}</option>
                  ))}
                </select>

                <input
                  placeholder={`Plat Nomor ${i + 1}`}
                  className="p-3 rounded-xl bg-[#192232] border border-[#2c3554] text-white"
                  onChange={e => handleKendaraanChange(i, "plat", e.target.value)}
                />
              </div>
            ))}

            <div>
              <p className="font-semibold mb-1 text-white">Area Dikunjungi</p>
              {fasilitasList.map(item => (
                <label key={item} className="flex gap-2 text-sm text-gray-300">
                  <input type="checkbox" className="accent-[#f7c201]" onChange={() => handleCheck(item)} />
                  {item}
                </label>
              ))}
            </div>

            {/* 🔒 SAFETY STATEMENT (TIDAK DIHAPUS) */}
            <p className="text-sm text-gray-300 mt-3 leading-relaxed">
              Dengan ini saya selaku PIC/Penanggung jawab rombongan menyatakan bahwa
              seluruh rombongan telah membaca/diberikan pengarahan keselamatan
              (safety induction) melalui handbook kunjungan Chocolatos X-Quest,
              tidak membawa barang terlarang seperti korek api, senjata tajam, atau
              makanan/minuman yang dibatasi, serta berada dalam kondisi kesehatan
              yang layak tanpa penyakit berisiko.
            </p>

            <label className="flex gap-2 text-sm text-gray-300 items-start">
              <input type="checkbox" className="accent-[#f7c201]" onChange={() => setAgree(!agree)} />
              <span>Saya menyetujui keterangan di atas</span>
            </label>

            <button
              disabled={!isFormValid}
              className={`p-3 rounded-xl font-bold ${
                isFormValid ? "bg-[#f7c201] text-[#192232]" : "bg-gray-600 text-gray-400"
              }`}
            >
              {loading ? "MENGIRIM..." : "SUBMIT"}
            </button>

          </form>
        </GlassCard>
      </div>
    </div>
  );
}

/* ================= THANKS ================= */

function Thanks() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#192232]">
      <GlassCard>
        <img src={Logo} className="w-36 mx-auto mb-4" />
        <h1 className="text-[#f7c201] text-2xl font-bold text-center">
          TERIMA KASIH ATAS KUNJUNGANNYA
        </h1>
      </GlassCard>
    </div>
  );
}
