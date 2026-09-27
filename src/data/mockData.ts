export type CurrencyCode = 'USD' | 'AED' | 'CNY' | 'USDT';

export type CategoryId =
  | 'all'
  | 'mobile'
  | 'parts'
  | 'laptop'
  | 'accessories'
  | 'gadgets'
  | 'tools'
  | 'clearance';

export interface MarketRates {
  USD: number;
  AED: number;
  CNY: number;
  USDT: number;
  isVolatilityLocked: boolean;
  updatedAt: string;
}

export interface ProductItem {
  id: string;
  title: string;
  englishModel: string;
  category: Exclude<CategoryId, 'all'>;
  isClearanceDubai?: boolean;
  baseCurrency: CurrencyCode;
  baseWholesaleForeign: number; // Wholesale price in USD / AED / CNY
  retailMarkupPercent: number; // Markup for single consumer retail with 18m warranty + Hamta
  hamtaFeeToman: number; // Official Hamta customs/registration fee included in retail
  minWholesaleQty: number;
  unitLabel: string;
  stockCount: number;
  warehouseHub: string;
  partNumberOrSpec: string;
  warrantyText: string;
  imeiPrefix: string;
  imageUrl: string;
  fallbackGradient: string;
}

export interface WholesaleBuyRequest {
  id: string;
  storeName: string;
  city: string;
  buyerRole: string;
  requestedItems: string;
  qtyText: string;
  paymentType: 'نقدی فوری (پایا/ساتنا)' | 'تسویه تتر (USDT)' | 'چک صیادی معتبر VIP';
  targetBudgetText: string;
  timeAgo: string;
  whatsappPhone: string;
  verifiedPartner: boolean;
}

export interface UsedPhoneReference {
  id: string;
  modelName: string;
  storage: string;
  baseCleanUsdValue: number;
}

export const CATEGORIES: { id: CategoryId; label: string; shortLabel: string; countBadge?: number }[] = [
  { id: 'all', label: 'همه کالاهای بنکداری (۱۰)', shortLabel: 'همه کالاها' },
  { id: 'mobile', label: '۱. گوشی موبایل (پک گلوبال + همتا)', shortLabel: 'گوشی موبایل' },
  { id: 'parts', label: '۲. قطعات تعمیراتی اصلی (LCD و باتری)', shortLabel: 'قطعات تعمیراتی' },
  { id: 'laptop', label: '۳. لپ‌تاپ، مک‌بوک و کنسول بازی', shortLabel: 'لپ‌تاپ و کنسول' },
  { id: 'accessories', label: '۴. لوازم جانبی عمده و کارتنی', shortLabel: 'جانبی کارتنی' },
  { id: 'gadgets', label: '۵. گجت‌های هوشمند (اپل‌واچ و ایرپاد)', shortLabel: 'گجت هوشمند' },
  { id: 'tools', label: '۶. تجهیزات تعمیرات موبایل (لوپ و هیتر)', shortLabel: 'ابزار تعمیرات' },
  { id: 'clearance', label: '۷. حراج پارت بار دبی و گمرک (زیر فی علاءالدین)', shortLabel: 'حراج بار دبی' },
];

