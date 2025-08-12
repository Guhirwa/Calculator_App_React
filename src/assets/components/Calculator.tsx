const Calculator = () => {

    function getOperator(operand1: number, operand2: number, operator: operator): number {
        switch(operator) {
            case "+": return operand1 + operand2;
            case "-": return operand1 - operand2;
            case "*": return operand1 * operand2;
            case "/": return operand2 === 0 ? NaN : operand1/operand2;
        }
    }

    type operator = "+" | "-" | "*" | "/";

    type BtnProps = {
        label: string;
        onClick: () => void;
        variant?: "light" | "operaror" | "wide";
        testid?: string;
    }

    function KeyButton({ label, onClick, variant = "light", testid }: BtnProps) {
  const base =
    "flex items-center justify-center text-xl sm:text-2xl font-medium rounded-md select-none " +
    "active:scale-[0.98] transition-transform";
  const styles =
    variant === "operator"
      ? "bg-operator text-white"
      : "bg-key text-gray-900";
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

  return (
    <>
        <h1>Hello</h1>
    </>
  )
}

export default Calculator