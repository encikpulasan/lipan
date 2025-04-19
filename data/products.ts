export interface Product {
  id: string;
  name: string;
  description: string;
  details: string[];
  unitPrice: number;
  defaultQuantity: number;
  minQuantity?: number;
  maxQuantity?: number;
  image?: string;
  required?: boolean;
  category: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  required: boolean;
}

export const categories: Category[] = [
  {
    id: "controller",
    name: "Access Controller",
    description: "Control systems for managing barrier gate access",
    required: true,
  },
  {
    id: "barrier",
    name: "Barrier Gate",
    description: "Physical barriers for vehicle entry and exit points",
    required: true,
  },
  {
    id: "reader",
    name: "Input Reader/ANPR",
    description: "Readers and recognition systems for vehicle identification",
    required: true,
  },
  {
    id: "protection",
    name: "Lightning/Surge Protection",
    description: "Protection devices for electrical and network equipment",
    required: true,
  },
  {
    id: "installation",
    name: "Installation & Services",
    description:
      "Installation, cabling, civil works and implementation services",
    required: true,
  },
  {
    id: "detector",
    name: "Vehicle Detectors",
    description: "Sensors for vehicle detection and anti-smash protection",
    required: false,
  },
  {
    id: "button",
    name: "Control Buttons",
    description: "Manual control buttons for barriers",
    required: false,
  },
  {
    id: "accessCard",
    name: "Access Cards",
    description: "RFID access cards for vehicle identification",
    required: false,
  },
  {
    id: "other",
    name: "Other Equipment",
    description: "Additional equipment and accessories",
    required: true,
  },
];

