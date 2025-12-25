// Arc Diagram - True Circular Arcs
// Bible Cross-Reference Visualization
// Created by Ringmast4r

class ArcDiagramTableauStyle {
    constructor(svgId, tooltipId) {
        this.svgId = svgId;
        this.tooltipId = tooltipId;
        this.svg = null;
        this.tooltip = null;
        this.width = 0;
        this.height = 900;
        this.margin = { top: 100, right: 100, bottom: 100, left: 100 };
        this.densificationPoints = 50; // Points per arc for smooth curves
        this.arcsSelection = null; // Store arcs for instant color updates
        this.maxDistance = 0; // Store for color scale updates
    }

    render(filters = {}) {
        console.log('🎨 ArcDiagramTableauStyle.render() called');
        console.log(`📏 Height: ${this.height}px, Margin:`, this.margin);

        const container = document.getElementById(this.svgId);
        if (!container) {
            console.error(`SVG container not found: #${this.svgId}`);
            return;
        }
        console.log(`📦 Container width: ${container.clientWidth}px`);
        container.innerHTML = '';

        if (!dataLoader || !dataLoader.isLoaded) {
            console.log('Data not loaded yet');
            return;
        }

        this.width = container.clientWidth;

        // Use responsive sizing for mobile
        const isMobile = window.innerWidth <= 768;
        const displayHeight = isMobile ? Math.min(600, window.innerHeight * 0.7) : this.height;

        this.svg = d3.select(`#${this.svgId}`)
            .attr('width', '100%')
            .attr('height', displayHeight)
            .attr('viewBox', `0 0 ${this.width} ${this.height}`)
            .attr('preserveAspectRatio', 'xMidYMid meet')

        console.log(`🖼️ SVG dimensions set: ${this.width}x${this.height} (viewBox), display: 100%x${displayHeight}`);

        this.tooltip = d3.select(`#${this.tooltipId}`);

        const chapters = dataLoader.getChapters();
        let connections = dataLoader.getConnections();
        const originalCount = connections.length;

        // Apply filters
        if (filters.testament && filters.testament !== 'all') {
            connections = dataLoader.filterConnectionsByTestament(filters.testament);
        }
        if (filters.book) {
            connections = dataLoader.filterConnectionsByBook(filters.book);
        }
        if (filters.minConnections > 1) {
            connections = connections.filter(c => c.weight >= filters.minConnections);
        }

        // Empty state handling
        if (connections.length === 0) {
            this.showEmptyState(`No connections found with current filters (min ≥ ${filters.minConnections || 1})`);
            return;
        }

        // Limit connections for performance (optional)
        const maxConnections = 50000;
        const limitedForPerformance = connections.length > maxConnections;
        if (limitedForPerformance) {
            console.log(`Limiting to ${maxConnections} connections for performance`);
            connections = connections.slice(0, maxConnections);
        }

        this.drawTableauStyleArcs(chapters, connections, filters, originalCount, limitedForPerformance);
    }

