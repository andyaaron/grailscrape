import React, {useState, useEffect} from "react";
import algoliasearch from "algoliasearch";
import {InstantSearch} from "react-instantsearch-hooks-web";

import SearchMenu from "./SearchMenu";
import PriceData from "./PriceData";
import LineGraph from "../graphs/LineGraph";
import CurrencySelector from "./CurrencySelector";

function App() {
    const [toggleMenu, setToggleMenu] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [hits, setHits] = useState([]);
    const [currency, setCurrency] = useState('USD');

    const handleCurrencyChange = (newCurrency) => {
        setCurrency(newCurrency);
    };

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    const toggleSearchMenu = () => {
        setToggleMenu(!toggleMenu);
    };

    const client = algoliasearch('MNRWEFSS2Q', 'bc9ee1c014521ccf312525a4ef324a16');
    const index = "Listing_sold_production"

    return (
        <div className="App">
            <header className="App-header">
                <h2>GrailSight</h2>
                <CurrencySelector onChangeCurrency={handleCurrencyChange} />
                <div role="button" className={`icon search${toggleMenu ? '-open' : ''}`} onClick={toggleSearchMenu}></div>
            </header>

            <InstantSearch searchClient={client}  indexName={index}>
                <SearchMenu toggleMenu={toggleMenu} client={client} index={index} hits={hits} />
                <div className='container'>
                    <PriceData hits={hits} currency={currency}  />
                    <LineGraph hits={hits} />
                </div>
            </InstantSearch>
        </div>
    );
}

export default App;
