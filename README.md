# Buyer Lead Management System

A comprehensive web application for managing buyer leads in real estate. Built with Next.js, Prisma, and PostgreSQL, this system provides a complete CRM solution for tracking potential buyers, managing their property preferences, and maintaining detailed lead history.

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure login/registration with JWT tokens
- **Lead Management**: Complete CRUD operations for buyer leads
- **Dashboard Analytics**: Real-time statistics and activity tracking
- **Advanced Search**: Filter leads by status, priority, and search terms
- **CSV Import/Export**: Bulk operations with comprehensive data validation
- **Lead History Tracking**: Automatic audit trail for all lead changes
- **Responsive Design**: Mobile-friendly interface with modern UI

### Lead Management Features
- **Comprehensive Lead Profiles**: Store detailed buyer information including contact details, property preferences, and financial information
- **Status Tracking**: Track leads through the entire sales funnel (New → Contacted → Qualified → Closed)
- **Priority Management**: Assign and track lead priorities (Low, Medium, High, Urgent)
- **Property Details**: Record property type, location, estimated value, and condition
- **Timeline Management**: Track desired purchase timeframes and motivations

### Data Management
- **Bulk Import**: Import leads from CSV files with automatic validation
- **Data Export**: Export filtered lead data to CSV format
- **Search & Filter**: Advanced filtering by multiple criteria
- **Pagination**: Efficient handling of large datasets
- **Audit Trail**: Complete history of all lead modifications

## 🛠️ Tech Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Modern component library built on Radix UI
- **React Hook Form**: Form management with validation
- **Zod**: Schema validation

### Backend
- **Next.js API Routes**: Server-side API endpoints
- **Prisma ORM**: Database toolkit and query builder
- **PostgreSQL**: Primary database
- **JWT**: Authentication tokens
- **bcryptjs**: Password hashing

### Development Tools
- **ESLint**: Code linting
- **TypeScript**: Type checking
- **Tailwind CSS**: Styling
- **Prisma Studio**: Database management GUI

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** or **pnpm** package manager
- **PostgreSQL** database (local or cloud)
- **Git** for version control

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Kurama07a/buyer-lead-app.git
   cd buyer-lead-app
   ```

2. **Install dependencies**
   ```bash
   # Using npm
   npm install

   # Using pnpm
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/buyer_leads"

   # JWT Secret (change this in production)
   JWT_SECRET="your-super-secret-jwt-key-change-in-production"

   # Next.js
   NEXTAUTH_SECRET="your-nextauth-secret"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run database migrations
   npx prisma db push

   # (Optional) Seed the database with sample data
   npx prisma db seed
   ```

5. **Start the development server**
   ```bash
   # Using npm
   npm run dev

   # Using pnpm
   pnpm dev
   ```

   The application will be available at `http://localhost:3000`

## 📖 Usage Guide

### Getting Started

1. **Register/Login**: Create an account or login with existing credentials
2. **Dashboard Overview**: View key metrics and recent activities
3. **Manage Leads**: Add, edit, and track buyer leads
4. **Import Data**: Bulk import leads from CSV files
5. **Export Data**: Export filtered lead data for external use

### Dashboard Features

- **Statistics Cards**: View total leads, status breakdowns, and priority distributions
- **Recent Activities**: Track the latest lead updates and changes
- **Quick Actions**: Fast access to create leads and perform bulk operations

### Lead Management

#### Creating Leads
1. Navigate to Dashboard → Leads → Create Lead
2. Fill in buyer information, property details, and preferences
3. Set initial status and priority
4. Save to create the lead record

#### Managing Leads
- **View All Leads**: Browse paginated list with search and filters
- **Edit Leads**: Update lead information and track changes
- **Status Updates**: Move leads through the sales pipeline
- **Priority Assignment**: Set and modify lead priorities

#### Bulk Operations
- **CSV Import**: Upload CSV files with multiple leads
- **CSV Export**: Download filtered lead data
- **Batch Updates**: Modify multiple leads simultaneously

## 📡 API Documentation

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

#### POST `/api/auth/login`
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

#### GET `/api/auth/me`
Get current user information (requires authentication).

#### POST `/api/auth/logout`
Logout user and invalidate session.

### Lead Management Endpoints

#### GET `/api/leads`
Get paginated list of leads with optional filters.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `status`: Filter by lead status
- `priority`: Filter by lead priority
- `search`: Search in name, email, and property address

