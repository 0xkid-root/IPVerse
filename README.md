# IPVerse: Decentralized IP Tokenization Platform

---

## Overview

**IPVerse** is a full-stack decentralized platform for tokenizing, managing, and investing in intellectual property (IP) assets. The platform leverages smart contracts on the Base Camp blockchain network to enable transparent, secure, and efficient management of IP assets, companies, and investments.

---

## Architecture

- **Smart Contracts** ([ipverseSmartcontract/contracts/ipverseSmartcontract/](ipverseSmartcontract/contracts/ipverseSmartcontract/)):
  - [`IPVerseAssets.sol`](ipverseSmartcontract/contracts/ipverseSmartcontract/IPVerseAssets.sol): Manages IP projects, token issuance, and investment logic.
  - [`IPVerseCompany.sol`](ipverseSmartcontract/contracts/ipverseSmartcontract/IPVerseCompany.sol): Handles company registration and management.
  - [`IPVerseFactory.sol`](ipverseSmartcontract/contracts/ipverseSmartcontract/IPVerseFactory.sol): Factory for creating companies and projects.
  - [`IPVerseRegistry.sol`](ipverseSmartcontract/contracts/ipverseSmartcontract/IPVerseRegistry.sol): Central registry for companies and projects.
  - [`IPVerseOrderManager.sol`](ipverseSmartcontract/contracts/ipverseSmartcontract/IPVerseOrderManager.sol): Manages investment orders and settlements.

- **Backend API** ([ipverseBackend/](ipverseBackend/)):
  - Node.js/Express REST API for user/admin authentication, project and investment management.
  - MongoDB for off-chain data (users, projects, investments).
  - JWT-based authentication, role-based access, and file uploads (Cloudinary).
  - [See backend README for endpoints and setup.](ipverseBackend/README.md)

- **Admin Dashboard** ([ipverse-admin/](ipverse-admin/)):
  - Next.js 15, TypeScript, Tailwind CSS, shadcn/ui.
  - Manage projects, companies, analytics, and platform users.
  - Responsive, modern UI for platform administrators.

- **User Dashboard** ([ipverse-user/](ipverse-user/)):
  - Next.js 15, TypeScript, Tailwind CSS, shadcn/ui.
  - Browse and invest in IP projects, manage portfolio, view analytics.
  - Responsive, investor-focused UI.

---

## Deployed Smart Contracts (Base Camp Network)

- **Assets Template:** `0x2259149102839fA199244a6E945028D03f216df9`
- **Company Template:** `0xbF15ef6E3f62AD7cA787132929B3C7E77297A350`
- **Factory Contract:** `0x285317B94DC5d6F7047b784D09E2CA85a9D7505F`
- **Registry Contract:** `0xd4BaDF7D96E246f6e6724743c7da4dDA9dA27Fd6`
- **Order Manager:** `0x2BF1407Ae056ad01955e3598AC7da2Aa527fe02a`

---

## Key Features

- **IP Tokenization:** Turn IP assets into blockchain tokens for fractional ownership and investment.
- **Company & Project Management:** Register companies, launch projects, upload legal docs, and manage compliance.
- **Investment Platform:** Users can invest in projects, track investments, and receive returns/dividends.
- **Admin Tools:** Analytics, project approval, risk management, and user management.
- **Security:** Role-based access, JWT authentication, input validation, and secure password handling.
- **Base Camp Network:** All contracts are deployed on the Base Camp blockchain for scalability and low fees.

---

## Getting Started

1. **Clone the repository**
2. **See individual app READMEs for setup:**
   - [ipverse-admin/README.md](ipverse-admin/README.md)
   - [ipverse-user/README.md](ipverse-user/README.md)
   - [ipverseBackend/README.md](ipverseBackend/README.md)
   - [ipverseSmartcontract/](ipverseSmartcontract/contracts/ipverseSmartcontract/)

---

## Project Structure

```
ipverse/
├── README.md
├── ipverse-admin/         # Admin dashboard (Next.js)
├── ipverse-user/          # User dashboard (Next.js)
├── ipverseBackend/        # Node.js/Express backend API
├── ipverseSmartcontract/  # Solidity smart contracts
```

---

## License

This project is licensed under the MIT License.

---

*Deployed on Base Camp Network. For more details, see individual module READMEs.*
