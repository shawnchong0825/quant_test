
import axios from 'axios';

export class HeliusService {
    private apiKey: string;
    private rpcUrl: string;

    constructor() {
        this.apiKey = process.env.HELIUS_API_KEY || '';
        if (!this.apiKey) {
            throw new Error('HELIUS_API_KEY is missing');
        }
        this.rpcUrl = `https://mainnet.helius-rpc.com/?api-key=${this.apiKey}`;
    }

    /**
     * Fetch Token Metadata using Helius DAS API (getAsset)
     * @param mintAddress Token Mint Address
     */
    async getTokenMetadata(mintAddress: string) {
        try {
            const response = await axios.post(this.rpcUrl, {
                jsonrpc: '2.0',
                id: 'meme-lord-ai',
                method: 'getAsset',
                params: {
                    id: mintAddress
                }
            });

            if (response.data.error) {
                console.error('[HeliusService] RPC Error:', response.data.error);
                return null;
            }

            const asset = response.data.result;
            if (!asset) return null;

            return {
                name: asset.content?.metadata?.name || 'Unknown',
                symbol: asset.content?.metadata?.symbol || 'Unknown',
                decimals: asset.token_info?.decimals || 0,
                supply: asset.token_info?.supply || 0,
                // Additional fields can be added here
                mutable: asset.mutable,
                burnt: asset.burnt
            };

        } catch (error: any) {
            console.error('[HeliusService] API Failed:', error.message);
            return null;
        }
    }
}
