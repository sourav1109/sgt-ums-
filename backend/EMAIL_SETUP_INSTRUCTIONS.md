# Email Configuration Setup Instructions

## Overview
The audit system is configured to automatically send monthly reports to hardcoded recipients. Additionally, administrators can manually trigger email sending from the UI.

## Email Recipients (Hardcoded)
The following email addresses will receive audit reports:
1. **sourav11092002@gmail.com** - Primary Admin (Monthly/Weekly/Daily)
2. **sourav092002@gmail.com** - Secondary Admin (Monthly/Weekly/Daily)
3. **dipanwitakundu2707@gmail.com** - Developer (Monthly/Weekly/Daily)
4. **registrar@sgtuniversity.ac.in** - Registrar (Monthly/Weekly)
5. **director.drd@sgtuniversity.ac.in** - Director DRD (Monthly/Weekly/Daily)
6. **vc@sgtuniversity.ac.in** - Vice Chancellor (Monthly only)
7. **admin.drd@sgtuniversity.ac.in** - DRD Admin (Monthly/Weekly/Daily)
8. **compliance@sgtuniversity.ac.in** - Compliance Officer (Monthly/Weekly/Daily)
9. **auditor@sgtuniversity.ac.in** - Internal Auditor (Monthly only)

## Gmail Setup for Nodemailer

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to **Security** section
3. Enable **2-Step Verification**

### Step 2: Generate App-Specific Password
1. Go to: https://myaccount.google.com/apppasswords
2. Select **Mail** as the app
3. Select **Other (Custom name)** as the device
4. Enter "SGT Research Portal" as the custom name
5. Click **Generate**
6. **Copy the 16-character password** (e.g., `abcd efgh ijkl mnop`)

### Step 3: Configure Environment Variables
Create or update the `.env` file in the `backend` directory:

```bash
# Email Configuration
EMAIL_USER=sourav11092002@gmail.com
EMAIL_PASS=your-16-character-app-password-here
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_FROM_NAME=SGT Research Portal
EMAIL_FROM_ADDRESS=sourav11092002@gmail.com
```

**Important:** 
- Remove any spaces from the app password (e.g., `abcdefghijklmnop`)
- Never commit the `.env` file to version control
- Keep the app password confidential

### Step 4: Test Email Configuration
After setting up the environment variables, restart the backend server:

```bash
cd backend
npm start
```

You should see in the logs:
```
✅ Email service initialized successfully
📅 Monthly audit report scheduled for 1st of each month at 00:00 IST
```

## Scheduled Sending

### Monthly Report
- **Schedule:** 1st day of every month at 00:00 IST
- **Recipients:** All 9 email addresses
- **Content:** Complete audit logs from previous month with statistics

### Weekly Report  
- **Schedule:** Every Monday at 00:00 IST
- **Recipients:** 7 email addresses (excludes VC and Auditor)
- **Content:** Audit logs from previous week

### Daily Report
- **Schedule:** Every day at 00:00 IST
- **Recipients:** 4 email addresses (Primary/Secondary Admin, Developer, Director DRD, DRD Admin, Compliance Officer)
- **Content:** Audit logs from previous day

## Manual Sending

### From Admin UI
1. Navigate to **Admin → Audit Logs**
2. Click the **"Send Report Now"** button in the header
3. Confirm the action
4. The system will immediately:
   - Generate a monthly report (current month to date)
   - Send it to all 9 configured recipients
   - Display success message with recipient count

### Via API
```bash
POST /api/audit/reports/send-email
Content-Type: application/json
Authorization: Bearer <your-token>

{
  "reportType": "monthly"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Monthly report sent successfully",
  "data": {
    "recipientCount": 9,
    "logCount": 1234,
    "dateRange": {
      "start": "2026-01-01",
      "end": "2026-01-15"
    }
  }
}
```

## Troubleshooting

### Email Not Sending
1. **Check environment variables:**
   ```bash
   echo $EMAIL_USER
   echo $EMAIL_PASS  # Should show the app password
   ```

2. **Verify SMTP connection:**
   - Check console logs for email service initialization
   - Look for error messages related to authentication

3. **Common Issues:**
   - **"Invalid login"** - Wrong app password or 2FA not enabled
   - **"Connection timeout"** - Firewall blocking port 587
   - **"Service unavailable"** - Email service not initialized

### Check Email Logs
All email sending attempts are logged in the audit system:
```sql
SELECT * FROM audit_logs 
WHERE action_type = 'EMAIL_SENT' 
ORDER BY created_at DESC;
```

### Verify Recipients
Check hardcoded recipients in the scheduler:
```bash
backend/src/services/auditScheduler.service.js
# Search for: getRecipients()
```

## Email Log Retention
- **Email logs:** Never deleted (permanent retention)
- **Error logs:** Never deleted (permanent retention)
- **Critical logs:** Never deleted (permanent retention)
- **Routine logs:** Kept for 365 days

## Security Notes
1. **Never commit `.env` file** - It contains sensitive credentials
2. **Rotate app passwords** - Change every 90 days
3. **Monitor failed attempts** - Check audit logs for authentication failures
4. **Use HTTPS only** - Never send credentials over HTTP
5. **Restrict API access** - Only admin roles can trigger manual sends

## Support
For issues or questions:
- Check backend console logs: `docker logs sgt-research-backend`
- Review audit logs in admin dashboard
- Contact: sourav11092002@gmail.com or dipanwitakundu2707@gmail.com
