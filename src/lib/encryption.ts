// Simple client-side encryption simulation for Hackathon MVP
// In a real production app, use Web Crypto API properly with user's public/private keys.

export async function generateAESKey(): Promise<string> {
  // Simulate key generation
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function encryptData(data: string, key: string): Promise<string> {
  // Simulate encryption (XOR for demo purposes or just base64 wrapping)
  // Real implementation would use AES-GCM
  const encoded = btoa(data); // Base64 encode as a placeholder for "encrypted" ciphertext
  return `enc_${key.substring(0, 4)}_${encoded}`;
}

export function decryptData(encryptedData: string, key: string) {
  if (!encryptedData.startsWith(`enc_${key.substring(0, 4)}_`)) {
    throw new Error("Invalid key or data");
  }
  const encoded = encryptedData.split("_")[2];
  return JSON.parse(atob(encoded));
}
