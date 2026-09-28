import React, { useState, useEffect } from 'react';
import {
  X,
  Crown,
  Users,
  Check,
  Copy,
  Sparkles,
  Award,
  TrendingUp,
  Building2,
  Megaphone,
  ShoppingBag,
  ShieldCheck,
  Send,
  Plus,
  CheckCircle2,
  Palette,
} from 'lucide-react';
import {
  VIP_TIERS,
  WHITELABEL_PRESETS,
  AD_PLACEMENT_PACKAGES,
  WhiteLabelConfig,
  TradingCompanyAd,
  formatToman,
} from '../data/mockData';

interface AndroidBillingBridgeType {
  purchaseSubscription?: (sku: string, marketName: string) => string;
  isBillingSupported?: () => boolean;
}

declare global {
  interface Window {
    AndroidBillingBridge?: AndroidBillingBridgeType;
  }
}

export type MonetizationTab = 'vip' | 'whitelabel' | 'ads' | 'affiliate';

interface VipAffiliateModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: MonetizationTab;
  activeVipLevel: number;
  onSelectVipLevel: (level: number) => void;
  whiteLabelConfig: WhiteLabelConfig;
  onUpdateWhiteLabel: (config: WhiteLabelConfig) => void;
  tradingCompanies: TradingCompanyAd[];
  onAddTradingCompany: (company: TradingCompanyAd) => void;
}

