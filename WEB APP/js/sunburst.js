// Sunburst Diagram Visualization
// Hierarchical view: Testament → Book → Chapter

class Sunburst {
    constructor(svgId, tooltipId) {
        this.svgId = svgId;
        this.tooltipId = tooltipId;
        this.currentRoot = null;
    }

    render(filters = {}) {
        const svg = d3.select(`#${this.svgId}`);
        svg.selectAll('*').remove();

        // Get data using dataLoader API
        if (!dataLoader || !dataLoader.isLoaded) {
            this.showError(svg, 'Data not loaded');
            return;
        }

        // Set explicit dimensions like Arc Diagram
        const container = document.getElementById(this.svgId);
        const width = container.clientWidth || 900;
        const baseHeight = 800;

        // Use responsive sizing for mobile
        const isMobile = window.innerWidth <= 768;
        const displayHeight = isMobile ? Math.min(600, window.innerHeight * 0.7) : baseHeight;
        const height = isMobile ? Math.min(width, displayHeight) : baseHeight;

        svg.attr('width', '100%')
           .attr('height', displayHeight)
           .attr('viewBox', `0 0 ${width} ${height}`)
           .attr('preserveAspectRatio', 'xMidYMid meet');

        const radius = Math.min(width, height) / 2;

        const g = svg.append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`);

        // Build hierarchy
        const hierarchy = this.buildHierarchy(filters);

        // Create partition layout
        const partition = d3.partition()
            .size([2 * Math.PI, radius]);

        const root = d3.hierarchy(hierarchy)
            .sum(d => d.value || 0)
            .sort((a, b) => b.value - a.value);

        partition(root);

        this.currentRoot = root;

        // Arc generator
        const arc = d3.arc()
            .startAngle(d => d.x0)
            .endAngle(d => d.x1)
            .innerRadius(d => d.y0)
            .outerRadius(d => d.y1);

        // Color scale
        const color = d3.scaleOrdinal()
            .domain(['OT', 'NT'])
            .range(['#2ecc71', '#00CED1']);

        // Tooltip
        const tooltip = d3.select(`#${this.tooltipId}`);

        // Draw arcs
        const path = g.selectAll('path')
            .data(root.descendants().filter(d => d.depth > 0))
            .enter()
            .append('path')
            .attr('d', arc)
            .style('fill', d => {
                if (d.depth === 1) {
                    // Testament level
                    return d.data.name === 'Old Testament' ? '#2ecc71' : '#00CED1';
                } else if (d.depth === 2) {
                    // Book level
                    const testament = d.parent.data.name === 'Old Testament' ? 'OT' : 'NT';
                    return d3.rgb(color(testament)).brighter(0.5);
                } else {
                    // Chapter level
                    const testament = d.parent.parent.data.name === 'Old Testament' ? 'OT' : 'NT';
                    return d3.rgb(color(testament)).brighter(1);
                }
            })
            .style('stroke', '#1a1a2e')
            .style('stroke-width', 1)
            .style('opacity', 0.8)
            .style('cursor', 'pointer')
            .on('mouseover', (event, d) => {
                // Highlight path to root
                path.style('opacity', node => {
                    return this.isAncestor(node, d) || node === d ? 1 : 0.3;
                });

                let tooltipText = '';
                if (d.depth === 1) {
                    // Testament level
                    const testament = d.data.name;
                    const testamentColor = testament === 'Old Testament' ? '#2ecc71' : '#00CED1';
                    const emoji = testament === 'Old Testament' ? '📜' : '✝️';
                    tooltipText = `
                        <div style="color: #FFD700; font-weight: bold; margin-bottom: 6px; font-size: 14px;">
                            ${emoji} ${testament}
                        </div>
                        <div style="color: ${testamentColor}; margin-bottom: 3px;">
                            <strong>${d.children.length} Books</strong>
                        </div>
                        <div style="color: #888; font-size: 11px;">
                            Total Chapters: ${d.value}
                        </div>
                    `;
                } else if (d.depth === 2) {
                    // Book level
                    const testament = d.parent.data.name;
                    const testamentColor = testament === 'Old Testament' ? '#2ecc71' : '#00CED1';
                    const testamentShort = testament === 'Old Testament' ? 'OT' : 'NT';
                    tooltipText = `
                        <div style="color: #FFD700; font-weight: bold; margin-bottom: 6px; font-size: 14px;">
                            📖 ${d.data.name}
                        </div>
                        <div style="color: ${testamentColor}; margin-bottom: 3px;">
                            <strong>${testamentShort} • ${d.value} Chapters</strong>
                        </div>
                        <div style="color: #888; font-size: 11px; border-top: 1px solid #444; padding-top: 4px; margin-top: 4px;">
                            Cross-references: ${d.data.connections ? d.data.connections.toLocaleString() : '0'}
                        </div>
                    `;
                } else if (d.depth === 3) {
                    // Chapter level
                    const testament = d.parent.parent.data.name;
                    const testamentColor = testament === 'Old Testament' ? '#2ecc71' : '#00CED1';
                    const testamentShort = testament === 'Old Testament' ? 'OT' : 'NT';
                    tooltipText = `
                        <div style="color: #FFD700; font-weight: bold; margin-bottom: 6px; font-size: 14px;">
                            📍 ${d.parent.data.name} ${d.data.name}
                        </div>
                        <div style="color: ${testamentColor}; margin-bottom: 3px;">
                            <strong>${testamentShort} • Chapter ${d.data.name}</strong>
                        </div>
                        <div style="color: #888; font-size: 11px; border-top: 1px solid #444; padding-top: 4px; margin-top: 4px;">
                            Cross-references: ${d.data.connections ? d.data.connections.toLocaleString() : '0'}
                        </div>
                    `;
                }

                tooltip
                    .style('display', 'block')
                    .style('position', 'fixed')
                    .style('left', '0')
                    .style('top', '0')
                    .style('willChange', 'transform')
                    .style('transform', `translate(${event.clientX + 10}px, ${event.clientY - 10}px)`)
                    .html(tooltipText);
            })
            .on('mousemove', (event) => {
                tooltip.style('transform', `translate(${event.clientX + 10}px, ${event.clientY - 10}px)`);
            })
            .on('mouseout', () => {
                path.style('opacity', 0.8);
                tooltip.style('display', 'none')
                    .style('willChange', 'auto');
            })
            .on('click', (event, d) => {
                event.stopPropagation();
                if (d.depth > 0) {
                    this.zoomTo(d, path, arc, tooltip);
                }
            });

        // Add center text
        const centerText = g.append('text')
            .attr('text-anchor', 'middle')
            .style('fill', '#FFD700')
            .style('font-size', '16px')
            .style('font-weight', 'bold')
            .style('cursor', 'pointer')
            .text('Bible')
            .on('click', () => {
                this.zoomTo(root, path, arc, tooltip);
            });

        // Add subtitle with filter info
        const minConnections = filters.minConnections || 1;
        const filterActive = minConnections > 1 || filters.testament !== 'all';

        let subtitleText = 'Click to zoom';
        if (filterActive && minConnections > 1) {
            // Show filter info without total count (bookMatrix doesn't exist in this scope)
            subtitleText += ` | Showing chapters with ≥ ${minConnections} connections`;
        }

        const subtitle = g.append('text')
            .attr('text-anchor', 'middle')
            .attr('y', 20)
            .style('fill', filterActive ? '#FFD700' : '#00CED1')
            .style('font-size', '11px')
            .text(subtitleText);

        // Add title
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', 30)
            .attr('text-anchor', 'middle')
            .style('fill', '#FFD700')
            .style('font-size', '18px')
            .style('font-weight', 'bold')
            .text('Bible Structure Sunburst');

        // Add breadcrumb
        this.breadcrumb = svg.append('text')
            .attr('x', width / 2)
            .attr('y', height - 20)
            .attr('text-anchor', 'middle')
            .style('fill', '#00CED1')
            .style('font-size', '12px')
            .text('Testament → Book → Chapter');

        // Add legend
        this.addLegend(svg, width);
    }

