'use client';

import { useState, useEffect } from 'react';

interface ClientWrapperProps {
    children: React.ReactNode;
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Render children immediately, but with a key to force re-render after mount
    return (
        <div key={mounted ? 'mounted' : 'loading'}>
            {children}
        </div>
    );
} 