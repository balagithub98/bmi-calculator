# Edge Function Setup Guide

## 🚀 BMI Email Edge Function Configuration

This guide will help you set up the Edge Function to send BMI results via email using Resend.

## 📋 Prerequisites

1. **Supabase CLI** installed
2. **Resend API Key** ready
3. **Verified domain** in Resend (for sending emails)

## 🔧 Step-by-Step Setup

### 1. Install Supabase CLI (if not already installed)

```bash
npm install -g supabase
```

### 2. Login to Supabase

```bash
supabase login
```

### 3. Link your project

```bash
supabase link --project-ref YOUR_PROJECT_REF
```

Replace `YOUR_PROJECT_REF` with your actual Supabase project reference (found in your project URL).

### 4. Set the Resend API Key as a secret

```bash
supabase secrets set RESEND_API_KEY=re_XLvEBGjK_45d4GVVSN9gvLh862Nx2VEvR
```

### 5. Deploy the Edge Function

```bash
supabase functions deploy send-bmi-email
```

### 6. Verify the deployment

```bash
supabase functions list
```

You should see `send-bmi-email` in the list.

## 🧪 Testing the Edge Function

### Test locally (optional)

```bash
supabase functions serve send-bmi-email --env-file .env.local
```

### Test the deployed function

You can test the function using curl or your browser:

```bash
curl -X POST 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-bmi-email' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "to": "test@example.com",
    "name": "Test User",
    "bmi": 24.2,
    "category": "Normal weight",
    "height": 170,
    "weight": 70,
    "heightUnit": "cm",
    "weightUnit": "kg",
    "age": 25,
    "gender": "male"
  }'
```

## 📧 Email Configuration

### From Email Address
The Edge Function is configured to send emails from: `no-reply@bullappex.com`

### Email Template
The function sends a beautifully formatted HTML email with:
- BMI score and category
- Personal details
- Health recommendations
- Professional styling

## 🔒 Security Notes

1. **API Key Protection**: The Resend API key is stored as a Supabase secret
2. **CORS Headers**: The function includes proper CORS headers
3. **Input Validation**: All required fields are validated
4. **Error Handling**: Comprehensive error handling and logging

## 🐛 Troubleshooting

### Common Issues

1. **"Resend API key not configured"**
   - Make sure you've set the secret: `supabase secrets set RESEND_API_KEY=your_key`

2. **"Function not found"**
   - Deploy the function: `supabase functions deploy send-bmi-email`

3. **"CORS error"**
   - The function includes CORS headers, but check your frontend configuration

4. **"Email not sending"**
   - Verify your Resend API key is valid
   - Check that `no-reply@bullappex.com` is verified in Resend
   - Check the function logs: `supabase functions logs send-bmi-email`

### View Function Logs

```bash
supabase functions logs send-bmi-email
```

## 🎯 Usage in Frontend

The frontend automatically calls the Edge Function when users click "Send Email" on the results page. The function will:

1. Validate the input data
2. Create a beautiful HTML email
3. Send it via Resend
4. Return success/error status

## 📱 Frontend Integration

The Edge Function is already integrated into the frontend via:
- `src/services/emailService.ts` - Service to call the function
- `src/components/ResultsDisplay.tsx` - UI with email button

## ✅ Success Indicators

When everything is working correctly:
1. Users see "Send Email" button on results page
2. Clicking sends email via Edge Function
3. Success message: "Email sent successfully! Check your inbox."
4. User receives beautifully formatted email with their BMI results

## 🔄 Updates and Maintenance

To update the Edge Function:

1. Modify the code in `supabase/functions/send-bmi-email/index.ts`
2. Deploy: `supabase functions deploy send-bmi-email`
3. Test the updated function

---

**Need help?** Check the Supabase documentation or function logs for detailed error messages.
