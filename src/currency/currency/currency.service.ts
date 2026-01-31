import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class CurrencyService {
    async convertGelToUsd(amountGel: number): Promise<number> {
        const url = 'https://open.er-api.com/v6/latest/GEL';

        const response = await axios.get(url);
        const rate = response.data.rates.USD;

        const converted = amountGel * rate;
        return Number(converted.toFixed(2));
    }

    // Fetch rate only (no multiplication)
    async getRate(target: string = 'USD'): Promise<number> {
        const url = 'https://open.er-api.com/v6/latest/GEL';
        const response = await axios.get(url);
        const rate = response.data.rates[target.toUpperCase()];

        if (!rate) throw new Error('Currency not supported');

        return rate;
    }
}
