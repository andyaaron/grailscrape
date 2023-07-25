import React, {useState, useEffect} from "react";
import algoliasearch from "algoliasearch";
import SearchMenu from "./SearchMenu";

// @TODO: Try using react instant search!
function App() {
    const [isSearchMenuOpen, setIsSearchMenuOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [hits, setHits] = useState([]);

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    const toggleSearchMenu = () => {
        setIsSearchMenuOpen(!isSearchMenuOpen);
    };

    const client = algoliasearch('MNRWEFSS2Q', 'bc9ee1c014521ccf312525a4ef324a16');
    const index = "Listing_sold_production"
    return (
        <div className="App">
            <header className="App-header">
                <h2>GrailSight</h2>
                <div role="button" className={`icon search${isSearchMenuOpen ? '-open' : ''}`} onClick={toggleSearchMenu}></div>
            </header>

            {isSearchMenuOpen && <SearchMenu client={client} index={index} hits={hits} />}

            <div className='container'>

            </div>
        </div>
    );
}

export default App;
