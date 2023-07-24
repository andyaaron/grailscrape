import {useState, useEffect} from "react";
import algoliasearch from "algoliasearch";
import {InstantSearch, RefinementList, SearchBox, Hits} from 'react-instantsearch-hooks-web';

import LineGraph from "../graphs/LineGraph";
import PriceData from "./PriceData";

import '../css/App.css';

// @TODO: Try using react instant search!
function App() {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [designer, setDesigner] = useState('');
    const [productName, setProductName] = useState('');
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [hits, setHits] = useState([]);
    const [nbHits, setNbHits] = useState(0); // page count
    const categoryOptions = [
        {'tops': []},
        {'bottoms': ['casual_pants', 'jumpsuits']},
        'outerwear', 'footwear', 'accessories'
    ];

    useEffect(() => {
        // BarChart();
    }, []);


    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    const client = algoliasearch('MNRWEFSS2Q', 'bc9ee1c014521ccf312525a4ef324a16');
    const index = client.initIndex('Listing_sold_production');
    // make an api request to algolia, submit a search term and designer name
    const handleSubmit = async (event) => {
        event.preventDefault();

        // setup client and index we want to search

        try {

            let dates_and_prices = [];
            // Make API GET request
            const response = await index.search(productName,{
                facetFilters: "designers.name:"+designer,
                // query: productName,
                facets: ["department","category_path","category_size","designers.name","sold_price","condition","location","badges","strata"],
            })
            response.hits.forEach(hit => {
                let data = {
                    sold_at: hit.sold_at,
                    sold_price: hit.sold_price,
                    url: hit.cover_photo.url,
                    title: hit.title,

                };
                dates_and_prices.push(data);

            })
            setHits(dates_and_prices);
            setNbHits(response.nbHits);
            setFormSubmitted(true);
        } catch (error) {
            console.error(error);
        }
    }


    const handleDesignerChange = (event) => {
        setDesigner(event.target.value);
    };

    const handleSearchChange = (event) => {
        setProductName(event.target.value);
    };

    return (
        <div className="App">
            <header className="App-header">
                <h2>GrailSight</h2>
            </header>

            <div className='container'>
                <InstantSearch searchClient={client} indexName="Listing_sold_production">
                <div className="search-form">
                    <SearchBox />
                    <div className={"filters"}>
                        <h3>Category</h3>
                        <RefinementList attribute="category" operator="and" />

                        <h3>Location</h3>
                        <RefinementList attribute="location" operator="and" />
                    </div>
                </div>
                    {hits && (
                    <>
                        <PriceData data={hits} />
                        <LineGraph data={hits} />
                    </>
                    )}
                </InstantSearch>
                {/*<form onSubmit={handleSubmit}>*/}
                {/*    <div className='entry-field'>*/}
                {/*        <input*/}
                {/*            type='search'*/}
                {/*            placeholder='Designer'*/}
                {/*            aria-label='Enter Designer Name'*/}
                {/*            value={designer}*/}
                {/*            onChange={handleDesignerChange}*/}
                {/*        />*/}
                {/*    </div>*/}
                {/*    <div className='entry-field'>*/}
                {/*        <input*/}
                {/*            type='search'*/}
                {/*            placeholder='Product Name'*/}
                {/*            aria-label='Enter Product Name'*/}
                {/*            value={productName}*/}
                {/*            onChange={handleSearchChange}*/}
                {/*        />*/}
                {/*    </div>*/}
                {/*    <div className={'entry-field'}>*/}
                {/*       <select>*/}

                {/*       </select>*/}
                {/*    </div>*/}
                {/*    <div className='entry-field'>*/}
                {/*        <button aria-label='Search' role='button'>Submit</button>*/}
                {/*    </div>*/}
                {/*</form>*/}


                {hits.length > 0 ? (
                    <>
                        <PriceData data={hits} />
                        <LineGraph data={hits} />
                    </>
                ) : (
                    <div>
                        <p>No data returned!</p>
                    </div>
                )
                }
            </div>
        </div>
    );
}

export default App;