import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom/client';

// Indian Rupee Currency Formatter
const formatINR = (amt) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amt || 0);
};

// DD-MM-YYYY Date Formatter
const formatDateIndian = (dateStr) => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
  return dateStr;
};

// Localization Translations (English & Hindi)
const translations = {
  en: {
    appName: "HISAB PRO",
    tagline: "Smart Business. Simple Hisab.",
    navHome: "Home",
    navCustomers: "Customers",
    navOrders: "Orders",
    navHisab: "Hisab",
    todaySales: "Today's Sales",
    monthlySales: "Monthly Sales",
    totalReceived: "Total Received",
    pendingPayment: "Pending Balance",
    totalExpenses: "Total Expenses",
    estimatedProfit: "Estimated Profit",
    newOrder: "New Order",
    addCustomer: "Add Customer",
    recordPayment: "Record Payment",
    addExpense: "Add Expense",
    recentOrders: "Recent Orders",
    ledger: "Account Ledger",
    shareWhatsApp: "WhatsApp",
    printInvoice: "Bill",
    save: "Save",
    cancel: "Cancel"
  },
  hi: {
    appName: "हिसाब प्रो",
    tagline: "स्मार्ट बिज़नेस. सरल हिसाब.",
    navHome: "होम",
    navCustomers: "ग्राहक",
    navOrders: "ऑर्डर्स",
    navHisab: "हिसाब",
    todaySales: "आज की बिक्री",
    monthlySales: "मासिक बिक्री",
    totalReceived: "कुल जमा (कैश)",
    pendingPayment: "बाकी रकम (उधारी)",
    totalExpenses: "कुल खर्चे",
    estimatedProfit: "अनुमानित मुनाफा",
    newOrder: "नया ऑर्डर",
    addCustomer: "नया ग्राहक",
    recordPayment: "रकम जमा करें",
    addExpense: "खर्चा दर्ज करें",
    recentOrders: "हालिया ऑर्डर्स",
    ledger: "खाता बही",
    shareWhatsApp: "WhatsApp",
    printInvoice: "बिल",
    save: "सुरक्षित करें",
    cancel: "रद्द करें"
  }
};

