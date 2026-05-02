# 🔐 Invite-Only Admin System

## Features
✅ **Invite-Only Registration** - Only users with valid invite links can signup
✅ **Secure Authentication** - JWT tokens with bcrypt password hashing
✅ **Invite Management** - Generate, track, and manage invite links
✅ **Invite Expiry** - Links expire after 7 days
✅ **One-Time Use** - Each invite can only be used once
✅ **Email Validation** - Invite is tied to specific email address

## Setup Instructions

### 1. Create First Admin Account
```bash
cd backend
node createFirstAdmin.js
```

This will create:
- **Username**: `admin`
- **Password**: `Admin@123`

### 2. Start Backend Server
```bash
cd backend
npm start
```

### 3. Start Admin Dashboard
```bash
cd admin
npm start
```

### 4. Login as First Admin
- Open `http://localhost:3001`
- Login with username: `admin` and password: `Admin@123`

## How to Invite New Admins

### Step 1: Generate Invite Link
1. Login to admin dashboard
2. Go to **Invites** tab
3. Enter the email address of person you want to invite
4. Click **Generate Invite Link**
5. Copy the generated link

### Step 2: Share Invite Link
- Send the invite link to the person via email/message
- Link format: `http://localhost:3001/signup?token=xxx&email=xxx`
- Link is valid for **7 days**
- Link can only be used **once**

### Step 3: New Admin Signup
1. Person clicks on invite link
2. System verifies the invite token
3. Email is pre-filled (cannot be changed)
4. Person fills: Full Name, Username, Password
5. Account is created and invite is marked as used

## Invite Management Features

### Invite Status
- 🔗 **Active** - Valid and unused invite
- ✅ **Used** - Invite has been used to create account
- ⏰ **Expired** - Invite has expired (7 days passed)

### Invite Actions
- **Copy Link** - Copy invite link to clipboard (only for active invites)
- **Delete** - Remove invite from system

### Invite Details
- Email address
- Creation date
- Expiry date
- Status (Active/Used/Expired)
- Used by (if used)

## Security Features

1. **No Public Signup** - Signup page requires valid invite token
2. **Email Verification** - Invite is tied to specific email
3. **Token Expiry** - Invites expire after 7 days
4. **One-Time Use** - Each invite can only be used once
5. **Protected Routes** - Dashboard requires authentication
6. **JWT Tokens** - Secure session management
7. **Password Hashing** - bcrypt encryption

## API Endpoints

### Public Endpoints
- `POST /api/admin/login` - Admin login
- `POST /api/admin/signup` - Admin signup (requires invite token)
- `GET /api/admin/verify-invite/:token` - Verify invite token

### Protected Endpoints (Require JWT)
- `POST /api/admin/generate-invite` - Generate new invite
- `GET /api/admin/invites` - Get all invites
- `DELETE /api/admin/invites/:id` - Delete invite

## Database Models

### Admin Model
```javascript
{
  fullName: String,
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  timestamps: true
}
```

### InviteToken Model
```javascript
{
  token: String (unique),
  email: String,
  createdBy: ObjectId (Admin),
  isUsed: Boolean,
  usedBy: ObjectId (Admin),
  expiresAt: Date,
  timestamps: true
}
```

## Troubleshooting

### "No invite token provided"
- Make sure you're using the complete invite link
- Link should contain `?token=xxx&email=xxx`

### "Invalid invite token"
- Token might be expired (7 days)
- Token might have been deleted
- Token might be invalid

### "Invite token already used"
- This invite has already been used to create an account
- Request a new invite link

### "Email does not match invite"
- The email you entered doesn't match the invite
- Use the email that was invited

## Production Deployment

### Update URLs
1. In `backend/server.js` - Update invite link generation:
```javascript
const inviteLink = `https://your-domain.com/signup?token=${token}&email=${encodeURIComponent(email)}`;
```

2. In `admin/src/components/AdminDashboard.jsx` - Update copy link:
```javascript
`https://your-domain.com/signup?token=${invite.token}&email=${encodeURIComponent(invite.email)}`
```

### Environment Variables
```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
```

## Notes
- First admin must be created using `createFirstAdmin.js` script
- All subsequent admins must be invited by existing admins
- Invite links are single-use and expire after 7 days
- Keep your JWT_SECRET secure and never commit it to git
