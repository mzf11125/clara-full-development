#!/bin/bash

# Enhanced Koperasi DAO Deployment Script
# This script helps deploy and configure all contracts with proper addresses

echo "🚀 Starting Enhanced Koperasi DAO Deployment..."

# Check if clarinet is installed
if ! command -v clarinet &> /dev/null; then
    echo "❌ Clarinet is not installed. Please install it first."
    exit 1
fi

# Deploy contracts in dependency order
echo "📋 Deploying contracts..."

# 1. Deploy GovernorRegistry first (no dependencies)
echo "1️⃣ Deploying GovernorRegistry..."
clarinet deployments apply -p devnet --contracts GovernorRegistry

# 2. Deploy MembershipToken (depends on GovernorRegistry)
echo "2️⃣ Deploying MembershipToken..."
clarinet deployments apply -p devnet --contracts MembershipToken

# 3. Deploy GovernanceToken
echo "3️⃣ Deploying GovernanceToken..."
clarinet deployments apply -p devnet --contracts GovernanceToken

# 4. Deploy Treasury
echo "4️⃣ Deploying Treasury..."
clarinet deployments apply -p devnet --contracts Treasury

# 5. Deploy LoanManager
echo "5️⃣ Deploying LoanManager..."
clarinet deployments apply -p devnet --contracts LoanManager

# 6. Deploy ProfitSharing
echo "6️⃣ Deploying ProfitSharing..."
clarinet deployments apply -p devnet --contracts ProfitSharing

# 7. Deploy KoperasiGovernor (depends on all others)
echo "7️⃣ Deploying KoperasiGovernor..."
clarinet deployments apply -p devnet --contracts KoperasiGovernor

echo "✅ All contracts deployed!"

# Extract deployment addresses
echo "📋 Extracting deployment addresses..."

# Read deployment file and extract addresses
DEPLOYMENT_FILE="deployments/default.devnet-plan.yaml"

if [ -f "$DEPLOYMENT_FILE" ]; then
    echo "📄 Reading deployment addresses from $DEPLOYMENT_FILE"
    
    # Extract addresses (this would need to be adapted based on actual deployment file format)
    GOVERNOR_REGISTRY=$(grep -A1 "GovernorRegistry:" "$DEPLOYMENT_FILE" | tail -1 | awk '{print $2}')
    MEMBERSHIP_TOKEN=$(grep -A1 "MembershipToken:" "$DEPLOYMENT_FILE" | tail -1 | awk '{print $2}')
    GOVERNANCE_TOKEN=$(grep -A1 "GovernanceToken:" "$DEPLOYMENT_FILE" | tail -1 | awk '{print $2}')
    TREASURY=$(grep -A1 "Treasury:" "$DEPLOYMENT_FILE" | tail -1 | awk '{print $2}')
    LOAN_MANAGER=$(grep -A1 "LoanManager:" "$DEPLOYMENT_FILE" | tail -1 | awk '{print $2}')
    PROFIT_SHARING=$(grep -A1 "ProfitSharing:" "$DEPLOYMENT_FILE" | tail -1 | awk '{print $2}')
    KOPERASI_GOVERNOR=$(grep -A1 "KoperasiGovernor:" "$DEPLOYMENT_FILE" | tail -1 | awk '{print $2}')
    
    echo "🏗️ Deployed Contract Addresses:"
    echo "  GovernorRegistry: $GOVERNOR_REGISTRY"
    echo "  MembershipToken: $MEMBERSHIP_TOKEN"
    echo "  GovernanceToken: $GOVERNANCE_TOKEN"
    echo "  Treasury: $TREASURY"
    echo "  LoanManager: $LOAN_MANAGER"
    echo "  ProfitSharing: $PROFIT_SHARING"
    echo "  KoperasiGovernor: $KOPERASI_GOVERNOR"
    
    # Create environment file for frontend
    echo "📝 Creating environment file for frontend..."
    cat > "../koperasi-dao/.env.local" << EOF
# Koperasi DAO Contract Addresses (Auto-generated)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Core Contract Addresses
NEXT_PUBLIC_GOVERNOR_REGISTRY_ADDRESS=$GOVERNOR_REGISTRY
NEXT_PUBLIC_MEMBERSHIP_TOKEN_ADDRESS=$MEMBERSHIP_TOKEN
NEXT_PUBLIC_GOVERNANCE_TOKEN_ADDRESS=$GOVERNANCE_TOKEN
NEXT_PUBLIC_TREASURY_ADDRESS=$TREASURY
NEXT_PUBLIC_LOAN_MANAGER_ADDRESS=$LOAN_MANAGER
NEXT_PUBLIC_PROFIT_SHARING_ADDRESS=$PROFIT_SHARING
NEXT_PUBLIC_KOPERASI_GOVERNOR_ADDRESS=$KOPERASI_GOVERNOR

# Legacy compatibility
NEXT_PUBLIC_CONTRACT_ADDRESS=$KOPERASI_GOVERNOR
EOF
    
    echo "✅ Environment file created at ../koperasi-dao/.env.local"
    
    # Register contracts in GovernorRegistry
    echo "🔗 Registering contracts in GovernorRegistry..."
    
    # Note: These would need to be actual Clarinet commands
    echo "Run these commands to register contracts:"
    echo "clarinet console"
    echo "(contract-call? .governor-registry register-contract \"membership-token\" '$MEMBERSHIP_TOKEN)"
    echo "(contract-call? .governor-registry register-contract \"governance-token\" '$GOVERNANCE_TOKEN)"
    echo "(contract-call? .governor-registry register-contract \"treasury\" '$TREASURY)"
    echo "(contract-call? .governor-registry register-contract \"loan-manager\" '$LOAN_MANAGER)"
    echo "(contract-call? .governor-registry register-contract \"profit-sharing\" '$PROFIT_SHARING)"
    echo "(contract-call? .governor-registry register-contract \"koperasi-governor\" '$KOPERASI_GOVERNOR)"
    
else
    echo "❌ Deployment file not found. Please check if deployment was successful."
fi

echo ""
echo "🎉 Enhanced Koperasi DAO deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update contract constants with actual deployed addresses"
echo "2. Register contracts in GovernorRegistry"
echo "3. Initialize membership tokens for founding members"
echo "4. Test the governance system"
echo "5. Start the frontend application"
echo ""
echo "🚀 Ready to launch your enhanced koperasi!"
