// Network Graph Visualization
// Force-directed graph showing Bible cross-references

class NetworkGraph {
    constructor(svgId, tooltipId) {
        this.svgId = svgId;
        this.tooltipId = tooltipId;
        this.simulation = null;
        this.currentFilters = {};
    }

    render(filters = {}) {
        this.currentFilters = filters;

        const svg = d3.select(`#${this.svgId}`);
        svg.selectAll('*').remove();

        // Set explicit dimensions like Arc Diagram
        const container = document.getElementById(this.svgId);
        const width = container.clientWidth || 900;
        const baseHeight = 800;

        // Use responsive sizing for mobile
        const isMobile = window.innerWidth <= 768;
        const displayHeight = isMobile ? Math.min(600, window.innerHeight * 0.7) : baseHeight;

        svg.attr('width', '100%')
           .attr('height', displayHeight)
           .attr('viewBox', `0 0 ${width} ${baseHeight}`)
           .attr('preserveAspectRatio', 'xMidYMid meet');

        // Get filtered data using dataLoader API
        if (!dataLoader || !dataLoader.isLoaded) {
            this.showError(svg, 'Data not loaded');
            return;
        }

        let chapters = dataLoader.getChapters();
        let connections = this.filterConnections(dataLoader.getConnections(), filters);

        // Limit nodes for performance (take top connected chapters)
        const chapterConnectionCounts = new Map();
        connections.forEach(conn => {
            chapterConnectionCounts.set(conn.source, (chapterConnectionCounts.get(conn.source) || 0) + conn.weight);
            chapterConnectionCounts.set(conn.target, (chapterConnectionCounts.get(conn.target) || 0) + conn.weight);
        });

        // Take top N most connected chapters for performance
        // Reduce for mobile/iPad to prevent crashes
        const maxNodes = isMobile ? 75 : 200;
        const topChapters = chapters
            .map(ch => ({ ...ch, totalConnections: chapterConnectionCounts.get(ch.id) || 0 }))
            .filter(ch => ch.totalConnections > 0)
            .sort((a, b) => b.totalConnections - a.totalConnections)
            .slice(0, maxNodes);

        console.log(`📊 Network Graph: Rendering ${maxNodes} chapters (${isMobile ? 'mobile' : 'desktop'})`);

        const topChapterIds = new Set(topChapters.map(ch => ch.id));

        // Filter connections to only include top chapters
        connections = connections.filter(conn =>
            topChapterIds.has(conn.source) && topChapterIds.has(conn.target)
        );

        // Create nodes and links for D3
        const nodes = topChapters.map(ch => ({
            id: ch.id,
            book: ch.book,
            chapter: ch.chapter,
            testament: ch.testament,
            connections: ch.totalConnections
        }));

        const links = connections.map(conn => ({
            source: conn.source,
            target: conn.target,
            weight: conn.weight
        }));

        // Create container group for zoom
        const g = svg.append('g');

        // Add zoom behavior
        const zoom = d3.zoom()
            .scaleExtent([0.1, 4])
            .on('zoom', (event) => {
                g.attr('transform', event.transform);
            });

        svg.call(zoom);

        // Set initial zoom to show full graph without overwhelming
        // Zoom WAY out so spread-out nodes are visible
        const initialScale = isMobile ? 0.3 : 0.4;
        const initialTransform = d3.zoomIdentity
            .translate(width / 2, baseHeight / 2)
            .scale(initialScale)
            .translate(-width / 2, -baseHeight / 2);

        svg.call(zoom.transform, initialTransform);
        console.log(`🔍 Initial zoom: ${initialScale}x (${isMobile ? 'mobile' : 'desktop'})`);

        // Create links
        const link = g.append('g')
            .selectAll('line')
            .data(links)
            .enter()
            .append('line')
            .attr('class', 'network-link')
            .style('stroke', d => {
                const sourceNode = nodes.find(n => n.id === d.source);
                const targetNode = nodes.find(n => n.id === d.target);
                if (sourceNode && targetNode) {
                    if (sourceNode.testament === 'OT' && targetNode.testament === 'OT') return '#2ecc71';
                    if (sourceNode.testament === 'NT' && targetNode.testament === 'NT') return '#00CED1';
                    return '#9370DB';
                }
                return '#666';
            })
            .style('stroke-width', d => Math.sqrt(d.weight) / 2)
            .style('stroke-opacity', 0.3);

        // Create nodes
        const node = g.append('g')
            .selectAll('circle')
            .data(nodes)
            .enter()
            .append('circle')
            .attr('class', 'network-node')
            .attr('r', d => 3 + Math.sqrt(d.connections) / 2)
            .style('fill', d => d.testament === 'OT' ? '#2ecc71' : '#00CED1')
            .style('stroke', '#FFD700')
            .style('stroke-width', 1.5)
            .style('cursor', 'pointer')
            .call(this.drag(this.simulation));

        // Add tooltips
        const tooltip = d3.select(`#${this.tooltipId}`);

        node.on('mouseover', (event, d) => {
            tooltip.style('display', 'block')
                .html(`
                    <strong>${d.book} ${d.chapter}</strong><br>
                    Testament: ${d.testament === 'OT' ? 'Old Testament' : 'New Testament'}<br>
                    Connections: ${d.connections}
                `);
        })
        .on('mousemove', (event) => {
            // INSTANT tooltip positioning using transform (GPU-accelerated)
            tooltip.style('transform', `translate(${event.clientX + 10}px, ${event.clientY - 10}px)`);
        })
        .on('mouseout', () => {
            tooltip.style('display', 'none');
        });

        // Highlight connections on hover
        node.on('mouseenter', (event, d) => {
            link.style('stroke-opacity', l =>
                (l.source.id === d.id || l.target.id === d.id) ? 0.8 : 0.1
            );
            node.style('opacity', n =>
                (n.id === d.id || links.some(l =>
                    (l.source.id === d.id && l.target.id === n.id) ||
                    (l.target.id === d.id && l.source.id === n.id)
                )) ? 1 : 0.2
            );
        })
        .on('mouseleave', () => {
            link.style('stroke-opacity', 0.3);
            node.style('opacity', 1);
        });

        // Initialize nodes with better starting positions (circular layout)
        const angleStep = (2 * Math.PI) / nodes.length;
        const layoutRadius = Math.min(width, baseHeight) * 0.35;
        nodes.forEach((node, i) => {
            const angle = i * angleStep;
            node.x = width / 2 + layoutRadius * Math.cos(angle);
            node.y = baseHeight / 2 + layoutRadius * Math.sin(angle);
        });

        // Create force simulation with MORE SPACING between nodes
        this.simulation = d3.forceSimulation(nodes)
            .force('link', d3.forceLink(links)
                .id(d => d.id)
                .distance(d => 120 + (50 / Math.sqrt(d.weight))) // MUCH longer links (was 50)
                .strength(d => Math.min(d.weight / 200, 0.3)) // Weaker link strength
            )
            .force('charge', d3.forceManyBody()
                .strength(-200) // MUCH stronger repulsion (was -50)
                .distanceMax(400) // Longer range repulsion (was 200)
            )
            .force('center', d3.forceCenter(width / 2, baseHeight / 2).strength(0.1)) // Stronger centering
            .force('collision', d3.forceCollide().radius(d => 15 + Math.sqrt(d.connections))) // BIGGER collision radius (was 5)
            .velocityDecay(0.4)
            .alphaMin(0.001);

        // Pre-run simulation to completion (no animation)
        // Need MORE ticks now because nodes spread out more
        const simTicks = isMobile ? 200 : 400;
        const simStart = performance.now();
        for (let i = 0; i < simTicks; ++i) {
            this.simulation.tick();
        }
        const simEnd = performance.now();

        // Stop the simulation
        this.simulation.stop();
        console.log(`⚡ Force simulation (${simTicks} ticks) completed in ${(simEnd - simStart).toFixed(0)}ms`);

        // Now render at final positions
        link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

        node
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);

