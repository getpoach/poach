import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function serviceFee(price: number): number {
  return Math.round(price * 0.12);
}

export function totalWithFee(price: number): number {
  return price + serviceFee(price);
}

export function generateId(): string {
  return `B${Date.now().toString().slice(-6)}`;
}
