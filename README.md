# LuckyCoin Wallet

LuckyCoin Wallet - The only wallet you need to store, send, and receive LuckyCoin!

---

## Version 0.0.1 - Simplifying Your LuckyCoin Experience

### Welcome to LuckyCoin Wallet

We’re excited to present LuckyCoin Wallet, your go-to tool for everything LuckyCoin. Designed with user experience and security in mind, LuckyCoin Wallet isn’t just about transactions; it’s about making digital assets easy and accessible.

---

## Getting Started

### Installation

#### Step 1: Install `bun.sh` (if not already installed)

```bash
curl -fsSL https://bun.sh/install | bash
```

#### Step 2: Install Dependencies

```bash
bun i
```

---

### Browser Extension Setup

#### Chrome

1. Build the extension for Chrome:
   ```bash
   bun chrome
   ```
2. In Chrome, navigate to **chrome://extensions**.
3. Enable **Developer mode** in the top right corner.
4. Select **Load unpacked** and choose the `dist/chrome` folder from the project directory.

#### Firefox

1. Build the extension for Firefox:
   ```bash
   bun firefox
   ```
2. Go to **about:debugging#/runtime/this-firefox** in Firefox.
3. Click on **Load Temporary Add-on** and select the `dist/firefox` folder from the project directory.
