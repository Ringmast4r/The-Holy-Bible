// Heatmap Visualization
// 66x66 book-to-book connection matrix

class Heatmap {
    constructor(svgId, tooltipId) {
        this.svgId = svgId;
        this.tooltipId = tooltipId;
    }

    render(filters = {}) {
        const svg = d3.select(`#${this.svgId}`);
        svg.selectAll('*').remove();

        // Get book matrix data using dataLoader API
        if (!dataLoader || !dataLoader.isLoaded) {
            this.showError(svg, 'Data not loaded');
            return;
        }

        const bookMatrix = dataLoader.getBookMatrix();
        if (!bookMatrix || !bookMatrix.books || !bookMatrix.matrix) {
            this.showError(svg, 'Book matrix data not available');
            return;
        }

        // Set explicit dimensions like Arc Diagram
        const container = document.getElementById(this.svgId);
        const width = container.clientWidth || 900;
        const baseHeight = 900; // Square for 66x66 matrix

        // Use responsive sizing for mobile
        const isMobile = window.innerWidth <= 768;
        const displayHeight = isMobile ? Math.min(600, window.innerHeight * 0.7) : baseHeight;
        const height = isMobile ? width : baseHeight; // Keep square aspect

        svg.attr('width', '100%')
           .attr('height', displayHeight)
           .attr('viewBox', `0 0 ${width} ${height}`)
           .attr('preserveAspectRatio', 'xMidYMid meet');

        const margin = { top: 150, right: 50, bottom: 150, left: 150 };  // Increased top margin to avoid title collision
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        // Get book data
        const books = bookMatrix.books;
        const matrix = bookMatrix.matrix;

        // Apply filters
        let filteredBooks = books;
        let filteredMatrix = matrix;

        const testament = filters.testament || 'all';
        if (testament !== 'all') {
            const otBooks = 39;

            if (testament === 'OT') {
                filteredBooks = books.slice(0, otBooks);
                filteredMatrix = matrix.slice(0, otBooks).map(row => row.slice(0, otBooks));
            } else if (testament === 'NT') {
                filteredBooks = books.slice(otBooks);
                filteredMatrix = matrix.slice(otBooks).map(row => row.slice(otBooks));
            }
        }

        // Apply minConnections filter - zero out cells below threshold
        const minConnections = filters.minConnections || 1;
        if (minConnections > 1) {
            filteredMatrix = filteredMatrix.map(row =>
                row.map(value => value >= minConnections ? value : 0)
            );
            console.log(`🔥 Heatmap: Filtering cells with weight >= ${minConnections}`);
        }

        const cellSize = Math.min(innerWidth, innerHeight) / filteredBooks.length;

        // Find max value for color scale
        const maxValue = d3.max(filteredMatrix.flat());

        // Color scale
        const colorScale = d3.scaleSequential()
            .domain([0, maxValue])
            .interpolator(d3.interpolateYlOrRd);

        // Tooltip
        const tooltip = d3.select(`#${this.tooltipId}`);

        // Draw cells
        const rows = g.selectAll('.row')
            .data(filteredMatrix)
            .enter()
            .append('g')
            .attr('class', 'row')
            .attr('transform', (d, i) => `translate(0, ${i * cellSize})`);

        rows.selectAll('.cell')
            .data((d, i) => d.map((value, j) => ({ value, row: i, col: j })))
            .enter()
            .append('rect')
            .attr('class', d => `cell heatmap-cell row-${d.row} col-${d.col}`)
            .attr('data-row', d => d.row)
            .attr('data-col', d => d.col)
            .attr('x', d => d.col * cellSize)
            .attr('width', cellSize)
            .attr('height', cellSize)
            .style('fill', d => d.value === 0 ? '#0a0a0a' : colorScale(d.value))
            .style('stroke', '#1a1a2e')
            .style('stroke-width', 0.5)
            .style('transition', 'none')  // Disable transitions for instant response
            .on('mouseenter', function(event, d) {
                const sourceBook = filteredBooks[d.row];
                const targetBook = filteredBooks[d.col];
                const connections = d.value;

                tooltip.style('display', 'block')
                    .html(`<strong>${sourceBook} → ${targetBook}</strong><br>Connections: ${connections}`);

                // Use direct DOM manipulation for instant feedback
                // Only update cells in the same row or column
                const rowCells = document.querySelectorAll(`.row-${d.row}`);
                const colCells = document.querySelectorAll(`.col-${d.col}`);
                const allCells = document.querySelectorAll('.heatmap-cell');

                // Fast opacity update
                allCells.forEach(cell => {
                    cell.style.opacity = '0.3';
                });
                rowCells.forEach(cell => {
                    cell.style.opacity = '1';
                });
                colCells.forEach(cell => {
                    cell.style.opacity = '1';
                });

                // Update labels using direct DOM
                const rowLabels = document.querySelectorAll('.row-label');
                const colLabels = document.querySelectorAll('.col-label');

                if (rowLabels[d.row]) {
                    rowLabels[d.row].style.fontWeight = 'bold';
                    rowLabels[d.row].style.fill = '#FFD700';
                }
                if (colLabels[d.col]) {
                    colLabels[d.col].style.fontWeight = 'bold';
                    colLabels[d.col].style.fill = '#FFD700';
                }
            })
            .on('mousemove', (event) => {
                // INSTANT tooltip positioning using transform (GPU-accelerated, like other visualizations)
                tooltip.style('transform', `translate(${event.clientX + 10}px, ${event.clientY - 10}px)`);
            })
            .on('mouseleave', function() {
                tooltip.style('display', 'none');

                // Fast reset using direct DOM
                const allCells = document.querySelectorAll('.heatmap-cell');
                allCells.forEach(cell => {
                    cell.style.opacity = '1';
                });

                const rowLabels = document.querySelectorAll('.row-label');
                const colLabels = document.querySelectorAll('.col-label');
                rowLabels.forEach(label => {
                    label.style.fontWeight = 'normal';
                    label.style.fill = '#00CED1';
                });
                colLabels.forEach(label => {
                    label.style.fontWeight = 'normal';
                    label.style.fill = '#00CED1';
                });
            });

        // Add row labels
        g.selectAll('.row-label')
            .data(filteredBooks)
            .enter()
            .append('text')
            .attr('class', 'row-label')
            .attr('x', -5)
            .attr('y', (d, i) => i * cellSize + cellSize / 2)
            .attr('text-anchor', 'end')
            .attr('dominant-baseline', 'middle')
            .style('fill', '#00CED1')
            .style('font-size', `${Math.max(8, cellSize * 0.6)}px`)
            .text(d => d);

        // Add column labels
        g.selectAll('.col-label')
            .data(filteredBooks)
            .enter()
            .append('text')
            .attr('class', 'col-label')
            .attr('x', (d, i) => i * cellSize + cellSize / 2)
            .attr('y', -5)
            .attr('text-anchor', 'start')
            .attr('transform', (d, i) => `rotate(-90, ${i * cellSize + cellSize / 2}, -5)`)
            .style('fill', '#00CED1')
            .style('font-size', `${Math.max(8, cellSize * 0.6)}px`)
            .text(d => d);

        // Add testament dividers if showing all
        if (testament === 'all') {
            const otBooks = 39;
            const dividerPos = otBooks * cellSize;

            // Vertical divider
            g.append('line')
                .attr('x1', dividerPos)
                .attr('y1', 0)
                .attr('x2', dividerPos)
                .attr('y2', filteredBooks.length * cellSize)
                .style('stroke', '#FFD700')
                .style('stroke-width', 3);

            // Horizontal divider
            g.append('line')
                .attr('x1', 0)
                .attr('y1', dividerPos)
                .attr('x2', filteredBooks.length * cellSize)
                .attr('y2', dividerPos)
                .style('stroke', '#FFD700')
                .style('stroke-width', 3);

            // Testament labels
            svg.append('text')
                .attr('x', margin.left + (otBooks * cellSize) / 2)
                .attr('y', margin.top - 60)
                .attr('text-anchor', 'middle')
                .style('fill', '#2ecc71')
                .style('font-size', '14px')
                .style('font-weight', 'bold')
                .text('Old Testament');

            svg.append('text')
                .attr('x', margin.left + otBooks * cellSize + ((filteredBooks.length - otBooks) * cellSize) / 2)
                .attr('y', margin.top - 60)
                .attr('text-anchor', 'middle')
                .style('fill', '#00CED1')
                .style('font-size', '14px')
                .style('font-weight', 'bold')
                .text('New Testament');
        }

        // Add color legend
        this.addColorLegend(svg, width, height, colorScale, maxValue);

        // Add title
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', 40)  // Moved down slightly for better spacing
            .attr('text-anchor', 'middle')
            .style('fill', '#FFD700')
            .style('font-size', '18px')
            .style('font-weight', 'bold')
            .text(`Bible Book Cross-Reference Heatmap (${filteredBooks.length}x${filteredBooks.length})`);

        // Add subtitle with filter info
        const filterActive = minConnections > 1 || testament !== 'all';
        let subtitleText = 'Hover over cells to see connection details';
        if (filterActive && minConnections > 1) {
            subtitleText += ` | Filtering cells with ≥ ${minConnections} connections`;
        }

        svg.append('text')
            .attr('x', width / 2)
            .attr('y', 65)  // Adjusted to maintain spacing from title
            .attr('text-anchor', 'middle')
            .style('fill', filterActive ? '#FFD700' : '#00CED1')
            .style('font-size', '12px')
            .text(subtitleText);
    }

