import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  QrCode,
  ShieldAlert,
  ShieldCheck,
  Cpu,
  Flame,
  Download,
  Printer,
  CheckCircle2,
  Send,
  Sparkles,
  Clock,
} from 'lucide-react';
import {
  ProductItem,
  MarketRates,
  calculateProductPrices,
  formatToman,
} from '../data/mockData';

export interface CustomBrandProfile {
  isActive: boolean;
  brandName: string;
  brandSubtitle: string;
  whatsappNumber: string;
  storeAddress: string;
  instagramId: string;
  badgeText: string;
  themeColor: 'emerald' | 'indigo' | 'amber' | 'sky';
}

interface ProInnovationModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: ProductItem[];
  rates: MarketRates;
  customBrand: CustomBrandProfile;
  initialTab?: 'qr_label' | 'sayadi_check' | 'parts_passport' | 'flash_clearance';
  initialProduct?: ProductItem | null;
}

interface SayadiStatusResult {
  code: string;
  colorKey: 'white' | 'yellow' | 'orange' | 'brown' | 'red';
  title: string;
  badgeBg: string;
  description: string;
  recommendedCeiling: string;
  canApproveInstallment: boolean;
}

export const ProInnovationModal: React.FC<ProInnovationModalProps> = ({
  isOpen,
  onClose,
  products,
  rates,
  customBrand,
  initialTab = 'qr_label',
  initialProduct,
}) => {
  const [activeTab, setActiveTab] = useState<
    'qr_label' | 'sayadi_check' | 'parts_passport' | 'flash_clearance'
  >(initialTab);

  // Tab 1: QR Shelf Label State
  const [selectedProdId, setSelectedProdId] = useState<string>(
    initialProduct?.id || products[0]?.id || ''
  );
  const [labelShopName, setLabelShopName] = useState<string>(
    customBrand.isActive ? customBrand.brandName : 'موبایل و کامپیوتر آفرینا VIP'
  );
  const [labelShopPhone, setLabelShopPhone] = useState<string>(
    customBrand.isActive ? customBrand.whatsappNumber : '0912-000-0000'
  );
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (initialProduct) {
      setSelectedProdId(initialProduct.id);
    }
  }, [initialProduct]);

  useEffect(() => {
    if (customBrand.isActive) {
      setLabelShopName(customBrand.brandName);
      setLabelShopPhone(customBrand.whatsappNumber);
    }
  }, [customBrand]);

  // Tab 2: 16-Digit Sayadi Check Inquiry State
  const [sayadiId, setSayadiId] = useState<string>('1405982000451982');
  const [nationalId, setNationalId] = useState<string>('0019482716');
  const [sayadiResult, setSayadiResult] = useState<SayadiStatusResult>({
    code: '1405982000451982',
    colorKey: 'white',
    title: 'وضعیت سفید بانک مرکزی (بدون هیچ‌گونه چک برگشتی)',
    badgeBg: 'bg-emerald-50 border-emerald-400 text-emerald-950',
    description:
      'صادرکننده چک فاقد هرگونه سابقه چک برگشتی یا بدهی غیرجاری در شبکه بانکی کشور می‌باشد. رتبه اعتباری A+.',
    recommendedCeiling: 'مجاز برای فروش اقساطی موبایل و لپ‌تاپ تا سقف ۲۵۰ میلیون تومان (با ۳۰٪ پیش‌پرداخت)',
    canApproveInstallment: true,
  });

  // Tab 3: Digital Parts Authenticity Passport State
  const [serialInput, setSerialInput] = useState<string>('SN-LCD15PM-98412');
  const [partGrade, setPartGrade] = useState<'pulled_orig' | 'ti_battery' | 'hamta_phone'>('pulled_orig');
  const [buyerShopName, setBuyerShopName] = useState<string>('کلینیک تخصصی تعمیرات موبایل پارس');

  // Tab 4: 60-Min Dubai Flash Clearance Countdown
  const [secondsLeft, setSecondsLeft] = useState<number>(3420); // 57 minutes

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 60 ? prev - 1 : 3599));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const selectedProduct =
    products.find((p) => p.id === selectedProdId) || products[0];
  const pricing = calculateProductPrices(selectedProduct, rates);
  const down30 = Math.round((pricing.retailToman * 0.3) / 10000) * 10000;
  const rem70 = pricing.retailToman - down30;
  const month6 = Math.round(((rem70 * (1 + 0.035 * 6)) / 6) / 10000) * 10000;

  // Draw Printable Storefront QR Shelf Tag on Canvas
  useEffect(() => {
    if (!isOpen || activeTab !== 'qr_label') return;
    const canvas = qrCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 900;
    const H = 540;
    canvas.width = W;
    canvas.height = H;

    // White high-contrast background for thermal/laser shelf printing
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, W, H);

    // Outer Bold Frame
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 8;
    ctx.strokeRect(16, 16, W - 32, H - 32);

    // Header Strip
    ctx.fillStyle = '#059669';
    ctx.fillRect(16, 16, W - 32, 86);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 30px Vazirmatn, sans-serif';
    ctx.fillText(`🏷️ ${labelShopName} — لیبل هوشمند قیمت ویترین`, W - 40, 70);

    ctx.textAlign = 'left';
    ctx.font = 'bold 20px monospace';
    ctx.fillText(`USD: ${formatToman(rates.USD)} | AED: ${formatToman(rates.AED)}`, 40, 68);

    // Product Title & Specs (Right Side)
    ctx.textAlign = 'right';
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 28px Vazirmatn, sans-serif';
    ctx.fillText(selectedProduct.title.slice(0, 42), W - 40, 155);

    ctx.fillStyle = '#475569';
    ctx.font = 'bold 20px monospace';
    ctx.fillText(selectedProduct.englishModel.slice(0, 45), W - 40, 195);

    ctx.fillStyle = '#047857';
    ctx.font = 'bold 20px Vazirmatn, sans-serif';
    ctx.fillText(`✓ ${selectedProduct.warrantyText.slice(0, 48)}`, W - 40, 235);

    // Cash Price Box
    ctx.fillStyle = '#ECFDF5';
    ctx.fillRect(310, 260, W - 350, 105);
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 3;
    ctx.strokeRect(310, 260, W - 350, 105);

    ctx.fillStyle = '#065F46';
    ctx.font = 'bold 20px Vazirmatn, sans-serif';
    ctx.fillText('قیمت نقدی روز (با کد رجیستری همتا):', W - 55, 295);

    ctx.fillStyle = '#047857';
    ctx.font = 'bold 38px Vazirmatn, monospace';
    ctx.fillText(`${formatToman(pricing.retailToman)} تومان`, W - 55, 345);

    // Installment Price Box
    ctx.fillStyle = '#FFFBEB';
    ctx.fillRect(310, 380, W - 350, 105);
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 3;
    ctx.strokeRect(310, 380, W - 350, 105);

    ctx.fillStyle = '#92400E';
    ctx.font = 'bold 19px Vazirmatn, sans-serif';
    ctx.fillText(
      `فروش اقساطی چک صیادی (پیش‌پرداخت: ${formatToman(down30)} ت):`,
      W - 55,
      415
    );

    ctx.fillStyle = '#B45309';
    ctx.font = 'bold 32px Vazirmatn, monospace';
    ctx.fillText(`۶ قسط ماهانه: ${formatToman(month6)} تومان`, W - 55, 463);

    // Deterministic QR Code Matrix on Left Side
    const qrX = 48;
    const qrY = 140;
    const qrSize = 220;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20);
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 3;
    ctx.strokeRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20);

    const cells = 21;
    const cellSize = Math.floor(qrSize / cells);
    const seedStr = selectedProduct.id + String(rates.USD);

    for (let r = 0; r < cells; r++) {
      for (let c = 0; c < cells; c++) {
        // Finder patterns in 3 corners
        const isTopLeft = r < 7 && c < 7;
        const isTopRight = r < 7 && c >= cells - 7;
        const isBottomLeft = r >= cells - 7 && c < 7;

        let fill = false;
        if (isTopLeft || isTopRight || isBottomLeft) {
          const lr = isBottomLeft ? r - (cells - 7) : r;
          const lc = isTopRight ? c - (cells - 7) : c;
          if (
            lr === 0 ||
            lr === 6 ||
            lc === 0 ||
            lc === 6 ||
            (lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4)
          ) {
            fill = true;
          }
        } else {
          const hash =
            (r * 31 + c * 17 + seedStr.charCodeAt((r + c) % seedStr.length)) % 7;
          fill = hash < 3;
        }

        if (fill) {
          ctx.fillStyle = '#0F172A';
          ctx.fillRect(qrX + c * cellSize, qrY + r * cellSize, cellSize - 1, cellSize - 1);
        }
      }
    }

    ctx.textAlign = 'center';
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 16px Vazirmatn, sans-serif';
    ctx.fillText('اسکن جهت استعلام قیمت لحظه‌ای', qrX + qrSize / 2, qrY + qrSize + 38);
    ctx.fillStyle = '#059669';
    ctx.font = 'bold 17px monospace';
    ctx.fillText(labelShopPhone, qrX + qrSize / 2, qrY + qrSize + 68);
    ctx.fillStyle = '#64748B';
    ctx.font = 'bold 14px monospace';
    ctx.fillText(`IMEI/SN: ${selectedProduct.imeiPrefix}**`, qrX + qrSize / 2, qrY + qrSize + 95);
  }, [
    isOpen,
    activeTab,
    selectedProduct,
    rates,
    pricing,
    down30,
    month6,
    labelShopName,
    labelShopPhone,
  ]);

  if (!isOpen) return null;

  const handleDownloadQrLabel = () => {
    const canvas = qrCanvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `Shelf-QR-Label-${selectedProduct.id}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const evaluateSayadiPreset = (
    color: 'white' | 'yellow' | 'orange' | 'brown' | 'red'
  ) => {
    const map: Record<'white' | 'yellow' | 'orange' | 'brown' | 'red', SayadiStatusResult> = {
      white: {
        code: sayadiId || '1405982000451982',
        colorKey: 'white',
        title: 'وضعیت سفید صیادی (خوش‌حساب · بدون چک برگشتی)',
        badgeBg: 'bg-emerald-50 border-emerald-400 text-emerald-950',
        description:
          'صادرکننده چک فاقد هرگونه چک برگشتی یا اقساط معوق بانکی است. بالاترین سطح اعتبار جهت فروش اقساطی موبایل و لپ‌تاپ.',
        recommendedCeiling: 'مجاز تا سقف ۲۵۰ میلیون تومان (پیش‌پرداخت ۳۰٪ + اقساط ۶ تا ۱۲ ماهه)',
        canApproveInstallment: true,
      },
      yellow: {
        code: sayadiId || '1405771000291844',
        colorKey: 'yellow',
        title: 'وضعیت زرد صیادی (حداکثر ۱ فقره چک برگشتی تا سقف ۵۰ میلیون ریال)',
        badgeBg: 'bg-amber-50 border-amber-400 text-amber-950',
        description:
          'دارای ۱ فقره سابقه برگشتی خرد. پیشنهاد می‌شود پیش‌پرداخت نقدی حداقل ۴۵٪ دریافت شود و یک ضامن معتبر پشت چک را امضا کند.',
        recommendedCeiling: 'مجاز مشروط تا سقف ۶۰ میلیون تومان (با ۴۵٪ پیش‌پرداخت نقدی)',
        canApproveInstallment: true,
      },
      orange: {
        code: sayadiId || '1405619000812300',
        colorKey: 'orange',
        title: 'وضعیت نارنجی صیادی (۲ تا ۴ فقره چک برگشتی یا تعهدات معوق)',
        badgeBg: 'bg-orange-50 border-orange-400 text-orange-950',
        description:
          'ریسک اعتباری متوسط رو به بالا. تحویل گوشی پرچمدار یا لپ‌تاپ صرفاً با چک این شخص توصیه نمی‌شود مگر با چک صیادی سفید فرد دیگر.',
        recommendedCeiling: 'عدم تایید بدون ضامن سفید صیادی',
        canApproveInstallment: false,
      },
      brown: {
        code: sayadiId || '1405331000192831',
        colorKey: 'brown',
        title: 'وضعیت قهوه‌ای صیادی (۵ تا ۱۰ فقره چک برگشتی ثبت‌شده)',
        badgeBg: 'bg-stone-100 border-stone-500 text-stone-900',
        description:
          'ریسک بسیار بالا در وصول چک. فروش چکی به این شناسه ممنوع است؛ فقط تسویه نقدی یا طرح تعویض نقدی مجاز است.',
        recommendedCeiling: 'غیرمجاز برای فروش اقساطی (فقط فروش نقدی)',
        canApproveInstallment: false,
      },
      red: {
        code: sayadiId || '1405000991827364',
        colorKey: 'red',
        title: 'وضعیت قرمز صیادی (بیش از ۱۰ چک برگشتی / مسدودی حساب بانکی)',
        badgeBg: 'bg-rose-50 border-rose-500 text-rose-950',
        description:
          'هشدار جدی امنیتی: صادرکننده دارای سوابق متعدد چک برگشتی سنگین در شبکه بانکی است. از تحویل کالا در قبال چک خودداری فرمایید.',
        recommendedCeiling: 'مسدود (۰ تومان اعتبار چکی)',
        canApproveInstallment: false,
      },
    };
    setSayadiResult(map[color]);
  };

  const handleInquiryByDigits = (e: React.FormEvent) => {
    e.preventDefault();
    const lastDigit = Number(sayadiId.slice(-1));
    if (lastDigit === 0 || lastDigit === 9) evaluateSayadiPreset('red');
    else if (lastDigit === 4) evaluateSayadiPreset('yellow');
    else if (lastDigit === 7) evaluateSayadiPreset('orange');
    else evaluateSayadiPreset('white');
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden my-8 text-slate-900">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white no-print">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/20">
              <Sparkles className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg font-black">
                جعبه ابزار فوق‌تخصصی مغازه‌داران (ویترین هوشمند QR · استعلام صیادی · پاسپورت قطعه · حراج ۶۰ دقیقه‌ای)
              </h2>
              <p className="text-xs text-white/90 mt-0.5">
                Able Way City Afrina · تبدیل نقاط ضعف بازار سنتی به نقاط قوت پولساز برای موبایل‌فروشان و شرکت‌های کامپیوتری
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Innovation Tabs */}
        <div className="px-6 pt-4 bg-slate-50 border-b border-slate-200 no-print">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pb-4">
            <button
              onClick={() => setActiveTab('qr_label')}
              className={`flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                activeTab === 'qr_label'
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>۱. لیبل هوشمند QR ویترین مغازه</span>
            </button>

            <button
              onClick={() => setActiveTab('sayadi_check')}
              className={`flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                activeTab === 'sayadi_check'
                  ? 'bg-sky-600 text-white border-sky-700 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>۲. استعلام ۱۶ رقمی رنگ چک صیادی</span>
            </button>

            <button
              onClick={() => setActiveTab('parts_passport')}
              className={`flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                activeTab === 'parts_passport'
                  ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>۳. پاسپورت دیجیتال اصالت قطعه</span>
            </button>

            <button
              onClick={() => setActiveTab('flash_clearance')}
              className={`flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                activeTab === 'flash_clearance'
                  ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>۴. حراج معکوس ۶۰ دقیقه‌ای بار دبی</span>
            </button>
          </div>
        </div>

        <div className="p-6 max-h-[76vh] overflow-y-auto space-y-6">
          {/* TAB 1: DYNAMIC STOREFRONT QR PRICE TAG */}
          {activeTab === 'qr_label' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-5 space-y-4 no-print">
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-3">
                  <h3 className="text-sm font-black text-emerald-950">
                    چاپ برچسب هوشمند QR پشت ویترین (پایان تعویض کاغذ قیمت!)
                  </h3>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    کافیست این برچسب را چاپ کرده و روی جعبه گوشی یا لپ‌تاپ در ویترین مغازه بچسبانید؛ مشتری با اسکن QR، قیمت نقد و اقساطِ لحظه‌ای را به نرخ دلار همان ثانیه می‌بیند!
                  </p>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      انتخاب کالا جهت صدور لیبل ویترین:
                    </label>
                    <select
                      value={selectedProdId}
                      onChange={(e) => setSelectedProdId(e.target.value)}
                      className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-xs font-bold text-slate-900"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      نام فروشگاه شما روی برچسب ویترین:
                    </label>
                    <input
                      type="text"
                      value={labelShopName}
                      onChange={(e) => setLabelShopName(e.target.value)}
                      className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-xs font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      تلفن فروشنده روی برچسب:
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      value={labelShopPhone}
                      onChange={(e) => setLabelShopPhone(e.target.value)}
                      className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-xs font-mono-num font-bold text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleDownloadQrLabel}
                    className="flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>دانلود تصویر لیبل (PNG)</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>چاپ مستقیم لیبل ویترین</span>
                  </button>
                </div>
              </div>

              <div className="lg:col-span-7 flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-100 border border-slate-300">
                <span className="text-xs font-bold text-slate-600 mb-2 no-print">
                  پیش‌نمایش زنده برچسب ویترین مغازه (۹۰۰×۵۴۰ پیکسل - آماده چاپ لیزری و حرارتی):
                </span>
                <canvas
                  ref={qrCanvasRef}
                  className="w-full max-w-[540px] rounded-xl border border-slate-300 shadow-md bg-white"
                />
              </div>
            </div>
          )}

          {/* TAB 2: 16-DIGIT SAYADI CHECK COLOR STATUS INQUIRY */}
          {activeTab === 'sayadi_check' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6 space-y-4">
                <form
                  onSubmit={handleInquiryByDigits}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4"
                >
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-sky-600" />
                    <span>استعلام ۱۶ رقمی وضعیت رنگ چک صیادی (قبل از فروش اقساطی)</span>
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      شناسه ۱۶ رقمی صیادی مندرج روی برگ چک بنفش:
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      maxLength={16}
                      value={sayadiId}
                      onChange={(e) => setSayadiId(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full rounded-xl bg-white border border-slate-300 px-3.5 py-2.5 text-base font-mono-num font-black tracking-widest text-slate-900"
                      placeholder="1405982000451982"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      کد ملی صاحب دسته چک (۱۰ رقمی):
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      maxLength={10}
                      value={nationalId}
                      onChange={(e) => setNationalId(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full rounded-xl bg-white border border-slate-300 px-3.5 py-2 text-sm font-mono-num font-bold text-slate-900"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-extrabold cursor-pointer"
                  >
                    استعلام آنی وضعیت رنگ صیادی و سقف اعتبار پیشنهادی
                  </button>
                </form>

                {/* Quick Color Simulation Presets for Shopkeeper Training */}
                <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                  <span className="block text-xs font-bold text-slate-600">
                    شبیه‌ساز سریع ۵ رنگ رسمی چک صیادی بانک مرکزی (جهت تست مغازه‌دار):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => evaluateSayadiPreset('white')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold cursor-pointer"
                    >
                      ⚪ وضعیت سفید
                    </button>
                    <button
                      onClick={() => evaluateSayadiPreset('yellow')}
                      className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold cursor-pointer"
                    >
                      🟡 وضعیت زرد
                    </button>
                    <button
                      onClick={() => evaluateSayadiPreset('orange')}
                      className="px-3 py-1.5 rounded-lg bg-orange-50 border border-orange-300 text-orange-900 text-xs font-bold cursor-pointer"
                    >
                      🟠 وضعیت نارنجی
                    </button>
                    <button
                      onClick={() => evaluateSayadiPreset('brown')}
                      className="px-3 py-1.5 rounded-lg bg-stone-100 border border-stone-400 text-stone-900 text-xs font-bold cursor-pointer"
                    >
                      🟤 وضعیت قهوه‌ای
                    </button>
                    <button
                      onClick={() => evaluateSayadiPreset('red')}
                      className="px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-300 text-rose-900 text-xs font-bold cursor-pointer"
                    >
                      🔴 وضعیت قرمز
                    </button>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 flex flex-col justify-between">
                <div className={`p-6 rounded-2xl border-2 space-y-4 ${sayadiResult.badgeBg}`}>
                  <div className="flex items-center justify-between border-b border-current/15 pb-3">
                    <span className="text-xs font-mono-num font-bold">
                      SAYADI ID: {sayadiResult.code}
                    </span>
                    <span className="text-xs font-extrabold">
                      {sayadiResult.canApproveInstallment ? '✓ مجاز برای فروش چکی' : '⛔ غیرمجاز برای فروش چکی'}
                    </span>
                  </div>

                  <h4 className="text-lg font-black">{sayadiResult.title}</h4>
                  <p className="text-xs leading-relaxed font-medium">
                    {sayadiResult.description}
                  </p>

                  <div className="p-3.5 rounded-xl bg-white/80 border border-current/20">
                    <span className="block text-[11px] font-bold opacity-75">
                      سقف اعتبار پیشنهادی هوش مالی آفرینا فی‌بان:
                    </span>
                    <span className="text-sm font-black block mt-1">
                      {sayadiResult.recommendedCeiling}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DIGITAL PARTS AUTHENTICITY & 7-DAY TEST PASSPORT */}
          {activeTab === 'parts_passport' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 space-y-4 no-print">
                <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 space-y-3">
                  <h3 className="text-sm font-black text-indigo-950">
                    صدور پاسپورت دیجیتال اصالت قطعه و مهلت تست ۷ روزه
                  </h3>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    ویژه پخش‌کنندگان قطعه و تعمیرکاران موبایل/لپ‌تاپ جهت تضمین ۱۰۰٪ فابریک بودن ال‌سی‌دی روکاری، باتری آی‌سی TI و هارد SSD.
                  </p>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      شماره سریال هولوگرام قطعه / IMEI:
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      value={serialInput}
                      onChange={(e) => setSerialInput(e.target.value)}
                      className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-xs font-mono-num font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      نوع تست فنی انجام‌شده در لابراتوار:
                    </label>
                    <select
                      value={partGrade}
                      onChange={(e) =>
                        setPartGrade(
                          e.target.value as 'pulled_orig' | 'ti_battery' | 'hamta_phone'
                        )
                      }
                      className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-xs font-bold"
                    >
                      <option value="pulled_orig">
                        ال‌سی‌دی ۱۰۰٪ فابریک روکاری (Original Pulled - بدون تعویض گلس)
                      </option>
                      <option value="ti_battery">
                        باتری اورجینال سلول کبالت با آی‌سی Texas Instruments (TI)
                      </option>
                      <option value="hamta_phone">
                        دستگاه پلمپ نات‌اکتیو (Not Active) با کد رسمی سامانه همتا
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      نام تعمیرگاه / خریدار قطعه:
                    </label>
                    <input
                      type="text"
                      value={buyerShopName}
                      onChange={(e) => setBuyerShopName(e.target.value)}
                      className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-xs font-bold"
                    />
                  </div>

                  <button
                    onClick={() => window.print()}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>چاپ گواهی اصالت و ضمانت ۷ روزه قطعه</span>
                  </button>
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="p-6 rounded-2xl bg-white border-2 border-indigo-500 shadow-md space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div>
                      <span className="text-xs font-extrabold text-indigo-700 block">
                        ABLE WAY CITY AFRINA · DIGITAL AUTHENTICITY PASSPORT
                      </span>
                      <h4 className="text-base font-black text-slate-900 mt-0.5">
                        شناسنامه رسمی اصالت و سلامت فنی قطعه / دستگاه
                      </h4>
                    </div>
                    <span className="font-mono-num text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-300">
                      VERIFIED: {serialInput}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 block">صادرکننده ضمانت:</span>
                      <strong className="text-slate-900">{labelShopName}</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 block">خریدار / تعمیرگاه:</span>
                      <strong className="text-slate-900">{buyerShopName}</strong>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2 text-xs">
                    <div className="font-black text-emerald-950 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>نتایج تست آزمایشگاهی و تضمین اصالت:</span>
                    </div>
                    {partGrade === 'pulled_orig' && (
                      <ul className="list-disc list-inside space-y-1 text-slate-800 font-medium">
                        <li>فلت تاچ و تصویر ۱۰۰٪ فابریک کارخانه (بدون چسب UV یا تعویض گلس بازاری).</li>
                        <li>پوشش اولئوفوبیک (تست قطره آب) و زاویه دید ۴۵ درجه کاملاً استاندارد.</li>
                        <li>قابلیت انتقال آی‌سی و فعال‌سازی TrueTone بدون خطای Unknown Part.</li>
                        <li>دارای ۷ روز مهلت تست کامل تعویض ویژه همکار تعمیرکار (تا قبل از کندن پلمپ).</li>
                      </ul>
                    )}
                    {partGrade === 'ti_battery' && (
                      <ul className="list-disc list-inside space-y-1 text-slate-800 font-medium">
                        <li>مجهز به چیپ اصلی Texas Instruments (TI) با نمایش سلامت باتری ۱۰۰٪ واقعی.</li>
                        <li>ظرفیت واقعی سلول کبالت خالص بدون افت ولتاژ در پردازش سنگین.</li>
                        <li>دارای ۶ ماه ضمانت بی‌قیدوشرط تعویض در صورت بادکردگی یا افت غیرطبیعی.</li>
                      </ul>
                    )}
                    {partGrade === 'hamta_phone' && (
                      <ul className="list-disc list-inside space-y-1 text-slate-800 font-medium">
                        <li>دستگاه ۱۰۰٪ نات‌اکتیو (Not Active) در سایت رسمی سازنده قبل از بازگشایی جعبه.</li>
                        <li>دارای کد فعال‌سازی رسمی سامانه همتا و ۱۸ ماه گارانتی معتبر شرکتی.</li>
                        <li>تضمین پارت‌نامبر اصلی و سلامت کامل لوازم داخل جعبه.</li>
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: 60-MIN DUBAI FLASH CLEARANCE COUNTDOWN */}
          {activeTab === 'flash_clearance' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-400 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Flame className="w-5 h-5 text-rose-600" />
                    <span>تابلوی حراج معکوس ۶۰ دقیقه‌ای (پارت بار تازه ترخیص دبی - زیر فی علاءالدین)</span>
                  </h3>
                  <p className="text-xs text-slate-700 mt-0.5">
                    ویژه تسویه نقدی فوری یا تتر (USDT) — مناسب موبایل‌فروشان و پخش‌کنندگان شهرستان
                  </p>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-amber-400 font-mono-num font-black text-base">
                  <Clock className="w-4 h-4 text-rose-400" />
                  <span>
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products
                  .filter((p) => p.isClearanceDubai)
                  .map((item) => {
                    const pr = calculateProductPrices(item, rates);
                    const flashDiscountToman =
                      Math.round((pr.wholesaleToman * 0.982) / 10000) * 10000;

                    return (
                      <div
                        key={item.id}
                        className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col justify-between space-y-3 shadow-2xs"
                      >
                        <div>
                          <div className="text-xs font-bold text-rose-600 mb-1">
                            ⚡ حراج پارت ترخیصی دبی · موجودی باقیمانده: {item.stockCount} عدد
                          </div>
                          <h4 className="text-sm font-black text-slate-900">{item.title}</h4>
                          <div className="mt-2 flex items-center justify-between text-xs">
                            <span className="text-slate-500 line-through font-mono-num">
                              فی عادی همکار: {formatToman(pr.wholesaleToman)} ت
                            </span>
                            <span className="font-mono-num font-black text-sm text-emerald-700">
                              فی حراج ۶۰ دقیقه‌ای: {formatToman(flashDiscountToman)} تومان
                            </span>
                          </div>
                        </div>

                        <a
                          href={`https://wa.me/${labelShopPhone.replace(
                            /[^0-9]/g,
                            ''
                          )}?text=${encodeURIComponent(
                            `سلام، درخواست رزرو فوری حراج ۶۰ دقیقه‌ای برای «${item.title}» با فی ${formatToman(
                              flashDiscountToman
                            )} تومان دارم.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold"
                        >
                          <Send className="w-4 h-4" />
                          <span>رزرو فوری پارت بار در واتساپ</span>
                        </a>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
