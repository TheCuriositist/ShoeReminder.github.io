import { useEffect } from 'react';
import { BRAND_NAME, BRAND_TAGLINE } from '@/config/branding';

export function BrandSEO() {
    useEffect(() => {
        document.title = `${BRAND_NAME} - ${BRAND_TAGLINE}`;
    }, []);

    return null;
}
