# SpendWise — Personal Finance Tracker

> **Tagline:** *"Know Your Money. Own Your Future."*  
> **Category:** Personal Finance Management & Budgeting Platform  
> **Target Audience:** College Students, Young Professionals, and Interns  
> **Project Type:** College Engineering Mini-Project (Computer Science / IT / Software Engineering)

---

## 1. Project Overview

**SpendWise** is a modern, responsive personal finance tracking web application crafted with a startup-grade fintech aesthetic. It empowers users—particularly university students and young adults—to transition from intuitive guess-work to data-backed financial health.

The application allows users to:
- Monitor dynamic net balance, inflow, outflow, and savings rate.
- Visualize spending trends with interactive charts (monthly bars, category donuts, and daily burn areas).
- Establish category-specific expenditure caps and track real-time utilization with intuitive color-coded progress bars (Green / Amber / Red).
- Gain transparent, rule-based algorithmic financial insights and actionable recommendations.
- Manage full-lifecycle transaction records (Income/Expense CRUD) with filtering, searching, and CSV export.
- Seamlessly toggle between dark and light modes, and display currency natively in **Indian Rupee (₹)** using the Indian numbering system (Lakhs / Thousands).

---

## 2. Key Features

### 📊 A. Financial Command Center (Dashboard)
- **4 Dynamic Key Metric Cards:**
  - **Total Balance:** Real-time net position with month-over-month percentage shift.
  - **Total Income:** Aggregated monthly inflow with trend badge.
  - **Total Expenses:** Aggregated monthly expenditure with inverse logic (lower is favorable).
  - **Savings Rate:** Calculated as `((Income - Expenses) / Income) * 100` with historical variance.
- **4 Interactive Visualizations (Powered by Recharts):**
  1. *Income vs. Expenses:* Multi-month comparative bar chart.
  2. *Spending Breakdown:* Interactive donut chart showing percentage share and total category outflow.
  3. *Daily Spending Trend:* Smooth area trajectory graph tracing daily burn velocity.
  4. *Budget Progress Overview:* Live category progress bars with threshold alerts.
- **Recent Transactions Feed:** Quick-look log with instant edit trigger.

### 💳 B. Complete Transaction Management
- **Full CRUD Capabilities:** Add, view, edit, and delete transactions.
- **Dual Flow:** Income and Expense types with contextual category assignments:
  - *Expense Categories:* Food, Transportation, Education, Shopping, Entertainment, Healthcare, Bills, Subscriptions, Personal Care, Other.
  - *Income Categories:* Allowance, Freelancing, Part-time Job, Salary, Scholarship, Business, Other.
- **Payment Method Tagging:** UPI, Cash, Credit Card, Debit Card, Net Banking.
- **Deep Search & Multi-Criteria Filtering:**
  - Filter by keyword (title, description, category).
  - Filter by type (All, Expense Only, Income Only).
  - Filter by specific category.
  - Sort by date (Newest/Oldest) or amount (Highest/Lowest).
- **Client-Side CSV Export:** One-click download conforming to RFC 4180 with UTF-8 BOM encoding for seamless Microsoft Excel and Google Sheets import.

### 🎯 C. Proactive Budget Management
- **Overall Monthly Spending Cap:** Set and adjust the master monthly expenditure target.
- **Granular Category Budgets:** Configure custom limits per category.
- **Visual Threshold Rules:**
  - 🟢 **Safe (<80%):** Spending comfortably within limits.
  - 🟡 **Warning (80%–100%):** Approaching budget exhaustion.
  - 🔴 **Exceeded (>100%):** Limit breached with exact overage computation.
- **Cross-Month Navigation:** Switch between current and past months to analyze historical compliance.

### 💡 D. Transparent Rule-Based Financial Insights
- **Student Financial Health Index:** Dynamic score out of 100 derived from savings rate, month-over-month variances, and budget discipline.
- **Key Observation Cards:**
  - Identification of highest spending driver.
  - Daily spending velocity (`total expenses / elapsed days`).
  - Month-over-Month surge detections (e.g. "+35% in Transportation").
  - Budget breach alerts.
- **50-30-20 Rule Guidelines:** College-friendly educational rubric for Needs (50%), Wants (30%), and Savings (20%).

