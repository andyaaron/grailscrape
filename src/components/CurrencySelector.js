
import React, { useState } from 'react';

const CurrencySelector = ({ onChangeCurrency }) => {
    const [selectedCurrency, setSelectedCurrency] = useState('USD');

    const handleCurrencyChange = (event) => {
        const newCurrency = event.target.value;
        setSelectedCurrency(newCurrency);
        onChangeCurrency(newCurrency);
    };

    return (
        <div>
            <select
                id="currency"
                value={selectedCurrency}
                onChange={handleCurrencyChange}
                role="listbox"
                aria-label="select currency unit"
            >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                {/* Add more currency options as needed */}
            </select>
        </div>
    );
};

export default CurrencySelector;
