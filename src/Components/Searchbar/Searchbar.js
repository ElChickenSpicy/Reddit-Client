import React, { useState } from 'react';
import retroSearch from '../../Icons/retro-Search.png';
import { useSearchbar } from './useSearchbar';

export const Searchbar = ({ subs, method }) => {
    const [query, setQuery] = useState()
    let form = '';
    let input = 'searchbar';
    let icon = '';
    if (subs) {
        form = "SSform";
        input = "SSinput";
        icon = "SSicon"
    }

    useSearchbar(method, query);
    function handleSearch({target: { value }}) {
        let temp = subs ? [`subreddits/search.json?q=${encodeURI(value)}`, value] : { query: `search.json?q=${encodeURI(value)}`, active: `Search Results: ${value}` };
        setQuery(temp);
    }

    return (
        <div className="form" id={form} autocomplete="off">
            <input
                type="text"
                id={input}
                placeholder="Search Reddit..."
                autocomplete="false"
                name="hidden"
                onChange={handleSearch} 
            />
            <div className="search-container">
                <img className="search-icon" id={icon} src={retroSearch} alt="Searchbar Icon" />
            </div>
        </div>
    );
}
