import React, { useState, useEffect, useMemo, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  onAuthStateChanged, 
  signOut 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  deleteDoc 
} from 'firebase/firestore';

// ============================================================================
// 1. FIREBASE CONFIGURATION
// ============================================================================
const firebaseConfig = {
  apiKey: "AIzaSyBzO-YnTPbihJ8yeFCoZJiYYcQZiPmHZfY",
  authDomain: "hisab-pro-9ec11.firebaseapp.com",
  projectId: "hisab-pro-9ec11",
  storageBucket: "hisab-pro-9ec11.firebasestorage.app",
  messagingSenderId: "154476783962",
  appId: "1:154476783962:web:b2de91981ab5cff45eeb63",
  measurementId: "G-3EVYR17DZM"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

// ============================================================================
// 2. FIRESTORE DATABASE & ACCOUNTING ENGINE
// ============================================================================
const formatINR = (amt) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amt || 0);

const formatDateIndian = (d) => {
  if (!d) return '';
  const p = d.split('-');
  return p.length === 3 ? `${p[2]}-${p[1]}-${p[0]}` : d;
};

const DB = {
  key(bId, coll) { return `rokdo_${bId}_${coll}`; },

  async getUser(uid) {
    try {
      const snap = await getDoc(doc(db, 'users', uid));
      if (snap.exists()) return snap.data();
    } catch (e) {}
    const l = localStorage.getItem(`rokdo_u_${uid}`);
    return l ? JSON.parse(l) : null;
  },

  async saveUser(uid, data) {
    const payload = { ...data, updatedAt: new Date().toISOString() };
    try { await setDoc(doc(db, 'users', uid), payload, { merge: true }); } catch (e) {}
    localStorage.setItem(`rokdo_u_${uid}`, JSON.stringify(payload));
  },

  async getBiz(bId) {
    try {
      const snap = await getDoc(doc(db, 'businesses', bId));
      if (snap.exists()) return snap.data();
    } catch (e) {}
    const l = localStorage.getItem(`rokdo_b_${bId}`);
    return l ? JSON.parse(l) : null;
  },

  async saveBiz(bId, data) {
    const payload = { ...data, businessId: bId, updatedAt: new Date().toISOString() };
    try { await setDoc(doc(db, 'businesses', bId), payload, { merge: true }); } catch (e) {}
    localStorage.setItem(`rokdo_b_${bId}`, JSON.stringify(payload));
  },

  async getList(bId, coll) {
    try {
      const snap = await getDocs(collection(db, 'businesses', bId, coll));
      if (!snap.empty) return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (e) {}
    const l = localStorage.getItem(this.key(bId, coll));
    return l ? JSON.parse(l) : [];
  },

  async saveItem(bId, coll, id, item, uid) {
    const payload = {
      ...item,
      id,
      businessId: bId,
      createdBy: uid || 'system',
      updatedAt: new Date().toISOString(),
      createdAt: item.createdAt || new Date().toISOString()
    };
    try {
      await setDoc(doc(db, 'businesses', bId, coll, id), payload, { merge: true });
    } catch (e) {}
    const list = await this.getList(bId, coll);
    const idx = list.findIndex(x => x.id === id);
    if (idx >= 0) list[idx] = payload; else list.unshift(payload);
    localStorage.setItem(this.key(bId, coll), JSON.stringify(list));
    return payload;
  },

  async deleteItem(bId, coll, id) {
    try {
      await deleteDoc(doc(db, 'businesses', bId, coll, id));
    } catch (e) {}
    const list = await this.getList(bId, coll);
    const filtered = list.filter(x => x.id !== id);
    localStorage.setItem(this.key(bId, coll), JSON.stringify(filtered));
  }
};

// ============================================================================
// 3. PROFESSIONAL SVG ICONS
// ============================================================================
const Icons = {
  Dashboard: ({ c = "w-5 h-5" }) => <svg className={c} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>,
  Customers: ({ c = "w-5 h-5" }) => <svg className={c} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Suppliers: ({ c = "w-5 h-5" }) => <svg className={c} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  Orders: ({ c = "w-5 h-5" }) => <svg className={c} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>,
  Quotations: ({ c = "w-5 h-5" }) => <svg className={c} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  Payments: ({ c = "w-5 h-5" }) => <svg className={c} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/><path d="M6 15h2"/><path d="M14 15h4"/></svg>,
  Expenses: ({ c = "w-5 h-5" }) => <svg className={c} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/><path d="m17 14 4 4-4 4"/></svg>,
  Accounts: ({ c = "w-5 h-5" }) => <svg className={c} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>,
  Reports: ({ c = "w-5 h-5" }) => <svg className={c} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  Settings: ({ c = "w-5 h-5" }) => <svg className={c} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  User: ({ c = "w-5 h-5" }) => <svg className={c} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Plus: ({ c = "w-4 h-4" }) => <svg className={c} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  WhatsApp: ({ c = "w-4 h-4" }) => <svg className={c} fill="currentColor" viewBox="0 0 24 24"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.12.17 1.78 2.72 4.31 3.81.6.26 1.07.42 1.44.54.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.22-.17-.47-.29"/></svg>,
  Print: ({ c = "w-4 h-4" }) => <svg className={c} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>,
  Download: ({ c = "w-4 h-4" }) => <svg className={c} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Trash: ({ c = "w-4 h-4" }) => <svg className={c} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  Close: ({ c = "w-5 h-5" }) => <svg className={c} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  ArrowLeft: ({ c = "w-4 h-4" }) => <svg className={c} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  LogOut: ({ c = "w-4 h-4" }) => <svg className={c} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
};

const dict = {
  en: {
    appName: "ROKDO",
    tagline: "Aapka Digital Accountant",
    navDashboard: "Dashboard",
    navCustomers: "Customers",
    navSuppliers: "Suppliers",
    navOrders: "Orders & Billing",
    navQuotations: "Quotations",
    navPayments: "Payments",
    navExpenses: "Expenses",
    navAccounts: "Accounts",
    navReports: "Reports",
    navSettings: "Account & Settings",
    todaySales: "Today's Sales",
    monthlySales: "Monthly Sales",
    totalReceived: "Total Received",
    pendingReceivables: "Pending Balance",
    totalExpenses: "Total Expenses",
    estimatedProfit: "Estimated Profit",
    monthlyTarget: "Monthly Sales Target",
    newOrder: "New Order",
    newQuotation: "New Quotation",
    addCustomer: "Add Customer",
    addSupplier: "Add Supplier",
    recordPayment: "Record Payment",
    addExpense: "Add Expense",
    convertToOrder: "Convert to Order",
    save: "Save Record",
    cancel: "Cancel",
    logout: "Log Out"
  },
  hi: {
    appName: "रोकड़ो",
    tagline: "आपका डिजिटल अकाउंटेंट",
    navDashboard: "डैशबोर्ड",
    navCustomers: "ग्राहक",
    navSuppliers: "सप्लायर्स (व्यापारी)",
    navOrders: "ऑर्डर्स एवं बिलिंग",
    navQuotations: "कोटेशन (अनुमान)",
    navPayments: "भुगतान",
    navExpenses: "खर्चे",
    navAccounts: "खाते (कैश/बैंक)",
    navReports: "रिपोर्ट्स",
    navSettings: "खाता व सेटिंग्स",
    todaySales: "आज की बिक्री",
    monthlySales: "मासिक बिक्री",
    totalReceived: "कुल जमा (कैश)",
    pendingReceivables: "मार्केट उधारी (बकाया)",
    totalExpenses: "कुल खर्चे",
    estimatedProfit: "अनुमानित मुनाफा",
    monthlyTarget: "मासिक बिक्री लक्ष्य",
    newOrder: "नया ऑर्डर",
    newQuotation: "नया कोटेशन",
    addCustomer: "नया ग्राहक",
    addSupplier: "नया सप्लायर",
    recordPayment: "रकम जमा करें",
    addExpense: "खर्चा जोड़ें",
    convertToOrder: "ऑर्डर में बदलें",
    save: "सुरक्षित करें",
    cancel: "रद्द करें",
    logout: "लॉगआउट"
  }
};

// ============================================================================
// 4. MAIN ENTERPRISE APPLICATION ENGINE
// ============================================================================
function RokdoApplication() {
  const [lang, setLang] = useState(() => localStorage.getItem('rokdo_lang') || 'en');
  const t = dict[lang];

  // Auth State
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [authErr, setAuthErr] = useState('');
  const [isOnboarding, setIsOnboarding] = useState(false);

  // Business Context with Logo Support
  const [bizId, setBizId] = useState(() => localStorage.getItem('rokdo_bId') || '');
  const [biz, setBiz] = useState({
    name: 'A S FURNITURE',
    ownerName: 'Vikas Sharma',
    phone: '+919664819415',
    address: 'Shop 12, Industrial Area',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400703',
    gstin: '',
    businessType: 'Furniture Manufacturer',
    salesTargetMonthly: 500000,
    logoUrl: '',
    defaultTemplate: 'template1'
  });

  // Active Tab
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // Datasets
  const [customers, setCustomers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [payments, setPayments] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [accounts, setAccounts] = useState([]);

  // Modals
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showQuotationModal, setShowQuotationModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  // Target for Print Preview & Ledger
  const [fullScreenPrintDoc, setFullScreenPrintDoc] = useState(null); // When open, full clean A4 sheet
  const [selectedTemplate, setSelectedTemplate] = useState('template1');
  const [selectedCustLedger, setSelectedCustLedger] = useState(null);
  const [orderPaymentTarget, setOrderPaymentTarget] = useState(null);

  // Reports Date Filter
  const [reportFrom, setReportFrom] = useState('2026-11-01');
  const [reportTo, setReportTo] = useState('2026-11-15');

  // Load Session Listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setCurrentUser(u);
        const resolvedBizId = 'biz_' + u.uid.slice(0, 10);
        setBizId(resolvedBizId);
        localStorage.setItem('rokdo_bId', resolvedBizId);

        const profile = await DB.getUser(u.uid);
        if (!profile) {
          setIsOnboarding(true);
        } else {
          const b = await DB.getBiz(resolvedBizId);
          if (b) setBiz(b);
          await reloadAll(resolvedBizId);
        }
      } else {
        setCurrentUser(null);
        setBizId('');
        localStorage.removeItem('rokdo_bId');
      }
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  const reloadAll = async (bId) => {
    const [c, s, o, q, p, e, a] = await Promise.all([
      DB.getList(bId, 'customers'),
      DB.getList(bId, 'suppliers'),
      DB.getList(bId, 'orders'),
      DB.getList(bId, 'quotations'),
      DB.getList(bId, 'payments'),
      DB.getList(bId, 'expenses'),
      DB.getList(bId, 'accounts')
    ]);
    setCustomers(c);
    setSuppliers(s);
    setOrders(o);
    setQuotations(q);
    setPayments(p);
    setExpenses(e);

    if (a.length === 0) {
      const defAccs = [
        { id: 'acc_cash', name: 'Cash in Hand (गल्ला)', currentBalance: 15000, type: 'Cash' },
        { id: 'acc_bank', name: 'Current Bank A/C', currentBalance: 85000, type: 'Bank' },
        { id: 'acc_upi', name: 'Shop UPI Register', currentBalance: 12000, type: 'UPI' }
      ];
      for (const item of defAccs) {
        await DB.saveItem(bId, 'accounts', item.id, item, 'system');
      }
      setAccounts(defAccs);
    } else {
      setAccounts(a);
    }
  };

  // Safe Non-Blocking Print Trigger (Instant on iOS Safari)
  const triggerInstantPrint = () => {
    setTimeout(() => {
      window.print();
    }, 50);
  };

  // WhatsApp Document Sender
  const sendWhatsAppDocument = (docItem, isQuote = false) => {
    const prefix = isQuote ? "QUOTATION" : "TAX INVOICE";
    const ref = isQuote ? docItem.quoteNumber : docItem.orderNumber;
    const text = `*${prefix}: ${ref}*\n*${biz.name}*\nBilled to: ${docItem.customerName}\nTotal Amount: ${formatINR(docItem.grandTotal)}\n${!isQuote ? `Advance Paid: ${formatINR(docItem.advancePaid || 0)}\nBalance Due: ${formatINR(docItem.remainingBalance || 0)}\nStatus: ${(docItem.status || 'PENDING').toUpperCase()}\n` : `Valid Until: ${formatDateIndian(docItem.validUntil)}\n`}\nContact: ${biz.phone}`;
    window.open(`https://wa.me/91${docItem.customerMobile.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Phone Auth Handlers
  const sendOtpHandler = async (e) => {
    e.preventDefault();
    setAuthErr('');
    if (phone.length < 10) return setAuthErr('Enter a valid 10-digit number');

    try {
      if (window.recaptchaVerifier) {
        try { window.recaptchaVerifier.clear(); } catch (err) {}
        window.recaptchaVerifier = null;
      }
      const box = document.getElementById('recaptcha-box');
      if (box) box.innerHTML = '';

      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-box', { size: 'invisible' });
      const formatted = '+91' + phone.replace(/\D/g, '').slice(-10);
      const conf = await signInWithPhoneNumber(auth, formatted, window.recaptchaVerifier);
      window.confResult = conf;
      setOtpSent(true);
    } catch (err) {
      setAuthErr(err.message || 'OTP dispatch failed.');
      if (window.recaptchaVerifier) {
        try { window.recaptchaVerifier.clear(); } catch (e) {}
        window.recaptchaVerifier = null;
      }
    }
  };

  const verifyOtpHandler = async (e) => {
    e.preventDefault();
    setAuthErr('');
    try {
      await window.confResult.confirm(otp);
    } catch (err) {
      setAuthErr('Invalid OTP code. Try again.');
    }
  };

  const completeOnboarding = async (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const owner = f.get('owner');
    const firm = f.get('firm');
    const bId = 'biz_' + currentUser.uid.slice(0, 10);

    await DB.saveUser(currentUser.uid, { uid: currentUser.uid, phone: currentUser.phoneNumber, owner, businessId: bId });
    const bData = { ...biz, name: firm, ownerName: owner, phone: currentUser.phoneNumber || '' };
    await DB.saveBiz(bId, bData);
    setBiz(bData);
    setIsOnboarding(false);
    await reloadAll(bId);
  };

  // Calculations
  const metrics = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const todaySales = orders.filter(o => o.orderDate === today).reduce((s, o) => s + (o.grandTotal || 0), 0);
    const totalSales = orders.reduce((s, o) => s + (o.grandTotal || 0), 0);
    const totalReceived = payments.reduce((s, p) => s + (p.amount || 0), 0);
    const pendingDue = customers.reduce((s, c) => s + (c.outstandingBalance || 0), 0);
    const totalExp = expenses.reduce((s, e) => s + (e.amount || 0), 0);
    const estimatedProfit = totalSales - totalExp;
    const targetProgress = Math.min(100, Math.round((totalSales / (biz.salesTargetMonthly || 500000)) * 100));

    return { todaySales, totalSales, totalReceived, pendingDue, totalExp, estimatedProfit, targetProgress };
  }, [orders, payments, customers, expenses, biz]);

  // Subsequent Payment Installment to Order
  const applyPaymentToOrder = async (orderId, paymentAmount, paymentMethod, paymentNotes = '') => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const paymentNumber = 'REC-' + String(Date.now()).slice(-5);
    const payItem = {
      id: 'pay_' + Date.now(),
      receiptNumber: paymentNumber,
      orderId: order.id,
      orderNumber: order.orderNumber,
      customerId: order.customerId,
      customerName: order.customerName,
      amount: paymentAmount,
      method: paymentMethod,
      date: new Date().toISOString().slice(0, 10),
      notes: paymentNotes
    };

    await DB.saveItem(bizId, 'payments', payItem.id, payItem, currentUser.uid);

    const orderPayments = [...payments.filter(p => p.orderId === order.id), payItem];
    const totalReceivedOnOrder = orderPayments.reduce((sum, p) => sum + p.amount, 0);
    const newRemainingBalance = Math.max(0, order.grandTotal - totalReceivedOnOrder);
    const newStatus = newRemainingBalance === 0 ? 'paid' : (totalReceivedOnOrder > 0 ? 'partial' : 'pending');

    const updatedOrder = {
      ...order,
      advancePaid: totalReceivedOnOrder,
      remainingBalance: newRemainingBalance,
      status: newStatus
    };
    await DB.saveItem(bizId, 'orders', order.id, updatedOrder, currentUser.uid);

    const cust = customers.find(c => c.id === order.customerId);
    if (cust) {
      cust.totalReceived = (cust.totalReceived || 0) + paymentAmount;
      cust.outstandingBalance = Math.max(0, (cust.outstandingBalance || 0) - paymentAmount);
      await DB.saveItem(bizId, 'customers', cust.id, cust, currentUser.uid);
    }

    const targetAcc = accounts.find(a => a.type.toLowerCase() === paymentMethod.toLowerCase()) || accounts[0];
    if (targetAcc) {
      targetAcc.currentBalance = (targetAcc.currentBalance || 0) + paymentAmount;
      await DB.saveItem(bizId, 'accounts', targetAcc.id, targetAcc, currentUser.uid);
    }

    await reloadAll(bizId);
  };

  // Convert Quotation into Order
  const convertQuote = async (q) => {
    const ord = {
      id: 'ord_' + Date.now(),
      orderNumber: 'ORD-' + String(Date.now()).slice(-5),
      customerId: q.customerId,
      customerName: q.customerName,
      customerMobile: q.customerMobile,
      orderDate: new Date().toISOString().slice(0, 10),
      items: q.items,
      grandTotal: q.grandTotal,
      advancePaid: 0,
      remainingBalance: q.grandTotal,
      status: 'pending'
    };
    await DB.saveItem(bizId, 'orders', ord.id, ord, currentUser.uid);
    await DB.saveItem(bizId, 'quotations', q.id, { ...q, status: 'accepted' }, currentUser.uid);

    const cust = customers.find(c => c.id === q.customerId);
    if (cust) {
      cust.totalPurchases = (cust.totalPurchases || 0) + q.grandTotal;
      cust.outstandingBalance = (cust.outstandingBalance || 0) + q.grandTotal;
      await DB.saveItem(bizId, 'customers', cust.id, cust, currentUser.uid);
    }
    await reloadAll(bizId);
    alert('Quotation converted to live Order!');
    setActiveTab('orders');
  };

  // Customer Ledger
  const getCustomerLedger = (custId) => {
    const custOrders = orders.filter(o => o.customerId === custId);
    const custPayments = payments.filter(p => p.customerId === custId);
    const ledger = [];

    custOrders.forEach(o => {
      ledger.push({ id: 'ord_' + o.id, date: o.orderDate, desc: `Order (${o.orderNumber})`, debit: o.grandTotal, credit: 0 });
    });
    custPayments.forEach(p => {
      ledger.push({ id: 'pay_' + p.id, date: p.date, desc: `Payment (${p.method}) - ${p.receiptNumber}`, debit: 0, credit: p.amount });
    });

    ledger.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    let running = 0;
    ledger.forEach(entry => {
      running += (entry.debit - entry.credit);
      entry.runningBalance = running;
    });
    return ledger.reverse();
  };

  if (authLoading) {
    return <div className="min-h-screen bg-[#101D35] flex items-center justify-center text-white text-xs font-bold">ROKDO ACCOUNTANT LOADING...</div>;
  }

  // ==========================================================================
  // VIEW: AUTHENTICATION
  // ==========================================================================
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#101D35] flex items-center justify-center p-4">
        <div id="recaptcha-box"></div>
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
          <div className="bg-[#172B4D] p-6 text-center text-white">
            <div className="w-12 h-12 mx-auto rounded-xl bg-[#C9A04A] text-[#101D35] font-black text-2xl flex items-center justify-center mb-2 shadow-lg">R</div>
            <h1 className="text-xl font-black">{t.appName}</h1>
            <p className="text-xs text-slate-300">{t.tagline}</p>
          </div>
          <div className="p-6 md:p-8">
            <h2 className="text-sm font-bold text-[#101D35] mb-1">{!otpSent ? "Login with Phone (+91)" : "Enter 6-Digit OTP"}</h2>
            {authErr && <div className="p-2.5 mb-3 rounded-lg bg-rose-50 text-rose-700 text-xs font-semibold">{authErr}</div>}
            {!otpSent ? (
              <form onSubmit={sendOtpHandler} className="space-y-3">
                <div className="flex rounded-xl border overflow-hidden">
                  <span className="bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600 border-r flex items-center">+91</span>
                  <input type="tel" maxLength="10" required value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ''))} placeholder="98XXXXXXXX" className="w-full px-3 py-2 text-xs outline-none" />
                </div>
                <button type="submit" className="w-full py-2.5 bg-[#101D35] text-white font-bold text-xs rounded-xl shadow">Send OTP via SMS</button>
              </form>
            ) : (
              <form onSubmit={verifyOtpHandler} className="space-y-3">
                <input type="text" maxLength="6" required value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} placeholder="••••••" className="w-full text-center text-lg font-black tracking-widest p-2 rounded-xl border outline-none" />
                <button type="submit" className="w-full py-2.5 bg-[#101D35] text-white font-bold text-xs rounded-xl shadow">Verify &amp; Enter</button>
                <button type="button" onClick={() => setOtpSent(false)} className="text-xs text-slate-500 hover:underline block text-center w-full">Change Phone Number</button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Onboarding
  if (isOnboarding) {
    return (
      <div className="min-h-screen bg-[#101D35] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl">
          <h2 className="text-base font-black text-[#101D35] mb-1">Business Setup</h2>
          <p className="text-xs text-slate-500 mb-4">Enter firm details to activate your digital ledger.</p>
          <form onSubmit={completeOnboarding} className="space-y-3">
            <input name="owner" required placeholder="Owner / Proprietor Name *" className="w-full text-xs p-2.5 rounded-xl border" />
            <input name="firm" required placeholder="Business / Firm Name *" className="w-full text-xs p-2.5 rounded-xl border" />
            <button type="submit" className="w-full py-2.5 bg-[#101D35] text-white font-bold text-xs rounded-xl shadow">Start Accounting</button>
          </form>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // VIEW: FULL-SCREEN CLEAN A4 PRINT PREVIEW (NO BLACK OVERLAYS, NO MODAL LAG)
  // ==========================================================================
  if (fullScreenPrintDoc) {
    return (
      <div className="min-h-screen bg-slate-100 font-sans text-[#202B3C]">
        {/* Top Control Bar (Screen Only - Hidden in Print) */}
        <div className="no-print sticky top-0 z-30 bg-[#101D35] text-white px-4 py-3 shadow-md flex items-center justify-between">
          <button 
            onClick={() => setFullScreenPrintDoc(null)} 
            className="flex items-center space-x-1.5 text-xs font-bold text-[#C9A04A] hover:underline"
          >
            <Icons.ArrowLeft c="w-4 h-4" />
            <span>Back to App</span>
          </button>

          <div className="flex items-center space-x-2">
            <select 
              value={selectedTemplate} 
              onChange={e => setSelectedTemplate(e.target.value)}
              className="text-xs p-1.5 rounded-lg bg-[#172B4D] border border-white/20 text-white font-bold outline-none"
            >
              <option value="template1">Template 1: Classic Professional</option>
              <option value="template2">Template 2: Premium Corporate</option>
              <option value="template3">Template 3: Modern Minimal</option>
            </select>

            <button 
              onClick={triggerInstantPrint}
              className="px-3.5 py-1.5 bg-[#C9A04A] hover:bg-[#B58D38] text-[#101D35] rounded-xl text-xs font-black flex items-center space-x-1.5 shadow"
            >
              <Icons.Print c="w-4 h-4" />
              <span>Print / PDF</span>
            </button>

            <button 
              onClick={() => sendWhatsAppDocument(fullScreenPrintDoc, fullScreenPrintDoc.docType === 'quotation')}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1"
            >
              <Icons.WhatsApp c="w-4 h-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Real A4 Paper Canvas */}
        <div className="max-w-3xl mx-auto my-6 p-4 sm:p-0">
          <div id="printable-doc" className="bg-white rounded-2xl sm:rounded-none shadow-xl sm:shadow-md p-6 sm:p-12 text-xs space-y-5 font-sans">
            
            {/* Header with Business Logo */}
            <div className="flex justify-between items-start pb-4 border-b-2 border-[#101D35]">
              <div className="flex items-start space-x-3">
                {biz.logoUrl ? (
                  <img src={biz.logoUrl} alt="Logo" className="w-16 h-16 object-contain rounded-lg border p-1 bg-white" />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-[#101D35] text-[#C9A04A] font-black text-xl flex items-center justify-center">
                    {biz.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h1 className="text-xl font-black text-[#101D35] tracking-tight">{biz.name}</h1>
                  <div className="text-slate-600 text-xs mt-0.5">{biz.address}, {biz.city} - {biz.pincode}</div>
                  <div className="text-slate-600 text-xs">Ph: {biz.phone} | GSTIN: {biz.gstin || 'Unregistered'}</div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-black uppercase tracking-wider text-[#C9A04A] bg-[#101D35] px-3 py-1 rounded">
                  {fullScreenPrintDoc.docType === 'quotation' ? "QUOTATION" : "TAX INVOICE"}
                </span>
                <div className="font-bold text-sm text-[#101D35] mt-2">{fullScreenPrintDoc.orderNumber || fullScreenPrintDoc.quoteNumber}</div>
                <div className="text-slate-500 text-xs">{formatDateIndian(fullScreenPrintDoc.orderDate || fullScreenPrintDoc.quoteDate)}</div>
              </div>
            </div>

            {/* Billed To */}
            <div className="py-2 border-b border-slate-100 flex justify-between items-center">
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">BILLED TO</div>
                <div className="font-bold text-sm text-slate-900 mt-0.5">{fullScreenPrintDoc.customerName}</div>
                <div className="text-slate-600 text-xs">Mobile: {fullScreenPrintDoc.customerMobile}</div>
              </div>
              <div className="text-right">
                <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase ${fullScreenPrintDoc.remainingBalance === 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                  {fullScreenPrintDoc.remainingBalance === 0 ? 'PAID IN FULL' : 'PAYMENT DUE'}
                </span>
              </div>
            </div>

            {/* Item Table */}
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-100 text-[#101D35] font-bold">
                  <th className="py-2.5 px-3 text-left">Item Description</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {fullScreenPrintDoc.items ? fullScreenPrintDoc.items.map((it, idx) => (
                  <tr key={idx}>
                    <td className="py-3 px-3 font-semibold text-slate-800">{it.name}</td>
                    <td className="py-3 px-3 text-center text-slate-600">{it.qty}</td>
                    <td className="py-3 px-3 text-right font-black text-slate-900">{formatINR(it.total)}</td>
                  </tr>
                )) : (
                  <tr>
                    <td className="py-3 px-3 font-semibold">Standard Goods Order</td>
                    <td className="py-3 px-3 text-center">1</td>
                    <td className="py-3 px-3 text-right font-black">{formatINR(fullScreenPrintDoc.grandTotal)}</td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Totals */}
            <div className="border-t-2 border-slate-200 pt-3 space-y-1.5 text-right text-xs">
              <div className="flex justify-between font-bold text-sm text-[#101D35]">
                <span>Grand Total:</span>
                <span>{formatINR(fullScreenPrintDoc.grandTotal)}</span>
              </div>
              {fullScreenPrintDoc.docType !== 'quotation' && (
                <>
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Advance Received:</span>
                    <span>{formatINR(fullScreenPrintDoc.advancePaid || 0)}</span>
                  </div>
                  <div className="flex justify-between text-rose-700 font-black text-sm border-t pt-1">
                    <span>Balance Due:</span>
                    <span>{formatINR(fullScreenPrintDoc.remainingBalance || 0)}</span>
                  </div>
                </>
              )}
            </div>

            {/* Signatory Footer */}
            <div className="pt-8 border-t border-slate-200 flex justify-between items-end text-[10px] text-slate-500">
              <div>Terms: Goods once sold will not be taken back.</div>
              <div className="text-right">
                <div className="font-bold text-slate-800">For {biz.name}</div>
                <div className="h-10"></div>
                <div className="border-t border-slate-400 pt-1 uppercase tracking-wider">Authorized Signatory</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // VIEW: PRIMARY WORKSPACE WITH BOTTOM-RIGHT ACCOUNT HUB
  // ==========================================================================
  return (
    <div className="min-h-screen bg-[#F4F6FA] flex flex-col md:flex-row font-sans text-[#202B3C]">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-60 bg-[#101D35] text-white border-r border-[#142542] sticky top-0 h-screen p-4 no-print">
        <div className="flex items-center space-x-3 mb-6">
          {biz.logoUrl ? (
            <img src={biz.logoUrl} alt="Logo" className="w-10 h-10 object-contain rounded-xl bg-white p-0.5 border" />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-[#C9A04A] text-[#101D35] font-black text-xl flex items-center justify-center">R</div>
          )}
          <div className="truncate">
            <div className="font-bold text-sm truncate">{biz.name}</div>
            <div className="text-[10px] text-[#C9A04A]">{biz.ownerName}</div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto">
          {[
            { id: 'dashboard', l: t.navDashboard, icon: Icons.Dashboard },
            { id: 'customers', l: t.navCustomers, icon: Icons.Customers, b: customers.length },
            { id: 'suppliers', l: t.navSuppliers, icon: Icons.Suppliers, b: suppliers.length },
            { id: 'orders', l: t.navOrders, icon: Icons.Orders, b: orders.length },
            { id: 'quotations', l: t.navQuotations, icon: Icons.Quotations, b: quotations.length },
            { id: 'payments', l: t.navPayments, icon: Icons.Payments },
            { id: 'expenses', l: t.navExpenses, icon: Icons.Expenses },
            { id: 'accounts', l: t.navAccounts, icon: Icons.Accounts },
            { id: 'reports', l: t.navReports, icon: Icons.Reports },
            { id: 'settings', l: t.navSettings, icon: Icons.Settings }
          ].map(it => {
            const Icon = it.icon;
            const act = activeTab === it.id;
            return (
              <button key={it.id} onClick={() => setActiveTab(it.id)} className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-semibold ${act ? 'bg-[#C9A04A] text-[#101D35] font-bold' : 'text-slate-300 hover:bg-[#172B4D]'}`}>
                <Icon c="w-4 h-4 shrink-0" />
                <span className="flex-1 text-left truncate">{it.l}</span>
                {it.b !== undefined && <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#172B4D] text-slate-300">{it.b}</span>}
              </button>
            );
          })}
        </nav>

        <button onClick={() => signOut(auth)} className="w-full flex items-center space-x-2 p-2 mt-4 text-xs font-bold text-rose-400 hover:bg-rose-500/10 rounded-xl">
          <Icons.LogOut c="w-4 h-4" />
          <span>{t.logout}</span>
        </button>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-6">
        
        {/* PREMIUM DARK NAVY HEADER WITH LOGO */}
        <header className="sticky top-0 z-20 bg-[#101D35] text-white px-4 md:px-8 py-3 flex items-center justify-between shadow-md no-print">
          <div className="flex items-center space-x-2.5">
            {biz.logoUrl ? (
              <img src={biz.logoUrl} alt="Logo" className="w-8 h-8 object-contain rounded-lg bg-white p-0.5" />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-[#C9A04A] text-[#101D35] font-black text-sm flex items-center justify-center">R</div>
            )}
            <span className="font-bold text-sm tracking-tight text-white truncate max-w-[150px] sm:max-w-none">{biz.name}</span>
          </div>

          <div className="flex items-center space-x-2">
            <button onClick={() => {
              const nl = lang === 'en' ? 'hi' : 'en';
              setLang(nl);
              localStorage.setItem('rokdo_lang', nl);
            }} className="text-xs px-2.5 py-1 rounded-xl border border-white/20 bg-[#172B4D] text-white font-bold">
              {lang === 'en' ? '🇮🇳 हिंदी' : 'English'}
            </button>
            <button onClick={() => setShowOrderModal(true)} className="px-3 py-1 bg-[#C9A04A] text-[#101D35] rounded-xl text-xs font-bold flex items-center space-x-1">
              <Icons.Plus c="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.newOrder}</span>
            </button>
          </div>
        </header>

        {/* WORKSPACE CONTENT TABS */}
        <main className="p-4 md:p-8 max-w-6xl mx-auto w-full space-y-5 no-print">
          
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <>
              {/* Financial KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-white p-4 rounded-2xl border shadow-xs">
                  <div className="text-[11px] text-slate-400 font-semibold">{t.todaySales}</div>
                  <div className="text-xl font-black mt-1">{formatINR(metrics.todaySales)}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Month: {formatINR(metrics.totalSales)}</div>
                </div>
                <div className="bg-white p-4 rounded-2xl border shadow-xs">
                  <div className="text-[11px] text-emerald-600 font-semibold">{t.totalReceived}</div>
                  <div className="text-xl font-black text-emerald-600 mt-1">{formatINR(metrics.totalReceived)}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{payments.length} Collections</div>
                </div>
                <div className="bg-white p-4 rounded-2xl border shadow-xs">
                  <div className="text-[11px] text-rose-600 font-semibold">{t.pendingReceivables}</div>
                  <div className="text-xl font-black text-rose-600 mt-1">{formatINR(metrics.pendingDue)}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{customers.filter(c => c.outstandingBalance > 0).length} Due Accounts</div>
                </div>
                <div className="bg-white p-4 rounded-2xl border shadow-xs border-l-4 border-l-[#C9A04A]">
                  <div className="text-[11px] text-amber-800 font-semibold">{t.estimatedProfit}*</div>
                  <div className="text-xl font-black text-[#101D35] mt-1">{formatINR(metrics.estimatedProfit)}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">*Sales - Expenses</div>
                </div>
              </div>

              {/* Target */}
              <div className="bg-white p-4 rounded-2xl border shadow-xs">
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span>{t.monthlyTarget}</span>
                  <span>{formatINR(metrics.totalSales)} / {formatINR(biz.salesTargetMonthly)} ({metrics.targetProgress}%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-[#101D35] h-2 rounded-full" style={{ width: `${metrics.targetProgress}%` }}></div>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="bg-white rounded-2xl border shadow-xs overflow-hidden">
                <div className="p-3.5 border-b flex justify-between items-center bg-slate-50/50">
                  <span className="font-bold text-xs uppercase text-[#101D35]">Recent Billing Feed</span>
                  <button onClick={() => setActiveTab('orders')} className="text-xs font-bold text-[#101D35] hover:underline">View All</button>
                </div>
                <div className="divide-y">
                  {orders.slice(0, 5).map(o => (
                    <div key={o.id} className="p-3.5 flex justify-between items-center">
                      <div>
                        <div className="font-bold text-xs">{o.customerName}</div>
                        <div className="text-[11px] text-slate-400">{o.orderNumber} • {formatDateIndian(o.orderDate)}</div>
                      </div>
                      <div className="text-right flex items-center space-x-2.5">
                        <div>
                          <div className="font-black text-xs">{formatINR(o.grandTotal)}</div>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${o.status === 'paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                            {o.status || 'PENDING'}
                          </span>
                        </div>
                        <button onClick={() => setFullScreenPrintDoc(o)} className="p-1.5 border rounded-lg hover:bg-slate-50">
                          <Icons.Print c="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* TAB 2: CUSTOMERS */}
          {activeTab === 'customers' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h2 className="text-sm font-bold">{t.navCustomers}</h2>
                <button onClick={() => setShowCustomerModal(true)} className="px-3 py-1.5 bg-[#101D35] text-white rounded-xl text-xs font-bold">+ {t.addCustomer}</button>
              </div>

              <input 
                type="text" 
                value={searchQuery} 
                onChange={e => setSearchQuery(e.target.value)} 
                placeholder="Search customer name or mobile..." 
                className="w-full text-xs p-2.5 rounded-xl border bg-white outline-none" 
              />

              <div className="bg-white rounded-2xl border divide-y overflow-hidden shadow-xs">
                {customers.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.mobile.includes(searchQuery)).map(c => (
                  <div key={c.id} className="p-3.5 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-xs">{c.name}</div>
                      <div className="text-[11px] text-slate-400">📱 {c.mobile}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right mr-2">
                        <div className="text-[10px] text-slate-400">Due</div>
                        <div className="font-black text-xs text-rose-600">{formatINR(c.outstandingBalance)}</div>
                      </div>
                      <button onClick={() => setSelectedCustLedger(c)} className="px-2.5 py-1 border rounded-lg text-xs font-bold hover:bg-slate-50">Ledger</button>
                      <button onClick={async () => {
                        if (confirm(`Delete customer ${c.name}?`)) {
                          await DB.deleteItem(bizId, 'customers', c.id);
                          await reloadAll(bizId);
                        }
                      }} className="p-1 text-slate-400 hover:text-rose-600"><Icons.Trash c="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SUPPLIERS */}
          {activeTab === 'suppliers' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h2 className="text-sm font-bold">{t.navSuppliers}</h2>
                <button onClick={() => setShowSupplierModal(true)} className="px-3 py-1.5 bg-[#101D35] text-white rounded-xl text-xs font-bold">+ {t.addSupplier}</button>
              </div>

              <div className="bg-white rounded-2xl border divide-y overflow-hidden shadow-xs">
                {suppliers.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">No suppliers registered. Add material vendors.</div>
                ) : (
                  suppliers.map(s => (
                    <div key={s.id} className="p-3.5 flex justify-between items-center">
                      <div>
                        <div className="font-bold text-xs">{s.name}</div>
                        <div className="text-[11px] text-slate-400">📱 {s.mobile} • {s.category}</div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <div className="text-[10px] text-slate-400">Payable Due</div>
                          <div className="font-black text-xs text-slate-800">{formatINR(s.payableBalance || 0)}</div>
                        </div>
                        <button onClick={async () => {
                          if (confirm(`Delete supplier ${s.name}?`)) {
                            await DB.deleteItem(bizId, 'suppliers', s.id);
                            await reloadAll(bizId);
                          }
                        }} className="p-1 text-slate-400 hover:text-rose-600"><Icons.Trash c="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: ORDERS & MULTI-PAYMENT PROGRESSION */}
          {activeTab === 'orders' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h2 className="text-sm font-bold">{t.navOrders}</h2>
                <button onClick={() => setShowOrderModal(true)} className="px-3 py-1.5 bg-[#101D35] text-white rounded-xl text-xs font-bold">+ {t.newOrder}</button>
              </div>

              <div className="space-y-2">
                {orders.map(o => (
                  <div key={o.id} className="bg-white p-4 rounded-2xl border shadow-xs space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-xs text-[#101D35]">{o.orderNumber}</span>
                          <span className="text-[10px] text-slate-400">• {formatDateIndian(o.orderDate)}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${o.status === 'paid' ? 'bg-emerald-50 text-emerald-700' : (o.status === 'partial' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700')}`}>
                            {o.status || 'PENDING'}
                          </span>
                        </div>
                        <div className="font-bold text-sm text-slate-800 mt-1">{o.customerName} ({o.customerMobile})</div>
                        <div className="text-xs text-slate-500 mt-0.5">{o.items ? o.items.map(i => `${i.name} (x${i.qty})`).join(', ') : 'Details'}</div>
                      </div>

                      <div className="text-right">
                        <div className="text-base font-black text-slate-900">{formatINR(o.grandTotal)}</div>
                        <div className="text-[11px] text-emerald-600 font-semibold">Paid: {formatINR(o.advancePaid || 0)}</div>
                        <div className="text-[11px] text-rose-600 font-black">Due: {formatINR(o.remainingBalance || 0)}</div>
                      </div>
                    </div>

                    <div className="pt-2 border-t flex flex-wrap gap-2 justify-between items-center text-xs">
                      <div className="flex gap-2">
                        {o.remainingBalance > 0 && (
                          <button onClick={() => setOrderPaymentTarget(o)} className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg font-bold">
                            + Add Payment
                          </button>
                        )}
                        <button onClick={() => setFullScreenPrintDoc(o)} className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg font-semibold flex items-center space-x-1">
                          <Icons.Print c="w-3.5 h-3.5 text-[#101D35]" />
                          <span>Print Invoice</span>
                        </button>
                        <button onClick={() => sendWhatsAppDocument(o, false)} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg font-bold flex items-center space-x-1">
                          <Icons.WhatsApp c="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </button>
                      </div>

                      <button onClick={async () => {
                        if (confirm(`Delete order ${o.orderNumber}?`)) {
                          await DB.deleteItem(bizId, 'orders', o.id);
                          await reloadAll(bizId);
                        }
                      }} className="p-1 text-slate-400 hover:text-rose-600"><Icons.Trash c="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: QUOTATIONS */}
          {activeTab === 'quotations' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h2 className="text-sm font-bold">{t.navQuotations}</h2>
                <button onClick={() => setShowQuotationModal(true)} className="px-3 py-1.5 bg-[#101D35] text-white rounded-xl text-xs font-bold">+ {t.newQuotation}</button>
              </div>

              <div className="space-y-2">
                {quotations.map(q => (
                  <div key={q.id} className="bg-white p-3.5 rounded-2xl border flex justify-between items-center">
                    <div>
                      <div className="font-bold text-xs text-[#C9A04A] bg-[#101D35] px-2 py-0.5 rounded inline-block">{q.quoteNumber}</div>
                      <div className="font-bold text-sm mt-1">{q.customerName}</div>
                      <div className="text-[10px] text-slate-400">Valid: {formatDateIndian(q.validUntil)}</div>
                    </div>
                    <div className="text-right flex items-center space-x-2">
                      <div className="font-black text-xs mr-2">{formatINR(q.grandTotal)}</div>
                      {q.status !== 'accepted' && (
                        <button onClick={() => convertQuote(q)} className="px-2.5 py-1 bg-emerald-600 text-white text-xs font-bold rounded-lg">{t.convertToOrder}</button>
                      )}
                      <button onClick={() => { setFullScreenPrintDoc({ ...q, docType: 'quotation' }); }} className="px-2 py-1 border rounded-lg text-xs font-semibold">Print</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: PAYMENTS */}
          {activeTab === 'payments' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h2 className="text-sm font-bold">{t.navPayments}</h2>
                <button onClick={() => setShowPaymentModal(true)} className="px-3 py-1.5 bg-[#101D35] text-white rounded-xl text-xs font-bold">+ {t.recordPayment}</button>
              </div>
              <div className="bg-white rounded-2xl border divide-y overflow-hidden shadow-xs">
                {payments.map(p => (
                  <div key={p.id} className="p-3.5 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-xs">{p.customerName}</div>
                      <div className="text-[11px] text-slate-400">{p.receiptNumber} • {formatDateIndian(p.date)} • Mode: {p.method}</div>
                    </div>
                    <div className="font-black text-emerald-600 text-sm">+{formatINR(p.amount)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: EXPENSES */}
          {activeTab === 'expenses' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h2 className="text-sm font-bold">{t.navExpenses}</h2>
                <button onClick={() => setShowExpenseModal(true)} className="px-3 py-1.5 bg-[#101D35] text-white rounded-xl text-xs font-bold">+ {t.addExpense}</button>
              </div>
              <div className="bg-white rounded-2xl border divide-y overflow-hidden shadow-xs">
                {expenses.map(e => (
                  <div key={e.id} className="p-3.5 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-xs">{e.title}</div>
                      <div className="text-[11px] text-slate-400">{e.category} • {formatDateIndian(e.date)}</div>
                    </div>
                    <div className="font-black text-rose-600 text-sm">-{formatINR(e.amount)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: ACCOUNTS */}
          {activeTab === 'accounts' && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold">{t.navAccounts}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {accounts.map(a => (
                  <div key={a.id} className="bg-white p-4 rounded-2xl border shadow-xs">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">{a.type}</div>
                    <div className="text-xs font-bold mt-1">{a.name}</div>
                    <div className="text-xl font-black text-[#101D35] mt-2">{formatINR(a.currentBalance)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: REPORTS */}
          {activeTab === 'reports' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h2 className="text-sm font-bold">{t.navReports}</h2>
                <div className="flex items-center space-x-2 text-xs">
                  <input type="date" value={reportFrom} onChange={e => setReportFrom(e.target.value)} className="p-1.5 rounded-lg border bg-white" />
                  <span>to</span>
                  <input type="date" value={reportTo} onChange={e => setReportTo(e.target.value)} className="p-1.5 rounded-lg border bg-white" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-4 rounded-2xl border space-y-2">
                  <div className="font-bold text-[#101D35]">Sales &amp; Turnover Statement</div>
                  <div className="text-slate-500">Total Booked Sales: {formatINR(metrics.totalSales)}</div>
                  <button onClick={() => {
                    const rows = orders.map(o => [`"${o.orderNumber}"`, `"${o.orderDate}"`, `"${o.customerName}"`, o.grandTotal, `"${o.status}"`]);
                    const csv = 'data:text/csv;charset=utf-8,Order,Date,Customer,Total,Status\n' + rows.map(r => r.join(',')).join('\n');
                    const link = document.createElement('a');
                    link.href = encodeURI(csv);
                    link.download = `ROKDO_SALES_REPORT.csv`;
                    link.click();
                  }} className="px-3 py-1.5 bg-[#101D35] text-white rounded-lg font-bold flex items-center space-x-1.5">
                    <Icons.Download c="w-3.5 h-3.5" />
                    <span>Download Sales CSV</span>
                  </button>
                </div>

                <div className="bg-white p-4 rounded-2xl border space-y-2">
                  <div className="font-bold text-[#101D35]">Customer Outstanding Statement</div>
                  <div className="text-slate-500">Market Receivables: {formatINR(metrics.pendingDue)}</div>
                  <button onClick={() => {
                    const rows = customers.map(c => [`"${c.name}"`, `"${c.mobile}"`, c.totalPurchases, c.totalReceived, c.outstandingBalance]);
                    const csv = 'data:text/csv;charset=utf-8,Customer,Mobile,Purchases,Received,Balance\n' + rows.map(r => r.join(',')).join('\n');
                    const link = document.createElement('a');
                    link.href = encodeURI(csv);
                    link.download = `ROKDO_OUTSTANDING_REPORT.csv`;
                    link.click();
                  }} className="px-3 py-1.5 bg-emerald-700 text-white rounded-lg font-bold flex items-center space-x-1.5">
                    <Icons.Download c="w-3.5 h-3.5" />
                    <span>Download Receivables CSV</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* TAB 10: ACCOUNT & SETTINGS (REQUESTED BOTTOM RIGHT HUB)          */}
          {/* ================================================================ */}
          {activeTab === 'settings' && (
            <div className="space-y-5 max-w-2xl bg-white p-5 rounded-2xl border shadow-xs text-xs">
              <div className="flex justify-between items-center pb-3 border-b">
                <div>
                  <h2 className="text-base font-black text-[#101D35]">{t.navSettings}</h2>
                  <div className="text-slate-500 text-[11px]">Logged in as: {biz.ownerName} ({currentUser.phoneNumber})</div>
                </div>
                <button onClick={() => signOut(auth)} className="px-3 py-1.5 bg-rose-50 text-rose-600 rounded-xl font-bold flex items-center space-x-1 hover:bg-rose-100">
                  <Icons.LogOut c="w-3.5 h-3.5" />
                  <span>{t.logout}</span>
                </button>
              </div>

              {/* LOGO UPLOAD & BRANDING SECTION */}
              <div className="p-4 bg-slate-50 rounded-2xl border space-y-3">
                <div className="font-bold text-slate-800 text-xs">Business Logo &amp; Watermark</div>
                <div className="flex items-center space-x-3">
                  {biz.logoUrl ? (
                    <img src={biz.logoUrl} alt="Logo" className="w-14 h-14 object-contain rounded-xl bg-white p-1 border shadow-xs" />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-[#101D35] text-[#C9A04A] font-black text-xl flex items-center justify-center">
                      {biz.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setBiz({ ...biz, logoUrl: reader.result });
                            DB.saveBiz(bizId, { ...biz, logoUrl: reader.result });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#101D35] file:text-white"
                    />
                    {biz.logoUrl && (
                      <button 
                        type="button" 
                        onClick={() => {
                          setBiz({ ...biz, logoUrl: '' });
                          DB.saveBiz(bizId, { ...biz, logoUrl: '' });
                        }}
                        className="text-[11px] text-rose-600 font-bold block mt-1 hover:underline"
                      >
                        Remove Logo
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Business Profile Details Form */}
              <form onSubmit={async (e) => {
                e.preventDefault();
                const f = new FormData(e.currentTarget);
                const updated = {
                  ...biz,
                  name: f.get('name'),
                  ownerName: f.get('owner'),
                  phone: f.get('phone'),
                  address: f.get('address'),
                  city: f.get('city'),
                  pincode: f.get('pincode'),
                  gstin: f.get('gstin'),
                  salesTargetMonthly: Number(f.get('target') || 500000)
                };
                await DB.saveBiz(bizId, updated);
                setBiz(updated);
                alert("Business Profile & Settings saved successfully!");
              }} className="space-y-3">
                <div>
                  <label className="font-semibold block mb-1">Business / Firm Name *</label>
                  <input name="name" defaultValue={biz.name} required className="w-full p-2.5 border rounded-xl" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold block mb-1">Owner Name *</label>
                    <input name="owner" defaultValue={biz.ownerName} required className="w-full p-2.5 border rounded-xl" />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Contact Phone</label>
                    <input name="phone" defaultValue={biz.phone} className="w-full p-2.5 border rounded-xl" />
                  </div>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Address, City &amp; PIN Code</label>
                  <div className="grid grid-cols-3 gap-2">
                    <input name="address" defaultValue={biz.address} placeholder="Street Address" className="p-2 border rounded-xl" />
                    <input name="city" defaultValue={biz.city} placeholder="City" className="p-2 border rounded-xl" />
                    <input name="pincode" defaultValue={biz.pincode} placeholder="PIN Code" className="p-2 border rounded-xl" />
                  </div>
                </div>
                <div>
                  <label className="font-semibold block mb-1">GSTIN (Optional)</label>
                  <input name="gstin" defaultValue={biz.gstin} placeholder="GST Number" className="w-full p-2.5 border rounded-xl uppercase" />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Monthly Sales Target (₹)</label>
                  <input name="target" type="number" defaultValue={biz.salesTargetMonthly} className="w-full p-2.5 border rounded-xl" />
                </div>
                <button type="submit" className="w-full py-2.5 bg-[#101D35] text-white font-bold rounded-xl shadow">Save Profile Changes</button>
              </form>
            </div>
          )}

        </main>
      </div>

      {/* ==================================================================== */}
      {/* MOBILE COMPACT BOTTOM DOCK (ACCOUNT & SETTINGS ON FAR-RIGHT)          */}
      {/* ==================================================================== */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t px-2 py-2 flex justify-around items-center shadow-lg no-print">
        {[
          { id: 'dashboard', l: t.navDashboard, icon: Icons.Dashboard },
          { id: 'customers', l: t.navCustomers, icon: Icons.Customers },
          { id: 'orders', l: t.navOrders, icon: Icons.Orders },
          { id: 'quotations', l: t.navQuotations, icon: Icons.Quotations },
          { id: 'settings', l: lang === 'hi' ? 'खाता / सेटिंग्स' : 'Account & Settings', icon: Icons.User, rightHub: true }
        ].map(n => {
          const Icon = n.icon;
          const act = activeTab === n.id;
          return (
            <button 
              key={n.id} 
              onClick={() => setActiveTab(n.id)} 
              className={`flex flex-col items-center py-1 px-2 rounded-xl transition ${
                act ? 'text-[#C9A04A] font-bold' : (n.rightHub ? 'text-[#101D35] font-semibold' : 'text-slate-400')
              }`}
            >
              <Icon c="w-4 h-4" />
              <span className="text-[10px] mt-1">{n.l}</span>
            </button>
          );
        })}
      </nav>

      {/* ==================================================================== */}
      {/* MODAL: ORDER CREATION                                                */}
      {/* ==================================================================== */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-2xl space-y-3">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="font-bold text-sm">{t.newOrder}</h3>
              <button onClick={() => setShowOrderModal(false)}><Icons.Close c="w-4 h-4" /></button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              const cust = customers.find(c => c.id === f.get('cId'));
              if (!cust) return alert('Select customer');

              const qty = Number(f.get('qty') || 1);
              const rate = Number(f.get('rate') || 0);
              const grandTotal = qty * rate;
              const advance = Number(f.get('advance') || 0);

              const ord = {
                id: 'ord_' + Date.now(),
                orderNumber: 'ORD-' + String(Date.now()).slice(-5),
                customerId: cust.id,
                customerName: cust.name,
                customerMobile: cust.mobile,
                orderDate: f.get('date'),
                items: [{ name: f.get('item'), qty, rate, total: grandTotal }],
                grandTotal,
                advancePaid: advance,
                remainingBalance: Math.max(0, grandTotal - advance),
                status: (grandTotal - advance) <= 0 ? 'paid' : (advance > 0 ? 'partial' : 'pending')
              };

              await DB.saveItem(bizId, 'orders', ord.id, ord, currentUser.uid);

              cust.totalPurchases = (cust.totalPurchases || 0) + grandTotal;
              cust.totalReceived = (cust.totalReceived || 0) + advance;
              cust.outstandingBalance = (cust.outstandingBalance || 0) + (grandTotal - advance);
              await DB.saveItem(bizId, 'customers', cust.id, cust, currentUser.uid);

              if (advance > 0) {
                const payReceipt = {
                  id: 'pay_' + Date.now(),
                  receiptNumber: 'REC-' + String(Date.now()).slice(-5),
                  orderId: ord.id,
                  orderNumber: ord.orderNumber,
                  customerId: cust.id,
                  customerName: cust.name,
                  amount: advance,
                  method: 'Cash',
                  date: ord.orderDate
                };
                await DB.saveItem(bizId, 'payments', payReceipt.id, payReceipt, currentUser.uid);
              }

              await reloadAll(bizId);
              setShowOrderModal(false);
            }} className="space-y-2.5">
              <select name="cId" required className="w-full text-xs p-2 rounded-xl border bg-white">
                <option value="">Select customer...</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <input name="item" required placeholder="Item / Product Name *" className="w-full text-xs p-2 rounded-xl border" />
              <div className="grid grid-cols-2 gap-2">
                <input name="qty" type="number" defaultValue="1" min="1" placeholder="Qty" className="text-xs p-2 rounded-xl border text-center" />
                <input name="rate" type="number" required placeholder="Rate (₹) *" className="text-xs p-2 rounded-xl border text-center" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input name="advance" type="number" defaultValue="0" placeholder="Advance (₹)" className="text-xs p-2 rounded-xl border" />
                <input name="date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} required className="text-xs p-2 rounded-xl border" />
              </div>
              <button type="submit" className="w-full py-2 bg-[#101D35] text-white font-bold text-xs rounded-xl shadow">{t.save}</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SUBSEQUENT PAYMENT */}
      {orderPaymentTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-2xl space-y-3">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="font-bold text-sm">Add Payment to Order</h3>
              <button onClick={() => setOrderPaymentTarget(null)}><Icons.Close c="w-4 h-4" /></button>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl text-xs space-y-1">
              <div className="flex justify-between"><span>Grand Total:</span><b>{formatINR(orderPaymentTarget.grandTotal)}</b></div>
              <div className="flex justify-between text-rose-600 font-bold"><span>Balance Due:</span><span>{formatINR(orderPaymentTarget.remainingBalance)}</span></div>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              const payAmt = Number(f.get('amt'));
              const method = f.get('method');
              await applyPaymentToOrder(orderPaymentTarget.id, payAmt, method);
              setOrderPaymentTarget(null);
            }} className="space-y-2.5">
              <input name="amt" type="number" defaultValue={orderPaymentTarget.remainingBalance} max={orderPaymentTarget.remainingBalance} required className="w-full text-xs p-2 rounded-xl border font-bold" />
              <select name="method" className="w-full text-xs p-2 rounded-xl border bg-white">
                <option value="Cash">Cash in Hand</option>
                <option value="Bank">Bank Transfer</option>
                <option value="UPI">UPI QR</option>
              </select>
              <button type="submit" className="w-full py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow">Confirm &amp; Clear</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CUSTOMER */}
      {showCustomerModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-2xl">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-sm">{t.addCustomer}</h3>
              <button onClick={() => setShowCustomerModal(false)}><Icons.Close c="w-4 h-4" /></button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              const newCust = {
                id: 'c_' + Date.now(),
                name: f.get('name'),
                mobile: f.get('mobile'),
                totalPurchases: 0,
                totalReceived: 0,
                outstandingBalance: 0
              };
              await DB.saveItem(bizId, 'customers', newCust.id, newCust, currentUser.uid);
              await reloadAll(bizId);
              setShowCustomerModal(false);
            }} className="space-y-2.5">
              <input name="name" required placeholder="Customer Name *" className="w-full text-xs p-2 rounded-xl border" />
              <input name="mobile" required placeholder="Mobile Number (10-Digit) *" className="w-full text-xs p-2 rounded-xl border" />
              <button type="submit" className="w-full py-2 bg-[#101D35] text-white font-bold text-xs rounded-xl shadow">{t.save}</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SUPPLIER */}
      {showSupplierModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-2xl">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-sm">{t.addSupplier}</h3>
              <button onClick={() => setShowSupplierModal(false)}><Icons.Close c="w-4 h-4" /></button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              const sup = {
                id: 'sup_' + Date.now(),
                name: f.get('name'),
                mobile: f.get('mobile'),
                category: f.get('category') || 'Supplies',
                payableBalance: Number(f.get('bal') || 0)
              };
              await DB.saveItem(bizId, 'suppliers', sup.id, sup, currentUser.uid);
              await reloadAll(bizId);
              setShowSupplierModal(false);
            }} className="space-y-2.5">
              <input name="name" required placeholder="Supplier Name *" className="w-full text-xs p-2 rounded-xl border" />
              <input name="mobile" required placeholder="Mobile / WhatsApp *" className="w-full text-xs p-2 rounded-xl border" />
              <input name="category" placeholder="Material Category" className="w-full text-xs p-2 rounded-xl border" />
              <input name="bal" type="number" defaultValue="0" placeholder="Opening Balance" className="w-full text-xs p-2 rounded-xl border" />
              <button type="submit" className="w-full py-2 bg-[#101D35] text-white font-bold text-xs rounded-xl shadow">{t.save}</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: QUOTATION */}
      {showQuotationModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl my-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-base">{t.newQuotation}</h3>
              <button onClick={() => setShowQuotationModal(false)}><Icons.Close c="w-5 h-5" /></button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              let cust = customers.find(c => c.id === f.get('cId'));

              if (!cust && f.get('inlineName')) {
                const newC = {
                  id: 'c_' + Date.now(),
                  name: f.get('inlineName'),
                  mobile: '9999999999',
                  totalPurchases: 0,
                  totalReceived: 0,
                  outstandingBalance: 0
                };
                await DB.saveItem(bizId, 'customers', newC.id, newC, currentUser.uid);
                cust = newC;
              }

              if (!cust) return alert("Select customer");
              const qty = Number(f.get('qty') || 1);
              const rate = Number(f.get('rate') || 0);
              const grandTotal = qty * rate;

              const qte = {
                id: 'q_' + Date.now(),
                quoteNumber: 'QTE-' + String(Date.now()).slice(-5),
                customerId: cust.id,
                customerName: cust.name,
                customerMobile: cust.mobile,
                quoteDate: new Date().toISOString().slice(0, 10),
                validUntil: f.get('valid'),
                items: [{ name: f.get('item'), qty, rate, total: grandTotal }],
                grandTotal,
                status: 'sent'
              };
              await DB.saveItem(bizId, 'quotations', qte.id, qte, currentUser.uid);
              await reloadAll(bizId);
              setShowQuotationModal(false);
            }} className="space-y-2.5">
              <select name="cId" className="w-full text-xs p-2 rounded-xl border bg-white">
                <option value="">Select customer...</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <input name="inlineName" placeholder="Or type new customer name directly..." className="w-full text-xs p-2 rounded-xl border bg-slate-50" />
              <input name="item" required placeholder="Quotation Item Description" className="w-full text-xs p-2 rounded-xl border" />
              <div className="grid grid-cols-2 gap-2">
                <input name="qty" type="number" defaultValue="1" min="1" placeholder="Qty" className="text-xs p-2 rounded-xl border text-center" />
                <input name="rate" type="number" required placeholder="Rate (₹)" className="text-xs p-2 rounded-xl border text-center" />
              </div>
              <input name="valid" type="date" defaultValue={new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10)} required className="w-full text-xs p-2 rounded-xl border" />
              <button type="submit" className="w-full py-2 bg-[#101D35] text-white font-bold text-xs rounded-xl shadow">{t.save}</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PAYMENT */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-2xl">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-sm">{t.recordPayment}</h3>
              <button onClick={() => setShowPaymentModal(false)}><Icons.Close c="w-4 h-4" /></button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              const cust = customers.find(c => c.id === f.get('cId'));
              if (!cust) return alert("Select customer");
              const amt = Number(f.get('amt'));

              const p = {
                id: 'pay_' + Date.now(),
                receiptNumber: 'REC-' + String(Date.now()).slice(-4),
                customerId: cust.id,
                customerName: cust.name,
                amount: amt,
                method: f.get('method'),
                date: f.get('date')
              };
              await DB.saveItem(bizId, 'payments', p.id, p, currentUser.uid);
              cust.totalReceived = (cust.totalReceived || 0) + amt;
              cust.outstandingBalance = Math.max(0, (cust.outstandingBalance || 0) - amt);
              await DB.saveItem(bizId, 'customers', cust.id, cust, currentUser.uid);

              await reloadAll(bizId);
              setShowPaymentModal(false);
            }} className="space-y-2.5">
              <select name="cId" required className="w-full text-xs p-2 rounded-xl border bg-white">
                <option value="">Select customer...</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name} (Due: {formatINR(c.outstandingBalance)})</option>)}
              </select>
              <div className="grid grid-cols-2 gap-2">
                <input name="amt" type="number" required placeholder="Amount (₹)" className="text-xs p-2 rounded-xl border" />
                <input name="date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} required className="text-xs p-2 rounded-xl border" />
              </div>
              <select name="method" className="w-full text-xs p-2 rounded-xl border bg-white">
                <option value="Cash">Cash in Hand</option>
                <option value="UPI">UPI / QR</option>
                <option value="Bank">Bank Transfer</option>
              </select>
              <button type="submit" className="w-full py-2 bg-[#101D35] text-white font-bold text-xs rounded-xl shadow">{t.save}</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EXPENSE */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-2xl">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-sm">{t.addExpense}</h3>
              <button onClick={() => setShowExpenseModal(false)}><Icons.Close c="w-4 h-4" /></button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              const exp = {
                id: 'exp_' + Date.now(),
                title: f.get('title'),
                category: f.get('category'),
                amount: Number(f.get('amt')),
                date: f.get('date')
              };
              await DB.saveItem(bizId, 'expenses', exp.id, exp, currentUser.uid);
              await reloadAll(bizId);
              setShowExpenseModal(false);
            }} className="space-y-2.5">
              <input name="title" required placeholder="Expense Title" className="w-full text-xs p-2 rounded-xl border" />
              <div className="grid grid-cols-2 gap-2">
                <select name="category" className="text-xs p-2 rounded-xl border bg-white">
                  <option value="Material">Material</option><option value="Rent">Rent</option><option value="Labour">Labour</option>
                </select>
                <input name="amt" type="number" required placeholder="Amount (₹)" className="text-xs p-2 rounded-xl border" />
              </div>
              <input name="date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} required className="w-full text-xs p-2 rounded-xl border" />
              <button type="submit" className="w-full py-2 bg-[#101D35] text-white font-bold text-xs rounded-xl shadow">{t.save}</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: LEDGER */}
      {selectedCustLedger && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-5 shadow-2xl flex flex-col max-h-[80vh]">
            <div className="flex justify-between items-start pb-2 border-b">
              <div>
                <h3 className="font-bold text-sm">{selectedCustLedger.name}</h3>
                <div className="text-[11px] text-slate-400">Account Ledger Statement</div>
              </div>
              <button onClick={() => setSelectedCustLedger(null)}><Icons.Close c="w-4 h-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto py-2 divide-y text-xs">
              <div className="p-2 bg-slate-50 flex justify-between font-bold mb-2">
                <span>Balance Due:</span>
                <span className="text-rose-600">{formatINR(selectedCustLedger.outstandingBalance)}</span>
              </div>
              {getCustomerLedger(selectedCustLedger.id).map(entry => (
                <div key={entry.id} className="py-2 flex justify-between">
                  <div>
                    <div className="font-bold">{entry.desc}</div>
                    <div className="text-[10px] text-slate-400">{formatDateIndian(entry.date)}</div>
                  </div>
                  <div className="text-right">
                    {entry.debit > 0 && <span className="font-bold text-rose-600 block">Dr: {formatINR(entry.debit)}</span>}
                    {entry.credit > 0 && <span className="font-bold
