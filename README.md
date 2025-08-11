#Dana Desa

Dana Desa is a community-driven cooperative fund built on blockchain, empowering villages and local communities to manage and grow their resources transparently. Our mission is to strengthen economic independence, foster collaboration, and ensure every contribution directly benefits the people — all with the trust and openness of Web3 technology.

# Koperasi DAO Smart Contracts

A comprehensive decentralized autonomous organization (DAO) system built on Stacks blockchain for managing cooperative financial activities including membership, governance, loans, and profit sharing.

## 🏗️ Architecture Overview

The Koperasi DAO consists of seven main smart contracts working together to provide a complete cooperative management system:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ GovernorRegistry│    │ MembershipToken │    │ GovernanceToken │
│   (Registry)    │    │   (Members)     │    │   (Voting)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │ KoperasiGovernor│
                    │  (Main Gov)     │
                    └─────────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
┌─────────────────┐  ┌─────────────────┐ ┌─────────────────┐
│    Treasury     │  │   LoanManager   │ │  ProfitSharing  │
│  (Funds Mgmt)   │  │  (Loan System)  │ │ (Distribution)  │
└─────────────────┘  └─────────────────┘ └─────────────────┘
```

## 📋 Contract Details

### Core Contracts

#### 1. GovernorRegistry
- **Purpose**: Central registry for all contract addresses and system configuration
- **Key Features**:
  - Contract address management
  - System-wide emergency controls
  - Version tracking for upgrades
- **File**: `contracts/GovernorRegistry.clar`

#### 2. MembershipToken
- **Purpose**: Enhanced membership registry with analytics and activity tracking
- **Key Features**:
  - Member registration with simpanan (savings) tracking
  - Activity scoring system (0-1000 scale)
  - Member tier system (Bronze, Silver, Gold, Platinum)
  - Governance participation tracking
  - Member statistics and reputation scoring
- **File**: `contracts/MembershipToken.clar`

#### 3. GovernanceToken
- **Purpose**: Soulbound voting token for governance participation
- **Key Features**:
  - Non-transferable tokens (soulbound)
  - Mint/burn controlled by authorized minter
  - Balance-based voting power
- **File**: `contracts/GovernanceToken.clar`

#### 4. KoperasiGovernor
- **Purpose**: Main governance contract with weighted voting based on simpanan
- **Key Features**:
  - Proposal creation and voting system
  - Weighted voting based on member simpanan
  - Configurable quorum and voting periods
  - Support for 6 proposal types:
    - Treasury Send (u1)
    - Approve Loan (u2)
    - Profit Distribution (u3)
    - Update Interest Rate (u4)
    - Change Quorum (u5)
    - Emergency Pause (u6)
- **File**: `contracts/KoperasiGovernor.clar`

#### 5. Treasury
- **Purpose**: Simple treasury contract for holding and managing STX funds
- **Key Features**:
  - Governor-controlled fund transfers
  - Balance tracking
  - Secure fund management
- **File**: `contracts/Treasury.clar`

#### 6. LoanManager
- **Purpose**: Comprehensive loan management system with credit scoring
- **Key Features**:
  - Loan application and approval process
  - Interest calculation and repayment tracking
  - Credit scoring based on member history
  - Loan status management (Pending, Approved, Active, Completed, Defaulted)
  - Default tracking and management
- **File**: `contracts/LoanManager.clar`

#### 7. ProfitSharing
- **Purpose**: Automated profit distribution system
- **Key Features**:
  - Distribution based on simpanan ratios
  - Manual and automatic distribution modes
  - Distribution history tracking
  - Member-specific distribution records
- **File**: `contracts/ProfitSharing.clar`

### Interface Contracts

The system includes comprehensive interface definitions for type safety and modularity:

- `IMembershipTokenEnhanced.clar` - Enhanced membership functions
- `ITreasury.clar` - Treasury management interface
- `IGovernanceToken.clar` - Governance token interface
- `IGovernorRegistry.clar` - Registry interface
- `ILoan.clar` - Basic loan interface
- `ILoanManager.clar` - Loan management interface
- `ILoanRegistry.clar` - Loan registry interface

## 🚀 Getting Started

### Prerequisites

- [Clarinet](https://docs.hiro.so/clarinet) installed
- Node.js and npm for testing
- Stacks wallet for deployment

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cooperation
```

