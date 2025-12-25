// Radial Arc Diagram - Full Circle Visualization

class RadialArc {
    constructor(svgId, tooltipId) {
        this.svgId = svgId;
        this.tooltipId = tooltipId;
        this.svg = null;
        this.tooltip = null;
        this.width = 0;
        this.height = 0;
        this.radius = 0;
    }

    render(filters = {}) {
        const container = document.getElementById(this.svgId);
        if (!container) {
            console.error(`Container not found: #${this.svgId}`);
            return;
        }
        container.innerHTML = '';

        if (!dataLoader || !dataLoader.isLoaded) {
            console.error('Data not loaded yet');
            return;
        }

        // Set dimensions - square container for circular diagram
        const containerWidth = container.clientWidth || 800;
        const padding = 120;

        // Make SVG smaller to fit properly on screen (75% of container)
        this.width = containerWidth * 0.75;
        this.height = containerWidth * 0.75; // Square!

        // Calculate radius
        this.radius = Math.min(this.width, this.height) / 2 - padding;

        // Simple viewBox without crazy offsets
        this.svg = d3.select(`#${this.svgId}`)
            .attr('width', '100%')
            .attr('height', this.height)
            .attr('viewBox', `0 0 ${this.width} ${this.height}`)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('overflow', 'visible');

        this.tooltip = document.getElementById(this.tooltipId);

        // Get data
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

        // Limit connections for performance (reduced for instant response)
        const limitedForPerformance = connections.length > 3000;
        if (limitedForPerformance) {
            connections = connections
                .sort((a, b) => b.weight - a.weight)
                .slice(0, 3000);
        }

        this.drawRadialDiagram(chapters, connections, filters, originalCount, limitedForPerformance);
    }

