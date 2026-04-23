import { evaluate } from "mathjs";

export type MathResultStatus = "success" | "invalid" | "undefined" | "infinity" | "negative_infinity" | "non_real";

export interface MathResult {
  value: string;
  status: MathResultStatus;
  message?: string;
  raw?: number | any;
}

/**
 * Evaluates an expression using mathjs and handles all edge cases gracefully.
 * @param expr The math expression to evaluate
 * @param scope Optional scope variables
 * @param t The translation function to provide localized error messages
 */
export function safeEvaluate(expr: string, scope: any = {}, t?: (key: string) => string): MathResult {
  // Helper for translating if t is provided, otherwise fallback to German defaults
  const translate = (key: string, fallback: string) => t ? t(key) : fallback;

  try {
    const rawResult = evaluate(expr, scope);

    if (rawResult === undefined || rawResult === null) {
      return { value: "", status: "invalid", message: translate("math.invalid", "Ungültige Eingabe") };
    }

    if (typeof rawResult === 'number') {
      if (isNaN(rawResult)) {
        return { value: "NaN", status: "undefined", message: translate("math.undefined", "Nicht definiert") };
      }
      if (rawResult === Infinity) {
        return { value: "∞", status: "infinity", message: translate("math.infinity", "Unendlich") };
      }
      if (rawResult === -Infinity) {
        return { value: "-∞", status: "negative_infinity", message: translate("math.negativeInfinity", "Negativ unendlich") };
      }
    }

    // Handle mathjs complex numbers (e.g. sqrt(-1))
    if (rawResult && rawResult.isComplex) {
       return { value: rawResult.toString(), status: "non_real", message: translate("math.nonReal", "Kein reelles Ergebnis") };
    }

    // Convert result to string and format slightly (e.g. limit decimals)
    // math.format could be used, but simple toString() is fine for most cases
    const valueStr = typeof rawResult === 'number' ? Number(rawResult.toFixed(10)).toString() : rawResult.toString();

    return {
      value: valueStr,
      status: "success",
      raw: rawResult
    };

  } catch (err: any) {
    // Mathjs throws errors for undefined symbols or syntax errors
    let msg = translate("math.invalid", "Ungültige Eingabe");
    
    if (err.message) {
      if (err.message.includes("Division by zero")) {
        msg = translate("math.divZero", "Division durch 0");
        return { value: "", status: "undefined", message: msg };
      }
    }

    return { value: "", status: "invalid", message: msg };
  }
}