export const products: Product[] = [
  // ACCESS CONTROLLER
  {
    id: "controller-board",
    name: "Baycons Access Controller Board",
    description: "Advanced controller board with multiple connectivity options",
    details: [
      "MCU: ESP 32",
      "Power Input: 12 V or POE (30 W)",
      "Connectivity: 2 x Wiegand, 2 x Dry Contact, 2 x Powered Relay",
      "1 x 100 M Ethernet, 1 x Micro SD Slot, 1 x RS 485",
      "2 x Digital Inputs, 1 x Serial Port, 1 x I2C Port",
      "Wireless: WiFi, Bluetooth",
      "Suitable for standalone controllers",
    ],
    unitPrice: 900,
    defaultQuantity: 1,
    minQuantity: 1,
    required: true,
    category: "controller",
  },
  {
    id: "local-server",
    name: "Baycons Local Access Server",
    description:
      "Local server to interface with controller board for access control operations",
    details: [
      "CPU: Intel i3",
      "RAM: 4 GB DDR4",
      "Storage: 256 GB SSD",
      "OS: Ubuntu Server",
      "LAN: 2 x Gigabit Ethernet",
      "I/O Ports: USB, HDMI/VGA, Serial (if needed)",
      "Design: Fanless Mini PC",
    ],
    unitPrice: 1200,
    defaultQuantity: 1,
    minQuantity: 1,
    required: true,
    category: "controller",
  },

  // BARRIER GATE
  {
    id: "barrier-gate",
    name: "ZKTeco Heavy Duty Barrier Gate",
    description:
      "Robust barrier gate with advanced features for reliable operation",
    details: [
      "Opening & Closing time: 3 s",
      "Boom type: Straight telescopic boom - Adjustable 4.5 m",
      "Supports Anti-Smash and Trigger automatic close",
      "430 Mhz Remote control included: < 30 meter distance",
      "Built-in LED light indicator in Chassis",
      "Power consumption: 120 W maximum; AC 220 V; 50 kg",
      "Warranty along contract period",
    ],
    unitPrice: 2400,
    defaultQuantity: 4,
    minQuantity: 1,
    category: "barrier",
  },

  // INPUT READER/ANPR
  {
    id: "uhf-reader",
    name: "ZKTeco UHF Long Range Reader",
    description: "Long-range RFID reader for vehicle identification",
    details: [
      "Unencrypted/Encrypted Proximity RFID Reader (UHF)",
      "Comm Interface: Wiegand 26 (Default) / Wiegand 34 / RS 485 / USB",
      "Die-Cast Aluminium shell, Antenna panel with engineering plastics",
      "Frequency: 919 Mhz - 923 Mhz. MCMC/SIRIM approved with certificate",
      "Always Read (Default) / Trigger to Read. 7 Colours LED Light",
      "Reading distance 10 - 20 m (Actual scenario test is around 8 m)",
      "Dimensions: 445 x 445 x 68 mm. Working voltage: 9 ~ 15 VDC; 3.5 kg",
    ],
    unitPrice: 2420,
    defaultQuantity: 2,
    minQuantity: 0,
    category: "reader",
  },
  {
    id: "anpr-system",
    name: "Auto Number Plate Recognition System",
    description: "Camera system for automatic license plate recognition",
    details: [
      "Full HD IP Camera (1080p) with IR",
      "Suitable for 3 – 10 meter detection range",
      "Real-time number plate recognition with high accuracy",
      "Whitelist/Blacklist management for access control",
      "Event logging with search and export capability",
    ],
    unitPrice: 3320,
    defaultQuantity: 2,
    minQuantity: 0,
    category: "reader",
  },
  {
    id: "reader-pole",
    name: "Reader Pole",
    description: "Mounting pole for readers and cameras",
    details: [
      "Height: 1.8 meters; Material: Steel",
      "Base: Φ 200 mm, Pole: Φ 60 mm",
      "Color: White (Powder coated)",
      "Suitable for ANPR, UHF Reader, Multiple units of camera",
      "Weight: 5.5 kg",
    ],
    unitPrice: 280,
    defaultQuantity: 4,
    category: "reader",
  },

  // LIGHTNING/SURGE PROTECTOR
  {
    id: "ac-protector",
    name: "AC Lightning Protector",
    description: "Protection module for power AC lines",
    details: [
      "Module for Power AC",
      "3-core screw terminals in/out",
      "Lifetime replacement exchange; burnt unit can be replaced",
    ],
    unitPrice: 100,
    defaultQuantity: 4,
    category: "protection",
  },
  {
    id: "data-protector",
    name: "Data Network Protector (Readers)",
    description: "Protection module for network cables",
    details: [
      "Module for LAN cable (10/100/1000 Mbps) 8-pins RJ45",
      "Lifetime replacement exchange; burnt unit can be replaced",
    ],
    unitPrice: 80,
    defaultQuantity: 2,
    category: "protection",
  },

  // INSTALLATION
  {
    id: "cabling",
    name: "Cabling & PVC conduit pipe work",
    description: "Essential cabling infrastructure for the barrier system",
    details: [
      "PVC Conduit with accessories",
      "Heavy Duty 2.5 mm electric cable for Barriers",
      "PVC Conduit for Network Cabling ANPR Cameras",
    ],
    unitPrice: 2000,
    defaultQuantity: 1,
    required: true,
    category: "installation",
  },
  {
    id: "civil-works",
    name: "Civil Works",
    description: "Necessary construction works for barrier installation",
    details: [
      "Road Hacking for Barriers' Cables",
      "Barrier Concrete Island",
      "Other Related Civil Works",
    ],
    unitPrice: 1800,
    defaultQuantity: 1,
    required: true,
    category: "installation",
  },
  {
    id: "networking",
    name: "Networking Cables",
    description: "Network infrastructure for communication between devices",
    details: [
      "Networking Cables Termination for ANPR Cameras",
      "Networking Cables Testing and Commissioning",
    ],
    unitPrice: 1200,
    defaultQuantity: 1,
    required: true,
    category: "installation",
  },
  {
    id: "implementation",
    name: "Project Implementation",
    description: "Complete system setup, testing and training",
    details: [
      "Installation all related parts",
      "Testing include real life testing and simulations",
      "User Training for Management Officer and Security Officer",
    ],
    unitPrice: 500,
    defaultQuantity: 1,
    required: true,
    category: "installation",
  },

  // OTHERS
  {
    id: "router",
    name: "4G Gigabit Router",
    description: "Network connectivity device for the barrier system",
    details: [
      "300 Mbps Capability",
      "4 x Gigabit LAN",
      "12v Powered",
    ],
    unitPrice: 0,
    defaultQuantity: 1,
    category: "other",
  },

  // ADD-ONS: VEHICLE DETECTORS
  {
    id: "loop-detector",
    name: "Ground Loop Coil and Loop Detector",
    description: "Sensor system for vehicle detection",
    details: [
      "High Temperature Loop Detector Coil",
      "0.75 mm² Thickness, 50 m per roll",
      "Waterproof, Oil proof, flame retardant, fire resistant",
      "Single channel Loop Detector with two relay outputs (OEM)",
      "Used for vehicle sensing detection",
      "Suitable for parking lots, road tolls and traffic signal control",
      "Response time < 100 ms; 230 VAC Powered; Consumption < 3 W",
    ],
    unitPrice: 350,
    defaultQuantity: 6,
    minQuantity: 0,
    category: "detector",
  },
  {
    id: "anti-smash",
    name: "Barrier Anti-Smash Infrared Sensor",
    description: "Safety device to prevent barrier arm damage and accidents",
    details: [
      "Anti-Smash Wave Radar (Freq: 79-81 Ghz)",
      "79G milimeter wave sensor; Connection: RS 485",
      "Detection distance: 1~6 m (adjustable); Width: 0.5~1.5 m (adjustable)",
      "IP 65 rated; Powered: DC 10V~24V (Default: DC 12V 1A), < 2.5 W",
    ],
    unitPrice: 670,
    defaultQuantity: 6,
    minQuantity: 0,
    category: "detector",
  },

  // PUSH BUTTON
  {
    id: "push-button",
    name: "Heavy Duty Barrier Push Button",
    description: "Manual control button for barrier operation",
    details: [
      "Communication: N/O signal",
      "Design with up, stop & down icon",
    ],
    unitPrice: 50,
    defaultQuantity: 4,
    minQuantity: 0,
    category: "button",
  },

  // ACCESS CARD
  {
    id: "card-bw-one",
    name: "UHF RFID Access Card (ONE SIDED Black and White Printing)",
    description:
      "RFID access cards for vehicle identification with one-sided B&W printing",
    details: [
      "UHF RFID technology",
      "One-sided black and white printing",
      "Compatible with the UHF reader",
    ],
    unitPrice: 15,
    defaultQuantity: 1000,
    minQuantity: 0,
    maxQuantity: 10000,
    category: "accessCard",
  },
  {
    id: "card-bw-two",
    name: "UHF RFID Access Card (TWO SIDED Black and White Printing)",
    description:
      "RFID access cards for vehicle identification with two-sided B&W printing",
    details: [
      "UHF RFID technology",
      "Two-sided black and white printing",
      "Compatible with the UHF reader",
    ],
    unitPrice: 16,
    defaultQuantity: 1000,
    minQuantity: 0,
    maxQuantity: 10000,
    category: "accessCard",
  },
  {
    id: "card-color-two",
    name: "UHF RFID Access Card (TWO SIDED Colour Printing)",
    description:
      "RFID access cards for vehicle identification with two-sided color printing",
    details: [
      "UHF RFID technology",
      "Two-sided color printing",
      "Compatible with the UHF reader",
    ],
    unitPrice: 25,
    defaultQuantity: 1000,
    minQuantity: 0,
    maxQuantity: 10000,
    category: "accessCard",
  },
  {
    id: "card-sticker",
    name: "UHF RFID Access Card (ONE SIDED Colour Designed Sticker)",
    description: "RFID access cards with custom color sticker design",
    details: [
      "UHF RFID technology",
      "One-sided color designed sticker",
      "Compatible with the UHF reader",
    ],
    unitPrice: 15,
    defaultQuantity: 1000,
    minQuantity: 0,
    maxQuantity: 10000,
    category: "accessCard",
  },
];

