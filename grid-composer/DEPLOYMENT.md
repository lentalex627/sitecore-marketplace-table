# TableForge Deployment Guide

This guide covers deploying TableForge as a custom field integration to Sitecore XM Cloud.

## Prerequisites

Before deploying, ensure you have:

1. **Sitecore Cloud Portal Access**
   - Administrator access to your Sitecore organization
   - Permissions to create and manage marketplace apps

2. **Required Accounts**
   - Sitecore Cloud Portal account
   - XM Cloud subscription
   - (Optional) Vercel account for hosting

3. **Development Tools**
   - Node.js 16 or later
   - npm 10 or later
   - Git

## Build Process

### 1. Install Dependencies

```bash
npm install
```

### 2. Build the Application

```bash
npm run build
```

This creates an optimized production build in the `.next` directory.

### 3. Test Production Build Locally

```bash
npm start
```

Access the app at `http://localhost:3000` to verify the build works correctly.

## Deployment Options

### Option A: Deploy to Vercel (Recommended)

Vercel provides seamless Next.js hosting with automatic builds and deployments.

#### Steps:

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

4. **Note the Deployment URL**:
   - Vercel will provide a production URL (e.g., `https://tableforge.vercel.app`)
   - This URL will be used in Sitecore configuration

#### Continuous Deployment:

For automatic deployments on Git push:

1. Connect your Git repository to Vercel
2. Configure automatic deployments from your main branch
3. Each push triggers a new deployment

### Option B: Deploy to Other Hosting Providers

TableForge can be deployed to any platform that supports Next.js:

- **Netlify**: Use the Netlify CLI or Git integration
- **AWS Amplify**: Connect your Git repository
- **Azure Static Web Apps**: Deploy via Azure portal
- **Self-hosted**: Use Docker or direct Node.js hosting

For detailed instructions, refer to Next.js deployment documentation:
https://nextjs.org/docs/deployment

## Sitecore Marketplace Configuration

### 1. Create Marketplace App in Sitecore Cloud Portal

1. **Navigate to Sitecore Cloud Portal**:
   - Go to https://portal.sitecorecloud.io
   - Select your organization

2. **Access Marketplace Apps**:
   - Navigate to "Apps" → "Marketplace Apps"
   - Click "Create New App"

3. **Configure App Details**:
   ```
   App Name: TableForge
   Description: Interactive table builder custom field for Sitecore XM Cloud
   App URL: https://your-deployment-url.vercel.app
   Category: Custom Fields
   ```

4. **Set Extension Points**:
   - Select extension point: `xmc:pages:customfield`
   - This registers TableForge as a custom field integration

5. **Configure Resource Access** (if needed):
   - XM Cloud Authoring API (read/write for field data)
   - Any other APIs your app requires

6. **Set Permissions**:
   ```json
   {
     "iframe": {
       "sandbox": ["allow-popups", "allow-popups-to-escape-sandbox"],
       "allow": ["clipboard-write", "clipboard-read"]
     }
   }
   ```

### 2. App Manifest Configuration

Ensure your app has a proper manifest configuration. Create or update `public/manifest.json`:

```json
{
  "name": "TableForge",
  "short_name": "TableForge",
  "description": "Interactive table builder custom field for Sitecore XM Cloud",
  "version": "0.1.0",
  "author": "Your Organization",
  "extensionPoints": [
    {
      "type": "xmc:pages:customfield",
      "route": "/",
      "title": "TableForge",
      "description": "Visual table builder with inline editing",
      "iconUrl": "/icon.png"
    }
  ],
  "resourceAccess": []
}
```

### 3. Create Custom Field Template in Sitecore

1. **Navigate to Content Editor** in XM Cloud
2. **Create Field Template**:
   - Template Name: "TableForge Field"
   - Base Template: Standard Template
   - Field Type: Single-Line Text or Multi-Line Text (for JSON storage)

3. **Configure Field to Use TableForge**:
   - In the field definition, set the custom field integration to "TableForge"
   - This associates the field with your marketplace app

## Environment Variables

If your app requires environment variables:

### Local Development (`.env.local`):
```env
# Add any required environment variables
NEXT_PUBLIC_APP_NAME=TableForge
NEXT_PUBLIC_APP_VERSION=0.1.0
```

### Production (Vercel/Hosting Provider):
Configure environment variables in your hosting provider's dashboard.

## Security Considerations

### 1. CORS Configuration

