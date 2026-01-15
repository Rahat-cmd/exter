# Security Policy

## Reporting a Vulnerability

**⚠️ IMPORTANT DISCLAIMER:** This project involves Discord selfbot automation, which violates Discord's Terms of Service. By using this software, you accept all risks including potential Discord account termination, IP bans, and other consequences.

### How to Report Security Issues

If you discover a security vulnerability in EXTER, please **DO NOT** create a public GitHub issue. Instead, report it privately:

**Primary Contact:**
- **Discord:** `caramel_rahat` or `caramelgotnochill`
- **Email:** rahatfarehin@gmail.com
- **GitHub Security Advisory:** [Private vulnerability reporting](https://github.com/Rahat-cmd/exter/security/advisories/new)

### What to Include in Your Report
- Detailed description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fixes (if any)
- Your contact information

## Supported Versions

EXTER follows semantic versioning. Below are the currently supported versions:

| Version | Supported | Notes |
|---------|-----------|-------|
| 2.x.x   | ✅ Yes     | Current stable version |
| 1.x.x   | ❌ No      | Legacy - security updates discontinued |
| < 1.0   | ❌ No      | Initial releases - not supported |

### Version Support Timeline
- **Current Version:** 2.x.x (Full support)
- **Security Updates:** Only for current major version
- **End of Life:** Previous versions receive no security updates

## Types of Security Concerns

### Critical Issues (Respond within 24-48 hours):
- Token leakage or exposure vulnerabilities
- Remote code execution
- Authentication bypass
- Data exposure in logs or files

### High Priority Issues (Respond within 3-5 days):
- Denial of Service vulnerabilities
- Rate limit bypasses
- Connection hijacking risks
- Configuration file vulnerabilities

### Medium/Low Priority Issues (Respond within 1-2 weeks):
- Minor information disclosure
- Logging vulnerabilities
- Configuration issues

## What Constitutes a Security Vulnerability

### **IN SCOPE:**
- Vulnerabilities that could expose user tokens
- Code execution vulnerabilities
- Data leakage in the application
- Authentication/authorization bypasses
- Configuration file security issues

### **OUT OF SCOPE:**
- Discord's own API security (contact Discord)
- Issues related to violating Discord ToS (expected risk)
- General software bugs that don't pose security risks
- Feature requests or enhancements
- Problems with your system configuration

## Response Process

1. **Initial Response:** Within 48 hours of report
2. **Investigation:** 3-7 days to validate the issue
3. **Fix Development:** 1-2 weeks for patch development
4. **Release:** Security update released privately to reporter first
5. **Public Disclosure:** After 30 days or when patch is widely deployed

### Response Timeline Example:
**Day 1-2**: Acknowledge receipt
**Day 3-7**: Validate vulnerability
**Day 8-14**: Develop fix
**Day 15**: Private release to reporter
**Day 45**: Public release and disclosure
