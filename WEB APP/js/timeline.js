// Timeline Visualization - REDESIGNED
// Chronological view of biblical events and periods with intelligent spacing

class Timeline {
    constructor(svgId, tooltipId) {
        this.svgId = svgId;
        this.tooltipId = tooltipId;
        this.currentZoom = 1;
        this.zoomTransform = null;
    }

    async render(filters = {}) {
        console.log('🕐 TIMELINE RENDER START');
        console.log('📍 theographicLoader exists?', !!theographicLoader);
        console.log('📍 theographicLoader.isLoaded?', theographicLoader?.isLoaded);

        const svg = d3.select(`#${this.svgId}`);
        console.log('🗑️ SVG cleared');
        svg.selectAll('*').remove();

        // Check if theographic data is loaded - if not, load it NOW
        if (!theographicLoader || !theographicLoader.isLoaded) {
            console.log('⚠️ Theographic data NOT loaded - showing loading screen');
            this.showLoading(svg);

            // Actually trigger the load!
            try {
                console.log('🚀 Loading theographic data for timeline...');
                await theographicLoader.load('data/');
                console.log('✅ Theographic loaded! Rendering timeline');
                // Recursively call render again now that data is loaded
                return this.render(filters);
            } catch (error) {
                console.error('❌ Failed to load theographic data:', error);
                this.showError(svg, 'Failed to load timeline data');
                return;
            }
        }
        console.log('✅ Theographic data IS loaded, proceeding with render');

        let events = theographicLoader.getEventsTimeline();
        const periods = theographicLoader.getPeriods();

        if (!events || events.length === 0) {
            this.showError(svg, 'No timeline data available');
            return;
        }

        // Apply minConnections filter
        const minConnections = filters.minConnections || 1;
        if (minConnections > 1) {
            events = events.filter(e => (e.fields?.verseCount || 0) >= minConnections);
        }

        // Set dimensions
        const container = document.getElementById(this.svgId);
        const viewportWidth = container.clientWidth || 1200;
        const viewportHeight = 800;

        // CRITICAL: Make timeline 10x wider for proper spacing
        const timelineWidth = viewportWidth * 10;
        const height = viewportHeight;

        svg.attr('width', viewportWidth)
           .attr('height', height)
           .style('background', '#0a0e1a');

        const margin = { top: 100, right: 100, bottom: 100, left: 100 };
        const innerWidth = timelineWidth - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        // Create main group for zoomable content
        const zoomGroup = svg.append('g')
            .attr('class', 'zoom-group');

        const g = zoomGroup.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        // Prepare time scale
        const allPeriods = periods.filter(p => p.fields.yearNum !== undefined);
        allPeriods.sort((a, b) => (a.fields.yearNum || 0) - (b.fields.yearNum || 0));

        if (allPeriods.length === 0) {
            this.showError(svg, 'No period data available for timeline');
            return;
        }

        const minYear = Math.min(...allPeriods.map(p => p.fields.yearNum || 0));
        const maxYear = Math.max(...allPeriods.map(p => p.fields.yearNum || 0));
        const yearRange = maxYear - minYear;

        // X scale for time - MUCH wider for spacing
        const xScale = d3.scaleLinear()
            .domain([minYear, maxYear])
            .range([0, innerWidth]);

        // Tooltip
        const tooltip = d3.select(`#${this.tooltipId}`);

        // Draw year axis with clear markers
        this.drawYearAxis(g, xScale, minYear, maxYear, innerHeight);

        // Draw timeline base
        g.append('line')
            .attr('class', 'timeline-base')
            .attr('x1', 0)
            .attr('y1', innerHeight / 2)
            .attr('x2', innerWidth)
            .attr('y2', innerHeight / 2)
            .attr('stroke', '#FFD700')
            .attr('stroke-width', 4)
            .attr('opacity', 0.8);

        // Prepare events with positions
        const eventsWithPositions = this.calculateEventPositions(events, xScale, innerHeight);

        // Create event groups
        const eventGroups = g.selectAll('.event-group')
            .data(eventsWithPositions)
            .enter()
            .append('g')
            .attr('class', d => `event-group importance-${this.getImportanceLevel(d.event)}`)
            .attr('transform', d => `translate(${d.x}, ${d.y})`);

        // Connection lines
        eventGroups.append('line')
            .attr('class', 'event-connection')
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', 0)
            .attr('y2', d => (innerHeight / 2) - d.y)
            .attr('stroke', '#00CED1')
            .attr('stroke-width', 1.5)
            .attr('stroke-dasharray', '4,4')
            .attr('opacity', 0.4);

        // Event markers
        eventGroups.append('circle')
            .attr('class', 'event-marker')
            .attr('r', d => this.getEventRadius(d.event))
            .attr('fill', d => this.getEventColor(d.event))
            .attr('stroke', '#FFD700')
            .attr('stroke-width', 2)
            .attr('opacity', 0.9)
            .style('cursor', 'pointer')
            .on('mouseover', (event, d) => {
                d3.select(event.currentTarget)
                    .transition()
                    .duration(200)
                    .attr('r', this.getEventRadius(d.event) * 1.5)
                    .attr('stroke-width', 3);

                tooltip.style('display', 'block')
                    .html(`
                        <strong style="color: #FFD700;">${d.event.fields?.name || 'Biblical Event'}</strong><br>
                        <span style="color: #00CED1;">Period: ${d.event.periodInfo?.fields?.name || 'Unknown'}</span><br>
                        <span style="color: #aaa;">${d.event.fields?.description || 'Event in biblical history'}</span><br>
                        <span style="color: #2ecc71;">📖 ${d.event.fields?.verseCount || 0} verse mentions</span>
                    `);
            })
            .on('mousemove', (event) => {
                tooltip.style('transform', `translate(${event.clientX + 10}px, ${event.clientY - 10}px)`);
            })
            .on('mouseout', (event, d) => {
                d3.select(event.currentTarget)
                    .transition()
                    .duration(200)
                    .attr('r', this.getEventRadius(d.event))
                    .attr('stroke-width', 2);
                tooltip.style('display', 'none');
            });

        // Event labels - will be shown/hidden based on zoom
        eventGroups.append('text')
            .attr('class', 'event-label')
            .attr('dx', d => this.getEventRadius(d.event) + 8)
            .attr('dy', 4)
            .attr('fill', '#00CED1')
            .attr('font-size', '11px')
            .attr('font-weight', 'bold')
            .attr('stroke', '#0a0e1a')
            .attr('stroke-width', 3)
            .attr('paint-order', 'stroke')
            .attr('opacity', d => this.getLabelOpacity(d.event, 1))
            .text(d => d.event.fields?.name || 'Event');

        // Add zoom behavior with progressive detail
        const zoom = d3.zoom()
            .scaleExtent([0.5, 20])
            .translateExtent([[0, -height], [timelineWidth, height * 2]])
            .on('zoom', (event) => {
                this.currentZoom = event.transform.k;
                this.zoomTransform = event.transform;

                zoomGroup.attr('transform', event.transform);

                // Update label visibility based on zoom
                eventGroups.selectAll('.event-label')
                    .attr('opacity', d => this.getLabelOpacity(d.event, this.currentZoom));

                // Update year axis labels based on zoom
                this.updateYearAxisForZoom(this.currentZoom);
            });

        svg.call(zoom);

        // Set initial zoom to show full timeline (zoom out to 0.15x)
        const initialScale = 0.15;
        const initialTransform = d3.zoomIdentity
            .translate(margin.left, 0)
            .scale(initialScale);

        svg.call(zoom.transform, initialTransform);
        this.currentZoom = initialScale;

        // Store zoom reference for later updates
        this.svg = svg;
        this.zoom = zoom;
        this.eventGroups = eventGroups;

        // Add title
        svg.append('text')
            .attr('x', viewportWidth / 2)
            .attr('y', 35)
            .attr('text-anchor', 'middle')
            .attr('fill', '#FFD700')
            .attr('font-size', '24px')
            .attr('font-weight', 'bold')
            .text(`Biblical Timeline - ${events.length} Events across ${yearRange} Years`);

        // Add instructions
        const filterActive = minConnections > 1;
        let subtitleText = '🖱️ Scroll to zoom (20x) | Drag to pan | Hover events for details';
        if (filterActive) {
            subtitleText = `Showing ${events.length} events with ≥ ${minConnections} verse mentions | Zoom in for more detail`;
        }

        svg.append('text')
            .attr('x', viewportWidth / 2)
            .attr('y', 60)
            .attr('text-anchor', 'middle')
            .attr('fill', filterActive ? '#2ecc71' : '#00CED1')
            .attr('font-size', '13px')
            .text(subtitleText);

        // Add zoom level indicator
        svg.append('text')
            .attr('class', 'zoom-indicator')
            .attr('x', viewportWidth - 100)
            .attr('y', 35)
            .attr('text-anchor', 'middle')
            .attr('fill', '#FFD700')
            .attr('font-size', '12px')
            .text(`Zoom: ${initialScale.toFixed(2)}x`);

        // Update zoom indicator on zoom
        svg.on('zoom.indicator', () => {
            svg.select('.zoom-indicator')
                .text(`Zoom: ${this.currentZoom.toFixed(1)}x`);
        });

        console.log('✅ TIMELINE RENDER COMPLETE');
        console.log(`📏 Timeline width: ${timelineWidth}px (${viewportWidth}px viewport)`);
        console.log(`📊 Events rendered: ${events.length}`);
    }