    drawTableauStyleArcs(chapters, connections, filters = {}, originalCount = connections.length, limitedForPerformance = false) {
        const innerWidth = this.width - this.margin.left - this.margin.right;
        const innerHeight = this.height - this.margin.top - this.margin.bottom;

        const g = this.svg.append('g')
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

        // Create chapter maps for fast lookup (optimize tooltip performance)
        const chapterIndexMap = new Map();
        const chapterLookupMap = new Map();
        chapters.forEach((ch, idx) => {
            chapterIndexMap.set(ch.id, idx);
            chapterLookupMap.set(ch.id, ch);  // Fast lookup for tooltips
        });

        // Store for use in tooltip
        this.chapterLookupMap = chapterLookupMap;

        // X scale: chapter position with edge padding
        // Padding creates buffer space beyond first/last chapters for smooth edge curves
        const edgePadding = 50; // pixels beyond edge chapters
        const xScale = d3.scaleLinear()
            .domain([0, chapters.length - 1])
            .range([edgePadding, innerWidth - edgePadding]);

        // Y scale: arc height scaling (FIX for flat-looking sides)
        // Without Y-scaling, large-radius arcs exceed viewport and appear flat
        const maxRadius = chapters.length / 2; // Max possible radius in chapter units (~594 for 1189 chapters)
        const yScale = d3.scaleLinear()
            .domain([0, maxRadius])
            .range([0, innerHeight * 0.95]); // Use 95% of height, leave 5% margin
        this.yScale = yScale; // Store for use in arc path generation

        // Color scale based on distance between chapters (using current color scheme)
        this.maxDistance = chapters.length - 1;
        const colorScale = window.colorSchemes.createDistanceScale(this.maxDistance);

        // Process connections and create arc paths
        console.log(`Drawing ${connections.length} connections with Tableau-style arcs...`);
        const arcGenStart = performance.now();

        const arcPaths = [];

        connections.forEach(conn => {
            const sourceIdx = chapterIndexMap.get(conn.source);
            const targetIdx = chapterIndexMap.get(conn.target);

            if (sourceIdx === undefined || targetIdx === undefined) return;

            // Calculate arc parameters (Tableau formulas)
            const start = Math.min(sourceIdx, targetIdx);
            const end = Math.max(sourceIdx, targetIdx);
            const distance = Math.abs(targetIdx - sourceIdx);
            const radius = distance / 2;

            // Skip if same chapter
            if (distance === 0) return;

            // Generate arc path using trigonometric formula
            const pathPoints = this.generateCircularArcPath(
                start, end, radius, xScale, innerHeight
            );

            arcPaths.push({
                points: pathPoints,
                distance: distance,
                source: conn.source,
                target: conn.target,
                sourceIdx: sourceIdx,
                targetIdx: targetIdx,
                weight: conn.weight
            });
        });

        const arcGenEnd = performance.now();
        console.log(`⚡ Generated ${arcPaths.length} arc paths in ${(arcGenEnd - arcGenStart).toFixed(0)}ms`);

        // Draw arcs
        const drawStart = performance.now();
        this.arcsSelection = g.append('g')
            .attr('class', 'arcs')
            .selectAll('path')
            .data(arcPaths)
            .enter()
            .append('path')
            .attr('d', d => this.createPathString(d.points))
            .attr('fill', 'none')
            .attr('stroke', d => colorScale(d.distance))
            .attr('stroke-width', 0.5)
            .attr('opacity', 0.6)
            .on('mouseover', (event, d) => this.showTooltip(event, d, chapters))
            .on('mousemove', (event) => this.moveTooltip(event))
            .on('mouseout', () => this.hideTooltip());

        // Draw chapter indicators at bottom with hover labels
        const chapterBars = g.append('g')
            .attr('class', 'chapter-bars')
            .attr('transform', `translate(0, ${innerHeight})`);

        // Create hover label for book names
        const hoverLabel = this.svg.append('text')
            .attr('class', 'hover-book-label')
            .attr('x', this.width / 2)
            .attr('y', innerHeight + this.margin.top + 30)
            .attr('text-anchor', 'middle')
            .attr('fill', '#FFD700')
            .attr('font-size', '16px')
            .attr('font-weight', 'bold')
            .style('opacity', 0);

        chapterBars.selectAll('line')
            .data(chapters)
            .enter()
            .append('line')
            .attr('class', 'chapter-indicator')
            .attr('x1', (d, i) => xScale(i))
            .attr('x2', (d, i) => xScale(i))
            .attr('y1', 0)
            .attr('y2', 10)
            .attr('stroke', d => d.testament === 'OT' ? '#2ecc71' : '#00CED1')
            .attr('stroke-width', 1)
            .attr('opacity', 0.5)
            .style('cursor', 'pointer')
            .style('pointer-events', 'all')  // Ensure hover events work
            .style('transition', 'none')  // Disable transitions for instant response
            .on('mouseenter', (event, d) => {
                // Use mouseenter for better performance
                // Update visual immediately with direct DOM manipulation
                event.target.setAttribute('stroke-width', 3);
                event.target.setAttribute('opacity', 1);

                // Show book name
                const color = d.testament === 'OT' ? '#2ecc71' : '#00CED1';
                hoverLabel
                    .text(`${d.book} ${d.chapter}`)
                    .attr('fill', color)
                    .style('opacity', 1);
            })
            .on('mouseleave', (event) => {
                // Reset immediately with direct DOM manipulation
                event.target.setAttribute('stroke-width', 1);
                event.target.setAttribute('opacity', 0.5);

                // Hide book name
                hoverLabel.style('opacity', 0);
            });

        // Add title
        this.svg.append('text')
            .attr('x', this.width / 2)
            .attr('y', 30)
            .attr('text-anchor', 'middle')
            .attr('fill', '#FFD700')
            .attr('font-size', '24px')
            .attr('font-weight', 'bold')
            .text('Bible Cross-References by Ringmast4r');

        // Add subtitle with filter info
        const currentScheme = window.colorSchemes.getCurrentScheme();
        const minConnections = filters.minConnections || 1;
        const filterActive = minConnections > 1 || filters.testament !== 'all' || filters.book;

        let subtitleText = `${currentScheme.emoji} ${currentScheme.description}`;
        if (filterActive) {
            subtitleText += ` | Showing ${connections.length.toLocaleString()}`;
            if (limitedForPerformance) {
                subtitleText += ` of ${originalCount.toLocaleString()}`;
            }
            subtitleText += ` connections`;
            if (minConnections > 1) {
                subtitleText += ` (min ≥ ${minConnections})`;
            }
        }

        this.svg.append('text')
            .attr('x', this.width / 2)
            .attr('y', 50)
            .attr('text-anchor', 'middle')
            .attr('fill', filterActive ? '#FFD700' : '#888')
            .attr('font-size', '14px')
            .text(subtitleText);

        // Add legend
        this.drawColorLegend(g, innerWidth, innerHeight, colorScale, chapters);

        const drawEnd = performance.now();
        console.log(`⚡ Arc DOM rendering completed in ${(drawEnd - drawStart).toFixed(0)}ms`);
    }

