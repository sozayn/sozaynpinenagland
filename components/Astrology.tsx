import React, { useState, useMemo } from 'react';
import { getDeepCosmicReading } from '../services/geminiService';
import { StarIcon, BrainCircuitIcon, SparklesIcon } from './icons';
import { Loader2, Hash, Moon, Sun, Info, Image as ImageIcon, Key, AlertCircle, ExternalLink } from 'lucide-react';

function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            return initialValue;
        }
    });

    const setValue = (value: T | ((val: T) => T)) => {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
    };

    return [storedValue, setValue];
}

const zodiacSigns = {
    aries: { symbol: '♈', name: 'Aries' }, taurus: { symbol: '♉', name: 'Taurus' },
    gemini: { symbol: '♊', name: 'Gemini' }, cancer: { symbol: '♋', name: 'Cancer' },
    leo: { symbol: '♌', name: 'Leo' }, virgo: { symbol: '♍', name: 'Virgo' },
    libra: { symbol: '♎', name: 'Libra' }, scorpio: { symbol: '♏', name: 'Scorpio' },
    sagittarius: { symbol: '♐', name: 'Sagittarius' }, capricorn: { symbol: '♑', name: 'Capricorn' },
    aquarius: { symbol: '♒', name: 'Aquarius' }, pisces: { symbol: '♓', name: 'Pisces' }
};

const planets = {
    sun: { symbol: '☉', name: 'Sun', color: '#facc15' }, moon: { symbol: '☽', name: 'Moon', color: '#cbd5e1' },
    mercury: { symbol: '☿', name: 'Mercury', color: '#fb923c' }, venus: { symbol: '♀', name: 'Venus', color: '#f472b6' },
    mars: { symbol: '♂', name: 'Mars', color: '#ef4444' }, jupiter: { symbol: '♃', name: 'Jupiter', color: '#ea580c' },
    saturn: { symbol: '♄', name: 'Saturn', color: '#78716c' }
};

type ZodiacSignKey = keyof typeof zodiacSigns;

// --- NUMEROLOGY CALCULATIONS ---
const calculateNumerology = (name: string, dateStr: string) => {
  const reduce = (num: number): number => {
    if (num <= 9 || num === 11 || num === 22 || num === 33) return num;
    const sum = String(num).split('').reduce((acc, char) => acc + parseInt(char, 10), 0);
    return reduce(sum);
  };

  const nameToNum = (str: string) => {
    const charMap: { [key: string]: number } = {
      a:1, b:2, c:3, d:4, e:5, f:6, g:7, h:8, i:9,
      j:1, k:2, l:3, m:4, n:5, o:6, p:7, q:8, r:9,
      s:1, t:2, u:3, v:4, w:5, x:6, y:7, z:8
    };
    const total = str.toLowerCase().split('').reduce((acc, char) => acc + (charMap[char] || 0), 0);
    return reduce(total);
  };

  const lifePath = dateStr.replace(/-/g, '').split('').reduce((acc, char) => acc + parseInt(char, 10), 0);
  const expression = nameToNum(name);
  
  return {
    lifePath: reduce(lifePath),
    expression: expression,
    soulUrge: nameToNum(name.replace(/[^aeiou]/gi, '')),
    personality: nameToNum(name.replace(/[aeiou]/gi, ''))
  };
};

