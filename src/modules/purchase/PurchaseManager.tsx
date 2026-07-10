import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import "./purchase.css";

type Supplier = {
  id: string;
  name: string;
  gstin: string;
  phone: string;
  address: string;
};

type MoneyItem = {
  quantity: number;
  rate: number;
  taxPercent: number;
};


type PurchaseItem = MoneyItem & {
  id: string;
  productName: string;
};

type Purchase = {
  id: string;
  billNumber: string;
  supplierId?: string;
  supplierName: string;
  supplierGstin?: string;
  purchaseDate: string;
  paymentStatus: string;
  items: PurchaseItem[];
};

type ReturnItem = MoneyItem & {
  itemId: string;
  productName: string;
};

type PurchaseReturn = {
  id: string;
  purchaseId: string;
  billNumber: string;
  returnDate: string;
  reason: string;
  items: ReturnItem[];
};

type ReturnFormItem = {
  itemId: string;
  productName: string;
  purchasedQuantity: number;
  availableQuantity: number;
  returnQuantity: number;
  rate: number;
  taxPercent: number;
};

type StockRow = {
  productName: string;
  purchasedQuantity: number;
  returnedQuantity: number;
  inStockQuantity: number;
  averageRate: number;
  stockValue: number;
  status: string;
};

type PurchaseManagerProps = {
  onLogout: () => void;
};

const GST_RATES = [0, 5, 12, 18, 28];
const PAYMENT_STATUSES = ["Paid", "Unpaid", "Partial"];
const CUSTOM_SUPPLIER_ID = "custom-supplier";
const CUSTOM_PRODUCT_VALUE = "__custom__";

type CatalogProduct = {
  name: string;
  defaultRate: number;
  defaultGst: number;
};

const PRODUCT_CATALOG: CatalogProduct[] = [
  { name: "Basmati Rice (25kg)", defaultRate: 1250, defaultGst: 5 },
  { name: "Wheat Flour (10kg)", defaultRate: 420, defaultGst: 5 },
  { name: "Refined Sunflower Oil (15L)", defaultRate: 1850, defaultGst: 5 },
  { name: "Toor Dal (1kg)", defaultRate: 145, defaultGst: 5 },
  { name: "Sugar (50kg)", defaultRate: 2100, defaultGst: 5 },
  { name: "Salt (1kg)", defaultRate: 22, defaultGst: 0 },
  { name: "Tea Powder (1kg)", defaultRate: 380, defaultGst: 5 },
  { name: "Coffee Powder (500g)", defaultRate: 310, defaultGst: 5 },
  { name: "Milk (1L)", defaultRate: 55, defaultGst: 0 },
  { name: "Butter (500g)", defaultRate: 265, defaultGst: 12 },
  { name: "Paneer (1kg)", defaultRate: 340, defaultGst: 0 },
  { name: "Detergent Powder (1kg)", defaultRate: 185, defaultGst: 18 },
  { name: "Soap Bar (Pack of 4)", defaultRate: 145, defaultGst: 18 },
  { name: "Biscuits (Family Pack)", defaultRate: 95, defaultGst: 18 },
  { name: "Notebooks (Pack of 10)", defaultRate: 250, defaultGst: 12 },
];

const DEFAULT_SUPPLIERS: Supplier[] = [
  {
    id: "supplier-apex",
    name: "Apex Wholesale Traders",
    gstin: "29AABCA1234A1Z5",
    phone: "9876543210",
    address: "Bengaluru",
  },
  {
    id: "supplier-sunline",
    name: "Sunline Distributors",
    gstin: "27AABCS4567L1Z4",
    phone: "9988776655",
    address: "Mumbai",
  },
  {
    id: "supplier-freshmart",
    name: "FreshMart Supplies",
    gstin: "33AAACF8910N1Z7",
    phone: "9123456780",
    address: "Chennai",
  },
];

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function makeId() {
  return Date.now().toString() + Math.random().toString();
}

function makeBillNumber(existingPurchases: Purchase[]) {
  const existingNumbers = existingPurchases.map((p) => {
    const match = p.billNumber.match(/^PB-(\d+)$/);
    return match ? parseInt(match[1], 10) : 0;
  });

  const maxNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;
  const nextNumber = maxNumber + 1;
  return "PB-" + nextNumber.toString().padStart(4, "0");
}

function makeEmptyItem(): PurchaseItem {
  return {
    id: makeId(),
    productName: "",
    quantity: 1,
    rate: 0,
    taxPercent: 18,
  };
}

function readStorage<T>(key: string, fallback: T) {
  const savedValue = localStorage.getItem(key);

  if (!savedValue) {
    return fallback;
  }

  try {
    return JSON.parse(savedValue) as T;
  } catch {
    return fallback;
  }
}

function getSavedPurchases() {
  return readStorage<Purchase[]>("inventory-purchases", []);
}

function getSavedReturns() {
  return readStorage<PurchaseReturn[]>("inventory-purchase-returns", []);
}

function getSavedSuppliers() {
  if (localStorage.getItem("inventory-suppliers") !== null) {
    return readStorage<Supplier[]>("inventory-suppliers", []);
  }

  const savedSuppliers = readStorage<Supplier[]>("inventory-suppliers", []);

  if (savedSuppliers.length > 0) {
    return savedSuppliers;
  }

  return DEFAULT_SUPPLIERS;
}

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

