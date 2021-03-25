import { useEffect } from 'react'

export function useSearchbar(method, query) {

    useEffect(() => {
        if (method && query) method(query);
    }, [method, query]);

    return null;
}
