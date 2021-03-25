import { useEffect } from 'react'

export function UseSearchbar(method, query) {
    useEffect(() => {
        if (method && query) method(query);
    }, [method, query]);

    return null;
}