export const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: 'prod-iphone-16pm',
    title: 'گوشی اپل iPhone 16 Pro Max ظرفیت 256GB دو سیم‌کارت ZAA',
    englishModel: 'iPhone 16 Pro Max 256GB ZAA Desert Titanium',
    category: 'mobile',
    isClearanceDubai: true,
    baseCurrency: 'AED',
    baseWholesaleForeign: 4620,
    retailMarkupPercent: 6.5,
    hamtaFeeToman: 12800000,
    minWholesaleQty: 5,
    unitLabel: 'دستگاه (کارتن مادر ۵ تایی)',
    stockCount: 45,
    warehouseHub: 'ترخیص دبی · تحویل علاءالدین طبقه ۴',
    partNumberOrSpec: 'ZAA/A · تیتانیوم صحرایی · نات‌اکتیو (Not Active)',
    warrantyText: '۱۸ ماه گارانتی شرکتی + کد فعال‌سازی رسمی همتا',
    imeiPrefix: '3589412098',
    imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=900&q=80',
    fallbackGradient: 'from-amber-900/60 via-slate-900 to-slate-950',
  },
  {
    id: 'prod-s24-ultra',
    title: 'گوشی سامسونگ Galaxy S24 Ultra 5G ظرفیت 512GB رم 12GB پک ویتنام',
    englishModel: 'Samsung Galaxy S24 Ultra 512GB Titanium Gray',
    category: 'mobile',
    isClearanceDubai: false,
    baseCurrency: 'AED',
    baseWholesaleForeign: 3780,
    retailMarkupPercent: 5.8,
    hamtaFeeToman: 4200000,
    minWholesaleQty: 5,
    unitLabel: 'دستگاه (پک ویتنام پلمپ)',
    stockCount: 62,
    warehouseHub: 'انبار مرکزی تهران · پاساژ چارسو',
    partNumberOrSpec: 'SM-S928B/DS · ساخت ویتنام · تیتانیوم گری',
    warrantyText: '۱۸ ماه گارانتی رسمی شرکتی + کد همتا روی جعبه',
    imeiPrefix: '3547198034',
    imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=900&q=80',
    fallbackGradient: 'from-blue-900/60 via-slate-900 to-slate-950',
  },
  {
    id: 'prod-xiaomi-14t-pro',
    title: 'گوشی شیائومی Xiaomi 14T Pro 5G ظرفیت 512GB رم 12GB پک گلوبال',
    englishModel: 'Xiaomi 14T Pro 512GB/12GB Leica Camera Global',
    category: 'mobile',
    isClearanceDubai: true,
    baseCurrency: 'USD',
    baseWholesaleForeign: 595,
    retailMarkupPercent: 6.2,
    hamtaFeeToman: 2450000,
    minWholesaleQty: 10,
    unitLabel: 'دستگاه (با کلگی شارژر ۱۲۰ وات اصلی)',
    stockCount: 80,
    warehouseHub: 'حراج پارت گمرک · زیر فی بازار بزرگ',
    partNumberOrSpec: 'Global Version · لنز لایکا · نمایشگر 144Hz',
    warrantyText: '۱۸ ماه گارانتی شرکتی معتبر + کد فعال‌سازی همتا',
    imeiPrefix: '8692450173',
    imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=80',
    fallbackGradient: 'from-emerald-900/60 via-slate-900 to-slate-950',
  },
  {
    id: 'prod-lcd-15pm-orig',
    title: 'ال‌سی‌دی فابریک روکاری iPhone 15 Pro Max (Original Pulled 100%)',
    englishModel: 'Original Pulled OLED Display iPhone 15 Pro Max',
    category: 'parts',
    isClearanceDubai: false,
    baseCurrency: 'AED',
    baseWholesaleForeign: 1090,
    retailMarkupPercent: 14.0,
    hamtaFeeToman: 0,
    minWholesaleQty: 3,
    unitLabel: 'عدد (پک ضدضربه بازرگانی دبی)',
    stockCount: 28,
    warehouseHub: 'پخش قطعه علاءالدین · طبقه منفی ۱',
    partNumberOrSpec: '100% فابریک بازشده از روی دستگاه · قابلیت انتقال آی‌سی بدون ارور',
    warrantyText: '۷ روز مهلت تست تعویض بدون قید و شرط ویژه تعمیرکاران (تضمین فابریک)',
    imeiPrefix: 'SN-LCD15PM',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=80',
    fallbackGradient: 'from-cyan-900/60 via-slate-900 to-slate-950',
  },
  {
    id: 'prod-battery-pack10',
    title: 'پک ۱۰ عددی باتری اورجینال تقویت‌شده آیفون (13 / 14 / 15 Pro Max آی‌سی TI)',
    englishModel: 'Original TI-Chip High Capacity Battery 10-Pack',
    category: 'parts',
    isClearanceDubai: true,
    baseCurrency: 'CNY',
    baseWholesaleForeign: 920,
    retailMarkupPercent: 22.0,
    hamtaFeeToman: 0,
    minWholesaleQty: 2,
    unitLabel: 'پک ۱۰ عددی (همراه چسب ضدآب فابریک)',
    stockCount: 95,
    warehouseHub: 'واردات مستقیم شنژن و دبی · تحویل فوری',
    partNumberOrSpec: 'سلول کبالت خالص · نمایش ۱۰۰٪ سلامت باتری بدون شوک',
    warrantyText: '۶ ماه گارانتی تعویض بی‌قید و شرط بادکردگی و افت سلامت ویژه همکار',
    imeiPrefix: 'SN-BAT2026',
    imageUrl: 'https://images.unsplash.com/photo-1609592424209-27d4b8876640?auto=format&fit=crop&w=900&q=80',
    fallbackGradient: 'from-violet-900/60 via-slate-900 to-slate-950',
  },
  {
    id: 'prod-macbook-m3-15',
    title: 'لپ‌تاپ اپل MacBook Air 15-inch M3 ظرفیت 16GB RAM / 512GB SSD',
    englishModel: 'MacBook Air 15" M3 Chip 16GB/512GB Midnight LLA',
    category: 'laptop',
    isClearanceDubai: false,
    baseCurrency: 'USD',
    baseWholesaleForeign: 1290,
    retailMarkupPercent: 6.5,
    hamtaFeeToman: 0,
    minWholesaleQty: 3,
    unitLabel: 'دستگاه (پارت نامبر LLA آمریکا پلمپ)',
    stockCount: 19,
    warehouseHub: 'انبار مرکزی دبی و تهران · میدان ولیعصر',
    partNumberOrSpec: 'M3 8-Core CPU / 10-Core GPU · رنگ Midnight · پلمپ تیپاکسی',
    warrantyText: '۱۸ ماه گارانتی معتبر سخت‌افزاری + فاکتور رسمی شرکتی',
    imeiPrefix: 'C02M3AIR15',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80',
    fallbackGradient: 'from-indigo-900/60 via-slate-900 to-slate-950',
  },
  {
    id: 'prod-ps5-slim-bundle',
    title: 'کنسول بازی سونی PlayStation 5 Slim 1TB استاندارد اروپا (کد 2016A)',
    englishModel: 'Sony PS5 Slim 1TB Disc Edition CFI-2016A Europe',
    category: 'laptop',
    isClearanceDubai: true,
    baseCurrency: 'AED',
    baseWholesaleForeign: 1690,
    retailMarkupPercent: 7.5,
    hamtaFeeToman: 0,
    minWholesaleQty: 4,
    unitLabel: 'دستگاه (کارتن ۴ تایی پارت اروپا)',
    stockCount: 36,
    warehouseHub: 'حراج بار تازه ترخیص دبی · زیر فی بازار',
    partNumberOrSpec: 'CFI-2016A · دیسک‌خور اسلیم · همراه دسته DualSense اصلی',
    warrantyText: '۱۰ روز مهلت تست سلامت لنز و برد + ۱۲ ماه ضمانت شرکتی',
    imeiPrefix: 'SN-PS52016',
    imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=900&q=80',
    fallbackGradient: 'from-sky-900/60 via-slate-900 to-slate-950',
  },
  {
    id: 'prod-carton-20w-adapter',
    title: 'کارتن ۵۰ عددی کلگی شارژر ۲۰ وات اصلی اپل (پارت امارات و ویتنام سریال‌دار)',
    englishModel: 'Carton 50pcs Apple 20W USB-C Power Adapter Original',
    category: 'accessories',
    isClearanceDubai: true,
    baseCurrency: 'AED',
    baseWholesaleForeign: 2150,
    retailMarkupPercent: 28.0,
    hamtaFeeToman: 0,
    minWholesaleQty: 1,
    unitLabel: 'کارتن ۵۰ عددی (هر عدد در کارتن ~۴۳ درهم)',
    stockCount: 40,
    warehouseHub: 'پخش عمده جانبی بازار بزرگ و علاءالدین',
    partNumberOrSpec: 'وزن استاندارد ۶۲ گرم · برد اصلی بدون پرش تاچ · تست‌شده با دستگاه',
    warrantyText: '۱ سال گارانتی تعویض درجا ویژه موبایل‌فروشان (لیبل هولوگرام DigiRate)',
    imeiPrefix: 'ACC-20W50P',
    imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=900&q=80',
    fallbackGradient: 'from-teal-900/60 via-slate-900 to-slate-950',
  },
  {
    id: 'prod-watch-ultra2-airpods',
    title: 'پک گجت هوشمند Apple Watch Ultra 2 Titanium 49mm + AirPods Pro 2 USB-C',
    englishModel: 'Apple Watch Ultra 2 49mm Ocean Band + AirPods Pro 2',
    category: 'gadgets',
    isClearanceDubai: false,
    baseCurrency: 'AED',
    baseWholesaleForeign: 3490,
    retailMarkupPercent: 7.0,
    hamtaFeeToman: 0,
    minWholesaleQty: 3,
    unitLabel: 'ست کامل (یا سفارش تکی در پیش‌فاکتور)',
    stockCount: 24,
    warehouseHub: 'انبار VIP چارسو · تحویل ۲ ساعته پیک تهران',
    partNumberOrSpec: 'بند اوشن سرمه‌ای · پارت LLA · چیپ H2 و S9 SiP',
    warrantyText: '۱۸ ماه گارانتی معتبر شرکتی + تضمین اصالت سریال در سایت اپل',
    imeiPrefix: 'GDG-APW992',
    imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=900&q=80',
    fallbackGradient: 'from-orange-900/60 via-slate-900 to-slate-950',
  },
  {
    id: 'prod-repair-station-pro',
    title: 'پکیج کامل میز تعمیرات موبایل (لوپ سه چشمی Mechanic + هیتر Quick 861DW اصلی)',
    englishModel: 'Mechanic Trinocular Microscope + Quick 861DW Hot Air',
    category: 'tools',
    isClearanceDubai: false,
    baseCurrency: 'USD',
    baseWholesaleForeign: 495,
    retailMarkupPercent: 11.0,
    hamtaFeeToman: 0,
    minWholesaleQty: 1,
    unitLabel: 'پکیج کامل تجهیزات (اورجینال شرکت کوئیک و مکانیک)',
    stockCount: 14,
    warehouseHub: 'مرکز پخش ابزار تعمیرات علاءالدین · طبقه ۵',
    partNumberOrSpec: 'هیتر ۱۰۰۰ وات دیجیتال بدون نوسان دما + لوپ زوم ۴۵ برابر با رینگ‌لایت',
    warrantyText: '۱۲ ماه گارانتی المنت و برد + ۷ روز مهلت تست تخصصی تعمیرگاه',
    imeiPrefix: 'TLS-QK861D',
    imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=900&q=80',
    fallbackGradient: 'from-rose-900/60 via-slate-900 to-slate-950',
  },
];

