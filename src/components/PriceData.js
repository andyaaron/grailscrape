import React from "react";
import {useHits} from "react-instantsearch-hooks-web";

const PriceData = ( props ) => {

    const { hits, results, sendEvent } = useHits(props);

    // console.log(`hit: ${JSON.stringify(hit)}`);
    // Calculate the average of the sold_price values in a currency format
    const averageSoldPrice = (hits.reduce((sum, d) => sum + d.sold_price, 0) / hits.length).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    const totalItems = hits.length;

    // Calculate the highest sold_price value
    const highestSoldPrice = () => {
        const highestPrice = Math.max(...hits.map((item) => item.sold_price));
        return highestPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    // Calculate the lowest sold_price value in a currency format
    const getLowestSoldPrice = () => {
        return Math.min(...hits.map((item) => item.sold_price)).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
        });
    };

    if (!results.query) {
        return (
            <div className="row data-calculations"></div>
        )
    }

    return (
        <div className="row data-calculations">
            <div className="average">
                <span>{averageSoldPrice}</span>
                <label>Average Sales Price</label>
            </div>
            <div className="total">
                <span>{totalItems}</span>
                <label>Total Items</label>
            </div>
            <div className="lowest-price">
                <span>{getLowestSoldPrice()}</span>
                <label>Lowest Price</label>
            </div>
            <div className="highest-price">
                <span>{highestSoldPrice()}</span>
                <label>Highest Price</label>
            </div>

        </div>
    )
}

export default PriceData;
