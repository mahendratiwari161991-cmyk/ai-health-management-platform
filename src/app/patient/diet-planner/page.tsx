'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Utensils,
  Download,
  AlertCircle,
  Apple,
  Check,
  Calendar,
  Layers,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface DayPlan {
  day: string;
  breakfast: string;
  midMorning: string;
  lunch: string;
  eveningSnack: string;
  dinner: string;
  calories: string;
  glycemicLoad: string;
}

const DEFAULT_7_DAY_PLAN: DayPlan[] = [
  {
    day: 'Monday',
    breakfast: '2 Oats and Methi (fenugreek) idlis with mint-coriander chutney & sambar (no added sugar)',
    midMorning: 'Handful of roasted chana + 5 soaked almonds',
    lunch: '2 Multigrain Rotis (wheat + ragi), 1 bowl Palak Dal, 1 bowl Bhindi Sabzi & cucumber salad',
    eveningSnack: '1 cup boiled sprouted moong with chopped tomatoes & lemon juice',
    dinner: '1 bowl Foxtail Millet Khichdi with mixed vegetables & 1 small bowl low-fat curd',
    calories: '1,550 kcal',
    glycemicLoad: 'Low',
  },
  {
    day: 'Tuesday',
    breakfast: 'Vegetable Poha with roasted peanuts, curry leaves & lemon juice',
    midMorning: '1 medium apple (with skin) or guava',
    lunch: '1 cup Brown Rice, 1 bowl Rajma (kidney beans) curry, sauteed French beans & carrot koshimbir',
    eveningSnack: 'Roasted Makhana (fox nuts) with turmeric and a pinch of black pepper',
    dinner: '2 Jowar Rotis with Lauki (bottle gourd) sabzi and Yellow Moong Dal',
    calories: '1,520 kcal',
    glycemicLoad: 'Low',
  },
  {
    day: 'Wednesday',
    breakfast: 'Besan & Moong Dal Chilla with finely chopped spinach, served with mint chutney',
    midMorning: '1 glass buttermilk (chaas) with roasted cumin powder & mint',
    lunch: '2 Wheat-Bran Rotis, 1 bowl Paneer Bhurji (with capsicum & tomato) & green salad',
    eveningSnack: '1 cup Green Tea + 2 walnuts & 4 pumpkin seeds',
    dinner: '1 bowl vegetable barley soup + 1 small Bajra Roti with Methi Sabzi',
    calories: '1,490 kcal',
    glycemicLoad: 'Very Low',
  },
  {
    day: 'Thursday',
    breakfast: 'Vegetable Dalia (broken wheat) with green peas, carrots and beans',
    midMorning: 'Small bowl of pomegranate seeds (fiber rich)',
    lunch: '2 Multigrain Rotis, 1 bowl Chana Dal with pumpkin, and steamed beetroot-cucumber salad',
    eveningSnack: 'Boiled egg white (or grilled tofu cubes) seasoned with chaat masala',
    dinner: 'Steamed vegetable stew with 1 bowl cooked Quinoa or 2 Bajra phulkas',
    calories: '1,540 kcal',
    glycemicLoad: 'Low',
  },
  {
    day: 'Friday',
    breakfast: 'Ragi Porridge (cooked in unsweetened almond/skim milk) topped with chia seeds',
    midMorning: 'Sliced cucumber and tomato with rock salt and lemon',
    lunch: '2 Jowar Rotis, 1 bowl Tofu or Soya chunk curry, and Karela (bitter gourd) stir fry',
    eveningSnack: 'Roasted murmura (puffed rice) bhel with diced onions, tomatoes & coriander',
    dinner: '1 bowl Moong Dal soup with 1 cup cooked Brown Rice and boiled green veggies',
    calories: '1,480 kcal',
    glycemicLoad: 'Low',
  },
  {
    day: 'Saturday',
    breakfast: 'Vegetable Upma prepared with little millet / sooji & generous green veggies',
    midMorning: '1 small pear or slice of papaya',
    lunch: '2 Bran Rotis, 1 bowl Baingan Bharta (roasted eggplant) & 1 bowl Masoor Dal',
    eveningSnack: '1 cup tender coconut water or lemon-mint infused water',
    dinner: '2 Multigrain Rotis, 1 bowl Dal Tadka with garlic, and sauteed Tindora (ivy gourd)',
    calories: '1,510 kcal',
    glycemicLoad: 'Low',
  },
  {
    day: 'Sunday',
    breakfast: '2 Plain Dosa with Flaxseed-coconut chutney & mixed vegetable sambar',
    midMorning: '5 soaked almonds + 1 cup warm cinnamon tea',
    lunch: '1 cup Foxtail Millet Pulao with mixed veggies and 1 bowl sprouted moong curry',
    eveningSnack: 'Roasted dry fruits & flaxseed trail mix (unsalted)',
    dinner: '1 bowl clear tomato-coriander soup + 2 Missi Rotis with Lauki Kofta (non-fried)',
    calories: '1,560 kcal',
    glycemicLoad: 'Low',
  },
];

