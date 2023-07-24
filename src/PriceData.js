import React from "react";

const PriceData = ({data}) => {
    // Calculate the average of the sold_price values in a currency format
    const averageSoldPrice = (data.reduce((sum, d) => sum + d.sold_price, 0) / data.length).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    // Calculate the highest sold_price value
    const highestSoldPrice = () => {
        const highestPrice = Math.max(...data.map((item) => item.sold_price));
        return highestPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    // Calculate the lowest sold_price value in a currency format
    const getLowestSoldPrice = () => {
        return Math.min(...data.map((item) => item.sold_price)).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
        });
    };

    return (
        <div className="row data-calculations">
            <div className="average">
                <span>{averageSoldPrice}</span>
                <label>Average Sales Price</label>
            </div>
            <div className="total">
                <span>{data && data.length > 0 && data.length}</span>
                <label>Total Items</label>
            </div>
            <div className="lowest-price">
                <span>{data && data.length > 0 && getLowestSoldPrice()}</span>
                <label>Lowest Price</label>
            </div>
            <div className="highest-price">
                <span>{data && data.length > 0 && highestSoldPrice()}</span>
                <label>Highest Price</label>
            </div>

        </div>
    )
}

export default PriceData;
