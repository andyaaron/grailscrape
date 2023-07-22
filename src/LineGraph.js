import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import dayjs from 'dayjs';

const LineGraph = ({ data }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (data && data.length > 0) {
            const sortedData = data.slice().sort((a, b) => a.sold_at - b.sold_at);
            createGraph(sortedData);
        }
    }, [data]);

    const createGraph = async (data) => {
        const margin = { top: 20, right: 30, bottom: 30, left: 60 };
        const width = 600 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        // Format date in "MM-DD-YYYY" format
        const formatDate = d3.timeFormat('%Y-%m-%d');

        // Parse the date format and convert sold_price values to numbers
        data.forEach((d) => {
            let sold_at = new Date(d.sold_at); // format the date
            d.sold_at = new Date(sold_at);
            d.sold_price = +d.sold_price;
        })

        // Create scales for x and y axes
        const xScale = d3.scaleTime().range([0, width]);

        const yScale = d3.scaleLinear().range([height, 0]);


        // set our domain for our x axis
        xScale.domain(d3.extent(data, (d) => new Date(formatDate(d.sold_at))));
        console.log(`sScale: ${xScale.ticks(5)} \n`);

        yScale.domain([0, d3.max(data, (d) => d.sold_price)]);

        // Create the line function
        const line = d3
            .line()
            .x((d) => xScale(d.sold_at))
            .y((d) => yScale(d.sold_price));

        // Clear any previous graph elements
        d3.select(svgRef.current).selectAll('*').remove();

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
            .attr('transform', `translate(0, ${height})`)
            .call(d3.axisBottom(xScale));

        // Add y-axis
        svg.append('g').call(d3.axisLeft(yScale));

        // Add the line
        svg
            .append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', 'steelblue')
            .attr('stroke-width', 2)
            .attr('d', line);

        // Add dots for each data point
        svg
            .selectAll('.dot')
            .data(data)
            .enter()
            .append('circle')
            .attr('class', 'dot')
            .attr('cx', (d) => xScale(d.sold_at))
            .attr('cy', (d) => yScale(d.sold_price))
            .attr('r', 5)
            .attr('fill', 'steelblue');
    }


    // Calculate the average of the sold_price values
    const averageSoldPrice =
        data && data.length > 0 ? (data.reduce((sum, d) => sum + d.sold_price, 0) / data.length).toFixed(2) : 0;



    return (
        <div className="graph-container">
            <h2>Line Graph</h2>
            <div className="data-calculations">
                <div className="average">
                    Average Sales Price: ${averageSoldPrice}
                </div>
                <div className="total">
                    Total Items: {data.length}
                </div>

            </div>
            <div ref={svgRef}></div>
        </div>
    );
};

export default LineGraph;
