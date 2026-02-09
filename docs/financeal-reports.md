<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Financial Reports Dashboard - FinTrack</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "primary": "#13ec5b",
                        "background-light": "#f6f8f6",
                        "background-dark": "#102216",
                    },
                    fontFamily: {
                        "display": ["Inter"]
                    },
                    borderRadius: {"DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px"},
                },
            },
        }
    </script>
<style>
        body { font-family: 'Inter', sans-serif; }
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .fill-primary { fill: #13ec5b; }
        .fill-secondary { fill: #3b82f6; }
    </style>
</head>
<body class="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen">
<div class="flex flex-col min-h-screen">
<!-- TopNavBar -->
<header class="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-10 py-3 sticky top-0 z-50">
<div class="flex items-center gap-8">
<div class="flex items-center gap-4 text-slate-900 dark:text-white">
<div class="size-6 bg-primary rounded-lg flex items-center justify-center">
<span class="material-symbols-outlined text-background-dark text-lg">account_balance_wallet</span>
</div>
<h2 class="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">FinTrack</h2>
</div>
<label class="flex flex-col min-w-40 h-10 max-w-64">
<div class="flex w-full flex-1 items-stretch rounded-lg h-full">
<div class="text-slate-400 flex border-none bg-slate-100 dark:bg-slate-800 items-center justify-center pl-4 rounded-l-lg" data-icon="search">
<span class="material-symbols-outlined text-xl">search</span>
</div>
<input class="form-input flex w-full min-w-0 flex-1 border-none bg-slate-100 dark:bg-slate-800 focus:ring-0 text-slate-900 dark:text-white h-full placeholder:text-slate-500 px-4 rounded-r-lg pl-2 text-sm" placeholder="Search data..."/>
</div>
</label>
</div>
<div class="flex flex-1 justify-end gap-8">
<div class="flex items-center gap-6">
<a class="text-slate-600 dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors" href="#">Dashboard</a>
<a class="text-slate-600 dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors" href="#">Transactions</a>
<a class="text-slate-600 dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors" href="#">Invoices</a>
<a class="text-primary text-sm font-bold border-b-2 border-primary py-4 -mb-4" href="#">Reports</a>
</div>
<div class="flex gap-2">
<button class="flex items-center justify-center rounded-lg size-10 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
<span class="material-symbols-outlined">notifications</span>
</button>
<button class="flex items-center justify-center rounded-lg size-10 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
<span class="material-symbols-outlined">settings</span>
</button>
</div>
<div class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-primary/20" data-alt="User avatar profile picture" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuAVgUPWJ_58PNE7HRJJazQpOiq4V58NaZ4c9uwcfR8yNGMX2AryVdqlV8_azLo8RzCpc-mbhhiXNrXPkPDINWAi7wCU9flxN4mbDZ7dGeMINB-17bxwTsAY6tHH35Kfo49H4NsyTWKMK0fivcDRVjEG1l44AFa9yJ0oK_cskvexxP7fAzOfsL2szEhWFCn7X2LBaGwdMDadvnfExNB4peZaA3pKODQzGhSCafjEXbiwOBjdZCKAL6Xg1A6tL-cAbZ677BmYIh-67kw");'></div>
</div>
</header>
<div class="flex flex-1">
<!-- SideNavBar -->
<aside class="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hidden lg:flex flex-col p-4 gap-4">
<div class="flex flex-col gap-1 px-2 py-2">
<h1 class="text-slate-900 dark:text-white text-base font-bold">Business Overview</h1>
<p class="text-slate-500 dark:text-slate-400 text-xs font-normal">Manage your small business</p>
</div>
<nav class="flex flex-col gap-1">
<a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all" href="#">
<span class="material-symbols-outlined text-xl">home</span>
<span class="text-sm font-medium">Home</span>
</a>
<a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all" href="#">
<span class="material-symbols-outlined text-xl">receipt_long</span>
<span class="text-sm font-medium">Transactions</span>
</a>
<a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all" href="#">
<span class="material-symbols-outlined text-xl">description</span>
<span class="text-sm font-medium">Invoices</span>
</a>
<a class="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary transition-all" href="#">
<span class="material-symbols-outlined text-xl font-bold">analytics</span>
<span class="text-sm font-bold">Reports</span>
</a>
<a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all" href="#">
<span class="material-symbols-outlined text-xl">payments</span>
<span class="text-sm font-medium">Expenses</span>
</a>
<a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all" href="#">
<span class="material-symbols-outlined text-xl">group</span>
<span class="text-sm font-medium">Customers</span>
</a>
</nav>
<div class="mt-auto p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
<p class="text-xs font-semibold text-slate-900 dark:text-white mb-2">PRO PLAN</p>
<p class="text-[10px] text-slate-500 dark:text-slate-400 mb-3">Unlimited invoices &amp; reports.</p>
<button class="w-full py-2 bg-primary text-slate-900 text-xs font-bold rounded-lg">Upgrade Now</button>
</div>
</aside>
<!-- Main Content -->
<main class="flex-1 overflow-y-auto">
<div class="max-w-[1200px] mx-auto p-6 lg:p-10 flex flex-col gap-8">
<!-- PageHeading -->
<div class="flex flex-wrap items-center justify-between gap-4">
<div class="flex flex-col">
<h1 class="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">Financial Reports</h1>
<p class="text-slate-500 dark:text-slate-400 text-sm">Deep dive into your business health and profitability</p>
</div>
<div class="flex gap-3">
<button class="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold hover:bg-slate-50 transition-colors">
<span class="material-symbols-outlined text-lg">calendar_today</span>
<span>Schedule</span>
</button>
<button class="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-slate-900 text-sm font-bold hover:opacity-90 transition-opacity shadow-sm">
<span class="material-symbols-outlined text-lg">download</span>
<span>Download PDF/CSV</span>
</button>
</div>
</div>
<!-- SegmentedButtons (Date Range) -->
<div class="flex bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 w-fit">
<label class="flex cursor-pointer items-center justify-center rounded-lg px-6 py-2 text-sm font-semibold transition-all has-[:checked]:bg-primary has-[:checked]:text-slate-900 text-slate-500 dark:text-slate-400">
<span>Last 30 Days</span>
<input checked="" class="invisible w-0" name="date-range" type="radio" value="30days"/>
</label>
<label class="flex cursor-pointer items-center justify-center rounded-lg px-6 py-2 text-sm font-semibold transition-all has-[:checked]:bg-primary has-[:checked]:text-slate-900 text-slate-500 dark:text-slate-400">
<span>This Year</span>
<input class="invisible w-0" name="date-range" type="radio" value="year"/>
</label>
<label class="flex cursor-pointer items-center justify-center rounded-lg px-6 py-2 text-sm font-semibold transition-all has-[:checked]:bg-primary has-[:checked]:text-slate-900 text-slate-500 dark:text-slate-400">
<span>Last Quarter</span>
<input class="invisible w-0" name="date-range" type="radio" value="quarter"/>
</label>
<label class="flex cursor-pointer items-center justify-center rounded-lg px-6 py-2 text-sm font-semibold transition-all has-[:checked]:bg-primary has-[:checked]:text-slate-900 text-slate-500 dark:text-slate-400">
<span>Custom Range</span>
<input class="invisible w-0" name="date-range" type="radio" value="custom"/>
</label>
</div>
<!-- Summary Card -->
<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
<div class="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
<div class="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
<span class="material-symbols-outlined text-[120px] text-primary">trending_up</span>
</div>
<div class="flex flex-col gap-1 relative z-10">
<p class="text-slate-500 dark:text-slate-400 text-base font-medium">Net Profit (Take-home Pay)</p>
<div class="flex items-baseline gap-4 mt-2">
<h2 class="text-slate-900 dark:text-white text-5xl font-black tracking-tight">$24,840.00</h2>
<div class="flex items-center gap-1 bg-primary/20 text-slate-900 dark:text-primary px-2 py-1 rounded text-sm font-bold">
<span class="material-symbols-outlined text-sm">arrow_upward</span>
<span>15.4%</span>
</div>
</div>
<p class="text-slate-400 text-sm mt-4">vs. $21,520 last period</p>
</div>
<div class="mt-8 flex gap-6">
<div class="flex flex-col">
<span class="text-xs text-slate-400 font-bold uppercase tracking-wider">Gross Income</span>
<span class="text-xl font-bold text-slate-900 dark:text-white">$42,300</span>
</div>
<div class="flex flex-col border-l border-slate-200 dark:border-slate-700 pl-6">
<span class="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Expenses</span>
<span class="text-xl font-bold text-slate-900 dark:text-white">$17,460</span>
</div>
<div class="flex flex-col border-l border-slate-200 dark:border-slate-700 pl-6">
<span class="text-xs text-slate-400 font-bold uppercase tracking-wider">Tax Estimated</span>
<span class="text-xl font-bold text-slate-900 dark:text-white">$3,720</span>
</div>
</div>
</div>
<div class="bg-primary/10 rounded-2xl p-8 flex flex-col justify-between border border-primary/20">
<div>
<h3 class="text-slate-900 dark:text-primary text-xl font-black">Financial Health</h3>
<p class="text-slate-600 dark:text-slate-400 text-sm mt-2">Your business is performing in the top 10% for your industry size.</p>
</div>
<div class="flex flex-col gap-2">
<div class="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
<div class="bg-primary h-full w-[85%]"></div>
</div>
<div class="flex justify-between text-xs font-bold text-slate-500">
<span>LIQUIDITY SCORE</span>
<span class="text-slate-900 dark:text-white">85/100</span>
</div>
</div>
<button class="w-full py-3 bg-slate-900 text-white dark:bg-primary dark:text-slate-900 rounded-xl font-bold text-sm mt-4">Get AI Insights</button>
</div>
</div>
<!-- Charts Section -->
<div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
<!-- Monthly Comparison (Bar Chart) -->
<div class="lg:col-span-3 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
<div class="flex items-center justify-between mb-8">
<h3 class="text-slate-900 dark:text-white font-bold text-lg">Income vs. Expenses</h3>
<div class="flex gap-4 text-xs font-bold">
<div class="flex items-center gap-1.5">
<div class="size-2.5 rounded-full bg-primary"></div>
<span>Income</span>
</div>
<div class="flex items-center gap-1.5">
<div class="size-2.5 rounded-full bg-blue-500"></div>
<span>Expenses</span>
</div>
</div>
</div>
<div class="h-64 flex items-end justify-between gap-4 px-2">
<!-- Chart Bars (Simulated with Tailwind) -->
<div class="flex-1 flex flex-col items-center gap-2">
<div class="w-full flex items-end gap-1 h-48">
<div class="flex-1 bg-primary rounded-t min-h-[60%]"></div>
<div class="flex-1 bg-blue-500 rounded-t min-h-[40%]"></div>
</div>
<span class="text-[10px] font-bold text-slate-400">MAY</span>
</div>
<div class="flex-1 flex flex-col items-center gap-2">
<div class="w-full flex items-end gap-1 h-48">
<div class="flex-1 bg-primary rounded-t min-h-[75%]"></div>
<div class="flex-1 bg-blue-500 rounded-t min-h-[45%]"></div>
</div>
<span class="text-[10px] font-bold text-slate-400">JUN</span>
</div>
<div class="flex-1 flex flex-col items-center gap-2">
<div class="w-full flex items-end gap-1 h-48">
<div class="flex-1 bg-primary rounded-t min-h-[90%]"></div>
<div class="flex-1 bg-blue-500 rounded-t min-h-[50%]"></div>
</div>
<span class="text-[10px] font-bold text-slate-400">JUL</span>
</div>
<div class="flex-1 flex flex-col items-center gap-2">
<div class="w-full flex items-end gap-1 h-48">
<div class="flex-1 bg-primary rounded-t min-h-[85%]"></div>
<div class="flex-1 bg-blue-500 rounded-t min-h-[55%]"></div>
</div>
<span class="text-[10px] font-bold text-slate-400">AUG</span>
</div>
<div class="flex-1 flex flex-col items-center gap-2">
<div class="w-full flex items-end gap-1 h-48">
<div class="flex-1 bg-primary rounded-t min-h-[100%]"></div>
<div class="flex-1 bg-blue-500 rounded-t min-h-[40%]"></div>
</div>
<span class="text-[10px] font-bold text-slate-400">SEP</span>
</div>
</div>
</div>
<!-- Expenses by Category (Donut Chart) -->
<div class="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
<h3 class="text-slate-900 dark:text-white font-bold text-lg mb-8">Expenses by Category</h3>
<div class="flex flex-col gap-6">
<div class="relative size-40 mx-auto">
<!-- Donut Chart Simulated with SVGs -->
<svg class="size-full transform -rotate-90" viewbox="0 0 36 36">
<circle cx="18" cy="18" fill="transparent" r="16" stroke="#e2e8f0" stroke-width="4"></circle>
<circle cx="18" cy="18" fill="transparent" r="16" stroke="#3b82f6" stroke-dasharray="45 100" stroke-width="4"></circle>
<circle cx="18" cy="18" fill="transparent" r="16" stroke="#13ec5b" stroke-dasharray="25 100" stroke-dashoffset="-45" stroke-width="4"></circle>
<circle cx="18" cy="18" fill="transparent" r="16" stroke="#f59e0b" stroke-dasharray="15 100" stroke-dashoffset="-70" stroke-width="4"></circle>
<circle cx="18" cy="18" fill="transparent" r="16" stroke="#8b5cf6" stroke-dasharray="15 100" stroke-dashoffset="-85" stroke-width="4"></circle>
</svg>
<div class="absolute inset-0 flex items-center justify-center flex-col">
<span class="text-xs text-slate-400 font-bold">TOTAL</span>
<span class="text-xl font-black">$17.4k</span>
</div>
</div>
<div class="grid grid-cols-2 gap-4">
<div class="flex items-center gap-2">
<div class="size-2 rounded-full bg-blue-500"></div>
<div class="flex flex-col">
<span class="text-[10px] text-slate-500 font-bold">INVENTORY</span>
<span class="text-xs font-bold">$7.8k</span>
</div>
</div>
<div class="flex items-center gap-2">
<div class="size-2 rounded-full bg-primary"></div>
<div class="flex flex-col">
<span class="text-[10px] text-slate-500 font-bold">UTILITIES</span>
<span class="text-xs font-bold">$4.3k</span>
</div>
</div>
<div class="flex items-center gap-2">
<div class="size-2 rounded-full bg-amber-500"></div>
<div class="flex flex-col">
<span class="text-[10px] text-slate-500 font-bold">RENT</span>
<span class="text-xs font-bold">$2.6k</span>
</div>
</div>
<div class="flex items-center gap-2">
<div class="size-2 rounded-full bg-violet-500"></div>
<div class="flex flex-col">
<span class="text-[10px] text-slate-500 font-bold">OTHER</span>
<span class="text-xs font-bold">$2.7k</span>
</div>
</div>
</div>
</div>
</div>
</div>
<!-- Simplified Profit & Loss Table -->
<div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
<div class="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
<div>
<h3 class="text-slate-900 dark:text-white font-bold text-lg">Profit &amp; Loss Summary</h3>
<p class="text-slate-500 text-xs mt-1">Simple breakdown of your money coming in and out</p>
</div>
<span class="text-[10px] font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase tracking-widest">Simplified View</span>
</div>
<table class="w-full text-left">
<thead class="bg-slate-50 dark:bg-slate-800/50">
<tr>
<th class="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Financial Area</th>
<th class="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Amount</th>
<th class="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Percentage</th>
<th class="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Trend</th>
</tr>
</thead>
<tbody class="divide-y divide-slate-100 dark:divide-slate-800">
<tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
<td class="px-6 py-5">
<div class="flex items-center gap-3">
<div class="size-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
<span class="material-symbols-outlined text-lg">add_circle</span>
</div>
<div>
<p class="text-sm font-bold text-slate-900 dark:text-white">Money Earned (Gross Revenue)</p>
<p class="text-[10px] text-slate-400">Total sales from all sources</p>
</div>
</div>
</td>
<td class="px-6 py-5 text-right font-bold text-sm text-slate-900 dark:text-white">$42,300.00</td>
<td class="px-6 py-5 text-right font-medium text-sm text-slate-500">100%</td>
<td class="px-6 py-5 text-right text-primary">
<span class="material-symbols-outlined">trending_up</span>
</td>
</tr>
<tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
<td class="px-6 py-5">
<div class="flex items-center gap-3">
<div class="size-8 rounded-lg bg-blue-100 text-blue-500 flex items-center justify-center">
<span class="material-symbols-outlined text-lg">remove_circle</span>
</div>
<div>
<p class="text-sm font-bold text-slate-900 dark:text-white">Total Expenses (Money Out)</p>
<p class="text-[10px] text-slate-400">Inventory, rent, and overhead</p>
</div>
</div>
</td>
<td class="px-6 py-5 text-right font-bold text-sm text-slate-900 dark:text-white">$17,460.00</td>
<td class="px-6 py-5 text-right font-medium text-sm text-slate-500">41.3%</td>
<td class="px-6 py-5 text-right text-slate-400">
<span class="material-symbols-outlined">trending_flat</span>
</td>
</tr>
<tr class="bg-primary/5">
<td class="px-6 py-6">
<div class="flex items-center gap-3">
<div class="size-8 rounded-lg bg-primary text-slate-900 flex items-center justify-center">
<span class="material-symbols-outlined text-lg">savings</span>
</div>
<div>
<p class="text-sm font-black text-slate-900 dark:text-white">What's Left (Net Margin)</p>
<p class="text-[10px] text-slate-500 dark:text-slate-400">Your actual business profitability</p>
</div>
</div>
</td>
<td class="px-6 py-6 text-right font-black text-lg text-slate-900 dark:text-white">$24,840.00</td>
<td class="px-6 py-6 text-right font-bold text-sm text-primary">58.7%</td>
<td class="px-6 py-6 text-right text-primary">
<span class="material-symbols-outlined font-black">trending_up</span>
</td>
</tr>
</tbody>
</table>
</div>
<!-- Help Tooltip/Note -->
<div class="flex items-start gap-4 p-5 bg-blue-50 dark:bg-slate-800/50 rounded-xl border border-blue-100 dark:border-slate-700">
<span class="material-symbols-outlined text-blue-500">info</span>
<div class="flex flex-col gap-1">
<p class="text-sm font-bold text-slate-900 dark:text-slate-200">How to read this report</p>
<p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">The "What's Left" figure is the most important—it's the actual money your business generated after paying all bills. A net margin above 20% is considered healthy for most small businesses in your category.</p>
</div>
</div>
</div>
<!-- Footer Spacer -->
<div class="h-20"></div>
</main>
</div>
</div>
</body></html>