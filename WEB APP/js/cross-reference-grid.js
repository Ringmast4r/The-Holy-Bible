// Cross-Reference Grid Visualization
// Heat map showing cross-reference density between Bible books

class CrossReferenceGrid {
    constructor(svgId, tooltipId) {
        this.svgId = svgId;
        this.tooltipId = tooltipId;
        this.currentFilters = {};
    }

    render(filters = {}) {
        this.currentFilters = filters;

        const svg = d3.select(`#${this.svgId}`);
        svg.selectAll('*').remove();

        if (!dataLoader || !dataLoader.isLoaded) {
            this.showError(svg, 'Data not loaded');
            return;
        }

        // Get book matrix data
        const matrixData = dataLoader.getBookMatrix();
        if (!matrixData || !matrixData.matrix || matrixData.matrix.length === 0) {
            this.showError(svg, 'No book matrix data available');
            return;
        }

        const bookMatrix = matrixData.matrix;
        const books = dataLoader.getBooks();
        const bookNames = books.map(b => b.short || b.name);

        // SVG dimensions
        const container = document.getElementById(this.svgId);
        const width = container.clientWidth || 900;
        const isMobile = window.innerWidth <= 768;
        const baseHeight = isMobile ? 600 : 900;
        const displayHeight = isMobile ? Math.min(600, window.innerHeight * 0.7) : baseHeight;

        svg.attr('width', '100%')
           .attr('height', displayHeight)
           .attr('viewBox', `0 0 ${width} ${baseHeight}`)
           .attr('preserveAspectRatio', 'xMidYMid meet');

        const margin = { top: 100, right: 20, bottom: 120, left: 120 };
        const gridWidth = width - margin.left - margin.right;
        const gridHeight = baseHeight - margin.top - margin.bottom;

        const cellSize = Math.min(gridWidth / books.length, gridHeight / books.length);
        const actualGridWidth = cellSize * books.length;
        const actualGridHeight = cellSize * books.length;

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        // Find max value for color scaling (flatten the 2D array manually for compatibility)
        let maxValue = 0;
        for (let i = 0; i < bookMatrix.length; i++) {
            for (let j = 0; j < bookMatrix[i].length; j++) {
                if (bookMatrix[i][j] > maxValue) {
                    maxValue = bookMatrix[i][j];
                }
            }
        }

        // Color scale (blue to red heat map)
        const colorScale = d3.scaleSequential(d3.interpolateYlOrRd)
            .domain([0, maxValue]);

        // Create cells
        const cells = g.selectAll('.cell')
            .data(bookMatrix.flatMap((row, i) =>
                row.map((value, j) => ({ row: i, col: j, value }))
            ))
            .enter()
            .append('rect')
            .attr('class', 'cell')
            .attr('x', d => d.col * cellSize)
            .attr('y', d => d.row * cellSize)
            .attr('width', cellSize - 1)
            .attr('height', cellSize - 1)
            .attr('fill', d => d.value === 0 ? '#1a1a2e' : colorScale(d.value))
            .attr('stroke', '#0e1621')
            .attr('stroke-width', 0.5)
            .style('cursor', 'pointer')
            .on('mouseover', (event, d) => {
                if (d.value > 0) {
                    this.showTooltip(event, d, bookNames);
                }
            })
            .on('mouseout', () => {
                this.hideTooltip();
            })
            .on('click', (event, d) => {
                if (d.value > 0) {
                    this.handleCellClick(d, bookNames);
                }
            });

        // Row labels (Y-axis)
        g.selectAll('.row-label')
            .data(bookNames)
            .enter()
            .append('text')
            .attr('class', 'row-label')
            .attr('x', -10)
            .attr('y', (d, i) => i * cellSize + cellSize / 2)
            .attr('text-anchor', 'end')
            .attr('dominant-baseline', 'middle')
            .attr('fill', '#00CED1')
            .attr('font-size', Math.min(10, cellSize * 0.6))
            .text(d => d);

        // Column labels (X-axis)
        g.selectAll('.col-label')
            .data(bookNames)
            .enter()
            .append('text')
            .attr('class', 'col-label')
            .attr('x', (d, i) => i * cellSize + cellSize / 2)
            .attr('y', -10)
            .attr('text-anchor', 'start')
            .attr('transform', (d, i) =>
                `rotate(-45, ${i * cellSize + cellSize / 2}, -10)`
            )
            .attr('fill', '#00CED1')
            .attr('font-size', Math.min(10, cellSize * 0.6))
            .text(d => d);

        // Title
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', 30)
            .attr('text-anchor', 'middle')
            .attr('fill', '#FFD700')
            .attr('font-size', '20px')
            .attr('font-weight', 'bold')
            .text('Bible Cross-Reference Heat Map');

        // Subtitle
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', 55)
            .attr('text-anchor', 'middle')
            .attr('fill', '#00CED1')
            .attr('font-size', '13px')
            .text('🖱️ Hover for details | Click cell to filter | Darker = More connections');

        // Legend
        this.addLegend(svg, width, baseHeight, colorScale, maxValue);

        console.log(`📊 Cross-Reference Grid rendered: ${books.length}×${books.length} matrix`);
    }

