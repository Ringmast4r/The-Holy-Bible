// Arc Diagram Visualization

class ArcDiagram {
    constructor(svgId, tooltipId) {
        this.svgId = svgId;
        this.tooltipId = tooltipId;
        this.svg = null;
        this.tooltip = null;
        this.width = 0;
        this.height = 120;
        this.margin = { top: 2, right: 5, bottom: 5, left: 5 };
    }

    render(filters = {}) {
        // Clear previous
        const container = document.getElementById(this.svgId);
        if (!container) {
            console.error(`❌ FATAL: SVG container not found: #${this.svgId}`);
            console.error('📋 Available SVG elements:', document.querySelectorAll('svg'));
            console.error('📋 Available elements with "svg" in ID:', document.querySelectorAll('[id*="svg"]'));
            return;
        }
        container.innerHTML = '';

        // Check if data is loaded
        if (!dataLoader || !dataLoader.isLoaded) {
            console.error('❌ Data not loaded yet');
            const svg = d3.select(`#${this.svgId}`);
            svg.append('text')
                .attr('x', container.clientWidth / 2)
                .attr('y', this.height / 2)
                .attr('text-anchor', 'middle')
                .attr('fill', '#FF6B6B')
                .attr('font-size', '18px')
                .text('Loading data...');
            return;
        }

        // Get dimensions
        this.width = container.clientWidth;

        // Create SVG
        this.svg = d3.select(`#${this.svgId}`)
            .attr('width', this.width)
            .attr('height', this.height);

        this.tooltip = d3.select(`#${this.tooltipId}`);

        // Ensure tooltip is properly styled
        if (this.tooltip.empty()) {
            console.error('❌ Tooltip not found:', this.tooltipId);
        } else {
            this.tooltip
                .style('position', 'fixed')
                .style('display', 'none')
                .style('opacity', 0);
        }

        // Get data
        const chapters = dataLoader.getChapters();
        let connections = dataLoader.getConnections();

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

        // Draw visualization
        this.drawArcDiagram(chapters, connections);
    }

