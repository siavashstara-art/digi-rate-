import React, { useState, useEffect, useMemo } from 'react';
import {
  Smartphone,
  Calculator,
  Image as ImageIcon,
  FileText,
  Crown,
  Lock,
  Unlock,
  RefreshCw,
  Volume2,
  VolumeX,
  Brain,
  Eye,
  Type,
  Search,
  CheckCircle2,
  Send,
  Plus,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Globe,
  PackageCheck,
  Wrench,
  Bot,
  SlidersHorizontal,
  Scale,
  Laptop,
  Building2,
  Megaphone,
  QrCode,
  ShieldAlert,
  Flame,
  Palette,
  PhoneCall,
} from 'lucide-react';
import {
  CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_BUY_REQUESTS,
  INITIAL_TRADING_COMPANIES,
  DEFAULT_WHITELABEL_CONFIG,
  CategoryId,
  MarketRates,
  ProductItem,
  WholesaleBuyRequest,
  TradingCompanyAd,
  WhiteLabelConfig,
  calculateProductPrices,
  formatToman,
  formatForeign,
} from './data/mockData';
import { LANGUAGES, LanguageCode, UI_TRANSLATIONS } from './data/i18n';
import { InstallmentTradeInModal } from './components/InstallmentTradeInModal';
import { StoryMakerModal } from './components/StoryMakerModal';
import { InvoiceCartModal, CartEntry } from './components/InvoiceCartModal';
import { VipAffiliateModal, MonetizationTab } from './components/VipAffiliateModal';
import { PwaGithubModal } from './components/PwaGithubModal';
import { DeviceComparisonModal } from './components/DeviceComparisonModal';
import { ProInnovationModal } from './components/ProInnovationModal';
import {
  VipCommercialArchitectureSections,
  IsolatedTenantRecord,
} from './components/VipCommercialArchitectureSections';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export default function App() {
  // Language & Direction State
  const [lang, setLang] = useState<LanguageCode>('fa');
  const currentLangMeta = useMemo(
    () => LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0],
    [lang]
  );
  const t = UI_TRANSLATIONS[lang];

  useEffect(() => {
    document.documentElement.dir = currentLangMeta.dir;
    document.documentElement.lang = currentLangMeta.code;
  }, [currentLangMeta]);

  // Accessibility & ADHD & Deaf/Blind States
  const [adhdFocusMode, setAdhdFocusMode] = useState<boolean>(false);
  const [fontScale, setFontScale] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [deafVisualMode, setDeafVisualMode] = useState<boolean>(false);
  const [liveVisualCaption, setLiveVisualCaption] = useState<string>(
    'زیرنویس زنده بصری (ویژه ناشنوایان): سامانه آماده است — نرخ لحظه‌ای دلار ۶۸,۵۰۰ تومان و درهم ۱۸,۷۵۰ تومان.'
  );

  // Live Market Exchange Rates State
  const [rates, setRates] = useState<MarketRates>({
    USD: 68500,
    AED: 18750,
    CNY: 9550,
    USDT: 68900,
    isVolatilityLocked: false,
    updatedAt: 'لحظاتی پیش',
  });
  const [showRateEditor, setShowRateEditor] = useState<boolean>(false);
  const [draftUsd, setDraftUsd] = useState<string>('68500');
  const [draftAed, setDraftAed] = useState<string>('18750');
  const [draftCny, setDraftCny] = useState<string>('9550');
  const [draftUsdt, setDraftUsdt] = useState<string>('68900');

  // Products, Categories & Search
  const [products] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  // Wholesale Buy Requests Board
  const [buyRequests, setBuyRequests] = useState<WholesaleBuyRequest[]>(INITIAL_BUY_REQUESTS);
  const [showNewRequestForm, setShowNewRequestForm] = useState<boolean>(false);
  const [newReqStore, setNewReqStore] = useState<string>('');
  const [newReqCity, setNewReqCity] = useState<string>('');
  const [newReqItems, setNewReqItems] = useState<string>('');
  const [newReqPhone, setNewReqPhone] = useState<string>('');

  // Official Proforma Invoice Cart
  const [cart, setCart] = useState<CartEntry[]>([
    {
      product: INITIAL_PRODUCTS[0],
      qty: 2,
      customImei: `${INITIAL_PRODUCTS[0].imeiPrefix}48291`,
    },
  ]);

  // Modals State
  const [isCalcModalOpen, setIsCalcModalOpen] = useState<boolean>(false);
  const [calcInitialProduct, setCalcInitialProduct] = useState<ProductItem | null>(null);
  const [calcInitialTab, setCalcInitialTab] = useState<'installment' | 'tradein'>('installment');
  const [isStoryModalOpen, setIsStoryModalOpen] = useState<boolean>(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState<boolean>(false);
  const [isVipModalOpen, setIsVipModalOpen] = useState<boolean>(false);
  const [vipInitialView, setVipInitialView] = useState<MonetizationTab>('vip');
  const [activeVipLevel, setActiveVipLevel] = useState<number>(3);
  const [isPwaModalOpen, setIsPwaModalOpen] = useState<boolean>(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);
  const [isProModalOpen, setIsProModalOpen] = useState<boolean>(false);
  const [proInitialTab, setProInitialTab] = useState<
    'qr_label' | 'sayadi_check' | 'parts_passport' | 'flash_clearance'
  >('qr_label');

  // White-Label Store / Trading Company Personalization State
  const [whiteLabelConfig, setWhiteLabelConfig] = useState<WhiteLabelConfig>(
    DEFAULT_WHITELABEL_CONFIG
  );

  // Isolated White-Label Tenant & URL Skin State (?tenant=...&manager=...&city=...&phone=...&ref=...)
  const [activeTenant, setActiveTenant] = useState<IsolatedTenantRecord>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlTenant = params.get('tenant');
      const urlManager = params.get('manager');
      const urlCity = params.get('city');
      const urlPhone = params.get('phone');
      const urlRef = params.get('ref');

      if (urlTenant) {
        const slug = urlTenant.trim().toLowerCase().replace(/\s+/g, '-');
        return {
          slug,
          tenantName: urlTenant,
          managerName: urlManager || 'مدیریت محترم واحد صنفی',
          city: urlCity || 'تهران - علاءالدین / چارسو',
          phone: urlPhone || '989120000000',
          slogan: 'سامانه اختصاصی فی لحظه‌ای دلاری/درهمی، تقسیط چک صیادی و پیش‌فاکتور طلاکوب',
          priceMultiplier: 1.0,
          refCode: urlRef || 'AMB-VIP-25',
          isPermanentLicense: false,
          updatedAt: 'هم‌اکنون',
        };
      }
    }
    return {
      slug: 'royal-mobile-charsou',
      tenantName: 'آفرینا فی‌بان وی‌آی‌پی (Afrina FeeBan VIP)',
      managerName: 'حاج مهدی کریمی',
      city: 'تهران - پاساژ علاءالدین و چارسو',
      phone: '989120000000',
      slogan: 'سامانه هوشمند فی لحظه‌ای دلاری/درهمی، تقسیط چک صیادی بنفش و پیش‌فاکتور طلاکوب IMEI',
      priceMultiplier: 1.0,
      refCode: 'AMB-7740',
      isPermanentLicense: false,
      updatedAt: 'لحظاتی پیش',
    };
  });

  // Synchronize document.title automatically with active tenant business name
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = `${activeTenant.tenantName} | مدیریت: ${activeTenant.managerName} - Able Way City Afrina`;
    }
  }, [activeTenant.tenantName, activeTenant.managerName]);

  // Sponsored Ads & Featured Trading Companies / Stores State
  const [tradingCompanies, setTradingCompanies] = useState<TradingCompanyAd[]>(
    INITIAL_TRADING_COMPANIES
  );
  const [selectedAdCategory, setSelectedAdCategory] = useState<
    'all' | TradingCompanyAd['category']
  >('all');
  const [activeBannerIdx, setActiveBannerIdx] = useState<number>(0);

  // PWA Install Prompt Capture
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  // AI Assistant State
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [aiAnswer, setAiAnswer] = useState<string>(
    'برای دریافت مشاوره تخصصی مقایسه دو گوشی، راهنمای تشخیص قطعات اورجینال (ال‌سی‌دی فابریک روکاری در برابر کپی) یا تولید کپشن پرفروش اینستاگرام، یکی از دکمه‌های زیر را انتخاب کنید یا سوال خود را بنویسید.'
  );
  const [aiLoading, setAiLoading] = useState<boolean>(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  useEffect(() => {
    fetch('/api/market-rates')
      .then((r) => r.json())
      .then((data) => {
        if (data && data.USD) {
          setRates(data);
          setDraftUsd(String(data.USD));
          setDraftAed(String(data.AED));
          setDraftCny(String(data.CNY));
          setDraftUsdt(String(data.USDT));
        }
      })
      .catch(() => {});
  }, []);

  const updateRatesLive = (nextRates: Partial<MarketRates>) => {
    const merged: MarketRates = {
      ...rates,
      ...nextRates,
      updatedAt: new Date().toLocaleTimeString('fa-IR'),
    };
    setRates(merged);
    setDraftUsd(String(merged.USD));
    setDraftAed(String(merged.AED));
    setDraftCny(String(merged.CNY));
    setDraftUsdt(String(merged.USDT));

    fetch('/api/market-rates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(merged),
    }).catch(() => {});
  };

  const handleSaveRateEditor = (e: React.FormEvent) => {
    e.preventDefault();
    updateRatesLive({
      USD: Number(draftUsd) || rates.USD,
      AED: Number(draftAed) || rates.AED,
      CNY: Number(draftCny) || rates.CNY,
      USDT: Number(draftUsdt) || rates.USDT,
    });
    setShowRateEditor(false);
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        item.category === selectedCategory ||
        (selectedCategory === 'clearance' && item.isClearanceDubai);

      const q = searchQuery.trim().toLowerCase();
      if (!q) return matchesCategory;
      return (
        matchesCategory &&
        (item.title.toLowerCase().includes(q) ||
          item.englishModel.toLowerCase().includes(q) ||
          item.partNumberOrSpec.toLowerCase().includes(q) ||
          item.warehouseHub.toLowerCase().includes(q))
      );
    });
  }, [products, selectedCategory, searchQuery]);

  // Screen Reader / Audio TTS for Visually Impaired Users + Visual Caption for Deaf Users
  const speakText = (textToSpeak: string) => {
    setLiveVisualCaption(`🔔 زیرنویس زنده صوتی/بصری: ${textToSpeak}`);
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = currentLangMeta.speechLang;
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleReadSummaryAloud = () => {
    const firstProd = products[0];
    const pr = calculateProductPrices(firstProd, rates);
    const summaryText = `به سامانه آفرینا دیجی‌ریت وی‌آی‌پی، اکوسیستم آفرینش خوش آمدید. نرخ لحظه‌ای دلار امروز ${rates.USD} تومان و نرخ درهم دبی ${rates.AED} تومان است. قیمت همکار ${firstProd.title} معادل ${pr.wholesaleToman} تومان و قیمت مصرف‌کننده با کد همتا ${pr.retailToman} تومان می‌باشد.`;
    speakText(summaryText);
  };

  // Cart Handlers
  const handleAddToCart = (product: ProductItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      const randomDigits = Math.floor(10000 + Math.random() * 90000);
      return [
        ...prev,
        {
          product,
          qty: 1,
          customImei: `${product.imeiPrefix}${randomDigits}`,
        },
      ];
    });
    setIsInvoiceModalOpen(true);
  };

  const handleUpdateCartQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.product.id === productId ? { ...i, qty: Math.max(1, i.qty + delta) } : i
        )
        .filter((i) => i.qty > 0)
    );
  };

  const handleUpdateCartImei = (productId: string, imei: string) => {
    setCart((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, customImei: imei } : i))
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  };

  // Add Wholesale Buy Request
  const handleAddBuyRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReqStore || !newReqItems) return;
    const created: WholesaleBuyRequest = {
      id: `req-${Date.now()}`,
      storeName: newReqStore,
      city: newReqCity || 'شهرستان',
      buyerRole: 'همکار تاییدشده موبایل و قطعات',
      requestedItems: newReqItems,
      qtyText: 'سفارش عمده همکار',
      paymentType: 'نقدی فوری (پایا/ساتنا)',
      targetBudgetText: 'تسویه به نرخ لحظه‌ای تابلوی امروز',
      timeAgo: 'هم‌اکنون',
      whatsappPhone: newReqPhone || '989120000000',
      verifiedPartner: true,
    };
    setBuyRequests([created, ...buyRequests]);
    setNewReqStore('');
    setNewReqCity('');
    setNewReqItems('');
    setNewReqPhone('');
    setShowNewRequestForm(false);
  };

  // AI Assistant Query
  const askAiAssistant = async (customPrompt?: string, mode?: string) => {
    const queryToUse = customPrompt || aiPrompt;
    if (!queryToUse.trim()) return;
    setAiLoading(true);
    try {
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: queryToUse, mode }),
      });
      const data = await response.json();
      if (data.answer) {
        setAiAnswer(data.answer);
      }
    } catch (_err) {
      setAiAnswer('پاسخ آماده شد: لطفاً از گزینه‌های تخصصی بالا استفاده نمایید.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleTriggerNativeInstall = async () => {
    if (!deferredPrompt) return false;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      return true;
    }
    return false;
  };

  const rootA11yClasses = [
    fontScale === 'large' ? 'a11y-large-font' : fontScale === 'xlarge' ? 'a11y-xlarge-font' : '',
    highContrast ? 'a11y-high-contrast' : '',
    adhdFocusMode ? 'adhd-calm-mode' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={`min-h-screen bg-[#F8FAFC] text-slate-900 ${rootA11yClasses}`}>
      {/* 1. Top Ecosystem & Multilingual Bar */}
      <div className="bg-gradient-to-r from-emerald-600 via-sky-600 to-indigo-600 text-white px-4 py-2 text-xs shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-bold tracking-wide">
            <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
            <span>{t.topEcosystemBanner}</span>
          </div>

          {/* 5-Language Switcher (FA, AR, EN, ZH, TR) */}
          <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-2 py-1 rounded-lg">
            <Globe className="w-3.5 h-3.5 text-amber-200" />
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                  lang === l.code
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-white/90 hover:bg-white/20'
                }`}
              >
                {l.flag} {l.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Accessibility & ADHD Focus Suite Bar */}
      <div className="bg-amber-50 border-b border-amber-200/80 px-4 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
              <Brain className="w-4 h-4 text-indigo-600" />
              <span>{t.accessibilityTitle}</span>
            </span>

            <button
              onClick={() => setAdhdFocusMode(!adhdFocusMode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer whitespace-nowrap ${
                adhdFocusMode
                  ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-300 hover:border-indigo-400'
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              <span>{t.adhdModeBtn}</span>
            </button>

            <button
              onClick={handleReadSummaryAloud}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer whitespace-nowrap ${
                isSpeaking
                  ? 'bg-rose-600 text-white border-rose-700'
                  : 'bg-white text-slate-700 border-slate-300 hover:border-emerald-500'
              }`}
            >
              {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-600" />}
              <span>{isSpeaking ? 'توقف خوانش صوتی' : t.readAloudBtn}</span>
            </button>

            <button
              onClick={() =>
                setFontScale((prev) =>
                  prev === 'normal' ? 'large' : prev === 'large' ? 'xlarge' : 'normal'
                )
              }
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-slate-700 border border-slate-300 hover:border-sky-500 transition-all cursor-pointer whitespace-nowrap"
            >
              <Type className="w-3.5 h-3.5 text-sky-600" />
              <span>
                سایز فونت خوانا:{' '}
                {fontScale === 'normal' ? '۱۰۰٪' : fontScale === 'large' ? '۱۱۵٪ درشت' : '۱۳۰٪ ویژه کم‌بینایان'}
              </span>
            </button>

            <button
              onClick={() => setHighContrast(!highContrast)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer whitespace-nowrap ${
                highContrast
                  ? 'bg-slate-900 text-amber-300 border-slate-950'
                  : 'bg-white text-slate-700 border-slate-300 hover:border-slate-500'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{t.highContrastBtn}</span>
            </button>

            <button
              onClick={() => setDeafVisualMode(!deafVisualMode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer whitespace-nowrap ${
                deafVisualMode
                  ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-300 hover:border-emerald-500'
              }`}
            >
              <span>🦻 زیرنویس و هشدار بصری (ویژه ناشنوایان)</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{t.securityAutomatedBadge}</span>
          </div>
        </div>

        {/* Live Visual Subtitle Banner for Deaf & Hard-of-Hearing Users */}
        {deafVisualMode && (
          <div className="max-w-7xl mx-auto mt-2 p-2.5 rounded-xl bg-slate-900 text-amber-300 border-2 border-amber-400 text-xs font-extrabold flex items-center justify-between gap-2">
            <span>{liveVisualCaption}</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 text-[10px] font-black shrink-0">
              زیرنویس زنده فعال
            </span>
          </div>
        )}
      </div>

      {/* 3. Main Brand Header & Quick Action Toolbar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex flex-wrap items-center justify-between gap-4">
          {/* Zone 1: Brand Title (Supports Live White-Label Customization for Stores & Trading Companies) */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-sky-600 flex items-center justify-center text-white font-black text-lg shadow-md">
              {whiteLabelConfig.isCustomBrandActive ? 'PRO' : 'VIP'}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  {whiteLabelConfig.isCustomBrandActive
                    ? `${whiteLabelConfig.storeOrCompanyNameFa} | ${whiteLabelConfig.storeOrCompanyNameEn}`
                    : t.appNameFaEn}
                </h1>
                {whiteLabelConfig.isCustomBrandActive && (
                  <span className="text-[11px] font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded-md">
                    ✓ نسخه اختصاصی White-Label ({whiteLabelConfig.specialtyBadge})
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                {whiteLabelConfig.isCustomBrandActive
                  ? `${whiteLabelConfig.sloganFa} · آدرس: ${whiteLabelConfig.cityAndAddress}`
                  : t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Zone 2 & 3: Primary Interactive Tools */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsPwaModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-extrabold shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              <Smartphone className="w-4 h-4" />
              <span>{t.installPwaBtn}</span>
            </button>

            <button
              onClick={() => setIsCompareModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-extrabold shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              <Scale className="w-4 h-4" />
              <span>{t.compareBtn}</span>
            </button>

            <button
              onClick={() => {
                setProInitialTab('qr_label');
                setIsProModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              <QrCode className="w-4 h-4" />
              <span>{t.proSuiteBtn}</span>
            </button>

            <button
              onClick={() => {
                setCalcInitialProduct(products[0]);
                setCalcInitialTab('installment');
                setIsCalcModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              <Calculator className="w-4 h-4" />
              <span>{t.calcInstallmentBtn}</span>
            </button>

            <button
              onClick={() => setIsStoryModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              <ImageIcon className="w-4 h-4" />
              <span>{t.storyMakerBtn}</span>
            </button>

            <button
              onClick={() => {
                setVipInitialView('whitelabel');
                setIsVipModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              <Crown className="w-4 h-4" />
              <span>شخصی‌سازی فروشگاه / تبلیغات / اشتراک مایکت</span>
            </button>

            <button
              onClick={() => setIsInvoiceModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>
                {t.invoiceCartBtn} ({cart.reduce((sum, i) => sum + i.qty, 0)})
              </span>
            </button>

            <a
              href="#deliverables"
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 text-xs font-black transition-all whitespace-nowrap"
            >
              <span>🎁 دستاوردهای صنف و ROI</span>
            </a>

            <a
              href="#visitor-playbook"
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-950 border border-emerald-300 text-xs font-black transition-all whitespace-nowrap"
            >
              <span>💼 فرمول فروش ویزیتورها (۲۵٪)</span>
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        {/* 3.5. VIP Commercial White-Label Architecture, Desk Calculator, Deliverables, Visitor Playbook & 25% Sheba Hub */}
        <VipCommercialArchitectureSections
          products={products}
          rates={rates}
          whiteLabelConfig={whiteLabelConfig}
          onUpdateWhiteLabel={(cfg) => setWhiteLabelConfig(cfg)}
          activeTenant={activeTenant}
          onUpdateActiveTenant={(tRec) => setActiveTenant(tRec)}
          onSpeakText={speakText}
        />
        {/* 4. Live Exchange Rate Matrix & Market Volatility Lock */}
        <section className="rounded-2xl bg-white border-2 border-emerald-500/30 shadow-md p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  {t.liveRateTitle}
                </h2>
                <p className="text-xs text-slate-500">
                  آخرین بروزرسانی بنکداری: {rates.updatedAt} · تغییر نرخ ارز در ۰.۰۱ ثانیه کل لیست قیمت را آپدیت می‌کند
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowRateEditor(!showRateEditor)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>{t.quickAdjustBtn}</span>
              </button>

              <button
                onClick={() =>
                  updateRatesLive({ isVolatilityLocked: !rates.isVolatilityLocked })
                }
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap shadow-xs ${
                  rates.isVolatilityLocked
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    : 'bg-rose-600 hover:bg-rose-500 text-white'
                }`}
              >
                {rates.isVolatilityLocked ? (
                  <>
                    <Unlock className="w-4 h-4" />
                    <span>{t.unlockVolatilityBtn}</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>{t.lockVolatilityBtn}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 4 Currency Cards with Instant +/- Steppers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* USD */}
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-900 block">
                  🇺🇸 دلار آزاد تهران (USD)
                </span>
                <span className="text-xl font-black text-slate-900 font-mono-num mt-1 block">
                  {formatToman(rates.USD)} <small className="text-xs font-normal">تومان</small>
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => updateRatesLive({ USD: rates.USD + 500 })}
                  className="px-2.5 py-1 rounded bg-white border border-emerald-300 text-xs font-bold text-emerald-800 hover:bg-emerald-100 cursor-pointer"
                  title="افزایش ۵۰۰ تومان"
                >
                  +500
                </button>
                <button
                  onClick={() => updateRatesLive({ USD: Math.max(10000, rates.USD - 500) })}
                  className="px-2.5 py-1 rounded bg-white border border-emerald-300 text-xs font-bold text-rose-700 hover:bg-rose-50 cursor-pointer"
                  title="کاهش ۵۰۰ تومان"
                >
                  -500
                </button>
              </div>
            </div>

            {/* AED */}
            <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-sky-900 block">
                  🇦🇪 درهم حواله دبی (AED)
                </span>
                <span className="text-xl font-black text-slate-900 font-mono-num mt-1 block">
                  {formatToman(rates.AED)} <small className="text-xs font-normal">تومان</small>
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => updateRatesLive({ AED: rates.AED + 200 })}
                  className="px-2.5 py-1 rounded bg-white border border-sky-300 text-xs font-bold text-sky-800 hover:bg-sky-100 cursor-pointer"
                >
                  +200
                </button>
                <button
                  onClick={() => updateRatesLive({ AED: Math.max(5000, rates.AED - 200) })}
                  className="px-2.5 py-1 rounded bg-white border border-sky-300 text-xs font-bold text-rose-700 hover:bg-rose-50 cursor-pointer"
                >
                  -200
                </button>
              </div>
            </div>

            {/* CNY */}
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-amber-900 block">
                  🇨🇳 یوان شنژن چین (CNY)
                </span>
                <span className="text-xl font-black text-slate-900 font-mono-num mt-1 block">
                  {formatToman(rates.CNY)} <small className="text-xs font-normal">تومان</small>
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => updateRatesLive({ CNY: rates.CNY + 100 })}
                  className="px-2.5 py-1 rounded bg-white border border-amber-300 text-xs font-bold text-amber-900 hover:bg-amber-100 cursor-pointer"
                >
                  +100
                </button>
                <button
                  onClick={() => updateRatesLive({ CNY: Math.max(2000, rates.CNY - 100) })}
                  className="px-2.5 py-1 rounded bg-white border border-amber-300 text-xs font-bold text-rose-700 hover:bg-rose-50 cursor-pointer"
                >
                  -100
                </button>
              </div>
            </div>

            {/* USDT */}
            <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-indigo-900 block">
                  💎 تتر تجاری (USDT TRC20)
                </span>
                <span className="text-xl font-black text-slate-900 font-mono-num mt-1 block">
                  {formatToman(rates.USDT)} <small className="text-xs font-normal">تومان</small>
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => updateRatesLive({ USDT: rates.USDT + 500 })}
                  className="px-2.5 py-1 rounded bg-white border border-indigo-300 text-xs font-bold text-indigo-800 hover:bg-indigo-100 cursor-pointer"
                >
                  +500
                </button>
                <button
                  onClick={() => updateRatesLive({ USDT: Math.max(10000, rates.USDT - 500) })}
                  className="px-2.5 py-1 rounded bg-white border border-indigo-300 text-xs font-bold text-rose-700 hover:bg-rose-50 cursor-pointer"
                >
                  -500
                </button>
              </div>
            </div>
          </div>

          {/* Expandable Wholesaler Rate Editor */}
          {showRateEditor && (
            <form
              onSubmit={handleSaveRateEditor}
              className="p-4 rounded-xl bg-slate-100 border border-slate-300 grid grid-cols-1 sm:grid-cols-5 gap-3 items-end"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  نرخ دلار (تومان):
                </label>
                <input
                  type="number"
                  value={draftUsd}
                  onChange={(e) => setDraftUsd(e.target.value)}
                  className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm font-mono-num font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  نرخ درهم دبی (تومان):
                </label>
                <input
                  type="number"
                  value={draftAed}
                  onChange={(e) => setDraftAed(e.target.value)}
                  className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm font-mono-num font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  نرخ یوان چین (تومان):
                </label>
                <input
                  type="number"
                  value={draftCny}
                  onChange={(e) => setDraftCny(e.target.value)}
                  className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm font-mono-num font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  نرخ تتر (تومان):
                </label>
                <input
                  type="number"
                  value={draftUsdt}
                  onChange={(e) => setDraftUsdt(e.target.value)}
                  className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm font-mono-num font-bold text-slate-900"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs cursor-pointer"
              >
                اعمال فوری در ۰.۰۱ ثانیه
              </button>
            </form>
          )}

          {/* Volatility Lock Banner */}
          {rates.isVolatilityLocked && (
            <div className="p-4 rounded-xl bg-rose-50 border-2 border-rose-400 text-rose-900 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold">
                <Lock className="w-5 h-5 text-rose-600 shrink-0" />
                <span>{t.volatilityLockedAlert}</span>
              </div>
              <button
                onClick={() => updateRatesLive({ isVolatilityLocked: false })}
                className="px-3.5 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold cursor-pointer"
              >
                باز کردن قفل قیمت‌ها
              </button>
            </div>
          )}
        </section>

        {/* 4.5. Top Sponsored Banner & 4 Creative Pro Tools Bar */}
        <section className="space-y-4">
          {/* Active Diamond Sponsor Banner */}
          {tradingCompanies.length > 0 && (
            <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 sm:p-5 shadow-md border border-indigo-500/30">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-400 text-slate-950 text-[11px] font-black">
                      {tradingCompanies[activeBannerIdx % tradingCompanies.length].sponsorBadgeText}
                    </span>
                    <span className="text-xs font-bold text-amber-300">
                      {tradingCompanies[activeBannerIdx % tradingCompanies.length].companyName}
                    </span>
                    <span className="text-[11px] text-slate-300">
                      ({tradingCompanies[activeBannerIdx % tradingCompanies.length].cityAndHub})
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-black text-white">
                    📣 {tradingCompanies[activeBannerIdx % tradingCompanies.length].adBannerHeadline}
                  </h3>
                  <p className="text-xs text-emerald-300 font-semibold">
                    🎁 پیشنهاد ویژه همکاران:{' '}
                    {tradingCompanies[activeBannerIdx % tradingCompanies.length].partnerOfferText}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    onClick={() =>
                      setActiveBannerIdx((prev) => (prev + 1) % tradingCompanies.length)
                    }
                    className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer"
                  >
                    بنر بعدی ({(activeBannerIdx % tradingCompanies.length) + 1}/
                    {tradingCompanies.length})
                  </button>

                  <a
                    href={`https://wa.me/${
                      tradingCompanies[activeBannerIdx % tradingCompanies.length].whatsappPhone
                    }?text=${encodeURIComponent(
                      `سلام، از طریق بنر ویژه شما در سامانه آفرینا فی‌بان (Afrina FeeBan VIP) پیام می‌دهم. لطفاً لیست موجودی و شرایط همکاری را ارسال فرمایید.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>ارتباط مستقیم واتساپ با این بازرگانی</span>
                  </a>

                  <button
                    onClick={() => {
                      setVipInitialView('ads');
                      setIsVipModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black cursor-pointer"
                  >
                    <Megaphone className="w-3.5 h-3.5" />
                    <span>+ درج تبلیغات و معرفی بازرگانی شما</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 4 Creative Pro Tools + White-Label Quick Switcher Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
            <button
              onClick={() => {
                setProInitialTab('qr_label');
                setIsProModalOpen(true);
              }}
              className="p-3 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 text-right flex items-center gap-2.5 shadow-2xs transition-all cursor-pointer"
            >
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 shrink-0">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-black text-slate-900">
                  ۱. برچسب هوشمند QR ویترین
                </div>
                <div className="text-[11px] text-slate-500">
                  چاپ تگ ویترین مغازه بدون قیمت کاغذی
                </div>
              </div>
            </button>

            <button
              onClick={() => {
                setProInitialTab('sayadi_check');
                setIsProModalOpen(true);
              }}
              className="p-3 rounded-xl bg-white border border-slate-200 hover:border-indigo-500 text-right flex items-center gap-2.5 shadow-2xs transition-all cursor-pointer"
            >
              <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700 shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-black text-slate-900">
                  ۲. استعلام رنگ چک صیادی ۱۶ رقمی
                </div>
                <div className="text-[11px] text-slate-500">
                  تشخیص وضعیت سفید/زرد/قرمز و سقف قسط
                </div>
              </div>
            </button>

            <button
              onClick={() => {
                setProInitialTab('parts_passport');
                setIsProModalOpen(true);
              }}
              className="p-3 rounded-xl bg-white border border-slate-200 hover:border-sky-500 text-right flex items-center gap-2.5 shadow-2xs transition-all cursor-pointer"
            >
              <div className="p-2 rounded-lg bg-sky-100 text-sky-700 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-black text-slate-900">
                  ۳. شناسنامه اصالت قطعه و ریجستری
                </div>
                <div className="text-[11px] text-slate-500">
                  گواهی ۷ روز تست ال‌سی‌دی و باتری فابریک
                </div>
              </div>
            </button>

            <button
              onClick={() => {
                setProInitialTab('flash_clearance');
                setIsProModalOpen(true);
              }}
              className="p-3 rounded-xl bg-white border border-slate-200 hover:border-rose-500 text-right flex items-center gap-2.5 shadow-2xs transition-all cursor-pointer"
            >
              <div className="p-2 rounded-lg bg-rose-100 text-rose-700 shrink-0">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-black text-slate-900">
                  ۴. حراج ۶۰ دقیقه‌ای بار دبی
                </div>
                <div className="text-[11px] text-slate-500">
                  رزرو فوری پارت بار زیر فی علاءالدین
                </div>
              </div>
            </button>

            <button
              onClick={() => {
                setVipInitialView('whitelabel');
                setIsVipModalOpen(true);
              }}
              className="p-3 rounded-xl bg-amber-50 border-2 border-amber-300 hover:border-amber-500 text-right flex items-center gap-2.5 shadow-2xs transition-all cursor-pointer"
            >
              <div className="p-2 rounded-lg bg-amber-400 text-slate-950 shrink-0">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-black text-slate-900">
                  ۵. شخصی‌سازی برای فروشگاه شما
                </div>
                <div className="text-[11px] text-amber-900 font-bold">
                  فروش اختصاصی White-Label و اشتراک بازار
                </div>
              </div>
            </button>
          </div>
        </section>

        {/* 5. Category Filter Bar & Live Search */}
        <section className="space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجوی نام گوشی، آیفون ۱۶، S24 Ultra، ال‌سی‌دی فابریک، مک‌بوک، شارژر کارتنی یا لوپ تعمیرات..."
                className="w-full rounded-xl bg-white border border-slate-300 pr-10 pl-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none shadow-2xs"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsCompareModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-extrabold transition-colors cursor-pointer whitespace-nowrap"
              >
                <Laptop className="w-4 h-4 text-emerald-600" />
                <span>مقایسه هم‌رده گوشی، لپ‌تاپ و تبلت (فنی · قیمت · اقبال بازار)</span>
              </button>

              <button
                onClick={() => {
                  setCalcInitialProduct(products[0]);
                  setCalcInitialTab('tradein');
                  setIsCalcModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 text-xs font-extrabold transition-colors cursor-pointer whitespace-nowrap"
              >
                <RefreshCw className="w-4 h-4 text-indigo-600" />
                <span>محاسبه معاوضه گوشی کارکرده با آکبند (Trade-In)</span>
              </button>
            </div>
          </div>

          {/* 7 Interactive Category Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap shrink-0 border ${
                    active
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-400 hover:text-emerald-800'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* 6. Products Grid (10 Real Products with Dual Wholesale/Retail Pricing) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredProducts.map((product) => {
              const pricing = calculateProductPrices(product, rates);
              const imgFailed = brokenImages[product.id];

              const handleAudioReadProduct = () => {
                speakText(
                  `${product.title}. قیمت پایه ارزی ${product.baseWholesaleForeign} ${product.baseCurrency}. قیمت کف همکار ${pricing.wholesaleToman} تومان. قیمت مصرف‌کننده با گارانتی و کد همتا ${pricing.retailToman} تومان.`
                );
              };

              return (
                <article
                  key={product.id}
                  className="rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Product Top Media & Spec Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 p-4 border-b border-slate-100">
                      <div className="sm:col-span-4 relative aspect-[4/3] sm:aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                        {!imgFailed ? (
                          <img
                            src={product.imageUrl}
                            alt={product.title}
                            referrerPolicy="no-referrer"
                            onError={() =>
                              setBrokenImages((prev) => ({ ...prev, [product.id]: true }))
                            }
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-emerald-100 via-sky-50 to-indigo-100 flex flex-col items-center justify-center p-3 text-center">
                            <Smartphone className="w-8 h-8 text-emerald-700 mb-1" />
                            <span className="text-[11px] font-bold text-slate-800">
                              {product.englishModel}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="sm:col-span-8 flex flex-col justify-between space-y-2">
                        <div>
                          {/* Unboxed Clean Metadata Kicker (Zero-Pill Discipline) */}
                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 font-semibold mb-1">
                            <span>
                              {product.warehouseHub} · موجودی: {product.stockCount}
                            </span>
                            <button
                              onClick={handleAudioReadProduct}
                              className="inline-flex items-center gap-1 text-sky-700 hover:text-sky-900 font-bold cursor-pointer"
                              title="خوانش صوتی قیمت این محصول ویژه نابینایان"
                            >
                              <Volume2 className="w-4 h-4" />
                              <span>خوانش صوتی</span>
                            </button>
                          </div>

                          <h3 className="text-base font-black text-slate-900 leading-snug">
                            {product.title}
                          </h3>
                          <p className="text-xs font-mono-num text-slate-500 mt-0.5">
                            {product.englishModel}
                          </p>
                        </div>

                        <div className="space-y-1 pt-1 text-xs">
                          <div className="text-slate-700 font-medium">
                            مشخصات: {product.partNumberOrSpec}
                          </div>
                          <div className="text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                            <span>{product.warrantyText}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Dual Pricing Box (Base Foreign + Wholesale Partner + Consumer Retail) */}
                    <div className="p-4 bg-slate-50/70 space-y-3">
                      <div className="flex items-center justify-between text-xs border-b border-slate-200/80 pb-2">
                        <span className="text-slate-600 font-semibold">
                          قیمت پایه ارزی دبی / چین ({product.unitLabel}):
                        </span>
                        <span className="font-mono-num font-black text-sm text-sky-700">
                          {formatForeign(product.baseWholesaleForeign, product.baseCurrency)}
                        </span>
                      </div>

                      {rates.isVolatilityLocked ? (
                        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-center space-y-2">
                          <div className="text-xs font-extrabold text-rose-800 flex items-center justify-center gap-1.5">
                            <Lock className="w-4 h-4" />
                            <span>قفل نوسان بازار فعال است (استعلام لحظه‌ای واتساپ)</span>
                          </div>
                          <a
                            href={`https://wa.me/989120000000?text=${encodeURIComponent(
                              `سلام، لطفاً قیمت لحظه‌ای همکار برای «${product.title}» (پایه ارزی: ${product.baseWholesaleForeign} ${product.baseCurrency}) را اعلام فرمایید.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold"
                          >
                            <Send className="w-4 h-4" />
                            <span>{t.inquireWhatsappBtn}</span>
                          </a>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {/* Wholesale Partner Price */}
                          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                            <span className="block text-[11px] font-bold text-amber-900">
                              {t.wholesaleLabel}
                            </span>
                            <span className="block text-lg font-black text-slate-900 font-mono-num mt-1">
                              {formatToman(pricing.wholesaleToman)}{' '}
                              <small className="text-xs font-normal">تومان</small>
                            </span>
                            <span className="block text-[11px] text-amber-800 mt-0.5">
                              حداقل سفارش همکار: {product.minWholesaleQty} عدد
                            </span>
                          </div>

                          {/* Consumer Retail Price */}
                          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                            <span className="block text-[11px] font-bold text-emerald-900">
                              {t.retailLabel}
                            </span>
                            <span className="block text-lg font-black text-emerald-800 font-mono-num mt-1">
                              {formatToman(pricing.retailToman)}{' '}
                              <small className="text-xs font-normal">تومان</small>
                            </span>
                            <span className="block text-[11px] text-emerald-700 mt-0.5 font-mono-num">
                              حاشیه سود همکار: +{formatToman(pricing.partnerProfitPerUnit)} ت
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer Action Buttons */}
                  <div className="p-3.5 bg-white border-t border-slate-100 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <Plus className="w-4 h-4 text-amber-400" />
                      <span>{t.addToInvoiceBtn}</span>
                    </button>

                    <button
                      onClick={() => {
                        setCalcInitialProduct(product);
                        setCalcInitialTab('installment');
                        setIsCalcModalOpen(true);
                      }}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <Calculator className="w-4 h-4" />
                      <span>اقساط چک صیادی / معاوضه</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* 7. Secondary Sections (Hidden when ADHD Calm Focus Mode is toggled ON to prevent cognitive overload!) */}
        {!adhdFocusMode && (
          <>
            {/* Directory of Sponsored Stores, Wholesalers & Related Trading Companies */}
            <section className="rounded-2xl bg-white border-2 border-amber-300/80 shadow-sm p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-slate-900">
                      🏢 دایرکتوری تبلیغات و معرفی فروشگاه‌ها، بنکداران و بازرگانی‌های مرتبط (تامین‌کنندگان تاییدشده)
                    </h2>
                    <p className="text-xs text-slate-500">
                      معرفی مستقیم بازرگانی‌های واردات موبایل دبی-تهران، پخش‌کنندگان لپ‌تاپ پایتخت، سورس‌های قطعات تعمیراتی و فروشگاه‌های برتر اقساطی
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      setVipInitialView('whitelabel');
                      setIsVipModalOpen(true);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold cursor-pointer whitespace-nowrap"
                  >
                    🎨 شخصی‌سازی این برنامه به نام بازرگانی شما (White-Label)
                  </button>
                  <button
                    onClick={() => {
                      setVipInitialView('ads');
                      setIsVipModalOpen(true);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold cursor-pointer whitespace-nowrap"
                  >
                    + ثبت تبلیغات بنری و معرفی فروشگاه / بازرگانی جدید
                  </button>
                </div>
              </div>

              {/* Category Filter for Trading Companies & Stores */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {[
                  { id: 'all', label: `همه بازرگانی‌ها و فروشگاه‌ها (${tradingCompanies.length})` },
                  { id: 'mobile_importer', label: 'واردکنندگان موبایل و تبلت (دبی / علاءالدین)' },
                  { id: 'laptop_distributor', label: 'بازرگانی‌های لپ‌تاپ، مک‌بوک و سرفیس' },
                  { id: 'parts_wholesaler', label: 'پخش عمده قطعات تعمیراتی و LCD فابریک' },
                  { id: 'accessories_hub', label: 'پخش کارتنی جانبی و کلگی شارژر' },
                  { id: 'installment_store', label: 'فروشگاه‌های برتر اقساطی چک صیادی' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() =>
                      setSelectedAdCategory(tab.id as 'all' | TradingCompanyAd['category'])
                    }
                    className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap border transition-all cursor-pointer ${
                      selectedAdCategory === tab.id
                        ? 'bg-slate-900 text-amber-300 border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-amber-400'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Trading Companies & Sponsored Stores Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tradingCompanies
                  .filter(
                    (tc) => selectedAdCategory === 'all' || tc.category === selectedAdCategory
                  )
                  .map((tc) => (
                    <div
                      key={tc.id}
                      className="rounded-2xl bg-slate-50/80 border border-slate-200 hover:border-amber-400 p-4 flex flex-col justify-between space-y-3 transition-all shadow-2xs"
                    >
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span
                            className={`text-[11px] font-black px-2.5 py-0.5 rounded-md ${
                              tc.sponsorTier === 'diamond'
                                ? 'bg-indigo-100 text-indigo-900 border border-indigo-300'
                                : tc.sponsorTier === 'gold'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            }`}
                          >
                            {tc.sponsorBadgeText}
                          </span>
                          <span className="text-[11px] font-bold text-slate-500">
                            سابقه فعالیت: {tc.yearsActive} سال · {tc.categoryLabel}
                          </span>
                        </div>

                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-base font-black text-slate-900">
                              {tc.companyName}
                            </h3>
                            <p className="text-[11px] font-mono-num text-slate-500">
                              {tc.englishName} — 📍 {tc.cityAndHub}
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              speakText(
                                `${tc.companyName}. ${tc.adBannerHeadline}. پیشنهاد ویژه همکاری: ${tc.partnerOfferText}`
                              )
                            }
                            className="p-1.5 rounded-lg bg-white border border-slate-200 text-sky-700 hover:bg-sky-50 cursor-pointer shrink-0"
                            title="خوانش صوتی معرفی بازرگانی"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                          <div className="text-xs font-extrabold text-indigo-900">
                            📣 {tc.adBannerHeadline}
                          </div>
                          <div className="text-xs text-slate-600">
                            <strong>تخصص و برندها:</strong> {tc.specialty}
                          </div>
                          <div className="text-xs text-emerald-700 font-bold">
                            🎁 مزایای خرید از این مجموعه: {tc.partnerOfferText}
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
                        <div className="text-[11px] text-slate-600 flex items-center gap-1.5">
                          <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="font-mono-num font-bold text-slate-800">
                            {tc.landlinePhone}
                          </span>
                          <span>· {tc.verifiedGuarantee}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setWhiteLabelConfig({
                                isCustomBrandActive: true,
                                storeOrCompanyNameFa: tc.companyName,
                                storeOrCompanyNameEn: tc.englishName,
                                sloganFa: tc.adBannerHeadline,
                                whatsappNumber: tc.whatsappPhone,
                                landlinePhone: tc.landlinePhone,
                                cityAndAddress: tc.cityAndHub,
                                specialtyBadge: tc.categoryLabel,
                                licenseSalePriceToman: 29500000,
                                themeColor: 'emerald',
                              });
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-950 text-[11px] font-extrabold cursor-pointer"
                            title="مشاهده پیش‌نمایش برنامه با نام و برند این بازرگانی"
                          >
                            تست برند روی برنامه
                          </button>

                          <a
                            href={`https://wa.me/${tc.whatsappPhone}?text=${encodeURIComponent(
                              `سلام خدمت «${tc.companyName}»، از طریق دایرکتوری بازرگانی‌های سامانه آفرینا فی‌بان (Afrina FeeBan VIP) پیام می‌دهم. لطفاً لیست قیمت همکار را ارسال فرمایید.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold whitespace-nowrap"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>استعلام واتساپ بازرگانی</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </section>

            {/* Live Provincial Wholesale Buy Requests Board */}
            <section className="rounded-2xl bg-white border border-slate-200 shadow-xs p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                    <PackageCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900">
                      {t.buyRequestsTitle}
                    </h2>
                    <p className="text-xs text-slate-500">
                      درخواست‌های واقعی خرید نقدی، تتر و چکی موبایل‌فروشان و تعمیرکاران سراسر کشور — ارسال پیش‌فاکتور با ۱ کلیک
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowNewRequestForm(!showNewRequestForm)}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold transition-colors cursor-pointer whitespace-nowrap"
                >
                  + ثبت اعلام کسری بار / خرید نقدی جدید
                </button>
              </div>

              {showNewRequestForm && (
                <form
                  onSubmit={handleAddBuyRequest}
                  className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end"
                >
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      نام موبایل‌فروشی / تعمیرگاه:
                    </label>
                    <input
                      type="text"
                      required
                      value={newReqStore}
                      onChange={(e) => setNewReqStore(e.target.value)}
                      placeholder="مثلاً: موبایل نگین اصفهان"
                      className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      شهر مقصد:
                    </label>
                    <input
                      type="text"
                      required
                      value={newReqCity}
                      onChange={(e) => setNewReqCity(e.target.value)}
                      placeholder="اصفهان - چهارباغ"
                      className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      شرح کسری کالا و تعداد مورد نیاز:
                    </label>
                    <input
                      type="text"
                      required
                      value={newReqItems}
                      onChange={(e) => setNewReqItems(e.target.value)}
                      placeholder="خریدار ۵ عدد آیفون ۱۶ پرومکس و ۱۰ عدد باتری"
                      className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-xs text-slate-900"
                    />
                  </div>
                  <button
                    type="submit"
                    className="py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold cursor-pointer"
                  >
                    انتشار فوری در تابلوی کشوری
                  </button>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {buyRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="font-bold text-emerald-700">
                          ✓ همکار احرازهویت‌شده · {req.city}
                        </span>
                        <span>{req.timeAgo}</span>
                      </div>
                      <h3 className="text-sm font-black text-slate-900">
                        {req.storeName}
                      </h3>
                      <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                        {req.requestedItems}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
                      <div className="text-[11px] text-slate-600">
                        <span>تسویه: </span>
                        <strong className="text-slate-900">{req.paymentType}</strong>
                        <span> · {req.targetBudgetText}</span>
                      </div>

                      <a
                        href={`https://wa.me/${req.whatsappPhone}?text=${encodeURIComponent(
                          `سلام همکار گرامی (${req.storeName})، بابت درخواست خرید شما در تابلوی DigiRate VIP (${req.requestedItems}) موجودی با قیمت کف همکار آماده ارسال است.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold whitespace-nowrap"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>ارسال سریع پیش‌فاکتور در واتساپ</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Smart Hardware & Original Parts AI Assistant Section */}
            <section className="rounded-2xl bg-white border border-slate-200 shadow-xs p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900">
                      {t.aiAssistantTitle}
                    </h2>
                    <p className="text-xs text-slate-500">
                      مجهز به موتور هوشمند سرور (`/api/ai-assistant`) + بانک دانش آفلاین بدون نیاز به وارد کردن کلید API
                    </p>
                  </div>
                </div>

                {/* 3 Quick Expert Presets */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() =>
                      askAiAssistant(
                        'مقایسه تخصصی آیفون 16 Pro Max با Samsung S24 Ultra برای مشاوره فروش به مشتری',
                        'compare'
                      )
                    }
                    className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 text-xs font-bold cursor-pointer"
                  >
                    ۱. مقایسه تخصصی دو گوشی برای مشتری
                  </button>
                  <button
                    onClick={() =>
                      askAiAssistant(
                        'راهنمای تشخیص ال‌سی‌دی فابریک روکاری (Original Pulled) از تعویض گلس و کپی',
                        'parts'
                      )
                    }
                    className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold cursor-pointer"
                  >
                    ۲. تشخیص قطعات تعمیراتی فابریک از کپی
                  </button>
                  <button
                    onClick={() =>
                      askAiAssistant(
                        'تولید ۳ کپشن پرفروش اینستاگرام برای فروش اقساطی موبایل با چک صیادی',
                        'caption'
                      )
                    }
                    className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold cursor-pointer"
                  >
                    ۳. تولید کپشن وایرال اینستاگرام
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-5 space-y-3">
                  <label className="block text-xs font-bold text-slate-700">
                    سوال فنی، مقایسه گوشی یا درخواست تولید محتوای خود را بنویسید:
                  </label>
                  <textarea
                    rows={4}
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="مثلاً: تفاوت پارت نامبر ZAA و CH در آیفون ۱۶ پرومکس چیست؟ یا نحوه تست سلامت باتری تقویت‌شده آیفون را توضیح بده..."
                    className="w-full rounded-xl bg-slate-50 border border-slate-300 p-3 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none"
                  />
                  <button
                    onClick={() => askAiAssistant()}
                    disabled={aiLoading}
                    className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-extrabold transition-colors cursor-pointer"
                  >
                    {aiLoading ? 'در حال تحلیل تخصصی بازار و سخت‌افزار...' : 'دریافت پاسخ تخصصی دستیار هوشمند'}
                  </button>
                </div>

                <div className="lg:col-span-7 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-indigo-800 flex items-center gap-1.5">
                      <Wrench className="w-4 h-4" />
                      <span>پاسخ کارشناسی سیستم:</span>
                    </span>
                    <button
                      onClick={() => speakText(aiAnswer)}
                      className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>خوانش صوتی پاسخ</span>
                    </button>
                  </div>
                  <div className="text-xs text-slate-800 whitespace-pre-line leading-relaxed">
                    {aiAnswer}
                  </div>
                </div>
              </div>
            </section>

            {/* Competitive Advantage & Market Weakness-to-Strength Matrix */}
            <section className="rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-sky-50 border-2 border-emerald-300/70 shadow-xs p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-200/70 pb-3">
                <div>
                  <h2 className="text-base font-black text-slate-900">
                    🏆 جدول تبدیل ۶ نقطه ضعف سامانه‌های قدیمی ایران به نقاط قوت انحصاری در Afrina DigiRate VIP
                  </h2>
                  <p className="text-xs text-slate-600 mt-0.5">
                    چرا این پلتفرم در بازار موبایل، لپ‌تاپ و قطعات (علاءالدین، چارسو، بازار بزرگ و دبی) بی‌رقیب است؟
                  </p>
                </div>
                <button
                  onClick={() => setIsCompareModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold cursor-pointer"
                >
                  باز کردن موتور مقایسه ۳ بعدی هم‌تراز
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5">
                  <div className="font-extrabold text-rose-700">
                    ❌ ضعف کانال‌های تلگرام و سایت‌های قدیمی:
                  </div>
                  <p className="text-slate-600">
                    ویرایش دستی لیست قیمت هنگام نوسان دلار (۴۰ دقیقه زمان و ضرر فروشنده) + قیمت‌های فیک و ناموجود.
                  </p>
                  <div className="font-extrabold text-emerald-700 pt-1">
                    ✅ تبدیل به قوت در Afrina DigiRate:
                  </div>
                  <p className="text-slate-800 font-semibold">
                    آپدیت ۰.۰۱ ثانیه‌ای کل کالاها با تغییر نرخ دلار/درهم + دکمه «قفل نوسان شدید بازار» با ۱ کلیک!
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5">
                  <div className="font-extrabold text-rose-700">
                    ❌ ضعف سایت‌های مقایسه کاتالوگی (مثل ترب/موبایل‌آی‌آر):
                  </div>
                  <p className="text-slate-600">
                    فقط اعداد دوربین را می‌نویسند و هیچ اطلاعاتی از «سرعت فروش دست‌دوم، افت قیمت سالانه و سود همکار» نمی‌دهند.
                  </p>
                  <div className="font-extrabold text-emerald-700 pt-1">
                    ✅ تبدیل به قوت در Afrina DigiRate:
                  </div>
                  <p className="text-slate-800 font-semibold">
                    مقایسه هم‌تراز ۳ بعدی (فنی + قیمت همکار/مصرف‌کننده + امتیاز اقبال بازار و نقدشوندگی در علاءالدین).
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5">
                  <div className="font-extrabold text-rose-700">
                    ❌ ضعف تک‌زبانه بودن و نبود دسترس‌پذیری:
                  </div>
                  <p className="text-slate-600">
                    عدم امکان کار با تامین‌کنندگان دبی، چین، ترکیه و کره + شلوغی بصری و عدم پشتیبانی از نابینایان و ADHD.
                  </p>
                  <div className="font-extrabold text-emerald-700 pt-1">
                    ✅ تبدیل به قوت در Afrina DigiRate:
                  </div>
                  <p className="text-slate-800 font-semibold">
                    ۶ زبان زنده (فارسی، انگلیسی، عربی، ترکی، چینی، کره‌ای) + حالت تمرکز ADHD و خوانش صوتی قیمت‌ها.
                  </p>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Clean Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 px-4 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <strong className="text-slate-900">
              {whiteLabelConfig.isCustomBrandActive
                ? `${whiteLabelConfig.storeOrCompanyNameFa} (${whiteLabelConfig.storeOrCompanyNameEn})`
                : 'Afrina FeeBan VIP (DigiRate) | آفرینا فی‌بان وی‌آی‌پی'}
            </strong>{' '}
            — Able Way City Afrina · اکوسیستم آفرینش · شهر جدید نیومتاورسیتی جهان · توان استیج FBNM
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => {
                setVipInitialView('whitelabel');
                setIsVipModalOpen(true);
              }}
              className="hover:text-slate-900 font-bold cursor-pointer"
            >
              شخصی‌سازی اختصاصی فروشگاه‌ها و بازرگانی‌ها (White-Label)
            </button>
            <button
              onClick={() => {
                setVipInitialView('ads');
                setIsVipModalOpen(true);
              }}
              className="hover:text-slate-900 font-bold cursor-pointer"
            >
              درج تبلیغات و معرفی بازرگانی‌ها
            </button>
            <button
              onClick={() => {
                setVipInitialView('vip');
                setIsVipModalOpen(true);
              }}
              className="hover:text-slate-900 font-bold cursor-pointer"
            >
              اشتراک ماهانه تا سالانه مایکت و بازار
            </button>
            <button
              onClick={() => setIsPwaModalOpen(true)}
              className="hover:text-slate-900 font-bold cursor-pointer"
            >
              خروجی امضاشده Gradle APK / AAB
            </button>
          </div>
        </div>
      </footer>

      {/* Interactive Modals */}
      <InstallmentTradeInModal
        isOpen={isCalcModalOpen}
        onClose={() => setIsCalcModalOpen(false)}
        products={products}
        rates={rates}
        initialProduct={calcInitialProduct}
        initialTab={calcInitialTab}
      />

      <StoryMakerModal
        isOpen={isStoryModalOpen}
        onClose={() => setIsStoryModalOpen(false)}
        products={products}
        rates={rates}
        tenantBrandName={activeTenant.tenantName}
        tenantPhone={activeTenant.phone}
        tenantCity={activeTenant.city}
      />

      <InvoiceCartModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        cart={cart}
        onUpdateQty={handleUpdateCartQty}
        onUpdateImei={handleUpdateCartImei}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={() => setCart([])}
        rates={rates}
        tenantBrandName={activeTenant.tenantName}
        tenantManagerName={activeTenant.managerName}
        tenantPhone={activeTenant.phone}
        tenantCity={activeTenant.city}
        refAmbassadorCode={activeTenant.refCode}
      />

      <VipAffiliateModal
        isOpen={isVipModalOpen}
        onClose={() => setIsVipModalOpen(false)}
        initialView={vipInitialView}
        activeVipLevel={activeVipLevel}
        onSelectVipLevel={(lvl) => setActiveVipLevel(lvl)}
        whiteLabelConfig={whiteLabelConfig}
        onUpdateWhiteLabel={(cfg) => setWhiteLabelConfig(cfg)}
        tradingCompanies={tradingCompanies}
        onAddTradingCompany={(newTc) =>
          setTradingCompanies((prev) => [newTc, ...prev])
        }
      />

      <PwaGithubModal
        isOpen={isPwaModalOpen}
        onClose={() => setIsPwaModalOpen(false)}
        canTriggerNativeInstall={!!deferredPrompt}
        onTriggerNativeInstall={handleTriggerNativeInstall}
      />

      <DeviceComparisonModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        rates={rates}
        onSpeakText={speakText}
      />

      <ProInnovationModal
        isOpen={isProModalOpen}
        onClose={() => setIsProModalOpen(false)}
        products={products}
        rates={rates}
        initialTab={proInitialTab}
        customBrand={{
          isActive: whiteLabelConfig.isCustomBrandActive,
          brandName: whiteLabelConfig.storeOrCompanyNameFa,
          brandSubtitle: whiteLabelConfig.sloganFa,
          whatsappNumber: whiteLabelConfig.whatsappNumber,
          storeAddress: whiteLabelConfig.cityAndAddress,
          instagramId: whiteLabelConfig.storeOrCompanyNameEn,
          badgeText: whiteLabelConfig.specialtyBadge,
          themeColor: whiteLabelConfig.themeColor,
        }}
      />
    </div>
  );
}
