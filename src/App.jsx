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

/* ================= GLASS CARD ================= */

function GlassCard({ children }) {
  return (
    <div className="
      bg-[#1f2a44]/95 backdrop-blur-xl
      border border-[#2c3554]
      shadow-2xl rounded-2xl
      p-6
    ">
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
          <Link
            to="/checkin"
            className="
              bg-[#f7c201] text-[#192232]
              py-3 rounded-xl text-center
              font-bold tracking-wide
              hover:brightness-95 transition
            "
          >
            CHECK IN
          </Link>

          <Link
            to="/checkout"
            className="
              bg-transparent text-[#f7c201]
              border-2 border-[#f7c201]
              py-3 rounded-xl text-center
              font-bold tracking-wide
              hover:bg-[#f7c201]
              hover:text-[#192232]
              transition
            "
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
    <div className="min-h-screen bg-[#192232] p-6 flex items-center justify-center">
      <div className="w-full max-w-md">
        <GlassCard>
          <img src={Logo} className="w-24 mx-auto mb-4" />

          <h2 className="text-center font-bold text-xl mb-4 text-[#f7c201]">
            {type === "checkin" ? "CHECK IN" : "CHECK OUT"}
          </h2>

          {error && (
            <div className="bg-red-500/20 text-red-300 p-2 rounded mb-3 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">

            {[
              { label: "Nama PIC", key: "pic" },
              { label: "Kode Booking", key: "bookingCode" },
              { label: "Instansi", key: "instansi" }
            ].map(({ label, key }) => (
              <input
                key={key}
                className="
                  p-3 rounded-xl
                  bg-[#192232] border border-[#2c3554]
                  text-white placeholder-gray-400
                  focus:outline-none
                  focus:ring-2 focus:ring-[#f7c201]
                "
                placeholder={label}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
              />
            ))}

            <input
              type="number"
              className="
                p-3 rounded-xl
                bg-[#192232] border border-[#2c3554]
                text-white placeholder-gray-400
                focus:ring-2 focus:ring-[#f7c201]
              "
              placeholder="Jumlah Rombongan"
              onChange={e => setForm({ ...form, jumlah: e.target.value })}
            />

            <div>
              <p className="font-semibold mb-1 text-white">
                Area Dikunjungi
              </p>

              {fasilitasList.map(item => (
                <label key={item} className="flex gap-2 text-sm text-gray-300">
                  <input
                    type="checkbox"
                    className="accent-[#f7c201]"
                    onChange={() => handleCheck(item)}
                  />
                  {item}
                </label>
              ))}
            </div>

            <label className="flex gap-2 text-sm text-gray-300 items-start mt-2">
              <input
                type="checkbox"
                className="mt-1 accent-[#f7c201]"
                onChange={() => setAgree(!agree)}
              />
              <span>Saya menyetujui keterangan di atas</span>
            </label>

            <button
              disabled={!isFormValid}
              className={`
                mt-2 p-3 rounded-xl font-bold tracking-wide transition
                ${
                  isFormValid
                    ? "bg-[#f7c201] text-[#192232] hover:brightness-95"
                    : "bg-gray-600 text-gray-400"
                }
              `}
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
