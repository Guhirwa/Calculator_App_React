import { useCallback, useMemo, useState } from "react";

type Operator = "+" | "-" | "×" | "÷";

function getOperator(operand1: number, operand2: number, operator: Operator): number {
  switch (operator) {
    case "+": return operand1 + operand2;
    case "-": return operand1 - operand2;
    case "×": return operand1 * operand2;
    case "÷": return operand2 === 0 ? NaN : operand1 / operand2;
  }
}

type BtnProps = {
  label: string;
  onClick: () => void;
  variant?: "light" | "operator" | "wide";
  testid?: string;
};

function KeyButton({ label, onClick, variant = "light", testid }: BtnProps) {
  const base =
    "flex items-center justify-center text-xl sm:text-2xl font-medium select-none " +
    "active:scale-[0.99] transition border border-gray-400"

  const styles =
    variant === "operator"
      ? "bg-[#f58634] text-white"    
      : "bg-[#d9dbdf] text-[#111827]";

  const spans = variant === "wide" ? "col-span-2" : "";

  return (
    <button
      data-testid={testid}
      onClick={onClick}
      className={`${base} ${styles} ${spans} h-16 sm:h-20`}
    >
      {label}
    </button>
  );
}

export default function Calculator() {
  const [current, setCurrent] = useState<string>("0");   
  const [previous, setPrevious] = useState<string | null>(null);
  const [operator, setOp] = useState<Operator | null>(null);
  const [overwrite, setOverwrite] = useState<boolean>(false);

  const display = useMemo(() => current, [current]);

  const inputDigit = useCallback((d: string) => {
    setCurrent((cur) => {
      if (overwrite) {
        setOverwrite(false);
        return d;
      }
      if (cur === "0") return d;
      if (cur.replace(".", "").length >= 12) return cur; 
      return cur + d;
    });
  }, [overwrite]);

  const inputDot = useCallback(() => {
    setCurrent((cur) => {
      if (overwrite) {
        setOverwrite(false);
        return "0.";
      }
      if (cur.includes(".")) return cur;
      return cur + ".";
    });
  }, [overwrite]);

  const clearAll = useCallback(() => {
    setCurrent("0");
    setPrevious(null);
    setOp(null);
    setOverwrite(false);
  }, []);

  const toggleSign = useCallback(() => {
    setCurrent((cur) =>
      cur === "0" ? cur : cur.startsWith("-") ? cur.slice(1) : "-" + cur
    );
  }, []);

  const percent = useCallback(() => {
    setCurrent((cur) => {
      const n = parseFloat(cur || "0");
      return (n / 100).toString();
    });
  }, []);

  const chooseOperator = useCallback((nextOp: Operator) => {
    setCurrent((cur) => {
      const curNum = parseFloat(cur);

      if (previous !== null && operator !== null && !Number.isNaN(curNum)) {
        const prevNum = parseFloat(previous);
        const result = getOperator(prevNum, curNum, operator);
        setPrevious(result.toString());
        setOp(nextOp);
        setOverwrite(true);        
        return result.toString();   
      }

      if (previous !== null && operator !== null) {
        setOp(nextOp);
        setOverwrite(true);
        return cur;               
      }

      setPrevious(cur);
      setOp(nextOp);
      setOverwrite(true);      
      return cur;                    
    });
  }, [operator, previous]);

  const equals = useCallback(() => {
    if (operator === null || previous === null) return;
    setCurrent((cur) => {
      const operand1 = parseFloat(previous);
      const operand2 = parseFloat(cur);
      const result = getOperator(operand1, operand2, operator);
      setPrevious(null);
      setOp(null);
      setOverwrite(true);
      return result.toString();
    });
  }, [operator, previous]);

  return (
    <div className="w-[340px] sm:w-[380px] shadow-xl rounded-md overflow-hidden">

      <div className="bg-[#84868d] text-right px-3 sm:px-4 py-2 sm:py-3 text-3xl sm:text-5xl font-semibold border-operand2 border-black text-white">
        {display}
      </div>

      <div className="grid grid-cols-4 gap-0 bg-[#cfd2d6]">
        <KeyButton label="AC" onClick={clearAll} />
        <KeyButton label="+/−" onClick={toggleSign} />
        <KeyButton label="%" onClick={percent} />
        <KeyButton label="÷" variant="operator" onClick={() => chooseOperator("÷")} />

        <KeyButton label="7" onClick={() => inputDigit("7")} />
        <KeyButton label="8" onClick={() => inputDigit("8")} />
        <KeyButton label="9" onClick={() => inputDigit("9")} />
        <KeyButton label="×" variant="operator" onClick={() => chooseOperator("×")} />

        <KeyButton label="4" onClick={() => inputDigit("4")} />
        <KeyButton label="5" onClick={() => inputDigit("5")} />
        <KeyButton label="6" onClick={() => inputDigit("6")} />
        <KeyButton label="−" variant="operator" onClick={() => chooseOperator("-")} />

        <KeyButton label="1" onClick={() => inputDigit("1")} />
        <KeyButton label="2" onClick={() => inputDigit("2")} />
        <KeyButton label="3" onClick={() => inputDigit("3")} />
        <KeyButton label="+" variant="operator" onClick={() => chooseOperator("+")} />

        <KeyButton label="0" variant="wide" onClick={() => inputDigit("0")} />
        <KeyButton label="." onClick={inputDot} />
        <KeyButton label="=" variant="operator" onClick={equals} />
      </div>
    </div>
  );
}