    buildHierarchy(filters) {
        const testament = filters.testament || 'all';
        const minConnections = filters.minConnections || 1;

        // Get data from dataLoader
        const chapters = dataLoader.getChapters();
        const connections = dataLoader.getConnections();

        // Group chapters by book and testament
        const otBooks = new Map();
        const ntBooks = new Map();

        chapters.forEach(ch => {
            // Apply testament filter
            if (testament === 'OT' && ch.testament !== 'OT') return;
            if (testament === 'NT' && ch.testament !== 'NT') return;

            const bookMap = ch.testament === 'OT' ? otBooks : ntBooks;

            if (!bookMap.has(ch.book)) {
                bookMap.set(ch.book, {
                    name: ch.book,
                    children: [],
                    connections: 0
                });
            }

            const book = bookMap.get(ch.book);

            // Filter connections by weight threshold FIRST, then count for this chapter
            const filteredConnections = connections.filter(
                conn => conn.weight >= minConnections && (conn.source === ch.id || conn.target === ch.id)
            );

            // Only add chapter if it has at least one connection passing the threshold
            if (filteredConnections.length > 0) {
                const totalWeight = filteredConnections.reduce((sum, conn) => sum + conn.weight, 0);

                book.children.push({
                    name: `${ch.chapter}`,
                    value: 1,
                    connections: totalWeight
                });

                book.connections += totalWeight;
            }
        });

        // Filter out books with no chapters (all chapters below minConnections)
        for (const [bookName, bookData] of otBooks.entries()) {
            if (bookData.children.length === 0) {
                otBooks.delete(bookName);
            }
        }
        for (const [bookName, bookData] of ntBooks.entries()) {
            if (bookData.children.length === 0) {
                ntBooks.delete(bookName);
            }
        }

        // Log filtering results
        if (minConnections > 1) {
            const totalBooks = otBooks.size + ntBooks.size;
            const totalChapters = Array.from(otBooks.values()).reduce((sum, book) => sum + book.children.length, 0) +
                                  Array.from(ntBooks.values()).reduce((sum, book) => sum + book.children.length, 0);
            console.log(`🌅 Sunburst: Filtering chapters with connections >= ${minConnections} | Showing ${totalChapters} chapters in ${totalBooks} books`);
        }

        // Build hierarchy
        const children = [];

        if ((testament === 'all' || testament === 'OT') && otBooks.size > 0) {
            children.push({
                name: 'Old Testament',
                children: Array.from(otBooks.values())
            });
        }

        if ((testament === 'all' || testament === 'NT') && ntBooks.size > 0) {
            children.push({
                name: 'New Testament',
                children: Array.from(ntBooks.values())
            });
        }

        return {
            name: 'Bible',
            children: children
        };
    }