function HisabProApp() {
  const [lang, setLang] = useState('hi');
  const t = translations[lang];

  // Business Profile
  const [biz] = useState({
    id: 'BIZ_001',
    name: 'Bharat Udyog & Traders',
    tagline: 'Smart Business. Simple Hisab.',
    phone: '9820098200',
    email: 'contact@bharatudyog.in',
    gstin: '27AABCU9603R1ZM',
    address: 'Shop 14, APMC Market',
    city: 'Mumbai',
    state: 'Maharashtra'
  });

  const [tab, setTab] = useState('home');

  // Persistent State Management
  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('hp_customers');
    return saved ? JSON.parse(saved) : [
      { id: 'c1', name: 'रमेश पटेल (Patel Furnishings)', mobile: '9876543210', totalPurchases: 45000, totalReceived: 30000, outstandingBalance: 15000 },
      { id: 'c2', name: 'सुरेश शर्मा (Sharma Traders)', mobile: '9123456780', totalPurchases: 25000, totalReceived: 25000, outstandingBalance: 0 }
    ];
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('hp_orders');
    return saved ? JSON.parse(saved) : [
      { id: 'o1', orderNumber: 'ORD-101', customerId: 'c1', customerName: 'रमेश पटेल', customerMobile: '9876543210', orderDate: '2026-03-30', items: [{ name: 'Teak Wood Table', qty: 1, rate: 15000, total: 15000 }], grandTotal: 15000, advancePaid: 5000, remainingBalance: 10000 },
      { id: 'o2', orderNumber: 'ORD-102', customerId: 'c2', customerName: 'सुरेश शर्मा', customerMobile: '9123456780', orderDate: '2026-03-31', items: [{ name: 'Office Chairs (x4)', qty: 4, rate: 6250, total: 25000 }], grandTotal: 25000, advancePaid: 25000, remainingBalance: 0 }
    ];
  });

  const [payments, setPayments] = useState(() => {
    const saved = localStorage.getItem('hp_payments');
    return saved ? JSON.parse(saved) : [
      { id: 'p1', receiptNumber: 'REC-501', customerId: 'c1', customerName: 'रमेश पटेल', amount: 5000, method: 'cash', date: '2026-03-30', notes: 'Advance Payment' }
    ];
  });

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('hp_expenses');
    return saved ? JSON.parse(saved) : [
      { id: 'e1', title: 'दुकान का किराया (Shop Rent)', category: 'Rent', amount: 12000, date: '2026-03-25', isPersonal: false },
      { id: 'e2', title: 'प्लाईवुड मटेरियल (Material)', category: 'Material', amount: 8500, date: '2026-03-28', isPersonal: false }
    ];
  });

  const [accounts, setAccounts] = useState(() => {
    const saved = localStorage.getItem('hp_accounts');
    return saved ? JSON.parse(saved) : [
      { id: 'acc_cash', name: 'Cash in Hand (गल्ला)', currentBalance: 15000 },
      { id: 'acc_bank', name: 'Current Bank A/C', currentBalance: 85000 },
      { id: 'acc_upi', name: 'Shop UPI QR', currentBalance: 12000 }
    ];
  });

  // Sync with Local Storage
  useEffect(() => { localStorage.setItem('hp_customers', JSON.stringify(customers)); }, [customers]);
  useEffect(() => { localStorage.setItem('hp_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('hp_payments', JSON.stringify(payments)); }, [payments]);
  useEffect(() => { localStorage.setItem('hp_expenses', JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { localStorage.setItem('hp_accounts', JSON.stringify(accounts)); }, [accounts]);

  // Modals
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [selectedLedgerCust, setSelectedLedgerCust] = useState(null);
  const [activeInvoice, setActiveInvoice] = useState(null);

  // Computed Financial Metrics
  const metrics = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const todaySales = orders.filter(o => o.orderDate === today).reduce((sum, o) => sum + o.grandTotal, 0);
    const totalSales = orders.reduce((sum, o) => sum + o.grandTotal, 0);
    const totalReceived = payments.reduce((sum, p) => sum + p.amount, 0) + orders.reduce((sum, o) => sum + (o.advancePaid || 0), 0);
    const pendingDue = customers.reduce((sum, c) => sum + (c.outstandingBalance || 0), 0);
    const totalExp = expenses.filter(e => !e.isPersonal).reduce((sum, e) => sum + e.amount, 0);
    const estimatedProfit = totalSales - totalExp;

    return { todaySales, totalSales, totalReceived, pendingDue, totalExp, estimatedProfit };
  }, [orders, payments, customers, expenses]);

  // WhatsApp Formatted Bill Sender
  const sendWhatsApp = (order) => {
    const text = `*INVOICE: ${order.orderNumber}*\nनमस्ते ${order.customerName} जी,\n*${biz.name}* से आपकी खरीदारी का विवरण:\n\n*सामान:* ${order.items ? order.items.map(i => i.name).join(', ') : 'Order'}\n*कुल बिल:* ${formatINR(order.grandTotal)}\n*जमा राशि:* ${formatINR(order.advancePaid)}\n*बाकी उधारी (Due):* ${formatINR(order.remainingBalance)}\n\nधन्यवाद! संपर्क: ${biz.phone}`;
    window.open(`https://wa.me/91${order.customerMobile.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Generate Customer Ledger
  const getCustomerLedger = (custId) => {
    const custOrders = orders.filter(o => o.customerId === custId);
    const custPayments = payments.filter(p => p.customerId === custId);
    const entries = [];

    custOrders.forEach(o => {
      entries.push({
        id: 'ord_' + o.id,
        date: o.orderDate,
        desc: `ऑर्डर ${o.orderNumber}`,
        debit: o.grandTotal,
        credit: 0
      });
      if (o.advancePaid > 0) {
        entries.push({
          id: 'adv_' + o.id,
          date: o.orderDate,
          desc: `एडवांस जमा (${o.orderNumber})`,
          debit: 0,
          credit: o.advancePaid
        });
      }
    });

    custPayments.forEach(p => {
      entries.push({
        id: 'pay_' + p.id,
        date: p.date,
        desc: `रकम जमा (${p.method.toUpperCase()})`,
        debit: 0,
        credit: p.amount
      });
    });

    entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    let bal = 0;
    entries.forEach(e => {
      bal += (e.debit - e.credit);
      e.runningBalance = bal;
    });
    return entries.reverse();
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-slate-900 pb-24 font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-[#142B4A] text-white px-4 py-3 shadow-md flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#D4A63A] text-[#142B4A] font-black flex items-center justify-center text-lg shadow-sm">
            H
          </div>
          <div>
            <div className="font-bold text-sm tracking-tight leading-none">{biz.name}</div>
            <div className="text-[10px] text-slate-300 mt-0.5">{t.tagline}</div>
          </div>
        </div>
        <button
          onClick={() => setLang(l => l === 'hi' ? 'en' : 'hi')}
          className="text-xs px-2.5 py-1 rounded-full border border-slate-500 bg-white/10 font-bold active:scale-95 transition"
        >
          {lang === 'hi' ? 'English' : '🇮🇳 हिंदी'}
        </button>
      </header>

      {/* Main Body */}
      <main className="max-w-md mx-auto p-4 space-y-4">
        {/* --- TAB: HOME --- */}
        {tab === 'home' && (
          <>
            {/* Quick Action Buttons */}
            <div className="grid grid-cols-4 gap-2">
              <button onClick={() => setShowOrderModal(true)} className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-center active:scale-95 transition">
                <span className="text-xl mb-1">📝</span>
                <span className="text-[10px] font-bold text-slate-800">{t.newOrder}</span>
              </button>
              <button onClick={() => setShowCustomerModal(true)} className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-center active:scale-95 transition">
                <span className="text-xl mb-1">👤</span>
                <span className="text-[10px] font-bold text-slate-800">{t.addCustomer}</span>
              </button>
              <button onClick={() => setShowPaymentModal(true)} className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-center active:scale-95 transition">
                <span className="text-xl mb-1">💵</span>
                <span className="text-[10px] font-bold text-slate-800">{t.recordPayment}</span>
              </button>
              <button onClick={() => setShowExpenseModal(true)} className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-center active:scale-95 transition">
                <span className="text-xl mb-1">📉</span>
                <span className="text-[10px] font-bold text-slate-800">{t.addExpense}</span>
              </button>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm">
                <div className="text-[11px] text-slate-500 font-semibold">{t.todaySales}</div>
                <div className="text-lg font-black text-slate-900 mt-1">{formatINR(metrics.todaySales)}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">कुल बिक्री: {formatINR(metrics.totalSales)}</div>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm">
                <div className="text-[11px] text-emerald-600 font-semibold">{t.totalReceived}</div>
                <div className="text-lg font-black text-emerald-600 mt-1">{formatINR(metrics.totalReceived)}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">कैश जमा</div>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm">
                <div className="text-[11px] text-rose-600 font-semibold">{t.pendingPayment}</div>
                <div className="text-lg font-black text-rose-600 mt-1">{formatINR(metrics.pendingDue)}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">मार्केट उधारी</div>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm border-l-4 border-l-[#D4A63A]">
                <div className="text-[11px] text-amber-700 font-semibold">{t.estimatedProfit}*</div>
                <div className="text-lg font-black text-[#142B4A] mt-1">{formatINR(metrics.estimatedProfit)}</div>
                <div className="text-[9px] text-slate-400 mt-0.5 leading-tight">*बिक्री माइनस खर्चे</div>
              </div>
            </div>

            {/* Recent Orders List */}
            <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
              <div className="px-4 py-3 bg-slate-50/70 border-b border-slate-100 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">{t.recentOrders}</span>
                <button onClick={() => setTab('orders')} className="text-xs text-blue-800 font-bold hover:underline">
                  सभी देखें
                </button>
              </div>
              <div className="divide-y divide-slate-100">
                {orders.map(o => (
                  <div key={o.id} className="p-3.5 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-slate-900">{o.customerName}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{o.orderNumber} • {formatDateIndian(o.orderDate)}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-xs text-slate-900">{formatINR(o.grandTotal)}</div>
                      <div className="flex justify-end gap-1.5 mt-1">
                        <button onClick={() => setActiveInvoice(o)} className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-bold hover:bg-slate-200">
                          बिल
                        </button>
                        <button onClick={() => sendWhatsApp(o)} className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded font-bold hover:bg-emerald-700">
                          WhatsApp
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* --- TAB: CUSTOMERS & LEDGER --- */}
        {tab === 'customers' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold text-slate-900">{t.navCustomers}</h2>
              <button onClick={() => setShowCustomerModal(true)} className="px-3 py-1.5 bg-[#142B4A] text-white text-xs font-bold rounded-xl shadow-sm">
                + {t.addCustomer}
              </button>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200/80 divide-y divide-slate-100 shadow-sm overflow-hidden">
              {customers.map(c => (
                <div key={c.id} className="p-3.5 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-xs text-slate-900">{c.name}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">📱 {c.mobile}</div>
                  </div>
                  <div className="text-right flex items-center gap-2.5">
                    <div>
                      <div className="text-[10px] text-slate-400">बाकी</div>
                      <div className={`font-bold text-xs ${c.outstandingBalance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {formatINR(c.outstandingBalance)}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedLedgerCust(c)}
                      className="text-[10px] border border-slate-300 px-2.5 py-1 rounded-lg font-bold hover:bg-slate-50"
                    >
                      {t.ledger}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB: ORDERS --- */}
        {tab === 'orders' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold text-slate-900">{t.navOrders}</h2>
              <button onClick={() => setShowOrderModal(true)} className="px-3 py-1.5 bg-[#142B4A] text-white text-xs font-bold rounded-xl shadow-sm">
                + {t.newOrder}
              </button>
            </div>
            <div className="space-y-2">
              {orders.map(o => (
                <div key={o.id} className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm flex justify-between items-center">
                  <div>
                    <div className="font-bold text-xs text-slate-900">{o.customerName}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{o.orderNumber} • {formatDateIndian(o.orderDate)}</div>
                    <div className="text-[11px] text-rose-600 font-semibold mt-0.5">बकाया: {formatINR(o.remainingBalance)}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-xs text-slate-900">{formatINR(o.grandTotal)}</div>
                    <div className="flex gap-1.5 mt-2">
                      <button onClick={() => setActiveInvoice(o)} className="text-xs bg-slate-100 px-2.5 py-1 rounded-lg font-bold hover:bg-slate-200">
                        बिल
                      </button>
                      <button onClick={() => sendWhatsApp(o)} className="text-xs bg-emerald-600 text-white px-2.5 py-1 rounded-lg font-bold hover:bg-emerald-700">
                        WhatsApp
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB: HISAB (EXPENSES & ACCOUNTS) --- */}
        {tab === 'hisab' && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {accounts.map(acc => (
                <div key={acc.id} className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm text-center">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">{acc.name}</div>
                  <div className="text-sm font-black text-slate-900 mt-1">{formatINR(acc.currentBalance)}</div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
              <div className="px-4 py-3 bg-slate-50/70 border-b border-slate-100 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">{t.totalExpenses}</span>
                <button onClick={() => setShowExpenseModal(true)} className="text-xs bg-[#142B4A] text-white px-2.5 py-1 rounded-lg font-bold">
                  + Add
                </button>
              </div>
              <div className="divide-y divide-slate-100">
                {expenses.map(e => (
                  <div key={e.id} className="p-3 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-xs text-slate-900">{e.title}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{e.category} • {formatDateIndian(e.date)}</div>
                    </div>
                    <div className="font-bold text-xs text-rose-600">-{formatINR(e.amount)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* --- MODAL: CREATE ORDER --- */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-2xl">
            <h3 className="font-bold text-sm text-slate-900 mb-3">{t.newOrder}</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              const custId = f.get('custId');
              const cust = customers.find(c => c.id === custId);
              if (!cust) return alert('Select customer');

              const rate = Number(f.get('rate') || 0);
              const qty = Number(f.get('qty') || 1);
              const taxPct = Number(f.get('tax') || 0);
              const subtotal = rate * qty;
              const taxAmt = (subtotal * taxPct) / 100;
              const grandTotal = subtotal + taxAmt;
              const advance = Number(f.get('advance') || 0);

              const order = {
                id: 'ord_' + Date.now(),
                orderNumber: 'ORD-' + String(Date.now()).slice(-4),
                customerId: cust.id,
                customerName: cust.name,
                customerMobile: cust.mobile,
                orderDate: f.get('date'),
                items: [{ name: f.get('item'), qty, rate, total: grandTotal }],
                subtotal,
                taxTotal: taxAmt,
                grandTotal,
                advancePaid: advance,
                remainingBalance: Math.max(0, grandTotal - advance)
              };

              setOrders([order, ...orders]);
              setCustomers(customers.map(c => c.id === cust.id ? {
                ...c,
                totalPurchases: c.totalPurchases + grandTotal,
                totalReceived: c.totalReceived + advance,
                outstandingBalance: c.outstandingBalance + (grandTotal - advance)
              } : c));

              setShowOrderModal(false);
            }} className="space-y-2.5">
              <select name="custId" required className="w-full border rounded-xl px-3 py-2 text-xs bg-white">
                <option value="">ग्राहक चुनें...</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <input name="item" required placeholder="सामान का नाम (Product Name)" className="w-full border rounded-xl px-3 py-2 text-xs outline-none" />
              <div className="grid grid-cols-3 gap-2">
                <input name="qty" type="number" defaultValue="1" min="1" placeholder="Qty" className="border rounded-xl px-2 py-2 text-xs text-center" />
                <input name="rate" type="number" required placeholder="Rate (₹)" className="border rounded-xl px-2 py-2 text-xs text-center" />
                <select name="tax" className="border rounded-xl px-1 py-2 text-xs bg-white text-center">
                  <option value="0">0% GST</option>
                  <option value="5">5%</option>
                  <option value="12">12%</option>
                  <option value="18">18%</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input name="advance" type="number" defaultValue="0" placeholder="एडवांस (₹)" className="border rounded-xl px-3 py-2 text-xs" />
                <input name="date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} required className="border rounded-xl px-2 py-2 text-xs" />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowOrderModal(false)} className="flex-1 py-2 text-xs font-semibold bg-slate-100 rounded-xl">{t.cancel}</button>
                <button type="submit" className="flex-1 py-2 text-xs font-bold text-white bg-[#142B4A] rounded-xl shadow">{t.save}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: ADD CUSTOMER --- */}
      {showCustomerModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-2xl">
            <h3 className="font-bold text-sm text-slate-900 mb-3">{t.addCustomer}</h3>
            <form onSubmit={(e) => {
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
              setCustomers([newCust, ...customers]);
              setShowCustomerModal(false);
            }} className="space-y-2.5">
              <input name="name" required placeholder="ग्राहक का नाम (Customer Name) *" className="w-full border rounded-xl px-3 py-2 text-xs outline-none" />
              <input name="mobile" required placeholder="मोबाइल नंबर (10 Digits) *" className="w-full border rounded-xl px-3 py-2 text-xs outline-none" />
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowCustomerModal(false)} className="flex-1 py-2 text-xs font-semibold bg-slate-100 rounded-xl">{t.cancel}</button>
                <button type="submit" className="flex-1 py-2 text-xs font-bold text-white bg-[#142B4A] rounded-xl shadow">{t.save}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: RECORD PAYMENT --- */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-2xl">
            <h3 className="font-bold text-sm text-slate-900 mb-3">{t.recordPayment}</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              const custId = f.get('custId');
              const cust = customers.find(c => c.id === custId);
              if (!cust) return alert('Select customer');

              const amount = Number(f.get('amount'));
              const pay = {
                id: 'pay_' + Date.now(),
                receiptNumber: 'REC-' + String(Date.now()).slice(-4),
                customerId: cust.id,
                customerName: cust.name,
                amount: amount,
                method: f.get('method'),
                date: f.get('date'),
                notes: f.get('notes')
              };

              setPayments([pay, ...payments]);
              setCustomers(customers.map(c => c.id === cust.id ? {
                ...c,
                totalReceived: c.totalReceived + amount,
                outstandingBalance: Math.max(0, c.outstandingBalance - amount)
              } : c));

              setShowPaymentModal(false);
            }} className="space-y-2.5">
              <select name="custId" required className="w-full border rounded-xl px-3 py-2 text-xs bg-white">
                <option value="">ग्राहक चुनें...</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name} (बाकी: {formatINR(c.outstandingBalance)})</option>)}
              </select>
              <div className="grid grid-cols-2 gap-2">
                <input name="amount" type="number" required placeholder="रकम (₹)" className="border rounded-xl px-3 py-2 text-xs" />
                <input name="date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} required className="border rounded-xl px-2 py-2 text-xs" />
              </div>
              <select name="method" className="w-full border rounded-xl px-3 py-2 text-xs bg-white">
                <option value="cash">नकद (Cash)</option>
                <option value="upi">UPI / QR Code</option>
                <option value="bank_transfer">बैंक ट्रांसफर</option>
              </select>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowPaymentModal(false)} className="flex-1 py-2 text-xs font-semibold bg-slate-100 rounded-xl">{t.cancel}</button>
                <button type="submit" className="flex-1 py-2 text-xs font-bold text-white bg-[#142B4A] rounded-xl shadow">{t.save}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: RECORD EXPENSE --- */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-2xl">
            <h3 className="font-bold text-sm text-slate-900 mb-3">{t.addExpense}</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              const exp = {
                id: 'exp_' + Date.now(),
                title: f.get('title'),
                category: f.get('category'),
                amount: Number(f.get('amount')),
                date: f.get('date'),
                isPersonal: false
              };
              setExpenses([exp, ...expenses]);
              setShowExpenseModal(false);
            }} className="space-y-2.5">
              <input name="title" required placeholder="खर्चे का नाम (e.g. दुकान किराया)" className="w-full border rounded-xl px-3 py-2 text-xs outline-none" />
              <div className="grid grid-cols-2 gap-2">
                <input name="amount" type="number" required placeholder="रकम (₹)" className="border rounded-xl px-3 py-2 text-xs" />
                <select name="category" className="border rounded-xl px-2 py-2 text-xs bg-white">
                  <option value="Rent">किराया (Rent)</option>
                  <option value="Material">सामान (Material)</option>
                  <option value="Labour">मजदूरी (Labour)</option>
                  <option value="Electricity">बिजली बिल</option>
                  <option value="Transport">भाड़ा (Transport)</option>
                </select>
              </div>
              <input name="date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} required className="w-full border rounded-xl px-3 py-2 text-xs" />
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowExpenseModal(false)} className="flex-1 py-2 text-xs font-semibold bg-slate-100 rounded-xl">{t.cancel}</button>
                <button type="submit" className="flex-1 py-2 text-xs font-bold text-white bg-[#142B4A] rounded-xl shadow">{t.save}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: CUSTOMER LEDGER --- */}
      {selectedLedgerCust && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-2xl flex flex-col max-h-[80vh]">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div>
                <div className="font-bold text-sm text-slate-900">{selectedLedgerCust.name}</div>
                <div className="text-[10px] text-slate-400">खाता बही (Ledger)</div>
              </div>
              <button onClick={() => setSelectedLedgerCust(null)} className="text-slate-400 hover:text-slate-700 font-bold text-base">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 my-2">
              {getCustomerLedger(selectedLedgerCust.id).map(e => (
                <div key={e.id} className="py-2.5 flex justify-between items-center text-xs">
                  <div>
                    <div className="font-semibold text-slate-800">{e.desc}</div>
                    <div className="text-[10px] text-slate-400">{formatDateIndian(e.date)}</div>
                  </div>
                  <div className="text-right">
                    {e.debit > 0 && <span className="font-bold text-rose-600 block">Dr: {formatINR(e.debit)}</span>}
                    {e.credit > 0 && <span className="font-bold text-emerald-600 block">Cr: {formatINR(e.credit)}</span>}
                    <div className="text-[10px] text-slate-400">बाकी: {formatINR(e.runningBalance)}</div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setSelectedLedgerCust(null)} className="w-full py-2 bg-slate-100 rounded-xl font-bold text-xs text-slate-700">
              बंद करें
            </button>
          </div>
        </div>
      )}

      {/* --- MODAL: TAX INVOICE & WHATSAPP --- */}
      {activeInvoice && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-2xl text-xs space-y-3">
            <div className="border-b border-slate-200 pb-2 flex justify-between items-start">
              <div>
                <div className="font-black text-sm text-[#142B4A]">{biz.name}</div>
                <div className="text-[10px] text-slate-500">Ph: {biz.phone} | GST: {biz.gstin}</div>
              </div>
              <span className="text-[10px] font-bold bg-[#D4A63A]/20 text-[#142B4A] px-2 py-0.5 rounded">TAX BILL</span>
            </div>
            <div>
              <div className="text-[10px] text-slate-400">ग्राहक (Billed To):</div>
              <div className="font-bold text-slate-900">{activeInvoice.customerName} ({activeInvoice.customerMobile})</div>
            </div>
            <div className="border-t border-b border-slate-100 py-2 space-y-1">
              {activeInvoice.items ? activeInvoice.items.map((it, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>{it.name} (x{it.qty || 1})</span>
                  <span className="font-bold">{formatINR(it.total)}</span>
                </div>
              )) : (
                <div className="flex justify-between">
                  <span>Order Items</span>
                  <span className="font-bold">{formatINR(activeInvoice.grandTotal)}</span>
                </div>
              )}
            </div>
            <div className="text-right space-y-0.5">
              <div>कुल योग: <b>{formatINR(activeInvoice.grandTotal)}</b></div>
              <div className="text-emerald-600">एडवांस मिला: <b>{formatINR(activeInvoice.advancePaid)}</b></div>
              <div className="text-rose-600 font-black text-sm pt-1 border-t border-slate-100">
                बाकी रकम: {formatINR(activeInvoice.remainingBalance)}
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => sendWhatsApp(activeInvoice)} className="flex-1 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs shadow">
                WhatsApp भेजें
              </button>
              <button onClick={() => setActiveInvoice(null)} className="px-4 py-2 bg-slate-100 rounded-xl font-bold text-xs text-slate-600">
                बंद करें
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- BOTTOM DOCK NAVIGATION --- */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200/80 px-3 py-1.5 flex justify-around items-center shadow-lg">
        <button onClick={() => setTab('home')} className={`flex flex-col items-center py-1 transition ${tab === 'home' ? 'text-[#D4A63A] font-bold' : 'text-slate-400'}`}>
          <span className="text-lg">🏠</span>
          <span className="text-[10px] mt-0.5">{t.navHome}</span>
        </button>
        <button onClick={() => setTab('customers')} className={`flex flex-col items-center py-1 transition ${tab === 'customers' ? 'text-[#D4A63A] font-bold' : 'text-slate-400'}`}>
          <span className="text-lg">👥</span>
          <span className="text-[10px] mt-0.5">{t.navCustomers}</span>
        </button>
        <button onClick={() => setTab('orders')} className={`flex flex-col items-center py-1 transition ${tab === 'orders' ? 'text-[#D4A63A] font-bold' : 'text-slate-400'}`}>
          <span className="text-lg">📦</span>
          <span className="text-[10px] mt-0.5">{t.navOrders}</span>
        </button>
        <button onClick={() => setTab('hisab')} className={`flex flex-col items-center py-1 transition ${tab === 'hisab' ? 'text-[#D4A63A] font-bold' : 'text-slate-400'}`}>
          <span className="text-lg">⚖️</span>
          <span className="text-[10px] mt-0.5">{t.navHisab}</span>
        </button>
      </nav>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HisabProApp />
  </React.StrictMode>
);
