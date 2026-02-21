// import { useState, useMemo } from 'react';

// /* ─────────────────────────────────────────
//    HELPERS
// ───────────────────────────────────────── */
// const fmt = (n) =>
//   new Intl.NumberFormat('pt-PT', {
//     style: 'currency',
//     currency: 'EUR',
//     minimumFractionDigits: 2,
//   }).format(isNaN(n) || !isFinite(n) ? 0 : n);

// const PERIOD_DAYS = { daily: 1, weekly: 7, monthly: 30, yearly: 365 };
// const PERIOD_LABEL = {
//   daily: 'Day',
//   weekly: 'Week',
//   monthly: 'Month',
//   yearly: 'Year',
// };

// const FUEL_DEFAULTS = {
//   diesel: { price: 1.65, cons: 6.5, unit: 'L/100km' },
//   petrol: { price: 1.8, cons: 7.5, unit: 'L/100km' },
//   electric: { price: 0.04, cons: 18, unit: 'kWh/100km' },
// };

// // Convert any amount entered in "fromPeriod" to the main selected period
// const convertPeriod = (amount, fromPeriod, toPeriod) => {
//   if (!amount) return 0;
//   const daily = amount / PERIOD_DAYS[fromPeriod];
//   return daily * PERIOD_DAYS[toPeriod];
// };

// /* ─────────────────────────────────────────
//    REUSABLE COMPONENTS
// ───────────────────────────────────────── */
// const S = {
//   // Colours
//   green: '#10b981',
//   red: '#ef4444',
//   blue: '#06b6d4',
//   purple: '#8b5cf6',
//   orange: '#f97316',
//   yellow: '#f59e0b',
//   indigo: '#6366f1',
//   pink: '#ec4899',
//   slate: '#64748b',
// };

// function PeriodPicker({ value, onChange, small = false }) {
//   return (
//     <div
//       style={{
//         display: 'inline-flex',
//         background: 'var(--surface2)',
//         borderRadius: '0.6rem',
//         padding: '0.18rem',
//         gap: '0.15rem',
//       }}
//     >
//       {Object.keys(PERIOD_DAYS).map((p) => (
//         <button
//           key={p}
//           onClick={() => onChange(p)}
//           style={{
//             padding: small ? '0.25rem 0.55rem' : '0.35rem 0.8rem',
//             borderRadius: '0.45rem',
//             border: 'none',
//             cursor: 'pointer',
//             fontSize: small ? '0.62rem' : '0.7rem',
//             fontWeight: 700,
//             fontFamily: 'inherit',
//             textTransform: 'capitalize',
//             background: value === p ? 'var(--accent)' : 'transparent',
//             color: value === p ? '#000' : 'var(--muted)',
//             transition: 'all 0.18s',
//             boxShadow: value === p ? '0 2px 8px var(--accent-glow)' : 'none',
//           }}
//         >
//           {PERIOD_LABEL[p]}
//         </button>
//       ))}
//     </div>
//   );
// }

// function NumInput({
//   label,
//   value,
//   onChange,
//   prefix = '€',
//   step = 1,
//   min = 0,
//   placeholder = '0',
// }) {
//   return (
//     <div style={{ marginBottom: '0.85rem' }}>
//       {label && (
//         <label
//           style={{
//             display: 'block',
//             fontSize: '0.68rem',
//             fontWeight: 700,
//             textTransform: 'uppercase',
//             letterSpacing: '0.07em',
//             color: 'var(--muted)',
//             marginBottom: '0.3rem',
//           }}
//         >
//           {label}
//         </label>
//       )}
//       <div
//         style={{
//           display: 'flex',
//           borderRadius: '0.65rem',
//           border: '1.5px solid var(--border)',
//           overflow: 'hidden',
//           background: 'var(--surface2)',
//           transition: 'border-color 0.2s',
//         }}
//       >
//         <span
//           style={{
//             padding: '0.7rem 0.9rem',
//             fontSize: '0.82rem',
//             color: 'var(--muted)',
//             background: 'var(--surface3)',
//             borderRight: '1.5px solid var(--border)',
//             whiteSpace: 'nowrap',
//             display: 'flex',
//             alignItems: 'center',
//             minWidth: 42,
//             justifyContent: 'center',
//           }}
//         >
//           {prefix}
//         </span>
//         <input
//           type="number"
//           value={value || ''}
//           min={min}
//           step={step}
//           placeholder={placeholder}
//           onChange={(e) => onChange(Number(e.target.value))}
//           style={{
//             flex: 1,
//             background: 'transparent',
//             border: 'none',
//             outline: 'none',
//             color: 'var(--text)',
//             fontFamily: 'inherit',
//             fontSize: '1rem',
//             fontWeight: 600,
//             padding: '0.7rem 0.9rem',
//             width: '100%',
//           }}
//         />
//       </div>
//     </div>
//   );
// }

// function Switch({ on, onChange, label, sub, accent = 'var(--accent)' }) {
//   return (
//     <div
//       onClick={() => onChange(!on)}
//       style={{
//         display: 'flex',
//         alignItems: 'flex-start',
//         gap: '0.8rem',
//         cursor: 'pointer',
//         userSelect: 'none',
//         padding: '0.5rem 0',
//       }}
//     >
//       <div
//         style={{
//           width: 46,
//           height: 26,
//           borderRadius: 13,
//           flexShrink: 0,
//           marginTop: 1,
//           background: on ? accent : 'var(--surface3)',
//           border: `2px solid ${on ? accent : 'var(--border)'}`,
//           position: 'relative',
//           transition: 'all 0.22s',
//           boxShadow: on ? `0 0 14px ${accent}55` : 'none',
//         }}
//       >
//         <div
//           style={{
//             position: 'absolute',
//             top: 2,
//             left: on ? 20 : 2,
//             width: 18,
//             height: 18,
//             borderRadius: '50%',
//             background: '#fff',
//             transition: 'left 0.22s',
//             boxShadow: '0 1px 5px rgba(0,0,0,0.35)',
//           }}
//         />
//       </div>
//       <div style={{ flex: 1 }}>
//         <div
//           style={{
//             fontSize: '0.88rem',
//             color: 'var(--text)',
//             fontWeight: 600,
//             lineHeight: 1.3,
//           }}
//         >
//           {label}
//         </div>
//         {sub && (
//           <div
//             style={{
//               fontSize: '0.7rem',
//               color: 'var(--muted)',
//               marginTop: '0.15rem',
//               lineHeight: 1.4,
//             }}
//           >
//             {sub}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// function Card({ title, icon, accent, badge, badgeColor, children }) {
//   return (
//     <div
//       style={{
//         background: 'var(--card)',
//         border: '1.5px solid var(--border)',
//         borderRadius: '1.25rem',
//         overflow: 'hidden',
//         marginBottom: '1rem',
//         boxShadow: '0 4px 28px rgba(0,0,0,0.22)',
//       }}
//     >
//       {/* Card header */}
//       <div
//         style={{
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           padding: '0.9rem 1.1rem',
//           background: `linear-gradient(135deg, ${accent}15 0%, transparent 70%)`,
//           borderBottom: '1.5px solid var(--border)',
//         }}
//       >
//         <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
//           <div
//             style={{
//               width: 34,
//               height: 34,
//               borderRadius: '0.6rem',
//               background: `${accent}22`,
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               fontSize: '1.05rem',
//             }}
//           >
//             {icon}
//           </div>
//           <span
//             style={{
//               fontWeight: 800,
//               fontSize: '0.78rem',
//               textTransform: 'uppercase',
//               letterSpacing: '0.1em',
//               color: accent,
//             }}
//           >
//             {title}
//           </span>
//         </div>
//         {badge && (
//           <span
//             style={{
//               fontSize: '0.88rem',
//               fontWeight: 800,
//               color: badgeColor || accent,
//               background: `${badgeColor || accent}15`,
//               padding: '0.2rem 0.6rem',
//               borderRadius: '0.4rem',
//             }}
//           >
//             {badge}
//           </span>
//         )}
//       </div>
//       <div style={{ padding: '1.1rem 1.1rem 0.5rem' }}>{children}</div>
//     </div>
//   );
// }

// function Divider() {
//   return (
//     <div
//       style={{ height: 1, background: 'var(--border)', margin: '0.6rem 0' }}
//     />
//   );
// }

// function DeductRow({ label, amount, color, sub, bold }) {
//   return (
//     <div
//       style={{
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'flex-start',
//         padding: '0.55rem 0',
//         borderBottom: '1px solid var(--surface3)',
//       }}
//     >
//       <div>
//         <div
//           style={{
//             fontSize: bold ? '0.85rem' : '0.78rem',
//             fontWeight: bold ? 700 : 500,
//             color: bold ? 'var(--text)' : 'var(--muted)',
//           }}
//         >
//           {label}
//         </div>
//         {sub && (
//           <div
//             style={{
//               fontSize: '0.62rem',
//               color: 'var(--muted)',
//               marginTop: '0.1rem',
//             }}
//           >
//             {sub}
//           </div>
//         )}
//       </div>
//       <div
//         style={{
//           fontSize: bold ? '0.98rem' : '0.85rem',
//           fontWeight: bold ? 800 : 600,
//           color,
//           whiteSpace: 'nowrap',
//           marginLeft: '0.5rem',
//         }}
//       >
//         {amount}
//       </div>
//     </div>
//   );
// }

// function InfoChip({ label, value, color, bg }) {
//   return (
//     <div
//       style={{
//         flex: 1,
//         background: bg || 'var(--surface2)',
//         border: '1.5px solid var(--border)',
//         borderRadius: '0.85rem',
//         padding: '0.75rem 0.85rem',
//         minWidth: 0,
//       }}
//     >
//       <div
//         style={{
//           fontSize: '0.6rem',
//           fontWeight: 700,
//           textTransform: 'uppercase',
//           letterSpacing: '0.1em',
//           color: 'var(--muted)',
//           marginBottom: '0.3rem',
//         }}
//       >
//         {label}
//       </div>
//       <div
//         style={{
//           fontSize: '1.05rem',
//           fontWeight: 800,
//           color: color || 'var(--text)',
//           lineHeight: 1.2,
//         }}
//       >
//         {value}
//       </div>
//     </div>
//   );
// }

// /* ─────────────────────────────────────────
//    AMOUNT + PERIOD INPUT (for Recibo Verde & Social)
// ───────────────────────────────────────── */
// function AmountPeriodInput({
//   label,
//   sub,
//   on,
//   onToggle,
//   amount,
//   onAmount,
//   amtPeriod,
//   onAmtPeriod,
//   accent,
// }) {
//   return (
//     <div style={{ marginBottom: '0.5rem' }}>
//       <Switch
//         on={on}
//         onChange={onToggle}
//         label={label}
//         sub={sub}
//         accent={accent}
//       />
//       {on && (
//         <div
//           style={{
//             marginTop: '0.3rem',
//             marginLeft: '0.2rem',
//             padding: '0.9rem',
//             background: `${accent}0d`,
//             border: `1.5px solid ${accent}30`,
//             borderRadius: '0.9rem',
//             marginBottom: '0.5rem',
//           }}
//         >
//           {/* Period picker */}
//           <div style={{ marginBottom: '0.6rem' }}>
//             <div
//               style={{
//                 fontSize: '0.62rem',
//                 fontWeight: 700,
//                 textTransform: 'uppercase',
//                 letterSpacing: '0.08em',
//                 color: 'var(--muted)',
//                 marginBottom: '0.4rem',
//               }}
//             >
//               Amount frequency
//             </div>
//             <PeriodPicker value={amtPeriod} onChange={onAmtPeriod} small />
//           </div>
//           {/* Amount input */}
//           <NumInput
//             label={`Amount per ${PERIOD_LABEL[amtPeriod].toLowerCase()}`}
//             value={amount}
//             onChange={onAmount}
//           />
//           <div
//             style={{
//               fontSize: '0.7rem',
//               color: accent,
//               fontWeight: 600,
//               textAlign: 'right',
//             }}
//           >
//             ≈ {fmt(convertPeriod(amount, amtPeriod, 'monthly'))}/month
//             &nbsp;·&nbsp; {fmt(convertPeriod(amount, amtPeriod, 'yearly'))}/year
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// /* ─────────────────────────────────────────
//    MAIN APP
// ───────────────────────────────────────── */
// export default function TVDECalc() {
//   /* Period for the main calculator view */
//   const [period, setPeriod] = useState('weekly');

//   /* ── Income ── */
//   const [gross, setGross] = useState(900);

//   /* ── Recibo Verde ── */
//   const [useRV, setUseRV] = useState(false);
//   const [rvAmount, setRvAmount] = useState(0);
//   const [rvPeriod, setRvPeriod] = useState('monthly');

//   /* ── Car Rent ── */
//   const [useCarRent, setUseCarRent] = useState(false);
//   const [carRentAmt, setCarRentAmt] = useState(0);
//   const [carRentPeriod, setCarRentPeriod] = useState('monthly');

//   /* ── IVA ── */
//   const [useIva, setUseIva] = useState(false);

//   /* ── Social Security ── */
//   const [useSocial, setUseSocial] = useState(false);
//   const [socialAmount, setSocialAmount] = useState(0);
//   const [socialPeriod, setSocialPeriod] = useState('monthly');

//   /* ── IRS ── */
//   const [useIRS, setUseIRS] = useState(false);
//   const [irsRate, setIrsRate] = useState(15);

//   /* ── Fuel ── */
//   const [useFuel, setUseFuel] = useState(true);
//   const [fuelType, setFuelType] = useState('diesel');
//   const [fuelPrice, setFuelPrice] = useState(1.65);
//   const [kmDriven, setKmDriven] = useState(700);
//   const [consumption, setConsumption] = useState(6.5);

//   /* ── Fixed costs (always stored as monthly, scaled automatically) ── */
//   const [useInsurance, setUseInsurance] = useState(true);
//   const [insurance, setInsurance] = useState(120);
//   const [useLease, setUseLease] = useState(false);
//   const [lease, setLease] = useState(350);
//   const [useMaint, setUseMaint] = useState(true);
//   const [maint, setMaint] = useState(60);
//   const [useParking, setUseParking] = useState(false);
//   const [parking, setParking] = useState(40);
//   const [usePhone, setUsePhone] = useState(false);
//   const [phone, setPhone] = useState(20);

//   /* ── Analytics ── */
//   const [useTrips, setUseTrips] = useState(false);
//   const [trips, setTrips] = useState(80);
//   const [useHours, setUseHours] = useState(false);
//   const [hours, setHours] = useState(40);
//   const [useGoal, setUseGoal] = useState(false);
//   const [goal, setGoal] = useState(2000);

//   /* Scale monthly to selected period */
//   const scaleMonthly = (m) => (m / 30) * PERIOD_DAYS[period];

//   const handleFuelType = (ft) => {
//     setFuelType(ft);
//     setFuelPrice(FUEL_DEFAULTS[ft].price);
//     setConsumption(FUEL_DEFAULTS[ft].cons);
//   };

//   /* ── CALCULATION ── */
//   const c = useMemo(() => {
//     // Convert each deduction to the current VIEW period
//     const rvAmt = useRV ? convertPeriod(rvAmount, rvPeriod, period) : 0;
//     const carRentScaled = useCarRent
//       ? convertPeriod(carRentAmt, carRentPeriod, period)
//       : 0;
//     const socialAmt = useSocial
//       ? convertPeriod(socialAmount, socialPeriod, period)
//       : 0;

//     const afterDirect = gross - rvAmt - carRentScaled;
//     const ivaAmt = useIva ? afterDirect * 0.06 : 0;
//     const afterIva = afterDirect - ivaAmt;
//     const irsAmt = useIRS ? afterIva * (irsRate / 100) : 0;

//     const taxTotal = ivaAmt + socialAmt + irsAmt;

//     // Fixed operating costs (monthly → period)
//     const insuranceAmt = useInsurance ? scaleMonthly(insurance) : 0;
//     const leaseAmt = useLease ? scaleMonthly(lease) : 0;
//     const maintAmt = useMaint ? scaleMonthly(maint) : 0;
//     const parkingAmt = useParking ? scaleMonthly(parking) : 0;
//     const phoneAmt = usePhone ? scaleMonthly(phone) : 0;
//     const fixedTotal =
//       insuranceAmt + leaseAmt + maintAmt + parkingAmt + phoneAmt;

//     const fuelAmt =
//       useFuel && kmDriven > 0 ? (kmDriven * consumption * fuelPrice) / 100 : 0;
//     const costPerKm = useFuel && kmDriven > 0 ? fuelAmt / kmDriven : 0;

//     const totalExp = rvAmt + carRentScaled + taxTotal + fixedTotal + fuelAmt;
//     const net = gross - totalExp;
//     const keptPct = gross > 0 ? (net / gross) * 100 : 0;

//     // Projections (always from whatever period is selected)
//     const toDaily = (v) => v / PERIOD_DAYS[period];
//     const dailyNet = toDaily(net);
//     const weeklyNet = dailyNet * 7;
//     const monthNet = dailyNet * 30;
//     const yearNet = dailyNet * 365;

//     const avgTrip = useTrips && trips > 0 ? net / trips : null;
//     const hourlyNet = useHours && hours > 0 ? net / hours : null;
//     const goalPct =
//       useGoal && goal > 0 ? Math.min((monthNet / goal) * 100, 100) : null;

//     return {
//       gross,
//       rvAmt,
//       carRentScaled,
//       ivaAmt,
//       socialAmt,
//       irsAmt,
//       taxTotal,
//       insuranceAmt,
//       leaseAmt,
//       maintAmt,
//       parkingAmt,
//       phoneAmt,
//       fixedTotal,
//       fuelAmt,
//       costPerKm,
//       totalExp,
//       net,
//       keptPct,
//       dailyNet,
//       weeklyNet,
//       monthNet,
//       yearNet,
//       avgTrip,
//       hourlyNet,
//       goalPct,
//     };
//   }, [
//     period,
//     gross,
//     useRV,
//     rvAmount,
//     rvPeriod,
//     useCarRent,
//     carRentAmt,
//     carRentPeriod,
//     useIva,
//     useSocial,
//     socialAmount,
//     socialPeriod,
//     useIRS,
//     irsRate,
//     useFuel,
//     fuelType,
//     fuelPrice,
//     kmDriven,
//     consumption,
//     useInsurance,
//     insurance,
//     useLease,
//     lease,
//     useMaint,
//     maint,
//     useParking,
//     parking,
//     usePhone,
//     phone,
//     useTrips,
//     trips,
//     useHours,
//     hours,
//     useGoal,
//     goal,
//   ]);

//   const profit = c.net >= 0;

//   // Bar segments
//   const barSegs = [
//     { val: c.rvAmt, color: S.blue, label: 'Recibo Verde' },
//     { val: c.carRentScaled, color: S.purple, label: 'Car Rent' },
//     { val: c.ivaAmt, color: S.yellow, label: 'IVA' },
//     { val: c.socialAmt, color: S.orange, label: 'Social Sec.' },
//     { val: c.irsAmt, color: S.red, label: 'IRS' },
//     { val: c.fuelAmt, color: '#eab308', label: 'Fuel' },
//     { val: c.fixedTotal, color: S.pink, label: 'Fixed' },
//     { val: Math.max(c.net, 0), color: S.green, label: 'Net' },
//   ].filter((s) => s.val > 0.01);

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap');

//         :root {
//           --bg:         #060911;
//           --card:       #0c1020;
//           --surface2:   #111827;
//           --surface3:   #0d1219;
//           --border:     #1a2540;
//           --text:       #eaf0fc;
//           --muted:      #6b7fa8;
//           --accent:     #10b981;
//           --accent-glow:rgba(16,185,129,0.35);
//           --font:       'Plus Jakarta Sans', sans-serif;
//         }

//         *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
//         html { -webkit-tap-highlight-color: transparent; }
//         body {
//           background: var(--bg);
//           color: var(--text);
//           font-family: var(--font);
//           min-height: 100vh;
//           display: flex;
//           justify-content: center;
//           padding-bottom: env(safe-area-inset-bottom, 20px);
//           background-image:
//             radial-gradient(ellipse 80% 40% at 50% 0%, rgba(16,185,129,0.08), transparent 60%),
//             radial-gradient(ellipse 60% 60% at 90% 90%, rgba(99,102,241,0.05), transparent 60%);
//         }
//         #root {
//           width: 100%;
//           display: flex;
//           justify-content: center;
//         }

//         input[type=number]  { -moz-appearance: textfield; }
//         input[type=number]::-webkit-inner-spin-button,
//         input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }

//         input[type=range] {
//           -webkit-appearance: none; width: 100%;
//           height: 5px; border-radius: 3px;
//           background: var(--border); outline: none; cursor: pointer;
//         }
//         input[type=range]::-webkit-slider-thumb {
//           -webkit-appearance: none; width: 22px; height: 22px;
//           border-radius: 50%; background: var(--accent);
//           border: 3px solid var(--bg); cursor: pointer;
//           box-shadow: 0 0 0 2px var(--accent), 0 2px 8px var(--accent-glow);
//         }

//         button { cursor: pointer; }

//         /* scrollbar */
//         ::-webkit-scrollbar { width: 4px; }
//         ::-webkit-scrollbar-track { background: transparent; }
//         ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

