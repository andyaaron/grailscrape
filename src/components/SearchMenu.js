import React, { useState } from 'react';
import algoliasearch from 'algoliasearch/lite';
import {InstantSearch, RefinementList, SearchBox, Hits} from 'react-instantsearch-hooks-web';
import Collapsible from '../helpers/Collapsible';
import PriceData from "./PriceData";
import LineGraph from "../graphs/LineGraph";

const SearchMenu = () => {

    const client = algoliasearch('MNRWEFSS2Q', 'bc9ee1c014521ccf312525a4ef324a16');
    const index = "Listing_sold_production"

    return (
        <div>
                <InstantSearch
                    searchClient={client}
                    indexName={index}
                >
                    <div className="search-form">
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
                        <>
                            <PriceData  />
                            <LineGraph  />
                        </>
                </InstantSearch>
        </div>
    );
};

export default SearchMenu;