export const INITIAL_BUY_REQUESTS: WholesaleBuyRequest[] = [
  {
    id: 'req-1',
    storeName: 'پخش موبایل پارس (شیراز - خیابان ملاصدرا)',
    city: 'شیراز',
    buyerRole: 'بنکدار و پخش استان فارس',
    requestedItems: 'خریدار فوری ۱۰ دستگاه S24 Ultra 512GB ویتنام + ۵ دستگاه آیفون ۱۶ پرومکس ZAA',
    qtyText: '۱۵ دستگاه گوشی پلمپ',
    paymentType: 'نقدی فوری (پایا/ساتنا)',
    targetBudgetText: 'تسویه آنی روی فی کف درهم امروز',
    timeAgo: '۴ دقیقه پیش',
    whatsappPhone: '989170000001',
    verifiedPartner: true,
  },
  {
    id: 'req-2',
    storeName: 'کلینیک تخصصی تعمیرات آیفون برتر (مشهد - احمدآباد)',
    city: 'مشهد',
    buyerRole: 'مرکز تعمیرات و پخش قطعه خراسان',
    requestedItems: 'نیازمند ۱۵ عدد ال‌سی‌دی فابریک روکاری آیفون 14 و 15 پرومکس + ۵ پک باتری تقویت‌شده TI',
    qtyText: '۶۵ قطعه اورجینال',
    paymentType: 'نقدی فوری (پایا/ساتنا)',
    targetBudgetText: 'ارسال هوایی ماهان یا تیپاکس ویژه',
    timeAgo: '۱۱ دقیقه پیش',
    whatsappPhone: '989150000002',
    verifiedPartner: true,
  },
  {
    id: 'req-3',
    storeName: 'موبایل و دیجیتال آذرخش (تبریز - پاساژ شهریار)',
    city: 'تبریز',
    buyerRole: 'فروشگاه زنجیره‌ای موبایل و لپ‌تاپ',
    requestedItems: 'خریدار ۲۰ دستگاه Xiaomi 14T Pro گلوبال + ۲ کارتن کلگی شارژر ۲۰ وات اصلی اپل',
    qtyText: '۱۲۰ قلم کالا',
    paymentType: 'چک صیادی معتبر VIP',
    targetBudgetText: '۵۰٪ نقد + ۵۰٪ چک صیادی ۴۵ روزه بنفش',
    timeAgo: '۲۳ دقیقه پیش',
    whatsappPhone: '989140000003',
    verifiedPartner: true,
  },
  {
    id: 'req-4',
    storeName: 'بازرگانی خلیج فارس (اهواز - نادری و دبی)',
    city: 'اهواز / دبی',
    buyerRole: 'تأمین‌کننده کنسول و مک‌بوک جنوب',
    requestedItems: 'خریدار ۸ دستگاه مک‌بوک ایر M3 15-inch + ۱۰ دستگاه PS5 Slim اروپا تحویل تهران یا دبی',
    qtyText: '۱۸ دستگاه',
    paymentType: 'تسویه تتر (USDT)',
    targetBudgetText: 'تسویه آنی تتر TRC20 در دفتر چارسو',
    timeAgo: '۳۵ دقیقه پیش',
    whatsappPhone: '989160000004',
    verifiedPartner: true,
  },
];

