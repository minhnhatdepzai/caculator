export type ButtonVariant = "default" | "action" | "operator" | "function" | "danger";

export interface CalculatorButton {
  label: string;
  value: string;
  variant: ButtonVariant;
  colSpan?: number;
}

export interface AIResponse {
  answer: string;
  explanation: string;
}