//         .app { max-width: 520px; margin: 0 auto; padding: 0 0.9rem 5rem; }

//         /* Top hero summary bar */
//         .summary-row {
//           display: grid;
//           grid-template-columns: 1fr 1fr 1fr;
//           gap: 0.5rem;
//           margin-bottom: 1rem;
//         }

//         .summary-card {
//           border-radius: 1rem;
//           padding: 0.85rem 0.7rem;
//           text-align: center;
//           border: 1.5px solid;
//         }

//         .proj-row {
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 0.5rem;
//           margin-bottom: 0.8rem;
//         }

//         .fuel-seg { display: flex; border-radius: 0.6rem; overflow: hidden; }
//         .fuel-seg button {
//           flex: 1; padding: 0.65rem 0.3rem;
//           border: 1.5px solid var(--border);
//           background: var(--surface2); color: var(--muted);
//           font-family: var(--font); font-size: 0.72rem; font-weight: 700;
//           text-align: center; transition: all 0.18s;
//         }
//         .fuel-seg button:first-child { border-radius: 0.6rem 0 0 0.6rem; border-right: none; }
//         .fuel-seg button:last-child  { border-radius: 0 0.6rem 0.6rem 0; border-left: none; }
//         .fuel-seg button.active      { background: rgba(245,158,11,0.12); border-color: #f59e0b; color: #f59e0b; }

//         @keyframes slideDown {
//           from { opacity: 0; transform: translateY(-8px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//         .slide-down { animation: slideDown 0.2s ease both; }

//         @keyframes pop {
//           0%   { transform: scale(1); }
//           40%  { transform: scale(1.04); }
//           100% { transform: scale(1); }
//         }
//         .pop { animation: pop 0.3s ease; }
//       `}</style>

//       <div className="app">
//         {/* ══════════ HEADER ══════════ */}
//         <div style={{ textAlign: 'center', padding: '1.8rem 0 1.2rem' }}>
//           <div
//             style={{
//               display: 'inline-flex',
//               alignItems: 'center',
//               gap: '0.4rem',
//               fontSize: '0.62rem',
//               fontWeight: 700,
//               letterSpacing: '0.18em',
//               textTransform: 'uppercase',
//               color: S.green,
//               background: 'rgba(16,185,129,0.09)',
//               border: '1.5px solid rgba(16,185,129,0.22)',
//               padding: '0.3rem 0.9rem',
//               borderRadius: '2rem',
//               marginBottom: '0.85rem',
//             }}
//           >
//             🚗 TVDE Pertugal
//           </div>

//           <h1
//             style={{
//               fontSize: 'clamp(1.7rem,6vw,2.2rem)',
//               fontWeight: 800,
//               letterSpacing: '-0.03em',
//               lineHeight: 1.1,
//               background: 'linear-gradient(135deg, #fff 25%, #10b981 70%)',
//               WebkitBackgroundClip: 'text',
//               WebkitTextFillColor: 'transparent',
//               backgroundClip: 'text',
//             }}
//           >
//             Income Calculator By Khalid Hasan
//           </h1>

//           <p
//             style={{
//               color: 'var(--muted)',
//               fontSize: '0.8rem',
//               marginTop: '0.5rem',
//             }}
//           >
//             Know exactly what you earn and what you spend
//           </p>
//         </div>

//         {/* ══════════ PERIOD SELECTOR ══════════ */}
//         <div
//           style={{
//             display: 'flex',
//             justifyContent: 'center',
//             marginBottom: '1.4rem',
//           }}
//         >
//           <div>
//             <div
//               style={{
//                 fontSize: '0.62rem',
//                 fontWeight: 700,
//                 textTransform: 'uppercase',
//                 letterSpacing: '0.1em',
//                 color: 'var(--muted)',
//                 textAlign: 'center',
//                 marginBottom: '0.4rem',
//               }}
//             >
//               View results by
//             </div>
//             <PeriodPicker value={period} onChange={setPeriod} />
//           </div>
//         </div>

//         {/* ══════════ SUMMARY HERO ══════════ */}
//         <div className="summary-row">
//           {[
//             {
//               icon: '💰',
//               label: 'Earned',
//               val: fmt(c.gross),
//               accent: S.green,
//               border: `${S.green}35`,
//             },
//             {
//               icon: '📤',
//               label: 'Spent',
//               val: fmt(c.totalExp),
//               accent: S.red,
//               border: `${S.red}35`,
//             },
//             {
//               icon: '✅',
//               label: 'Net',
//               val: fmt(c.net),
//               accent: profit ? S.green : S.red,
//               border: profit ? `${S.green}35` : `${S.red}35`,
//             },
//           ].map(({ icon, label, val, accent, border }) => (
//             <div
//               key={label}
//               className="summary-card"
//               style={{
//                 borderColor: border,
//                 background: `${accent}0a`,
//               }}
//             >
//               <div style={{ fontSize: '1.3rem', marginBottom: '0.25rem' }}>
//                 {icon}
//               </div>
//               <div
//                 style={{
//                   fontSize: '0.58rem',
//                   fontWeight: 700,
//                   textTransform: 'uppercase',
//                   letterSpacing: '0.1em',
//                   color: 'var(--muted)',
//                   marginBottom: '0.3rem',
//                 }}
//               >
//                 {label}
//               </div>
//               <div
//                 style={{
//                   fontSize: 'clamp(0.85rem,3.5vw,1.05rem)',
//                   fontWeight: 800,
//                   color: accent,
//                   lineHeight: 1.2,
//                 }}
//               >
//                 {val}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* ══════════ EXPENSE BAR ══════════ */}
//         {c.gross > 0 && (
//           <div
//             style={{
//               background: 'var(--card)',
//               border: '1.5px solid var(--border)',
//               borderRadius: '1rem',
//               padding: '0.9rem 1rem',
//               marginBottom: '1rem',
//             }}
//           >
//             <div
//               style={{
//                 fontSize: '0.62rem',
//                 fontWeight: 700,
//                 textTransform: 'uppercase',
//                 letterSpacing: '0.1em',
//                 color: 'var(--muted)',
//                 marginBottom: '0.55rem',
//               }}
//             >
//               Where your money goes
//             </div>
//             <div
//               style={{
//                 display: 'flex',
//                 height: 18,
//                 borderRadius: '0.4rem',
//                 overflow: 'hidden',
//                 gap: 1.5,
//               }}
//             >
//               {barSegs.map(({ val, color, label }) => (
//                 <div
//                   key={label}
//                   title={`${label}: ${fmt(val)}`}
//                   style={{
//                     width: `${(val / c.gross) * 100}%`,
//                     background: color,
//                     minWidth: 2,
//                     borderRadius: 2,
//                     transition: 'width 0.4s ease',
//                   }}
//                 />
//               ))}
//             </div>
//             <div
//               style={{
//                 display: 'flex',
//                 flexWrap: 'wrap',
//                 gap: '0.3rem 0.75rem',
//                 marginTop: '0.55rem',
//               }}
//             >
//               {barSegs.map(({ val, color, label }) => (
//                 <div
//                   key={label}
//                   style={{
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: '0.28rem',
//                     fontSize: '0.62rem',
//                     color: 'var(--muted)',
//                   }}
//                 >
//                   <div
//                     style={{
//                       width: 8,
//                       height: 8,
//                       borderRadius: 2,
//                       background: color,
//                       flexShrink: 0,
//                     }}
//                   />
//                   {label}{' '}
//                   <span style={{ color }}>
//                     {((val / c.gross) * 100).toFixed(0)}%
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* ══════════ INCOME CARD ══════════ */}
//         <Card
//           title="Gross Income"
//           icon="💰"
//           accent={S.green}
//           badge={fmt(c.gross)}
//         >
//           <NumInput
//             label={`Gross income per ${PERIOD_LABEL[period].toLowerCase()}`}
//             value={gross}
//             onChange={setGross}
//           />
//           <div
//             style={{
//               fontSize: '0.68rem',
//               color: 'var(--muted)',
//               lineHeight: 1.5,
//               paddingBottom: '0.5rem',
//             }}
//           >
//             Enter the total you receive from Uber / Bolt before any deductions.
//           </div>
//         </Card>

//         {/* ══════════ RECIBO VERDE ══════════ */}
//         <Card
//           title="Recibo Verde"
//           icon="🧾"
//           accent={S.blue}
//           badge={useRV ? `-${fmt(c.rvAmt)}` : undefined}
//           badgeColor={S.blue}
//         >
//           <AmountPeriodInput
//             label="Recibo Verde"
//             sub="Receipt issuance fee — fixed amount paid to the operator or AT"
//             on={useRV}
//             onToggle={setUseRV}
//             amount={rvAmount}
//             onAmount={setRvAmount}
//             amtPeriod={rvPeriod}
//             onAmtPeriod={setRvPeriod}
//             accent={S.blue}
//           />
//           {useRV && (
//             <div
//               style={{
//                 display: 'flex',
//                 gap: '0.5rem',
//                 paddingBottom: '0.5rem',
//               }}
//             >
//               <InfoChip
//                 label={`Per ${PERIOD_LABEL[period].toLowerCase()}`}
//                 value={fmt(c.rvAmt)}
//                 color={S.blue}
//               />
//               <InfoChip
//                 label="Per month"
//                 value={fmt(convertPeriod(rvAmount, rvPeriod, 'monthly'))}
//                 color={S.blue}
//               />
//               <InfoChip
//                 label="Per year"
//                 value={fmt(convertPeriod(rvAmount, rvPeriod, 'yearly'))}
//                 color={S.blue}
//               />
//             </div>
//           )}
//         </Card>

//         {/* ══════════ CAR RENT ══════════ */}
//         <Card
//           title="Car Rent Fee"
//           icon="🚘"
//           accent={S.purple}
//           badge={useCarRent ? `-${fmt(c.carRentScaled)}` : undefined}
//           badgeColor={S.purple}
//         >
//           <Switch
//             on={useCarRent}
//             onChange={setUseCarRent}
//             label="Vehicle rental / rent"
//             sub="Monthly cost of the rented TVDE vehicle"
//             accent={S.purple}
//           />
//           {useCarRent && (
//             <div className="slide-down">
//               <div
//                 style={{
//                   marginTop: '0.6rem',
//                   padding: '0.9rem',
//                   background: `${S.purple}0d`,
//                   border: `1.5px solid ${S.purple}30`,
//                   borderRadius: '0.9rem',
//                   marginBottom: '0.5rem',
//                 }}
//               >
//                 <div
//                   style={{
//                     fontSize: '0.62rem',
//                     fontWeight: 700,
//                     textTransform: 'uppercase',
//                     letterSpacing: '0.08em',
//                     color: 'var(--muted)',
//                     marginBottom: '0.4rem',
//                   }}
//                 >
//                   Amount frequency
//                 </div>
//                 <PeriodPicker
//                   value={carRentPeriod}
//                   onChange={setCarRentPeriod}
//                   small
//                 />
//                 <div style={{ marginTop: '0.6rem' }}>
//                   <NumInput
//                     label={`Rent per ${PERIOD_LABEL[carRentPeriod].toLowerCase()}`}
//                     value={carRentAmt}
//                     onChange={setCarRentAmt}
//                   />
//                 </div>
//                 <div
//                   style={{
//                     fontSize: '0.7rem',
//                     color: S.purple,
//                     fontWeight: 600,
//                     textAlign: 'right',
//                   }}
//                 >
//                   ≈ {fmt(convertPeriod(carRentAmt, carRentPeriod, 'monthly'))}
//                   /month &nbsp;·&nbsp;{' '}
//                   {fmt(convertPeriod(carRentAmt, carRentPeriod, 'yearly'))}/year
//                 </div>
//               </div>
//               <div
//                 style={{
//                   display: 'flex',
//                   gap: '0.5rem',
//                   paddingBottom: '0.5rem',
//                 }}
//               >
//                 <InfoChip
//                   label={`Per ${PERIOD_LABEL[period].toLowerCase()}`}
//                   value={fmt(c.carRentScaled)}
//                   color={S.purple}
//                 />
//                 <InfoChip
//                   label="Per month"
//                   value={fmt(
//                     convertPeriod(carRentAmt, carRentPeriod, 'monthly'),
//                   )}
//                   color={S.purple}
//                 />
//                 <InfoChip
//                   label="Per year"
//                   value={fmt(
//                     convertPeriod(carRentAmt, carRentPeriod, 'yearly'),
//                   )}
//                   color={S.purple}
//                 />
//               </div>
//             </div>
//           )}
//         </Card>

//         {/* ══════════ IMPOSTOS ══════════ */}
//         <Card
//           title="Taxes & Contributions"
//           icon="🏛️"
//           accent={S.indigo}
//           badge={`-${fmt(c.taxTotal)}`}
//           badgeColor={S.red}
//         >
//           {/* IVA */}
//           <Switch
//             on={useIva}
//             onChange={setUseIva}
//             accent={S.yellow}
//             label="IVA — 6%"
//             sub="Value Added Tax (TVDE simplified regime)"
//           />
//           {useIva && (
//             <div
//               className="slide-down"
//               style={{
//                 marginLeft: '0.2rem',
//                 marginBottom: '0.5rem',
//                 padding: '0.65rem 0.9rem',
//                 background: 'rgba(245,158,11,0.08)',
//                 border: '1.5px solid rgba(245,158,11,0.25)',
//                 borderRadius: '0.75rem',
//               }}
//             >
//               <div
//                 style={{
//                   display: 'flex',
//                   justifyContent: 'space-between',
//                   fontSize: '0.8rem',
//                 }}
//               >
//                 <span style={{ color: 'var(--muted)' }}>
//                   IVA calculated (6% of income)
//                 </span>
//                 <span style={{ color: S.yellow, fontWeight: 800 }}>
//                   -{fmt(c.ivaAmt)}
//                 </span>
//               </div>
//             </div>
//           )}

//           <Divider />

//           {/* Social Security — MANUAL AMOUNT */}
//           <AmountPeriodInput
//             label="Social Security"
//             sub="Contribuições para a Social Security — introduza o valor exato que paga"
//             on={useSocial}
//             onToggle={setUseSocial}
//             amount={socialAmount}
//             onAmount={setSocialAmount}
//             amtPeriod={socialPeriod}
//             onAmtPeriod={setSocialPeriod}
//             accent={S.orange}
//           />
//           {useSocial && (
//             <div
//               style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}
//             >
//               <InfoChip
//                 label={`Per ${PERIOD_LABEL[period].toLowerCase()}`}
//                 value={fmt(c.socialAmt)}
//                 color={S.orange}
//               />
//               <InfoChip
//                 label="Per month"
//                 value={fmt(
//                   convertPeriod(socialAmount, socialPeriod, 'monthly'),
//                 )}
//                 color={S.orange}
//               />
//               <InfoChip
//                 label="Per year"
//                 value={fmt(convertPeriod(socialAmount, socialPeriod, 'yearly'))}
//                 color={S.orange}
//               />
//             </div>
//           )}

//           <Divider />

//           {/* IRS */}
//           <Switch
//             on={useIRS}
//             onChange={setUseIRS}
//             accent={S.red}
//             label="IRS — Income Tax Withholding"
//             sub="Income tax (estimated rate)"
//           />
//           {useIRS && (
//             <div
//               className="slide-down"
//               style={{
//                 marginLeft: '0.2rem',
//                 marginBottom: '0.5rem',
//                 padding: '0.9rem',
//                 background: 'rgba(239,68,68,0.07)',
//                 border: '1.5px solid rgba(239,68,68,0.25)',
//                 borderRadius: '0.85rem',
//               }}
//             >
//               <div
//                 style={{
//                   display: 'flex',
//                   justifyContent: 'space-between',
//                   fontSize: '0.68rem',
//                   fontWeight: 700,
//                   textTransform: 'uppercase',
//                   letterSpacing: '0.07em',
//                   color: 'var(--muted)',
//                   marginBottom: '0.35rem',
//                 }}
//               >
//                 <span>IRS Rate</span>
//                 <span style={{ color: 'var(--text)' }}>{irsRate}%</span>
//               </div>
//               <input
//                 type="range"
//                 min={5}
//                 max={48}
//                 step={1}
//                 value={irsRate}
//                 onChange={(e) => setIrsRate(Number(e.target.value))}
//                 style={{ accentColor: S.red }}
//               />
//               <div
//                 style={{
//                   display: 'flex',
//                   justifyContent: 'space-between',
//                   fontSize: '0.78rem',
//                   marginTop: '0.5rem',
//                 }}
//               >
//                 <span style={{ color: 'var(--muted)' }}>IRS to pay</span>
//                 <span style={{ color: S.red, fontWeight: 800 }}>
//                   -{fmt(c.irsAmt)}
//                 </span>
//               </div>
//             </div>
//           )}
//           <div style={{ height: '0.4rem' }} />
//         </Card>

//         {/* ══════════ FUEL ══════════ */}
//         <Card
//           title="Fuel"
//           icon="⛽"
//           accent="#f59e0b"
//           badge={useFuel ? `-${fmt(c.fuelAmt)}` : 'Desligado'}
//           badgeColor={useFuel ? S.red : 'var(--muted)'}
//         >
//           <Switch
//             on={useFuel}
//             onChange={setUseFuel}
//             accent="#f59e0b"
//             label="Include fuel costs"
//           />
//           {useFuel && (
//             <div className="slide-down">
//               <div
//                 className="fuel-seg"
//                 style={{ marginBottom: '0.9rem', marginTop: '0.4rem' }}
//               >
//                 {['diesel', 'petrol', 'electric'].map((ft) => (
//                   <button
//                     key={ft}
//                     className={fuelType === ft ? 'active' : ''}
//                     onClick={() => handleFuelType(ft)}
//                   >
//                     {ft === 'electric'
//                       ? '⚡ Electric'
//                       : ft === 'diesel'
//                         ? '🛢 Diesel'
//                         : '⛽ Petrol'}
//                   </button>
//                 ))}
//               </div>
//               <NumInput
//                 label={
//                   fuelType === 'electric'
//                     ? 'Price per kWh (€)'
//                     : 'Price per litre (€)'
//                 }
//                 value={fuelPrice}
//                 onChange={setFuelPrice}
//                 step={0.01}
//               />
//               <NumInput
//                 label={`KM driven per ${PERIOD_LABEL[period].toLowerCase()}`}
//                 value={kmDriven}
//                 onChange={setKmDriven}
//                 prefix="km"
//                 step={10}
//               />
//               <div style={{ marginBottom: '0.9rem' }}>
//                 <div
//                   style={{
//                     display: 'flex',
//                     justifyContent: 'space-between',
//                     fontSize: '0.68rem',
//                     fontWeight: 700,
//                     textTransform: 'uppercase',
//                     letterSpacing: '0.07em',
//                     color: 'var(--muted)',
//                     marginBottom: '0.3rem',
//                   }}
//                 >
//                   <span>Consumption ({FUEL_DEFAULTS[fuelType].unit})</span>
//                   <span style={{ color: 'var(--text)' }}>{consumption}</span>
//                 </div>
//                 <input
//                   type="range"
//                   min={fuelType === 'electric' ? 10 : 4}
//                   max={fuelType === 'electric' ? 30 : 15}
//                   step={0.1}
//                   value={consumption}
//                   onChange={(e) => setConsumption(Number(e.target.value))}
//                   style={{ accentColor: '#f59e0b' }}
//                 />
//               </div>
//               <div
//                 style={{
//                   display: 'flex',
//                   gap: '0.5rem',
//                   marginBottom: '0.5rem',
//                 }}
//               >
//                 <InfoChip
//                   label="Total fuel"
//                   value={fmt(c.fuelAmt)}
//                   color="#f59e0b"
//                 />
//                 <InfoChip
//                   label="Cost per km"
//                   value={fmt(c.costPerKm)}
//                   color="#f59e0b"
//                 />
//               </div>
//             </div>
//           )}
//         </Card>

//         {/* ══════════ FIXED COSTS ══════════ */}
//         <Card
//           title="Fixed Monthly Costs"
//           icon="📋"
//           accent={S.pink}
//           badge={`-${fmt(c.fixedTotal)}`}
//           badgeColor={S.red}
//         >
//           <div
//             style={{
//               fontSize: '0.68rem',
//               color: 'var(--muted)',
//               padding: '0.5rem 0.7rem',
//               background: `${S.pink}0a`,
//               border: `1px solid ${S.pink}25`,
//               borderRadius: '0.6rem',
//               marginBottom: '0.8rem',
//               lineHeight: 1.5,
//             }}
//           >
//             💡 Enter monthly values — automatically converted to the selected
//             period
//           </div>