export const USED_PHONE_MODELS: UsedPhoneReference[] = [
  { id: 'u-15pm-256', modelName: 'iPhone 15 Pro Max (ZAA دو سیم‌کارت)', storage: '256GB', baseCleanUsdValue: 1020 },
  { id: 'u-14pm-256', modelName: 'iPhone 14 Pro Max (ZAA ریجستر شده)', storage: '256GB', baseCleanUsdValue: 860 },
  { id: 'u-13pm-256', modelName: 'iPhone 13 Pro Max (پارت ZAA / LLA)', storage: '256GB', baseCleanUsdValue: 740 },
  { id: 'u-13-128', modelName: 'iPhone 13 Normal (پک اصلی ریجستر شده)', storage: '128GB', baseCleanUsdValue: 485 },
  { id: 'u-s23u-256', modelName: 'Samsung Galaxy S23 Ultra 5G ویتنام', storage: '256GB', baseCleanUsdValue: 640 },
  { id: 'u-s22u-256', modelName: 'Samsung Galaxy S22 Ultra 5G', storage: '256GB', baseCleanUsdValue: 450 },
  { id: 'u-13tpro-512', modelName: 'Xiaomi 13T Pro 512GB Global', storage: '512GB', baseCleanUsdValue: 370 },
];

export interface VipTierPlan {
  level: number;
  title: string;
  audience: string;
  durationLabel: string;
  priceToman: number;
  monthlyEquivalent: string;
  creditCeilingText: string;
  features: string[];
  popular?: boolean;
}