#### POST `/api/leads`
Create a new lead (requires authentication).

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "555-123-4567",
  "propertyType": "SINGLE_FAMILY",
  "propertyAddress": "123 Main St",
  "propertyCity": "Springfield",
  "propertyState": "IL",
  "propertyZipCode": "62701",
  "status": "NEW",
  "priority": "MEDIUM"
}
```

#### GET `/api/leads/[id]`
Get detailed information for a specific lead.

#### PUT `/api/leads/[id]`
Update lead information (requires authentication).

#### DELETE `/api/leads/[id]`
Delete a lead (requires authentication).

### Dashboard Endpoints

#### GET `/api/dashboard/stats`
Get dashboard statistics and metrics.

#### GET `/api/dashboard/activities`
Get recent lead activities and changes.

### Import/Export Endpoints

#### POST `/api/leads/import`
Import leads from CSV file (requires authentication).

**Form Data:**
- `file`: CSV file containing lead data

#### GET `/api/leads/export`
Export leads to CSV format (requires authentication).

**Query Parameters:**
- `status`: Filter by status
- `priority`: Filter by priority
- `search`: Search filter

## 🗄️ Database Schema

### User Model
```sql
- id: String (Primary Key)
- email: String (Unique)
- name: String (Optional)
- password: String (Hashed)
- role: UserRole (USER/ADMIN)
- createdAt: DateTime
- updatedAt: DateTime
```

### Lead Model
```sql
- id: String (Primary Key)
- firstName: String
- lastName: String
- email: String
- phone: String (Optional)
- address: String (Optional)
- city: String (Optional)
- state: String (Optional)
- zipCode: String (Optional)
- propertyType: PropertyType
- propertyAddress: String
- propertyCity: String
- propertyState: String
- propertyZipCode: String
- estimatedValue: Float (Optional)
- desiredTimeframe: String (Optional)
- motivationForSelling: String (Optional)
- currentMortgageBalance: Float (Optional)
- propertyCondition: PropertyCondition (Optional)
- additionalNotes: String (Optional)
- leadSource: String (Optional)
- status: LeadStatus
- priority: Priority
- createdAt: DateTime
- updatedAt: DateTime
- createdById: String (Foreign Key)
- updatedById: String (Foreign Key, Optional)
```

### Lead History Model
```sql
- id: String (Primary Key)
- leadId: String (Foreign Key)
- field: String
- oldValue: String (Optional)
- newValue: String (Optional)
- action: HistoryAction
- timestamp: DateTime
- userId: String
```

### Enums

**PropertyType**: SINGLE_FAMILY, MULTI_FAMILY, CONDO, TOWNHOUSE, LAND, COMMERCIAL, OTHER

**PropertyCondition**: EXCELLENT, GOOD, FAIR, POOR, NEEDS_REPAIR

**LeadStatus**: NEW, CONTACTED, QUALIFIED, PROPOSAL_SENT, NEGOTIATING, UNDER_CONTRACT, CLOSED, LOST, ARCHIVED

**Priority**: LOW, MEDIUM, HIGH, URGENT

**HistoryAction**: CREATED, UPDATED, STATUS_CHANGED, ASSIGNED, NOTE_ADDED

## 📊 CSV Format

### Import Format
The CSV file should contain the following columns (in order):

```csv
First Name,Last Name,Email,Phone,Address,City,State,ZIP Code,Property Type,Property Address,Property City,Property State,Property ZIP Code,Estimated Value,Desired Timeframe,Motivation for Selling,Current Mortgage Balance,Property Condition,Additional Notes,Lead Source,Status,Priority
```

### Sample Data
```csv
John,Doe,john.doe@email.com,555-123-4567,123 Main St,Springfield,IL,62701,SINGLE_FAMILY,456 Oak Ave,Springfield,IL,62702,250000,3-6 months,Relocating to another state,150000,GOOD,Looking for a larger home,Website,NEW,MEDIUM
```

## 🔧 Development

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

### Database Management

```bash
# View database in Prisma Studio
npx prisma studio

# Reset database (development only)
npx prisma migrate reset

# Generate Prisma client after schema changes
npx prisma generate
```

### Project Structure

```
buyer-lead-app/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   └── login/             # Authentication pages
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── auth/             # Authentication components
│   ├── dashboard/        # Dashboard components
│   └── leads/            # Lead management components
├── lib/                  # Utility libraries
│   ├── auth.ts          # Authentication utilities
│   ├── prisma.ts        # Database client
│   └── csv-utils.ts     # CSV processing utilities
├── prisma/              # Database schema and migrations
├── public/              # Static assets
└── styles/              # Global styles
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use meaningful commit messages
- Write tests for new features
- Update documentation as needed
- Ensure code passes linting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/Kurama07a/buyer-lead-app/issues) page
2. Create a new issue with detailed information
3. Include error messages, screenshots, and steps to reproduce

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Prisma](https://prisma.io/) - Database toolkit
- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Radix UI](https://www.radix-ui.com/) - Low-level UI primitives

---

**Happy lead managing! 🎯**