    // Calculate smart vertical positions to avoid overlaps
    calculateEventPositions(events, xScale, innerHeight) {
        const positions = [];
        const lanes = 20; // More lanes for better distribution
        const laneHeight = (innerHeight * 0.85) / lanes; // Use 85% of height
        const centerY = innerHeight / 2;

        // Track occupied positions to avoid overlaps
        const occupiedRanges = Array(lanes).fill().map(() => []);

        events.forEach(event => {
            if (!event.periodInfo || !event.periodInfo.fields.yearNum) return;

            const x = xScale(event.periodInfo.fields.yearNum);

            // Find best lane for this event (least crowded)
            let bestLane = 0;
            let minOverlaps = Infinity;

            for (let lane = 0; lane < lanes; lane++) {
                const overlaps = occupiedRanges[lane].filter(range =>
                    x >= range[0] - 100 && x <= range[1] + 100
                ).length;

                if (overlaps < minOverlaps) {
                    minOverlaps = overlaps;
                    bestLane = lane;
                }
            }

            // Alternate above/below centerline - spread out more
            const isAbove = bestLane % 2 === 0;
            const laneOffset = Math.floor(bestLane / 2) * laneHeight;
            const y = isAbove ? centerY - laneOffset - 40 : centerY + laneOffset + 40;

            // Mark this x range as occupied in this lane
            occupiedRanges[bestLane].push([x - 50, x + 50]);

            positions.push({ event, x, y });
        });

        return positions;
    }