2. Install dependencies:
```bash
npm install
```

3. Check contract syntax:
```bash
clarinet check
```

### Testing

Run the test suite:
```bash
npm test
```

Run tests with coverage and cost analysis:
```bash
npm run test:report
```

Watch mode for continuous testing:
```bash
npm run test:watch
```

### Deployment

#### Local Development (Devnet)

1. Start local devnet:
```bash
clarinet devnet start
```

2. Deploy contracts using the enhanced deployment script:
```bash
chmod +x scripts/deploy-enhanced.sh
./scripts/deploy-enhanced.sh
```

#### Testnet Deployment

1. Configure your deployment settings in `deployments/default.testnet-plan.yaml`

2. Deploy to testnet:
```bash
clarinet deployments apply -p testnet
```

## 🔧 Configuration

### Contract Constants

Before deployment, update the following constants in each contract:

#### KoperasiGovernor.clar
```clarity
(define-constant MEMBERSHIP_CONTRACT 'YOUR_MEMBERSHIP_CONTRACT_ADDRESS)
(define-constant TREASURY_CONTRACT 'YOUR_TREASURY_CONTRACT_ADDRESS)
(define-constant LOAN_CONTRACT 'YOUR_LOAN_CONTRACT_ADDRESS)
(define-constant PROFIT_CONTRACT 'YOUR_PROFIT_CONTRACT_ADDRESS)
```

#### MembershipToken.clar
```clarity
(define-constant ADMIN_PRINCIPAL 'YOUR_ADMIN_PRINCIPAL)
```

#### Treasury.clar
```clarity
(define-constant GOVERNOR_CONTRACT 'YOUR_GOVERNOR_CONTRACT_ADDRESS)
```

### Governance Parameters

Key governance parameters that can be configured:

- **Voting Period**: `u1008` (default time units)
- **Quorum Percentage**: `u30` (30% default)
- **Proposal Delay**: `u144` (execution delay after voting ends)
- **Proposal Threshold**: `u1000000` (minimum simpanan to create proposals)

### Member Tier Thresholds

Member tiers are calculated based on simpanan amounts:
- **Bronze**: 0 - 999,999 micro-STX
- **Silver**: 1,000,000 - 4,999,999 micro-STX  
- **Gold**: 5,000,000 - 9,999,999 micro-STX
- **Platinum**: 10,000,000+ micro-STX

## 📊 Usage Examples

### Creating a Member

```clarity
;; Mint membership with initial simpanan
(contract-call? .MembershipToken mint-membership 'SP1234567890 u1000000)
```

### Creating a Proposal

```clarity
;; Create a treasury send proposal
(contract-call? .KoperasiGovernor propose 
  u1  ;; TREASURY_SEND action
  'SP1234567890  ;; recipient
  u500000  ;; amount
  "Emergency fund distribution")
```

### Voting on Proposals

```clarity
;; Vote yes on proposal ID 1
(contract-call? .KoperasiGovernor vote u1 true)
```

### Requesting a Loan

```clarity
;; Submit loan application
(contract-call? .LoanManager request-loan 
  u2000000  ;; amount
  "Business expansion loan")
```

## 🔒 Security Features

- **Access Control**: Role-based permissions with admin and governor controls
- **Soulbound Tokens**: Governance tokens cannot be transferred
- **Emergency Controls**: System-wide pause functionality
- **Input Validation**: Comprehensive parameter validation
- **Overflow Protection**: Safe arithmetic operations

## 🧪 Testing Strategy

The project includes comprehensive test coverage for:

- Contract deployment and initialization
- Member management and analytics
- Governance proposal lifecycle
- Loan application and repayment
- Profit distribution calculations
- Emergency scenarios and edge cases