    /**
     * Generate circular arc path using Pythagorean theorem for perfect circles
     * Formula: y = sqrt(r² - x²) where r = radius, x = centerOffset
     * This creates true semicircular arcs (parts of perfect circles)
     * More stable than tan/acos approach which can hit infinity at 90°
     */
    generateCircularArcPath(start, end, radius, xScale, innerHeight) {
        const points = [];
        const numPoints = this.densificationPoints;

        for (let i = 0; i <= numPoints; i++) {
            // Index along the arc (0 to distance)
            const index = (i / numPoints) * (end - start);

            // X position
            const xPos = start + index;

            // Calculate Y using circular arc formula
            // This is the EXACT formula from Tableau workbook
            const centerOffset = xPos - start - radius;
            const normalizedX = centerOffset / radius;

            // Check bounds for acos (must be -1 to 1)
            if (normalizedX < -1 || normalizedX > 1) {
                // Outside arc bounds
                points.push({
                    x: xScale(xPos),
                    y: innerHeight
                });
            } else {
                // Inside arc bounds - calculate circular Y using Pythagorean theorem
                // For a circle: x² + y² = r², so y = sqrt(r² - x²)
                const radiusSquared = radius * radius;
                const offsetSquared = centerOffset * centerOffset;
                const yOffset = Math.sqrt(Math.abs(radiusSquared - offsetSquared));

                // Arc height (inverted, so it goes upward) - SCALED to fit viewport
                const arcY = innerHeight - this.yScale(yOffset);

                points.push({
                    x: xScale(xPos),
                    y: arcY
                });
            }
        }

        return points;
    }

    /**
     * Create SVG path string from points
     */
    createPathString(points) {
        if (points.length === 0) return '';

        let path = `M ${points[0].x} ${points[0].y}`;

        for (let i = 1; i < points.length; i++) {
            path += ` L ${points[i].x} ${points[i].y}`;
        }

        return path;
    }

    /**
     * Draw color gradient legend (clickable easter egg!)
     */
    drawColorLegend(g, innerWidth, innerHeight, colorScale, chapters) {
        const legendWidth = 300;
        const legendHeight = 20;
        const legendX = innerWidth - legendWidth - 20;
        const legendY = innerHeight + 40;

        // Create gradient
        const gradient = this.svg.append('defs')
            .append('linearGradient')
            .attr('id', 'color-gradient-legend')
            .attr('x1', '0%')
            .attr('x2', '100%');

        // Add color stops
        for (let i = 0; i <= 10; i++) {
            const offset = i * 10;
            const distance = (i / 10) * (chapters.length - 1);
            gradient.append('stop')
                .attr('offset', `${offset}%`)
                .attr('stop-color', colorScale(distance));
        }

        // Draw legend rectangle (CLICKABLE EASTER EGG!)
        const legendRect = g.append('rect')
            .attr('x', legendX)
            .attr('y', legendY)
            .attr('width', legendWidth)
            .attr('height', legendHeight)
            .attr('fill', 'url(#color-gradient-legend)')
            .attr('stroke', '#444')
            .attr('stroke-width', 1)
            .style('cursor', 'pointer')
            .on('click', () => {
                // Easter egg: cycle to next color scheme!
                const newScheme = window.colorSchemes.nextScheme();
                console.log(`🎨 Switched to ${newScheme.name} ${newScheme.emoji}`);

                // Update colors INSTANTLY without re-rendering
                this.updateColors();
            })
            .on('mouseenter', function() {
                d3.select(this)
                    .attr('stroke', '#FFD700')
                    .attr('stroke-width', 2);
            })
            .on('mouseleave', function() {
                d3.select(this)
                    .attr('stroke', '#444')
                    .attr('stroke-width', 1);
            });

        // Add labels
        g.append('text')
            .attr('x', legendX)
            .attr('y', legendY - 5)
            .attr('fill', '#888')
            .attr('font-size', '12px')
            .text('Close');

        g.append('text')
            .attr('x', legendX + legendWidth)
            .attr('y', legendY - 5)
            .attr('text-anchor', 'end')
            .attr('fill', '#888')
            .attr('font-size', '12px')
            .text('Far Apart');

        g.append('text')
            .attr('x', legendX + legendWidth / 2)
            .attr('y', legendY + legendHeight + 15)
            .attr('text-anchor', 'middle')
            .attr('fill', '#888')
            .attr('font-size', '11px')
            .text('Distance Between Chapters');
    }

