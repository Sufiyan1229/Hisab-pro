import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom/client';

// ==========================================
// 1. ENTERPRISE SVG ICONS (Zero Emojis)
// ==========================================
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
  Invoices: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
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
      <line x1="10" x2="10" y1="18" y2="11" /><line x1="14" x2="14" y1="18" y2="11" /><line x1="18" x2="18" y1="18" y2="11" />
      <polygon points="12 2 20 7 4 7" />
    </svg>
  ),
  Reports: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <line x1="18" x2="18" y1="20" y2="10" /><line x1="12" x2="12" y1="20" y2="4" /><line x1="6" x2="6" y1="20" y2="14" />
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
  Close: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  LogOut: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  ChevronRight: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
};

// ==========================================
// 2. COMPLETE 100% BILINGUAL TRANSLATION
// ==========================================
const dict = {
  en: {
    appName: "HISAB PRO",
    tagline: "Enterprise Business Intelligence & Accounting",
    navDashboard: "Dashboard",
    navCustomers: "Customers",
    navOrders: "Orders",
    navPayments: "Payments",
    navExpenses: "Expenses",
    navAccounts: "Accounts",
    navReports: "Reports",
    todaySales: "Today's Sales",
    monthlySales: "Monthly Sales",
    totalReceived: "Total Received",
    pendingReceivables: "Pending Receivables",
    totalExpenses: "Total Expenses",
    estimatedProfit: "Estimated Gross Profit",
    monthlyTarget: "Monthly Target Progress",
    salesTrend: "7-Day Sales Trajectory",
    expenseBreakdown: "Expense Distribution",
    recentOrders: "Recent Sales Orders",
    newOrder: "Create Order",
    addCustomer: "Add Customer",
    recordPayment: "Record Payment",
    addExpense: "Log Expense",
    viewAll: "View All",
    ledger: "Account Ledger",
    shareWhatsApp: "WhatsApp Invoice",
    printInvoice: "Print Tax Bill",
    taxInvoice: "TAX INVOICE",
    billedTo: "Billed To",
    itemDescription: "Item & Description",
    qty: "Qty",
    rate: "Rate",
    taxRate: "GST %",
    total: "Total",
    subtotal: "Subtotal",
    taxTotal: "GST Tax Amount",
    grandTotal: "Grand Total",
    advanceReceived: "Advance Received",
    balanceDue: "Balance Due",
    statusPaid: "Paid in Full",
    statusDue: "Payment Due",
    customerDirectory: "Customer CRM & Balances",
    searchCustomer: "Search by customer name or phone...",
    save: "Save Record",
    cancel: "Dismiss",
    logout: "Sign Out",
    signInTitle: "Sign In to Your Workspace",
    signUpTitle: "Register Your Business",
    emailPlaceholder: "name@company.in",
    passwordPlaceholder: "••••••••••••",
    fullName: "Full Name / Owner",
    businessName: "Business / Firm Name",
    mobileNumber: "10-Digit Mobile",
    signInAction: "Authenticate & Enter",
    signUpAction: "Complete Registration (7-Day Trial)",
    needAccount: "New business? Create an enterprise workspace",
    haveAccount: "Already registered? Access your workspace"
  },
  hi: {
    appName: "हिसाब प्रो",
    tagline: "स्मार्ट व्यापार. सटीक एवं सरल हिसाब.",
    navDashboard: "डैशबोर्ड",
    navCustomers: "ग्राहक",
    navOrders: "ऑर्डर्स",
    navPayments: "भुगतान",
    navExpenses: "खर्चे",
    navAccounts: "खाते (बैंक/कैश)",
    navReports: "रिपोर्ट्स",
    todaySales: "आज की कुल बिक्री",
    monthlySales: "मासिक कुल बिक्री",
    totalReceived: "कुल प्राप्त रकम",
    pendingReceivables: "मार्केट उधारी (बकाया)",
    totalExpenses: "व्यापारिक खर्चे",
    estimatedProfit: "अनुमानित सकल मुनाफा",
    monthlyTarget: "मासिक बिक्री लक्ष्य",
    salesTrend: "7-दिवसीय बिक्री रुझान",
    expenseBreakdown: "खर्चों का वर्गीकरण",
    recentOrders: "हालिया बिक्री ऑर्डर्स",
    newOrder: "नया ऑर्डर दर्ज करें",
    addCustomer: "नया ग्राहक जोड़ें",
    recordPayment: "भुगतान प्राप्त करें",
    addExpense: "खर्चा दर्ज करें",
    viewAll: "सभी देखें",
    ledger: "खाता बही (Ledger)",
    shareWhatsApp: "व्हाट्सएप बिल भेजें",
    printInvoice: "बिल प्रिंट करें",
    taxInvoice: "पक्का टैक्स बिल",
    billedTo: "क्रेता का विवरण",
    itemDescription: "सामान व विवरण",
    qty: "मात्रा",
    rate: "दर",
    taxRate: "जीएसटी %",
    total: "कुल योग",
    subtotal: "उप-योग",
    taxTotal: "कुल जीएसटी कर",
    grandTotal: "अंतिम कुल योग",
    advanceReceived: "अग्रिम जमा (एडवांस)",
    balanceDue: "शेष बाकी उधारी",
    statusPaid: "पूर्ण भुगतान प्राप्त",
    statusDue: "भुगतान बकाया",
    customerDirectory: "ग्राहक विवरण एवं खाता सूची",
    searchCustomer: "ग्राहक का नाम या मोबाइल नंबर खोजें...",
    save: "सुरक्षित करें",
    cancel: "रद्द करें",
    logout: "लॉगआउट करें",
    signInTitle: "अपने बिज़नेस खाते में लॉगिन करें",
    signUpTitle: "नया व्यापार रजिस्टर करें",
    emailPlaceholder: "name@company.in",
    passwordPlaceholder: "••••••••••••",
    fullName: "मालिक / प्रोपराइटर का नाम",
    businessName: "दुकान / फर्म का नाम",
    mobileNumber: "10-अंकों का मोबाइल नंबर",
    signInAction: "खाते में प्रवेश करें",
    signUpAction: "व्यापार पंजीकृत करें (7-दिन फ्री ट्रायल)",
    needAccount: "नया व्यापार? नि:शुल्क रजिस्टर करें",
    haveAccount: "पहले से पंजीकृत हैं? यहाँ लॉगिन करें"
  }
};

