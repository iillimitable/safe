import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Shield, MapPin, AlertTriangle } from "lucide-react";

const WelcomePage = () => {
  const { user } = useContext(AuthContext);
  const [index, setIndex] = useState(0);

  const greetings = [
  "Welcome",        // English
  "स्वागत है",      // Hindi
  "স্বাগতম",        // Bengali
  "સ્વાગત",         // Gujarati
  "ಸ್ವಾಗತ",         // Kannada
  "സ്വാഗതം",        // Malayalam
  "வரவேற்கிறோம்",   // Tamil
  "స్వాగతం",        // Telugu
  "ਸਵਾਗਤ",          // Punjabi
  "ସ୍ୱାଗତ",         // Odia
  "خوش آمدید",      // Urdu
  "ꯈꯨꯔꯨꯝꯖꯔꯤ",     // Manipuri
  "ڀلي ڪري آيا",    // Sindhi
  "ᱥᱟᱜᱩᱱ",         // Santali
  "Namaste"         // Indian greeting
];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % greetings.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 md:px-6 py-10 md:py-20">
      <div className="glass max-w-5xl w-full p-6 md:p-16 text-center space-y-10 md:space-y-14 shadow-2xl">

        {/* Greeting Section */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent transition-all duration-500">
              {greetings[index]}
            </span>
            <span className="block text-bg-navy mt-3">
              {user?.name || "Friend"}
            </span>
          </h1>

          <p className="text-base md:text-lg text-text-dim max-w-2xl mx-auto leading-relaxed">
            Your contribution strengthens our community’s safety network.
            Together, we create awareness, transparency, and protection.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">

          {/* Report Safety */}
          <div className="group glass p-8 rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
            <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-xl bg-accent-safe/10 border border-accent-safe/20 mb-5">
              <Shield size={32} className="text-accent-safe" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Report Safety
            </h3>
            <p className="text-sm text-text-dim">
              Submit structured reports to help assess real-time area safety.
            </p>
          </div>

          {/* View Area Data */}
          <div className="group glass p-8 rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
            <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-xl bg-primary/10 border border-primary/20 mb-5">
              <MapPin size={32} className="text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-bg-navy mb-2">
              View Area Data
            </h3>
            <p className="text-sm text-text-dim">
              Explore area-based safety analytics and community ratings.
            </p>
          </div>

          {/* Risk Analysis */}
          <div className="group glass p-8 rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
            <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-xl bg-accent-warning/10 border border-accent-warning/20 mb-5">
              <AlertTriangle size={32} className="text-accent-warning" />
            </div>
            <h3 className="text-lg font-semibold text-bg-navy mb-2">
              Risk Analysis
            </h3>
            <p className="text-sm text-text-dim">
              Analyze risk scores with intelligent safety calculations.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default WelcomePage;