    showTooltip(event, d, bookNames) {
        const tooltip = d3.select(`#${this.tooltipId}`);

        const sourceBook = bookNames[d.row];
        const targetBook = bookNames[d.col];

        tooltip.style('display', 'block')
            .html(`
                <strong>${sourceBook} → ${targetBook}</strong><br>
                <strong>${d.value}</strong> cross-references
            `)
            .style('transform', `translate(${event.clientX + 10}px, ${event.clientY - 10}px)`);
    }

    hideTooltip() {
        const tooltip = d3.select(`#${this.tooltipId}`);
        tooltip.style('display', 'none');
    }

    handleCellClick(d, bookNames) {
        const sourceBook = bookNames[d.row];
        const targetBook = bookNames[d.col];

        console.log(`🔗 Clicked: ${sourceBook} → ${targetBook} (${d.value} connections)`);

        // Could trigger filtering in other visualizations
        alert(`${sourceBook} → ${targetBook}\n${d.value} cross-references\n\nClick OK to view in Arc Diagram`);

        // Switch to Arc Diagram with filter
        // This would require main.js integration
    }

    addLegend(svg, width, height, colorScale, maxValue) {
        const legend = svg.append('g')
            .attr('class', 'legend')
            .attr('transform', `translate(${width - 250}, ${height - 60})`);

        // Gradient for legend
        const defs = svg.append('defs');
        const linearGradient = defs.append('linearGradient')
            .attr('id', 'legend-gradient')
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '100%')
            .attr('y2', '0%');

        // Add color stops
        for (let i = 0; i <= 10; i++) {
            linearGradient.append('stop')
                .attr('offset', `${i * 10}%`)
                .attr('stop-color', colorScale(maxValue * i / 10));
        }

        // Legend rectangle
        legend.append('rect')
            .attr('width', 200)
            .attr('height', 20)
            .style('fill', 'url(#legend-gradient)')
            .style('stroke', '#00CED1')
            .style('stroke-width', 1);

        // Legend labels
        legend.append('text')
            .attr('x', 0)
            .attr('y', 35)
            .attr('fill', '#00CED1')
            .attr('font-size', '11px')
            .text('0');

        legend.append('text')
            .attr('x', 200)
            .attr('y', 35)
            .attr('text-anchor', 'end')
            .attr('fill', '#00CED1')
            .attr('font-size', '11px')
            .text(`${maxValue} connections`);
    }

    showError(svg, message) {
        svg.append('text')
            .attr('x', '50%')
            .attr('y', '50%')
            .attr('text-anchor', 'middle')
            .attr('fill', '#FF6B6B')
            .attr('font-size', '18px')
            .text(message);
    }

    applyFilters(filters) {
        this.render(filters);
    }
}