    drawRadialDiagram(chapters, connections, filters = {}, originalCount = connections.length, limitedForPerformance = false) {
        const centerX = this.width / 2;
        const centerY = this.height / 2;

        // Create main group
        const g = this.svg.append('g')
            .attr('transform', `translate(${centerX}, ${centerY})`);

        // FIX: Create chapter maps for safe lookup (prevents undefined crashes)
        const chapterIndexMap = new Map();
        const chapterLookupMap = new Map();
        chapters.forEach((ch, idx) => {
            chapterIndexMap.set(ch.id, idx);  // ID → array index
            chapterLookupMap.set(ch.id, ch);   // ID → chapter object
        });

        // Store for later use (tooltips, stats)
        this.chapterLookupMap = chapterLookupMap;
        this.chapterIndexMap = chapterIndexMap;

        // FIX: Filter out invalid connections before rendering
        const preFilterCount = connections.length;
        connections = connections.filter(conn => {
            return chapterIndexMap.has(conn.source) && chapterIndexMap.has(conn.target);
        });

        if (connections.length < preFilterCount) {
            console.log(`✅ Radial: Filtered ${preFilterCount} → ${connections.length} valid connections`);
        }

        // Calculate angles for each chapter (using INDEX not ID!)
        const angleScale = d3.scaleLinear()
            .domain([0, chapters.length])
            .range([0, 2 * Math.PI]);

        // Color scales
        const testamentColors = {
            'OT': '#2ecc71',
            'NT': '#00CED1'
        };

        // Create arc generator for connections
        const arcGenerator = d3.arc()
            .innerRadius(0)
            .outerRadius(this.radius);

        // Draw connections as arcs
        const maxWeight = d3.max(connections, d => d.weight) || 1;

        // Group connections by distance for color gradient
        connections.forEach(conn => {
            const sourceIdx = chapterIndexMap.get(conn.source);
            const targetIdx = chapterIndexMap.get(conn.target);
            const distance = Math.abs(targetIdx - sourceIdx);
            conn.distance = Math.min(distance, chapters.length - distance);
        });

        this.maxDistance = d3.max(connections, d => d.distance) || 1;

        // Use color scheme system (same as arc diagram)
        const colorScale = window.colorSchemes.createDistanceScale(this.maxDistance);

        // Draw connection arcs - DEFAULT BRIGHT
        this.arcLinesSelection = g.selectAll('.radial-arc')
            .data(connections)
            .enter()
            .append('path')
            .attr('class', 'radial-arc')
            .attr('d', d => {
                // Convert IDs to indices for angleScale
                const sourceIdx = this.chapterIndexMap.get(d.source);
                const targetIdx = this.chapterIndexMap.get(d.target);

                const sourceAngle = angleScale(sourceIdx);
                const targetAngle = angleScale(targetIdx);
                const sourceX = this.radius * Math.cos(sourceAngle - Math.PI / 2);
                const sourceY = this.radius * Math.sin(sourceAngle - Math.PI / 2);
                const targetX = this.radius * Math.cos(targetAngle - Math.PI / 2);
                const targetY = this.radius * Math.sin(targetAngle - Math.PI / 2);

                // Quadratic bezier through center - viewBox now has room for overshoot
                return `M ${sourceX},${sourceY}
                        Q 0,0 ${targetX},${targetY}`;
            })
            .style('fill', 'none')
            .style('stroke', d => colorScale(d.distance))
            .style('stroke-width', d => Math.max(0.5, Math.sqrt(d.weight) / 4))
            .style('stroke-opacity', 0.8) // BRIGHT by default
            .style('pointer-events', 'all')
            .style('cursor', 'pointer')
            .style('transition', 'none') // INSTANT changes, no lag
            .each(function(d) {
                // Store original width for fast reset
                this._originalWidth = Math.max(0.5, Math.sqrt(d.weight) / 4);
            })
            .on('mouseenter', (event, d) => {
                const sourceChapter = this.chapterLookupMap.get(d.source);
                const targetChapter = this.chapterLookupMap.get(d.target);

                // Clear any pending restore timeout
                if (this.restoreTimeout) {
                    clearTimeout(this.restoreTimeout);
                    this.restoreTimeout = null;
                }

                // DIM all arcs, BRIGHTEN hovered one (INSTANT with direct DOM)
                document.querySelectorAll('.radial-arc').forEach(arc => {
                    arc.style.strokeOpacity = '0.02'; // MUCH dimmer
                });
                event.target.style.strokeOpacity = '1';
                event.target.style.strokeWidth = '4'; // Thicker
                event.target.style.filter = 'brightness(1.5)'; // BRIGHTER

                // Calculate distance using indices
                const sourceIdx = this.chapterIndexMap.get(d.source);
                const targetIdx = this.chapterIndexMap.get(d.target);
                const distance = Math.abs(targetIdx - sourceIdx);
                const actualDistance = Math.min(distance, chapters.length - distance);

                if (this.tooltip) {
                    this.tooltip.style.display = 'block';
                    this.tooltip.style.willChange = 'transform'; // GPU acceleration
                    this.tooltip.style.transform = `translate(${event.clientX + 10}px, ${event.clientY - 10}px)`;
                    this.tooltip.innerHTML = `
                        <div style="color: #FFD700; font-weight: bold; margin-bottom: 6px; font-size: 14px;">
                            📖 Cross-Reference
                        </div>
                        <div style="color: ${sourceChapter.testament === 'OT' ? '#2ecc71' : '#00CED1'}; margin-bottom: 3px;">
                            <strong>${sourceChapter.label}</strong>
                        </div>
                        <div style="color: #FFD700; margin-bottom: 3px;">
                            ↓ ${d.weight} connection${d.weight > 1 ? 's' : ''}
                        </div>
                        <div style="color: ${targetChapter.testament === 'OT' ? '#2ecc71' : '#00CED1'};">
                            <strong>${targetChapter.label}</strong>
                        </div>
                        <div style="color: #888; font-size: 11px; margin-top: 6px; border-top: 1px solid #444; padding-top: 4px;">
                            Distance: ${actualDistance} chapters | ${sourceChapter.testament} → ${targetChapter.testament}
                        </div>
                    `;
                }
            })
            .on('mousemove', (event) => {
                // Direct update - no throttling, INSTANT
                if (this.tooltip) {
                    this.tooltip.style.transform = `translate(${event.clientX + 10}px, ${event.clientY - 10}px)`;
                }
            })
            .on('mouseleave', (event) => {
                // Hide tooltip
                if (this.tooltip) {
                    this.tooltip.style.display = 'none';
                    this.tooltip.style.willChange = 'auto'; // Release GPU resources
                }

                // Auto-restore brightness after 200ms if no other arc is hovered
                this.restoreTimeout = setTimeout(() => {
                    document.querySelectorAll('.radial-arc').forEach(arc => {
                        arc.style.strokeOpacity = '0.8';
                        arc.style.strokeWidth = arc._originalWidth || '1';
                        arc.style.filter = 'none';
                    });
                }, 200);
            });

        // Draw chapter dots around the circle edge
        g.selectAll('.chapter-dot')
            .data(chapters)
            .enter()
            .append('circle')
            .attr('class', 'chapter-dot')
            .attr('cx', d => {
                const angle = angleScale(this.chapterIndexMap.get(d.id)) - Math.PI / 2;
                return this.radius * Math.cos(angle);
            })
            .attr('cy', d => {
                const angle = angleScale(this.chapterIndexMap.get(d.id)) - Math.PI / 2;
                return this.radius * Math.sin(angle);
            })
            .attr('r', 1.5)
            .attr('fill', d => testamentColors[d.testament])
            .attr('opacity', 0.6);

        // Add book labels - only show major books (10+ chapters) to reduce clutter
        const bookStarts = [];
        let lastBook = '';
        chapters.forEach((chapter, i) => {
            if (chapter.book !== lastBook) {
                const totalChapters = chapters.filter(ch => ch.book === chapter.book).length;
                bookStarts.push({
                    index: i,
                    book: chapter.book,
                    testament: chapter.testament,
                    totalChapters: totalChapters
                });
                lastBook = chapter.book;
            }
        });

        // Add book labels at the MIDDLE of each book's arc
        g.selectAll('.book-label')
            .data(bookStarts)
            .enter()
            .append('text')
            .attr('class', 'book-label')
            .attr('transform', d => {
                // Position label at the MIDDLE of the book's chapters
                const midChapter = d.index + (d.totalChapters / 2);
                const angle = angleScale(midChapter) - Math.PI / 2;
                const x = (this.radius + 35) * Math.cos(angle);
                const y = (this.radius + 35) * Math.sin(angle);
                const rotation = (angle * 180 / Math.PI) + (angle > Math.PI / 2 && angle < (3 * Math.PI / 2) ? 180 : 0);
                return `translate(${x}, ${y}) rotate(${rotation})`;
            })
            .style('text-anchor', 'middle')
            .style('fill', '#FFD700')
            .style('font-size', '10px')
            .style('font-weight', '500')
            .style('opacity', '0.8')
            .text(d => d.book);

        // Add center title and stats
        g.append('text')
            .attr('x', 0)
            .attr('y', -40)
            .style('text-anchor', 'middle')
            .style('fill', 'var(--primary-gold)')
            .style('font-size', '24px')
            .style('font-weight', 'bold')
            .text('✟');

        // Show filtered count if filters active
        const minConnections = filters.minConnections || 1;
        const filterActive = minConnections > 1 || filters.testament !== 'all' || filters.book;

        let countText = `${connections.length.toLocaleString()}`;
        if (limitedForPerformance && originalCount > connections.length) {
            countText += ` of ${originalCount.toLocaleString()}`;
        }
        countText += ' Cross-References';
        if (minConnections > 1) {
            countText += ` (min ≥ ${minConnections})`;
        }

        g.append('text')
            .attr('x', 0)
            .attr('y', -10)
            .style('text-anchor', 'middle')
            .style('fill', filterActive ? '#FFD700' : '#FFD700')
            .style('font-size', filterActive ? '13px' : '14px')
            .style('font-weight', 'bold')
            .text(countText);

        // Calculate testament statistics
        const otConnections = connections.filter(c => {
            const source = this.chapterLookupMap.get(c.source);
            const target = this.chapterLookupMap.get(c.target);
            return source && target && source.testament === 'OT' && target.testament === 'OT';
        }).length;
        const ntConnections = connections.filter(c => {
            const source = this.chapterLookupMap.get(c.source);
            const target = this.chapterLookupMap.get(c.target);
            return source && target && source.testament === 'NT' && target.testament === 'NT';
        }).length;
        const crossTestament = connections.length - otConnections - ntConnections;

        g.append('text')
            .attr('x', 0)
            .attr('y', 10)
            .style('text-anchor', 'middle')
            .style('fill', '#2ecc71')
            .style('font-size', '11px')
            .text(`OT: ${otConnections.toLocaleString()}`);

        g.append('text')
            .attr('x', 0)
            .attr('y', 25)
            .style('text-anchor', 'middle')
            .style('fill', '#00CED1')
            .style('font-size', '11px')
            .text(`NT: ${ntConnections.toLocaleString()}`);

        g.append('text')
            .attr('x', 0)
            .attr('y', 40)
            .style('text-anchor', 'middle')
            .style('fill', '#FFD700')
            .style('font-size', '11px')
            .text(`Cross: ${crossTestament.toLocaleString()}`);

        // Add color legend at bottom center
        const legendGroup = g.append('g')
            .attr('transform', `translate(${-60}, ${this.radius + 80})`);

        // Create gradient for legend
        const gradientId = 'radial-distance-gradient';
        const defs = this.svg.append('defs');
        const linearGradient = defs.append('linearGradient')
            .attr('id', gradientId);

        // Add gradient stops based on current color scheme
        const numStops = 10;
        for (let i = 0; i <= numStops; i++) {
            const distance = (i / numStops) * this.maxDistance;
            linearGradient.append('stop')
                .attr('offset', `${(i / numStops) * 100}%`)
                .attr('stop-color', colorScale(distance));
        }

        // Draw gradient bar (CLICKABLE to change color schemes!)
        legendGroup.append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', 120)
            .attr('height', 10)
            .style('fill', `url(#${gradientId})`)
            .style('cursor', 'pointer')
            .style('stroke', '#444')
            .style('stroke-width', '1')
            .on('click', () => {
                window.colorSchemes.nextScheme();
                this.updateColors();
            })
            .on('mouseenter', function() {
                d3.select(this)
                    .style('stroke', '#FFD700')
                    .style('stroke-width', '2');
            })
            .on('mouseleave', function() {
                d3.select(this)
                    .style('stroke', '#444')
                    .style('stroke-width', '1');
            });

        // Add labels
        legendGroup.append('text')
            .attr('x', 0)
            .attr('y', -5)
            .style('font-size', '10px')
            .style('fill', 'var(--primary-gold)')
            .style('font-weight', 'bold')
            .text('Distance:');

        legendGroup.append('text')
            .attr('x', 0)
            .attr('y', 22)
            .style('font-size', '9px')
            .style('fill', 'var(--text-muted)')
            .text('Close');

        legendGroup.append('text')
            .attr('x', 120)
            .attr('y', 22)
            .style('font-size', '9px')
            .style('fill', 'var(--text-muted)')
            .style('text-anchor', 'end')
            .text('Far Apart');
    }