Ensure your app allows embedding from Sitecore domains:

```typescript
// next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOW-FROM https://*.sitecorecloud.io',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://*.sitecorecloud.io",
          },
        ],
      },
    ];
  },
};
```

### 2. Origin Validation

The Marketplace SDK automatically validates origins. Ensure your app is accessed only through:
- Sitecore Cloud Portal domains
- Your configured app URL

### 3. HTTPS Only

Always deploy to HTTPS endpoints. Sitecore requires secure connections.

## Testing in Sitecore

### 1. Install App in XM Cloud

1. Navigate to your XM Cloud instance
2. Go to Marketplace
3. Find and install "TableForge"
4. Grant necessary permissions

### 2. Create Test Content

1. Create a new content item with a TableForge field
2. Open the item in Content Editor or Experience Editor
3. The TableForge interface should load in the field editor

### 3. Test Functionality

Verify:
- ✅ Table loads correctly (or creates new table)
- ✅ Can add/remove rows and columns
- ✅ Inline cell editing works
- ✅ Row/column reordering functions
- ✅ Cell formatting applies correctly
- ✅ Save button persists data to Sitecore
- ✅ Cancel button reverts changes
- ✅ Refresh shows saved data

### 4. Debugging

If issues occur:

1. **Open Browser DevTools**:
   - Check Console for errors
   - Verify SDK initialization
   - Monitor network requests

2. **Common Issues**:
   - **SDK not initializing**: Check app URL and extension point configuration
   - **getValue() fails**: Ensure field exists and app has read permissions
   - **setValue() fails**: Check write permissions and data format
   - **CORS errors**: Verify CORS headers in deployment

## Monitoring & Maintenance

### 1. Error Tracking

Consider integrating error tracking:
- Sentry
- LogRocket
- Datadog

### 2. Analytics

Track usage patterns:
- Google Analytics
- Mixpanel
- Custom analytics

### 3. Updates

For deploying updates:

1. Make changes in your codebase
2. Test locally
3. Deploy to production (automatic with Git integration)
4. Sitecore automatically uses the new version (no app reinstall needed)

### 4. Versioning

Follow semantic versioning:
- **Major**: Breaking changes to data structure
- **Minor**: New features, backward compatible
- **Patch**: Bug fixes

Update version in `package.json` and `manifest.json`.

## Rollback Procedures

If a deployment causes issues:

### Vercel:
1. Navigate to Vercel dashboard
2. Go to Deployments
3. Find previous working deployment
4. Click "Promote to Production"

### Other Platforms:
Follow your hosting provider's rollback procedures.

## Performance Optimization

### 1. Bundle Size

Monitor and optimize bundle size:
```bash
npm run build
# Check .next/static for bundle sizes
```

### 2. Lazy Loading

Consider lazy loading heavy components:
```typescript
const TableBuilder = dynamic(() => import('./table-builder'), {
  loading: () => <div>Loading...</div>
});
```

### 3. Caching

Leverage Next.js caching strategies for static assets.

## Compliance & Legal

Ensure your deployment complies with:
- Data privacy regulations (GDPR, CCPA)
- Sitecore marketplace terms of service
- Your organization's security policies

## Support & Documentation

Provide users with:
- Link to TABLEFORGE_README.md
- Support contact information
- Known issues and workarounds
- Feature request process

## Checklist

Before going live:

- [ ] All dependencies installed and up to date
- [ ] Production build succeeds without errors
- [ ] Environment variables configured
- [ ] App deployed to production URL
- [ ] HTTPS enabled on deployment URL
- [ ] CORS headers configured correctly
- [ ] Marketplace app created in Sitecore Cloud Portal
- [ ] Extension point configured as `xmc:pages:customfield`
- [ ] App tested in actual XM Cloud environment
- [ ] All core features working (CRUD operations, formatting)
- [ ] Error handling tested
- [ ] Documentation updated
- [ ] Support process established

## Post-Deployment

After successful deployment:

1. **Announce to Users**:
   - Send announcement email
   - Provide training/documentation
   - Set up support channel

2. **Monitor Initial Usage**:
   - Watch for error reports
   - Track usage patterns
   - Gather user feedback

3. **Iterate**:
   - Address issues quickly
   - Plan future enhancements based on feedback
   - Keep documentation updated

---

**Questions or Issues?**
Refer to the Sitecore Marketplace SDK documentation or contact Sitecore support.