function formatMoney(amount: number) {
  return "Rs. " + amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDate(dateValue: string) {
  if (!dateValue) {
    return "-";
  }

  return new Date(dateValue + "T00:00:00").toLocaleDateString("en-IN");
}

function getItemSubtotal(item: MoneyItem) {
  return item.quantity * item.rate;
}

function getItemGstAmount(item: MoneyItem) {
  return (getItemSubtotal(item) * item.taxPercent) / 100;
}

function getItemCgstAmount(item: MoneyItem) {
  return getItemGstAmount(item) / 2;
}

function getItemSgstAmount(item: MoneyItem) {
  return getItemGstAmount(item) / 2;
}

function getItemTotal(item: MoneyItem) {
  return getItemSubtotal(item) + getItemGstAmount(item);
}

function getItemsSubtotal(items: MoneyItem[]) {
  let total = 0;

  for (let i = 0; i < items.length; i++) {
    total = total + getItemSubtotal(items[i]);
  }

  return total;
}

function getItemsGstAmount(items: MoneyItem[]) {
  let total = 0;

  for (let i = 0; i < items.length; i++) {
    total = total + getItemGstAmount(items[i]);
  }

  return total;
}

function getItemsCgstAmount(items: MoneyItem[]) {
  let total = 0;

  for (let i = 0; i < items.length; i++) {
    total = total + getItemCgstAmount(items[i]);
  }

  return total;
}

function getItemsSgstAmount(items: MoneyItem[]) {
  let total = 0;

  for (let i = 0; i < items.length; i++) {
    total = total + getItemSgstAmount(items[i]);
  }

  return total;
}

function getPurchaseTotal(items: MoneyItem[]) {
  return getItemsSubtotal(items) + getItemsGstAmount(items);
}

function PurchaseManager({ onLogout }: PurchaseManagerProps) {
  const [purchases, setPurchases] = useState<Purchase[]>(getSavedPurchases());
  const [purchaseReturns, setPurchaseReturns] = useState<PurchaseReturn[]>(getSavedReturns());
  const [suppliers, setSuppliers] = useState<Supplier[]>(getSavedSuppliers());

  const [editId, setEditId] = useState("");
  const [billNumber, setBillNumber] = useState(() => makeBillNumber(getSavedPurchases()));
  const [selectedSupplierId, setSelectedSupplierId] = useState("");
  const [customSupplierName, setCustomSupplierName] = useState("");
  const [purchaseDate, setPurchaseDate] = useState(getToday());
  const [paymentStatus, setPaymentStatus] = useState("Unpaid");
  const [items, setItems] = useState<PurchaseItem[]>([makeEmptyItem()]);

  const [newSupplierName, setNewSupplierName] = useState("");
  const [newSupplierGstin, setNewSupplierGstin] = useState("");
  const [newSupplierPhone, setNewSupplierPhone] = useState("");
  const [newSupplierAddress, setNewSupplierAddress] = useState("");

  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [returnDate, setReturnDate] = useState(getToday());
  const [returnReason, setReturnReason] = useState("");
  const [returnItems, setReturnItems] = useState<ReturnFormItem[]>([]);

  const [reportSupplierId, setReportSupplierId] = useState("all");
  const [reportFromDate, setReportFromDate] = useState("");
  const [reportToDate, setReportToDate] = useState("");
  const [reportSearch, setReportSearch] = useState("");

  useEffect(() => {
    localStorage.setItem("inventory-purchases", JSON.stringify(purchases));
  }, [purchases]);

  useEffect(() => {
    localStorage.setItem("inventory-purchase-returns", JSON.stringify(purchaseReturns));
  }, [purchaseReturns]);

  useEffect(() => {
    localStorage.setItem("inventory-suppliers", JSON.stringify(suppliers));
  }, [suppliers]);

  function resetPurchaseForm() {
    setEditId("");
    setBillNumber(makeBillNumber(purchases));
    setSelectedSupplierId("");
    setCustomSupplierName("");
    setPurchaseDate(getToday());
    setPaymentStatus("Unpaid");
    setItems([makeEmptyItem()]);
  }

  function addItem() {
    setItems([...items, makeEmptyItem()]);
  }

  function changeItem(index: number, fieldName: string, value: string) {
    const newItems = [...items];

    if (fieldName === "productName") {
      newItems[index].productName = value;
    }

    if (fieldName === "quantity") {
      newItems[index].quantity = Number(value);
    }

    if (fieldName === "rate") {
      newItems[index].rate = Number(value);
    }

    if (fieldName === "taxPercent") {
      newItems[index].taxPercent = Number(value);
    }

    setItems(newItems);
  }

  function selectCatalogProduct(index: number, value: string) {
    if (value === CUSTOM_PRODUCT_VALUE) {
      changeItem(index, "productName", "");
      return;
    }

    const catalogProduct = PRODUCT_CATALOG.find((p) => p.name === value);

    if (catalogProduct) {
      const newItems = [...items];
      newItems[index].productName = catalogProduct.name;
      newItems[index].rate = catalogProduct.defaultRate;
      newItems[index].taxPercent = catalogProduct.defaultGst;
      setItems(newItems);
    }
  }

  function removeItem(itemId: string) {
    if (items.length === 1) {
      alert("At least one item is required.");
      return;
    }

    if (editId && getReturnedQuantity(editId, itemId) > 0) {
      alert("This item already has a return, so it cannot be removed.");
      return;
    }

    const newItems = items.filter((item) => item.id !== itemId);
    setItems(newItems);
  }

  function getSupplierById(supplierId: string) {
    for (let i = 0; i < suppliers.length; i++) {
      if (suppliers[i].id === supplierId) {
        return suppliers[i];
      }
    }

    return null;
  }

  function findSupplierByName(supplierName: string) {
    const normalizedName = normalizeText(supplierName);

    for (let i = 0; i < suppliers.length; i++) {
      if (normalizeText(suppliers[i].name) === normalizedName) {
        return suppliers[i];
      }
    }

    return null;
  }

  function resolveFormSupplier() {
    if (selectedSupplierId === CUSTOM_SUPPLIER_ID) {
      const cleanSupplierName = customSupplierName.trim();

      if (cleanSupplierName === "") {
        return null;
      }

      const existingSupplier = findSupplierByName(cleanSupplierName);

      if (existingSupplier) {
        return {
          supplier: existingSupplier,
          shouldAdd: false,
        };
      }

      return {
        supplier: {
          id: makeId(),
          name: cleanSupplierName,
          gstin: "",
          phone: "",
          address: "",
        },
        shouldAdd: true,
      };
    }

    const selectedSupplier = getSupplierById(selectedSupplierId);

    if (!selectedSupplier) {
      return null;
    }

    return {
      supplier: selectedSupplier,
      shouldAdd: false,
    };
  }

  function addSupplier(event: FormEvent) {
    event.preventDefault();

    const cleanSupplierName = newSupplierName.trim();

    if (cleanSupplierName === "") {
      alert("Please enter supplier name.");
      return;
    }

    const existingSupplier = findSupplierByName(cleanSupplierName);

    if (existingSupplier) {
      setSelectedSupplierId(existingSupplier.id);
      setCustomSupplierName("");
      alert("Supplier already exists and has been selected.");
      return;
    }

    const supplier: Supplier = {
      id: makeId(),
      name: cleanSupplierName,
      gstin: newSupplierGstin.trim().toUpperCase(),
      phone: newSupplierPhone.trim(),
      address: newSupplierAddress.trim(),
    };

    setSuppliers([supplier, ...suppliers]);
    setSelectedSupplierId(supplier.id);
    setCustomSupplierName("");
    setNewSupplierName("");
    setNewSupplierGstin("");
    setNewSupplierPhone("");
    setNewSupplierAddress("");
    alert("Supplier added successfully.");
  }

  function supplierHasPurchases(supplier: Supplier) {
    return purchases.some((purchase) => {
      return (
        purchase.supplierId === supplier.id ||
        normalizeText(purchase.supplierName) === normalizeText(supplier.name)
      );
    });
  }

  function deleteSupplier(supplier: Supplier) {
    const hasPurchases = supplierHasPurchases(supplier);
    const message = hasPurchases
      ? "This supplier is used in purchase bills. Delete it from the supplier list? Existing bills will keep the supplier name."
      : "Do you want to delete this supplier?";
    const isConfirmed = confirm(message);

    if (!isConfirmed) {
      return;
    }

    const newSuppliers = suppliers.filter((savedSupplier) => savedSupplier.id !== supplier.id);
    setSuppliers(newSuppliers);

    if (selectedSupplierId === supplier.id) {
      setSelectedSupplierId("");
      setCustomSupplierName("");
    }

    if (reportSupplierId === supplier.id) {
      setReportSupplierId("all");
    }
  }

  function isPurchaseFormValid(supplier: Supplier | null) {
    if (billNumber.trim() === "") {
      alert("Please enter bill number.");
      return false;
    }

    if (!supplier) {
      alert("Please select or add a supplier.");
      return false;
    }

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (item.productName.trim() === "") {
        alert("Please enter product name.");
        return false;
      }

      if (item.quantity <= 0) {
        alert("Quantity must be greater than 0.");
        return false;
      }

      if (item.rate < 0 || item.taxPercent < 0) {
        alert("Rate and GST cannot be negative.");
        return false;
      }

      if (editId && item.quantity < getReturnedQuantity(editId, item.id)) {
        alert("Quantity cannot be less than already returned quantity.");
        return false;
      }
    }

    return true;
  }

  function savePurchase(event: FormEvent) {
    event.preventDefault();

    const supplierResolution = resolveFormSupplier();
    const supplier = supplierResolution ? supplierResolution.supplier : null;

    if (!isPurchaseFormValid(supplier)) {
      return;
    }

    if (!supplier) {
      return;
    }

    let finalBillNumber = billNumber.trim();
    const isDuplicate = purchases.some((purchase) => {
      return (
        purchase.billNumber.toLowerCase() === finalBillNumber.toLowerCase() &&
        purchase.id !== editId
      );
    });

    if (isDuplicate) {
      finalBillNumber = makeBillNumber(purchases);
      setBillNumber(finalBillNumber);
    }

    const billItems = items.map((item) => {
      return {
        ...item,
        productName: item.productName.trim(),
      };
    });

    if (supplierResolution?.shouldAdd) {
      setSuppliers([supplier, ...suppliers]);
      setSelectedSupplierId(supplier.id);
    }

    if (editId) {
      const updatedPurchase: Purchase = {
        id: editId,
        billNumber: finalBillNumber,
        supplierId: supplier.id,
        supplierName: supplier.name,
        supplierGstin: supplier.gstin,
        purchaseDate,
        paymentStatus,
        items: billItems,
      };

      const newPurchases = purchases.map((purchase) => {
        if (purchase.id === editId) {
          return updatedPurchase;
        }

        return purchase;
      });

      setPurchases(newPurchases);
      alert("Purchase updated successfully.");
    } else {
      const newPurchase: Purchase = {
        id: makeId(),
        billNumber: finalBillNumber,
        supplierId: supplier.id,
        supplierName: supplier.name,
        supplierGstin: supplier.gstin,
        purchaseDate,
        paymentStatus,
        items: billItems,
      };

      setPurchases([newPurchase, ...purchases]);
      alert("Purchase bill created successfully.");
    }

    resetPurchaseForm();
  }

  function editPurchase(purchase: Purchase) {
    const selectedSupplier =
      (purchase.supplierId && getSupplierById(purchase.supplierId)) ||
      findSupplierByName(purchase.supplierName);

    setEditId(purchase.id);
    setBillNumber(purchase.billNumber);
    setPurchaseDate(purchase.purchaseDate);
    setPaymentStatus(purchase.paymentStatus || "Unpaid");
    setItems(purchase.items.map((item) => ({ ...item })));

    if (selectedSupplier) {
      setSelectedSupplierId(selectedSupplier.id);
      setCustomSupplierName("");
      return;
    }

    setSelectedSupplierId(CUSTOM_SUPPLIER_ID);
    setCustomSupplierName(purchase.supplierName);
  }

  function deletePurchase(purchaseId: string) {
    const isConfirmed = confirm("Do you want to delete this purchase?");

    if (!isConfirmed) {
      return;
    }

    const newPurchases = purchases.filter((purchase) => purchase.id !== purchaseId);
    const newReturns = purchaseReturns.filter(
      (purchaseReturn) => purchaseReturn.purchaseId !== purchaseId,
    );

    setPurchases(newPurchases);
    setPurchaseReturns(newReturns);

    if (editId === purchaseId) {
      resetPurchaseForm();
    }

    if (selectedPurchase && selectedPurchase.id === purchaseId) {
      closeReturnForm();
    }
  }

  function getReturnedQuantity(purchaseId: string, itemId: string) {
    let returnedQuantity = 0;

    for (let i = 0; i < purchaseReturns.length; i++) {
      const purchaseReturn = purchaseReturns[i];

      if (purchaseReturn.purchaseId === purchaseId) {
        for (let j = 0; j < purchaseReturn.items.length; j++) {
          const returnItem = purchaseReturn.items[j];

          if (returnItem.itemId === itemId) {
            returnedQuantity = returnedQuantity + returnItem.quantity;
          }
        }
      }
    }

    return returnedQuantity;
  }

  function getPurchaseReturnTotal(purchaseId: string) {
    let total = 0;

    for (let i = 0; i < purchaseReturns.length; i++) {
      if (purchaseReturns[i].purchaseId === purchaseId) {
        total = total + getPurchaseTotal(purchaseReturns[i].items);
      }
    }

    return total;
  }

  function getPurchaseStatus(purchase: Purchase) {
    let totalPurchasedQuantity = 0;
    let totalReturnedQuantity = 0;

    for (let i = 0; i < purchase.items.length; i++) {
      const item = purchase.items[i];
      totalPurchasedQuantity = totalPurchasedQuantity + item.quantity;
      totalReturnedQuantity =
        totalReturnedQuantity + getReturnedQuantity(purchase.id, item.id);
    }

    if (totalReturnedQuantity === 0) {
      return "Open";
    }

    if (totalReturnedQuantity >= totalPurchasedQuantity) {
      return "Returned";
    }

    return "Partially Returned";
  }

  function openReturnForm(purchase: Purchase) {
    const formItems: ReturnFormItem[] = [];

    for (let i = 0; i < purchase.items.length; i++) {
      const item = purchase.items[i];
      const alreadyReturned = getReturnedQuantity(purchase.id, item.id);

      formItems.push({
        itemId: item.id,
        productName: item.productName,
        purchasedQuantity: item.quantity,
        availableQuantity: item.quantity - alreadyReturned,
        returnQuantity: 0,
        rate: item.rate,
        taxPercent: item.taxPercent,
      });
    }

    setSelectedPurchase(purchase);
    setReturnDate(getToday());
    setReturnReason("");
    setReturnItems(formItems);
  }

  function closeReturnForm() {
    setSelectedPurchase(null);
    setReturnReason("");
    setReturnItems([]);
  }

  function changeReturnQuantity(index: number, value: string) {
    const newReturnItems = [...returnItems];
    newReturnItems[index].returnQuantity = Number(value);
    setReturnItems(newReturnItems);
  }

  function getReturnFormTotal() {
    let total = 0;

    for (let i = 0; i < returnItems.length; i++) {
      const item = returnItems[i];
      total =
        total +
        getItemTotal({
          quantity: item.returnQuantity,
          rate: item.rate,
          taxPercent: item.taxPercent,
        });
    }

    return total;
  }

  function savePurchaseReturn(event: FormEvent) {
    event.preventDefault();

    if (!selectedPurchase) {
      return;
    }

    const savedReturnItems: ReturnItem[] = [];

    for (let i = 0; i < returnItems.length; i++) {
      const item = returnItems[i];

      if (item.returnQuantity < 0 || item.returnQuantity > item.availableQuantity) {
        alert("Return quantity is not valid.");
        return;
      }

      if (item.returnQuantity > 0) {
        savedReturnItems.push({
          itemId: item.itemId,
          productName: item.productName,
          quantity: item.returnQuantity,
          rate: item.rate,
          taxPercent: item.taxPercent,
        });
      }
    }

    if (savedReturnItems.length === 0) {
      alert("Please enter return quantity.");
      return;
    }

    const newPurchaseReturn: PurchaseReturn = {
      id: makeId(),
      purchaseId: selectedPurchase.id,
      billNumber: selectedPurchase.billNumber,
      returnDate,
      reason: returnReason.trim(),
      items: savedReturnItems,
    };

    setPurchaseReturns([newPurchaseReturn, ...purchaseReturns]);
    alert("Purchase return saved successfully.");
    closeReturnForm();
  }

  function getTotalPurchaseValue() {
    let total = 0;

    for (let i = 0; i < purchases.length; i++) {
      total = total + getPurchaseTotal(purchases[i].items);
    }

    return total;
  }

  function getTotalGstValue() {
    let total = 0;

    for (let i = 0; i < purchases.length; i++) {
      total = total + getItemsGstAmount(purchases[i].items);
    }

    return total;
  }

  function getTotalCgstValue() {
    let total = 0;

    for (let i = 0; i < purchases.length; i++) {
      total = total + getItemsCgstAmount(purchases[i].items);
    }

    return total;
  }

  function getTotalSgstValue() {
    let total = 0;

    for (let i = 0; i < purchases.length; i++) {
      total = total + getItemsSgstAmount(purchases[i].items);
    }

    return total;
  }

  function getTotalReturnValue() {
    let total = 0;

    for (let i = 0; i < purchaseReturns.length; i++) {
      total = total + getPurchaseTotal(purchaseReturns[i].items);
    }

    return total;
  }

  function getDraftStockItems() {
    const draftItems: PurchaseItem[] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const cleanProductName = item.productName.trim();

      if (cleanProductName !== "" && item.quantity > 0 && item.rate >= 0) {
        draftItems.push({
          ...item,
          productName: cleanProductName,
        });
      }
    }

    return draftItems;
  }

  function getStockSourcePurchases() {
    const savedPurchases = editId
      ? purchases.filter((purchase) => purchase.id !== editId)
      : purchases;
    const draftItems = getDraftStockItems();

    if (draftItems.length === 0) {
      return savedPurchases;
    }

    const draftPurchase: Purchase = {
      id: editId || "draft-purchase",
      billNumber: billNumber.trim() || "Draft",
      supplierName: "Draft Purchase",
      purchaseDate,
      paymentStatus,
      items: draftItems,
    };

    return [draftPurchase, ...savedPurchases];
  }

  function getStockRows() {
    const stockMap: Record<string, StockRow & { purchasedValue: number; returnedValue: number }> =
      {};
    const stockPurchases = getStockSourcePurchases();

    for (let i = 0; i < stockPurchases.length; i++) {
      const purchase = stockPurchases[i];

      for (let j = 0; j < purchase.items.length; j++) {
        const item = purchase.items[j];
        const key = normalizeText(item.productName);

        if (!stockMap[key]) {
          stockMap[key] = {
            productName: item.productName,
            purchasedQuantity: 0,
            returnedQuantity: 0,
            inStockQuantity: 0,
            averageRate: item.rate,
            stockValue: 0,
            status: "Available",
            purchasedValue: 0,
            returnedValue: 0,
          };
        }

        stockMap[key].purchasedQuantity = stockMap[key].purchasedQuantity + item.quantity;
        stockMap[key].purchasedValue = stockMap[key].purchasedValue + getItemSubtotal(item);
        stockMap[key].averageRate = item.rate;
      }
    }

    for (let i = 0; i < purchaseReturns.length; i++) {
      const purchaseReturn = purchaseReturns[i];

      for (let j = 0; j < purchaseReturn.items.length; j++) {
        const item = purchaseReturn.items[j];
        const key = normalizeText(item.productName);

        if (!stockMap[key]) {
          stockMap[key] = {
            productName: item.productName,
            purchasedQuantity: 0,
            returnedQuantity: 0,
            inStockQuantity: 0,
            averageRate: item.rate,
            stockValue: 0,
            status: "Available",
            purchasedValue: 0,
            returnedValue: 0,
          };
        }

        stockMap[key].returnedQuantity = stockMap[key].returnedQuantity + item.quantity;
        stockMap[key].returnedValue = stockMap[key].returnedValue + getItemSubtotal(item);
      }
    }

    return Object.values(stockMap)
      .map((stockRow) => {
        const inStockQuantity = Math.max(
          stockRow.purchasedQuantity - stockRow.returnedQuantity,
          0,
        );
        const stockValue = Math.max(stockRow.purchasedValue - stockRow.returnedValue, 0);
        const averageRate =
          inStockQuantity > 0 ? stockValue / inStockQuantity : stockRow.averageRate;
        let status = "Available";

        if (inStockQuantity === 0) {
          status = "Out";
        } else if (inStockQuantity <= 5) {
          status = "Low";
        }

        return {
          productName: stockRow.productName,
          purchasedQuantity: stockRow.purchasedQuantity,
          returnedQuantity: stockRow.returnedQuantity,
          inStockQuantity,
          averageRate,
          stockValue,
          status,
        };
      })
      .sort((firstRow, secondRow) => firstRow.productName.localeCompare(secondRow.productName));
  }

  function getTotalStockQuantity(stockRows: StockRow[]) {
    let total = 0;

    for (let i = 0; i < stockRows.length; i++) {
      total = total + stockRows[i].inStockQuantity;
    }

    return total;
  }

  function purchaseMatchesSupplier(purchase: Purchase, supplierId: string) {
    if (supplierId === "all") {
      return true;
    }

    if (purchase.supplierId === supplierId) {
      return true;
    }

    const supplier = getSupplierById(supplierId);

    return Boolean(supplier && normalizeText(supplier.name) === normalizeText(purchase.supplierName));
  }

  function getFilteredPurchases() {
    const searchText = normalizeText(reportSearch);

    return purchases.filter((purchase) => {
      if (!purchaseMatchesSupplier(purchase, reportSupplierId)) {
        return false;
      }

      if (reportFromDate && purchase.purchaseDate < reportFromDate) {
        return false;
      }

      if (reportToDate && purchase.purchaseDate > reportToDate) {
        return false;
      }

      if (searchText === "") {
        return true;
      }

      const productMatch = purchase.items.some((item) =>
        normalizeText(item.productName).includes(searchText),
      );

      return (
        normalizeText(purchase.billNumber).includes(searchText) ||
        normalizeText(purchase.supplierName).includes(searchText) ||
        productMatch
      );
    });
  }

  function resetReportFilters() {
    setReportSupplierId("all");
    setReportFromDate("");
    setReportToDate("");
    setReportSearch("");
  }

  function getReportTotals(reportPurchases: Purchase[]) {
    let taxableValue = 0;
    let cgstValue = 0;
    let sgstValue = 0;
    let gstValue = 0;
    let purchaseValue = 0;
    let returnValue = 0;
    let itemCount = 0;

    for (let i = 0; i < reportPurchases.length; i++) {
      const purchase = reportPurchases[i];
      taxableValue = taxableValue + getItemsSubtotal(purchase.items);
      cgstValue = cgstValue + getItemsCgstAmount(purchase.items);
      sgstValue = sgstValue + getItemsSgstAmount(purchase.items);
      gstValue = gstValue + getItemsGstAmount(purchase.items);
      purchaseValue = purchaseValue + getPurchaseTotal(purchase.items);
      returnValue = returnValue + getPurchaseReturnTotal(purchase.id);
      itemCount = itemCount + purchase.items.length;
    }

    return {
      taxableValue,
      cgstValue,
      sgstValue,
      gstValue,
      purchaseValue,
      returnValue,
      netValue: purchaseValue - returnValue,
      itemCount,
    };
  }

  const stockRows = getStockRows();
  const filteredPurchases = getFilteredPurchases();
  const reportTotals = getReportTotals(filteredPurchases);

  return (
    <main className="purchase-page">
      <header className="purchase-header">
        <div>
          <p className="eyebrow">Inventory purchase</p>
          <h1>Purchase Billing</h1>
        </div>

        <button className="danger-button" type="button" onClick={onLogout}>
          Logout
        </button>
      </header>

      <section className="metrics-grid">
        <div className="metric">
          <span>Total Purchases</span>
          <strong>{purchases.length}</strong>
        </div>

        <div className="metric">
          <span>Purchase Value</span>
          <strong>{formatMoney(getTotalPurchaseValue())}</strong>
        </div>

        <div className="metric">
          <span>GST Amount</span>
          <strong>{formatMoney(getTotalGstValue())}</strong>
        </div>

        <div className="metric">
          <span>CGST</span>
          <strong>{formatMoney(getTotalCgstValue())}</strong>
        </div>

        <div className="metric">
          <span>SGST</span>
          <strong>{formatMoney(getTotalSgstValue())}</strong>
        </div>

        <div className="metric">
          <span>Total Returns</span>
          <strong>{formatMoney(getTotalReturnValue())}</strong>
        </div>

        <div className="metric">
          <span>Current Stock</span>
          <strong>{getTotalStockQuantity(stockRows)}</strong>
        </div>
      </section>

      <div className="dashboard-grid">
        <section className="workspace-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">{editId ? "Edit purchase" : "Create purchase"}</p>
              <h2>{editId ? "Edit Purchase Bill" : "Create Purchase Bill"}</h2>
            </div>

            {editId && (
              <button className="secondary-button" type="button" onClick={resetPurchaseForm}>
                Cancel Edit
              </button>
            )}
          </div>

          <form className="purchase-form" onSubmit={savePurchase}>
            <div className="form-grid">
              <label>
                Bill Number
                <input
                  type="text"
                  value={billNumber}
                  onChange={(event) => setBillNumber(event.target.value)}
                />
              </label>

              <label>
                Supplier
                <select
                  value={selectedSupplierId}
                  onChange={(event) => {
                    setSelectedSupplierId(event.target.value);
                    setCustomSupplierName("");
                  }}
                >
                  <option value="">Select supplier</option>
                  {suppliers.map((supplier) => (
                    <option value={supplier.id} key={supplier.id}>
                      {supplier.name}
                    </option>
                  ))}
                  <option value={CUSTOM_SUPPLIER_ID}>Manual supplier</option>
                </select>
              </label>

              {selectedSupplierId === CUSTOM_SUPPLIER_ID && (
                <label>
                  Supplier Name
                  <input
                    type="text"
                    value={customSupplierName}
                    onChange={(event) => setCustomSupplierName(event.target.value)}
                  />
                </label>
              )}

              <label>
                Purchase Date
                <input
                  type="date"
                  value={purchaseDate}
                  onChange={(event) => setPurchaseDate(event.target.value)}
                />
              </label>

              <label>
                Payment Status
                <select
                  value={paymentStatus}
                  onChange={(event) => setPaymentStatus(event.target.value)}
                >
                  {PAYMENT_STATUSES.map((status) => (
                    <option value={status} key={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="items-header">
              <h3>Bill Items</h3>
              <button className="primary-button" type="button" onClick={addItem}>
                Add Item
              </button>
            </div>

            <div className="items-table">
              <div className="items-row items-row-header">
                <span>Product</span>
                <span>Qty</span>
                <span>Rate</span>
                <span>GST %</span>
                <span>Total</span>
                <span>Action</span>
              </div>

              {items.map((item, index) => {
                const isFromCatalog = PRODUCT_CATALOG.some((p) => p.name === item.productName);
                const selectValue = isFromCatalog ? item.productName : CUSTOM_PRODUCT_VALUE;

                return (
                  <div className="items-row" key={item.id}>
                    <div className="product-select-group">
                      <select
                        value={selectValue}
                        onChange={(event) => selectCatalogProduct(index, event.target.value)}
                        className="product-dropdown"
                      >
                        <option value={CUSTOM_PRODUCT_VALUE}>Custom Product</option>
                        {PRODUCT_CATALOG.map((product) => (
                          <option value={product.name} key={product.name}>
                            {product.name}
                          </option>
                        ))}
                      </select>
                      {selectValue === CUSTOM_PRODUCT_VALUE && (
                        <input
                          type="text"
                          placeholder="Enter product name"
                          value={item.productName}
                          onChange={(event) => changeItem(index, "productName", event.target.value)}
                        />
                      )}
                    </div>

                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(event) => changeItem(index, "quantity", event.target.value)}
                    />

                    <input
                      type="number"
                      min="0"
                      value={item.rate}
                      onChange={(event) => changeItem(index, "rate", event.target.value)}
                    />

                    <select
                      value={item.taxPercent}
                      onChange={(event) => changeItem(index, "taxPercent", event.target.value)}
                    >
                      {GST_RATES.map((gstRate) => (
                        <option value={gstRate} key={gstRate}>
                          {gstRate}%
                        </option>
                      ))}
                    </select>

                    <strong>{formatMoney(getItemTotal(item))}</strong>

                    <button
                      className="danger-button compact-button"
                      type="button"
                      onClick={() => removeItem(item.id)}
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="form-footer">
              <div className="amount-summary">
                <div>
                  <span>Taxable Value</span>
                  <strong>{formatMoney(getItemsSubtotal(items))}</strong>
                </div>

                <div>
                  <span>GST Amount</span>
                  <strong>{formatMoney(getItemsGstAmount(items))}</strong>
                </div>

                <div>
                  <span>CGST</span>
                  <strong>{formatMoney(getItemsCgstAmount(items))}</strong>
                </div>

                <div>
                  <span>SGST</span>
                  <strong>{formatMoney(getItemsSgstAmount(items))}</strong>
                </div>

                <div>
                  <span>Bill Total</span>
                  <strong>{formatMoney(getPurchaseTotal(items))}</strong>
                </div>
              </div>

              <button className="primary-button" type="submit">
                {editId ? "Update Purchase" : "Create Purchase Bill"}
              </button>
            </div>
          </form>
        </section>

        <div className="side-stack">
          <section className="workspace-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Supplier selection</p>
                <h2>Suppliers</h2>
              </div>

              <span className="count-pill">{suppliers.length}</span>
            </div>

            <form className="supplier-form" onSubmit={addSupplier}>
              <label>
                Supplier Name
                <input
                  type="text"
                  value={newSupplierName}
                  onChange={(event) => setNewSupplierName(event.target.value)}
                />
              </label>

              <div className="supplier-form-grid">
                <label>
                  GSTIN
                  <input
                    type="text"
                    value={newSupplierGstin}
                    onChange={(event) => setNewSupplierGstin(event.target.value)}
                  />
                </label>

                <label>
                  Phone
                  <input
                    type="tel"
                    value={newSupplierPhone}
                    onChange={(event) => setNewSupplierPhone(event.target.value)}
                  />
                </label>
              </div>

              <label>
                Address
                <input
                  type="text"
                  value={newSupplierAddress}
                  onChange={(event) => setNewSupplierAddress(event.target.value)}
                />
              </label>

              <button className="primary-button" type="submit">
                Add Supplier
              </button>
            </form>

            <div className="supplier-list">
              {suppliers.map((supplier) => (
                <div
                  className={
                    selectedSupplierId === supplier.id
                      ? "supplier-record supplier-record-active"
                      : "supplier-record"
                  }
                  key={supplier.id}
                >
                  <button
                    className="supplier-select"
                    type="button"
                    onClick={() => {
                      setSelectedSupplierId(supplier.id);
                      setCustomSupplierName("");
                    }}
                  >
                    <span>
                      <strong>{supplier.name}</strong>
                      <small>{supplier.gstin || "GSTIN not added"}</small>
                    </span>

                    <small>{supplier.phone || supplier.address || "Supplier"}</small>
                  </button>

                  <button
                    className="danger-button compact-button supplier-delete-button"
                    type="button"
                    onClick={() => deleteSupplier(supplier)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <section className="workspace-panel full-panel stock-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Stock update</p>
            <h2>Current Stock</h2>
          </div>
        </div>

        {stockRows.length === 0 && <p className="empty-state">No stock recorded.</p>}

        {stockRows.length > 0 && (
          <div className="stock-table">
            <div className="stock-row stock-row-header">
              <span>Product</span>
              <span>Purchased</span>
              <span>Returned</span>
              <span>In Stock</span>
              <span>Avg Rate</span>
              <span>Status</span>
            </div>

            {stockRows.map((stockRow) => (
              <div className="stock-row" key={stockRow.productName}>
                <strong>{stockRow.productName}</strong>
                <span>{stockRow.purchasedQuantity}</span>
                <span>{stockRow.returnedQuantity}</span>
                <strong>{stockRow.inStockQuantity}</strong>
                <span>{formatMoney(stockRow.averageRate)}</span>
                <span className={"stock-status stock-status-" + stockRow.status.toLowerCase()}>
                  {stockRow.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="workspace-panel full-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Manage purchases</p>
            <h2>Purchase List</h2>
          </div>
        </div>

        <div className="purchase-list">
          {purchases.length === 0 && <p className="empty-state">No purchase bills yet.</p>}

          {purchases.map((purchase) => {
            const status = getPurchaseStatus(purchase);
            const statusClass = status.toLowerCase().replaceAll(" ", "-");
            const returnValue = getPurchaseReturnTotal(purchase.id);

            return (
              <article className="purchase-record" key={purchase.id}>
                <div className="record-main">
                  <div>
                    <h3>{purchase.billNumber}</h3>
                    <p>{purchase.supplierName}</p>
                  </div>

                  <span className={"status status-" + statusClass}>{status}</span>
                </div>

                <dl className="record-details">
                  <div>
                    <dt>Date</dt>
                    <dd>{formatDate(purchase.purchaseDate)}</dd>
                  </div>

                  <div>
                    <dt>Items</dt>
                    <dd>{purchase.items.length}</dd>
                  </div>

                  <div>
                    <dt>CGST</dt>
                    <dd>{formatMoney(getItemsCgstAmount(purchase.items))}</dd>
                  </div>

                  <div>
                    <dt>SGST</dt>
                    <dd>{formatMoney(getItemsSgstAmount(purchase.items))}</dd>
                  </div>

                  <div>
                    <dt>GST</dt>
                    <dd>{formatMoney(getItemsGstAmount(purchase.items))}</dd>
                  </div>

                  <div>
                    <dt>Total</dt>
                    <dd>{formatMoney(getPurchaseTotal(purchase.items))}</dd>
                  </div>

                  <div>
                    <dt>Payment</dt>
                    <dd>{purchase.paymentStatus || "Unpaid"}</dd>
                  </div>

                  <div>
                    <dt>Returns</dt>
                    <dd>{formatMoney(returnValue)}</dd>
                  </div>
                </dl>

                <div className="record-actions">
                  <button
                    className="secondary-button"
                    type="button"
                    onClick={() => editPurchase(purchase)}
                  >
                    Edit
                  </button>

                  <button
                    className="secondary-button"
                    type="button"
                    onClick={() => openReturnForm(purchase)}
                    disabled={status === "Returned"}
                  >
                    Return
                  </button>

                  <button
                    className="danger-button"
                    type="button"
                    onClick={() => deletePurchase(purchase.id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {selectedPurchase && (
        <section className="workspace-panel full-panel return-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Purchase return</p>
              <h2>Return Against {selectedPurchase.billNumber}</h2>
            </div>

            <button className="secondary-button" type="button" onClick={closeReturnForm}>
              Close
            </button>
          </div>

          <form className="purchase-form" onSubmit={savePurchaseReturn}>
            <div className="form-grid">
              <label>
                Return Date
                <input
                  type="date"
                  value={returnDate}
                  onChange={(event) => setReturnDate(event.target.value)}
                />
              </label>

              <label>
                Reason
                <input
                  type="text"
                  value={returnReason}
                  onChange={(event) => setReturnReason(event.target.value)}
                />
              </label>
            </div>

            <div className="items-table return-table">
              <div className="return-row items-row-header">
                <span>Product</span>
                <span>Purchased</span>
                <span>Available</span>
                <span>Return Qty</span>
                <span>Return Value</span>
              </div>

              {returnItems.map((item, index) => (
                <div className="return-row" key={item.itemId}>
                  <strong>{item.productName}</strong>
                  <span>{item.purchasedQuantity}</span>
                  <span>{item.availableQuantity}</span>

                  <input
                    type="number"
                    min="0"
                    max={item.availableQuantity}
                    value={item.returnQuantity}
                    disabled={item.availableQuantity === 0}
                    onChange={(event) => changeReturnQuantity(index, event.target.value)}
                  />

                  <strong>
                    {formatMoney(
                      getItemTotal({
                        quantity: item.returnQuantity,
                        rate: item.rate,
                        taxPercent: item.taxPercent,
                      }),
                    )}
                  </strong>
                </div>
              ))}
            </div>

            <div className="form-footer">
              <div className="amount-summary amount-summary-small">
                <div>
                  <span>Return Total</span>
                  <strong>{formatMoney(getReturnFormTotal())}</strong>
                </div>
              </div>

              <button className="primary-button" type="submit">
                Save Purchase Return
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="workspace-panel full-panel report-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Purchase report</p>
            <h2>Purchase Report</h2>
          </div>

          <button className="primary-button" type="button" onClick={() => window.print()}>
            Print Report
          </button>
        </div>

        <div className="report-filters">
          <label>
            From
            <input
              type="date"
              value={reportFromDate}
              onChange={(event) => setReportFromDate(event.target.value)}
            />
          </label>

          <label>
            To
            <input
              type="date"
              value={reportToDate}
              onChange={(event) => setReportToDate(event.target.value)}
            />
          </label>

          <label>
            Supplier
            <select
              value={reportSupplierId}
              onChange={(event) => setReportSupplierId(event.target.value)}
            >
              <option value="all">All suppliers</option>
              {suppliers.map((supplier) => (
                <option value={supplier.id} key={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Search
            <input
              type="search"
              value={reportSearch}
              onChange={(event) => setReportSearch(event.target.value)}
            />
          </label>

          <button className="primary-button filter-button" type="button" onClick={resetReportFilters}>
            Reset
          </button>
        </div>

        <div className="report-summary">
          <div>
            <span>Bills</span>
            <strong>{filteredPurchases.length}</strong>
          </div>

          <div>
            <span>Items</span>
            <strong>{reportTotals.itemCount}</strong>
          </div>

          <div>
            <span>Taxable Value</span>
            <strong>{formatMoney(reportTotals.taxableValue)}</strong>
          </div>

          <div>
            <span>GST Amount</span>
            <strong>{formatMoney(reportTotals.gstValue)}</strong>
          </div>

          <div>
            <span>CGST</span>
            <strong>{formatMoney(reportTotals.cgstValue)}</strong>
          </div>

          <div>
            <span>SGST</span>
            <strong>{formatMoney(reportTotals.sgstValue)}</strong>
          </div>

          <div>
            <span>Returns</span>
            <strong>{formatMoney(reportTotals.returnValue)}</strong>
          </div>

          <div>
            <span>Net Purchase</span>
            <strong>{formatMoney(reportTotals.netValue)}</strong>
          </div>
        </div>

        {filteredPurchases.length === 0 && (
          <p className="empty-state">No purchases match this report.</p>
        )}

        {filteredPurchases.length > 0 && (
          <div className="report-table">
            <div className="report-row report-row-header">
              <span>Bill</span>
              <span>Date</span>
              <span>Supplier</span>
              <span>Items</span>
              <span>Payment</span>
              <span>Taxable</span>
              <span>CGST</span>
              <span>SGST</span>
              <span>GST</span>
              <span>Net Total</span>
            </div>

            {filteredPurchases.map((purchase) => {
              const returnValue = getPurchaseReturnTotal(purchase.id);
              const netTotal = getPurchaseTotal(purchase.items) - returnValue;

              return (
                <div className="report-row" key={purchase.id}>
                  <strong>{purchase.billNumber}</strong>
                  <span>{formatDate(purchase.purchaseDate)}</span>
                  <span>{purchase.supplierName}</span>
                  <span>{purchase.items.length}</span>
                  <span>{purchase.paymentStatus || "Unpaid"}</span>
                  <span>{formatMoney(getItemsSubtotal(purchase.items))}</span>
                  <span>{formatMoney(getItemsCgstAmount(purchase.items))}</span>
                  <span>{formatMoney(getItemsSgstAmount(purchase.items))}</span>
                  <span>{formatMoney(getItemsGstAmount(purchase.items))}</span>
                  <strong>{formatMoney(netTotal)}</strong>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="workspace-panel full-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">History</p>
            <h2>Purchase Returns</h2>
          </div>
        </div>

        {purchaseReturns.length === 0 && (
          <p className="empty-state">No purchase returns recorded.</p>
        )}

        {purchaseReturns.length > 0 && (
          <div className="history-table">
            <div className="history-row history-row-header">
              <span>Bill</span>
              <span>Date</span>
              <span>Items</span>
              <span>Reason</span>
              <span>Value</span>
            </div>

            {purchaseReturns.map((purchaseReturn) => (
              <div className="history-row" key={purchaseReturn.id}>
                <strong>{purchaseReturn.billNumber}</strong>
                <span>{formatDate(purchaseReturn.returnDate)}</span>
                <span>{purchaseReturn.items.length}</span>
                <span>{purchaseReturn.reason || "No reason added"}</span>
                <strong>{formatMoney(getPurchaseTotal(purchaseReturn.items))}</strong>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default PurchaseManager;
