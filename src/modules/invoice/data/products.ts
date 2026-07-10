export interface ProductOption {
  name: string;
  price: number;
  gst: number;
  stock: number;
}

export const productCatalog: ProductOption[] = [
  { name: "Laptop", price: 50000, gst: 18, stock: 10 },
  { name: "Laptop Bag", price: 1800, gst: 18, stock: 20 },
  { name: "Laptop Charger", price: 2500, gst: 18, stock: 25 },
  { name: "Desktop Computer", price: 45000, gst: 18, stock: 8 },
  { name: "Computer Monitor", price: 12000, gst: 18, stock: 15 },
  { name: "Computer Keyboard", price: 1200, gst: 18, stock: 30 },
  { name: "Computer Mouse", price: 700, gst: 18, stock: 40 },
  { name: "CPU", price: 18000, gst: 18, stock: 12 },
  { name: "CPU Cooler", price: 3200, gst: 18, stock: 15 },
  { name: "Motherboard", price: 14000, gst: 18, stock: 10 },
  { name: "RAM", price: 5500, gst: 18, stock: 20 },
  { name: "SSD", price: 6500, gst: 18, stock: 25 },
  { name: "Hard Disk", price: 4000, gst: 18, stock: 18 },
  { name: "Graphics Card", price: 28000, gst: 18, stock: 7 },
  { name: "Power Supply", price: 5000, gst: 18, stock: 14 },
  { name: "Cabinet", price: 6000, gst: 18, stock: 9 },
  { name: "Printer", price: 8000, gst: 18, stock: 8 },
  { name: "Scanner", price: 9500, gst: 18, stock: 6 },
  { name: "Webcam", price: 2500, gst: 18, stock: 20 },
  { name: "Headset", price: 1800, gst: 18, stock: 22 },
  { name: "Speaker", price: 3000, gst: 18, stock: 16 },
  { name: "Router", price: 2200, gst: 18, stock: 17 },
  { name: "Modem", price: 1800, gst: 18, stock: 12 },
  { name: "USB Drive", price: 900, gst: 18, stock: 35 },
  { name: "Pendrive", price: 700, gst: 18, stock: 30 },
  { name: "External HDD", price: 7800, gst: 18, stock: 10 },
  { name: "Wireless Mouse", price: 1200, gst: 18, stock: 24 },
  { name: "Wireless Keyboard", price: 1800, gst: 18, stock: 20 },
  { name: "Projector", price: 35000, gst: 18, stock: 5 },
  { name: "Smart TV", price: 42000, gst: 18, stock: 6 },
  { name: "Server", price: 95000, gst: 18, stock: 3 },
];