//           {[
//             {
//               use: useInsurance,
//               setUse: setUseInsurance,
//               val: insurance,
//               setVal: setInsurance,
//               label: 'TVDE Insurance',
//               sub: 'Mandatory insurance for TVDE drivers',
//               accent: S.pink,
//             },
//             {
//               use: useLease,
//               setUse: setUseLease,
//               val: lease,
//               setVal: setLease,
//               label: 'Car loan / lease',
//               sub: 'Monthly car leasing / loan payment',
//               accent: S.pink,
//             },
//             {
//               use: useMaint,
//               setUse: setUseMaint,
//               val: maint,
//               setVal: setMaint,
//               label: 'Car maintenance',
//               sub: 'Tyres, oil, service (monthly average)',
//               accent: S.pink,
//             },
//             {
//               use: useParking,
//               setUse: setUseParking,
//               val: parking,
//               setVal: setParking,
//               label: 'Parking / tolls',
//               sub: 'Average monthly costs',
//               accent: S.pink,
//             },
//             {
//               use: usePhone,
//               setUse: setUsePhone,
//               val: phone,
//               setVal: setPhone,
//               label: 'Phone / data plan',
//               sub: 'Plan for GPS and apps (monthly)',
//               accent: S.pink,
//             },
//           ].map(({ use, setUse, val, setVal, label, sub, accent }) => (
//             <div key={label}>
//               <Switch
//                 on={use}
//                 onChange={setUse}
//                 label={label}
//                 sub={sub}
//                 accent={accent}
//               />
//               {use && (
//                 <div
//                   className="slide-down"
//                   style={{ paddingLeft: '0.5rem', marginBottom: '0.5rem' }}
//                 >
//                   <NumInput
//                     label="Monthly cost"
//                     value={val}
//                     onChange={setVal}
//                     hint={`≈ ${fmt((val / 30) * PERIOD_DAYS[period])} per ${PERIOD_LABEL[period].toLowerCase()}`}
//                   />
//                 </div>
//               )}
//             </div>
//           ))}
//         </Card>

//         {/* ══════════ RESUMO COMPLETO ══════════ */}
//         <Card title="Full Breakdown" icon="📊" accent={S.slate}>
//           <DeductRow
//             label="Gross income"
//             amount={fmt(c.gross)}
//             color={S.green}
//             bold
//           />

//           {(useRV || useCarRent) && (
//             <>
//               <div
//                 style={{
//                   fontSize: '0.6rem',
//                   fontWeight: 700,
//                   textTransform: 'uppercase',
//                   letterSpacing: '0.1em',
//                   color: 'var(--muted)',
//                   padding: '0.45rem 0 0.1rem',
//                 }}
//               >
//                 Direct Deductions
//               </div>
//               {useRV && (
//                 <DeductRow
//                   label="Recibo Verde"
//                   amount={`-${fmt(c.rvAmt)}`}
//                   color={S.blue}
//                 />
//               )}
//               {useCarRent && (
//                 <DeductRow
//                   label="Car rent"
//                   amount={`-${fmt(c.carRentScaled)}`}
//                   color={S.purple}
//                 />
//               )}
//             </>
//           )}

//           {(useIva || useSocial || useIRS) && (
//             <>
//               <div
//                 style={{
//                   fontSize: '0.6rem',
//                   fontWeight: 700,
//                   textTransform: 'uppercase',
//                   letterSpacing: '0.1em',
//                   color: 'var(--muted)',
//                   padding: '0.45rem 0 0.1rem',
//                 }}
//               >
//                 Taxes
//               </div>
//               {useIva && (
//                 <DeductRow
//                   label="IVA (6%)"
//                   amount={`-${fmt(c.ivaAmt)}`}
//                   color={S.yellow}
//                 />
//               )}
//               {useSocial && (
//                 <DeductRow
//                   label="Social Security"
//                   amount={`-${fmt(c.socialAmt)}`}
//                   color={S.orange}
//                 />
//               )}
//               {useIRS && (
//                 <DeductRow
//                   label={`IRS (${irsRate}%)`}
//                   amount={`-${fmt(c.irsAmt)}`}
//                   color={S.red}
//                 />
//               )}
//             </>
//           )}

//           {(useFuel ||
//             useInsurance ||
//             useLease ||
//             useMaint ||
//             useParking ||
//             usePhone) && (
//             <>
//               <div
//                 style={{
//                   fontSize: '0.6rem',
//                   fontWeight: 700,
//                   textTransform: 'uppercase',
//                   letterSpacing: '0.1em',
//                   color: 'var(--muted)',
//                   padding: '0.45rem 0 0.1rem',
//                 }}
//               >
//                 Operating Costs
//               </div>
//               {useFuel && (
//                 <DeductRow
//                   label="Fuel"
//                   amount={`-${fmt(c.fuelAmt)}`}
//                   color="#eab308"
//                   sub={`${kmDriven} km · ${fmt(c.costPerKm)}/km`}
//                 />
//               )}
//               {useInsurance && (
//                 <DeductRow
//                   label="TVDE Insurance"
//                   amount={`-${fmt(c.insuranceAmt)}`}
//                   color={S.pink}
//                 />
//               )}
//               {useLease && (
//                 <DeductRow
//                   label="Car loan / lease"
//                   amount={`-${fmt(c.leaseAmt)}`}
//                   color={S.pink}
//                 />
//               )}
//               {useMaint && (
//                 <DeductRow
//                   label="Maintenance"
//                   amount={`-${fmt(c.maintAmt)}`}
//                   color={S.pink}
//                 />
//               )}
//               {useParking && (
//                 <DeductRow
//                   label="Estac. / portagens"
//                   amount={`-${fmt(c.parkingAmt)}`}
//                   color={S.pink}
//                 />
//               )}
//               {usePhone && (
//                 <DeductRow
//                   label="Phone plan"
//                   amount={`-${fmt(c.phoneAmt)}`}
//                   color={S.pink}
//                 />
//               )}
//             </>
//           )}

//           <DeductRow
//             label="Total expenses"
//             amount={`-${fmt(c.totalExp)}`}
//             color={S.red}
//             bold
//           />

//           {/* Net take-home big box */}
//           <div
//             style={{
//               marginTop: '0.7rem',
//               padding: '1.1rem',
//               background: profit
//                 ? 'rgba(16,185,129,0.08)'
//                 : 'rgba(239,68,68,0.08)',
//               border: `2px solid ${profit ? `${S.green}35` : `${S.red}35`}`,
//               borderRadius: '1rem',
//             }}
//           >
//             <div
//               style={{
//                 display: 'flex',
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//               }}
//             >
//               <div>
//                 <div
//                   style={{
//                     fontSize: '0.65rem',
//                     fontWeight: 800,
//                     textTransform: 'uppercase',
//                     letterSpacing: '0.1em',
//                     color: 'var(--muted)',
//                   }}
//                 >
//                   Net Income
//                 </div>
//                 <div
//                   style={{
//                     fontSize: '0.65rem',
//                     color: 'var(--muted)',
//                     marginTop: '0.2rem',
//                   }}
//                 >
//                   {c.keptPct.toFixed(1)}% of gross you keep
//                 </div>
//               </div>
//               <div
//                 style={{
//                   fontSize: 'clamp(1.5rem,6vw,2rem)',
//                   fontWeight: 800,
//                   color: profit ? S.green : S.red,
//                 }}
//               >
//                 {fmt(c.net)}
//               </div>
//             </div>
//           </div>
//           <div style={{ height: '0.5rem' }} />
//         </Card>

//         {/* ══════════ PROJEÇÕES ══════════ */}
//         <Card title="Projections" icon="📈" accent={S.blue}>
//           <div className="proj-row">
//             {[
//               { l: 'Per day', v: fmt(c.dailyNet) },
//               { l: 'Per week', v: fmt(c.weeklyNet) },
//               { l: 'Per month', v: fmt(c.monthNet) },
//               { l: 'Per year', v: fmt(c.yearNet) },
//             ].map(({ l, v }) => (
//               <div
//                 key={l}
//                 style={{
//                   background: 'var(--surface2)',
//                   border: '1.5px solid var(--border)',
//                   borderRadius: '0.9rem',
//                   padding: '0.85rem',
//                 }}
//               >
//                 <div
//                   style={{
//                     fontSize: '0.6rem',
//                     fontWeight: 700,
//                     textTransform: 'uppercase',
//                     letterSpacing: '0.1em',
//                     color: 'var(--muted)',
//                     marginBottom: '0.3rem',
//                   }}
//                 >
//                   {l}
//                 </div>
//                 <div
//                   style={{
//                     fontSize: '1.05rem',
//                     fontWeight: 800,
//                     color: S.blue,
//                   }}
//                 >
//                   {v}
//                 </div>
//               </div>
//             ))}
//           </div>
//           <div style={{ height: '0.3rem' }} />
//         </Card>

//         {/* ══════════ ANALYTICS ══════════ */}
//         <Card title="Detailed Analytics" icon="🔍" accent={S.indigo}>
//           {/* Trips */}
//           <Switch
//             on={useTrips}
//             onChange={setUseTrips}
//             accent={S.indigo}
//             label="Trip analytics"
//             sub="Calculate average earnings per trip"
//           />
//           {useTrips && (
//             <div
//               className="slide-down"
//               style={{ paddingLeft: '0.2rem', marginBottom: '0.5rem' }}
//             >
//               <NumInput
//                 label={`Number of trips per ${PERIOD_LABEL[period].toLowerCase()}`}
//                 value={trips}
//                 onChange={setTrips}
//                 prefix="🚗"
//               />
//               <div
//                 style={{
//                   display: 'flex',
//                   gap: '0.5rem',
//                   marginBottom: '0.5rem',
//                 }}
//               >
//                 <InfoChip
//                   label="Net / trip"
//                   value={c.avgTrip !== null ? fmt(c.avgTrip) : '—'}
//                   color={S.indigo}
//                 />
//                 <InfoChip
//                   label="Gross / trip"
//                   value={trips > 0 ? fmt(c.gross / trips) : '—'}
//                   color="var(--muted)"
//                 />
//               </div>
//             </div>
//           )}

//           <Divider />

//           {/* Hours */}
//           <Switch
//             on={useHours}
//             onChange={setUseHours}
//             accent={S.indigo}
//             label="Hourly rate"
//             sub="Calculate the real value of your working hour"
//           />
//           {useHours && (
//             <div
//               className="slide-down"
//               style={{ paddingLeft: '0.2rem', marginBottom: '0.5rem' }}
//             >
//               <NumInput
//                 label={`Hours worked per ${PERIOD_LABEL[period].toLowerCase()}`}
//                 value={hours}
//                 onChange={setHours}
//                 prefix="⏱"
//               />
//               <div
//                 style={{
//                   display: 'flex',
//                   gap: '0.5rem',
//                   marginBottom: '0.5rem',
//                 }}
//               >
//                 <InfoChip
//                   label="Net / hour"
//                   value={c.hourlyNet !== null ? `${fmt(c.hourlyNet)}/h` : '—'}
//                   color={S.indigo}
//                 />
//                 <InfoChip
//                   label="Gross / hour"
//                   value={hours > 0 ? `${fmt(c.gross / hours)}/h` : '—'}
//                   color="var(--muted)"
//                 />
//               </div>
//             </div>
//           )}

//           <Divider />

//           {/* Goal */}
//           <Switch
//             on={useGoal}
//             onChange={setUseGoal}
//             accent={S.green}
//             label="Monthly goal"
//             sub="Track progress towards your goal"
//           />
//           {useGoal && (
//             <div
//               className="slide-down"
//               style={{ paddingLeft: '0.2rem', marginBottom: '0.5rem' }}
//             >
//               <NumInput
//                 label="Monthly goal (€)"
//                 value={goal}
//                 onChange={setGoal}
//               />
//               <div
//                 style={{
//                   display: 'flex',
//                   justifyContent: 'space-between',
//                   fontSize: '0.75rem',
//                   marginBottom: '0.45rem',
//                 }}
//               >
//                 <span style={{ color: 'var(--muted)' }}>
//                   Progress to {fmt(goal)}/month
//                 </span>
//                 <span style={{ color: S.green, fontWeight: 800 }}>
//                   {c.goalPct !== null ? `${c.goalPct.toFixed(0)}%` : '—'}
//                 </span>
//               </div>
//               <div
//                 style={{
//                   height: 12,
//                   background: 'var(--surface3)',
//                   borderRadius: 6,
//                   overflow: 'hidden',
//                   border: '1px solid var(--border)',
//                 }}
//               >
//                 <div
//                   style={{
//                     height: '100%',
//                     borderRadius: 6,
//                     background: `linear-gradient(90deg, ${S.indigo}, ${S.green})`,
//                     width: `${c.goalPct ?? 0}%`,
//                     transition: 'width 0.4s ease',
//                     boxShadow: '0 0 12px rgba(16,185,129,0.4)',
//                   }}
//                 />
//               </div>
//               <div
//                 style={{
//                   fontSize: '0.68rem',
//                   color: 'var(--muted)',
//                   marginTop: '0.4rem',
//                   textAlign: 'right',
//                 }}
//               >
//                 Current monthly estimate:{' '}
//                 <strong style={{ color: S.green }}>{fmt(c.monthNet)}</strong>
//               </div>
//             </div>
//           )}
//           <div style={{ height: '0.3rem' }} />
//         </Card>

//         {/* Footer */}
//         <div
//           style={{
//             textAlign: 'center',
//             color: 'var(--muted)',
//             fontSize: '0.62rem',
//             marginTop: '1rem',
//             lineHeight: 1.7,
//             padding: '0 1rem',
//           }}
//         >
//           🔒 All data stays on your device — nothing is sent to servers
//           <br />
//           Indicative values only · Consult a certified accountant (TOC) for
//           official filings
//         </div>
//       </div>
//     </>
//   );
// }

// import { useState, useMemo } from 'react';

// /* ─────────────────────────────────────────
//    HELPERS
// ───────────────────────────────────────── */
// const fmt = (n) =>
//   new Intl.NumberFormat('pt-PT', {
//     style: 'currency',
//     currency: 'EUR',
//     minimumFractionDigits: 2,
//   }).format(isNaN(n) || !isFinite(n) ? 0 : n);

// const PERIOD_DAYS = { daily: 1, weekly: 7, monthly: 30, yearly: 365 };
// const PERIOD_LABEL = {
//   daily: 'Day',
//   weekly: 'Week',
//   monthly: 'Month',
//   yearly: 'Year',
// };

// const FUEL_DEFAULTS = {
//   diesel: { price: 1.65, cons: 6.5, unit: 'L/100km' },
//   petrol: { price: 1.8, cons: 7.5, unit: 'L/100km' },
//   electric: { price: 0.04, cons: 18, unit: 'kWh/100km' },
// };

// // Convert any amount entered in "fromPeriod" to the main selected period
// const convertPeriod = (amount, fromPeriod, toPeriod) => {
//   if (!amount) return 0;
//   const daily = amount / PERIOD_DAYS[fromPeriod];
//   return daily * PERIOD_DAYS[toPeriod];
// };

// /* ─────────────────────────────────────────
//    REUSABLE COMPONENTS
// ───────────────────────────────────────── */
// const S = {
//   // Colours
//   green: '#10b981',
//   red: '#ef4444',
//   blue: '#06b6d4',
//   purple: '#8b5cf6',
//   orange: '#f97316',
//   yellow: '#f59e0b',
//   indigo: '#6366f1',
//   pink: '#ec4899',
//   slate: '#64748b',
// };

// function PeriodPicker({ value, onChange, small = false }) {
//   return (
//     <div
//       style={{
//         display: 'inline-flex',
//         background: 'var(--surface2)',
//         borderRadius: '0.6rem',
//         padding: '0.18rem',
//         gap: '0.15rem',
//       }}
//     >
//       {Object.keys(PERIOD_DAYS).map((p) => (
//         <button
//           key={p}
//           onClick={() => onChange(p)}
//           style={{
//             padding: small ? '0.25rem 0.55rem' : '0.35rem 0.8rem',
//             borderRadius: '0.45rem',
//             border: 'none',
//             cursor: 'pointer',
//             fontSize: small ? '0.62rem' : '0.7rem',
//             fontWeight: 700,
//             fontFamily: 'inherit',
//             textTransform: 'capitalize',
//             background: value === p ? 'var(--accent)' : 'transparent',
//             color: value === p ? '#000' : 'var(--muted)',
//             transition: 'all 0.18s',
//             boxShadow: value === p ? '0 2px 8px var(--accent-glow)' : 'none',
//           }}
//         >
//           {PERIOD_LABEL[p]}
//         </button>
//       ))}
//     </div>
//   );
// }

// function NumInput({
//   label,
//   value,
//   onChange,
//   prefix = '€',
//   step = 1,
//   min = 0,
//   placeholder = '0',
// }) {
//   return (
//     <div style={{ marginBottom: '0.85rem' }}>
//       {label && (
//         <label
//           style={{
//             display: 'block',
//             fontSize: '0.68rem',
//             fontWeight: 700,
//             textTransform: 'uppercase',
//             letterSpacing: '0.07em',
//             color: 'var(--muted)',
//             marginBottom: '0.3rem',
//           }}
//         >
//           {label}
//         </label>
//       )}
//       <div
//         style={{
//           display: 'flex',
//           borderRadius: '0.65rem',
//           border: '1.5px solid var(--border)',
//           overflow: 'hidden',
//           background: 'var(--surface2)',
//           transition: 'border-color 0.2s',
//         }}
//       >
//         <span
//           style={{
//             padding: '0.7rem 0.9rem',
//             fontSize: '0.82rem',
//             color: 'var(--muted)',
//             background: 'var(--surface3)',
//             borderRight: '1.5px solid var(--border)',
//             whiteSpace: 'nowrap',
//             display: 'flex',
//             alignItems: 'center',
//             minWidth: 42,
//             justifyContent: 'center',
//           }}
//         >
//           {prefix}
//         </span>
//         <input
//           type="number"
//           value={value || ''}
//           min={min}
//           step={step}
//           placeholder={placeholder}
//           onChange={(e) => onChange(Number(e.target.value))}
//           style={{
//             flex: 1,
//             background: 'transparent',
//             border: 'none',
//             outline: 'none',
//             color: 'var(--text)',
//             fontFamily: 'inherit',
//             fontSize: '1rem',
//             fontWeight: 600,
//             padding: '0.7rem 0.9rem',
//             width: '100%',
//           }}
//         />
//       </div>
//     </div>
//   );
// }

// function Switch({ on, onChange, label, sub, accent = 'var(--accent)' }) {
//   return (
//     <div
//       onClick={() => onChange(!on)}
//       style={{
//         display: 'flex',
//         alignItems: 'flex-start',
//         gap: '0.8rem',
//         cursor: 'pointer',
//         userSelect: 'none',
//         padding: '0.5rem 0',
//       }}
//     >
//       <div
//         style={{
//           width: 46,
//           height: 26,
//           borderRadius: 13,
//           flexShrink: 0,
//           marginTop: 1,
//           background: on ? accent : 'var(--surface3)',
//           border: `2px solid ${on ? accent : 'var(--border)'}`,
//           position: 'relative',
//           transition: 'all 0.22s',
//           boxShadow: on ? `0 0 14px ${accent}55` : 'none',
//         }}
//       >
//         <div
//           style={{
//             position: 'absolute',
//             top: 2,
//             left: on ? 20 : 2,
//             width: 18,
//             height: 18,
//             borderRadius: '50%',
//             background: '#fff',
//             transition: 'left 0.22s',
//             boxShadow: '0 1px 5px rgba(0,0,0,0.35)',
//           }}
//         />
//       </div>
//       <div style={{ flex: 1 }}>
//         <div
//           style={{
//             fontSize: '0.88rem',
//             color: 'var(--text)',
//             fontWeight: 600,
//             lineHeight: 1.3,
//           }}
//         >
//           {label}
//         </div>
//         {sub && (
//           <div
//             style={{
//               fontSize: '0.7rem',
//               color: 'var(--muted)',
//               marginTop: '0.15rem',
//               lineHeight: 1.4,
//             }}
//           >
//             {sub}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// function Card({ title, icon, accent, badge, badgeColor, children }) {
//   return (
//     <div
//       style={{
//         background: 'var(--card)',
//         border: '1.5px solid var(--border)',
//         borderRadius: '1.25rem',
//         overflow: 'hidden',
//         marginBottom: '1rem',
//         boxShadow: '0 4px 28px rgba(0,0,0,0.22)',
//       }}
//     >
//       {/* Card header */}
//       <div
//         style={{
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           padding: '0.9rem 1.1rem',
//           background: `linear-gradient(135deg, ${accent}15 0%, transparent 70%)`,
//           borderBottom: '1.5px solid var(--border)',
//         }}
//       >
//         <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
//           <div
//             style={{
//               width: 34,
//               height: 34,
//               borderRadius: '0.6rem',
//               background: `${accent}22`,
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               fontSize: '1.05rem',
//             }}
//           >
//             {icon}
//           </div>
//           <span
//             style={{
//               fontWeight: 800,
//               fontSize: '0.78rem',
//               textTransform: 'uppercase',
//               letterSpacing: '0.1em',
//               color: accent,
//             }}
//           >
//             {title}
//           </span>
//         </div>
//         {badge && (
//           <span
//             style={{
//               fontSize: '0.88rem',
//               fontWeight: 800,
//               color: badgeColor || accent,
//               background: `${badgeColor || accent}15`,
//               padding: '0.2rem 0.6rem',
//               borderRadius: '0.4rem',
//             }}
//           >
//             {badge}
//           </span>
//         )}
//       </div>
//       <div style={{ padding: '1.1rem 1.1rem 0.5rem' }}>{children}</div>
//     </div>
//   );
// }

// function Divider() {
//   return (
//     <div
//       style={{ height: 1, background: 'var(--border)', margin: '0.6rem 0' }}
//     />
//   );
// }