    // Draw year axis with intelligent markers
    drawYearAxis(g, xScale, minYear, maxYear, innerHeight) {
        const yearRange = maxYear - minYear;
        const baseInterval = yearRange < 1000 ? 100 : yearRange < 3000 ? 200 : 500;

        const years = [];
        for (let year = Math.ceil(minYear / baseInterval) * baseInterval; year <= maxYear; year += baseInterval) {
            years.push(year);
        }

        const yearMarkers = g.selectAll('.year-marker')
            .data(years)
            .enter()
            .append('g')
            .attr('class', 'year-marker')
            .attr('transform', d => `translate(${xScale(d)}, ${innerHeight / 2})`);

        // Tick marks
        yearMarkers.append('line')
            .attr('y1', -10)
            .attr('y2', 10)
            .attr('stroke', '#FFD700')
            .attr('stroke-width', 2)
            .attr('opacity', 0.7);

        // Year labels
        this.yearLabels = yearMarkers.append('text')
            .attr('class', 'year-label')
            .attr('y', 30)
            .attr('text-anchor', 'middle')
            .attr('fill', '#FFD700')
            .attr('font-size', '12px')
            .attr('font-weight', 'bold')
            .text(d => {
                if (d < 0) return `${Math.abs(d)} BC`;
                if (d === 0) return '0';
                return `${d} AD`;
            });
    }

    updateYearAxisForZoom(zoomLevel) {
        // Show more/fewer year labels based on zoom
        if (this.yearLabels) {
            this.yearLabels.attr('opacity', d => {
                if (zoomLevel > 5) return 1; // Show all at high zoom
                if (zoomLevel > 2) return d % 200 === 0 ? 1 : 0; // Show every 200 years
                return d % 500 === 0 ? 1 : 0; // Show every 500 years at low zoom
            });
        }
    }

    // Determine event importance level (1-4, higher = more important)
    getImportanceLevel(event) {
        const verseCount = event.fields?.verseCount || 0;
        if (verseCount >= 100) return 4; // Critical events
        if (verseCount >= 50) return 3;  // Major events
        if (verseCount >= 20) return 2;  // Medium events
        return 1; // Minor events
    }

    // Get event marker radius based on importance
    getEventRadius(event) {
        const importance = this.getImportanceLevel(event);
        return importance * 4 + 6; // 10px to 22px - bigger and more visible
    }

    // Get event color based on importance
    getEventColor(event) {
        const importance = this.getImportanceLevel(event);
        const colors = {
            4: '#FF4444', // Critical - bright red
            3: '#FF6B35', // Major - orange
            2: '#F7931E', // Medium - orange-yellow
            1: '#FFC107'  // Minor - yellow
        };
        return colors[importance];
    }

    // Determine label opacity based on event importance and zoom level
    getLabelOpacity(event, zoomLevel) {
        // Show ALL labels at all zoom levels (user requested)
        return 1;
    }

    showLoading(svg) {
        const container = document.getElementById(this.svgId);
        const width = container.clientWidth || 1200;
        const height = 800;

        svg.attr('width', width)
           .attr('height', height);

        svg.append('text')
            .attr('x', width / 2)
            .attr('y', height / 2 - 20)
            .attr('text-anchor', 'middle')
            .attr('fill', '#00CED1')
            .attr('font-size', '18px')
            .text('Loading theographic data...');

        svg.append('text')
            .attr('x', width / 2)
            .attr('y', height / 2 + 10)
            .attr('text-anchor', 'middle')
            .attr('fill', '#FFD700')
            .attr('font-size', '14px')
            .text('450 events, 250 periods, biblical timeline');
    }

    showError(svg, message) {
        const container = document.getElementById(this.svgId);
        const width = container.clientWidth || 1200;
        const height = 800;

        svg.attr('width', width)
           .attr('height', height);

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