export const VipAffiliateModal: React.FC<VipAffiliateModalProps> = ({
  isOpen,
  onClose,
  initialView = 'vip',
  activeVipLevel,
  onSelectVipLevel,
  whiteLabelConfig,
  onUpdateWhiteLabel,
  tradingCompanies,
  onAddTradingCompany,
}) => {
  const [view, setView] = useState<MonetizationTab>(initialView);

  useEffect(() => {
    if (isOpen && initialView) {
      setView(initialView);
    }
  }, [isOpen, initialView]);

  // 1. Myket & CafeBazaar Billing Gateway State
  const [selectedGateway, setSelectedGateway] = useState<'myket' | 'bazaar' | 'zarinpal'>('myket');
  const [billingReceipt, setBillingReceipt] = useState<string | null>(null);

  // 2. White-Label Customizer Draft State
  const [draftWL, setDraftWL] = useState<WhiteLabelConfig>(whiteLabelConfig);
  const [wlSavedToast, setWlSavedToast] = useState<boolean>(false);
  const [generatedLicenseKey, setGeneratedLicenseKey] = useState<string>(
    'AFRINA-WL-2026-PRO-9941'
  );

  useEffect(() => {
    setDraftWL(whiteLabelConfig);
  }, [whiteLabelConfig]);

  // 3. New Ad / Trading Company Form State
  const [adNameFa, setAdNameFa] = useState<string>('');
  const [adNameEn, setAdNameEn] = useState<string>('');
  const [adCategory, setAdCategory] = useState<TradingCompanyAd['category']>('mobile_importer');
  const [adTier, setAdTier] = useState<TradingCompanyAd['sponsorTier']>('diamond');
  const [adCity, setAdCity] = useState<string>('');
  const [adSpecialty, setAdSpecialty] = useState<string>('');
  const [adHeadline, setAdHeadline] = useState<string>('');
  const [adOffer, setAdOffer] = useState<string>('');
  const [adWhatsapp, setAdWhatsapp] = useState<string>('');
  const [adLandline, setAdLandline] = useState<string>('');
  const [adAddedSuccess, setAdAddedSuccess] = useState<boolean>(false);

  // 4. Affiliate & 5-Stream Revenue Calculator State
  const [visitorName, setVisitorName] = useState<string>('');
  const [visitorPhone, setVisitorPhone] = useState<string>('');
  const [generatedCode, setGeneratedCode] = useState<string>('FB-VIP-8492');
  const [monthlyWhiteLabelCount, setMonthlyWhiteLabelCount] = useState<number>(4);
  const [avgWhiteLabelPrice, setAvgWhiteLabelPrice] = useState<number>(25000000);
  const [monthlySubscribersCount, setMonthlySubscribersCount] = useState<number>(85);
  const [monthlySponsorAdsCount, setMonthlySponsorAdsCount] = useState<number>(8);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  // Trigger Myket / CafeBazaar In-App Billing
  const handleMarketSubscriptionPurchase = (level: number, title: string, price: number) => {
    onSelectVipLevel(level);
    const sku = `afrina_feeban_vip_level_${level}`;
    const marketLabel =
      selectedGateway === 'myket'
        ? 'مایکت (Myket In-App Billing IAB v3)'
        : selectedGateway === 'bazaar'
        ? 'کافه‌بازار (CafeBazaar Poolakey SDK)'
        : 'درگاه مستقیم شاپرک / زرین‌پال';

    if (window.AndroidBillingBridge?.purchaseSubscription) {
      const res = window.AndroidBillingBridge.purchaseSubscription(sku, selectedGateway);
      setBillingReceipt(res);
    } else {
      const txId = `TX-${selectedGateway.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
      setBillingReceipt(
        `✅ تراکنش موفق در ${marketLabel} | شناسه کالا (SKU): ${sku} | پکیج: ${title} | مبلغ: ${formatToman(
          price
        )} تومان | کد پیگیری: ${txId}`
      );
    }
  };

  // Apply White-Label Customization Live Across App
  const handleApplyWhiteLabel = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateWhiteLabel({
      ...draftWL,
      isCustomBrandActive: true,
    });
    const rand = Math.floor(1000 + Math.random() * 9000);
    setGeneratedLicenseKey(`AFRINA-WL-${rand}-VIP`);
    setWlSavedToast(true);
    setTimeout(() => setWlSavedToast(false), 3500);
  };

  const handleSelectPreset = (presetConfig: WhiteLabelConfig) => {
    setDraftWL(presetConfig);
    onUpdateWhiteLabel(presetConfig);
    const rand = Math.floor(1000 + Math.random() * 9000);
    setGeneratedLicenseKey(`AFRINA-WL-${rand}-VIP`);
    setWlSavedToast(true);
    setTimeout(() => setWlSavedToast(false), 3500);
  };

  // Add New Sponsored Trading Company / Store
  const handleCreateTradingCompanyAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adNameFa || !adHeadline) return;

    const categoryLabels: Record<TradingCompanyAd['category'], string> = {
      mobile_importer: 'واردکننده مستقیم موبایل و تبلت (دبی / علاءالدین)',
      laptop_distributor: 'بازرگانی تخصصی لپ‌تاپ، مک‌بوک و سرفیس',
      parts_wholesaler: 'پخش عمده قطعات تعمیراتی و تجهیزات (LCD / باتری)',
      accessories_hub: 'پخش کارتنی لوازم جانبی، کلگی شارژر و گجت',
      installment_store: 'فروشگاه برتر اقساطی (چک صیادی) و معاوضه Trade-In',
    };

    const badgeLabels: Record<TradingCompanyAd['sponsorTier'], string> = {
      diamond: '💎 اسپانسر الماسی · واردکننده رسمی',
      gold: '🥇 اسپانسر طلایی · بازرگانی منتخب',
      verified: '✅ فروشگاه و بازرگانی تاییدشده',
    };

    const colors: Record<TradingCompanyAd['sponsorTier'], string> = {
      diamond: 'from-emerald-600 to-teal-700',
      gold: 'from-amber-500 to-orange-600',
      verified: 'from-sky-600 to-indigo-700',
    };

    const newCompany: TradingCompanyAd = {
      id: `tc-${Date.now()}`,
      companyName: adNameFa,
      englishName: adNameEn || 'VIP Verified Trading Co.',
      category: adCategory,
      categoryLabel: categoryLabels[adCategory],
      sponsorTier: adTier,
      sponsorBadgeText: badgeLabels[adTier],
      cityAndHub: adCity || 'تهران (پاساژ علاءالدین و چارسو) · دبی',
      specialty: adSpecialty || 'پخش عمده موبایل، لپ‌تاپ و قطعات اصلی با ضمانت اصالت',
      adBannerHeadline: adHeadline,
      partnerOfferText:
        adOffer || 'ارسال فوری به سراسر کشور + شرایط ویژه همکاری نقدی و چک صیادی',
      whatsappPhone: adWhatsapp || '989120000000',
      landlinePhone: adLandline || '021-66700000',
      yearsActive: 10,
      verifiedGuarantee: 'تضمین اصالت کالا + کد فعال‌سازی همتا و فاکتور رسمی',
      accentColor: colors[adTier],
    };

    onAddTradingCompany(newCompany);
    setAdNameFa('');
    setAdNameEn('');
    setAdCity('');
    setAdSpecialty('');
    setAdHeadline('');
    setAdOffer('');
    setAdAddedSuccess(true);
    setTimeout(() => setAdAddedSuccess(false), 3500);
  };

  // Owner Total 5-Stream Monthly Revenue Calculation
  const stream1WhiteLabelRevenue = monthlyWhiteLabelCount * avgWhiteLabelPrice;
  const stream2SubscriptionRevenue = monthlySubscribersCount * 980000;
  const stream3AdsRevenue = monthlySponsorAdsCount * 6800000;
  const totalOwnerMonthlyRevenue =
    stream1WhiteLabelRevenue + stream2SubscriptionRevenue + stream3AdsCountBonus(monthlySponsorAdsCount, stream3AdsRevenue);

  function stream3AdsCountBonus(_count: number, baseAds: number) {
    return baseAds;
  }

  const marketerCommission = Math.round(avgWhiteLabelPrice * 0.25);

  const handleGenerateCode = () => {
    const cleanPhone = visitorPhone.replace(/[^0-9]/g, '').slice(-4) || '7740';
    const randomNum = Math.floor(100 + Math.random() * 900);
    setGeneratedCode(`FB-VIP-${cleanPhone}-${randomNum}`);
  };

  const pitchScripts = [
    {
      title: '۱. متن مذاکره فروش نسخه اختصاصی (White-Label) به بازرگانی‌ها و فروشگاه‌های بزرگ (۱۹ تا ۳۵ میلیون تومان):',
      text: `سلام و عرض ادب خدمت مدیریت محترم «${draftWL.storeOrCompanyNameFa}» 🌟
ما سامانه اختصاصی اعلام فی لحظه‌ای و فروش هوشمند رو دقیقاً با نام، لوگو و شماره واتساپ بازرگانی خودتون آماده کردیم:
✅ تغییر کل لیست قیمت‌های تومانی گوشی، لپ‌تاپ و قطعات در ۰.۰۱ ثانیه فقط با تغییر نرخ دلار/درهم دبی
✅ قفل نوسان شدید بازار با ۱ کلیک + صدور پیش‌فاکتور رسمی PDF با کد IMEI
✅ ماشین‌حساب اقساط چک صیادی، استعلام رنگ چک و برچسب هوشمند QR ویترین مغازه
✅ قابل نصب ۱-کلیکی روی آیفون و اندروید تمام مشتریان و همکاران شما
🔑 کد لایسنس اختصاصی بازرگانی شما: ${generatedLicenseKey}`,
    },
    {
      title: '۲. متن مذاکره جذب اسپانسر تبلیغاتی و معرفی بازرگانی در دایرکتوری برنامه:',
      text: `سلام همکار گرامی 🌹
اپلیکیشن «Afrina FeeBan VIP | آفرینا فی‌بان» مرجع روزانه موبایل‌فروشان، تعمیرکاران و خریداران عمده در علاءالدین، چارسو و شهرستان‌هاست.
برای اینکه بازرگانی و فروشگاه شما به عنوان «💎 اسپانسر الماسی و تامین‌کننده تاییدشده» در بالای لیست قیمت لحظه‌ای نمایش داده بشه و سفارش‌های خریداران مستقیم به واتساپ فروشتون بیاد، جایگاه ویژه ماهانه رو با کد تخفیف ${generatedCode} براتون رزرو کردیم.`,
    },
  ];

  const handleCopyText = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-6xl rounded-2xl bg-white border-2 border-slate-200 shadow-2xl overflow-hidden my-6 text-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-emerald-600 via-sky-600 to-indigo-600 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-xs text-amber-300">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black">
                مرکز درآمدزایی ۵گانه، شخصی‌سازی اختصاصی فروشگاه‌ها (White-Label)، تبلیغات بازرگانی‌ها و اشتراک مایکت/بازار
              </h2>
              <p className="text-xs text-white/90 mt-0.5">
                Able Way City Afrina | اکوسیستم آفرینش · آفرینا فی‌بان (Afrina FeeBan VIP)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Interactive Navigation Tabs */}
        <div className="px-5 pt-3 pb-3 bg-slate-100 border-b border-slate-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            <button
              onClick={() => setView('whitelabel')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                view === 'whitelabel'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-300 hover:border-emerald-500'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>۱. شخصی‌سازی و فروش به فروشگاه/بازرگانی</span>
            </button>

            <button
              onClick={() => setView('ads')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                view === 'ads'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-300 hover:border-amber-500'
              }`}
            >
              <Megaphone className="w-4 h-4" />
              <span>۲. تبلیغات و معرفی بازرگانی‌ها و فروشگاه‌ها</span>
            </button>

            <button
              onClick={() => setView('vip')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                view === 'vip'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-300 hover:border-sky-500'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>۳. اشتراک ماهانه تا سالانه (مایکت و بازار)</span>
            </button>

            <button
              onClick={() => setView('affiliate')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                view === 'affiliate'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-300 hover:border-indigo-500'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>۴. مدل درآمدی ۵گانه و ویزیتورهای پورسانتی</span>
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-5 max-h-[76vh] overflow-y-auto space-y-6">
          {/* TAB 1: WHITE-LABEL CUSTOMIZER FOR STORES & TRADING COMPANIES */}
          {view === 'whitelabel' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-200 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-sm font-black text-emerald-950 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-emerald-700" />
                    <span>
                      موتور شخصی‌سازی ۱-کلیکی (White-Label) جهت فروش اختصاصی برنامه به فروشگاه‌ها و بازرگانی‌ها با قیمت عالی (۱۹ تا ۴۵ میلیون تومان)
                    </span>
                  </div>
                  <p className="text-xs text-emerald-800">
                    با تغییر اطلاعات زیر یا انتخاب یکی از الگوهای آماده، کل هدر برنامه، لینک‌های واتساپ، پیش‌فاکتور رسمی IMEI و استوری‌ساز به نام آن فروشگاه یا بازرگانی تبدیل می‌شود!
                  </p>
                </div>
                {whiteLabelConfig.isCustomBrandActive && (
                  <button
                    onClick={() => handleSelectPreset(WHITELABEL_PRESETS[0].config)}
                    className="px-3.5 py-2 rounded-xl bg-white border border-emerald-400 text-emerald-900 text-xs font-extrabold hover:bg-emerald-100 cursor-pointer"
                  >
                    بازگشت به برند اصلی (آفرینا فی‌بان)
                  </button>
                )}
              </div>

              {/* 4 Instant White-Label Presets */}
              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-slate-700">
                  پیش‌نمایش فوری ۱-کلیکی برای انواع مشتریان هدف (روی هر کدام کلیک کنید تا کل برنامه به نام آن بازرگانی شود):
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {WHITELABEL_PRESETS.map((preset) => {
                    const isCurrent =
                      draftWL.storeOrCompanyNameFa === preset.config.storeOrCompanyNameFa;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleSelectPreset(preset.config)}
                        className={`text-right p-3.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-between gap-2 ${
                          isCurrent
                            ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                            : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-emerald-400'
                        }`}
                      >
                        <span>{preset.label}</span>
                        {isCurrent && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {wlSavedToast && (
                <div className="p-3.5 rounded-xl bg-emerald-600 text-white text-xs font-extrabold flex items-center justify-between">
                  <span>
                    ✓ کل برنامه با موفقیت برای «{draftWL.storeOrCompanyNameFa}» شخصی‌سازی شد! هدر بالای صفحه و پیش‌فاکتورها را مشاهده کنید.
                  </span>
                  <span className="font-mono-num">لایسنس: {generatedLicenseKey}</span>
                </div>
              )}

              {/* Custom Store / Trading Company Form */}
              <form
                onSubmit={handleApplyWhiteLabel}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4"
              >
                <h3 className="text-sm font-black text-slate-900 border-b border-slate-200 pb-2">
                  فرم شخصی‌سازی اختصاصی برای فروشگاه یا بازرگانی خریدار:
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      نام فارسی فروشگاه یا بازرگانی:
                    </label>
                    <input
                      type="text"
                      required
                      value={draftWL.storeOrCompanyNameFa}
                      onChange={(e) =>
                        setDraftWL({ ...draftWL, storeOrCompanyNameFa: e.target.value })
                      }
                      placeholder="مثلاً: بازرگانی بزرگ موبایل پاسارگاد"
                      className="w-full rounded-xl bg-white border border-slate-300 px-3 py-2.5 text-xs font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      نام انگلیسی برند (English Brand Name):
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      value={draftWL.storeOrCompanyNameEn}
                      onChange={(e) =>
                        setDraftWL({ ...draftWL, storeOrCompanyNameEn: e.target.value })
                      }
                      placeholder="Pasargad Mobile Trading VIP"
                      className="w-full rounded-xl bg-white border border-slate-300 px-3 py-2.5 text-xs font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      قیمت فروش این نسخه اختصاصی به مشتری (تومان):
                    </label>
                    <input
                      type="number"
                      value={draftWL.licenseSalePriceToman}
                      onChange={(e) =>
                        setDraftWL({
                          ...draftWL,
                          licenseSalePriceToman: Number(e.target.value) || 24800000,
                        })
                      }
                      className="w-full rounded-xl bg-white border border-emerald-400 px-3 py-2.5 text-xs font-mono-num font-black text-emerald-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      شماره واتساپ فروش بازرگانی / فروشگاه:
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      value={draftWL.whatsappNumber}
                      onChange={(e) =>
                        setDraftWL({ ...draftWL, whatsappNumber: e.target.value })
                      }
                      placeholder="989121112233"
                      className="w-full rounded-xl bg-white border border-slate-300 px-3 py-2.5 text-xs font-mono-num text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      تلفن ثابت دفتر پخش / فروشگاه:
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      value={draftWL.landlinePhone}
                      onChange={(e) =>
                        setDraftWL({ ...draftWL, landlinePhone: e.target.value })
                      }
                      placeholder="021-66728899"
                      className="w-full rounded-xl bg-white border border-slate-300 px-3 py-2.5 text-xs font-mono-num text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      نشان تخصصی (زیرعنوان طلایی برند):
                    </label>
                    <input
                      type="text"
                      value={draftWL.specialtyBadge}
                      onChange={(e) =>
                        setDraftWL({ ...draftWL, specialtyBadge: e.target.value })
                      }
                      className="w-full rounded-xl bg-white border border-slate-300 px-3 py-2.5 text-xs text-slate-900"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      شعار تجاری و توضیحات هدر فروشگاه / بازرگانی:
                    </label>
                    <input
                      type="text"
                      value={draftWL.sloganFa}
                      onChange={(e) =>
                        setDraftWL({ ...draftWL, sloganFa: e.target.value })
                      }
                      className="w-full rounded-xl bg-white border border-slate-300 px-3 py-2.5 text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      آدرس دفتر مرکزی / فروشگاه:
                    </label>
                    <input
                      type="text"
                      value={draftWL.cityAndAddress}
                      onChange={(e) =>
                        setDraftWL({ ...draftWL, cityAndAddress: e.target.value })
                      }
                      className="w-full rounded-xl bg-white border border-slate-300 px-3 py-2.5 text-xs text-slate-900"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="text-xs text-slate-600">
                    ارزش قرارداد فروش اختصاصی این نسخه:{' '}
                    <strong className="text-emerald-700 font-mono-num text-sm">
                      {formatToman(draftWL.licenseSalePriceToman)} تومان
                    </strong>{' '}
                    (به همراه APK اختصاصی و ساب‌دامین)
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-sm cursor-pointer"
                    >
                      اعمال آنی برند روی کل برنامه + صدور لایسنس
                    </button>

                    <a
                      href={`https://wa.me/${draftWL.whatsappNumber}?text=${encodeURIComponent(
                        `پیش‌فاکتور رسمی راه‌اندازی سامانه اختصاصی White-Label برای «${
                          draftWL.storeOrCompanyNameFa
                        }» (${draftWL.storeOrCompanyNameEn})\nکد لایسنس: ${generatedLicenseKey}\nمبلغ قرارداد اختصاصی: ${formatToman(
                          draftWL.licenseSalePriceToman
                        )} تومان\nشامل: وب‌اپلیکیشن iOS + خروجی اندروید مایکت/بازار + پنل نرخ لحظه‌ای ارز و چک صیادی.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold"
                    >
                      <Send className="w-3.5 h-3.5 text-amber-400" />
                      <span>ارسال پیش‌فاکتور فروش برنامه به واتساپ این بازرگانی</span>
                    </a>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: ADVERTISEMENTS & FEATURED STORES / TRADING COMPANIES DIRECTORY MANAGER */}
          {view === 'ads' && (
            <div className="space-y-6">
              {/* Ad Packages Pricing Cards */}
              <div>
                <h3 className="text-sm font-black text-slate-900 mb-3 flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-amber-600" />
                  <span>
                    تعرفه جایگاه‌های تبلیغاتی و معرفی بازرگانی‌ها و فروشگاه‌ها در برنامه (منبع درآمد مستمر ماهانه برای شما):
                  </span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {AD_PLACEMENT_PACKAGES.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="p-4 rounded-2xl bg-amber-50/60 border-2 border-amber-200 flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-extrabold text-amber-900 bg-amber-200/70 px-2.5 py-0.5 rounded-md">
                            {pkg.badge}
                          </span>
                          <span className="text-[11px] font-bold text-emerald-700">
                            {pkg.estimatedViews}
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-slate-900 leading-snug">
                          {pkg.title}
                        </h4>
                        <p className="text-xs text-slate-600">{pkg.positionDesc}</p>
                        <div className="p-2.5 rounded-xl bg-white border border-amber-200 flex items-center justify-between">
                          <span className="text-xs text-slate-500">{pkg.durationLabel}:</span>
                          <span className="text-base font-black text-emerald-700 font-mono-num">
                            {formatToman(pkg.priceToman)} تومان
                          </span>
                        </div>
                        <ul className="space-y-1.5 pt-1">
                          {pkg.features.map((f, i) => (
                            <li key={i} className="flex items-start gap-1.5 text-xs text-slate-700">
                              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add New Sponsored Store / Trading Company Form */}
              <form
                onSubmit={handleCreateTradingCompanyAd}
                className="p-5 rounded-2xl bg-slate-50 border-2 border-slate-200 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-emerald-600" />
                    <span>
                      ثبت فوری آگهی تبلیغاتی و معرفی فروشگاه / بازرگانی جدید در صفحه اصلی برنامه:
                    </span>
                  </h3>
                  <span className="text-xs font-bold text-slate-500">
                    هم‌اکنون {tradingCompanies.length} بازرگانی و فروشگاه در برنامه فعال هستند
                  </span>
                </div>

                {adAddedSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-600 text-white text-xs font-extrabold">
                    ✓ بنر تبلیغاتی و پروفایل بازرگانی جدید با موفقیت به صفحه اصلی برنامه اضافه شد!
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      نام فروشگاه یا بازرگانی تبلیغ‌دهنده:
                    </label>
                    <input
                      type="text"
                      required
                      value={adNameFa}
                      onChange={(e) => setAdNameFa(e.target.value)}
                      placeholder="مثلاً: بازرگانی موبایل و لپ‌تاپ اطلس دبی"
                      className="w-full rounded-xl bg-white border border-slate-300 px-3 py-2 text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      حوزه فعالیت تخصصی:
                    </label>
                    <select
                      value={adCategory}
                      onChange={(e) =>
                        setAdCategory(e.target.value as TradingCompanyAd['category'])
                      }
                      className="w-full rounded-xl bg-white border border-slate-300 px-3 py-2 text-xs font-bold text-slate-900"
                    >
                      <option value="mobile_importer">
                        واردکننده مستقیم موبایل و تبلت (دبی / علاءالدین)
                      </option>
                      <option value="laptop_distributor">
                        بازرگانی تخصصی لپ‌تاپ، مک‌بوک و سرفیس
                      </option>
                      <option value="parts_wholesaler">
                        پخش عمده قطعات تعمیراتی و LCD فابریک
                      </option>
                      <option value="accessories_hub">
                        پخش کارتنی لوازم جانبی و گجت هوشمند
                      </option>
                      <option value="installment_store">
                        فروشگاه برتر فروش اقساطی چک صیادی و معاوضه
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      سطح جایگاه تبلیغاتی (اسپانسرشیپ):
                    </label>
                    <select
                      value={adTier}
                      onChange={(e) =>
                        setAdTier(e.target.value as TradingCompanyAd['sponsorTier'])
                      }
                      className="w-full rounded-xl bg-white border border-slate-300 px-3 py-2 text-xs font-bold text-slate-900"
                    >
                      <option value="diamond">💎 اسپانسر الماسی (بنر بالای صفحه + دایرکتوری)</option>
                      <option value="gold">🥇 اسپانسر طلایی (کارت ویژه دایرکتوری)</option>
                      <option value="verified">✅ فروشگاه و بازرگانی تاییدشده</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      شهر و آدرس مرکز پخش:
                    </label>
                    <input
                      type="text"
                      value={adCity}
                      onChange={(e) => setAdCity(e.target.value)}
                      placeholder="تهران، پاساژ علاءالدین طبقه ۵ / دبی"
                      className="w-full rounded-xl bg-white border border-slate-300 px-3 py-2 text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      کالاها و برندهای تخصصی:
                    </label>
                    <input
                      type="text"
                      value={adSpecialty}
                      onChange={(e) => setAdSpecialty(e.target.value)}
                      placeholder="پخش آیفون ۱۶، مک‌بوک M3 و ال‌سی‌دی روکاری"
                      className="w-full rounded-xl bg-white border border-slate-300 px-3 py-2 text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      شماره واتساپ سفارشات بازرگانی:
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      value={adWhatsapp}
                      onChange={(e) => setAdWhatsapp(e.target.value)}
                      placeholder="989120000000"
                      className="w-full rounded-xl bg-white border border-slate-300 px-3 py-2 text-xs font-mono-num text-slate-900"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      تیتر اصلی بنر تبلیغاتی (جمله جذاب برای جذب موبایل‌فروشان و مشتریان):
                    </label>
                    <input
                      type="text"
                      required
                      value={adHeadline}
                      onChange={(e) => setAdHeadline(e.target.value)}
                      placeholder="مثلاً: پخش مستقیم آیفون و سامسونگ زیر فی علاءالدین با شرایط چک صیادی ۶۰ روزه!"
                      className="w-full rounded-xl bg-white border border-slate-300 px-3 py-2 text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      پیشنهاد ویژه همکاری / تخفیف:
                    </label>
                    <input
                      type="text"
                      value={adOffer}
                      onChange={(e) => setAdOffer(e.target.value)}
                      placeholder="ارسال رایگان + ۷ روز مهلت تست"
                      className="w-full rounded-xl bg-white border border-slate-300 px-3 py-2 text-xs text-slate-900"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold cursor-pointer"
                >
                  + انتشار فوری بنر تبلیغاتی و معرفی این بازرگانی در برنامه
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: MONTHLY TO ANNUAL SUBSCRIPTIONS (MYKET & CAFEBAZAAR BILLING) */}
          {view === 'vip' && (
            <div className="space-y-5">
              {/* Payment Gateway Selector (Myket / CafeBazaar / Web) */}
              <div className="p-4 rounded-2xl bg-sky-50 border-2 border-sky-200 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-black text-sky-950 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-sky-700" />
                    <span>
                      درگاه پرداخت درون‌برنامه‌ای اشتراک ماهانه تا سالانه (متصل به پل بیلینگ مایکت و کافه‌بازار در MainActivity.java)
                    </span>
                  </h3>
                  <p className="text-xs text-sky-800 mt-0.5">
                    مغازه‌داران و همکاران می‌توانند اشتراک خود را به صورت ۱ ماهه، ۳ ماهه، ۶ ماهه، ۱ ساله یا ۲ ساله مستقیم از طریق مایکت و بازار تمدید کنند.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedGateway('myket')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-extrabold border cursor-pointer transition-all ${
                      selectedGateway === 'myket'
                        ? 'bg-sky-600 text-white border-sky-700 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    🛒 پرداخت درون‌برنامه‌ای مایکت (Myket)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedGateway('bazaar')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-extrabold border cursor-pointer transition-all ${
                      selectedGateway === 'bazaar'
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    🛍️ پرداخت درون‌برنامه‌ای کافه‌بازار (Bazaar)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedGateway('zarinpal')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-extrabold border cursor-pointer transition-all ${
                      selectedGateway === 'zarinpal'
                        ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    💳 درگاه مستقیم شاپرک (وب / iOS)
                  </button>
                </div>
              </div>

              {billingReceipt && (
                <div className="p-4 rounded-xl bg-emerald-600 text-white text-xs font-extrabold flex items-center justify-between gap-3">
                  <span>{billingReceipt}</span>
                  <button
                    onClick={() => setBillingReceipt(null)}
                    className="px-2.5 py-1 rounded bg-white/20 text-white text-[11px] cursor-pointer"
                  >
                    بستن رسید
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {VIP_TIERS.map((tier) => {
                  const isSelected = activeVipLevel === tier.level;
                  return (
                    <div
                      key={tier.level}
                      className={`flex flex-col justify-between p-4 rounded-2xl border-2 transition-all ${
                        tier.popular
                          ? 'bg-amber-50/40 border-amber-400 shadow-md'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-sky-700">
                            VIP LEVEL {tier.level}
                          </span>
                          {tier.popular && (
                            <span className="text-[11px] font-extrabold text-amber-900 bg-amber-200 px-2 py-0.5 rounded">
                              پرفروش‌ترین
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-black text-slate-900 leading-snug">
                          {tier.title}
                        </h3>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          {tier.audience}
                        </p>

                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                          <div className="text-[11px] font-bold text-slate-500">
                            {tier.durationLabel}
                          </div>
                          <div className="text-lg font-black text-slate-900 font-mono-num mt-0.5">
                            {formatToman(tier.priceToman)} ت
                          </div>
                          <div className="text-[10px] font-bold text-emerald-700 mt-0.5">
                            {tier.monthlyEquivalent}
                          </div>
                        </div>

                        <div className="text-[11px] font-bold text-amber-900 bg-amber-100/70 border border-amber-200 rounded-lg p-2">
                          {tier.creditCeilingText}
                        </div>

                        <ul className="space-y-1.5 pt-1">
                          {tier.features.map((f, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-1.5 text-xs text-slate-700 leading-relaxed"
                            >
                              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        onClick={() =>
                          handleMarketSubscriptionPurchase(
                            tier.level,
                            tier.durationLabel,
                            tier.priceToman
                          )
                        }
                        className={`mt-5 w-full py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-600 text-white'
                            : 'bg-sky-600 hover:bg-sky-500 text-white'
                        }`}
                      >
                        {isSelected
                          ? `✓ اشتراک فعال شما (VIP ${tier.level})`
                          : `خرید از ${
                              selectedGateway === 'myket'
                                ? 'مایکت'
                                : selectedGateway === 'bazaar'
                                ? 'بازار'
                                : 'درگاه وب'
                            }`}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: 5-STREAM REVENUE MODEL & AFFILIATE MARKETER CLUB */}
          {view === 'affiliate' && (
            <div className="space-y-6">
              {/* Owner 5-Stream Revenue Simulator */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-sky-50 border-2 border-emerald-300 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-200 pb-3">
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-slate-900">
                      💎 شبیه‌ساز بهترین مدل درآمدی ۵گانه برای مالک اپلیکیشن (شما)
                    </h3>
                    <p className="text-xs text-slate-600">
                      ترکیب همزمان ۱. فروش اختصاصی White-Label به بازرگانی‌ها + ۲. اشتراک ماهانه/سالانه مایکت و بازار + ۳. تبلیغات بنری بازرگانی‌ها
                    </p>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-right">
                    <span className="block text-[11px] opacity-90">
                      مجموع درآمد ماهانه برآوردی شما:
                    </span>
                    <span className="text-lg sm:text-xl font-black font-mono-num">
                      {formatToman(totalOwnerMonthlyRevenue)} تومان / ماه
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Stream 1: White-Label Sales */}
                  <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                    <div className="flex justify-between text-xs font-extrabold text-emerald-800">
                      <span>۱. فروش نسخه اختصاصی به بازرگانی‌ها:</span>
                      <span className="font-mono-num">{monthlyWhiteLabelCount} قرارداد در ماه</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={20}
                      value={monthlyWhiteLabelCount}
                      onChange={(e) => setMonthlyWhiteLabelCount(Number(e.target.value))}
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                    <div className="flex justify-between items-center text-xs pt-1">
                      <span className="text-slate-500">میانگین هر لایسنس: ۲۵ میلیون ت</span>
                      <strong className="text-slate-900 font-mono-num">
                        {formatToman(stream1WhiteLabelRevenue)} ت
                      </strong>
                    </div>
                  </div>

                  {/* Stream 2: Monthly/Annual Subscriptions in Myket & Bazaar */}
                  <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                    <div className="flex justify-between text-xs font-extrabold text-sky-800">
                      <span>۲. مشترکین ماهانه/سالانه مایکت و بازار:</span>
                      <span className="font-mono-num">{monthlySubscribersCount} مغازه‌دار</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={500}
                      step={5}
                      value={monthlySubscribersCount}
                      onChange={(e) => setMonthlySubscribersCount(Number(e.target.value))}
                      className="w-full accent-sky-600 cursor-pointer"
                    />
                    <div className="flex justify-between items-center text-xs pt-1">
                      <span className="text-slate-500">میانگین اشتراک: ۹۸۰ هزار ت</span>
                      <strong className="text-slate-900 font-mono-num">
                        {formatToman(stream2SubscriptionRevenue)} ت
                      </strong>
                    </div>
                  </div>

                  {/* Stream 3: Sponsored Trading Company Ads */}
                  <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                    <div className="flex justify-between text-xs font-extrabold text-amber-800">
                      <span>۳. بنرهای تبلیغاتی و معرفی بازرگانی‌ها:</span>
                      <span className="font-mono-num">{monthlySponsorAdsCount} بازرگانی اسپانسر</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={30}
                      value={monthlySponsorAdsCount}
                      onChange={(e) => setMonthlySponsorAdsCount(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                    <div className="flex justify-between items-center text-xs pt-1">
                      <span className="text-slate-500">میانگین تعرفه آگهی: ۶.۸ میلیون ت</span>
                      <strong className="text-slate-900 font-mono-num">
                        {formatToman(stream3AdsRevenue)} ت
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Affiliate Marketers Section */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <div className="flex items-center gap-2 text-indigo-800 font-black text-sm">
                    <Users className="w-5 h-5" />
                    <span>
                      سیستم پورسانت ۲۵٪ ویزیتورها (برای فروش نسخه اختصاصی به فروشگاه‌ها و بازرگانی‌ها)
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      انتخاب پکیج هدف برای بازاریابی حضوری در علاءالدین، چارسو، پایتخت و شهرستان‌ها:
                    </label>
                    <select
                      value={avgWhiteLabelPrice}
                      onChange={(e) => setAvgWhiteLabelPrice(Number(e.target.value))}
                      className="w-full rounded-xl bg-white border border-slate-300 px-3.5 py-2.5 text-xs font-bold text-slate-900"
                    >
                      <option value={35000000}>
                        لایسنس اختصاصی بازرگانی واردات موبایل (White-Label Enterprise) — ۳۵,۰۰۰,۰۰۰ تومان
                      </option>
                      <option value={25000000}>
                        لایسنس اختصاصی بازرگانی لپ‌تاپ و قطعات — ۲۵,۰۰۰,۰۰۰ تومان
                      </option>
                      <option value={14800000}>
                        لایسنس اختصاصی فروشگاه بزرگ موبایل و اقساط — ۱۴,۸۰۰,۰۰۰ تومان
                      </option>
                    </select>
                  </div>

                  <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-between">
                    <div>
                      <span className="block text-xs font-bold text-indigo-950">
                        پورسانت نقدی ویزیتور بابت هر ۱ قرارداد فروش اختصاصی:
                      </span>
                      <span className="text-[11px] text-indigo-700">
                        ۷۵٪ خالص برای شما + ۲۵٪ پورسانت انگیزشی برای ویزیتور
                      </span>
                    </div>
                    <div className="text-xl font-black text-indigo-700 font-mono-num">
                      {formatToman(marketerCommission)} تومان
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-slate-900 font-black text-sm">
                      <Award className="w-5 h-5 text-amber-500" />
                      <span>صدور کد نمایندگی فروش و بازاریابی</span>
                    </div>
                    <input
                      type="text"
                      value={visitorName}
                      onChange={(e) => setVisitorName(e.target.value)}
                      placeholder="نام بازاریاب یا کارشناس فروش"
                      className="w-full rounded-xl bg-white border border-slate-300 px-3 py-2 text-xs text-slate-900"
                    />
                    <input
                      type="text"
                      dir="ltr"
                      value={visitorPhone}
                      onChange={(e) => setVisitorPhone(e.target.value)}
                      placeholder="09120000000"
                      className="w-full rounded-xl bg-white border border-slate-300 px-3 py-2 text-xs font-mono-num text-slate-900"
                    />
                    <button
                      onClick={handleGenerateCode}
                      className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs cursor-pointer"
                    >
                      صدور کد رسمی نمایندگی
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600">کد نمایندگی:</span>
                    <span className="text-sm font-black text-indigo-700 font-mono-num">
                      {generatedCode}
                    </span>
                  </div>
                </div>
              </div>

              {/* Ready Pitch Scripts */}
              <div className="space-y-3">
                <h3 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>
                    متن‌های آماده مذاکره جهت فروش نسخه اختصاصی (White-Label) و جذب تبلیغات بازرگانی‌ها:
                  </span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pitchScripts.map((script, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <h4 className="text-xs font-black text-slate-900 mb-2">
                          {script.title}
                        </h4>
                        <pre className="text-xs text-slate-700 whitespace-pre-wrap font-sans leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                          {script.text}
                        </pre>
                      </div>
                      <button
                        onClick={() => handleCopyText(script.text, idx)}
                        className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-bold text-amber-300 cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>
                          {copiedIndex === idx
                            ? '✓ متن مذاکره کپی شد!'
                            : 'کپی متن آماده مذاکره'}
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