export const VIP_TIERS: VipTierPlan[] = [
  {
    level: 1,
    title: 'سطح ۱: همکار نقره‌ای (موبایل‌فروش و تعمیرکار)',
    audience: 'مناسب موبایل‌فروشان محلی و تعمیرکاران مستقل',
    durationLabel: 'اشتراک ۱ ماهه',
    priceToman: 980000,
    monthlyEquivalent: '۹۸۰,۰۰۰ تومان در ماه',
    creditCeilingText: 'دسترسی به قیمت کف همکار + استوری‌ساز نامحدود',
    features: [
      'مشاهده لحظه‌ای قیمت کف همکار دلاری و درهمی',
      'استفاده نامحدود از استوری‌ساز HD با لوگوی فروشگاه شما',
      'صدور پیش‌فاکتور رسمی دیجیتال با کد سریال IMEI',
    ],
  },
  {
    level: 2,
    title: 'سطح ۲: همکار پلاس (فروشگاه‌های فعال شهرستان)',
    audience: 'مناسب فروشگاه‌های موبایل و جانبی در مراکز استان‌ها',
    durationLabel: 'اشتراک ۳ ماهه',
    priceToman: 2490000,
    monthlyEquivalent: '۸۳۰,۰۰۰ تومان در ماه (۱۵٪ تخفیف)',
    creditCeilingText: 'ثبت درخواست در تابلوی کسری همکاران + ارسال تیپاکس VIP',
    features: [
      'تمامی امکانات سطح ۱ + ثبت آگهی خرید در تابلوی زنده کسری بار',
      'دسترسی به حراج پارت بار تازه ترخیص دبی (زیر فی علاءالدین)',
      'ماشین‌حساب اقساط چک صیادی و طرح تعویض Trade-In اختصاصی',
    ],
  },
  {
    level: 3,
    title: 'سطح ۳: بنکدار طلایی (VIP 3 - پرفروش‌ترین)',
    audience: 'ویژه غرفه‌داران علاءالدین، چارسو و پخش‌کنندگان استان',
    durationLabel: 'اشتراک ۶ ماهه',
    priceToman: 4400000,
    monthlyEquivalent: '۷۳۳,۰۰۰ تومان در ماه (۲۵٪ تخفیف)',
    creditCeilingText: 'سقف اعتبار خرید چکی صیادی تا ۵۰۰ میلیون تومان',
    popular: true,
    features: [
      'اعتبار خرید چکی صیادی (چک بنفش) پس از تایید حسابداری',
      'پنل تنظیم نرخ ارز اختصاصی و قفل نوسان بازار برای مشتریان شما',
      'اولویت رزرو بار آیفون، سامسونگ و ال‌سی‌دی‌های فابریک روکاری',
    ],
  },
  {
    level: 4,
    title: 'سطح ۴: پخش‌کننده ممتاز (VIP 4 - سالانه)',
    audience: 'ویژه شرکت‌های پخش قطعه، جانبی و موبایل سراسر کشور',
    durationLabel: 'اشتراک ۱ ساله کامل',
    priceToman: 7900000,
    monthlyEquivalent: '۶۵۸,۰۰۰ تومان در ماه (۳۳٪ تخفیف)',
    creditCeilingText: 'سقف اعتبار خرید چکی صیادی تا ۱.۵ میلیارد تومان',
    features: [
      'سورس مستقیم بار دبی (دیره) و شنژن چین بدون واسطه',
      'تاییدیه تیک آبی بنکدار معتبر در تابلوی معاملات کشوری',
      'پشتیبانی اختصاصی ترخیص و ارسال هوایی/تیپاکس بیمه ۱۰۰٪',
    ],
  },
  {
    level: 5,
    title: 'سطح ۵: رویال اکوسیستم و White-Label (VIP 5)',
    audience: 'ویژه واردکنندگان اصلی، عمده‌فروشان کلان و صاحبان برند',
    durationLabel: 'اشتراک ۲ ساله + نسخه اختصاصی',
    priceToman: 14800000,
    monthlyEquivalent: '۶۱۶,۰۰۰ تومان در ماه + دامنه و برند اختصاصی',
    creditCeilingText: 'پلتفرم اختصاصی با نام و لوگوی پخش شما + تسویه درهم/تتر',
    features: [
      'تحویل نسخه اختصاصی (White-Label) سامانه با نام و لوگوی تجاری شما',
      'خروجی فایل نصبی اندروید (APK/AAB) و وب‌اپلیکیشن iOS اختصاصی فروشگاه',
      'اتصال مستقیم به شبکه ویزیتورهای پورسانتی سراسر ایران و دبی',
    ],
  },
];