export default function DietPlannerPage() {
  const [dietPlan] = useState<DayPlan[]>(DEFAULT_7_DAY_PLAN);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const selectedPlan = dietPlan[selectedDayIndex];

  // Download PDF Diet Plan
  const exportDietPlanPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('GlycoPulse 7-Day Diabetes & Hypertension Diet Plan', 14, 20);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text('Customized for: Arun Kumar (Type 2 Diabetes, Hypertension)', 14, 28);
    doc.text('Guidelines: Low Glycemic Index, Controlled Sodium, High Fiber Indian Meals', 14, 34);

    const tableData = dietPlan.map((d) => [
      d.day,
      d.breakfast,
      d.lunch,
      d.dinner,
      d.glycemicLoad,
    ]);

    autoTable(doc, {
      startY: 42,
      head: [['Day', 'Breakfast', 'Lunch', 'Dinner', 'Glycemic Index']],
      body: tableData,
      headStyles: { fillColor: [16, 185, 129] },
      alternateRowStyles: { fillColor: [240, 253, 244] },
      styles: { fontSize: 8 },
    });

    doc.save(`Diet_Plan_Arun_Kumar_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <Sparkles className="w-8 h-8 text-emerald-600" />
            AI-Powered 7-Day Indian Diet Planner
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Personalized meal plans built for glycemic balance, portion control, and sodium management.
          </p>
        </div>

        <button
          onClick={exportDietPlanPDF}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm shadow-xs transition-colors"
        >
          <Download className="w-4 h-4" />
          Download 7-Day Diet PDF
        </button>
      </div>

      {/* Clinical Disclaimer */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-900 flex items-start space-x-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Registered Dietitian Disclaimer:</span> This AI-generated 7-day meal plan is designed for general nutritional education, carbohydrate tracking, and lifestyle support. Individuals on insulin or specific anti-hypertensives should review any major dietary adjustments with their physician or clinical nutritionist.
        </div>
      </div>

      {/* Day Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {dietPlan.map((d, idx) => (
          <button
            key={d.day}
            onClick={() => setSelectedDayIndex(idx)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
              selectedDayIndex === idx
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {d.day}
          </button>
        ))}
      </div>

      {/* Selected Day Meal Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              {selectedPlan.day} Schedule
            </h2>
            <span className="text-xs text-slate-500">Optimized for stable glucose curve throughout the day</span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="px-3 py-1 rounded-full font-bold bg-slate-100 text-slate-700 border border-slate-200">
              Est. Energy: {selectedPlan.calories}
            </span>
            <span className="px-3 py-1 rounded-full font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Glycemic Load: {selectedPlan.glycemicLoad}
            </span>
          </div>
        </div>

        {/* Meal Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Breakfast */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-emerald-300 transition-all space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-emerald-700">Breakfast (8:00 AM - 9:00 AM)</span>
              <Utensils className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-sm font-semibold text-slate-900 leading-snug">{selectedPlan.breakfast}</p>
            <span className="text-[11px] text-slate-500 block">Focus: High fiber, moderate protein baseline</span>
          </div>

          {/* Mid-Morning */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-emerald-300 transition-all space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-amber-700">Mid-Morning Snack (11:00 AM)</span>
              <Apple className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-sm font-semibold text-slate-900 leading-snug">{selectedPlan.midMorning}</p>
            <span className="text-[11px] text-slate-500 block">Prevents mid-day hypoglycemia &amp; cravings</span>
          </div>

          {/* Lunch */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-emerald-300 transition-all space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-blue-700">Lunch (1:00 PM - 2:00 PM)</span>
              <Utensils className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-sm font-semibold text-slate-900 leading-snug">{selectedPlan.lunch}</p>
            <span className="text-[11px] text-slate-500 block">Focus: 50% vegetables/salad, 25% protein, 25% complex carbs</span>
          </div>

          {/* Evening Snack */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-emerald-300 transition-all space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-indigo-700">Evening Snack (5:00 PM)</span>
              <Apple className="w-4 h-4 text-indigo-600" />
            </div>
            <p className="text-sm font-semibold text-slate-900 leading-snug">{selectedPlan.eveningSnack}</p>
            <span className="text-[11px] text-slate-500 block">Antioxidants and slow-digesting healthy fats</span>
          </div>

          {/* Dinner */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-emerald-300 transition-all space-y-2 md:col-span-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-rose-700">Dinner (7:30 PM - 8:30 PM)</span>
              <Utensils className="w-4 h-4 text-rose-600" />
            </div>
            <p className="text-sm font-semibold text-slate-900 leading-snug">{selectedPlan.dinner}</p>
            <span className="text-[11px] text-slate-500 block">Light, easily digestible meal 2-3 hours before sleep to prevent dawn phenomenon spikes</span>
          </div>
        </div>
      </div>

      {/* Practical Indian Food Guidance Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Recommended Indian Foods vs Foods to Limit</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
            <h4 className="text-sm font-bold text-emerald-800 flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" />
              Foods That Support Blood Sugar &amp; BP Control
            </h4>
            <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
              <li><strong>Millets:</strong> Ragi, Bajra, Jowar, Foxtail millet (high soluble fiber).</li>
              <li><strong>Pulses &amp; Legumes:</strong> Moong dal, Masoor, Rajma, Chana, Sprouted beans.</li>
              <li><strong>Vegetables:</strong> Karela (bitter gourd), Methi, Palak, Bhindi, Bottle gourd (lauki).</li>
              <li><strong>Healthy Fats:</strong> Soaked almonds, walnuts, flaxseed powder, cold-pressed mustard/sesame oil in moderation.</li>
              <li><strong>Beverages:</strong> Cinnamon tea, methi water, unsweetened buttermilk (chaas).</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 space-y-2">
            <h4 className="text-sm font-bold text-rose-800 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              Foods &amp; Ingredients to Limit / Avoid
            </h4>
            <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
              <li><strong>Refined Carbs:</strong> Maida (refined flour), naan, white bread, polished white rice in large portions.</li>
              <li><strong>Sugary Items:</strong> Sweets (mithai), packaged fruit juices, sweetened soda, bakery pastries.</li>
              <li><strong>High Sodium (Hypertension risk):</strong> Commercial pickles (achaar), papad, salted chips, canned soups.</li>
              <li><strong>Fried Snacks:</strong> Samosa, kachori, pakodas (trans fats raise cardiovascular risk).</li>
              <li><strong>Heavy Red Meats:</strong> High saturated fat cuts that aggravate dyslipidemia.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