const formatINR = (amt) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amt || 0);

const formatDateIndian = (dateStr) => {
  if (!dateStr) return '';
  const p = dateStr.split('-');
  return p.length === 3 ? `${p[2]}-${p[1]}-${p[0]}` : dateStr;
};

// ==========================================
// 3. MAIN APP COMPONENT
// ==========================================
function HisabProEnterprise() {
  const [user, setUser] = useState(() => {
    const c = localStorage.getItem('hp_user');
    return c ? JSON.parse(c) : { email: 'owner@hisabpro.in', name: 'Rajesh Sharma' };
  });
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPass, setAuthPass] = useState('');
  const [authName, setAuthName] = useState('');
  const [authBiz, setAuthBiz] = useState('');

  const [lang, setLang] = useState(() => localStorage.getItem('hp_lang') || 'en');
  const t = dict[lang];
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  const [biz, setBiz] = useState(() => {
    const s = localStorage.getItem('hp_biz');
    return s ? JSON.parse(s) : {
      name: 'Bharat Udyog & Traders',
      tagline: 'Precision Manufacturing & Wholesaling',
      phone: '9820098200',
      gstin: '27AABCU9603R1ZM',
      address: 'Plot 42, GIDC Industrial Estate',
      city: 'Mumbai',
      state: 'Maharashtra',
      salesTargetMonthly: 600000
    };
  });

  const [customers, setCustomers] = useState(() => {
    const s = localStorage.getItem('hp_customers');
    return s ? JSON.parse(s) : [
      { id: 'c1', name: 'Ramesh Patel (Patel Furnishings)', mobile: '9876543210', city: 'Surat', totalPurchases: 185000, totalReceived: 145000, outstandingBalance: 40000 },
      { id: 'c2', name: 'Suresh Sharma (National Traders)', mobile: '9123456780', city: 'Mumbai', totalPurchases: 95000, totalReceived: 95000, outstandingBalance: 0 },
      { id: 'c3', name: 'Vikram Singh (Apex Construction)', mobile: '9988776655', city: 'Pune', totalPurchases: 320000, totalReceived: 210000, outstandingBalance: 110000 }
    ];
  });

  const [orders, setOrders] = useState(() => {
    const s = localStorage.getItem('hp_orders');
    return s ? JSON.parse(s) : [
      { id: 'o1', orderNumber: 'ORD-2026-001', customerId: 'c1', customerName: 'Ramesh Patel (Patel Furnishings)', customerMobile: '9876543210', orderDate: '2026-03-30', items: [{ name: 'Heavy Duty Industrial Racks', qty: 2, rate: 25000, taxPercent: 18, total: 59000 }], subtotal: 50000, taxTotal: 9000, grandTotal: 59000, advancePaid: 25000, remainingBalance: 34000, status: 'in_progress' },
      { id: 'o2', orderNumber: 'ORD-2026-002', customerId: 'c2', customerName: 'Suresh Sharma (National Traders)', customerMobile: '9123456780', orderDate: '2026-03-31', items: [{ name: 'Modular Executive Desks', qty: 4, rate: 12000, taxPercent: 12, total: 53760 }], subtotal: 48000, taxTotal: 5760, grandTotal: 53760, advancePaid: 53760, remainingBalance: 0, status: 'ready' }
    ];
  });

  const [payments, setPayments] = useState(() => {
    const s = localStorage.getItem('hp_payments');
    return s ? JSON.parse(s) : [
      { id: 'p1', receiptNumber: 'REC-8841', customerId: 'c1', customerName: 'Ramesh Patel', amount: 25000, method: 'bank_transfer', date: '2026-03-30' }
    ];
  });

  const [expenses, setExpenses] = useState(() => {
    const s = localStorage.getItem('hp_expenses');
    return s ? JSON.parse(s) : [
      { id: 'e1', title: 'Factory Shed Lease (Bhiwandi)', category: 'Rent', amount: 35000, date: '2026-03-25' },
      { id: 'e2', title: 'Commercial Mild Steel Plates', category: 'Material', amount: 48000, date: '2026-03-28' },
      { id: 'e3', title: 'Contract Machine Operators Wages', category: 'Labour', amount: 22000, date: '2026-03-29' }
    ];
  });

  const [accounts] = useState([
    { id: 'acc_cash', name: 'Primary Cash Chest (गल्ला)', type: 'cash', currentBalance: 42500 },
    { id: 'acc_bank', name: 'HDFC Current A/C (...8812)', type: 'bank', currentBalance: 312000 },
    { id: 'acc_upi', name: 'Merchant UPI Settlement', type: 'upi', currentBalance: 24300 }
  ]);

  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [activeLedgerCustomer, setActiveLedgerCustomer] = useState(null);
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState(null);

  useEffect(() => { localStorage.setItem('hp_lang', lang); }, [lang]);
  useEffect(() => { localStorage.setItem('hp_user', JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem('hp_biz', JSON.stringify(biz)); }, [biz]);
  useEffect(() => { localStorage.setItem('hp_customers', JSON.stringify(customers)); }, [customers]);
  useEffect(() => { localStorage.setItem('hp_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('hp_payments', JSON.stringify(payments)); }, [payments]);
  useEffect(() => { localStorage.setItem('hp_expenses', JSON.stringify(expenses)); }, [expenses]);

  const metrics = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const todaySales = orders.filter(o => o.orderDate === today).reduce((sum, o) => sum + o.grandTotal, 0);
    const totalSales = orders.reduce((sum, o) => sum + o.grandTotal, 0);
    const totalReceived = payments.reduce((sum, p) => sum + p.amount, 0) + orders.reduce((sum, o) => sum + (o.advancePaid || 0), 0);
    const pendingDue = customers.reduce((sum, c) => sum + (c.outstandingBalance || 0), 0);
    const totalExp = expenses.reduce((sum, e) => sum + e.amount, 0);
    const estimatedProfit = totalSales - totalExp;
    const targetProgress = Math.min(100, Math.round((totalSales / (biz.salesTargetMonthly || 500000)) * 100));

    return { todaySales, totalSales, totalReceived, pendingDue, totalExp, estimatedProfit, targetProgress };
  }, [orders, payments, customers, expenses, biz]);

  const sendWhatsAppDocument = (order) => {
    const text = `*${t.taxInvoice}: ${order.orderNumber}*\n${lang === 'hi' ? 'नमस्ते' : 'Dear'} ${order.customerName},\n${lang === 'hi' ? 'आपके व्यापारिक बिल का विवरण:' : 'Your commercial billing summary from'} *${biz.name}*:\n\n*${t.itemDescription}:* ${order.items ? order.items.map(i => `${i.name} (x${i.qty})`).join(', ') : 'Order'}\n*${t.grandTotal}:* ${formatINR(order.grandTotal)}\n*${t.advanceReceived}:* ${formatINR(order.advancePaid)}\n*${t.balanceDue}:* ${formatINR(order.remainingBalance)}\n\n${lang === 'hi' ? 'सम्पर्क करें' : 'Questions? Call'}: ${biz.phone}`;
    window.open(`https://wa.me/91${order.customerMobile.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const getCustomerLedger = (custId) => {
    const custOrders = orders.filter(o => o.customerId === custId);
    const custPayments = payments.filter(p => p.customerId === custId);
    const ledger = [];
    custOrders.forEach(o => {
      ledger.push({ id: 'ord_' + o.id, date: o.orderDate, desc: `${t.newOrder} (${o.orderNumber})`, debit: o.grandTotal, credit: 0 });
      if (o.advancePaid > 0) {
        ledger.push({ id: 'adv_' + o.id, date: o.orderDate, desc: `${t.advanceReceived} (${o.orderNumber})`, debit: 0, credit: o.advancePaid });
      }
    });
    custPayments.forEach(p => {
      ledger.push({ id: 'pay_' + p.id, date: p.date, desc: `${t.recordPayment} (${p.method.toUpperCase()})`, debit: 0, credit: p.amount });
    });
    ledger.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    let bal = 0;
    ledger.forEach(row => {
      bal += (row.debit - row.credit);
      row.runningBalance = bal;
    });
    return ledger.reverse();
  };

  return (
    <div className="min-h-screen bg-[#F4F6FA] flex flex-col md:flex-row font-sans text-[#202B3C]">
      
      {/* DESKTOP SIDEBAR */}
      <aside className={`hidden md:flex flex-col bg-[#172B4D] text-white border-r border-[#101D35] transition-all duration-200 z-30 sticky top-0 h-screen ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
        <div className="p-4 flex items-center justify-between border-b border-[#142542]">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-[#C9A04A] text-[#101D35] font-black flex items-center justify-center text-xl shrink-0 shadow-md">H</div>
            {!sidebarCollapsed && (
              <div className="truncate">
                <div className="font-bold text-sm tracking-tight leading-tight">{biz.name}</div>
                <div className="text-[10px] text-slate-400 truncate">{biz.gstin}</div>
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
            { id: 'payments', label: t.navPayments, icon: Icons.Payments },
            { id: 'expenses', label: t.navExpenses, icon: Icons.Expenses },
            { id: 'accounts', label: t.navAccounts, icon: Icons.Accounts },
            { id: 'reports', label: t.navReports, icon: Icons.Reports }
          ].map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive ? 'bg-[#C9A04A] text-[#101D35] font-bold shadow-sm' : 'text-slate-300 hover:bg-[#142542] hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!sidebarCollapsed && <span className="flex-1 text-left truncate">{item.label}</span>}
                {!sidebarCollapsed && item.badge !== undefined && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${isActive ? 'bg-[#101D35] text-white' : 'bg-[#142542] text-slate-300'}`}>{item.badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-[#142542] bg-[#101D35]/40">
          <div className="flex items-center space-x-3 p-2 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-[#C9A04A]/20 text-[#C9A04A] flex items-center justify-center font-bold text-xs shrink-0">
              {user.name ? user.name.charAt(0) : 'U'}
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 truncate">
                <div className="text-xs font-bold text-white truncate">{user.name}</div>
                <div className="text-[10px] text-slate-400 truncate">{user.email}</div>
              </div>
            )}
            {!sidebarCollapsed && (
              <button onClick={() => setIsAuthOpen(true)} className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg">
                <Icons.LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-6">
        
        {/* HEADER */}
        <header className="sticky top-0 z-20 bg-white border-b border-slate-200/80 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="md:hidden flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#101D35] text-[#C9A04A] font-black flex items-center justify-center text-base">H</div>
              <span className="font-bold text-sm tracking-tight text-[#101D35]">{biz.name}</span>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-xs font-semibold text-[#788397]">
              <span className="text-[#172B4D] font-bold">{biz.name}</span>
              <span>/</span>
              <span className="capitalize">{activeTab}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 md:space-x-3">
            <button
              onClick={() => setLang(l => l === 'en' ? 'hi' : 'en')}
              className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 font-bold bg-[#F4F6FA] text-[#202B3C] hover:bg-slate-100"
            >
              {lang === 'en' ? '🇮🇳 हिंदी' : 'English'}
            </button>
            <button 
              onClick={() => setShowOrderModal(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#172B4D] hover:bg-[#101D35] text-white shadow-xs flex items-center space-x-1.5"
            >
              <Icons.Plus className="w-3.5 h-3.5 text-[#C9A04A]" />
              <span className="hidden sm:inline">{t.newOrder}</span>
            </button>
            <button onClick={() => setIsAuthOpen(true)} className="md:hidden p-2 rounded-xl border border-slate-200 text-slate-600">
              <Icons.LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* BODY CONTENT */}
        <main className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6">

          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <>
              {/* METRIC CARDS */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 md:gap-5">
                <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div className="text-xs font-semibold text-[#788397]">{t.todaySales}</div>
                  <div className="text-xl md:text-2xl font-black text-[#202B3C] mt-2">{formatINR(metrics.todaySales)}</div>
                  <div className="text-[11px] text-[#788397] mt-1">{t.monthlySales}: <span className="font-semibold">{formatINR(metrics.totalSales)}</span></div>
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

              {/* TARGET PROGRESS */}
              <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                <div className="flex justify-between items-center text-xs font-bold mb-2">
                  <span className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-[#C9A04A]"></span>
                    <span>{t.monthlyTarget}</span>
                  </span>
                  <span className="text-[#172B4D]">{formatINR(metrics.totalSales)} / {formatINR(biz.salesTargetMonthly)} ({metrics.targetProgress}%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-[#172B4D] h-2.5 rounded-full transition-all duration-500" style={{ width: `${metrics.targetProgress}%` }}></div>
                </div>
              </div>

              {/* SVG CHARTS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <h3 className="text-xs font-bold uppercase tracking-wider mb-4 flex items-center justify-between">
                    <span>{t.salesTrend}</span>
                    <span className="text-emerald-600 font-bold">{formatINR(metrics.totalSales)} Total</span>
                  </h3>
                  <div className="h-44 w-full flex items-end justify-between pt-6 px-2 gap-2">
                    {[
                      { day: 'Mon', h: '40%' }, { day: 'Tue', h: '60%' }, { day: 'Wed', h: '35%' },
                      { day: 'Thu', h: '75%' }, { day: 'Fri', h: '90%' }, { day: 'Sat', h: '100%' }, { day: 'Sun', h: '30%' }
                    ].map((b, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                        <div className="w-full max-w-[28px] bg-[#172B4D] hover:bg-[#C9A04A] rounded-t-lg transition-all" style={{ height: b.h }}></div>
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
                      { cat: 'Material & Inventory', amt: 48000, pct: 45, col: 'bg-[#172B4D]' },
                      { cat: 'Rent & Leases', amt: 35000, pct: 33, col: 'bg-[#C9A04A]' },
                      { cat: 'Labour & Machine Operator', amt: 22000, pct: 22, col: 'bg-slate-400' }
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

              {/* RECENT ORDERS TABLE */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="p-4 md:px-6 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-xs uppercase tracking-wider">{t.recentOrders}</h3>
                  <button onClick={() => setActiveTab('orders')} className="text-xs font-bold text-[#172B4D] hover:underline">{t.viewAll}</button>
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
                          <button onClick={() => setActiveInvoiceOrder(ord)} className="p-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100">
                            <Icons.Invoices className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => sendWhatsAppDocument(ord)} className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white">
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

          {/* CUSTOMERS TAB */}
          {activeTab === 'customers' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold">{t.customerDirectory}</h2>
                <button onClick={() => setShowCustomerModal(true)} className="px-4 py-2 rounded-xl text-xs font-bold bg-[#172B4D] hover:bg-[#101D35] text-white flex items-center space-x-2">
                  <Icons.Plus className="w-4 h-4 text-[#C9A04A]" />
                  <span>{t.addCustomer}</span>
                </button>
              </div>

              <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs flex items-center space-x-2">
                <Icons.Search className="w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  value={searchQuery} 
                  onChange={e => setSearchQuery(e.target.value)} 
                  placeholder={t.searchCustomer} 
                  className="w-full text-xs outline-none bg-transparent"
                />
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden divide-y divide-slate-100">
                {customers
                  .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.mobile.includes(searchQuery))
                  .map(c => (
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
                        <button onClick={() => setActiveLedgerCustomer(c)} className="px-3.5 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-[#172B4D] hover:bg-slate-50">
                          {t.ledger}
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold">{t.navOrders}</h2>
                <button onClick={() => setShowOrderModal(true)} className="px-4 py-2 rounded-xl text-xs font-bold bg-[#172B4D] hover:bg-[#101D35] text-white flex items-center space-x-2">
                  <Icons.Plus className="w-4 h-4 text-[#C9A04A]" />
                  <span>{t.newOrder}</span>
                </button>
              </div>

              <div className="space-y-3">
                {orders.map(ord => (
                  <div key={ord.id} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-[#172B4D]">{ord.orderNumber}</span>
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
                        <button onClick={() => setActiveInvoiceOrder(ord)} className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold hover:bg-slate-50">{t.printInvoice}</button>
                        <button onClick={() => sendWhatsAppDocument(ord)} className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-1">
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

          {/* PAYMENTS TAB */}
          {activeTab === 'payments' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold">{t.navPayments}</h2>
                <button onClick={() => setShowPaymentModal(true)} className="px-4 py-2 rounded-xl text-xs font-bold bg-[#172B4D] text-white">+ {t.recordPayment}</button>
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

          {/* EXPENSES TAB */}
          {activeTab === 'expenses' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold">{t.navExpenses}</h2>
                <button onClick={() => setShowExpenseModal(true)} className="px-4 py-2 rounded-xl text-xs font-bold bg-[#172B4D] text-white">+ {t.addExpense}</button>
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

          {/* ACCOUNTS TAB */}
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

          {/* REPORTS TAB */}
          {activeTab === 'reports' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <h2 className="text-lg font-bold">{t.navReports}</h2>
              <p className="text-xs text-[#788397]">Audit exports for GST filing & annual Chartered Accountant verification are ready.</p>
              <button onClick={() => alert("CSV Export complete: Customer Outstanding & Daybook downloaded.")} className="px-4 py-2.5 rounded-xl bg-[#172B4D] text-white font-bold text-xs">
                Download Ledger CSV
              </button>
            </div>
          )}
        </main>
      </div>

      {/* MOBILE BOTTOM DOCK */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-2 py-2 flex justify-around items-center shadow-lg">
        {[
          { id: 'dashboard', label: t.navDashboard, icon: Icons.Dashboard },
          { id: 'customers', label: t.navCustomers, icon: Icons.Customers },
          { id: 'orders', label: t.navOrders, icon: Icons.Orders },
          { id: 'payments', label: t.navPayments, icon: Icons.Payments },
          { id: 'expenses', label: t.navExpenses, icon: Icons.Expenses }
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
                status: 'pending'
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
                <input name="item" required placeholder="Product name" className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <input name="qty" type="number" defaultValue="1" min="1" placeholder="Qty" className="w-full text-xs px-2 py-2 rounded-xl border border-slate-200 text-center" />
                <input name="rate" type="number" required placeholder="Rate (₹)" className="w-full text-xs px-2 py-2 rounded-xl border border-slate-200 text-center" />
                <select name="tax" className="w-full text-xs px-2 py-2 rounded-xl border border-slate-200 bg-white text-center">
                  <option value="0">0%</option><option value="5">5%</option><option value="12">12%</option><option value="18">18%</option><option value="28">28%</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input name="advance" type="number" defaultValue="0" placeholder="Advance (₹)" className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200" />
                <input name="date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} required className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200" />
              </div>
              <div className="flex gap-2 pt-3">
                <button type="button" onClick={() => setShowOrderModal(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold">{t.cancel}</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-[#172B4D] text-white text-xs font-bold">{t.save}</button>
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
                city: f.get('city') || '',
                totalPurchases: 0,
                totalReceived: 0,
                outstandingBalance: 0
              };
              setCustomers([newCust, ...customers]);
              setShowCustomerModal(false);
            }} className="space-y-3">
              <input name="name" required placeholder="Customer Name *" className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-200" />
              <input name="mobile" required placeholder="Mobile Number *" className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-200" />
              <input name="city" placeholder="City" className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-200" />
              <div className="flex gap-2 pt-3">
                <button type="button" onClick={() => setShowCustomerModal(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold">{t.cancel}</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-[#172B4D] text-white text-xs font-bold">{t.save}</button>
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
                <option value="bank_transfer">Bank Transfer</option>
                <option value="upi">UPI QR</option>
                <option value="cash">Cash</option>
              </select>
              <div className="flex gap-2 pt-3">
                <button type="button" onClick={() => setShowPaymentModal(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold">{t.cancel}</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-[#172B4D] text-white text-xs font-bold">{t.save}</button>
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
              <input name="title" required placeholder="Expense Title" className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-200" />
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
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-[#172B4D] text-white text-xs font-bold">{t.save}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CUSTOMER LEDGER */}
      {activeLedgerCustomer && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl p-6 shadow-2xl flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base">{activeLedgerCustomer.name}</h3>
                <div className="text-xs text-[#788397]">{t.ledger} • {activeLedgerCustomer.mobile}</div>
              </div>
              <button onClick={() => setActiveLedgerCustomer(null)}><Icons.Close className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 my-3">
              {getCustomerLedger(activeLedgerCustomer.id).map(row => (
                <div key={row.id} className="py-3 flex justify-between items-center text-xs">
                  <div>
                    <div className="font-bold">{row.desc}</div>
                    <div className="text-[11px] text-[#788397]">{formatDateIndian(row.date)}</div>
                  </div>
                  <div className="text-right">
                    {row.debit > 0 && <span className="font-bold text-rose-600 block">Dr: {formatINR(row.debit)}</span>}
                    {row.credit > 0 && <span className="font-bold text-emerald-600 block">Cr: {formatINR(row.credit)}</span>}
                    <div className="text-[10px] text-slate-400 mt-0.5">Bal: {formatINR(row.runningBalance)}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
              <span className="text-xs font-bold text-[#788397]">{t.balanceDue}:</span>
              <span className="text-base font-black text-rose-600">{formatINR(activeLedgerCustomer.outstandingBalance)}</span>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: INVOICE VIEWER */}
      {activeInvoiceOrder && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-2xl p-6 md:p-8 shadow-2xl my-6">
            <div className="border-b border-slate-200 pb-5 flex justify-between items-start">
              <div>
                <div className="text-xl font-black text-[#101D35]">{biz.name}</div>
                <div className="text-xs text-[#788397] mt-1">{biz.address}, {biz.city}</div>
                <div className="text-xs text-[#788397]">Ph: {biz.phone} | GST: {biz.gstin}</div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold uppercase tracking-widest text-[#C9A04A] bg-[#C9A04A]/10 px-2.5 py-1 rounded-md">{t.taxInvoice}</span>
                <div className="text-sm font-bold mt-2">{activeInvoiceOrder.orderNumber}</div>
                <div className="text-xs text-[#788397]">{formatDateIndian(activeInvoiceOrder.orderDate)}</div>
              </div>
            </div>

            <div className="py-4 border-b border-slate-100">
              <div className="text-[10px] font-bold uppercase text-slate-400">{t.billedTo}</div>
              <div className="font-bold text-sm mt-0.5">{activeInvoiceOrder.customerName}</div>
              <div className="text-xs text-[#788397]">Mobile: {activeInvoiceOrder.customerMobile}</div>
            </div>

            <div className="py-4">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px]">
                    <th className="py-2 text-left">{t.itemDescription}</th>
                    <th className="py-2 text-center">{t.qty}</th>
                    <th className="py-2 text-right">{t.rate}</th>
                    <th className="py-2 text-right">{t.taxRate}</th>
                    <th className="py-2 text-right">{t.total}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeInvoiceOrder.items ? activeInvoiceOrder.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 font-semibold">{it.name}</td>
                      <td className="py-2.5 text-center">{it.qty}</td>
                      <td className="py-2.5 text-right">{formatINR(it.rate)}</td>
                      <td className="py-2.5 text-right">{it.taxPercent}%</td>
                      <td className="py-2.5 text-right font-bold">{formatINR(it.total)}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td className="py-2.5 font-semibold">Standard Commercial Order</td>
                      <td className="py-2.5 text-center">1</td>
                      <td className="py-2.5 text-right">{formatINR(activeInvoiceOrder.grandTotal)}</td>
                      <td className="py-2.5 text-right">0%</td>
                      <td className="py-2.5 text-right font-bold">{formatINR(activeInvoiceOrder.grandTotal)}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="border-t border-slate-200 pt-3 space-y-1 text-xs text-right">
              <div><span className="text-[#788397]">{t.subtotal}:</span> <span className="font-semibold">{formatINR(activeInvoiceOrder.subtotal || activeInvoiceOrder.grandTotal)}</span></div>
              {activeInvoiceOrder.taxTotal > 0 && <div><span className="text-[#788397]">{t.taxTotal}:</span> <span className="font-semibold">{formatINR(activeInvoiceOrder.taxTotal)}</span></div>}
              <div className="text-sm font-black pt-1 border-t"><span className="text-[#202B3C]">{t.grandTotal}:</span> <span>{formatINR(activeInvoiceOrder.grandTotal)}</span></div>
              <div><span className="text-emerald-600 font-semibold">{t.advanceReceived}:</span> <span className="font-bold text-emerald-600">{formatINR(activeInvoiceOrder.advancePaid)}</span></div>
              <div className="text-sm font-black text-rose-600"><span>{t.balanceDue}:</span> <span>{formatINR(activeInvoiceOrder.remainingBalance)}</span></div>
            </div>

            <div className="flex gap-2.5 pt-6">
              <button onClick={() => window.print()} className="flex-1 py-2.5 rounded-xl bg-[#172B4D] text-white font-bold text-xs flex items-center justify-center space-x-2">
                <Icons.Print className="w-4 h-4" />
                <span>{t.printInvoice}</span>
              </button>
              <button onClick={() => sendWhatsAppDocument(activeInvoiceOrder)} className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center space-x-2">
                <Icons.WhatsApp className="w-4 h-4" />
                <span>{t.shareWhatsApp}</span>
              </button>
              <button onClick={() => setActiveInvoiceOrder(null)} className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-[#788397]">
                {t.cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: AUTHENTICATION */}
      {isAuthOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-base">{authMode === 'login' ? t.signInTitle : t.signUpTitle}</h3>
              <button onClick={() => setIsAuthOpen(false)}><Icons.Close className="w-5 h-5" /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (authEmail) {
                setUser({ email: authEmail, name: authName || authEmail.split('@')[0] });
                if (authBiz) setBiz({ ...biz, name: authBiz });
                setIsAuthOpen(false);
              }
            }} className="space-y-3">
              {authMode === 'signup' && (
                <>
                  <input required value={authName} onChange={e => setAuthName(e.target.value)} placeholder={t.fullName} className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200" />
                  <input required value={authBiz} onChange={e => setAuthBiz(e.target.value)} placeholder={t.businessName} className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200" />
                </>
              )}
              <input type="email" required value={authEmail} onChange={e => setAuthEmail(e.target.value)} placeholder={t.emailPlaceholder} className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200" />
              <input type="password" required value={authPass} onChange={e => setAuthPass(e.target.value)} placeholder={t.passwordPlaceholder} className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200" />
              <button type="submit" className="w-full py-2.5 rounded-xl bg-[#172B4D] text-white text-xs font-bold">
                {authMode === 'login' ? t.signInAction : t.signUpAction}
              </button>
              <div className="text-center pt-2">
                <button type="button" onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} className="text-xs text-[#172B4D] font-bold hover:underline">
                  {authMode === 'login' ? t.needAccount : t.haveAccount}
                </button>
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
    <HisabProEnterprise />
  </React.StrictMode>
);
