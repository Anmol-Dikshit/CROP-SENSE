import React, { useState } from "react";
import InputCard from "../components/InputCard.jsx";
import { predict } from "../services/api";

export default function Recommendation() {
  const [form, setForm] = useState({
    N: "",
    P: "",
    K: "",
    temperature: "",
    humidity: "",
    ph: "",
    rainfall: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const payload = Object.fromEntries(
        Object.entries(form).map(([key, value]) => [
          key,
          Number(value),
        ])
      );

      const response = await predict(payload);
      setResult(response.data);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        "Could not connect to backend. Check Flask server."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      N: "",
      P: "",
      K: "",
      temperature: "",
      humidity: "",
      ph: "",
      rainfall: "",
    });
    setResult(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#f5f8f0]">

      {/* NAVBAR */}

      <nav className="bg-white border-b border-green-100 px-6 py-4">
        <div className="w-full max-w-[1320px] mx-auto flex justify-between items-center">

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-700 rounded-xl flex items-center justify-center text-3xl">
              🌱
            </div>

            <div>
              <h1 className="text-2xl font-extrabold text-green-900">
                CROP<span className="text-green-600">SENSE</span>
              </h1>
              <p className="text-[10px] tracking-[3px] text-gray-500 font-bold">
                SMART AGRICULTURE
              </p>
            </div>
          </div>

          <div className="hidden md:flex gap-10 text-sm font-semibold text-gray-600">
            <a href="#home" className="hover:text-green-700">Home</a>
            <a href="#recommendation" className="hover:text-green-700">Recommendation</a>
            <a href="#about" className="hover:text-green-700">About</a>
          </div>

          <a
            href="#recommendation"
            className="bg-green-700 text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-green-800 transition"
          >
            Get Started →
          </a>

        </div>
      </nav>


      {/* HERO SECTION */}

      <section
        id="home"
        className="relative min-h-[560px] flex items-center overflow-hidden"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=2000')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >

        <div className="absolute inset-0 bg-gradient-to-r from-[#092b19]/95 via-[#123c25]/80 to-transparent"></div>

        <div className="relative z-10 w-full max-w-[1320px] mx-auto px-6 sm:px-10 lg:px-16 py-28">

          <div className="max-w-2xl">

            <span className="inline-block bg-green-400/20 border border-green-300/30 text-green-200 px-5 py-2 rounded-full text-xs font-bold tracking-widest mb-7">
              🌿 SMART FARMING TECHNOLOGY
            </span>

            <h2 className="text-5xl md:text-7xl font-extrabold text-white leading-tight">
              Grow Smarter.
              <br />
              <span className="text-lime-400">
                Harvest Better.
              </span>
            </h2>

            <p className="text-gray-200 text-lg mt-7 leading-relaxed max-w-xl">
              Make smarter farming decisions with intelligent
              crop recommendations powered by machine learning.
              Discover which crop is best suited for your soil
              and environmental conditions.
            </p>

            <div className="flex flex-wrap gap-5 mt-9">

              <a
                href="#recommendation"
                className="bg-lime-500 hover:bg-lime-400 text-green-950 px-8 py-4 rounded-xl font-bold transition shadow-lg"
              >
                Find Best Crop →
              </a>

              <a
                href="#about"
                className="border border-white/50 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition"
              >
                Explore Platform
              </a>

            </div>

          </div>
        </div>
      </section>


      {/* FEATURE CARDS */}

      <section className="w-full max-w-[1320px] mx-auto px-6 sm:px-10 lg:px-12 -mt-12 relative z-20">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {[
            {
              icon: "🌱",
              title: "Smart Crop Selection",
              text: "Find suitable crops based on soil parameters.",
            },
            {
              icon: "🌦️",
              title: "Climate Analysis",
              text: "Consider temperature, humidity and rainfall.",
            },
            {
              icon: "🤖",
              title: "ML Powered Prediction",
              text: "Get predictions from your trained ML model.",
            },
          ].map((item, index) => (

            <div
              key={index}
              className="bg-white p-7 rounded-2xl shadow-lg border border-green-100 hover:-translate-y-2 hover:shadow-xl transition duration-300"
            >
              <div className="text-4xl mb-4">{item.icon}</div>

              <h3 className="font-bold text-xl text-green-900">
                {item.title}
              </h3>

              <p className="text-gray-500 text-sm mt-3">
                {item.text}
              </p>
            </div>

          ))}

        </div>
      </section>


      {/* RECOMMENDATION SECTION */}

      <section
        id="recommendation"
        className="w-full max-w-[1320px] mx-auto px-6 sm:px-10 lg:px-12 py-24"
      >

        <div className="text-center mb-14">

          <span className="text-green-700 font-bold tracking-widest text-sm uppercase">
            Intelligent Agriculture
          </span>

          <h2 className="text-4xl md:text-5xl font-extrabold text-green-950 mt-4">
            Find Your Perfect Crop
          </h2>

          <p className="text-gray-500 mt-5 max-w-2xl mx-auto leading-relaxed">
            Enter your soil nutrients and environmental conditions
            to discover the most suitable crop for your agricultural land.
          </p>

        </div>


        <div className="grid lg:grid-cols-5 gap-10 items-start">

          {/* FORM */}

          <div className="lg:col-span-3 bg-white rounded-3xl shadow-xl border border-green-100 overflow-hidden">

            <div className="bg-gradient-to-r from-green-800 to-green-600 p-8">

              <div className="flex items-center gap-4">

                <div className="text-4xl">🧪</div>

                <div>
                  <h3 className="text-2xl font-bold text-white">
                    Soil & Climate Analysis
                  </h3>

                  <p className="text-green-100 text-sm mt-2">
                    Enter your agricultural field parameters.
                  </p>
                </div>

              </div>

            </div>


            <form onSubmit={handleSubmit} className="p-7 md:p-10">

              <h4 className="font-bold text-green-900 text-lg mb-6">
                🌿 Soil Nutrients
              </h4>

              <div className="grid sm:grid-cols-2 gap-6">

                <InputCard label="Nitrogen (N)" name="N" value={form.N} handleChange={handleChange} />

                <InputCard label="Phosphorus (P)" name="P" value={form.P} handleChange={handleChange} />

                <InputCard label="Potassium (K)" name="K" value={form.K} handleChange={handleChange} />

                <InputCard label="Soil pH" name="ph" value={form.ph} handleChange={handleChange} />

              </div>


              <div className="border-t border-green-100 my-9"></div>


              <h4 className="font-bold text-green-900 text-lg mb-6">
                🌦️ Environmental Conditions
              </h4>

              <div className="grid sm:grid-cols-2 gap-6">

                <InputCard label="Temperature (°C)" name="temperature" value={form.temperature} handleChange={handleChange} />

                <InputCard label="Humidity (%)" name="humidity" value={form.humidity} handleChange={handleChange} />

                <InputCard label="Rainfall (mm)" name="rainfall" value={form.rainfall} handleChange={handleChange} />

              </div>


              {error && (
                <div className="mt-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
                  ⚠️ {error}
                </div>
              )}


              <div className="flex flex-col sm:flex-row gap-4 mt-9">

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-700 hover:bg-green-800 text-white py-4 rounded-xl font-bold shadow-lg transition disabled:opacity-60"
                >
                  {loading ? "⏳ Analyzing Soil..." : "🌱 Predict Best Crop"}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="px-8 py-4 border border-green-200 text-green-800 rounded-xl font-semibold hover:bg-green-50 transition"
                >
                  Reset
                </button>

              </div>

            </form>
          </div>


          {/* RIGHT SIDEBAR */}

          <div className="lg:col-span-2 space-y-7">

            <div className="rounded-3xl overflow-hidden shadow-xl bg-white">

              <img
                src="https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?w=900"
                alt="Golden agricultural field"
                className="w-full h-64 object-cover"
              />

              <div className="bg-[#17452b] p-8">

                <h3 className="text-2xl font-bold text-white">
                  Better Decisions.
                  <br />
                  Better Farming.
                </h3>

                <p className="text-green-100 text-sm leading-relaxed mt-4">
                  Understand your soil and environmental conditions
                  before selecting your next crop. Let data guide
                  your agricultural decisions.
                </p>

              </div>

            </div>


            <div className="bg-[#e9f3e7] rounded-3xl p-8 border border-green-100">

              <h3 className="font-bold text-green-950 text-xl">
                💡 How It Works
              </h3>

              <div className="space-y-7 mt-7">

                {[
                  ["01", "Enter Soil Data", "Provide NPK and pH values."],
                  ["02", "Analyze Conditions", "Add weather and rainfall information."],
                  ["03", "Get Recommendation", "Receive your ML-based crop prediction."],
                ].map((item, index) => (

                  <div key={index} className="flex gap-4">

                    <div className="w-12 h-12 rounded-xl bg-green-700 text-white flex items-center justify-center font-bold shrink-0">
                      {item[0]}
                    </div>

                    <div>
                      <h4 className="font-bold text-green-950">
                        {item[1]}
                      </h4>

                      <p className="text-sm text-gray-600 mt-2">
                        {item[2]}
                      </p>
                    </div>

                  </div>

                ))}

              </div>

            </div>

          </div>

        </div>


        {/* RESULTS */}

        {result && (

          <div className="mt-14 bg-white rounded-3xl shadow-xl border border-green-200 overflow-hidden">

            <div className="bg-gradient-to-r from-green-800 to-green-600 p-9">

              <p className="text-green-100 font-semibold text-sm uppercase tracking-widest">
                Your Analysis Is Complete
              </p>

              <h2 className="text-3xl font-extrabold text-white mt-3">
                🌾 Crop Recommendation
              </h2>

            </div>

            <div className="p-8 md:p-10">

              <div className="bg-green-50 rounded-2xl p-8 border border-green-100">

                <p className="text-green-700 font-semibold">
                  Recommended Crop
                </p>

                <h3 className="text-4xl font-extrabold text-green-900 capitalize mt-4">
                  {result.crop}
                </h3>

                {result.confidence !== null &&
                  result.confidence !== undefined && (
                    <p className="mt-4 text-green-800 font-semibold">
                      Model Confidence: {result.confidence}%
                    </p>
                  )}

              </div>


              {result.top_recommendations?.length > 0 && (

                <div className="mt-9">

                  <h3 className="text-xl font-bold text-green-950 mb-6">
                    Other Top Predictions
                  </h3>

                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">

                    {result.top_recommendations.map((item, index) => (

                      <div
                        key={item.crop}
                        className="bg-[#f6faf3] border border-green-100 rounded-2xl p-6 hover:shadow-lg transition"
                      >

                        <span className="text-green-700 text-sm font-bold">
                          OPTION {index + 1}
                        </span>

                        <div className="text-3xl mt-4">🌿</div>

                        <h4 className="text-xl font-bold text-green-950 capitalize mt-3">
                          {item.crop}
                        </h4>

                        {item.confidence !== null &&
                          item.confidence !== undefined && (
                            <p className="text-sm text-green-700 mt-3">
                              Confidence: {item.confidence}%
                            </p>
                          )}

                      </div>

                    ))}

                  </div>

                </div>

              )}


              <p className="text-gray-500 text-sm mt-9 leading-relaxed">
                Note: This is a dataset-based machine learning prediction.
                It is not a substitute for local agricultural advice.
                Fertilizer advice is not generated by this model.
              </p>

            </div>

          </div>

        )}

      </section>


      {/* FOOTER */}

      <footer id="about" className="bg-[#123c27] py-14 px-6">

        <div className="max-w-[1320px] mx-auto text-center">

          <div className="text-4xl mb-4">🌱</div>

          <h2 className="text-3xl font-extrabold text-white">
            CROP SENSE
          </h2>

          <p className="text-green-200 mt-3">
            Smart Crop & Fertilizer Recommendation System
          </p>

          <div className="h-px bg-green-700 my-9"></div>

          <p className="text-green-100 text-sm">
            © 2026 CROP SENSE. Smart Technology for Smarter Agriculture.
          </p>

        </div>

      </footer>

    </div>
  );
}