    addColorLegend(svg, width, height, colorScale, maxValue) {
        const legendWidth = 200;
        const legendHeight = 15;
        const legendX = width - legendWidth - 50;
        const legendY = height - 50;

        const legend = svg.append('g')
            .attr('transform', `translate(${legendX}, ${legendY})`);

        // Create gradient
        const defs = svg.append('defs');
        const gradient = defs.append('linearGradient')
            .attr('id', 'heatmap-gradient')
            .attr('x1', '0%')
            .attr('x2', '100%');

        const steps = 10;
        for (let i = 0; i <= steps; i++) {
            const value = (maxValue / steps) * i;
            gradient.append('stop')
                .attr('offset', `${(i / steps) * 100}%`)
                .attr('stop-color', colorScale(value));
        }

        // Draw gradient bar
        legend.append('rect')
            .attr('width', legendWidth)
            .attr('height', legendHeight)
            .style('fill', 'url(#heatmap-gradient)')
            .style('stroke', '#FFD700')
            .style('stroke-width', 1);

        // Add labels
        legend.append('text')
            .attr('x', 0)
            .attr('y', legendHeight + 15)
            .style('fill', '#00CED1')
            .style('font-size', '11px')
            .text('0');

        legend.append('text')
            .attr('x', legendWidth)
            .attr('y', legendHeight + 15)
            .attr('text-anchor', 'end')
            .style('fill', '#00CED1')
            .style('font-size', '11px')
            .text(Math.round(maxValue));

        legend.append('text')
            .attr('x', legendWidth / 2)
            .attr('y', -5)
            .attr('text-anchor', 'middle')
            .style('fill', '#FFD700')
            .style('font-size', '12px')
            .style('font-weight', 'bold')
            .text('Connection Strength');
    }

    showError(svg, message) {
        const width = svg.node().getBoundingClientRect().width;
        const height = svg.node().getBoundingClientRect().height;

        svg.append('text')
            .attr('x', width / 2)
            .attr('y', height / 2)
            .attr('text-anchor', 'middle')
            .attr('fill', '#FF6B6B')
            .attr('font-size', '18px')
            .text(message);
    }

    applyFilters(filters) {
        this.render(filters);
    }
}
