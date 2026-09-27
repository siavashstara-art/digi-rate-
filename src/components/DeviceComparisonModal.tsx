import React, { useState, useMemo } from 'react';
import {
  X,
  Scale,
  Smartphone,
  Laptop,
  TrendingUp,
  Cpu,
  BatteryCharging,
  Camera,
  Award,
  Volume2,
  Send,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { MarketRates, formatToman } from '../data/mockData';

export interface PeerDeviceSpec {
  id: string;
  category: 'phone' | 'laptop_tablet';
  subTypeLabel: string;
  tierGroup: string;
  name: string;
  englishName: string;
  baseCurrency: 'AED' | 'USD';
  baseWholesaleForeign: number;
  retailMarkupPercent: number;
  hamtaFeeToman: number;
  processor: string;
  display: string;
  ramStorage: string;
  cameraOrGpu: string;
  batteryAndCharge: string;
  buildAndOrigin: string;
  // Market Demand & Resale Metrics
  marketDemandScore: number; // out of 100
  marketDemandLabel: string;
  resaleLiquidity: string; // e.g., "فروش فوری ۱۰ دقیقه‌ای در علاءالدین و چارسو"
  annualValueRetention: string; // e.g., "حفظ ۹۱٪ ارزش دلاری در سال"
  partsAvailability: string;
  buyerPersona: string;
  sellerProfitMarginNote: string;
}

export const PEER_DEVICES: PeerDeviceSpec[] = [
  // --- SMARTPHONES (PEER TIERS) ---
  {
    id: 'cmp-ip16pm',
    category: 'phone',
    subTypeLabel: 'گوشی پرچمدار اولترا',
    tierGroup: 'پرچمداران سوپرلوکس (Flagship Tier)',
    name: 'آیفون ۱۶ پرومکس (iPhone 16 Pro Max 256GB ZAA)',
    englishName: 'Apple iPhone 16 Pro Max 256GB ZAA',
    baseCurrency: 'AED',
    baseWholesaleForeign: 4620,
    retailMarkupPercent: 6.5,
    hamtaFeeToman: 12800000,
    processor: 'Apple A18 Pro (۳ نانومتری نسل دوم - فوق‌سریع)',
    display: '6.9 اینچ Super Retina XDR OLED · 120Hz ProMotion',
    ramStorage: '256GB NVMe · 8GB LPDDR5X',
    cameraOrGpu: '۴۸ مگاپیکسل Fusion + ۴۸ اولتراواید + زوم ۵ برابری تله‌فوتو · فیلم‌برداری 4K 120fps ProRes',
    batteryAndCharge: '۴۶۸۵ میلی‌آمپر · شارژ مگ‌سیف ۲۵ وات و شارژ سریع ۴۵ وات',
    buildAndOrigin: 'فریم تیتانیوم گرید ۵ · پارت نامبر ZAA دو سیم‌کارت نات‌اکتیو',
    marketDemandScore: 98,
    marketDemandLabel: 'اقبال عمومی فوق‌العاده بالا (رتبه ۱ تقاضای سرمایه‌ای و پرستیژی)',
    resaleLiquidity: 'نقدشوندگی آنی (معاوضه و خرید نقدی در کمتر از ۵ دقیقه در کل بازار کشور)',
    annualValueRetention: 'حفظ ۹۲٪ ارزش دلاری سالانه (کمترین افت قیمت دست‌دوم)',
    partsAvailability: 'قطعات روکاری اصلی (LCD و باتری) در دبی و علاءالدین کاملاً موجود',
    buyerPersona: 'مدیران، تولیدکنندگان محتوا، بلاگرها و خریداران سرمایه‌ای',
    sellerProfitMarginNote: 'گردش مالی بسیار سریع + تقاضای بسیار بالا در طرح تعویض (Trade-In)',
  },
  {
    id: 'cmp-s24u',
    category: 'phone',
    subTypeLabel: 'گوشی پرچمدار اولترا',
    tierGroup: 'پرچمداران سوپرلوکس (Flagship Tier)',
    name: 'سامسونگ گلکسی S24 Ultra 5G (512GB پک ویتنام)',
    englishName: 'Samsung Galaxy S24 Ultra 512GB/12GB Vietnam',
    baseCurrency: 'AED',
    baseWholesaleForeign: 3780,
    retailMarkupPercent: 5.8,
    hamtaFeeToman: 4200000,
    processor: 'Snapdragon 8 Gen 3 for Galaxy + هوش مصنوعی Galaxy AI',
    display: '6.8 اینچ Dynamic LTPO AMOLED 2X · ضد بازتاب نور Gorilla Armor · قلم S-Pen',
    ramStorage: '512GB UFS 4.0 · 12GB RAM',
    cameraOrGpu: '۲۰۰ مگاپیکسل اصلی + ۵۰ مگاپیکسل پریسکوپ ۵ برابر + زوم ۱۰۰ برابری Space Zoom',
    batteryAndCharge: '۵۰۰۰ میلی‌آمپر · شارژ سوپرفست ۴۵ وات',
    buildAndOrigin: 'فریم تیتانیوم · پک اصلی ساخت ویتنام با کد همتا روی جعبه',
    marketDemandScore: 95,
    marketDemandLabel: 'اقبال عمومی بسیار بالا (پرفروش‌ترین پرچمدار اندرویدی ایران و دبی)',
    resaleLiquidity: 'نقدشوندگی عالی در بازار چارسو، علاءالدین و مراکز استان‌ها',
    annualValueRetention: 'حفظ ۸۶٪ ارزش دلاری سالانه',
    partsAvailability: 'ال‌سی‌دی و باتری اورجینال شرکتی با کد فنی اصلی به وفور موجود',
    buyerPersona: 'مهندسان، تریدرها، مدیران اجرایی و علاقه‌مندان عکاسی زوم و قلم S-Pen',
    sellerProfitMarginNote: 'حاشیه سود عالی برای موبایل‌فروش در فروش اقساطی با چک صیادی',
  },
  {
    id: 'cmp-14tpro',
    category: 'phone',
    subTypeLabel: 'قاتل پرچمدار هم‌تراز',
    tierGroup: 'قاتلان پرچمدار و میان‌رده بالا (Upper Mid-Tier)',
    name: 'شیائومی Xiaomi 14T Pro 5G (512GB رم 12GB گلوبال)',
    englishName: 'Xiaomi 14T Pro 512GB/12GB Leica Global',
    baseCurrency: 'USD',
    baseWholesaleForeign: 595,
    retailMarkupPercent: 6.2,
    hamtaFeeToman: 2450000,
    processor: 'MediaTek Dimensity 9300+ (۴ نانومتری پرچمدار گیمینگ)',
    display: '6.67 اینچ AMOLED · 144Hz · روشنایی ۴۰۰۰ نیت Dolby Vision',
    ramStorage: '512GB UFS 4.0 · 12GB LPDDR5X',
    cameraOrGpu: 'سه دوربین ۵۰ مگاپیکسلی با لنز اورجینال Leica Summilux و سنسور Light Fusion 900',
    batteryAndCharge: '۵۰۰۰ میلی‌آمپر · همراه شارژر ۱۲۰ وات اصلی داخل جعبه (شارژ کامل در ۱۹ دقیقه)',
    buildAndOrigin: 'فریم آلومینیوم مقاوم IP68 · پک گلوبال اصلی با شارژر کامل',
    marketDemandScore: 93,
    marketDemandLabel: 'اقبال انفجاری در بین جوانان، گیمرها و خریداران دنبال ارزش خرید بالا',
    resaleLiquidity: 'فروش بسیار سریع در ویترین مغازه به دلیل وجود شارژر ۱۲۰ وات اصلی در جعبه',
    annualValueRetention: 'حفظ ۸۳٪ ارزش دلاری سالانه',
    partsAvailability: 'قطعات شرکتی و گارانتی ۱۸ ماهه رسمی کاملاً در دسترس',
    buyerPersona: 'گیمرهای حرفه‌ای، عکاسان موبایل و خریداران هوشمند با بودجه متوسط',
    sellerProfitMarginNote: 'پرفروش‌ترین گوشی در طرح اقساط ۶ ماهه چک صیادی برای مغازه‌داران',
  },
  {
    id: 'cmp-s24fe',
    category: 'phone',
    subTypeLabel: 'قاتل پرچمدار هم‌تراز',
    tierGroup: 'قاتلان پرچمدار و میان‌رده بالا (Upper Mid-Tier)',
    name: 'سامسونگ Galaxy S24 FE 5G (256GB رم 8GB پک ویتنام)',
    englishName: 'Samsung Galaxy S24 FE 256GB/8GB Vietnam',
    baseCurrency: 'USD',
    baseWholesaleForeign: 540,
    retailMarkupPercent: 6.0,
    hamtaFeeToman: 2200000,
    processor: 'Exynos 2400e ده هسته‌ای (مجهز به تمامی قابلیت‌های Galaxy AI)',
    display: '6.7 اینچ Dynamic AMOLED 2X · 120Hz · محافظ Gorilla Glass Victus+',
    ramStorage: '256GB · 8GB RAM',
    cameraOrGpu: '۵۰ مگاپیکسل اصلی با لرزشگیر اپتیکال + زوم اپتیکال ۳ برابری تله‌فوتو',
    batteryAndCharge: '۴۷۰۰ میلی‌آمپر · شارژ ۲۵ وات و شارژ بی‌سیم',
    buildAndOrigin: 'استاندارد ضدآب IP68 · ساخت ویتنام · ۷ سال آپدیت رسمی اندروید',
    marketDemandScore: 96,
    marketDemandLabel: 'اقبال عمومی بی‌رقیب در خانواده‌های ایرانی (محبوب‌ترین گوشی ویترین)',
    resaleLiquidity: 'بسیار خوش‌فروش در بازار دست‌دوم (معادل سکه نقد در ویترین موبایل‌فروشی)',
    annualValueRetention: 'حفظ ۸۸٪ ارزش دلاری سالانه',
    partsAvailability: 'تمامی قطعات، گلس و قاب در تمام شهرهای ایران ۱۰۰٪ موجود',
    buyerPersona: 'کارمندان، دانشجویان، خانواده‌ها و طرفداران برند معتبر سامسونگ',
    sellerProfitMarginNote: 'فروش تضمینی روزانه + فروش جانبی (کلگی شارژر ۲۵ وات و قاب) همراه دستگاه',
  },

  // --- LAPTOPS, NOTEBOOKS & TABLETS (PEER TIERS) ---
  {
    id: 'cmp-mac-m3-15',
    category: 'laptop_tablet',
    subTypeLabel: 'لپ‌تاپ / اولترابوک پرچمدار',
    tierGroup: 'لپ‌تاپ‌ها و نوت‌بوک‌های حرفه‌ای (Laptops & Notebooks)',
    name: 'مک‌بوک ایر ۱۵ اینچ اپل (MacBook Air 15" M3 16GB/512GB)',
    englishName: 'Apple MacBook Air 15-inch M3 16GB/512GB LLA',
    baseCurrency: 'USD',
    baseWholesaleForeign: 1290,
    retailMarkupPercent: 6.5,
    hamtaFeeToman: 0,
    processor: 'Apple M3 Chip (8-Core CPU / 10-Core GPU / 16-Core Neural Engine)',
    display: '15.3 اینچ Liquid Retina IPS · روشنایی ۵۰۰ نیت · طیف رنگی P3',
    ramStorage: '16GB Unified Memory · 512GB SSD فوق‌سریع',
    cameraOrGpu: 'گرافیک ۱۰ هسته‌ای با رهگیری پرتو سخت‌افزاری + وب‌کم 1080p و ۶ اسپیکر Spatial Audio',
    batteryAndCharge: '۱۸ ساعت شارژدهی واقعی مداوم · شارژ مگ‌سیف ۳',
    buildAndOrigin: 'بدنه یکپارچه آلومینیومی ۱.۵۱ کیلوگرم · پارت نامبر LLA آمریکا',
    marketDemandScore: 97,
    marketDemandLabel: 'اقبال عمومی فوق‌العاده در بین برنامه‌نویسان، تریدرها و مدیران',
    resaleLiquidity: 'نقدشوندگی درجه یک در پاساژ چارسو، پایتخت و بازار ولیعصر',
    annualValueRetention: 'حفظ ۹۰٪ ارزش دلاری سالانه (بالاترین حفظ سرمایه در بین لپ‌تاپ‌ها)',
    partsAvailability: 'گارانتی ۱۸ ماهه معتبر شرکتی + قطعات اصلی در دبی و تهران',
    buyerPersona: 'برنامه‌نویسان، تریدرهای بازار مالی، طراحان و دانشجویان ارشد/دکتری',
    sellerProfitMarginNote: 'حاشیه سود ریالی بالا در هر فاکتور + ریسک خرابی نزدیک به صفر',
  },
  {
    id: 'cmp-asus-rog-g16',
    category: 'laptop_tablet',
    subTypeLabel: 'لپ‌تاپ گیمینگ و مهندسی هم‌تراز',
    tierGroup: 'لپ‌تاپ‌ها و نوت‌بوک‌های حرفه‌ای (Laptops & Notebooks)',
    name: 'لپ‌تاپ ایسوس ROG Zephyrus G16 (Core i9 / RTX 4070 / 16GB / 1TB)',
    englishName: 'ASUS ROG Zephyrus G16 GU605 RTX 4070 OLED',
    baseCurrency: 'USD',
    baseWholesaleForeign: 1380,
    retailMarkupPercent: 6.8,
    hamtaFeeToman: 0,
    processor: 'Intel Core Ultra 9 185H / Core i9 (۱۶ هسته‌ای ویژه پردازش سنگین و AI)',
    display: '16 اینچ ROG Nebula OLED 2.5K · نرخ نوسازی 240Hz · 0.2ms G-Sync',
    ramStorage: '16GB LPDDR5X · 1TB PCIe 4.0 NVMe SSD',
    cameraOrGpu: 'کارت گرافیک مجزا NVIDIA GeForce RTX 4070 8GB GDDR6 (اجرای روان تمام نرم‌افزارهای 3D)',
    batteryAndCharge: '۹۰ وات‌ساعت · آداپتور ۲۰۰ وات فست‌شارژ + پشتیبانی از Type-C PD',
    buildAndOrigin: 'شاسی آلومینیوم CNC باریک ۱.۸۵ کیلوگرم · پک اصلی گلوبال',
    marketDemandScore: 94,
    marketDemandLabel: 'محبوب‌ترین لپ‌تاپ ویندوزی ایران برای مهندسان معماری، هوش مصنوعی و گیمرها',
    resaleLiquidity: 'تقاضای بسیار بالا در بازار لپ‌تاپ ولیعصر و شهرستان‌ها',
    annualValueRetention: 'حفظ ۸۵٪ ارزش دلاری سالانه',
    partsAvailability: 'گارانتی ۱۸ ماهه اصلی شرکتی (سازگار/حامی/ماتریس)',
    buyerPersona: 'مهندسان عمران/معماری (3ds Max / Revit)، تدوین‌گران ویدیو و گیمرهای حرفه‌ای',
    sellerProfitMarginNote: 'مناسب‌ترین گزینه برای فروش اقساطی ۱۲ ماهه چک صیادی با سود عالی',
  },
  {
    id: 'cmp-ipad-pro-m4',
    category: 'laptop_tablet',
    subTypeLabel: 'تبلت پرچمدار جایگزین لپ‌تاپ',
    tierGroup: 'تبلت‌های تخصصی و نوت‌بوک‌های لمسی (Tablets & 2-in-1)',
    name: 'تبلت اپل iPad Pro 13-inch M4 (256GB Wi-Fi OLED)',
    englishName: 'Apple iPad Pro 13" M4 Tandem OLED 256GB LLA',
    baseCurrency: 'AED',
    baseWholesaleForeign: 4450,
    retailMarkupPercent: 6.5,
    hamtaFeeToman: 0,
    processor: 'پردازنده فوق‌پیشرفته Apple M4 (قوی‌تر از بسیاری از لپ‌تاپ‌های بازار)',
    display: '13 اینچ Ultra Retina XDR (دو لایه Tandem OLED) · 120Hz ProMotion',
    ramStorage: '256GB · 8GB RAM · پشتیبانی از Apple Pencil Pro و Magic Keyboard',
    cameraOrGpu: 'گرافیک ۱۰ هسته‌ای M4 + اسکنر سه بعدی LiDAR و چهار اسپیکر استودیویی',
    batteryAndCharge: '۱۰ ساعت کار مداوم سنگین · درگاه Thunderbolt / USB 4',
    buildAndOrigin: 'ضخامت شگفت‌انگیز ۵.۱ میلی‌متر (باریک‌ترین محصول تاریخ اپل) · پارت LLA',
    marketDemandScore: 92,
    marketDemandLabel: 'انتخاب اول طراحان گرافیک، پزشکان، معماران و تریدرهای حرفه‌ای',
    resaleLiquidity: 'بسیار خوش‌فروش و نقدشونده در بازار تهران و مراکز استان‌ها',
    annualValueRetention: 'حفظ ۸۹٪ ارزش دلاری سالانه',
    partsAvailability: 'پک پلمپ اصلی دبی با ۱۸ ماه گارانتی شرکتی',
    buyerPersona: 'طراحان دیجیتال، پزشکان، اساتید دانشگاه و مدیران در سفر',
    sellerProfitMarginNote: 'فروش همزمان قلم Apple Pencil Pro و کیبورد مگنتی سود فاکتور را ۲ برابر می‌کند',
  },
  {
    id: 'cmp-tab-s9-ultra',
    category: 'laptop_tablet',
    subTypeLabel: 'تبلت پرچمدار جایگزین لپ‌تاپ',
    tierGroup: 'تبلت‌های تخصصی و نوت‌بوک‌های لمسی (Tablets & 2-in-1)',
    name: 'تبلت سامسونگ Galaxy Tab S9 Ultra 5G (512GB رم 12GB با قلم S-Pen)',
    englishName: 'Samsung Galaxy Tab S9 Ultra 14.6" 512GB 5G + S-Pen',
    baseCurrency: 'AED',
    baseWholesaleForeign: 3890,
    retailMarkupPercent: 6.5,
    hamtaFeeToman: 1800000,
    processor: 'Snapdragon 8 Gen 2 for Galaxy + محیط دسکتاپ Samsung DeX',
    display: '14.6 اینچ غول‌پیکر Dynamic AMOLED 2X · 120Hz · ضدآب IP68',
    ramStorage: '512GB · 12GB RAM · درگاه کارت حافظه MicroSD تا ۱ ترابایت',
    cameraOrGpu: 'دو دوربین جلو و عقب ۱۳+۸ مگاپیکسل + قلم اورجینال S-Pen رایگان داخل جعبه',
    batteryAndCharge: '۱۱۲۰۰ میلی‌آمپر · شارژ سریع ۴۵ وات',
    buildAndOrigin: 'بدنه Armor Aluminum ضدآب و ضدگردوغبار IP68 · سیم‌کارت‌خور 5G با کد همتا',
    marketDemandScore: 94,
    marketDemandLabel: 'محبوب‌ترین تبلت سیم‌کارت‌خور بازار ایران به دلیل قلم رایگان و نمایشگر ۱۴.۶ اینچ',
    resaleLiquidity: 'تقاضای بسیار بالا در بین تریدرها (نمایش چارت کامل) و دانشجویان',
    annualValueRetention: 'حفظ ۸۶٪ ارزش دلاری سالانه',
    partsAvailability: 'گارانتی ۱۸ ماهه رسمی شرکتی + کد فعال‌سازی همتا',
    buyerPersona: 'تریدرهای بورس/کریپتو، دانشجویان پزشکی، مهندسان و مدرسان آنلاین',
    sellerProfitMarginNote: 'داشتن قلم رایگان داخل جعبه و سیم‌کارت 5G بستن فاکتور برای مشتری را بسیار آسان می‌کند',
  },
];

interface DeviceComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  rates: MarketRates;
  onSpeakText: (text: string) => void;
}