    drawArcDiagram(chapters, connections) {
        const innerWidth = this.width - this.margin.left - this.margin.right;
        const innerHeight = this.height - this.margin.top - this.margin.bottom;

        // Create main group
        const g = this.svg.append('g')
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

        // Scale for chapter positions
        const xScale = d3.scaleLinear()
            .domain([0, chapters.length - 1])
            .range([0, innerWidth]);

        // Color scale by testament
        const colorScale = d3.scaleOrdinal()
            .domain(['OT', 'NT'])
            .range(['#2ecc71', '#00CED1']);

        // Draw arcs (connections)
        const maxWeight = d3.max(connections, d => d.weight) || 1;

        const arcGenerator = d3.linkVertical()
            .source(d => [xScale(d.source), innerHeight])
            .target(d => [xScale(d.target), innerHeight])
            .x(d => d[0])
            .y(d => {
                const distance = Math.abs(d[0] - d.target[0]);
                return innerHeight - distance * 0.5; // Arc height based on distance
            });

        // Draw connection arcs
        g.selectAll('.arc-line')
            .data(connections)
            .enter()
            .append('path')
            .attr('class', d => {
                const sourceChapter = chapters[d.source];
                const targetChapter = chapters[d.target];
                const type = dataLoader.getConnectionType(
                    sourceChapter.testament,
                    targetChapter.testament
                );
                return `arc-line ${type}`;
            })
            .attr('d', d => {
                const x1 = xScale(d.source);
                const x2 = xScale(d.target);
                const distance = Math.abs(x2 - x1);
                const height = Math.min(distance * 0.3, innerHeight * 0.95);

                return `M ${x1},${innerHeight}
                        Q ${(x1 + x2) / 2},${innerHeight - height}
                        ${x2},${innerHeight}`;
            })
            .style('stroke-width', d => Math.max(1, Math.sqrt(d.weight) / 3))
            .style('stroke-opacity', d => Math.min(d.weight / maxWeight, 0.8))
            .style('pointer-events', 'stroke')
            .style('cursor', 'pointer')
            .on('mouseover', (event, d) => {
                const sourceChapter = chapters[d.source];
                const targetChapter = chapters[d.target];

                // Show tooltip
                const tooltip = document.getElementById(this.tooltipId);
                if (tooltip) {
                    tooltip.style.display = 'block';
                    tooltip.style.opacity = '1';
                    // INSTANT tooltip positioning using transform (GPU-accelerated)
                    tooltip.style.transform = `translate(${event.clientX + 10}px, ${event.clientY - 10}px)`;
                    tooltip.innerHTML = `
                        <strong>${sourceChapter.label}</strong> → <strong>${targetChapter.label}</strong>
                        <br/>Connections: ${d.weight}
                        <br/>Type: ${sourceChapter.testament} → ${targetChapter.testament}
                    `;
                }

                // Highlight this arc
                d3.select(event.target)
                    .style('stroke-opacity', 1)
                    .style('stroke-width', 3);
            })
            .on('mousemove', (event) => {
                const tooltip = document.getElementById(this.tooltipId);
                if (tooltip && tooltip.style.display === 'block') {
                    // INSTANT tooltip positioning using transform (GPU-accelerated)
                    tooltip.style.transform = `translate(${event.clientX + 10}px, ${event.clientY - 10}px)`;
                }
            })
            .on('mouseout', (event, d) => {
                const tooltip = document.getElementById(this.tooltipId);
                if (tooltip) {
                    tooltip.style.display = 'none';
                    tooltip.style.opacity = '0';
                }

                d3.select(event.target)
                    .style('stroke-opacity', Math.min(d.weight / maxWeight, 0.8))
                    .style('stroke-width', Math.max(1, Math.sqrt(d.weight) / 3));
            });

        // Draw chapter markers (bottom line)
        const chapterGroups = g.selectAll('.chapter-node')
            .data(chapters)
            .enter()
            .append('g')
            .attr('class', 'chapter-node')
            .attr('transform', d => `translate(${xScale(d.id)}, ${innerHeight})`);

        // Invisible hit area for easier hovering
        chapterGroups.append('rect')
            .attr('x', -10)
            .attr('y', -20)
            .attr('width', 20)
            .attr('height', 35)
            .attr('fill', 'transparent')
            .style('cursor', 'pointer');

        // Chapter bars
        const chapterBars = chapterGroups.append('rect')
            .attr('class', 'chapter-bar')
            .attr('x', -3)
            .attr('y', -8)
            .attr('width', 6)
            .attr('height', 12)
            .attr('fill', d => colorScale(d.testament))
            .attr('opacity', 0.9)
            .style('pointer-events', 'none');

        // Cache the arc lines for faster access
        const arcLines = d3.selectAll('.arc-line');
        const tooltip = document.getElementById(this.tooltipId);

        // Add hover to the parent group
        chapterGroups
            .on('mouseenter', (event, d) => {
                // Instant tooltip show
                if (tooltip) {
                    tooltip.style.display = 'block';
                    tooltip.style.opacity = '1';
                    // INSTANT tooltip positioning using transform (GPU-accelerated)
                    tooltip.style.transform = `translate(${event.clientX + 10}px, ${event.clientY - 10}px)`;
                    tooltip.innerHTML = `<strong>${d.label}</strong><br/>Book: ${d.book}<br/>Testament: ${d.testament}`;
                }

                // Instant highlight of the bar
                const bar = event.currentTarget.querySelector('.chapter-bar');
                bar.setAttribute('height', 18);
                bar.setAttribute('y', -10);
                bar.setAttribute('width', 8);
                bar.setAttribute('x', -4);
                bar.setAttribute('opacity', 1);

                // Instant arc updates without requestAnimationFrame
                arcLines.each(function(arc) {
                    if (arc.source === d.id || arc.target === d.id) {
                        this.classList.add('highlight');
                        this.classList.remove('fade');
                    } else {
                        this.classList.add('fade');
                        this.classList.remove('highlight');
                    }
                });
            })
            .on('mousemove', (event) => {
                if (tooltip) {
                    // INSTANT tooltip positioning using transform (GPU-accelerated)
                    tooltip.style.transform = `translate(${event.clientX + 10}px, ${event.clientY - 10}px)`;
                }
            })
            .on('mouseleave', (event) => {
                if (tooltip) {
                    tooltip.style.display = 'none';
                    tooltip.style.opacity = '0';
                }

                // Reset the bar
                const bar = event.currentTarget.querySelector('.chapter-bar');
                bar.setAttribute('height', 12);
                bar.setAttribute('y', -8);
                bar.setAttribute('width', 6);
                bar.setAttribute('x', -3);
                bar.setAttribute('opacity', 0.9);

                // Reset arcs instantly
                arcLines.each(function() {
                    this.classList.remove('highlight', 'fade');
                });
            });

        // Book labels (sample - show every 10th chapter to avoid clutter)
        const bookChanges = [];
        let lastBook = '';
        chapters.forEach((chapter, i) => {
            if (chapter.book !== lastBook) {
                bookChanges.push({ index: i, book: chapter.book, testament: chapter.testament });
                lastBook = chapter.book;
            }
        });

        g.selectAll('.book-label')
            .data(bookChanges)
            .enter()
            .append('text')
            .attr('class', 'book-label')
            .attr('x', d => xScale(d.index))
            .attr('y', innerHeight + 50)
            .attr('text-anchor', 'start')
            .attr('transform', d => `rotate(-45, ${xScale(d.index)}, ${innerHeight + 50})`)
            .style('font-size', '10px')
            .style('fill', d => colorScale(d.testament))
            .style('opacity', 0.7)
            .text(d => d.book);

        // Legend
        const legend = this.svg.append('g')
            .attr('class', 'legend')
            .attr('transform', `translate(${this.width - 200}, 20)`);

        const legendData = [
            { label: 'Old Testament', color: '#2ecc71' },
            { label: 'New Testament', color: '#00CED1' },
            { label: 'Cross-Testament', color: '#9370DB' }
        ];

        legend.selectAll('.legend-item')
            .data(legendData)
            .enter()
            .append('g')
            .attr('class', 'legend-item')
            .attr('transform', (d, i) => `translate(0, ${i * 25})`)
            .each(function (d) {
                d3.select(this).append('line')
                    .attr('x1', 0)
                    .attr('x2', 20)
                    .attr('y1', 10)
                    .attr('y2', 10)
                    .attr('stroke', d.color)
                    .attr('stroke-width', 3);

                d3.select(this).append('text')
                    .attr('x', 25)
                    .attr('y', 14)
                    .style('font-size', '12px')
                    .style('fill', '#eee')
                    .text(d.label);
            });

        // Title
        this.svg.append('text')
            .attr('x', this.width / 2)
            .attr('y', 25)
            .attr('text-anchor', 'middle')
            .style('font-size', '18px')
            .style('font-weight', 'bold')
            .style('fill', '#FFD700')
            .text(`Bible Cross-References Arc Diagram (${connections.length.toLocaleString()} connections)`);
    }
}
