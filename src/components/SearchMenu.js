import React, { useState } from 'react';
import algoliasearch from 'algoliasearch/lite';
import {InstantSearch, RefinementList, SearchBox, Hits} from 'react-instantsearch-hooks-web';
import Collapsible from '../helpers/Collapsible';
import PriceData from "./PriceData";
import LineGraph from "../graphs/LineGraph";

const SearchMenu = (props) => {

    return (
        <div>
            <div className={`search-form ${props.toggleMenu ? 'open' : 'closed'}`}>
                <SearchBox />
                <div className={"filters"}>
                    <Collapsible title="Category">
                        <RefinementList attribute="category" operator="and" />
                    </Collapsible>

                    <Collapsible title="Designer">
                        <RefinementList attribute="designers.name" operator="and" />
                    </Collapsible>

                    <Collapsible title="Location">
                        <RefinementList attribute="location" operator="and" />
                    </Collapsible>
                </div>
            </div>
        </div>
    );
};

export default SearchMenu;