    /**
     * Show tooltip on hover
     */
    showTooltip(event, d, chapters) {
        // Use fast map lookup instead of searching all chapters
        const sourceChapter = this.chapterLookupMap ? this.chapterLookupMap.get(d.source) : chapters.find(ch => ch.id === d.source);
        const targetChapter = this.chapterLookupMap ? this.chapterLookupMap.get(d.target) : chapters.find(ch => ch.id === d.target);

        // Pre-build HTML string for better performance
        const html = `<strong>Connection</strong><br/>
Source: ${sourceChapter ? sourceChapter.book + ' ' + sourceChapter.chapter : d.source}<br/>
Target: ${targetChapter ? targetChapter.book + ' ' + targetChapter.chapter : d.target}<br/>
Distance: ${d.distance} chapters<br/>
Weight: ${d.weight} references`;

        this.tooltip
            .style('display', 'block')
            .style('left', (event.clientX + 10) + 'px')
            .style('top', (event.clientY - 10) + 'px')
            .html(html);
    }

    /**
     * Hide tooltip
     */
    moveTooltip(event) {
        // INSTANT tooltip positioning using transform (GPU-accelerated)
        this.tooltip
            .style('transform', `translate(${event.clientX + 10}px, ${event.clientY - 10}px)`);
    }

    hideTooltip() {
        this.tooltip.style('display', 'none');
    }

    /**
     * Update arc colors instantly without re-rendering
     * Called when user clicks legend to change color scheme
     */
    updateColors() {
        if (!this.arcsSelection || !this.maxDistance) {
            console.warn('Cannot update colors - visualization not rendered yet');
            return;
        }

        // Create new color scale with current scheme
        const newColorScale = window.colorSchemes.createDistanceScale(this.maxDistance);

        // INSTANT arc color update - direct DOM manipulation (NO D3 overhead)
        const arcs = this.arcsSelection.nodes();
        for (let i = 0; i < arcs.length; i++) {
            const arc = arcs[i];
            const distance = arc.__data__.distance;
            arc.setAttribute('stroke', newColorScale(distance));
        }

        // INSTANT gradient update - batched DOM update
        const gradientNode = document.getElementById('color-gradient-legend');
        if (gradientNode) {
            // Build all stops in memory first (DocumentFragment = batched DOM)
            const fragment = document.createDocumentFragment();
            for (let i = 0; i <= 10; i++) {
                const offset = i * 10;
                const distance = (i / 10) * this.maxDistance;
                const stop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
                stop.setAttribute('offset', `${offset}%`);
                stop.setAttribute('stop-color', newColorScale(distance));
                fragment.appendChild(stop);
            }

            // Single DOM write (MUCH faster than 11 individual D3 operations)
            gradientNode.innerHTML = '';
            gradientNode.appendChild(fragment);
        }

        console.log('⚡ INSTANT color update!');
    }

    showEmptyState(message) {
        this.svg.append('text')
            .attr('x', this.width / 2)
            .attr('y', this.height / 2)
            .attr('text-anchor', 'middle')
            .attr('fill', '#FFD700')
            .attr('font-size', '18px')
            .attr('font-weight', 'bold')
            .text('No Connections Found');

        this.svg.append('text')
            .attr('x', this.width / 2)
            .attr('y', this.height / 2 + 30)
            .attr('text-anchor', 'middle')
            .attr('fill', '#888')
            .attr('font-size', '14px')
            .text(message);

        this.svg.append('text')
            .attr('x', this.width / 2)
            .attr('y', this.height / 2 + 60)
            .attr('text-anchor', 'middle')
            .attr('fill', '#00CED1')
            .attr('font-size', '12px')
            .text('Try lowering the minimum connections slider or changing filters');
    }
}

// Export for use in main.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ArcDiagramTableauStyle;
}
