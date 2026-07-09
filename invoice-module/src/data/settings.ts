export interface InvoiceSettings {
  companyName: string;
  paymentNote: string;
}

const SETTINGS_KEY = "invoiceSettings";

export const defaultSettings: InvoiceSettings = {
  companyName: "Royal Nova Pvt Ltd",
  paymentNote: "Please pay by Cash or UPI.",
};

export const readInvoiceSettings = (): InvoiceSettings => {
  if (typeof window === "undefined") {
    return defaultSettings;
  }

  try {
    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    if (!savedSettings) {
      return defaultSettings;
    }

    const parsed = JSON.parse(savedSettings) as Partial<InvoiceSettings>;
    return {
      companyName: parsed.companyName || defaultSettings.companyName,
      paymentNote: parsed.paymentNote || defaultSettings.paymentNote,
    };
  } catch {
    return defaultSettings;
  }
};

export const saveInvoiceSettings = (settings: InvoiceSettings): InvoiceSettings => {
  if (typeof window !== "undefined") {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }

  return settings;
};
