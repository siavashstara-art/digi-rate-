import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck,
  Sparkles,
  Send,
  Copy,
  Check,
  Calculator,
  Lock,
  Unlock,
  Users,
  Award,
  TrendingUp,
  FileText,
  Printer,
  Link2,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Smartphone,
  Clock,
  CreditCard,
  Layers,
  HelpCircle,
  MapPin,
  Wallet,
} from 'lucide-react';
import {
  ProductItem,
  MarketRates,
  WhiteLabelConfig,
  calculateProductPrices,
  formatToman,
} from '../data/mockData';

export interface IsolatedTenantRecord {
  slug: string;
  tenantName: string;
  managerName: string;
  city: string;
  phone: string;
  slogan: string;
  priceMultiplier: number;
  refCode: string;
  isPermanentLicense: boolean;
  updatedAt: string;
}

export interface AmbassadorSaleEntry {
  id: string;
  dateShamsi: string;
  storeName: string;
  managerName: string;
  city: string;
  packageType: 'base_48m' | 'vip_96m' | 'ad_diamond_12m';
  packageLabel: string;
  totalContractToman: number;
  cashDownPaymentToman: number;
  ambassadorCommission25Percent: number;
  shebaNumber: string;
  settlementStatus: 'واریز آنی شبا (تسویه‌شده از پیش‌پرداخت)' | 'تایید مالی و در صف پایا';
}

interface VipCommercialArchitectureSectionsProps {
  products: ProductItem[];
  rates: MarketRates;
  whiteLabelConfig: WhiteLabelConfig;
  onUpdateWhiteLabel: (config: WhiteLabelConfig) => void;
  activeTenant: IsolatedTenantRecord;
  onUpdateActiveTenant: (tenant: IsolatedTenantRecord) => void;
  onSpeakText?: (text: string) => void;
}

function toSlug(input: string): string {
  return (
    input
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9\u0600-\u06FF-]/g, '') || 'default-store'
  );
}

export const VipCommercialArchitectureSections: React.FC<
  VipCommercialArchitectureSectionsProps
