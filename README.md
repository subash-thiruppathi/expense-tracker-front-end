# Expense Approval System - Frontend

A comprehensive React.js frontend application for a multi-level expense approval system with JWT authentication and a three-tier approval workflow (Manager → Accountant → Admin).

## 🚀 Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (EMPLOYEE, MANAGER, ACCOUNTANT, ADMIN)
- Protected routes with automatic redirects
- Auto-logout on token expiration

### Role-Based Dashboards
- **Employee Dashboard**: Submit expenses, view submission history
- **Manager Dashboard**: First-level approvals (Level 1)
- **Accountant Dashboard**: Second-level approvals (Level 2)
- **Admin Dashboard**: Final approvals (Level 3), system overview

### Expense Management
- **Expense Submission**: Rich form with file upload for receipts
- **Expense Tracking**: Real-time status updates with approval timeline
- **Advanced Filtering**: Search, filter by status/category/date range
- **Responsive Tables**: Sortable columns with pagination

### Approval Workflow
- Three-tier approval process: Manager → Accountant → Admin
- Status tracking: PENDING → MANAGER_APPROVED → ACCOUNTANT_APPROVED → FULLY_APPROVED
- Rejection handling with mandatory remarks
- Approval timeline with detailed history

### UI/UX Features
- Modern Ant Design components
- Responsive design (mobile-first)
- Dark/light theme support
- Loading states and error handling
- Success/error notifications
- File upload with validation

## 🛠 Technology Stack

- **React 18+** with TypeScript
- **Ant Design** for UI components
- **React Router v6** for navigation
- **TanStack Query** for data fetching and caching
- **Axios** for API communication
- **Day.js** for date handling
- **Context API** for state management

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running on `http://localhost:3000/api`

## 🚀 Getting Started

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd expense-approval-front-end
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_API_BASE_URL=http://localhost:3001/api
   REACT_APP_UPLOAD_URL=http://localhost:3001/uploads
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
src/
├── components/
│   ├── common/
│   │   ├── Header.tsx           # Application header with user info
│   │   ├── Sidebar.tsx          # Role-based navigation sidebar
│   │   ├── Layout.tsx           # Main layout wrapper
│   │   └── ProtectedRoute.tsx   # Route protection component
│   └── auth/
│       ├── LoginForm.tsx        # User login form
│       └── RegisterForm.tsx     # User registration form
├── pages/
│   ├── Dashboard.tsx            # Role-based dashboard
│   ├── SubmitExpense.tsx        # Expense submission form
│   ├── MyExpenses.tsx           # Employee expense list
│   ├── PendingApprovals.tsx     # Approval management
│   ├── AllExpenses.tsx          # Admin expense overview
│   └── ExpenseDetails.tsx       # Detailed expense view
├── services/
│   ├── api.ts                   # Axios configuration
│   ├── auth.service.ts          # Authentication services
│   └── expense.service.ts       # Expense API services
├── context/
│   └── AuthContext.tsx          # Authentication context
├── types/
│   └── index.ts                 # TypeScript type definitions
├── utils/
│   └── constants.ts             # Application constants
├── App.tsx                      # Main application component
└── index.tsx                    # Application entry point
```

## 🔐 User Roles & Permissions

### EMPLOYEE
- Submit new expenses
- View own expense history
- Track approval status

### MANAGER
- All employee permissions
- Approve/reject Level 1 expenses
- View pending Level 1 approvals

### ACCOUNTANT
- All manager permissions
- Approve/reject Level 2 expenses
- View pending Level 2 approvals

### ADMIN
- All accountant permissions
- Final approval/rejection (Level 3)
- View all system expenses
- Export functionality
- System analytics

## 🔄 Expense Status Flow

```
PENDING → MANAGER_APPROVED → ACCOUNTANT_APPROVED → FULLY_APPROVED
    ↓              ↓                    ↓
REJECTED       REJECTED            REJECTED
```

## 🎨 UI Components

### Key Features
- **Responsive Design**: Mobile-first approach with breakpoints
- **Status Indicators**: Color-coded tags for expense statuses
- **Data Tables**: Sortable, filterable with pagination
- **File Upload**: Drag-and-drop with validation
- **Modal Dialogs**: Confirmation and detail views
- **Timeline**: Visual approval progress tracking

### Color Scheme
- Primary: Blue (#1976d2)
- Success: Green (#4caf50)
- Warning: Orange (#ff9800)
- Error: Red (#f44336)
- Pending: Orange (#ffa500)
- Approved: Green (#32cd32)
- Rejected: Red (#dc143c)

## 🔧 API Integration

### Authentication Endpoints
```typescript
POST /auth/login     // User login
POST /auth/register  // User registration
```

### Expense Endpoints
```typescript
POST /expenses                    // Submit new expense
GET /expenses/my                  // Get user's expenses
GET /expenses/pending-approvals   // Get pending approvals
GET /expenses/:id                 // Get expense details
POST /expenses/:id/approve        // Approve/reject expense
GET /expenses                     // Get all expenses (Admin)
```

## 🧪 Testing

Run the test suite:
```bash
npm test
```

## 🏗 Building for Production

Create a production build:
```bash
npm run build
```

The build artifacts will be stored in the `build/` directory.

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔒 Security Features

- JWT token management with automatic refresh
- XSS protection through input sanitization
- CSRF protection
- Role-based UI rendering
- Secure file upload validation

## 🚀 Performance Optimizations

- Code splitting with React.lazy()
- Image optimization
- API response caching with TanStack Query
- Virtual scrolling for large datasets
- Debounced search inputs

## 🐛 Error Handling

- Global error boundary
- API error interceptors
- User-friendly error messages
- Retry mechanisms for failed requests
- Offline state handling

## 📊 Features in Detail

### Dashboard Analytics
- Real-time expense statistics
- Role-based data visualization
- Monthly/yearly trends
- Approval time metrics

### Advanced Filtering
- Multi-criteria search
- Date range selection
- Status and category filters
- Saved filter presets

### File Management
- Multiple file format support (JPG, PNG, GIF, PDF)
- File size validation (max 5MB)
- Image preview functionality
- Secure file download

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

- Real-time notifications with WebSockets
- Advanced analytics dashboard
- Mobile app development
- Integration with accounting systems
- Automated approval rules
- Multi-language support

---

**Built with ❤️ using React, TypeScript, and Ant Design**
