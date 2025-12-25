// Chord Diagram Visualization
// COMPLETELY REWRITTEN - Simple, stable, correct implementation

class ChordDiagram {
    constructor(svgId, tooltipId) {
        this.svgId = svgId;
        this.tooltipId = tooltipId;
    }

    render(filters = {}) {
        console.log('🎵 CHORD v2.0.0 - OPTIMIZED & BEAUTIFUL');
        const svg = d3.select(`#${this.svgId}`);
        svg.selectAll('*').remove();

        // Get book matrix data
        if (!dataLoader || !dataLoader.isLoaded) {
            this.showError(svg, 'Data not loaded');
            return;
        }

        const bookMatrix = dataLoader.getBookMatrix();
        if (!bookMatrix || !bookMatrix.books || !bookMatrix.matrix) {
            this.showError(svg, 'Book matrix data not available');
            return;
        }

        // Get filtered data
        const books = bookMatrix.books;
        const matrix = bookMatrix.matrix;
        const testament = filters.testament || 'all';

        let filteredBooks = books;
        let filteredMatrix = matrix;

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

        // REDUCE VISUAL CLUTTER: Respect site-wide minConnections filter
        const minConnections = filters.minConnections || 1;
        filteredMatrix = filteredMatrix.map(row =>
            row.map(value => value >= minConnections ? value : 0)
        );

        // SVG dimensions
        const container = document.getElementById(this.svgId);
        const width = container.clientWidth || 1000;
        const baseHeight = 1000;

        // Use responsive sizing for mobile
        const isMobile = window.innerWidth <= 768;
        const displayHeight = isMobile ? Math.min(600, window.innerHeight * 0.7) : baseHeight;
        const height = isMobile ? width : baseHeight; // Square aspect on mobile

        svg.attr('width', '100%')
           .attr('height', displayHeight)
           .attr('viewBox', `0 0 ${width} ${height}`)
           .attr('preserveAspectRatio', 'xMidYMid meet');

        // Diagram sizing - MUCH THICKER ribbons for better visibility
        const outerRadius = Math.min(width, height) * 0.4 - 100;
        const innerRadius = outerRadius - 70; // Increased from 40 to 70 for THICK ribbons

        const g = svg.append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`);

        // Create chord layout
        const chord = d3.chord()
            .padAngle(0.05)
            .sortSubgroups(d3.descending);

        const arc = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);

        const ribbon = d3.ribbon()
            .radius(innerRadius);

        const chords = chord(filteredMatrix);

        // Testament colors - START WITH SIMPLE OT/NT COLORS (green/cyan)
        const otBookCount = testament === 'NT' ? 0 : (testament === 'OT' ? filteredBooks.length : 39);

        const testamentColor = (index) => {
            return index < otBookCount ? '#2ecc71' : '#00CED1';
        };

        // Connection type coloring - matches arc diagram legend
        const getConnectionColor = (sourceIdx, targetIdx) => {
            const sourceIsOT = sourceIdx < otBookCount;
            const targetIsOT = targetIdx < otBookCount;

            if (sourceIsOT && targetIsOT) {
                return '#2ecc71'; // OT → OT: Green
            } else if (!sourceIsOT && !targetIsOT) {
                return '#00CED1'; // NT → NT: Cyan
            } else {
                return '#9370DB'; // Cross-testament: Purple
            }
        };

        // Tooltip
        const tooltip = d3.select(`#${this.tooltipId}`);

        // Draw ribbons (the curved connections) - COLOR BY TESTAMENT (OT/NT)
        const ribbonGroup = g.append('g').attr('class', 'ribbons');

        const ribbonPaths = ribbonGroup
            .selectAll('path')
            .data(chords)
            .join('path')
            .attr('d', ribbon)
            .attr('class', 'chord-ribbon')
            .style('fill', d => {
                return getConnectionColor(d.source.index, d.target.index);
            })
            .style('opacity', 0.75) // Increased from 0.67 for better visibility
            .style('stroke', d => {
                const color = getConnectionColor(d.source.index, d.target.index);
                return d3.rgb(color).darker(0.7);
            })
            .style('stroke-width', 1.5) // Increased from 0.5 for visibility
            .style('shape-rendering', 'geometricPrecision')
            .style('mix-blend-mode', 'normal') // Changed from 'multiply' to avoid muddy appearance
            .style('transition', 'none'); // Disable transitions for instant response

        // Store ribbons selection and data for color updates
        this.ribbonsSelection = ribbonPaths;
        this.maxBookDistance = filteredBooks.length - 1; // For distance-based coloring when theme changes
        this.otBookCount = otBookCount;
        this.getConnectionColor = getConnectionColor;

        // INSTANT HOVER with direct DOM manipulation (no D3 lag)
        ribbonPaths.nodes().forEach((ribbonNode, i) => {
            ribbonNode.addEventListener('mouseenter', (event) => {
                const d = ribbonPaths.data()[i];

                // DIM all ribbons INSTANTLY with direct DOM
                document.querySelectorAll('.chord-ribbon').forEach(r => {
                    r.style.opacity = '0.08'; // Much dimmer
                });

                // BRIGHTEN this ribbon
                event.target.style.opacity = '1';
                event.target.style.strokeWidth = '2.5';

                // Show tooltip
                tooltip.style('display', 'block')
                    .style('position', 'fixed')
                    .style('left', '0')
                    .style('top', '0')
                    .style('willChange', 'transform')
                    .style('transform', `translate(${event.clientX + 10}px, ${event.clientY - 10}px)`)
                    .html(`<strong>${filteredBooks[d.source.index]} → ${filteredBooks[d.target.index]}</strong><br>
                           Distance: ${Math.abs(d.source.index - d.target.index)} books apart<br>
                           Connections: ${d.source.value} cross-references`);
            });

            ribbonNode.addEventListener('mousemove', (event) => {
                tooltip.style('transform', `translate(${event.clientX + 10}px, ${event.clientY - 10}px)`);
            });

            ribbonNode.addEventListener('mouseleave', (event) => {
                // RESTORE all ribbons
                document.querySelectorAll('.chord-ribbon').forEach(r => {
                    r.style.opacity = '0.75';
                    r.style.strokeWidth = '1.5';
                });

                tooltip.style('display', 'none')
                    .style('willChange', 'auto');
            });
        });

        // Draw book arcs
        const groupData = chords.groups;
        const groups = g.append('g')
            .attr('class', 'groups')
            .selectAll('g')
            .data(groupData)
            .join('g');

        const groupArcs = groups.append('path')
            .attr('d', arc)
            .attr('class', 'chord-book-arc')
            .style('fill', d => testamentColor(d.index))
            .style('stroke', '#FFD700')
            .style('stroke-width', 3)
            .style('transition', 'none'); // Instant response

        // INSTANT HOVER for book arcs with direct DOM
        groupArcs.nodes().forEach((arcNode, i) => {
            arcNode.addEventListener('mouseenter', (event) => {
                const d = groupArcs.data()[i];
                const groupIndex = d.index;

                // Highlight THIS book arc
                event.target.style.opacity = '1';
                event.target.style.strokeWidth = '5';

                // DIM all ribbons EXCEPT those connected to this book
                document.querySelectorAll('.chord-ribbon').forEach((r, idx) => {
                    const ribbonData = ribbonPaths.data()[idx];
                    const isConnected = ribbonData.source.index === groupIndex || ribbonData.target.index === groupIndex;
                    r.style.opacity = isConnected ? '0.95' : '0.05';
                });

                tooltip.style('display', 'block')
                    .style('position', 'fixed')
                    .style('left', '0')
                    .style('top', '0')
                    .style('willChange', 'transform')
                    .style('transform', `translate(${event.clientX + 10}px, ${event.clientY - 10}px)`)
                    .html(`<strong>${filteredBooks[d.index]}</strong><br>
                           Total: ${d.value} connections<br>
                           Testament: ${d.index < otBookCount ? 'Old Testament' : 'New Testament'}`);
            });

            arcNode.addEventListener('mousemove', (event) => {
                tooltip.style('transform', `translate(${event.clientX + 10}px, ${event.clientY - 10}px)`);
            });

            arcNode.addEventListener('mouseleave', (event) => {
                // RESTORE everything
                event.target.style.opacity = '1';
                event.target.style.strokeWidth = '3';

                document.querySelectorAll('.chord-ribbon').forEach(r => {
                    r.style.opacity = '0.75';
                });

                tooltip.style('display', 'none')
                    .style('willChange', 'auto');
            });
        });

        // Add labels
        groups.append('text')
            .each(d => { d.angle = (d.startAngle + d.endAngle) / 2; })
            .attr('dy', '.35em')
            .attr('transform', d => `
                rotate(${(d.angle * 180 / Math.PI - 90)})
                translate(${outerRadius + 30})
                ${d.angle > Math.PI ? 'rotate(180)' : ''}
            `)
            .attr('text-anchor', d => d.angle > Math.PI ? 'end' : 'start')
            .text(d => filteredBooks[d.index])
            .style('font-size', '11px')
            .style('font-weight', 'bold')
            .style('fill', '#FFD700')
            .style('pointer-events', 'none');

        // Title with color scheme info
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', 30)
            .attr('text-anchor', 'middle')
            .style('fill', '#FFD700')
            .style('font-size', '22px')
            .style('font-weight', 'bold')
            .text('Bible Book Cross-References');

        // Subtitle with color scheme
        const currentScheme = window.colorSchemes.getCurrentScheme();
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', 50)
            .attr('text-anchor', 'middle')
            .style('fill', '#888')
            .style('font-size', '14px')
            .text(`${currentScheme.emoji} ${currentScheme.description} (click legend to change)`);

        // Testament-based color legend (simple default view)
        const legendY = height - 100;
        const legendItemWidth = 150;
        const legendStartX = width / 2 - (legendItemWidth * 1.5);

        const legendData = [
            { label: 'Old Testament', color: '#2ecc71' },
            { label: 'New Testament', color: '#00CED1' },
            { label: 'Cross-Testament', color: '#9370DB' }
        ];

        const legendGroup = svg.append('g')
            .attr('class', 'chord-legend')
            .attr('transform', `translate(${legendStartX}, ${legendY})`);

        legendData.forEach((item, i) => {
            const itemGroup = legendGroup.append('g')
                .attr('transform', `translate(${i * legendItemWidth}, 0)`);

            // Color box
            itemGroup.append('rect')
                .attr('width', 20)
                .attr('height', 20)
                .attr('fill', item.color)
                .attr('stroke', '#444')
                .attr('stroke-width', 1);

            // Label
            itemGroup.append('text')
                .attr('x', 28)
                .attr('y', 15)
                .style('fill', '#FFD700')
                .style('font-size', '13px')
                .style('font-weight', '600')
                .text(item.label);
        });

        // Distance-based color legend (matches arc diagram style)
        this.drawColorLegend(svg, width, legendY + 40);

        // Testament legend (if showing all)
        if (testament === 'all') {
            const testamentLegend = svg.append('g')
                .attr('transform', `translate(30, ${height - 100})`);

            testamentLegend.append('rect').attr('width', 20).attr('height', 20).style('fill', '#2ecc71');
            testamentLegend.append('text').attr('x', 25).attr('y', 15).text('Old Testament').style('fill', '#FFD700').style('font-size', '14px');

            testamentLegend.append('rect').attr('y', 30).attr('width', 20).attr('height', 20).style('fill', '#00CED1');
            testamentLegend.append('text').attr('x', 25).attr('y', 45).text('New Testament').style('fill', '#FFD700').style('font-size', '14px');
        }

        // Info text
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', height - 20)
            .attr('text-anchor', 'middle')
            .style('fill', '#00CED1')
            .style('font-size', '13px')
            .text(`${filteredBooks.length} books • Hover over arcs or ribbons for details`);
    }

