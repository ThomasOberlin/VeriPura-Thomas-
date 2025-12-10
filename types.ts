
export enum ShipmentStatus {
    PENDING = 'Pending',
    IN_TRANSIT = 'In Transit',
    RECEIVED = 'Received',
    INCOMPLETE = 'Incomplete',
    COMPLIANT = 'Compliant'
}

export enum SupplierStatus {
    VERIFIED = 'Verified',
    PENDING = 'Pending Verification',
    ACTION_REQUIRED = 'Action Required',
    INACTIVE = 'Inactive'
}

export enum ProductType {
    PRODUCE = 'Fresh Produce',
    SEAFOOD = 'Seafood',
    PACKAGED = 'Packaged Food',
    SPICES = 'Herbs & Spices',
    DAIRY = 'Cheeses',
    READY_TO_EAT = 'Ready-to-Eat Deli Salads'
}

export type CompanyType = 'Importer' | 'Exporter' | 'Transformer' | 'Raw Material Supplier';

export interface UserAccount {
    id: string;
    name: string;
    email: string;
    role: 'Admin' | 'Manager' | 'User' | 'Viewer';
    status: 'Active' | 'Invited' | 'Inactive';
    lastActive: string;
}

export interface Address {
    street: string;
    city: string;
    state?: string;
    country: string;
    zip?: string;
}

export interface Supplier {
    id: string;
    name: string;
    country: string;
    contactName: string;
    email: string;
    phone: string;
    status: SupplierStatus;
    complianceScore: number;
    categories: ProductType[];
    lastShipmentDate: string;
}

export interface Document {
    id: string;
    name: string;
    type: 'BOL' | 'Invoice' | 'Certificate' | 'Photo' | 'Lab Report' | 'Traceability Plan';
    uploadDate: string;
    expiryDate?: string;
    url?: string;
}

export interface TraceabilityEvent {
    id: string;
    // Updated to match FSMA 204 CTEs strictly
    type: 'Harvesting' | 'Cooling' | 'Initial Packing' | 'First Land-Based Receiver' | 'Transformation' | 'Shipping' | 'Receiving';
    date: string;
    location: string;
    performer: string;
    documents: Document[];
    status: 'Complete' | 'Missing Data';
    details?: string;
    coordinates?: { lat: number; lng: number };
    // Specific KDEs required by the rule
    kdeData?: {
        tlcAssigned?: string; // If TLC is created here
        tlcSource?: string; // Location of TLC source
        inputTLCs?: string[]; // For Transformation (ingredients)
        referenceDocType?: string;
        referenceDocNum?: string;
        [key: string]: any;
    };
}

export interface Product {
    id: string;
    tlc: string; // Traceability Lot Code
    name: string;
    category: ProductType;
    supplierId: string;
    supplierName: string;
    receivedDate: string;
    quantity: number;
    uom: string;
    isFTL: boolean; // Food Traceability List
    ftlCategory?: string; // e.g., "Leafy Greens", "Histamine-producing species"
    completeness: number; // 0-100
    status: ShipmentStatus;
    events: TraceabilityEvent[];
    expirationDate?: string;
}

export interface Alert {
    id: string;
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
    date: string;
}

// New Interface for Section 1.1315
export interface TraceabilityPlan {
    procedureDescription: string;
    ftlIdentificationProcedure: string;
    tlcAssignmentProcedure: string;
    pointOfContact: {
        name: string;
        phone: string;
        email: string;
    };
    farmMaps: {
        id: string;
        name: string;
        location: string;
        coordinates: { lat: number; lng: number }[];
    }[];
}

export interface AppState {
    suppliers: Supplier[];
    products: Product[];
    alerts: Alert[];
    traceabilityPlan: TraceabilityPlan;
    currentUser: {
        name: string;
        role: 'Admin' | 'Manager' | 'User';
        company: string;
    };
}

// --- DEMO SYSTEM TYPES ---

export type DemoActionType = 'navigate' | 'click' | 'fill' | 'highlight' | 'wait' | 'typing';

export interface DemoAction {
    type: DemoActionType;
    target?: string; // Selector or View ID
    value?: any;
    delay?: number;
}

export interface DemoStep {
    id: number;
    title: string;
    narration: string;
    targetElement?: string; // CSS selector to highlight
    actions?: DemoAction[]; // Actions to perform BEFORE narration starts or during
    duration?: number; // Force wait time
    path?: string; // Ensure we are on this view
}

export interface DemoScenario {
    id: string;
    title: string;
    role: string;
    icon: any; // Lucide icon name
    description: string;
    durationSeconds: number;
    steps: DemoStep[];
    persona: {
        name: string;
        avatarInitials: string;
        company: string;
    };
}