export const DeviceComparisonModal: React.FC<DeviceComparisonModalProps> = ({
  isOpen,
  onClose,
  rates,
  onSpeakText,
}) => {
  const [categoryTab, setCategoryTab] = useState<'phone' | 'laptop_tablet'>('phone');
  const [deviceAId, setDeviceAId] = useState<string>('cmp-ip16pm');
  const [deviceBId, setDeviceBId] = useState<string>('cmp-s24u');

  const categoryDevices = useMemo(
    () => PEER_DEVICES.filter((d) => d.category === categoryTab),
    [categoryTab]
  );

  const deviceA = useMemo(
    () => categoryDevices.find((d) => d.id === deviceAId) || categoryDevices[0],
    [categoryDevices, deviceAId]
  );

  const deviceB = useMemo(
    () =>
      categoryDevices.find((d) => d.id === deviceBId) ||
      categoryDevices[1] ||
      categoryDevices[0],
    [categoryDevices, deviceBId]
  );

  const calcDeviceToman = (dev: PeerDeviceSpec) => {
    const rate = dev.baseCurrency === 'AED' ? rates.AED : rates.USD;
    const wholesale = Math.round((dev.baseWholesaleForeign * rate) / 10000) * 10000;
    const retail =
      Math.round(
        (wholesale * (1 + dev.retailMarkupPercent / 100) + dev.hamtaFeeToman) / 10000
      ) * 10000;
    const profit = retail - wholesale;
    return { wholesale, retail, profit };
  };

  const priceA = useMemo(() => calcDeviceToman(deviceA), [deviceA, rates]);
  const priceB = useMemo(() => calcDeviceToman(deviceB), [deviceB, rates]);

  if (!isOpen) return null;

  const handleSelectCategory = (cat: 'phone' | 'laptop_tablet') => {
    setCategoryTab(cat);
    if (cat === 'phone') {
      setDeviceAId('cmp-ip16pm');
      setDeviceBId('cmp-s24u');
    } else {
      setDeviceAId('cmp-mac-m3-15');
      setDeviceBId('cmp-asus-rog-g16');
    }
  };

  const handleQuickPreset = (id1: string, id2: string, cat: 'phone' | 'laptop_tablet') => {
    setCategoryTab(cat);
    setDeviceAId(id1);
    setDeviceBId(id2);
  };

  const handleReadComparisonAloud = () => {
    const speech = `مقایسه تخصصی هم‌تراز بین ${deviceA.name} و ${deviceB.name}. قیمت تک‌فروشی ${deviceA.name} معادل ${priceA.retail} تومان با امتیاز اقبال بازار ${deviceA.marketDemandScore} از ۱۰۰ می‌باشد. در مقابل، قیمت تک‌فروشی ${deviceB.name} معادل ${priceB.retail} تومان با امتیاز اقبال بازار ${deviceB.marketDemandScore} از ۱۰۰ است. ${deviceA.annualValueRetention} و ${deviceB.annualValueRetention}.`;
    onSpeakText(speech);
  };

  const handleSendComparisonWhatsapp = () => {
    const text = [
      `⚖️ *جدول مقایسه تخصصی و اقبال بازار (Afrina DigiRate VIP)*`,
      `🔹 *دستگاه اول:* ${deviceA.name}`,
      `   - پردازنده: ${deviceA.processor}`,
      `   - نمایشگر: ${deviceA.display}`,
      `   - قیمت مصرف‌کننده امروز: ${formatToman(priceA.retail)} تومان`,
      `   - اقبال بازار و نقدشوندگی: ${deviceA.marketDemandScore}% (${deviceA.annualValueRetention})`,
      `---`,
      `🔸 *دستگاه دوم:* ${deviceB.name}`,
      `   - پردازنده: ${deviceB.processor}`,
      `   - نمایشگر: ${deviceB.display}`,
      `   - قیمت مصرف‌کننده امروز: ${formatToman(priceB.retail)} تومان`,
      `   - اقبال بازار و نقدشوندگی: ${deviceB.marketDemandScore}% (${deviceB.annualValueRetention})`,
      `---`,
      `💡 *مخاطب هدف:*`,
      `• ${deviceA.name}: ${deviceA.buyerPersona}`,
      `• ${deviceB.name}: ${deviceB.buyerPersona}`,
    ].join('\n');

    window.open(
      `https://wa.me/989120000000?text=${encodeURIComponent(text)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-6xl rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden my-8 text-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-emerald-600 via-sky-600 to-indigo-600 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-xs">
              <Scale className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg font-black">
                موتور مقایسه تخصصی هم‌رده و هم‌تراز (گوشی موبایل · لپ‌تاپ · نوت‌بوک · تبلت)
              </h2>
              <p className="text-xs text-white/90 mt-0.5">
                مقایسه ۳ بعدی: ۱. مشخصات فنی سخت‌افزار · ۲. قیمت لحظه‌ای و سود همکار · ۳. اقبال عمومی بازار و نقدشوندگی دست‌دوم
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReadComparisonAloud}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-bold cursor-pointer"
              title="خوانش صوتی جدول مقایسه ویژه نابینایان"
            >
              <Volume2 className="w-4 h-4" />
              <span>خوانش صوتی مقایسه</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Switch Tabs */}
        <div className="px-6 pt-4 bg-slate-50 border-b border-slate-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-4">
            <button
              onClick={() => handleSelectCategory('phone')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-black transition-all cursor-pointer border ${
                categoryTab === 'phone'
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>📱 مقایسه تخصصی گوشی‌های هم‌رده و هم‌تراز (پرچمدار و قاتل پرچمدار)</span>
            </button>
            <button
              onClick={() => handleSelectCategory('laptop_tablet')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-black transition-all cursor-pointer border ${
                categoryTab === 'laptop_tablet'
                  ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <Laptop className="w-4 h-4" />
              <span>💻 مقایسه تخصصی لپ‌تاپ، نوت‌بوک و تبلت‌های هم‌تراز</span>
            </button>
          </div>

          {/* 1-Click Peer Battle Presets */}
          <div className="flex flex-wrap items-center gap-2 pb-3 text-xs">
            <span className="font-bold text-slate-600 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>مقایسه‌های پربازدید هم‌تراز بازار:</span>
            </span>
            <button
              onClick={() => handleQuickPreset('cmp-ip16pm', 'cmp-s24u', 'phone')}
              className="px-3 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 font-bold cursor-pointer"
            >
              iPhone 16 Pro Max در برابر S24 Ultra
            </button>
            <button
              onClick={() => handleQuickPreset('cmp-14tpro', 'cmp-s24fe', 'phone')}
              className="px-3 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 font-bold cursor-pointer"
            >
              Xiaomi 14T Pro در برابر Galaxy S24 FE
            </button>
            <button
              onClick={() => handleQuickPreset('cmp-mac-m3-15', 'cmp-asus-rog-g16', 'laptop_tablet')}
              className="px-3 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 font-bold cursor-pointer"
            >
              MacBook Air 15" M3 در برابر ASUS ROG Zephyrus G16
            </button>
            <button
              onClick={() => handleQuickPreset('cmp-ipad-pro-m4', 'cmp-tab-s9-ultra', 'laptop_tablet')}
              className="px-3 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold cursor-pointer"
            >
              iPad Pro 13" M4 در برابر Galaxy Tab S9 Ultra 5G
            </button>
          </div>
        </div>

        {/* Main Comparison Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Device Selectors Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-emerald-50/70 border-2 border-emerald-300">
              <label className="block text-xs font-extrabold text-emerald-900 mb-1.5">
                انتخاب دستگاه اول (سمت راست مقایسه):
              </label>
              <select
                value={deviceA.id}
                onChange={(e) => setDeviceAId(e.target.value)}
                className="w-full rounded-xl bg-white border border-emerald-300 px-3.5 py-2.5 text-sm font-bold text-slate-900"
              >
                {categoryDevices.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} — ({d.tierGroup})
                  </option>
                ))}
              </select>
            </div>

            <div className="p-4 rounded-xl bg-indigo-50/70 border-2 border-indigo-300">
              <label className="block text-xs font-extrabold text-indigo-900 mb-1.5">
                انتخاب دستگاه دوم هم‌تراز (سمت چپ مقایسه):
              </label>
              <select
                value={deviceB.id}
                onChange={(e) => setDeviceBId(e.target.value)}
                className="w-full rounded-xl bg-white border border-indigo-300 px-3.5 py-2.5 text-sm font-bold text-slate-900"
              >
                {categoryDevices.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} — ({d.tierGroup})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Pillar 1: Live Price & Partner Profit Comparison */}
          <div className="rounded-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex items-center gap-2 font-black text-sm text-slate-900">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>۱. مقایسه لحظه‌ای قیمت ارزی، کف همکار و قیمت مصرف‌کننده (به نرخ امروز)</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-slate-200 bg-white">
              {/* Price A */}
              <div className="p-4 space-y-2.5">
                <div className="text-xs font-bold text-emerald-800">{deviceA.name}</div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">قیمت پایه ارزی دبی/چین:</span>
                  <span className="font-mono-num font-black text-sky-700">
                    {deviceA.baseWholesaleForeign} {deviceA.baseCurrency}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">قیمت کف همکار (عمده):</span>
                  <span className="font-mono-num font-bold text-slate-900">
                    {formatToman(priceA.wholesale)} تومان
                  </span>
                </div>
                <div className="flex justify-between text-sm bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                  <span className="font-bold text-emerald-950">قیمت تک‌فروشی مصرف‌کننده:</span>
                  <span className="font-mono-num font-black text-emerald-700">
                    {formatToman(priceA.retail)} تومان
                  </span>
                </div>
                <div className="text-[11px] text-amber-800 font-bold">
                  💰 حاشیه سود همکار در هر دستگاه: +{formatToman(priceA.profit)} تومان ({deviceA.sellerProfitMarginNote})
                </div>
              </div>

              {/* Price B */}
              <div className="p-4 space-y-2.5">
                <div className="text-xs font-bold text-indigo-800">{deviceB.name}</div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">قیمت پایه ارزی دبی/چین:</span>
                  <span className="font-mono-num font-black text-sky-700">
                    {deviceB.baseWholesaleForeign} {deviceB.baseCurrency}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">قیمت کف همکار (عمده):</span>
                  <span className="font-mono-num font-bold text-slate-900">
                    {formatToman(priceB.wholesale)} تومان
                  </span>
                </div>
                <div className="flex justify-between text-sm bg-indigo-50 p-2.5 rounded-lg border border-indigo-200">
                  <span className="font-bold text-indigo-950">قیمت تک‌فروشی مصرف‌کننده:</span>
                  <span className="font-mono-num font-black text-indigo-700">
                    {formatToman(priceB.retail)} تومان
                  </span>
                </div>
                <div className="text-[11px] text-amber-800 font-bold">
                  💰 حاشیه سود همکار در هر دستگاه: +{formatToman(priceB.profit)} تومان ({deviceB.sellerProfitMarginNote})
                </div>
              </div>
            </div>
          </div>

          {/* Pillar 2: Market Demand, Public Popularity & Second-Hand Resale Liquidity */}
          <div className="rounded-2xl border-2 border-amber-300 overflow-hidden bg-amber-50/30">
            <div className="bg-amber-100/80 px-4 py-3 border-b border-amber-200 flex items-center gap-2 font-black text-sm text-slate-900">
              <Award className="w-4 h-4 text-amber-700" />
              <span>
                ۲. مقایسه اقبال عمومی بازار، سرعت نقدشوندگی دست‌دوم و حفظ ارزش سرمایه دلاری
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-amber-200 bg-white">
              {/* Demand A */}
              <div className="p-4 space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-extrabold mb-1">
                    <span className="text-slate-700">امتیاز اقبال عمومی بازار ایران و دبی:</span>
                    <span className="text-emerald-700 font-mono-num">
                      {deviceA.marketDemandScore} از ۱۰۰
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${deviceA.marketDemandScore}%` }}
                    />
                  </div>
                  <p className="text-xs font-bold text-slate-800 mt-1.5">
                    {deviceA.marketDemandLabel}
                  </p>
                </div>

                <div className="space-y-1.5 text-xs text-slate-700 border-t border-slate-100 pt-2">
                  <div>
                    <strong className="text-slate-900">⚡ سرعت نقدشوندگی دست‌دوم: </strong>
                    {deviceA.resaleLiquidity}
                  </div>
                  <div>
                    <strong className="text-slate-900">💎 حفظ ارزش دلاری سالانه: </strong>
                    <span className="text-emerald-700 font-bold">{deviceA.annualValueRetention}</span>
                  </div>
                  <div>
                    <strong className="text-slate-900">🔧 وضعیت قطعات و گارانتی: </strong>
                    {deviceA.partsAvailability}
                  </div>
                  <div>
                    <strong className="text-slate-900">👤 مناسب‌ترین خریدار: </strong>
                    {deviceA.buyerPersona}
                  </div>
                </div>
              </div>

              {/* Demand B */}
              <div className="p-4 space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-extrabold mb-1">
                    <span className="text-slate-700">امتیاز اقبال عمومی بازار ایران و دبی:</span>
                    <span className="text-indigo-700 font-mono-num">
                      {deviceB.marketDemandScore} از ۱۰۰
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{ width: `${deviceB.marketDemandScore}%` }}
                    />
                  </div>
                  <p className="text-xs font-bold text-slate-800 mt-1.5">
                    {deviceB.marketDemandLabel}
                  </p>
                </div>

                <div className="space-y-1.5 text-xs text-slate-700 border-t border-slate-100 pt-2">
                  <div>
                    <strong className="text-slate-900">⚡ سرعت نقدشوندگی دست‌دوم: </strong>
                    {deviceB.resaleLiquidity}
                  </div>
                  <div>
                    <strong className="text-slate-900">💎 حفظ ارزش دلاری سالانه: </strong>
                    <span className="text-indigo-700 font-bold">{deviceB.annualValueRetention}</span>
                  </div>
                  <div>
                    <strong className="text-slate-900">🔧 وضعیت قطعات و گارانتی: </strong>
                    {deviceB.partsAvailability}
                  </div>
                  <div>
                    <strong className="text-slate-900">👤 مناسب‌ترین خریدار: </strong>
                    {deviceB.buyerPersona}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pillar 3: Technical Hardware Specification Matrix */}
          <div className="rounded-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex items-center gap-2 font-black text-sm text-slate-900">
              <Cpu className="w-4 h-4 text-indigo-600" />
              <span>۳. جدول مقایسه فنی و سخت‌افزاری دقیق</span>
            </div>
            <div className="divide-y divide-slate-200 bg-white text-xs">
              <div className="grid grid-cols-1 md:grid-cols-12 p-3.5 items-center gap-2">
                <div className="md:col-span-2 font-extrabold text-slate-700 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-sky-600" />
                  <span>پردازنده و چیپست:</span>
                </div>
                <div className="md:col-span-5 font-semibold text-slate-900 bg-emerald-50/50 p-2 rounded-lg">
                  {deviceA.processor}
                </div>
                <div className="md:col-span-5 font-semibold text-slate-900 bg-indigo-50/50 p-2 rounded-lg">
                  {deviceB.processor}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 p-3.5 items-center gap-2">
                <div className="md:col-span-2 font-extrabold text-slate-700 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span>صفحه‌نمایش:</span>
                </div>
                <div className="md:col-span-5 font-semibold text-slate-900 p-2">
                  {deviceA.display}
                </div>
                <div className="md:col-span-5 font-semibold text-slate-900 p-2">
                  {deviceB.display}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 p-3.5 items-center gap-2">
                <div className="md:col-span-2 font-extrabold text-slate-700 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-amber-600" />
                  <span>دوربین / گرافیک:</span>
                </div>
                <div className="md:col-span-5 font-semibold text-slate-900 bg-emerald-50/50 p-2 rounded-lg">
                  {deviceA.cameraOrGpu}
                </div>
                <div className="md:col-span-5 font-semibold text-slate-900 bg-indigo-50/50 p-2 rounded-lg">
                  {deviceB.cameraOrGpu}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 p-3.5 items-center gap-2">
                <div className="md:col-span-2 font-extrabold text-slate-700 flex items-center gap-1.5">
                  <BatteryCharging className="w-4 h-4 text-rose-600" />
                  <span>باتری و شارژر:</span>
                </div>
                <div className="md:col-span-5 font-semibold text-slate-900 p-2">
                  {deviceA.batteryAndCharge}
                </div>
                <div className="md:col-span-5 font-semibold text-slate-900 p-2">
                  {deviceB.batteryAndCharge}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 p-3.5 items-center gap-2">
                <div className="md:col-span-2 font-extrabold text-slate-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                  <span>بدنه و پارت‌نامبر:</span>
                </div>
                <div className="md:col-span-5 font-semibold text-slate-900 bg-emerald-50/50 p-2 rounded-lg">
                  {deviceA.buildAndOrigin}
                </div>
                <div className="md:col-span-5 font-semibold text-slate-900 bg-indigo-50/50 p-2 rounded-lg">
                  {deviceB.buildAndOrigin}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <p className="text-xs text-slate-500">
              💡 می‌توانید نتیجه این مقایسه فنی و قیمتی را با ۱ کلیک برای مشتری خود در واتساپ ارسال کنید تا تصمیم‌گیری خرید سریع‌تر انجام شود.
            </p>
            <button
              onClick={handleSendComparisonWhatsapp}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-md cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>ارسال جدول مقایسه تخصصی به واتساپ مشتری</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
