import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Logo from "./assets/logo.png"


const brown = "bg-[#6A4E3A]";
const brownLight = "bg-[#A27B5C]";
const brownText = "text-[#4B3A2F]";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/checkin" element={<Checkin />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "#6A4E3A" }}>
      <div className="max-w-80 w-full bg-white p-6 rounded-2xl shadow flex flex-col items-center gap-6">
        
        <img src={Logo} alt="Logo" className="mx-auto w-32 mb-2" />

        <Link
          to="/checkin"
          className="w-26 text-center py-4 rounded-xl text-white font-semibold shadow"
          style={{ background: "#6A4E3A" }}
        >
          Check In
        </Link>

        <Link
          to="/checkout"
          className="w-26 text-center py-4 rounded-xl text-white font-semibold shadow"
          style={{ background: "#A27B5C" }}
        >
          Check Out
        </Link>

      </div>
    </div>
  );
}

function Checkin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    pic: "",
    phone: "",
    jumlah: "",
    instansi: "",
    fasilitas: []
  });

  const [agree, setAgree] = useState(false); // checkbox persetujuan
  const [loading, setLoading] = useState(false);

  const fasilitasList = [
    "Chocolatos X-Quest",
    "Chocolatos Cafe",
    "Merchandise Store"
  ];

  const handleCheck = (item) => {
    setForm((prev) => {
      const exists = prev.fasilitas.includes(item);
      return {
        ...prev,
        fasilitas: exists
          ? prev.fasilitas.filter((i) => i !== item)
          : [...prev.fasilitas, item]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    await fetch(
      "https://script.google.com/macros/s/AKfycbwl7QJnvIJmTxmzYJzgzHJ9vBJFQ1sqru-ZOJtN3XpMqhNFoHme3lkfacYuSK2M7GFLRw/exec",
      {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }
    );

    setLoading(false);
    alert("Data terkirim. Terima kasih!");
    navigate("/");
  };

  const isFormValid =
    form.pic &&
    form.phone &&
    form.jumlah &&
    form.instansi &&
    form.fasilitas.length > 0 &&
    agree;

  return (
    <div className="min-h-screen p-6" style={{ background: "#6A4E3A" }}>
      <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow">
        <img src={Logo} alt="Logo" className="mx-auto w-32 mb-4" />

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nama PIC/Koordinator Rombongan"
            className="p-3 border rounded-xl"
            value={form.pic}
            onChange={(e) => setForm({ ...form, pic: e.target.value })}
            required
          />

          <input
            type="text"
            placeholder="Nomor HP Aktif"
            className="p-3 border rounded-xl"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
          />

          <input
            type="number"
            placeholder="Jumlah Rombongan"
            className="p-3 border rounded-xl"
            value={form.jumlah}
            onChange={(e) => setForm({ ...form, jumlah: e.target.value })}
            required
          />

          <input
            type="text"
            placeholder="Instansi Asal"
            className="p-3 border rounded-xl"
            value={form.instansi}
            onChange={(e) => setForm({ ...form, instansi: e.target.value })}
            required
          />

          <div className="mt-2">
            <p className="font-semibold mb-2">Area yang Akan Dikunjungi:</p>

            {fasilitasList.map((item) => (
              <label key={item} className="flex items-center gap-2 mb-1">
                <input
                  type="checkbox"
                  checked={form.fasilitas.includes(item)}
                  onChange={() => handleCheck(item)}
                  className="accent-[#6A4E3A]"
                />
                {item}
              </label>
            ))}
          </div>

          <p className="text-sm text-gray-700 mt-4">
            Dengan ini saya selaku PIC/Penanggung jawab rombongan menyatakan bahwa
            seluruh rombongan telah membaca/diberikan pengarahan keselamatan
            (safety induction) melalui handbook kunjungan Chocolatos X-Quest,
            tidak membawa barang terlarang seperti korek api, senjata tajam, atau
            makanan/minuman yang dibatasi, serta berada dalam kondisi kesehatan
            yang layak tanpa penyakit berisiko.
          </p>

          {/* Persetujuan */}
          <label className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              checked={agree}
              onChange={() => setAgree(!agree)}
              className="accent-[#6A4E3A]"
            />
            <span className="text-sm">Saya menyetujui keterangan di atas</span>
          </label>

          <button
            type="submit"
            disabled={!isFormValid}
            className={`mt-4 p-3 text-white rounded-xl shadow ${
              isFormValid ? "bg-[#6A4E3A]" : "bg-gray-400"
            }`}
          >
            {loading ? "Mengirim..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Checkout() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    pic: "",
    phone: "",
    jumlah: "",
    instansi: "",
    fasilitas: []
  });

  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  const fasilitasList = [
    "Chocolatos X-Quest",
    "Chocolatos Cafe",
    "Merchandise Store"
  ];

  const handleCheck = (item) => {
    setForm((prev) => {
      const exists = prev.fasilitas.includes(item);
      return {
        ...prev,
        fasilitas: exists
          ? prev.fasilitas.filter((i) => i !== item)
          : [...prev.fasilitas, item],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    await fetch(
      "https://script.google.com/macros/s/AKfycbwl7QJnvIJmTxmzYJzgzHJ9vBJFQ1sqru-ZOJtN3XpMqhNFoHme3lkfacYuSK2M7GFLRw/exec",
      {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }
    );

    setLoading(false);
    alert("Data terkirim. Terima kasih!");
    navigate("/");
  };

  const isFormValid =
    form.pic &&
    form.phone &&
    form.jumlah &&
    form.instansi &&
    form.fasilitas.length > 0 &&
    agree;

  return (
    <div className="min-h-screen p-6" style={{ background: "#6A4E3A" }}>
      <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow">
        <img src={Logo} alt="Logo" className="mx-auto w-32 mb-4" />

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nama PIC/Koordinator Rombongan"
            className="p-3 border rounded-xl"
            value={form.pic}
            onChange={(e) => setForm({ ...form, pic: e.target.value })}
            required
          />

          <input
            type="text"
            placeholder="Nomor HP Aktif"
            className="p-3 border rounded-xl"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
          />

          <input
            type="number"
            placeholder="Jumlah Rombongan"
            className="p-3 border rounded-xl"
            value={form.jumlah}
            onChange={(e) => setForm({ ...form, jumlah: e.target.value })}
            required
          />

          <input
            type="text"
            placeholder="Instansi Asal"
            className="p-3 border rounded-xl"
            value={form.instansi}
            onChange={(e) => setForm({ ...form, instansi: e.target.value })}
            required
          />

          <div className="mt-2">
            <p className="font-semibold mb-2">Area yang Akan Dikunjungi:</p>

            {fasilitasList.map((item) => (
              <label key={item} className="flex items-center gap-2 mb-1">
                <input
                  type="checkbox"
                  checked={form.fasilitas.includes(item)}
                  onChange={() => handleCheck(item)}
                  className="accent-[#6A4E3A]"
                />
                {item}
              </label>
            ))}
          </div>

          <p className="text-sm text-gray-700 mt-4">
            Dengan ini saya selaku PIC/Penanggung jawab rombongan menyatakan bahwa
            seluruh rombongan telah membaca/diberikan pengarahan keselamatan
            (safety induction) melalui handbook kunjungan Chocolatos X-Quest,
            tidak membawa barang terlarang seperti korek api, senjata tajam, atau
            makanan/minuman yang dibatasi, serta berada dalam kondisi kesehatan
            yang layak tanpa penyakit berisiko.
          </p>

          <label className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              checked={agree}
              onChange={() => setAgree(!agree)}
              className="accent-[#6A4E3A]"
            />
            <span className="text-sm">Saya menyetujui keterangan di atas</span>
          </label>

          <button
            type="submit"
            disabled={!isFormValid}
            className={`mt-4 p-3 text-white rounded-xl shadow ${
              isFormValid ? "bg-[#6A4E3A]" : "bg-gray-400"
            }`}
          >
            {loading ? "Mengirim..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