export interface WarrantyOption {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: number;
}

export const warrantyOptions: WarrantyOption[] = [
  {
    id: "standard",
    name: "Standard Warranty",
    description: "Basic warranty coverage for defects and installation issues",
    duration: "1 year",
    price: 0,
  },
  {
    id: "extended-2",
    name: "Extended Warranty (2 Years)",
    description: "Extended warranty coverage for 2 years",
    duration: "2 years",
    price: 2500,
  },
  {
    id: "extended-3",
    name: "Extended Warranty (3 Years)",
    description: "Extended warranty coverage for 3 years",
    duration: "3 years",
    price: 4000,
  },
  {
    id: "premium",
    name: "Premium Warranty",
    description:
      "Comprehensive warranty with priority support and quarterly maintenance visits",
    duration: "3 years",
    price: 6000,
  },
];

export interface ProjectInfo {
  name: string;
  location: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  installationDate?: Date;
  notes?: string;
}

export interface PaymentOption {
  id: string;
  name: string;
  description: string;
  type: "one-off" | "lease" | "rental";
  multiplier: number;
  termMonths?: number;
  depositPercentage?: number;
  features?: string[];
}

export const paymentOptions: PaymentOption[] = [
  {
    id: "one-off",
    name: "One-time Purchase",
    description: "Pay the full amount upfront",
    type: "one-off",
    multiplier: 1,
    features: [
      "Full ownership",
      "No additional fees",
      "Includes standard warranty",
    ],
  },
  {
    id: "lease",
    name: "Lease to Own",
    description: "Low monthly payments with ownership at the end",
    type: "lease",
    multiplier: 1.15,
    termMonths: 24,
    depositPercentage: 10,
    features: [
      "Ownership transfers after final payment",
      "Extended warranty included",
      "Lower upfront costs",
    ],
  },
  {
    id: "rental",
    name: "Rental",
    description: "Flexible contract with lower monthly payments",
    type: "rental",
    multiplier: 0.7,
    termMonths: 12,
    depositPercentage: 15,
    features: [
      "Return at end of contract",
      "Maintenance included",
      "Option to upgrade at end of term",
    ],
  },
];

export interface Quotation {
  projectInfo: ProjectInfo;
  selectedProducts: Array<{ productId: string; quantity: number }>;
  warrantyOption: string;
  paymentOption: string;
  totalPrice: number;
  date: Date;
  validUntil: Date;
  quotationNumber: string;
}
