import React, { useState, useEffect, useMemo, useRef } from 'react';
import ReactDOM from 'react-dom/client';

// ============================================================================
// 1. PROFESSIONAL SVG ICONS (Uniform 2px stroke, Zero Emojis)
// ============================================================================
const Icons = {
  Dashboard: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  ),
  Customers: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Orders: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
    </svg>
  ),
  Quotations: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  Payments: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" />
      <path d="M6 15h2" /><path d="M14 15h4" />
    </svg>
  ),
  Expenses: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <line x1="12" x2="12" y1="2" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /><path d="m17 14 4 4-4 4" />
    </svg>
  ),
  Accounts: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <line x1="3" x2="21" y1="22" y2="22" /><line x1="6" x2="6" y1="18" y2="11" />
      <line x1="10" x2="10" y1="18" y2="11" /><line x1="14" x2="14" y1="18" y2="11" />
      <line x1="18" x2="18" y1="18" y2="11" /><polygon points="12 2 20 7 4 7" />
    </svg>
  ),
  Reports: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <line x1="18" x2="18" y1="20" y2="10" /><line x1="12" x2="12" y1="20" y2="4" /><line x1="6" x2="6" y1="20" y2="14" />
    </svg>
  ),
  Help: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  Upgrade: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  Settings: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  User: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Building: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <line x1="9" y1="22" x2="9" y2="22.01" /><line x1="15" y1="22" x2="15" y2="22.01" />
      <line x1="9" y1="6" x2="9" y2="6.01" /><line x1="15" y1="6" x2="15" y2="6.01" />
      <line x1="9" y1="10" x2="9" y2="10.01" /><line x1="15" y1="10" x2="15" y2="10.01" />
      <line x1="9" y1="14" x2="9" y2="14.01" /><line x1="15" y1="14" x2="15" y2="14.01" />
      <line x1="9" y1="18" x2="9" y2="18.01" /><line x1="15" y1="18" x2="15" y2="18.01" />
    </svg>
  ),
  LogOut: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  Search: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Plus: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  WhatsApp: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.12.17 1.78 2.72 4.31 3.81.6.26 1.07.42 1.44.54.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.22-.17-.47-.29" />
    </svg>
  ),
  Print: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect width="12" height="8" x="6" y="14" />
    </svg>
  ),
  Download: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  ChevronDown: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  ChevronRight: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  Close: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Check: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
};

// ============================================================================
// 2. BILINGUAL TRANSLATION REGISTRY
// ============================================================================
const dict = {
  en: {
    appName: "ROKDO",
    tagline: "Aapka Digital Accountant",
    navDashboard: "Dashboard",
    navCustomers: "Customers",
    navOrders: "Orders",
    navQuotations: "Quotations",
    navPayments: "Payments",
    navExpenses: "Expenses",
    navAccounts: "Accounts",
    navReports: "Reports",
    navHelp: "Help & Support",
    navUpgrade: "Upgrade Plan",
    navSettings: "Settings",
    navProfile: "Business Profile",
    myAccount: "My Account",
    logout: "Log Out",
    todaySales: "Today's Sales",
    monthlySales: "Monthly Sales",
    totalReceived: "Total Received",
    pendingReceivables: "Pending Balance",
    totalExpenses: "Total Expenses",
    estimatedProfit: "Estimated Profit",
    monthlyTarget: "Monthly Target Progress",
    salesTrend: "7-Day Sales Trajectory",
    expenseBreakdown: "Expense Breakdown",
    recentOrders: "Recent Orders",
    newOrder: "New Order",
    newQuotation: "New Quotation",
    addCustomer: "Add Customer",
    recordPayment: "Record Payment",
    addExpense: "Add Expense",
    viewAll: "View All",
    ledger: "Account Ledger",
    shareWhatsApp: "WhatsApp",
    printInvoice: "Print Invoice",
    downloadPDF: "Print / PDF",
    exportCSV: "Export CSV",
    taxInvoice: "TAX INVOICE",
    quotationDoc: "COMMERCIAL QUOTATION",
    billedTo: "Billed To",
    itemDescription: "Item & Description",
    qty: "Qty",
    rate: "Rate (₹)",
    taxRate: "GST %",
    total: "Total",
    subtotal: "Subtotal",
    taxTotal: "GST Tax",
    grandTotal: "Grand Total",
    advanceReceived: "Advance Received",
    balanceDue: "Balance Due",
    statusPaid: "Paid in Full",
    statusDue: "Payment Due",
    convertToOrder: "Convert to Live Order",
    searchCustomer: "Search customer name or mobile...",
    save: "Save Details",
    cancel: "Cancel",
    template1: "Classic Professional",
    template2: "Premium Corporate",
    template3: "Modern Minimal",
    template4: "Elegant Business",
    selectTemplate: "Invoice & Quotation Template",
    validUntil: "Valid Until"
  },
  hi: {
    appName: "ROKDO",
    tagline: "आपका डिजिटल अकाउंटेंट",
    navDashboard: "डैशबोर्ड",
    navCustomers: "ग्राहक",
    navOrders: "ऑर्डर्स",
    navQuotations: "कोटेशन (अनुमान)",
    navPayments: "भुगतान",
    navExpenses: "खर्चे",
    navAccounts: "खाते (कैश/बैंक)",
    navReports: "रिपोर्ट्स",
    navHelp: "सहायता एवं समर्थन",
    navUpgrade: "प्लान अपग्रेड करें",
    navSettings: "सेटिंग्स",
    navProfile: "बिज़नेस प्रोफाइल",
    myAccount: "मेरा खाता",
    logout: "लॉगआउट",
    todaySales: "आज की बिक्री",
    monthlySales: "मासिक बिक्री",
    totalReceived: "कुल जमा (कैश)",
    pendingReceivables: "मार्केट उधारी (बकाया)",
    totalExpenses: "कुल खर्चे",
    estimatedProfit: "अनुमानित मुनाफा",
    monthlyTarget: "मासिक बिक्री लक्ष्य",
    salesTrend: "7-दिवसीय बिक्री रुझान",
    expenseBreakdown: "खर्चों का वर्गीकरण",
    recentOrders: "हालिया ऑर्डर्स",
    newOrder: "नया ऑर्डर",
    newQuotation: "नया कोटेशन",
    addCustomer: "नया ग्राहक",
    recordPayment: "रकम जमा करें",
    addExpense: "खर्चा जोड़ें",
    viewAll: "सभी देखें",
    ledger: "खाता बही (Ledger)",
    shareWhatsApp: "व्हाट्सएप भेजें",
    printInvoice: "बिल प्रिंट करें",
    downloadPDF: "प्रिंट / PDF",
    exportCSV: "CSV डाउनलोड",
    taxInvoice: "पक्का टैक्स बिल (INVOICE)",
    quotationDoc: "व्यापारिक कोटेशन (QUOTATION)",
    billedTo: "क्रेता का विवरण",
    itemDescription: "सामान व विवरण",
    qty: "मात्रा",
    rate: "दर (₹)",
    taxRate: "जीएसटी %",
    total: "कुल योग",
    subtotal: "उप-योग",
    taxTotal: "जीएसटी टैक्स",
    grandTotal: "अंतिम कुल योग",
    advanceReceived: "अग्रिम जमा (एडवांस)",
    balanceDue: "शेष बाकी उधारी",
    statusPaid: "पूर्ण भुगतान प्राप्त",
    statusDue: "भुगतान बकाया",
    convertToOrder: "ऑर्डर में बदलें",
    searchCustomer: "ग्राहक का नाम या मोबाइल खोजें...",
    save: "सुरक्षित करें",
    cancel: "रद्द करें",
    template1: "क्लासिक प्रोफेशनल",
    template2: "प्रीमियम कॉर्पोरेट",
    template3: "मॉडर्न मिनिमल",
    template4: "एलिगेंट बिज़नेस",
    selectTemplate: "इनवॉइस व कोटेशन टेम्पलेट",
    validUntil: "वैधता तिथि"
  }
};

const formatINR = (amt) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amt || 0);

const formatDateIndian = (dateStr) => {
  if (!dateStr) return '';
  const p = dateStr.split('-');
  return p.length === 3 ? `${p[2]}-${p[1]}-${p[0]}` : dateStr;
};

