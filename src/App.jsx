import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Logo from "./assets/logo.png";

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxqEDH1ME9f9nNi5XzHgtBKRc9_qGY9wLfTAk8vast-rhzJwQWp9RDLRIRbTNztn_s/exec";

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

function GlassCard({ children }) {
  return (
    <div className="
      bg-white/80 backdrop-blur-md
      border border-white/30
      shadow-xl rounded-2xl
      p-6
    ">
      {children}
    </div>
  );
}

function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#4b3524] p-6">
      <GlassCard>
        <img src={Logo} className="w-32 mx-auto mb-6" />
        <div className="flex flex-col gap-4">
          <Link
            to="/checkin"
            className="bg-[#6A4E3A] text-white py-3 rounded-xl text-center font-semibold"
          >
            Check In
          </Link>
          <Link
            to="/checkout"
            className="bg-[#A27B5C] text-white py-3 rounded-xl text-center font-semibold"
          >
            Check Out
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}

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
    fasilitas: []
  });

  const fasilitasList = [
    "Chocolatos X-Quest",
    "Chocolatos Cafe",
    "Merchandise Store"
  ];

  const handleCheck = (item) => {
    setForm(prev => ({
      ...prev,
      fasilitas: prev.fasilitas.includes(item)
        ? prev.fasilitas.filter(i => i !== item)
        : [...prev.fasilitas, item]
    }));
  };

  const isFormValid =
    form.pic &&
    form.bookingCode &&
    form.jumlah &&
    form.instansi &&
    form.fasilitas.length > 0 &&
    agree;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(SCRIPT_URL, {
        method: "POST",
        body: new URLSearchParams({
          ...form,
          type
        })
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
    <div className="min-h-screen bg-[#4b3524] p-6 flex items-center justify-center">
      <div className="w-full max-w-md">
        <GlassCard>
          <img src={Logo} className="w-28 mx-auto mb-4" />
          <h2 className="text-center font-bold text-xl mb-4 text-[#4b3524]">
            Form {type === "checkin" ? "Check In" : "Check Out"}
          </h2>

          {error && (
            <div className="bg-red-100 text-red-700 p-2 rounded mb-3 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              className="p-3 border rounded-xl"
              placeholder="Nama PIC"
              onChange={e => setForm({ ...form, pic: e.target.value })}
            />

            <input
              className="p-3 border rounded-xl"
              placeholder="Kode Booking"
              onChange={e => setForm({ ...form, bookingCode: e.target.value })}
            />

            <input
              type="number"
              className="p-3 border rounded-xl"
              placeholder="Jumlah Rombongan"
              onChange={e => setForm({ ...form, jumlah: e.target.value })}
            />

            <input
              className="p-3 border rounded-xl"
              placeholder="Instansi"
              onChange={e => setForm({ ...form, instansi: e.target.value })}
            />

            <div>
              <p className="font-semibold mb-1">Area Dikunjungi</p>
              {fasilitasList.map(item => (
                <label key={item} className="flex gap-2 text-sm">
                  <input type="checkbox" onChange={() => handleCheck(item)} />
                  {item}
                </label>
              ))}
            </div>

            <p className="text-sm text-gray-700 mt-3 leading-relaxed">
              Dengan ini saya selaku PIC/Penanggung jawab rombongan menyatakan bahwa
              seluruh rombongan telah membaca/diberikan pengarahan keselamatan
              (safety induction) melalui handbook kunjungan Chocolatos X-Quest,
              tidak membawa barang terlarang seperti korek api, senjata tajam, atau
              makanan/minuman yang dibatasi, serta berada dalam kondisi kesehatan
              yang layak tanpa penyakit berisiko.
            </p>

            <label className="flex gap-2 text-sm items-start">
              <input
                type="checkbox"
                className="mt-1 accent-[#6A4E3A]"
                onChange={() => setAgree(!agree)}
              />
              <span>Saya menyetujui keterangan di atas</span>
            </label>

            <button
              disabled={!isFormValid}
              className={`p-3 rounded-xl text-white font-semibold ${
                isFormValid ? "bg-[#6A4E3A]" : "bg-gray-400"
              }`}
            >
              {loading ? "Mengirim..." : "Submit"}
            </button>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}

function Thanks() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#4b3524]">
      <GlassCard>
        <img src={Logo} className="w-40 mx-auto mb-4" />
        <h1 className="text-[#4b3524] text-2xl font-bold text-center">
          Terima Kasih Atas Kunjungannya
        </h1>
      </GlassCard>
    </div>
  );
}
