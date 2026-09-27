import React, { useState, useMemo } from 'react';
import {
  X,
  Calculator,
  RefreshCw,
  CheckCircle2,
  Send,
  Smartphone,
  BatteryCharging,
  ShieldCheck,
} from 'lucide-react';
import {
  ProductItem,
  MarketRates,
  USED_PHONE_MODELS,
  calculateProductPrices,
  formatToman,
} from '../data/mockData';

interface InstallmentTradeInModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: ProductItem[];
  rates: MarketRates;
  initialProduct?: ProductItem | null;
  initialTab?: 'installment' | 'tradein';
}

export const InstallmentTradeInModal: React.FC<InstallmentTradeInModalProps> = ({
  isOpen,
  onClose,
  products,
  rates,
  initialProduct,
  initialTab = 'installment',
}) => {
  const [activeTab, setActiveTab] = useState<'installment' | 'tradein'>(initialTab);
  const [selectedProductId, setSelectedProductId] = useState<string>(
    initialProduct?.id || products[0]?.id || ''
  );

  // Installment state
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(30);
  const [months, setMonths] = useState<number>(6);
  const [monthlyWagePercent, setMonthlyWagePercent] = useState<number>(3.5);
  const [customerName, setCustomerName] = useState<string>('');
  const [storeWhatsapp, setStoreWhatsapp] = useState<string>('989120000000');

  // Trade-In state
  const [usedModelId, setUsedModelId] = useState<string>(USED_PHONE_MODELS[0].id);
  const [batteryHealth, setBatteryHealth] = useState<number>(89);
  const [bodyCondition, setBodyCondition] = useState<'clean' | 'minor' | 'repair'>('clean');
  const [hasOriginalBoxAndHamta, setHasOriginalBoxAndHamta] = useState<boolean>(true);

  const selectedProduct = useMemo(
    () => products.find((p) => p.id === selectedProductId) || products[0],
    [products, selectedProductId]
  );

  const productPricing = useMemo(
    () => calculateProductPrices(selectedProduct, rates),
    [selectedProduct, rates]
  );

  // Installment Math
  const installmentCalc = useMemo(() => {
    const cashPrice = productPricing.retailToman;
    const downPayment = Math.round((cashPrice * (downPaymentPercent / 100)) / 10000) * 10000;
    const remainingPrincipal = cashPrice - downPayment;
    const totalInterest = Math.round(remainingPrincipal * (monthlyWagePercent / 100) * months);
    const totalPayable = remainingPrincipal + totalInterest;
    const eachMonthAmount = Math.round(totalPayable / months / 10000) * 10000;
    const finalTotalCost = downPayment + eachMonthAmount * months;

    return {
      cashPrice,
      downPayment,
      remainingPrincipal,
      totalInterest,
      eachMonthAmount,
      finalTotalCost,
    };
  }, [productPricing, downPaymentPercent, months, monthlyWagePercent]);

  // Trade-In Math
  const tradeInCalc = useMemo(() => {
    const usedRef =
      USED_PHONE_MODELS.find((u) => u.id === usedModelId) || USED_PHONE_MODELS[0];
    const rawCleanToman = usedRef.baseCleanUsdValue * rates.USD;

    // Battery factor
    let batteryMultiplier = 1;
    if (batteryHealth >= 90) batteryMultiplier = 1;
    else if (batteryHealth >= 85) batteryMultiplier = 0.95;
    else if (batteryHealth >= 80) batteryMultiplier = 0.89;
    else batteryMultiplier = 0.81;

    // Body condition factor
    let conditionMultiplier = 1;
    if (bodyCondition === 'clean') conditionMultiplier = 1;
    else if (bodyCondition === 'minor') conditionMultiplier = 0.91;
    else conditionMultiplier = 0.78;

    // Box & Hamta factor
    const boxMultiplier = hasOriginalBoxAndHamta ? 1 : 0.85;

    const estimatedUsedValue =
      Math.round((rawCleanToman * batteryMultiplier * conditionMultiplier * boxMultiplier) / 50000) *
      50000;

    const newDevicePrice = productPricing.retailToman;
    const cashDifference = Math.max(0, newDevicePrice - estimatedUsedValue);
    const sixMonthCheckPerMonth =
      Math.round(((cashDifference * (1 + 0.035 * 6)) / 6) / 10000) * 10000;

    return {
      usedRef,
      estimatedUsedValue,
      newDevicePrice,
      cashDifference,
      sixMonthCheckPerMonth,
    };
  }, [usedModelId, batteryHealth, bodyCondition, hasOriginalBoxAndHamta, rates.USD, productPricing]);

  if (!isOpen) return null;

  const sendInstallmentToWhatsapp = () => {
    const text = [
      `📋 *پیش‌فاکتور فروش اقساطی با چک صیادی (DigiRate VIP)*`,
      customerName ? `👤 نام خریدار: ${customerName}` : '',
      `📱 مدل دستگاه: ${selectedProduct.title}`,
      `🛡️ گارانتی: ${selectedProduct.warrantyText}`,
      `💵 قیمت نقدی روز: ${formatToman(installmentCalc.cashPrice)} تومان`,
      `✅ پیش‌پرداخت نقدی (${downPaymentPercent}%): ${formatToman(installmentCalc.downPayment)} تومان`,
      `📅 تعداد اقساط: ${months} ماهه با چک صیادی بنفش`,
      `💳 مبلغ هر قسط ماهانه: ${formatToman(installmentCalc.eachMonthAmount)} تومان`,
      `💎 جمع کل تمام‌شده اقساطی: ${formatToman(installmentCalc.finalTotalCost)} تومان`,
      `---`,
      `صادر شده توسط سامانه هوشمند DigiRate VIP`,
    ]
      .filter(Boolean)
      .join('\n');

    const url = `https://wa.me/${storeWhatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const sendTradeInToWhatsapp = () => {
    const condLabel =
      bodyCondition === 'clean'
        ? 'در حد آکبند (بدون خط‌وخش)'
        : bodyCondition === 'minor'
        ? 'خط‌وخش جزئی دور شاسی'
        : 'نیاز به سرویس/تعویض باتری';

    const text = [
      `🔄 *درخواست معاوضه گوشی کارکرده با آکبند (طرح Trade-In)*`,
      `📱 گوشی فعلی مشتری: ${tradeInCalc.usedRef.modelName} (${tradeInCalc.usedRef.storage})`,
      `🔋 سلامت باتری: ${batteryHealth}% | وضعیت ظاهری: ${condLabel}`,
      `📦 جعبه و انتقال مالکیت همتا: ${hasOriginalBoxAndHamta ? 'دارد (تکمیل)' : 'ندارد'}`,
      `💰 ارزش کارشناسی خرید گوشی کارکرده: ${formatToman(tradeInCalc.estimatedUsedValue)} تومان`,
      `---`,
      `🚀 *گوشی آکبند انتخابی جهت ارتقا:* ${selectedProduct.title}`,
      `💵 قیمت روز دستگاه جدید: ${formatToman(tradeInCalc.newDevicePrice)} تومان`,
      `⚡ *مابه‌التفاوت نقدی قابل پرداخت:* ${formatToman(tradeInCalc.cashDifference)} تومان`,
      `📝 یا پرداخت مابه‌التفاوت در ۶ چک صیادی ماهانه: هر ماه ${formatToman(tradeInCalc.sixMonthCheckPerMonth)} تومان`,
    ].join('\n');

    const url = `https://wa.me/${storeWhatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl bg-[#0F1626] border border-slate-800 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900/90 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                ماشین‌حساب دوگانه فروش اقساطی چک صیادی + طرح تعویض گوشی کارکرده (Trade-In)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                محاسبه دقیق بر اساس نرخ لحظه‌ای امروز (دلار: {formatToman(rates.USD)} · درهم: {formatToman(rates.AED)} تومان)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="بستن"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Segmented Tabs */}
        <div className="px-6 pt-4 bg-slate-900/40 border-b border-slate-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pb-4">
            <button
              onClick={() => setActiveTab('installment')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'installment'
                  ? 'bg-amber-500 text-slate-950 shadow-lg'
                  : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span>الف) محاسبه اقساط گوشی و لپ‌تاپ با چک صیادی</span>
            </button>
            <button
              onClick={() => setActiveTab('tradein')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'tradein'
                  ? 'bg-emerald-500 text-slate-950 shadow-lg'
                  : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <RefreshCw className="w-4 h-4" />
              <span>ب) معاوضه گوشی کارکرده با نو (Trade-In هوشمند)</span>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Target New Product Selector (Shared) */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <label className="block text-xs font-semibold text-amber-400 mb-2">
              انتخاب دستگاه آکبند هدف (با گارانتی ۱۸ ماهه و کد همتا):
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
              <div className="md:col-span-2">
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3.5 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
                >
                  {products.map((p) => {
                    const pr = calculateProductPrices(p, rates);
                    return (
                      <option key={p.id} value={p.id}>
                        {p.title} — ({formatToman(pr.retailToman)} تومان)
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="flex items-center justify-between md:justify-end gap-3 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-xs text-slate-400">قیمت تک‌فروشی روز:</span>
                <span className="text-base font-bold font-mono-num text-emerald-400">
                  {formatToman(productPricing.retailToman)} ت
                </span>
              </div>
            </div>
          </div>

          {activeTab === 'installment' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Controls */}
              <div className="lg:col-span-7 space-y-5">
                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-300 font-medium">درصد پیش‌پرداخت نقدی:</span>
                      <span className="font-bold text-amber-400 font-mono-num">
                        {downPaymentPercent}% ({formatToman(installmentCalc.downPayment)} تومان)
                      </span>
                    </div>
                    <input
                      type="range"
                      min={20}
                      max={60}
                      step={5}
                      value={downPaymentPercent}
                      onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                      <span>۲۰٪ (حداقل پیش‌پرداخت)</span>
                      <span>۳۰٪ (استاندارد بازار)</span>
                      <span>۶۰٪</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-300 font-medium mb-2">
                      مدت بازپرداخت اقساط (چک صیادی بنفش):
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[3, 6, 9, 12].map((m) => (
                        <button
                          key={m}
                          onClick={() => setMonths(m)}
                          className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                            months === m
                              ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          {m} ماهه
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">
                        کارمزد ماهانه چک صیادی (%):
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="1"
                        max="8"
                        value={monthlyWagePercent}
                        onChange={(e) => setMonthlyWagePercent(Number(e.target.value) || 3.5)}
                        className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-white font-mono-num"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">
                        شماره واتساپ فروشگاه (جهت ارسال فرم):
                      </label>
                      <input
                        type="text"
                        dir="ltr"
                        value={storeWhatsapp}
                        onChange={(e) => setStoreWhatsapp(e.target.value)}
                        className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-white font-mono-num"
                        placeholder="989120000000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      نام مشتری (اختیاری - درج در برگه اقساط):
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-white"
                      placeholder="مثلاً: جناب آقای رضایی"
                    />
                  </div>
                </div>
              </div>

              {/* Result Box */}
              <div className="lg:col-span-5 flex flex-col justify-between p-5 rounded-2xl bg-slate-900 border border-amber-500/30 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs text-slate-400">مبلغ پیش‌پرداخت نقدی ({downPaymentPercent}%):</span>
                    <span className="text-base font-bold text-white font-mono-num">
                      {formatToman(installmentCalc.downPayment)} تومان
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs text-slate-400">مانده تسهیلات اقساطی:</span>
                    <span className="text-sm font-semibold text-slate-300 font-mono-num">
                      {formatToman(installmentCalc.remainingPrincipal)} تومان
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center">
                    <span className="block text-xs text-amber-300 mb-1">
                      مبلغ هر برگ چک صیادی ({months} قسط ماهانه):
                    </span>
                    <span className="text-2xl font-extrabold text-amber-400 font-mono-num">
                      {formatToman(installmentCalc.eachMonthAmount)} تومان
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2 text-xs text-slate-400">
                    <span>جمع کل تمام‌شده (نقد + اقساط):</span>
                    <span className="font-bold text-emerald-400 font-mono-num">
                      {formatToman(installmentCalc.finalTotalCost)} تومان
                    </span>
                  </div>
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-800">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>تحویل آنی جعبه پلمپ + انتقال مالکیت همتا به نام خریدار</span>
                  </div>
                  <button
                    onClick={sendInstallmentToWhatsapp}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>ارسال فرم خرید اقساطی به واتساپ موبایل‌فروشی</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Trade-In Tab */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 space-y-4">
                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-emerald-400 mb-1.5">
                      ۱. انتخاب مدل گوشی کارکرده فعلی مشتری:
                    </label>
                    <select
                      value={usedModelId}
                      onChange={(e) => setUsedModelId(e.target.value)}
                      className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3.5 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
                    >
                      {USED_PHONE_MODELS.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.modelName} — ظرفیت {u.storage} (پایه ارزی: ${u.baseCleanUsdValue})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-slate-300 flex items-center gap-1.5">
                        <BatteryCharging className="w-4 h-4 text-emerald-400" />
                        <span>سلامت باتری دستگاه کارکرده (Battery Health):</span>
                      </span>
                      <span className="font-bold text-emerald-400 font-mono-num">{batteryHealth}%</span>
                    </div>
                    <input
                      type="range"
                      min={70}
                      max={100}
                      step={1}
                      value={batteryHealth}
                      onChange={(e) => setBatteryHealth(Number(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                      <span>۷۰٪ (نیازمند تعویض باتری)</span>
                      <span>۸۵٪ (نرمال کارکرده)</span>
                      <span>۱۰۰٪ (مشابه نو)</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 font-medium mb-2">
                      وضعیت ظاهری بدنه و السیدی:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <button
                        onClick={() => setBodyCondition('clean')}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                          bodyCondition === 'clean'
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                            : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        بدون خط‌وخش (در حد آک)
                      </button>
                      <button
                        onClick={() => setBodyCondition('minor')}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                          bodyCondition === 'minor'
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                            : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        خط‌وخش جزئی فریم
                      </button>
                      <button
                        onClick={() => setBodyCondition('repair')}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                          bodyCondition === 'repair'
                            ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                            : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        دارای زدگی / بازشدگی
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <span className="text-xs text-slate-300">
                      دارای کارتن اصلی و قابلیت انتقال مالکیت فوری همتا؟
                    </span>
                    <button
                      onClick={() => setHasOriginalBoxAndHamta(!hasOriginalBoxAndHamta)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        hasOriginalBoxAndHamta
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      }`}
                    >
                      {hasOriginalBoxAndHamta ? 'بله، کامل و آماده انتقال' : 'خیر (کسر ۱۵٪ افت فاقد کارتن)'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col justify-between p-5 rounded-2xl bg-slate-900 border border-emerald-500/30 space-y-4">
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="block text-xs text-slate-400 mb-1">
                      قیمت کارشناسی خرید گوشی کارکرده مشتری:
                    </span>
                    <span className="text-xl font-extrabold text-emerald-400 font-mono-num">
                      {formatToman(tradeInCalc.estimatedUsedValue)} تومان
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                    <span>قیمت دستگاه آکبند انتخابی:</span>
                    <span className="font-mono-num text-white font-bold">
                      {formatToman(tradeInCalc.newDevicePrice)} تومان
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center">
                    <span className="block text-xs text-amber-300 mb-1">
                      مابه‌التفاوت نقدی جهت ارتقا به گوشی آکبند:
                    </span>
                    <span className="text-2xl font-extrabold text-amber-400 font-mono-num">
                      {formatToman(tradeInCalc.cashDifference)} تومان
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 text-xs flex items-center justify-between">
                    <span className="text-slate-400">یا قسطی با ۶ چک صیادی:</span>
                    <span className="font-bold text-white font-mono-num">
                      ماهی {formatToman(tradeInCalc.sixMonthCheckPerMonth)} تومان
                    </span>
                  </div>
                </div>

                <button
                  onClick={sendTradeInToWhatsapp}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-colors cursor-pointer"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>ارسال فرم معاوضه (Trade-In) در واتساپ</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