> = ({
  products,
  rates,
  whiteLabelConfig,
  onUpdateWhiteLabel,
  activeTenant,
  onUpdateActiveTenant,
}) => {
  // ============================================================================
  // 1. ISOLATED WHITE-LABEL TENANT & 10-SECOND TABLET URL SKIN STATE
  // ============================================================================
  const [savedTenants, setSavedTenants] = useState<Record<string, IsolatedTenantRecord>>({});
  const [copiedUrlToast, setCopiedUrlToast] = useState<boolean>(false);

  // Load isolated tenants dictionary from localStorage on mount
  useEffect(() => {
    try {
      const rawIndex = localStorage.getItem('feeban_isolated_tenants_index');
      if (rawIndex) {
        const parsed = JSON.parse(rawIndex) as Record<string, IsolatedTenantRecord>;
        setSavedTenants(parsed);
      }
    } catch (_e) {
      // Ignore storage errors
    }
  }, []);

  const saveTenantToIsolatedStorage = (record: IsolatedTenantRecord) => {
    const slug = toSlug(record.tenantName);
    const normalized: IsolatedTenantRecord = {
      ...record,
      slug,
      updatedAt: new Date().toLocaleTimeString('fa-IR'),
    };
    try {
      // Isolated key per slug so no store ever overwrites or sees another store's data
      localStorage.setItem(`feeban_tenant_${slug}`, JSON.stringify(normalized));
      const updatedMap = { ...savedTenants, [slug]: normalized };
      localStorage.setItem('feeban_isolated_tenants_index', JSON.stringify(updatedMap));
      setSavedTenants(updatedMap);
    } catch (_e) {
      // Ignore storage errors
    }

    onUpdateActiveTenant(normalized);
    onUpdateWhiteLabel({
      ...whiteLabelConfig,
      isCustomBrandActive: true,
      storeOrCompanyNameFa: normalized.tenantName,
      storeOrCompanyNameEn: `VIP Store (${normalized.city})`,
      sloganFa: normalized.slogan,
      whatsappNumber: normalized.phone,
      cityAndAddress: normalized.city,
      specialtyBadge: `به مدیریت: ${normalized.managerName} · ضریب قیمت: ×${normalized.priceMultiplier}`,
    });

    // Update browser URL parameters live without reload
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      params.set('tenant', normalized.tenantName);
      params.set('manager', normalized.managerName);
      params.set('city', normalized.city);
      params.set('phone', normalized.phone);
      params.set('ref', normalized.refCode);
      const newUrl = `${window.location.pathname}?${params.toString()}${window.location.hash}`;
      window.history.replaceState({}, '', newUrl);
    }
  };

  const generatedDemoUrl = useMemo(() => {
    const baseUrl =
      typeof window !== 'undefined' ? window.location.origin + window.location.pathname : 'https://feeban.vip/';
    const params = new URLSearchParams();
    params.set('tenant', activeTenant.tenantName);
    params.set('manager', activeTenant.managerName);
    params.set('city', activeTenant.city);
    params.set('phone', activeTenant.phone);
    params.set('ref', activeTenant.refCode);
    return `${baseUrl}?${params.toString()}`;
  }, [activeTenant]);

  const handleCopyDemoUrl = () => {
    navigator.clipboard.writeText(generatedDemoUrl);
    saveTenantToIsolatedStorage(activeTenant);
    setCopiedUrlToast(true);
    setTimeout(() => setCopiedUrlToast(false), 2500);
  };

  // ============================================================================
  // 2. LIVE CUSTOMER DESK CALCULATOR + SAYADI CHECK + INFLATION SHIELD + SPLIT
  // ============================================================================
  const [deskProductId, setDeskProductId] = useState<string>(products[0]?.id || '');
  const [deskQty, setDeskQty] = useState<number>(1);
  const [deskPriceMode, setDeskPriceMode] = useState<'retail' | 'wholesale'>('retail');
  const [includeOriginalChargerAndGlass, setIncludeOriginalChargerAndGlass] =
    useState<boolean>(true);
  const [includeGolden18MonthInsurance, setIncludeGolden18MonthInsurance] =
    useState<boolean>(true);
  const [includeOriginalLcdBatteryPack, setIncludeOriginalLcdBatteryPack] =
    useState<boolean>(false);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(30);
  const [checkCount, setCheckCount] = useState<number>(6);
  const [monthlyCheckWagePercent, setMonthlyCheckWagePercent] = useState<number>(3.5);
  const [inflationShieldLocked, setInflationShieldLocked] = useState<boolean>(true);
  const [costSplitParties, setCostSplitParties] = useState<number>(2);
  const [customerNameDesk, setCustomerNameDesk] = useState<string>('جناب آقای مهندس رضایی');
  const [customerPhoneDesk, setCustomerPhoneDesk] = useState<string>('09120000000');

  // Sayadi 16-digit Live Inquiry Simulator State
  const [sayadi16Digit, setSayadi16Digit] = useState<string>('6037998124059128');
  const [sayadiColorState, setSayadiColorState] = useState<'white' | 'yellow' | 'red'>('white');

  const selectedDeskProduct = useMemo(
    () => products.find((p) => p.id === deskProductId) || products[0],
    [products, deskProductId]
  );

  const deskCalculation = useMemo(() => {
    const baseCalc = calculateProductPrices(selectedDeskProduct, rates);
    const rawUnit =
      deskPriceMode === 'wholesale' ? baseCalc.wholesaleToman : baseCalc.retailToman;
    const multipliedUnit = Math.round((rawUnit * activeTenant.priceMultiplier) / 10000) * 10000;

    const chargerGlassAddon = includeOriginalChargerAndGlass ? 2450000 : 0;
    const goldenInsuranceAddon = includeGolden18MonthInsurance ? 1850000 : 0;
    const repairPackAddon = includeOriginalLcdBatteryPack ? 14900000 : 0;

    const totalCashInvoiceToman =
      multipliedUnit * deskQty +
      chargerGlassAddon * deskQty +
      goldenInsuranceAddon * deskQty +
      repairPackAddon;

    const downPaymentToman =
      Math.round(((totalCashInvoiceToman * downPaymentPercent) / 100) / 10000) * 10000;
    const principalRemaining = Math.max(0, totalCashInvoiceToman - downPaymentToman);
    const totalWageToman = Math.round(
      principalRemaining * (monthlyCheckWagePercent / 100) * checkCount
    );
    const totalInstallmentPayable = principalRemaining + totalWageToman;
    const eachCheckAmountToman =
      checkCount > 0 ? Math.ceil(totalInstallmentPayable / checkCount / 10000) * 10000 : 0;
    const totalFinalWithChecks = downPaymentToman + eachCheckAmountToman * checkCount;
    const splitPerPartyToman = Math.ceil(totalFinalWithChecks / Math.max(1, costSplitParties));

    // Generate Shamsi Due Dates Schedule
    const shamsiMonths = [
      'آبان ۱۴۰۵',
      'آذر ۱۴۰۵',
      'دی ۱۴۰۵',
      'بهمن ۱۴۰۵',
      'اسفند ۱۴۰۵',
      'فروردین ۱۴۰۶',
      'اردیبهشت ۱۴۰۶',
      'خرداد ۱۴۰۶',
      'تیر ۱۴۰۶',
      'مرداد ۱۴۰۶',
      'شهریور ۱۴۰۶',
      'مهر ۱۴۰۶',
    ];
    const checkSchedule = Array.from({ length: checkCount }, (_, idx) => ({
      checkNumber: idx + 1,
      dueDateShamsi: `۱۵ ${shamsiMonths[idx % shamsiMonths.length]}`,
      amountToman: eachCheckAmountToman,
    }));

    return {
      multipliedUnit,
      totalCashInvoiceToman,
      downPaymentToman,
      principalRemaining,
      totalWageToman,
      eachCheckAmountToman,
      totalFinalWithChecks,
      splitPerPartyToman,
      checkSchedule,
    };
  }, [
    selectedDeskProduct,
    rates,
    deskPriceMode,
    activeTenant.priceMultiplier,
    includeOriginalChargerAndGlass,
    includeGolden18MonthInsurance,
    includeOriginalLcdBatteryPack,
    deskQty,
    downPaymentPercent,
    checkCount,
    monthlyCheckWagePercent,
    costSplitParties,
  ]);

  const sayadiMeta = useMemo(() => {
    if (sayadiColorState === 'white') {
      return {
        badge: '🟢 وضعیت سفید صیادی (رتبه اعتباری A+ · امتیاز ۸۶۵ از ۱۰۰۰)',
        desc: 'فاقد هرگونه چک برگشتی یا اقساط معوق در شبکه بانکی کشور — مجاز به تقسیط تا سقف ۵۰۰ میلیون تومان.',
        boxClass: 'bg-emerald-50 border-emerald-400 text-emerald-950',
      };
    }
    if (sayadiColorState === 'yellow') {
      return {
        badge: '🟡 وضعیت زرد صیادی (رتبه اعتباری B · امتیاز ۶۱۰ از ۱۰۰۰)',
        desc: 'دارای ۱ فقره سابقه رفع سوءاثر شده — نیازمند حداقل ۴۵٪ پیش‌پرداخت نقدی یا امضای ضامن معتبر.',
        boxClass: 'bg-amber-50 border-amber-400 text-amber-950',
      };
    }
    return {
      badge: '🔴 وضعیت قرمز/قهوه‌ای صیادی (رتبه ریسک بالا · امتیاز ۳۲۰ از ۱۰۰۰)',
      desc: 'دارای چک برگشتی فعال در سامانه بانک مرکزی — فروش چکی مسدود است (فقط تسویه نقدی/کارتخوان یا تتر).',
      boxClass: 'bg-rose-50 border-rose-400 text-rose-950',
    };
  }, [sayadiColorState]);

  const handleSendDeskGoldInvoiceWhatsapp = (targetPhone: string) => {
    const cleanPhone = targetPhone.replace(/[^0-9]/g, '') || '989120000000';
    const checkLines = deskCalculation.checkSchedule
      .slice(0, 6)
      .map(
        (c) =>
          `   • چک ${c.checkNumber} (${c.dueDateShamsi}): ${formatToman(c.amountToman)} تومان`
      )
      .join('\n');

    const msg = [
      `👑 *پیش‌فاکتور رسمی طلاکوب «${activeTenant.tenantName}»*`,
      `👔 به مدیریت: ${activeTenant.managerName} (${activeTenant.city})`,
      `👤 مشتری گرامی: ${customerNameDesk}`,
      `---`,
      `📱 *کالا / خدمات:* ${selectedDeskProduct.title} (${deskQty} دستگاه)`,
      `💵 فی واحد (${deskPriceMode === 'wholesale' ? 'همکار' : 'مصرف‌کننده با کد همتا'}): ${formatToman(
        deskCalculation.multipliedUnit
      )} تومان`,
      includeOriginalChargerAndGlass ? `➕ پکیج کلگی شارژر ۲۰ وات اصلی و گلس نانو: دارد` : '',
      includeGolden18MonthInsurance ? `➕ گارانتی ۱۸ ماهه طلایی تعویض + کد همتا: دارد` : '',
      includeOriginalLcdBatteryPack ? `➕ پکیج قطعه اورجینال روکاری (LCD + باتری TI): دارد` : '',
      `💰 *جمع کل نقدی فاکتور:* ${formatToman(deskCalculation.totalCashInvoiceToman)} تومان`,
      `---`,
      `🟣 *شرایط تقسیط با چک صیادی بنفش (${checkCount} ماهه):*`,
      `💵 پیش‌پرداخت نقدی (${downPaymentPercent}٪): ${formatToman(
        deskCalculation.downPaymentToman
      )} تومان`,
      `📝 مبلغ هر فقره چک صیادی: *${formatToman(
        deskCalculation.eachCheckAmountToman
      )} تومان*`,
      `📅 جدول سررسید چک‌ها:\n${checkLines}`,
      `---`,
      `🛡️ *گواهی استعلام صیادی (${sayadi16Digit}):* ${sayadiMeta.badge}`,
      inflationShieldLocked
        ? `🔒 *قفل ضمانت قیمت ضدتورم فعال است:* نرخ دلار (${formatToman(
            rates.USD
          )} ت) و درهم دبی (${formatToman(
            rates.AED
          )} ت) از لحظه واریز بیعانه تا تحویل نهایی ۱۰۰٪ ثابت و تضمین‌شده است.`
        : '',
      costSplitParties > 1
        ? `🤝 *تسهیم شفاف هزینه (${costSplitParties} نفره/شریک):* سهم هر طرف معادل ${formatToman(
            deskCalculation.splitPerPartyToman
          )} تومان`
        : '',
      `🔖 کد سفیر و اصالت سامانه: ${activeTenant.refCode}`,
    ]
      .filter(Boolean)
      .join('\n');

    window.open(
      `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  // ============================================================================
  // 3. ROI CALCULATOR & 8 DELIVERABLES STATE (#deliverables)
  // ============================================================================
  const [extraMonthlyInvoices, setExtraMonthlyInvoices] = useState<number>(3);
  const [avgProfitPerInvoiceToman, setAvgProfitPerInvoiceToman] = useState<number>(6500000);
  const [savedHoursPerMonth, setSavedHoursPerMonth] = useState<number>(45);

  const monthlyExtraProfitToman = extraMonthlyInvoices * avgProfitPerInvoiceToman;
  const annualExtraProfitToman = monthlyExtraProfitToman * 12;
  const baseLicenseCost = 48000000;
  const roiMultiple = Math.round((annualExtraProfitToman / baseLicenseCost) * 10) / 10;

  // ============================================================================
  // 4. VISITOR PLAYBOOK & 60-SECOND CHECKLIST STATE (#visitor-playbook)
  // ============================================================================
  const [checklistState, setChecklistState] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: false,
    4: false,
  });
  const [copiedObjectionIdx, setCopiedObjectionIdx] = useState<number | null>(null);

  // ============================================================================
  // 5. AMBASSADOR FINANCIAL HUB, INVITATION LETTER & 25% SHEBA LEDGER (#invitation-letter)
  // ============================================================================
  const [ambassadorName, setAmbassadorName] = useState<string>('مهندس سیاوش امیری (سفیر ارشد VIP)');
  const [ambassadorSheba, setAmbassadorSheba] = useState<string>('IR820540102680020817904002');
  const [selectedSalePackage, setSelectedSalePackage] = useState<
    'base_48m' | 'vip_96m' | 'ad_diamond_12m'
  >('base_48m');
  const [invitationCopied, setInvitationCopied] = useState<boolean>(false);

  const [salesLedger, setSalesLedger] = useState<AmbassadorSaleEntry[]>([
    {
      id: 'sale-101',
      dateShamsi: '۱۴۰۵/۰۷/۰۴',
      storeName: 'بازرگانی بزرگ همراه دبی - شعبه علاءالدین',
      managerName: 'حاج مهدی رضایی',
      city: 'تهران - علاءالدین طبقه ۴',
      packageType: 'vip_96m',
      packageLabel: 'لایسنس تجاری دائمی VIP Enterprise (۹۶ میلیون ت)',
      totalContractToman: 96000000,
      cashDownPaymentToman: 24000000,
      ambassadorCommission25Percent: 24000000,
      shebaNumber: 'IR820540102680020817904002',
      settlementStatus: 'واریز آنی شبا (تسویه‌شده از پیش‌پرداخت)',
    },
    {
      id: 'sale-102',
      dateShamsi: '۱۴۰۵/۰۷/۰۶',
      storeName: 'اپل استور و دیجیتال پایتخت',
      managerName: 'مهندس کامران افشار',
      city: 'تهران - مجتمع پایتخت',
      packageType: 'base_48m',
      packageLabel: 'لایسنس تجاری استاندارد (۱۲ نقد + ۲ چک ۱۸ ت)',
      totalContractToman: 48000000,
      cashDownPaymentToman: 12000000,
      ambassadorCommission25Percent: 12000000,
      shebaNumber: 'IR820540102680020817904002',
      settlementStatus: 'واریز آنی شبا (تسویه‌شده از پیش‌پرداخت)',
    },
  ]);

  const handleRecordInstantSale = () => {
    const pkgMap = {
      base_48m: {
        label: 'لایسنس تجاری پایه (۱۲ میلیون نقد + ۲ چک ۱۸ میلیون ت)',
        total: 48000000,
        cashDown: 12000000,
        comm: 12000000,
      },
      vip_96m: {
        label: 'لایسنس اختصاصی VIP بازرگانی (۲۴ میلیون نقد + ۲ چک ۳۶ میلیون ت)',
        total: 96000000,
        cashDown: 24000000,
        comm: 24000000,
      },
      ad_diamond_12m: {
        label: 'بسته اسپانسر الماسی تبلیغات بازرگانی (۱۲.۵ میلیون ت)',
        total: 12500000,
        cashDown: 12500000,
        comm: 3125000,
      },
    };
    const chosen = pkgMap[selectedSalePackage];
    const newEntry: AmbassadorSaleEntry = {
      id: `sale-${Date.now()}`,
      dateShamsi: '۱۴۰۵/۰۷/۰۶ (ثبت آنی)',
      storeName: activeTenant.tenantName,
      managerName: activeTenant.managerName,
      city: activeTenant.city,
      packageType: selectedSalePackage,
      packageLabel: chosen.label,
      totalContractToman: chosen.total,
      cashDownPaymentToman: chosen.cashDown,
      ambassadorCommission25Percent: chosen.comm,
      shebaNumber: ambassadorSheba,
      settlementStatus: 'واریز آنی شبا (تسویه‌شده از پیش‌پرداخت)',
    };
    setSalesLedger([newEntry, ...salesLedger]);
  };

  const totalAmbassadorEarnedToman = useMemo(
    () => salesLedger.reduce((sum, s) => sum + s.ambassadorCommission25Percent, 0),
    [salesLedger]
  );

  // ============================================================================
  // 6. NEXT-GEN CREATIVE ENGINES STATE (DEAD-STOCK SWAP, SMART ESCROW, 1-LINE EMBED)
  // ============================================================================
  const [swapMatches, setSwapMatches] = useState([
    {
      id: 'swap-1',
      sourceStore: 'موبایل پارسیان (شیراز - ملاصدرا)',
      deadStockItem: '۴ دستگاه iPhone 15 Normal 128GB آبی (کم‌فروش در شیراز)',
      matchedStore: 'پخش موبایل آذرخش (تبریز - پاساژ شهریار)',
      offeredItem: '۴ دستگاه Samsung S24 Ultra 256GB مشکی (پرفروش در شیراز)',
      diffSettlement: 'مابه‌التفاوت: ۶۴ میلیون تومان (تسویه آنی با چک صیادی یا تتر)',
      whatsapp: '989140000003',
    },
    {
      id: 'swap-2',
      sourceStore: 'لپ‌تاپ سنتر (اصفهان - طالقانی)',
      deadStockItem: '۳ دستگاه لپ‌تاپ گیمینگ ASUS ROG Strix (موجودی مازاد ویترین)',
      matchedStore: 'بازرگانی مک و الترابوک پایتخت (تهران - ولیعصر)',
      offeredItem: '۳ دستگاه MacBook Air M3 15-inch LLA پلمپ',
      diffSettlement: 'تهاتر ۱ به ۱ بدون رد و بدل شدن پول نقد (صفر ریال!)',
      whatsapp: '989120002222',
    },
  ]);
  const [newSwapHave, setNewSwapHave] = useState<string>('');
  const [newSwapNeed, setNewSwapNeed] = useState<string>('');

  const [escrowTrackingCode, setEscrowTrackingCode] = useState<string>('TPX-4059821470');
  const [escrowStage, setEscrowStage] = useState<'locked' | 'shipped' | 'released'>('shipped');

  const [embedCopied, setEmbedCopied] = useState<boolean>(false);
  const oneLineEmbedCode = useMemo(() => {
    return `<script src="${
      typeof window !== 'undefined' ? window.location.origin : 'https://feeban.vip'
    }/embed-widget.js" data-tenant="${activeTenant.slug}" data-brand="${
      activeTenant.tenantName
    }" data-multiplier="${activeTenant.priceMultiplier}" data-ref="${
      activeTenant.refCode
    }" async></script>`;
  }, [activeTenant]);

  const handleAddSwapOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSwapHave || !newSwapNeed) return;
    setSwapMatches([
      {
        id: `swap-${Date.now()}`,
        sourceStore: `${activeTenant.tenantName} (${activeTenant.city})`,
        deadStockItem: newSwapHave,
        matchedStore: 'مچینگ هوشمند با بنکدار تاییدشده علاءالدین تهران',
        offeredItem: newSwapNeed,
        diffSettlement: 'تهاتر مستقیم پایاپای با تضمین سپر امانی سامانه',
        whatsapp: activeTenant.phone,
      },
      ...swapMatches,
    ]);
    setNewSwapHave('');
    setNewSwapNeed('');
  };

  const officialInvitationText = useMemo(() => {
    return [
      `⚜️ *دعوت‌نامه رسمی اختصاصی راه‌اندازی سامانه هوشمند وایت‌لیبل (VIP)* ⚜️`,
      `حضور گرامی جناب آقای / سرکار خانم *${activeTenant.managerName}*`,
      `مدیریت محترم مجموعه *«${activeTenant.tenantName}»* (${activeTenant.city})`,
      ``,
      `با سلام و احترام؛`,
      `در راستای تحول دیجیتال بازار موبایل، لپ‌تاپ و قطعات اصلی (در قالب اکوسیستم Able Way City Afrina)، نسخه اختصاصی سامانه «آفرینا فی‌بان وی‌آی‌پی» دقیقاً با نام، لوگو، ضریب قیمت و شماره واتساپ مجموعه شما آماده بهره‌برداری شده است:`,
      `🌐 لینک پیش‌نمایش اختصاصی مجموعه شما: ${generatedDemoUrl}`,
      ``,
      `✨ *دستاوردهای انحصاری برای مجموعه شما:*`,
      `۱. بروزرسانی ۰.۰۱ ثانیه‌ای کل لیست قیمت تومانی گوشی، لپ‌تاپ و قطعات با تغییر نرخ دلار/درهم دبی`,
      `۲. ماشین‌حساب زنده سر میز مشتری + تقسیط چک صیادی بنفش، استعلام رنگ چک و قفل قیمت ضدتورم`,
      `۳. صدور ۳۰ ثانیه‌ای پیش‌فاکتور رسمی طلاکوب با کد IMEI و ارسال ۱-کلیکی به واتساپ مشتری`,
      `۴. شرایط پرداخت استثنایی و بدون ریسک: فقط ۱۲ میلیون تومان پیش‌پرداخت + ۲ فقره چک صیادی ۱۸ میلیون تومانی (با ضمانت بازگشت کامل چک‌ها در صورت عدم افزایش فروش در ماه اول!)`,
      ``,
      `🔖 سفیر و مشاور اختصاصی شما: ${ambassadorName} (کد سفیر: ${activeTenant.refCode})`,
    ].join('\n');
  }, [activeTenant, generatedDemoUrl, ambassadorName]);

  return (
    <div className="space-y-8">
      {/* ==========================================================================
          QUICK NAVIGATION ANCHOR BAR FOR THE 5 COMMERCIAL VIP SECTIONS
      ========================================================================== */}
      <nav
        aria-label="منوی دسترسی سریع معماری تجاری وایت‌لیبل و سفیران فروش"
        className="rounded-2xl bg-slate-900 text-white p-3 shadow-md border border-slate-800 sticky top-[68px] z-20"
      >
        <div className="flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-1.5 text-xs font-black text-amber-400 shrink-0 px-2">
            <Sparkles className="w-4 h-4" />
            <span>معماری تجاری VIP و سفیران ۲۵٪:</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href="#isolated-whitelabel"
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-emerald-500 hover:text-slate-950 text-xs font-extrabold transition-all whitespace-nowrap"
            >
              ۱. وایت‌لیبل ایزوله ۱۰ ثانیه‌ای (?tenant)
            </a>
            <a
              href="#live-desk-calculator"
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-emerald-500 hover:text-slate-950 text-xs font-extrabold transition-all whitespace-nowrap"
            >
              ۲. ماشین‌حساب سر میز + چک صیادی + قفل ضدتورم
            </a>
            <a
              href="#deliverables"
              className="px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 hover:bg-amber-300 text-xs font-black transition-all whitespace-nowrap"
            >
              ۳. دستاوردهای خریداران و ROI (#deliverables)
            </a>
            <a
              href="#visitor-playbook"
              className="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 hover:bg-emerald-400 text-xs font-black transition-all whitespace-nowrap"
            >
              ۴. فرمول طلایی فروش ویزیتورها (#golden-formula)
            </a>
            <a
              href="#invitation-letter"
              className="px-3 py-1.5 rounded-xl bg-sky-400 text-slate-950 hover:bg-sky-300 text-xs font-black transition-all whitespace-nowrap"
            >
              ۵. دعوت‌نامه طلاکوب و تسویه ۲۵٪ شبا (#invitation-letter)
            </a>
            <a
              href="#nextgen-innovations"
              className="px-3 py-1.5 rounded-xl bg-rose-500 text-white hover:bg-rose-400 text-xs font-black transition-all whitespace-nowrap"
            >
              ۶. تهاتر موجودی راکد + سپر امانی تیپاکس + ویجت وردپرس
            </a>
          </div>
        </div>
      </nav>

      {/* ==========================================================================
          SECTION 1: ISOLATED WHITE-LABEL TENANT & 10-SECOND TABLET URL SKIN
      ========================================================================== */}
      <section
        id="isolated-whitelabel"
        className="rounded-2xl bg-white border-2 border-emerald-500/40 shadow-sm p-5 space-y-5 scroll-mt-36"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">
              <Link2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  ۱. معماری ایزوله وایت‌لیبل و پیش‌نمایش ۱۰ ثانیه‌ای روی تبلت ویزیتور (Isolated White-Label Tenant & URL Skin)
                </h2>
                <span className="text-[11px] font-black px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300">
                  {activeTenant.isPermanentLicense
                    ? '✅ لایسنس تجاری دائمی فعال'
                    : '⚡ نسخه دموی موقت ویزیتور (دارای ۴ قفل امنیتی)'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                شخصی‌سازی آنی نام موبایل‌فروشی/بازرگانی، مدیر، شهر، واتساپ و ضریب قیمت از طریق پارامتر آدرس اینترنتی + ذخیره‌سازی ایزوله در localStorage بر اساس شناسه (slug: <code className="font-mono-num text-emerald-700">{activeTenant.slug}</code>)
              </p>
            </div>
          </div>

          <button
            onClick={() =>
              saveTenantToIsolatedStorage({
                ...activeTenant,
                isPermanentLicense: !activeTenant.isPermanentLicense,
              })
            }
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold border cursor-pointer transition-all ${
              activeTenant.isPermanentLicense
                ? 'bg-emerald-600 text-white border-emerald-700'
                : 'bg-slate-900 text-amber-300 border-slate-800'
            }`}
          >
            {activeTenant.isPermanentLicense
              ? 'مشاهده حالت دموی موقت ویزیتور'
              : 'شبیه‌سازی تحویل لایسنس تجاری خالص (حذف واترمارک دمو)'}
          </button>
        </div>

        {/* 10-Second Live Tenant Customizer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div>
            <label className="block text-[11px] font-extrabold text-slate-700 mb-1">
              نام واحد صنفی (?tenant=):
            </label>
            <input
              type="text"
              value={activeTenant.tenantName}
              onChange={(e) =>
                saveTenantToIsolatedStorage({ ...activeTenant, tenantName: e.target.value })
              }
              placeholder="مثلاً: موبایل و لپ‌تاپ رویال چارسو"
              className="w-full rounded-xl bg-white border border-slate-300 px-3 py-2 text-xs font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="block text-[11px] font-extrabold text-slate-700 mb-1">
              نام مدیر مجموعه (?manager=):
            </label>
            <input
              type="text"
              value={activeTenant.managerName}
              onChange={(e) =>
                saveTenantToIsolatedStorage({ ...activeTenant, managerName: e.target.value })
              }
              placeholder="حاج مهدی کریمی"
              className="w-full rounded-xl bg-white border border-slate-300 px-3 py-2 text-xs font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="block text-[11px] font-extrabold text-slate-700 mb-1">
              شهر و پاساژ (?city=):
            </label>
            <input
              type="text"
              value={activeTenant.city}
              onChange={(e) =>
                saveTenantToIsolatedStorage({ ...activeTenant, city: e.target.value })
              }
              placeholder="تهران - علاءالدین طبقه ۴"
              className="w-full rounded-xl bg-white border border-slate-300 px-3 py-2 text-xs font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="block text-[11px] font-extrabold text-slate-700 mb-1">
              شماره واتساپ (?phone=):
            </label>
            <input
              type="text"
              dir="ltr"
              value={activeTenant.phone}
              onChange={(e) =>
                saveTenantToIsolatedStorage({ ...activeTenant, phone: e.target.value })
              }
              placeholder="989121112233"
              className="w-full rounded-xl bg-white border border-slate-300 px-3 py-2 text-xs font-mono-num font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="block text-[11px] font-extrabold text-slate-700 mb-1">
              ضریب قیمت اختصاصی:
            </label>
            <select
              value={activeTenant.priceMultiplier}
              onChange={(e) =>
                saveTenantToIsolatedStorage({
                  ...activeTenant,
                  priceMultiplier: Number(e.target.value),
                })
              }
              className="w-full rounded-xl bg-white border border-emerald-400 px-2.5 py-2 text-xs font-mono-num font-black text-emerald-900"
            >
              <option value={0.98}>×0.98 (بنکدار کف دبی -۲٪)</option>
              <option value={1.0}>×1.00 (نرخ استاندارد تابلوی روز)</option>
              <option value={1.03}>×1.03 (فروشگاه تخصصی +۳٪)</option>
              <option value={1.06}>×1.06 (فروشگاه اقساطی VIP +۶٪)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-extrabold text-slate-700 mb-1">
              کد سفیر ویزیتور (?ref=):
            </label>
            <input
              type="text"
              dir="ltr"
              value={activeTenant.refCode}
              onChange={(e) =>
                saveTenantToIsolatedStorage({ ...activeTenant, refCode: e.target.value })
              }
              placeholder="AMB-7740"
              className="w-full rounded-xl bg-white border border-indigo-300 px-3 py-2 text-xs font-mono-num font-black text-indigo-800"
            />
          </div>
        </div>

        {/* Live Generated URL Skin Bar + Isolated Saved Slugs Switcher */}
        <div className="p-3.5 rounded-xl bg-slate-900 text-white flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <div className="space-y-1 overflow-hidden">
            <div className="text-[11px] text-amber-300 font-bold flex items-center gap-1.5">
              <span>🔗 لینک اختصاصی ۱۰ ثانیه‌ای تبلت ویزیتور (همگام با عنوان صفحه، فاکتور و استوری‌ساز):</span>
            </div>
            <div
              dir="ltr"
              className="text-xs font-mono-num text-emerald-300 truncate bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800"
            >
              {generatedDemoUrl}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleCopyDemoUrl}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black cursor-pointer"
            >
              {copiedUrlToast ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>
                {copiedUrlToast
                  ? '✓ لینک اختصاصی کپی و در آدرس‌بار اعمال شد!'
                  : 'کپی لینک دموی اختصاصی و ذخیره ایزوله'}
              </span>
            </button>

            <a
              href={`https://wa.me/${activeTenant.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                `سلام جناب ${activeTenant.managerName} عزیز 🌹\nنسخه اختصاصی سامانه قیمت‌گذاری لحظه‌ای و تقسیط چک صیادی برای مجموعه «${activeTenant.tenantName}» آماده پیش‌نمایش است:\n${generatedDemoUrl}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black"
            >
              <Send className="w-4 h-4" />
              <span>ارسال لینک دمو به واتساپ مدیر</span>
            </a>
          </div>
        </div>

        {/* Isolated localStorage Tenants Switcher */}
        {Object.keys(savedTenants).length > 0 && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-extrabold text-slate-700">
              🗄️ پروفایل‌های ایزوله ذخیره‌شده در تبلت شما (هر واحد صنفی کاملاً مجزا در localStorage):
            </span>
            {Object.values(savedTenants).map((rec) => (
              <button
                key={rec.slug}
                onClick={() => saveTenantToIsolatedStorage(rec)}
                className={`px-3 py-1 rounded-lg font-bold border cursor-pointer transition-all ${
                  rec.slug === activeTenant.slug
                    ? 'bg-emerald-600 text-white border-emerald-700'
                    : 'bg-slate-100 text-slate-700 border-slate-300 hover:border-emerald-400'
                }`}
              >
                {rec.tenantName} ({rec.city}) · ×{rec.priceMultiplier}
              </button>
            ))}
          </div>
        )}

        {/* 4 Security Locks: Visitor Temporary Demo vs Permanent Commercial License */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-1">
          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1">
            <div className="text-xs font-black text-amber-950 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-amber-700 shrink-0" />
              <span>قفل امنیتی ۱: واترمارک دمو و تبلیغات</span>
            </div>
            <p className="text-[11px] text-slate-700 leading-relaxed">
              در لینک دموی موقت ویزیتور، بنرهای تبلیغاتی سایر بازرگانی‌ها و واترمارک «نسخه پیش‌نمایش سفیر» نمایش داده می‌شود و تنها پس از خرید لایسنس حذف می‌گردد.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-200 space-y-1">
            <div className="text-xs font-black text-sky-950 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-sky-700 shrink-0" />
              <span>قفل امنیتی ۲: نرخ‌های پایه در سرور مرکزی</span>
            </div>
            <p className="text-[11px] text-slate-700 leading-relaxed">
              تغییرات دموی ویزیتور فقط در حافظه محلی همان دستگاه (`localStorage`) بر اساس `slug` ذخیره می‌شود و دیتابیس سرور اصلی تغییر نمی‌کند تا تسویه انجام شود.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200 space-y-1">
            <div className="text-xs font-black text-indigo-950 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-indigo-700 shrink-0" />
              <span>قفل امنیتی ۳: حک دائمی کد سفیر (?ref)</span>
            </div>
            <p className="text-[11px] text-slate-700 leading-relaxed">
              کد سفیر ویزیتور (<code className="font-mono-num">{activeTenant.refCode}</code>) در تمام لینک‌ها و فاکتورهای دمو حک شده است؛ حتی اگر مدیر ۱ هفته بعد مستقیم خرید کند، ۲۵٪ پورسانت به شبای همان سفیر واریز می‌شود.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1">
            <div className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
              <Unlock className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>قفل امنیتی ۴: تحویل نسخه خالص تجاری</span>
            </div>
            <p className="text-[11px] text-slate-700 leading-relaxed">
              بلافاصله پس از پرداخت پیش‌پرداخت ۱۲ میلیون تومانی، دامنه اختصاصی، APK امضاشده و پنل ادمین ابری خالص بدون هیچ تبلیغی تحویل مدیر واحد صنفی می‌شود.
            </p>
          </div>
        </div>
      </section>

      {/* ==========================================================================
          SECTION 2: LIVE CUSTOMER DESK CALCULATOR + SAYADI CHECK + INFLATION SHIELD
      ========================================================================== */}
      <section
        id="live-desk-calculator"
        className="rounded-2xl bg-white border-2 border-indigo-500/30 shadow-sm p-5 space-y-5 scroll-mt-36"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-800">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                ۲. ماشین‌حساب زنده سر میز مشتری (۰.۱ ثانیه) + تقسیط چک صیادی بنفش + قفل ضدتورم و تسهیم هزینه
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                حذف کامل ماشین‌حساب دستی و کاغذبازی سنتی سر میز فروش موبایل، لپ‌تاپ و تعمیرات — همراه با جدول سررسید شمسی و شلیک ۱-کلیکی فاکتور طلاکوب به واتساپ
              </p>
            </div>
          </div>

          {/* Inflation-Shield Guarantee Toggle Button */}
          <button
            onClick={() => setInflationShieldLocked(!inflationShieldLocked)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs ${
              inflationShieldLocked
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-700 border border-slate-300'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>
              {inflationShieldLocked
                ? '🔒 قفل ضمانت قیمت ضدتورم (Inflation-Shield) فعال است'
                : 'فعال‌سازی قفل ضمانت قیمت ضدتورم (تثبیت نرخ ارز از لحظه بیعانه)'}
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Live Item Selection & Sliders */}
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-7">
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  انتخاب گوشی، لپ‌تاپ، تبلت یا قطعه تعمیراتی سر میز:
                </label>
                <select
                  value={deskProductId}
                  onChange={(e) => setDeskProductId(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3 py-2.5 text-xs font-bold text-slate-900"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.baseWholesaleForeign} {p.baseCurrency})
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  تعداد:
                </label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={deskQty}
                  onChange={(e) => setDeskQty(Math.max(1, Number(e.target.value) || 1))}
                  className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3 py-2.5 text-xs font-mono-num font-black text-slate-900"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  سطح قیمت فاکتور:
                </label>
                <select
                  value={deskPriceMode}
                  onChange={(e) =>
                    setDeskPriceMode(e.target.value as 'retail' | 'wholesale')
                  }
                  className="w-full rounded-xl bg-slate-50 border border-slate-300 px-2.5 py-2.5 text-xs font-bold text-slate-900"
                >
                  <option value="retail">تک‌فروشی (+همتا)</option>
                  <option value="wholesale">عمده همکار (کارتنی)</option>
                </select>
              </div>
            </div>

            {/* Guild-Specific Instant Add-on Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() =>
                  setIncludeOriginalChargerAndGlass(!includeOriginalChargerAndGlass)
                }
                className={`p-3 rounded-xl border text-right text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                  includeOriginalChargerAndGlass
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                <span>➕ کلگی شارژر اصلی + گلس (+۲.۴۵ م)</span>
                {includeOriginalChargerAndGlass && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
              </button>

              <button
                type="button"
                onClick={() =>
                  setIncludeGolden18MonthInsurance(!includeGolden18MonthInsurance)
                }
                className={`p-3 rounded-xl border text-right text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                  includeGolden18MonthInsurance
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                <span>🛡️ گارانتی طلایی تعویض ۱۸ ماهه (+۱.۸۵ م)</span>
                {includeGolden18MonthInsurance && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
              </button>

              <button
                type="button"
                onClick={() =>
                  setIncludeOriginalLcdBatteryPack(!includeOriginalLcdBatteryPack)
                }
                className={`p-3 rounded-xl border text-right text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                  includeOriginalLcdBatteryPack
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                <span>🔧 پک LCD فابریک روکاری و باتری (+۱۴.۹ م)</span>
                {includeOriginalLcdBatteryPack && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
              </button>
            </div>

            {/* Sliders for Down Payment, Check Count & Cost Split */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-xs font-extrabold text-slate-800 mb-1">
                    <span>درصد پیش‌پرداخت نقدی سر میز:</span>
                    <span className="text-emerald-700 font-mono-num">
                      {downPaymentPercent}٪ ({formatToman(deskCalculation.downPaymentToman)} ت)
                    </span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={70}
                    step={5}
                    value={downPaymentPercent}
                    onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-extrabold text-slate-800 mb-1">
                    <span>تعداد فقره چک صیادی بنفش (۳ تا ۱۲ ماه):</span>
                    <span className="text-indigo-700 font-mono-num">
                      {checkCount} فقره چک صیادی
                    </span>
                  </div>
                  <input
                    type="range"
                    min={3}
                    max={12}
                    step={1}
                    value={checkCount}
                    onChange={(e) => setCheckCount(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
                <div>
                  <div className="flex justify-between text-xs font-extrabold text-slate-800 mb-1">
                    <span>🤝 اسلایدر تقسیم و تسهیم شفاف هزینه (شرکا/خانواده):</span>
                    <span className="text-sky-700 font-mono-num">
                      بین {costSplitParties} نفر / شریک تجاری
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={6}
                    step={1}
                    value={costSplitParties}
                    onChange={(e) => setCostSplitParties(Number(e.target.value))}
                    className="w-full accent-sky-600 cursor-pointer"
                  />
                  <div className="text-[11px] text-slate-600 mt-1">
                    سهم هر شریک / عضو خانواده:{' '}
                    <strong className="text-slate-900 font-mono-num">
                      {formatToman(deskCalculation.splitPerPartyToman)} تومان
                    </strong>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-extrabold text-slate-800 mb-1">
                    <span>کارمزد ماهانه تقسیط چک صیادی:</span>
                    <span className="text-amber-800 font-mono-num">
                      {monthlyCheckWagePercent}٪ در ماه
                    </span>
                  </div>
                  <input
                    type="range"
                    min={2}
                    max={5}
                    step={0.5}
                    value={monthlyCheckWagePercent}
                    onChange={(e) => setMonthlyCheckWagePercent(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Live Central Bank Sayadi Check Color Simulator */}
            <div className={`p-4 rounded-2xl border-2 space-y-2.5 ${sayadiMeta.boxClass}`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-black flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4" />
                  <span>شبیه‌ساز زنده استعلام رنگ چک صیادی بانک مرکزی (درج خودکار گواهی در فاکتور):</span>
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSayadiColorState('white')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-black cursor-pointer ${
                      sayadiColorState === 'white'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white border border-slate-300 text-slate-700'
                    }`}
                  >
                    🟢 وضعیت سفید
                  </button>
                  <button
                    type="button"
                    onClick={() => setSayadiColorState('yellow')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-black cursor-pointer ${
                      sayadiColorState === 'yellow'
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-white border border-slate-300 text-slate-700'
                    }`}
                  >
                    🟡 وضعیت زرد
                  </button>
                  <button
                    type="button"
                    onClick={() => setSayadiColorState('red')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-black cursor-pointer ${
                      sayadiColorState === 'red'
                        ? 'bg-rose-600 text-white'
                        : 'bg-white border border-slate-300 text-slate-700'
                    }`}
                  >
                    🔴 وضعیت قرمز
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                <div className="sm:col-span-5">
                  <input
                    type="text"
                    dir="ltr"
                    maxLength={16}
                    value={sayadi16Digit}
                    onChange={(e) => setSayadi16Digit(e.target.value)}
                    placeholder="شناسه ۱۶ رقمی صیادی"
                    className="w-full rounded-lg bg-white border border-slate-300 px-3 py-1.5 text-xs font-mono-num font-black text-slate-900"
                  />
                </div>
                <div className="sm:col-span-7 text-xs font-extrabold">{sayadiMeta.badge}</div>
              </div>
              <p className="text-[11px] opacity-90">{sayadiMeta.desc}</p>
            </div>
          </div>

          {/* Right Column: Gold-Embossed Live Invoice Output & Shamsi Check Schedule */}
          <div className="lg:col-span-5 rounded-2xl bg-slate-900 text-white p-5 flex flex-col justify-between space-y-4 border-2 border-amber-400/50 shadow-lg">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[11px] font-black text-amber-400 block">
                    👑 پیش‌فاکتور رسمی طلاکوب سر میز مشتری
                  </span>
                  <h3 className="text-sm font-black text-white mt-0.5">
                    {activeTenant.tenantName}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    به مدیریت: {activeTenant.managerName} · {activeTenant.city}
                  </p>
                </div>
                <div className="text-left font-mono-num text-[11px] text-emerald-400">
                  <div>دلار: {formatToman(rates.USD)} ت</div>
                  <div>درهم: {formatToman(rates.AED)} ت</div>
                </div>
              </div>

              {/* Customer Name & Phone Input for Instant WhatsApp Shot */}
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={customerNameDesk}
                  onChange={(e) => setCustomerNameDesk(e.target.value)}
                  placeholder="نام مشتری سر میز"
                  className="rounded-lg bg-slate-950 border border-slate-700 px-2.5 py-1.5 text-xs text-white"
                />
                <input
                  type="text"
                  dir="ltr"
                  value={customerPhoneDesk}
                  onChange={(e) => setCustomerPhoneDesk(e.target.value)}
                  placeholder="09120000000"
                  className="rounded-lg bg-slate-950 border border-slate-700 px-2.5 py-1.5 text-xs font-mono-num text-amber-300"
                />
              </div>

              {/* Financial Summary Box */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">مبلغ کل نقدی کالا و خدمات:</span>
                  <span className="font-mono-num font-bold text-white">
                    {formatToman(deskCalculation.totalCashInvoiceToman)} تومان
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-400 font-bold">
                    پیش‌پرداخت نقدی ({downPaymentPercent}٪):
                  </span>
                  <span className="font-mono-num font-black text-emerald-400">
                    {formatToman(deskCalculation.downPaymentToman)} تومان
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-800 pt-2">
                  <span className="text-amber-300 font-bold">
                    مبلغ هر چک صیادی ({checkCount} فقره):
                  </span>
                  <span className="font-mono-num font-black text-base text-amber-400">
                    {formatToman(deskCalculation.eachCheckAmountToman)} تومان
                  </span>
                </div>
                {costSplitParties > 1 && (
                  <div className="flex justify-between text-[11px] text-sky-300 pt-1">
                    <span>سهم هر نفر (تقسیم {costSplitParties} نفره):</span>
                    <span className="font-mono-num font-bold">
                      {formatToman(deskCalculation.splitPerPartyToman)} تومان
                    </span>
                  </div>
                )}
              </div>

              {/* Shamsi Due Date Schedule Table */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-300 block">
                  📅 جدول تاریخ‌های سررسید شمسی چک‌های صیادی بنفش:
                </span>
                <div className="max-h-36 overflow-y-auto rounded-xl bg-slate-950 border border-slate-800 p-2 space-y-1">
                  {deskCalculation.checkSchedule.map((row) => (
                    <div
                      key={row.checkNumber}
                      className="flex items-center justify-between text-[11px] px-2 py-1 rounded bg-slate-900/90"
                    >
                      <span className="text-slate-300">
                        چک صیادی شماره {row.checkNumber} ({row.dueDateShamsi})
                      </span>
                      <span className="font-mono-num font-bold text-amber-300">
                        {formatToman(row.amountToman)} تومان
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {inflationShieldLocked && (
                <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-[11px] text-emerald-300 font-semibold">
                  🛡️ گارانتی قفل ضدتورم: نرخ درهم و دلار این فاکتور از لحظه پرداخت بیعانه تا تحویل نهایی کالا ۱۰۰٪ قفل شده است.
                </div>
              )}
            </div>

            {/* 1-Click WhatsApp Shot Buttons (To Customer & To Store Manager) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => handleSendDeskGoldInvoiceWhatsapp(customerPhoneDesk)}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>ارسال فاکتور طلاکوب به واتساپ مشتری</span>
              </button>

              <button
                onClick={() => handleSendDeskGoldInvoiceWhatsapp(activeTenant.phone)}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black cursor-pointer"
              >
                <Smartphone className="w-4 h-4" />
                <span>شلیک تست به واتساپ مدیر مغازه!</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================================
          SECTION 3: WHAT STORE OWNERS GET & LIVE ROI CALCULATOR (#deliverables)
      ========================================================================== */}
      <section
        id="deliverables"
        className="rounded-2xl bg-white border-2 border-amber-400/60 shadow-sm p-5 space-y-6 scroll-mt-36"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-900">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                ۳. صاحبان موبایل‌فروشی، لپ‌تاپ و بازرگانی قطعات در صورت خرید برنامه دقیقاً چه چیزی به دست می‌آورند؟ (#deliverables)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                ماشین‌حساب زنده بازگشت سرمایه (ROI) + ۸ ماژول تجاری تحویلی با ارزش ریالی + جدول مقایسه سنتی در برابر هوشمند
              </p>
            </div>
          </div>
        </div>

        {/* Live ROI Calculator */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-amber-50 border-2 border-emerald-300 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900">
                📈 ماشین‌حساب زنده بازگشت سرمایه (ROI Calculator) ویژه مدیر واحد صنفی
              </h3>
              <p className="text-xs text-slate-600">
                ببینید چگونه سود خالص فقط ۲ تا ۳ فاکتور فروش اقساطی یا عمده اضافه در ماه، بیش از ۴.۸ برابر کل هزینه خرید لایسنس یک‌ساله برنامه است!
              </p>
            </div>

            <div className="px-4 py-2.5 rounded-xl bg-slate-900 text-white text-right">
              <span className="text-[11px] text-amber-300 block">
                سود خالص اضافه سالانه برای مغازه شما:
              </span>
              <span className="text-lg sm:text-xl font-black font-mono-num text-emerald-400">
                +{formatToman(annualExtraProfitToman)} تومان ({roiMultiple} برابر هزینه لایسنس!)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5">
              <div className="flex justify-between text-xs font-extrabold text-slate-800">
                <span>تعداد فاکتور اضافه در ماه (با چک صیادی/معاوضه):</span>
                <span className="text-emerald-700 font-mono-num">
                  {extraMonthlyInvoices} فاکتور در ماه
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={25}
                value={extraMonthlyInvoices}
                onChange={(e) => setExtraMonthlyInvoices(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5">
              <div className="flex justify-between text-xs font-extrabold text-slate-800">
                <span>میانگین سود هر فاکتور گوشی / لپ‌تاپ / پارت بار:</span>
                <span className="text-sky-700 font-mono-num">
                  {formatToman(avgProfitPerInvoiceToman)} ت
                </span>
              </div>
              <input
                type="range"
                min={2000000}
                max={20000000}
                step={500000}
                value={avgProfitPerInvoiceToman}
                onChange={(e) => setAvgProfitPerInvoiceToman(Number(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5">
              <div className="flex justify-between text-xs font-extrabold text-slate-800">
                <span>صرفه‌جویی در وقت ویرایش لیست قیمت و استوری:</span>
                <span className="text-indigo-700 font-mono-num">
                  {savedHoursPerMonth} ساعت در ماه
                </span>
              </div>
              <input
                type="range"
                min={15}
                max={90}
                step={5}
                value={savedHoursPerMonth}
                onChange={(e) => setSavedHoursPerMonth(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* 8 Tangible Deliverable Cards with Rial/Toman Valuation */}
        <div>
          <h3 className="text-sm font-black text-slate-900 mb-3">
            🎁 ۸ دستاورد ملموس و ماژول اختصاصی که خریدار لایسنس تحویل می‌گیرد (ارزش واقعی ماژول‌ها: ۲۴۸ میلیون تومان):
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
            {[
              {
                num: '۱',
                title: 'وب‌اپلیکیشن اختصاصی PWA (نصب ۱-کلیکی آیفون و اندروید)',
                val: 'ارزش مجزا: ۴۵,۰۰۰,۰۰۰ تومان',
                desc: 'نصب مستقیم با نام و آیکون فروشگاه شما روی گوشی مشتریان بدون نیاز به اپ‌استور.',
              },
              {
                num: '۲',
                title: 'خروجی امضاشده اندروید (APK / AAB) ویژه مایکت و بازار',
                val: 'ارزش مجزا: ۳۵,۰۰۰,۰۰۰ تومان',
                desc: 'پروژه کامل Gradle به همراه کلید امضای دیجیتال و درگاه پرداخت درون‌برنامه‌ای.',
              },
              {
                num: '۳',
                title: 'موتور قیمت‌گذاری ۰.۰۱ ثانیه‌ای دلاری/درهمی + قفل نوسان',
                val: 'ارزش مجزا: ۳۲,۰۰۰,۰۰۰ تومان',
                desc: 'تغییر کل قیمت‌های تومانی گوشی، لپ‌تاپ و قطعات در کسری از ثانیه با تغییر نرخ ارز.',
              },
              {
                num: '۴',
                title: 'ماشین‌حساب اقساط چک صیادی بنفش + معاوضه Trade-In',
                val: 'ارزش مجزا: ۲۸,۰۰۰,۰۰۰ تومان',
                desc: 'محاسبه کسر قیمت گوشی کارکرده بر اساس سلامت باتری و تقسیط مابه‌التفاوت با چک صیادی.',
              },
              {
                num: '۵',
                title: 'موتور مقایسه ۳ بعدی هم‌تراز (فنی، قیمت، نقدشوندگی بازار)',
                val: 'ارزش مجزا: ۲۶,۰۰۰,۰۰۰ تومان',
                desc: 'مقایسه تخصصی گوشی، لپ‌تاپ و تبلت بر اساس سرعت فروش دست‌دوم و اقبال عمومی بازار ایران.',
              },
              {
                num: '۶',
                title: 'تولیدکننده برچسب هوشمند QR ویترین مغازه + شناسنامه قطعه',
                val: 'ارزش مجزا: ۲۴,۰۰۰,۰۰۰ تومان',
                desc: 'حذف کاغذ قیمت از ویترین مغازه + صدور گواهی ۷ روز مهلت تست ال‌سی‌دی و باتری فابریک.',
              },
              {
                num: '۷',
                title: 'استوری‌ساز خودکار فول‌اچ‌دی (۱۰۸۰×۱۹۲۰) + هوش مصنوعی',
                val: 'ارزش مجزا: ۳۰,۰۰۰,۰۰۰ تومان',
                desc: 'طراحی ۱-کلیکی پوستر لیست قیمت روزانه و کپشن‌نویسی وایرال اینستاگرام.',
              },
              {
                num: '۸',
                title: 'پیش‌فاکتور رسمی طلاکوب با کد سریال IMEI و رجیستری همتا',
                val: 'ارزش مجزا: ۲۸,۰۰۰,۰۰۰ تومان',
                desc: 'ثبت کد ۱۵ رقمی IMEI، استعلام هزینه گمرکی همتا و ارسال ۱-کلیکی فاکتور به واتساپ.',
              },
            ].map((card) => (
              <div
                key={card.num}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-2"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded-lg bg-slate-900 text-amber-300 font-black flex items-center justify-center">
                      {card.num}
                    </span>
                    <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      {card.val}
                    </span>
                  </div>
                  <h4 className="font-black text-slate-900 leading-snug">{card.title}</h4>
                  <p className="text-slate-600 leading-relaxed">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Table: Traditional Shop vs Smart Equipped Shop */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="p-3.5 font-black">شاخص عملیاتی در بازار موبایل و کامپیوتر</th>
                <th className="p-3.5 font-black text-rose-300">
                  ❌ موبایل‌فروشی و بازرگانی سنتی (کاغذ و ماشین‌حساب)
                </th>
                <th className="p-3.5 font-black text-emerald-300">
                  ✅ واحد صنفی مجهز به سامانه هوشمند آفرینا فی‌بان VIP
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              <tr>
                <td className="p-3 font-extrabold text-slate-900">
                  بروزرسانی لیست قیمت هنگام جهش ناگهانی درهم/دلار
                </td>
                <td className="p-3 text-rose-700 font-semibold">
                  ۴۵ دقیقه ویرایش دستی در تلگرام و ضرر فروش زیر قیمت خرید
                </td>
                <td className="p-3 text-emerald-800 font-extrabold">
                  آپدیت کل کالاها در ۰.۰۱ ثانیه + دکمه قفل اضطراری نوسان بازار
                </td>
              </tr>
              <tr>
                <td className="p-3 font-extrabold text-slate-900">
                  محاسبه اقساط چک صیادی و طرح تعویض گوشی کارکرده سر میز
                </td>
                <td className="p-3 text-rose-700 font-semibold">
                  حساب کتاب روی کاغذ، خطای محاسباتی و تردید مشتری برای خرید
                </td>
                <td className="p-3 text-emerald-800 font-extrabold">
                  محاسبه ۰.۱ ثانیه‌ای با جدول سررسید شمسی و شلیک فاکتور طلاکوب به واتساپ مشتری
                </td>
              </tr>
              <tr>
                <td className="p-3 font-extrabold text-slate-900">
                  برچسب قیمت روی جعبه گوشی و لپ‌تاپ در ویترین مغازه
                </td>
                <td className="p-3 text-rose-700 font-semibold">
                  نبود قیمت یا خط‌خوردگی برچسب‌های کاغذی و خروج ۶۰٪ مشتریان خجالتی
                </td>
                <td className="p-3 text-emerald-800 font-extrabold">
                  برچسب دائمی QR ویترین که با اسکن دوربین موبایل، قیمت لحظه‌ای امروز را نشان می‌دهد
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ==========================================================================
          SECTION 4: VISITOR PLAYBOOK & 3 GOLDEN SALES FORMULAS (#visitor-playbook)
      ========================================================================== */}
      <section
        id="visitor-playbook"
        className="rounded-2xl bg-white border-2 border-emerald-500/40 shadow-sm p-5 space-y-6 scroll-mt-36"
      >
        <div
          id="golden-formula"
          className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 scroll-mt-36"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                ۴. راهنمای عملی ویزیتورها و بازاریابان + آموزش «فرمول طلایی ۳گانه فروش قطعی از هفته اول» (#visitor-playbook & #golden-formula)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                چک‌لیست ۶۰ ثانیه‌ای پشت درِ مغازه + سناریوی دقیقه به دقیقه جلسه ۱۰ دقیقه‌ای + پاسخ آماده به ۵ بهانه رایج مدیران صنف
              </p>
            </div>
          </div>
        </div>

        {/* 60-Second Pre-Entry Checklist behind the shop door */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border-2 border-amber-200 space-y-3">
          <h3 className="text-xs sm:text-sm font-black text-amber-950 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-700" />
            <span>
              ⏱️ چک‌لیست ۶۰ ثانیه‌ای ویزیتور «پشت درِ موبایل‌فروشی یا غرفه علاءالدین/چارسو» (قبل از ورود به مغازه):
            </span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {[
              {
                id: 1,
                text: '۱. نگاه به تابلو سر در مغازه و وارد کردن نام دقیق فروشگاه و نام مدیر در نوار بالای تبلت (بخش ۱ همین صفحه) در ۱۰ ثانیه.',
              },
              {
                id: 2,
                text: '۲. تنظیم روشنایی صفحه تبلت روی ۱۰۰٪ و باز گذاشتن بخش «ماشین‌حساب زنده سر میز مشتری» با برند خود مغازه‌دار.',
              },
              {
                id: 3,
                text: '۳. آماده کردن ۱ نمونه محاسبه اقساط چک صیادی آیفون ۱۶ پرومکس یا S24 Ultra برای شلیک به واتساپ مدیر در دقیقه ۲.',
              },
              {
                id: 4,
                text: '۴. بررسی کد سفیر (?ref=) و شماره شبای خودتان در بخش ۵ تا در صورت پرداخت پیش‌پرداخت ۱۲ میلیونی، پورسانت درجا تسویه شود.',
              },
            ].map((item) => (
              <label
                key={item.id}
                onClick={() =>
                  setChecklistState((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
                }
                className={`p-3 rounded-xl border text-xs font-bold flex items-start gap-2.5 cursor-pointer transition-all ${
                  checklistState[item.id]
                    ? 'bg-emerald-600 text-white border-emerald-700'
                    : 'bg-white text-slate-800 border-slate-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={!!checklistState[item.id]}
                  onChange={() => {}}
                  className="mt-0.5 accent-amber-400"
                />
                <span>{item.text}</span>
              </label>
            ))}
          </div>
        </div>

        {/* The 3 Golden Sales Principles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-2">
            <span className="px-2.5 py-0.5 rounded bg-amber-400 text-slate-950 text-[11px] font-black">
              اصل اول (پشت درِ واحد صنفی)
            </span>
            <h4 className="text-sm font-black text-amber-300">
              شخصی‌سازی نام واحد صنفی روی تبلت قبل از سلام اول!
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              هرگز یک برنامه عمومی نشان ندهید! قبل از ورود، نام مغازه (مثلاً «موبایل نگین چارسو») را در کادر بالا تایپ کنید تا مدیر در ثانیه اول، نام برند خودش را بالای تابلوی زنده دلار و درهم ببیند.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-2">
            <span className="px-2.5 py-0.5 rounded bg-emerald-400 text-slate-950 text-[11px] font-black">
              اصل دوم (دقیقه ۲ جلسه)
            </span>
            <h4 className="text-sm font-black text-emerald-300">
              شلیک پیش‌فاکتور طلاکوب به واتساپِ گوشی خودِ مدیر!
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              در دقیقه ۲، شماره واتساپ مدیر را بگیرید و دکمه «شلیک تست به واتساپ مدیر مغازه» را بزنید. لحظه‌ای که صدای پیامک واتساپ گوشی خودش بلند می‌شود و فاکتور طلاکوب با نام خودش و جدول چک صیادی را می‌بیند، تصمیم خرید قطعی می‌شود!
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-2">
            <span className="px-2.5 py-0.5 rounded bg-sky-400 text-slate-950 text-[11px] font-black">
              اصل سوم (دقیقه ۸ - شکستن مقاومت مالی)
            </span>
            <h4 className="text-sm font-black text-sky-300">
              فرمول اقساطی بدون ریسک (۱۲ نقد + ۲ چک ۱۸ میلیونی)
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              لایسنس پایه (۴۸ میلیون تومان) یا VIP (۹۶ میلیون تومان) را این‌گونه پیشنهاد دهید: «فقط ۱۲ میلیون تومان پیش‌پرداخت نقدی (که درجا کل ۲۵٪ پورسانت شما را تسویه می‌کند!) + ۲ فقره چک صیادی ۱۸ میلیون تومانی با ضمانت بازگشت چک‌ها در صورت عدم افزایش فروش در ماه اول!»
            </p>
          </div>
        </div>

        {/* 3-Step 10-Minute Meeting Roadmap */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <h3 className="text-sm font-black text-slate-900">
            🧭 راهنمای ۳ مرحله‌ای اولویت معرفی قابلیت‌ها در جلسه ۱۰ دقیقه‌ای (جلوگیری از گیج شدن مدیر سنتی):
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
              <div className="font-black text-emerald-800">
                گام اول (دقیقه ۱ تا ۳): فقط ۳ قابلیت اصلی!
              </div>
              <p className="text-slate-600 leading-relaxed">
                فقط ۱) تغییر ۰.۰۱ ثانیه‌ای کل لیست قیمت با تغییر درهم/دلار، ۲) ماشین‌حساب تقسیط چک صیادی سر میز، و ۳) شلیک فاکتور به واتساپ مدیر را نشان دهید تا مدیر سنتی سردرگم نشود.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
              <div className="font-black text-indigo-800">
                گام دوم (دقیقه ۳ تا ۶): قابلیت‌های مالی و پول‌ساز
              </div>
              <p className="text-slate-600 leading-relaxed">
                استعلام رنگ چک صیادی (سفید/زرد/قرمز)، محاسبه‌گر معاوضه گوشی کارکرده با آکبند (Trade-In) و برچسب QR ویترین مغازه برای جذب مشتریان عبوری را نشان دهید.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
              <div className="font-black text-amber-900">
                گام سوم (دقیقه ۷ تا ۱۰): امکانات ادمین و بستن قرارداد
              </div>
              <p className="text-slate-600 leading-relaxed">
                دکمه «قفل اضطراری نوسان بازار» را نشان دهید و بلافاصله پیشنهاد «۱۲ میلیون پیش‌پرداخت + ۲ چک ۱۸ میلیونی با ضمانت بازگشت» را مطرح و قرارداد را ببندید.
              </p>
            </div>
          </div>
        </div>

        {/* 5 Common Objections & 1-Click Ready Answers + Guild Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8 space-y-2.5">
            <h3 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              <span>بانک پاسخ‌های آماده و کپی ۱-کلیکی به ۵ بهانه رایج مدیران موبایل‌فروشی و بازرگانی:</span>
            </h3>
            {[
              {
                q: '۱. «الان بازار راکده و ۴۸ میلیون تومان برای نرم‌افزار زیاده!»',
                a: 'حاج آقا دقیقاً چون بازار نقدی راکده، کل سود الان توی «فروش اقساطی با چک صیادی» و «طرح تعویض گوشی کارکرده» هست. شما فقط ۱۲ میلیون پیش‌پرداخت می‌دید و ۲ تا چک ۱۸ میلیونی می‌ذارید؛ سودِ فقط ۲ تا آیفون اقساطی در ماه کل پول برنامه رو درمیاره. تازه اگر ماه اول فروشتون بیشتر نشد، چک‌هاتون رو عیناً پس می‌دیم!',
              },
              {
                q: '۲. «ما خودمون کانال تلگرام و پیج اینستاگرام داریم، نیازی به برنامه نداریم!»',
                a: 'کانال تلگرام عالیه، اما وقتی درهم توی ۱۰ دقیقه ۵۰۰ تومن بالا می‌ره، ادمین شما ۴۰ دقیقه طول می‌کشه لیست قیمت رو ادیت کنه و همون موقع ۲ تا گوشی رو زیر قیمت جایگزینی می‌فروشید! این سامانه با ۱ کلیک کل قیمت‌ها رو آپدیت می‌کنه و خودش پوستر آماده برای استوری اینستاگرامتون می‌سازه.',
              },
              {
                q: '۳. «شاگردها و فروشنده‌های من وقت ندارن با سیستم پیچیده کار کنن!»',
                a: 'دقیقاً به همین خاطر کل کار با این برنامه ۳ ثانیه‌ست! حتی مشتری خودش برچسب QR روی ویترین مغازه‌تون رو اسکن می‌کنه، مدل گوشی کارکرده‌ش رو می‌زنه و فاکتور آماده رو می‌فرسته به واتساپ شما؛ یعنی بارِ کاری فروشنده‌تون نصف می‌شه.',
              },
              {
                q: '۴. «نکنه اطلاعات قیمت خرید و مشتری‌های من رو همکارهای بغلی ببینن؟»',
                a: 'معماری این سامانه ۱۰۰٪ ایزوله (Isolated White-Label) هست؛ کل اطلاعات و ضریب قیمت شما روی دامنه و فضای اختصاصی خودتون قفل می‌شه و هیچ ارتباطی با سایر مغازه‌ها نداره.',
              },
              {
                q: '۵. «بذارید با شریکم مشورت کنم هفته‌ی دیگه خبر می‌دم!»',
                a: 'حتماً قربان؛ اتفاقاً همین الان لینک اختصاصی با نام مغازه خودتون و یک پیش‌فاکتور طلاکوب نمونه رو فرستادم به واتساپتون تا به شریکتون نشون بدید. فقط چون سهمیه انحصاری هر پاساژ/منطقه محدود به ۳ فروشگاهه، با کد سفیر من جایگاهتون رو رزرو می‌کنم.',
              },
            ].map((obj, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="space-y-1 text-xs">
                  <div className="font-black text-rose-800">{obj.q}</div>
                  <p className="text-slate-700 leading-relaxed">{obj.a}</p>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(obj.a);
                    setCopiedObjectionIdx(idx);
                    setTimeout(() => setCopiedObjectionIdx(null), 2000);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 text-amber-300 text-[11px] font-bold shrink-0 cursor-pointer"
                >
                  {copiedObjectionIdx === idx ? '✓ کپی شد' : 'کپی پاسخ'}
                </button>
              </div>
            ))}
          </div>

          {/* Guild Market Size Statistics in Tehran & Provinces */}
          <div className="lg:col-span-4 p-4 rounded-2xl bg-indigo-950 text-white space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-amber-300 font-black text-xs sm:text-sm">
                <MapPin className="w-5 h-5" />
                <span>📊 آمار واحدهای فعال صنف موبایل، کامپیوتر و قطعات (بازار هدف ویزیتورها):</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-white/10 flex justify-between items-center">
                  <span>پاساژ علاءالدین، چارسو و بازار موبایل ایران:</span>
                  <strong className="font-mono-num text-amber-300">+۲,۴۵۰ غرفه فعال</strong>
                </div>
                <div className="p-3 rounded-xl bg-white/10 flex justify-between items-center">
                  <span>مجتمع کامپیوتر پایتخت، ولیعصر و رضا:</span>
                  <strong className="font-mono-num text-amber-300">+۱,۱۸۰ واحد صنفی</strong>
                </div>
                <div className="p-3 rounded-xl bg-white/10 flex justify-between items-center">
                  <span>بازار بزرگ تهران و پخش‌کنندگان جانبی:</span>
                  <strong className="font-mono-num text-amber-300">+۱,۶۰۰ بنکدار</strong>
                </div>
                <div className="p-3 rounded-xl bg-white/10 flex justify-between items-center">
                  <span>سطح شهر تهران و کرج (موبایل و تعمیرات):</span>
                  <strong className="font-mono-num text-emerald-300">+۱۲,۵۰۰ فروشگاه</strong>
                </div>
                <div className="p-3 rounded-xl bg-white/10 flex justify-between items-center">
                  <span>کلانشهرها و سراسر کشور (مشهد، اصفهان، شیراز، تبریز...):</span>
                  <strong className="font-mono-num text-emerald-300">+۴۸,۰۰۰ واحد صنفی</strong>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-[11px] text-emerald-200 leading-relaxed">
              💡 <strong>پتانسیل طلایی ویزیتور:</strong> جذب فقط ۴ واحد صنفی در ماه از میان ۶۵,۰۰۰ واحد فعال کشور = <strong>۴۸ تا ۹۶ میلیون تومان پورسانت نقدی شبا در ماه!</strong>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================================
          SECTION 5: AMBASSADOR FINANCIAL HUB, INVITATION LETTER & 25% SHEBA LEDGER
      ========================================================================== */}
      <section
        id="invitation-letter"
        className="rounded-2xl bg-white border-2 border-sky-500/40 shadow-sm p-5 space-y-6 scroll-mt-36"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-100 text-sky-800">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                ۵. هاب مالی سفیران، دعوت‌نامه رسمی طلاکوب و جدول تسویه ۲۵٪ پورسانت شبا (#invitation-letter)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                تولید خودکار دعوت‌نامه رسمی VIP خطاب به مدیر واحد صنفی + ثبت شماره شبا (IR) و تسویه آنی ۲۵٪ پورسانت نقدی (۱۲ تا ۲۴ میلیون تومان در هر فروش)
              </p>
            </div>
          </div>

          <div className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-black">
            مجموع پورسانت تسویه‌شده به شبای شما:{' '}
            <span className="font-mono-num text-sm">
              {formatToman(totalAmbassadorEarnedToman)} تومان
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Gold-Embossed Official VIP Invitation Letter */}
          <div className="lg:col-span-6 p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 text-white border-2 border-amber-400/60 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <span className="text-xs font-black text-amber-400 flex items-center gap-1.5">
                  <FileText className="w-4 h-4" />
                  <span>دعوت‌نامه رسمی طلاکوب VIP (همگام با نام مدیر و واحد صنفی بالا)</span>
                </span>
                <span className="text-[11px] font-mono-num text-emerald-400">
                  Ref: {activeTenant.refCode}
                </span>
              </div>

              <pre className="text-xs text-slate-200 whitespace-pre-wrap font-sans leading-relaxed bg-slate-900/90 p-4 rounded-xl border border-amber-400/30">
                {officialInvitationText}
              </pre>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(officialInvitationText);
                  setInvitationCopied(true);
                  setTimeout(() => setInvitationCopied(false), 2500);
                }}
                className="flex-1 py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-4 h-4" />
                <span>
                  {invitationCopied ? '✓ متن دعوت‌نامه طلاکوب کپی شد!' : 'کپی دعوت‌نامه رسمی'}
                </span>
              </button>

              <a
                href={`https://wa.me/${activeTenant.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  officialInvitationText
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                <span>ارسال به واتساپ مدیر</span>
              </a>

              <button
                onClick={() => window.print()}
                className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>چاپ A4</span>
              </button>
            </div>
          </div>

          {/* Right: Ambassador Sheba Registration & 1-Click License Sale Logger */}
          <div className="lg:col-span-6 p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <h3 className="text-sm font-black text-slate-900">
                🏦 ثبت شماره شبا (IBAN) سفیر و ثبت ۱-کلیکی فروش لایسنس جهت تسویه آنی ۲۵٪ پورسانت:
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    نام سفیر / ویزیتور رسمی:
                  </label>
                  <input
                    type="text"
                    value={ambassadorName}
                    onChange={(e) => setAmbassadorName(e.target.value)}
                    className="w-full rounded-xl bg-white border border-slate-300 px-3 py-2 text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    کد سفیر اختصاصی (?ref=):
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={activeTenant.refCode}
                    onChange={(e) =>
                      saveTenantToIsolatedStorage({ ...activeTenant, refCode: e.target.value })
                    }
                    className="w-full rounded-xl bg-white border border-indigo-300 px-3 py-2 text-xs font-mono-num font-black text-indigo-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  شماره شبا ۲۴ رقمی بانکی ویزیتور جهت واریز آنی ۲۵٪ پورسانت (IR...):
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={ambassadorSheba}
                  onChange={(e) => setAmbassadorSheba(e.target.value)}
                  placeholder="IR820540102680020817904002"
                  className="w-full rounded-xl bg-white border border-emerald-400 px-3.5 py-2.5 text-xs font-mono-num font-black text-emerald-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  انتخاب نوع لایسنس / بسته فروخته‌شده به «{activeTenant.tenantName}»:
                </label>
                <select
                  value={selectedSalePackage}
                  onChange={(e) =>
                    setSelectedSalePackage(
                      e.target.value as 'base_48m' | 'vip_96m' | 'ad_diamond_12m'
                    )
                  }
                  className="w-full rounded-xl bg-white border border-slate-300 px-3 py-2.5 text-xs font-bold text-slate-900"
                >
                  <option value="base_48m">
                    لایسنس تجاری پایه (۴۸ میلیون ت = ۱۲ نقد + ۲ چک ۱۸ ت) ⬅️ پورسانت آنی شما: ۱۲,۰۰۰,۰۰۰ تومان
                  </option>
                  <option value="vip_96m">
                    لایسنس اختصاصی VIP بازرگانی (۹۶ میلیون ت = ۲۴ نقد + ۲ چک ۳۶ ت) ⬅️ پورسانت آنی شما: ۲۴,۰۰۰,۰۰۰ تومان
                  </option>
                  <option value="ad_diamond_12m">
                    بسته تبلیغاتی اسپانسر الماسی (۱۲.۵ میلیون ت) ⬅️ پورسانت آنی شما: ۳,۱۲۵,۰۰۰ تومان
                  </option>
                </select>
              </div>
            </div>

            <button
              onClick={handleRecordInstantSale}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-sm cursor-pointer"
            >
              + ثبت ۱-کلیکی فروش لایسنس برای «{activeTenant.tenantName}» و محاسبه واریز شبا
            </button>
          </div>
        </div>

        {/* Live 25% Commission Settlement Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-100 text-slate-800 border-b border-slate-200">
              <tr>
                <th className="p-3 font-black">تاریخ ثبت</th>
                <th className="p-3 font-black">نام واحد صنفی و مدیر</th>
                <th className="p-3 font-black">نوع لایسنس / قرارداد</th>
                <th className="p-3 font-black">مبلغ کل قرارداد</th>
                <th className="p-3 font-black">پیش‌پرداخت نقدی دریافتی</th>
                <th className="p-3 font-black text-emerald-800">
                  سهم ۲۵٪ پورسانت نقدی ویزیتور
                </th>
                <th className="p-3 font-black">شماره شبا مقصد و وضعیت تسویه</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {salesLedger.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50">
                  <td className="p-3 font-mono-num text-slate-600">{entry.dateShamsi}</td>
                  <td className="p-3">
                    <div className="font-black text-slate-900">{entry.storeName}</div>
                    <div className="text-[11px] text-slate-500">
                      {entry.managerName} ({entry.city})
                    </div>
                  </td>
                  <td className="p-3 font-bold text-slate-700">{entry.packageLabel}</td>
                  <td className="p-3 font-mono-num font-bold text-slate-800">
                    {formatToman(entry.totalContractToman)} ت
                  </td>
                  <td className="p-3 font-mono-num font-bold text-sky-700">
                    {formatToman(entry.cashDownPaymentToman)} ت
                  </td>
                  <td className="p-3 font-mono-num font-black text-emerald-700 text-sm">
                    {formatToman(entry.ambassadorCommission25Percent)} تومان
                  </td>
                  <td className="p-3">
                    <div className="font-mono-num text-[11px] text-slate-600">
                      {entry.shebaNumber}
                    </div>
                    <span className="inline-block mt-0.5 text-[10px] font-black bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">
                      ✓ {entry.settlementStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ==========================================================================
          SECTION 6: 3 NEXT-GEN CREATIVE ENGINES (DEAD-STOCK SWAP, SMART ESCROW, 1-LINE EMBED)
      ========================================================================== */}
      <section
        id="nextgen-innovations"
        className="rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border-2 border-emerald-400/50 shadow-lg p-5 space-y-6 scroll-mt-36"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                ۶. سه موتور خلاقانه نسل جدید (انحصاری جهانی در صنعت موبایل و کامپیوتر)
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                ۱) پروتکل تهاتر هوشمند موجودی راکد همکاران (Dead-Stock AI Swap) · ۲) کیف پول امانی هوشمند با بارکد تیپاکس (Smart Escrow) · ۳) ویجت ۱-خطی قیمت زنده برای سایت وردپرسی مغازه‌داران
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Innovation 1: Dead-Stock AI Swap Engine */}
          <div className="lg:col-span-5 p-4 rounded-2xl bg-slate-950/90 border border-slate-800 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-400">
                  🔄 ۱. موتور تهاتر هوشمند موجودی راکد ویترین (Dead-Stock AI Swap)
                </span>
                <span className="text-[10px] font-bold bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded">
                  بدون نیاز به پول نقد!
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                مدلی که در ویترین شهر شما کندفروش است را ثبت کنید تا هوش مصنوعی آن را با کالای پرفروش همکار دیگری در شهر مقابل تهاتر (Swap) کند:
              </p>

              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {swapMatches.map((sw) => (
                  <div
                    key={sw.id}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-xs"
                  >
                    <div className="text-amber-300 font-bold">{sw.sourceStore}</div>
                    <div className="text-slate-300">
                      ➖ واگذاری راکد: <strong>{sw.deadStockItem}</strong>
                    </div>
                    <div className="text-emerald-300">
                      ➕ دریافت پرفروش از {sw.matchedStore}: <strong>{sw.offeredItem}</strong>
                    </div>
                    <div className="flex items-center justify-between pt-1.5 border-t border-slate-800 text-[11px]">
                      <span className="text-sky-300">{sw.diffSettlement}</span>
                      <a
                        href={`https://wa.me/${sw.whatsapp}?text=${encodeURIComponent(
                          `سلام همکار گرامی، جهت انجام تهاتر موجودی (${sw.deadStockItem} با ${sw.offeredItem}) در سامانه آفرینا فی‌بان پیام می‌دهم.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded bg-emerald-500 text-slate-950 font-black"
                      >
                        تایید تهاتر
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleAddSwapOffer} className="space-y-2 pt-2 border-t border-slate-800">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={newSwapHave}
                  onChange={(e) => setNewSwapHave(e.target.value)}
                  placeholder="کالای راکد شما (مثلاً ۳ عدد S23 FE)"
                  className="rounded-lg bg-slate-900 border border-slate-700 px-2.5 py-2 text-xs text-white"
                />
                <input
                  type="text"
                  value={newSwapNeed}
                  onChange={(e) => setNewSwapNeed(e.target.value)}
                  placeholder="کالای مورد نیاز (مثلاً آیفون ۱۳ یا LCD)"
                  className="rounded-lg bg-slate-900 border border-slate-700 px-2.5 py-2 text-xs text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black cursor-pointer"
              >
                + ثبت درخواست تهاتر هوشمند بین‌شهری
              </button>
            </form>
          </div>

          {/* Innovation 2: Smart B2B Escrow with Tipax Barcode Verification */}
          <div className="lg:col-span-4 p-4 rounded-2xl bg-slate-950/90 border border-slate-800 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-emerald-400">
                  🛡️ ۲. کیف پول امانی هوشمند بین‌شهری (Smart B2B Escrow)
                </span>
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">
                  ضد کلاهبرداری ۱۰۰٪
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                پول خریدار شهرستان در صندوق امانی سامانه قفل می‌شود و تنها پس از ثبت بارکد تیپاکس/چاپار و تایید سلامت ۷ روزه قطعه/IMEI به حساب بنکدار آزاد می‌گردد:
              </p>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  کد رهگیری بارنامه تیپاکس / ماهان / چاپار:
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={escrowTrackingCode}
                  onChange={(e) => setEscrowTrackingCode(e.target.value)}
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs font-mono-num font-bold text-emerald-300"
                />
              </div>

              <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => setEscrowStage('locked')}
                  className={`py-2 px-2 rounded-lg font-bold cursor-pointer ${
                    escrowStage === 'locked'
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}
                >
                  ۱. قفل وجه امانی
                </button>
                <button
                  type="button"
                  onClick={() => setEscrowStage('shipped')}
                  className={`py-2 px-2 rounded-lg font-bold cursor-pointer ${
                    escrowStage === 'shipped'
                      ? 'bg-sky-400 text-slate-950'
                      : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}
                >
                  ۲. ارسال تیپاکس
                </button>
                <button
                  type="button"
                  onClick={() => setEscrowStage('released')}
                  className={`py-2 px-2 rounded-lg font-bold cursor-pointer ${
                    escrowStage === 'released'
                      ? 'bg-emerald-400 text-slate-950'
                      : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}
                >
                  ۳. تایید و آزادسازی
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-emerald-500/30 text-xs space-y-1">
                {escrowStage === 'locked' && (
                  <p className="text-amber-300 font-bold">
                    🔒 مبلغ ۱۸۵,۰۰۰,۰۰۰ تومان در صندوق امانی قفل شد. منتظر تحویل بسته توسط بنکدار به تیپاکس...
                  </p>
                )}
                {escrowStage === 'shipped' && (
                  <p className="text-sky-300 font-bold">
                    📦 بسته با بارکد {escrowTrackingCode} بیمه ۱۰۰٪ و ارسال شد. پس از دریافت و تست سلامت، دکمه آزادسازی را بزنید.
                  </p>
                )}
                {escrowStage === 'released' && (
                  <p className="text-emerald-300 font-bold">
                    ✅ اصالت IMEI و سلامت بار تایید شد! وجه معامله به صورت آنی (ساتنا/تتر) به حساب فروشنده آزاد گردید.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Innovation 3: 1-Line WordPress / WooCommerce Live Embed Script */}
          <div className="lg:col-span-3 p-4 rounded-2xl bg-slate-950/90 border border-slate-800 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="text-xs font-black text-sky-400 block">
                💻 ۳. ویجت ۱-خطی برای سایت‌های وردپرسی (1-Line Embed)
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                اگر مغازه‌دار از قبل سایت وردپرسی یا فروشگاهی دارد، فقط با کپی کردن این ۱ خط کد، تابلوی نرخ لحظه‌ای دلار/درهم و ماشین‌حساب چک صیادی با نام «{activeTenant.tenantName}» داخل سایت فعلی‌اش هم نمایش داده می‌شود!
              </p>

              <pre
                dir="ltr"
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[10px] font-mono-num text-sky-300 overflow-x-auto whitespace-pre-wrap leading-relaxed"
              >
                {oneLineEmbedCode}
              </pre>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(oneLineEmbedCode);
                setEmbedCopied(true);
                setTimeout(() => setEmbedCopied(false), 2500);
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {embedCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>
                {embedCopied ? '✓ کد ویجت ۱-خطی کپی شد!' : 'کپی کد ویجت ۱-خطی وردپرس'}
              </span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