### ⚙️ E. Customization & Data Integrity
- **Native Indian Currency Support:** Formats amounts as `₹1,500`, `₹25,000`, `₹1,25,000` using the Indian numbering system. Also supports USD ($), EUR (€), and GBP (£).
- **Theme Switcher:** Deep charcoal/navy fintech dark mode and clean daylight slate mode.
- **Full Data Backup & Restore:** Export and import entire application state as structured JSON.
- **Realistic Student Sample Data:** Pre-loaded with realistic Indian college student records (monthly allowance, freelance milestones, mess fees, metro passes, semester books, hackathon awards).
- **Data Privacy:** 100% local browser execution using `localStorage`. No external tracking or unencrypted network transmissions.

### 🔐 F. Phone Number & Password Authentication
- **Phone & Password Authentication:** Sign in with a 10-digit mobile number and password, with support for new user sign-up.
- **Pre-Configured Demo Credentials:**
  - **Phone:** `9876543210`
  - **Password:** `password123`
  - **Account Name:** Arjun Verma
- **One-Click Logout:** Available in the desktop sidebar, top header, and settings page with smooth redirection to the login view.
- **Session Persistence:** Seamlessly stays logged in across browser refreshes via client-side session storage.

---

## 3. Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | React 18 (TypeScript) | Component-driven UI architecture with strong static typing |
| **Build Tool** | Vite 5 | Lightning-fast HMR and optimized production bundling |
| **Styling** | Tailwind CSS 3 | Modern fintech design system, custom palettes, and animations |
| **Data Visualization** | Recharts 2 | SVG-based responsive charting (Bars, Pies, Area charts) |
| **Iconography** | Lucide React | High-contrast, consistent vector icon set |
| **State Management** | React Context + Hooks | Centralized reactive state container with persistent sync |
| **Persistence** | HTML5 Web Storage (`localStorage`) | Zero-latency client-side database with fallback demo data |

---

## 4. Project Structure

```text
spendwise/
├── public/
├── src/
│   ├── components/
│   │   ├── budgets/
│   │   │   ├── BudgetCard.tsx          # Category limit card with progress bar
│   │   │   └── BudgetModal.tsx         # Modal to configure category limits
│   │   ├── common/
│   │   │   ├── ConfirmationModal.tsx   # Destructive action safeguards
│   │   │   ├── MetricCard.tsx          # Summary KPI metric display card
│   │   │   ├── Modal.tsx               # Accessible modal overlay with ESC support
│   │   │   └── Toast.tsx               # Floating feedback notifications
│   │   ├── dashboard/
│   │   │   ├── BudgetProgressOverview.tsx # Category progress summary
│   │   │   ├── CategoryDonutChart.tsx     # Recharts donut visualization
│   │   │   ├── IncomeExpenseChart.tsx     # Multi-month comparative bar chart
│   │   │   ├── RecentTransactions.tsx     # Recent transactions table
│   │   │   ├── SpendingTrendChart.tsx     # Daily expense trajectory area chart
│   │   │   └── SummaryCards.tsx           # 4 key financial metrics
│   │   ├── layout/
│   │   │   ├── MobileNav.tsx           # Fixed mobile bottom bar navigation
│   │   │   ├── Navbar.tsx              # Top bar with month switcher & theme toggle
│   │   │   └── Sidebar.tsx             # Desktop vertical navigation sidebar
│   │   ├── transactions/
│   │   │   ├── TransactionFilters.tsx  # Search, filter, and sort toolbar
│   │   │   ├── TransactionModal.tsx    # Add / Edit transaction modal
│   │   │   └── TransactionTable.tsx    # Responsive table + mobile cards + pagination
│   │   └── insights/
│   │       └── InsightCard.tsx         # Observation card with actionable tip
│   ├── context/
│   │   └── FinanceContext.tsx          # Central state management & storage engine
│   ├── data/
│   │   └── initialData.ts              # Realistic Indian college student demo records
│   ├── pages/
│   │   ├── BudgetsPage.tsx             # Dedicated budget management screen
│   │   ├── DashboardPage.tsx           # Main overview landing screen
│   │   ├── InsightsPage.tsx            # Rule-based analytical observations
│   │   ├── SettingsPage.tsx            # Currencies, themes, backups, and resets
│   │   └── TransactionsPage.tsx        # Comprehensive transaction records & export
│   ├── types/
│   │   └── index.ts                    # Strong TypeScript type definitions
│   ├── utils/
│   │   ├── calculations.ts             # Mathematical models, savings rate, & insight rules
│   │   ├── csvExport.ts                # RFC 4180 compliant CSV & JSON generator
│   │   └── formatters.ts               # Indian numbering formatters & category colors
│   ├── App.tsx                         # Root layout and modal coordinator
│   ├── index.css                       # Tailwind directives and dark/light styling
│   └── main.tsx                        # Application mount entry point
├── index.html                          # HTML shell with Inter typography
├── package.json                        # Dependencies and build scripts
├── postcss.config.js                   # PostCSS pipeline configuration
├── tailwind.config.js                  # Custom fintech theme configuration
├── tsconfig.json                       # TypeScript compiler options
└── vite.config.ts                      # Vite configuration
```