    isAncestor(ancestor, node) {
        let current = node;
        while (current.parent) {
            if (current.parent === ancestor) return true;
            current = current.parent;
        }
        return false;
    }

    zoomTo(d, path, arc, tooltip) {
        const transition = d3.transition()
            .duration(750)
            .tween('scale', () => {
                const xd = d3.interpolate(this.currentRoot.x0, d.x0);
                const yd = d3.interpolate(this.currentRoot.y0, d.y0);
                const yr = d3.interpolate(this.currentRoot.y1 - this.currentRoot.y0, d.y1 - d.y0);

                return t => {
                    this.currentRoot.x0 = xd(t);
                    this.currentRoot.y0 = yd(t);
                    this.currentRoot.y1 = yd(t) + yr(t);
                };
            });

        transition.selectAll('path')
            .attrTween('d', node => {
                return t => {
                    const x0 = (node.x0 - this.currentRoot.x0) / (this.currentRoot.x1 - this.currentRoot.x0) * 2 * Math.PI;
                    const x1 = (node.x1 - this.currentRoot.x0) / (this.currentRoot.x1 - this.currentRoot.x0) * 2 * Math.PI;
                    const y0 = (node.y0 - this.currentRoot.y0) / (this.currentRoot.y1 - this.currentRoot.y0) * (Math.min(svg.node().getBoundingClientRect().width, svg.node().getBoundingClientRect().height) / 2);
                    const y1 = (node.y1 - this.currentRoot.y0) / (this.currentRoot.y1 - this.currentRoot.y0) * (Math.min(svg.node().getBoundingClientRect().width, svg.node().getBoundingClientRect().height) / 2);

                    return d3.arc()
                        .startAngle(x0)
                        .endAngle(x1)
                        .innerRadius(y0)
                        .outerRadius(y1)
                        (node);
                };
            });

        // Update breadcrumb
        const ancestors = [];
        let current = d;
        while (current) {
            ancestors.unshift(current.data.name);
            current = current.parent;
        }

        if (this.breadcrumb) {
            this.breadcrumb.text(ancestors.join(' → '));
        }

        this.currentRoot = d;
    }

    addLegend(svg, width) {
        const legend = svg.append('g')
            .attr('transform', 'translate(20, 80)');

        const legendData = [
            { color: '#2ecc71', label: 'Old Testament', level: 'Testament' },
            { color: d3.rgb('#2ecc71').brighter(0.5), label: 'OT Books', level: 'Book' },
            { color: d3.rgb('#2ecc71').brighter(1), label: 'OT Chapters', level: 'Chapter' },
            { color: '#00CED1', label: 'New Testament', level: 'Testament' },
            { color: d3.rgb('#00CED1').brighter(0.5), label: 'NT Books', level: 'Book' },
            { color: d3.rgb('#00CED1').brighter(1), label: 'NT Chapters', level: 'Chapter' }
        ];

        const legendItems = legend.selectAll('.legend-item')
            .data(legendData)
            .enter()
            .append('g')
            .attr('transform', (d, i) => `translate(0, ${i * 20})`);

        legendItems.append('rect')
            .attr('width', 15)
            .attr('height', 15)
            .style('fill', d => d.color)
            .style('stroke', '#FFD700')
            .style('stroke-width', 1);

        legendItems.append('text')
            .attr('x', 20)
            .attr('y', 12)
            .style('fill', '#00CED1')
            .style('font-size', '11px')
            .text(d => d.label);
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
