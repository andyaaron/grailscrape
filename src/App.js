import './App.css';

import algoliasearch from "algoliasearch";
import axios from 'axios';
import {useState} from "react";

function App() {
    const [designer, setDesigner] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [hits, setHits] = useState([]);

    // make an api request to algolia, submit a search term and designer name
    const handleSubmit = async (event) => {
        event.preventDefault();

        // setup client and index we want to search
        const client = algoliasearch('MNRWEFSS2Q', 'bc9ee1c014521ccf312525a4ef324a16');
        const index = client.initIndex('Listing_sold_production');

        try {

            // Make API GET request
            const response = await index.search(inputValue,{
                // facetFilters: [
                //     `designers.name:"${designer}"`
                // ],
                facets: ["department","category_path","category_size","designers.name","sold_price","condition","location","badges","strata"],
            })
            setHits(response.hits);
            setFormSubmitted(true);
        } catch (error) {
            console.error(error);
        }
    }


    const handleDesignerChange = (event) => {
        setDesigner(event.target.value);
    };

    const handleSearchChange = (event) => {
        setInputValue(event.target.value);
    };

    return (
        <div className="App">
            <header className="App-header">
                <h2>Grailscrape</h2>
                <p>Use this search tool to find the average price for a product.
                    The average is calculated from products found on grailed's sold filter.
                    To help get an accurate average, enter the designer name and the exact product name.
                    I'm trying to think of better ways to ensure an accurate representation of data is given.
                    If i can pull the sold listing images, the user could remove ones that do not pertain to
                    the product they are trying to get data for.
                </p>
            </header>

            <div className='container'>
                <form onSubmit={handleSubmit}>
                    <div className='designer-input'>
                        <label>Designer</label>
                        <input
                            type='search'
                            placeholder='Nike'
                            value={designer}
                            onChange={handleDesignerChange}
                        />
                    </div>
                    <div className='product-name-input'>
                        <label>Search</label>
                        <input
                            type='search'
                            value={inputValue}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <button>Submit</button>
                </form>

                <div className='results-container'>
                {formSubmitted && hits.length > 0 ? (
                    <div>
                        {hits.map((hit, index) => (
                            <p key={index}>
                                {hit['title']}
                            </p>
                        ))}
                    </div>
                ) : (
                    <div>
                        <p>No data returned!</p>
                    </div>
                )
                }
                </div>
            </div>
        </div>
    );
}

export default App;