// ============================================================================
// 3. MAIN APPLICATION ROOT COMPONENT
// ============================================================================
function RokdoApp() {
  const [lang, setLang] = useState(() => localStorage.getItem('hp_lang') || 'en');
  const t = dict[lang];

  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef(null);

  // Business Profile Model
  const [biz, setBiz] = useState(() => {
    const s = localStorage.getItem('hp_biz');
    return s ? JSON.parse(s) : {
      name: 'My Business',
      ownerName: '',
      phone: '',
      whatsapp: '',
      email: '',
      address: '',
      city: '',
      state: 'Gujarat',
      pincode: '',
      gstin: '',
      pan: '',
      businessType: '',
      salesTargetMonthly: 600000,
      logoUrl: '',
      defaultTemplate: 'template1',
      terms: '1. Goods once sold will not be taken back.\n2. Payment strictly due within 15 days of invoice date.'
    };
  });

  // User State
  const [user] = useState(() => {
    const s = localStorage.getItem('hp_user');
    return s ? JSON.parse(s) : { name: '', email: '' };
  });

  // Financial Datasets
  const [customers, setCustomers] = useState(() => {
    const s = localStorage.getItem('hp_customers');
    return s ? JSON.parse(s) : [];
  });

  const [orders, setOrders] = useState(() => {
    const s = localStorage.getItem('hp_orders');
    return s ? JSON.parse(s) : [];
  });

  const [quotations, setQuotations] = useState(() => {
    const s = localStorage.getItem('hp_quotations');
    return s ? JSON.parse(s) : [];
  });

  const [payments, setPayments] = useState(() => {
    const s = localStorage.getItem('hp_payments');
    return s ? JSON.parse(s) : [];
  });

  const [expenses, setExpenses] = useState(() => {
    const s = localStorage.getItem('hp_expenses');
    return s ? JSON.parse(s) : [];
  });

  const accounts = []; // Accounts are shown only after real account balances are configured.

  // Modals & References
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showQuotationModal, setShowQuotationModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [quoteNewCustomer, setQuoteNewCustomer] = useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerActiveTab, setCustomerActiveTab] = useState('overview');
  const [activeDocument, setActiveDocument] = useState(null);
  const [docTemplateOverride, setDocTemplateOverride] = useState(null);

  const todayISO = new Date().toISOString().slice(0, 10);
  const monthStartISO = `${new Date().getFullYear()}-${String(new Date().getMonth()+1).padStart(2,'0')}-01`;
  const [reportDateFrom, setReportDateFrom] = useState(monthStartISO);
  const [reportDateTo, setReportDateTo] = useState(todayISO);

  // Persistence
  useEffect(() => { localStorage.setItem('hp_lang', lang); }, [lang]);
  useEffect(() => { localStorage.setItem('hp_biz', JSON.stringify(biz)); }, [biz]);
  useEffect(() => { localStorage.setItem('hp_customers', JSON.stringify(customers)); }, [customers]);
  useEffect(() => { localStorage.setItem('hp_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('hp_quotations', JSON.stringify(quotations)); }, [quotations]);
  useEffect(() => { localStorage.setItem('hp_payments', JSON.stringify(payments)); }, [payments]);
  useEffect(() => { localStorage.setItem('hp_expenses', JSON.stringify(expenses)); }, [expenses]);

  // Click outside to close Account Menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
        setAccountMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Financial Metrics Engine
  const metrics = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const monthPrefix = today.slice(0, 7);
    const todaySales = orders.filter(o => o.orderDate === today).reduce((sum, o) => sum + Number(o.grandTotal || 0), 0);
    const totalSales = orders.reduce((sum, o) => sum + Number(o.grandTotal || 0), 0);
    const monthlySales = orders.filter(o => (o.orderDate || '').startsWith(monthPrefix)).reduce((sum, o) => sum + Number(o.grandTotal || 0), 0);
    // Advances are already recorded against orders; count them once alongside later receipts.
    const totalReceived = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0) + orders.reduce((sum, o) => sum + Number(o.advancePaid || 0), 0);
    const pendingDue = customers.reduce((sum, c) => sum + (c.outstandingBalance || 0), 0);
    const totalExp = expenses.reduce((sum, e) => sum + e.amount, 0);
    const estimatedProfit = totalSales - totalExp;
    const targetProgress = Math.min(100, Math.round((monthlySales / (biz.salesTargetMonthly || 500000)) * 100));

    return { todaySales, totalSales, monthlySales, totalReceived, pendingDue, totalExp, estimatedProfit, targetProgress };
  }, [orders, payments, customers, expenses, biz]);

  // Customer Ledger Generator
  const getCustomerLedger = (custId) => {
    const custOrders = orders.filter(o => o.customerId === custId);
    const custPayments = payments.filter(p => p.customerId === custId);
    const ledger = [];
    custOrders.forEach(o => {
      ledger.push({ id: 'ord_' + o.id, date: o.orderDate, desc: `${t.navOrders} (${o.orderNumber})`, debit: o.grandTotal, credit: 0 });
      if (o.advancePaid > 0) {
        ledger.push({ id: 'adv_' + o.id, date: o.orderDate, desc: `${t.advanceReceived} (${o.orderNumber})`, debit: 0, credit: o.advancePaid });
      }
    });
    custPayments.forEach(p => {
      ledger.push({ id: 'pay_' + p.id, date: p.date, desc: `${t.navPayments} (${p.method.toUpperCase()})`, debit: 0, credit: p.amount });
    });
    ledger.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    let bal = 0;
    ledger.forEach(row => {
      bal += (row.debit - row.credit);
      row.runningBalance = bal;
    });
    return ledger.reverse();
  };

  // Convert Quotation into Live Order
  const convertQuotationToOrder = (quote) => {
    const newOrd = {
      id: 'ord_' + Date.now(),
      orderNumber: 'ORD-' + String(Date.now()).slice(-5),
      customerId: quote.customerId,
      customerName: quote.customerName,
      customerMobile: quote.customerMobile,
      orderDate: new Date().toISOString().slice(0, 10),
      items: quote.items,
      subtotal: quote.subtotal,
      taxTotal: quote.taxTotal,
      grandTotal: quote.grandTotal,
      advancePaid: 0,
      remainingBalance: quote.grandTotal,
      status: 'in_progress',
      template: quote.template || biz.defaultTemplate
    };

    setOrders([newOrd, ...orders]);
    setQuotations(quotations.map(q => q.id === quote.id ? { ...q, status: 'accepted' } : q));
    setCustomers(customers.map(c => c.id === quote.customerId ? {
      ...c,
      totalPurchases: c.totalPurchases + quote.grandTotal,
      outstandingBalance: c.outstandingBalance + quote.grandTotal
    } : c));

    alert(lang === 'hi' ? "कोटेशन सफलतापूर्वक पक्के ऑर्डर में बदल गया!" : "Quotation successfully converted to active Order!");
    setActiveTab('orders');
  };

  // WhatsApp Formatted Bill Sender
  const sendWhatsAppDocument = (docItem, isQuote = false) => {
    const prefix = isQuote ? t.quotationDoc : t.taxInvoice;
    const ref = isQuote ? docItem.quoteNumber : docItem.orderNumber;
    const text = `*${prefix}: ${ref}*\n${lang === 'hi' ? 'नमस्ते' : 'Dear'} ${docItem.customerName},\n${lang === 'hi' ? 'दस्तावेज विवरण' : 'Commercial document summary from'} *${biz.name}*:\n\n*${t.itemDescription}:* ${docItem.items ? docItem.items.map(i => `${i.name} (x${i.qty})`).join(', ') : 'Items'}\n*${t.grandTotal}:* ${formatINR(docItem.grandTotal)}\n${!isQuote ? `*${t.advanceReceived}:* ${formatINR(docItem.advancePaid)}\n*${t.balanceDue}:* ${formatINR(docItem.remainingBalance)}\n` : `*${t.validUntil}:* ${formatDateIndian(docItem.validUntil)}\n`}\n${lang === 'hi' ? 'सम्पर्क करें' : 'Contact us'}: ${biz.phone}\n${biz.tagline || ''}`;
    window.open(`https://wa.me/91${docItem.customerMobile.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
  };

  // CSV Report Generator
  const downloadReportCSV = (reportType) => {
    let rows = [];
    let headers = [];
    let filename = `HISAB_PRO_${reportType}_${reportDateFrom}_to_${reportDateTo}.csv`;

    if (reportType === 'sales') {
      headers = ['Order Number', 'Date', 'Customer Name', 'Subtotal', 'Tax (GST)', 'Grand Total', 'Status'];
      rows = orders.map(o => [`"${o.orderNumber}"`, `"${o.orderDate}"`, `"${o.customerName}"`, o.subtotal, o.taxTotal, o.grandTotal, `"${o.status}"`]);
    } else if (reportType === 'outstanding') {
      headers = ['Customer Name', 'Mobile', 'City', 'Total Purchases', 'Total Paid', 'Balance Due'];
      rows = customers.map(c => [`"${c.name}"`, `"${c.mobile}"`, `"${c.city || ''}"`, c.totalPurchases, c.totalReceived, c.outstandingBalance]);
    } else {
      headers = ['Date', 'Title', 'Category', 'Amount (INR)'];
      rows = expenses.map(e => [`"${e.date}"`, `"${e.title}"`, `"${e.category}"`, e.amount]);
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#F7F8FB] flex flex-col md:flex-row font-sans text-[#202B3C]">
      
      {/* DESKTOP SIDEBAR */}
      <aside className={`hidden md:flex flex-col bg-[#101D35] text-white border-r border-[#142542] transition-all duration-200 z-30 sticky top-0 h-screen ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
        <div className="p-4 flex items-center justify-between border-b border-[#172B4D]">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-[#C9A04A] text-[#101D35] font-black flex items-center justify-center text-xl shrink-0 shadow-md">R</div>
            {!sidebarCollapsed && (
              <div className="truncate">
                <div className="font-bold text-sm tracking-tight leading-tight">{biz.name}</div>
                <div className="text-[10px] text-[#C9A04A] font-semibold truncate">{biz.businessType || 'Enterprise'}</div>
              </div>
            )}
          </div>
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <Icons.ChevronRight className={`w-4 h-4 transition-transform ${sidebarCollapsed ? '' : 'rotate-180'}`} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {[
            { id: 'dashboard', label: t.navDashboard, icon: Icons.Dashboard },
            { id: 'customers', label: t.navCustomers, icon: Icons.Customers, badge: customers.length },
            { id: 'orders', label: t.navOrders, icon: Icons.Orders, badge: orders.length },
            { id: 'quotations', label: t.navQuotations, icon: Icons.Quotations, badge: quotations.length },
            { id: 'payments', label: t.navPayments, icon: Icons.Payments },
            { id: 'expenses', label: t.navExpenses, icon: Icons.Expenses },
            { id: 'accounts', label: t.navAccounts, icon: Icons.Accounts },
            { id: 'reports', label: t.navReports, icon: Icons.Reports },
            { id: 'profile', label: t.navProfile, icon: Icons.Building },
            { id: 'upgrade', label: t.navUpgrade, icon: Icons.Upgrade, highlight: true },
            { id: 'help', label: t.navHelp, icon: Icons.Help },
            { id: 'settings', label: t.navSettings, icon: Icons.Settings }
          ].map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive 
                    ? 'bg-[#C9A04A] text-[#101D35] font-bold shadow-sm' 
                    : item.highlight 
                      ? 'text-[#C9A04A] bg-[#C9A04A]/10 hover:bg-[#C9A04A]/20' 
                      : 'text-slate-300 hover:bg-[#172B4D] hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!sidebarCollapsed && <span className="flex-1 text-left truncate">{item.label}</span>}
                {!sidebarCollapsed && item.badge !== undefined && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${isActive ? 'bg-[#101D35] text-white' : 'bg-[#172B4D] text-slate-300'}`}>{item.badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-[#172B4D] bg-[#0c1629]">
          <div className="flex items-center space-x-3 p-2 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-[#C9A04A]/20 text-[#C9A04A] flex items-center justify-center font-bold text-xs shrink-0">
              {user.name ? user.name.charAt(0) : 'U'}
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 truncate">
                <div className="text-xs font-bold text-white truncate">{user.name}</div>
                <div className="text-[10px] text-[#C9A04A] font-semibold truncate">Trial: 7 Days Remaining</div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-6">
        
        {/* PREMIUM DARK NAVY BLUE HEADER */}
        <header className="sticky top-0 z-20 bg-[#101D35] text-white border-b border-[#172B4D] px-4 md:px-8 py-3.5 flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-3">
            <div className="md:hidden flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#C9A04A] text-[#101D35] font-black flex items-center justify-center text-base">R</div>
              <span className="font-bold text-sm tracking-tight text-white">{biz.name}</span>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-xs font-medium text-slate-300">
              <span className="text-[#C9A04A] font-bold">{biz.name}</span>
              <span>/</span>
              <span className="capitalize text-white font-semibold">{activeTab}</span>
              <span>•</span>
              <span className="text-slate-400">{new Intl.DateTimeFormat(lang === 'hi' ? 'hi-IN' : 'en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date())}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Bilingual Switcher */}
            <button
              onClick={() => setLang(l => l === 'en' ? 'hi' : 'en')}
              className="text-xs px-3 py-1.5 rounded-xl border border-white/20 font-bold bg-[#172B4D] hover:bg-[#1e3863] text-white transition"
            >
              {lang === 'en' ? '🇮🇳 हिंदी' : 'English'}
            </button>

            {/* Quick Action Button */}
            <button 
              onClick={() => setShowOrderModal(true)}
              className="hidden sm:flex px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#C9A04A] hover:bg-[#B58D38] text-[#101D35] shadow-xs items-center space-x-1.5 transition"
            >
              <Icons.Plus className="w-4 h-4" />
              <span>{t.newOrder}</span>
            </button>

            {/* Top-Right Account Menu */}
            <div className="relative" ref={accountMenuRef}>
              <button 
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className="flex items-center space-x-2 p-1.5 pl-2.5 rounded-xl bg-[#172B4D] hover:bg-[#1e3863] border border-white/10 text-white transition"
              >
                <div className="w-7 h-7 rounded-lg bg-[#C9A04A] text-[#101D35] font-black text-xs flex items-center justify-center">
                  {biz.name.charAt(0)}
                </div>
                <span className="hidden lg:inline text-xs font-bold max-w-[100px] truncate">{biz.ownerName || 'Account'}</span>
                <Icons.ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {accountMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 text-[#202B3C]">
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <div className="font-bold text-xs truncate">{biz.name}</div>
                    <div className="text-[10px] text-slate-500 truncate">{biz.email}</div>
                  </div>
                  <div className="py-1">
                    {[
                      { id: 'settings', label: t.myAccount, icon: Icons.User },
                      { id: 'profile', label: t.navProfile, icon: Icons.Building },
                      { id: 'reports', label: t.navReports, icon: Icons.Reports },
                      { id: 'upgrade', label: t.navUpgrade, icon: Icons.Upgrade, gold: true },
                      { id: 'help', label: t.navHelp, icon: Icons.Help },
                      { id: 'settings', label: t.navSettings, icon: Icons.Settings }
                    ].map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={idx}
                          onClick={() => { setActiveTab(item.id); setAccountMenuOpen(false); }}
                          className={`w-full text-left px-4 py-2 text-xs font-semibold flex items-center space-x-2.5 hover:bg-slate-50 transition ${item.gold ? 'text-[#C9A04A] font-bold' : 'text-[#202B3C]'}`}
                        >
                          <Icon className="w-4 h-4 shrink-0" />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="border-t border-slate-100 pt-1">
                    <button
                      onClick={() => { alert("Session logged out securely."); setAccountMenuOpen(false); }}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-rose-600 flex items-center space-x-2.5 hover:bg-rose-50 transition"
                    >
                      <Icons.LogOut className="w-4 h-4" />
                      <span>{t.logout}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* WORKSPACE CONTENT */}
        <main className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6">

          {/* 1. DASHBOARD */}
          {activeTab === 'dashboard' && (
            <>
              <section className="rokdo-welcome-panel">
                <div className="rokdo-welcome-copy">
                  <span className="rokdo-eyebrow">ROKDO BUSINESS OVERVIEW</span>
                  <h1>{lang === 'hi' ? `नमस्ते${biz.ownerName ? `, ${biz.ownerName}` : ''} 👋` : `Good ${new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}${biz.ownerName ? `, ${biz.ownerName}` : ''}`}</h1>
                  <p>{lang === 'hi' ? 'आज अपने बिज़नेस का हिसाब एक नज़र में देखें।' : 'Here is your business snapshot. Keep every rupee accounted for.'}</p>
                </div>
                <div className="rokdo-welcome-actions">
                  <button onClick={() => setShowQuotationModal(true)} className="rokdo-secondary-action">＋ {t.newQuotation}</button>
                  <button onClick={() => setShowOrderModal(true)} className="rokdo-primary-action">＋ {t.newOrder}</button>
                </div>
                <div className="rokdo-welcome-mark" aria-hidden="true">R</div>
              </section>
              <div className="rokdo-section-heading"><div><span className="rokdo-eyebrow">AT A GLANCE</span><h2>{lang === 'hi' ? 'वित्तीय सारांश' : 'Financial summary'}</h2></div><span className="rokdo-live-pill"><i></i>{lang === 'hi' ? 'लाइव अवलोकन' : 'Live overview'}</span></div>
              {/* Financial KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 md:gap-5">
                <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div className="text-xs font-semibold text-[#788397]">{t.todaySales}</div>
                  <div className="text-xl md:text-2xl font-black text-[#202B3C] mt-2">{formatINR(metrics.todaySales)}</div>
                  <div className="text-[11px] text-[#788397] mt-1">{t.monthlySales}: <span className="font-semibold">{formatINR(metrics.monthlySales)}</span></div>
                </div>

                <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div className="text-xs font-semibold text-emerald-600">{t.totalReceived}</div>
                  <div className="text-xl md:text-2xl font-black text-emerald-600 mt-2">{formatINR(metrics.totalReceived)}</div>
                  <div className="text-[11px] text-[#788397] mt-1">{payments.length} Collections</div>
                </div>

                <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div className="text-xs font-semibold text-rose-600">{t.pendingReceivables}</div>
                  <div className="text-xl md:text-2xl font-black text-rose-600 mt-2">{formatINR(metrics.pendingDue)}</div>
                  <div className="text-[11px] text-[#788397] mt-1">{customers.filter(c => c.outstandingBalance > 0).length} Customers Pending</div>
                </div>

                <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200/80 shadow-xs border-l-4 border-l-[#C9A04A]">
                  <div className="text-xs font-semibold text-amber-800">{t.estimatedProfit}*</div>
                  <div className="text-xl md:text-2xl font-black text-[#101D35] mt-2">{formatINR(metrics.estimatedProfit)}</div>
                  <div className="text-[10px] text-[#788397] mt-1">*Sales minus recorded OPEX</div>
                </div>
              </div>

              {/* Monthly Target */}
              <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                <div className="flex justify-between items-center text-xs font-bold mb-2">
                  <span className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-[#C9A04A]"></span>
                    <span>{t.monthlyTarget}</span>
                  </span>
                  <span className="text-[#101D35]">{formatINR(metrics.monthlySales)} / {formatINR(biz.salesTargetMonthly)} ({metrics.targetProgress}%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-[#101D35] h-2.5 rounded-full transition-all duration-500" style={{ width: `${metrics.targetProgress}%` }}></div>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <h3 className="text-xs font-bold uppercase tracking-wider mb-4 flex items-center justify-between">
                    <span>{t.salesTrend}</span>
                    <span className="text-emerald-600 font-bold">{formatINR(metrics.monthlySales)} This month</span>
                  </h3>
                  <div className="h-44 w-full flex items-end justify-between pt-6 px-2 gap-2">
                    {[
                      { day: '31 Oct', h: '40%' }, { day: '01 Nov', h: '60%' }, { day: '02 Nov', h: '35%' },
                      { day: '03 Nov', h: '75%' }, { day: '04 Nov', h: '90%' }, { day: '05 Nov', h: '100%' }, { day: '06 Nov', h: '30%' }
                    ].map((b, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                        <div className="w-full max-w-[28px] bg-[#101D35] hover:bg-[#C9A04A] rounded-t-lg transition-all" style={{ height: b.h }}></div>
                        <span className="text-[10px] font-semibold text-slate-500">{b.day}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <h3 className="text-xs font-bold uppercase tracking-wider mb-4 flex items-center justify-between">
                    <span>{t.expenseBreakdown}</span>
                    <span className="text-rose-600 font-bold">-{formatINR(metrics.totalExp)}</span>
                  </h3>
                  <div className="space-y-3.5 pt-1">
                    {[
                      { cat: 'Material & Inventory', amt: 48000, pct: 45, col: 'bg-[#101D35]' },
                      { cat: 'Rent & Leases', amt: 35000, pct: 33, col: 'bg-[#C9A04A]' },
                      { cat: 'Labour & Wages', amt: 22000, pct: 22, col: 'bg-slate-400' }
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span>{item.cat}</span>
                          <span className="text-[#788397]">{formatINR(item.amt)} ({item.pct}%)</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div className={`${item.col} h-2 rounded-full`} style={{ width: `${item.pct}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Orders Table */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="p-4 md:px-6 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-xs uppercase tracking-wider">{t.recentOrders}</h3>
                  <button onClick={() => setActiveTab('orders')} className="text-xs font-bold text-[#101D35] hover:underline">{t.viewAll}</button>
                </div>
                <div className="divide-y divide-slate-100">
                  {orders.slice(0, 5).map(ord => (
                    <div key={ord.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/60 transition">
                      <div>
                        <div className="font-bold text-xs text-[#202B3C]">{ord.customerName}</div>
                        <div className="text-[11px] text-[#788397] mt-0.5">{ord.orderNumber} • {formatDateIndian(ord.orderDate)}</div>
                      </div>
                      <div className="text-right flex items-center gap-3">
                        <div>
                          <div className="font-black text-xs">{formatINR(ord.grandTotal)}</div>
                          <span className={`text-[10px] font-bold ${ord.remainingBalance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                            {ord.remainingBalance > 0 ? `Bal: ${formatINR(ord.remainingBalance)}` : t.statusPaid}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <button onClick={() => { setActiveDocument({ ...ord, docType: 'invoice' }); setDocTemplateOverride(ord.template || biz.defaultTemplate); }} className="p-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100">
                            <Icons.Print className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => sendWhatsAppDocument(ord, false)} className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white">
                            <Icons.WhatsApp className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* 2. CUSTOMERS SECTION */}
          {activeTab === 'customers' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold">{t.navCustomers}</h2>
                <button onClick={() => setShowCustomerModal(true)} className="px-4 py-2 rounded-xl text-xs font-bold bg-[#101D35] text-white flex items-center space-x-2">
                  <Icons.Plus className="w-4 h-4 text-[#C9A04A]" />
                  <span>{t.addCustomer}</span>
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden divide-y divide-slate-100">
                {customers.map(c => (
                  <div key={c.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="font-bold text-sm text-[#202B3C]">{c.name}</div>
                      <div className="text-xs text-[#788397] mt-0.5">📱 {c.mobile} {c.city ? `• ${c.city}` : ''}</div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-5">
                      <div className="text-right">
                        <div className="text-[10px] text-[#788397]">{t.balanceDue}</div>
                        <div className={`font-black text-sm ${c.outstandingBalance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>{formatINR(c.outstandingBalance)}</div>
                      </div>
                      <button onClick={() => { setSelectedCustomer(c); setCustomerActiveTab('overview'); }} className="px-3.5 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-[#101D35] hover:bg-slate-50">
                        View Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. ORDERS SECTION */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold">{t.navOrders}</h2>
                <button onClick={() => setShowOrderModal(true)} className="px-4 py-2 rounded-xl text-xs font-bold bg-[#101D35] text-white flex items-center space-x-2">
                  <Icons.Plus className="w-4 h-4 text-[#C9A04A]" />
                  <span>{t.newOrder}</span>
                </button>
              </div>

              <div className="space-y-3">
                {orders.map(ord => (
                  <div key={ord.id} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-[#101D35]">{ord.orderNumber}</span>
                        <span className="text-[11px] text-slate-400">• {formatDateIndian(ord.orderDate)}</span>
                      </div>
                      <div className="font-bold text-sm mt-1">{ord.customerName}</div>
                      <div className="text-xs text-[#788397] mt-0.5">{ord.items ? ord.items.map(i => `${i.name} (x${i.qty})`).join(', ') : 'Details'}</div>
                    </div>
                    <div className="flex items-center justify-between md:justify-end gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                      <div className="text-right">
                        <div className="text-base font-black">{formatINR(ord.grandTotal)}</div>
                        <div className="text-xs text-rose-600 font-semibold">Bal: {formatINR(ord.remainingBalance)}</div>
                      </div>
                      <div className="flex space-x-1.5">
                        <button onClick={() => { setActiveDocument({ ...ord, docType: 'invoice' }); setDocTemplateOverride(ord.template || biz.defaultTemplate); }} className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold hover:bg-slate-50">{t.printInvoice}</button>
                        <button onClick={() => sendWhatsAppDocument(ord, false)} className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-1">
                          <Icons.WhatsApp className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. QUOTATIONS SECTION */}
          {activeTab === 'quotations' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold">{t.navQuotations}</h2>
                  <p className="text-xs text-[#788397]">Create formal estimates with multiple templates and 1-click order conversion.</p>
                </div>
                <button onClick={() => setShowQuotationModal(true)} className="px-4 py-2 rounded-xl text-xs font-bold bg-[#101D35] text-white flex items-center space-x-2">
                  <Icons.Plus className="w-4 h-4 text-[#C9A04A]" />
                  <span>{t.newQuotation}</span>
                </button>
              </div>

              <div className="space-y-3">
                {quotations.map(q => (
                  <div key={q.id} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-[#C9A04A] bg-[#101D35] px-2 py-0.5 rounded">{q.quoteNumber}</span>
                        <span className="text-[11px] text-slate-400">• Date: {formatDateIndian(q.quoteDate)}</span>
                        <span className="text-[11px] text-slate-400">• {t.validUntil}: {formatDateIndian(q.validUntil)}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 uppercase">{q.status}</span>
                      </div>
                      <div className="font-bold text-sm mt-1">{q.customerName}</div>
                      <div className="text-xs text-[#788397] mt-0.5">{q.items ? q.items.map(i => `${i.name} (x${i.qty})`).join(', ') : 'Quotation Items'}</div>
                    </div>
                    <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                      <div className="text-right">
                        <div className="text-base font-black">{formatINR(q.grandTotal)}</div>
                      </div>
                      <div className="flex space-x-1.5">
                        {q.status !== 'accepted' && (
                          <button onClick={() => convertQuotationToOrder(q)} className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold">
                            {t.convertToOrder}
                          </button>
                        )}
                        <button onClick={() => { setActiveDocument({ ...q, docType: 'quotation' }); setDocTemplateOverride(q.template || biz.defaultTemplate); }} className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold hover:bg-slate-50">
                          {t.downloadPDF}
                        </button>
                        <button onClick={() => sendWhatsAppDocument(q, true)} className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center space-x-1">
                          <Icons.WhatsApp className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. PAYMENTS & EXPENSES & ACCOUNTS */}
          {activeTab === 'payments' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold">{t.navPayments}</h2>
                <button onClick={() => setShowPaymentModal(true)} className="px-4 py-2 rounded-xl text-xs font-bold bg-[#101D35] text-white">+ {t.recordPayment}</button>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100">
                {payments.map(p => (
                  <div key={p.id} className="p-4 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm">{p.customerName}</div>
                      <div className="text-xs text-[#788397] mt-0.5">{p.receiptNumber} • {formatDateIndian(p.date)} • Mode: {p.method.toUpperCase()}</div>
                    </div>
                    <div className="font-black text-base text-emerald-600">+{formatINR(p.amount)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'expenses' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold">{t.navExpenses}</h2>
                <button onClick={() => setShowExpenseModal(true)} className="px-4 py-2 rounded-xl text-xs font-bold bg-[#101D35] text-white">+ {t.addExpense}</button>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100">
                {expenses.map(e => (
                  <div key={e.id} className="p-4 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm">{e.title}</div>
                      <div className="text-xs text-[#788397] mt-0.5">{e.category} • {formatDateIndian(e.date)}</div>
                    </div>
                    <div className="font-black text-base text-rose-600">-{formatINR(e.amount)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'accounts' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold">{t.navAccounts}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {accounts.map(acc => (
                  <div key={acc.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                    <div className="text-[11px] font-bold uppercase text-slate-400">{acc.type}</div>
                    <div className="text-base font-bold mt-1">{acc.name}</div>
                    <div className="text-2xl font-black text-[#101D35] mt-3">{formatINR(acc.currentBalance)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. BUSINESS PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold">{t.navProfile}</h2>
                <p className="text-xs text-[#788397]">Configure your business details and preview how they appear on invoices.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const f = new FormData(e.currentTarget);
                    setBiz({
                      ...biz,
                      name: f.get('name'),
                      ownerName: f.get('ownerName'),
                      phone: f.get('phone'),
                      whatsapp: f.get('whatsapp'),
                      email: f.get('email'),
                      address: f.get('address'),
                      city: f.get('city'),
                      state: f.get('state'),
                      pincode: f.get('pincode'),
                      gstin: f.get('gstin'),
                      pan: f.get('pan'),
                      businessType: f.get('businessType')
                    });
                    alert(lang === 'hi' ? "बिज़नेस प्रोफाइल सुरक्षित हो गई!" : "Business profile updated successfully!");
                  }} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold block mb-1">Business / Firm Name *</label>
                        <input name="name" defaultValue={biz.name} required className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold block mb-1">Owner Name *</label>
                        <input name="ownerName" defaultValue={biz.ownerName} required className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-semibold block mb-1">Calling Phone *</label>
                        <input name="phone" defaultValue={biz.phone} required className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold block mb-1">WhatsApp Number</label>
                        <input name="whatsapp" defaultValue={biz.whatsapp} className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold block mb-1">Email Address</label>
                        <input name="email" defaultValue={biz.email} className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200" />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold block mb-1">Business Address</label>
                      <input name="address" defaultValue={biz.address} className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200" />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-semibold block mb-1">City</label>
                        <input name="city" defaultValue={biz.city} className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold block mb-1">State</label>
                        <input name="state" defaultValue={biz.state} className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold block mb-1">PIN Code</label>
                        <input name="pincode" defaultValue={biz.pincode} className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-semibold block mb-1">GSTIN (Optional)</label>
                        <input name="gstin" defaultValue={biz.gstin} placeholder="Optional" className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 uppercase" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold block mb-1">PAN Number (Optional)</label>
                        <input name="pan" defaultValue={biz.pan} placeholder="Optional" className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 uppercase" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold block mb-1">Business Type</label>
                        <select name="businessType" defaultValue={biz.businessType} className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white">
                          <option value="Manufacturer & Wholesaler">Manufacturer & Wholesaler</option>
                          <option value="Retail Shopkeeper">Retail Shopkeeper</option>
                          <option value="Trader & Distributor">Trader & Distributor</option>
                          <option value="Service Provider">Service Provider</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold block mb-1">Business Logo</label>
                      <div className="flex items-center space-x-3">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => setBiz({ ...biz, logoUrl: reader.result });
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#101D35] file:text-white hover:file:bg-[#172B4D]"
                        />
                        {biz.logoUrl && (
                          <button type="button" onClick={() => setBiz({ ...biz, logoUrl: '' })} className="text-xs text-rose-600 font-bold hover:underline">
                            Remove Logo
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="pt-2">
                      <button type="submit" className="px-5 py-2.5 rounded-xl bg-[#101D35] text-white text-xs font-bold shadow-xs">
                        {t.save}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Live Preview Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-[#C9A04A]">Live Document Header Preview</h3>
                  <div className="p-4 rounded-xl border border-slate-200 bg-[#F4F6FA] text-xs space-y-2">
                    <div className="flex items-center space-x-3">
                      {biz.logoUrl ? (
                        <img src={biz.logoUrl} alt="Logo" className="w-12 h-12 rounded-lg object-contain bg-white p-1 border" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-[#101D35] text-[#C9A04A] font-black text-xl flex items-center justify-center">
                          {biz.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="font-black text-sm text-[#101D35]">{biz.name}</div>
                        <div className="text-[10px] text-slate-500">{biz.businessType}</div>
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-600 pt-2 border-t border-slate-200/60 leading-relaxed">
                      <div>📍 {biz.address}, {biz.city}, {biz.state} - {biz.pincode}</div>
                      <div>📞 Ph: {biz.phone} | WA: {biz.whatsapp || biz.phone}</div>
                      <div>✉️ {biz.email}</div>
                      {biz.gstin && <div>🧾 GSTIN: <span className="font-semibold">{biz.gstin}</span></div>}
                    </div>
                  </div>
                  <p className="text-[11px] text-[#788397]">This live branding is embedded across all 4 invoice and quotation templates.</p>
                </div>
              </div>
            </div>
          )}

          {/* 7. DEDICATED REPORTS SECTION */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold">{t.navReports}</h2>
                  <p className="text-xs text-[#788397]">Comprehensive financial audit statements, sales turnover, and tax summaries.</p>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="date" value={reportDateFrom} onChange={e => setReportDateFrom(e.target.value)} className="text-xs px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white" />
                  <span className="text-xs text-slate-400">to</span>
                  <input type="date" value={reportDateTo} onChange={e => setReportDateTo(e.target.value)} className="text-xs px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { id: 'sales', title: 'Daily & Monthly Sales Report', desc: 'Detailed turnover, itemized sales, and booked revenue.', type: 'sales' },
                  { id: 'outstanding', title: 'Customer Outstanding Statement', desc: 'Aging market receivables and due ledger balances.', type: 'outstanding' },
                  { id: 'expenses', title: 'Operational Expense Audit', desc: 'Categorized overheads, factory rent, material, and wages.', type: 'expenses' },
                  { id: 'profitloss', title: 'Profit & Loss Statement (P&L)', desc: 'Gross revenue minus operational expenses.', type: 'sales' },
                  { id: 'gst', title: 'GST Summary (GSTR-1 Ready)', desc: 'Taxable supply breakdown by 0%, 5%, 12%, 18%, 28%.', type: 'sales' },
                  { id: 'collections', title: 'Collection & Cash Register', desc: 'Cash chest, bank transfer, and UPI receipt trail.', type: 'outstanding' }
                ].map((rep, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3">
                    <div>
                      <div className="text-sm font-bold text-[#101D35]">{rep.title}</div>
                      <p className="text-xs text-[#788397] mt-1">{rep.desc}</p>
                    </div>
                    <div className="flex space-x-2 pt-2 border-t border-slate-100">
                      <button onClick={() => downloadReportCSV(rep.type)} className="flex-1 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-[#202B3C] flex items-center justify-center space-x-1.5">
                        <Icons.Download className="w-3.5 h-3.5 text-[#C9A04A]" />
                        <span>CSV</span>
                      </button>
                      <button onClick={() => window.print()} className="flex-1 py-1.5 rounded-xl bg-[#101D35] text-white text-xs font-bold flex items-center justify-center space-x-1.5">
                        <Icons.Print className="w-3.5 h-3.5" />
                        <span>Print</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. HELP & SUPPORT */}
          {activeTab === 'help' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold">{t.navHelp}</h2>
                <p className="text-xs text-[#788397]">Have queries regarding invoices, ledger balances, or tax settings? We are here to assist.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-emerald-600 uppercase">Instant WhatsApp Support</div>
                    <div className="text-sm font-bold text-[#101D35] mt-1">Chat directly with support specialist</div>
                    <div className="text-xs text-[#788397] mt-0.5">Response time: &lt; 15 minutes (Mon - Sat)</div>
                  </div>
                  <button onClick={() => window.open('https://wa.me/919820098200?text=Hello%20HISAB%20PRO%20Support,%20I%20need%20help%20with%20my%20account', '_blank')} className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center space-x-1.5">
                    <Icons.WhatsApp className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </button>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-[#101D35] uppercase">Email Desk</div>
                    <div className="text-sm font-bold text-[#101D35] mt-1">support@hisabpro.in</div>
                    <div className="text-xs text-[#788397] mt-0.5">Detailed accounting & feature queries</div>
                  </div>
                  <button onClick={() => window.open('mailto:support@hisabpro.in?subject=HISAB%20PRO%20Support%20Request', '_blank')} className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-[#202B3C] hover:bg-slate-50">
                    Send Email
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                <h3 className="font-bold text-sm text-[#101D35]">Frequently Asked Questions (FAQ)</h3>
                <div className="divide-y divide-slate-100 text-xs space-y-3">
                  {[
                    { q: "Is GSTIN registration mandatory to use ROKDO?", a: "No. GSTIN is completely optional. Small traders, shopkeepers, and un-registered fabricators can generate professional commercial bills without GST." },
                    { q: "How do internal bank transfers affect my profit?", a: "Internal transfers between Cash and Bank accounts only balance your cash assets; they are completely isolated from your Profit & Loss calculations." },
                    { q: "Can I customize which template is used for invoices?", a: "Yes. In the Settings or Business Profile section, choose your preferred default from the 4 templates. You can also override it for individual invoices." },
                    { q: "How are quotations converted into orders?", a: "Open any quotation under the Quotations tab and click 'Convert to Live Order'. It instantly books the order, updates customer ledger balances, and creates an invoice." }
                  ].map((faq, i) => (
                    <div key={i} className="pt-3">
                      <div className="font-bold text-[#101D35]">{faq.q}</div>
                      <div className="text-[#788397] mt-1 leading-relaxed">{faq.a}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 9. UPGRADE PLAN */}
          {activeTab === 'upgrade' && (
            <div className="space-y-6">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A04A] bg-[#C9A04A]/10 px-3 py-1 rounded-full">Transparent Commercial Pricing</span>
                <h2 className="text-2xl font-black text-[#101D35]">Choose the Right Plan for Your Business</h2>
                <p className="text-xs text-[#788397]">All plans include unlimited customers, orders, quotations, 4 invoice templates, and customer ledgers.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase">Monthly Subscription</div>
                    <div className="text-2xl font-black text-[#101D35] mt-1">₹199<span className="text-xs font-normal text-slate-400">/mo</span></div>
                    <p className="text-xs text-[#788397] mt-2">Billed monthly. Complete flexibility with zero commitments.</p>
                  </div>
                  <button onClick={() => alert("Subscription request registered. Our desk will contact you with payment details.")} className="w-full py-2.5 rounded-xl border border-[#101D35] text-[#101D35] font-bold text-xs hover:bg-slate-50">
                    Select Monthly
                  </button>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase">Six Months</div>
                    <div className="text-2xl font-black text-[#101D35] mt-1">₹999<span className="text-xs font-normal text-slate-400">/6 mos</span></div>
                    <p className="text-xs text-[#788397] mt-2">Save ~16% compared to monthly billing.</p>
                  </div>
                  <button onClick={() => alert("Subscription request registered. Our desk will contact you with payment details.")} className="w-full py-2.5 rounded-xl border border-[#101D35] text-[#101D35] font-bold text-xs hover:bg-slate-50">
                    Select 6 Months
                  </button>
                </div>

                <div className="bg-white p-6 rounded-2xl border-2 border-[#C9A04A] shadow-md flex flex-col justify-between space-y-4 relative">
                  <div className="absolute -top-3 right-4 bg-[#C9A04A] text-[#101D35] text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full">
                    Best Value
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#C9A04A] uppercase">Annual Enterprise</div>
                    <div className="text-2xl font-black text-[#101D35] mt-1">₹1,999<span className="text-xs font-normal text-slate-400">/yr</span></div>
                    <p className="text-xs text-[#788397] mt-2">Just ₹166/month. Full commercial license with free future feature updates.</p>
                  </div>
                  <button onClick={() => alert("Subscription request registered. Our desk will contact you with payment details.")} className="w-full py-2.5 rounded-xl bg-[#101D35] text-white font-bold text-xs hover:bg-[#172B4D]">
                    Upgrade to Annual
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 10. SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-lg font-bold">{t.navSettings}</h2>
                <p className="text-xs text-[#788397]">System preferences, language controls, and document generation defaults.</p>
              </div>

              {/* Template Preference */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                <h3 className="font-bold text-sm text-[#101D35]">{t.selectTemplate}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { id: 'template1', name: t.template1, tag: 'Clean & Navy Highlights' },
                    { id: 'template2', name: t.template2, tag: 'Dark Navy Top Header' },
                    { id: 'template3', name: t.template3, tag: 'Modern Minimal Dividers' },
                    { id: 'template4', name: t.template4, tag: 'Card Style Gold Trims' }
                  ].map(tmpl => (
                    <div 
                      key={tmpl.id}
                      onClick={() => { setBiz({ ...biz, defaultTemplate: tmpl.id }); alert(`Default template set to: ${tmpl.name}`); }}
                      className={`p-3.5 rounded-xl border-2 cursor-pointer transition ${biz.defaultTemplate === tmpl.id ? 'border-[#C9A04A] bg-[#C9A04A]/5' : 'border-slate-200 hover:border-slate-300'}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[#101D35]">{tmpl.name}</span>
                        {biz.defaultTemplate === tmpl.id && <Icons.Check className="w-4 h-4 text-[#C9A04A]" />}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">{tmpl.tag}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Language & Regional */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                <h3 className="font-bold text-sm text-[#101D35]">Language &amp; Region</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-semibold block mb-1">System Language</label>
                    <select value={lang} onChange={e => setLang(e.target.value)} className="w-full p-2.5 rounded-xl border border-slate-200 bg-white">
                      <option value="en">English (US / Indian Business)</option>
                      <option value="hi">हिन्दी (Hindi)</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Currency &amp; Date Format</label>
                    <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600">
                      INR (₹) • DD-MM-YYYY (Asia/Kolkata)
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Export */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-[#101D35]">Export Data Backup</div>
                  <div className="text-xs text-[#788397] mt-0.5">Download your complete database of customers, orders, and expenses in JSON.</div>
                </div>
                <button 
                  onClick={() => {
                    const data = JSON.stringify({ biz, customers, orders, quotations, payments, expenses, accounts });
                    const blob = new Blob([data], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `ROKDO_BACKUP_${new Date().toISOString().slice(0, 10)}.json`;
                    a.click();
                  }}
                  className="px-4 py-2 rounded-xl border border-[#101D35] text-[#101D35] font-bold text-xs hover:bg-slate-50 flex items-center space-x-1.5"
                >
                  <Icons.Download className="w-4 h-4" />
                  <span>Download Backup</span>
                </button>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* MOBILE COMPACT BOTTOM DOCK */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-2 py-2 flex justify-around items-center shadow-lg">
        {[
          { id: 'dashboard', label: t.navDashboard, icon: Icons.Dashboard },
          { id: 'customers', label: t.navCustomers, icon: Icons.Customers },
          { id: 'orders', label: t.navOrders, icon: Icons.Orders },
          { id: 'quotations', label: t.navQuotations, icon: Icons.Quotations },
          { id: 'reports', label: t.navReports, icon: Icons.Reports }
        ].map(nav => {
          const Icon = nav.icon;
          const isActive = activeTab === nav.id;
          return (
            <button key={nav.id} onClick={() => setActiveTab(nav.id)} className={`flex flex-col items-center py-1 px-2 rounded-xl ${isActive ? 'text-[#C9A04A] font-bold' : 'text-slate-400'}`}>
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-1">{nav.label}</span>
            </button>
          );
        })}
      </nav>

      {/* INTEGRATED CUSTOMER PROFILE MODAL */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl p-5 md:p-6 my-6 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-start pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-[#101D35]">{selectedCustomer.name}</h3>
                <div className="text-xs text-[#788397] mt-0.5">📱 {selectedCustomer.mobile} {selectedCustomer.city ? `• ${selectedCustomer.city}` : ''}</div>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                <Icons.Close className="w-5 h-5" />
              </button>
            </div>

            <div className="flex border-b border-slate-200 mt-3 text-xs font-bold space-x-4 overflow-x-auto">
              {['overview', 'orders', 'quotations', 'payments', 'ledger'].map(tabKey => (
                <button
                  key={tabKey}
                  onClick={() => setCustomerActiveTab(tabKey)}
                  className={`pb-2.5 capitalize border-b-2 transition ${customerActiveTab === tabKey ? 'border-[#C9A04A] text-[#101D35]' : 'border-transparent text-slate-400'}`}
                >
                  {tabKey === 'ledger' ? t.ledger : tabKey}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto py-4 text-xs">
              {customerActiveTab === 'overview' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-slate-50 border">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Total Purchases</div>
                      <div className="text-base font-black text-[#101D35] mt-1">{formatINR(selectedCustomer.totalPurchases)}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                      <div className="text-[10px] text-emerald-700 font-bold uppercase">Total Received</div>
                      <div className="text-base font-black text-emerald-700 mt-1">{formatINR(selectedCustomer.totalReceived)}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-100">
                      <div className="text-[10px] text-rose-700 font-bold uppercase">Balance Due</div>
                      <div className="text-base font-black text-rose-700 mt-1">{formatINR(selectedCustomer.outstandingBalance)}</div>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-200 space-y-2">
                    <div className="font-bold text-[#101D35]">Customer Contact Details</div>
                    <div className="text-slate-600">Mobile: {selectedCustomer.mobile}</div>
                    <div className="text-slate-600">Email: {selectedCustomer.email || 'Not provided'}</div>
                    <div className="text-slate-600">Location: {selectedCustomer.city || 'Standard'}</div>
                  </div>
                </div>
              )}

              {customerActiveTab === 'orders' && (
                <div className="space-y-2">
                  {orders.filter(o => o.customerId === selectedCustomer.id).map(o => (
                    <div key={o.id} className="p-3 rounded-xl border flex justify-between items-center">
                      <div>
                        <div className="font-bold">{o.orderNumber} • {formatDateIndian(o.orderDate)}</div>
                        <div className="text-slate-500">{o.items ? o.items.map(i => i.name).join(', ') : 'Order'}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-black">{formatINR(o.grandTotal)}</div>
                        <div className="text-rose-600">Due: {formatINR(o.remainingBalance)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {customerActiveTab === 'quotations' && (
                <div className="space-y-2">
                  {quotations.filter(q => q.customerId === selectedCustomer.id).map(q => (
                    <div key={q.id} className="p-3 rounded-xl border flex justify-between items-center">
                      <div>
                        <div className="font-bold">{q.quoteNumber} • Valid: {formatDateIndian(q.validUntil)}</div>
                        <div className="text-slate-500">{q.status.toUpperCase()}</div>
                      </div>
                      <div className="font-black">{formatINR(q.grandTotal)}</div>
                    </div>
                  ))}
                </div>
              )}

              {customerActiveTab === 'payments' && (
                <div className="space-y-2">
                  {payments.filter(p => p.customerId === selectedCustomer.id).map(p => (
                    <div key={p.id} className="p-3 rounded-xl border flex justify-between items-center">
                      <div>
                        <div className="font-bold">{p.receiptNumber} • {formatDateIndian(p.date)}</div>
                        <div className="text-slate-500">Mode: {p.method.toUpperCase()}</div>
                      </div>
                      <div className="font-black text-emerald-600">+{formatINR(p.amount)}</div>
                    </div>
                  ))}
                </div>
              )}

              {customerActiveTab === 'ledger' && (
                <div className="divide-y divide-slate-100">
                  {getCustomerLedger(selectedCustomer.id).map(row => (
                    <div key={row.id} className="py-2.5 flex justify-between items-center">
                      <div>
                        <div className="font-bold text-[#101D35]">{row.desc}</div>
                        <div className="text-[10px] text-slate-400">{formatDateIndian(row.date)}</div>
                      </div>
                      <div className="text-right">
                        {row.debit > 0 && <span className="font-bold text-rose-600 block">Dr: {formatINR(row.debit)}</span>}
                        {row.credit > 0 && <span className="font-bold text-emerald-600 block">Cr: {formatINR(row.credit)}</span>}
                        <div className="text-[10px] text-slate-400">Bal: {formatINR(row.runningBalance)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button onClick={() => setSelectedCustomer(null)} className="px-4 py-2 rounded-xl bg-[#101D35] text-white font-bold text-xs">
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* A4 PRINT/VIEW MODAL */}
      {activeDocument && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 md:p-8 my-6 text-[#202B3C] space-y-4">
            
            <div className="no-print flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-[#101D35]">Switch Design:</span>
                <select 
                  value={docTemplateOverride || biz.defaultTemplate} 
                  onChange={e => setDocTemplateOverride(e.target.value)}
                  className="text-xs font-semibold p-1.5 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="template1">Template 1: Classic Professional</option>
                  <option value="template2">Template 2: Premium Corporate</option>
                  <option value="template3">Template 3: Modern Minimal</option>
                  <option value="template4">Template 4: Elegant Business</option>
                </select>
              </div>
              <button onClick={() => setActiveDocument(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                <Icons.Close className="w-5 h-5" />
              </button>
            </div>

            <div id="printable-doc" className="p-2">
              
              {/* TEMPLATE 1: CLASSIC PROFESSIONAL */}
              {(docTemplateOverride || biz.defaultTemplate) === 'template1' && (
                <div className="space-y-4 text-xs font-sans">
                  <div className="flex justify-between items-start border-b-2 border-[#101D35] pb-4">
                    <div className="flex items-center space-x-3">
                      {biz.logoUrl && <img src={biz.logoUrl} alt="Logo" className="w-12 h-12 object-contain" />}
                      <div>
                        <div className="text-lg font-black text-[#101D35]">{biz.name}</div>
                        <div className="text-slate-500 text-[11px]">{biz.address}, {biz.city} - {biz.pincode}</div>
                        <div className="text-slate-500 text-[11px]">Ph: {biz.phone} | GST: {biz.gstin || 'Unregistered'}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-[#C9A04A] uppercase tracking-wider">{activeDocument.docType === 'quotation' ? t.quotationDoc : t.taxInvoice}</div>
                      <div className="font-bold text-slate-800 mt-1">{activeDocument.orderNumber || activeDocument.quoteNumber}</div>
                      <div className="text-slate-400 text-[11px]">{formatDateIndian(activeDocument.orderDate || activeDocument.quoteDate)}</div>
                    </div>
                  </div>

                  <div className="py-2 border-b border-slate-100 flex justify-between">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400">{t.billedTo}</div>
                      <div className="font-bold text-sm text-[#101D35]">{activeDocument.customerName}</div>
                      <div className="text-slate-500">Mobile: {activeDocument.customerMobile}</div>
                    </div>
                    {activeDocument.docType === 'quotation' && (
                      <div className="text-right">
                        <div className="text-[10px] uppercase font-bold text-slate-400">{t.validUntil}</div>
                        <div className="font-bold text-[#101D35]">{formatDateIndian(activeDocument.validUntil)}</div>
                      </div>
                    )}
                  </div>

                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-[#101D35] font-bold">
                        <th className="py-2 px-2 text-left">{t.itemDescription}</th>
                        <th className="py-2 px-2 text-center">{t.qty}</th>
                        <th className="py-2 px-2 text-right">{t.rate}</th>
                        <th className="py-2 px-2 text-right">{t.taxRate}</th>
                        <th className="py-2 px-2 text-right">{t.total}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {activeDocument.items.map((it, i) => (
                        <tr key={i}>
                          <td className="py-2 px-2 font-semibold">{it.name}</td>
                          <td className="py-2 px-2 text-center">{it.qty}</td>
                          <td className="py-2 px-2 text-right">{formatINR(it.rate)}</td>
                          <td className="py-2 px-2 text-right">{it.taxPercent}%</td>
                          <td className="py-2 px-2 text-right font-bold">{formatINR(it.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="border-t-2 border-slate-200 pt-3 space-y-1 text-right">
                    <div>Subtotal: <b>{formatINR(activeDocument.subtotal)}</b></div>
                    {activeDocument.taxTotal > 0 && <div>GST Tax: <b>{formatINR(activeDocument.taxTotal)}</b></div>}
                    <div className="text-sm font-black text-[#101D35]">Grand Total: {formatINR(activeDocument.grandTotal)}</div>
                    {activeDocument.docType !== 'quotation' && (
                      <>
                        <div className="text-emerald-700">Advance Received: <b>{formatINR(activeDocument.advancePaid)}</b></div>
                        <div className="text-sm font-black text-rose-600">Balance Due: {formatINR(activeDocument.remainingBalance)}</div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* TEMPLATE 2: PREMIUM CORPORATE */}
              {(docTemplateOverride || biz.defaultTemplate) === 'template2' && (
                <div className="space-y-4 text-xs font-sans">
                  <div className="bg-[#101D35] text-white p-5 rounded-xl flex justify-between items-center">
                    <div>
                      <div className="text-lg font-black tracking-tight">{biz.name}</div>
                      <div className="text-slate-300 text-[11px] mt-0.5">{biz.address}, {biz.city}</div>
                      <div className="text-slate-300 text-[11px]">Ph: {biz.phone} | GST: {biz.gstin || 'Unregistered'}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[#C9A04A] font-black text-sm uppercase">{activeDocument.docType === 'quotation' ? t.quotationDoc : t.taxInvoice}</div>
                      <div className="font-bold text-white mt-1">{activeDocument.orderNumber || activeDocument.quoteNumber}</div>
                      <div className="text-slate-300 text-[11px]">{formatDateIndian(activeDocument.orderDate || activeDocument.quoteDate)}</div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl flex justify-between">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400">{t.billedTo}</div>
                      <div className="font-bold text-sm text-[#101D35]">{activeDocument.customerName}</div>
                      <div className="text-slate-500">Ph: {activeDocument.customerMobile}</div>
                    </div>
                    {activeDocument.docType === 'quotation' && (
                      <div className="text-right">
                        <div className="text-[10px] uppercase font-bold text-slate-400">{t.validUntil}</div>
                        <div className="font-bold text-[#101D35]">{formatDateIndian(activeDocument.validUntil)}</div>
                      </div>
                    )}
                  </div>

                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b-2 border-[#C9A04A] text-[#101D35] font-bold">
                        <th className="py-2 text-left">{t.itemDescription}</th>
                        <th className="py-2 text-center">{t.qty}</th>
                        <th className="py-2 text-right">{t.rate}</th>
                        <th className="py-2 text-right">{t.taxRate}</th>
                        <th className="py-2 text-right">{t.total}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {activeDocument.items.map((it, i) => (
                        <tr key={i}>
                          <td className="py-2.5 font-semibold">{it.name}</td>
                          <td className="py-2.5 text-center">{it.qty}</td>
                          <td className="py-2.5 text-right">{formatINR(it.rate)}</td>
                          <td className="py-2.5 text-right">{it.taxPercent}%</td>
                          <td className="py-2.5 text-right font-bold">{formatINR(it.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="border-t border-slate-200 pt-3 space-y-1 text-right">
                    <div>Total: <b className="text-sm font-black text-[#101D35]">{formatINR(activeDocument.grandTotal)}</b></div>
                    {activeDocument.docType !== 'quotation' && (
                      <div className="text-sm font-black text-rose-600">Balance Due: {formatINR(activeDocument.remainingBalance)}</div>
                    )}
                  </div>
                </div>
              )}

              {/* TEMPLATE 3: MODERN MINIMAL */}
              {(docTemplateOverride || biz.defaultTemplate) === 'template3' && (
                <div className="space-y-4 text-xs font-sans">
                  <div className="flex justify-between items-start pb-3 border-b border-slate-300">
                    <div>
                      <div className="text-base font-bold text-black">{biz.name}</div>
                      <div className="text-slate-500 text-[11px]">{biz.address}, {biz.city}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono font-bold">{activeDocument.orderNumber || activeDocument.quoteNumber}</div>
                      <div className="text-slate-400 text-[11px]">{formatDateIndian(activeDocument.orderDate || activeDocument.quoteDate)}</div>
                    </div>
                  </div>

                  <div className="py-2">
                    <span className="text-slate-400 text-[10px]">TO: </span>
                    <span className="font-bold">{activeDocument.customerName}</span> ({activeDocument.customerMobile})
                  </div>

                  <table className="w-full text-xs border-t border-b border-slate-200">
                    <thead>
                      <tr className="text-slate-400 text-left">
                        <th className="py-2">Description</th>
                        <th className="py-2 text-center">Qty</th>
                        <th className="py-2 text-right">Rate</th>
                        <th className="py-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {activeDocument.items.map((it, i) => (
                        <tr key={i}>
                          <td className="py-2">{it.name}</td>
                          <td className="py-2 text-center">{it.qty}</td>
                          <td className="py-2 text-right">{formatINR(it.rate)}</td>
                          <td className="py-2 text-right font-mono font-bold">{formatINR(it.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="text-right space-y-1 font-mono">
                    <div>GRAND TOTAL: <b>{formatINR(activeDocument.grandTotal)}</b></div>
                    {activeDocument.docType !== 'quotation' && (
                      <div className="font-bold text-rose-600">DUE: {formatINR(activeDocument.remainingBalance)}</div>
                    )}
                  </div>
                </div>
              )}

              {/* TEMPLATE 4: ELEGANT BUSINESS */}
              {(docTemplateOverride || biz.defaultTemplate) === 'template4' && (
                <div className="space-y-4 text-xs font-sans border-2 border-[#C9A04A] p-5 rounded-2xl bg-[#FFFDF9]">
                  <div className="flex justify-between items-center border-b border-[#C9A04A]/40 pb-3">
                    <div>
                      <div className="text-lg font-black text-[#101D35]">{biz.name}</div>
                      <div className="text-slate-600 text-[11px]">{biz.address}, {biz.city} • Ph: {biz.phone}</div>
                    </div>
                    <div className="text-right bg-[#101D35] text-[#C9A04A] px-3 py-1.5 rounded-xl font-bold">
                      {activeDocument.orderNumber || activeDocument.quoteNumber}
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-[#C9A04A]/30">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Client Information</div>
                    <div className="font-bold text-sm text-[#101D35] mt-0.5">{activeDocument.customerName}</div>
                    <div className="text-slate-600">Mobile: {activeDocument.customerMobile}</div>
                  </div>

                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-[#101D35] text-white">
                        <th className="py-2 px-2 text-left">{t.itemDescription}</th>
                        <th className="py-2 px-2 text-center">{t.qty}</th>
                        <th className="py-2 px-2 text-right">{t.rate}</th>
                        <th className="py-2 px-2 text-right">{t.total}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {activeDocument.items.map((it, i) => (
                        <tr key={i}>
                          <td className="py-2 px-2 font-semibold">{it.name}</td>
                          <td className="py-2 px-2 text-center">{it.qty}</td>
                          <td className="py-2 px-2 text-right">{formatINR(it.rate)}</td>
                          <td className="py-2 px-2 text-right font-bold">{formatINR(it.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="p-3 bg-white rounded-xl border border-[#C9A04A]/30 text-right space-y-1">
                    <div className="text-base font-black text-[#101D35]">Grand Total: {formatINR(activeDocument.grandTotal)}</div>
                    {activeDocument.docType !== 'quotation' && (
                      <div className="font-bold text-rose-600">Pending Amount: {formatINR(activeDocument.remainingBalance)}</div>
                    )}
                  </div>
                </div>
              )}

              {/* Terms and Signature footer */}
              <div className="pt-4 border-t border-slate-200 flex justify-between items-end text-[10px] text-slate-500">
                <div>
                  <div className="font-bold uppercase text-slate-400">Terms &amp; Conditions</div>
                  <div className="whitespace-pre-line mt-0.5">{biz.terms || 'Payment due within 15 days.'}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-700">For {biz.name}</div>
                  <div className="h-8"></div>
                  <div className="border-t border-slate-300 pt-1 text-[9px] uppercase tracking-wider">Authorized Signatory</div>
                </div>
              </div>
            </div>

            {/* Document Action Triggers */}
            <div className="no-print flex gap-2 pt-4 border-t border-slate-200">
              <button onClick={() => window.print()} className="flex-1 py-2.5 rounded-xl bg-[#101D35] hover:bg-[#172B4D] text-white font-bold text-xs flex items-center justify-center space-x-2">
                <Icons.Print className="w-4 h-4" />
                <span>{t.downloadPDF}</span>
              </button>
              <button onClick={() => sendWhatsAppDocument(activeDocument, activeDocument.docType === 'quotation')} className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-2">
                <Icons.WhatsApp className="w-4 h-4" />
                <span>WhatsApp</span>
              </button>
              <button onClick={() => setActiveDocument(null)} className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600">
                {t.cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE ORDER */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl my-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-base">{t.newOrder}</h3>
              <button onClick={() => setShowOrderModal(false)}><Icons.Close className="w-5 h-5" /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              const custId = f.get('custId');
              const cust = customers.find(c => c.id === custId);
              if (!cust) return alert("Select customer");
              const qty = Number(f.get('qty') || 1);
              const rate = Number(f.get('rate') || 0);
              const taxPct = Number(f.get('tax') || 0);
              const subtotal = qty * rate;
              const taxAmt = (subtotal * taxPct) / 100;
              const grandTotal = subtotal + taxAmt;
              const advance = Number(f.get('advance') || 0);

              const newOrd = {
                id: 'ord_' + Date.now(),
                orderNumber: 'ORD-' + String(Date.now()).slice(-5),
                customerId: cust.id,
                customerName: cust.name,
                customerMobile: cust.mobile,
                orderDate: f.get('date'),
                items: [{ name: f.get('item'), qty, rate, taxPercent: taxPct, total: grandTotal }],
                subtotal,
                taxTotal: taxAmt,
                grandTotal,
                advancePaid: advance,
                remainingBalance: Math.max(0, grandTotal - advance),
                status: 'pending',
                template: biz.defaultTemplate
              };

              setOrders([newOrd, ...orders]);
              setCustomers(customers.map(c => c.id === cust.id ? {
                ...c,
                totalPurchases: c.totalPurchases + grandTotal,
                totalReceived: c.totalReceived + advance,
                outstandingBalance: c.outstandingBalance + (grandTotal - advance)
              } : c));
              setShowOrderModal(false);
            }} className="space-y-3">
              <div>
                <label className="text-xs font-semibold block mb-1">{t.navCustomers} *</label>
                <select name="custId" required className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white">
                  <option value="">Select customer...</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">{t.itemDescription} *</label>
                <input name="item" required placeholder="Product or service description" className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <input name="qty" type="number" defaultValue="1" min="1" placeholder="Qty" className="w-full text-xs px-2 py-2 rounded-xl border border-slate-200 text-center" />
                <input name="rate" type="number" required placeholder="Rate (₹)" className="w-full text-xs px-2 py-2 rounded-xl border border-slate-200 text-center" />
                <select name="tax" className="w-full text-xs px-2 py-2 rounded-xl border border-slate-200 bg-white text-center">
                  <option value="0">0% GST</option><option value="5">5%</option><option value="12">12%</option><option value="18">18%</option><option value="28">28%</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input name="advance" type="number" defaultValue="0" placeholder="Advance (₹)" className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200" />
                <input name="date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} required className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200" />
              </div>
              <div className="flex gap-2 pt-3">
                <button type="button" onClick={() => setShowOrderModal(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold">{t.cancel}</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-[#101D35] text-white text-xs font-bold">{t.save}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE QUOTATION */}
      {showQuotationModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl my-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-base">{t.newQuotation}</h3>
              <button onClick={() => setShowQuotationModal(false)}><Icons.Close className="w-5 h-5" /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              const custId = f.get('custId');
              let cust = customers.find(c => c.id === custId);
              if (custId === '__new__') {
                const customerName = String(f.get('newCustomerName') || '').trim();
                const customerMobile = String(f.get('newCustomerMobile') || '').trim();
                if (!customerName) return alert('Enter customer name');
                cust = { id: 'c_' + Date.now(), name: customerName, mobile: customerMobile, email: '', city: '', totalPurchases: 0, totalReceived: 0, outstandingBalance: 0 };
                setCustomers(prev => [cust, ...prev]);
              }
              if (!cust) return alert("Select or add a customer");
              const qty = Number(f.get('qty') || 1);
              const rate = Number(f.get('rate') || 0);
              const taxPct = Number(f.get('tax') || 0);
              const subtotal = qty * rate;
              const taxAmt = (subtotal * taxPct) / 100;
              const grandTotal = subtotal + taxAmt;

              const newQuote = {
                id: 'q_' + Date.now(),
                quoteNumber: 'QTE-' + String(Date.now()).slice(-5),
                customerId: cust.id,
                customerName: cust.name,
                customerMobile: cust.mobile,
                quoteDate: new Date().toISOString().slice(0, 10),
                validUntil: f.get('validUntil'),
                items: [{ name: f.get('item'), qty, rate, taxPercent: taxPct, total: grandTotal }],
                subtotal,
                taxTotal: taxAmt,
                grandTotal,
                status: 'draft',
                template: biz.defaultTemplate,
                notes: f.get('notes')
              };

              setQuotations([newQuote, ...quotations]);
              setShowQuotationModal(false);
              setQuoteNewCustomer(false);
            }} className="space-y-3">
              <div>
                <label className="text-xs font-semibold block mb-1">{t.navCustomers} *</label>
                <select name="custId" required onChange={(e) => setQuoteNewCustomer(e.target.value === '__new__')} className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white">
                  <option value="">Select customer...</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  <option value="__new__">＋ Add new customer</option>
                </select>
                {quoteNewCustomer && <div className="grid grid-cols-2 gap-2 mt-2">
                  <input name="newCustomerName" required placeholder="New customer name" className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200" />
                  <input name="newCustomerMobile" inputMode="numeric" placeholder="Mobile number" className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200" />
                </div>}
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">{t.itemDescription} *</label>
                <input name="item" required placeholder="Quotation product/service description" className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <input name="qty" type="number" defaultValue="1" min="1" placeholder="Qty" className="w-full text-xs px-2 py-2 rounded-xl border border-slate-200 text-center" />
                <input name="rate" type="number" required placeholder="Rate (₹)" className="w-full text-xs px-2 py-2 rounded-xl border border-slate-200 text-center" />
                <select name="tax" className="w-full text-xs px-2 py-2 rounded-xl border border-slate-200 bg-white text-center">
                  <option value="0">0%</option><option value="5">5%</option><option value="12">12%</option><option value="18">18%</option><option value="28">28%</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">{t.validUntil} *</label>
                <input name="validUntil" type="date" defaultValue={new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10)} required className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200" />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">Notes / Terms</label>
                <input name="notes" placeholder="Delivery time, freight terms, etc." className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200" />
              </div>
              <div className="flex gap-2 pt-3">
                <button type="button" onClick={() => setShowQuotationModal(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold">{t.cancel}</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-[#101D35] text-white text-xs font-bold">{t.save}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD CUSTOMER */}
      {showCustomerModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-base">{t.addCustomer}</h3>
              <button onClick={() => setShowCustomerModal(false)}><Icons.Close className="w-5 h-5" /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              const newCust = {
                id: 'c_' + Date.now(),
                name: f.get('name'),
                mobile: f.get('mobile'),
                email: f.get('email') || '',
                city: f.get('city') || '',
                totalPurchases: 0,
                totalReceived: 0,
                outstandingBalance: 0
              };
              setCustomers([newCust, ...customers]);
              setShowCustomerModal(false);
            }} className="space-y-3">
              <input name="name" required placeholder="Customer / Firm Name *" className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-200" />
              <input name="mobile" required placeholder="Mobile / WhatsApp (10 digits) *" className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-200" />
              <input name="email" placeholder="Email Address (Optional)" className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-200" />
              <input name="city" placeholder="City / Market Area" className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-200" />
              <div className="flex gap-2 pt-3">
                <button type="button" onClick={() => setShowCustomerModal(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold">{t.cancel}</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-[#101D35] text-white text-xs font-bold">{t.save}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RECORD PAYMENT */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-base">{t.recordPayment}</h3>
              <button onClick={() => setShowPaymentModal(false)}><Icons.Close className="w-5 h-5" /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              const cust = customers.find(c => c.id === f.get('custId'));
              if (!cust) return alert("Select customer");
              const amt = Number(f.get('amount'));

              const payment = {
                id: 'pay_' + Date.now(),
                receiptNumber: 'REC-' + String(Date.now()).slice(-4),
                customerId: cust.id,
                customerName: cust.name,
                amount: amt,
                method: f.get('method'),
                date: f.get('date')
              };

              setPayments([payment, ...payments]);
              setCustomers(customers.map(c => c.id === cust.id ? {
                ...c,
                totalReceived: c.totalReceived + amt,
                outstandingBalance: Math.max(0, c.outstandingBalance - amt)
              } : c));
              setShowPaymentModal(false);
            }} className="space-y-3">
              <select name="custId" required className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white">
                <option value="">Select customer...</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name} (Due: {formatINR(c.outstandingBalance)})</option>)}
              </select>
              <div className="grid grid-cols-2 gap-2">
                <input name="amount" type="number" required placeholder="Amount (₹)" className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200" />
                <input name="date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} required className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200" />
              </div>
              <select name="method" className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white">
                <option value="bank_transfer">Bank Transfer (NEFT/IMPS)</option>
                <option value="upi">UPI QR Settlement</option>
                <option value="cash">Cash in Hand</option>
              </select>
              <div className="flex gap-2 pt-3">
                <button type="button" onClick={() => setShowPaymentModal(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold">{t.cancel}</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-[#101D35] text-white text-xs font-bold">{t.save}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RECORD EXPENSE */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-base">{t.addExpense}</h3>
              <button onClick={() => setShowExpenseModal(false)}><Icons.Close className="w-5 h-5" /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              const exp = {
                id: 'exp_' + Date.now(),
                title: f.get('title'),
                category: f.get('category'),
                amount: Number(f.get('amount')),
                date: f.get('date')
              };
              setExpenses([exp, ...expenses]);
              setShowExpenseModal(false);
            }} className="space-y-3">
              <input name="title" required placeholder="Expense Description" className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-200" />
              <div className="grid grid-cols-2 gap-2">
                <select name="category" className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white">
                  <option value="Material">Material</option><option value="Rent">Rent</option><option value="Labour">Labour</option>
                  <option value="Electricity">Electricity</option><option value="Transport">Transport</option>
                </select>
                <input name="amount" type="number" required placeholder="Amount (₹)" className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200" />
              </div>
              <input name="date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} required className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200" />
              <div className="flex gap-2 pt-3">
                <button type="button" onClick={() => setShowExpenseModal(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold">{t.cancel}</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-[#101D35] text-white text-xs font-bold">{t.save}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RokdoApp />
  </React.StrictMode>
);
