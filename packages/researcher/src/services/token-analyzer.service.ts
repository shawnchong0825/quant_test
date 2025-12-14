import axios from 'axios';

export class TokenAnalyzerService {
    private heliusUrl: string;

    constructor() {
        const apiKey = process.env.HELIUS_API_KEY;
        if (!apiKey) {
            console.warn('[TokenAnalyzer] HELIUS_API_KEY is missing. On-chain data will fail.');
        }
        this.heliusUrl = `https://mainnet.helius-rpc.com/?api-key=${apiKey}`;
    }

    /**
     * Fetch basic token metadata and liquidity info via Helius/RPC or specialized API.
     * For Phase 1, we might use a dedicated Token API (like Jupiter/Birdeye) if Helius RPC is too raw.
     * Let's use standard RPC 'getAsset' (DAS) if available, or just fallback to simple logic.
     */
    async analyzeToken(mintAddress: string) {
        console.log(`[TokenAnalyzer] Analyzing ${mintAddress}...`);

        try {
            // 1. Get Asset/Metadata (Helius DAS API)
            const response = await axios.post(this.heliusUrl, {
                jsonrpc: '2.0',
                id: 'my-id',
                method: 'getAsset',
                params: {
                    id: mintAddress
                }
            });

            if (response.data.error) {
                throw new Error(response.data.error.message);
            }

            const asset = response.data.result;
            console.log(`[TokenAnalyzer] Found Asset: ${asset?.content?.metadata?.name || 'Unknown'}`);

            return {
                name: asset?.content?.metadata?.name,
                symbol: asset?.content?.metadata?.symbol,
                supply: asset?.token_info?.supply,
                mint: mintAddress
            };

        } catch (error: any) {
            console.error('[TokenAnalyzer] RPC Error:', error.message);
            return null;
        }
    }
}
