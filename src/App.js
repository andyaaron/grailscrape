import {useState, useEffect} from "react";
import algoliasearch from "algoliasearch";
import axios from 'axios';

import LineGraph from "./LineGraph";
import './App.css';
import BarChart from "./BarChart";

// @TODO: Try using react instant search!
function App() {
    const [designer, setDesigner] = useState('');
    const [productName, setProductName] = useState('');
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [hits, setHits] = useState([]);

    useEffect(() => {
        // BarChart();
    }, []);

    // make an api request to algolia, submit a search term and designer name
    const handleSubmit = async (event) => {
        event.preventDefault();

        // setup client and index we want to search
        const client = algoliasearch('MNRWEFSS2Q', 'bc9ee1c014521ccf312525a4ef324a16');
        const index = client.initIndex('Listing_sold_production');

        try {

            let dates_and_prices = [];
            // Make API GET request
            const response = await index.search(productName,{
                facetFilters: "designers.name:"+designer,
                // query: productName,
                facets: ["department","category_path","category_size","designers.name","sold_price","condition","location","badges","strata"],
            })
            response.hits.forEach(hit => {
                // console.log(`hit: ${hit.sold_at}`);
                let data = {
                    sold_at: hit.sold_at,
                    sold_price: hit.sold_price,
                    url: hit.cover_photo.url,
                    title: hit.title
                };
                dates_and_prices.push(data);

            })
            setHits(dates_and_prices);
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
                <form onSubmit={handleSubmit}>
                    <div className='entry-field'>
                        <input
                            type='search'
                            placeholder='Designer'
                            aria-label='Enter Designer Name'
                            value={designer}
                            onChange={handleDesignerChange}
                        />
                    </div>
                    <div className='entry-field'>
                        <input
                            type='search'
                            placeholder='Product Name'
                            aria-label='Enter Product Name'
                            value={productName}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <div className='entry-field'>
                        <button aria-label='Search' role='button'>Submit</button>
                    </div>
                </form>

                {formSubmitted && hits.length > 0 ? (
                    <LineGraph data={hits} />
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
