import { useEffect, useMemo, useRef, useState } from 'react';

type RoleInfo = {
  name: string;
  multiplier: number;
  isWin: boolean;
  isPinzoro: boolean;
};

type NotFoundSectionProps = {
  diceBase: string;
  showDebugPinzoro?: boolean;
};

const clampValue = (value: number, max: number) => Math.min(Math.max(value, 1), max);

export default function NotFoundSection({ diceBase, showDebugPinzoro = false }: NotFoundSectionProps) {
  const [diceValues, setDiceValues] = useState<[number, number, number]>([1, 1, 1]);
  const [chips, setChips] = useState(100);
  const [bet, setBet] = useState(10);
  const [roleText, setRoleText] = useState('');
  const [resultText, setResultText] = useState('');
  const [deltaText, setDeltaText] = useState('');
  const [isPinzoro, setIsPinzoro] = useState(false);
  const hasRolledRef = useRef(false);

  const maxBet = useMemo(() => Math.max(1, chips), [chips]);

  const rollDie = () => Math.floor(Math.random() * 6) + 1;

  const getRole = (values: number[]): RoleInfo | null => {
    const sorted = [...values].sort();
    const isTriple = values.every((value) => value === values[0]);
    if (isTriple) {
      if (values[0] === 1) return { name: 'ピンゾロ', multiplier: 5, isWin: true, isPinzoro: true };
      if (values[0] === 6) return { name: 'アラシ', multiplier: 3, isWin: true, isPinzoro: false };
      return { name: `${values[0]}ゾロ`, multiplier: 2, isWin: true, isPinzoro: false };
    }
    if (sorted.join(',') === '1,2,3') {
      return { name: 'ヒフミ', multiplier: -2, isWin: false, isPinzoro: false };
    }
    if (sorted.join(',') === '4,5,6') {
      return { name: 'シゴロ', multiplier: 2, isWin: true, isPinzoro: false };
    }
    const counts = values.reduce<Record<number, number>>(
      (acc, value) => ({ ...acc, [value]: (acc[value] ?? 0) + 1 }),
      {},
    );
    const pair = Object.keys(counts).find((key) => counts[Number(key)] === 2);
    if (pair) {
      const single = values.find((value) => value !== Number(pair)) ?? Number(pair);
      const isWin = single >= 4;
      return { name: `${single}の目`, multiplier: isWin ? 1 : -1, isWin, isPinzoro: false };
    }
    return null;
  };

  const handleRoll = () => {
    if (chips < 1) return;
    let roleInfo: RoleInfo | null = null;
    let values: [number, number, number] = [1, 1, 1];
    let guard = 0;
    while (!roleInfo && guard < 10) {
      values = [rollDie(), rollDie(), rollDie()];
      roleInfo = getRole(values);
      guard += 1;
    }
    if (!roleInfo) {
      roleInfo = { name: '役なし', multiplier: -1, isWin: false, isPinzoro: false };
    }

    setDiceValues(values);
    setResultText(roleInfo.isWin ? 'おめでとう！' : '残念！');
    setIsPinzoro(roleInfo.isPinzoro);
    setRoleText(`役: ${roleInfo.name}`);

    const sanitizedBet = clampValue(bet, maxBet);
    const diff = sanitizedBet * roleInfo.multiplier;
    const nextChips = Math.max(0, chips + diff);
    setChips(nextChips);
    setDeltaText(diff >= 0 ? `獲得: +${diff} チップ` : `失点: ${diff} チップ`);
  };

  const handleForcePinzoro = () => {
    const roleInfo: RoleInfo = { name: 'ピンゾロ', multiplier: 5, isWin: true, isPinzoro: true };
    const values: [number, number, number] = [1, 1, 1];
    setDiceValues(values);
    setResultText('おめでとう！');
    setIsPinzoro(true);
    setRoleText(`役: ${roleInfo.name}`);
    const sanitizedBet = clampValue(bet, maxBet);
    const diff = sanitizedBet * roleInfo.multiplier;
    const nextChips = Math.max(0, chips + diff);
    setChips(nextChips);
    setDeltaText(diff >= 0 ? `獲得: +${diff} チップ` : `失点: ${diff} チップ`);
  };

  useEffect(() => {
    if (hasRolledRef.current) return;
    hasRolledRef.current = true;
    handleRoll();
  }, []);

  useEffect(() => {
    setBet((prev) => clampValue(prev, maxBet));
  }, [maxBet]);

  return (
    <main id="top" className="relative min-h-screen flex items-center justify-center pt-24 px-4">
      <style>{`
        @keyframes pinzoro-pop {
          0% { transform: scale(1); }
          50% { transform: scale(1.5); }
          100% { transform: scale(1); }
        }
        @keyframes pinzoro-rainbow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .pinzoro-animate {
          animation: pinzoro-pop 0.9s ease-in-out infinite, pinzoro-rainbow 2.4s linear infinite;
          background: linear-gradient(90deg, #ff0080, #ff8c00, #f8e71c, #7ed321, #50e3c2, #4a90e2, #9013fe, #ff0080);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-shadow: 0 8px 20px rgba(255, 0, 128, 0.25);
        }
      `}</style>
      <div className="w-full max-w-2xl text-center space-y-6 rounded-2xl border border-slate-200 bg-white/90 px-6 py-10 shadow-lg backdrop-blur">
        <p className="text-sm font-semibold text-slate-500">404</p>
        <h1 className="text-4xl font-bold text-slate-900">ページが見つかりませんでした</h1>
        <p className="text-base text-slate-600">チンチロで運試ししてみましょう。</p>

        <div className="flex items-center justify-center gap-4">
          {diceValues.map((value, index) => (
            <img key={index} src={`${diceBase}dice-${value}.svg`} alt={`Dice ${value}`} className="h-20 w-20" />
          ))}
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold text-slate-600">
            所持チップ: <span>{chips}</span>
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <label className="text-sm font-medium text-slate-600" htmlFor="bet-input">
              賭けチップ
            </label>
            <input
              id="bet-input"
              type="number"
              min={1}
              max={maxBet}
              value={bet}
              onChange={(event) => setBet(clampValue(Number(event.target.value), maxBet))}
              className="w-24 rounded-md border border-slate-300 bg-white/90 px-3 py-2 text-sm text-slate-700"
            />
            <input
              id="bet-range"
              type="range"
              min={1}
              max={maxBet}
              value={bet}
              onChange={(event) => setBet(clampValue(Number(event.target.value), maxBet))}
              className="w-full sm:w-56"
            />
          </div>
          <button
            id="roll-button"
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white/90 px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleRoll}
            disabled={chips < 1}
          >
            チンチロを振る
          </button>
          <button
            id="pinzoro-button"
            type="button"
            className={`mx-auto items-center justify-center rounded-md border border-slate-300 bg-white/90 px-4 py-2 text-xs font-semibold text-slate-500 shadow-sm transition hover:bg-white ${
              showDebugPinzoro ? 'inline-flex' : 'hidden'
            }`}
            onClick={handleForcePinzoro}
          >
            デバッグ: ピンゾロ
          </button>
          <p id="role" className="text-sm font-semibold text-slate-500">
            {roleText}
          </p>
          <p
            id="result"
            className={`text-lg font-semibold text-slate-700 ${isPinzoro ? 'pinzoro-animate' : ''}`}
            aria-live="polite"
          >
            {resultText}
          </p>
          <p id="delta" className="text-sm text-slate-500">
            {deltaText}
          </p>
        </div>
      </div>
    </main>
  );
}