// function DeductRow({ label, amount, color, sub, bold }) {
//   return (
//     <div
//       style={{
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'flex-start',
//         padding: '0.55rem 0',
//         borderBottom: '1px solid var(--surface3)',
//       }}
//     >
//       <div>
//         <div
//           style={{
//             fontSize: bold ? '0.85rem' : '0.78rem',
//             fontWeight: bold ? 700 : 500,
//             color: bold ? 'var(--text)' : 'var(--muted)',
//           }}
//         >
//           {label}
//         </div>
//         {sub && (
//           <div
//             style={{
//               fontSize: '0.62rem',
//               color: 'var(--muted)',
//               marginTop: '0.1rem',
//             }}
//           >
//             {sub}
//           </div>
//         )}
//       </div>
//       <div
//         style={{
//           fontSize: bold ? '0.98rem' : '0.85rem',
//           fontWeight: bold ? 800 : 600,
//           color,
//           whiteSpace: 'nowrap',
//           marginLeft: '0.5rem',
//         }}
//       >
//         {amount}
//       </div>
//     </div>
//   );
// }

// function InfoChip({ label, value, color, bg }) {
//   return (
//     <div
//       style={{
//         flex: 1,
//         background: bg || 'var(--surface2)',
//         border: '1.5px solid var(--border)',
//         borderRadius: '0.85rem',
//         padding: '0.75rem 0.85rem',
//         minWidth: 0,
//       }}
//     >
//       <div
//         style={{
//           fontSize: '0.6rem',
//           fontWeight: 700,
//           textTransform: 'uppercase',
//           letterSpacing: '0.1em',
//           color: 'var(--muted)',
//           marginBottom: '0.3rem',
//         }}
//       >
//         {label}
//       </div>
//       <div
//         style={{
//           fontSize: '1.05rem',
//           fontWeight: 800,
//           color: color || 'var(--text)',
//           lineHeight: 1.2,
//         }}
//       >
//         {value}
//       </div>
//     </div>
//   );
// }

// /* ─────────────────────────────────────────
//    AMOUNT + PERIOD INPUT (for Recibo Verde & Social)
// ───────────────────────────────────────── */
// function AmountPeriodInput({
//   label,
//   sub,
//   on,
//   onToggle,
//   amount,
//   onAmount,
//   amtPeriod,
//   onAmtPeriod,
//   accent,
// }) {
//   return (
//     <div style={{ marginBottom: '0.5rem' }}>
//       <Switch
//         on={on}
//         onChange={onToggle}
//         label={label}
//         sub={sub}
//         accent={accent}
//       />
//       {on && (
//         <div
//           style={{
//             marginTop: '0.3rem',
//             marginLeft: '0.2rem',
//             padding: '0.9rem',
//             background: `${accent}0d`,
//             border: `1.5px solid ${accent}30`,
//             borderRadius: '0.9rem',
//             marginBottom: '0.5rem',
//           }}
//         >
//           {/* Period picker */}
//           <div style={{ marginBottom: '0.6rem' }}>
//             <div
//               style={{
//                 fontSize: '0.62rem',
//                 fontWeight: 700,
//                 textTransform: 'uppercase',
//                 letterSpacing: '0.08em',
//                 color: 'var(--muted)',
//                 marginBottom: '0.4rem',
//               }}
//             >
//               Amount frequency
//             </div>
//             <PeriodPicker value={amtPeriod} onChange={onAmtPeriod} small />
//           </div>
//           {/* Amount input */}
//           <NumInput
//             label={`Amount per ${PERIOD_LABEL[amtPeriod].toLowerCase()}`}
//             value={amount}
//             onChange={onAmount}
//           />
//           <div
//             style={{
//               fontSize: '0.7rem',
//               color: accent,
//               fontWeight: 600,
//               textAlign: 'right',
//             }}
//           >
//             ≈ {fmt(convertPeriod(amount, amtPeriod, 'monthly'))}/month
//             &nbsp;·&nbsp; {fmt(convertPeriod(amount, amtPeriod, 'yearly'))}/year
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// /* ─────────────────────────────────────────
//    MAIN APP
// ───────────────────────────────────────── */
// export default function TVDECalc() {
//   /* Period for the main calculator view */
//   const [period, setPeriod] = useState('weekly');

//   /* ── Income ── */
//   const [gross, setGross] = useState(900);

//   /* ── Recibo Verde ── */
//   const [useRV, setUseRV] = useState(false);
//   const [rvAmount, setRvAmount] = useState(0);
//   const [rvPeriod, setRvPeriod] = useState('monthly');

//   /* ── Car Rent ── */
//   const [useCarRent, setUseCarRent] = useState(false);
//   const [carRentAmt, setCarRentAmt] = useState(0);
//   const [carRentPeriod, setCarRentPeriod] = useState('monthly');

//   /* ── IVA ── */
//   const [useIva, setUseIva] = useState(false);

//   /* ── Social Security ── */
//   const [useSocial, setUseSocial] = useState(false);
//   const [socialAmount, setSocialAmount] = useState(0);
//   const [socialPeriod, setSocialPeriod] = useState('monthly');

//   /* ── IRS ── */
//   const [useIRS, setUseIRS] = useState(false);
//   const [irsRate, setIrsRate] = useState(15);

//   /* ── Fuel ── */
//   const [useFuel, setUseFuel] = useState(true);
//   const [fuelMode, setFuelMode] = useState('calculate');
//   const [fuelDirectAmt, setFuelDirectAmt] = useState(0);
//   const [fuelDirectPeriod, setFuelDirectPeriod] = useState('monthly');
//   const [fuelType, setFuelType] = useState('diesel');
//   const [fuelPrice, setFuelPrice] = useState(1.65);
//   const [kmDriven, setKmDriven] = useState(700);
//   const [consumption, setConsumption] = useState(6.5);

//   /* ── Fixed costs (always stored as monthly, scaled automatically) ── */
//   const [useInsurance, setUseInsurance] = useState(true);
//   const [insurance, setInsurance] = useState(120);
//   const [useLease, setUseLease] = useState(false);
//   const [lease, setLease] = useState(350);
//   const [useMaint, setUseMaint] = useState(true);
//   const [maint, setMaint] = useState(60);
//   const [useParking, setUseParking] = useState(false);
//   const [parking, setParking] = useState(40);
//   const [usePhone, setUsePhone] = useState(false);
//   const [phone, setPhone] = useState(20);

//   /* ── Analytics ── */
//   const [useTrips, setUseTrips] = useState(false);
//   const [trips, setTrips] = useState(80);
//   const [useHours, setUseHours] = useState(false);
//   const [hours, setHours] = useState(40);
//   const [useGoal, setUseGoal] = useState(false);
//   const [goal, setGoal] = useState(2000);

//   /* Scale monthly to selected period */
//   const scaleMonthly = (m) => (m / 30) * PERIOD_DAYS[period];

//   const handleFuelType = (ft) => {
//     setFuelType(ft);
//     setFuelPrice(FUEL_DEFAULTS[ft].price);
//     setConsumption(FUEL_DEFAULTS[ft].cons);
//   };

//   /* ── CALCULATION ── */
//   const c = useMemo(() => {
//     // Convert each deduction to the current VIEW period
//     const rvAmt = useRV ? convertPeriod(rvAmount, rvPeriod, period) : 0;
//     const carRentScaled = useCarRent
//       ? convertPeriod(carRentAmt, carRentPeriod, period)
//       : 0;
//     const socialAmt = useSocial
//       ? convertPeriod(socialAmount, socialPeriod, period)
//       : 0;

//     const afterDirect = gross - rvAmt - carRentScaled;
//     const ivaAmt = useIva ? afterDirect * 0.06 : 0;
//     const afterIva = afterDirect - ivaAmt;
//     const irsAmt = useIRS ? afterIva * (irsRate / 100) : 0;

//     const taxTotal = ivaAmt + socialAmt + irsAmt;

//     // Fixed operating costs (monthly → period)
//     const insuranceAmt = useInsurance ? scaleMonthly(insurance) : 0;
//     const leaseAmt = useLease ? scaleMonthly(lease) : 0;
//     const maintAmt = useMaint ? scaleMonthly(maint) : 0;
//     const parkingAmt = useParking ? scaleMonthly(parking) : 0;
//     const phoneAmt = usePhone ? scaleMonthly(phone) : 0;
//     const fixedTotal =
//       insuranceAmt + leaseAmt + maintAmt + parkingAmt + phoneAmt;

//     const fuelCalcAmt =
//       fuelMode === 'calculate' && kmDriven > 0
//         ? (kmDriven * consumption * fuelPrice) / 100
//         : 0;
//     const fuelDirectScaled =
//       fuelMode === 'direct'
//         ? convertPeriod(fuelDirectAmt, fuelDirectPeriod, period)
//         : 0;
//     const fuelAmt = useFuel
//       ? fuelMode === 'calculate'
//         ? fuelCalcAmt
//         : fuelDirectScaled
//       : 0;
//     const costPerKm =
//       fuelMode === 'calculate' && kmDriven > 0 && useFuel
//         ? fuelAmt / kmDriven
//         : 0;

//     const totalExp = rvAmt + carRentScaled + taxTotal + fixedTotal + fuelAmt;
//     const net = gross - totalExp;
//     const keptPct = gross > 0 ? (net / gross) * 100 : 0;

//     // Projections (always from whatever period is selected)
//     const toDaily = (v) => v / PERIOD_DAYS[period];
//     const dailyNet = toDaily(net);
//     const weeklyNet = dailyNet * 7;
//     const monthNet = dailyNet * 30;
//     const yearNet = dailyNet * 365;

//     const avgTrip = useTrips && trips > 0 ? net / trips : null;
//     const hourlyNet = useHours && hours > 0 ? net / hours : null;
//     const goalPct =
//       useGoal && goal > 0 ? Math.min((monthNet / goal) * 100, 100) : null;

//     return {
//       gross,
//       rvAmt,
//       carRentScaled,
//       ivaAmt,
//       socialAmt,
//       irsAmt,
//       taxTotal,
//       insuranceAmt,
//       leaseAmt,
//       maintAmt,
//       parkingAmt,
//       phoneAmt,
//       fixedTotal,
//       fuelAmt,
//       costPerKm,
//       totalExp,
//       net,
//       keptPct,
//       dailyNet,
//       weeklyNet,
//       monthNet,
//       yearNet,
//       avgTrip,
//       hourlyNet,
//       goalPct,
//     };
//   }, [
//     period,
//     gross,
//     useRV,
//     rvAmount,
//     rvPeriod,
//     useCarRent,
//     carRentAmt,
//     carRentPeriod,
//     useIva,
//     useSocial,
//     socialAmount,
//     socialPeriod,
//     useIRS,
//     irsRate,
//     useFuel,
//     fuelMode,
//     fuelDirectAmt,
//     fuelDirectPeriod,
//     fuelType,
//     fuelPrice,
//     kmDriven,
//     consumption,
//     useInsurance,
//     insurance,
//     useLease,
//     lease,
//     useMaint,
//     maint,
//     useParking,
//     parking,
//     usePhone,
//     phone,
//     useTrips,
//     trips,
//     useHours,
//     hours,
//     useGoal,
//     goal,
//   ]);

//   const profit = c.net >= 0;

//   // Bar segments
//   const barSegs = [
//     { val: c.rvAmt, color: S.blue, label: 'Recibo Verde' },
//     { val: c.carRentScaled, color: S.purple, label: 'Car Rent' },
//     { val: c.ivaAmt, color: S.yellow, label: 'IVA' },
//     { val: c.socialAmt, color: S.orange, label: 'Social Sec.' },
//     { val: c.irsAmt, color: S.red, label: 'IRS' },
//     { val: c.fuelAmt, color: '#eab308', label: 'Fuel' },
//     { val: c.fixedTotal, color: S.pink, label: 'Fixed' },
//     { val: Math.max(c.net, 0), color: S.green, label: 'Net' },
//   ].filter((s) => s.val > 0.01);

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap');

//         :root {
//           --bg:         #060911;
//           --card:       #0c1020;
//           --surface2:   #111827;
//           --surface3:   #0d1219;
//           --border:     #1a2540;
//           --text:       #eaf0fc;
//           --muted:      #6b7fa8;
//           --accent:     #10b981;
//           --accent-glow:rgba(16,185,129,0.35);
//           --font:       'Plus Jakarta Sans', sans-serif;
//         }

//         *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
//         html { -webkit-tap-highlight-color: transparent; height: 100%; }
//         body {
//           background: var(--bg);
//           color: var(--text);
//           font-family: var(--font);
//           min-height: 100vh;
//           width: 100%;
//           padding-bottom: env(safe-area-inset-bottom, 20px);
//           background-image:
//             radial-gradient(ellipse 80% 40% at 50% 0%, rgba(16,185,129,0.08), transparent 60%),
//             radial-gradient(ellipse 60% 60% at 90% 90%, rgba(99,102,241,0.05), transparent 60%);
//         }
//         #root {
//           width: 100%;
//           min-height: 100vh;
//         }

//         input[type=number]  { -moz-appearance: textfield; }
//         input[type=number]::-webkit-inner-spin-button,
//         input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }

//         input[type=range] {
//           -webkit-appearance: none; width: 100%;
//           height: 5px; border-radius: 3px;
//           background: var(--border); outline: none; cursor: pointer;
//         }
//         input[type=range]::-webkit-slider-thumb {
//           -webkit-appearance: none; width: 22px; height: 22px;
//           border-radius: 50%; background: var(--accent);
//           border: 3px solid var(--bg); cursor: pointer;
//           box-shadow: 0 0 0 2px var(--accent), 0 2px 8px var(--accent-glow);
//         }

//         button { cursor: pointer; }

//         /* scrollbar */
//         ::-webkit-scrollbar { width: 4px; }
//         ::-webkit-scrollbar-track { background: transparent; }
//         ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

//         .app {
//           max-width: 560px;
//           width: 100%;
//           margin-left: auto;
//           margin-right: auto;
//           padding: 0 1rem 5rem;
//         }

//         /* Top hero summary bar */
//         .summary-row {
//           display: grid;
//           grid-template-columns: 1fr 1fr 1fr;
//           gap: 0.5rem;
//           margin-bottom: 1rem;
//         }

//         .summary-card {
//           border-radius: 1rem;
//           padding: 0.85rem 0.7rem;
//           text-align: center;
//           border: 1.5px solid;
//         }

//         .proj-row {
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 0.5rem;
//           margin-bottom: 0.8rem;
//         }

//         .fuel-seg { display: flex; border-radius: 0.6rem; overflow: hidden; }
//         .fuel-seg button {
//           flex: 1; padding: 0.65rem 0.3rem;
//           border: 1.5px solid var(--border);
//           background: var(--surface2); color: var(--muted);
//           font-family: var(--font); font-size: 0.72rem; font-weight: 700;
//           text-align: center; transition: all 0.18s;
//         }
//         .fuel-seg button:first-child { border-radius: 0.6rem 0 0 0.6rem; border-right: none; }
//         .fuel-seg button:last-child  { border-radius: 0 0.6rem 0.6rem 0; border-left: none; }
//         .fuel-seg button.active      { background: rgba(245,158,11,0.12); border-color: #f59e0b; color: #f59e0b; }

//         @keyframes slideDown {
//           from { opacity: 0; transform: translateY(-8px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//         .slide-down { animation: slideDown 0.2s ease both; }

//         @keyframes pop {
//           0%   { transform: scale(1); }
//           40%  { transform: scale(1.04); }
//           100% { transform: scale(1); }
//         }
//         .pop { animation: pop 0.3s ease; }
//       `}</style>

//       <div className="app">
//         {/* ══════════ HEADER ══════════ */}
//         <div style={{ textAlign: 'center', padding: '1.8rem 0 1.2rem' }}>
//           <div
//             style={{
//               display: 'inline-flex',
//               alignItems: 'center',
//               gap: '0.4rem',
//               fontSize: '0.62rem',
//               fontWeight: 700,
//               letterSpacing: '0.18em',
//               textTransform: 'uppercase',
//               color: S.green,
//               background: 'rgba(16,185,129,0.09)',
//               border: '1.5px solid rgba(16,185,129,0.22)',
//               padding: '0.3rem 0.9rem',
//               borderRadius: '2rem',
//               marginBottom: '0.85rem',
//             }}
//           >
//             🚗 TVDE Pertugal
//           </div>

//           <h1
//             style={{
//               fontSize: 'clamp(1.7rem,6vw,2.2rem)',
//               fontWeight: 800,
//               letterSpacing: '-0.03em',
//               lineHeight: 1.1,
//               background: 'linear-gradient(135deg, #fff 25%, #10b981 70%)',
//               WebkitBackgroundClip: 'text',
//               WebkitTextFillColor: 'transparent',
//               backgroundClip: 'text',
//             }}
//           >
//             Income Calculator By Khalid Hasan
//           </h1>

//           <p
//             style={{
//               color: 'var(--muted)',
//               fontSize: '0.8rem',
//               marginTop: '0.5rem',
//             }}
//           >
//             Know exactly what you earn and what you spend
//           </p>
//         </div>

//         {/* ══════════ PERIOD SELECTOR ══════════ */}
//         <div
//           style={{
//             display: 'flex',
//             justifyContent: 'center',
//             marginBottom: '1.4rem',
//           }}
//         >
//           <div>
//             <div
//               style={{
//                 fontSize: '0.62rem',
//                 fontWeight: 700,
//                 textTransform: 'uppercase',
//                 letterSpacing: '0.1em',
//                 color: 'var(--muted)',
//                 textAlign: 'center',
//                 marginBottom: '0.4rem',
//               }}
//             >
//               View results by
//             </div>
//             <PeriodPicker value={period} onChange={setPeriod} />
//           </div>
//         </div>

//         {/* ══════════ SUMMARY HERO ══════════ */}
//         <div className="summary-row">
//           {[
//             {
//               icon: '💰',
//               label: 'Earned',
//               val: fmt(c.gross),
//               accent: S.green,
//               border: `${S.green}35`,
//             },
//             {
//               icon: '📤',
//               label: 'Spent',
//               val: fmt(c.totalExp),
//               accent: S.red,
//               border: `${S.red}35`,
//             },
//             {
//               icon: '✅',
//               label: 'Net',
//               val: fmt(c.net),
//               accent: profit ? S.green : S.red,
//               border: profit ? `${S.green}35` : `${S.red}35`,
//             },
//           ].map(({ icon, label, val, accent, border }) => (
//             <div
//               key={label}
//               className="summary-card"
//               style={{
//                 borderColor: border,
//                 background: `${accent}0a`,
//               }}
//             >
//               <div style={{ fontSize: '1.3rem', marginBottom: '0.25rem' }}>
//                 {icon}
//               </div>
//               <div
//                 style={{
//                   fontSize: '0.58rem',
//                   fontWeight: 700,
//                   textTransform: 'uppercase',
//                   letterSpacing: '0.1em',
//                   color: 'var(--muted)',
//                   marginBottom: '0.3rem',
//                 }}
//               >
//                 {label}
//               </div>
//               <div
//                 style={{
//                   fontSize: 'clamp(0.85rem,3.5vw,1.05rem)',
//                   fontWeight: 800,
//                   color: accent,
//                   lineHeight: 1.2,
//                 }}
//               >
//                 {val}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* ══════════ EXPENSE BAR ══════════ */}
//         {c.gross > 0 && (
//           <div
//             style={{
//               background: 'var(--card)',
//               border: '1.5px solid var(--border)',
//               borderRadius: '1rem',
//               padding: '0.9rem 1rem',
//               marginBottom: '1rem',
//             }}
//           >
//             <div
//               style={{
//                 fontSize: '0.62rem',
//                 fontWeight: 700,
//                 textTransform: 'uppercase',
//                 letterSpacing: '0.1em',
//                 color: 'var(--muted)',
//                 marginBottom: '0.55rem',
//               }}
//             >
//               Where your money goes
//             </div>
//             <div
//               style={{
//                 display: 'flex',
//                 height: 18,
//                 borderRadius: '0.4rem',
//                 overflow: 'hidden',
//                 gap: 1.5,
//               }}
//             >
//               {barSegs.map(({ val, color, label }) => (
//                 <div
//                   key={label}
//                   title={`${label}: ${fmt(val)}`}
//                   style={{
//                     width: `${(val / c.gross) * 100}%`,
//                     background: color,
//                     minWidth: 2,
//                     borderRadius: 2,
//                     transition: 'width 0.4s ease',
//                   }}
//                 />
//               ))}
//             </div>
//             <div
//               style={{
//                 display: 'flex',
//                 flexWrap: 'wrap',
//                 gap: '0.3rem 0.75rem',
//                 marginTop: '0.55rem',
//               }}
//             >
//               {barSegs.map(({ val, color, label }) => (
//                 <div
//                   key={label}
//                   style={{
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: '0.28rem',
//                     fontSize: '0.62rem',
//                     color: 'var(--muted)',
//                   }}
//                 >
//                   <div
//                     style={{
//                       width: 8,
//                       height: 8,
//                       borderRadius: 2,
//                       background: color,
//                       flexShrink: 0,
//                     }}
//                   />
//                   {label}{' '}
//                   <span style={{ color }}>
//                     {((val / c.gross) * 100).toFixed(0)}%
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* ══════════ INCOME CARD ══════════ */}
//         <Card
//           title="Gross Income"
//           icon="💰"
//           accent={S.green}
//           badge={fmt(c.gross)}
//         >
//           <NumInput
//             label={`Gross income per ${PERIOD_LABEL[period].toLowerCase()}`}
//             value={gross}
//             onChange={setGross}
//           />
//           <div
//             style={{
//               fontSize: '0.68rem',
//               color: 'var(--muted)',
//               lineHeight: 1.5,
//               paddingBottom: '0.5rem',
//             }}
//           >
//             Enter the total you receive from Uber / Bolt before any deductions.
//           </div>
//         </Card>