## 📈 Analytics and Reporting

### Member Analytics

- Activity scoring (0-1000 scale)
- Governance participation tracking
- Loan history and credit scoring
- Profit distribution history
- Member tier progression

### System Analytics

- Total membership and simpanan tracking
- Proposal success rates
- Loan default rates
- Treasury balance monitoring
- Distribution history

## 🔄 Upgrade Strategy

The system supports upgrades through the GovernorRegistry:

1. Deploy new contract versions
2. Update registry with new addresses
3. Migrate state if necessary
4. Deactivate old contracts

## 📝 Error Codes

### Common Error Codes

- `u100-u199`: Authorization and access errors
- `u200-u299`: Treasury-related errors
- `u300-u399`: Loan management errors
- `u400-u499`: Profit sharing errors
- `u500-u599`: Governance errors
- `u600+`: Proposal and voting errors

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add comprehensive tests
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the documentation in `/docs`
- Review test files for usage examples

## 🚧 Roadmap

### Phase 1 (Current)
- ✅ Core contract implementation
- ✅ Basic governance system
- ✅ Member management
- ✅ Loan system

### Phase 2 (Planned)
- 🔄 Advanced analytics dashboard
- 🔄 Mobile app integration
- 🔄 Multi-token support
- 🔄 Automated reporting

### Phase 3 (Future)
- 🔄 Cross-chain compatibility
- 🔄 DeFi integrations
- 🔄 Advanced governance features
- 🔄 Regulatory compliance tools

## 📊 Contract Metrics

| Contract | LOC | Functions | Complexity |
|----------|-----|-----------|------------|
| GovernorRegistry | ~120 | 8 | Low |
| MembershipToken | ~300+ | 15+ | Medium |
| GovernanceToken | ~60 | 4 | Low |
| KoperasiGovernor | ~220+ | 8 | High |
| Treasury | ~25 | 2 | Low |
| LoanManager | ~400+ | 20+ | High |
| ProfitSharing | ~250+ | 12+ | Medium |

## 🖥️ Frontend Application (koperasi-dao)

The Koperasi DAO includes a comprehensive Next.js frontend application that provides an intuitive interface for interacting with the smart contracts.

### Frontend Tech Stack

- **Framework**: Next.js 15.2.4 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4.1.9 with Neobrutalism design system
- **UI Components**: Radix UI primitives with shadcn/ui
- **Icons**: Lucide React
- **Charts**: Recharts
- **Forms**: React Hook Form with Zod validation
- **Theme**: Next Themes for dark/light mode

### Design System

The application features a unique **Neobrutalism** design system with:

- Bold, geometric shapes with thick black borders
- Bright, contrasting colors (yellow, pink, cyan, green)
- Strong shadows and 3D effects
- Monospace typography for technical elements
- Interactive hover animations with shadow transitions

### Application Structure

```
koperasi-dao/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Dashboard (Member overview)
│   ├── layout.tsx                # Root layout with navigation
│   ├── globals.css               # Global styles & neobrutalism system
│   ├── financial/                # Financial management
│   │   └── page.tsx              # SHU distribution, treasury overview
│   ├── loans/                    # Loan management
│   │   ├── page.tsx              # Loan dashboard
│   │   └── apply/page.tsx        # Loan application form
│   ├── membership/               # Member management
│   │   ├── page.tsx              # Member list and registration
│   │   └── loading.tsx           # Loading states
│   ├── proposals/                # Governance proposals
│   │   ├── page.tsx              # Proposal board
│   │   ├── [id]/page.tsx         # Individual proposal details
│   │   ├── create/page.tsx       # Create new proposal
│   │   └── loading.tsx           # Loading states
│   ├── profits/                  # Profit sharing
│   │   └── page.tsx              # Distribution history & calculations
│   └── voting/                   # Voting interface
│       └── page.tsx              # Active votes and voting power
├── components/                   # Reusable components
│   ├── navigation.tsx            # Main navigation component
│   ├── theme-provider.tsx        # Theme context provider
│   └── ui/                       # shadcn/ui components (40+ components)
├── hooks/                        # Custom React hooks
├── lib/                          # Utility functions
└── public/                       # Static assets
```

