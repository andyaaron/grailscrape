import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import dayjs from 'dayjs';
import {useHits} from "react-instantsearch-hooks-web";
import {sanitizeForURL} from "../helpers/helpers";

const LineGraph = ( props ) => {
    const svgRef = useRef();
    const { hits, results, sendEvent } = useHits(props);
    useEffect(() => {
        if (!results.query) {
            clearGraph();
            return;
        }

        const sortedData = hits.slice().sort((a, b) => a.sold_at - b.sold_at);
        createGraph(sortedData);

    }, [hits]);


    // Function to handle data point click event
    const handleDataPointClick = (event, dataPoint) => {
        const additionalDataDiv = document.querySelector('.additional-product-info');
        if (additionalDataDiv) {
            // Clear the existing content of the div
            additionalDataDiv.innerHTML = '';

            // Append the relevant data to the div
            additionalDataDiv.innerHTML = `
                <div class="header">
                    <h3><a href="https://grailed.com/listings/${dataPoint.objectID}-${dataPoint.designer_names}-${sanitizeForURL(dataPoint.title)}">${dataPoint.title}</a></h3>
                </div>
                <div class="flex-container">
                    <div class="column">
                        <div class="image">
                                <img src="${dataPoint.cover_photo.url}" />
                        </div>
                    </div>
                    <div class="column">
                        <div class="sold-price"><b>Sold Price</b>: ${dataPoint.sold_price.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
            })}</div>
                        <div class="sold-date">
                            <b>Sold At</b>: ${dayjs(dataPoint.sold_at).format('MM-DD-YYYY')}
                        </div>
                        <div class="link">
                              <a href="https://grailed.com/listings/${dataPoint.objectID}-${dataPoint.designer_names}-${sanitizeForURL(dataPoint.title)}">→View Listing</a>
                        </div>
                    </div>
                </div>
                `;

            // additionalDataDiv.appendChild(dataPointInfo);
        }
    };
    const createGraph = async (data) => {
        const margin = { top: 20, right: 30, bottom: 30, left: 30 };
        const maxWidth = 600;
        const width = Math.min(window.innerWidth - margin.left - margin.right, maxWidth);
        const height = 400 - margin.top - margin.bottom;

        // Format date in "MM-DD-YYYY" format
        const formatDate = d3.timeFormat('%Y-%m-%d');


        // Parse the date format and convert sold_price values to numbers
        data.forEach((d) => {
            let sold_at = new Date(d.sold_at); // format the date
            d.sold_at = new Date(sold_at);
            d.sold_price = +d.sold_price;
            d.url = d.url;
            d.title = d.title;
        })

        // Create scales for x and y axes
        const xScale = d3.scaleTime().range([0, width]);

        const yScale = d3.scaleLinear().range([height, 0]);

        // Create the area function
        const area = d3
            .area()
            .x((d) => xScale(d.sold_at))
            .y0(height)
            .y1((d) => yScale(d.sold_price));

        // Define a monochromatic green color scale
        const colorScale = d3.scaleSequential(d3.interpolateGreens).domain([0, 5]);

        // set our domain for our x axis
        xScale.domain(d3.extent(data, (d) => new Date(formatDate(d.sold_at))));

        yScale.domain([0, d3.max(data, (d) => d.sold_price)]);

        // Create the line function
        const line = d3
            .line()
            .x((d) => xScale(d.sold_at))
            .y((d) => yScale(d.sold_price));

        // Create a custom usd formatter for the y-axis
        // @TODO: Move this to a utils file
        // @TODO: Make the currency convertable
        const formatUSD = d3.format('$,.0f');

        // Clear any previous graph elements
        await clearGraph();

        // Append the graph
        const svg = d3
            .select(svgRef.current)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Add x-axis
        svg
            .append('g')
            .attr('class', 'grid')
            .attr('transform', `translate(0, ${height})`)
            .call(
                d3
                    .axisBottom(xScale)
                    .ticks(5)
            );

        // Add y-axis
        svg
            .append('g')
            .attr('class', 'grid')
            .call(
                d3
                    .axisLeft(yScale)
                    .ticks(6)
                    .tickSize(-width)
                    .tickFormat(formatUSD)
            );

        // Add the line
        svg
            .append('path')
            .datum(data)
            .attr('fill', 'rgba(76, 175, 80, 0.85)')
            .attr('fill-opacity', 0.75)
            .attr('d', area);

        // Add dots for each data point
        svg
            .selectAll('.dot')
            .data(data)
            .enter()
            .append('circle')
            .on('click', handleDataPointClick)
            .attr('class', 'dot')
            .attr('cx', (d) => xScale(d.sold_at))
            .attr('cy', (d) => yScale(d.sold_price))
            .attr('r', 5)
            .attr('fill', 'green');

        // Setup our tooltip
        // const focus = svg
        //     .append('g')
        //     .attr('class', 'focus')
        //     .style('display', 'none')
        //
        // focus
        //     .append('circle')
        //     .attr('r', 5)
        //     .attr('class', 'circle')
        //     .on('click', handleDataPointClick);
        //
        // const tooltip = d3
        //     .select('#svg')
        //     .append('div')
        //     .attr('class', 'tooltip')
        //     .style('opacity', 0);

        //
        // const mousemove = (event) => {
        //     const bisect = d3.bisector((d) => d.sold_at).left;
        //     const xPos = d3.pointer(event)[0];
        //     const x0 = bisect(data, xScale.invert(xPos));
        //     const d0 = data[x0];
        //     d0.tooltipContent = `
        //         <div class="tooltipContent-container">
        //             <div class="sold-price">${d0.sold_price}</div>
        //         </div>`;
        //
        //     focus.attr(
        //         "transform",
        //         `translate(${xScale(d0.sold_at)}, ${yScale(d0.sold_price)})`,
        //     );
        //     tooltip
        //         .transition()
        //         .duration(300)
        //         .style("opacity", 0.9);
        //     tooltip
        //         .html(d0.tooltipContent || d0.sold_price)
        //         .style("transform",
        //             `translate(${xScale(d0.sold_at) + 30}px, ${yScale(d0.sold_price)}px)`,
        //         );
        //
        // }
        //
        // svg
        //     .append("rect")
        //     .attr("class", "overlay")
        //     .attr("width", width)
        //     .attr("height", height)
        //     .attr('pointer-events', 'none')
        //     .style('opacity', '0')
        //     .on("mouseover", () => {
        //         focus.style("display", null);
        //     })
        //     .on("mouseout", () => {
        //         tooltip.transition().duration(200).style("opacity", 0);
        //     })
        //     .on("mousemove", mousemove);

    }

    const clearGraph = async (data) => {
        d3.select(svgRef.current).selectAll('*').remove();
        d3.select('#container')
            .select('svg')
            .remove();d3.select('#container')
            .select('.tooltip')
            .remove();
    };

    return (
        <div className="container">
            {/*<h2>Price History</h2>*/}
            <div className="row">
            <div id="svg" ref={svgRef}></div>
            <div className="additional-product-info"></div>
            </div>
        </div>
    );
};

export default LineGraph;
