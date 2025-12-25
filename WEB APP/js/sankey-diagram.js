// Sankey Diagram Visualization
// Shows how 20 Bible translations divide books into sections

class SankeyDiagram {
    constructor(svgId, tooltipId) {
        this.svgId = svgId;
        this.tooltipId = tooltipId;
        this.data = null;
        this.currentBook = 'Genesis';
        this.bookAbbrevMap = {
            'Genesis': 'Gen',
            'Exodus': 'Exod',
            'Leviticus': 'Lev',
            'Numbers': 'Num',
            'Deuteronomy': 'Deut',
            'Joshua': 'Josh',
            'Judges': 'Judg',
            'Ruth': 'Ruth',
            '1 Samuel': '1Sam',
            '2 Samuel': '2Sam',
            '1 Kings': '1Kgs',
            '2 Kings': '2Kgs',
            'Ezra': 'Ezra',
            'Nehemiah': 'Neh',
            'Esther': 'Esth',
            'Job': 'Job',
            'Psalms': 'Ps',
            'Proverbs': 'Prov',
            'Ecclesiastes': 'Eccl',
            'Song of Solomon': 'Song'
        };
    }

    async loadData() {
        if (this.data) return this.data;

        try {
            const response = await fetch('data/bible-section-counts.txt');
            const text = await response.text();

            // Parse TSV data
            const lines = text.trim().split('\n').slice(1); // Skip header
            this.data = lines.map(line => {
                const [start, end, next, count] = line.split('\t');
                return {
                    start: start.trim(),
                    end: end.trim(),
                    next: next.trim(),
                    count: parseInt(count)
                };
            });

            console.log(`📊 Loaded ${this.data.length} section divisions from 20 translations`);
            return this.data;
        } catch (error) {
            console.error('Error loading Sankey data:', error);
            return null;
        }
    }