//         {/* ══════════ RECIBO VERDE ══════════ */}
//         <Card
//           title="Recibo Verde"
//           icon="🧾"
//           accent={S.blue}
//           badge={useRV ? `-${fmt(c.rvAmt)}` : undefined}
//           badgeColor={S.blue}
//         >
//           <AmountPeriodInput
//             label="Recibo Verde"
//             sub="Receipt issuance fee — fixed amount paid to the operator or AT"
//             on={useRV}
//             onToggle={setUseRV}
//             amount={rvAmount}
//             onAmount={setRvAmount}
//             amtPeriod={rvPeriod}
//             onAmtPeriod={setRvPeriod}
//             accent={S.blue}
//           />
//           {useRV && (
//             <div
//               style={{
//                 display: 'flex',
//                 gap: '0.5rem',
//                 paddingBottom: '0.5rem',
//               }}
//             >
//               <InfoChip
//                 label={`Per ${PERIOD_LABEL[period].toLowerCase()}`}
//                 value={fmt(c.rvAmt)}
//                 color={S.blue}
//               />
//               <InfoChip
//                 label="Per month"
//                 value={fmt(convertPeriod(rvAmount, rvPeriod, 'monthly'))}
//                 color={S.blue}
//               />
//               <InfoChip
//                 label="Per year"
//                 value={fmt(convertPeriod(rvAmount, rvPeriod, 'yearly'))}
//                 color={S.blue}
//               />
//             </div>
//           )}
//         </Card>

//         {/* ══════════ CAR RENT ══════════ */}
//         <Card
//           title="Car Rent Fee"
//           icon="🚘"
//           accent={S.purple}
//           badge={useCarRent ? `-${fmt(c.carRentScaled)}` : undefined}
//           badgeColor={S.purple}
//         >
//           <Switch
//             on={useCarRent}
//             onChange={setUseCarRent}
//             label="Vehicle rental / rent"
//             sub="Monthly cost of the rented TVDE vehicle"
//             accent={S.purple}
//           />
//           {useCarRent && (
//             <div className="slide-down">
//               <div
//                 style={{
//                   marginTop: '0.6rem',
//                   padding: '0.9rem',
//                   background: `${S.purple}0d`,
//                   border: `1.5px solid ${S.purple}30`,
//                   borderRadius: '0.9rem',
//                   marginBottom: '0.5rem',
//                 }}
//               >
//                 <div
//                   style={{
//                     fontSize: '0.62rem',
//                     fontWeight: 700,
//                     textTransform: 'uppercase',
//                     letterSpacing: '0.08em',
//                     color: 'var(--muted)',
//                     marginBottom: '0.4rem',
//                   }}
//                 >
//                   Amount frequency
//                 </div>
//                 <PeriodPicker
//                   value={carRentPeriod}
//                   onChange={setCarRentPeriod}
//                   small
//                 />
//                 <div style={{ marginTop: '0.6rem' }}>
//                   <NumInput
//                     label={`Rent per ${PERIOD_LABEL[carRentPeriod].toLowerCase()}`}
//                     value={carRentAmt}
//                     onChange={setCarRentAmt}
//                   />
//                 </div>
//                 <div
//                   style={{
//                     fontSize: '0.7rem',
//                     color: S.purple,
//                     fontWeight: 600,
//                     textAlign: 'right',
//                   }}
//                 >
//                   ≈ {fmt(convertPeriod(carRentAmt, carRentPeriod, 'monthly'))}
//                   /month &nbsp;·&nbsp;{' '}
//                   {fmt(convertPeriod(carRentAmt, carRentPeriod, 'yearly'))}/year
//                 </div>
//               </div>
//               <div
//                 style={{
//                   display: 'flex',
//                   gap: '0.5rem',
//                   paddingBottom: '0.5rem',
//                 }}
//               >
//                 <InfoChip
//                   label={`Per ${PERIOD_LABEL[period].toLowerCase()}`}
//                   value={fmt(c.carRentScaled)}
//                   color={S.purple}
//                 />
//                 <InfoChip
//                   label="Per month"
//                   value={fmt(
//                     convertPeriod(carRentAmt, carRentPeriod, 'monthly'),
//                   )}
//                   color={S.purple}
//                 />
//                 <InfoChip
//                   label="Per year"
//                   value={fmt(
//                     convertPeriod(carRentAmt, carRentPeriod, 'yearly'),
//                   )}
//                   color={S.purple}
//                 />
//               </div>
//             </div>
//           )}
//         </Card>

//         {/* ══════════ IMPOSTOS ══════════ */}
//         <Card
//           title="Taxes & Contributions"
//           icon="🏛️"
//           accent={S.indigo}
//           badge={`-${fmt(c.taxTotal)}`}
//           badgeColor={S.red}
//         >
//           {/* IVA */}
//           <Switch
//             on={useIva}
//             onChange={setUseIva}
//             accent={S.yellow}
//             label="IVA — 6%"
//             sub="Value Added Tax (TVDE simplified regime)"
//           />
//           {useIva && (
//             <div
//               className="slide-down"
//               style={{
//                 marginLeft: '0.2rem',
//                 marginBottom: '0.5rem',
//                 padding: '0.65rem 0.9rem',
//                 background: 'rgba(245,158,11,0.08)',
//                 border: '1.5px solid rgba(245,158,11,0.25)',
//                 borderRadius: '0.75rem',
//               }}
//             >
//               <div
//                 style={{
//                   display: 'flex',
//                   justifyContent: 'space-between',
//                   fontSize: '0.8rem',
//                 }}
//               >
//                 <span style={{ color: 'var(--muted)' }}>
//                   IVA calculated (6% of income)
//                 </span>
//                 <span style={{ color: S.yellow, fontWeight: 800 }}>
//                   -{fmt(c.ivaAmt)}
//                 </span>
//               </div>
//             </div>
//           )}

//           <Divider />

//           {/* Social Security — MANUAL AMOUNT */}
//           <AmountPeriodInput
//             label="Social Security"
//             sub="Contribuições para a Social Security — introduza o valor exato que paga"
//             on={useSocial}
//             onToggle={setUseSocial}
//             amount={socialAmount}
//             onAmount={setSocialAmount}
//             amtPeriod={socialPeriod}
//             onAmtPeriod={setSocialPeriod}
//             accent={S.orange}
//           />
//           {useSocial && (
//             <div
//               style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}
//             >
//               <InfoChip
//                 label={`Per ${PERIOD_LABEL[period].toLowerCase()}`}
//                 value={fmt(c.socialAmt)}
//                 color={S.orange}
//               />
//               <InfoChip
//                 label="Per month"
//                 value={fmt(
//                   convertPeriod(socialAmount, socialPeriod, 'monthly'),
//                 )}
//                 color={S.orange}
//               />
//               <InfoChip
//                 label="Per year"
//                 value={fmt(convertPeriod(socialAmount, socialPeriod, 'yearly'))}
//                 color={S.orange}
//               />
//             </div>
//           )}

//           <Divider />

//           {/* IRS */}
//           <Switch
//             on={useIRS}
//             onChange={setUseIRS}
//             accent={S.red}
//             label="IRS — Income Tax Withholding"
//             sub="Income tax (estimated rate)"
//           />
//           {useIRS && (
//             <div
//               className="slide-down"
//               style={{
//                 marginLeft: '0.2rem',
//                 marginBottom: '0.5rem',
//                 padding: '0.9rem',
//                 background: 'rgba(239,68,68,0.07)',
//                 border: '1.5px solid rgba(239,68,68,0.25)',
//                 borderRadius: '0.85rem',
//               }}
//             >
//               <div
//                 style={{
//                   display: 'flex',
//                   justifyContent: 'space-between',
//                   fontSize: '0.68rem',
//                   fontWeight: 700,
//                   textTransform: 'uppercase',
//                   letterSpacing: '0.07em',
//                   color: 'var(--muted)',
//                   marginBottom: '0.35rem',
//                 }}
//               >
//                 <span>IRS Rate</span>
//                 <span style={{ color: 'var(--text)' }}>{irsRate}%</span>
//               </div>
//               <input
//                 type="range"
//                 min={5}
//                 max={48}
//                 step={1}
//                 value={irsRate}
//                 onChange={(e) => setIrsRate(Number(e.target.value))}
//                 style={{ accentColor: S.red }}
//               />
//               <div
//                 style={{
//                   display: 'flex',
//                   justifyContent: 'space-between',
//                   fontSize: '0.78rem',
//                   marginTop: '0.5rem',
//                 }}
//               >
//                 <span style={{ color: 'var(--muted)' }}>IRS to pay</span>
//                 <span style={{ color: S.red, fontWeight: 800 }}>
//                   -{fmt(c.irsAmt)}
//                 </span>
//               </div>
//             </div>
//           )}
//           <div style={{ height: '0.4rem' }} />
//         </Card>

//         {/* ══════════ FUEL ══════════ */}
//         <Card
//           title="Fuel"
//           icon="⛽"
//           accent="#f59e0b"
//           badge={useFuel ? `-${fmt(c.fuelAmt)}` : 'Off'}
//           badgeColor={useFuel ? S.red : 'var(--muted)'}
//         >
//           <Switch
//             on={useFuel}
//             onChange={setUseFuel}
//             accent="#f59e0b"
//             label="Include fuel costs"
//           />
//           {useFuel && (
//             <div className="slide-down">
//               {/* Mode toggle */}
//               <div
//                 style={{
//                   display: 'flex',
//                   background: 'var(--surface2)',
//                   borderRadius: '0.65rem',
//                   padding: '0.2rem',
//                   gap: '0.2rem',
//                   marginBottom: '1rem',
//                   marginTop: '0.4rem',
//                 }}
//               >
//                 {[
//                   { id: 'calculate', icon: '🧮', label: 'Calculate from KM' },
//                   { id: 'direct', icon: '✏️', label: 'Enter amount' },
//                 ].map(({ id, icon, label }) => (
//                   <button
//                     key={id}
//                     onClick={() => setFuelMode(id)}
//                     style={{
//                       flex: 1,
//                       padding: '0.6rem 0.4rem',
//                       borderRadius: '0.5rem',
//                       border: 'none',
//                       background: fuelMode === id ? '#f59e0b' : 'transparent',
//                       color: fuelMode === id ? '#000' : 'var(--muted)',
//                       fontFamily: 'inherit',
//                       fontSize: '0.72rem',
//                       fontWeight: 700,
//                       cursor: 'pointer',
//                       transition: 'all 0.18s',
//                       boxShadow:
//                         fuelMode === id
//                           ? '0 2px 10px rgba(245,158,11,0.35)'
//                           : 'none',
//                     }}
//                   >
//                     {icon} {label}
//                   </button>
//                 ))}
//               </div>

//               {/* CALCULATE MODE */}
//               {fuelMode === 'calculate' && (
//                 <div className="slide-down">
//                   <div className="fuel-seg" style={{ marginBottom: '0.9rem' }}>
//                     {['diesel', 'petrol', 'electric'].map((ft) => (
//                       <button
//                         key={ft}
//                         className={fuelType === ft ? 'active' : ''}
//                         onClick={() => handleFuelType(ft)}
//                       >
//                         {ft === 'electric'
//                           ? '⚡ Electric'
//                           : ft === 'diesel'
//                             ? '🛢 Diesel'
//                             : '⛽ Petrol'}
//                       </button>
//                     ))}
//                   </div>
//                   <NumInput
//                     label={
//                       fuelType === 'electric'
//                         ? 'Price per kWh (€)'
//                         : 'Price per litre (€)'
//                     }
//                     value={fuelPrice}
//                     onChange={setFuelPrice}
//                     step={0.01}
//                   />
//                   <NumInput
//                     label={`KM driven per ${PERIOD_LABEL[period].toLowerCase()}`}
//                     value={kmDriven}
//                     onChange={setKmDriven}
//                     prefix="km"
//                     step={10}
//                   />
//                   <div style={{ marginBottom: '0.9rem' }}>
//                     <div
//                       style={{
//                         display: 'flex',
//                         justifyContent: 'space-between',
//                         fontSize: '0.68rem',
//                         fontWeight: 700,
//                         textTransform: 'uppercase',
//                         letterSpacing: '0.07em',
//                         color: 'var(--muted)',
//                         marginBottom: '0.3rem',
//                       }}
//                     >
//                       <span>Consumption ({FUEL_DEFAULTS[fuelType].unit})</span>
//                       <span style={{ color: 'var(--text)' }}>
//                         {consumption}
//                       </span>
//                     </div>
//                     <input
//                       type="range"
//                       min={fuelType === 'electric' ? 10 : 4}
//                       max={fuelType === 'electric' ? 30 : 15}
//                       step={0.1}
//                       value={consumption}
//                       onChange={(e) => setConsumption(Number(e.target.value))}
//                       style={{ accentColor: '#f59e0b' }}
//                     />
//                   </div>
//                   <div
//                     style={{
//                       display: 'flex',
//                       gap: '0.5rem',
//                       marginBottom: '0.5rem',
//                     }}
//                   >
//                     <InfoChip
//                       label="Total fuel"
//                       value={fmt(c.fuelAmt)}
//                       color="#f59e0b"
//                     />
//                     <InfoChip
//                       label="Cost per km"
//                       value={fmt(c.costPerKm)}
//                       color="#f59e0b"
//                     />
//                   </div>
//                 </div>
//               )}

//               {/* DIRECT AMOUNT MODE */}
//               {fuelMode === 'direct' && (
//                 <div
//                   className="slide-down"
//                   style={{
//                     padding: '1rem',
//                     background: 'rgba(245,158,11,0.07)',
//                     border: '1.5px solid rgba(245,158,11,0.28)',
//                     borderRadius: '0.9rem',
//                     marginBottom: '0.5rem',
//                   }}
//                 >
//                   <div
//                     style={{
//                       fontSize: '0.62rem',
//                       fontWeight: 700,
//                       textTransform: 'uppercase',
//                       letterSpacing: '0.08em',
//                       color: 'var(--muted)',
//                       marginBottom: '0.45rem',
//                     }}
//                   >
//                     Amount frequency
//                   </div>
//                   <PeriodPicker
//                     value={fuelDirectPeriod}
//                     onChange={setFuelDirectPeriod}
//                     small
//                   />
//                   <div style={{ marginTop: '0.7rem' }}>
//                     <NumInput
//                       label={`Fuel cost per ${PERIOD_LABEL[fuelDirectPeriod].toLowerCase()}`}
//                       value={fuelDirectAmt}
//                       onChange={setFuelDirectAmt}
//                     />
//                   </div>
//                   <div
//                     style={{
//                       fontSize: '0.7rem',
//                       color: '#f59e0b',
//                       fontWeight: 600,
//                       textAlign: 'right',
//                       marginBottom: '0.6rem',
//                     }}
//                   >
//                     ≈{' '}
//                     {fmt(
//                       convertPeriod(fuelDirectAmt, fuelDirectPeriod, 'monthly'),
//                     )}
//                     /month &nbsp;·&nbsp;{' '}
//                     {fmt(
//                       convertPeriod(fuelDirectAmt, fuelDirectPeriod, 'yearly'),
//                     )}
//                     /year
//                   </div>
//                   <div style={{ display: 'flex', gap: '0.5rem' }}>
//                     <InfoChip
//                       label={`Per ${PERIOD_LABEL[period].toLowerCase()}`}
//                       value={fmt(c.fuelAmt)}
//                       color="#f59e0b"
//                     />
//                     <InfoChip
//                       label="Per month"
//                       value={fmt(
//                         convertPeriod(
//                           fuelDirectAmt,
//                           fuelDirectPeriod,
//                           'monthly',
//                         ),
//                       )}
//                       color="#f59e0b"
//                     />
//                     <InfoChip
//                       label="Per year"
//                       value={fmt(
//                         convertPeriod(
//                           fuelDirectAmt,
//                           fuelDirectPeriod,
//                           'yearly',
//                         ),
//                       )}
//                       color="#f59e0b"
//                     />
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </Card>

//         {/* ══════════ FIXED COSTS ══════════ */}
//         <Card
//           title="Fixed Monthly Costs"
//           icon="📋"
//           accent={S.pink}
//           badge={`-${fmt(c.fixedTotal)}`}
//           badgeColor={S.red}
//         >
//           <div
//             style={{
//               fontSize: '0.68rem',
//               color: 'var(--muted)',
//               padding: '0.5rem 0.7rem',
//               background: `${S.pink}0a`,
//               border: `1px solid ${S.pink}25`,
//               borderRadius: '0.6rem',
//               marginBottom: '0.8rem',
//               lineHeight: 1.5,
//             }}
//           >
//             💡 Enter monthly values — automatically converted to the selected
//             period
//           </div>

//           {[
//             {
//               use: useInsurance,
//               setUse: setUseInsurance,
//               val: insurance,
//               setVal: setInsurance,
//               label: 'TVDE Insurance',
//               sub: 'Mandatory insurance for TVDE drivers',
//               accent: S.pink,
//             },
//             {
//               use: useLease,
//               setUse: setUseLease,
//               val: lease,
//               setVal: setLease,
//               label: 'Car loan / lease',
//               sub: 'Monthly car leasing / loan payment',
//               accent: S.pink,
//             },
//             {
//               use: useMaint,
//               setUse: setUseMaint,
//               val: maint,
//               setVal: setMaint,
//               label: 'Car maintenance',
//               sub: 'Tyres, oil, service (monthly average)',
//               accent: S.pink,
//             },
//             {
//               use: useParking,
//               setUse: setUseParking,
//               val: parking,
//               setVal: setParking,
//               label: 'Parking / tolls',
//               sub: 'Average monthly costs',
//               accent: S.pink,
//             },
//             {
//               use: usePhone,
//               setUse: setUsePhone,
//               val: phone,
//               setVal: setPhone,
//               label: 'Phone / data plan',
//               sub: 'Plan for GPS and apps (monthly)',
//               accent: S.pink,
//             },
//           ].map(({ use, setUse, val, setVal, label, sub, accent }) => (
//             <div key={label}>
//               <Switch
//                 on={use}
//                 onChange={setUse}
//                 label={label}
//                 sub={sub}
//                 accent={accent}
//               />
//               {use && (
//                 <div
//                   className="slide-down"
//                   style={{ paddingLeft: '0.5rem', marginBottom: '0.5rem' }}
//                 >
//                   <NumInput
//                     label="Monthly cost"
//                     value={val}
//                     onChange={setVal}
//                     hint={`≈ ${fmt((val / 30) * PERIOD_DAYS[period])} per ${PERIOD_LABEL[period].toLowerCase()}`}
//                   />
//                 </div>
//               )}
//             </div>
//           ))}
//         </Card>

//         {/* ══════════ RESUMO COMPLETO ══════════ */}
//         <Card title="Full Breakdown" icon="📊" accent={S.slate}>
//           <DeductRow
//             label="Gross income"
//             amount={fmt(c.gross)}
//             color={S.green}
//             bold
//           />

//           {(useRV || useCarRent) && (
//             <>
//               <div
//                 style={{
//                   fontSize: '0.6rem',
//                   fontWeight: 700,
//                   textTransform: 'uppercase',
//                   letterSpacing: '0.1em',
//                   color: 'var(--muted)',
//                   padding: '0.45rem 0 0.1rem',
//                 }}
//               >
//                 Direct Deductions
//               </div>
//               {useRV && (
//                 <DeductRow
//                   label="Recibo Verde"
//                   amount={`-${fmt(c.rvAmt)}`}
//                   color={S.blue}
//                 />
//               )}
//               {useCarRent && (
//                 <DeductRow
//                   label="Car rent"
//                   amount={`-${fmt(c.carRentScaled)}`}
//                   color={S.purple}
//                 />
//               )}
//             </>
//           )}

//           {(useIva || useSocial || useIRS) && (
//             <>
//               <div
//                 style={{
//                   fontSize: '0.6rem',
//                   fontWeight: 700,
//                   textTransform: 'uppercase',
//                   letterSpacing: '0.1em',
//                   color: 'var(--muted)',
//                   padding: '0.45rem 0 0.1rem',
//                 }}
//               >
//                 Taxes
//               </div>
//               {useIva && (
//                 <DeductRow
//                   label="IVA (6%)"
//                   amount={`-${fmt(c.ivaAmt)}`}
//                   color={S.yellow}
//                 />
//               )}
//               {useSocial && (
//                 <DeductRow
//                   label="Social Security"
//                   amount={`-${fmt(c.socialAmt)}`}
//                   color={S.orange}
//                 />
//               )}
//               {useIRS && (
//                 <DeductRow
//                   label={`IRS (${irsRate}%)`}
//                   amount={`-${fmt(c.irsAmt)}`}
//                   color={S.red}
//                 />
//               )}
//             </>
//           )}

