#!/bin/bash

# TaskFlow Vercel Deployment Script
# Usage: ./scripts/deploy-vercel.sh

set -e

echo "🚀 Starting TaskFlow deployment to Vercel..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_status "Checking requirements..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        print_error "git is not installed"
        exit 1
    fi
    
    print_success "All requirements met"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    npm ci
    print_success "Dependencies installed"
}

# Run tests
run_tests() {
    print_status "Running tests..."
    
    # Run unit tests
    if npm test; then
        print_success "Unit tests passed"
    else
        print_error "Unit tests failed"
        exit 1
    fi
    
    # Run build test
    if npm run build; then
        print_success "Build test passed"
    else
        print_error "Build failed"
        exit 1
    fi
}

# Check environment variables
check_env_vars() {
    print_status "Checking environment variables..."
    
    required_vars=(
        "DATABASE_URL"
        "NEXTAUTH_SECRET"
        "NEXTAUTH_URL"
    )
    
    missing_vars=()
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            missing_vars+=("$var")
        fi
    done
    
    if [ ${#missing_vars[@]} -ne 0 ]; then
        print_error "Missing required environment variables:"
        for var in "${missing_vars[@]}"; do
            echo "  - $var"
        done
        print_warning "Please set these variables in Vercel dashboard"
        print_warning "Or create .env.local file for local testing"
    else
        print_success "All required environment variables are set"
    fi
}

# Deploy to Vercel
deploy_to_vercel() {
    print_status "Deploying to Vercel..."
    
    # Check if vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        print_status "Installing Vercel CLI..."
        npm install -g vercel
    fi
    
    # Deploy
    if vercel --prod; then
        print_success "Deployment successful!"
    else
        print_error "Deployment failed"
        exit 1
    fi
}

# Run database migrations
run_migrations() {
    print_status "Running database migrations..."
    
    # Pull environment variables from Vercel
    if vercel env pull .env.local; then
        print_success "Environment variables pulled"
    else
        print_warning "Could not pull environment variables"
        print_warning "Make sure you're logged in to Vercel CLI"
    fi
    
    # Generate Prisma client
    if npx prisma generate; then
        print_success "Prisma client generated"
    else
        print_error "Failed to generate Prisma client"
        exit 1
    fi
    
    # Run migrations
    if npx prisma migrate deploy; then
        print_success "Database migrations completed"
    else
        print_error "Database migrations failed"
        exit 1
    fi
    
    # Seed database (optional)
    read -p "Do you want to seed the database? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if npx prisma db seed; then
            print_success "Database seeded"
        else
            print_warning "Database seeding failed (this is optional)"
        fi
    fi
}

# Verify deployment
verify_deployment() {
    print_status "Verifying deployment..."
    
    # Get deployment URL
    DEPLOYMENT_URL=$(vercel ls --scope=personal | grep -E "https://.*\.vercel\.app" | head -1 | awk '{print $2}')
    
    if [ -n "$DEPLOYMENT_URL" ]; then
        print_success "Deployment URL: $DEPLOYMENT_URL"
        
        # Test if site is accessible
        if curl -s --head "$DEPLOYMENT_URL" | head -n 1 | grep -q "200 OK"; then
            print_success "Site is accessible"
        else
            print_warning "Site might not be fully ready yet"
        fi
    else
        print_warning "Could not determine deployment URL"
    fi
}

# Cleanup
cleanup() {
    print_status "Cleaning up..."
    
    # Remove local environment file
    if [ -f ".env.local" ]; then
        rm .env.local
        print_success "Cleaned up local environment file"
    fi
}

# Main execution
main() {
    echo "🎯 TaskFlow Vercel Deployment Script"
    echo "======================================"
    
    check_requirements
    install_dependencies
    run_tests
    check_env_vars
    
    # Ask for confirmation
    read -p "Do you want to proceed with deployment? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_warning "Deployment cancelled"
        exit 0
    fi
    
    deploy_to_vercel
    run_migrations
    verify_deployment
    cleanup
    
    echo ""
    echo "🎉 Deployment completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Test your application thoroughly"
    echo "2. Set up monitoring and alerts"
    echo "3. Configure custom domain (if needed)"
    echo "4. Set up analytics tracking"
    echo ""
    print_success "Your TaskFlow application is now live!"
}

# Run main function
main "$@"
