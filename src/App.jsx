import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation
} from "react-router-dom";
import { useState } from "react";
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

/* ================= GLASS CARD ================= */

function GlassCard({ children }) {
  return (
    <div className="bg-linear-to-br from-[#0f1724]/60 via-[#162033]/40 to-[#192232]/60 backdrop-blur-xl border border-[#2c3554] shadow-2xl rounded-2xl p-6 ring-1 ring-[#223049]/50">
      {children}
    </div>
  );
}

/* ================= HOME ================= */

function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-[#0b1220] to-[#192232] p-6">
      <div className="w-full max-w-lg">
        <GlassCard>
          <div className="flex flex-col items-center gap-3">
            <img src={Logo} className="w-36 mx-auto mb-1" />
            <h1 className="text-2xl font-extrabold text-white">
              Chocolatos X-Quest
            </h1>
            <p className="text-sm text-gray-300">
              Registrasi kunjungan dan pengelolaan check-in / check-out
            </p>

            <div className="w-full mt-6">
              <Link
                to="/checkin"
                className="block text-center py-3 rounded-xl font-bold bg-linear-to-r from-[#f7c201] to-[#ffd54a] text-[#192232]"
              >
                CHECK IN
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
            <input
              type="text"
              placeholder="Kode Booking"
              className="p-3 rounded-xl bg-[#0f1724] border border-[#2c3554] text-white"
              value={form.bookingCode}
              onChange={(e) =>
                setForm({ ...form, bookingCode: e.target.value })
              }
            />

            {type === "checkin" && (
              <>
                <input
                  type="number"
                  placeholder="Jumlah Rombongan"
                  className="p-3 rounded-xl bg-[#0f1724] border border-[#2c3554] text-white"
                  value={form.jumlah}
                  onChange={(e) =>
                    setForm({ ...form, jumlah: e.target.value })
                  }
                />

                <input
                  type="number"
                  min="0"
                  max="10"
                  placeholder="Jumlah Kendaraan (Max 10)"
                  className="p-3 rounded-xl bg-[#0f1724] border border-[#2c3554] text-white"
                  value={form.jumlahKendaraan}
                  onChange={(e) => handleJumlahKendaraan(e.target.value)}
                />

                {form.kendaraan.map((k, i) => (
                  <div key={i} className="grid grid-cols-2 gap-2">
                    <select
                      className="p-3 rounded-xl bg-[#0f1724] border border-[#2c3554] text-white"
                      value={k.jenis}
                      onChange={(e) =>
                        handleKendaraanChange(i, "jenis", e.target.value)
                      }
                    >
                      <option value="">Jenis Kendaraan</option>
                      {jenisKendaraanList.map((j) => (
                        <option key={j} value={j}>
                          {j}
                        </option>
                      ))}
                    </select>

                    <input
                      placeholder={`Plat Nomor ${i + 1}`}
                      className="p-3 rounded-xl bg-[#0f1724] border border-[#2c3554] text-white"
                      value={k.plat}
                      onChange={(e) =>
                        handleKendaraanChange(i, "plat", e.target.value)
                      }
                    />
                  </div>
                ))}

                {/* SAFETY CHECK-IN */}
                <p className="text-sm text-gray-300 mt-3 leading-relaxed">
                  Dengan ini saya selaku PIC/Penanggung jawab rombongan menyatakan
                  bahwa seluruh rombongan telah membaca/diberikan pengarahan
                  keselamatan (safety induction) melalui handbook kunjungan
                  Chocolatos X-Quest, tidak membawa barang terlarang seperti korek
                  api, senjata tajam, atau makanan/minuman yang dibatasi, serta
                  berada dalam kondisi kesehatan yang layak tanpa penyakit
                  berisiko.
                </p>
              </>
            )}

            {type === "checkout" && (
              <p className="text-sm text-gray-300 mt-3 leading-relaxed">
                Dengan ini saya selaku PIC/Penanggung jawab rombongan menyatakan
                bahwa seluruh rombongan telah menyelesaikan kunjungan dengan aman,
                tidak membawa keluar barang yang tidak sesuai ketentuan PT
                Garudafood Putra Putri Jaya Tbk, serta berada dalam kondisi
                kesehatan yang tetap layak tanpa keluhan atau kondisi berisiko
                lainnya selama kegiatan berlangsung.
              </p>
            )}

            {/* CHECKBOX SETUJU */}
            <label className="flex gap-2 text-sm text-gray-300 items-start">
              <input
                type="checkbox"
                checked={agree}
                onChange={() => setAgree(!agree)}
              />
              <span>Saya menyetujui pernyataan di atas</span>
            </label>

            <button
              type="submit"
              disabled={!isFormValid || loading}
              className="p-3 rounded-xl font-bold bg-linear-to-r from-[#f7c201] to-[#ffd54a] text-[#192232]"
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
  const { state } = useLocation();
  const bookingCode = state?.bookingCode || "-";
  const type = state?.type || "checkin";

  const isCheckin = type === "checkin";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#192232] p-6">
      <div className="w-full max-w-md">
        <GlassCard>
          <img src={Logo} className="w-36 mx-auto mb-4" />

          <h1 className="text-[#f7c201] text-2xl font-bold text-center">
            TERIMA KASIH
          </h1>

          {/* PESAN UTAMA */}
          <p className="text-center text-gray-300 mt-4 leading-relaxed">
            {isCheckin ? (
              <>
                Anda berhasil <b>Check-In</b> dengan kode booking:
              </>
            ) : (
              <>
                Anda berhasil <b>Check-Out</b> dengan kode booking:
              </>
            )}
          </p>

          {/* KODE BOOKING */}
          <p className="text-center font-bold text-[#f7c201] text-lg mt-2">
            {bookingCode}
          </p>

          {/* PESAN KEAMANAN */}
          <p className="text-center text-gray-300 mt-4 text-sm leading-relaxed">
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

          {/* TOMBOL */}
          <div className="mt-6 text-center">
            {isCheckin && (
              <Link
                to="/checkout"
                className="px-4 py-2 rounded-lg bg-linear-to-r from-[#f7c201] to-[#ffd54a] text-[#192232] font-bold"
              >
                CHECK OUT
              </Link>
            )}

            {!isCheckin && (
              <Link
                to="/"
                className="px-4 py-2 rounded-lg bg-linear-to-r from-[#f7c201] to-[#ffd54a] text-[#192232] font-bold"
              >
                KEMBALI KE BERANDA
              </Link>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