### Key Features & Pages

#### 🏠 Dashboard (`/`)
- **Member Profile Card**: Displays NFT token ID, membership tier, and savings
- **Voting Power Display**: Shows governance tokens and participation streak
- **Activity Feed**: Recent proposals, votes, and loan activities
- **Quick Actions**: Create proposals, vote, apply for loans, view profits
- **Statistics Cards**: Participation streak, total votes, proposals created

#### 👥 Membership Management (`/membership`)
- **Member Directory**: Searchable list of all cooperative members
- **Member Statistics**: Total members, active members, total simpanan
- **Registration Interface**: Add new members with simpanan tracking
- **Member Analytics**: Voting power distribution, activity levels
- **Tier System**: Bronze, Silver, Gold, Platinum based on simpanan

#### 🗳️ Proposals & Governance (`/proposals`)
- **Proposal Board**: Grid view of all proposals with status badges
- **Proposal Creation**: Multi-step form for different proposal types:
  - Treasury Send
  - Loan Approval
  - Profit Distribution
  - Interest Rate Changes
  - Quorum Adjustments
  - Emergency Actions
- **Proposal Details**: Individual proposal pages with voting interface
- **Progress Tracking**: Visual progress bars for voting status

#### 💰 Financial Management (`/financial`)
- **Treasury Overview**: Total assets, liabilities, net worth
- **SHU Distribution**: Profit sharing calculations and history
- **Member Contributions**: Individual simpanan tracking
- **Financial Metrics**: ROI, operational costs, revenue streams
- **Business Units**: Performance tracking for cooperative ventures

#### 🏦 Loan System (`/loans`)
- **Loan Dashboard**: Active loans, payment schedules, default tracking
- **Application Process**: Multi-step loan application with:
  - Personal information
  - Loan amount and purpose
  - Collateral details
  - Terms agreement
- **Credit Scoring**: Member credit history and risk assessment
- **Repayment Tracking**: Payment history and upcoming dues

#### 💸 Profit Sharing (`/profits`)
- **Distribution History**: Past profit distributions with details
- **Member Allocations**: Individual profit shares based on simpanan
- **Calculation Methods**: Automatic, manual, and equal distribution modes
- **Distribution Scheduling**: Automated distribution based on governance

### UI Component Library

The application uses a comprehensive set of **40+ UI components** including:

**Layout & Navigation**:
- Navigation Menu
- Sidebar with collapsible functionality
- Breadcrumb navigation
- Tabs and Tab panels

**Data Display**:
- Cards with headers, content, and actions
- Tables with sorting and filtering
- Charts and data visualization (Recharts)
- Progress bars and indicators
- Badges and status indicators

**Form Controls**:
- Input fields with validation
- Select dropdowns and comboboxes
- Checkboxes and radio groups
- Textareas and rich text inputs
- Date pickers and calendars

**Feedback & Interaction**:
- Alert dialogs and confirmations
- Toast notifications (Sonner)
- Loading skeletons
- Hover cards and tooltips
- Accordion collapse panels

**Advanced Components**:
- Command palette for quick actions
- Carousel for image galleries
- Resizable panels
- Context menus
- Drawer and sheet modals

### Styling & Theming

#### Neobrutalism Design System

```css
/* Core Neobrutalism Styles */
.neo-card {
  @apply bg-white border-4 border-black p-6;
  box-shadow: 8px 8px 0px 0px #000000;
}

.neo-button {
  @apply bg-black text-white border-4 border-black px-6 py-3 font-bold uppercase;
  box-shadow: 4px 4px 0px 0px #000000;
}

.neo-button:hover {
  box-shadow: 6px 6px 0px 0px #000000;
  transform: translate(-2px, -2px);
}
```

#### Color Palette

