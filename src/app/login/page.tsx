"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, Mail, Key } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  
  // modes: 'login', 'change', 'forgot_email', 'forgot_reset'
  const [mode, setMode] = useState<"login" | "change" | "forgot_email" | "forgot_reset">("login");
  
  const [pin, setPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const getSavedPin = () => {
    if (typeof window !== "undefined" && selectedPlayer) {
      return localStorage.getItem("sq_pin_" + selectedPlayer) || "1234";
    }
    return "1234";
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === getSavedPin()) {
      sessionStorage.setItem("sq_auth", selectedPlayer || "player1");
      router.push("/");
    } else {
      setError(true);
      setPin("");
    }
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === getSavedPin() && newPin.length === 4) {
      localStorage.setItem("sq_pin_" + selectedPlayer, newPin);
      setSuccessMsg("PIN CHANGED!");
      setTimeout(() => {
        setMode("login");
        setPin("");
        setNewPin("");
        setSuccessMsg("");
      }, 1500);
    } else {
      setError(true);
      setPin("");
      setNewPin("");
    }
  };

  const handleForgotEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes("@")) {
      alert("A reset link has been sent to " + email + "!");
      setMode("forgot_reset");
    } else {
      setError(true);
    }
  };

  const handleForgotReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length === 4) {
      localStorage.setItem("sq_pin_" + selectedPlayer, newPin);
      setSuccessMsg("PIN RESET SUCCESSFUL!");
      setTimeout(() => {
        setMode("login");
        setPin("");
        setNewPin("");
        setSuccessMsg("");
      }, 1500);
    } else {
      setError(true);
    }
  };

  const renderPinInput = (value: string, onChange: (val: string) => void, isError: boolean) => (
    <div className={`relative w-48 h-12 flex items-center justify-center gap-3 bg-white-city border-4 border-ink shadow-inner ${isError ? 'bg-warm-red/20' : ''}`}>
      <input 
        type="tel"
        maxLength={4}
        value={value}
        onChange={(e) => {
          onChange(e.target.value.replace(/[^0-9]/g, ''));
          setError(false);
        }}
        className="absolute inset-0 w-full h-full opacity-0 cursor-text z-10"
      />
      {[0, 1, 2, 3].map((index) => (
        <div key={index} className="w-4 h-4 flex items-center justify-center">
          {value.length > index ? (
            <div className="w-3 h-3 bg-ink"></div>
          ) : (
            <div className="w-3 h-1 bg-ink/20"></div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col items-center justify-center font-pixel bg-asphalt p-4 relative overflow-hidden">
      
      {/* Arcade cabinet scanlines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] pointer-events-none z-10"></div>
      
      <div className="z-20 text-center mb-12 animate-pulse">
        <h1 className="text-4xl text-mustard drop-shadow-[4px_4px_0_rgba(38,52,58,1)]">SUNDAY</h1>
        <h1 className="text-4xl text-brick-red drop-shadow-[4px_4px_0_rgba(38,52,58,1)] mt-2">QUEST</h1>
      </div>

      {!selectedPlayer ? (
        <div className="z-20 w-full max-w-sm">
          <h2 className="text-white-city text-center mb-6 text-sm tracking-widest">SELECT PLAYER</h2>
          <div className="flex gap-4">
             <button 
               onClick={() => setSelectedPlayer("founder")}
               className="flex-1 bg-sky-blue border-4 border-ink p-4 flex flex-col items-center hover:bg-light-sky active:translate-y-1 shadow-[4px_4px_0_rgba(38,52,58,1)] transition-all"
             >
               <div className="w-16 h-16 bg-cream border-4 border-ink mb-2 overflow-hidden shadow-inner flex items-center justify-center pt-2">
                 <img src="/sprites/girl1/turnaround/girl1_turnaround_front.png?v=2" alt="P1" className="w-full h-full object-cover object-top scale-125" style={{ imageRendering: 'pixelated' }} />
               </div>
               <span className="text-[0.6rem] font-bold text-ink">AVREL</span>
             </button>
             
             <button 
               onClick={() => setSelectedPlayer("sister")}
               className="flex-1 bg-warm-red border-4 border-ink p-4 flex flex-col items-center hover:bg-brick-red active:translate-y-1 shadow-[4px_4px_0_rgba(38,52,58,1)] transition-all"
             >
               <div className="w-16 h-16 bg-cream border-4 border-ink mb-2 overflow-hidden shadow-inner flex items-center justify-center pt-2">
                 <img src="/sprites/girl2/expression/girl2_expression_happy.png?v=2" alt="Sister" className="w-full h-full object-cover object-top scale-125" style={{ imageRendering: 'pixelated' }} />
               </div>
               <span className="text-[0.6rem] font-bold text-ink">AUREL</span>
             </button>
          </div>
        </div>
      ) : (
        <div className="z-20 bg-cream border-4 border-ink p-6 shadow-[8px_8px_0_rgba(38,52,58,1)] flex flex-col items-center max-w-sm w-full">
          {successMsg ? (
            <div className="text-leaf-green font-bold text-sm tracking-widest my-8 animate-bounce">{successMsg}</div>
          ) : (
            <>
              {mode === "login" && (
                <form onSubmit={handleLogin} className="flex flex-col items-center w-full">
                  <h2 className="text-ink text-[0.6rem] font-bold mb-6 flex items-center gap-2 tracking-widest">
                    <Lock className="w-4 h-4" /> ENTER PIN
                  </h2>
                  {renderPinInput(pin, setPin, error)}
                  {error && <span className="text-[0.5rem] text-brick-red font-bold mt-3 tracking-widest">INCORRECT PIN</span>}
                  
                  <div className="flex gap-4 w-full mt-6 mb-4">
                    <button type="button" onClick={() => setMode("change")} className="flex-1 text-[0.55rem] font-bold text-asphalt underline hover:text-ink">CHANGE PIN</button>
                    <button type="button" onClick={() => setMode("forgot_email")} className="flex-1 text-[0.55rem] font-bold text-asphalt underline hover:text-ink">FORGOT PIN?</button>
                  </div>
                  
                  <div className="flex gap-4 w-full">
                    <button type="button" onClick={() => {setSelectedPlayer(null); setPin(""); setError(false);}} className="flex-1 bg-concrete text-ink text-[0.6rem] font-bold py-3 border-4 border-ink active:translate-y-1 shadow-[2px_2px_0_rgba(38,52,58,1)]">BACK</button>
                    <button type="submit" className="flex-1 bg-leaf-green text-white-city text-[0.6rem] font-bold py-3 border-4 border-ink active:translate-y-1 shadow-[2px_2px_0_rgba(38,52,58,1)]">LOGIN</button>
                  </div>
                </form>
              )}

              {mode === "change" && (
                <form onSubmit={handleChangePin} className="flex flex-col items-center w-full">
                  <h2 className="text-ink text-[0.6rem] font-bold mb-4 flex items-center gap-2 tracking-widest uppercase">
                    <Key className="w-4 h-4" /> Change PIN
                  </h2>
                  
                  <span className="text-[0.5rem] text-asphalt font-bold mb-1 block w-48 text-left">CURRENT PIN</span>
                  {renderPinInput(pin, setPin, error)}
                  
                  <span className="text-[0.5rem] text-asphalt font-bold mb-1 mt-4 block w-48 text-left">NEW PIN</span>
                  {renderPinInput(newPin, setNewPin, false)}
                  
                  {error && <span className="text-[0.5rem] text-brick-red font-bold mt-3 tracking-widest">INCORRECT CURRENT PIN</span>}
                  
                  <div className="flex gap-4 mt-6 w-full">
                    <button type="button" onClick={() => {setMode("login"); setPin(""); setNewPin(""); setError(false);}} className="flex-1 bg-concrete text-ink text-[0.6rem] font-bold py-3 border-4 border-ink active:translate-y-1 shadow-[2px_2px_0_rgba(38,52,58,1)]">CANCEL</button>
                    <button type="submit" disabled={newPin.length !== 4} className="flex-1 bg-mustard text-ink text-[0.6rem] font-bold py-3 border-4 border-ink active:translate-y-1 shadow-[2px_2px_0_rgba(38,52,58,1)] disabled:opacity-50">SAVE</button>
                  </div>
                </form>
              )}

              {mode === "forgot_email" && (
                <form onSubmit={handleForgotEmail} className="flex flex-col items-center w-full">
                  <h2 className="text-ink text-[0.6rem] font-bold mb-4 flex items-center gap-2 tracking-widest uppercase">
                    <Mail className="w-4 h-4" /> Recover PIN
                  </h2>
                  
                  <span className="text-[0.5rem] text-asphalt font-bold mb-2 block w-full text-left">ENTER ACCOUNT EMAIL</span>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(false); }}
                    className={`w-full bg-white-city border-4 border-ink p-3 text-xs font-bold shadow-inner outline-none ${error ? 'bg-warm-red/20' : ''}`}
                    placeholder="player@sundayquest.com"
                  />
                  {error && <span className="text-[0.5rem] text-brick-red font-bold mt-3 tracking-widest text-left w-full">INVALID EMAIL</span>}
                  
                  <div className="flex gap-4 mt-6 w-full">
                    <button type="button" onClick={() => {setMode("login"); setError(false); setEmail("");}} className="flex-1 bg-concrete text-ink text-[0.6rem] font-bold py-3 border-4 border-ink active:translate-y-1 shadow-[2px_2px_0_rgba(38,52,58,1)]">CANCEL</button>
                    <button type="submit" className="flex-1 bg-sky-blue text-ink text-[0.6rem] font-bold py-3 border-4 border-ink active:translate-y-1 shadow-[2px_2px_0_rgba(38,52,58,1)]">SEND LINK</button>
                  </div>
                </form>
              )}

              {mode === "forgot_reset" && (
                <form onSubmit={handleForgotReset} className="flex flex-col items-center w-full">
                  <h2 className="text-ink text-[0.6rem] font-bold mb-4 flex items-center gap-2 tracking-widest uppercase">
                    <Key className="w-4 h-4" /> Set New PIN
                  </h2>
                  
                  <span className="text-[0.5rem] text-asphalt font-bold mb-2 text-center">Via secure email link recovery</span>
                  
                  <span className="text-[0.5rem] text-asphalt font-bold mb-1 mt-2 block w-48 text-left">NEW PIN</span>
                  {renderPinInput(newPin, setNewPin, error)}
                  
                  <div className="flex gap-4 mt-6 w-full">
                    <button type="submit" disabled={newPin.length !== 4} className="w-full bg-mustard text-ink text-[0.6rem] font-bold py-3 border-4 border-ink active:translate-y-1 shadow-[2px_2px_0_rgba(38,52,58,1)] disabled:opacity-50">CONFIRM PIN</button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