    updateFilters(filters) {
        this.render(filters);
    }

    updateColors() {
        if (!this.arcLinesSelection || !this.maxDistance) {
            return;
        }

        // Create new color scale with current scheme
        const newColorScale = window.colorSchemes.createDistanceScale(this.maxDistance);

        // INSTANT arc color update - direct DOM manipulation (NO D3 overhead)
        const arcs = this.arcLinesSelection.nodes();
        for (let i = 0; i < arcs.length; i++) {
            const arc = arcs[i];
            const distance = arc.__data__.distance;
            arc.style.stroke = newColorScale(distance);
        }

        // INSTANT gradient update - batched DOM update
        const gradientNode = document.getElementById('radial-distance-gradient');
        if (gradientNode) {
            // Build all stops in memory first (DocumentFragment = batched DOM)
            const fragment = document.createDocumentFragment();
            for (let i = 0; i <= 10; i++) {
                const distance = (i / 10) * this.maxDistance;
                const stop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
                stop.setAttribute('offset', `${(i / 10) * 100}%`);
                stop.setAttribute('stop-color', newColorScale(distance));
                fragment.appendChild(stop);
            }

            // Single DOM write (MUCH faster than 11 individual D3 operations)
            gradientNode.innerHTML = '';
            gradientNode.appendChild(fragment);
        }
    }

    showEmptyState(message) {
        const centerX = this.width / 2;
        const centerY = this.height / 2;

        this.svg.append('text')
            .attr('x', centerX)
            .attr('y', centerY)
            .attr('text-anchor', 'middle')
            .attr('fill', '#FFD700')
            .attr('font-size', '18px')
            .attr('font-weight', 'bold')
            .text('No Connections Found');

        this.svg.append('text')
            .attr('x', centerX)
            .attr('y', centerY + 30)
            .attr('text-anchor', 'middle')
            .attr('fill', '#888')
            .attr('font-size', '14px')
            .text(message);

        this.svg.append('text')
            .attr('x', centerX)
            .attr('y', centerY + 60)
            .attr('text-anchor', 'middle')
            .attr('fill', '#00CED1')
            .attr('font-size', '12px')
            .text('Try lowering the minimum connections slider or changing filters');
    }
}