---

## 5. Setup and Running Instructions

### Prerequisites
- Node.js (version 18 or higher recommended; v20 LTS used)
- A modern web browser (Google Chrome, Microsoft Edge, Firefox, or Safari)

### Installation Steps

1. **Clone or navigate to the project directory:**
   ```bash
   cd c:\Users\User\Desktop\spendwise
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   Open your browser and navigate to:
   ```text
   http://localhost:5173/
   ```

5. **Build for production (Optional):**
   ```bash
   npm run build
   npm run preview
   ```

---

## 6. Demonstration Walkthrough (For College Evaluator)

When presenting this mini-project to college professors or evaluators, follow this recommended 5-minute demonstration flow:

1. **Introduction (1 min):**
   - Point out the branding: **SpendWise** (*"Know Your Money. Own Your Future."*).
   - Explain the context: Tailored for an Indian college student (Arjun Verma) managing hostel allowances, freelance project milestones, canteen expenses, and metro passes.
   - Highlight the **Indian Numbering System** formatting (e.g. `₹15,000`, `₹1,25,000`).

2. **Dashboard & Visualizations (1.5 min):**
   - Show the 4 summary cards: **Total Balance**, **Total Income**, **Total Expenses**, and **Savings Rate**. Emphasize that these are dynamically computed from underlying records.
   - Hover over the **Income vs. Expenses** bar chart to display month-by-month cashflow.
   - Hover over the **Spending Breakdown** donut chart to inspect category percentages and total outflow.
   - Point out the **Daily Spending Trend** area chart and **Budget Progress** bars.

3. **Transaction Management & Live Reactivity (1 min):**
   - Click **"+ Add Transaction"** in the top bar.
   - Add a new expense (e.g., Title: *"Campus Book Fair"*, Amount: `1200`, Category: *Education*, Payment: *UPI*).
   - Observe how the dashboard total balance, education budget bar, and donut chart immediately update without requiring a page reload.
   - Navigate to the **Transactions** tab, demonstrate keyword search (e.g., search *"Swiggy"*), filter by *Expense Only*, and click **"Export CSV"** to demonstrate client-side file generation.

4. **Budgets & Insights (1 min):**
   - Navigate to **Budgets**: show the green, amber, and red visual indicator rules. Edit a category cap to demonstrate instant recalculation.
   - Navigate to **Insights**: show the transparent, rule-based observations (e.g., top spending category, daily burn rate, MoM shifts).

5. **Settings & Themes (0.5 min):**
   - Switch currency to **USD ($)** or **EUR (€)** to demonstrate global locale formatting.
   - Toggle **Dark/Light Mode** to showcase accessibility and UI contrast.
   - Highlight that refreshing the browser retains all records via `localStorage`.

---

## 7. Current Architecture & Honest Limitations

- **Storage Engine:** SpendWise currently uses HTML5 `localStorage` for complete client-side data persistence. This enables instantaneous responsiveness and works offline without requiring backend cloud servers.
- **Authentication:** In this frontend-only MVP, data is sandboxed to the user's browser profile. There is no multi-user remote authentication or cloud database synchronization.
- **Privacy:** Since all calculations happen on the client machine, financial figures are never transmitted over third-party networks.

---

## 8. Future Roadmap

1. **Backend Integration:** Node.js / Express REST API with PostgreSQL or MongoDB.
2. **Multi-User Auth:** JWT / OAuth 2.0 (Google Sign-In) with bcrypt password hashing.
3. **Automated Receipt Scanning:** Optical Character Recognition (OCR) via Google Cloud Vision API to parse physical grocery receipts.
4. **SMS Transaction Parser:** Client-side parsing of standard Indian bank SMS alerts (HDFC, SBI, ICICI, UPI) for automatic expense logging.
5. **Recurring Recurring Subscriptions Engine:** Automated monthly deduction tracking with calendar reminders.

---

## 9. License

Developed as an Academic Engineering Mini-Project. Open source for educational and demonstration purposes.