        // Add title
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', 30)
            .attr('text-anchor', 'middle')
            .attr('fill', '#FFD700')
            .attr('font-size', '20px')
            .attr('font-weight', 'bold')
            .text(`Bible Chapter Network - Top ${nodes.length} Most Connected`);

        // Add subtitle
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', 55)
            .attr('text-anchor', 'middle')
            .attr('fill', '#00CED1')
            .attr('font-size', '13px')
            .text(`🖱️ Scroll to zoom (4x) | Drag to pan | Drag nodes to rearrange${isMobile ? ' | Optimized for mobile' : ''}`);

        // Add legend
        this.addLegend(svg, width, baseHeight);

        // Add reset zoom button
        this.addResetButton(svg, zoom);
    }

    filterConnections(connections, filters) {
        const testament = filters.testament || 'all';
        const minWeight = filters.minConnections || 1;

        const chapters = dataLoader.getChapters();

        return connections.filter(conn => {
            if (conn.weight < minWeight) return false;

            const sourceChapter = chapters.find(ch => ch.id === conn.source);
            const targetChapter = chapters.find(ch => ch.id === conn.target);

            if (!sourceChapter || !targetChapter) return false;

            if (testament === 'OT') {
                return sourceChapter.testament === 'OT' && targetChapter.testament === 'OT';
            } else if (testament === 'NT') {
                return sourceChapter.testament === 'NT' && targetChapter.testament === 'NT';
            } else if (testament === 'cross') {
                return sourceChapter.testament !== targetChapter.testament;
            }

            return true;
        });
    }

    drag(simulation) {
        const self = this;

        function dragstarted(event, d) {
            // Start dragging - lock the position
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event, d) {
            // Update the dragged node position
            d.fx = event.x;
            d.fy = event.y;
            d.x = event.x;
            d.y = event.y;

            // Manually update the visual position
            d3.select(this)
                .attr('cx', d.x)
                .attr('cy', d.y);

            // Update connected links
            const linkSelection = d3.selectAll('.network-link');
            linkSelection.each(function(link) {
                if (link.source.id === d.id) {
                    d3.select(this)
                        .attr('x1', d.x)
                        .attr('y1', d.y);
                } else if (link.target.id === d.id) {
                    d3.select(this)
                        .attr('x2', d.x)
                        .attr('y2', d.y);
                }
            });
        }

        function dragended(event, d) {
            // Release the fixed position
            d.fx = null;
            d.fy = null;
        }

        return d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended);
    }

    addLegend(svg, width, height) {
        const legend = svg.append('g')
            .attr('class', 'legend')
            .attr('transform', `translate(20, ${height - 100})`);

        const legendData = [
            { color: '#2ecc71', label: 'Old Testament' },
            { color: '#00CED1', label: 'New Testament' },
            { color: '#9370DB', label: 'Cross-Testament Link' }
        ];

        const legendItems = legend.selectAll('.legend-item')
            .data(legendData)
            .enter()
            .append('g')
            .attr('class', 'legend-item')
            .attr('transform', (d, i) => `translate(0, ${i * 25})`);

        legendItems.append('circle')
            .attr('cx', 0)
            .attr('cy', 0)
            .attr('r', 6)
            .style('fill', d => d.color)
            .style('stroke', '#FFD700')
            .style('stroke-width', 1.5);

        legendItems.append('text')
            .attr('x', 15)
            .attr('y', 5)
            .style('fill', '#00CED1')
            .style('font-size', '12px')
            .text(d => d.label);
    }

    addResetButton(svg, zoom) {
        const button = svg.append('g')
            .attr('class', 'reset-zoom')
            .attr('transform', 'translate(20, 20)')
            .style('cursor', 'pointer')
            .on('click', () => {
                svg.transition()
                    .duration(750)
                    .call(zoom.transform, d3.zoomIdentity);
            });

        button.append('rect')
            .attr('width', 80)
            .attr('height', 30)
            .attr('rx', 5)
            .style('fill', '#FFD700')
            .style('opacity', 0.8);

        button.append('text')
            .attr('x', 40)
            .attr('y', 20)
            .attr('text-anchor', 'middle')
            .style('fill', '#1a1a2e')
            .style('font-weight', 'bold')
            .style('font-size', '12px')
            .text('Reset View');
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