- **Primary Colors**: Black (#000000), White (#ffffff)
- **Accent Colors**: Yellow (#ffff00), Pink (#ff00ff), Cyan (#00ffff)
- **Status Colors**: Green (#00ff00), Red (#ff0000), Orange (#ff8800)
- **Background**: Clean white with subtle neutral variations

#### Typography

- **Headers**: SF Pro Display, bold and uppercase
- **Body**: Helvetica Neue, Arial for readability
- **Code/Data**: SF Mono, Monaco for technical content

### Development Commands

```bash
# Development
npm run dev          # Start development server on http://localhost:3000

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint for code quality checks
```

### Configuration Files

- **`next.config.mjs`**: Next.js configuration with TypeScript/ESLint overrides
- **`components.json`**: shadcn/ui configuration with New York style
- **`tsconfig.json`**: TypeScript configuration with path aliases
- **`postcss.config.mjs`**: PostCSS setup for Tailwind CSS
- **`tailwind.config.js`**: Tailwind configuration with custom design tokens

### Integration with Smart Contracts

The frontend is designed to integrate seamlessly with the Clarity smart contracts:

#### Contract Integration Points

1. **Membership Token Contract**:
   - Member registration and simpanan tracking
   - Tier calculation and activity scoring
   - Member analytics and statistics

2. **Governance System**:
   - Proposal creation and management
   - Voting interface with weighted voting
   - Vote tracking and result calculation

3. **Treasury Management**:
   - Balance display and transaction history
   - Fund transfer interfaces
   - Financial reporting and analytics

4. **Loan Management**:
   - Loan application submission
   - Credit scoring and approval workflow
   - Repayment tracking and notifications

5. **Profit Distribution**:
   - Distribution calculation and display
   - Member allocation tracking
   - Distribution history and reporting

### Mobile Responsiveness

The application is fully responsive with:

- **Mobile Navigation**: Collapsible hamburger menu
- **Touch-Friendly**: Large buttons and touch targets
- **Adaptive Layout**: Grid systems that stack on mobile
- **Optimized Performance**: Code splitting and lazy loading

### Accessibility Features

- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **High Contrast**: Strong color contrasts for visibility
- **Focus Management**: Clear focus indicators and logical tab order

### Development Setup

1. **Install Dependencies**:
```bash
cd koperasi-dao
npm install
```

2. **Environment Setup**:
```bash
# Create .env.local for environment variables
NEXT_PUBLIC_STACKS_NETWORK=devnet
NEXT_PUBLIC_CONTRACT_ADDRESS=your_contract_address
```

3. **Start Development**:
```bash
npm run dev
```

4. **Build for Production**:
```bash
npm run build
npm run start
```

### Future Frontend Enhancements

#### Phase 1 (Current Implementation)
- ✅ Complete UI component library
- ✅ Responsive design system
- ✅ Mock data integration
- ✅ Navigation and routing

#### Phase 2 (Smart Contract Integration)
- 🔄 Stacks.js integration for contract calls
- 🔄 Wallet connectivity (Leather, Xverse)
- 🔄 Real-time data from blockchain
- 🔄 Transaction confirmation flows

#### Phase 3 (Advanced Features)
- 🔄 Real-time notifications
- 🔄 Advanced analytics dashboard
- 🔄 Export functionality for reports
- 🔄 Multi-language support (Indonesian/English)

#### Phase 4 (Mobile & PWA)
- 🔄 Progressive Web App (PWA) features
- 🔄 Mobile app using React Native
- 🔄 Push notifications
- 🔄 Offline functionality

### Performance Optimizations

- **Code Splitting**: Automatic route-based code splitting
- **Image Optimization**: Next.js automatic image optimization
- **Bundle Analysis**: Built-in bundle analyzer
- **Caching**: Automatic static optimization
- **Lazy Loading**: Component and route lazy loading

### Testnet Contract Address
ST273X4P37MHRHQ62MS3S7DA9M8R5RABB2M5SPSZ7

Some of the smart contract are not fully deployed as there is problem with the code

---

*Built with ❤️ for cooperative financial empowerment on Stacks blockchain*