    showError(svg, message) {
        const width = 900;
        const height = 600;
        svg.attr('width', width).attr('height', height);
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

    /**
     * Draw color gradient legend (clickable to change schemes)
     * Matches arc diagram style
     */
    drawColorLegend(svg, width, legendY) {
        const legendWidth = 300;
        const legendHeight = 20;
        const legendX = width / 2 - legendWidth / 2;

        // Create gradient
        const gradient = svg.append('defs')
            .append('linearGradient')
            .attr('id', 'chord-color-gradient-legend')
            .attr('x1', '0%')
            .attr('x2', '100%');

        // Add color stops
        const colorScale = window.colorSchemes.createDistanceScale(this.maxBookDistance);
        for (let i = 0; i <= 10; i++) {
            const offset = i * 10;
            const distance = (i / 10) * this.maxBookDistance;
            gradient.append('stop')
                .attr('offset', `${offset}%`)
                .attr('stop-color', colorScale(distance));
        }

        // Draw legend rectangle (CLICKABLE!)
        svg.append('rect')
            .attr('x', legendX)
            .attr('y', legendY)
            .attr('width', legendWidth)
            .attr('height', legendHeight)
            .attr('fill', 'url(#chord-color-gradient-legend)')
            .attr('stroke', '#444')
            .attr('stroke-width', 1)
            .style('cursor', 'pointer')
            .on('click', () => {
                // Cycle to next color scheme
                const newScheme = window.colorSchemes.nextScheme();
                console.log(`🎨 Switched to ${newScheme.name} ${newScheme.emoji}`);

                // Update colors instantly
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
        svg.append('text')
            .attr('x', legendX)
            .attr('y', legendY - 5)
            .attr('fill', '#888')
            .attr('font-size', '12px')
            .text('Close');

        svg.append('text')
            .attr('x', legendX + legendWidth)
            .attr('y', legendY - 5)
            .attr('text-anchor', 'end')
            .attr('fill', '#888')
            .attr('font-size', '12px')
            .text('Far Apart');

        svg.append('text')
            .attr('x', legendX + legendWidth / 2)
            .attr('y', legendY + legendHeight + 15)
            .attr('text-anchor', 'middle')
            .attr('fill', '#888')
            .attr('font-size', '11px')
            .text('Distance Between Books (click to change colors)');
    }

    /**
     * Update ribbon colors instantly without re-rendering
     * Called when user clicks legend to change color scheme
     */
    updateColors() {
        if (!this.ribbonsSelection || !this.maxBookDistance) {
            console.warn('Cannot update colors - visualization not rendered yet');
            return;
        }

        // Create new color scale with current scheme
        const newColorScale = window.colorSchemes.createDistanceScale(this.maxBookDistance);

        // INSTANT ribbon color update - direct DOM manipulation
        const ribbons = this.ribbonsSelection.nodes();
        const ribbonData = this.ribbonsSelection.data();

        for (let i = 0; i < ribbons.length; i++) {
            const ribbon = ribbons[i];
            const d = ribbonData[i];
            const distance = Math.abs(d.target.index - d.source.index);

            ribbon.style.fill = newColorScale(distance);
            ribbon.style.stroke = d3.rgb(newColorScale(distance)).darker(0.7);
        }

        // INSTANT gradient update - batched DOM update
        const gradientNode = document.getElementById('chord-color-gradient-legend');
        if (gradientNode) {
            const fragment = document.createDocumentFragment();
            for (let i = 0; i <= 10; i++) {
                const offset = i * 10;
                const distance = (i / 10) * this.maxBookDistance;
                const stop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
                stop.setAttribute('offset', `${offset}%`);
                stop.setAttribute('stop-color', newColorScale(distance));
                fragment.appendChild(stop);
            }

            gradientNode.innerHTML = '';
            gradientNode.appendChild(fragment);
        }

        console.log('⚡ INSTANT color update on chord diagram!');
    }
}