    async render(filters = {}) {
        const svg = d3.select(`#${this.svgId}`);
        svg.selectAll('*').remove();

        // Load data
        await this.loadData();
        if (!this.data) {
            this.showError(svg, 'Failed to load Sankey data');
            return;
        }

        // Filter data for current book
        const bookPrefix = this.currentBook === 'Genesis' ? 'Gen.' :
                          this.currentBook === 'Exodus' ? 'Exod.' :
                          this.bookAbbrevMap[this.currentBook] ? this.bookAbbrevMap[this.currentBook] + '.' : 'Gen.';

        const bookData = this.data.filter(d => d.start.startsWith(bookPrefix));

        if (bookData.length === 0) {
            this.showError(svg, `No data available for ${this.currentBook}`);
            return;
        }

        // SVG dimensions - MUCH TALLER for better spacing
        const container = document.getElementById(this.svgId);
        const width = container.clientWidth || 1200;
        const isMobile = window.innerWidth <= 768;
        const baseHeight = isMobile ? 800 : 1400;  // Increased from 900 to 1400
        const displayHeight = isMobile ? Math.min(800, window.innerHeight * 0.7) : baseHeight;

        svg.attr('width', '100%')
           .attr('height', displayHeight)
           .attr('viewBox', `0 0 ${width} ${baseHeight}`)
           .attr('preserveAspectRatio', 'xMidYMid meet');

        const margin = { top: 100, right: 100, bottom: 80, left: 100 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = baseHeight - margin.top - margin.bottom;

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        // Convert data to Sankey format
        const sankeyData = this.convertToSankeyFormat(bookData);

        // Create Sankey generator with better spacing
        const sankey = d3.sankey()
            .nodeWidth(20)
            .nodePadding(30)  // Much more space between nodes
            .extent([[0, 0], [innerWidth, innerHeight]]);

        // Generate graph
        const { nodes, links } = sankey(sankeyData);

        // Color scale
        const color = d3.scaleOrdinal(d3.schemeCategory10);

        // Draw links (flows)
        const link = g.append('g')
            .selectAll('.link')
            .data(links)
            .enter()
            .append('path')
            .attr('class', 'sankey-link')
            .attr('d', d3.sankeyLinkHorizontal())
            .attr('stroke', d => {
                const sourceVerse = d.source.name.split(' ')[0];
                return color(sourceVerse);
            })
            .attr('stroke-width', d => Math.max(1, d.width))
            .attr('fill', 'none')
            .attr('opacity', 0.5)
            .on('mouseover', (event, d) => {
                d3.select(event.currentTarget).attr('opacity', 0.8);
                this.showTooltip(event, d, true);
            })
            .on('mouseout', (event) => {
                d3.select(event.currentTarget).attr('opacity', 0.5);
                this.hideTooltip();
            });

        // Draw nodes
        const node = g.append('g')
            .selectAll('.node')
            .data(nodes)
            .enter()
            .append('g')
            .attr('class', 'sankey-node');

        node.append('rect')
            .attr('x', d => d.x0)
            .attr('y', d => d.y0)
            .attr('height', d => d.y1 - d.y0)
            .attr('width', d => d.x1 - d.x0)
            .attr('fill', d => color(d.name.split(' ')[0]))
            .attr('stroke', '#000')
            .on('mouseover', (event, d) => {
                this.showTooltip(event, d, false);
            })
            .on('mouseout', () => {
                this.hideTooltip();
            });

        // Node labels
        node.append('text')
            .attr('x', d => d.x0 < innerWidth / 2 ? d.x1 + 6 : d.x0 - 6)
            .attr('y', d => (d.y1 + d.y0) / 2)
            .attr('dy', '0.35em')
            .attr('text-anchor', d => d.x0 < innerWidth / 2 ? 'start' : 'end')
            .attr('fill', '#00CED1')
            .attr('font-size', '11px')
            .text(d => d.name.length > 20 ? d.name.substring(0, 20) + '...' : d.name);

        // Title
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', 30)
            .attr('text-anchor', 'middle')
            .attr('fill', '#FFD700')
            .attr('font-size', '20px')
            .attr('font-weight', 'bold')
            .text(`Section Divisions in ${this.currentBook}`);

        // Subtitle
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', 55)
            .attr('text-anchor', 'middle')
            .attr('fill', '#00CED1')
            .attr('font-size', '13px')
            .text('How 20 Bible translations divide this book into sections | Thicker = More translations agree');

        console.log(`📊 Sankey rendered: ${nodes.length} nodes, ${links.length} links`);
    }

    convertToSankeyFormat(data) {
        const nodes = [];
        const links = [];
        const nodeMap = new Map();

        // Helper to get or create node
        const getNode = (verse) => {
            if (!nodeMap.has(verse)) {
                nodeMap.set(verse, nodes.length);
                nodes.push({ name: verse.replace(/\./g, ' ') });
            }
            return nodeMap.get(verse);
        };

        // Create links from data
        data.forEach(row => {
            const source = getNode(row.start);
            const target = getNode(row.next);

            links.push({
                source: source,
                target: target,
                value: row.count
            });
        });

        return { nodes, links };
    }

    showTooltip(event, d, isLink) {
        const tooltip = d3.select(`#${this.tooltipId}`);

        let content;
        if (isLink) {
            content = `
                <strong>${d.source.name} → ${d.target.name}</strong><br>
                ${d.value} translation${d.value > 1 ? 's' : ''} agree
            `;
        } else {
            content = `
                <strong>${d.name}</strong><br>
                Verse reference point
            `;
        }

        tooltip.style('display', 'block')
            .html(content)
            .style('transform', `translate(${event.clientX + 10}px, ${event.clientY - 10}px)`);
    }

    hideTooltip() {
        const tooltip = d3.select(`#${this.tooltipId}`);
        tooltip.style('display', 'none');
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

    setBook(book) {
        this.currentBook = book;
        this.render();
    }
}
