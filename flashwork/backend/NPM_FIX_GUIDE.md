# NPM Issues & Fixes

## Issue: ECOMPROMISED Error

**Error Message:**
```
npm error code ECOMPROMISED
npm error Lock compromised
```

**Cause:**
The package-lock.json file's integrity check failed, usually due to:
- Manual edits to package-lock.json
- Corruption during git operations
- npm cache issues
- Interrupted npm operations

**Solution (Already Applied):**

```bash
# 1. Remove compromised lock file
rm package-lock.json

# 2. Remove node_modules
rm -rf node_modules

# 3. Clean npm cache
npm cache clean --force

# 4. Reinstall packages
npm install
```

## Current Warnings

### 1. Deprecated: crypto@1.0.1

**Warning:**
```
npm warn deprecated crypto@1.0.1: This package is no longer supported. 
It's now a built-in Node module.
```

**Fix:**
The `crypto` package is now built into Node.js. Remove it from dependencies:

```bash
npm uninstall crypto
```

Then update your code to use the built-in module:
```javascript
// Old way
const crypto = require('crypto');

// New way (same syntax, just remove from package.json)
const crypto = require('crypto');
```

### 2. Deprecated: multer@1.4.5-lts.2

**Warning:**
```
npm warn deprecated multer@1.4.5-lts.2: Multer 1.x is impacted by a number 
of vulnerabilities, which have been patched in 2.x.
```

**Fix:**
Upgrade to multer 2.x:

```bash
npm install multer@latest
```

**Note:** Multer 2.x may have breaking changes. Test file uploads after upgrading.

## Recommended Package Updates

Run these commands to update to latest secure versions:

```bash
# Update multer to v2
npm install multer@latest

# Remove deprecated crypto package
npm uninstall crypto

# Update all packages to latest compatible versions
npm update

# Check for security vulnerabilities
npm audit

# Fix vulnerabilities automatically (if any)
npm audit fix
```

## Prevention

To avoid future issues:

1. **Don't manually edit package-lock.json**
   - Let npm manage it automatically

2. **Commit package-lock.json to git**
   - Ensures consistent installs across environments

3. **Use npm ci for clean installs**
   ```bash
   npm ci  # Uses package-lock.json exactly as-is
   ```

4. **Regular updates**
   ```bash
   npm outdated  # Check for outdated packages
   npm update    # Update to latest compatible versions
   ```

5. **Security audits**
   ```bash
   npm audit     # Check for vulnerabilities
   npm audit fix # Auto-fix vulnerabilities
   ```

## Troubleshooting

### Issue: npm install fails

**Solution:**
```bash
# Clear cache and retry
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Issue: Permission errors

**Solution (Windows):**
```powershell
# Run PowerShell as Administrator
npm install
```

**Solution (Mac/Linux):**
```bash
# Don't use sudo with npm
# Instead, fix npm permissions:
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
# Add to PATH: export PATH=~/.npm-global/bin:$PATH
```

### Issue: Conflicting dependencies

**Solution:**
```bash
# Use --legacy-peer-deps flag
npm install --legacy-peer-deps

# Or use --force (not recommended)
npm install --force
```

## Current Status

✅ **Fixed:** ECOMPROMISED error resolved
✅ **Installed:** All 150 packages installed successfully
✅ **Generated:** Prisma Client generated
⚠️ **Warning:** 2 deprecated packages (crypto, multer)
✅ **Vulnerabilities:** 0 vulnerabilities found

## Next Steps

1. **Optional:** Remove deprecated crypto package
   ```bash
   npm uninstall crypto
   ```

2. **Optional:** Update multer to v2
   ```bash
   npm install multer@latest
   # Test file uploads after update
   ```

3. **Recommended:** Run security audit
   ```bash
   npm audit
   ```

4. **Start your server**
   ```bash
   npm start
   # or
   npm run dev
   ```
