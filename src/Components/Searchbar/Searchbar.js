import React, { useState } from 'react';
import retroSearch from '../../Icons/retro-Search.png';
import { UseSearchbar } from './useSearchbar';

export const Searchbar = ({ subs, method }) => {
    const [query, setQuery] = useState()
    let ids = subs ? ["SSform", "SSinput", "SSicon"] : ['', 'searchbar', ''];
    const [form, input, icon] = ids;
    let timer;

    UseSearchbar(method, query);
    function handleSearch({target: { value }}) {
        let temp = subs ? [`subreddits/search.json?q=${encodeURI(value)}`, value] : { query: `search.json?q=${encodeURI(value)}`, active: `Search Results: ${value}` };
        setQuery(temp);
    }

    return (
        <div className="form" id={form} autocomplete="off">
            <input
                type="search"
                id={input}
                placeholder="Search Reddit..."
                autocomplete="false"
                name="hidden"
                onKeyUp={(e) => {
                    clearTimeout(timer);
                    timer = setTimeout(() => handleSearch(e), 500)
                }}
            />
            <div className="search-container">
                <img className="search-icon" id={icon} src={retroSearch} alt="Searchbar Icon" />
            </div>
        </div>
    );
}