const VisualNatalChart = ({ chart }: { chart: any }) => {
    const viewBoxSize = 500;
    const center = viewBoxSize / 2;
    const zodiacRadius = viewBoxSize * 0.4;

    return (
        <div className="flex flex-col items-center justify-center text-white w-full animate-fade-in py-4">
            <div className="relative w-full max-w-[360px] aspect-square group">
                <div className="absolute inset-0 bg-brand-dark rounded-full overflow-hidden shadow-[inset_0_0_40px_rgba(0,0,0,0.9)] border border-slate-800">
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent"></div>
                  <div className="starry-bg absolute inset-0 opacity-30"></div>
                </div>

                <svg width="100%" height="100%" viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} className="absolute inset-0 z-10">
                    <defs>
                        <filter id="planet-glow">
                            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
                        </filter>
                    </defs>
                    <circle cx={center} cy={center} r={zodiacRadius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                    <circle cx={center} cy={center} r={zodiacRadius * 0.75} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                    
                    {Object.values(zodiacSigns).map((sign, index) => {
                        const angle = (index * 30 + 15) * (Math.PI / 180);
                        const x = center + (zodiacRadius + 20) * Math.cos(angle - Math.PI / 2);
                        const y = center + (zodiacRadius + 20) * Math.sin(angle - Math.PI / 2);
                        return <text key={sign.name} x={x} y={y} fill="rgba(255,255,255,0.3)" fontSize="16" fontWeight="bold" textAnchor="middle" alignmentBaseline="middle" className="font-sans select-none">{sign.symbol}</text>;
                    })}
                    
                    <circle cx={center} cy={center} r="20" fill="rgba(234, 179, 8, 0.05)" />
                    <circle cx={center} cy={center} r="12" fill="#eab308" filter="url(#planet-glow)" />

                    {Object.entries(chart.planets).map(([key, p]: [string, any]) => {
                        const angleRad = p.angle * (Math.PI / 180);
                        const dist = zodiacRadius * 0.82;
                        const x = center + dist * Math.cos(angleRad - Math.PI / 2);
                        const y = center + dist * Math.sin(angleRad - Math.PI / 2);
                        return (
                            <g key={key}>
                              <line x1={center} y1={center} x2={x} y2={y} stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />
                              <circle cx={x} cy={y} r="10" fill={p.color} filter="url(#planet-glow)" className="cursor-pointer" />
                              <text x={x} y={y + 1} fill="#020617" fontSize="10" fontWeight="black" textAnchor="middle" alignmentBaseline="middle" className="select-none">{p.symbol}</text>
                            </g>
                        );
                    })}
                </svg>
            </div>

            <div className="mt-6 w-full max-w-4xl grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 px-2">
                {Object.entries(chart.planets).map(([key, p]: [string, any]) => (
                    <div key={key} className="bg-slate-900/40 p-2.5 rounded-lg border border-slate-800 transition-all hover:border-brand-accent/40 text-center">
                        <div className="text-xs font-black mb-0.5" style={{color: p.color}}>{p.symbol}</div>
                        <div className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-0.5">{p.name}</div>
                        <div className="text-sm font-black text-white">{p.degree}°</div>
                        <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest truncate">{zodiacSigns[p.sign as ZodiacSignKey].name}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Astrology: React.FC = () => {
    const [savedDetails, setSavedDetails] = useLocalStorage('astrologyBirthDetails', { name: 'Amara', date: '1995-08-15', time: '08:30', location: 'Cairo', country: 'Egypt' });
    const [details, setDetails] = useState(savedDetails);
    const [userChart, setUserChart] = useState<any | null>(null);
    const [activeTab, setActiveTab] = useState<'astrology' | 'numerology'>('astrology');
    const [reading, setReading] = useState<{ text: string, imageUrl?: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showKeyModal, setShowKeyModal] = useState(false);

    const numerologyData = useMemo(() => calculateNumerology(details.name, details.date), [details.name, details.date]);

    const handleGenerate = () => {
        const { name, date, time, location, country } = details;
        const birthDate = new Date(`${date}T${time}`);
        const chart: any = { name, date: birthDate, location, country, planets: {} };
        
        Object.keys(planets).forEach((key, i) => {
            const angle = (i * 45 + 12) % 360;
            const signKey = Object.keys(zodiacSigns)[Math.floor(angle / 30)] as ZodiacSignKey;
            chart.planets[key] = {
                ...planets[key as keyof typeof planets],
                angle,
                sign: signKey,
                degree: Math.floor(angle % 30),
            };
        });
        setUserChart(chart);
        setSavedDetails(details);
        setReading(null);
    };

    const performReading = async () => {
        setIsLoading(true);
        setReading(null);
        try {
            const result = await getDeepCosmicReading(
                activeTab === 'astrology' ? 'Astrology' : 'Numerology', 
                activeTab === 'astrology' ? (userChart || details) : { name: details.name, date: details.date }
            );
            setReading(result);
        } catch (err: any) {
            if (err.message === "API_KEY_REQUIRED") {
                setShowKeyModal(true);
            } else {
                setReading({ text: "The heavens are currently clouded. Please try again later." });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeepReading = async () => {
        const hasKey = await (window as any).aistudio.hasSelectedApiKey();
        if (!hasKey) {
            setShowKeyModal(true);
            return;
        }
        await performReading();
    };

    const handleSelectKey = async () => {
        await (window as any).aistudio.openSelectKey();
        setShowKeyModal(false);
        await performReading();
    };

    return (
        <div className="w-full max-w-6xl mx-auto h-full space-y-6 pb-12 animate-fade-in relative">
            {/* API Key Modal */}
            {showKeyModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-brand-dark-secondary w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-slide-up">
                        <div className="p-8 text-center space-y-6">
                            <div className="w-20 h-20 bg-brand-accent/10 rounded-full flex items-center justify-center mx-auto text-brand-accent">
                                <Key size={40} />
                            </div>
                            <div className="space-y-2">
                                <h2 className="font-serif text-3xl font-bold text-slate-900 dark:text-white">Pro Access</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                    Pro-tier image and text analysis require a valid API key from a paid GCP project.
                                </p>
                            </div>
                            
                            <div className="bg-amber-50 dark:bg-amber-500/10 p-4 rounded-2xl border border-amber-100 dark:border-amber-500/20 flex gap-3 text-left">
                                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest">Requirement</p>
                                    <p className="text-xs text-amber-600 dark:text-amber-500 leading-relaxed font-medium">
                                        Ensure billing is enabled for your project key.
                                    </p>
                                    <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-brand-accent hover:underline flex items-center gap-1 mt-1">
                                        View Billing Docs <ExternalLink size={10} />
                                    </a>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <button onClick={handleSelectKey} className="w-full py-4 bg-brand-accent text-white font-black text-xs uppercase tracking-[0.2em] rounded-xl shadow-glow hover:bg-brand-accent-hover transition-all">
                                    Select Paid API Key
                                </button>
                                <button onClick={() => setShowKeyModal(false)} className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-black text-xs uppercase tracking-[0.2em] rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Header Area */}
            <div className="flex flex-col md:flex-row items-end justify-between gap-6 px-4">
              <div>
                <span className="text-[10px] font-black text-brand-accent uppercase tracking-[0.4em] mb-2 block">Celestial Sciences</span>
                <h1 className="font-serif text-4xl font-bold text-slate-900 dark:text-white">Celestial Resonance</h1>
              </div>
              <div className="bg-slate-200 dark:bg-slate-800 p-1 rounded-xl flex gap-1 shadow-sm border border-slate-300 dark:border-slate-700">
                <button 
                  onClick={() => { setActiveTab('astrology'); setReading(null); }}
                  className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'astrology' ? 'bg-white dark:bg-brand-dark shadow-sm text-brand-accent' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                  <div className="flex items-center gap-2"><StarIcon className="w-3.5 h-3.5" /> Astrology</div>
                </button>
                <button 
                  onClick={() => { setActiveTab('numerology'); setReading(null); }}
                  className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'numerology' ? 'bg-white dark:bg-brand-dark shadow-sm text-brand-accent' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                  <div className="flex items-center gap-2"><Hash className="w-3.5 h-3.5" /> Numerology</div>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-4">
                {/* Sidebar Input */}
                <aside className="lg:col-span-4 bg-white dark:bg-brand-dark-secondary p-6 rounded-2xl shadow-premium border border-slate-200 dark:border-slate-800 h-fit">
                    <div className="flex items-center gap-3 mb-6">
                      <SparklesIcon className="w-5 h-5 text-brand-accent" />
                      <h2 className="font-serif text-xl font-bold text-slate-900 dark:text-white">Birth Data</h2>
                    </div>

                    <div className="space-y-3">
                        {[
                          { label: 'Name', name: 'name', type: 'text' },
                          { label: 'Date', name: 'date', type: 'date' },
                          { label: 'Time', name: 'time', type: 'time' },
                          { label: 'Location', name: 'location', type: 'text' },
                          { label: 'Country', name: 'country', type: 'text' }
                        ].map((field) => (
                          <div key={field.name}>
                            <label className="block text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1 px-1">{field.label}</label>
                            <input 
                              type={field.type} 
                              name={field.name} 
                              value={(details as any)[field.name]} 
                              onChange={(e) => setDetails({...details, [e.target.name]: e.target.value})}
                              className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-brand-accent outline-none dark:text-white transition-all shadow-inner" 
                            />
                          </div>
                        ))}
                        
                        <button 
                          onClick={handleGenerate} 
                          className="w-full mt-3 bg-brand-accent text-white font-black text-[10px] uppercase tracking-[0.2em] py-3.5 rounded-xl shadow-glow hover:bg-brand-accent-hover transition-all"
                        >
                          Calibrate Resonance
                        </button>
                    </div>
                </aside>

                {/* Main Visual Display */}
                <main className="lg:col-span-8 space-y-6">
                  <div className="bg-white dark:bg-brand-dark-secondary p-6 rounded-2xl shadow-premium border border-slate-200 dark:border-slate-800 min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden transition-all duration-500">
                      {activeTab === 'astrology' ? (
                        userChart ? (
                          <VisualNatalChart chart={userChart} />
                        ) : (
                          <div className="text-center space-y-4 max-w-xs animate-slide-up py-12">
                            <StarIcon className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700" />
                            <h2 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">The Heavens Wait</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Map the celestial heavens at your moment of incarnation.</p>
                          </div>
                        )
                      ) : (
                        <div className="w-full animate-fade-in space-y-8 py-6">
                          <div className="text-center">
                            <span className="text-[10px] font-black text-brand-accent uppercase tracking-[0.3em] mb-2 block">Vibrational Signature</span>
                            <h2 className="font-serif text-3xl font-bold text-slate-900 dark:text-white">{details.name}</h2>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto px-4">
                            {[
                              { label: 'Life Path', num: numerologyData.lifePath, desc: 'Your destiny & mission.' },
                              { label: 'Expression', num: numerologyData.expression, desc: 'Your natural gifts.' },
                              { label: 'Soul Urge', num: numerologyData.soulUrge, desc: 'Your heart\'s desires.' },
                              { label: 'Personality', num: numerologyData.personality, desc: 'External perception.' }
                            ].map(item => (
                              <div key={item.label} className="bg-slate-50 dark:bg-slate-900/30 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 group transition-all hover:border-brand-accent/30">
                                <div className="w-12 h-12 rounded-lg bg-brand-accent text-white flex items-center justify-center text-xl font-black shadow-glow group-hover:scale-105 transition-transform">
                                  {item.num}
                                </div>
                                <div className="flex-1">
                                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-0.5 block">{item.label}</span>
                                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight font-medium">{item.desc}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>

                  {/* AI Deep Reading Area */}
                  <div className="bg-indigo-50/30 dark:bg-brand-accent/5 rounded-2xl border border-indigo-100 dark:border-brand-accent/20 p-6 md:p-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                      <div className="text-center sm:text-left">
                        <h3 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">Divine Synthesis</h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-500 font-bold uppercase tracking-widest">Multi-Modal Pro Analysis</p>
                      </div>
                      <button 
                        onClick={handleDeepReading}
                        disabled={isLoading}
                        className="flex items-center gap-2.5 px-6 py-3 bg-brand-accent text-white rounded-xl font-black text-[10px] uppercase tracking-[0.15em] shadow-glow hover:bg-brand-accent-hover transition-all disabled:opacity-40"
                      >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <BrainCircuitIcon className="w-4 h-4" />}
                        {isLoading ? 'Synthesizing...' : 'Summon Insight'}
                      </button>
                    </div>

                    {reading ? (
                      <div className="animate-slide-up grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                        {/* Visual Output */}
                        <div className="relative group overflow-hidden rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 aspect-square flex items-center justify-center bg-slate-100 dark:bg-slate-950">
                          {reading.imageUrl ? (
                            <img src={reading.imageUrl} alt="Celestial Manifestation" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                          ) : (
                            <div className="p-8 text-center space-y-4 opacity-50">
                                <ImageIcon size={64} className="mx-auto text-slate-400" />
                                <p className="text-xs font-black uppercase tracking-[0.1em] text-slate-400">The vision is manifesting in the aether...</p>
                            </div>
                          )}
                          <div className="absolute top-4 right-4 bg-brand-dark/40 backdrop-blur-md p-2 rounded-lg">
                            <SparklesIcon className="w-4 h-4 text-brand-gold animate-pulse" />
                          </div>
                        </div>

                        {/* Text Output */}
                        <div className="bg-white/50 dark:bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-y-auto max-h-[500px] custom-scrollbar">
                          <div className="prose prose-slate dark:prose-invert max-w-none font-serif text-base leading-relaxed text-slate-700 dark:text-slate-300">
                            {reading.text.split('\n').map((line, i) => line.trim() && <p key={i} className="mb-4">{line}</p>)}
                          </div>
                        </div>
                      </div>
                    ) : (
                        <div className="py-12 flex flex-col items-center justify-center opacity-20">
                            <BrainCircuitIcon className="w-16 h-16 text-slate-400 mb-4" />
                            <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Awaiting Ritual Data</p>
                        </div>
                    )}
                  </div>
                </main>
            </div>
            
            <style>{`
                .starry-bg {
                    background-image: 
                        radial-gradient(white, rgba(255,255,255,0) 0.5px, transparent 1px),
                        radial-gradient(white, rgba(255,255,255,0) 0.5px, transparent 1px);
                    background-size: 40px 40px, 80px 80px;
                    background-position: 0 0, 30px 40px;
                }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default Astrology;