//           {(useFuel ||
//             useInsurance ||
//             useLease ||
//             useMaint ||
//             useParking ||
//             usePhone) && (
//             <>
//               <div
//                 style={{
//                   fontSize: '0.6rem',
//                   fontWeight: 700,
//                   textTransform: 'uppercase',
//                   letterSpacing: '0.1em',
//                   color: 'var(--muted)',
//                   padding: '0.45rem 0 0.1rem',
//                 }}
//               >
//                 Operating Costs
//               </div>
//               {useFuel && (
//                 <DeductRow
//                   label="Fuel"
//                   amount={`-${fmt(c.fuelAmt)}`}
//                   color="#eab308"
//                   sub={`${kmDriven} km · ${fmt(c.costPerKm)}/km`}
//                 />
//               )}
//               {useInsurance && (
//                 <DeductRow
//                   label="TVDE Insurance"
//                   amount={`-${fmt(c.insuranceAmt)}`}
//                   color={S.pink}
//                 />
//               )}
//               {useLease && (
//                 <DeductRow
//                   label="Car loan / lease"
//                   amount={`-${fmt(c.leaseAmt)}`}
//                   color={S.pink}
//                 />
//               )}
//               {useMaint && (
//                 <DeductRow
//                   label="Maintenance"
//                   amount={`-${fmt(c.maintAmt)}`}
//                   color={S.pink}
//                 />
//               )}
//               {useParking && (
//                 <DeductRow
//                   label="Estac. / portagens"
//                   amount={`-${fmt(c.parkingAmt)}`}
//                   color={S.pink}
//                 />
//               )}
//               {usePhone && (
//                 <DeductRow
//                   label="Phone plan"
//                   amount={`-${fmt(c.phoneAmt)}`}
//                   color={S.pink}
//                 />
//               )}
//             </>
//           )}

//           <DeductRow
//             label="Total expenses"
//             amount={`-${fmt(c.totalExp)}`}
//             color={S.red}
//             bold
//           />

//           {/* Net take-home big box */}
//           <div
//             style={{
//               marginTop: '0.7rem',
//               padding: '1.1rem',
//               background: profit
//                 ? 'rgba(16,185,129,0.08)'
//                 : 'rgba(239,68,68,0.08)',
//               border: `2px solid ${profit ? `${S.green}35` : `${S.red}35`}`,
//               borderRadius: '1rem',
//             }}
//           >
//             <div
//               style={{
//                 display: 'flex',
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//               }}
//             >
//               <div>
//                 <div
//                   style={{
//                     fontSize: '0.65rem',
//                     fontWeight: 800,
//                     textTransform: 'uppercase',
//                     letterSpacing: '0.1em',
//                     color: 'var(--muted)',
//                   }}
//                 >
//                   Net Income
//                 </div>
//                 <div
//                   style={{
//                     fontSize: '0.65rem',
//                     color: 'var(--muted)',
//                     marginTop: '0.2rem',
//                   }}
//                 >
//                   {c.keptPct.toFixed(1)}% of gross you keep
//                 </div>
//               </div>
//               <div
//                 style={{
//                   fontSize: 'clamp(1.5rem,6vw,2rem)',
//                   fontWeight: 800,
//                   color: profit ? S.green : S.red,
//                 }}
//               >
//                 {fmt(c.net)}
//               </div>
//             </div>
//           </div>
//           <div style={{ height: '0.5rem' }} />
//         </Card>

//         {/* ══════════ PROJEÇÕES ══════════ */}
//         <Card title="Projections" icon="📈" accent={S.blue}>
//           <div className="proj-row">
//             {[
//               { l: 'Per day', v: fmt(c.dailyNet) },
//               { l: 'Per week', v: fmt(c.weeklyNet) },
//               { l: 'Per month', v: fmt(c.monthNet) },
//               { l: 'Per year', v: fmt(c.yearNet) },
//             ].map(({ l, v }) => (
//               <div
//                 key={l}
//                 style={{
//                   background: 'var(--surface2)',
//                   border: '1.5px solid var(--border)',
//                   borderRadius: '0.9rem',
//                   padding: '0.85rem',
//                 }}
//               >
//                 <div
//                   style={{
//                     fontSize: '0.6rem',
//                     fontWeight: 700,
//                     textTransform: 'uppercase',
//                     letterSpacing: '0.1em',
//                     color: 'var(--muted)',
//                     marginBottom: '0.3rem',
//                   }}
//                 >
//                   {l}
//                 </div>
//                 <div
//                   style={{
//                     fontSize: '1.05rem',
//                     fontWeight: 800,
//                     color: S.blue,
//                   }}
//                 >
//                   {v}
//                 </div>
//               </div>
//             ))}
//           </div>
//           <div style={{ height: '0.3rem' }} />
//         </Card>

//         {/* ══════════ ANALYTICS ══════════ */}
//         <Card title="Detailed Analytics" icon="🔍" accent={S.indigo}>
//           {/* Trips */}
//           <Switch
//             on={useTrips}
//             onChange={setUseTrips}
//             accent={S.indigo}
//             label="Trip analytics"
//             sub="Calculate average earnings per trip"
//           />
//           {useTrips && (
//             <div
//               className="slide-down"
//               style={{ paddingLeft: '0.2rem', marginBottom: '0.5rem' }}
//             >
//               <NumInput
//                 label={`Number of trips per ${PERIOD_LABEL[period].toLowerCase()}`}
//                 value={trips}
//                 onChange={setTrips}
//                 prefix="🚗"
//               />
//               <div
//                 style={{
//                   display: 'flex',
//                   gap: '0.5rem',
//                   marginBottom: '0.5rem',
//                 }}
//               >
//                 <InfoChip
//                   label="Net / trip"
//                   value={c.avgTrip !== null ? fmt(c.avgTrip) : '—'}
//                   color={S.indigo}
//                 />
//                 <InfoChip
//                   label="Gross / trip"
//                   value={trips > 0 ? fmt(c.gross / trips) : '—'}
//                   color="var(--muted)"
//                 />
//               </div>
//             </div>
//           )}

//           <Divider />

//           {/* Hours */}
//           <Switch
//             on={useHours}
//             onChange={setUseHours}
//             accent={S.indigo}
//             label="Hourly rate"
//             sub="Calculate the real value of your working hour"
//           />
//           {useHours && (
//             <div
//               className="slide-down"
//               style={{ paddingLeft: '0.2rem', marginBottom: '0.5rem' }}
//             >
//               <NumInput
//                 label={`Hours worked per ${PERIOD_LABEL[period].toLowerCase()}`}
//                 value={hours}
//                 onChange={setHours}
//                 prefix="⏱"
//               />
//               <div
//                 style={{
//                   display: 'flex',
//                   gap: '0.5rem',
//                   marginBottom: '0.5rem',
//                 }}
//               >
//                 <InfoChip
//                   label="Net / hour"
//                   value={c.hourlyNet !== null ? `${fmt(c.hourlyNet)}/h` : '—'}
//                   color={S.indigo}
//                 />
//                 <InfoChip
//                   label="Gross / hour"
//                   value={hours > 0 ? `${fmt(c.gross / hours)}/h` : '—'}
//                   color="var(--muted)"
//                 />
//               </div>
//             </div>
//           )}

//           <Divider />

//           {/* Goal */}
//           <Switch
//             on={useGoal}
//             onChange={setUseGoal}
//             accent={S.green}
//             label="Monthly goal"
//             sub="Track progress towards your goal"
//           />
//           {useGoal && (
//             <div
//               className="slide-down"
//               style={{ paddingLeft: '0.2rem', marginBottom: '0.5rem' }}
//             >
//               <NumInput
//                 label="Monthly goal (€)"
//                 value={goal}
//                 onChange={setGoal}
//               />
//               <div
//                 style={{
//                   display: 'flex',
//                   justifyContent: 'space-between',
//                   fontSize: '0.75rem',
//                   marginBottom: '0.45rem',
//                 }}
//               >
//                 <span style={{ color: 'var(--muted)' }}>
//                   Progress to {fmt(goal)}/month
//                 </span>
//                 <span style={{ color: S.green, fontWeight: 800 }}>
//                   {c.goalPct !== null ? `${c.goalPct.toFixed(0)}%` : '—'}
//                 </span>
//               </div>
//               <div
//                 style={{
//                   height: 12,
//                   background: 'var(--surface3)',
//                   borderRadius: 6,
//                   overflow: 'hidden',
//                   border: '1px solid var(--border)',
//                 }}
//               >
//                 <div
//                   style={{
//                     height: '100%',
//                     borderRadius: 6,
//                     background: `linear-gradient(90deg, ${S.indigo}, ${S.green})`,
//                     width: `${c.goalPct ?? 0}%`,
//                     transition: 'width 0.4s ease',
//                     boxShadow: '0 0 12px rgba(16,185,129,0.4)',
//                   }}
//                 />
//               </div>
//               <div
//                 style={{
//                   fontSize: '0.68rem',
//                   color: 'var(--muted)',
//                   marginTop: '0.4rem',
//                   textAlign: 'right',
//                 }}
//               >
//                 Current monthly estimate:{' '}
//                 <strong style={{ color: S.green }}>{fmt(c.monthNet)}</strong>
//               </div>
//             </div>
//           )}
//           <div style={{ height: '0.3rem' }} />
//         </Card>

//         {/* Footer */}
//         <div
//           style={{
//             textAlign: 'center',
//             color: 'var(--muted)',
//             fontSize: '0.62rem',
//             marginTop: '1rem',
//             lineHeight: 1.7,
//             padding: '0 1rem',
//           }}
//         >
//           🔒 All data stays on your device — nothing is sent to servers
//           <br />
//           Indicative values only · Consult a certified accountant (TOC) for
//           official filings
//         </div>
//       </div>
//     </>
//   );
// }

import { useState, useMemo, useEffect, useRef } from 'react';

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
const fmt = (n) =>
  new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(isNaN(n) || !isFinite(n) ? 0 : n);

const PERIOD_DAYS = { daily: 1, weekly: 7, monthly: 30, yearly: 365 };
const PERIOD_LABEL = {
  daily: 'Day',
  weekly: 'Week',
  monthly: 'Month',
  yearly: 'Year',
};

const FUEL_DEFAULTS = {
  diesel: { price: 1.65, cons: 6.5, unit: 'L/100km' },
  petrol: { price: 1.8, cons: 7.5, unit: 'L/100km' },
  electric: { price: 0.04, cons: 18, unit: 'kWh/100km' },
};

// Convert any amount entered in "fromPeriod" to the main selected period
const convertPeriod = (amount, fromPeriod, toPeriod) => {
  if (!amount) return 0;
  const daily = amount / PERIOD_DAYS[fromPeriod];
  return daily * PERIOD_DAYS[toPeriod];
};

/* ─────────────────────────────────────────
   REUSABLE COMPONENTS
───────────────────────────────────────── */
const S = {
  // Colours
  green: '#10b981',
  red: '#ef4444',
  blue: '#06b6d4',
  purple: '#8b5cf6',
  orange: '#f97316',
  yellow: '#f59e0b',
  indigo: '#6366f1',
  pink: '#ec4899',
  slate: '#64748b',
};

function PeriodPicker({ value, onChange, small = false }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        background: 'var(--surface2)',
        borderRadius: '0.6rem',
        padding: '0.18rem',
        gap: '0.15rem',
      }}
    >
      {Object.keys(PERIOD_DAYS).map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          style={{
            padding: small ? '0.25rem 0.55rem' : '0.35rem 0.8rem',
            borderRadius: '0.45rem',
            border: 'none',
            cursor: 'pointer',
            fontSize: small ? '0.62rem' : '0.7rem',
            fontWeight: 700,
            fontFamily: 'inherit',
            textTransform: 'capitalize',
            background: value === p ? 'var(--accent)' : 'transparent',
            color: value === p ? '#000' : 'var(--muted)',
            transition: 'all 0.18s',
            boxShadow: value === p ? '0 2px 8px var(--accent-glow)' : 'none',
          }}
        >
          {PERIOD_LABEL[p]}
        </button>
      ))}
    </div>
  );
}

function NumInput({
  label,
  value,
  onChange,
  prefix = '€',
  step = 1,
  min = 0,
  placeholder = '0',
}) {
  return (
    <div style={{ marginBottom: '0.85rem' }}>
      {label && (
        <label
          style={{
            display: 'block',
            fontSize: '0.68rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.07em',
            color: 'var(--muted)',
            marginBottom: '0.3rem',
          }}
        >
          {label}
        </label>
      )}
      <div
        style={{
          display: 'flex',
          borderRadius: '0.65rem',
          border: '1.5px solid var(--border)',
          overflow: 'hidden',
          background: 'var(--surface2)',
          transition: 'border-color 0.2s',
        }}
      >
        <span
          style={{
            padding: '0.7rem 0.9rem',
            fontSize: '0.82rem',
            color: 'var(--muted)',
            background: 'var(--surface3)',
            borderRight: '1.5px solid var(--border)',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            minWidth: 42,
            justifyContent: 'center',
          }}
        >
          {prefix}
        </span>
        <input
          type="number"
          value={value || ''}
          min={min}
          step={step}
          placeholder={placeholder}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text)',
            fontFamily: 'inherit',
            fontSize: '1rem',
            fontWeight: 600,
            padding: '0.7rem 0.9rem',
            width: '100%',
          }}
        />
      </div>
    </div>
  );
}

