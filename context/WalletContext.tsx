"use client";
import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { BrowserProvider, Eip1193Provider } from "@coti-io/coti-ethers";
import { getStoredAesKey, storeAesKey } from "@/lib/data/storage";

const COTI_CHAIN_ID = 7082400;

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface WalletCtx {
  address: string | null;
  signer: any | null;
  isConnected: boolean;
  hasAesKey: boolean;
  isOnboarding: boolean;
  onboardStatus: string;
  connect: () => Promise<void>;
  disconnect: () => void;
  onboard: () => Promise<void>;
}

const Ctx = createContext<WalletCtx>({
  address: null, signer: null, isConnected: false,
  hasAesKey: false, isOnboarding: false, onboardStatus: "",
  connect: async () => {}, disconnect: () => {}, onboard: async () => {},
});

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [signer, setSigner] = useState<any | null>(null);
  const [hasAesKey, setHasAesKey] = useState(false);
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [onboardStatus, setOnboardStatus] = useState("");

  const switchToCoti = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: COTI_CHAIN_ID }],
      });
    } catch (err: any) {
      if (err.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [{
            chainId: COTI_CHAIN_ID,
            chainName: "COTI Testnet",
            nativeCurrency: { name: "COTI", symbol: "COTI", decimals: 18 },
            rpcUrls: ["https://testnet.coti.io/rpc"],
            blockExplorerUrls: ["https://testnet.cotiscan.io"],
          }],
        });
      }
    }
  };

  const connect = useCallback(async () => {
    if (!window.ethereum) { alert("MetaMask not found. Please install it."); return; }
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      await switchToCoti();
      const provider = new BrowserProvider(window.ethereum as Eip1193Provider);
      const s = await provider.getSigner();
      const addr = await s.getAddress();
      const aesKey = getStoredAesKey(addr);
      let finalSigner = s;
      if (aesKey && typeof (s as any).setUserOnboardInfo === "function") {
        (s as any).setUserOnboardInfo({ aesKey });
        finalSigner = s;
        setHasAesKey(true);
      }
      setSigner(finalSigner);
      setAddress(addr);
    } catch (e: any) {
      alert(e.message || "Connection failed");
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null); setSigner(null);
    setHasAesKey(false); setOnboardStatus("");
  }, []);

  const onboard = useCallback(async () => {
    if (!window.ethereum || !address || isOnboarding) return;
    const existing = getStoredAesKey(address);
    if (existing) {
      const provider = new BrowserProvider(window.ethereum as Eip1193Provider);
      const s = await provider.getSigner();
      if (typeof (s as any).setUserOnboardInfo === "function") {
        (s as any).setUserOnboardInfo({ aesKey: existing });
      }
      setSigner(s); setHasAesKey(true); setOnboardStatus("Ready"); return;
    }
    setIsOnboarding(true);
    setOnboardStatus("Generating encryption key...");
    try {
      const provider = new BrowserProvider(window.ethereum as Eip1193Provider);
      const s = await provider.getSigner();
      await s.generateOrRecoverAes();
      const info = s.getUserOnboardInfo();
      if (!info?.aesKey) throw new Error("AES key not returned");
      storeAesKey(address, info.aesKey);
      setSigner(s); setHasAesKey(true); setOnboardStatus("Ready");
    } catch (e: any) {
      const msg = e.message || "";
      if (msg.toLowerCase().includes("insufficient")) {
        alert("Insufficient COTI for gas. Get testnet tokens from the faucet first.");
      } else {
        alert("Privacy setup failed: " + msg);
      }
      setOnboardStatus("");
    } finally {
      setIsOnboarding(false);
    }
  }, [address, isOnboarding]);

  useEffect(() => {
    if (!window.ethereum) return;
    const onAccounts = (accs: string[]) => { if (!accs.length) disconnect(); };
    window.ethereum.on("accountsChanged", onAccounts);
    window.ethereum.on("chainChanged", () => window.location.reload());
    return () => {
      window.ethereum?.removeListener("accountsChanged", onAccounts);
      window.ethereum?.removeListener("chainChanged", () => {});
    };
  }, [disconnect]);

  return (
    <Ctx.Provider value={{
      address, signer, isConnected: !!address,
      hasAesKey, isOnboarding, onboardStatus,
      connect, disconnect, onboard,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export const useWallet = () => useContext(Ctx);
