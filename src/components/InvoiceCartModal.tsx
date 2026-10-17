import React, { useState } from 'react';
import {
  X,
  FileText,
  Printer,
  Send,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  CreditCard,
  Coins,
  Plus,
  Minus,
} from 'lucide-react';
import {
  ProductItem,
  MarketRates,
  calculateProductPrices,
  formatToman,
  formatForeign,
} from '../data/mockData';

export interface CartEntry {
  product: ProductItem;
  qty: number;
  customImei: string;
}

interface InvoiceCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartEntry[];
  onUpdateQty: (productId: string, delta: number) => void;
  onUpdateImei: (productId: string, imei: string) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  rates: MarketRates;
  tenantBrandName?: string;
  tenantManagerName?: string;
  tenantPhone?: string;
  tenantCity?: string;
  refAmbassadorCode?: string;
}

export const InvoiceCartModal: React.FC<InvoiceCartModalProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQty,
  onUpdateImei,
  onRemoveItem,
  onClearCart,
  rates,
  tenantBrandName,
  tenantManagerName,
  tenantPhone,
  tenantCity,
  refAmbassadorCode,
}) => {
  const [invoicePricingType, setInvoicePricingType] = useState<'wholesale' | 'retail'>('wholesale');
  const [settlementMethod, setSettlementMethod] = useState<'escrow' | 'sayadi' | 'crypto'>('escrow');
  const [buyerName, setBuyerName] = useState<string>('فروشگاه موبایل و دیجیتال آریا');
  const [buyerPhone, setBuyerPhone] = useState<string>('09120000000');
  const [buyerCity, setBuyerCity] = useState<string>('تهران / ارسال تیپاکس ویژه');

  if (!isOpen) return null;

  const totalToman = cart.reduce((acc, item) => {
    const pr = calculateProductPrices(item.product, rates);
    const unitPrice =
      invoicePricingType === 'wholesale' ? pr.wholesaleToman : pr.retailToman;
    return acc + unitPrice * item.qty;
  }, 0);

  const totalUsdtEquivalent = Math.round((totalToman / rates.USDT) * 100) / 100;
  const totalAedEquivalent = Math.round((totalToman / rates.AED) * 10) / 10;

  const settlementTitle =
    settlementMethod === 'escrow'
      ? '۱. سپر پرداخت امانی (ارسال تیپاکس و چاپار بیمه‌شده ۱۰۰٪)'
      : settlementMethod === 'sayadi'
      ? '۲. خرید چکی صیادی ویژه همکاران VIP (ثبت در سامانه صیاد بنفش)'
      : '۳. تسویه ارزی / تتر آنی (USDT TRC20 / حواله درهم دبی)';

  const handleSendInvoiceWhatsapp = () => {
    const lines = cart.map((entry, idx) => {
      const pr = calculateProductPrices(entry.product, rates);
      const unitPrice =
        invoicePricingType === 'wholesale' ? pr.wholesaleToman : pr.retailToman;
      return `${idx + 1}. ${entry.product.title}\n   تعداد: ${entry.qty} | فی: ${formatToman(
        unitPrice
      )} ت | سریال/IMEI: ${entry.customImei}\n   ضمانت: ${entry.product.warrantyText}`;
    });

    const activeHeaderBrand =
      tenantBrandName || 'آفرینا فی‌بان وی‌آی‌پی (Afrina FeeBan VIP)';
    const activeTargetPhone = (tenantPhone || '989120000000').replace(/[^0-9]/g, '');

    const text = [
      `🧾 *پیش‌فاکتور رسمی طلاکوب ${activeHeaderBrand}*`,
      tenantManagerName ? `👔 به مدیریت: ${tenantManagerName} (${tenantCity || 'تهران'})` : '',
      `نوع فاکتور: ${
        invoicePricingType === 'wholesale'
          ? 'همکار (عمده/کارتنی)'
          : 'مصرف‌کننده (با کد همتا و گارانتی ۱۸ ماهه)'
      }`,
      `👤 خریدار: ${buyerName} (${buyerCity})`,
      `📊 نرخ مبنای فاکتور — دلار: ${formatToman(rates.USD)} ت | درهم: ${formatToman(rates.AED)} ت`,
      `---`,
      ...lines,
      `---`,
      `💰 *مبلغ کل قابل پرداخت:* ${formatToman(totalToman)} تومان`,
      `💎 معادل ارزی: ${totalUsdtEquivalent} USDT | ${totalAedEquivalent} AED`,
      `🛡️ روش تسویه انتخابی: ${settlementTitle}`,
      `✅ دارای مهلت تست ۷ روزه قطعات تعمیراتی و ضمانت اصالت همتا`,
      refAmbassadorCode ? `🔖 کد سفیر و اصالت سامانه: ${refAmbassadorCode}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    const url = `https://wa.me/${activeTargetPhone || '989120000000'}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-2xl bg-[#0F1626] border border-slate-800 shadow-2xl overflow-hidden my-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800 no-print">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                سبد پیش‌فاکتور رسمی دیجیتال: {tenantBrandName || 'آفرینا فی‌بان (Afrina FeeBan VIP)'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {tenantManagerName ? `مدیریت: ${tenantManagerName} · ` : ''}صدور آنی فاکتور همکار یا مصرف‌کننده با کد سریال IMEI + چاپ رسمی A4 و ارسال به واتساپ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[82vh] overflow-y-auto">
          {/* Invoice Type & Buyer Info */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 no-print">
            <div className="lg:col-span-5 flex flex-col justify-between p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-amber-400">
                انتخاب سطح قیمت‌گذاری پیش‌فاکتور:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setInvoicePricingType('wholesale')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                    invoicePricingType === 'wholesale'
                      ? 'bg-amber-500 text-slate-950 border-amber-400'
                      : 'bg-slate-950 text-slate-300 border-slate-800'
                  }`}
                >
                  فاکتور کف همکار (عمده)
                </button>
                <button
                  onClick={() => setInvoicePricingType('retail')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                    invoicePricingType === 'retail'
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                      : 'bg-slate-950 text-slate-300 border-slate-800'
                  }`}
                >
                  فاکتور مصرف‌کننده (تک‌فروشی)
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-900/70 border border-slate-800">
              <div>
                <label className="block text-xs text-slate-400 mb-1">نام خریدار / فروشگاه همکار:</label>
                <input
                  type="text"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">تلفن همراه خریدار:</label>
                <input
                  type="text"
                  dir="ltr"
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white font-mono-num"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">شهر مقصد / نحوه تحویل:</label>
                <input
                  type="text"
                  value={buyerCity}
                  onChange={(e) => setBuyerCity(e.target.value)}
                  className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white"
                />
              </div>
            </div>
          </div>

          {/* Printable Official Header */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white">
                فاکتور رسمی فروش کالا و قطعات دیجیتال — DigiRate VIP
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                خریدار: {buyerName} · تلفن: {buyerPhone} · مقصد: {buyerCity}
              </p>
            </div>
            <div className="text-left font-mono-num text-xs text-slate-300">
              <div>نرخ مبنای دلار: {formatToman(rates.USD)} تومان</div>
              <div>نرخ مبنای درهم دبی: {formatToman(rates.AED)} تومان</div>
            </div>
          </div>

          {/* Items Table */}
          {cart.length === 0 ? (
            <div className="p-10 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
              <p className="text-sm text-slate-300 font-semibold">
                سبد پیش‌فاکتور شما در حال حاضر خالی است.
              </p>
              <p className="text-xs text-slate-500">
                از لیست محصولات صفحه اصلی، روی دکمه «افزودن به پیش‌فاکتور رسمی» کلیک کنید.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-900 text-slate-300 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">شرح کالا و گارانتی</th>
                    <th className="py-3 px-3">شماره سریال / IMEI</th>
                    <th className="py-3 px-3">پایه ارزی</th>
                    <th className="py-3 px-3">تعداد</th>
                    <th className="py-3 px-3">فی واحد (تومان)</th>
                    <th className="py-3 px-4">جمع ردیف (تومان)</th>
                    <th className="py-3 px-2 no-print">حذف</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 bg-slate-950/60">
                  {cart.map((entry) => {
                    const pr = calculateProductPrices(entry.product, rates);
                    const unitToman =
                      invoicePricingType === 'wholesale'
                        ? pr.wholesaleToman
                        : pr.retailToman;
                    const rowTotal = unitToman * entry.qty;

                    return (
                      <tr key={entry.product.id} className="hover:bg-slate-900/50">
                        <td className="py-3 px-4">
                          <div className="font-bold text-white text-sm">
                            {entry.product.title}
                          </div>
                          <div className="text-[11px] text-emerald-400 mt-0.5">
                            {entry.product.warrantyText}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="text"
                            dir="ltr"
                            value={entry.customImei}
                            onChange={(e) =>
                              onUpdateImei(entry.product.id, e.target.value)
                            }
                            className="w-36 rounded bg-slate-900 border border-slate-700 px-2 py-1 text-xs text-amber-300 font-mono-num"
                          />
                        </td>
                        <td className="py-3 px-3 font-mono-num text-slate-300">
                          {formatForeign(
                            entry.product.baseWholesaleForeign,
                            entry.product.baseCurrency
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => onUpdateQty(entry.product.id, -1)}
                              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-white no-print"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="font-bold text-sm font-mono-num px-2">
                              {entry.qty}
                            </span>
                            <button
                              onClick={() => onUpdateQty(entry.product.id, 1)}
                              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-white no-print"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-mono-num text-slate-200 font-semibold">
                          {formatToman(unitToman)}
                        </td>
                        <td className="py-3 px-4 font-mono-num text-amber-400 font-bold text-sm">
                          {formatToman(rowTotal)}
                        </td>
                        <td className="py-3 px-2 no-print">
                          <button
                            onClick={() => onRemoveItem(entry.product.id)}
                            className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* 3 Settlement Methods */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300">
              انتخاب روش تسویه و تضمین معامله (۳ روش رسمی DigiRate VIP):
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                onClick={() => setSettlementMethod('escrow')}
                className={`p-3.5 rounded-xl border text-right transition-all ${
                  settlementMethod === 'escrow'
                    ? 'bg-emerald-500/15 border-emerald-500 text-white'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs text-emerald-400 mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>۱. سپر پرداخت امانی (ارسال تیپاکس بیمه‌شده)</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  واریز وجه به حساب امانی سامانه؛ آزادسازی مبلغ برای بنکدار فقط پس از تحویل سلامت بار و تایید کد همتا/تست ۷ روزه قطعه.
                </p>
              </button>

              <button
                onClick={() => setSettlementMethod('sayadi')}
                className={`p-3.5 rounded-xl border text-right transition-all ${
                  settlementMethod === 'sayadi'
                    ? 'bg-amber-500/15 border-amber-500 text-white'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs text-amber-400 mb-1">
                  <CreditCard className="w-4 h-4" />
                  <span>۲. خرید چکی صیادی ویژه همکاران VIP</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  ویژه موبایل‌فروشان و پخش‌کنندگان دارای اشتراک VIP با چک صیادی بنفش (وضعیت سفید/زرد بانک مرکزی) تا سقف اعتبار مصوب.
                </p>
              </button>

              <button
                onClick={() => setSettlementMethod('crypto')}
                className={`p-3.5 rounded-xl border text-right transition-all ${
                  settlementMethod === 'crypto'
                    ? 'bg-sky-500/15 border-sky-500 text-white'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs text-sky-400 mb-1">
                  <Coins className="w-4 h-4" />
                  <span>۳. تسویه ارزی / تتر (USDT / درهم دبی)</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  تسویه مستقیم روی شبکه TRC20 بدون کارمزد تبدیل ریالی یا تحویل نقدی درهم در دفتر صرافی دیره دبی.
                </p>
              </button>
            </div>
          </div>

          {/* Summary & Actions */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center md:text-right">
              <div className="text-xs text-slate-400">
                جمع کل پیش‌فاکتور رسمی ({cart.reduce((s, i) => s + i.qty, 0)} قلم کالا):
              </div>
              <div className="text-2xl font-extrabold text-amber-400 font-mono-num">
                {formatToman(totalToman)} تومان
              </div>
              <div className="text-xs text-slate-400 font-mono-num">
                معادل ارزی دقیق: {totalUsdtEquivalent} USDT · یا {totalAedEquivalent} AED (درهم دبی)
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 no-print">
              {cart.length > 0 && (
                <button
                  onClick={onClearCart}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-semibold transition-colors cursor-pointer"
                >
                  پاکسازی سبد
                </button>
              )}
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>چاپ فاکتور رسمی A4</span>
              </button>
              <button
                onClick={handleSendInvoiceWhatsapp}
                disabled={cart.length === 0}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 text-xs font-extrabold transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>ارسال پیش‌فاکتور رسمی به واتساپ</span>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 pt-1">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              تمامی گوشی‌ها دارای کد فعال‌سازی رسمی سامانه همتا و ۱۸ ماه گارانتی شرکتی می‌باشند.
            </span>
            <span>
              مهلت تست تعویض قطعات تعمیراتی (LCD و باتری): ۷ روز کامل بدون قید و شرط.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