function Switch({ on, onChange, label, sub, accent = 'var(--accent)' }) {
  return (
    <div
      onClick={() => onChange(!on)}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.8rem',
        cursor: 'pointer',
        userSelect: 'none',
        padding: '0.5rem 0',
      }}
    >
      <div
        style={{
          width: 46,
          height: 26,
          borderRadius: 13,
          flexShrink: 0,
          marginTop: 1,
          background: on ? accent : 'var(--surface3)',
          border: `2px solid ${on ? accent : 'var(--border)'}`,
          position: 'relative',
          transition: 'all 0.22s',
          boxShadow: on ? `0 0 14px ${accent}55` : 'none',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 2,
            left: on ? 20 : 2,
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: '#fff',
            transition: 'left 0.22s',
            boxShadow: '0 1px 5px rgba(0,0,0,0.35)',
          }}
        />
      </div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: '0.88rem',
            color: 'var(--text)',
            fontWeight: 600,
            lineHeight: 1.3,
          }}
        >
          {label}
        </div>
        {sub && (
          <div
            style={{
              fontSize: '0.7rem',
              color: 'var(--muted)',
              marginTop: '0.15rem',
              lineHeight: 1.4,
            }}
          >
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}

function Card({ title, icon, accent, badge, badgeColor, children }) {
  return (
    <div
      style={{
        background: 'var(--card)',
        border: '1.5px solid var(--border)',
        borderRadius: '1.25rem',
        overflow: 'hidden',
        marginBottom: '1rem',
        boxShadow: '0 4px 28px rgba(0,0,0,0.22)',
      }}
    >
      {/* Card header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.9rem 1.1rem',
          background: `linear-gradient(135deg, ${accent}15 0%, transparent 70%)`,
          borderBottom: '1.5px solid var(--border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: '0.6rem',
              background: `${accent}22`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.05rem',
            }}
          >
            {icon}
          </div>
          <span
            style={{
              fontWeight: 800,
              fontSize: '0.78rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: accent,
            }}
          >
            {title}
          </span>
        </div>
        {badge && (
          <span
            style={{
              fontSize: '0.88rem',
              fontWeight: 800,
              color: badgeColor || accent,
              background: `${badgeColor || accent}15`,
              padding: '0.2rem 0.6rem',
              borderRadius: '0.4rem',
            }}
          >
            {badge}
          </span>
        )}
      </div>
      <div style={{ padding: '1.1rem 1.1rem 0.5rem' }}>{children}</div>
    </div>
  );
}

function Divider() {
  return (
    <div
      style={{ height: 1, background: 'var(--border)', margin: '0.6rem 0' }}
    />
  );
}

function DeductRow({ label, amount, color, sub, bold }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: '0.55rem 0',
        borderBottom: '1px solid var(--surface3)',
      }}
    >
      <div>
        <div
          style={{
            fontSize: bold ? '0.85rem' : '0.78rem',
            fontWeight: bold ? 700 : 500,
            color: bold ? 'var(--text)' : 'var(--muted)',
          }}
        >
          {label}
        </div>
        {sub && (
          <div
            style={{
              fontSize: '0.62rem',
              color: 'var(--muted)',
              marginTop: '0.1rem',
            }}
          >
            {sub}
          </div>
        )}
      </div>
      <div
        style={{
          fontSize: bold ? '0.98rem' : '0.85rem',
          fontWeight: bold ? 800 : 600,
          color,
          whiteSpace: 'nowrap',
          marginLeft: '0.5rem',
        }}
      >
        {amount}
      </div>
    </div>
  );
}

function InfoChip({ label, value, color, bg }) {
  return (
    <div
      style={{
        flex: 1,
        background: bg || 'var(--surface2)',
        border: '1.5px solid var(--border)',
        borderRadius: '0.85rem',
        padding: '0.75rem 0.85rem',
        minWidth: 0,
      }}
    >
      <div
        style={{
          fontSize: '0.6rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: 'var(--muted)',
          marginBottom: '0.3rem',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: '1.05rem',
          fontWeight: 800,
          color: color || 'var(--text)',
          lineHeight: 1.2,
        }}
      >
        {value}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   AMOUNT + PERIOD INPUT (for Recibo Verde & Social)
───────────────────────────────────────── */
function AmountPeriodInput({
  label,
  sub,
  on,
  onToggle,
  amount,
  onAmount,
  amtPeriod,
  onAmtPeriod,
  accent,
}) {
  return (
    <div style={{ marginBottom: '0.5rem' }}>
      <Switch
        on={on}
        onChange={onToggle}
        label={label}
        sub={sub}
        accent={accent}
      />
      {on && (
        <div
          style={{
            marginTop: '0.3rem',
            marginLeft: '0.2rem',
            padding: '0.9rem',
            background: `${accent}0d`,
            border: `1.5px solid ${accent}30`,
            borderRadius: '0.9rem',
            marginBottom: '0.5rem',
          }}
        >
          {/* Period picker */}
          <div style={{ marginBottom: '0.6rem' }}>
            <div
              style={{
                fontSize: '0.62rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--muted)',
                marginBottom: '0.4rem',
              }}
            >
              Amount frequency
            </div>
            <PeriodPicker value={amtPeriod} onChange={onAmtPeriod} small />
          </div>
          {/* Amount input */}
          <NumInput
            label={`Amount per ${PERIOD_LABEL[amtPeriod].toLowerCase()}`}
            value={amount}
            onChange={onAmount}
          />
          <div
            style={{
              fontSize: '0.7rem',
              color: accent,
              fontWeight: 600,
              textAlign: 'right',
            }}
          >
            ≈ {fmt(convertPeriod(amount, amtPeriod, 'monthly'))}/month
            &nbsp;·&nbsp; {fmt(convertPeriod(amount, amtPeriod, 'yearly'))}/year
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   ANIMATED NET INCOME CIRCLE
───────────────────────────────────────── */
function NetCircle({ net, gross, profit }) {
  const [displayed, setDisplayed] = useState(0);
  const [progress, setProgress] = useState(0);
  const prevNet = useRef(net);
  const animRef = useRef(null);

  useEffect(() => {
    const start = prevNet.current;
    const end = net;
    const pctEnd =
      gross > 0 ? Math.max(0, Math.min((net / gross) * 100, 100)) : 0;
    const duration = 900;
    const startTime = performance.now();
    if (animRef.current) cancelAnimationFrame(animRef.current);
    function tick(now) {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setDisplayed(start + (end - start) * ease);
      setProgress(pctEnd * ease);
      if (t < 1) animRef.current = requestAnimationFrame(tick);
      else prevNet.current = end;
    }
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [net, gross]);

  const size = 220;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct = gross > 0 ? Math.max(0, Math.min((net / gross) * 100, 100)) : 0;
  const offset = circ - (progress / 100) * circ;
  const color = profit ? '#10b981' : '#ef4444';
  const glow = profit ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '1.5rem 0 0.8rem',
      }}
    >
      <div style={{ position: 'relative', width: size, height: size }}>
        {/* Track */}
        <svg
          width={size}
          height={size}
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="#1a2540"
            strokeWidth={stroke}
          />
        </svg>
        {/* Glow arc */}
        <svg
          width={size}
          height={size}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            filter: `blur(6px) drop-shadow(0 0 12px ${glow})`,
            opacity: 0.7,
          }}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke + 4}
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
        {/* Main arc */}
        <svg
          width={size}
          height={size}
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: 'stroke 0.4s' }}
          />
        </svg>
        {/* Centre */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.15rem',
          }}
        >
          <div
            style={{
              fontSize: '0.58rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: 'var(--muted)',
            }}
          >
            Net Income
          </div>
          <div
            style={{
              fontSize: 'clamp(1.25rem,5vw,1.6rem)',
              fontWeight: 800,
              color,
              lineHeight: 1.1,
              fontVariantNumeric: 'tabular-nums',
              textShadow: `0 0 20px ${glow}`,
            }}
          >
            {new Intl.NumberFormat('pt-PT', {
              style: 'currency',
              currency: 'EUR',
              minimumFractionDigits: 2,
            }).format(displayed)}
          </div>
          <div
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              color: 'var(--muted)',
            }}
          >
            {pct.toFixed(1)}% kept
          </div>
        </div>
      </div>
      <div
        style={{
          marginTop: '0.6rem',
          fontSize: '0.72rem',
          fontWeight: 700,
          color: profit ? '#10b981' : '#ef4444',
          background: profit ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
          border: `1px solid ${profit ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
          padding: '0.35rem 0.9rem',
          borderRadius: '2rem',
        }}
      >
        {profit ? '✅ You are profitable' : '⚠️ Expenses exceed income'}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN APP
───────────────────────────────────────── */
export default function TVDECalc() {
  /* Period for the main calculator view */
  const [period, setPeriod] = useState('weekly');

  /* ── Income ── */
  const [gross, setGross] = useState(900);

  /* ── Recibo Verde ── */
  const [useRV, setUseRV] = useState(false);
  const [rvAmount, setRvAmount] = useState(0);
  const [rvPeriod, setRvPeriod] = useState('monthly');

  /* ── Car Rent ── */
  const [useCarRent, setUseCarRent] = useState(false);
  const [carRentAmt, setCarRentAmt] = useState(0);
  const [carRentPeriod, setCarRentPeriod] = useState('monthly');

  /* ── IVA ── */
  const [useIva, setUseIva] = useState(false);

  /* ── Social Security ── */
  const [useSocial, setUseSocial] = useState(false);
  const [socialAmount, setSocialAmount] = useState(0);
  const [socialPeriod, setSocialPeriod] = useState('monthly');

  /* ── IRS ── */
  const [useIRS, setUseIRS] = useState(false);
  const [irsRate, setIrsRate] = useState(15);

  /* ── Fuel ── */
  const [useFuel, setUseFuel] = useState(true);
  const [fuelMode, setFuelMode] = useState('calculate');
  const [fuelDirectAmt, setFuelDirectAmt] = useState(0);
  const [fuelDirectPeriod, setFuelDirectPeriod] = useState('monthly');
  const [fuelType, setFuelType] = useState('diesel');
  const [fuelPrice, setFuelPrice] = useState(1.65);
  const [kmDriven, setKmDriven] = useState(700);
  const [consumption, setConsumption] = useState(6.5);

  /* ── Fixed costs (always stored as monthly, scaled automatically) ── */
  const [useInsurance, setUseInsurance] = useState(true);
  const [insurance, setInsurance] = useState(120);
  const [useLease, setUseLease] = useState(false);
  const [lease, setLease] = useState(350);
  const [useMaint, setUseMaint] = useState(true);
  const [maint, setMaint] = useState(60);
  const [useParking, setUseParking] = useState(false);
  const [parking, setParking] = useState(40);
  const [usePhone, setUsePhone] = useState(false);
  const [phone, setPhone] = useState(20);

  /* ── Inspection ── */
  const [useInspection, setUseInspection] = useState(false);
  const [inspectionAmt, setInspectionAmt] = useState(0);
  const [inspectionPeriod, setInspectionPeriod] = useState('yearly');

  /* ── Analytics ── */
  const [useTrips, setUseTrips] = useState(false);
  const [trips, setTrips] = useState(80);
  const [useHours, setUseHours] = useState(false);
  const [hours, setHours] = useState(40);
  const [useGoal, setUseGoal] = useState(false);
  const [goal, setGoal] = useState(2000);

  /* Scale monthly to selected period */
  const scaleMonthly = (m) => (m / 30) * PERIOD_DAYS[period];

  const handleFuelType = (ft) => {
    setFuelType(ft);
    setFuelPrice(FUEL_DEFAULTS[ft].price);
    setConsumption(FUEL_DEFAULTS[ft].cons);
  };

  /* ── CALCULATION ── */
  const c = useMemo(() => {
    // Convert each deduction to the current VIEW period
    const rvAmt = useRV ? convertPeriod(rvAmount, rvPeriod, period) : 0;
    const carRentScaled = useCarRent
      ? convertPeriod(carRentAmt, carRentPeriod, period)
      : 0;
    const socialAmt = useSocial
      ? convertPeriod(socialAmount, socialPeriod, period)
      : 0;

    const afterDirect = gross - rvAmt - carRentScaled;
    const ivaAmt = useIva ? afterDirect * 0.06 : 0;
    const afterIva = afterDirect - ivaAmt;
    const irsAmt = useIRS ? afterIva * (irsRate / 100) : 0;

    const taxTotal = ivaAmt + socialAmt + irsAmt;

    // Fixed operating costs (monthly → period)
    const insuranceAmt = useInsurance ? scaleMonthly(insurance) : 0;
    const leaseAmt = useLease ? scaleMonthly(lease) : 0;
    const maintAmt = useMaint ? scaleMonthly(maint) : 0;
    const parkingAmt = useParking ? scaleMonthly(parking) : 0;
    const phoneAmt = usePhone ? scaleMonthly(phone) : 0;
    const inspectionScaled = useInspection
      ? convertPeriod(inspectionAmt, inspectionPeriod, period)
      : 0;
    const fixedTotal =
      insuranceAmt +
      leaseAmt +
      maintAmt +
      parkingAmt +
      phoneAmt +
      inspectionScaled;

    const fuelCalcAmt =
      fuelMode === 'calculate' && kmDriven > 0
        ? (kmDriven * consumption * fuelPrice) / 100
        : 0;
    const fuelDirectScaled =
      fuelMode === 'direct'
        ? convertPeriod(fuelDirectAmt, fuelDirectPeriod, period)
        : 0;
    const fuelAmt = useFuel
      ? fuelMode === 'calculate'
        ? fuelCalcAmt
        : fuelDirectScaled
      : 0;
    const costPerKm =
      fuelMode === 'calculate' && kmDriven > 0 && useFuel
        ? fuelAmt / kmDriven
        : 0;

    const totalExp = rvAmt + carRentScaled + taxTotal + fixedTotal + fuelAmt;
    const net = gross - totalExp;
    const keptPct = gross > 0 ? (net / gross) * 100 : 0;

    // Projections (always from whatever period is selected)
    const toDaily = (v) => v / PERIOD_DAYS[period];
    const dailyNet = toDaily(net);
    const weeklyNet = dailyNet * 7;
    const monthNet = dailyNet * 30;
    const yearNet = dailyNet * 365;

    const avgTrip = useTrips && trips > 0 ? net / trips : null;
    const hourlyNet = useHours && hours > 0 ? net / hours : null;
    const goalPct =
      useGoal && goal > 0 ? Math.min((monthNet / goal) * 100, 100) : null;

    return {
      gross,
      rvAmt,
      carRentScaled,
      ivaAmt,
      socialAmt,
      irsAmt,
      taxTotal,
      insuranceAmt,
      leaseAmt,
      maintAmt,
      parkingAmt,
      phoneAmt,
      inspectionScaled,
      fixedTotal,
      fuelAmt,
      costPerKm,
      totalExp,
      net,
      keptPct,
      dailyNet,
      weeklyNet,
      monthNet,
      yearNet,
      avgTrip,
      hourlyNet,
      goalPct,
    };
  }, [
    period,
    gross,
    useRV,
    rvAmount,
    rvPeriod,
    useCarRent,
    carRentAmt,
    carRentPeriod,
    useIva,
    useSocial,
    socialAmount,
    socialPeriod,
    useIRS,
    irsRate,
    useFuel,
    fuelMode,
    fuelDirectAmt,
    fuelDirectPeriod,
    fuelType,
    fuelPrice,
    kmDriven,
    consumption,
    useInsurance,
    insurance,
    useLease,
    lease,
    useMaint,
    maint,
    useParking,
    parking,
    usePhone,
    phone,
    useInspection,
    inspectionAmt,
    inspectionPeriod,
    useTrips,
    trips,
    useHours,
    hours,
    useGoal,
    goal,
  ]);

  const profit = c.net >= 0;

  // Bar segments
  const barSegs = [
    { val: c.rvAmt, color: S.blue, label: 'Recibo Verde' },
    { val: c.carRentScaled, color: S.purple, label: 'Car Rent' },
    { val: c.ivaAmt, color: S.yellow, label: 'IVA' },
    { val: c.socialAmt, color: S.orange, label: 'Social Sec.' },
    { val: c.irsAmt, color: S.red, label: 'IRS' },
    { val: c.fuelAmt, color: '#eab308', label: 'Fuel' },
    { val: c.fixedTotal, color: S.pink, label: 'Fixed' },
    { val: Math.max(c.net, 0), color: S.green, label: 'Net' },
  ].filter((s) => s.val > 0.01);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap');

        :root {
          --bg:         #060911;
          --card:       #0c1020;
          --surface2:   #111827;
          --surface3:   #0d1219;
          --border:     #1a2540;
          --text:       #eaf0fc;
          --muted:      #6b7fa8;
          --accent:     #10b981;
          --accent-glow:rgba(16,185,129,0.35);
          --font:       'Plus Jakarta Sans', sans-serif;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { -webkit-tap-highlight-color: transparent; height: 100%; }
        body {
          background: var(--bg);
          color: var(--text);
          font-family: var(--font);
          min-height: 100vh;
          width: 100%;
          padding-bottom: env(safe-area-inset-bottom, 20px);
          background-image:
            radial-gradient(ellipse 80% 40% at 50% 0%, rgba(16,185,129,0.08), transparent 60%),
            radial-gradient(ellipse 60% 60% at 90% 90%, rgba(99,102,241,0.05), transparent 60%);
        }
        #root {
          width: 100%;
          min-height: 100vh;
        }

        input[type=number]  { -moz-appearance: textfield; }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }

        input[type=range] {
          -webkit-appearance: none; width: 100%;
          height: 5px; border-radius: 3px;
          background: var(--border); outline: none; cursor: pointer;
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none; width: 22px; height: 22px;
          border-radius: 50%; background: var(--accent);
          border: 3px solid var(--bg); cursor: pointer;
          box-shadow: 0 0 0 2px var(--accent), 0 2px 8px var(--accent-glow);
        }

        button { cursor: pointer; }

        /* scrollbar */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

        .app {
          max-width: 560px;
          width: 100%;
          margin-left: auto;
          margin-right: auto;
          padding: 0 1rem 5rem;
        }

        /* Top hero summary bar */
        .summary-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .summary-card {
          border-radius: 1rem;
          padding: 0.85rem 0.7rem;
          text-align: center;
          border: 1.5px solid;
        }

        .proj-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
          margin-bottom: 0.8rem;
        }

        .fuel-seg { display: flex; border-radius: 0.6rem; overflow: hidden; }
        .fuel-seg button {
          flex: 1; padding: 0.65rem 0.3rem;
          border: 1.5px solid var(--border);
          background: var(--surface2); color: var(--muted);
          font-family: var(--font); font-size: 0.72rem; font-weight: 700;
          text-align: center; transition: all 0.18s;
        }
        .fuel-seg button:first-child { border-radius: 0.6rem 0 0 0.6rem; border-right: none; }
        .fuel-seg button:last-child  { border-radius: 0 0.6rem 0.6rem 0; border-left: none; }
        .fuel-seg button.active      { background: rgba(245,158,11,0.12); border-color: #f59e0b; color: #f59e0b; }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .slide-down { animation: slideDown 0.2s ease both; }

        @keyframes pop {
          0%   { transform: scale(1); }
          40%  { transform: scale(1.04); }
          100% { transform: scale(1); }
        }
        .pop { animation: pop 0.3s ease; }
      `}</style>

      <div className="app">
        {/* ══════════ HEADER ══════════ */}
        <div style={{ textAlign: 'center', padding: '1.8rem 0 1.2rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.62rem',
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: S.green,
              background: 'rgba(16,185,129,0.09)',
              border: '1.5px solid rgba(16,185,129,0.22)',
              padding: '0.3rem 0.9rem',
              borderRadius: '2rem',
              marginBottom: '0.85rem',
            }}
          >
            🚗 TVDE Pertugal
          </div>

          <h1
            style={{
              fontSize: 'clamp(1.7rem,6vw,2.2rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              background: 'linear-gradient(135deg, #fff 25%, #10b981 70%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Income Calculator By Khalid Hasan
          </h1>

          <p
            style={{
              color: 'var(--muted)',
              fontSize: '0.8rem',
              marginTop: '0.5rem',
            }}
          >
            Know exactly what you earn and what you spend
          </p>
        </div>

        {/* ══════════ PERIOD SELECTOR ══════════ */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '1.4rem',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '0.62rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--muted)',
                textAlign: 'center',
                marginBottom: '0.4rem',
              }}
            >
              View results by
            </div>
            <PeriodPicker value={period} onChange={setPeriod} />
          </div>
        </div>

        {/* ══════════ SUMMARY HERO ══════════ */}
        <div className="summary-row">
          {[
            {
              icon: '💰',
              label: 'Earned',
              val: fmt(c.gross),
              accent: S.green,
              border: `${S.green}35`,
            },
            {
              icon: '📤',
              label: 'Spent',
              val: fmt(c.totalExp),
              accent: S.red,
              border: `${S.red}35`,
            },
            {
              icon: '✅',
              label: 'Net',
              val: fmt(c.net),
              accent: profit ? S.green : S.red,
              border: profit ? `${S.green}35` : `${S.red}35`,
            },
          ].map(({ icon, label, val, accent, border }) => (
            <div
              key={label}
              className="summary-card"
              style={{
                borderColor: border,
                background: `${accent}0a`,
              }}
            >
              <div style={{ fontSize: '1.3rem', marginBottom: '0.25rem' }}>
                {icon}
              </div>
              <div
                style={{
                  fontSize: '0.58rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'var(--muted)',
                  marginBottom: '0.3rem',
                }}
              >
                {label}
              </div>
              <div
                style={{
                  fontSize: 'clamp(0.85rem,3.5vw,1.05rem)',
                  fontWeight: 800,
                  color: accent,
                  lineHeight: 1.2,
                }}
              >
                {val}
              </div>
            </div>
          ))}
        </div>

        {/* ══════════ EXPENSE BAR ══════════ */}
        {c.gross > 0 && (
          <div
            style={{
              background: 'var(--card)',
              border: '1.5px solid var(--border)',
              borderRadius: '1rem',
              padding: '0.9rem 1rem',
              marginBottom: '1rem',
            }}
          >
            <div
              style={{
                fontSize: '0.62rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--muted)',
                marginBottom: '0.55rem',
              }}
            >
              Where your money goes
            </div>
            <div
              style={{
                display: 'flex',
                height: 18,
                borderRadius: '0.4rem',
                overflow: 'hidden',
                gap: 1.5,
              }}
            >
              {barSegs.map(({ val, color, label }) => (
                <div
                  key={label}
                  title={`${label}: ${fmt(val)}`}
                  style={{
                    width: `${(val / c.gross) * 100}%`,
                    background: color,
                    minWidth: 2,
                    borderRadius: 2,
                    transition: 'width 0.4s ease',
                  }}
                />
              ))}
            </div>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.3rem 0.75rem',
                marginTop: '0.55rem',
              }}
            >
              {barSegs.map(({ val, color, label }) => (
                <div
                  key={label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.28rem',
                    fontSize: '0.62rem',
                    color: 'var(--muted)',
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 2,
                      background: color,
                      flexShrink: 0,
                    }}
                  />
                  {label}{' '}
                  <span style={{ color }}>
                    {((val / c.gross) * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════ INCOME CARD ══════════ */}
        <Card
          title="Gross Income"
          icon="💰"
          accent={S.green}
          badge={fmt(c.gross)}
        >
          <NumInput
            label={`Gross income per ${PERIOD_LABEL[period].toLowerCase()}`}
            value={gross}
            onChange={setGross}
          />
          <div
            style={{
              fontSize: '0.68rem',
              color: 'var(--muted)',
              lineHeight: 1.5,
              paddingBottom: '0.5rem',
            }}
          >
            Enter the total you receive from Uber / Bolt before any deductions.
          </div>
        </Card>

        {/* ══════════ RECIBO VERDE ══════════ */}
        <Card
          title="Recibo Verde"
          icon="🧾"
          accent={S.blue}
          badge={useRV ? `-${fmt(c.rvAmt)}` : undefined}
          badgeColor={S.blue}
        >
          <AmountPeriodInput
            label="Recibo Verde"
            sub="Receipt issuance fee — fixed amount paid to the operator or AT"
            on={useRV}
            onToggle={setUseRV}
            amount={rvAmount}
            onAmount={setRvAmount}
            amtPeriod={rvPeriod}
            onAmtPeriod={setRvPeriod}
            accent={S.blue}
          />
          {useRV && (
            <div
              style={{
                display: 'flex',
                gap: '0.5rem',
                paddingBottom: '0.5rem',
              }}
            >
              <InfoChip
                label={`Per ${PERIOD_LABEL[period].toLowerCase()}`}
                value={fmt(c.rvAmt)}
                color={S.blue}
              />
              <InfoChip
                label="Per month"
                value={fmt(convertPeriod(rvAmount, rvPeriod, 'monthly'))}
                color={S.blue}
              />
              <InfoChip
                label="Per year"
                value={fmt(convertPeriod(rvAmount, rvPeriod, 'yearly'))}
                color={S.blue}
              />
            </div>
          )}
        </Card>

        {/* ══════════ CAR RENT ══════════ */}
        <Card
          title="Car Rent Fee"
          icon="🚘"
          accent={S.purple}
          badge={useCarRent ? `-${fmt(c.carRentScaled)}` : undefined}
          badgeColor={S.purple}
        >
          <Switch
            on={useCarRent}
            onChange={setUseCarRent}
            label="Vehicle rental / rent"
            sub="Monthly cost of the rented TVDE vehicle"
            accent={S.purple}
          />
          {useCarRent && (
            <div className="slide-down">
              <div
                style={{
                  marginTop: '0.6rem',
                  padding: '0.9rem',
                  background: `${S.purple}0d`,
                  border: `1.5px solid ${S.purple}30`,
                  borderRadius: '0.9rem',
                  marginBottom: '0.5rem',
                }}
              >
                <div
                  style={{
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'var(--muted)',
                    marginBottom: '0.4rem',
                  }}
                >
                  Amount frequency
                </div>
                <PeriodPicker
                  value={carRentPeriod}
                  onChange={setCarRentPeriod}
                  small
                />
                <div style={{ marginTop: '0.6rem' }}>
                  <NumInput
                    label={`Rent per ${PERIOD_LABEL[carRentPeriod].toLowerCase()}`}
                    value={carRentAmt}
                    onChange={setCarRentAmt}
                  />
                </div>
                <div
                  style={{
                    fontSize: '0.7rem',
                    color: S.purple,
                    fontWeight: 600,
                    textAlign: 'right',
                  }}
                >
                  ≈ {fmt(convertPeriod(carRentAmt, carRentPeriod, 'monthly'))}
                  /month &nbsp;·&nbsp;{' '}
                  {fmt(convertPeriod(carRentAmt, carRentPeriod, 'yearly'))}/year
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  paddingBottom: '0.5rem',
                }}
              >
                <InfoChip
                  label={`Per ${PERIOD_LABEL[period].toLowerCase()}`}
                  value={fmt(c.carRentScaled)}
                  color={S.purple}
                />
                <InfoChip
                  label="Per month"
                  value={fmt(
                    convertPeriod(carRentAmt, carRentPeriod, 'monthly'),
                  )}
                  color={S.purple}
                />
                <InfoChip
                  label="Per year"
                  value={fmt(
                    convertPeriod(carRentAmt, carRentPeriod, 'yearly'),
                  )}
                  color={S.purple}
                />
              </div>
            </div>
          )}
        </Card>

        {/* ══════════ IMPOSTOS ══════════ */}
        <Card
          title="Taxes & Contributions"
          icon="🏛️"
          accent={S.indigo}
          badge={`-${fmt(c.taxTotal)}`}
          badgeColor={S.red}
        >
          {/* IVA */}
          <Switch
            on={useIva}
            onChange={setUseIva}
            accent={S.yellow}
            label="IVA — 6%"
            sub="Value Added Tax (TVDE simplified regime)"
          />
          {useIva && (
            <div
              className="slide-down"
              style={{
                marginLeft: '0.2rem',
                marginBottom: '0.5rem',
                padding: '0.65rem 0.9rem',
                background: 'rgba(245,158,11,0.08)',
                border: '1.5px solid rgba(245,158,11,0.25)',
                borderRadius: '0.75rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.8rem',
                }}
              >
                <span style={{ color: 'var(--muted)' }}>
                  IVA calculated (6% of income)
                </span>
                <span style={{ color: S.yellow, fontWeight: 800 }}>
                  -{fmt(c.ivaAmt)}
                </span>
              </div>
            </div>
          )}

          <Divider />

          {/* Social Security — MANUAL AMOUNT */}
          <AmountPeriodInput
            label="Social Security"
            sub="Contribuições para a Social Security — introduza o valor exato que paga"
            on={useSocial}
            onToggle={setUseSocial}
            amount={socialAmount}
            onAmount={setSocialAmount}
            amtPeriod={socialPeriod}
            onAmtPeriod={setSocialPeriod}
            accent={S.orange}
          />
          {useSocial && (
            <div
              style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}
            >
              <InfoChip
                label={`Per ${PERIOD_LABEL[period].toLowerCase()}`}
                value={fmt(c.socialAmt)}
                color={S.orange}
              />
              <InfoChip
                label="Per month"
                value={fmt(
                  convertPeriod(socialAmount, socialPeriod, 'monthly'),
                )}
                color={S.orange}
              />
              <InfoChip
                label="Per year"
                value={fmt(convertPeriod(socialAmount, socialPeriod, 'yearly'))}
                color={S.orange}
              />
            </div>
          )}

          <Divider />

          {/* IRS */}
          <Switch
            on={useIRS}
            onChange={setUseIRS}
            accent={S.red}
            label="IRS — Income Tax Withholding"
            sub="Income tax (estimated rate)"
          />
          {useIRS && (
            <div
              className="slide-down"
              style={{
                marginLeft: '0.2rem',
                marginBottom: '0.5rem',
                padding: '0.9rem',
                background: 'rgba(239,68,68,0.07)',
                border: '1.5px solid rgba(239,68,68,0.25)',
                borderRadius: '0.85rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.07em',
                  color: 'var(--muted)',
                  marginBottom: '0.35rem',
                }}
              >
                <span>IRS Rate</span>
                <span style={{ color: 'var(--text)' }}>{irsRate}%</span>
              </div>
              <input
                type="range"
                min={5}
                max={48}
                step={1}
                value={irsRate}
                onChange={(e) => setIrsRate(Number(e.target.value))}
                style={{ accentColor: S.red }}
              />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.78rem',
                  marginTop: '0.5rem',
                }}
              >
                <span style={{ color: 'var(--muted)' }}>IRS to pay</span>
                <span style={{ color: S.red, fontWeight: 800 }}>
                  -{fmt(c.irsAmt)}
                </span>
              </div>
            </div>
          )}
          <div style={{ height: '0.4rem' }} />
        </Card>

        {/* ══════════ FUEL ══════════ */}
        <Card
          title="Fuel"
          icon="⛽"
          accent="#f59e0b"
          badge={useFuel ? `-${fmt(c.fuelAmt)}` : 'Off'}
          badgeColor={useFuel ? S.red : 'var(--muted)'}
        >
          <Switch
            on={useFuel}
            onChange={setUseFuel}
            accent="#f59e0b"
            label="Include fuel costs"
          />
          {useFuel && (
            <div className="slide-down">
              {/* Mode toggle */}
              <div
                style={{
                  display: 'flex',
                  background: 'var(--surface2)',
                  borderRadius: '0.65rem',
                  padding: '0.2rem',
                  gap: '0.2rem',
                  marginBottom: '1rem',
                  marginTop: '0.4rem',
                }}
              >
                {[
                  { id: 'calculate', icon: '🧮', label: 'Calculate from KM' },
                  { id: 'direct', icon: '✏️', label: 'Enter amount' },
                ].map(({ id, icon, label }) => (
                  <button
                    key={id}
                    onClick={() => setFuelMode(id)}
                    style={{
                      flex: 1,
                      padding: '0.6rem 0.4rem',
                      borderRadius: '0.5rem',
                      border: 'none',
                      background: fuelMode === id ? '#f59e0b' : 'transparent',
                      color: fuelMode === id ? '#000' : 'var(--muted)',
                      fontFamily: 'inherit',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.18s',
                      boxShadow:
                        fuelMode === id
                          ? '0 2px 10px rgba(245,158,11,0.35)'
                          : 'none',
                    }}
                  >
                    {icon} {label}
                  </button>
                ))}
              </div>

              {/* CALCULATE MODE */}
              {fuelMode === 'calculate' && (
                <div className="slide-down">
                  <div className="fuel-seg" style={{ marginBottom: '0.9rem' }}>
                    {['diesel', 'petrol', 'electric'].map((ft) => (
                      <button
                        key={ft}
                        className={fuelType === ft ? 'active' : ''}
                        onClick={() => handleFuelType(ft)}
                      >
                        {ft === 'electric'
                          ? '⚡ Electric'
                          : ft === 'diesel'
                            ? '🛢 Diesel'
                            : '⛽ Petrol'}
                      </button>
                    ))}
                  </div>
                  <NumInput
                    label={
                      fuelType === 'electric'
                        ? 'Price per kWh (€)'
                        : 'Price per litre (€)'
                    }
                    value={fuelPrice}
                    onChange={setFuelPrice}
                    step={0.01}
                  />
                  <NumInput
                    label={`KM driven per ${PERIOD_LABEL[period].toLowerCase()}`}
                    value={kmDriven}
                    onChange={setKmDriven}
                    prefix="km"
                    step={10}
                  />
                  <div style={{ marginBottom: '0.9rem' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.07em',
                        color: 'var(--muted)',
                        marginBottom: '0.3rem',
                      }}
                    >
                      <span>Consumption ({FUEL_DEFAULTS[fuelType].unit})</span>
                      <span style={{ color: 'var(--text)' }}>
                        {consumption}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={fuelType === 'electric' ? 10 : 4}
                      max={fuelType === 'electric' ? 30 : 15}
                      step={0.1}
                      value={consumption}
                      onChange={(e) => setConsumption(Number(e.target.value))}
                      style={{ accentColor: '#f59e0b' }}
                    />
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      gap: '0.5rem',
                      marginBottom: '0.5rem',
                    }}
                  >
                    <InfoChip
                      label="Total fuel"
                      value={fmt(c.fuelAmt)}
                      color="#f59e0b"
                    />
                    <InfoChip
                      label="Cost per km"
                      value={fmt(c.costPerKm)}
                      color="#f59e0b"
                    />
                  </div>
                </div>
              )}

              {/* DIRECT AMOUNT MODE */}
              {fuelMode === 'direct' && (
                <div
                  className="slide-down"
                  style={{
                    padding: '1rem',
                    background: 'rgba(245,158,11,0.07)',
                    border: '1.5px solid rgba(245,158,11,0.28)',
                    borderRadius: '0.9rem',
                    marginBottom: '0.5rem',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.62rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: 'var(--muted)',
                      marginBottom: '0.45rem',
                    }}
                  >
                    Amount frequency
                  </div>
                  <PeriodPicker
                    value={fuelDirectPeriod}
                    onChange={setFuelDirectPeriod}
                    small
                  />
                  <div style={{ marginTop: '0.7rem' }}>
                    <NumInput
                      label={`Fuel cost per ${PERIOD_LABEL[fuelDirectPeriod].toLowerCase()}`}
                      value={fuelDirectAmt}
                      onChange={setFuelDirectAmt}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: '0.7rem',
                      color: '#f59e0b',
                      fontWeight: 600,
                      textAlign: 'right',
                      marginBottom: '0.6rem',
                    }}
                  >
                    ≈{' '}
                    {fmt(
                      convertPeriod(fuelDirectAmt, fuelDirectPeriod, 'monthly'),
                    )}
                    /month &nbsp;·&nbsp;{' '}
                    {fmt(
                      convertPeriod(fuelDirectAmt, fuelDirectPeriod, 'yearly'),
                    )}
                    /year
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <InfoChip
                      label={`Per ${PERIOD_LABEL[period].toLowerCase()}`}
                      value={fmt(c.fuelAmt)}
                      color="#f59e0b"
                    />
                    <InfoChip
                      label="Per month"
                      value={fmt(
                        convertPeriod(
                          fuelDirectAmt,
                          fuelDirectPeriod,
                          'monthly',
                        ),
                      )}
                      color="#f59e0b"
                    />
                    <InfoChip
                      label="Per year"
                      value={fmt(
                        convertPeriod(
                          fuelDirectAmt,
                          fuelDirectPeriod,
                          'yearly',
                        ),
                      )}
                      color="#f59e0b"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* ══════════ FIXED COSTS ══════════ */}
        <Card
          title="Fixed Monthly Costs"
          icon="📋"
          accent={S.pink}
          badge={`-${fmt(c.fixedTotal)}`}
          badgeColor={S.red}
        >
          <div
            style={{
              fontSize: '0.68rem',
              color: 'var(--muted)',
              padding: '0.5rem 0.7rem',
              background: `${S.pink}0a`,
              border: `1px solid ${S.pink}25`,
              borderRadius: '0.6rem',
              marginBottom: '0.8rem',
              lineHeight: 1.5,
            }}
          >
            💡 Enter monthly values — automatically converted to the selected
            period
          </div>

          {[
            {
              use: useInsurance,
              setUse: setUseInsurance,
              val: insurance,
              setVal: setInsurance,
              label: 'TVDE Insurance',
              sub: 'Mandatory insurance for TVDE drivers',
              accent: S.pink,
            },
            {
              use: useLease,
              setUse: setUseLease,
              val: lease,
              setVal: setLease,
              label: 'Car loan / lease',
              sub: 'Monthly car leasing / loan payment',
              accent: S.pink,
            },
            {
              use: useMaint,
              setUse: setUseMaint,
              val: maint,
              setVal: setMaint,
              label: 'Car maintenance',
              sub: 'Tyres, oil, service (monthly average)',
              accent: S.pink,
            },
            {
              use: useParking,
              setUse: setUseParking,
              val: parking,
              setVal: setParking,
              label: 'Parking / tolls',
              sub: 'Average monthly costs',
              accent: S.pink,
            },
            {
              use: usePhone,
              setUse: setUsePhone,
              val: phone,
              setVal: setPhone,
              label: 'Phone / data plan',
              sub: 'Plan for GPS and apps (monthly)',
              accent: S.pink,
            },
          ].map(({ use, setUse, val, setVal, label, sub, accent }) => (
            <div key={label}>
              <Switch
                on={use}
                onChange={setUse}
                label={label}
                sub={sub}
                accent={accent}
              />
              {use && (
                <div
                  className="slide-down"
                  style={{ paddingLeft: '0.5rem', marginBottom: '0.5rem' }}
                >
                  <NumInput
                    label="Monthly cost"
                    value={val}
                    onChange={setVal}
                    hint={`≈ ${fmt((val / 30) * PERIOD_DAYS[period])} per ${PERIOD_LABEL[period].toLowerCase()}`}
                  />
                </div>
              )}
            </div>
          ))}

          {/* ── Inspection ── */}
          <Switch
            on={useInspection}
            onChange={setUseInspection}
            accent="#22d3ee"
            label="Vehicle Inspection (IPO)"
            sub="Mandatory vehicle inspection — enter your actual cost"
          />
          {useInspection && (
            <div
              className="slide-down"
              style={{
                marginLeft: '0.2rem',
                padding: '0.9rem',
                background: 'rgba(34,211,238,0.07)',
                border: '1.5px solid rgba(34,211,238,0.28)',
                borderRadius: '0.9rem',
                marginBottom: '0.5rem',
              }}
            >
              <div
                style={{
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--muted)',
                  marginBottom: '0.45rem',
                }}
              >
                Amount frequency
              </div>
              <PeriodPicker
                value={inspectionPeriod}
                onChange={setInspectionPeriod}
                small
              />
              <div style={{ marginTop: '0.7rem' }}>
                <NumInput
                  label={`Inspection cost per ${PERIOD_LABEL[inspectionPeriod].toLowerCase()}`}
                  value={inspectionAmt}
                  onChange={setInspectionAmt}
                />
              </div>
              <div
                style={{
                  fontSize: '0.7rem',
                  color: '#22d3ee',
                  fontWeight: 600,
                  textAlign: 'right',
                  marginBottom: '0.5rem',
                }}
              >
                ≈{' '}
                {fmt(convertPeriod(inspectionAmt, inspectionPeriod, 'monthly'))}
                /month &nbsp;·&nbsp;{' '}
                {fmt(convertPeriod(inspectionAmt, inspectionPeriod, 'yearly'))}
                /year
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <InfoChip
                  label={`Per ${PERIOD_LABEL[period].toLowerCase()}`}
                  value={fmt(c.inspectionScaled)}
                  color="#22d3ee"
                />
                <InfoChip
                  label="Per month"
                  value={fmt(
                    convertPeriod(inspectionAmt, inspectionPeriod, 'monthly'),
                  )}
                  color="#22d3ee"
                />
                <InfoChip
                  label="Per year"
                  value={fmt(
                    convertPeriod(inspectionAmt, inspectionPeriod, 'yearly'),
                  )}
                  color="#22d3ee"
                />
              </div>
            </div>
          )}
        </Card>

        {/* ══════════ RESUMO COMPLETO ══════════ */}
        <Card title="Full Breakdown" icon="📊" accent={S.slate}>
          <DeductRow
            label="Gross income"
            amount={fmt(c.gross)}
            color={S.green}
            bold
          />

          {(useRV || useCarRent) && (
            <>
              <div
                style={{
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'var(--muted)',
                  padding: '0.45rem 0 0.1rem',
                }}
              >
                Direct Deductions
              </div>
              {useRV && (
                <DeductRow
                  label="Recibo Verde"
                  amount={`-${fmt(c.rvAmt)}`}
                  color={S.blue}
                />
              )}
              {useCarRent && (
                <DeductRow
                  label="Car rent"
                  amount={`-${fmt(c.carRentScaled)}`}
                  color={S.purple}
                />
              )}
            </>
          )}

          {(useIva || useSocial || useIRS) && (
            <>
              <div
                style={{
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'var(--muted)',
                  padding: '0.45rem 0 0.1rem',
                }}
              >
                Taxes
              </div>
              {useIva && (
                <DeductRow
                  label="IVA (6%)"
                  amount={`-${fmt(c.ivaAmt)}`}
                  color={S.yellow}
                />
              )}
              {useSocial && (
                <DeductRow
                  label="Social Security"
                  amount={`-${fmt(c.socialAmt)}`}
                  color={S.orange}
                />
              )}
              {useIRS && (
                <DeductRow
                  label={`IRS (${irsRate}%)`}
                  amount={`-${fmt(c.irsAmt)}`}
                  color={S.red}
                />
              )}
            </>
          )}

          {(useFuel ||
            useInsurance ||
            useLease ||
            useMaint ||
            useParking ||
            usePhone) && (
            <>
              <div
                style={{
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'var(--muted)',
                  padding: '0.45rem 0 0.1rem',
                }}
              >
                Operating Costs
              </div>
              {useFuel && (
                <DeductRow
                  label="Fuel"
                  amount={`-${fmt(c.fuelAmt)}`}
                  color="#eab308"
                  sub={`${kmDriven} km · ${fmt(c.costPerKm)}/km`}
                />
              )}
              {useInsurance && (
                <DeductRow
                  label="TVDE Insurance"
                  amount={`-${fmt(c.insuranceAmt)}`}
                  color={S.pink}
                />
              )}
              {useLease && (
                <DeductRow
                  label="Car loan / lease"
                  amount={`-${fmt(c.leaseAmt)}`}
                  color={S.pink}
                />
              )}
              {useMaint && (
                <DeductRow
                  label="Maintenance"
                  amount={`-${fmt(c.maintAmt)}`}
                  color={S.pink}
                />
              )}
              {useParking && (
                <DeductRow
                  label="Estac. / portagens"
                  amount={`-${fmt(c.parkingAmt)}`}
                  color={S.pink}
                />
              )}
              {usePhone && (
                <DeductRow
                  label="Phone plan"
                  amount={`-${fmt(c.phoneAmt)}`}
                  color={S.pink}
                />
              )}
              {useInspection && (
                <DeductRow
                  label="Vehicle Inspection (IPO)"
                  amount={`-${fmt(c.inspectionScaled)}`}
                  color="#22d3ee"
                />
              )}
            </>
          )}

          <DeductRow
            label="Total expenses"
            amount={`-${fmt(c.totalExp)}`}
            color={S.red}
            bold
          />

          {/* ── Animated Net Income Circle ── */}
          <NetCircle net={c.net} gross={c.gross} profit={profit} />
          <div style={{ height: '0.3rem' }} />
        </Card>

        {/* ══════════ PROJEÇÕES ══════════ */}
        <Card title="Projections" icon="📈" accent={S.blue}>
          <div className="proj-row">
            {[
              { l: 'Per day', v: fmt(c.dailyNet) },
              { l: 'Per week', v: fmt(c.weeklyNet) },
              { l: 'Per month', v: fmt(c.monthNet) },
              { l: 'Per year', v: fmt(c.yearNet) },
            ].map(({ l, v }) => (
              <div
                key={l}
                style={{
                  background: 'var(--surface2)',
                  border: '1.5px solid var(--border)',
                  borderRadius: '0.9rem',
                  padding: '0.85rem',
                }}
              >
                <div
                  style={{
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: 'var(--muted)',
                    marginBottom: '0.3rem',
                  }}
                >
                  {l}
                </div>
                <div
                  style={{
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    color: S.blue,
                  }}
                >
                  {v}
                </div>
              </div>
            ))}
          </div>
          <div style={{ height: '0.3rem' }} />
        </Card>

        {/* ══════════ ANALYTICS ══════════ */}
        <Card title="Detailed Analytics" icon="🔍" accent={S.indigo}>
          {/* Trips */}
          <Switch
            on={useTrips}
            onChange={setUseTrips}
            accent={S.indigo}
            label="Trip analytics"
            sub="Calculate average earnings per trip"
          />
          {useTrips && (
            <div
              className="slide-down"
              style={{ paddingLeft: '0.2rem', marginBottom: '0.5rem' }}
            >
              <NumInput
                label={`Number of trips per ${PERIOD_LABEL[period].toLowerCase()}`}
                value={trips}
                onChange={setTrips}
                prefix="🚗"
              />
              <div
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  marginBottom: '0.5rem',
                }}
              >
                <InfoChip
                  label="Net / trip"
                  value={c.avgTrip !== null ? fmt(c.avgTrip) : '—'}
                  color={S.indigo}
                />
                <InfoChip
                  label="Gross / trip"
                  value={trips > 0 ? fmt(c.gross / trips) : '—'}
                  color="var(--muted)"
                />
              </div>
            </div>
          )}

          <Divider />

          {/* Hours */}
          <Switch
            on={useHours}
            onChange={setUseHours}
            accent={S.indigo}
            label="Hourly rate"
            sub="Calculate the real value of your working hour"
          />
          {useHours && (
            <div
              className="slide-down"
              style={{ paddingLeft: '0.2rem', marginBottom: '0.5rem' }}
            >
              <NumInput
                label={`Hours worked per ${PERIOD_LABEL[period].toLowerCase()}`}
                value={hours}
                onChange={setHours}
                prefix="⏱"
              />
              <div
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  marginBottom: '0.5rem',
                }}
              >
                <InfoChip
                  label="Net / hour"
                  value={c.hourlyNet !== null ? `${fmt(c.hourlyNet)}/h` : '—'}
                  color={S.indigo}
                />
                <InfoChip
                  label="Gross / hour"
                  value={hours > 0 ? `${fmt(c.gross / hours)}/h` : '—'}
                  color="var(--muted)"
                />
              </div>
            </div>
          )}

          <Divider />

          {/* Goal */}
          <Switch
            on={useGoal}
            onChange={setUseGoal}
            accent={S.green}
            label="Monthly goal"
            sub="Track progress towards your goal"
          />
          {useGoal && (
            <div
              className="slide-down"
              style={{ paddingLeft: '0.2rem', marginBottom: '0.5rem' }}
            >
              <NumInput
                label="Monthly goal (€)"
                value={goal}
                onChange={setGoal}
              />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.75rem',
                  marginBottom: '0.45rem',
                }}
              >
                <span style={{ color: 'var(--muted)' }}>
                  Progress to {fmt(goal)}/month
                </span>
                <span style={{ color: S.green, fontWeight: 800 }}>
                  {c.goalPct !== null ? `${c.goalPct.toFixed(0)}%` : '—'}
                </span>
              </div>
              <div
                style={{
                  height: 12,
                  background: 'var(--surface3)',
                  borderRadius: 6,
                  overflow: 'hidden',
                  border: '1px solid var(--border)',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    borderRadius: 6,
                    background: `linear-gradient(90deg, ${S.indigo}, ${S.green})`,
                    width: `${c.goalPct ?? 0}%`,
                    transition: 'width 0.4s ease',
                    boxShadow: '0 0 12px rgba(16,185,129,0.4)',
                  }}
                />
              </div>
              <div
                style={{
                  fontSize: '0.68rem',
                  color: 'var(--muted)',
                  marginTop: '0.4rem',
                  textAlign: 'right',
                }}
              >
                Current monthly estimate:{' '}
                <strong style={{ color: S.green }}>{fmt(c.monthNet)}</strong>
              </div>
            </div>
          )}
          <div style={{ height: '0.3rem' }} />
        </Card>

        {/* Footer */}
        <div
          style={{
            textAlign: 'center',
            color: 'var(--muted)',
            fontSize: '0.62rem',
            marginTop: '1rem',
            lineHeight: 1.7,
            padding: '0 1rem',
          }}
        >
          🔒 All data stays on your device — nothing is sent to servers
          <br />
          Indicative values only · Consult a certified accountant (TOC) for
          official filings
        </div>
      </div>
    </>
  );
}
