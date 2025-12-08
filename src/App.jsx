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
    <div className="flex flex-col items-center justify-center h-screen gap-6 ">
      <img src={Logo} alt="Logo" className="mx-auto w-32 mb-4" />
      <Link
        to="/checkin"
        className="px-6 py-3 bg-amber-900 text-white rounded-xl shadow"
      >
        Check In
      </Link>
      <Link
        to="/checkout"
        className="px-6 py-3 bg-amber-950 text-white rounded-xl shadow"
      >
        Check Out
      </Link>
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

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    await fetch("https://script.google.com/macros/s/AKfycbwl7QJnvIJmTxmzYJzgzHJ9vBJFQ1sqru-ZOJtN3XpMqhNFoHme3lkfacYuSK2M7GFLRw/exec", {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    setLoading(false);
    alert("Data terkirim. Terima kasih!");
    navigate("/");("/");
  };

  return (
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
              />
              {item}
            </label>
          ))}
        </div>

        <p className="text-sm text-gray-700 mt-4">
          Dengan ini saya selaku PIC/Penanggung jawab rombongan menyatakan bahwa
          seluruh rombongan telah membaca/diberikan pengarahan keselamatan
          (safety induction) melalui handbook kunjungan Chocolatos X-Quest, tidak
          membawa barang terlarang seperti korek api, senjata tajam, atau
          makanan/minuman yang dibatasi, serta berada dalam kondisi kesehatan
          yang layak tanpa penyakit berisiko.
        </p>

        <button
          type="submit"
          className={`mt-4 p-3 text-white rounded-xl shadow ${brown}`}
        >
          {loading ? "Mengirim..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

function Checkout() {
  const [rating, setRating] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    await fetch("https://script.google.com/macros/s/AKfycbwl7QJnvIJmTxmzYJzgzHJ9vBJFQ1sqru-ZOJtN3XpMqhNFoHme3lkfacYuSK2M7GFLRw/exec", {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, feedback })
    });

    setLoading(false);
    alert("Data terkirim. Terima kasih!");
    setRating("");
    setFeedback("");
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow mt-12">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Terima kasih atas kunjungan Anda!
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="number"
          min="1"
          max="5"
          placeholder="Nilai (1-5)"
          className="p-3 border rounded-xl"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          required
        />

        <textarea
          placeholder="Feedback"
          className="p-3 border rounded-xl"
          rows="4"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          required
        />

        <button
          type="submit"
          className={`p-3 text-white rounded-xl shadow ${brown}`}
        >
          {loading ? "Mengirim..." : "Kirim"}
        </button>
      </form>
    </div>
  );
}