export function calculateProductPrices(product: ProductItem, rates: MarketRates) {
  const rateValue = rates[product.baseCurrency] || rates.USD;
  // Round to nearest 10,000 Toman for clean market pricing
  const rawWholesaleToman = product.baseWholesaleForeign * rateValue;
  const wholesaleToman = Math.round(rawWholesaleToman / 10000) * 10000;

  const rawRetailToman =
    wholesaleToman * (1 + product.retailMarkupPercent / 100) + product.hamtaFeeToman;
  const retailToman = Math.round(rawRetailToman / 10000) * 10000;

  const partnerProfitPerUnit = retailToman - wholesaleToman;

  return {
    rateValue,
    wholesaleToman,
    retailToman,
    partnerProfitPerUnit,
  };
}

export function formatToman(amount: number): string {
  return new Intl.NumberFormat('fa-IR').format(Math.round(amount));
}

export function formatForeign(amount: number, currency: CurrencyCode): string {
  const formatted = new Intl.NumberFormat('en-US').format(amount);
  switch (currency) {
    case 'USD':
      return `$${formatted} USD`;
    case 'AED':
      return `${formatted} AED (درهم)`;
    case 'CNY':
      return `¥${formatted} CNY (یوان)`;
    case 'USDT':
      return `${formatted} USDT`;
  }
}
